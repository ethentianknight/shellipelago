const memoryRooms = new Map();
const memoryLobbies = new Map();
const roomTtlSeconds = 600;
const lobbyTtlSeconds = 180;
const maxMessagesPerRoom = 120;
const maxListedLobbies = 20;
const staleLobbyMs = lobbyTtlSeconds * 1000;
const mailboxBucketMs = 10000;
const mailboxFutureBucketCount = 6;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        try {
            if (request.method === "OPTIONS") {
                return new Response(null, { headers: corsHeaders });
            }

            const store = createRoomStore(env);

            if ((url.pathname === "/" || url.pathname === "/health") && request.method === "GET") {
                return json({ ok: true, name: "shellipelago-net-signaling" }, 200, corsHeaders);
            }

            if (url.pathname === "/lobbies/open" && request.method === "GET") {
                const lobbies = await store.listPublicLobbies(maxListedLobbies);
                return json({ ok: true, lobbies }, 200, corsHeaders);
            }

            const lobbyMatch = url.pathname.match(/^\/room\/([^/]+)\/lobby$/);
            if (lobbyMatch) {
                const room = normalizeRoom(lobbyMatch[1]);

                if (request.method === "POST") {
                    const lobby = await request.json();

                    await store.writeLobby(room, {
                        room,
                        host: String(lobby.host || "").slice(0, 120),
                        name: String(lobby.name || "Open lobby").slice(0, 80),
                        createdAt: Number(lobby.createdAt || Date.now()),
                        updatedAt: Date.now()
                    });
                    return json({ ok: true, public: true }, 200, corsHeaders);
                }

                if (request.method === "DELETE") {
                    await store.deleteLobby(room);
                    return json({ ok: true }, 200, corsHeaders);
                }

                return json({ ok: false, error: "Method not allowed" }, 405, corsHeaders);
            }

            const match = url.pathname.match(/^\/room\/([^/]+)\/messages$/);
            if (!match) {
                return json({ ok: false, error: "Not found" }, 404, corsHeaders);
            }

            const room = normalizeRoom(match[1]);

            if (request.method === "GET") {
                const peer = url.searchParams.get("peer") || "";
                const role = String(url.searchParams.get("role") || "").slice(0, 20);
                const messages = (await store.read(room, peer)).filter((message) => (
                    message.from !== peer
                    && (!message.to || message.to === peer)
                    && shouldDeliverToRole(message, role)
                ));
                return json({ ok: true, messages }, 200, corsHeaders);
            }

            if (request.method === "POST") {
                const message = await request.json();
                const cleanMessage = {
                    id: String(message.id || crypto.randomUUID()),
                    from: String(message.from || "").slice(0, 120),
                    to: String(message.to || "").slice(0, 120),
                    role: String(message.role || "").slice(0, 20),
                    name: String(message.name || "").slice(0, 80),
                    type: String(message.type || "").slice(0, 40),
                    signalSessionId: String(message.signalSessionId || "").slice(0, 120),
                    payload: message.payload || null,
                    createdAt: Date.now()
                };

                await store.appendMessage(room, cleanMessage);
                return json({ ok: true }, 200, corsHeaders);
            }

            return json({ ok: false, error: "Method not allowed" }, 405, corsHeaders);
        } catch (error) {
            return json({
                ok: false,
                error: error && error.message ? error.message : String(error),
                stack: error && error.stack ? String(error.stack).slice(0, 2000) : ""
            }, 500, corsHeaders);
        }
    }
};

function createRoomStore(env) {
    const kv = env && (env.NET_SIGNALING_KV || env.SHELLIPELAGO_NET_SIGNALING_KV);

    if (kv) {
        return {
            async read(room, peer) {
                const messages = [];
                const seenIds = new Set();
                const legacyMessages = JSON.parse(await kv.get(roomKey(room)) || "[]");
                const broadcastMessages = await readMailboxMessages(kv, room, "");
                const peerMessages = peer ? await readMailboxMessages(kv, room, peer) : [];

                addMessages(messages, seenIds, legacyMessages);
                addMessages(messages, seenIds, broadcastMessages);
                addMessages(messages, seenIds, peerMessages);

                if (messages.length) {
                    return sortMessages(messages).slice(-maxMessagesPerRoom);
                }

                return [];
            },
            async write(room, messages) {
                await kv.put(roomKey(room), JSON.stringify(messages), {
                    expirationTtl: roomTtlSeconds
                });
            },
            async appendMessage(room, message) {
                await appendMailboxMessage(kv, room, message.to || "", message);
            },
            async writeLobby(room, lobby) {
                await Promise.all([
                    kv.put(lobbyKey(room), JSON.stringify(lobby), {
                        expirationTtl: lobbyTtlSeconds
                    }),
                    writeLobbyIndexEntry(kv, room, lobby)
                ]);
            },
            async deleteLobby(room) {
                await Promise.all([
                    kv.delete(lobbyKey(room)),
                    deleteLobbyIndexEntry(kv, room)
                ]);
            },
            async listPublicLobbies(limit) {
                const index = JSON.parse(await kv.get(lobbyIndexKey()) || "{}");
                const lobbies = [];

                for (const room of Object.keys(index)) {
                    const lobby = index[room];

                    if (room && lobby && isFreshLobby(lobby)) {
                        lobbies.push(lobby);
                    }
                }

                return lobbies.sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0)).slice(0, limit);
            }
        };
    }

    return {
        async read(room) {
            const key = roomKey(room);
            const entry = memoryRooms.get(key);
            if (!entry || entry.expiresAt < Date.now()) {
                memoryRooms.delete(key);
                return [];
            }

            return entry.messages;
        },
        async write(room, messages) {
            memoryRooms.set(roomKey(room), {
                expiresAt: Date.now() + roomTtlSeconds * 1000,
                messages
            });
        },
        async appendMessage(room, message) {
            const key = roomKey(room);
            const entry = memoryRooms.get(key);
            const messages = entry && entry.expiresAt >= Date.now() ? entry.messages : [];

            messages.push(message);
            memoryRooms.set(key, {
                expiresAt: Date.now() + roomTtlSeconds * 1000,
                messages: sortMessages(messages).slice(-maxMessagesPerRoom)
            });
        },
        async writeLobby(room, lobby) {
            memoryLobbies.set(lobbyKey(room), {
                expiresAt: Date.now() + lobbyTtlSeconds * 1000,
                lobby
            });
        },
        async deleteLobby(room) {
            memoryLobbies.delete(lobbyKey(room));
        },
        async listPublicLobbies(limit) {
            const lobbies = [];

            for (const [key, entry] of memoryLobbies.entries()) {
                if (!key.startsWith("lobby:") || !entry || entry.expiresAt < Date.now()) {
                    memoryLobbies.delete(key);
                    continue;
                }

                if (isFreshLobby(entry.lobby)) {
                    lobbies.push(entry.lobby);
                }
            }

            return lobbies
                .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0))
                .slice(0, limit);
        }
    };
}

