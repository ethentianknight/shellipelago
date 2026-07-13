var shellipelagoNetVersion = 3;
var shellipelagoNetSignalingEndpoint = "https://shellipelago-net-signaling.mark-c49.workers.dev";
var shellipelagoNetDefaultIceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun.cloudflare.com:3478" }
];
var shellipelagoNetRtcConfig = {
  iceServers: shellipelagoNetBuildIceServers(),
  iceCandidatePoolSize: 8
};
var shellipelagoNetSignalingPollMs = 1000;
var shellipelagoNetPositionLerpMs = 180;
var shellipelagoNetPositionIntervalMs = 100;
var shellipelagoNetHeartbeatIntervalMs = 5000;
var shellipelagoNetLobbyRefreshMs = 45000;
var shellipelagoNetLobbyAutoCloseMs = 300000;
var shellipelagoNetPlayerTtlMs = 12000;
var shellipelagoNetSignalStaleGraceMs = 120000;
var shellipelagoNetFailureMessageDelayMs = 15000;
var shellipelagoNetIceGatheringWaitMs = 2500;
var shellipelagoNetDebugEnabled = true;
var shellipelagoNetJsonLogLimit = 1200;
var shellipelagoNetJsonLog = [];
var shellipelagoNetSignalSendQueue = Promise.resolve();
var shellipelagoNetSignalHandleQueue = Promise.resolve();
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
  guestFailureMessageTimer: 0,
  guestPeerId: "",
  guestSignalSessionId: "",
  guestAnswerSent: false,
  pendingGuestLocalCandidates: [],
  pendingGuestCandidates: [],
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
  var shellipelagoNetTurnMatch = shellipelagoNetCommandText.match(/^!turn(?:\s+(\S+)(?:\s+(\S+)(?:\s+(.+))?)?)?$/i);

  if (shellipelagoNetNameMatch) {
    return shellipelagoNetSetName(shellipelagoNetNameMatch[1]);
  }

  if (!shellipelagoNetIsNetworkCommand(shellipelagoNetCommandText)) {
    return false;
  }

  if (shellipelagoNetTurnMatch) {
    shellipelagoNetConfigureTurn(shellipelagoNetTurnMatch[1], shellipelagoNetTurnMatch[2], shellipelagoNetTurnMatch[3]);
    return true;
  }

  if (/^!turnclear$/i.test(shellipelagoNetCommandText)) {
    shellipelagoNetClearTurn();
    return true;
  }

  if (/^!turnstatus$/i.test(shellipelagoNetCommandText)) {
    shellipelagoNetReportTurnStatus();
    return true;
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
  return /^!(host|join|close|leave|kick|ban|turn|turnclear|turnstatus)(?:\s|$)/i.test(shellipelagoNetCommandText);
}

function shellipelagoNetBuildIceServers() {
  var shellipelagoNetIceServers = shellipelagoNetDefaultIceServers.slice();
  var shellipelagoNetTurnServer = shellipelagoNetGetTurnServer();

  if (shellipelagoNetTurnServer) {
    shellipelagoNetIceServers.push(shellipelagoNetTurnServer);
  }

  return shellipelagoNetIceServers;
}

function shellipelagoNetRefreshRtcConfig() {
  shellipelagoNetRtcConfig = {
    iceServers: shellipelagoNetBuildIceServers(),
    iceCandidatePoolSize: 8
  };
  shellipelagoNetDebug("turn:rtc-config", {
    iceServerCount: shellipelagoNetRtcConfig.iceServers.length,
    hasTurn: Boolean(shellipelagoNetGetTurnServer())
  });
}

function shellipelagoNetConfigureTurn(shellipelagoNetUrl, shellipelagoNetUsername, shellipelagoNetCredential) {
  var shellipelagoNetTurnServer = null;

  if (!shellipelagoNetUrl) {
    shellipelagoNetMessage("Usage: !turn turn:host:port username credential");
    shellipelagoNetReportTurnStatus();
    return;
  }

  if (!/^turns?:/i.test(shellipelagoNetUrl)) {
    shellipelagoNetMessage("TURN URL must start with turn: or turns:.");
    return;
  }

  shellipelagoNetTurnServer = {
    urls: shellipelagoNetUrl
  };

  if (shellipelagoNetUsername) {
    shellipelagoNetTurnServer.username = shellipelagoNetUsername;
  }

  if (shellipelagoNetCredential) {
    shellipelagoNetTurnServer.credential = shellipelagoNetCredential;
  }

  localStorage.setItem("shellipelagoNetTurnServer", JSON.stringify(shellipelagoNetTurnServer));
  shellipelagoNetRefreshRtcConfig();
  shellipelagoNetMessage("TURN server saved. Start a new room/join attempt for it to apply.");
}

function shellipelagoNetClearTurn() {
  localStorage.removeItem("shellipelagoNetTurnServer");
  shellipelagoNetRefreshRtcConfig();
  shellipelagoNetMessage("TURN server cleared. New connections will use STUN only.");
}

function shellipelagoNetReportTurnStatus() {
  var shellipelagoNetTurnServer = shellipelagoNetGetTurnServer();

  if (!shellipelagoNetTurnServer) {
    shellipelagoNetMessage("No TURN server configured. Use !turn turn:host:port username credential.");
    return;
  }

  shellipelagoNetMessage("TURN server configured: " + shellipelagoNetTurnServer.urls + ".");
}

