var archipelagoClientGame = "Shellipelago";
var archipelagoClientVersion = {
  major: 0,
  minor: 6,
  build: 7,
  class: "Version"
};
var archipelagoClientSessionId = "shellipelago-session-" + Date.now() + "-" + Math.random().toString(16).slice(2);
var archipelagoClientItemIdToCheckKeys = {
  100000: ["graphics"],
  100001: ["freeGrid"],
  100002: [
    "progressiveRoom1",
    "progressiveRoom2",
    "progressiveRoom3",
    "progressiveRoom4",
    "progressiveRoom5"
  ]
};

if (typeof archipelagoGeneratedItemIdToCheckKeys !== "undefined") {
  archipelagoClientItemIdToCheckKeys = archipelagoGeneratedItemIdToCheckKeys;
}

function archipelagoClientGetUuid() {
  var archipelagoClientStorageKey = "shellipelagoClientUuid";
  var archipelagoClientUuid = localStorage.getItem(archipelagoClientStorageKey);

  if (!archipelagoClientUuid) {
    archipelagoClientUuid = "shellipelago-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    localStorage.setItem(archipelagoClientStorageKey, archipelagoClientUuid);
  }

  return archipelagoClientUuid;
}

function archipelagoClientBuildUrl(archipelagoClientConnectionInfo) {
  return archipelagoClientBuildUrls(archipelagoClientConnectionInfo)[0];
}

function archipelagoClientBuildUrls(archipelagoClientConnectionInfo) {
  var archipelagoClientHost = (archipelagoClientConnectionInfo.host || "archipelago.gg").trim();
  var archipelagoClientPort = archipelagoClientConnectionInfo.port.trim();
  var archipelagoClientHasPort = archipelagoClientHost.indexOf(":") !== -1;
  var archipelagoClientHostWithPort = archipelagoClientHasPort ?
    archipelagoClientHost :
    archipelagoClientHost + ":" + archipelagoClientPort;

  if (/^wss?:\/\//i.test(archipelagoClientHost)) {
    return [archipelagoClientHost];
  }

  if (/^https?:\/\//i.test(archipelagoClientHost)) {
    var archipelagoClientExplicitUrl = archipelagoClientHost.replace(/^http/i, "ws");
    var archipelagoClientExplicitFallback = archipelagoClientExplicitUrl.replace(/^wss:/i, "ws:");

    if (archipelagoClientExplicitFallback === archipelagoClientExplicitUrl) {
      archipelagoClientExplicitFallback = archipelagoClientExplicitUrl.replace(/^ws:/i, "wss:");
    }

    return archipelagoClientUniqueUrls([
      archipelagoClientExplicitUrl,
      archipelagoClientExplicitFallback
    ]);
  }

  if (archipelagoClientShouldUsePlainWebSocket(archipelagoClientHost)) {
    return archipelagoClientUniqueUrls([
      "ws://" + archipelagoClientHostWithPort,
      "wss://" + archipelagoClientHostWithPort
    ]);
  }

  return archipelagoClientUniqueUrls([
    "wss://" + archipelagoClientHostWithPort,
    "ws://" + archipelagoClientHostWithPort
  ]);
}

function archipelagoClientUniqueUrls(archipelagoClientUrls) {
  var archipelagoClientSeenUrls = {};

  return archipelagoClientUrls.filter(function (archipelagoClientUrl) {
    if (!archipelagoClientUrl || archipelagoClientSeenUrls[archipelagoClientUrl]) {
      return false;
    }

    archipelagoClientSeenUrls[archipelagoClientUrl] = true;
    return true;
  });
}

function archipelagoClientShouldUsePlainWebSocket(archipelagoClientHost) {
  var archipelagoClientCleanHost = String(archipelagoClientHost || "")
    .trim()
    .replace(/^wss?:\/\//i, "")
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "");

  if (/^\[?::1\]?(:\d+)?$/i.test(archipelagoClientCleanHost)) {
    return true;
  }

  archipelagoClientCleanHost = archipelagoClientCleanHost
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(":")[0]
    .toLowerCase();

  return archipelagoClientCleanHost === "localhost" ||
    archipelagoClientCleanHost === "127.0.0.1" ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(archipelagoClientCleanHost);
}

function archipelagoClientSend(archipelagoClientSocket, archipelagoClientPacket) {
  archipelagoClientSocket.send(JSON.stringify([archipelagoClientPacket]));
}

function archipelagoClientNormalizeIdList(archipelagoClientIds) {
  return (archipelagoClientIds || []).map(function (archipelagoClientId) {
    return Number(archipelagoClientId);
  }).filter(function (archipelagoClientId) {
    return !Number.isNaN(archipelagoClientId);
  });
}

function archipelagoClientHasCheckedLocation(archipelagoClientLocationId) {
  var archipelagoClientTargetId = Number(archipelagoClientLocationId);

  return globalsState.archipelago.checkedLocations.indexOf(archipelagoClientTargetId) !== -1;
}

function archipelagoClientHasMissingLocation(archipelagoClientLocationId) {
  var archipelagoClientTargetId = Number(archipelagoClientLocationId);

  return globalsState.archipelago.missingLocations.indexOf(archipelagoClientTargetId) !== -1;
}

