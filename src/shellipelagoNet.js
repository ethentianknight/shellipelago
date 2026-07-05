var shellipelagoNetVersion = 3;
var shellipelagoNetSignalingEndpoint = "https://shellipelago-net-signaling.ethentianknight.workers.dev";
var shellipelagoNetRtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};
var shellipelagoNetSignalingPollMs = 3000;
var shellipelagoNetPositionLerpMs = 180;
var shellipelagoNetPositionIntervalMs = 100;
var shellipelagoNetHeartbeatIntervalMs = 5000;
var shellipelagoNetLobbyRefreshMs = 45000;
var shellipelagoNetLobbyAutoCloseMs = 300000;
var shellipelagoNetPlayerTtlMs = 12000;
var shellipelagoNetSignalStaleGraceMs = 120000;
var shellipelagoNetState = {
  enabled: false,
  roomCode: "",
  roomVisibility: "public",
  role: "",
  host: false,
  playerId: "",
  playerName: "",
  joinedAt: 0,
  lastPollAt: 0,
  lastPositionAt: 0,
  lastHeartbeatAt: 0,
  lastLobbyRefreshAt: 0,
  pollTimer: 0,
  lobbyRefreshTimer: 0,
  lobbyAutoCloseTimer: 0,
  lobbyClosedToNewPeers: false,
  hostConnections: {},
  guestConnection: null,
  guestChannel: null,
  seenSignalIds: {},
  answeredOfferIds: {},
  colorByPlayerId: {},
  remotePlayers: {},
  bannedNames: {}
};

function shellipelagoNetInit() {
  shellipelagoNetState.playerId = shellipelagoNetGetOrCreatePlayerId();
  shellipelagoNetState.playerName = localStorage.getItem("shellipelagoNetPlayerName") || "";
}

function shellipelagoNetGetOrCreatePlayerId() {
  return "p-" + shellipelagoNetCreateId();
}

function shellipelagoNetHandleCommand(shellipelagoNetText) {
  var shellipelagoNetCommandText = String(shellipelagoNetText || "").trim();
  var shellipelagoNetNameMatch = shellipelagoNetCommandText.match(/^!name(?:\s+(.+))?$/i);
  var shellipelagoNetHostMatch = shellipelagoNetCommandText.match(/^!host(?:\s+(.+))?$/i);
  var shellipelagoNetJoinMatch = shellipelagoNetCommandText.match(/^!join(?:\s+(.+))?$/i);
  var shellipelagoNetKickMatch = shellipelagoNetCommandText.match(/^!kick\s+(.+)$/i);
  var shellipelagoNetBanMatch = shellipelagoNetCommandText.match(/^!ban\s+(.+)$/i);

  if (shellipelagoNetNameMatch) {
    return shellipelagoNetSetName(shellipelagoNetNameMatch[1]);
  }

  if (!shellipelagoNetIsNetworkCommand(shellipelagoNetCommandText)) {
    return false;
  }

  if (!shellipelagoNetRequireName()) {
    return true;
  }

  if (shellipelagoNetHostMatch) {
    shellipelagoNetHost(shellipelagoNetHostMatch[1]);
    return true;
  }

  if (shellipelagoNetJoinMatch) {
    shellipelagoNetJoin(shellipelagoNetJoinMatch[1]);
    return true;
  }

  if (/^!close$/i.test(shellipelagoNetCommandText)) {
    shellipelagoNetClose();
    return true;
  }

  if (/^!leave$/i.test(shellipelagoNetCommandText)) {
    shellipelagoNetLeave();
    return true;
  }

  if (shellipelagoNetKickMatch) {
    shellipelagoNetKick(shellipelagoNetKickMatch[1], false);
    return true;
  }

  if (shellipelagoNetBanMatch) {
    shellipelagoNetKick(shellipelagoNetBanMatch[1], true);
    return true;
  }

  return false;
}

function shellipelagoNetIsNetworkCommand(shellipelagoNetCommandText) {
  return /^!(host|join|close|leave|kick|ban)(?:\s|$)/i.test(shellipelagoNetCommandText);
}

function shellipelagoNetSetName(shellipelagoNetName) {
  var shellipelagoNetCleanName = String(shellipelagoNetName || "").trim().toLowerCase();

  if (!shellipelagoNetIsValidName(shellipelagoNetCleanName)) {
    shellipelagoNetMessage("!name only allows a-z and 0-9 with no spaces.");
    return true;
  }

  shellipelagoNetState.playerName = shellipelagoNetCleanName;
  localStorage.setItem("shellipelagoNetPlayerName", shellipelagoNetCleanName);
  shellipelagoNetMessage("Network name set to " + shellipelagoNetCleanName + ".");
  return true;
}

function shellipelagoNetSetNameFromSlot(shellipelagoNetSlotName) {
  var shellipelagoNetCleanName = shellipelagoNetNormalizeSlotName(shellipelagoNetSlotName);

  if (!shellipelagoNetCleanName || !shellipelagoNetIsValidName(shellipelagoNetCleanName)) {
    return false;
  }

  shellipelagoNetState.playerName = shellipelagoNetCleanName;
  localStorage.setItem("shellipelagoNetPlayerName", shellipelagoNetCleanName);
  return true;
}

function shellipelagoNetNormalizeName(shellipelagoNetName) {
  return String(shellipelagoNetName || "").trim().toLowerCase();
}

function shellipelagoNetNormalizeSlotName(shellipelagoNetName) {
  return shellipelagoNetNormalizeName(shellipelagoNetName).replace(/[^a-z0-9]/g, "");
}

function shellipelagoNetIsValidName(shellipelagoNetName) {
  return /^[a-z0-9]+$/.test(String(shellipelagoNetName || ""));
}

function shellipelagoNetRequireName() {
  if (shellipelagoNetState.playerName) {
    return true;
  }

  shellipelagoNetMessage("set name with !name [your name] first");
  return false;
}

function shellipelagoNetHost(shellipelagoNetRequestedCode) {
  var shellipelagoNetRoomCode = shellipelagoNetNormalizeRoomCode(shellipelagoNetRequestedCode) || shellipelagoNetCreatePublicRoomCode();
  var shellipelagoNetVisibility = shellipelagoNetRequestedCode ? "private" : "public";

  shellipelagoNetStopSession();
  shellipelagoNetState.enabled = true;
  shellipelagoNetState.role = "host";
  shellipelagoNetState.host = true;
  shellipelagoNetState.roomCode = shellipelagoNetRoomCode;
  shellipelagoNetState.roomVisibility = shellipelagoNetVisibility;
  shellipelagoNetState.joinedAt = Date.now();
  shellipelagoNetState.lobbyClosedToNewPeers = false;
  shellipelagoNetStartSignalingPolling();
  shellipelagoNetStartLobbyRefresh();
  shellipelagoNetStartLobbyAutoClose();
  shellipelagoNetPublishLobbyIfNeeded().then(function () {
    shellipelagoNetMessage("Hosted " + shellipelagoNetVisibility + " room " + shellipelagoNetRoomCode + ".");
  }).catch(shellipelagoNetReportError);
}