function shellipelagoNetGetTurnServer() {
  var shellipelagoNetRawTurnServer = "";
  var shellipelagoNetTurnServer = null;

  try {
    shellipelagoNetRawTurnServer = localStorage.getItem("shellipelagoNetTurnServer") || "";
    shellipelagoNetTurnServer = shellipelagoNetRawTurnServer ? JSON.parse(shellipelagoNetRawTurnServer) : null;
  } catch (shellipelagoNetError) {
    return null;
  }

  if (!shellipelagoNetTurnServer || !shellipelagoNetTurnServer.urls || !/^turns?:/i.test(String(shellipelagoNetTurnServer.urls))) {
    return null;
  }

  return shellipelagoNetTurnServer;
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

  shellipelagoNetDebug("host:start", {
    room: shellipelagoNetRoomCode,
    visibility: shellipelagoNetVisibility,
    playerId: shellipelagoNetState.playerId,
    name: shellipelagoNetState.playerName
  });
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
    shellipelagoNetDebug("join:start", {
      room: shellipelagoNetResolvedRoomCode,
      requestedRoom: shellipelagoNetRoomCode,
      playerId: shellipelagoNetState.playerId,
      name: shellipelagoNetState.playerName
    });
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
  shellipelagoNetDebug("guest:peer-created", shellipelagoNetGetConnectionDebugState(shellipelagoNetState.guestConnection));
  shellipelagoNetState.guestConnection.onconnectionstatechange = function () {
    shellipelagoNetDebug("guest:connection-state", shellipelagoNetGetConnectionDebugState(shellipelagoNetState.guestConnection));
    shellipelagoNetLogConnectionStats("guest:connection-state", shellipelagoNetState.guestConnection, {});
    if (shellipelagoNetState.guestConnection && shellipelagoNetState.guestConnection.connectionState === "failed") {
      shellipelagoNetScheduleGuestFailureMessage(shellipelagoNetState.guestConnection);
    } else if (shellipelagoNetState.guestConnection && shellipelagoNetState.guestConnection.connectionState === "connected") {
      shellipelagoNetCancelGuestFailureMessage("connection-connected");
    }
  };
  shellipelagoNetState.guestConnection.oniceconnectionstatechange = function () {
    shellipelagoNetDebug("guest:ice-connection-state", shellipelagoNetGetConnectionDebugState(shellipelagoNetState.guestConnection));
    shellipelagoNetLogConnectionStats("guest:ice-connection-state", shellipelagoNetState.guestConnection, {});
    if (shellipelagoNetState.guestConnection && (
      shellipelagoNetState.guestConnection.iceConnectionState === "connected" ||
      shellipelagoNetState.guestConnection.iceConnectionState === "completed"
    )) {
      shellipelagoNetCancelGuestFailureMessage("ice-connected");
    }
  };
  shellipelagoNetState.guestConnection.onicegatheringstatechange = function () {
    shellipelagoNetDebug("guest:ice-gathering-state", shellipelagoNetGetConnectionDebugState(shellipelagoNetState.guestConnection));
  };
  shellipelagoNetState.guestConnection.onicecandidateerror = function (shellipelagoNetEvent) {
    shellipelagoNetDebug("guest:candidate-error", shellipelagoNetDescribeIceCandidateError(shellipelagoNetEvent));
  };
  shellipelagoNetState.guestConnection.onicecandidate = function (shellipelagoNetEvent) {
    if (shellipelagoNetEvent.candidate && shellipelagoNetState.guestPeerId) {
      shellipelagoNetDebug("guest:candidate-local", shellipelagoNetDescribeCandidate(shellipelagoNetEvent.candidate));
      shellipelagoNetSendOrQueueGuestCandidate(shellipelagoNetEvent.candidate);
    } else if (shellipelagoNetEvent.candidate) {
      shellipelagoNetDebug("guest:candidate-local-waiting-for-peer", shellipelagoNetDescribeCandidate(shellipelagoNetEvent.candidate));
      shellipelagoNetState.pendingGuestLocalCandidates.push(shellipelagoNetEvent.candidate);
    } else if (!shellipelagoNetEvent.candidate) {
      shellipelagoNetDebug("guest:candidate-complete", shellipelagoNetGetConnectionDebugState(shellipelagoNetState.guestConnection));
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
    signalSessionId: shellipelagoNetCreateId(),
    offerSent: false,
    pendingLocalCandidates: [],
    pendingCandidates: [],
    failureMessageTimer: 0,
    state: "new"
  };

  shellipelagoNetDebug("host:peer-created", {
    peerId: shellipelagoNetRemotePeerId,
    peerName: shellipelagoNetPeer.name,
    state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
  });
  shellipelagoNetConnection.onconnectionstatechange = function () {
    shellipelagoNetPeer.state = shellipelagoNetConnection.connectionState;
    shellipelagoNetDebug("host:connection-state", {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name,
      state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
    });
    shellipelagoNetLogConnectionStats("host:connection-state", shellipelagoNetConnection, {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name
    });
    if (shellipelagoNetConnection.connectionState === "failed") {
      shellipelagoNetScheduleHostFailureMessage(shellipelagoNetPeer, shellipelagoNetConnection);
    } else if (shellipelagoNetConnection.connectionState === "connected") {
      shellipelagoNetCancelHostFailureMessage(shellipelagoNetPeer, "connection-connected");
    }
  };
  shellipelagoNetConnection.oniceconnectionstatechange = function () {
    shellipelagoNetDebug("host:ice-connection-state", {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name,
      state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
    });
    shellipelagoNetLogConnectionStats("host:ice-connection-state", shellipelagoNetConnection, {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name
    });
    if (shellipelagoNetConnection.iceConnectionState === "connected" || shellipelagoNetConnection.iceConnectionState === "completed") {
      shellipelagoNetCancelHostFailureMessage(shellipelagoNetPeer, "ice-connected");
    }
  };
  shellipelagoNetConnection.onicegatheringstatechange = function () {
    shellipelagoNetDebug("host:ice-gathering-state", {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name,
      state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
    });
  };
  shellipelagoNetConnection.onicecandidateerror = function (shellipelagoNetEvent) {
    shellipelagoNetDebug("host:candidate-error", Object.assign({
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name
    }, shellipelagoNetDescribeIceCandidateError(shellipelagoNetEvent)));
  };
  shellipelagoNetConnection.onicecandidate = function (shellipelagoNetEvent) {
    if (shellipelagoNetEvent.candidate) {
      shellipelagoNetDebug("host:candidate-local", Object.assign({
        peerId: shellipelagoNetPeer.id,
        peerName: shellipelagoNetPeer.name
      }, shellipelagoNetDescribeCandidate(shellipelagoNetEvent.candidate)));
      shellipelagoNetSendOrQueueHostCandidate(shellipelagoNetPeer, shellipelagoNetEvent.candidate);
    } else {
      shellipelagoNetDebug("host:candidate-complete", {
        peerId: shellipelagoNetPeer.id,
        peerName: shellipelagoNetPeer.name,
        state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
      });
    }
  };
  shellipelagoNetPeer.channel = shellipelagoNetConnection.createDataChannel("shellipelago");
  shellipelagoNetAttachHostChannel(shellipelagoNetPeer.channel, shellipelagoNetPeer);
  shellipelagoNetState.hostConnections[shellipelagoNetRemotePeerId] = shellipelagoNetPeer;
  return shellipelagoNetPeer;
}

function shellipelagoNetAttachGuestChannel(shellipelagoNetChannel) {
  shellipelagoNetState.guestChannel = shellipelagoNetChannel;
  shellipelagoNetDebug("guest:channel-attached", {
    label: shellipelagoNetChannel.label,
    readyState: shellipelagoNetChannel.readyState
  });
  shellipelagoNetChannel.onopen = function () {
    shellipelagoNetCancelGuestFailureMessage("channel-open");
    shellipelagoNetDebug("guest:channel-open", {
      label: shellipelagoNetChannel.label,
      readyState: shellipelagoNetChannel.readyState
    });
    shellipelagoNetLogConnectionStats("guest:channel-open", shellipelagoNetState.guestConnection, {});
    shellipelagoNetMessage("Network data channel open.");
    if (typeof initialRoomGrantNetworkJoinInvulnerability === "function") {
      initialRoomGrantNetworkJoinInvulnerability();
    }
    shellipelagoNetSendCellSync();
    shellipelagoNetSendPosition();
  };
  shellipelagoNetChannel.onmessage = function (shellipelagoNetEvent) {
    shellipelagoNetHandlePacket(String(shellipelagoNetEvent.data || ""), null);
  };
  shellipelagoNetChannel.onclose = function () {
    shellipelagoNetDebug("guest:channel-close", {
      label: shellipelagoNetChannel.label,
      readyState: shellipelagoNetChannel.readyState
    });
    shellipelagoNetState.remotePlayers = {};
    shellipelagoNetMessage("Network data channel closed.");
  };
  shellipelagoNetChannel.onerror = function (shellipelagoNetEvent) {
    shellipelagoNetDebug("guest:channel-error", shellipelagoNetEvent);
  };
}

function shellipelagoNetAttachHostChannel(shellipelagoNetChannel, shellipelagoNetPeer) {
  shellipelagoNetDebug("host:channel-created", {
    peerId: shellipelagoNetPeer.id,
    peerName: shellipelagoNetPeer.name,
    label: shellipelagoNetChannel.label,
    readyState: shellipelagoNetChannel.readyState
  });
  shellipelagoNetChannel.onopen = function () {
    shellipelagoNetPeer.state = "connected";
    shellipelagoNetCancelHostFailureMessage(shellipelagoNetPeer, "channel-open");
    shellipelagoNetDebug("host:channel-open", {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name,
      label: shellipelagoNetChannel.label,
      readyState: shellipelagoNetChannel.readyState
    });
    shellipelagoNetLogConnectionStats("host:channel-open", shellipelagoNetPeer.connection, {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name
    });
    shellipelagoNetMessage(shellipelagoNetPeer.name + " connected.");
    if (typeof initialRoomGrantNetworkJoinInvulnerability === "function") {
      initialRoomGrantNetworkJoinInvulnerability();
    }
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
    delete shellipelagoNetState.remotePlayers[shellipelagoNetPeer.id];
    shellipelagoNetBroadcastEvent({
      type: "playerDisconnected",
      disconnectedPlayerId: shellipelagoNetPeer.id
    });
    shellipelagoNetDebug("host:channel-close", {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name,
      label: shellipelagoNetChannel.label,
      readyState: shellipelagoNetChannel.readyState
    });
  };
  shellipelagoNetChannel.onerror = function (shellipelagoNetEvent) {
    shellipelagoNetDebug("host:channel-error", {
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name,
      event: shellipelagoNetEvent
    });
  };
}

function shellipelagoNetScheduleGuestFailureMessage(shellipelagoNetConnection) {
  shellipelagoNetCancelGuestFailureMessage("reschedule");
  shellipelagoNetDebug("guest:failure-message-scheduled", {
    delayMs: shellipelagoNetFailureMessageDelayMs,
    state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
  });
  shellipelagoNetState.guestFailureMessageTimer = window.setTimeout(function () {
    shellipelagoNetState.guestFailureMessageTimer = 0;
    if (shellipelagoNetShouldShowGuestFailure(shellipelagoNetConnection)) {
      shellipelagoNetDebug("guest:failure-message-final", shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection));
      shellipelagoNetMessage("Network connection failed.");
    } else {
      shellipelagoNetDebug("guest:failure-message-cancelled-late", {
        state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection),
        channelState: shellipelagoNetState.guestChannel ? shellipelagoNetState.guestChannel.readyState : ""
      });
    }
  }, shellipelagoNetFailureMessageDelayMs);
}

