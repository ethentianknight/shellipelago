var introScreenRoot = document.createElement("div");
var introScreenStorageKey = "shellipelagoConnectionInfo";
var introScreenYamlSettingsStorageKey = "shellipelagoYamlSettings";
var introScreenDefaultHost = "archipelago.gg";
var introScreenDefaultPort = "38281";
var introScreenOfflineSaveKey = "shellipelagoOfflineSave";
var introScreenOfflineSaveVersion = "1.1";
var introScreenYamlMapLoadPromise = null;
var introScreenLegacyAsyncSeedName = "37554294161459039255";
var introScreenTrapNames = [
  "Stun Trap",
  "Invisible Trap",
  "Fast Trap",
  "Slow Trap",
  "Reverse Trap",
  "Screen Flip Trap",
  "Zoom In Trap",
  "Instant Death Trap",
  "Snake Trap"
];
var introScreenTrapColumns = ["anywhere", "local", "nonLocal", "never"];

document.body.appendChild(introScreenRoot);

function introScreenSetContent(introScreenHtml) {
  document.body.classList.remove("is-map-editor");
  introScreenRoot.innerHTML = introScreenHtml;
  introScreenApplyVersionText();
}

function introScreenApplyVersionText() {
  introScreenRoot.querySelectorAll("[data-shellipelago-version]").forEach(function (introScreenVersionElement) {
    introScreenVersionElement.textContent = globalsState.shellipelagoVersion || "1.1";
  });
}

function introScreenLoadSavedConnection() {
  var introScreenSaved = localStorage.getItem(introScreenStorageKey);

  if (!introScreenSaved) {
    return {};
  }

  try {
    return JSON.parse(introScreenSaved);
  } catch (introScreenError) {
    return {};
  }
}

function introScreenSaveConnection(introScreenConnectionInfo) {
  localStorage.setItem(introScreenStorageKey, JSON.stringify(introScreenConnectionInfo));
}

function introScreenLoadLegacyAsync() {
  window.location.href = "1.1/index.html?jam_async=1";
}

function introScreenShowConnection() {
  shardManagerLoadShard("connection").then(function (introScreenHtml) {
    var introScreenSavedConnection = introScreenLoadSavedConnection();

    if (!introScreenHtml) {
      introScreenHtml = introScreenGetFallbackConnectionHtml();
    }

    introScreenSetContent(introScreenHtml);
    introScreenRoot.querySelector("#connection-host").value = introScreenSavedConnection.host || "";
    introScreenRoot.querySelector("#connection-port").value = introScreenSavedConnection.port || introScreenDefaultPort;
    introScreenRoot.querySelector("#connection-slot").value = introScreenSavedConnection.slot || "";
    introScreenRoot.querySelector("#connection-password").value = introScreenSavedConnection.password || "";

    introScreenWireHomeConnectionActions();
    introScreenRoot.querySelector("#download-apworld").addEventListener("click", downloadManagerDownloadApworld);
    introScreenRoot.querySelector("#create-yaml").addEventListener("click", introScreenShowYamlCreator);
    introScreenRoot.querySelector("#download-game").addEventListener("click", introScreenHandleDownloadGame);
    introScreenRoot.querySelector("#open-map-editor").hidden = !isDebug;
    introScreenRoot.querySelector("#open-map-editor").addEventListener("click", introScreenShowMapEditor);
    introScreenRoot.querySelector("#connection-form").addEventListener("submit", introScreenSubmitConnection);
  }).catch(function (introScreenError) {
    console.error(introScreenError);
    introScreenSetContent(introScreenGetFallbackConnectionHtml());
    introScreenRoot.querySelector("#connection-host").value = "";
    introScreenRoot.querySelector("#connection-port").value = introScreenDefaultPort;
    introScreenRoot.querySelector("#connection-slot").value = "";
    introScreenRoot.querySelector("#connection-password").value = "";
    introScreenWireHomeConnectionActions();
    introScreenRoot.querySelector("#download-apworld").addEventListener("click", downloadManagerDownloadApworld);
    introScreenRoot.querySelector("#create-yaml").addEventListener("click", introScreenShowYamlCreator);
    introScreenRoot.querySelector("#download-game").addEventListener("click", introScreenHandleDownloadGame);
    introScreenRoot.querySelector("#open-map-editor").hidden = !isDebug;
    introScreenRoot.querySelector("#open-map-editor").addEventListener("click", introScreenShowMapEditor);
    introScreenRoot.querySelector("#connection-form").addEventListener("submit", introScreenSubmitConnection);
    introScreenRoot.querySelector("#connection-status").textContent = introScreenError.message;
  });
}

function introScreenWireHomeConnectionActions() {
  introScreenRoot.querySelector("#play-online").addEventListener("click", introScreenShowOnlineFields);
  introScreenRoot.querySelector("#connection-back").addEventListener("click", introScreenHideOnlineFields);
  introScreenRoot.querySelector("#offline-play").addEventListener("click", introScreenShowOfflineChoices);
  introScreenRoot.querySelector("#offline-continue").addEventListener("click", introScreenContinueOffline);
  introScreenRoot.querySelector("#offline-new-game").addEventListener("click", introScreenStartNewOffline);
  introScreenWireHideToggle("host");
  introScreenWireHideToggle("port");
  introScreenWireHideToggle("password");
}

function introScreenShowOnlineFields() {
  var introScreenForm = introScreenRoot.querySelector("#connection-form");
  var introScreenFields = introScreenRoot.querySelector("#connection-fields");
  var introScreenOfflineChoices = introScreenRoot.querySelector("#offline-choice-grid");

  introScreenForm.classList.remove("is-home");
  introScreenOfflineChoices.hidden = true;
  introScreenFields.hidden = false;
  introScreenRoot.querySelector("#connection-host").focus();
}

function introScreenHideOnlineFields() {
  var introScreenForm = introScreenRoot.querySelector("#connection-form");
  var introScreenFields = introScreenRoot.querySelector("#connection-fields");

  introScreenForm.classList.add("is-home");
  introScreenFields.hidden = true;
  introScreenRoot.querySelector("#connection-status").textContent = "";
}

function introScreenHandleDownloadGame() {
  window.open("https://dragonsidestudios.itch.io/shellipelago", "_blank", "noopener");
}

function introScreenHasOfflineSave() {
  var introScreenRawSave = localStorage.getItem(introScreenOfflineSaveKey);
  var introScreenSave = null;

  if (!introScreenRawSave) {
    return false;
  }

  try {
    introScreenSave = JSON.parse(introScreenRawSave);
  } catch (introScreenError) {
    localStorage.removeItem(introScreenOfflineSaveKey);
    return false;
  }

  if (!introScreenSave || String(introScreenSave.version || "") !== introScreenOfflineSaveVersion) {
    localStorage.removeItem(introScreenOfflineSaveKey);
    return false;
  }

  return true;
}

function introScreenShowOfflineChoices() {
  var introScreenOfflineChoices = introScreenRoot.querySelector("#offline-choice-grid");

  if (!introScreenHasOfflineSave()) {
    introScreenStartOffline(false);
    return;
  }

  introScreenOfflineChoices.hidden = false;
  introScreenRoot.querySelector("#connection-status").textContent = "";
}

function introScreenContinueOffline() {
  introScreenStartOffline(true);
}

function introScreenStartNewOffline() {
  localStorage.removeItem(introScreenOfflineSaveKey);
  introScreenStartOffline(false);
}

function introScreenWireHideToggle(introScreenFieldName) {
  var introScreenInput = introScreenRoot.querySelector("#connection-" + introScreenFieldName);
  var introScreenToggle = introScreenRoot.querySelector("#connection-hide-" + introScreenFieldName);

  if (!introScreenInput || !introScreenToggle) {
    return;
  }

  introScreenToggle.addEventListener("change", function () {
    introScreenInput.type = introScreenToggle.checked ? "password" : "text";
  });
  introScreenInput.type = introScreenToggle.checked ? "password" : "text";
}