function shellipelagoNetJoin(shellipelagoNetRequestedCode) {
  var shellipelagoNetRoomCode = shellipelagoNetNormalizeRoomCode(shellipelagoNetRequestedCode);
  var shellipelagoNetRoomPromise = shellipelagoNetRoomCode ?
    Promise.resolve(shellipelagoNetRoomCode) :
    shellipelagoNetFindOpenLobby();

  shellipelagoNetRoomPromise.then(function (shellipelagoNetResolvedRoomCode) {
    shellipelagoNetStopSession();
    shellipelagoNetState.enabled = true;
    shellipelagoNetState.role = "guest";
    shellipelagoNetState.host = false;
    shellipelagoNetState.roomCode = shellipelagoNetResolvedRoomCode;
    shellipelagoNetState.roomVisibility = shellipelagoNetRequestedCode ? "private" : "public";
    shellipelagoNetState.joinedAt = Date.now();
    shellipelagoNetCreateGuestConnection();
    shellipelagoNetStartSignalingPolling();
    return shellipelagoNetSendSignal("join", {
      name: shellipelagoNetState.playerName,
      resumeToken: shellipelagoNetRoomResumeToken()
    }, "");
  }).then(function () {
    shellipelagoNetMessage("Join request sent for room " + shellipelagoNetState.roomCode + ".");
  }).catch(shellipelagoNetReportError);
}

function shellipelagoNetClose() {
  if (!shellipelagoNetState.enabled || !shellipelagoNetState.roomCode) {
    shellipelagoNetMessage("No lobby is open.");
    return;
  }

  if (shellipelagoNetState.host) {
    shellipelagoNetCloseLobbyToNewPeers("Lobby closed to new players.");
    return;
  }

  shellipelagoNetMessage("Only the host can close the lobby.");
}

function shellipelagoNetCloseLobbyToNewPeers(shellipelagoNetMessageText) {
  if (shellipelagoNetState.lobbyClosedToNewPeers) {
    if (shellipelagoNetMessageText) {
      shellipelagoNetMessage(shellipelagoNetMessageText);
    }

    return;
  }

  shellipelagoNetState.roomVisibility = "private";
  shellipelagoNetState.lobbyClosedToNewPeers = true;
  shellipelagoNetStopLobbyRefresh();
  shellipelagoNetStopSignalingPolling();
  shellipelagoNetDeleteLobby().catch(shellipelagoNetReportError);

  if (shellipelagoNetMessageText) {
    shellipelagoNetMessage(shellipelagoNetMessageText);
  }
}

function shellipelagoNetLeave() {
  if (!shellipelagoNetState.enabled || !shellipelagoNetState.roomCode) {
    shellipelagoNetMessage("No lobby is open.");
    return;
  }

  if (shellipelagoNetState.host) {
    shellipelagoNetSendPacket({
      kind: "control",
      action: "close"
    });
    shellipelagoNetDeleteLobby().catch(shellipelagoNetReportError);
    shellipelagoNetLeaveLocal("Lobby closed.");
    return;
  }

  shellipelagoNetLeaveLocal("Left lobby.");
}

function shellipelagoNetKick(shellipelagoNetName, shellipelagoNetBan) {
  var shellipelagoNetTargetName = String(shellipelagoNetName || "").trim().toLowerCase();

  if (!shellipelagoNetState.enabled || !shellipelagoNetState.roomCode) {
    shellipelagoNetMessage("No lobby is open.");
    return;
  }

  if (!shellipelagoNetState.host) {
    shellipelagoNetMessage("Only the host can kick or ban players.");
    return;
  }

  if (shellipelagoNetBan) {
    shellipelagoNetState.bannedNames[shellipelagoNetTargetName] = true;
  }

  shellipelagoNetSendPacket({
    kind: "control",
    action: shellipelagoNetBan ? "ban" : "kick",
    targetName: shellipelagoNetTargetName
  });
  shellipelagoNetMessage((shellipelagoNetBan ? "Banned " : "Kicked ") + shellipelagoNetTargetName + ".");
}

function shellipelagoNetUpdate() {
  var shellipelagoNetNow = Date.now();

  if (!shellipelagoNetState.enabled) {
    return;
  }

  if (shellipelagoNetIsDataOpen() && shellipelagoNetNow - shellipelagoNetState.lastHeartbeatAt >= shellipelagoNetHeartbeatIntervalMs) {
    shellipelagoNetState.lastHeartbeatAt = shellipelagoNetNow;
    shellipelagoNetSendHeartbeat();
  }

  if (shellipelagoNetIsDataOpen() && shellipelagoNetNow - shellipelagoNetState.lastPositionAt >= shellipelagoNetPositionIntervalMs) {
    shellipelagoNetState.lastPositionAt = shellipelagoNetNow;
    shellipelagoNetSendPosition();
  }

  shellipelagoNetPruneRemotePlayers(shellipelagoNetNow);
}

function shellipelagoNetStartSignalingPolling() {
  shellipelagoNetStopSignalingPolling();
  shellipelagoNetPollSignals();
  shellipelagoNetState.pollTimer = window.setInterval(function () {
    if (shellipelagoNetShouldPollSignals()) {
      shellipelagoNetPollSignals();
    }
  }, shellipelagoNetSignalingPollMs);
}

function shellipelagoNetStopSignalingPolling() {
  if (shellipelagoNetState.pollTimer) {
    window.clearInterval(shellipelagoNetState.pollTimer);
    shellipelagoNetState.pollTimer = 0;
  }
}

function shellipelagoNetStartLobbyRefresh() {
  shellipelagoNetStopLobbyRefresh();

  if (!shellipelagoNetState.host || shellipelagoNetState.roomVisibility !== "public") {
    return;
  }

  shellipelagoNetState.lobbyRefreshTimer = window.setInterval(function () {
    shellipelagoNetPublishLobbyIfNeeded().catch(shellipelagoNetReportError);
  }, shellipelagoNetLobbyRefreshMs);
}

function shellipelagoNetStopLobbyRefresh() {
  if (shellipelagoNetState.lobbyRefreshTimer) {
    window.clearInterval(shellipelagoNetState.lobbyRefreshTimer);
    shellipelagoNetState.lobbyRefreshTimer = 0;
  }
}

function shellipelagoNetStartLobbyAutoClose() {
  shellipelagoNetStopLobbyAutoClose();

  if (!shellipelagoNetState.host) {
    return;
  }

  shellipelagoNetState.lobbyAutoCloseTimer = window.setTimeout(function () {
    shellipelagoNetAutoCloseLobby();
  }, shellipelagoNetLobbyAutoCloseMs);
}