function shellipelagoNetCancelGuestFailureMessage(shellipelagoNetReason) {
  if (!shellipelagoNetState.guestFailureMessageTimer) {
    return;
  }

  window.clearTimeout(shellipelagoNetState.guestFailureMessageTimer);
  shellipelagoNetState.guestFailureMessageTimer = 0;
  shellipelagoNetDebug("guest:failure-message-cancelled", {
    reason: shellipelagoNetReason || ""
  });
}

function shellipelagoNetShouldShowGuestFailure(shellipelagoNetConnection) {
  if (!shellipelagoNetConnection || shellipelagoNetState.guestConnection !== shellipelagoNetConnection) {
    return false;
  }

  if (shellipelagoNetState.guestChannel && shellipelagoNetState.guestChannel.readyState === "open") {
    return false;
  }

  return shellipelagoNetConnection.connectionState === "failed" ||
    shellipelagoNetConnection.iceConnectionState === "failed";
}

function shellipelagoNetScheduleHostFailureMessage(shellipelagoNetPeer, shellipelagoNetConnection) {
  shellipelagoNetCancelHostFailureMessage(shellipelagoNetPeer, "reschedule");
  shellipelagoNetDebug("host:failure-message-scheduled", {
    peerId: shellipelagoNetPeer.id,
    peerName: shellipelagoNetPeer.name,
    delayMs: shellipelagoNetFailureMessageDelayMs,
    state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
  });
  shellipelagoNetPeer.failureMessageTimer = window.setTimeout(function () {
    shellipelagoNetPeer.failureMessageTimer = 0;
    if (shellipelagoNetShouldShowHostFailure(shellipelagoNetPeer, shellipelagoNetConnection)) {
      shellipelagoNetDebug("host:failure-message-final", {
        peerId: shellipelagoNetPeer.id,
        peerName: shellipelagoNetPeer.name,
        state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
      });
      shellipelagoNetMessage(shellipelagoNetPeer.name + " connection failed.");
    } else {
      shellipelagoNetDebug("host:failure-message-cancelled-late", {
        peerId: shellipelagoNetPeer.id,
        peerName: shellipelagoNetPeer.name,
        state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection),
        channelState: shellipelagoNetPeer.channel ? shellipelagoNetPeer.channel.readyState : ""
      });
    }
  }, shellipelagoNetFailureMessageDelayMs);
}

function shellipelagoNetCancelHostFailureMessage(shellipelagoNetPeer, shellipelagoNetReason) {
  if (!shellipelagoNetPeer || !shellipelagoNetPeer.failureMessageTimer) {
    return;
  }

  window.clearTimeout(shellipelagoNetPeer.failureMessageTimer);
  shellipelagoNetPeer.failureMessageTimer = 0;
  shellipelagoNetDebug("host:failure-message-cancelled", {
    peerId: shellipelagoNetPeer.id,
    peerName: shellipelagoNetPeer.name,
    reason: shellipelagoNetReason || ""
  });
}

function shellipelagoNetShouldShowHostFailure(shellipelagoNetPeer, shellipelagoNetConnection) {
  if (!shellipelagoNetPeer || !shellipelagoNetConnection || shellipelagoNetPeer.connection !== shellipelagoNetConnection) {
    return false;
  }

  if (shellipelagoNetState.hostConnections[shellipelagoNetPeer.id] !== shellipelagoNetPeer) {
    return false;
  }

  if (shellipelagoNetPeer.channel && shellipelagoNetPeer.channel.readyState === "open") {
    return false;
  }

  return shellipelagoNetConnection.connectionState === "failed" ||
    shellipelagoNetConnection.iceConnectionState === "failed";
}

function shellipelagoNetCloseGuestConnection() {
  shellipelagoNetCancelGuestFailureMessage("close");

  if (shellipelagoNetState.guestChannel) {
    shellipelagoNetState.guestChannel.onopen = null;
    shellipelagoNetState.guestChannel.onmessage = null;
    shellipelagoNetState.guestChannel.onclose = null;
    shellipelagoNetState.guestChannel.close();
  }

  if (shellipelagoNetState.guestConnection) {
    shellipelagoNetState.guestConnection.ondatachannel = null;
    shellipelagoNetState.guestConnection.onconnectionstatechange = null;
    shellipelagoNetState.guestConnection.oniceconnectionstatechange = null;
    shellipelagoNetState.guestConnection.onicegatheringstatechange = null;
    shellipelagoNetState.guestConnection.onicecandidate = null;
    shellipelagoNetState.guestConnection.onicecandidateerror = null;
    shellipelagoNetState.guestConnection.close();
  }

  shellipelagoNetState.guestChannel = null;
  shellipelagoNetState.guestConnection = null;
  shellipelagoNetState.guestPeerId = "";
  shellipelagoNetState.guestSignalSessionId = "";
  shellipelagoNetState.guestAnswerSent = false;
  shellipelagoNetState.pendingGuestLocalCandidates = [];
  shellipelagoNetState.pendingGuestCandidates = [];
}

