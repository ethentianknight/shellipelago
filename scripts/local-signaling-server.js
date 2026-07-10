const http = require("http");

const rooms = new Map();
const lobbies = new Map();
const roomTtlMs = 10 * 60 * 1000;
const lobbyTtlMs = 3 * 60 * 1000;
const maxMessagesPerRoom = 120;

function json(res, status, body) {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function normalizeRoom(room) {
  return String(room || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 80);
}

function getRoom(room) {
  const key = normalizeRoom(room);
  const entry = rooms.get(key);

  if (!entry || entry.expiresAt < Date.now()) {
    rooms.delete(key);
    return [];
  }

  return entry.messages;
}

function appendMessage(room, message) {
  const key = normalizeRoom(room);
  const messages = getRoom(key);

  messages.push(message);
  rooms.set(key, {
    expiresAt: Date.now() + roomTtlMs,
    messages: messages
      .sort((left, right) => Number(left.createdAt || 0) - Number(right.createdAt || 0))
      .slice(-maxMessagesPerRoom)
  });
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

function listLobbies() {
  const now = Date.now();
  const result = [];

  for (const [key, entry] of lobbies.entries()) {
    if (!entry || entry.expiresAt < now) {
      lobbies.delete(key);
      continue;
    }
    result.push(entry.lobby);
  }

  return result.sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");

  try {
    if (req.method === "OPTIONS") {
      return json(res, 200, { ok: true });
    }

    if ((url.pathname === "/" || url.pathname === "/health") && req.method === "GET") {
      return json(res, 200, { ok: true, name: "shellipelago-local-signaling" });
    }

    if (url.pathname === "/lobbies/open" && req.method === "GET") {
      return json(res, 200, { ok: true, lobbies: listLobbies() });
    }

    const lobbyMatch = url.pathname.match(/^\/room\/([^/]+)\/lobby$/);
    if (lobbyMatch) {
      const room = normalizeRoom(lobbyMatch[1]);

      if (req.method === "POST") {
        const lobby = await readBody(req);
        lobbies.set(room, {
          expiresAt: Date.now() + lobbyTtlMs,
          lobby: {
            room,
            host: String(lobby.host || "").slice(0, 120),
            name: String(lobby.name || "Open lobby").slice(0, 80),
            createdAt: Number(lobby.createdAt || Date.now()),
            updatedAt: Date.now()
          }
        });
        return json(res, 200, { ok: true, public: true });
      }

      if (req.method === "DELETE") {
        lobbies.delete(room);
        return json(res, 200, { ok: true });
      }

      return json(res, 405, { ok: false, error: "Method not allowed" });
    }

    const messageMatch = url.pathname.match(/^\/room\/([^/]+)\/messages$/);
    if (!messageMatch) {
      return json(res, 404, { ok: false, error: "Not found" });
    }

    const room = normalizeRoom(messageMatch[1]);

    if (req.method === "GET") {
      const peer = url.searchParams.get("peer") || "";
      const role = String(url.searchParams.get("role") || "").slice(0, 20);
      const messages = getRoom(room).filter(message => (
        message.from !== peer &&
        (!message.to || message.to === peer) &&
        shouldDeliverToRole(message, role)
      ));
      return json(res, 200, { ok: true, messages });
    }

    if (req.method === "POST") {
      const message = await readBody(req);
      appendMessage(room, {
        id: String(message.id || crypto.randomUUID()),
        from: String(message.from || "").slice(0, 120),
        to: String(message.to || "").slice(0, 120),
        role: String(message.role || "").slice(0, 20),
        name: String(message.name || "").slice(0, 80),
        type: String(message.type || "").slice(0, 40),
        signalSessionId: String(message.signalSessionId || "").slice(0, 120),
        payload: message.payload || null,
        createdAt: Date.now()
      });
      return json(res, 200, { ok: true });
    }

    return json(res, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: error && error.message ? error.message : String(error)
    });
  }
});

const port = Number(process.env.PORT || 8787);
server.listen(port, "127.0.0.1", () => {
  console.log("Shellipelago local signaling listening on http://127.0.0.1:" + port);
});