function introScreenGetFallbackConnectionHtml() {
  return [
    '<main class="screen screen-connection" aria-labelledby="connection-title">',
    '<form class="screen-panel connection-form is-home" id="connection-form">',
    '<h1 class="home-title" id="connection-title">Shellipelago</h1>',
    '<p class="home-version">v<span data-shellipelago-version></span></p>',
    '<div class="home-play-grid" aria-label="Play options">',
    '<button class="home-play-tile" id="play-online" type="button">Play Online</button>',
    '<button class="home-play-tile" id="offline-play" type="button">Play Offline</button>',
    '</div>',
    '<div class="offline-choice-grid" id="offline-choice-grid" hidden>',
    '<button class="secondary-button" id="offline-continue" type="button">Continue</button>',
    '<button class="secondary-button" id="offline-new-game" type="button">New Game</button>',
    '</div>',
    '<div class="setup-actions home-setup-actions" aria-label="Setup files">',
    '<button class="secondary-button" id="download-apworld" type="button">Download .apworld</button>',
    '<button class="secondary-button" id="create-yaml" type="button">Create .yaml</button>',
    '<button class="secondary-button" id="download-game" type="button">Download Game</button>',
    '<button class="secondary-button debug-only" id="open-map-editor" type="button">Map Editor</button>',
    '</div>',
    '<p class="connection-status" id="connection-status" role="status"></p>',
    '<div class="connection-fields" id="connection-fields" hidden>',
    '<label><span>IP / Host</span><div class="connection-input-row"><input id="connection-host" name="host" type="password" autocomplete="url" placeholder="archipelago.gg"><label class="connection-hide-toggle"><input id="connection-hide-host" type="checkbox" checked> Hide</label></div></label>',
    '<label><span>Port</span><div class="connection-input-row"><input id="connection-port" name="port" type="password" inputmode="numeric" placeholder="38281"><label class="connection-hide-toggle"><input id="connection-hide-port" type="checkbox" checked> Hide</label></div></label>',
    '<label><span>Slot</span><input id="connection-slot" name="slot" type="text" autocomplete="username" required></label>',
    '<label><span>Password</span><div class="connection-input-row"><input id="connection-password" name="password" type="password" autocomplete="current-password"><label class="connection-hide-toggle"><input id="connection-hide-password" type="checkbox" checked> Hide</label></div></label>',
    '<div class="form-actions">',
    '<button class="secondary-button" id="connection-back" type="button">Back</button>',
    '<button class="primary-button" type="submit">Connect</button>',
    '</div>',
    '<p class="connection-version">v<span data-shellipelago-version></span></p>',
    '</div>',
    '</form>',
    '</main>'
  ].join("");
}

function introScreenShowYamlCreator() {
  shardManagerLoadShard("yamlCreator").then(function (introScreenHtml) {
    introScreenSetContent(introScreenHtml);
    introScreenBindYamlCreator();
  });
}

function introScreenBindYamlCreator() {
  var introScreenForm = introScreenRoot.querySelector("#yaml-form");
  var introScreenYamlUpload = introScreenRoot.querySelector("#yaml-upload");
  var introScreenProgressionBalancing = introScreenRoot.querySelector("#yaml-progression-balancing");
  var introScreenProgressionBalancingValue = introScreenRoot.querySelector("#yaml-progression-balancing-value");
  var introScreenDestructibleChecks = introScreenForm && introScreenForm.elements ? introScreenForm.elements.addEasyDestructibleChecks : null;
  var introScreenEnemyChecks = introScreenForm && introScreenForm.elements ? introScreenForm.elements.enemiesAreChecks : null;

  if (introScreenProgressionBalancing && introScreenProgressionBalancingValue) {
    introScreenProgressionBalancing.addEventListener("input", function () {
      introScreenSetProgressionBalancingValue(introScreenProgressionBalancing.value);
    });
    introScreenProgressionBalancingValue.addEventListener("input", function () {
      if (introScreenProgressionBalancingValue.value === "") {
        return;
      }

      introScreenSetProgressionBalancingValue(introScreenProgressionBalancingValue.value);
    });
    introScreenProgressionBalancingValue.addEventListener("change", function () {
      introScreenSetProgressionBalancingValue(introScreenProgressionBalancingValue.value);
    });
    introScreenSetProgressionBalancingValue(introScreenProgressionBalancing.value);
  }

  introScreenRoot.querySelectorAll("#yaml-form input[data-controls]").forEach(function (introScreenToggle) {
    introScreenSyncYamlControlledFields(introScreenToggle);
    introScreenToggle.addEventListener("change", function () {
      introScreenSyncYamlControlledFields(introScreenToggle);
    });
  });

  if (introScreenYamlUpload) {
    introScreenYamlUpload.addEventListener("change", introScreenHandleYamlUpload);
  }

  introScreenBindYamlTrapControls();
  introScreenLoadSavedYamlSettings();

  if (introScreenDestructibleChecks) {
    introScreenDestructibleChecks.addEventListener("change", introScreenHandleDestructibleChecksChange);
  }

  if (introScreenEnemyChecks) {
    introScreenEnemyChecks.addEventListener("change", introScreenHandleEnemyChecksChange);
  }

  introScreenRoot.querySelector("#yaml-download-default").addEventListener("click", introScreenDownloadDefaultYaml);
  introScreenRoot.querySelector("#yaml-reset-default").addEventListener("click", introScreenResetYamlToDefault);
  introScreenForm.addEventListener("input", function () {
    introScreenSyncYamlTrapState();
    introScreenUpdateYamlCheckCounter();
    introScreenSaveYamlSettings();
  });
  introScreenForm.addEventListener("change", function () {
    introScreenSyncYamlTrapState();
    introScreenUpdateYamlCheckCounter();
    introScreenSaveYamlSettings();
  });
  introScreenEnsureYamlMapLoaded().then(introScreenUpdateYamlCheckCounter);
  introScreenRoot.querySelector("#yaml-back").addEventListener("click", introScreenShowConnection);
  introScreenForm.addEventListener("submit", introScreenSubmitYaml);
}

function introScreenHandleDestructibleChecksChange(introScreenEvent) {
  introScreenHandleSlowChecksWarning(
    introScreenEvent.currentTarget,
    "destructible",
    "Adding destructible tiles to locations creates many extra checks and can significantly slow down a playthrough."
  );
}

function introScreenHandleEnemyChecksChange(introScreenEvent) {
  introScreenHandleSlowChecksWarning(
    introScreenEvent.currentTarget,
    "enemy",
    "Adding enemies to locations creates many extra checks and can significantly slow down a playthrough."
  );
}

function introScreenHandleSlowChecksWarning(introScreenCheckbox, introScreenDialogKind, introScreenFallbackMessage) {
  var introScreenDialog = introScreenRoot.querySelector("#yaml-" + introScreenDialogKind + "-warning");
  var introScreenConfirm = introScreenRoot.querySelector("#yaml-" + introScreenDialogKind + "-confirm");
  var introScreenCancel = introScreenRoot.querySelector("#yaml-" + introScreenDialogKind + "-cancel");

  if (!introScreenCheckbox.checked) {
    return;
  }

  if (!introScreenDialog || typeof introScreenDialog.showModal !== "function") {
    if (!window.confirm(introScreenFallbackMessage)) {
      introScreenCheckbox.checked = false;
      introScreenUpdateYamlCheckCounter();
      introScreenSaveYamlSettings();
    }
    return;
  }

  function introScreenCloseSlowChecksWarning(introScreenShouldKeepEnabled) {
    introScreenConfirm.removeEventListener("click", introScreenConfirmSlowChecksWarning);
    introScreenCancel.removeEventListener("click", introScreenCancelSlowChecksWarning);
    introScreenDialog.removeEventListener("cancel", introScreenCancelSlowChecksWarning);

    if (!introScreenShouldKeepEnabled) {
      introScreenCheckbox.checked = false;
    }

    if (introScreenDialog.open) {
      introScreenDialog.close();
    }

    introScreenUpdateYamlCheckCounter();
    introScreenSaveYamlSettings();
  }

  function introScreenConfirmSlowChecksWarning() {
    introScreenCloseSlowChecksWarning(true);
  }

  function introScreenCancelSlowChecksWarning(introScreenCancelEvent) {
    introScreenCancelEvent.preventDefault();
    introScreenCloseSlowChecksWarning(false);
  }

  introScreenConfirm.addEventListener("click", introScreenConfirmSlowChecksWarning);
  introScreenCancel.addEventListener("click", introScreenCancelSlowChecksWarning);
  introScreenDialog.addEventListener("cancel", introScreenCancelSlowChecksWarning);
  introScreenDialog.showModal();
}

