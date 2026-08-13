const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const mobileSource = fs.readFileSync(path.join(__dirname, "..", "src", "mobileControls.js"), "utf8");
const roomSource = fs.readFileSync(path.join(__dirname, "..", "src", "initialRoom.js"), "utf8");
const cssSource = fs.readFileSync(path.join(__dirname, "..", "src", "main.css"), "utf8");
const introSource = fs.readFileSync(path.join(__dirname, "..", "src", "introScreen.js"), "utf8");
const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("portrait mobile mode uses a 16:9 gameplay viewport", () => {
  assert.match(mobileSource, /window\.innerHeight > window\.innerWidth/);
  assert.match(mobileSource, /mobileControlsGetGameWidth\(\) \* 9 \/ 16/);
});

test("mobile home screen is locked to the visible viewport", () => {
  assert.match(introSource, /classList\.toggle\("is-home-screen"/);
  assert.match(cssSource, /body\.is-home-screen\s*\{[^}]*height:\s*100dvh;[^}]*overflow:\s*hidden/s);
  assert.match(indexSource, /viewport-fit=cover/);
  assert.match(indexSource, /interactive-widget=resizes-content/);
});

test("mobile gameplay height can be dragged within safe bounds", () => {
  assert.match(mobileSource, /mobile-game-resize-handle/);
  assert.match(mobileSource, /mobileControlsClampGameHeight/);
  assert.match(mobileSource, /mobileControlsEvent\.clientY/);
  assert.match(mobileSource, /initialRoomResizeCanvas\(\)/);
});

test("mobile controls expose movement and gameplay keys", () => {
  ["KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyQ", "KeyG", "Space", "KeyF", "KeyC", "KeyX", "Backspace", "KeyM", "KeyN", "KeyL", "KeyZ"].forEach((code) => {
    assert.match(mobileSource, new RegExp(`"${code}"`));
  });
  assert.match(mobileSource, /mobileControlsRepeatTimers/);
  assert.match(mobileSource, /mobileControlsUpdateDpad/);
  assert.match(mobileSource, /Math\.abs\(mobileControlsX\) > Math\.abs\(mobileControlsY\)/);
  assert.match(mobileSource, /\["contextmenu", "selectstart", "dragstart"\]/);
  assert.match(cssSource, /-webkit-touch-callout:\s*none/);
});

test("mobile controls reflect unlocks and available rounds", () => {
  ["fire", "gun", "bomb", "sword", "steelToe", "verminPouch", "magnifyingGlass", "teleportation"].forEach((unlock) => {
    assert.match(mobileSource, new RegExp(`"${unlock}"`));
  });
  assert.match(mobileSource, /initialRoomPlayer\.rounds >= mobileControlsRoundCost/);
  assert.match(cssSource, /\.mobile-control-button\.is-locked\s*\{[^}]*visibility:\s*hidden/s);
  assert.match(cssSource, /\.mobile-control-button:disabled:not\(\.is-locked\)/);
});

test("mobile audio adapts to unlocked music and sfx", () => {
  assert.match(mobileSource, /initialRoomHasBgmUnlock\(\)/);
  assert.match(mobileSource, /initialRoomHasSfxUnlock\(\)/);
  assert.match(mobileSource, /mobileControlsUpdateAudioButton/);
});

test("mobile final run fires once per touch without autofire", () => {
  assert.match(roomSource, /initialRoomFinalRunAutofireEnabled = false/);
  assert.match(mobileSource, /initialRoomSetFinalRunAutofireEnabled\(false\)/);
  assert.match(roomSource, /function initialRoomHandleMobileFinalRunPointer/);
  assert.match(roomSource, /initialRoomSetFinalRunAutofireEnabled\(false\)/);
  assert.match(roomSource, /initialRoomStartFinalRunAutofire\(\)/);
});

test("sprint toggle can be inverted by holding Shift", () => {
  assert.match(roomSource, /Boolean\(initialRoomCapsLockActive\) !== Boolean\(initialRoomShiftSprintHeld\)/);
  assert.match(roomSource, /function initialRoomToggleSprint/);
});