function archipelagoClientSendChatMessage(archipelagoClientText) {
  if (!archipelagoClientText || !globalsState.archipelago.connected || !globalsState.archipelago.socket) {
    return false;
  }

  if (globalsState.archipelago.socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  archipelagoClientSend(globalsState.archipelago.socket, {
    cmd: "Say",
    text: archipelagoClientText
  });

  return true;
}

function archipelagoClientSendGoal() {
  if (!globalsState.archipelago.connected || !globalsState.archipelago.socket || globalsState.archipelago.goalSent) {
    return false;
  }

  if (globalsState.archipelago.socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  globalsState.archipelago.goalSent = true;
  archipelagoClientSend(globalsState.archipelago.socket, {
    cmd: "StatusUpdate",
    status: 30
  });

  return true;
}

function archipelagoClientMaybeSendBuildTankGoal() {
  var archipelagoClientSlotData = globalsState.archipelago.slotData || {};
  var archipelagoClientGoal = archipelagoClientSlotData.goal || archipelagoClientSlotData.Goal;

  if (archipelagoClientGoal !== "build_tank" && archipelagoClientGoal !== "option_build_tank" && Number(archipelagoClientGoal) !== 1) {
    return false;
  }

  if (!progressionManagerHasRequirement("tank")) {
    return false;
  }

  return archipelagoClientSendGoal();
}

function archipelagoClientBuildTags() {
  var archipelagoClientTags = ["AP"];
  var archipelagoClientSlotData = globalsState.archipelago.slotData || {};

  if (archipelagoClientSlotData.death_link || archipelagoClientSlotData.deathLink) {
    archipelagoClientTags.push("DeathLink");
  }

  if (archipelagoClientSlotData.energy_link || archipelagoClientSlotData.energyLink) {
    archipelagoClientTags.push("EnergyLink");
  }

  if (archipelagoClientSlotData.ring_link || archipelagoClientSlotData.ringLink) {
    archipelagoClientTags.push("RingLink");
  }

  if (archipelagoClientSlotData.item_link || archipelagoClientSlotData.itemLink) {
    archipelagoClientTags.push("ItemLink");
  }

  if (archipelagoClientSlotData.trap_link || archipelagoClientSlotData.trapLink) {
    archipelagoClientTags.push("TrapLink");
  }

  return archipelagoClientTags;
}

function archipelagoClientSendBounce(archipelagoClientTag, archipelagoClientData) {
  if (!globalsState.archipelago.connected || !globalsState.archipelago.socket || globalsState.archipelago.socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  if (archipelagoClientData && archipelagoClientData.eventId) {
    globalsState.archipelago.linkEvents[archipelagoClientData.eventId] = true;
  }

  archipelagoClientSend(globalsState.archipelago.socket, {
    cmd: "Bounce",
    tags: [archipelagoClientTag],
    data: Object.assign({
      source: globalsState.archipelago.slot || "Shellipelago",
      clientUuid: archipelagoClientGetUuid(),
      clientSessionId: archipelagoClientSessionId,
      slot: globalsState.archipelago.slotId,
      time: Date.now() / 1000
    }, archipelagoClientData || {})
  });

  return true;
}

function archipelagoClientSendDeathLink(archipelagoClientCause, archipelagoClientEventId) {
  var archipelagoClientDidSend = archipelagoClientSendBounce("DeathLink", {
    eventId: archipelagoClientEventId,
    source: globalsState.archipelago.slot || "Shellipelago",
    cause: archipelagoClientCause,
    time: Date.now() / 1000
  });
  var archipelagoClientChatCause = archipelagoClientStripPlayerPrefix(archipelagoClientCause);

  if (archipelagoClientDidSend) {
    archipelagoClientSendChatMessage(archipelagoClientChatCause + " (DeathLink)");
  }

  return archipelagoClientDidSend;
}

function archipelagoClientStripPlayerPrefix(archipelagoClientText) {
  var archipelagoClientPlayerName = globalsState.archipelago.slot || "";
  var archipelagoClientTextString = String(archipelagoClientText || "");
  var archipelagoClientPrefixes = [
    archipelagoClientPlayerName + " ",
    archipelagoClientPlayerName + ": ",
    "[" + archipelagoClientPlayerName + "] ",
    "[" + archipelagoClientPlayerName + "]: "
  ];

  if (!archipelagoClientPlayerName) {
    return archipelagoClientTextString;
  }

  for (var archipelagoClientPrefixIndex = 0; archipelagoClientPrefixIndex < archipelagoClientPrefixes.length; archipelagoClientPrefixIndex += 1) {
    if (archipelagoClientTextString.indexOf(archipelagoClientPrefixes[archipelagoClientPrefixIndex]) === 0) {
      return archipelagoClientTextString.slice(archipelagoClientPrefixes[archipelagoClientPrefixIndex].length);
    }
  }

  return archipelagoClientTextString;
}

function archipelagoClientFormatPrintJson(archipelagoClientData) {
  if (!Array.isArray(archipelagoClientData)) {
    return "";
  }

  return archipelagoClientData.map(function (archipelagoClientPart) {
    if (typeof archipelagoClientPart === "string") {
      return archipelagoClientPart;
    }

    if (!archipelagoClientPart) {
      return "";
    }

    if (archipelagoClientPart.type === "item_id") {
      return archipelagoClientGetItemNameById(archipelagoClientPart.text, archipelagoClientPart.player) || archipelagoClientPart.text || "";
    }

    if (archipelagoClientPart.type === "location_id") {
      return archipelagoClientGetLocationNameById(archipelagoClientPart.text, archipelagoClientPart.player) || archipelagoClientPart.text || "";
    }

    if (archipelagoClientPart.type === "player_id") {
      return archipelagoClientGetPlayerNameById(archipelagoClientPart.text) || archipelagoClientPart.text || "";
    }

    return archipelagoClientPart.text || "";
  }).join("");
}

function archipelagoClientFormatRawServerText(archipelagoClientText) {
  return String(archipelagoClientText || "")
    .replace(/^(\d+)(?= found\b)/, function (archipelagoClientMatch, archipelagoClientPlayerId) {
      return archipelagoClientGetPlayerNameById(archipelagoClientPlayerId) || archipelagoClientMatch;
    })
    .replace(/\b(10\d{4})\b/g, function (archipelagoClientMatch) {
      return archipelagoClientGetItemNameById(archipelagoClientMatch) || archipelagoClientMatch;
    })
    .replace(/\((20\d{4})\)/g, function (archipelagoClientMatch, archipelagoClientLocationId) {
      var archipelagoClientLocationName = archipelagoClientGetLocationNameById(archipelagoClientLocationId);

      return archipelagoClientLocationName ? "(" + archipelagoClientLocationName + ")" : archipelagoClientMatch;
    });
}

function archipelagoClientGetItemNameById(archipelagoClientItemId, archipelagoClientPlayerId) {
  var archipelagoClientDataPackageItemName = archipelagoClientGetDataPackageNameByPlayerId(
    "item",
    archipelagoClientItemId,
    archipelagoClientPlayerId
  );
  var archipelagoClientGeneratedItemName = typeof archipelagoGeneratedItemIdToNames !== "undefined" ?
    (archipelagoGeneratedItemIdToNames[String(archipelagoClientItemId)] || archipelagoGeneratedItemIdToNames[Number(archipelagoClientItemId)]) :
    "";
  var archipelagoClientCheckKeys = archipelagoClientItemIdToCheckKeys[String(archipelagoClientItemId)] || archipelagoClientItemIdToCheckKeys[Number(archipelagoClientItemId)];
  var archipelagoClientCheckKey = archipelagoClientCheckKeys && archipelagoClientCheckKeys[0];
  var archipelagoClientProgressiveDefinition = archipelagoClientCheckKey ? globalsState.progressiveCheckDefinitions[archipelagoClientCheckKey] : null;
  var archipelagoClientCheckDefinition = archipelagoClientCheckKey ? globalsState.checkDefinitions[archipelagoClientCheckKey] : null;

  if (archipelagoClientDataPackageItemName) {
    return archipelagoClientDataPackageItemName;
  }

  if (archipelagoClientGeneratedItemName) {
    return archipelagoClientGeneratedItemName;
  }

  if (archipelagoClientProgressiveDefinition) {
    return archipelagoClientProgressiveDefinition.label;
  }

  if (archipelagoClientCheckDefinition) {
    return archipelagoClientCheckDefinition.label;
  }

  return archipelagoClientGetDataPackageNameByAnyGame("item", archipelagoClientItemId);
}

function archipelagoClientGetLocationNameById(archipelagoClientLocationId, archipelagoClientPlayerId) {
  var archipelagoClientDataPackageLocationName = archipelagoClientGetDataPackageNameByPlayerId(
    "location",
    archipelagoClientLocationId,
    archipelagoClientPlayerId
  );
  var archipelagoClientTargetId = Number(archipelagoClientLocationId);
  var archipelagoClientLocationName = "";

  if (archipelagoClientDataPackageLocationName) {
    return archipelagoClientDataPackageLocationName;
  }

  if (typeof archipelagoGeneratedLocationNameToId === "undefined") {
    return archipelagoClientGetDataPackageNameByAnyGame("location", archipelagoClientLocationId);
  }

  Object.keys(archipelagoGeneratedLocationNameToId).some(function (archipelagoClientGeneratedLocationName) {
    if (archipelagoGeneratedLocationNameToId[archipelagoClientGeneratedLocationName] === archipelagoClientTargetId) {
      archipelagoClientLocationName = archipelagoClientGeneratedLocationName;
      return true;
    }

    return false;
  });

  return archipelagoClientLocationName || archipelagoClientGetDataPackageNameByAnyGame("location", archipelagoClientLocationId);
}

function archipelagoClientBuildPlayerNames(archipelagoClientPacket, archipelagoClientConnectionInfo) {
  var archipelagoClientPlayerNames = {};

  if (archipelagoClientPacket && archipelagoClientPacket.slot_info) {
    Object.keys(archipelagoClientPacket.slot_info).forEach(function (archipelagoClientSlotId) {
      var archipelagoClientSlotInfo = archipelagoClientPacket.slot_info[archipelagoClientSlotId];
      var archipelagoClientSlotName = archipelagoClientSlotInfo && (archipelagoClientSlotInfo.name || archipelagoClientSlotInfo.alias);

      if (archipelagoClientSlotName) {
        archipelagoClientPlayerNames[String(archipelagoClientSlotId)] = archipelagoClientSlotName;
      }
    });
  }

  if (archipelagoClientPacket && Array.isArray(archipelagoClientPacket.players)) {
    archipelagoClientPacket.players.forEach(function (archipelagoClientPlayer) {
      var archipelagoClientSlotId = archipelagoClientPlayer && archipelagoClientPlayer.slot;
      var archipelagoClientPlayerName = archipelagoClientPlayer && (archipelagoClientPlayer.alias || archipelagoClientPlayer.name);

      if (archipelagoClientSlotId !== undefined && archipelagoClientPlayerName) {
        archipelagoClientPlayerNames[String(archipelagoClientSlotId)] = archipelagoClientPlayerName;
      }
    });
  }

  if (archipelagoClientPacket && archipelagoClientPacket.slot !== undefined && archipelagoClientConnectionInfo && archipelagoClientConnectionInfo.slot) {
    archipelagoClientPlayerNames[String(archipelagoClientPacket.slot)] = archipelagoClientConnectionInfo.slot;
  }

  return archipelagoClientPlayerNames;
}

function archipelagoClientBuildPlayerGames(archipelagoClientPacket) {
  var archipelagoClientPlayerGames = {};

  if (archipelagoClientPacket && archipelagoClientPacket.slot_info) {
    Object.keys(archipelagoClientPacket.slot_info).forEach(function (archipelagoClientSlotId) {
      var archipelagoClientSlotInfo = archipelagoClientPacket.slot_info[archipelagoClientSlotId];

      if (archipelagoClientSlotInfo && archipelagoClientSlotInfo.game) {
        archipelagoClientPlayerGames[String(archipelagoClientSlotId)] = archipelagoClientSlotInfo.game;
      }
    });
  }

  if (archipelagoClientPacket && Array.isArray(archipelagoClientPacket.players)) {
    archipelagoClientPacket.players.forEach(function (archipelagoClientPlayer) {
      if (archipelagoClientPlayer && archipelagoClientPlayer.slot !== undefined && archipelagoClientPlayer.game) {
        archipelagoClientPlayerGames[String(archipelagoClientPlayer.slot)] = archipelagoClientPlayer.game;
      }
    });
  }

  if (archipelagoClientPacket && archipelagoClientPacket.slot !== undefined) {
    archipelagoClientPlayerGames[String(archipelagoClientPacket.slot)] = archipelagoClientPlayerGames[String(archipelagoClientPacket.slot)] || archipelagoClientGame;
  }

  return archipelagoClientPlayerGames;
}

function archipelagoClientGetPlayerNameById(archipelagoClientPlayerId) {
  return globalsState.archipelago.playerNames[String(archipelagoClientPlayerId)] || "";
}

function archipelagoClientGetPlayerGameById(archipelagoClientPlayerId) {
  return globalsState.archipelago.playerGames[String(archipelagoClientPlayerId)] || "";
}

function archipelagoClientGetDataPackageNameByPlayerId(archipelagoClientNameType, archipelagoClientId, archipelagoClientPlayerId) {
  var archipelagoClientPlayerGame = archipelagoClientGetPlayerGameById(archipelagoClientPlayerId);

  if (!archipelagoClientPlayerGame) {
    return "";
  }

  return archipelagoClientGetDataPackageNameByGame(archipelagoClientNameType, archipelagoClientId, archipelagoClientPlayerGame);
}

function archipelagoClientGetDataPackageNameByGame(archipelagoClientNameType, archipelagoClientId, archipelagoClientGameName) {
  var archipelagoClientTables = globalsState.archipelago.dataPackage || {};
  var archipelagoClientNamesByGame = archipelagoClientNameType === "location" ?
    archipelagoClientTables.locationNamesByGame :
    archipelagoClientTables.itemNamesByGame;
  var archipelagoClientNamesById = archipelagoClientNamesByGame && archipelagoClientNamesByGame[archipelagoClientGameName];

  if (!archipelagoClientNamesById) {
    return "";
  }

  return archipelagoClientNamesById[String(archipelagoClientId)] || archipelagoClientNamesById[Number(archipelagoClientId)] || "";
}

function archipelagoClientGetDataPackageNameByAnyGame(archipelagoClientNameType, archipelagoClientId) {
  var archipelagoClientTables = globalsState.archipelago.dataPackage || {};
  var archipelagoClientNamesByGame = archipelagoClientNameType === "location" ?
    archipelagoClientTables.locationNamesByGame :
    archipelagoClientTables.itemNamesByGame;
  var archipelagoClientFoundName = "";

  if (!archipelagoClientNamesByGame) {
    return "";
  }

  Object.keys(archipelagoClientNamesByGame).some(function (archipelagoClientGameName) {
    var archipelagoClientName = archipelagoClientGetDataPackageNameByGame(
      archipelagoClientNameType,
      archipelagoClientId,
      archipelagoClientGameName
    );

    if (archipelagoClientName) {
      archipelagoClientFoundName = archipelagoClientName;
      return true;
    }

    return false;
  });

  return archipelagoClientFoundName;
}

function archipelagoClientReverseNameToIdTable(archipelagoClientNameToId) {
  var archipelagoClientIdToName = {};

  Object.keys(archipelagoClientNameToId || {}).forEach(function (archipelagoClientName) {
    archipelagoClientIdToName[String(archipelagoClientNameToId[archipelagoClientName])] = archipelagoClientName;
  });

  return archipelagoClientIdToName;
}

function archipelagoClientHandleDataPackage(archipelagoClientPacket) {
  var archipelagoClientGames = archipelagoClientPacket &&
    archipelagoClientPacket.data &&
    archipelagoClientPacket.data.games;

  if (!archipelagoClientGames) {
    return;
  }

  Object.keys(archipelagoClientGames).forEach(function (archipelagoClientGameName) {
    var archipelagoClientGamePackage = archipelagoClientGames[archipelagoClientGameName] || {};

    globalsState.archipelago.dataPackage.itemNamesByGame[archipelagoClientGameName] = archipelagoClientReverseNameToIdTable(archipelagoClientGamePackage.item_name_to_id);
    globalsState.archipelago.dataPackage.locationNamesByGame[archipelagoClientGameName] = archipelagoClientReverseNameToIdTable(archipelagoClientGamePackage.location_name_to_id);
  });
}

function archipelagoClientRequestDataPackage(archipelagoClientSocket) {
  var archipelagoClientSeenGames = {};
  var archipelagoClientGames = [];

  Object.keys(globalsState.archipelago.playerGames || {}).forEach(function (archipelagoClientPlayerId) {
    var archipelagoClientPlayerGame = globalsState.archipelago.playerGames[archipelagoClientPlayerId];

    if (archipelagoClientPlayerGame && !archipelagoClientSeenGames[archipelagoClientPlayerGame]) {
      archipelagoClientSeenGames[archipelagoClientPlayerGame] = true;
      archipelagoClientGames.push(archipelagoClientPlayerGame);
    }
  });

  if (archipelagoClientGames.length > 0) {
    archipelagoClientSend(archipelagoClientSocket, {
      cmd: "GetDataPackage",
      games: archipelagoClientGames
    });
  }
}

function archipelagoClientQueueServerMessage(archipelagoClientText) {
  if (!archipelagoClientText || typeof initialRoomQueueMessage !== "function") {
    return;
  }

  initialRoomQueueMessage(archipelagoClientFormatRawServerText(archipelagoClientText), { fromServer: true });
}

function archipelagoClientGetLocationById(archipelagoClientLocationId) {
  var archipelagoClientFoundLocation = null;

  Object.keys(globalsState.locations).forEach(function (archipelagoClientCheckKey) {
    var archipelagoClientLocation = globalsState.locations[archipelagoClientCheckKey];

    if (archipelagoClientLocation.id === archipelagoClientLocationId) {
      archipelagoClientFoundLocation = archipelagoClientLocation;
    }
  });

  return archipelagoClientFoundLocation;
}

function archipelagoClientMarkCheckedLocations(archipelagoClientLocationIds) {
  archipelagoClientLocationIds.forEach(function (archipelagoClientLocationId) {
    var archipelagoClientLocation = archipelagoClientGetLocationById(archipelagoClientLocationId);

    if (archipelagoClientLocation) {
      archipelagoClientLocation.checked = true;
    }
  });
}

function archipelagoClientResetOnlineProgressionForSync() {
  globalsState.archipelago.receivedItems = [];
  globalsState.archipelago.nextItemIndex = 0;
  globalsState.archipelago.linkEvents = {};
  globalsState.archipelago.goalSent = false;

  Object.keys(globalsState.locations).forEach(function (archipelagoClientLocationKey) {
    globalsState.locations[archipelagoClientLocationKey].checked = false;
  });

  Object.keys(globalsState.checks).forEach(function (archipelagoClientCheckKey) {
    globalsState.checks[archipelagoClientCheckKey] = false;
  });

  Object.keys(globalsState.progression).forEach(function (archipelagoClientProgressionKey) {
    if (typeof globalsState.progression[archipelagoClientProgressionKey] === "number") {
      globalsState.progression[archipelagoClientProgressionKey] = 0;
    } else {
      globalsState.progression[archipelagoClientProgressionKey] = false;
    }
  });

  globalsState.progression.graphics = false;
  globalsState.progression.graphicsLevel = 0;
  globalsState.progression.bomb = 0;
  globalsState.progression.gun = 0;
  globalsState.progression.sword = 0;
  globalsState.progression.waterWalkers = false;
  globalsState.progression.energy = 0;
  globalsState.progression.hp = 0;
  globalsState.progression.rounds = 0;
  globalsState.progression.freeGrid = false;
  globalsState.progression.progressiveRooms = 0;

  if (typeof initialRoomSyncPlayerResourceMaxes === "function") {
    initialRoomSyncPlayerResourceMaxes();
  }
}

function archipelagoClientApplyItem(archipelagoClientItem, archipelagoClientItemIndex, archipelagoClientOptions) {
  var archipelagoClientCheckKeys = archipelagoClientItemIdToCheckKeys[archipelagoClientItem.item];
  var archipelagoClientEventId = "ap:" + archipelagoClientItemIndex + ":" + archipelagoClientItem.item + ":" + archipelagoClientItem.location;
  var archipelagoClientIsReplay = Boolean(archipelagoClientOptions && archipelagoClientOptions.replay);

  if (!archipelagoClientCheckKeys) {
    return;
  }

  archipelagoClientCheckKeys.some(function (archipelagoClientCheckKey) {
    if (archipelagoClientCheckKey === "graphics") {
      progressionManagerAdvanceGraphicsLevel();
      return true;
    }

    if (globalsState.progressiveCheckDefinitions[archipelagoClientCheckKey]) {
      progressionManagerAdvanceProgressiveCheck(archipelagoClientCheckKey);
      return true;
    }

    if (archipelagoClientCheckKey === "healthPotion" && typeof initialRoomApplyShopReward === "function") {
      initialRoomApplyShopReward("healthPickup");
      initialRoomBroadcastLinkedPickup("health", 1, archipelagoClientEventId);
      return true;
    }

    if (archipelagoClientCheckKey === "energyGem" && typeof initialRoomPlayer !== "undefined") {
      initialRoomSyncPlayerResourceMaxes();
      initialRoomPlayer.energy += 1;
      initialRoomQueueMessage("You found your Energy Gem");
      initialRoomShowPickupIcon("potion");
      initialRoomBroadcastLinkedPickup("potion", 1, archipelagoClientEventId);
      return true;
    }

    if (archipelagoClientCheckKey === "roundPouch" && typeof initialRoomApplyShopReward === "function") {
      initialRoomApplyShopReward("roundsPickup");
      initialRoomBroadcastLinkedPickup("moneybag", 5, archipelagoClientEventId);
      return true;
    }

    if (globalsState.checkDefinitions[archipelagoClientCheckKey] && globalsState.checkDefinitions[archipelagoClientCheckKey].trap && typeof initialRoomApplyTrap === "function") {
      if (archipelagoClientIsReplay) {
        return true;
      }

      initialRoomApplyTrap(archipelagoClientCheckKey);
      initialRoomBroadcastTrapLink(archipelagoClientCheckKey, archipelagoClientEventId);
      return true;
    }

    if (globalsState.progression[archipelagoClientCheckKey]) {
      return false;
    }

    if (progressionManagerIsProgressiveRoomCheck(archipelagoClientCheckKey)) {
      progressionManagerAdvanceProgressiveRoom();
    } else {
      progressionManagerApplyReward(archipelagoClientCheckKey);
    }

    return true;
  });

  archipelagoClientMaybeSendBuildTankGoal();
}

function archipelagoClientApplyReceivedItems(archipelagoClientPacket) {
  var archipelagoClientPacketIndex = archipelagoClientPacket.index || 0;
  var archipelagoClientItems = archipelagoClientPacket.items || [];
  var archipelagoClientIsReplayPacket = archipelagoClientPacketIndex === 0 && globalsState.archipelago.nextItemIndex === 0;

  if (archipelagoClientPacketIndex < globalsState.archipelago.nextItemIndex) {
    if (isDebug) {
      console.log("Ignoring stale Archipelago item packet.", {
        packetIndex: archipelagoClientPacketIndex,
        expectedIndex: globalsState.archipelago.nextItemIndex,
        itemCount: archipelagoClientItems.length
      });
    }
    return;
  }

  if (archipelagoClientPacketIndex > globalsState.archipelago.nextItemIndex) {
    console.warn(new Error("Archipelago item sync index mismatch. Expected " + globalsState.archipelago.nextItemIndex + " but got " + archipelagoClientPacketIndex + ". Applying packet and requesting another sync."));
    globalsState.archipelago.nextItemIndex = archipelagoClientPacketIndex;
    archipelagoClientSend(globalsState.archipelago.socket, { cmd: "Sync" });
  }

  if (isDebug) {
    console.log("Applying Archipelago items.", {
      packetIndex: archipelagoClientPacketIndex,
      itemCount: archipelagoClientItems.length,
      expectedIndex: globalsState.archipelago.nextItemIndex,
      mappedItems: archipelagoClientItems.slice(0, 24).map(function (archipelagoClientItem) {
        return {
          item: archipelagoClientItem.item,
          location: archipelagoClientItem.location,
          player: archipelagoClientItem.player,
          keys: archipelagoClientItemIdToCheckKeys[archipelagoClientItem.item] || []
        };
      }),
      unknownItemIds: archipelagoClientItems.map(function (archipelagoClientItem) {
        return archipelagoClientItem.item;
      }).filter(function (archipelagoClientItemId) {
        return !archipelagoClientItemIdToCheckKeys[archipelagoClientItemId];
      }).slice(0, 24)
    });
  }

  archipelagoClientItems.forEach(function (archipelagoClientItem) {
    var archipelagoClientItemIndex = globalsState.archipelago.nextItemIndex;

    globalsState.archipelago.receivedItems.push(archipelagoClientItem);
    globalsState.archipelago.nextItemIndex += 1;
    archipelagoClientApplyItem(archipelagoClientItem, archipelagoClientItemIndex, {
      replay: archipelagoClientIsReplayPacket
    });
  });
}

function archipelagoClientSendConnect(archipelagoClientSocket, archipelagoClientConnectionInfo) {
  archipelagoClientSend(archipelagoClientSocket, {
    cmd: "Connect",
    game: archipelagoClientGame,
    name: archipelagoClientConnectionInfo.slot,
    password: archipelagoClientConnectionInfo.password,
    uuid: archipelagoClientGetUuid(),
    version: archipelagoClientVersion,
    items_handling: 7,
    tags: ["AP"],
    slot_data: true
  });
}

function archipelagoClientHandleConnected(archipelagoClientSocket, archipelagoClientPacket, archipelagoClientConnectionInfo) {
  globalsState.archipelago.connected = true;
  globalsState.archipelago.host = archipelagoClientConnectionInfo.host;
  globalsState.archipelago.port = archipelagoClientConnectionInfo.port;
  globalsState.archipelago.slot = archipelagoClientConnectionInfo.slot;
  globalsState.archipelago.password = archipelagoClientConnectionInfo.password;
  globalsState.archipelago.socket = archipelagoClientSocket;
  globalsState.archipelago.team = archipelagoClientPacket.team;
  globalsState.archipelago.slotId = archipelagoClientPacket.slot;
  globalsState.archipelago.playerNames = archipelagoClientBuildPlayerNames(archipelagoClientPacket, archipelagoClientConnectionInfo);
  globalsState.archipelago.playerGames = archipelagoClientBuildPlayerGames(archipelagoClientPacket);
  globalsState.archipelago.dataPackage = {
    itemNamesByGame: {},
    locationNamesByGame: {}
  };
  globalsState.archipelago.checkedLocations = archipelagoClientNormalizeIdList(archipelagoClientPacket.checked_locations);
  globalsState.archipelago.missingLocations = archipelagoClientNormalizeIdList(archipelagoClientPacket.missing_locations);
  globalsState.archipelago.slotData = archipelagoClientPacket.slot_data || {};
  archipelagoClientResetOnlineProgressionForSync();
  archipelagoClientMarkCheckedLocations(globalsState.archipelago.checkedLocations);
  archipelagoClientSend(archipelagoClientSocket, {
    cmd: "ConnectUpdate",
    tags: archipelagoClientBuildTags()
  });
  archipelagoClientRequestDataPackage(archipelagoClientSocket);
  archipelagoClientSend(archipelagoClientSocket, { cmd: "Sync" });

  if (isDebug) {
    console.log("Connected to Archipelago as " + archipelagoClientConnectionInfo.slot + ".");
  }
}

function archipelagoClientHandlePackets(archipelagoClientSocket, archipelagoClientPackets, archipelagoClientConnectionInfo, archipelagoClientResolveReady, archipelagoClientReject) {
  archipelagoClientPackets.forEach(function (archipelagoClientPacket) {
    if (archipelagoClientPacket.cmd === "RoomInfo") {
      archipelagoClientSendConnect(archipelagoClientSocket, archipelagoClientConnectionInfo);
      return;
    }

    if (archipelagoClientPacket.cmd === "Connected") {
      archipelagoClientHandleConnected(archipelagoClientSocket, archipelagoClientPacket, archipelagoClientConnectionInfo);
      archipelagoClientResolveReady(archipelagoClientPacket);
      return;
    }

    if (archipelagoClientPacket.cmd === "ConnectionRefused") {
      archipelagoClientReject(new Error("Archipelago connection refused: " + (archipelagoClientPacket.errors || []).join(", ")));
      archipelagoClientSocket.close();
      return;
    }

    if (archipelagoClientPacket.cmd === "ReceivedItems") {
      archipelagoClientApplyReceivedItems(archipelagoClientPacket);
      return;
    }

    if (archipelagoClientPacket.cmd === "DataPackage") {
      archipelagoClientHandleDataPackage(archipelagoClientPacket);
      return;
    }

    if (archipelagoClientPacket.cmd === "Bounced") {
      archipelagoClientHandleBounced(archipelagoClientPacket);
      return;
    }

    if (archipelagoClientPacket.cmd === "Print") {
      archipelagoClientQueueServerMessage(archipelagoClientPacket.text || "");
      return;
    }

    if (archipelagoClientPacket.cmd === "PrintJSON") {
      archipelagoClientQueueServerMessage(archipelagoClientFormatPrintJson(archipelagoClientPacket.data));
    }
  });
}

function archipelagoClientHandleBounced(archipelagoClientPacket) {
  var archipelagoClientTags = archipelagoClientPacket.tags || [];
  var archipelagoClientData = archipelagoClientPacket.data || {};

  if (archipelagoClientData.clientSessionId && archipelagoClientData.clientSessionId === archipelagoClientSessionId) {
    return;
  }

  if (archipelagoClientData.eventId) {
    if (globalsState.archipelago.linkEvents[archipelagoClientData.eventId]) {
      return;
    }

    globalsState.archipelago.linkEvents[archipelagoClientData.eventId] = true;
  }

  if (archipelagoClientTags.indexOf("DeathLink") !== -1 && typeof initialRoomReceiveDeathLink === "function") {
    initialRoomReceiveDeathLink(archipelagoClientData);
    return;
  }

  if ((archipelagoClientTags.indexOf("EnergyLink") !== -1 || archipelagoClientTags.indexOf("ShellipelagoEnergyLink") !== -1) && typeof initialRoomReceiveLinkedPickup === "function") {
    initialRoomReceiveLinkedPickup("potion", Number(archipelagoClientData.amount) || 1);
    return;
  }

  if ((archipelagoClientTags.indexOf("RingLink") !== -1 || archipelagoClientTags.indexOf("ShellipelagoRingLink") !== -1) && typeof initialRoomReceiveLinkedPickup === "function") {
    initialRoomReceiveLinkedPickup("moneybag", Number(archipelagoClientData.amount) || 5);
    return;
  }

  if ((archipelagoClientTags.indexOf("ItemLink") !== -1 || archipelagoClientTags.indexOf("ShellipelagoItemLink") !== -1) && typeof initialRoomReceiveLinkedPickup === "function") {
    initialRoomReceiveLinkedPickup(archipelagoClientData.item, Number(archipelagoClientData.amount) || 1);
    return;
  }

  if ((archipelagoClientTags.indexOf("TrapLink") !== -1 || archipelagoClientTags.indexOf("ShellipelagoTrapLink") !== -1) && typeof initialRoomReceiveTrapLink === "function") {
    initialRoomReceiveTrapLink(archipelagoClientData.trap);
  }
}

function archipelagoClientSendLocationCheck(archipelagoClientCheckKey) {
  var archipelagoClientLocation = globalsState.locations[archipelagoClientCheckKey];

  if (!archipelagoClientLocation || archipelagoClientLocation.checked) {
    return false;
  }

  if (!globalsState.archipelago.connected || !globalsState.archipelago.socket) {
    console.error(new Error("Cannot send check before Archipelago is connected: " + archipelagoClientCheckKey));
    return false;
  }

  archipelagoClientLocation.checked = true;
  globalsState.archipelago.checkedLocations.push(Number(archipelagoClientLocation.id));
  archipelagoClientSend(globalsState.archipelago.socket, {
    cmd: "LocationChecks",
    locations: [archipelagoClientLocation.id]
  });

  if (isDebug) {
    console.log("Sent Archipelago check: " + archipelagoClientLocation.name);
  }

  return true;
}

function archipelagoClientSendGeneratedLocationCheck(archipelagoClientLocation) {
  if (!archipelagoClientLocation || !archipelagoClientLocation.id) {
    return false;
  }

  if (archipelagoClientHasCheckedLocation(archipelagoClientLocation.id)) {
    return false;
  }

  if (!archipelagoClientHasMissingLocation(archipelagoClientLocation.id)) {
    return false;
  }

  if (!globalsState.archipelago.connected || !globalsState.archipelago.socket) {
    console.error(new Error("Cannot send generated check before Archipelago is connected: " + archipelagoClientLocation.name));
    return false;
  }

  globalsState.archipelago.checkedLocations.push(Number(archipelagoClientLocation.id));
  archipelagoClientSend(globalsState.archipelago.socket, {
    cmd: "LocationChecks",
    locations: [archipelagoClientLocation.id]
  });

  if (isDebug) {
    console.log("Sent Archipelago check: " + archipelagoClientLocation.name);
  }

  return true;
}

function archipelagoClientConnect(archipelagoClientConnectionInfo) {
  var archipelagoClientUrls = archipelagoClientBuildUrls(archipelagoClientConnectionInfo);
  var archipelagoClientErrors = [];

  function archipelagoClientTryNextUrl(archipelagoClientUrlIndex) {
    if (archipelagoClientUrlIndex >= archipelagoClientUrls.length) {
      var archipelagoClientLastError = archipelagoClientErrors[archipelagoClientErrors.length - 1];
      var archipelagoClientErrorMessage = "Unable to connect to Archipelago. Tried: " + archipelagoClientUrls.join(", ");

      if (archipelagoClientLastError && archipelagoClientLastError.message) {
        archipelagoClientErrorMessage += ". Last error: " + archipelagoClientLastError.message;
      }

      return Promise.reject(new Error(archipelagoClientErrorMessage));
    }

    return archipelagoClientConnectSingleUrl(archipelagoClientConnectionInfo, archipelagoClientUrls[archipelagoClientUrlIndex])
      .catch(function (archipelagoClientError) {
        archipelagoClientErrors.push(archipelagoClientError);
        return archipelagoClientTryNextUrl(archipelagoClientUrlIndex + 1);
      });
  }

  return archipelagoClientTryNextUrl(0);
}

function archipelagoClientConnectSingleUrl(archipelagoClientConnectionInfo, archipelagoClientUrl) {
  return new Promise(function (archipelagoClientResolve, archipelagoClientReject) {
    var archipelagoClientSocket;
    var archipelagoClientHasResolved = false;
    var archipelagoClientTimeout;
    function archipelagoClientFail(archipelagoClientError) {
      if (archipelagoClientHasResolved) {
        return;
      }

      archipelagoClientHasResolved = true;
      window.clearTimeout(archipelagoClientTimeout);
      console.error(archipelagoClientError);
      archipelagoClientReject(archipelagoClientError);
    }

    try {
      archipelagoClientSocket = new WebSocket(archipelagoClientUrl);
    } catch (archipelagoClientError) {
      archipelagoClientFail(new Error("Unable to connect to Archipelago at " + archipelagoClientUrl + ": " + archipelagoClientError.message));
      return;
    }

    archipelagoClientTimeout = window.setTimeout(function () {
      if (!archipelagoClientHasResolved) {
        archipelagoClientFail(new Error("Archipelago connection timed out at " + archipelagoClientUrl + "."));
        archipelagoClientSocket.close();
      }
    }, 5000);

    archipelagoClientSocket.addEventListener("message", function (archipelagoClientEvent) {
      var archipelagoClientPackets;

      try {
        archipelagoClientPackets = JSON.parse(archipelagoClientEvent.data);
      } catch (archipelagoClientError) {
        archipelagoClientFail(archipelagoClientError);
        return;
      }

      archipelagoClientHandlePackets(
        archipelagoClientSocket,
        archipelagoClientPackets,
        archipelagoClientConnectionInfo,
        function (archipelagoClientPacket) {
          if (archipelagoClientHasResolved) {
            return;
          }

          archipelagoClientHasResolved = true;
          window.clearTimeout(archipelagoClientTimeout);
          archipelagoClientResolve(archipelagoClientPacket);
        },
        function (archipelagoClientError) {
          archipelagoClientFail(archipelagoClientError);
        }
      );
    });

    archipelagoClientSocket.addEventListener("error", function () {
      archipelagoClientFail(new Error("Unable to connect to Archipelago at " + archipelagoClientUrl));
    });

    archipelagoClientSocket.addEventListener("close", function () {
      if (!archipelagoClientHasResolved) {
        archipelagoClientFail(new Error("Archipelago connection closed before login completed at " + archipelagoClientUrl + "."));
      }
    });
  });
}

globalsState.loadedModules.push("archipelagoClient");
