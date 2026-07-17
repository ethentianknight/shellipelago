const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const legacyClientSource = fs.readFileSync(
  path.join(__dirname, "..", "1.1", "src", "archipelagoClient.js"),
  "utf8"
);

function createLegacyClient({ connected = true, tank = true, rooms = 5 } = {}) {
  const messages = [];
  const packets = [];
  const sandbox = {
    console,
    Date,
    Math,
    Object,
    Number,
    String,
    Array,
    Promise,
    Error,
    JSON,
    WebSocket: { OPEN: 1 },
    globalsState: {
      loadedModules: [],
      progressiveRoomMaxRing: 5,
      progression: {
        tankTreads: tank,
        tankChassis: tank,
        tankCannon: tank,
        progressiveRooms: rooms
      },
      archipelago: {
        connected,
        socket: connected ? {
          readyState: 1,
          send(value) {
            packets.push(JSON.parse(value)[0]);
          }
        } : null,
        slot: "Jammer",
        goalSent: false
      }
    },
    progressionManagerGetProgressiveValue(key) {
      return key === "progressiveRoom" ? rooms : 0;
    }
  };

  vm.createContext(sandbox);
  vm.runInContext(legacyClientSource, sandbox, { filename: "1.1/src/archipelagoClient.js" });
  sandbox.archipelagoClientQueueServerMessage = (message) => messages.push(message);

  return { sandbox, messages, packets };
}

test("legacy !no3d sends goal with full tank and rooms", () => {
  const { sandbox, messages, packets } = createLegacyClient();

  assert.equal(sandbox.archipelagoClientSendChatMessage("Jammer: !No3D"), true);
  assert.equal(sandbox.globalsState.archipelago.goalSent, true);
  assert.deepEqual(packets, [{ cmd: "StatusUpdate", status: 30 }]);
  assert.deepEqual(messages, ["Final run bypass accepted. Goal sent."]);
});

test("legacy !no3d reports missing requirements without sending chat", () => {
  const { sandbox, messages, packets } = createLegacyClient({ tank: false, rooms: 3 });

  assert.equal(sandbox.archipelagoClientSendChatMessage("!no3d"), true);
  assert.equal(sandbox.globalsState.archipelago.goalSent, false);
  assert.deepEqual(packets, []);
  assert.match(messages[0], /Tank Treads/);
  assert.match(messages[0], /Progressive Room 5/);
});

test("legacy !no3d reports when disconnected", () => {
  const { sandbox, messages, packets } = createLegacyClient({ connected: false });

  assert.equal(sandbox.archipelagoClientSendChatMessage("!no3d"), true);
  assert.deepEqual(packets, []);
  assert.deepEqual(messages, ["!no3d requires an Archipelago connection."]);
});
