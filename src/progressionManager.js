function progressionManagerCanCollect(progressionManagerCheckKey) {
  var progressionManagerDefinition = globalsState.checkDefinitions[progressionManagerCheckKey];
  var progressionManagerCanCollectCheck = true;

  if (!progressionManagerDefinition) {
    return false;
  }

  progressionManagerDefinition.requires.forEach(function (progressionManagerRequiredKey) {
    if (!progressionManagerHasRequirement(progressionManagerRequiredKey)) {
      progressionManagerCanCollectCheck = false;
    }
  });

  return progressionManagerCanCollectCheck;
}

function progressionManagerCanReceive(progressionManagerCheckKey) {
  return Boolean(globalsState.checkDefinitions[progressionManagerCheckKey] || globalsState.progressiveCheckDefinitions[progressionManagerCheckKey]);
}

function progressionManagerHasRequirement(progressionManagerRequirementKey) {
  var progressionManagerParts = String(progressionManagerRequirementKey).split(":");

  if (progressionManagerRequirementKey === "tank") {
    return Boolean(
      globalsState.progression.tankTreads &&
      globalsState.progression.tankChassis &&
      globalsState.progression.tankCannon
    );
  }

  if (progressionManagerParts.length === 2) {
    var progressionManagerRequiredLevel = Number(progressionManagerParts[1]) || 1;

    if (globalsState.progressiveCheckDefinitions[progressionManagerParts[0]]) {
      progressionManagerRequiredLevel = Math.max(1, progressionManagerRequiredLevel);
    }

    return progressionManagerGetProgressiveValue(progressionManagerParts[0]) >= progressionManagerRequiredLevel;
  }

  return Boolean(globalsState.progression[progressionManagerRequirementKey]);
}

function progressionManagerIsProgressiveRoomCheck(progressionManagerCheckKey) {
  return /^progressiveRoom\d+$/.test(progressionManagerCheckKey);
}

function progressionManagerGetProgressiveRoomRing(progressionManagerCheckKey) {
  return Number(progressionManagerCheckKey.replace("progressiveRoom", ""));
}

function progressionManagerIsGraphicsCheck(progressionManagerCheckKey) {
  return /^graphics\d+$/.test(progressionManagerCheckKey) || progressionManagerCheckKey === "graphics";
}

function progressionManagerGetProgressiveCheckBase(progressionManagerCheckKey) {
  if (globalsState.progressiveCheckDefinitions[progressionManagerCheckKey]) {
    return progressionManagerCheckKey;
  }

  var progressionManagerMatch = String(progressionManagerCheckKey).match(/^([a-zA-Z]+)(\d+)$/);

  if (!progressionManagerMatch || !globalsState.progressiveCheckDefinitions[progressionManagerMatch[1]]) {
    return "";
  }

  return progressionManagerMatch[1];
}

function progressionManagerGetProgressiveValue(progressionManagerProgressiveKey) {
  if (progressionManagerProgressiveKey === "graphics") {
    return globalsState.progression.graphicsLevel || 0;
  }

  if (progressionManagerProgressiveKey === "progressiveRoom") {
    return globalsState.progression.progressiveRooms || 0;
  }

  return globalsState.progression[progressionManagerProgressiveKey] || 0;
}

function progressionManagerAdvanceProgressiveRoom() {
  var progressionManagerNextRing = globalsState.progression.progressiveRooms + 1;

  if (progressionManagerNextRing > globalsState.progressiveRoomMaxRing) {
    return false;
  }

  globalsState.progression.progressiveRooms = progressionManagerNextRing;
  globalsState.progression["progressiveRoom" + progressionManagerNextRing] = true;
  globalsState.checks["progressiveRoom" + progressionManagerNextRing] = true;
  return true;
}

function progressionManagerAdvanceGraphicsLevel() {
  globalsState.progression.graphicsLevel = Math.min(3, (globalsState.progression.graphicsLevel || 0) + 1);
  globalsState.progression.graphics = globalsState.progression.graphicsLevel > 0;
  globalsState.checks.graphics = globalsState.progression.graphics;
  return globalsState.progression.graphicsLevel;
}

function progressionManagerAdvanceProgressiveCheck(progressionManagerProgressiveKey) {
  var progressionManagerDefinition = globalsState.progressiveCheckDefinitions[progressionManagerProgressiveKey];
  var progressionManagerCurrentValue = progressionManagerGetProgressiveValue(progressionManagerProgressiveKey);
  var progressionManagerNextValue = Math.min(progressionManagerDefinition.count, progressionManagerCurrentValue + 1);
  var progressionManagerIncrease = progressionManagerNextValue - progressionManagerCurrentValue;

  if (progressionManagerProgressiveKey === "graphics") {
    return progressionManagerAdvanceGraphicsLevel();
  }

  if (progressionManagerProgressiveKey === "progressiveRoom") {
    return progressionManagerAdvanceProgressiveRoom();
  }

  globalsState.progression[progressionManagerProgressiveKey] = progressionManagerNextValue;
  globalsState.checks[progressionManagerProgressiveKey] = progressionManagerNextValue > 0;
  progressionManagerApplyProgressiveResourceGain(progressionManagerProgressiveKey, progressionManagerIncrease);
  return progressionManagerNextValue;
}