function shellipelagoNetStopLobbyAutoClose() {
  if (shellipelagoNetState.lobbyAutoCloseTimer) {
    window.clearTimeout(shellipelagoNetState.lobbyAutoCloseTimer);
    shellipelagoNetState.lobbyAutoCloseTimer = 0;
  }
}

function shellipelagoNetAutoCloseLobby() {
  if (!shellipelagoNetState.enabled || !shellipelagoNetState.host || shellipelagoNetState.lobbyClosedToNewPeers) {
    return;
  }

  shellipelagoNetCloseLobbyToNewPeers("Lobby auto-closed after 5 minutes of accepting new players.");

  if (!shellipelagoNetHasOpenHostPeer()) {
    shellipelagoNetMessage("No peers are currently connected.");
  }
}

function shellipelagoNetShouldPollSignals() {
  if (shellipelagoNetState.host) {
    return !shellipelagoNetState.lobbyClosedToNewPeers;
  }

  return !shellipelagoNetState.guestChannel || shellipelagoNetState.guestChannel.readyState !== "open";
}

function shellipelagoNetCreateGuestConnection() {
  shellipelagoNetCloseGuestConnection();
  shellipelagoNetState.guestConnection = new RTCPeerConnection(shellipelagoNetRtcConfig);
  shellipelagoNetState.guestConnection.onconnectionstatechange = function () {
    if (shellipelagoNetState.guestConnection && shellipelagoNetState.guestConnection.connectionState === "failed") {
      shellipelagoNetMessage("Network connection failed.");
    }
  };
  shellipelagoNetState.guestConnection.ondatachannel = function (shellipelagoNetEvent) {
    shellipelagoNetAttachGuestChannel(shellipelagoNetEvent.channel);
  };
  return shellipelagoNetState.guestConnection;
}

function shellipelagoNetCreateHostPeer(shellipelagoNetRemotePeerId, shellipelagoNetRemoteName) {
  var shellipelagoNetConnection = new RTCPeerConnection(shellipelagoNetRtcConfig);
  var shellipelagoNetPeer = {
    id: shellipelagoNetRemotePeerId,
    name: shellipelagoNetRemoteName || shellipelagoNetRemotePeerId.slice(0, 8),
    connection: shellipelagoNetConnection,
    channel: null,
    state: "new"
  };

  shellipelagoNetConnection.onconnectionstatechange = function () {
    shellipelagoNetPeer.state = shellipelagoNetConnection.connectionState;
    if (shellipelagoNetConnection.connectionState === "failed") {
      shellipelagoNetMessage(shellipelagoNetPeer.name + " connection failed.");
    }
  };
  shellipelagoNetPeer.channel = shellipelagoNetConnection.createDataChannel("shellipelago");
  shellipelagoNetAttachHostChannel(shellipelagoNetPeer.channel, shellipelagoNetPeer);
  shellipelagoNetState.hostConnections[shellipelagoNetRemotePeerId] = shellipelagoNetPeer;
  return shellipelagoNetPeer;
}

function shellipelagoNetAttachGuestChannel(shellipelagoNetChannel) {
  shellipelagoNetState.guestChannel = shellipelagoNetChannel;
  shellipelagoNetChannel.onopen = function () {
    shellipelagoNetMessage("Network data channel open.");
    shellipelagoNetSendCellSync();
    shellipelagoNetSendPosition();
  };
  shellipelagoNetChannel.onmessage = function (shellipelagoNetEvent) {
    shellipelagoNetHandlePacket(String(shellipelagoNetEvent.data || ""), null);
  };
  shellipelagoNetChannel.onclose = function () {
    shellipelagoNetMessage("Network data channel closed.");
  };
}

function shellipelagoNetAttachHostChannel(shellipelagoNetChannel, shellipelagoNetPeer) {
  shellipelagoNetChannel.onopen = function () {
    shellipelagoNetPeer.state = "connected";
    shellipelagoNetMessage(shellipelagoNetPeer.name + " connected.");
    shellipelagoNetSendHostPeerPacket(shellipelagoNetPeer, {
      kind: "hello",
      from: shellipelagoNetState.playerId,
      name: shellipelagoNetState.playerName,
      player: shellipelagoNetBuildPlayerInfo(),
      snapshot: shellipelagoNetGetRuntimeSnapshot()
    });
  };
  shellipelagoNetChannel.onmessage = function (shellipelagoNetEvent) {
    shellipelagoNetHandlePacket(String(shellipelagoNetEvent.data || ""), shellipelagoNetPeer);
  };
  shellipelagoNetChannel.onclose = function () {
    shellipelagoNetPeer.state = "closed";
  };
}

function shellipelagoNetCloseGuestConnection() {
  if (shellipelagoNetState.guestChannel) {
    shellipelagoNetState.guestChannel.onopen = null;
    shellipelagoNetState.guestChannel.onmessage = null;
    shellipelagoNetState.guestChannel.onclose = null;
    shellipelagoNetState.guestChannel.close();
  }

  if (shellipelagoNetState.guestConnection) {
    shellipelagoNetState.guestConnection.ondatachannel = null;
    shellipelagoNetState.guestConnection.onconnectionstatechange = null;
    shellipelagoNetState.guestConnection.close();
  }

  shellipelagoNetState.guestChannel = null;
  shellipelagoNetState.guestConnection = null;
}

function shellipelagoNetCloseHostPeer(shellipelagoNetPeer) {
  if (shellipelagoNetPeer.channel) {
    shellipelagoNetPeer.channel.onopen = null;
    shellipelagoNetPeer.channel.onmessage = null;
    shellipelagoNetPeer.channel.onclose = null;
    shellipelagoNetPeer.channel.close();
  }

  if (shellipelagoNetPeer.connection) {
    shellipelagoNetPeer.connection.onconnectionstatechange = null;
    shellipelagoNetPeer.connection.close();
  }
}

function shellipelagoNetStopSession() {
  shellipelagoNetStopSignalingPolling();
  shellipelagoNetStopLobbyRefresh();
  shellipelagoNetStopLobbyAutoClose();
  shellipelagoNetCloseGuestConnection();
  Object.keys(shellipelagoNetState.hostConnections).forEach(function (shellipelagoNetPeerId) {
    shellipelagoNetCloseHostPeer(shellipelagoNetState.hostConnections[shellipelagoNetPeerId]);
  });
  shellipelagoNetState.hostConnections = {};
  shellipelagoNetState.seenSignalIds = {};
  shellipelagoNetState.answeredOfferIds = {};
  shellipelagoNetState.remotePlayers = {};
  shellipelagoNetState.enabled = false;
  shellipelagoNetState.role = "";
  shellipelagoNetState.host = false;
  shellipelagoNetState.roomCode = "";
  shellipelagoNetState.lastPollAt = 0;
  shellipelagoNetState.lastLobbyRefreshAt = 0;
  shellipelagoNetState.lastHeartbeatAt = 0;
  shellipelagoNetState.lobbyClosedToNewPeers = false;
}

