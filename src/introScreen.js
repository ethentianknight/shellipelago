var introScreenRoot = document.createElement("div");
var introScreenStorageKey = "shellipelagoConnectionInfo";
var introScreenYamlSettingsStorageKey = "shellipelagoYamlSettings";
var introScreenDefaultHost = "archipelago.gg";
var introScreenDefaultPort = "38281";
var introScreenOfflineSaveKey = "shellipelagoOfflineSave";
var introScreenOfflineSaveVersion = "1.1";
var introScreenYamlMapLoadPromise = null;

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
  var introScreenPostGameChecks = introScreenRoot.querySelector("input[name='addEndgameDestructibleChecks']");

  introScreenLoadSavedYamlSettings();

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

  if (introScreenPostGameChecks) {
    introScreenPostGameChecks.addEventListener("change", function () {
      if (!introScreenPostGameChecks.checked) {
        return;
      }

      introScreenPostGameChecks.checked = false;
      introScreenConfirmPostGameChecks().then(function (introScreenConfirmed) {
        introScreenPostGameChecks.checked = introScreenConfirmed;
        introScreenUpdateYamlCheckCounter();
      });
    });
  }

  if (introScreenYamlUpload) {
    introScreenYamlUpload.addEventListener("change", introScreenHandleYamlUpload);
  }

  introScreenRoot.querySelector("#yaml-download-default").addEventListener("click", introScreenDownloadDefaultYaml);
  introScreenRoot.querySelector("#yaml-reset-default").addEventListener("click", introScreenResetYamlToDefault);
  introScreenForm.addEventListener("input", function () {
    introScreenUpdateYamlCheckCounter();
    introScreenSaveYamlSettings();
  });
  introScreenForm.addEventListener("change", function () {
    introScreenUpdateYamlCheckCounter();
    introScreenSaveYamlSettings();
  });
  introScreenEnsureYamlMapLoaded().then(introScreenUpdateYamlCheckCounter);
  introScreenRoot.querySelector("#yaml-back").addEventListener("click", introScreenShowConnection);
  introScreenForm.addEventListener("submit", introScreenSubmitYaml);
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
  introScreenDefaultOptions = introScreenGetYamlOptions(introScreenForm.elements, "Player");
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
  var introScreenInShellipelago = false;

  introScreenLines.forEach(function (introScreenLine) {
    var introScreenNoComment = introScreenLine.replace(/\s+#.*$/, "");
    var introScreenTrimmed = introScreenNoComment.trim();
    var introScreenKeyMatch = null;
    var introScreenListMatch = null;

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
      return;
    }

    if (!introScreenInShellipelago) {
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
    if (!introScreenYamlKeyMap[introScreenKeyMatch[1]]) {
      return;
    }

    if (!introScreenKeyMatch[2]) {
      introScreenCurrentListKey = introScreenYamlKeyMap[introScreenKeyMatch[1]];
      introScreenOptions[introScreenCurrentListKey] = [];
      return;
    }

    introScreenOptions[introScreenYamlKeyMap[introScreenKeyMatch[1]]] = introScreenParseYamlScalar(introScreenKeyMatch[2]);
  });

  return introScreenOptions;
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
    goal: "goal",
    shuffle_essential_items: "shuffleEssentialItems",
    essential_items_in_my_world: "essentialLocal",
    essential_items_in_other_worlds: "essentialNonLocal",
    shuffle_max_resource_upgrades: "shuffleMaxResourceUpgrades",
    max_resource_upgrades_in_my_world: "resourceLocal",
    max_resource_upgrades_in_other_worlds: "resourceNonLocal",
    add_easy_destructible_checks: "addEasyDestructibleChecks",
    add_endgame_destructible_checks: "addEndgameDestructibleChecks",
    enemies_are_checks: "enemiesAreChecks",
    shuffle_shops: "shuffleShops",
    add_hints_to_checks: "addHintsToChecks",
    show_essential_pickup_hints: "showEssentialPickupHints",
    include_hint_locations: "includeHintLocations",
    hint_locations: "hintLocations",
    add_traps_to_pool: "addTrapsToPool",
    trap_pool_spawn: "trapPoolSpawn",
    trap_pool_in_my_world: "trapPoolLocal",
    trap_pool_in_other_worlds: "trapPoolNonLocal",
    other_players_can_find_item_pool_drops: "otherPlayersCanFindItemPoolDrops",
    ring_link: "ringLink",
    energy_link: "energyLink",
    death_link: "deathLink",
    trap_link: "trapLink",
    trap_link_spawn: "trapLinkSpawn",
    trap_link_in_my_world: "trapLinkLocal",
    trap_link_in_other_worlds: "trapLinkNonLocal",
    item_link: "itemLink"
  };
}

