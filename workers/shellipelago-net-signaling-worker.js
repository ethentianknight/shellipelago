const memoryRooms = new Map();
const memoryLobbies = new Map();
const roomTtlSeconds = 600;
const lobbyTtlSeconds = 180;
const maxMessagesPerRoom = 120;
const maxListedLobbies = 20;
const staleLobbyMs = lobbyTtlSeconds * 1000;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

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
            const messages = (await store.read(room)).filter((message) => (
                message.from !== peer
                && (!message.to || message.to === peer)
            ));
            return json({ ok: true, messages }, 200, corsHeaders);
        }

        if (request.method === "POST") {
            const message = await request.json();
            const messages = await store.read(room);
            const cleanMessage = {
                id: String(message.id || crypto.randomUUID()),
                from: String(message.from || "").slice(0, 120),
                to: String(message.to || "").slice(0, 120),
                role: String(message.role || "").slice(0, 20),
                name: String(message.name || "").slice(0, 80),
                type: String(message.type || "").slice(0, 40),
                payload: message.payload || null,
                createdAt: Date.now()
            };

            messages.push(cleanMessage);
            await store.write(room, messages.slice(-maxMessagesPerRoom));
            return json({ ok: true }, 200, corsHeaders);
        }

        return json({ ok: false, error: "Method not allowed" }, 405, corsHeaders);
    }
};

function createRoomStore(env) {
    const kv = env && (env.NET_SIGNALING_KV || env.SHELLIPELAGO_NET_SIGNALING_KV);

    if (kv) {
        return {
            async read(room) {
                return JSON.parse(await kv.get(roomKey(room)) || "[]");
            },
            async write(room, messages) {
                await kv.put(roomKey(room), JSON.stringify(messages), {
                    expirationTtl: roomTtlSeconds
                });
            },
            async writeLobby(room, lobby) {
                await kv.put(lobbyKey(room), JSON.stringify(lobby), {
                    expirationTtl: lobbyTtlSeconds
                });
            },
            async deleteLobby(room) {
                await kv.delete(lobbyKey(room));
            },
            async listPublicLobbies(limit) {
                const listed = await kv.list({
                    prefix: "lobby:",
                    limit
                });
                const lobbies = [];

                for (const key of listed.keys) {
                    const room = key.name.slice("lobby:".length);
                    const lobby = JSON.parse(await kv.get(key.name) || "null");

                    if (room && lobby && isFreshLobby(lobby)) {
                        lobbies.push(lobby);
                    }
                }

                return lobbies.sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0));
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

function normalizeRoom(room) {
    return String(room || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 80);
}

function roomKey(room) {
    return "room:" + room;
}

function lobbyKey(room) {
    return "lobby:" + room;
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
