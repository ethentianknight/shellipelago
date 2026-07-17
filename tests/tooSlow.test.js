const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "src", "initialRoom.js"), "utf8");

function getFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  let depth = 0;
  let opened = false;

  assert.notEqual(start, -1, `${name} should exist`);
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
      opened = true;
    } else if (source[index] === "}") {
      depth -= 1;
      if (opened && depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }
  throw new Error(`Could not extract ${name}`);
}

function createSpeedSandbox() {
  const messages = [];
  const sandbox = {
    Date,
    Math,
    Number,
    initialRoomGameSpeedFactor: 1,
    initialRoomGameSpeedCheatEnabled: false,
    initialRoomGameTime: Date.now(),
    initialRoomQueueMessage(message) {
      messages.push(message);
    }
  };

  vm.createContext(sandbox);
  vm.runInContext([
    getFunction("initialRoomSetGameSpeedFactor"),
    getFunction("initialRoomToggleGameSpeedCheat"),
    getFunction("initialRoomHandleGameSpeedKey")
  ].join("\n"), sandbox);
  return { sandbox, messages };
}

test("!tooslow speed keys map 1-9 and 0 to 10x", () => {
  const { sandbox, messages } = createSpeedSandbox();
  const event = {
    key: "0",
    repeat: false,
    prevented: false,
    preventDefault() {
      this.prevented = true;
    }
  };

  assert.equal(sandbox.initialRoomToggleGameSpeedCheat(), true);
  assert.equal(sandbox.initialRoomHandleGameSpeedKey(event), true);
  assert.equal(sandbox.initialRoomGameSpeedFactor, 10);
  assert.equal(event.prevented, true);
  assert.deepEqual(messages, ["Game speed: 10x"]);

  event.key = "3";
  assert.equal(sandbox.initialRoomHandleGameSpeedKey(event), true);
  assert.equal(sandbox.initialRoomGameSpeedFactor, 3);
});

test("disabling !tooslow restores truthful 1x speed", () => {
  const { sandbox } = createSpeedSandbox();

  sandbox.initialRoomToggleGameSpeedCheat();
  sandbox.initialRoomSetGameSpeedFactor(8);
  assert.equal(sandbox.initialRoomToggleGameSpeedCheat(), false);
  assert.equal(sandbox.initialRoomGameSpeedFactor, 1);
});