async function readMailboxMessages(kv, room, peer) {
    const messages = [];
    const seenIds = new Set();
    const keys = [
        mailboxKey(room, peer),
        mailboxKey(room, peer, currentMailboxBucket())
    ];

    for (const key of keys) {
        addMessages(messages, seenIds, JSON.parse(await kv.get(key) || "[]"));
    }

    return sortMessages(messages).slice(-maxMessagesPerRoom);
}

async function appendMailboxMessage(kv, room, peer, message) {
    const writes = [];
    const startBucket = currentMailboxBucket();

    for (let offset = 0; offset <= mailboxFutureBucketCount; offset += 1) {
        writes.push(appendMailboxMessageToKey(kv, mailboxKey(room, peer, startBucket + offset), message));
    }

    await Promise.all(writes);
}

async function appendMailboxMessageToKey(kv, key, message) {
    const messages = JSON.parse(await kv.get(key) || "[]");
    const cleanMessages = Array.isArray(messages) ? messages : [];

    cleanMessages.push(message);
    await kv.put(key, JSON.stringify(sortMessages(cleanMessages).slice(-maxMessagesPerRoom)), {
        expirationTtl: roomTtlSeconds
    });
}

async function writeLobbyIndexEntry(kv, room, lobby) {
    const index = JSON.parse(await kv.get(lobbyIndexKey()) || "{}");
    const cleanIndex = pruneLobbyIndex(index);

    cleanIndex[room] = lobby;
    await kv.put(lobbyIndexKey(), JSON.stringify(cleanIndex), {
        expirationTtl: lobbyTtlSeconds
    });
}

async function deleteLobbyIndexEntry(kv, room) {
    const index = JSON.parse(await kv.get(lobbyIndexKey()) || "{}");
    const cleanIndex = pruneLobbyIndex(index);

    delete cleanIndex[room];
    await kv.put(lobbyIndexKey(), JSON.stringify(cleanIndex), {
        expirationTtl: lobbyTtlSeconds
    });
}

function pruneLobbyIndex(index) {
    const cleanIndex = {};

    Object.keys(index || {}).forEach((room) => {
        const lobby = index[room];

        if (room && lobby && isFreshLobby(lobby)) {
            cleanIndex[room] = lobby;
        }
    });

    return cleanIndex;
}

function addMessages(messages, seenIds, incomingMessages) {
    for (const message of Array.isArray(incomingMessages) ? incomingMessages : []) {
        if (message && message.id && !seenIds.has(message.id)) {
            seenIds.add(message.id);
            messages.push(message);
        }
    }
}

function shouldDeliverToRole(message, role) {
    if (!role) {
        return true;
    }

    if (role === "guest") {
        return message.type === "offer" || message.type === "candidate" || message.type === "reject";
    }

    if (role === "host") {
        return message.type === "join" || message.type === "rejoin" || message.type === "answer" || message.type === "candidate";
    }

    return true;
}

function normalizeRoom(room) {
    return String(room || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 80);
}

function roomKey(room) {
    return "room:" + room;
}

function mailboxKey(room, peer, bucket) {
    return roomKey(room) + ":mailbox:" + (peer || "broadcast") + (bucket === undefined ? "" : ":b:" + bucket);
}

function currentMailboxBucket() {
    return Math.floor(Date.now() / mailboxBucketMs);
}

function lobbyKey(room) {
    return "lobby:" + room;
}

function lobbyIndexKey() {
    return "lobbies:index";
}

function sortMessages(messages) {
    return messages.sort((left, right) => (
        Number(left.createdAt || 0) - Number(right.createdAt || 0)
        || String(left.id || "").localeCompare(String(right.id || ""))
    ));
}

function isFreshLobby(lobby) {
    return Date.now() - Number(lobby.updatedAt || 0) <= staleLobbyMs;
}

function json(body, status, headers) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            ...headers,
            "Content-Type": "application/json"
        }
    });
}