function introScreenSyncYamlControlledFields(introScreenToggle) {
  String(introScreenToggle.dataset.controls || "").split(/\s+/).forEach(function (introScreenName) {
    if (!introScreenName) {
      return;
    }

    introScreenRoot.querySelectorAll("input[name='" + introScreenName + "']").forEach(function (introScreenInput) {
      introScreenInput.disabled = !introScreenToggle.checked;
    });
  });
}

function introScreenBindYamlTrapControls() {
  var introScreenTrapColumnsElement = introScreenRoot.querySelector("#yaml-trap-columns");
  var introScreenTrapFillPercentage = introScreenRoot.querySelector("input[name='trapFillPercentage']");
  var introScreenTrapFillPercentageValue = introScreenRoot.querySelector("input[name='trapFillPercentageValue']");

  if (!introScreenTrapColumnsElement) {
    return;
  }

  introScreenRenderYamlTrapCards(introScreenGetDefaultTrapSettings());

  introScreenTrapColumnsElement.addEventListener("dragover", function (introScreenEvent) {
    if (introScreenEvent.target && introScreenEvent.target.closest("[data-trap-list]")) {
      introScreenEvent.preventDefault();
    }
  });

  introScreenTrapColumnsElement.addEventListener("drop", function (introScreenEvent) {
    var introScreenTrapName = introScreenEvent.dataTransfer.getData("text/plain");
    var introScreenTargetList = introScreenEvent.target && introScreenEvent.target.closest("[data-trap-list]");

    if (!introScreenTrapName || !introScreenTargetList) {
      return;
    }

    introScreenEvent.preventDefault();
    introScreenMoveYamlTrapCard(introScreenTrapName, introScreenTargetList.dataset.trapList);
  });

  introScreenTrapColumnsElement.addEventListener("click", function (introScreenEvent) {
    var introScreenAllButton = introScreenEvent.target && introScreenEvent.target.closest("[data-trap-all]");

    if (!introScreenAllButton) {
      return;
    }

    introScreenEvent.preventDefault();
    introScreenMoveAllYamlTrapCards(introScreenAllButton.dataset.trapAll);
  });

  if (introScreenTrapFillPercentage && introScreenTrapFillPercentageValue) {
    introScreenTrapFillPercentage.addEventListener("input", function () {
      introScreenSetTrapFillPercentage(introScreenTrapFillPercentage.value);
    });
    introScreenTrapFillPercentageValue.addEventListener("input", function () {
      if (introScreenTrapFillPercentageValue.value !== "") {
        introScreenSetTrapFillPercentage(introScreenTrapFillPercentageValue.value);
      }
    });
    introScreenTrapFillPercentageValue.addEventListener("change", function () {
      introScreenSetTrapFillPercentage(introScreenTrapFillPercentageValue.value);
    });
    introScreenSetTrapFillPercentage(introScreenTrapFillPercentage.value);
  }

  introScreenSyncYamlTrapState();
}

function introScreenGetDefaultTrapSettings() {
  var introScreenTrapSettings = {};

  introScreenTrapNames.forEach(function (introScreenTrapName) {
    introScreenTrapSettings[introScreenTrapName] = {
      column: "anywhere",
      weight: 1
    };
  });

  return introScreenTrapSettings;
}

function introScreenRenderYamlTrapCards(introScreenTrapSettings) {
  var introScreenSettings = introScreenTrapSettings || introScreenGetDefaultTrapSettings();

  introScreenTrapColumns.forEach(function (introScreenColumnName) {
    var introScreenList = introScreenRoot.querySelector("[data-trap-list='" + introScreenColumnName + "']");

    if (introScreenList) {
      introScreenList.innerHTML = "";
    }
  });

  introScreenTrapNames.forEach(function (introScreenTrapName) {
    var introScreenTrapSetting = introScreenSettings[introScreenTrapName] || { column: "anywhere", weight: 1 };
    var introScreenColumnName = introScreenTrapColumns.indexOf(introScreenTrapSetting.column) === -1 ? "anywhere" : introScreenTrapSetting.column;
    var introScreenList = introScreenRoot.querySelector("[data-trap-list='" + introScreenColumnName + "']");
    var introScreenCard = document.createElement("div");
    var introScreenName = document.createElement("span");
    var introScreenWeight = document.createElement("input");

    if (!introScreenList) {
      return;
    }

    introScreenCard.className = "yaml-trap-card";
    introScreenCard.draggable = true;
    introScreenCard.dataset.trapName = introScreenTrapName;
    introScreenCard.addEventListener("dragstart", function (introScreenEvent) {
      introScreenEvent.dataTransfer.setData("text/plain", introScreenTrapName);
    });

    introScreenName.textContent = introScreenTrapName;
    introScreenWeight.type = "number";
    introScreenWeight.min = "0";
    introScreenWeight.max = "1000";
    introScreenWeight.value = String(Math.max(0, Number(introScreenTrapSetting.weight) || 0));
    introScreenWeight.dataset.trapWeight = introScreenTrapName;

    introScreenCard.appendChild(introScreenName);
    introScreenCard.appendChild(introScreenWeight);
    introScreenList.appendChild(introScreenCard);
  });

  introScreenSyncYamlTrapState();
}

function introScreenMoveYamlTrapCard(introScreenTrapName, introScreenColumnName) {
  var introScreenCard = introScreenRoot.querySelector(".yaml-trap-card[data-trap-name='" + CSS.escape(introScreenTrapName) + "']");
  var introScreenTargetList = introScreenRoot.querySelector("[data-trap-list='" + introScreenColumnName + "']");

  if (!introScreenCard || !introScreenTargetList) {
    return;
  }

  introScreenTargetList.appendChild(introScreenCard);
  introScreenSyncYamlTrapState();
  introScreenSaveYamlSettings();
}

function introScreenMoveAllYamlTrapCards(introScreenColumnName) {
  var introScreenTargetList = introScreenRoot.querySelector("[data-trap-list='" + introScreenColumnName + "']");

  if (!introScreenTargetList) {
    return;
  }

  introScreenTrapNames.forEach(function (introScreenTrapName) {
    var introScreenCard = introScreenRoot.querySelector(".yaml-trap-card[data-trap-name='" + CSS.escape(introScreenTrapName) + "']");

    if (introScreenCard) {
      introScreenTargetList.appendChild(introScreenCard);
    }
  });

  introScreenSyncYamlTrapState();
  introScreenSaveYamlSettings();
}

function introScreenSetTrapFillPercentage(introScreenValue) {
  var introScreenTrapFillPercentage = introScreenRoot.querySelector("input[name='trapFillPercentage']");
  var introScreenTrapFillPercentageValue = introScreenRoot.querySelector("input[name='trapFillPercentageValue']");
  var introScreenNumber = Number(introScreenValue);

  if (!Number.isFinite(introScreenNumber)) {
    introScreenNumber = 25;
  }

  introScreenNumber = Math.max(0, Math.min(100, Math.floor(introScreenNumber)));
  if (introScreenTrapFillPercentage) {
    introScreenTrapFillPercentage.value = String(introScreenNumber);
  }
  if (introScreenTrapFillPercentageValue) {
    introScreenTrapFillPercentageValue.value = String(introScreenNumber);
  }
}

