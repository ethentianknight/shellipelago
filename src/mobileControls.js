var mobileControlsEnabled = false;
var mobileControlsGameActive = false;
var mobileControlsRoot = null;
var mobileControlsHeldPointers = {};
var mobileControlsRepeatTimers = {};
var mobileControlsGamePointerId = null;
var mobileControlsDpadPointerId = null;
var mobileControlsDpadKey = "";
var mobileControlsGameHeight = null;
var mobileControlsResizeFrame = null;
var mobileControlsAvailabilityInterval = null;

function mobileControlsShouldOffer() { return window.innerHeight > window.innerWidth; }
function mobileControlsGetGameWidth() { return Math.max(1, window.innerWidth); }
function mobileControlsGetDefaultGameHeight() {
  return Math.max(1, Math.min(window.innerHeight, Math.round(mobileControlsGetGameWidth() * 9 / 16)));
}
function mobileControlsClampGameHeight(mobileControlsHeight) {
  var mobileControlsMinimumHeight = Math.min(mobileControlsGetDefaultGameHeight(), Math.max(100, Math.round(window.innerHeight * 0.18)));
  var mobileControlsMaximumHeight = Math.max(mobileControlsMinimumHeight, window.innerHeight - Math.max(260, Math.round(window.innerHeight * 0.32)));
  return Math.max(mobileControlsMinimumHeight, Math.min(mobileControlsMaximumHeight, Math.round(mobileControlsHeight)));
}
function mobileControlsGetGameHeight() {
  return mobileControlsEnabled && mobileControlsGameActive ?
    mobileControlsClampGameHeight(mobileControlsGameHeight === null ? mobileControlsGetDefaultGameHeight() : mobileControlsGameHeight) : Math.max(1, window.innerHeight);
}
function mobileControlsIsEnabled() { return mobileControlsEnabled; }

function mobileControlsApplyGameHeight(mobileControlsHeight, mobileControlsResizeGame) {
  mobileControlsGameHeight = mobileControlsClampGameHeight(mobileControlsHeight);
  document.documentElement.style.setProperty("--mobile-game-height", mobileControlsGameHeight + "px");
  if (!mobileControlsResizeGame || typeof initialRoomResizeCanvas !== "function") return;
  if (mobileControlsResizeFrame !== null) window.cancelAnimationFrame(mobileControlsResizeFrame);
  mobileControlsResizeFrame = window.requestAnimationFrame(function () {
    mobileControlsResizeFrame = null;
    initialRoomResizeCanvas();
  });
}

function mobileControlsSetGameActive(mobileControlsActive) {
  mobileControlsGameActive = Boolean(mobileControlsActive);
  document.body.classList.toggle("mobile-game-active", mobileControlsEnabled && mobileControlsGameActive);
  if (mobileControlsRoot) mobileControlsRoot.hidden = !mobileControlsGameActive;
  mobileControlsUpdateAvailability();
}

function mobileControlsDispatchKey(mobileControlsType, mobileControlsKey, mobileControlsCode, mobileControlsRepeat) {
  window.dispatchEvent(new KeyboardEvent(mobileControlsType, {
    bubbles: true, cancelable: true, code: mobileControlsCode || "", key: mobileControlsKey, repeat: Boolean(mobileControlsRepeat)
  }));
}

function mobileControlsPressButton(mobileControlsButton, mobileControlsPointerId) {
  var mobileControlsKey = mobileControlsButton.dataset.key;
  var mobileControlsCode = mobileControlsButton.dataset.code || "";
  if (!mobileControlsKey || mobileControlsHeldPointers[mobileControlsPointerId]) return;
  mobileControlsHeldPointers[mobileControlsPointerId] = mobileControlsButton;
  mobileControlsButton.classList.add("is-held");
  mobileControlsDispatchKey("keydown", mobileControlsKey, mobileControlsCode, false);
  mobileControlsRepeatTimers[mobileControlsPointerId] = window.setTimeout(function () {
    mobileControlsRepeatTimers[mobileControlsPointerId] = window.setInterval(function () {
      mobileControlsDispatchKey("keydown", mobileControlsKey, mobileControlsCode, true);
    }, 90);
  }, 320);
}