function progressionManagerApplyProgressiveResourceGain(progressionManagerProgressiveKey, progressionManagerIncrease) {
  if (progressionManagerIncrease <= 0 || typeof initialRoomPlayer === "undefined") {
    return;
  }

  if (progressionManagerProgressiveKey === "hp") {
    initialRoomSyncPlayerResourceMaxes();
    initialRoomPlayer.hp = Math.min(initialRoomGetEffectiveMaxHp(), initialRoomPlayer.hp + progressionManagerIncrease);
    return;
  }

  if (progressionManagerProgressiveKey === "bomb" || progressionManagerProgressiveKey === "gun") {
    progressionManagerApplyWeaponRoundCapacityGain(progressionManagerProgressiveKey, progressionManagerIncrease);
    return;
  }

  if (progressionManagerProgressiveKey === "rounds") {
    initialRoomSyncPlayerResourceMaxes();
    initialRoomPlayer.rounds = Math.min(initialRoomPlayer.maxRounds, initialRoomPlayer.rounds + (progressionManagerIncrease * 2));
  }
}

function progressionManagerApplyWeaponRoundCapacityGain(progressionManagerProgressiveKey, progressionManagerIncrease) {
  var progressionManagerCurrentValue = progressionManagerGetProgressiveValue(progressionManagerProgressiveKey);
  var progressionManagerPreviousValue = Math.max(0, progressionManagerCurrentValue - progressionManagerIncrease);
  var progressionManagerRoundIncrease = progressionManagerPreviousValue <= 0 && progressionManagerCurrentValue > 0 ? 5 : 0;

  initialRoomSyncPlayerResourceMaxes();
  if (progressionManagerRoundIncrease > 0) {
    initialRoomPlayer.rounds = Math.min(initialRoomPlayer.maxRounds, initialRoomPlayer.rounds + progressionManagerRoundIncrease);
  }
}

function progressionManagerCollect(progressionManagerCheckKey) {
  if (!progressionManagerCanCollect(progressionManagerCheckKey) || globalsState.locations[progressionManagerCheckKey].checked) {
    return false;
  }

  progressionManagerApplyReward(progressionManagerCheckKey);
  globalsState.locations[progressionManagerCheckKey].checked = true;
  if (typeof initialRoomSaveOfflineProgress === "function") {
    initialRoomSaveOfflineProgress();
  }
  return true;
}

function progressionManagerCollectLocation(progressionManagerLocationKey, progressionManagerRewardKey) {
  var progressionManagerLocation = globalsState.locations[progressionManagerLocationKey];
  var progressionManagerReward = progressionManagerRewardKey || progressionManagerLocationKey;

  if (!progressionManagerLocation || progressionManagerLocation.checked || !progressionManagerCanReceive(progressionManagerReward)) {
    return false;
  }

  progressionManagerApplyReward(progressionManagerReward);
  progressionManagerLocation.checked = true;
  if (typeof initialRoomSaveOfflineProgress === "function") {
    initialRoomSaveOfflineProgress();
  }
  return true;
}

function progressionManagerApplyReward(progressionManagerCheckKey) {
  if (globalsState.checkDefinitions[progressionManagerCheckKey] && globalsState.checkDefinitions[progressionManagerCheckKey].trap) {
    if (typeof initialRoomApplyTrap === "function") {
      initialRoomApplyTrap(progressionManagerCheckKey);
    }
    return;
  }

  if (progressionManagerIsProgressiveRoomCheck(progressionManagerCheckKey)) {
    globalsState.progression.progressiveRooms = Math.max(globalsState.progression.progressiveRooms, progressionManagerGetProgressiveRoomRing(progressionManagerCheckKey));
    return;
  }

  var progressionManagerProgressiveBase = progressionManagerGetProgressiveCheckBase(progressionManagerCheckKey);

  if (progressionManagerProgressiveBase) {
    progressionManagerAdvanceProgressiveCheck(progressionManagerProgressiveBase);
  } else {
    globalsState.progression[progressionManagerCheckKey] = true;
    globalsState.checks[progressionManagerCheckKey] = true;
  }
}

function progressionManagerGetCheckOptions() {
  return Object.keys(globalsState.checkDefinitions).map(function (progressionManagerCheckKey) {
    return {
      key: progressionManagerCheckKey,
      label: globalsState.checkDefinitions[progressionManagerCheckKey].label
    };
  });
}

globalsState.loadedModules.push("progressionManager");