function shellipelagoNetLeaveLocal(shellipelagoNetReason) {
  shellipelagoNetStopSession();
  shellipelagoNetMessage(shellipelagoNetReason || "Left lobby.");
}

function shellipelagoNetPollSignals() {
  fetch(shellipelagoNetRoomMessagesUrl() + "?peer=" + encodeURIComponent(shellipelagoNetState.playerId))
    .then(shellipelagoNetReadResponse)
    .then(function (shellipelagoNetResult) {
      var shellipelagoNetMessages = Array.isArray(shellipelagoNetResult.messages) ? shellipelagoNetResult.messages : [];
      var shellipelagoNetIndex = 0;

      while (shellipelagoNetIndex < shellipelagoNetMessages.length) {
        shellipelagoNetHandleSignal(shellipelagoNetMessages[shellipelagoNetIndex]).catch(shellipelagoNetReportError);
        shellipelagoNetIndex += 1;
      }
    })
    .catch(shellipelagoNetReportError);
}

async function shellipelagoNetHandleSignal(shellipelagoNetSignal) {
  var shellipelagoNetPeer = null;
  var shellipelagoNetAnswer = null;

  if (!shellipelagoNetSignal || !shellipelagoNetSignal.id || shellipelagoNetState.seenSignalIds[shellipelagoNetSignal.id] || shellipelagoNetSignal.from === shellipelagoNetState.playerId) {
    return;
  }

  shellipelagoNetState.seenSignalIds[shellipelagoNetSignal.id] = true;

  if (shellipelagoNetIsStaleSignal(shellipelagoNetSignal)) {
    return;
  }

  if (shellipelagoNetSignal.to && shellipelagoNetSignal.to !== shellipelagoNetState.playerId) {
    return;
  }

  if ((shellipelagoNetSignal.type === "join" || shellipelagoNetSignal.type === "rejoin") && shellipelagoNetState.host) {
    if (shellipelagoNetState.bannedNames[String(shellipelagoNetSignal.name || "").toLowerCase()]) {
      await shellipelagoNetSendSignal("reject", { reason: "You are banned from this lobby." }, shellipelagoNetSignal.from);
      return;
    }

    await shellipelagoNetCreateOfferForPeer(shellipelagoNetSignal);
    return;
  }

  if (shellipelagoNetSignal.type === "offer" && shellipelagoNetState.role === "guest" && !shellipelagoNetState.answeredOfferIds[shellipelagoNetSignal.id]) {
    if (!shellipelagoNetState.guestConnection) {
      shellipelagoNetCreateGuestConnection();
    }

    shellipelagoNetState.answeredOfferIds[shellipelagoNetSignal.id] = true;
    await shellipelagoNetState.guestConnection.setRemoteDescription(shellipelagoNetSignal.payload);
    shellipelagoNetAnswer = await shellipelagoNetState.guestConnection.createAnswer();
    await shellipelagoNetState.guestConnection.setLocalDescription(shellipelagoNetAnswer);
    await shellipelagoNetWaitForIceGatheringComplete(shellipelagoNetState.guestConnection);
    await shellipelagoNetSendSignal("answer", shellipelagoNetState.guestConnection.localDescription, shellipelagoNetSignal.from);
    return;
  }

  if (shellipelagoNetSignal.type === "answer" && shellipelagoNetState.host) {
    shellipelagoNetPeer = shellipelagoNetState.hostConnections[shellipelagoNetSignal.from];
    if (shellipelagoNetPeer && !shellipelagoNetPeer.connection.currentRemoteDescription) {
      await shellipelagoNetPeer.connection.setRemoteDescription(shellipelagoNetSignal.payload);
    }
    return;
  }

  if (shellipelagoNetSignal.type === "reject" && shellipelagoNetState.role === "guest") {
    shellipelagoNetMessage(String(shellipelagoNetSignal.payload && shellipelagoNetSignal.payload.reason || "Join rejected."));
  }
}

function shellipelagoNetIsStaleSignal(shellipelagoNetSignal) {
  var shellipelagoNetCreatedAt = Number(shellipelagoNetSignal.createdAt || 0);

  if (!shellipelagoNetCreatedAt || !shellipelagoNetState.joinedAt) {
    return false;
  }

  return shellipelagoNetCreatedAt < shellipelagoNetState.joinedAt - shellipelagoNetSignalStaleGraceMs;
}

async function shellipelagoNetCreateOfferForPeer(shellipelagoNetSignal) {
  var shellipelagoNetPeer = shellipelagoNetState.hostConnections[shellipelagoNetSignal.from];
  var shellipelagoNetOffer = null;

  if (shellipelagoNetPeer) {
    shellipelagoNetCloseHostPeer(shellipelagoNetPeer);
    delete shellipelagoNetState.hostConnections[shellipelagoNetSignal.from];
  }

  shellipelagoNetPeer = shellipelagoNetCreateHostPeer(shellipelagoNetSignal.from, shellipelagoNetSignal.name || shellipelagoNetSignal.payload && shellipelagoNetSignal.payload.name);
  shellipelagoNetMessage(shellipelagoNetPeer.name + " joined. Connecting...");
  shellipelagoNetOffer = await shellipelagoNetPeer.connection.createOffer();
  await shellipelagoNetPeer.connection.setLocalDescription(shellipelagoNetOffer);
  await shellipelagoNetWaitForIceGatheringComplete(shellipelagoNetPeer.connection);
  await shellipelagoNetSendSignal("offer", shellipelagoNetPeer.connection.localDescription, shellipelagoNetPeer.id);
}

function shellipelagoNetWaitForIceGatheringComplete(shellipelagoNetConnection) {
  return new Promise(function (shellipelagoNetResolve) {
    var shellipelagoNetTimeoutId = 0;

    if (shellipelagoNetConnection.iceGatheringState === "complete") {
      shellipelagoNetResolve();
      return;
    }

    shellipelagoNetConnection.addEventListener("icegatheringstatechange", function shellipelagoNetOnStateChange() {
      if (shellipelagoNetConnection.iceGatheringState === "complete") {
        shellipelagoNetConnection.removeEventListener("icegatheringstatechange", shellipelagoNetOnStateChange);
        window.clearTimeout(shellipelagoNetTimeoutId);
        shellipelagoNetResolve();
      }
    });

    shellipelagoNetTimeoutId = window.setTimeout(shellipelagoNetResolve, 8000);
  });
}

function shellipelagoNetSendPosition() {
  var shellipelagoNetSnapshot = shellipelagoNetGetRuntimeSnapshot();

  if (!shellipelagoNetSnapshot) {
    return;
  }

  shellipelagoNetBroadcastEvent({
    type: "position",
    player: shellipelagoNetBuildPlayerInfo(),
    snapshot: shellipelagoNetSnapshot
  });
}

