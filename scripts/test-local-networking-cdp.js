const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const os = require("os");

const edgePath = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const appUrl = process.env.APP_URL || "http://127.0.0.1:4174/?netEndpoint=http%3A%2F%2F127.0.0.1%3A8787";

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function waitForJson(url, timeoutMs) {
  const startedAt = Date.now();
  let lastError = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      return await getJson(url);
    } catch (error) {
      lastError = error;
      await delay(250);
    }
  }

  throw lastError || new Error("Timed out waiting for " + url);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.ws = new WebSocket(wsUrl);
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", event => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) {
          reject(new Error(message.error.message || JSON.stringify(message.error)));
        } else {
          resolve(message.result || {});
        }
      } else {
        this.events.push(message);
      }
    });
  }

  send(method, params) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  async eval(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });

    if (result.exceptionDetails) {
      throw new Error(JSON.stringify(result.exceptionDetails));
    }

    return result.result ? result.result.value : undefined;
  }

  close() {
    this.ws.close();
  }
}

function launchEdge(port, profileName) {
  const profileDir = path.join(os.tmpdir(), "shellipelago-cdp-" + profileName + "-" + Date.now());
  return spawn(edgePath, [
    "--remote-debugging-port=" + port,
    "--user-data-dir=" + profileDir,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-features=Translate",
    appUrl
  ], {
    detached: false,
    stdio: "ignore"
  });
}

async function connect(port) {
  const pages = await waitForJson("http://127.0.0.1:" + port + "/json/list", 10000);
  const page = pages.find(entry => entry.type === "page") || pages[0];
  const client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send("Runtime.enable");
  await client.send("Page.enable");
  return client;
}

async function startOffline(client) {
  await client.eval(`
    new Promise(resolve => {
      const tick = () => {
        const button = Array.from(document.querySelectorAll("button")).find(candidate => candidate.textContent.trim() === "Play Offline");
        if (button) {
          button.click();
          resolve(true);
          return;
        }
        setTimeout(tick, 100);
      };
      tick();
    })
  `);
  await client.eval(`
    new Promise(resolve => {
      const tick = () => {
        if (document.querySelector("canvas") && typeof shellipelagoNetHandleCommand === "function") {
          resolve(true);
          return;
        }
        setTimeout(tick, 100);
      };
      tick();
    })
  `);
}

async function waitFor(client, expression, timeoutMs, label) {
  const startedAt = Date.now();
  let lastValue = null;

  while (Date.now() - startedAt < timeoutMs) {
    lastValue = await client.eval(expression);
    if (lastValue) {
      return lastValue;
    }
    await delay(250);
  }

  throw new Error("Timed out waiting for " + label + ". Last value: " + JSON.stringify(lastValue));
}

async function main() {
  const hostProcess = launchEdge(9222, "host");
  const joinProcess = launchEdge(9223, "join");
  let host = null;
  let join = null;

  try {
    host = await connect(9222);
    join = await connect(9223);
    await startOffline(host);
    await startOffline(join);

    await host.eval(`shellipelagoNetHandleCommand("!name hosta")`);
    await join.eval(`shellipelagoNetHandleCommand("!name joina")`);
    await host.eval(`shellipelagoNetHandleCommand("!host")`);

    const room = await waitFor(host, `shellipelagoNetState && shellipelagoNetState.roomCode`, 10000, "host room");
    await join.eval(`shellipelagoNetHandleCommand("!join ${room}")`);

    await waitFor(host, `shellipelagoNetIsDataOpen()`, 15000, "host connection");

    await waitFor(join, `shellipelagoNetIsDataOpen()`, 15000, "join connection");
    await join.eval(`shellipelagoNetSendPosition()`);
    await waitFor(host, `Object.keys(shellipelagoNetState.remotePlayers || {}).length > 0`, 5000, "host remote player");

    const hostSummary = await host.eval(`({
      roomCode: shellipelagoNetState.roomCode,
      dataOpen: shellipelagoNetIsDataOpen(),
      peers: Object.keys(shellipelagoNetState.hostConnections || {}),
      openPeers: Object.keys(shellipelagoNetState.hostConnections || {}).filter(id => shellipelagoNetState.hostConnections[id].channel && shellipelagoNetState.hostConnections[id].channel.readyState === "open"),
      remotePlayers: Object.keys(shellipelagoNetState.remotePlayers || {})
    })`);
    const joinSummary = await join.eval(`({
      roomCode: shellipelagoNetState.roomCode,
      dataOpen: shellipelagoNetIsDataOpen(),
      guestPeerId: shellipelagoNetState.guestPeerId,
      remotePlayers: Object.keys(shellipelagoNetState.remotePlayers || {})
    })`);

    console.log(JSON.stringify({ ok: true, room, hostSummary, joinSummary }, null, 2));
  } finally {
    if (host) host.close();
    if (join) join.close();
    hostProcess.kill();
    joinProcess.kill();
  }
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