function introScreenGetYamlTrapSettings() {
  var introScreenTrapSettings = {};

  introScreenTrapNames.forEach(function (introScreenTrapName) {
    var introScreenCard = introScreenRoot.querySelector(".yaml-trap-card[data-trap-name='" + CSS.escape(introScreenTrapName) + "']");
    var introScreenList = introScreenCard && introScreenCard.parentNode ? introScreenCard.parentNode.closest("[data-trap-list]") : null;
    var introScreenWeightInput = introScreenCard ? introScreenCard.querySelector("[data-trap-weight]") : null;
    var introScreenColumnName = introScreenList ? introScreenList.dataset.trapList : "anywhere";
    var introScreenWeight = introScreenColumnName === "never" ? 0 : Math.max(0, Math.floor(Number(introScreenWeightInput ? introScreenWeightInput.value : 1) || 0));

    introScreenTrapSettings[introScreenTrapName] = {
      column: introScreenColumnName,
      weight: introScreenWeight
    };
  });

  return introScreenTrapSettings;
}

function introScreenGetYamlTrapWeights() {
  var introScreenTrapWeights = {};
  var introScreenTrapSettings = introScreenGetYamlTrapSettings();

  introScreenTrapNames.forEach(function (introScreenTrapName) {
    introScreenTrapWeights[introScreenTrapName] = introScreenTrapSettings[introScreenTrapName].weight;
  });

  return introScreenTrapWeights;
}

function introScreenSyncYamlTrapState() {
  var introScreenState = introScreenRoot.querySelector("#yaml-trap-state");
  var introScreenTrapSettings = introScreenGetYamlTrapSettings();

  if (!introScreenState) {
    return;
  }

  introScreenState.innerHTML = "";
  introScreenTrapNames.forEach(function (introScreenTrapName) {
    var introScreenTrapSetting = introScreenTrapSettings[introScreenTrapName];

    introScreenAppendHiddenTrapCheckbox("trapPoolSpawn", introScreenTrapName, introScreenTrapSetting.column !== "never");
    introScreenAppendHiddenTrapCheckbox("trapPoolLocal", introScreenTrapName, introScreenTrapSetting.column === "anywhere" || introScreenTrapSetting.column === "local");
    introScreenAppendHiddenTrapCheckbox("trapPoolNonLocal", introScreenTrapName, introScreenTrapSetting.column === "anywhere" || introScreenTrapSetting.column === "nonLocal");
  });
}

function introScreenAppendHiddenTrapCheckbox(introScreenName, introScreenValue, introScreenChecked) {
  var introScreenState = introScreenRoot.querySelector("#yaml-trap-state");
  var introScreenInput = document.createElement("input");

  if (!introScreenState) {
    return;
  }

  introScreenInput.type = "checkbox";
  introScreenInput.name = introScreenName;
  introScreenInput.value = introScreenValue;
  introScreenInput.checked = Boolean(introScreenChecked);
  introScreenState.appendChild(introScreenInput);
}

function introScreenLoadSavedYamlSettings() {
  var introScreenSavedYamlSettings = localStorage.getItem(introScreenYamlSettingsStorageKey);

  if (!introScreenSavedYamlSettings) {
    return;
  }

  try {
    introScreenApplyYamlOptionsToForm(JSON.parse(introScreenSavedYamlSettings));
  } catch (introScreenError) {
    console.warn("Unable to load saved YAML settings.", introScreenError);
  }
}

function introScreenSaveYamlSettings() {
  var introScreenForm = introScreenRoot.querySelector("#yaml-form");

  if (!introScreenForm) {
    return;
  }

  localStorage.setItem(
    introScreenYamlSettingsStorageKey,
    JSON.stringify(introScreenGetYamlOptions(introScreenForm.elements, introScreenForm.elements.slot.value.trim()))
  );
}

function introScreenDownloadDefaultYaml() {
  var introScreenForm = introScreenRoot.querySelector("#yaml-form");
  var introScreenStatus = introScreenRoot.querySelector("#yaml-status");
  var introScreenCurrentOptions = null;
  var introScreenDefaultOptions = null;

  if (!introScreenForm) {
    return;
  }

  introScreenCurrentOptions = introScreenGetYamlOptions(introScreenForm.elements, introScreenForm.elements.slot.value.trim());
  introScreenForm.reset();
  introScreenRenderYamlTrapCards(introScreenGetDefaultTrapSettings());
  introScreenSetTrapFillPercentage(25);
  introScreenDefaultOptions = introScreenGetYamlOptions(introScreenForm.elements, "Player");
  introScreenDefaultOptions.ringLink = false;
  introScreenDefaultOptions.energyLink = false;
  introScreenDefaultOptions.deathLink = false;
  introScreenDefaultOptions.trapLink = false;
  introScreenDefaultOptions.itemLink = false;
  introScreenApplyYamlOptionsToForm(introScreenCurrentOptions);
  introScreenUpdateYamlRangeOutput();
  introScreenUpdateYamlCheckCounter();

  downloadManagerDownloadText(
    "Shellipelago.yaml",
    downloadManagerBuildYaml(introScreenDefaultOptions)
  );
  introScreenStatus.textContent = "Default YAML downloaded.";
}

function introScreenResetYamlToDefault() {
  var introScreenForm = introScreenRoot.querySelector("#yaml-form");
  var introScreenStatus = introScreenRoot.querySelector("#yaml-status");
  var introScreenYamlUpload = introScreenRoot.querySelector("#yaml-upload");

  if (!introScreenForm) {
    return;
  }

  localStorage.removeItem(introScreenYamlSettingsStorageKey);
  introScreenForm.reset();
  introScreenRenderYamlTrapCards(introScreenGetDefaultTrapSettings());
  introScreenSetTrapFillPercentage(25);
  if (introScreenYamlUpload) {
    introScreenYamlUpload.value = "";
  }
  introScreenRoot.querySelectorAll("#yaml-form input[data-controls]").forEach(introScreenSyncYamlControlledFields);
  introScreenUpdateYamlRangeOutput();
  introScreenUpdateYamlCheckCounter();
  introScreenSaveYamlSettings();
  introScreenStatus.textContent = "YAML settings reset to defaults.";
}

function introScreenHandleYamlUpload(introScreenEvent) {
  var introScreenFile = introScreenEvent.currentTarget.files && introScreenEvent.currentTarget.files[0];
  var introScreenStatus = introScreenRoot.querySelector("#yaml-status");
  var introScreenReader = null;

  if (!introScreenFile) {
    return;
  }

  introScreenReader = new FileReader();
  introScreenReader.addEventListener("load", function () {
    try {
      introScreenApplyYamlOptionsToForm(introScreenParseYamlOptions(String(introScreenReader.result || "")));
      introScreenSaveYamlSettings();
      introScreenUpdateYamlCheckCounter();
      introScreenStatus.textContent = "Loaded settings from " + introScreenFile.name + ".";
    } catch (introScreenError) {
      console.error(introScreenError);
      introScreenStatus.textContent = "Could not read YAML settings.";
    }
  });
  introScreenReader.readAsText(introScreenFile);
}