function shellipelagoNetSendHeartbeat() {
  var shellipelagoNetSnapshot = shellipelagoNetGetRuntimeSnapshot();

  if (!shellipelagoNetSnapshot) {
    return;
  }

  shellipelagoNetBroadcastEvent({
    type: "heartbeat",
    player: shellipelagoNetBuildPlayerInfo(),
    snapshot: shellipelagoNetSnapshot
  });
}

function shellipelagoNetHandlePacket(shellipelagoNetRawPacket, shellipelagoNetHostPeer) {
  var shellipelagoNetPacket = null;

  try {
    shellipelagoNetPacket = JSON.parse(shellipelagoNetRawPacket);
  } catch (shellipelagoNetError) {
    return;
  }

  if (!shellipelagoNetPacket || !shellipelagoNetPacket.kind) {
    return;
  }

  if (shellipelagoNetPacket.kind === "hello") {
    shellipelagoNetApplyPositionEvent({
      playerId: shellipelagoNetPacket.from || "",
      playerName: shellipelagoNetPacket.name || "",
      player: shellipelagoNetPacket.player || {},
      snapshot: shellipelagoNetPacket.snapshot || null
    });
    return;
  }

  if (shellipelagoNetPacket.kind === "control") {
    shellipelagoNetApplyControl(shellipelagoNetPacket);
    if (shellipelagoNetState.host && shellipelagoNetHostPeer) {
      shellipelagoNetRelayPacket(shellipelagoNetPacket, shellipelagoNetHostPeer.id);
    }
    return;
  }

  if (shellipelagoNetPacket.kind === "event") {
    shellipelagoNetApplyEvent(Object.assign({}, shellipelagoNetPacket.event || {}, {
      playerId: shellipelagoNetPacket.from,
      playerName: shellipelagoNetPacket.name
    }));
    if (shellipelagoNetState.host && shellipelagoNetHostPeer) {
      shellipelagoNetRelayPacket(shellipelagoNetPacket, shellipelagoNetHostPeer.id);
    }
  }
}

function shellipelagoNetApplyControl(shellipelagoNetControl) {
  var shellipelagoNetAction = String(shellipelagoNetControl.action || "");
  var shellipelagoNetTargetName = String(shellipelagoNetControl.targetName || "").toLowerCase();

  if (shellipelagoNetAction === "close") {
    shellipelagoNetLeaveLocal("Lobby closed.");
    return;
  }

  if ((shellipelagoNetAction === "kick" || shellipelagoNetAction === "ban") && shellipelagoNetTargetName === shellipelagoNetState.playerName) {
    shellipelagoNetLeaveLocal(shellipelagoNetAction === "ban" ? "You were banned from the lobby." : "You were kicked from the lobby.");
  }
}