function introScreenApplyYamlOptionsToForm(introScreenOptions) {
  var introScreenForm = introScreenRoot.querySelector("#yaml-form");
  var introScreenFields = introScreenForm ? introScreenForm.elements : null;

  if (!introScreenFields || !introScreenOptions) {
    return;
  }

  Object.keys(introScreenOptions).forEach(function (introScreenOptionKey) {
    if (Array.isArray(introScreenOptions[introScreenOptionKey])) {
      introScreenSetYamlCheckboxGroup(introScreenOptionKey, introScreenOptions[introScreenOptionKey]);
      return;
    }

    introScreenSetYamlField(introScreenFields, introScreenOptionKey, introScreenOptions[introScreenOptionKey]);
  });

  introScreenRoot.querySelectorAll("#yaml-form input[data-controls]").forEach(introScreenSyncYamlControlledFields);
  introScreenUpdateYamlRangeOutput();
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

  if (introScreenProgressionBalancing && introScreenProgressionBalancingValue) {
    introScreenSetProgressionBalancingValue(introScreenProgressionBalancing.value);
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

function introScreenConfirmPostGameChecks() {
  return new Promise(function (introScreenResolve) {
    var introScreenBackdrop = document.createElement("div");
    var introScreenModal = document.createElement("div");
    var introScreenTitle = document.createElement("h2");
    var introScreenMessage = document.createElement("p");
    var introScreenActions = document.createElement("div");
    var introScreenConfirm = document.createElement("button");
    var introScreenCancel = document.createElement("button");

    function introScreenClose(introScreenResult) {
      document.removeEventListener("keydown", introScreenHandleKeydown);
      introScreenBackdrop.remove();
      introScreenResolve(introScreenResult);
    }

    function introScreenHandleKeydown(introScreenEvent) {
      if (introScreenEvent.key === "Escape") {
        introScreenClose(false);
      }
    }

    introScreenBackdrop.className = "map-check-modal-backdrop";
    introScreenModal.className = "map-check-modal";
    introScreenActions.className = "map-check-modal-actions";
    introScreenConfirm.className = "primary-button";
    introScreenCancel.className = "secondary-button";

    introScreenTitle.textContent = "Are you sure?";
    introScreenMessage.textContent = "This is a debug feature and will hold other games hostage.";
    introScreenConfirm.textContent = "Yes, I am a bad person";
    introScreenCancel.textContent = "cancel";
    introScreenConfirm.type = "button";
    introScreenCancel.type = "button";

    introScreenConfirm.addEventListener("click", function () {
      introScreenClose(true);
    });
    introScreenCancel.addEventListener("click", function () {
      introScreenClose(false);
    });
    introScreenBackdrop.addEventListener("click", function (introScreenEvent) {
      if (introScreenEvent.target === introScreenBackdrop) {
        introScreenClose(false);
      }
    });
    document.addEventListener("keydown", introScreenHandleKeydown);

    introScreenActions.appendChild(introScreenCancel);
    introScreenActions.appendChild(introScreenConfirm);
    introScreenModal.appendChild(introScreenTitle);
    introScreenModal.appendChild(introScreenMessage);
    introScreenModal.appendChild(introScreenActions);
    introScreenBackdrop.appendChild(introScreenModal);
    document.body.appendChild(introScreenBackdrop);
    introScreenCancel.focus();
  });
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

  downloadManagerDownloadText(
    introScreenFileName + ".yaml",
    downloadManagerBuildYaml(introScreenGetYamlOptions(introScreenFields, introScreenSlot))
  );
  introScreenStatus.textContent = "YAML created for " + introScreenSlot + ".";
}

function introScreenGetYamlOptions(introScreenFields, introScreenSlot) {
  return {
    slot: introScreenSlot,
    progressionBalancing: introScreenFields.progressionBalancing.value,
    goal: introScreenFields.goal.value,
    shuffleEssentialItems: introScreenFields.shuffleEssentialItems.checked,
    essentialLocal: introScreenGetCheckedValues("essentialLocal"),
    essentialNonLocal: introScreenGetCheckedValues("essentialNonLocal"),
    shuffleMaxResourceUpgrades: introScreenFields.shuffleMaxResourceUpgrades.checked,
    resourceLocal: introScreenGetCheckedValues("resourceLocal"),
    resourceNonLocal: introScreenGetCheckedValues("resourceNonLocal"),
    addEasyDestructibleChecks: introScreenFields.addEasyDestructibleChecks.checked,
    addEndgameDestructibleChecks: introScreenFields.addEndgameDestructibleChecks.checked,
    enemiesAreChecks: introScreenFields.enemiesAreChecks.checked,
    shuffleShops: introScreenFields.shuffleShops.checked,
    addHintsToChecks: introScreenFields.addHintsToChecks.checked,
    showEssentialPickupHints: introScreenFields.showEssentialPickupHints.checked,
    includeHintLocations: introScreenFields.includeHintLocations.checked,
    hintLocations: introScreenGetCheckedValues("hintLocations"),
    addTrapsToPool: introScreenFields.addTrapsToPool.checked,
    trapPoolSpawn: introScreenGetCheckedValues("trapPoolSpawn"),
    trapPoolLocal: introScreenGetCheckedValues("trapPoolLocal"),
    trapPoolNonLocal: introScreenGetCheckedValues("trapPoolNonLocal"),
    otherPlayersCanFindItemPoolDrops: introScreenFields.otherPlayersCanFindItemPoolDrops.checked,
    ringLink: introScreenFields.ringLink.checked,
    energyLink: introScreenFields.energyLink.checked,
    deathLink: introScreenFields.deathLink.checked,
    trapLink: introScreenFields.trapLink.checked,
    trapLinkSpawn: introScreenGetCheckedValues("trapLinkSpawn"),
    trapLinkLocal: introScreenGetCheckedValues("trapLinkLocal"),
    trapLinkNonLocal: introScreenGetCheckedValues("trapLinkNonLocal"),
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
  introScreenSetYamlCount("yaml-postgame-checks", introScreenCounts.postgameDestructibles);
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
    postgameDestructibles: 0,
    enemies: 0,
    shops: 0,
    hints: 0,
    total: 0,
    hintCandidates: {
      chests: 0,
      easyDestructibles: 0,
      postgameDestructibles: 0,
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
          introScreenCounts.hintCandidates.postgameDestructibles += 1;

          if (introScreenOptions.addEndgameDestructibleChecks) {
            introScreenCounts.postgameDestructibles += 1;
          }
        } else {
          introScreenCounts.hintCandidates.easyDestructibles += 1;

          if (introScreenOptions.addEasyDestructibleChecks) {
            introScreenCounts.easyDestructibles += 1;
          }
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
    introScreenCounts.postgameDestructibles +
    introScreenCounts.enemies +
    introScreenCounts.shops;
  introScreenCounts.hints = introScreenCalculateYamlHintCount(introScreenCounts, introScreenOptions);
  return introScreenCounts;
}

function introScreenCalculateYamlHintCount(introScreenCounts, introScreenOptions) {
  var introScreenHintCount = 0;
  var introScreenHintLocations = introScreenOptions.includeHintLocations ? introScreenOptions.hintLocations : [];
  var introScreenHintCandidates = introScreenCounts.hintCandidates || introScreenCounts;

  if (introScreenHintLocations.indexOf("Chests") >= 0) {
    introScreenHintCount += introScreenHintCandidates.chests;
  }

  if (introScreenHintLocations.indexOf("Easy Checks") >= 0) {
    introScreenHintCount += introScreenHintCandidates.easyDestructibles;
  }

  if (introScreenHintLocations.indexOf("Enemies") >= 0) {
    introScreenHintCount += introScreenHintCandidates.enemies;
  }

  if (introScreenHintLocations.indexOf("Post Game Checks") >= 0) {
    introScreenHintCount += introScreenHintCandidates.postgameDestructibles;
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
    return introScreenOptions.shuffleMaxResourceUpgrades &&
      (introScreenOptions.resourceLocal.indexOf(introScreenDropLabel) >= 0 || introScreenOptions.resourceNonLocal.indexOf(introScreenDropLabel) >= 0);
  }

  if (introScreenIsYamlEssentialDrop(introScreenDropKey)) {
    return introScreenOptions.shuffleEssentialItems &&
      (introScreenOptions.essentialLocal.indexOf(introScreenDropLabel) >= 0 || introScreenOptions.essentialNonLocal.indexOf(introScreenDropLabel) >= 0);
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
    trapzoom: "Zoom Trap",
    trapdeath: "Death Trap",
    suddenlysnake: "Suddenly Snake"
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
    password: introScreenFields.password.value
  };

  introScreenEvent.preventDefault();
  introScreenSaveConnection(introScreenConnectionInfo);
  introScreenStatus.textContent = "Connecting...";
  introScreenSubmitButton.disabled = true;

  archipelagoClientConnect(introScreenConnectionInfo)
    .then(function () {
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