function introScreenParseYamlOptions(introScreenYamlText) {
  var introScreenLines = introScreenYamlText.split(/\r?\n/);
  var introScreenOptions = {};
  var introScreenYamlKeyMap = introScreenGetYamlKeyMap();
  var introScreenCurrentListKey = "";
  var introScreenCurrentMapKey = "";
  var introScreenInShellipelago = false;

  introScreenLines.forEach(function (introScreenLine) {
    var introScreenNoComment = introScreenLine.replace(/\s+#.*$/, "");
    var introScreenTrimmed = introScreenNoComment.trim();
    var introScreenKeyMatch = null;
    var introScreenListMatch = null;
    var introScreenMapMatch = null;

    if (!introScreenTrimmed || introScreenTrimmed.charAt(0) === "#") {
      return;
    }

    if (!introScreenInShellipelago && introScreenTrimmed.indexOf("name:") === 0) {
      introScreenOptions.slot = introScreenParseYamlScalar(introScreenTrimmed.slice(5).trim());
      return;
    }

    if (introScreenTrimmed === "Shellipelago:") {
      introScreenInShellipelago = true;
      introScreenCurrentListKey = "";
      introScreenCurrentMapKey = "";
      return;
    }

    if (!introScreenInShellipelago) {
      return;
    }

    introScreenMapMatch = introScreenNoComment.match(/^\s{4}(.+?):\s*(.*?)\s*$/);
    if (introScreenMapMatch && introScreenCurrentMapKey) {
      introScreenOptions[introScreenCurrentMapKey][introScreenParseYamlScalar(introScreenMapMatch[1])] = introScreenParseYamlScalar(introScreenMapMatch[2]);
      return;
    }

    introScreenListMatch = introScreenNoComment.match(/^\s*-\s*(.+?)\s*$/);
    if (introScreenListMatch && introScreenCurrentListKey) {
      introScreenOptions[introScreenCurrentListKey].push(introScreenParseYamlScalar(introScreenListMatch[1]));
      return;
    }

    introScreenKeyMatch = introScreenNoComment.match(/^\s{2}([a-zA-Z0-9_]+):\s*(.*?)\s*$/);
    if (!introScreenKeyMatch) {
      return;
    }

    introScreenCurrentListKey = "";
    introScreenCurrentMapKey = "";
    if (!introScreenYamlKeyMap[introScreenKeyMatch[1]]) {
      return;
    }

    if (!introScreenKeyMatch[2]) {
      if (introScreenYamlKeyMap[introScreenKeyMatch[1]] === "trapWeights") {
        introScreenCurrentMapKey = "trapWeights";
        introScreenOptions[introScreenCurrentMapKey] = {};
      } else {
        introScreenCurrentListKey = introScreenYamlKeyMap[introScreenKeyMatch[1]];
        introScreenOptions[introScreenCurrentListKey] = [];
      }
      return;
    }

    introScreenOptions[introScreenYamlKeyMap[introScreenKeyMatch[1]]] = introScreenParseYamlScalar(introScreenKeyMatch[2]);
  });

  introScreenApplyStandardLocalityOptions(introScreenOptions);

  return introScreenOptions;
}

function introScreenApplyStandardLocalityOptions(introScreenOptions) {
  var introScreenLocalItems = introScreenOptions.localItems || [];
  var introScreenNonLocalItems = introScreenOptions.nonLocalItems || [];

  introScreenApplyStandardLocalityGroup(
    introScreenOptions,
    introScreenLocalItems,
    introScreenNonLocalItems,
    "essentialLocal",
    "essentialNonLocal",
    [
      "Graphics",
      "Progressive Room",
      "Bombs",
      "Gun",
      "Fire",
      "Sword",
      "Pickaxe",
      "Water Walkers",
      "Tank Treads",
      "Tank Chassis",
      "Tank Cannon",
      "SFX",
      "BGM"
    ]
  );
  introScreenApplyStandardLocalityGroup(
    introScreenOptions,
    introScreenLocalItems,
    introScreenNonLocalItems,
    "resourceLocal",
    "resourceNonLocal",
    ["Max HP", "Max Rounds"]
  );
  introScreenApplyStandardLocalityGroup(
    introScreenOptions,
    introScreenLocalItems,
    introScreenNonLocalItems,
    "trapPoolLocal",
    "trapPoolNonLocal",
    [
      "Stun Trap",
      "Invisible Trap",
      "Fast Trap",
      "Slow Trap",
      "Reverse Trap",
      "Screen Flip Trap",
      "Zoom In Trap",
      "Instant Death Trap",
      "Snake Trap"
    ]
  );

  delete introScreenOptions.localItems;
  delete introScreenOptions.nonLocalItems;
}

function introScreenApplyStandardLocalityGroup(
  introScreenOptions,
  introScreenLocalItems,
  introScreenNonLocalItems,
  introScreenLocalKey,
  introScreenNonLocalKey,
  introScreenItemNames
) {
  introScreenOptions[introScreenLocalKey] = introScreenOptions[introScreenLocalKey] || introScreenItemNames.slice();
  introScreenOptions[introScreenNonLocalKey] = introScreenOptions[introScreenNonLocalKey] || introScreenItemNames.slice();

  introScreenItemNames.forEach(function (introScreenItemName) {
    var introScreenForcedLocal = introScreenLocalItems.indexOf(introScreenItemName) !== -1;
    var introScreenForcedNonLocal = introScreenNonLocalItems.indexOf(introScreenItemName) !== -1;

    if (introScreenForcedLocal && !introScreenForcedNonLocal) {
      introScreenOptions[introScreenLocalKey] = introScreenAddYamlOptionValue(
        introScreenOptions[introScreenLocalKey],
        introScreenItemName
      );
      introScreenOptions[introScreenNonLocalKey] = introScreenRemoveYamlOptionValue(
        introScreenOptions[introScreenNonLocalKey],
        introScreenItemName
      );
    } else if (introScreenForcedNonLocal && !introScreenForcedLocal) {
      introScreenOptions[introScreenLocalKey] = introScreenRemoveYamlOptionValue(
        introScreenOptions[introScreenLocalKey],
        introScreenItemName
      );
      introScreenOptions[introScreenNonLocalKey] = introScreenAddYamlOptionValue(
        introScreenOptions[introScreenNonLocalKey],
        introScreenItemName
      );
    }
  });
}

function introScreenAddYamlOptionValue(introScreenValues, introScreenValue) {
  if (introScreenValues.indexOf(introScreenValue) === -1) {
    introScreenValues.push(introScreenValue);
  }

  return introScreenValues;
}

function introScreenRemoveYamlOptionValue(introScreenValues, introScreenValue) {
  return introScreenValues.filter(function (introScreenExistingValue) {
    return introScreenExistingValue !== introScreenValue;
  });
}

function introScreenParseYamlScalar(introScreenValue) {
  var introScreenTrimmedValue = String(introScreenValue || "").trim();

  if (introScreenTrimmedValue === "true") {
    return true;
  }

  if (introScreenTrimmedValue === "false") {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(introScreenTrimmedValue)) {
    return Number(introScreenTrimmedValue);
  }

  return introScreenTrimmedValue.replace(/^["']|["']$/g, "");
}

function introScreenGetYamlKeyMap() {
  return {
    progression_balancing: "progressionBalancing",
    local_items: "localItems",
    non_local_items: "nonLocalItems",
    shuffle_essential_items: "shuffleEssentialItems",
    shuffle_max_resource_upgrades: "shuffleMaxResourceUpgrades",
    add_easy_destructible_checks: "addEasyDestructibleChecks",
    enemies_are_checks: "enemiesAreChecks",
    shuffle_shops: "shuffleShops",
    show_essential_pickup_hints: "showEssentialPickupHints",
    enemies_are_hints: "enemiesAreHints",
    add_traps_to_pool: "addTrapsToPool",
    trap_fill_percentage: "trapFillPercentage",
    trap_pool_spawn: "trapPoolSpawn",
    trap_weights: "trapWeights",
    other_players_can_find_item_pool_drops: "otherPlayersCanFindItemPoolDrops",
    ring_link: "ringLink",
    energy_link: "energyLink",
    death_link: "deathLink",
    trap_link: "trapLink"
  };
}

function introScreenApplyYamlOptionsToForm(introScreenOptions) {
  var introScreenForm = introScreenRoot.querySelector("#yaml-form");
  var introScreenFields = introScreenForm ? introScreenForm.elements : null;

  if (!introScreenFields || !introScreenOptions) {
    return;
  }

  Object.keys(introScreenOptions).forEach(function (introScreenOptionKey) {
    if (introScreenOptionKey === "trapWeights") {
      return;
    }

    if (Array.isArray(introScreenOptions[introScreenOptionKey])) {
      introScreenSetYamlCheckboxGroup(introScreenOptionKey, introScreenOptions[introScreenOptionKey]);
      return;
    }

    if (introScreenOptions[introScreenOptionKey] && typeof introScreenOptions[introScreenOptionKey] === "object") {
      return;
    }

    introScreenSetYamlField(introScreenFields, introScreenOptionKey, introScreenOptions[introScreenOptionKey]);
  });

  introScreenApplyYamlTrapOptionsToForm(introScreenOptions);
  introScreenRoot.querySelectorAll("#yaml-form input[data-controls]").forEach(introScreenSyncYamlControlledFields);
  introScreenUpdateYamlRangeOutput();
}

function introScreenApplyYamlTrapOptionsToForm(introScreenOptions) {
  var introScreenTrapSettings = introScreenGetDefaultTrapSettings();
  var introScreenTrapSpawn = Array.isArray(introScreenOptions.trapPoolSpawn) ? introScreenOptions.trapPoolSpawn.map(String) : introScreenTrapNames.slice();
  var introScreenTrapLocal = Array.isArray(introScreenOptions.trapPoolLocal) ? introScreenOptions.trapPoolLocal.map(String) : introScreenTrapNames.slice();
  var introScreenTrapNonLocal = Array.isArray(introScreenOptions.trapPoolNonLocal) ? introScreenOptions.trapPoolNonLocal.map(String) : introScreenTrapNames.slice();
  var introScreenTrapWeights = introScreenOptions.trapWeights && typeof introScreenOptions.trapWeights === "object" ? introScreenOptions.trapWeights : {};

  introScreenTrapNames.forEach(function (introScreenTrapName) {
    var introScreenSpawns = introScreenTrapSpawn.indexOf(introScreenTrapName) !== -1;
    var introScreenCanBeLocal = introScreenTrapLocal.indexOf(introScreenTrapName) !== -1;
    var introScreenCanBeNonLocal = introScreenTrapNonLocal.indexOf(introScreenTrapName) !== -1;

    if (!introScreenSpawns || (!introScreenCanBeLocal && !introScreenCanBeNonLocal)) {
      introScreenTrapSettings[introScreenTrapName].column = "never";
    } else if (introScreenCanBeLocal && !introScreenCanBeNonLocal) {
      introScreenTrapSettings[introScreenTrapName].column = "local";
    } else if (introScreenCanBeNonLocal && !introScreenCanBeLocal) {
      introScreenTrapSettings[introScreenTrapName].column = "nonLocal";
    } else {
      introScreenTrapSettings[introScreenTrapName].column = "anywhere";
    }

    if (Object.prototype.hasOwnProperty.call(introScreenTrapWeights, introScreenTrapName)) {
      introScreenTrapSettings[introScreenTrapName].weight = Number(introScreenTrapWeights[introScreenTrapName]) || 0;
    }

    if (introScreenTrapSettings[introScreenTrapName].column === "never") {
      introScreenTrapSettings[introScreenTrapName].weight = 0;
    }
  });

  introScreenRenderYamlTrapCards(introScreenTrapSettings);

  if (Object.prototype.hasOwnProperty.call(introScreenOptions, "trapFillPercentage")) {
    introScreenSetTrapFillPercentage(introScreenOptions.trapFillPercentage);
  }
}

function introScreenSetYamlField(introScreenFields, introScreenOptionKey, introScreenValue) {
  var introScreenField = introScreenFields[introScreenOptionKey];

  if (!introScreenField) {
    return;
  }

  if (introScreenField instanceof RadioNodeList) {
    Array.from(introScreenField).forEach(function (introScreenInput) {
      if (introScreenInput.type === "checkbox") {
        introScreenInput.checked = Boolean(introScreenValue);
      } else {
        introScreenInput.value = introScreenValue;
      }
    });
    return;
  }

  if (introScreenField.type === "checkbox") {
    introScreenField.checked = Boolean(introScreenValue);
    return;
  }

  introScreenField.value = introScreenValue;
}

function introScreenSetYamlCheckboxGroup(introScreenName, introScreenValues) {
  var introScreenSelectedValues = introScreenValues.map(String);

  introScreenRoot.querySelectorAll("input[name='" + introScreenName + "']").forEach(function (introScreenInput) {
    introScreenInput.checked = introScreenSelectedValues.indexOf(introScreenInput.value) !== -1;
  });
}

function introScreenUpdateYamlRangeOutput() {
  var introScreenProgressionBalancing = introScreenRoot.querySelector("#yaml-progression-balancing");
  var introScreenProgressionBalancingValue = introScreenRoot.querySelector("#yaml-progression-balancing-value");
  var introScreenTrapFillPercentage = introScreenRoot.querySelector("input[name='trapFillPercentage']");

  if (introScreenProgressionBalancing && introScreenProgressionBalancingValue) {
    introScreenSetProgressionBalancingValue(introScreenProgressionBalancing.value);
  }

  if (introScreenTrapFillPercentage) {
    introScreenSetTrapFillPercentage(introScreenTrapFillPercentage.value);
  }
}

function introScreenSetProgressionBalancingValue(introScreenValue) {
  var introScreenProgressionBalancing = introScreenRoot.querySelector("#yaml-progression-balancing");
  var introScreenProgressionBalancingValue = introScreenRoot.querySelector("#yaml-progression-balancing-value");
  var introScreenNumber = Number(introScreenValue);

  if (!introScreenProgressionBalancing || !introScreenProgressionBalancingValue) {
    return;
  }

  if (!Number.isFinite(introScreenNumber)) {
    introScreenNumber = 50;
  }

  introScreenNumber = Math.max(0, Math.min(99, Math.floor(introScreenNumber)));
  introScreenProgressionBalancing.value = String(introScreenNumber);
  introScreenProgressionBalancingValue.value = String(introScreenNumber);
}

function introScreenSubmitYaml(introScreenEvent) {
  var introScreenForm = introScreenEvent.currentTarget;
  var introScreenFields = introScreenForm.elements;
  var introScreenStatus = introScreenRoot.querySelector("#yaml-status");
  var introScreenSlot = introScreenFields.slot.value.trim();
  var introScreenFileName = introScreenSlot.replace(/[^a-z0-9_-]+/gi, "_");

  introScreenEvent.preventDefault();

  if (!introScreenSlot) {
    introScreenStatus.textContent = "Choose a slot name before creating YAML.";
    return;
  }

  if (!introScreenValidateYamlLocalityOptions(introScreenStatus)) {
    return;
  }

  downloadManagerDownloadText(
    introScreenFileName + ".yaml",
    downloadManagerBuildYaml(introScreenGetYamlOptions(introScreenFields, introScreenSlot))
  );
  introScreenStatus.textContent = "YAML created for " + introScreenSlot + ".";
}

function introScreenValidateYamlLocalityOptions(introScreenStatus) {
  var introScreenInvalidItem = introScreenFindYamlLocalityItemMissingBothColumns("essentialLocal", "essentialNonLocal") ||
    introScreenFindYamlLocalityItemMissingBothColumns("resourceLocal", "resourceNonLocal");

  if (introScreenInvalidItem) {
    introScreenStatus.textContent = introScreenInvalidItem + " must be checked in Local Items, Non Local Items, or both.";
    return false;
  }

  return true;
}

function introScreenFindYamlLocalityItemMissingBothColumns(introScreenLocalName, introScreenNonLocalName) {
  var introScreenValues = {};

  introScreenRoot.querySelectorAll("input[name='" + introScreenLocalName + "'], input[name='" + introScreenNonLocalName + "']").forEach(function (introScreenInput) {
    introScreenValues[introScreenInput.value] = introScreenValues[introScreenInput.value] || {
      local: false,
      nonLocal: false
    };

    if (introScreenInput.name === introScreenLocalName && introScreenInput.checked) {
      introScreenValues[introScreenInput.value].local = true;
    }

    if (introScreenInput.name === introScreenNonLocalName && introScreenInput.checked) {
      introScreenValues[introScreenInput.value].nonLocal = true;
    }
  });

  return Object.keys(introScreenValues).find(function (introScreenValue) {
    return !introScreenValues[introScreenValue].local && !introScreenValues[introScreenValue].nonLocal;
  }) || "";
}

function introScreenGetYamlOptions(introScreenFields, introScreenSlot) {
  return {
    slot: introScreenSlot,
    progressionBalancing: introScreenFields.progressionBalancing.value,
    shuffleEssentialItems: introScreenFields.shuffleEssentialItems.checked,
    essentialLocal: introScreenGetCheckedValues("essentialLocal"),
    essentialNonLocal: introScreenGetCheckedValues("essentialNonLocal"),
    shuffleMaxResourceUpgrades: introScreenFields.shuffleMaxResourceUpgrades.checked,
    resourceLocal: introScreenGetCheckedValues("resourceLocal"),
    resourceNonLocal: introScreenGetCheckedValues("resourceNonLocal"),
    addEasyDestructibleChecks: introScreenFields.addEasyDestructibleChecks.checked,
    enemiesAreChecks: introScreenFields.enemiesAreChecks.checked,
    shuffleShops: introScreenFields.shuffleShops.checked,
    showEssentialPickupHints: introScreenFields.showEssentialPickupHints.checked,
    enemiesAreHints: introScreenFields.enemiesAreHints.checked,
    addTrapsToPool: introScreenFields.addTrapsToPool.checked,
    trapFillPercentage: introScreenFields.trapFillPercentage.value,
    trapPoolSpawn: introScreenGetCheckedValues("trapPoolSpawn"),
    trapPoolLocal: introScreenGetCheckedValues("trapPoolLocal"),
    trapPoolNonLocal: introScreenGetCheckedValues("trapPoolNonLocal"),
    trapWeights: introScreenGetYamlTrapWeights(),
    otherPlayersCanFindItemPoolDrops: introScreenFields.otherPlayersCanFindItemPoolDrops.checked,
    ringLink: introScreenFields.ringLink.checked,
    energyLink: introScreenFields.energyLink.checked,
    deathLink: introScreenFields.deathLink.checked,
    trapLink: introScreenFields.trapLink.checked,
    itemLink: introScreenFields.itemLink.checked
  };
}

function introScreenUpdateYamlCheckCounter() {
  var introScreenForm = introScreenRoot.querySelector("#yaml-form");
  var introScreenCounts = null;

  if (!introScreenForm || !introScreenRoot.querySelector("#yaml-total-checks")) {
    return;
  }

  if (!introScreenHasLoadedYamlMapData()) {
    introScreenEnsureYamlMapLoaded().then(introScreenUpdateYamlCheckCounter);
    return;
  }

  introScreenCounts = introScreenCalculateYamlCheckCounts(introScreenGetYamlOptions(introScreenForm.elements, introScreenForm.elements.slot.value.trim()));
  introScreenSetYamlCount("yaml-total-checks", introScreenCounts.total);
  introScreenSetYamlCount("yaml-chest-checks", introScreenCounts.chests);
  introScreenSetYamlCount("yaml-easy-destructible-checks", introScreenCounts.easyDestructibles);
  introScreenSetYamlCount("yaml-enemy-checks", introScreenCounts.enemies);
  introScreenSetYamlCount("yaml-shop-checks", introScreenCounts.shops);
  introScreenSetYamlCount("yaml-hint-checks", introScreenCounts.hints);
}

function introScreenSetYamlCount(introScreenId, introScreenValue) {
  var introScreenNode = introScreenRoot.querySelector("#" + introScreenId);

  if (introScreenNode) {
    introScreenNode.textContent = String(introScreenValue);
  }
}

function introScreenEnsureYamlMapLoaded() {
  if (introScreenHasLoadedYamlMapData()) {
    return Promise.resolve(mapManagerData);
  }

  if (!introScreenYamlMapLoadPromise) {
    introScreenYamlMapLoadPromise = mapManagerLoadMap().catch(function (introScreenError) {
      introScreenYamlMapLoadPromise = null;
      throw introScreenError;
    });
  }

  return introScreenYamlMapLoadPromise;
}

function introScreenHasLoadedYamlMapData() {
  var introScreenRooms = introScreenGetYamlMapRooms();

  return introScreenRooms.length > 1 ||
    Boolean(introScreenRooms[0] && introScreenRooms[0].tiles && introScreenRooms[0].tiles.length);
}

function introScreenGetYamlMapRooms() {
  if (typeof mapManagerData !== "undefined" && mapManagerData && Array.isArray(mapManagerData.rooms)) {
    return mapManagerData.rooms;
  }

  if (window.shellipelagoMapData && Array.isArray(window.shellipelagoMapData.rooms)) {
    return window.shellipelagoMapData.rooms;
  }

  return [];
}

function introScreenCalculateYamlCheckCounts(introScreenOptions) {
  var introScreenCounts = {
    chests: 0,
    easyDestructibles: 0,
    enemies: 0,
    shops: 0,
    hints: 0,
    total: 0,
    hintCandidates: {
      chests: 0,
      easyDestructibles: 0,
      enemies: 0
    }
  };

  introScreenGetYamlMapRooms().forEach(function (introScreenRoom) {
    (introScreenRoom.tiles || []).forEach(function (introScreenTile) {
      if (introScreenIsYamlEnemyTile(introScreenTile)) {
        introScreenCounts.hintCandidates.enemies += 1;

        if (introScreenOptions.enemiesAreChecks) {
          introScreenCounts.enemies += 1;
        }
        return;
      }

      if (introScreenIsYamlShopTile(introScreenTile)) {
        if (introScreenOptions.shuffleShops) {
          introScreenCounts.shops += 1;
        } else if (introScreenShouldCountYamlFixedShopDrop(introScreenTile.shopDrop, introScreenOptions)) {
          introScreenCounts.shops += 1;
        }
        return;
      }

      if (introScreenIsYamlDestructibleTile(introScreenTile)) {
        if (introScreenIsYamlPostgameDestructible(introScreenTile)) {
          return;
        }

        introScreenCounts.hintCandidates.easyDestructibles += 1;

        if (introScreenOptions.addEasyDestructibleChecks) {
          introScreenCounts.easyDestructibles += 1;
        }
        return;
      }

      if (introScreenIsYamlChestTile(introScreenTile) && introScreenShouldCountYamlDrop(introScreenTile.expectedDrop || introScreenTile.checkKey, introScreenOptions)) {
        introScreenCounts.hintCandidates.chests += 1;
        introScreenCounts.chests += 1;
      }
    });
  });

  introScreenCounts.total = introScreenCounts.chests +
    introScreenCounts.easyDestructibles +
    introScreenCounts.enemies +
    introScreenCounts.shops;
  introScreenCounts.hints = introScreenCalculateYamlHintCount(introScreenCounts, introScreenOptions);
  return introScreenCounts;
}

function introScreenCalculateYamlHintCount(introScreenCounts, introScreenOptions) {
  var introScreenHintCount = 0;
  if (introScreenOptions.enemiesAreHints) {
    introScreenHintCount = (introScreenCounts.hintCandidates || introScreenCounts).enemies || 0;
  }

  return introScreenHintCount;
}

function introScreenIsYamlChestTile(introScreenTile) {
  return Boolean(introScreenTile &&
    introScreenTile.type === "check" &&
    !introScreenIsYamlDestructibleTile(introScreenTile));
}

function introScreenIsYamlDestructibleTile(introScreenTile) {
  return Boolean(introScreenTile && (
    introScreenTile.tileType === "DestructableCheck" ||
    introScreenTile.typeOverride === "DestructableCheck"
  ));
}

function introScreenIsYamlEnemyTile(introScreenTile) {
  return Boolean(introScreenTile && (
    introScreenTile.type === "enemy" ||
    introScreenTile.tileType === "Enemy" ||
    introScreenTile.typeOverride === "Enemy" ||
    (introScreenTile.sprite && introScreenTile.sprite.source === "enemy")
  ));
}

function introScreenIsYamlShopTile(introScreenTile) {
  return Boolean(introScreenTile && introScreenTile.type === "shop");
}

function introScreenIsYamlPostgameDestructible(introScreenTile) {
  var introScreenVulnerabilities = (introScreenTile.vulnerable || []).map(introScreenNormalizeYamlKey);

  if (!introScreenVulnerabilities.length) {
    return false;
  }

  return introScreenVulnerabilities.every(function (introScreenVulnerability) {
    return introScreenVulnerability === "tank" ||
      introScreenVulnerability === "tanktreads" ||
      introScreenVulnerability === "tankcannon";
  });
}

function introScreenShouldCountYamlDrop(introScreenDrop, introScreenOptions) {
  var introScreenDropKey = introScreenNormalizeYamlDropBase(introScreenDrop);
  var introScreenDropLabel = introScreenGetYamlDropLabel(introScreenDropKey);

  if (!introScreenDropKey || introScreenDropKey === "empty") {
    return false;
  }

  if (introScreenDropKey === "itempool" || /^itempool\d+$/.test(introScreenDropKey)) {
    return Boolean(introScreenOptions.otherPlayersCanFindItemPoolDrops);
  }

  if (introScreenIsYamlTrapDrop(introScreenDropKey)) {
    return Boolean(introScreenOptions.shuffleEssentialItems);
  }

  if (introScreenDropKey === "hp" || introScreenDropKey === "rounds") {
    return introScreenOptions.shuffleMaxResourceUpgrades;
  }

  if (introScreenIsYamlEssentialDrop(introScreenDropKey)) {
    return introScreenOptions.shuffleEssentialItems;
  }

  return true;
}

function introScreenShouldCountYamlFixedShopDrop(introScreenDrop, introScreenOptions) {
  var introScreenDropKey = introScreenNormalizeYamlDropBase(introScreenDrop);

  if (!introScreenDropKey || introScreenDropKey === "empty") {
    return false;
  }

  if (introScreenDropKey === "hp" || introScreenDropKey === "rounds") {
    return introScreenShouldCountYamlDrop(introScreenDrop, introScreenOptions);
  }

  return introScreenIsYamlEssentialDrop(introScreenDropKey) &&
    introScreenShouldCountYamlDrop(introScreenDrop, introScreenOptions);
}

function introScreenNormalizeYamlDropBase(introScreenDrop) {
  var introScreenDropKey = String(introScreenDrop || "").replace(/\s+/g, "");
  var introScreenMatch = introScreenDropKey.match(/^([a-zA-Z]+)\d+$/);

  if (introScreenMatch && globalsState.progressiveCheckDefinitions[introScreenMatch[1]]) {
    introScreenDropKey = introScreenMatch[1];
  }

  return introScreenNormalizeYamlKey(introScreenDropKey);
}

function introScreenNormalizeYamlKey(introScreenValue) {
  return String(introScreenValue || "").replace(/[^a-z0-9]+/gi, "").toLowerCase();
}

function introScreenGetYamlDropLabel(introScreenDropKey) {
  var introScreenProgressiveLabels = {
    graphics: "Graphics",
    progressiveroom: "Progressive Room",
    bomb: "Bombs",
    gun: "Gun",
    fire: "Fire",
    sword: "Sword",
    pickaxe: "Pickaxe",
    waterwalkers: "Water Walkers",
    tanktreads: "Tank Treads",
    tankchassis: "Tank Chassis",
    tankcannon: "Tank Cannon",
    sfx: "SFX",
    bgm: "BGM",
    hp: "Max HP",
    rounds: "Max Rounds",
    trapstun: "Stun Trap",
    trapinvisible: "Invisible Trap",
    trapfast: "Fast Trap",
    trapslow: "Slow Trap",
    trapreverse: "Reverse Trap",
    trapscreenflip: "Screen Flip Trap",
    trapzoom: "Zoom In Trap",
    trapdeath: "Instant Death Trap",
    suddenlysnake: "Snake Trap"
  };

  return introScreenProgressiveLabels[introScreenDropKey] || introScreenDropKey;
}

function introScreenIsYamlTrapDrop(introScreenDropKey) {
  return /^trap/.test(introScreenDropKey) || introScreenDropKey === "suddenlysnake";
}

function introScreenIsYamlEssentialDrop(introScreenDropKey) {
  return [
    "graphics",
    "progressiveroom",
    "bomb",
    "gun",
    "fire",
    "sword",
    "pickaxe",
    "waterwalkers",
    "tanktreads",
    "tankchassis",
    "tankcannon",
    "sfx",
    "bgm"
  ].indexOf(introScreenDropKey) >= 0;
}

function introScreenGetCheckedValues(introScreenName) {
  return Array.from(introScreenRoot.querySelectorAll("input[name='" + introScreenName + "']:checked")).map(function (introScreenInput) {
    return introScreenInput.value;
  });
}

function introScreenShowMapEditor() {
  shardManagerLoadShard("mapEditor").then(function (introScreenHtml) {
    introScreenSetContent(introScreenHtml);
    document.body.classList.add("is-map-editor");
    introScreenRoot.querySelector("#map-back").addEventListener("click", introScreenShowConnection);
    mapEditorStart();
  });
}

function introScreenStartOffline(introScreenShouldLoadSave) {
  globalsState.archipelago.connected = false;
  globalsState.offlineSaveKey = introScreenOfflineSaveKey;
  globalsState.offlineSaveVersion = introScreenOfflineSaveVersion;
  globalsState.shouldLoadOfflineSave = Boolean(introScreenShouldLoadSave);
  document.body.classList.remove("is-map-editor");
  introScreenRoot.remove();
  initialRoomStart();
}

function introScreenSubmitConnection(introScreenEvent) {
  var introScreenForm = introScreenEvent.currentTarget;
  var introScreenFields = introScreenForm.elements;
  var introScreenStatus = introScreenRoot.querySelector("#connection-status");
  var introScreenSubmitButton = introScreenRoot.querySelector(".primary-button");
  var introScreenConnectionInfo = {
    host: introScreenFields.host.value.trim() || introScreenDefaultHost,
    port: introScreenFields.port.value.trim() || introScreenDefaultPort,
    slot: introScreenFields.slot.value.trim(),
    password: introScreenFields.password.value,
    legacyAsyncSeedName: introScreenLegacyAsyncSeedName
  };

  introScreenEvent.preventDefault();
  introScreenSaveConnection(introScreenConnectionInfo);

  introScreenStatus.textContent = "Connecting...";
  introScreenSubmitButton.disabled = true;

  archipelagoClientConnect(introScreenConnectionInfo)
    .then(function (introScreenPacket) {
      if (introScreenPacket && introScreenPacket.cmd === "LegacyAsyncRedirect") {
        introScreenStatus.textContent = "Jam Async connection detected, loading v 1.1...";
        introScreenLoadLegacyAsync();
        return;
      }

      introScreenRoot.remove();
      initialRoomStart();
    })
    .catch(function (introScreenError) {
      console.error(introScreenError);
      introScreenStatus.textContent = introScreenError.message;
      introScreenSubmitButton.disabled = false;
    });
}

globalsState.loadedModules.push("introScreen");
globalsState.deviceMode = "desktop";
introScreenShowConnection();