function shellipelagoNetApplyEvent(shellipelagoNetEvent) {
  if (!shellipelagoNetEvent || shellipelagoNetEvent.playerId === shellipelagoNetState.playerId) {
    return;
  }

  if (shellipelagoNetEvent.type === "position") {
    shellipelagoNetApplyPositionEvent(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "heartbeat") {
    shellipelagoNetApplyHeartbeatEvent(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "enemyKilled") {
    shellipelagoNetApplyEnemyKilled(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "destructibleDestroyed") {
    shellipelagoNetApplyDestructibleDestroyed(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "attack") {
    shellipelagoNetApplyAttack(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "snakeActivated") {
    shellipelagoNetApplySnakeActivated(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "snakeAwakened") {
    shellipelagoNetApplySnakeAwakened(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "gameOver") {
    shellipelagoNetApplyGameOver(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "tankCollision") {
    shellipelagoNetApplyTankCollision(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "cellSync") {
    shellipelagoNetApplyCellSync(shellipelagoNetEvent);
  }
}

function shellipelagoNetApplyHeartbeatEvent(shellipelagoNetEvent) {
  var shellipelagoNetPlayer = shellipelagoNetEvent.player || {};
  var shellipelagoNetSnapshot = shellipelagoNetEvent.snapshot || {};
  var shellipelagoNetRemote = null;

  if (!shellipelagoNetEvent.playerId || !shellipelagoNetSnapshot || !shellipelagoNetSnapshot.room) {
    return;
  }

  shellipelagoNetRemote = shellipelagoNetState.remotePlayers[shellipelagoNetEvent.playerId];
  if (!shellipelagoNetRemote || !shellipelagoNetRemote.snapshot || !shellipelagoNetIsSameRoom(shellipelagoNetRemote.snapshot.room, shellipelagoNetSnapshot.room)) {
    shellipelagoNetApplyPositionEvent(shellipelagoNetEvent);
    return;
  }

  shellipelagoNetRemote.name = shellipelagoNetPlayer.name || shellipelagoNetEvent.playerName || shellipelagoNetRemote.name;
  shellipelagoNetRemote.color = shellipelagoNetGetPlayerColor(shellipelagoNetEvent.playerId);
  shellipelagoNetRemote.lastSeenAt = Date.now();
}

function shellipelagoNetApplyPositionEvent(shellipelagoNetEvent) {
  var shellipelagoNetPlayer = shellipelagoNetEvent.player || {};
  var shellipelagoNetSnapshot = shellipelagoNetEvent.snapshot || {};
  var shellipelagoNetRemote = null;
  var shellipelagoNetNow = Date.now();

  if (!shellipelagoNetEvent.playerId || !shellipelagoNetSnapshot || !shellipelagoNetSnapshot.room) {
    return;
  }

  shellipelagoNetRemote = shellipelagoNetState.remotePlayers[shellipelagoNetEvent.playerId] || {};
  shellipelagoNetRemote.id = shellipelagoNetEvent.playerId;
  shellipelagoNetRemote.name = shellipelagoNetPlayer.name || shellipelagoNetEvent.playerName || shellipelagoNetEvent.playerId;
  shellipelagoNetRemote.color = shellipelagoNetGetPlayerColor(shellipelagoNetEvent.playerId);
  shellipelagoNetRemote.targetSnapshot = shellipelagoNetSnapshot;
  shellipelagoNetRemote.lastSeenAt = shellipelagoNetNow;

  if (!shellipelagoNetRemote.snapshot || !shellipelagoNetIsSameRoom(shellipelagoNetRemote.snapshot.room, shellipelagoNetSnapshot.room)) {
    shellipelagoNetRemote.snapshot = shellipelagoNetCloneSnapshot(shellipelagoNetSnapshot);
    shellipelagoNetRemote.fromSnapshot = shellipelagoNetCloneSnapshot(shellipelagoNetSnapshot);
  } else {
    shellipelagoNetRemote.fromSnapshot = shellipelagoNetCloneSnapshot(shellipelagoNetRemote.snapshot);
    shellipelagoNetRemote.lerpStartedAt = shellipelagoNetNow;
    shellipelagoNetRemote.lerpUntil = shellipelagoNetNow + shellipelagoNetPositionLerpMs;
  }

  shellipelagoNetState.remotePlayers[shellipelagoNetEvent.playerId] = shellipelagoNetRemote;
}

function shellipelagoNetCloneSnapshot(shellipelagoNetSnapshot) {
  return JSON.parse(JSON.stringify(shellipelagoNetSnapshot || {}));
}

function shellipelagoNetApplyEnemyKilled(shellipelagoNetEvent) {
  if (typeof initialRoomApplyNetEnemyKilled === "function") {
    initialRoomApplyNetEnemyKilled(shellipelagoNetEvent.enemyKey, shellipelagoNetEvent.room);
  }
}

function shellipelagoNetApplyDestructibleDestroyed(shellipelagoNetEvent) {
  if (typeof initialRoomApplyNetDestructibleDestroyed === "function") {
    initialRoomApplyNetDestructibleDestroyed(shellipelagoNetEvent.destructibleKey, shellipelagoNetEvent.room);
  }
}

function shellipelagoNetApplyAttack(shellipelagoNetEvent) {
  if (typeof initialRoomApplyNetAttack === "function") {
    initialRoomApplyNetAttack(shellipelagoNetEvent);
  }
}

function shellipelagoNetApplySnakeActivated(shellipelagoNetEvent) {
  if (typeof initialRoomApplyNetSnakeActivated === "function") {
    initialRoomApplyNetSnakeActivated(shellipelagoNetEvent.snake);
  }
}

function shellipelagoNetApplySnakeAwakened(shellipelagoNetEvent) {
  if (typeof initialRoomApplyNetSnakeAwakened === "function") {
    initialRoomApplyNetSnakeAwakened(shellipelagoNetEvent.snake);
  }
}

function shellipelagoNetApplyGameOver(shellipelagoNetEvent) {
  delete shellipelagoNetState.remotePlayers[shellipelagoNetEvent.playerId];

  if (typeof initialRoomApplyNetGameOver === "function") {
    initialRoomApplyNetGameOver({
      playerId: shellipelagoNetEvent.playerId,
      room: shellipelagoNetEvent.room
    });
  }
}

function shellipelagoNetApplyTankCollision(shellipelagoNetEvent) {
  if (typeof initialRoomApplyNetTankCollision === "function") {
    initialRoomApplyNetTankCollision({
      playerId: shellipelagoNetEvent.playerId,
      collidedPlayerId: shellipelagoNetEvent.collidedPlayerId,
      room: shellipelagoNetEvent.room
    });
  }
}

function shellipelagoNetApplyCellSync(shellipelagoNetEvent) {
  var shellipelagoNetSnapshot = shellipelagoNetGetRuntimeSnapshot();

  if (!shellipelagoNetSnapshot || !shellipelagoNetIsSameRoom(shellipelagoNetSnapshot.room, shellipelagoNetEvent.room)) {
    return;
  }

  shellipelagoNetSendLocalRoomState(shellipelagoNetEvent.playerId);
}

function shellipelagoNetSendCellSync() {
  var shellipelagoNetSnapshot = shellipelagoNetGetRuntimeSnapshot();

  if (!shellipelagoNetState.enabled || !shellipelagoNetSnapshot || !shellipelagoNetIsDataOpen()) {
    return;
  }

  shellipelagoNetBroadcastEvent({
    type: "cellSync",
    player: shellipelagoNetBuildPlayerInfo(),
    room: shellipelagoNetSnapshot.room
  });
}

function shellipelagoNetSendLocalRoomState(shellipelagoNetTargetPlayerId) {
  var shellipelagoNetStatePayload = typeof initialRoomGetNetRoomState === "function" ? initialRoomGetNetRoomState() : null;

  if (!shellipelagoNetStatePayload) {
    return;
  }

  (shellipelagoNetStatePayload.enemyKeys || []).forEach(function (shellipelagoNetEnemyKey) {
    shellipelagoNetBroadcastEnemyKilled(shellipelagoNetEnemyKey, shellipelagoNetStatePayload.room, shellipelagoNetTargetPlayerId);
  });
  (shellipelagoNetStatePayload.destructibleKeys || []).forEach(function (shellipelagoNetDestructibleKey) {
    shellipelagoNetBroadcastDestructibleDestroyed(shellipelagoNetDestructibleKey, shellipelagoNetStatePayload.room, shellipelagoNetTargetPlayerId);
  });
}

function shellipelagoNetBroadcastEnemyKilled(shellipelagoNetEnemyKey, shellipelagoNetRoom, shellipelagoNetTargetPlayerId) {
  shellipelagoNetBroadcastEvent({
    type: "enemyKilled",
    enemyKey: shellipelagoNetEnemyKey,
    room: shellipelagoNetRoom,
    targetPlayerId: shellipelagoNetTargetPlayerId || ""
  });
}

function shellipelagoNetBroadcastDestructibleDestroyed(shellipelagoNetDestructibleKey, shellipelagoNetRoom, shellipelagoNetTargetPlayerId) {
  shellipelagoNetBroadcastEvent({
    type: "destructibleDestroyed",
    destructibleKey: shellipelagoNetDestructibleKey,
    room: shellipelagoNetRoom,
    targetPlayerId: shellipelagoNetTargetPlayerId || ""
  });
}

function shellipelagoNetBroadcastAttack(shellipelagoNetAttack) {
  shellipelagoNetBroadcastEvent({
    type: "attack",
    attack: shellipelagoNetAttack
  });
}

function shellipelagoNetBroadcastSnakeActivated(shellipelagoNetSnakeActivation) {
  shellipelagoNetBroadcastEvent({
    type: "snakeActivated",
    snake: shellipelagoNetSnakeActivation
  });
}

function shellipelagoNetBroadcastSnakeAwakened(shellipelagoNetSnakeActivation) {
  shellipelagoNetBroadcastEvent({
    type: "snakeAwakened",
    snake: shellipelagoNetSnakeActivation
  });
}

function shellipelagoNetBroadcastGameOver(shellipelagoNetGameOver) {
  shellipelagoNetBroadcastEvent(Object.assign({
    type: "gameOver",
    playerId: shellipelagoNetState.playerId
  }, shellipelagoNetGameOver || {}));
}

function shellipelagoNetBroadcastTankCollision(shellipelagoNetTankCollision) {
  shellipelagoNetBroadcastEvent(Object.assign({
    type: "tankCollision",
    playerId: shellipelagoNetState.playerId
  }, shellipelagoNetTankCollision || {}));
}

function shellipelagoNetBroadcastEvent(shellipelagoNetEvent) {
  shellipelagoNetSendPacket({
    kind: "event",
    event: Object.assign({
      player: shellipelagoNetBuildPlayerInfo()
    }, shellipelagoNetEvent),
    targetPlayerId: shellipelagoNetEvent.targetPlayerId || ""
  });
}

function shellipelagoNetSendPacket(shellipelagoNetPacket) {
  if (!shellipelagoNetState.enabled || !shellipelagoNetPacket) {
    return false;
  }

  shellipelagoNetPacket.from = shellipelagoNetState.playerId;
  shellipelagoNetPacket.name = shellipelagoNetState.playerName;

  if (shellipelagoNetState.host) {
    shellipelagoNetRelayPacket(shellipelagoNetPacket, "");
    return true;
  }

  if (shellipelagoNetState.guestChannel && shellipelagoNetState.guestChannel.readyState === "open") {
    shellipelagoNetState.guestChannel.send(JSON.stringify(shellipelagoNetPacket));
    return true;
  }

  return false;
}

function shellipelagoNetRelayPacket(shellipelagoNetPacket, shellipelagoNetExceptPeerId) {
  var shellipelagoNetSent = false;

  Object.keys(shellipelagoNetState.hostConnections).forEach(function (shellipelagoNetPeerId) {
    var shellipelagoNetPeer = shellipelagoNetState.hostConnections[shellipelagoNetPeerId];

    if (shellipelagoNetPeerId === shellipelagoNetExceptPeerId) {
      return;
    }

    if (shellipelagoNetPacket.targetPlayerId && shellipelagoNetPacket.targetPlayerId !== shellipelagoNetPeerId) {
      return;
    }

    if (shellipelagoNetSendHostPeerPacket(shellipelagoNetPeer, shellipelagoNetPacket)) {
      shellipelagoNetSent = true;
    }
  });

  return shellipelagoNetSent;
}

function shellipelagoNetSendHostPeerPacket(shellipelagoNetPeer, shellipelagoNetPacket) {
  if (!shellipelagoNetPeer || !shellipelagoNetPeer.channel || shellipelagoNetPeer.channel.readyState !== "open") {
    return false;
  }

  shellipelagoNetPeer.channel.send(JSON.stringify(shellipelagoNetPacket));
  return true;
}

function shellipelagoNetIsDataOpen() {
  var shellipelagoNetOpen = false;

  if (shellipelagoNetState.guestChannel && shellipelagoNetState.guestChannel.readyState === "open") {
    return true;
  }

  Object.keys(shellipelagoNetState.hostConnections).forEach(function (shellipelagoNetPeerId) {
    var shellipelagoNetPeer = shellipelagoNetState.hostConnections[shellipelagoNetPeerId];

    if (shellipelagoNetPeer.channel && shellipelagoNetPeer.channel.readyState === "open") {
      shellipelagoNetOpen = true;
    }
  });

  return shellipelagoNetOpen;
}

function shellipelagoNetHasOpenHostPeer() {
  var shellipelagoNetHasOpenPeer = false;

  Object.keys(shellipelagoNetState.hostConnections).forEach(function (shellipelagoNetPeerId) {
    var shellipelagoNetPeer = shellipelagoNetState.hostConnections[shellipelagoNetPeerId];

    if (shellipelagoNetPeer.channel && shellipelagoNetPeer.channel.readyState === "open") {
      shellipelagoNetHasOpenPeer = true;
    }
  });

  return shellipelagoNetHasOpenPeer;
}

function shellipelagoNetPublishLobbyIfNeeded() {
  if (!shellipelagoNetState.host || shellipelagoNetState.lobbyClosedToNewPeers || shellipelagoNetState.roomVisibility !== "public") {
    return Promise.resolve();
  }

  return fetch(shellipelagoNetSignalingEndpoint + "/room/" + encodeURIComponent(shellipelagoNetState.roomCode) + "/lobby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      host: shellipelagoNetState.playerId,
      name: shellipelagoNetState.playerName,
      createdAt: Date.now()
    })
  }).then(shellipelagoNetReadResponse);
}

function shellipelagoNetDeleteLobby() {
  if (!shellipelagoNetState.roomCode) {
    return Promise.resolve();
  }

  return fetch(shellipelagoNetSignalingEndpoint + "/room/" + encodeURIComponent(shellipelagoNetState.roomCode) + "/lobby", {
    method: "DELETE"
  }).then(shellipelagoNetReadResponse);
}

function shellipelagoNetFindOpenLobby() {
  return fetch(shellipelagoNetSignalingEndpoint + "/lobbies/open")
    .then(shellipelagoNetReadResponse)
    .then(function (shellipelagoNetResult) {
      var shellipelagoNetLobbies = Array.isArray(shellipelagoNetResult.lobbies) ? shellipelagoNetResult.lobbies : [];
      var shellipelagoNetLobby = shellipelagoNetLobbies.find(function (shellipelagoNetEntry) {
        return shellipelagoNetEntry && shellipelagoNetEntry.room;
      });

      if (!shellipelagoNetLobby) {
        throw new Error("No open public lobbies found.");
      }

      return shellipelagoNetLobby.room;
    });
}

function shellipelagoNetSendSignal(shellipelagoNetType, shellipelagoNetPayload, shellipelagoNetTo) {
  if (!shellipelagoNetState.roomCode) {
    return Promise.resolve();
  }

  return fetch(shellipelagoNetRoomMessagesUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: shellipelagoNetCreateId(),
      from: shellipelagoNetState.playerId,
      to: shellipelagoNetTo || "",
      role: shellipelagoNetState.role,
      name: shellipelagoNetState.playerName,
      type: shellipelagoNetType,
      payload: shellipelagoNetPayload || null
    })
  }).then(shellipelagoNetReadResponse);
}

function shellipelagoNetReadResponse(shellipelagoNetResponse) {
  return shellipelagoNetResponse.json().then(function (shellipelagoNetBody) {
    if (!shellipelagoNetResponse.ok || shellipelagoNetBody.error) {
      throw new Error(shellipelagoNetBody.error || "Shellipelago networking failed.");
    }

    return shellipelagoNetBody;
  });
}

function shellipelagoNetRoomMessagesUrl() {
  return shellipelagoNetSignalingEndpoint + "/room/" + encodeURIComponent(shellipelagoNetState.roomCode) + "/messages";
}

function shellipelagoNetGetRuntimeSnapshot() {
  if (typeof initialRoomGetNetSnapshot !== "function") {
    return null;
  }

  return initialRoomGetNetSnapshot();
}

function shellipelagoNetGetLocalPlayerId() {
  return shellipelagoNetState.playerId;
}

function shellipelagoNetGetRemotePlayers() {
  return Object.keys(shellipelagoNetState.remotePlayers).map(function (shellipelagoNetPlayerId) {
    return shellipelagoNetInterpolateRemotePlayer(shellipelagoNetState.remotePlayers[shellipelagoNetPlayerId]);
  });
}

function shellipelagoNetInterpolateRemotePlayer(shellipelagoNetRemote) {
  var shellipelagoNetNow = Date.now();
  var shellipelagoNetFrom = shellipelagoNetRemote.fromSnapshot || shellipelagoNetRemote.snapshot;
  var shellipelagoNetTarget = shellipelagoNetRemote.targetSnapshot || shellipelagoNetRemote.snapshot;
  var shellipelagoNetDuration = Math.max(1, Number(shellipelagoNetRemote.lerpUntil || 0) - Number(shellipelagoNetRemote.lerpStartedAt || 0));
  var shellipelagoNetProgress = Math.min(1, Math.max(0, (shellipelagoNetNow - Number(shellipelagoNetRemote.lerpStartedAt || 0)) / shellipelagoNetDuration));
  var shellipelagoNetSnapshot = null;

  if (!shellipelagoNetFrom || !shellipelagoNetTarget) {
    return shellipelagoNetRemote;
  }

  if (shellipelagoNetProgress >= 1) {
    shellipelagoNetRemote.snapshot = shellipelagoNetCloneSnapshot(shellipelagoNetTarget);
    shellipelagoNetRemote.snapshot.moving = false;
    return shellipelagoNetRemote;
  }

  shellipelagoNetSnapshot = shellipelagoNetCloneSnapshot(shellipelagoNetTarget);
  shellipelagoNetSnapshot.x = shellipelagoNetLerp(Number(shellipelagoNetFrom.x) || 0, Number(shellipelagoNetTarget.x) || 0, shellipelagoNetProgress);
  shellipelagoNetSnapshot.y = shellipelagoNetLerp(Number(shellipelagoNetFrom.y) || 0, Number(shellipelagoNetTarget.y) || 0, shellipelagoNetProgress);
  shellipelagoNetSnapshot.moving = true;
  shellipelagoNetRemote.snapshot = shellipelagoNetSnapshot;
  return shellipelagoNetRemote;
}

function shellipelagoNetLerp(shellipelagoNetStart, shellipelagoNetEnd, shellipelagoNetProgress) {
  return shellipelagoNetStart + ((shellipelagoNetEnd - shellipelagoNetStart) * shellipelagoNetProgress);
}

function shellipelagoNetPruneRemotePlayers(shellipelagoNetNow) {
  Object.keys(shellipelagoNetState.remotePlayers).forEach(function (shellipelagoNetPlayerId) {
    if (shellipelagoNetNow - shellipelagoNetState.remotePlayers[shellipelagoNetPlayerId].lastSeenAt > shellipelagoNetPlayerTtlMs) {
      delete shellipelagoNetState.remotePlayers[shellipelagoNetPlayerId];
    }
  });
}

function shellipelagoNetBuildPlayerInfo() {
  return {
    id: shellipelagoNetState.playerId,
    name: shellipelagoNetState.playerName,
    color: shellipelagoNetGetPlayerColor(shellipelagoNetState.playerId)
  };
}

function shellipelagoNetNormalizeRoomCode(shellipelagoNetRoomCode) {
  return String(shellipelagoNetRoomCode || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 80);
}

function shellipelagoNetCreatePublicRoomCode() {
  var shellipelagoNetRoom = shellipelagoNetRandomRoomSuffix(6);

  while (shellipelagoNetRoom.charAt(0) === "0") {
    shellipelagoNetRoom = shellipelagoNetRandomRoomSuffix(6);
  }

  return shellipelagoNetRoom;
}

function shellipelagoNetRandomRoomSuffix(shellipelagoNetLength) {
  return Math.random().toString(36).slice(2, 2 + shellipelagoNetLength).toUpperCase();
}

function shellipelagoNetCreateId() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return String(Date.now()) + "-" + String(Math.random()).slice(2);
}

function shellipelagoNetRoomResumeToken() {
  var shellipelagoNetStorageKey = "shellipelagoNetResumeToken:" + shellipelagoNetState.roomCode;
  var shellipelagoNetStoredToken = sessionStorage.getItem(shellipelagoNetStorageKey);

  if (shellipelagoNetStoredToken) {
    return shellipelagoNetStoredToken;
  }

  shellipelagoNetStoredToken = shellipelagoNetCreateId();
  sessionStorage.setItem(shellipelagoNetStorageKey, shellipelagoNetStoredToken);
  return shellipelagoNetStoredToken;
}

function shellipelagoNetGetPlayerColor(shellipelagoNetPlayerId) {
  var shellipelagoNetKnownColors = ["#3487ff", "#e23c3c", "#32b45f"];
  var shellipelagoNetAssignedIds = Object.keys(shellipelagoNetState.colorByPlayerId);
  var shellipelagoNetHash = 0;
  var shellipelagoNetIndex = 0;

  if (shellipelagoNetState.colorByPlayerId[shellipelagoNetPlayerId]) {
    return shellipelagoNetState.colorByPlayerId[shellipelagoNetPlayerId];
  }

  if (shellipelagoNetAssignedIds.length < shellipelagoNetKnownColors.length) {
    shellipelagoNetState.colorByPlayerId[shellipelagoNetPlayerId] = shellipelagoNetKnownColors[shellipelagoNetAssignedIds.length];
    return shellipelagoNetState.colorByPlayerId[shellipelagoNetPlayerId];
  }

  while (shellipelagoNetIndex < shellipelagoNetPlayerId.length) {
    shellipelagoNetHash = ((shellipelagoNetHash << 5) - shellipelagoNetHash) + shellipelagoNetPlayerId.charCodeAt(shellipelagoNetIndex);
    shellipelagoNetHash |= 0;
    shellipelagoNetIndex += 1;
  }

  shellipelagoNetState.colorByPlayerId[shellipelagoNetPlayerId] = "hsl(" + (Math.abs(shellipelagoNetHash) % 360) + ", 78%, 58%)";
  return shellipelagoNetState.colorByPlayerId[shellipelagoNetPlayerId];
}

function shellipelagoNetIsSameRoom(shellipelagoNetFirst, shellipelagoNetSecond) {
  return shellipelagoNetFirst && shellipelagoNetSecond &&
    Number(shellipelagoNetFirst.x) === Number(shellipelagoNetSecond.x) &&
    Number(shellipelagoNetFirst.y) === Number(shellipelagoNetSecond.y);
}

function shellipelagoNetMessage(shellipelagoNetText) {
  if (typeof archipelagoClientQueueServerMessage === "function") {
    archipelagoClientQueueServerMessage(shellipelagoNetText);
  } else {
    console.log(shellipelagoNetText);
  }
}

function shellipelagoNetReportError(shellipelagoNetError) {
  shellipelagoNetMessage(shellipelagoNetError && shellipelagoNetError.message ? shellipelagoNetError.message : "Shellipelago networking failed.");
}

shellipelagoNetInit();