function shellipelagoNetCloseHostPeer(shellipelagoNetPeer) {
  shellipelagoNetCancelHostFailureMessage(shellipelagoNetPeer, "close");

  if (shellipelagoNetPeer.channel) {
    shellipelagoNetPeer.channel.onopen = null;
    shellipelagoNetPeer.channel.onmessage = null;
    shellipelagoNetPeer.channel.onclose = null;
    shellipelagoNetPeer.channel.close();
  }

  if (shellipelagoNetPeer.connection) {
    shellipelagoNetPeer.connection.onconnectionstatechange = null;
    shellipelagoNetPeer.connection.oniceconnectionstatechange = null;
    shellipelagoNetPeer.connection.onicegatheringstatechange = null;
    shellipelagoNetPeer.connection.onicecandidate = null;
    shellipelagoNetPeer.connection.onicecandidateerror = null;
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
  shellipelagoNetState.lastPollAt = Date.now();
  shellipelagoNetDebug("signals:poll", {
    room: shellipelagoNetState.roomCode,
    peer: shellipelagoNetState.playerId,
    role: shellipelagoNetState.role
  });
  fetch(
    shellipelagoNetRoomMessagesUrl() +
    "?peer=" + encodeURIComponent(shellipelagoNetState.playerId) +
    "&role=" + encodeURIComponent(shellipelagoNetState.role)
  )
    .then(shellipelagoNetReadResponse)
    .then(function (shellipelagoNetResult) {
      var shellipelagoNetMessages = Array.isArray(shellipelagoNetResult.messages) ? shellipelagoNetResult.messages : [];

      shellipelagoNetDebug("signals:poll-result", {
        count: shellipelagoNetMessages.length,
        types: shellipelagoNetMessages.map(function (shellipelagoNetMessageEntry) {
          return shellipelagoNetMessageEntry.type;
        })
      });
      shellipelagoNetQueueSignalHandling(shellipelagoNetMessages);
    })
    .catch(shellipelagoNetReportError);
}

function shellipelagoNetQueueSignalHandling(shellipelagoNetMessages) {
  shellipelagoNetSignalHandleQueue = shellipelagoNetSignalHandleQueue.then(async function () {
    var shellipelagoNetIndex = 0;

    while (shellipelagoNetIndex < shellipelagoNetMessages.length) {
      await shellipelagoNetHandleSignal(shellipelagoNetMessages[shellipelagoNetIndex]);
      shellipelagoNetIndex += 1;
    }
  }, async function () {
    var shellipelagoNetIndex = 0;

    while (shellipelagoNetIndex < shellipelagoNetMessages.length) {
      await shellipelagoNetHandleSignal(shellipelagoNetMessages[shellipelagoNetIndex]);
      shellipelagoNetIndex += 1;
    }
  });

  shellipelagoNetSignalHandleQueue.catch(shellipelagoNetReportError);
}

async function shellipelagoNetHandleSignal(shellipelagoNetSignal) {
  var shellipelagoNetPeer = null;
  var shellipelagoNetAnswer = null;

  if (!shellipelagoNetSignal || !shellipelagoNetSignal.id || shellipelagoNetState.seenSignalIds[shellipelagoNetSignal.id] || shellipelagoNetSignal.from === shellipelagoNetState.playerId) {
    if (!shellipelagoNetSignal || !shellipelagoNetSignal.id) {
      shellipelagoNetDebug("signals:ignored", {
        reason: !shellipelagoNetSignal ? "missing" : "missing-id",
        signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal)
      });
    }
    return;
  }

  shellipelagoNetDebug("signals:received", shellipelagoNetDescribeSignal(shellipelagoNetSignal));
  shellipelagoNetState.seenSignalIds[shellipelagoNetSignal.id] = true;

  if (shellipelagoNetIsStaleSignal(shellipelagoNetSignal)) {
    shellipelagoNetDebug("signals:ignored", {
      reason: "stale",
      signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal),
      joinedAt: shellipelagoNetState.joinedAt
    });
    return;
  }

  if (shellipelagoNetSignal.to && shellipelagoNetSignal.to !== shellipelagoNetState.playerId) {
    shellipelagoNetDebug("signals:ignored", {
      reason: "wrong-peer",
      signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal),
      localPeerId: shellipelagoNetState.playerId
    });
    return;
  }

  if ((shellipelagoNetSignal.type === "join" || shellipelagoNetSignal.type === "rejoin") && shellipelagoNetState.host) {
    if (shellipelagoNetState.bannedNames[String(shellipelagoNetSignal.name || "").toLowerCase()]) {
      await shellipelagoNetSendSignal("reject", { reason: "You are banned from this lobby." }, shellipelagoNetSignal.from);
      return;
    }

    shellipelagoNetDebug("host:join-signal", shellipelagoNetDescribeSignal(shellipelagoNetSignal));
    await shellipelagoNetCreateOfferForPeer(shellipelagoNetSignal);
    return;
  }

  if (shellipelagoNetSignal.type === "offer" && shellipelagoNetState.role === "guest" && !shellipelagoNetState.answeredOfferIds[shellipelagoNetSignal.id]) {
    if (shellipelagoNetIsDataOpen()) {
      shellipelagoNetDebug("guest:offer-ignored", {
        reason: "data-open",
        signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal)
      });
      return;
    }

    if (shellipelagoNetState.guestConnection && shellipelagoNetState.guestConnection.remoteDescription) {
      shellipelagoNetDebug("guest:offer-restart", {
        previousSessionId: shellipelagoNetState.guestSignalSessionId,
        nextSessionId: shellipelagoNetSignal.signalSessionId || "",
        signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal)
      });
      shellipelagoNetCloseGuestConnection();
    }

    if (!shellipelagoNetState.guestConnection) {
      shellipelagoNetCreateGuestConnection();
    }

    shellipelagoNetState.guestPeerId = shellipelagoNetSignal.from;
    shellipelagoNetState.guestSignalSessionId = shellipelagoNetSignal.signalSessionId || "";
    shellipelagoNetState.answeredOfferIds[shellipelagoNetSignal.id] = true;
    shellipelagoNetDebug("guest:offer-apply", shellipelagoNetDescribeSignal(shellipelagoNetSignal));
    await shellipelagoNetState.guestConnection.setRemoteDescription(shellipelagoNetSignal.payload);
    await shellipelagoNetFlushPendingIceCandidates(shellipelagoNetState.guestConnection, shellipelagoNetState.pendingGuestCandidates, shellipelagoNetState.guestSignalSessionId);
    shellipelagoNetAnswer = await shellipelagoNetState.guestConnection.createAnswer();
    await shellipelagoNetState.guestConnection.setLocalDescription(shellipelagoNetAnswer);
    if (await shellipelagoNetWaitForIceGatheringComplete(shellipelagoNetState.guestConnection, "guest", {
      type: "answer",
      peerId: shellipelagoNetSignal.from,
      peerName: shellipelagoNetSignal.name || ""
    })) {
      shellipelagoNetState.pendingGuestLocalCandidates = [];
    }
    await shellipelagoNetSendSignal("answer", shellipelagoNetState.guestConnection.localDescription, shellipelagoNetSignal.from, shellipelagoNetState.guestSignalSessionId);
    shellipelagoNetState.guestAnswerSent = true;
    shellipelagoNetFlushGuestLocalCandidates();
    return;
  }

  if (shellipelagoNetSignal.type === "answer" && shellipelagoNetState.host) {
    shellipelagoNetPeer = shellipelagoNetState.hostConnections[shellipelagoNetSignal.from];
    if (shellipelagoNetPeer && !shellipelagoNetIsSignalSessionCurrent(shellipelagoNetPeer.signalSessionId, shellipelagoNetSignal.signalSessionId)) {
      shellipelagoNetDebug("host:answer-ignored", {
        reason: "stale-session",
        expectedSessionId: shellipelagoNetPeer.signalSessionId,
        signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal)
      });
    } else if (shellipelagoNetPeer && !shellipelagoNetPeer.connection.currentRemoteDescription) {
      shellipelagoNetDebug("host:answer-apply", shellipelagoNetDescribeSignal(shellipelagoNetSignal));
      await shellipelagoNetPeer.connection.setRemoteDescription(shellipelagoNetSignal.payload);
      await shellipelagoNetFlushPendingIceCandidates(shellipelagoNetPeer.connection, shellipelagoNetPeer.pendingCandidates, shellipelagoNetPeer.signalSessionId);
    } else {
      shellipelagoNetDebug("host:answer-ignored", {
        reason: shellipelagoNetPeer ? "remote-description-exists" : "missing-peer",
        signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal)
      });
    }
    return;
  }

  if (shellipelagoNetSignal.type === "candidate") {
    if (shellipelagoNetState.role === "guest" && shellipelagoNetState.guestConnection) {
      if (!shellipelagoNetIsSignalSessionCurrent(shellipelagoNetState.guestSignalSessionId, shellipelagoNetSignal.signalSessionId)) {
        shellipelagoNetDebug("guest:candidate-ignored", {
          reason: "stale-session",
          expectedSessionId: shellipelagoNetState.guestSignalSessionId,
          signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal)
        });
        return;
      }

      shellipelagoNetDebug("guest:candidate-remote", shellipelagoNetDescribeSignal(shellipelagoNetSignal));
      await shellipelagoNetAddIceCandidate(shellipelagoNetState.guestConnection, shellipelagoNetSignal.payload, shellipelagoNetState.pendingGuestCandidates, shellipelagoNetSignal.signalSessionId);
    } else if (shellipelagoNetState.host) {
      shellipelagoNetPeer = shellipelagoNetState.hostConnections[shellipelagoNetSignal.from];
      if (shellipelagoNetPeer) {
        if (!shellipelagoNetIsSignalSessionCurrent(shellipelagoNetPeer.signalSessionId, shellipelagoNetSignal.signalSessionId)) {
          shellipelagoNetDebug("host:candidate-ignored", {
            reason: "stale-session",
            expectedSessionId: shellipelagoNetPeer.signalSessionId,
            signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal)
          });
          return;
        }

        shellipelagoNetDebug("host:candidate-remote", shellipelagoNetDescribeSignal(shellipelagoNetSignal));
        await shellipelagoNetAddIceCandidate(shellipelagoNetPeer.connection, shellipelagoNetSignal.payload, shellipelagoNetPeer.pendingCandidates, shellipelagoNetSignal.signalSessionId);
      } else {
        shellipelagoNetDebug("host:candidate-ignored", {
          reason: "missing-peer",
          signal: shellipelagoNetDescribeSignal(shellipelagoNetSignal)
        });
      }
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
  shellipelagoNetDebug("host:offer-created", {
    peerId: shellipelagoNetPeer.id,
    peerName: shellipelagoNetPeer.name,
    sdpLength: shellipelagoNetOffer && shellipelagoNetOffer.sdp ? shellipelagoNetOffer.sdp.length : 0
  });
  await shellipelagoNetPeer.connection.setLocalDescription(shellipelagoNetOffer);
  if (await shellipelagoNetWaitForIceGatheringComplete(shellipelagoNetPeer.connection, "host", {
    peerId: shellipelagoNetPeer.id,
    peerName: shellipelagoNetPeer.name,
    type: "offer"
  })) {
    shellipelagoNetPeer.pendingLocalCandidates = [];
  }
  await shellipelagoNetSendSignal("offer", shellipelagoNetPeer.connection.localDescription, shellipelagoNetPeer.id, shellipelagoNetPeer.signalSessionId);
  shellipelagoNetPeer.offerSent = true;
  shellipelagoNetFlushHostLocalCandidates(shellipelagoNetPeer);
}

function shellipelagoNetSendOrQueueHostCandidate(shellipelagoNetPeer, shellipelagoNetCandidate) {
  if (!shellipelagoNetPeer || !shellipelagoNetCandidate) {
    return;
  }

  if (!shellipelagoNetPeer.offerSent) {
    shellipelagoNetDebug("host:candidate-queued", Object.assign({
      peerId: shellipelagoNetPeer.id,
      peerName: shellipelagoNetPeer.name,
      queued: shellipelagoNetPeer.pendingLocalCandidates.length + 1
    }, shellipelagoNetDescribeCandidate(shellipelagoNetCandidate)));
    shellipelagoNetPeer.pendingLocalCandidates.push(shellipelagoNetCandidate);
    return;
  }

  shellipelagoNetSendSignal("candidate", shellipelagoNetCandidate, shellipelagoNetPeer.id, shellipelagoNetPeer.signalSessionId).catch(shellipelagoNetReportError);
}