function mobileControlsReleasePointer(mobileControlsPointerId) {
  var mobileControlsButton = mobileControlsHeldPointers[mobileControlsPointerId];
  if (!mobileControlsButton) return;
  if (mobileControlsRepeatTimers[mobileControlsPointerId]) {
    window.clearTimeout(mobileControlsRepeatTimers[mobileControlsPointerId]);
    window.clearInterval(mobileControlsRepeatTimers[mobileControlsPointerId]);
  }
  mobileControlsDispatchKey("keyup", mobileControlsButton.dataset.key, mobileControlsButton.dataset.code || "", false);
  mobileControlsButton.classList.remove("is-held");
  delete mobileControlsHeldPointers[mobileControlsPointerId];
  delete mobileControlsRepeatTimers[mobileControlsPointerId];
}

function mobileControlsCreateButton(mobileControlsLabel, mobileControlsKey, mobileControlsCode, mobileControlsClassName) {
  var mobileControlsButton = document.createElement("button");
  mobileControlsButton.type = "button";
  mobileControlsButton.className = "mobile-control-button " + (mobileControlsClassName || "");
  mobileControlsButton.dataset.key = mobileControlsKey;
  mobileControlsButton.dataset.code = mobileControlsCode || "";
  mobileControlsButton.textContent = mobileControlsLabel;
  mobileControlsButton.addEventListener("pointerdown", function (mobileControlsEvent) {
    mobileControlsEvent.preventDefault();
    mobileControlsButton.setPointerCapture(mobileControlsEvent.pointerId);
    mobileControlsPressButton(mobileControlsButton, mobileControlsEvent.pointerId);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (mobileControlsEventName) {
    mobileControlsButton.addEventListener(mobileControlsEventName, function (mobileControlsEvent) {
      mobileControlsEvent.preventDefault();
      mobileControlsReleasePointer(mobileControlsEvent.pointerId);
    });
  });
  return mobileControlsButton;
}

function mobileControlsOpenTextEntry() {
  var mobileControlsText = "";
  mobileControlsDispatchKey("keydown", "Enter", "Enter", false);
  mobileControlsDispatchKey("keyup", "Enter", "Enter", false);
  mobileControlsText = window.prompt("Enter message");
  if (mobileControlsText === null) {
    mobileControlsDispatchKey("keydown", "Escape", "Escape", false);
    mobileControlsDispatchKey("keyup", "Escape", "Escape", false);
    return;
  }
  Array.from(mobileControlsText).forEach(function (mobileControlsCharacter) {
    mobileControlsDispatchKey("keydown", mobileControlsCharacter, "", false);
    mobileControlsDispatchKey("keyup", mobileControlsCharacter, "", false);
  });
  mobileControlsDispatchKey("keydown", "Enter", "Enter", false);
  mobileControlsDispatchKey("keyup", "Enter", "Enter", false);
}

function mobileControlsSetDpadKey(mobileControlsNextKey) {
  var mobileControlsCodes = { w: "KeyW", a: "KeyA", s: "KeyS", d: "KeyD" };
  if (mobileControlsNextKey === mobileControlsDpadKey) return;
  if (mobileControlsDpadKey) mobileControlsDispatchKey("keyup", mobileControlsDpadKey, mobileControlsCodes[mobileControlsDpadKey], false);
  mobileControlsDpadKey = mobileControlsNextKey;
  if (mobileControlsDpadKey) mobileControlsDispatchKey("keydown", mobileControlsDpadKey, mobileControlsCodes[mobileControlsDpadKey], false);
}

function mobileControlsUpdateDpad(mobileControlsDpad, mobileControlsEvent) {
  var mobileControlsRect = mobileControlsDpad.getBoundingClientRect();
  var mobileControlsX = mobileControlsEvent.clientX - mobileControlsRect.left - (mobileControlsRect.width / 2);
  var mobileControlsY = mobileControlsEvent.clientY - mobileControlsRect.top - (mobileControlsRect.height / 2);
  var mobileControlsDistance = Math.sqrt((mobileControlsX * mobileControlsX) + (mobileControlsY * mobileControlsY));
  var mobileControlsNextKey = "";
  if (mobileControlsDistance > Math.min(mobileControlsRect.width, mobileControlsRect.height) * 0.13) {
    mobileControlsNextKey = Math.abs(mobileControlsX) > Math.abs(mobileControlsY) ?
      (mobileControlsX < 0 ? "a" : "d") : (mobileControlsY < 0 ? "w" : "s");
  }
  mobileControlsSetDpadKey(mobileControlsNextKey);
  mobileControlsDpad.querySelectorAll("[data-direction]").forEach(function (mobileControlsButton) {
    mobileControlsButton.classList.toggle("is-held", mobileControlsButton.dataset.direction === mobileControlsNextKey);
  });
}

function mobileControlsWireDpad(mobileControlsDpad) {
  ["contextmenu", "selectstart", "dragstart"].forEach(function (mobileControlsEventName) {
    mobileControlsDpad.addEventListener(mobileControlsEventName, function (mobileControlsEvent) { mobileControlsEvent.preventDefault(); });
  });
  mobileControlsDpad.addEventListener("pointerdown", function (mobileControlsEvent) {
    mobileControlsEvent.preventDefault();
    mobileControlsDpadPointerId = mobileControlsEvent.pointerId;
    mobileControlsDpad.setPointerCapture(mobileControlsEvent.pointerId);
    mobileControlsUpdateDpad(mobileControlsDpad, mobileControlsEvent);
  });
  mobileControlsDpad.addEventListener("pointermove", function (mobileControlsEvent) {
    if (mobileControlsEvent.pointerId === mobileControlsDpadPointerId) mobileControlsUpdateDpad(mobileControlsDpad, mobileControlsEvent);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (mobileControlsEventName) {
    mobileControlsDpad.addEventListener(mobileControlsEventName, function (mobileControlsEvent) {
      if (mobileControlsEvent.pointerId !== mobileControlsDpadPointerId) return;
      mobileControlsSetDpadKey("");
      mobileControlsDpadPointerId = null;
      mobileControlsDpad.querySelectorAll("[data-direction]").forEach(function (mobileControlsButton) { mobileControlsButton.classList.remove("is-held"); });
    });
  });
}

function mobileControlsCreateDpadVisual(mobileControlsLabel, mobileControlsDirection, mobileControlsClassName) {
  var mobileControlsButton = document.createElement("div");
  mobileControlsButton.className = "mobile-control-button mobile-dpad-button " + mobileControlsClassName;
  mobileControlsButton.draggable = false;
  mobileControlsButton.dataset.direction = mobileControlsDirection;
  mobileControlsButton.textContent = mobileControlsLabel;
  return mobileControlsButton;
}

function mobileControlsUpdateAudioButton(mobileControlsButton) {
  var mobileControlsHasMusic = typeof initialRoomHasBgmUnlock === "function" && initialRoomHasBgmUnlock();
  var mobileControlsHasSfx = typeof initialRoomHasSfxUnlock === "function" && initialRoomHasSfxUnlock();
  mobileControlsButton.classList.toggle("is-locked", !mobileControlsHasMusic && !mobileControlsHasSfx);
  mobileControlsButton.disabled = !mobileControlsHasMusic && !mobileControlsHasSfx;
  mobileControlsButton.setAttribute("aria-hidden", mobileControlsButton.disabled ? "true" : "false");
  if (mobileControlsHasMusic && mobileControlsHasSfx) {
    mobileControlsButton.innerHTML = (initialRoomIsBgmMuted ? "<s>MUSIC</s>" : "MUSIC") + "/" +
      (initialRoomIsSfxMuted ? "<s>SFX</s>" : "SFX");
  } else if (mobileControlsHasMusic) {
    mobileControlsButton.innerHTML = initialRoomIsBgmMuted ? "<s>MUSIC</s>" : "MUSIC";
  } else if (mobileControlsHasSfx) {
    mobileControlsButton.innerHTML = initialRoomIsSfxMuted ? "<s>SFX</s>" : "SFX";
  } else {
    mobileControlsButton.textContent = "MUSIC/SFX";
  }
}

function mobileControlsCycleAudio(mobileControlsButton) {
  var mobileControlsHasMusic = initialRoomHasBgmUnlock();
  var mobileControlsHasSfx = initialRoomHasSfxUnlock();
  var mobileControlsMusicMuted = initialRoomIsBgmMuted;
  var mobileControlsSfxMuted = initialRoomIsSfxMuted;
  if (mobileControlsHasMusic && !mobileControlsHasSfx) initialRoomToggleBgmMute();
  else if (!mobileControlsHasMusic && mobileControlsHasSfx) initialRoomToggleSfxMute();
  else if (!mobileControlsMusicMuted && !mobileControlsSfxMuted) initialRoomToggleBgmMute();
  else if (mobileControlsMusicMuted && !mobileControlsSfxMuted) { initialRoomToggleBgmMute(); initialRoomToggleSfxMute(); }
  else if (!mobileControlsMusicMuted && mobileControlsSfxMuted) initialRoomToggleBgmMute();
  else { initialRoomToggleBgmMute(); initialRoomToggleSfxMute(); }
  mobileControlsUpdateAudioButton(mobileControlsButton);
}

function mobileControlsHasUnlock(mobileControlsUnlock) {
  if (!mobileControlsUnlock) return true;
  if (mobileControlsUnlock === "gun" || mobileControlsUnlock === "bomb" || mobileControlsUnlock === "sword") {
    return progressionManagerGetProgressiveValue(mobileControlsUnlock) > 0;
  }
  return Boolean(globalsState.progression[mobileControlsUnlock]);
}

function mobileControlsGetRoundCost(mobileControlsButton) {
  if (mobileControlsButton.dataset.mobileRoundCost === "bomb") return Math.max(1, progressionManagerGetProgressiveValue("bomb"));
  return Number(mobileControlsButton.dataset.mobileRoundCost) || 0;
}

function mobileControlsUpdateAvailability() {
  if (!mobileControlsRoot || typeof progressionManagerGetProgressiveValue !== "function") return;
  mobileControlsRoot.querySelectorAll("[data-mobile-unlock]").forEach(function (mobileControlsButton) {
    var mobileControlsIsUnlocked = mobileControlsHasUnlock(mobileControlsButton.dataset.mobileUnlock);
    var mobileControlsRoundCost = mobileControlsGetRoundCost(mobileControlsButton);
    var mobileControlsHasRounds = !mobileControlsRoundCost || (typeof initialRoomPlayer !== "undefined" && initialRoomPlayer.rounds >= mobileControlsRoundCost);
    mobileControlsButton.classList.toggle("is-locked", !mobileControlsIsUnlocked);
    mobileControlsButton.disabled = !mobileControlsIsUnlocked || !mobileControlsHasRounds;
    mobileControlsButton.setAttribute("aria-hidden", mobileControlsIsUnlocked ? "false" : "true");
  });
  var mobileControlsAudioButton = mobileControlsRoot.querySelector(".mobile-audio-button");
  if (mobileControlsAudioButton) mobileControlsUpdateAudioButton(mobileControlsAudioButton);
}

function mobileControlsCreateLayout() {
  var mobileControlsMain = document.createElement("div");
  var mobileControlsMovement = document.createElement("div");
  var mobileControlsDpad = document.createElement("div");
  var mobileControlsActions = document.createElement("div");
  var mobileControlsUtilities = document.createElement("div");
  var mobileControlsSprintButton = document.createElement("button");
  var mobileControlsTextButton = document.createElement("button");
  var mobileControlsAudioButton = document.createElement("button");
  var mobileControlsResizeHandle = document.createElement("button");
  var mobileControlsActionDefinitions = [
    ["FIRE", "g", "KeyG", "mobile-action-fire", "fire", "1"],
    ["SHOOT", " ", "Space", "mobile-action-shoot", "gun", "1"], ["BOMB", "q", "KeyQ", "mobile-action-bomb", "bomb", "bomb"],
    ["SWORD", "f", "KeyF", "mobile-action-sword", "sword", ""], ["OPEN", "e", "KeyE", "mobile-action-open", "", ""],
    ["KICK", "c", "KeyC", "mobile-action-kick", "steelToe", ""], ["POUCH", "x", "KeyX", "mobile-action-pouch", "verminPouch", ""]
  ];

  mobileControlsRoot = document.createElement("section");
  mobileControlsRoot.className = "mobile-controls";
  mobileControlsRoot.hidden = true;
  mobileControlsResizeHandle.type = "button";
  mobileControlsResizeHandle.className = "mobile-game-resize-handle";
  mobileControlsResizeHandle.setAttribute("aria-label", "Resize game area");
  mobileControlsResizeHandle.addEventListener("pointerdown", function (mobileControlsEvent) {
    mobileControlsEvent.preventDefault();
    mobileControlsResizeHandle.setPointerCapture(mobileControlsEvent.pointerId);
    mobileControlsApplyGameHeight(mobileControlsEvent.clientY, true);
  });
  mobileControlsResizeHandle.addEventListener("pointermove", function (mobileControlsEvent) {
    if (!mobileControlsResizeHandle.hasPointerCapture(mobileControlsEvent.pointerId)) return;
    mobileControlsEvent.preventDefault();
    mobileControlsApplyGameHeight(mobileControlsEvent.clientY, true);
  });
  mobileControlsMain.className = "mobile-main-controls";
  mobileControlsMovement.className = "mobile-movement-controls";
  mobileControlsSprintButton.type = "button";
  mobileControlsSprintButton.className = "mobile-control-button mobile-sprint-button";
  mobileControlsSprintButton.textContent = "SPRINT";
  mobileControlsSprintButton.addEventListener("click", function () {
    if (typeof initialRoomToggleSprint === "function") mobileControlsSprintButton.classList.toggle("is-toggled", initialRoomToggleSprint());
  });
  mobileControlsDpad.className = "mobile-dpad";
  mobileControlsDpad.appendChild(mobileControlsCreateDpadVisual("▲", "w", "mobile-dpad-up"));
  mobileControlsDpad.appendChild(mobileControlsCreateDpadVisual("◀", "a", "mobile-dpad-left"));
  mobileControlsDpad.appendChild(mobileControlsCreateDpadVisual("▶", "d", "mobile-dpad-right"));
  mobileControlsDpad.appendChild(mobileControlsCreateDpadVisual("▼", "s", "mobile-dpad-down"));
  mobileControlsWireDpad(mobileControlsDpad);
  mobileControlsMovement.appendChild(mobileControlsDpad);
  mobileControlsActions.className = "mobile-action-grid";
  mobileControlsActionDefinitions.forEach(function (mobileControlsDefinition) {
    var mobileControlsActionButton = mobileControlsCreateButton(mobileControlsDefinition[0], mobileControlsDefinition[1], mobileControlsDefinition[2], "mobile-action-button " + mobileControlsDefinition[3]);
    mobileControlsActionButton.dataset.mobileUnlock = mobileControlsDefinition[4];
    mobileControlsActionButton.dataset.mobileRoundCost = mobileControlsDefinition[5];
    mobileControlsActions.appendChild(mobileControlsActionButton);
  });
  mobileControlsUtilities.className = "mobile-utility-row";
  [["MAP", "m", "KeyM", ""], ["STATUS", "n", "KeyN", ""], ["LOG", "l", "KeyL", ""], ["ZOOM", "z", "KeyZ", "magnifyingGlass"],
    ["MUTE LOG", "b", "KeyB", ""], ["WARP", "Backspace", "Backspace", "teleportation"]].forEach(function (mobileControlsDefinition) {
    var mobileControlsUtilityButton = mobileControlsCreateButton(mobileControlsDefinition[0], mobileControlsDefinition[1], mobileControlsDefinition[2], "mobile-utility-button mobile-utility-" + mobileControlsDefinition[0].toLowerCase().replace(" ", "-"));
    mobileControlsUtilityButton.dataset.mobileUnlock = mobileControlsDefinition[3];
    mobileControlsUtilities.appendChild(mobileControlsUtilityButton);
  });
  mobileControlsTextButton.type = "button";
  mobileControlsTextButton.className = "mobile-control-button mobile-text-button";
  mobileControlsTextButton.textContent = "CONSOLE";
  mobileControlsTextButton.addEventListener("click", mobileControlsOpenTextEntry);
  mobileControlsAudioButton.type = "button";
  mobileControlsAudioButton.className = "mobile-control-button mobile-audio-button";
  mobileControlsAudioButton.textContent = "MUSIC/SFX";
  mobileControlsAudioButton.addEventListener("click", function () { mobileControlsCycleAudio(mobileControlsAudioButton); });
  mobileControlsUtilities.insertBefore(mobileControlsTextButton, mobileControlsUtilities.children[1]);
  mobileControlsUtilities.insertBefore(mobileControlsAudioButton, mobileControlsUtilities.lastElementChild);
  mobileControlsMain.appendChild(mobileControlsMovement);
  mobileControlsMain.appendChild(mobileControlsActions);
  mobileControlsRoot.appendChild(mobileControlsResizeHandle);
  mobileControlsRoot.appendChild(mobileControlsSprintButton);
  mobileControlsRoot.appendChild(mobileControlsMain);
  mobileControlsRoot.appendChild(mobileControlsUtilities);
  document.body.appendChild(mobileControlsRoot);
  mobileControlsUpdateAvailability();
}

function mobileControlsDispatchMouse(mobileControlsType, mobileControlsEvent) {
  window.dispatchEvent(new MouseEvent(mobileControlsType, { bubbles: true, cancelable: true, button: 0,
    buttons: mobileControlsType === "mouseup" ? 0 : 1, clientX: mobileControlsEvent.clientX, clientY: mobileControlsEvent.clientY }));
}

function mobileControlsDispatchGamePointer(mobileControlsType, mobileControlsEvent) {
  if (typeof initialRoomHandleMobileFinalRunPointer === "function" &&
    initialRoomHandleMobileFinalRunPointer(mobileControlsType, mobileControlsEvent.clientX, mobileControlsEvent.clientY)) return;
  mobileControlsDispatchMouse(mobileControlsType === "down" ? "mousedown" : (mobileControlsType === "up" ? "mouseup" : "mousemove"), mobileControlsEvent);
}

function mobileControlsInstallGameTouch() {
  window.addEventListener("pointerdown", function (mobileControlsEvent) {
    if (!mobileControlsEnabled || !mobileControlsGameActive || mobileControlsEvent.pointerType === "mouse" ||
      mobileControlsEvent.clientY > mobileControlsGetGameHeight() ||
      (mobileControlsEvent.target && mobileControlsEvent.target.closest && mobileControlsEvent.target.closest(".mobile-controls, button, input, select, textarea, [contenteditable='true']"))) return;
    mobileControlsGamePointerId = mobileControlsEvent.pointerId;
    mobileControlsEvent.preventDefault();
    mobileControlsDispatchGamePointer("move", mobileControlsEvent);
    mobileControlsDispatchGamePointer("down", mobileControlsEvent);
  }, { passive: false });
  window.addEventListener("pointermove", function (mobileControlsEvent) {
    if (mobileControlsEvent.pointerId !== mobileControlsGamePointerId) return;
    mobileControlsEvent.preventDefault();
    mobileControlsDispatchGamePointer("move", mobileControlsEvent);
  }, { passive: false });
  ["pointerup", "pointercancel"].forEach(function (mobileControlsEventName) {
    window.addEventListener(mobileControlsEventName, function (mobileControlsEvent) {
      if (mobileControlsEvent.pointerId !== mobileControlsGamePointerId) return;
      mobileControlsEvent.preventDefault();
      mobileControlsDispatchGamePointer("up", mobileControlsEvent);
      mobileControlsGamePointerId = null;
    }, { passive: false });
  });
}

function mobileControlsEnable() {
  mobileControlsEnabled = true;
  document.body.classList.add("mobile-controls-enabled");
  mobileControlsApplyGameHeight(mobileControlsGetDefaultGameHeight(), false);
  mobileControlsCreateLayout();
  mobileControlsInstallGameTouch();
  if (typeof initialRoomSetFinalRunAutofireEnabled === "function") initialRoomSetFinalRunAutofireEnabled(false);
  mobileControlsAvailabilityInterval = window.setInterval(mobileControlsUpdateAvailability, 100);
}

function mobileControlsOffer() {
  var mobileControlsPrompt = document.createElement("div");
  mobileControlsPrompt.className = "mobile-controls-prompt";
  mobileControlsPrompt.innerHTML = '<div class="mobile-controls-prompt-panel"><p>Are you playing on a mobile device?</p><div class="mobile-controls-prompt-actions"><button type="button" data-mobile-answer="yes">YES</button><button type="button" data-mobile-answer="no">NO</button></div></div>';
  mobileControlsPrompt.querySelector("[data-mobile-answer='yes']").addEventListener("click", function () { mobileControlsEnable(); mobileControlsPrompt.remove(); });
  mobileControlsPrompt.querySelector("[data-mobile-answer='no']").addEventListener("click", function () { mobileControlsPrompt.remove(); });
  document.body.appendChild(mobileControlsPrompt);
}

if (mobileControlsShouldOffer()) mobileControlsOffer();
window.addEventListener("resize", function () {
  if (!mobileControlsEnabled) return;
  mobileControlsApplyGameHeight(mobileControlsGameHeight === null ? mobileControlsGetDefaultGameHeight() : mobileControlsGameHeight, false);
});
globalsState.loadedModules.push("mobileControls");