function shellipelagoNetFlushHostLocalCandidates(shellipelagoNetPeer) {
  while (shellipelagoNetPeer.pendingLocalCandidates.length) {
    shellipelagoNetSendOrQueueHostCandidate(shellipelagoNetPeer, shellipelagoNetPeer.pendingLocalCandidates.shift());
  }
}

function shellipelagoNetSendOrQueueGuestCandidate(shellipelagoNetCandidate) {
  if (!shellipelagoNetCandidate) {
    return;
  }

  if (!shellipelagoNetState.guestAnswerSent) {
    shellipelagoNetDebug("guest:candidate-queued", Object.assign({
      queued: shellipelagoNetState.pendingGuestLocalCandidates.length + 1
    }, shellipelagoNetDescribeCandidate(shellipelagoNetCandidate)));
    shellipelagoNetState.pendingGuestLocalCandidates.push(shellipelagoNetCandidate);
    return;
  }

  shellipelagoNetSendSignal("candidate", shellipelagoNetCandidate, shellipelagoNetState.guestPeerId, shellipelagoNetState.guestSignalSessionId).catch(shellipelagoNetReportError);
}

function shellipelagoNetFlushGuestLocalCandidates() {
  while (shellipelagoNetState.pendingGuestLocalCandidates.length) {
    shellipelagoNetSendOrQueueGuestCandidate(shellipelagoNetState.pendingGuestLocalCandidates.shift());
  }
}

function shellipelagoNetWaitForIceGatheringComplete(shellipelagoNetConnection, shellipelagoNetLabel, shellipelagoNetDetails) {
  return new Promise(function (shellipelagoNetResolve) {
    var shellipelagoNetSettled = false;
    var shellipelagoNetStartedAt = Date.now();
    var shellipelagoNetTimer = 0;

    function shellipelagoNetFinish(shellipelagoNetComplete, shellipelagoNetReason) {
      if (shellipelagoNetSettled) {
        return;
      }

      shellipelagoNetSettled = true;
      window.clearTimeout(shellipelagoNetTimer);
      if (shellipelagoNetConnection && shellipelagoNetConnection.removeEventListener) {
        shellipelagoNetConnection.removeEventListener("icegatheringstatechange", shellipelagoNetCheck);
      }
      shellipelagoNetDebug(shellipelagoNetLabel + ":ice-gathering-wait", Object.assign({
        complete: shellipelagoNetComplete,
        reason: shellipelagoNetReason,
        elapsedMs: Date.now() - shellipelagoNetStartedAt,
        state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection)
      }, shellipelagoNetDetails || {}));
      shellipelagoNetResolve(shellipelagoNetComplete);
    }

    function shellipelagoNetCheck() {
      if (!shellipelagoNetConnection || shellipelagoNetConnection.iceGatheringState === "complete") {
        shellipelagoNetFinish(true, "complete");
      }
    }

    if (!shellipelagoNetConnection || shellipelagoNetConnection.iceGatheringState === "complete") {
      shellipelagoNetFinish(true, "already-complete");
      return;
    }

    if (shellipelagoNetConnection.addEventListener) {
      shellipelagoNetConnection.addEventListener("icegatheringstatechange", shellipelagoNetCheck);
    }
    shellipelagoNetTimer = window.setTimeout(function () {
      shellipelagoNetFinish(false, "timeout");
    }, shellipelagoNetIceGatheringWaitMs);
    shellipelagoNetCheck();
  });
}

function shellipelagoNetIsSignalSessionCurrent(shellipelagoNetExpectedSessionId, shellipelagoNetSignalSessionId) {
  if (!shellipelagoNetExpectedSessionId) {
    return true;
  }

  return Boolean(shellipelagoNetSignalSessionId) && shellipelagoNetSignalSessionId === shellipelagoNetExpectedSessionId;
}

async function shellipelagoNetAddIceCandidate(shellipelagoNetConnection, shellipelagoNetCandidate, shellipelagoNetPendingCandidates, shellipelagoNetSignalSessionId) {
  if (!shellipelagoNetConnection || !shellipelagoNetCandidate) {
    return;
  }

  if (!shellipelagoNetConnection.remoteDescription) {
    shellipelagoNetDebug("candidate-remote-queued", Object.assign({
      queued: shellipelagoNetPendingCandidates.length + 1,
      signalSessionId: shellipelagoNetSignalSessionId || ""
    }, shellipelagoNetDescribeCandidate(shellipelagoNetCandidate)));
    shellipelagoNetPendingCandidates.push({
      candidate: shellipelagoNetCandidate,
      signalSessionId: shellipelagoNetSignalSessionId || ""
    });
    return;
  }

  await shellipelagoNetConnection.addIceCandidate(shellipelagoNetCandidate);
  shellipelagoNetDebug("candidate-remote-added", Object.assign({
    signalSessionId: shellipelagoNetSignalSessionId || ""
  }, shellipelagoNetDescribeCandidate(shellipelagoNetCandidate)));
}

async function shellipelagoNetFlushPendingIceCandidates(shellipelagoNetConnection, shellipelagoNetPendingCandidates, shellipelagoNetExpectedSessionId) {
  while (shellipelagoNetPendingCandidates.length) {
    var shellipelagoNetPendingCandidate = shellipelagoNetPendingCandidates.shift();
    var shellipelagoNetCandidate = shellipelagoNetPendingCandidate && shellipelagoNetPendingCandidate.candidate ? shellipelagoNetPendingCandidate.candidate : shellipelagoNetPendingCandidate;
    var shellipelagoNetSignalSessionId = shellipelagoNetPendingCandidate && shellipelagoNetPendingCandidate.candidate ? shellipelagoNetPendingCandidate.signalSessionId : "";

    if (!shellipelagoNetIsSignalSessionCurrent(shellipelagoNetExpectedSessionId, shellipelagoNetSignalSessionId)) {
      shellipelagoNetDebug("candidate-remote-ignored", Object.assign({
        reason: "stale-session",
        expectedSessionId: shellipelagoNetExpectedSessionId || "",
        signalSessionId: shellipelagoNetSignalSessionId || ""
      }, shellipelagoNetDescribeCandidate(shellipelagoNetCandidate)));
      continue;
    }

    await shellipelagoNetAddIceCandidate(shellipelagoNetConnection, shellipelagoNetCandidate, shellipelagoNetPendingCandidates, shellipelagoNetSignalSessionId);
  }
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

  if (shellipelagoNetEvent.targetPlayerId && shellipelagoNetEvent.targetPlayerId !== shellipelagoNetState.playerId) {
    return;
  }

  if (shellipelagoNetEvent.type === "position") {
    shellipelagoNetApplyPositionEvent(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "heartbeat") {
    shellipelagoNetApplyHeartbeatEvent(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "enemyKilled") {
    shellipelagoNetApplyEnemyKilled(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "enemyState") {
    shellipelagoNetApplyEnemyState(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "roomState") {
    shellipelagoNetApplyRoomState(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "playerDisconnected") {
    delete shellipelagoNetState.remotePlayers[shellipelagoNetEvent.disconnectedPlayerId];
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
  } else if (shellipelagoNetEvent.type === "apLocationChecked") {
    shellipelagoNetApplyArchipelagoLocationChecked(shellipelagoNetEvent);
  } else if (shellipelagoNetEvent.type === "apItemReceived") {
    shellipelagoNetApplyArchipelagoItemReceived(shellipelagoNetEvent);
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

function shellipelagoNetApplyEnemyState(shellipelagoNetEvent) {
  if (typeof initialRoomApplyNetEnemyState === "function") {
    initialRoomApplyNetEnemyState(shellipelagoNetEvent);
  }
}

function shellipelagoNetApplyRoomState(shellipelagoNetEvent) {
  if (typeof initialRoomApplyNetRoomState === "function") {
    initialRoomApplyNetRoomState(shellipelagoNetEvent);
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
  var shellipelagoNetRemote = shellipelagoNetState.remotePlayers[shellipelagoNetEvent.playerId];

  if (shellipelagoNetRemote && shellipelagoNetRemote.snapshot) {
    shellipelagoNetRemote.snapshot.moving = false;
    shellipelagoNetRemote.fromSnapshot = shellipelagoNetCloneSnapshot(shellipelagoNetRemote.snapshot);
    shellipelagoNetRemote.targetSnapshot = shellipelagoNetCloneSnapshot(shellipelagoNetRemote.snapshot);
    shellipelagoNetRemote.targetSnapshot.moving = false;
  }

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

function shellipelagoNetApplyArchipelagoLocationChecked(shellipelagoNetEvent) {
  if (typeof archipelagoClientApplyNetLocationChecked === "function") {
    archipelagoClientApplyNetLocationChecked(shellipelagoNetEvent);
  }
}

function shellipelagoNetApplyArchipelagoItemReceived(shellipelagoNetEvent) {
  if (typeof archipelagoClientApplyNetReceivedItem === "function") {
    archipelagoClientApplyNetReceivedItem(shellipelagoNetEvent);
  }
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

  shellipelagoNetBroadcastEvent({
    type: "roomState",
    room: shellipelagoNetStatePayload.room,
    enemyKeys: shellipelagoNetStatePayload.enemyKeys || [],
    destructibleKeys: shellipelagoNetStatePayload.destructibleKeys || [],
    targetPlayerId: shellipelagoNetTargetPlayerId || ""
  });

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

function shellipelagoNetBroadcastEnemyState(shellipelagoNetState) {
  shellipelagoNetBroadcastEvent(Object.assign({ type: "enemyState" }, shellipelagoNetState || {}));
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

function shellipelagoNetBroadcastArchipelagoLocationChecked(shellipelagoNetLocationId, shellipelagoNetLocationKey) {
  shellipelagoNetBroadcastEvent({
    type: "apLocationChecked",
    slotId: globalsState.archipelago.slotId,
    slotName: globalsState.archipelago.slot || "",
    locationId: Number(shellipelagoNetLocationId),
    locationKey: String(shellipelagoNetLocationKey || "")
  });
}

function shellipelagoNetBroadcastArchipelagoItemReceived(shellipelagoNetItem, shellipelagoNetItemIndex) {
  shellipelagoNetBroadcastEvent({
    type: "apItemReceived",
    slotId: globalsState.archipelago.slotId,
    slotName: globalsState.archipelago.slot || "",
    itemIndex: Number(shellipelagoNetItemIndex),
    item: shellipelagoNetItem || null
  });
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

  return fetch(shellipelagoNetGetSignalingEndpoint() + "/room/" + encodeURIComponent(shellipelagoNetState.roomCode) + "/lobby", {
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

  return fetch(shellipelagoNetGetSignalingEndpoint() + "/room/" + encodeURIComponent(shellipelagoNetState.roomCode) + "/lobby", {
    method: "DELETE"
  }).then(shellipelagoNetReadResponse);
}

function shellipelagoNetFindOpenLobby() {
  return fetch(shellipelagoNetGetSignalingEndpoint() + "/lobbies/open")
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

function shellipelagoNetSendSignal(shellipelagoNetType, shellipelagoNetPayload, shellipelagoNetTo, shellipelagoNetSignalSessionId) {
  if (!shellipelagoNetState.roomCode) {
    return Promise.resolve();
  }

  shellipelagoNetSignalSendQueue = shellipelagoNetSignalSendQueue.then(function () {
    return shellipelagoNetPostSignal(shellipelagoNetType, shellipelagoNetPayload, shellipelagoNetTo, shellipelagoNetSignalSessionId);
  }, function () {
    return shellipelagoNetPostSignal(shellipelagoNetType, shellipelagoNetPayload, shellipelagoNetTo, shellipelagoNetSignalSessionId);
  });

  return shellipelagoNetSignalSendQueue;
}

function shellipelagoNetPostSignal(shellipelagoNetType, shellipelagoNetPayload, shellipelagoNetTo, shellipelagoNetSignalSessionId) {
  shellipelagoNetDebug("signals:send", {
    type: shellipelagoNetType,
    to: shellipelagoNetTo || "",
    signalSessionId: shellipelagoNetSignalSessionId || "",
    payload: shellipelagoNetDescribeSignalPayload(shellipelagoNetPayload)
  });
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
      signalSessionId: shellipelagoNetSignalSessionId || "",
      payload: shellipelagoNetPayload || null
    })
  }).then(shellipelagoNetReadResponse).then(function (shellipelagoNetResult) {
    shellipelagoNetDebug("signals:send-ok", {
      type: shellipelagoNetType,
      to: shellipelagoNetTo || "",
      signalSessionId: shellipelagoNetSignalSessionId || ""
    });
    return shellipelagoNetResult;
  });
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
  return shellipelagoNetGetSignalingEndpoint() + "/room/" + encodeURIComponent(shellipelagoNetState.roomCode) + "/messages";
}

function shellipelagoNetGetSignalingEndpoint() {
  var shellipelagoNetOverride = "";

  try {
    shellipelagoNetOverride = new URLSearchParams(location.search).get("netEndpoint") || localStorage.getItem("shellipelagoNetSignalingEndpoint") || "";
  } catch (shellipelagoNetError) {
    shellipelagoNetOverride = "";
  }

  return String(shellipelagoNetOverride || shellipelagoNetSignalingEndpoint).replace(/\/+$/, "");
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
  var shellipelagoNetHasPositionChange = false;

  if (!shellipelagoNetFrom || !shellipelagoNetTarget) {
    return shellipelagoNetRemote;
  }

  shellipelagoNetHasPositionChange = Math.abs((Number(shellipelagoNetTarget.x) || 0) - (Number(shellipelagoNetFrom.x) || 0)) > 0.001 ||
    Math.abs((Number(shellipelagoNetTarget.y) || 0) - (Number(shellipelagoNetFrom.y) || 0)) > 0.001;

  if (shellipelagoNetProgress >= 1) {
    shellipelagoNetRemote.snapshot = shellipelagoNetCloneSnapshot(shellipelagoNetTarget);
    shellipelagoNetRemote.snapshot.moving = false;
    return shellipelagoNetRemote;
  }

  shellipelagoNetSnapshot = shellipelagoNetCloneSnapshot(shellipelagoNetTarget);
  shellipelagoNetSnapshot.x = shellipelagoNetLerp(Number(shellipelagoNetFrom.x) || 0, Number(shellipelagoNetTarget.x) || 0, shellipelagoNetProgress);
  shellipelagoNetSnapshot.y = shellipelagoNetLerp(Number(shellipelagoNetFrom.y) || 0, Number(shellipelagoNetTarget.y) || 0, shellipelagoNetProgress);
  shellipelagoNetSnapshot.moving = shellipelagoNetHasPositionChange;
  shellipelagoNetRemote.snapshot = shellipelagoNetSnapshot;
  return shellipelagoNetRemote;
}

function shellipelagoNetLerp(shellipelagoNetStart, shellipelagoNetEnd, shellipelagoNetProgress) {
  return shellipelagoNetStart + ((shellipelagoNetEnd - shellipelagoNetStart) * shellipelagoNetProgress);
}

function shellipelagoNetPruneRemotePlayers(shellipelagoNetNow) {
  Object.keys(shellipelagoNetState.remotePlayers).forEach(function (shellipelagoNetPlayerId) {
    var shellipelagoNetRemote = shellipelagoNetState.remotePlayers[shellipelagoNetPlayerId];

    if (shellipelagoNetNow - shellipelagoNetRemote.lastSeenAt <= shellipelagoNetPlayerTtlMs || !shellipelagoNetRemote.snapshot) return;
    shellipelagoNetRemote.snapshot.moving = false;
    shellipelagoNetRemote.fromSnapshot = shellipelagoNetCloneSnapshot(shellipelagoNetRemote.snapshot);
    shellipelagoNetRemote.targetSnapshot = shellipelagoNetCloneSnapshot(shellipelagoNetRemote.snapshot);
    shellipelagoNetRemote.targetSnapshot.moving = false;
    shellipelagoNetRemote.lerpStartedAt = shellipelagoNetNow;
    shellipelagoNetRemote.lerpUntil = shellipelagoNetNow;
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

function shellipelagoNetRecordJsonLog(shellipelagoNetEvent, shellipelagoNetDetails) {
  var shellipelagoNetEntry = {
    at: new Date().toISOString(),
    event: shellipelagoNetEvent,
    room: shellipelagoNetState.roomCode,
    role: shellipelagoNetState.role,
    localPeerId: shellipelagoNetState.playerId,
    name: shellipelagoNetState.playerName,
    details: shellipelagoNetCloneLogValue(shellipelagoNetDetails || {})
  };

  shellipelagoNetJsonLog.push(shellipelagoNetEntry);

  while (shellipelagoNetJsonLog.length > shellipelagoNetJsonLogLimit) {
    shellipelagoNetJsonLog.shift();
  }
}

function shellipelagoNetCloneLogValue(shellipelagoNetValue) {
  if (shellipelagoNetValue instanceof Error) {
    return {
      name: shellipelagoNetValue.name || "Error",
      message: shellipelagoNetValue.message || "",
      stack: shellipelagoNetValue.stack || ""
    };
  }

  try {
    return JSON.parse(JSON.stringify(shellipelagoNetValue, function (shellipelagoNetKey, shellipelagoNetNestedValue) {
      if (shellipelagoNetNestedValue instanceof Error) {
        return {
          name: shellipelagoNetNestedValue.name || "Error",
          message: shellipelagoNetNestedValue.message || "",
          stack: shellipelagoNetNestedValue.stack || ""
        };
      }

      if (shellipelagoNetNestedValue && typeof Event !== "undefined" && shellipelagoNetNestedValue instanceof Event) {
        return shellipelagoNetDescribeDomEvent(shellipelagoNetNestedValue);
      }

      if (typeof shellipelagoNetNestedValue === "function") {
        return "[function]";
      }

      return shellipelagoNetNestedValue;
    }));
  } catch (shellipelagoNetError) {
    return {
      unserializable: true,
      summary: String(shellipelagoNetValue)
    };
  }
}

function shellipelagoNetDescribeDomEvent(shellipelagoNetEvent) {
  return {
    type: shellipelagoNetEvent.type || "",
    message: shellipelagoNetEvent.message || "",
    errorCode: shellipelagoNetEvent.errorCode || 0,
    errorText: shellipelagoNetEvent.errorText || "",
    url: shellipelagoNetEvent.url || ""
  };
}

function shellipelagoNetDebug(shellipelagoNetEvent, shellipelagoNetDetails) {
  shellipelagoNetRecordJsonLog(shellipelagoNetEvent, shellipelagoNetDetails || {});

  if (!shellipelagoNetDebugEnabled || typeof console === "undefined" || !console.log) {
    return;
  }

  console.log("[ShellipelagoNet] " + shellipelagoNetEvent, Object.assign({
    room: shellipelagoNetState.roomCode,
    role: shellipelagoNetState.role,
    localPeerId: shellipelagoNetState.playerId,
    name: shellipelagoNetState.playerName,
    at: new Date().toISOString()
  }, shellipelagoNetDetails || {}));
}

function shellipelagoNetDownloadJsonLog(shellipelagoNetReason) {
  var shellipelagoNetPayload = {
    exportedAt: new Date().toISOString(),
    reason: shellipelagoNetReason || "manual",
    version: typeof shellipelagoVersion !== "undefined" ? shellipelagoVersion : "",
    netVersion: shellipelagoNetVersion,
    userAgent: navigator && navigator.userAgent ? navigator.userAgent : "",
    location: location && location.href ? location.href : "",
    endpoint: shellipelagoNetGetSignalingEndpoint(),
    state: {
      enabled: shellipelagoNetState.enabled,
      roomCode: shellipelagoNetState.roomCode,
      roomVisibility: shellipelagoNetState.roomVisibility,
      role: shellipelagoNetState.role,
      host: shellipelagoNetState.host,
      playerId: shellipelagoNetState.playerId,
      playerName: shellipelagoNetState.playerName,
      joinedAt: shellipelagoNetState.joinedAt,
      lastPollAt: shellipelagoNetState.lastPollAt,
      lobbyClosedToNewPeers: shellipelagoNetState.lobbyClosedToNewPeers,
      hostPeerIds: Object.keys(shellipelagoNetState.hostConnections),
      guestPeerId: shellipelagoNetState.guestPeerId,
      dataOpen: shellipelagoNetIsDataOpen()
    },
    rtcConfig: shellipelagoNetDescribeRtcConfig(),
    log: shellipelagoNetJsonLog.slice()
  };
  var shellipelagoNetBlob = new Blob([JSON.stringify(shellipelagoNetPayload, null, 2)], { type: "application/json" });
  var shellipelagoNetUrl = URL.createObjectURL(shellipelagoNetBlob);
  var shellipelagoNetLink = document.createElement("a");
  var shellipelagoNetTimestamp = new Date().toISOString().replace(/[:.]/g, "-");

  shellipelagoNetLink.href = shellipelagoNetUrl;
  shellipelagoNetLink.download = "shellipelago-net-log-" + shellipelagoNetTimestamp + ".json";
  document.body.appendChild(shellipelagoNetLink);
  shellipelagoNetLink.click();
  document.body.removeChild(shellipelagoNetLink);
  window.setTimeout(function () {
    URL.revokeObjectURL(shellipelagoNetUrl);
  }, 1000);
  shellipelagoNetMessage("Downloaded networking JSON log.");
}

function shellipelagoNetDescribeRtcConfig() {
  return {
    iceCandidatePoolSize: shellipelagoNetRtcConfig.iceCandidatePoolSize || 0,
    iceServers: (shellipelagoNetRtcConfig.iceServers || []).map(function (shellipelagoNetServer) {
      return {
        urls: shellipelagoNetServer.urls,
        hasUsername: Boolean(shellipelagoNetServer.username),
        hasCredential: Boolean(shellipelagoNetServer.credential)
      };
    })
  };
}

function shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection) {
  if (!shellipelagoNetConnection) {
    return {};
  }

  return {
    connectionState: shellipelagoNetConnection.connectionState,
    iceConnectionState: shellipelagoNetConnection.iceConnectionState,
    iceGatheringState: shellipelagoNetConnection.iceGatheringState,
    signalingState: shellipelagoNetConnection.signalingState,
    localDescription: shellipelagoNetConnection.localDescription ? shellipelagoNetConnection.localDescription.type : "",
    remoteDescription: shellipelagoNetConnection.remoteDescription ? shellipelagoNetConnection.remoteDescription.type : ""
  };
}

function shellipelagoNetLogConnectionStats(shellipelagoNetLabel, shellipelagoNetConnection, shellipelagoNetPeerInfo) {
  if (!shellipelagoNetConnection || typeof shellipelagoNetConnection.getStats !== "function") {
    return;
  }

  shellipelagoNetConnection.getStats().then(function (shellipelagoNetStats) {
    shellipelagoNetDebug("rtc:stats", Object.assign({
      source: shellipelagoNetLabel,
      state: shellipelagoNetGetConnectionDebugState(shellipelagoNetConnection),
      stats: shellipelagoNetSummarizeRtcStats(shellipelagoNetStats)
    }, shellipelagoNetPeerInfo || {}));
  }).catch(function (shellipelagoNetError) {
    shellipelagoNetDebug("rtc:stats-error", Object.assign({
      source: shellipelagoNetLabel,
      error: shellipelagoNetError && shellipelagoNetError.message ? shellipelagoNetError.message : String(shellipelagoNetError)
    }, shellipelagoNetPeerInfo || {}));
  });
}

function shellipelagoNetSummarizeRtcStats(shellipelagoNetStats) {
  var shellipelagoNetLocalCandidates = {};
  var shellipelagoNetRemoteCandidates = {};
  var shellipelagoNetCandidatePairCounts = {
    total: 0,
    waiting: 0,
    inProgress: 0,
    succeeded: 0,
    failed: 0
  };
  var shellipelagoNetSelectedPair = null;
  var shellipelagoNetTransportSelectedPairId = "";

  shellipelagoNetStats.forEach(function (shellipelagoNetReport) {
    if (shellipelagoNetReport.type === "local-candidate") {
      shellipelagoNetLocalCandidates[shellipelagoNetReport.id] = shellipelagoNetSummarizeRtcCandidate(shellipelagoNetReport);
    }

    if (shellipelagoNetReport.type === "remote-candidate") {
      shellipelagoNetRemoteCandidates[shellipelagoNetReport.id] = shellipelagoNetSummarizeRtcCandidate(shellipelagoNetReport);
    }

    if (shellipelagoNetReport.type === "candidate-pair") {
      shellipelagoNetCandidatePairCounts.total += 1;
      if (shellipelagoNetReport.state === "waiting") {
        shellipelagoNetCandidatePairCounts.waiting += 1;
      } else if (shellipelagoNetReport.state === "in-progress") {
        shellipelagoNetCandidatePairCounts.inProgress += 1;
      } else if (shellipelagoNetReport.state === "succeeded") {
        shellipelagoNetCandidatePairCounts.succeeded += 1;
      } else if (shellipelagoNetReport.state === "failed") {
        shellipelagoNetCandidatePairCounts.failed += 1;
      }

      if (shellipelagoNetReport.selected || shellipelagoNetReport.nominated) {
        shellipelagoNetSelectedPair = shellipelagoNetReport;
      }
    }

    if (shellipelagoNetReport.type === "transport" && shellipelagoNetReport.selectedCandidatePairId) {
      shellipelagoNetTransportSelectedPairId = shellipelagoNetReport.selectedCandidatePairId;
    }
  });

  if (!shellipelagoNetSelectedPair && shellipelagoNetTransportSelectedPairId && shellipelagoNetStats.get) {
    shellipelagoNetSelectedPair = shellipelagoNetStats.get(shellipelagoNetTransportSelectedPairId);
  }

  return {
    candidatePairCounts: shellipelagoNetCandidatePairCounts,
    selectedPair: shellipelagoNetSummarizeCandidatePair(shellipelagoNetSelectedPair, shellipelagoNetLocalCandidates, shellipelagoNetRemoteCandidates)
  };
}

function shellipelagoNetSummarizeCandidatePair(shellipelagoNetPair, shellipelagoNetLocalCandidates, shellipelagoNetRemoteCandidates) {
  if (!shellipelagoNetPair) {
    return null;
  }

  return {
    id: shellipelagoNetPair.id || "",
    state: shellipelagoNetPair.state || "",
    nominated: Boolean(shellipelagoNetPair.nominated),
    selected: Boolean(shellipelagoNetPair.selected),
    writable: Boolean(shellipelagoNetPair.writable),
    bytesSent: Number(shellipelagoNetPair.bytesSent || 0),
    bytesReceived: Number(shellipelagoNetPair.bytesReceived || 0),
    currentRoundTripTime: shellipelagoNetPair.currentRoundTripTime,
    local: shellipelagoNetLocalCandidates[shellipelagoNetPair.localCandidateId] || null,
    remote: shellipelagoNetRemoteCandidates[shellipelagoNetPair.remoteCandidateId] || null
  };
}

function shellipelagoNetSummarizeRtcCandidate(shellipelagoNetCandidate) {
  return {
    id: shellipelagoNetCandidate.id || "",
    candidateType: shellipelagoNetCandidate.candidateType || "",
    protocol: shellipelagoNetCandidate.protocol || "",
    address: shellipelagoNetCandidate.address || shellipelagoNetCandidate.ip || "",
    port: shellipelagoNetCandidate.port || "",
    relayProtocol: shellipelagoNetCandidate.relayProtocol || "",
    networkType: shellipelagoNetCandidate.networkType || "",
    priority: shellipelagoNetCandidate.priority || 0,
    url: shellipelagoNetCandidate.url || ""
  };
}

function shellipelagoNetDescribeIceCandidateError(shellipelagoNetEvent) {
  return {
    address: shellipelagoNetEvent && shellipelagoNetEvent.address || "",
    port: shellipelagoNetEvent && shellipelagoNetEvent.port || "",
    url: shellipelagoNetEvent && shellipelagoNetEvent.url || "",
    errorCode: shellipelagoNetEvent && shellipelagoNetEvent.errorCode || 0,
    errorText: shellipelagoNetEvent && shellipelagoNetEvent.errorText || ""
  };
}

function shellipelagoNetDescribeSignal(shellipelagoNetSignal) {
  if (!shellipelagoNetSignal) {
    return {};
  }

  return {
    id: shellipelagoNetSignal.id || "",
    type: shellipelagoNetSignal.type || "",
    from: shellipelagoNetSignal.from || "",
    to: shellipelagoNetSignal.to || "",
    signalRole: shellipelagoNetSignal.role || "",
    signalName: shellipelagoNetSignal.name || "",
    signalSessionId: shellipelagoNetSignal.signalSessionId || "",
    createdAt: shellipelagoNetSignal.createdAt || 0,
    payload: shellipelagoNetDescribeSignalPayload(shellipelagoNetSignal.payload)
  };
}

function shellipelagoNetDescribeSignalPayload(shellipelagoNetPayload) {
  if (!shellipelagoNetPayload) {
    return null;
  }

  if (shellipelagoNetPayload.sdp) {
    return Object.assign({
      type: shellipelagoNetPayload.type || "",
      sdpLength: shellipelagoNetPayload.sdp.length,
      hasCandidateLines: shellipelagoNetPayload.sdp.indexOf("a=candidate:") !== -1
    }, shellipelagoNetSummarizeSdp(shellipelagoNetPayload.sdp));
  }

  if (shellipelagoNetPayload.candidate || shellipelagoNetPayload.type === "candidate") {
    return shellipelagoNetDescribeCandidate(shellipelagoNetPayload);
  }

  return shellipelagoNetPayload;
}

function shellipelagoNetDescribeCandidate(shellipelagoNetCandidate) {
  var shellipelagoNetCandidateText = String(shellipelagoNetCandidate && shellipelagoNetCandidate.candidate || "");
  var shellipelagoNetParts = shellipelagoNetCandidateText.split(/\s+/);

  return {
    candidateType: shellipelagoNetGetCandidatePart(shellipelagoNetParts, "typ"),
    protocol: shellipelagoNetParts[2] || "",
    address: shellipelagoNetParts[4] || "",
    port: shellipelagoNetParts[5] || "",
    sdpMid: shellipelagoNetCandidate && shellipelagoNetCandidate.sdpMid || "",
    sdpMLineIndex: shellipelagoNetCandidate && shellipelagoNetCandidate.sdpMLineIndex,
    rawLength: shellipelagoNetCandidateText.length
  };
}

function shellipelagoNetSummarizeSdp(shellipelagoNetSdp) {
  var shellipelagoNetSummary = {
    candidateLineCount: 0,
    candidateTypes: {},
    protocols: {},
    hasUdp: false,
    hasTcp: false
  };

  String(shellipelagoNetSdp || "").split(/\r?\n/).forEach(function (shellipelagoNetLine) {
    var shellipelagoNetCandidateText = "";
    var shellipelagoNetParts = [];
    var shellipelagoNetCandidateType = "";
    var shellipelagoNetProtocol = "";

    if (shellipelagoNetLine.indexOf("a=candidate:") !== 0) {
      return;
    }

    shellipelagoNetCandidateText = shellipelagoNetLine.slice(2);
    shellipelagoNetParts = shellipelagoNetCandidateText.split(/\s+/);
    shellipelagoNetCandidateType = shellipelagoNetGetCandidatePart(shellipelagoNetParts, "typ") || "unknown";
    shellipelagoNetProtocol = (shellipelagoNetParts[2] || "unknown").toLowerCase();
    shellipelagoNetSummary.candidateLineCount += 1;
    shellipelagoNetSummary.candidateTypes[shellipelagoNetCandidateType] = (shellipelagoNetSummary.candidateTypes[shellipelagoNetCandidateType] || 0) + 1;
    shellipelagoNetSummary.protocols[shellipelagoNetProtocol] = (shellipelagoNetSummary.protocols[shellipelagoNetProtocol] || 0) + 1;
    shellipelagoNetSummary.hasUdp = shellipelagoNetSummary.hasUdp || shellipelagoNetProtocol === "udp";
    shellipelagoNetSummary.hasTcp = shellipelagoNetSummary.hasTcp || shellipelagoNetProtocol === "tcp";
  });

  return shellipelagoNetSummary;
}

function shellipelagoNetGetCandidatePart(shellipelagoNetParts, shellipelagoNetKey) {
  var shellipelagoNetIndex = shellipelagoNetParts.indexOf(shellipelagoNetKey);

  if (shellipelagoNetIndex === -1 || shellipelagoNetIndex + 1 >= shellipelagoNetParts.length) {
    return "";
  }

  return shellipelagoNetParts[shellipelagoNetIndex + 1];
}

function shellipelagoNetMessage(shellipelagoNetText) {
  if (typeof archipelagoClientQueueServerMessage === "function") {
    archipelagoClientQueueServerMessage(shellipelagoNetText);
  } else {
    console.log(shellipelagoNetText);
  }
}

function shellipelagoNetReportError(shellipelagoNetError) {
  shellipelagoNetRecordJsonLog("error", {
    error: shellipelagoNetError
  });

  if (typeof console !== "undefined" && console.error) {
    console.error("[ShellipelagoNet] error", shellipelagoNetError);
  }

  shellipelagoNetMessage(shellipelagoNetError && shellipelagoNetError.message ? shellipelagoNetError.message : "Shellipelago networking failed.");
}

shellipelagoNetInit();
