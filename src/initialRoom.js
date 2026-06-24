var initialRoomCanvas = document.createElement("canvas");
var initialRoomContext = initialRoomCanvas.getContext("2d");
var initialRoomEnemyLayer = document.createElement("div");
var initialRoomEffectLayer = document.createElement("div");
var initialRoomMessageCanvas = document.createElement("canvas");
var initialRoomMessageContext = initialRoomMessageCanvas.getContext("2d");
var initialRoomFinalRunLayer = document.createElement("div");
var initialRoomTilesetImage = null;
var initialRoomChestImage = null;
var initialRoomOpenChestImage = null;
var initialRoomBombImage = null;
var initialRoomSwordImage = null;
var initialRoomExplosionImage = null;
var initialRoomPlayerImages = {};
var initialRoomTankBodyImage = null;
var initialRoomTankTurretImage = null;
var initialRoomRedSwordImage = null;
var initialRoomEnemyImages = {};
var initialRoomRuntimeEnemyCanvasImages = {};
var initialRoomPickupIconImages = {};
var initialRoomSnakeLoopSounds = {};
var initialRoomCurrentBgm = null;
var initialRoomFadingBgms = [];
var initialRoomNextBgmAt = 0;
var initialRoomTilesetData = null;
var initialRoomWaterTiles = [];
var initialRoomBombs = [];
var initialRoomTankShots = [];
var initialRoomDestructibleBursts = [];
var initialRoomProjectiles = [];
var initialRoomWizardFireballs = [];
var initialRoomMeleeAttacks = [];
var initialRoomNextMeleeAllowedAt = 0;
var initialRoomScreenShakeUntil = 0;
var initialRoomScreenShakeStartedAt = 0;
var initialRoomScreenShakeMagnitude = 0;
var initialRoomEnemies = [];
var initialRoomActiveExplosionTiles = {};
var initialRoomDestroyedDestructableChecks = {};
var initialRoomDestroyedBlockers = {};
var initialRoomOpenedRuntimeChecks = {};
var initialRoomOfflineRewardOverrides = {};
var initialRoomPurchasedShopItems = {};
var initialRoomHiddenShopItems = {};
var initialRoomRemovedShopItems = {};
var initialRoomFreeShopItems = {};
var initialRoomShopItemPoolOffers = {};
var initialRoomVisitedRoomEdges = {};
var initialRoomVisitedWarpRooms = {};
var initialRoomTileRenderCache = {};
var initialRoomDoorChannelIndex = null;
var initialRoomKeys = {};
var initialRoomInputOrder = [];
var initialRoomHasStarted = false;
var initialRoomWasTankForm = false;
var initialRoomDoorWarpCooldownUntil = 0;
var initialRoomMouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};
var initialRoomFinalRunMouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};
var initialRoomLastUpdateTime = 0;
var initialRoomLastMessageTime = 0;
var initialRoomCurrentMessageStartTime = 0;
var initialRoomMessageDuration = 2500;
var initialRoomMessageMinimumDuration = 1500;
var initialRoomCurrentMessage = "";
var initialRoomCurrentMessageFlipped = false;
var initialRoomMessageQueue = [];
var initialRoomMessageHistory = [];
var initialRoomIsMessageLogOpen = false;
var initialRoomMessageLogCloseRect = null;
var initialRoomAreMessagePopupsMuted = false;
var initialRoomMessageLogPulseUntil = 0;
var initialRoomTopRightMenuIconRects = [];
var initialRoomPickupIcon = null;
var initialRoomSuppressLinkBroadcast = false;
var initialRoomLastDeathReason = "";
var initialRoomMapStatusCache = null;
var initialRoomFallbackSnakeCount = 28;
var initialRoomFallbackWizardChance = 1 / 3;
var initialRoomFallbackEnemyMargin = 4;
var initialRoomItemPoolRewards = {
  itemPool1: [
    {
      key: "potion",
      label: "Energy Gem",
      amount: 1,
      canUse: function () {
        return true;
      },
      apply: function () {
        initialRoomSyncPlayerResourceMaxes();
        initialRoomPlayer.energy += 1;
      }
    },
    {
      key: "moneybag",
      label: "Round Pouch",
      amount: 5,
      canUse: function () {
        initialRoomSyncPlayerResourceMaxes();
        return initialRoomPlayer.rounds < initialRoomPlayer.maxRounds;
      },
      apply: function () {
        initialRoomSyncPlayerResourceMaxes();
        initialRoomPlayer.rounds = Math.min(initialRoomPlayer.maxRounds, initialRoomPlayer.rounds + 5);
      }
    },
    {
      key: "health",
      label: "Health Potion",
      amount: 1,
      canUse: function () {
        initialRoomSyncPlayerResourceMaxes();
        return initialRoomPlayer.hp < initialRoomGetEffectiveMaxHp();
      },
      apply: function () {
        initialRoomSyncPlayerResourceMaxes();
        initialRoomPlayer.hp = Math.min(initialRoomGetEffectiveMaxHp(), initialRoomPlayer.hp + 1);
      }
    }
  ],
  itemPool2: [
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "empty",
      label: "Nothing",
      amount: 0,
      canUse: function () {
        return true;
      },
      apply: function () {
      }
    },
    {
      key: "potion",
      label: "Energy Gem",
      amount: 1,
      canUse: function () {
        return true;
      },
      apply: function () {
        initialRoomSyncPlayerResourceMaxes();
        initialRoomPlayer.energy += 1;
      }
    },
    {
      key: "moneybag",
      label: "Round Pouch",
      amount: 5,
      canUse: function () {
        initialRoomSyncPlayerResourceMaxes();
        return initialRoomPlayer.rounds < initialRoomPlayer.maxRounds;
      },
      apply: function () {
        initialRoomSyncPlayerResourceMaxes();
        initialRoomPlayer.rounds = Math.min(initialRoomPlayer.maxRounds, initialRoomPlayer.rounds + 5);
      }
    },
    {
      key: "health",
      label: "Health Potion",
      amount: 1,
      canUse: function () {
        initialRoomSyncPlayerResourceMaxes();
        return initialRoomPlayer.hp < initialRoomGetEffectiveMaxHp();
      },
      apply: function () {
        initialRoomSyncPlayerResourceMaxes();
        initialRoomPlayer.hp = Math.min(initialRoomGetEffectiveMaxHp(), initialRoomPlayer.hp + 1);
      }
    }
  ]
};
var initialRoomIsTextEntryActive = false;
var initialRoomTextEntryValue = "";
var initialRoomIsMapOpen = false;
var initialRoomIsStatusOpen = false;
var initialRoomTrapState = {
  stunUntil: 0,
  invisibleUntil: 0,
  fastUntil: 0,
  slowUntil: 0,
  reverseUntil: 0,
  flipMessagesRemaining: 0,
  zoomRoomId: ""
};
var initialRoomIsBgmMuted = false;
var initialRoomIsSfxMuted = false;
var initialRoomCreditsLoadStarted = false;
var initialRoomFontFamily = "Perfect DOS VGA 437";
var initialRoomCurrentRoom = null;
var initialRoomFinalRunState = {
  active: false,
  loading: false,
  initialized: false,
  renderer: null,
  scene: null,
  camera: null,
  cube: null,
  three: null,
  groundRollGroup: null,
  groundSphere: null,
  groundRollAmount: 0,
  sunLight: null,
  sunMarker: null,
  tankViewModel: null,
  tankNozzlePivot: null,
  tankNozzleRecoilGroup: null,
  tankMaterials: [],
  crosshair: null,
  crosshairMaterial: null,
  crosshairElement: null,
  audioToggleElement: null,
  hpElement: null,
  muzzleParticles: [],
  muzzleParticleGeometry: null,
  nozzleRecoilStartedAt: 0,
  blobTexture: null,
  blobGreyscaleTexture: null,
  snakeTexture: null,
  snakeGreyscaleTexture: null,
  blobs: [],
  blobSpawnIndex: 0,
  snakeSpawnIndex: 0,
  nextSnakeSpawnAt: 0,
  nextBlobSpawnAt: 0,
  wizardTexture: null,
  wizardGreyscaleTexture: null,
  wizards: [],
  wizardSpawnIndex: 0,
  nextWizardSpawnAt: 0,
  fireballTexture: null,
  fireballs: [],
  boss: null,
  bossSpawned: false,
  bossDefeated: false,
  credits: [],
  creditLines: [],
  creditSpawnIndex: 0,
  nextCreditSpawnAt: 0,
  creditsStarted: false,
  finalCreditStopStartedAt: 0,
  rocks: [],
  materials: {},
  graphicsLevel: -1,
  rapier: null,
  world: null,
  frameId: 0,
  lastFrameTime: 0,
  runStartedAt: 0,
  statusElement: null
};
var initialRoomIsGameOver = false;
var initialRoomRoomReloadAt = 0;
var initialRoomGameOverDuration = 5000;
var initialRoomPlayer = {
  x: 0,
  y: 0,
  speed: 4,
  radius: 0.4,
  hp: 1,
  maxHp: 1,
  energy: 0,
  maxEnergy: 0,
  rounds: 0,
  maxRounds: 0,
  invulnerableUntil: 0,
  moveDirection: null,
  facingDirection: { x: 0, y: 1 },
  tankAngle: Math.PI / 2,
  tankTargetAngle: Math.PI / 2,
  targetX: 0,
  targetY: 0
};
var initialRoomView = {
  tileSize: 32,
  movementTileSize: 32,
  offsetX: 0,
  offsetY: 0,
  visibleTilesX: 8,
  visibleTilesY: 8,
  cameraX: 0,
  cameraY: 0
};
var initialRoomPixelUnitDivisor = 16;
var initialRoomTilesetTileSize = 16;
var initialRoomTilesetDataPath = "src/data/tileset.json";
var initialRoomBaseVisibleTiles = 8;
var initialRoomTankVisibleTileMultiplier = 1.5;
var initialRoomTilesetPath = "src/img/tileset/PixelPackTOPDOWN8BIT.png";
var initialRoomChestPath = "src/img/item/item8BIT_chest.png";
var initialRoomOpenChestPath = "src/img/item/item8BIT_chest_open.png";
var initialRoomBombPath = "src/img/item/item8BIT_bomb.png";
var initialRoomSwordPath = "src/img/item/item8BIT_sword.png";
var initialRoomExplosionPath = "src/img/item/LargeFlame.gif";
var initialRoomPickupIconDuration = 1000;
var initialRoomPickupIconPaths = {
  bomb: "src/img/item/item8BIT_bomb.png",
  energy: "src/img/item/item8BIT_gem.png",
  freeGrid: "src/img/item/item8BIT_compass.png",
  graphics: "src/img/item/item8BIT_gem.png",
  fire: "src/img/item/item8BIT_lamp.png",
  gun: "src/img/item/item8BIT_bow.png",
  log: "src/img/item/item8BIT_floppydisk.png",
  hp: "src/img/item/item8BIT_heart.png",
  itemPool: "src/img/item/item8BIT_chest.png",
  health: "src/img/item/item8BIT_heart.png",
  healthPickup: "src/img/item/item8BIT_heart.png",
  moneybag: "src/img/item/item8BIT_moneybag.png",
  pickaxe: "src/img/item/item8BIT_pickaxe.png",
  potion: "src/img/item/item8BIT_gem.png",
  progressiveRoom: "src/img/item/item8BIT_key.png",
  rounds: "src/img/item/item8BIT_moneybag.png",
  roundsPickup: "src/img/item/item8BIT_moneybag.png",
  shop: "src/img/item/item8BIT_coin.png",
  sfx: "src/img/item/item8BIT_bell.png",
  bgm: "src/img/item/item8BIT_harp.png",
  sword: "src/img/item/item8BIT_sword.png",
  waterWalkers: "src/img/item/item8BIT_boots.png"
};
var initialRoomEssentialPickupHintReplacements = [
  { from: "#bd4035", to: "#40bcd8" },
  { from: "#73263d", to: "#4f78ff" }
];
var initialRoomHintPickupReplacements = [
  { from: "#bd4035", to: "#40d85f" },
  { from: "#73263d", to: "#4fff78" }
];
var initialRoomTrapPickupHintReplacements = [
  { from: "#bd4035", to: "#405dff" },
  { from: "#73263d", to: "#2d3fd6" }
];
var initialRoomDestructibleLocationReplacements = [
  { from: "#ed7b39", to: "#b85ee6" },
  { from: "#f5a15d", to: "#4f78ff" },
  { from: "#bd4035", to: "#b85ee6" },
  { from: "#928fb8", to: "#b85ee6" },
  { from: "#77b02a", to: "#b85ee6" },
  { from: "#153c4a", to: "#40bcd8" }
];
var initialRoomFireOnlyDestructibleLocationReplacements = [
  { from: "#bd4035", to: "#8b5a32" },
  { from: "#ed7b39", to: "#8b5a32" },
  { from: "#f5a15d", to: "#8b5a32" }
];
var initialRoomStatusProgressionKeys = [
  "graphics",
  "progressiveRoom",
  "bomb",
  "gun",
  "sword",
  "hp",
  "rounds",
  "fire",
  "sfx",
  "bgm",
  "pickaxe",
  "waterWalkers",
  "tankTreads",
  "tankChassis",
  "tankCannon"
];
var initialRoomSoundPaths = {
  bgm: "src/sound/music/maintheme.mp3",
  finalRunBgm: "src/sound/music/bossmusic.mp3",
  bomb: "src/sound/bomb.wav",
  bullet: "src/sound/highdot.wav",
  fire: "src/sound/fire.wav",
  gameover: "src/sound/gameover.wav",
  message: "src/sound/lowdot.wav",
  snake: "src/sound/snakemove.wav",
  tank: "src/sound/tankbeam.wav",
  wizardShot: "src/sound/wizardshot.wav",
  wizardVanish: "src/sound/wizvanish.wav"
};
var initialRoomBgmReplayDelay = 30000;
var initialRoomBgmFadeDuration = 1000;
var initialRoomWaterFrameDuration = 500;
var initialRoomBombFuseDuration = 1200;
var initialRoomExplosionDuration = 900;
var initialRoomBombLevelThreeShakeDuration = 280;
var initialRoomBombLevelThreeShakeMagnitude = 0.16;
var initialRoomFireDuration = 1800;
var initialRoomEnemyHurtDuration = 350;
var initialRoomEnemyDeathDuration = 650;
var initialRoomEnemySwordStunDuration = 500;
var initialRoomProjectileSpeed = 9;
var initialRoomProjectileShotCooldownMs = 200;
var initialRoomWizardFireballSpeed = 5.5;
var initialRoomWizardFireballDamage = 5;
var initialRoomWizardActivationRange = 8;
var initialRoomWizardPostShotDelay = 2000;
var initialRoomWizardReappearDelay = 1000;
var initialRoomMeleeDuration = 180;
var initialRoomMeleeRecoveryDuration = 100;
var initialRoomTankTurnSpeed = Math.PI * 0.8;
var initialRoomTankShotDuration = 90;
var initialRoomTankShotCooldown = 260;
var initialRoomNextTankShotAllowedAt = 0;
var initialRoomNextProjectileShotAllowedAt = 0;
var initialRoomMonochromePlayerFrameDuration = 250;
var initialRoomColorPlayerFrameDuration = 167;
var initialRoomPlayerImagePaths = {
  down: {
    neutral: "src/img/player/Helmet_Guy.png",
    step1: "src/img/player/Helmet_Guy_Walk_1.png",
    step2: "src/img/player/Helmet_Guy_Walk_2.png"
  },
  up: {
    neutral: "src/img/player/Helmet_Guy_Up.png",
    step1: "src/img/player/Helmet_Guy_Up_Walk_1.png",
    step2: "src/img/player/Helmet_Guy_Up_Walk_2.png"
  },
  side: {
    neutral: "src/img/player/Helmet_Guy_Side.png",
    step1: "src/img/player/Helmet_Guy_Side_Walk_1.png",
    step2: "src/img/player/Helmet_Guy_Side_Walk_2.png"
  }
};
var initialRoomTankBodyPath = "src/img/player/Tank_Body.png";
var initialRoomTankTurretPath = "src/img/player/Tank_Turret.png";

function initialRoomLoadImage(initialRoomImagePath) {
  return new Promise(function (initialRoomResolve, initialRoomReject) {
    var initialRoomImage = new Image();

    initialRoomImage.onload = function () {
      initialRoomResolve(initialRoomImage);
    };
    initialRoomImage.onerror = function () {
      initialRoomReject(new Error("Unable to load image: " + initialRoomImagePath));
    };
    initialRoomImage.src = initialRoomImagePath;
  });
}

function initialRoomLoadPlayerImages() {
  var initialRoomKeys = [];
  var initialRoomPromises = [];

  Object.keys(initialRoomPlayerImagePaths).forEach(function (initialRoomDirectionKey) {
    Object.keys(initialRoomPlayerImagePaths[initialRoomDirectionKey]).forEach(function (initialRoomFrameKey) {
      initialRoomKeys.push({
        direction: initialRoomDirectionKey,
        frame: initialRoomFrameKey
      });
      initialRoomPromises.push(initialRoomLoadImage(initialRoomPlayerImagePaths[initialRoomDirectionKey][initialRoomFrameKey]));
    });
  });

  return Promise.all(initialRoomPromises).then(function (initialRoomImages) {
    initialRoomImages.forEach(function (initialRoomImage, initialRoomIndex) {
      var initialRoomKey = initialRoomKeys[initialRoomIndex];

      if (!initialRoomPlayerImages[initialRoomKey.direction]) {
        initialRoomPlayerImages[initialRoomKey.direction] = {};
      }

      initialRoomPlayerImages[initialRoomKey.direction][initialRoomKey.frame] = initialRoomImage;
    });
  });
}

function initialRoomLoadEnemyImages() {
  var initialRoomEnemyKeys = Object.keys(globalsState.enemyDefinitions);
  var initialRoomPromises = initialRoomEnemyKeys.map(function (initialRoomEnemyKey) {
    return initialRoomLoadImage(globalsState.enemyDefinitions[initialRoomEnemyKey].image);
  });

  return Promise.all(initialRoomPromises).then(function (initialRoomImages) {
    initialRoomImages.forEach(function (initialRoomImage, initialRoomIndex) {
      initialRoomEnemyImages[initialRoomEnemyKeys[initialRoomIndex]] = initialRoomImage;
    });
  });
}

function initialRoomLoadPickupIconImages() {
  Object.keys(initialRoomPickupIconPaths).forEach(function (initialRoomIconKey) {
    initialRoomLoadImage(initialRoomPickupIconPaths[initialRoomIconKey]).then(function (initialRoomImage) {
      initialRoomPickupIconImages[initialRoomIconKey] = initialRoomImage;
    }).catch(function () {
    });
  });
}

function initialRoomCanPlaySfx() {
  return Boolean(!initialRoomIsSfxMuted && (globalsState.progression.sfx || progressionManagerGetProgressiveValue("sfx") > 0));
}

function initialRoomCanPlayBgm() {
  return Boolean(!initialRoomIsBgmMuted && (globalsState.progression.bgm || progressionManagerGetProgressiveValue("bgm") > 0));
}

function initialRoomHasSfxUnlock() {
  return Boolean(globalsState.progression.sfx || progressionManagerGetProgressiveValue("sfx") > 0);
}

function initialRoomHasBgmUnlock() {
  return Boolean(globalsState.progression.bgm || progressionManagerGetProgressiveValue("bgm") > 0);
}

function initialRoomPlaySfx(initialRoomSoundKey) {
  var initialRoomSoundPath = initialRoomSoundPaths[initialRoomSoundKey];
  var initialRoomAudio = null;

  if (!initialRoomSoundPath || !initialRoomCanPlaySfx()) {
    return;
  }

  initialRoomAudio = new Audio(initialRoomSoundPath);
  initialRoomAudio.volume = 0.65;
  initialRoomAudio.play().catch(function () {});
}

function initialRoomUpdateBgm(initialRoomNow) {
  var initialRoomBgmPath = initialRoomGetBgmPath();

  initialRoomUpdateBgmFades(initialRoomNow);

  if (!initialRoomCanPlayBgm() || initialRoomIsGameOver) {
    initialRoomStopBgm();
    return;
  }

  if (initialRoomCurrentBgm && initialRoomCurrentBgm.shellipelagoPath !== initialRoomBgmPath) {
    initialRoomFadeOutBgm(initialRoomCurrentBgm, initialRoomNow);
    initialRoomCurrentBgm = null;
    initialRoomNextBgmAt = 0;
  }

  if (initialRoomCurrentBgm && !initialRoomCurrentBgm.paused && !initialRoomCurrentBgm.ended) {
    return;
  }

  if (initialRoomCurrentBgm && initialRoomCurrentBgm.ended) {
    initialRoomCurrentBgm = null;
    if (initialRoomFinalRunState.active) {
      initialRoomNextBgmAt = Infinity;
    }
  }

  if (initialRoomNow < initialRoomNextBgmAt) {
    return;
  }

  initialRoomCurrentBgm = new Audio(initialRoomBgmPath);
  initialRoomCurrentBgm.shellipelagoPath = initialRoomBgmPath;
  initialRoomCurrentBgm.shellipelagoTargetVolume = initialRoomGetBgmVolume(initialRoomBgmPath);
  initialRoomCurrentBgm.shellipelagoFadeStart = initialRoomNow;
  initialRoomCurrentBgm.shellipelagoFadeFrom = 0;
  initialRoomCurrentBgm.shellipelagoFadeTo = initialRoomCurrentBgm.shellipelagoTargetVolume;
  initialRoomCurrentBgm.shellipelagoFadeDuration = initialRoomBgmFadeDuration;
  initialRoomCurrentBgm.volume = 0;
  initialRoomCurrentBgm.addEventListener("ended", function () {
    if (initialRoomFinalRunState.active) {
      return;
    }

    initialRoomNextBgmAt = Date.now() + initialRoomBgmReplayDelay;
  }, { once: true });
  initialRoomCurrentBgm.play().catch(function () {
    initialRoomCurrentBgm = null;
  });
}

function initialRoomFadeOutBgm(initialRoomAudio, initialRoomNow) {
  if (!initialRoomAudio) {
    return;
  }

  initialRoomAudio.shellipelagoFadeStart = initialRoomNow;
  initialRoomAudio.shellipelagoFadeFrom = initialRoomAudio.volume || 0;
  initialRoomAudio.shellipelagoFadeTo = 0;
  initialRoomAudio.shellipelagoFadeDuration = initialRoomBgmFadeDuration;
  initialRoomAudio.shellipelagoStopOnFadeComplete = true;
  initialRoomFadingBgms.push(initialRoomAudio);
}

function initialRoomUpdateBgmFades(initialRoomNow) {
  if (initialRoomCurrentBgm) {
    initialRoomUpdateBgmFade(initialRoomCurrentBgm, initialRoomNow);
  }

  initialRoomFadingBgms = initialRoomFadingBgms.filter(function (initialRoomAudio) {
    var initialRoomKeepAudio = initialRoomUpdateBgmFade(initialRoomAudio, initialRoomNow);

    if (!initialRoomKeepAudio) {
      initialRoomAudio.pause();
      initialRoomAudio.currentTime = 0;
    }

    return initialRoomKeepAudio;
  });
}

function initialRoomUpdateBgmFade(initialRoomAudio, initialRoomNow) {
  var initialRoomProgress;

  if (!initialRoomAudio || initialRoomAudio.shellipelagoFadeStart === undefined) {
    return Boolean(initialRoomAudio);
  }

  initialRoomProgress = Math.min(1, Math.max(0, (initialRoomNow - initialRoomAudio.shellipelagoFadeStart) / (initialRoomAudio.shellipelagoFadeDuration || initialRoomBgmFadeDuration)));
  initialRoomAudio.volume = initialRoomAudio.shellipelagoFadeFrom + ((initialRoomAudio.shellipelagoFadeTo - initialRoomAudio.shellipelagoFadeFrom) * initialRoomProgress);

  if (initialRoomProgress < 1) {
    return true;
  }

  initialRoomAudio.volume = initialRoomAudio.shellipelagoFadeTo;
  delete initialRoomAudio.shellipelagoFadeStart;
  delete initialRoomAudio.shellipelagoFadeFrom;
  delete initialRoomAudio.shellipelagoFadeTo;
  delete initialRoomAudio.shellipelagoFadeDuration;

  return !initialRoomAudio.shellipelagoStopOnFadeComplete;
}

function initialRoomGetBgmVolume(initialRoomBgmPath) {
  var initialRoomTrackName = String(initialRoomBgmPath || "").split(/[\\/]/).pop().toLowerCase();
  var initialRoomBoostedTracks = ["maintheme.mp3", "main theme.mp3", "bossmusic.mp3", "boss music.mp3"];
  var initialRoomQuietTracks = ["crossing the chasm.mp3", "desert of lost souls.mp3"];
  var initialRoomBaseVolume = 0.45;

  if (initialRoomBoostedTracks.indexOf(initialRoomTrackName) !== -1) {
    return Math.min(1, initialRoomBaseVolume * 2);
  }

  if (initialRoomQuietTracks.indexOf(initialRoomTrackName) !== -1) {
    return initialRoomBaseVolume * 0.5;
  }

  return initialRoomBaseVolume;
}

function initialRoomGetBgmPath() {
  var initialRoomBgmFile;
  var initialRoomIsKnownTrack;

  if (initialRoomFinalRunState.active) {
    return initialRoomSoundPaths.finalRunBgm;
  }

  initialRoomBgmFile = initialRoomCurrentRoom && initialRoomCurrentRoom.bgm ? initialRoomCurrentRoom.bgm : "";
  initialRoomIsKnownTrack = globalsState.musicTracks.indexOf(initialRoomBgmFile) !== -1;

  return initialRoomIsKnownTrack ? "src/sound/music/" + initialRoomBgmFile : initialRoomSoundPaths.bgm;
}

function initialRoomStopBgm() {
  if (initialRoomCurrentBgm) {
    initialRoomCurrentBgm.pause();
    initialRoomCurrentBgm.currentTime = 0;
    initialRoomCurrentBgm = null;
  }

  initialRoomFadingBgms.forEach(function (initialRoomAudio) {
    initialRoomAudio.pause();
    initialRoomAudio.currentTime = 0;
  });
  initialRoomFadingBgms = [];
}

function initialRoomStopSnakeLoops() {
  Object.keys(initialRoomSnakeLoopSounds).forEach(function (initialRoomEnemyId) {
    initialRoomSnakeLoopSounds[initialRoomEnemyId].pause();
    initialRoomSnakeLoopSounds[initialRoomEnemyId].currentTime = 0;
    delete initialRoomSnakeLoopSounds[initialRoomEnemyId];
  });
}

function initialRoomLoadTilesetData() {
  if (window.shellipelagoTilesetData) {
    return Promise.resolve(window.shellipelagoTilesetData);
  }

  return fetch(initialRoomTilesetDataPath).then(function (initialRoomResponse) {
    if (!initialRoomResponse.ok) {
      throw new Error("Unable to load tileset.json");
    }

    return initialRoomResponse.json();
  }).catch(function () {
    return null;
  });
}

function initialRoomSetTilesetData(initialRoomLoadedTilesetData) {
  var initialRoomTiles = initialRoomLoadedTilesetData && initialRoomLoadedTilesetData.tiles ? initialRoomLoadedTilesetData.tiles : {};

  initialRoomTilesetData = initialRoomLoadedTilesetData || { tiles: {} };
  initialRoomWaterTiles = Object.keys(initialRoomTiles).filter(function (initialRoomTileKey) {
    return initialRoomTiles[initialRoomTileKey].type === "Water" || initialRoomTiles[initialRoomTileKey].type === "Lava";
  }).map(function (initialRoomTileKey) {
    var initialRoomParts = initialRoomTileKey.split(",");

    return {
      x: Number(initialRoomParts[0]),
      y: Number(initialRoomParts[1])
    };
  }).filter(function (initialRoomTile) {
    return Number.isFinite(initialRoomTile.x) && Number.isFinite(initialRoomTile.y);
  }).sort(function (initialRoomFirstTile, initialRoomSecondTile) {
    if (initialRoomFirstTile.y === initialRoomSecondTile.y) {
      return initialRoomFirstTile.x - initialRoomSecondTile.x;
    }

    return initialRoomFirstTile.y - initialRoomSecondTile.y;
  });
}

function initialRoomResizeCanvas() {
  initialRoomCanvas.width = window.innerWidth;
  initialRoomCanvas.height = window.innerHeight;
  initialRoomMessageCanvas.width = window.innerWidth;
  initialRoomMessageCanvas.height = window.innerHeight;
  initialRoomUpdateEffectLayerBounds();
  initialRoomUpdateEnemyLayerBounds();
  initialRoomUpdateMessageCanvasBounds();
  initialRoomUpdateFinalRunLayerBounds();
  initialRoomResizeFinalRunRenderer();
  initialRoomContext.imageSmoothingEnabled = false;
  initialRoomMessageContext.imageSmoothingEnabled = false;
  initialRoomTileRenderCache = {};
  initialRoomUpdateView();
}

function initialRoomUpdateEnemyLayerBounds() {
  initialRoomEnemyLayer.style.position = "fixed";
  initialRoomEnemyLayer.style.left = "0";
  initialRoomEnemyLayer.style.top = "0";
  initialRoomEnemyLayer.style.width = "100vw";
  initialRoomEnemyLayer.style.height = "100vh";
  initialRoomEnemyLayer.style.pointerEvents = "none";
  initialRoomEnemyLayer.style.zIndex = "4";
  initialRoomEnemyLayer.style.overflow = "hidden";
}

function initialRoomUpdateEffectLayerBounds() {
  initialRoomEffectLayer.style.position = "fixed";
  initialRoomEffectLayer.style.left = "0";
  initialRoomEffectLayer.style.top = "0";
  initialRoomEffectLayer.style.width = "100vw";
  initialRoomEffectLayer.style.height = "100vh";
  initialRoomEffectLayer.style.pointerEvents = "none";
  initialRoomEffectLayer.style.zIndex = "5";
  initialRoomEffectLayer.style.overflow = "hidden";
}

function initialRoomUpdateRuntimeLayerVisibility() {
  var initialRoomShouldHideRuntimeLayers = initialRoomIsMapOpen || initialRoomIsStatusOpen || initialRoomIsMessageLogOpen;

  initialRoomEnemyLayer.style.display = initialRoomShouldHideRuntimeLayers ? "none" : "block";
  initialRoomEffectLayer.style.display = initialRoomShouldHideRuntimeLayers ? "none" : "block";
}

function initialRoomUpdateMessageCanvasBounds() {
  initialRoomMessageCanvas.style.position = "fixed";
  initialRoomMessageCanvas.style.left = "0";
  initialRoomMessageCanvas.style.top = "0";
  initialRoomMessageCanvas.style.width = "100vw";
  initialRoomMessageCanvas.style.height = "100vh";
  initialRoomMessageCanvas.style.pointerEvents = "none";
  initialRoomMessageCanvas.style.zIndex = "24";
  initialRoomMessageCanvas.style.background = "transparent";
  initialRoomMessageCanvas.style.border = "0";
}

function initialRoomUpdateFinalRunLayerBounds() {
  initialRoomFinalRunLayer.style.position = "fixed";
  initialRoomFinalRunLayer.style.left = "0";
  initialRoomFinalRunLayer.style.top = "0";
  initialRoomFinalRunLayer.style.width = "100vw";
  initialRoomFinalRunLayer.style.height = "100vh";
  initialRoomFinalRunLayer.style.pointerEvents = "auto";
  initialRoomFinalRunLayer.style.zIndex = "20";
  initialRoomFinalRunLayer.style.overflow = "hidden";
  initialRoomFinalRunLayer.style.background = "#12151c";
  initialRoomFinalRunLayer.style.cursor = initialRoomFinalRunState.active ? "none" : "";
  initialRoomFinalRunLayer.style.display = initialRoomFinalRunState.active ? "block" : "none";
}

function initialRoomEnsureFinalRunCrosshairElement() {
  var initialRoomCrosshair = null;
  var initialRoomHorizontalLine = null;
  var initialRoomVerticalLine = null;

  if (initialRoomFinalRunState.crosshairElement) {
    return;
  }

  initialRoomCrosshair = document.createElement("div");
  initialRoomHorizontalLine = document.createElement("div");
  initialRoomVerticalLine = document.createElement("div");
  initialRoomCrosshair.style.position = "fixed";
  initialRoomCrosshair.style.left = "50%";
  initialRoomCrosshair.style.top = "50%";
  initialRoomCrosshair.style.width = "1px";
  initialRoomCrosshair.style.height = "1px";
  initialRoomCrosshair.style.pointerEvents = "none";
  initialRoomCrosshair.style.zIndex = "21";
  initialRoomHorizontalLine.style.position = "absolute";
  initialRoomHorizontalLine.style.left = "-14px";
  initialRoomHorizontalLine.style.top = "0";
  initialRoomHorizontalLine.style.width = "28px";
  initialRoomHorizontalLine.style.height = "1px";
  initialRoomVerticalLine.style.position = "absolute";
  initialRoomVerticalLine.style.left = "0";
  initialRoomVerticalLine.style.top = "-14px";
  initialRoomVerticalLine.style.width = "1px";
  initialRoomVerticalLine.style.height = "28px";
  initialRoomCrosshair.appendChild(initialRoomHorizontalLine);
  initialRoomCrosshair.appendChild(initialRoomVerticalLine);
  initialRoomFinalRunLayer.appendChild(initialRoomCrosshair);
  initialRoomFinalRunState.crosshairElement = initialRoomCrosshair;
  initialRoomUpdateFinalRunCrosshairColor();
  initialRoomUpdateFinalRunScreenCrosshair();
}

function initialRoomEnsureFinalRunAudioToggles() {
  var initialRoomWrapper = null;
  var initialRoomMessageButton = null;
  var initialRoomBgmButton = null;
  var initialRoomSfxButton = null;

  if (initialRoomFinalRunState.audioToggleElement) {
    return;
  }

  initialRoomWrapper = document.createElement("div");
  initialRoomMessageButton = initialRoomCreateFinalRunAudioButton("B", "messageBox");
  initialRoomBgmButton = initialRoomCreateFinalRunAudioButton("O", "bgm");
  initialRoomSfxButton = initialRoomCreateFinalRunAudioButton("P", "sfx");
  initialRoomWrapper.style.position = "fixed";
  initialRoomWrapper.style.right = "18px";
  initialRoomWrapper.style.bottom = "18px";
  initialRoomWrapper.style.display = "flex";
  initialRoomWrapper.style.gap = "8px";
  initialRoomWrapper.style.pointerEvents = "auto";
  initialRoomWrapper.style.zIndex = "22";
  initialRoomWrapper.style.cursor = "none";
  initialRoomWrapper.appendChild(initialRoomMessageButton);
  initialRoomWrapper.appendChild(initialRoomBgmButton);
  initialRoomWrapper.appendChild(initialRoomSfxButton);
  initialRoomFinalRunLayer.appendChild(initialRoomWrapper);
  initialRoomFinalRunState.audioToggleElement = initialRoomWrapper;
}

function initialRoomCreateFinalRunAudioButton(initialRoomLetter, initialRoomKind) {
  var initialRoomButton = document.createElement("button");

  initialRoomButton.type = "button";
  initialRoomButton.dataset.kind = initialRoomKind;
  initialRoomButton.textContent = initialRoomLetter;
  initialRoomButton.style.background = "#050505";
  initialRoomButton.style.border = "3px solid #f7f7f1";
  initialRoomButton.style.color = "#f7f7f1";
  initialRoomButton.style.cursor = "none";
  initialRoomButton.style.fontFamily = "'" + initialRoomFontFamily + "', monospace";
  initialRoomButton.style.fontSize = "22px";
  initialRoomButton.style.height = "44px";
  initialRoomButton.style.lineHeight = "1";
  initialRoomButton.style.minWidth = "44px";
  initialRoomButton.style.padding = "0";
  initialRoomButton.style.position = "relative";
  initialRoomButton.addEventListener("click", function (initialRoomEvent) {
    if (initialRoomKind === "messageBox") {
      initialRoomToggleMessagePopupMute();
    }

    if (initialRoomKind === "bgm" && initialRoomHasBgmUnlock()) {
      initialRoomToggleBgmMute();
    }

    if (initialRoomKind === "sfx" && initialRoomHasSfxUnlock()) {
      initialRoomToggleSfxMute();
    }

    initialRoomEvent.preventDefault();
    initialRoomEvent.stopPropagation();
  });

  return initialRoomButton;
}

function initialRoomUpdateFinalRunAudioToggles() {
  if (!initialRoomFinalRunState.audioToggleElement) {
    return;
  }

  initialRoomFinalRunState.audioToggleElement.style.display = initialRoomFinalRunState.active ? "flex" : "none";
  Array.prototype.slice.call(initialRoomFinalRunState.audioToggleElement.children).forEach(function (initialRoomButton) {
    var initialRoomKind = initialRoomButton.dataset.kind;
    var initialRoomIsUnlocked = initialRoomKind === "messageBox" || (initialRoomKind === "bgm" ? initialRoomHasBgmUnlock() : initialRoomHasSfxUnlock());
    var initialRoomIsMuted = initialRoomKind === "messageBox" ? initialRoomAreMessagePopupsMuted : (initialRoomKind === "bgm" ? initialRoomIsBgmMuted : initialRoomIsSfxMuted);

    initialRoomButton.hidden = !initialRoomIsUnlocked;
    initialRoomButton.style.opacity = initialRoomIsMuted ? "0.72" : "1";
    initialRoomButton.style.background = initialRoomIsMuted ? "#f7f7f1" : "#050505";
    initialRoomButton.style.color = initialRoomIsMuted ? "#050505" : "#f7f7f1";

    if (initialRoomIsMuted) {
      initialRoomButton.style.textDecoration = "line-through";
      initialRoomButton.style.textDecorationColor = "#d94141";
      initialRoomButton.style.textDecorationThickness = "3px";
    } else {
      initialRoomButton.style.textDecoration = "none";
    }
  });
}

function initialRoomEnsureFinalRunHpElement() {
  var initialRoomHp = null;
  var initialRoomLabel = null;
  var initialRoomBar = null;
  var initialRoomFill = null;

  if (initialRoomFinalRunState.hpElement) {
    return;
  }

  initialRoomHp = document.createElement("div");
  initialRoomLabel = document.createElement("div");
  initialRoomBar = document.createElement("div");
  initialRoomFill = document.createElement("div");
  initialRoomHp.style.position = "fixed";
  initialRoomHp.style.left = finalRunConfig.tank.hp.left + "px";
  initialRoomHp.style.bottom = finalRunConfig.tank.hp.bottom + "px";
  initialRoomHp.style.alignItems = "center";
  initialRoomHp.style.display = "flex";
  initialRoomHp.style.gap = "12px";
  initialRoomHp.style.color = "#050505";
  initialRoomHp.style.fontFamily = "'" + initialRoomFontFamily + "', monospace";
  initialRoomHp.style.fontSize = "24px";
  initialRoomHp.style.lineHeight = "1";
  initialRoomHp.style.pointerEvents = "none";
  initialRoomHp.style.zIndex = "22";
  initialRoomLabel.textContent = "HP";
  initialRoomLabel.style.textShadow = "-2px 0 #f7f7f1, 0 2px #f7f7f1, 2px 0 #f7f7f1, 0 -2px #f7f7f1";
  initialRoomBar.style.width = finalRunConfig.tank.hp.width + "px";
  initialRoomBar.style.height = finalRunConfig.tank.hp.height + "px";
  initialRoomBar.style.background = "#f7f7f1";
  initialRoomBar.style.border = "4px solid #050505";
  initialRoomBar.style.boxShadow = "0 0 0 2px #f7f7f1";
  initialRoomBar.style.position = "relative";
  initialRoomFill.style.position = "absolute";
  initialRoomFill.style.left = "0";
  initialRoomFill.style.top = "0";
  initialRoomFill.style.height = "100%";
  initialRoomFill.style.width = "0";
  initialRoomHp.appendChild(initialRoomLabel);
  initialRoomBar.appendChild(initialRoomFill);
  initialRoomHp.appendChild(initialRoomBar);
  initialRoomFinalRunLayer.appendChild(initialRoomHp);
  initialRoomFinalRunState.hpElement = initialRoomHp;
}

function initialRoomUpdateFinalRunHpElement() {
  if (!initialRoomFinalRunState.hpElement) {
    return;
  }

  initialRoomFinalRunState.hpElement.style.display = initialRoomFinalRunState.active ? "flex" : "none";
  initialRoomFinalRunState.hpElement.children[1].children[0].style.background = initialRoomGetHudHpFillColor();
  initialRoomFinalRunState.hpElement.children[1].children[0].style.width = (Math.max(0, Math.min(1, initialRoomPlayer.hp / initialRoomGetEffectiveMaxHp())) * 100) + "%";
}

function initialRoomUpdateView() {
  var initialRoomShortSide = Math.min(initialRoomCanvas.width, initialRoomCanvas.height);
  var initialRoomVisibleTileCount = initialRoomGetVisibleTileCount();

  initialRoomView.movementTileSize = initialRoomShortSide / initialRoomBaseVisibleTiles;
  initialRoomView.tileSize = initialRoomShortSide / initialRoomVisibleTileCount;
  initialRoomView.visibleTilesX = initialRoomCanvas.width / initialRoomView.tileSize;
  initialRoomView.visibleTilesY = initialRoomCanvas.height / initialRoomView.tileSize;
  initialRoomView.cameraX = initialRoomClampCameraAxis(initialRoomPlayer.x, initialRoomView.visibleTilesX, mapManagerData.roomWidth);
  initialRoomView.cameraY = initialRoomClampCameraAxis(initialRoomPlayer.y, initialRoomView.visibleTilesY, mapManagerData.roomHeight);
  initialRoomView.offsetX = (initialRoomCanvas.width / 2) - (initialRoomView.cameraX * initialRoomView.tileSize);
  initialRoomView.offsetY = (initialRoomCanvas.height / 2) - (initialRoomView.cameraY * initialRoomView.tileSize);
  initialRoomApplyScreenShakeToView();
}

function initialRoomApplyScreenShakeToView() {
  var initialRoomNow = Date.now();
  var initialRoomProgress = 0;
  var initialRoomCurrentMagnitude = 0;
  var initialRoomShakeX = 0;
  var initialRoomShakeY = 0;

  if (initialRoomNow >= initialRoomScreenShakeUntil || initialRoomScreenShakeMagnitude <= 0) {
    return;
  }

  initialRoomProgress = Math.max(0, Math.min(1, (initialRoomNow - initialRoomScreenShakeStartedAt) / Math.max(1, initialRoomScreenShakeUntil - initialRoomScreenShakeStartedAt)));
  initialRoomCurrentMagnitude = initialRoomScreenShakeMagnitude * (1 - initialRoomProgress) * initialRoomView.tileSize;
  initialRoomShakeX = Math.sin(initialRoomNow * 0.071) * initialRoomCurrentMagnitude;
  initialRoomShakeY = Math.cos(initialRoomNow * 0.053) * initialRoomCurrentMagnitude;
  initialRoomView.offsetX += initialRoomShakeX;
  initialRoomView.offsetY += initialRoomShakeY;
}

function initialRoomStartScreenShake(initialRoomDuration, initialRoomMagnitude) {
  var initialRoomNow = Date.now();

  initialRoomScreenShakeStartedAt = initialRoomNow;
  initialRoomScreenShakeUntil = initialRoomNow + initialRoomDuration;
  initialRoomScreenShakeMagnitude = initialRoomMagnitude;
}

function initialRoomGetVisibleTileCount() {
  if (initialRoomIsZoomTrapActive()) {
    return 3;
  }

  return initialRoomBaseVisibleTiles * (initialRoomHasTankForm() ? initialRoomTankVisibleTileMultiplier : 1);
}

function initialRoomIsFinalRunRoom(initialRoomRoom) {
  return Boolean(initialRoomRoom && initialRoomRoom.finalRun);
}

function initialRoomGetInitialRoom() {
  var initialRoomFinalRoom = null;

  if (!globalsState.startInFinalRun) {
    return mapManagerEnsureRoom(0, 0);
  }

  mapManagerData.rooms.forEach(function (initialRoomRoom) {
    if (!initialRoomFinalRoom && initialRoomRoom.finalRun) {
      initialRoomFinalRoom = initialRoomRoom;
    }
  });

  if (initialRoomFinalRoom) {
    return initialRoomFinalRoom;
  }

  return {
    id: "download_game_final_run",
    name: "Final Run",
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    finalRun: true,
    tiles: []
  };
}

function initialRoomSyncFinalRunStateForRoom() {
  if (initialRoomIsFinalRunRoom(initialRoomCurrentRoom)) {
    initialRoomEnterFinalRun();
    return;
  }

  initialRoomExitFinalRun();
}

function initialRoomEnterFinalRun() {
  if (initialRoomFinalRunState.active) {
    return;
  }

  initialRoomFinalRunState.active = true;
  initialRoomIsMapOpen = false;
  initialRoomIsStatusOpen = false;
  initialRoomKeys = {};
  initialRoomInputOrder = [];
  initialRoomPlayer.moveDirection = null;
  initialRoomEnemyLayer.style.display = "none";
  initialRoomEffectLayer.style.display = "none";
  initialRoomMessageCanvas.style.display = "block";
  initialRoomFinalRunMouse.x = window.innerWidth / 2;
  initialRoomFinalRunMouse.y = window.innerHeight / 2;
  initialRoomFinalRunState.runStartedAt = performance.now();
  initialRoomLoadCreditsSource();
  initialRoomUpdateFinalRunLayerBounds();
  initialRoomEnsureFinalRunCrosshairElement();
  initialRoomEnsureFinalRunAudioToggles();
  initialRoomEnsureFinalRunHpElement();
  initialRoomUpdateFinalRunScreenCrosshair();
  initialRoomUpdateFinalRunAudioToggles();
  initialRoomUpdateFinalRunHpElement();

  if (initialRoomFinalRunState.initialized) {
    initialRoomResetFinalRunBlobSpawns();
    initialRoomResetFinalRunWizardSpawns();
    initialRoomStartFinalRunLoop();
    return;
  }

  initialRoomShowFinalRunStatus("Initializing final run...");
  initialRoomLoadFinalRunScene();
}

function initialRoomExitFinalRun() {
  if (!initialRoomFinalRunState.active) {
    return;
  }

  initialRoomFinalRunState.active = false;
  if (initialRoomNextBgmAt === Infinity) {
    initialRoomNextBgmAt = 0;
  }
  initialRoomEnemyLayer.style.display = "block";
  initialRoomEffectLayer.style.display = "block";
  initialRoomMessageCanvas.style.display = "block";
  initialRoomUpdateFinalRunLayerBounds();
  if (initialRoomFinalRunState.crosshairElement) {
    initialRoomFinalRunState.crosshairElement.style.display = "none";
  }
  if (initialRoomFinalRunState.audioToggleElement) {
    initialRoomFinalRunState.audioToggleElement.style.display = "none";
  }
  if (initialRoomFinalRunState.hpElement) {
    initialRoomFinalRunState.hpElement.style.display = "none";
  }

  if (initialRoomFinalRunState.frameId) {
    window.cancelAnimationFrame(initialRoomFinalRunState.frameId);
    initialRoomFinalRunState.frameId = 0;
  }
}

function initialRoomShowFinalRunStatus(initialRoomStatusText) {
  if (!initialRoomFinalRunState.statusElement) {
    initialRoomFinalRunState.statusElement = document.createElement("div");
    initialRoomFinalRunState.statusElement.style.alignItems = "center";
    initialRoomFinalRunState.statusElement.style.color = "#f3f0e8";
    initialRoomFinalRunState.statusElement.style.display = "flex";
    initialRoomFinalRunState.statusElement.style.fontFamily = "sans-serif";
    initialRoomFinalRunState.statusElement.style.fontSize = "20px";
    initialRoomFinalRunState.statusElement.style.height = "100%";
    initialRoomFinalRunState.statusElement.style.justifyContent = "center";
    initialRoomFinalRunLayer.appendChild(initialRoomFinalRunState.statusElement);
  }

  initialRoomFinalRunState.statusElement.textContent = initialRoomStatusText;
}

function initialRoomLoadFinalRunScene() {
  if (initialRoomFinalRunState.loading) {
    return;
  }

  initialRoomFinalRunState.loading = true;

  var initialRoomThreeUrl = new URL("src/vendor/three/three.module.js", document.baseURI).href;
  var initialRoomRapierUrl = new URL("src/vendor/rapier3d/rapier.es.js", document.baseURI).href;

  Promise.all([
    import(initialRoomThreeUrl),
    import(initialRoomRapierUrl)
  ]).then(function (initialRoomModules) {
    return initialRoomInitializeFinalRunScene(initialRoomModules[0], initialRoomModules[1].default || initialRoomModules[1]);
  }).catch(function (initialRoomError) {
    console.error(initialRoomError);
    initialRoomShowFinalRunStatus("Unable to initialize final run.");
  }).finally(function () {
    initialRoomFinalRunState.loading = false;
  });
}

function initialRoomInitializeFinalRunScene(initialRoomThree, initialRoomRapier) {
  var initialRoomRenderer = new initialRoomThree.WebGLRenderer({ antialias: false });
  var initialRoomScene = new initialRoomThree.Scene();
  var initialRoomCamera = new initialRoomThree.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 140);

  initialRoomFinalRunState.rapier = initialRoomRapier;
  if (initialRoomRapier && initialRoomRapier.init) {
    var initialRoomRapierWasmUrl = new URL("src/vendor/rapier3d/rapier_wasm3d_bg.wasm", document.baseURI).href;
    return initialRoomRapier.init(initialRoomRapierWasmUrl).then(function () {
      initialRoomFinishFinalRunScene(initialRoomThree, initialRoomRenderer, initialRoomScene, initialRoomCamera, initialRoomRapier);
    });
  }

  initialRoomFinishFinalRunScene(initialRoomThree, initialRoomRenderer, initialRoomScene, initialRoomCamera, initialRoomRapier);
  return Promise.resolve();
}

function initialRoomFinishFinalRunScene(initialRoomThree, initialRoomRenderer, initialRoomScene, initialRoomCamera, initialRoomRapier) {
  var initialRoomAmbientLight = new initialRoomThree.AmbientLight(0xffffff, 0.72);
  var initialRoomDirectionalLight = new initialRoomThree.DirectionalLight(0xffffff, 1.35);
  var initialRoomPointLight = new initialRoomThree.PointLight(0xffffff, 0.65, 60);

  if (initialRoomFinalRunState.statusElement && initialRoomFinalRunState.statusElement.parentNode) {
    initialRoomFinalRunState.statusElement.parentNode.removeChild(initialRoomFinalRunState.statusElement);
  }

  initialRoomFinalRunState.statusElement = null;
  initialRoomFinalRunLayer.appendChild(initialRoomRenderer.domElement);
  initialRoomRenderer.domElement.style.display = "block";
  initialRoomDirectionalLight.position.set(7, 8, -6);
  initialRoomPointLight.position.set(6, 5.5, -10);
  initialRoomCamera.position.set(0, 4.6, 8.4);
  initialRoomCamera.lookAt(0, -1.7, -8);
  initialRoomScene.add(initialRoomAmbientLight);
  initialRoomScene.add(initialRoomDirectionalLight);
  initialRoomScene.add(initialRoomPointLight);

  if (initialRoomRapier && initialRoomRapier.World) {
    initialRoomFinalRunState.world = new initialRoomRapier.World({ x: 0, y: -9.81, z: 0 });
  }

  initialRoomFinalRunState.three = initialRoomThree;
  initialRoomFinalRunState.renderer = initialRoomRenderer;
  initialRoomFinalRunState.scene = initialRoomScene;
  initialRoomFinalRunState.camera = initialRoomCamera;
  initialRoomFinalRunState.sunLight = initialRoomDirectionalLight;
  initialRoomFinalRunState.initialized = true;
  initialRoomFinalRunState.tankMaterials = [];
  initialRoomBuildFinalRunEnvironment();
  initialRoomBuildFinalRunTankViewModel();
  initialRoomLoadFinalRunBlobTexture();
  initialRoomLoadFinalRunSnakeTexture();
  initialRoomLoadFinalRunWizardTexture();
  initialRoomLoadFinalRunFireballTexture();
  initialRoomResetFinalRunBlobSpawns();
  initialRoomResetFinalRunWizardSpawns();
  initialRoomResizeFinalRunRenderer();
  initialRoomStartFinalRunLoop();
}

function initialRoomBuildFinalRunTankViewModel() {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomTankConfig = finalRunConfig.tank;
  var initialRoomTankGroup = new initialRoomThree.Object3D();
  var initialRoomNozzlePivot = new initialRoomThree.Object3D();
  var initialRoomNozzleRecoilGroup = new initialRoomThree.Object3D();
  var initialRoomChassis = initialRoomCreateFinalRunBox(
    initialRoomTankConfig.chassis.width,
    initialRoomTankConfig.chassis.height,
    initialRoomTankConfig.chassis.depth,
    "tankFill",
    "tankEdge"
  );
  var initialRoomNozzle = initialRoomCreateFinalRunBox(
    initialRoomTankConfig.nozzle.width,
    initialRoomTankConfig.nozzle.height,
    initialRoomTankConfig.nozzle.length,
    "tankFill",
    "tankEdge"
  );

  initialRoomTankGroup.position.set(0, 0, initialRoomTankConfig.cameraOffsetZ);
  initialRoomChassis.position.set(0, initialRoomTankConfig.chassis.y, initialRoomTankConfig.chassis.z);
  initialRoomNozzlePivot.position.set(0, initialRoomTankConfig.nozzle.pivotY, initialRoomTankConfig.nozzle.pivotZ);
  initialRoomNozzle.position.set(0, 0, -initialRoomTankConfig.nozzle.length / 2);
  initialRoomNozzleRecoilGroup.add(initialRoomNozzle);
  initialRoomNozzlePivot.add(initialRoomNozzleRecoilGroup);
  initialRoomTankGroup.add(initialRoomChassis);
  initialRoomTankGroup.add(initialRoomNozzlePivot);
  initialRoomFinalRunState.camera.add(initialRoomTankGroup);
  initialRoomFinalRunState.scene.add(initialRoomFinalRunState.camera);
  initialRoomFinalRunState.tankViewModel = initialRoomTankGroup;
  initialRoomFinalRunState.tankNozzlePivot = initialRoomNozzlePivot;
  initialRoomFinalRunState.tankNozzleRecoilGroup = initialRoomNozzleRecoilGroup;
  initialRoomFinalRunState.muzzleParticleGeometry = new initialRoomThree.BoxGeometry(0.032, 0.032, 0.032);
  initialRoomUpdateFinalRunTankColors();
}

function initialRoomLoadFinalRunBlobTexture() {
  var initialRoomThree = initialRoomFinalRunState.three;

  if (initialRoomFinalRunState.blobTexture) {
    return;
  }

  new initialRoomThree.TextureLoader().load(globalsState.enemyDefinitions.blob.image, function (initialRoomTexture) {
    initialRoomTexture.colorSpace = initialRoomThree.SRGBColorSpace;
    initialRoomTexture.magFilter = initialRoomThree.NearestFilter;
    initialRoomTexture.minFilter = initialRoomThree.NearestFilter;
    initialRoomFinalRunState.blobTexture = initialRoomTexture;
    initialRoomFinalRunState.blobGreyscaleTexture = initialRoomCreateFinalRunGreyscaleTexture(initialRoomTexture);
  });
}

function initialRoomLoadFinalRunSnakeTexture() {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomSnakeDefinition = globalsState.enemyDefinitions.snake || {};
  var initialRoomSnakeImage = initialRoomSnakeDefinition.image || "src/img/enemy/snake_down.png";

  if (initialRoomFinalRunState.snakeTexture) {
    return;
  }

  new initialRoomThree.TextureLoader().load(initialRoomSnakeImage, function (initialRoomTexture) {
    initialRoomTexture.colorSpace = initialRoomThree.SRGBColorSpace;
    initialRoomTexture.magFilter = initialRoomThree.NearestFilter;
    initialRoomTexture.minFilter = initialRoomThree.NearestFilter;
    initialRoomFinalRunState.snakeTexture = initialRoomTexture;
    initialRoomFinalRunState.snakeGreyscaleTexture = initialRoomCreateFinalRunGreyscaleTexture(initialRoomTexture);
  });
}

function initialRoomCreateFinalRunGreyscaleTexture(initialRoomSourceTexture) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomSourceImage = initialRoomSourceTexture ? initialRoomSourceTexture.image : null;
  var initialRoomCanvas = null;
  var initialRoomContext = null;
  var initialRoomImageData = null;
  var initialRoomPixels = null;
  var initialRoomPixelIndex = 0;
  var initialRoomGrey = 0;
  var initialRoomTexture = null;
  var initialRoomWidth = 0;
  var initialRoomHeight = 0;

  if (!initialRoomThree || !initialRoomSourceImage) {
    return null;
  }

  initialRoomWidth = initialRoomSourceImage.naturalWidth || initialRoomSourceImage.videoWidth || initialRoomSourceImage.width || 0;
  initialRoomHeight = initialRoomSourceImage.naturalHeight || initialRoomSourceImage.videoHeight || initialRoomSourceImage.height || 0;

  if (!initialRoomWidth || !initialRoomHeight) {
    return null;
  }

  initialRoomCanvas = document.createElement("canvas");
  initialRoomCanvas.width = initialRoomWidth;
  initialRoomCanvas.height = initialRoomHeight;
  initialRoomContext = initialRoomCanvas.getContext("2d", { willReadFrequently: true });
  initialRoomContext.imageSmoothingEnabled = false;

  try {
    initialRoomContext.drawImage(initialRoomSourceImage, 0, 0, initialRoomWidth, initialRoomHeight);
    initialRoomImageData = initialRoomContext.getImageData(0, 0, initialRoomWidth, initialRoomHeight);
  } catch (initialRoomError) {
    return null;
  }

  initialRoomPixels = initialRoomImageData.data;

  while (initialRoomPixelIndex < initialRoomPixels.length) {
    initialRoomGrey = Math.round(
      (initialRoomPixels[initialRoomPixelIndex] * 0.299) +
      (initialRoomPixels[initialRoomPixelIndex + 1] * 0.587) +
      (initialRoomPixels[initialRoomPixelIndex + 2] * 0.114)
    );
    initialRoomPixels[initialRoomPixelIndex] = initialRoomGrey;
    initialRoomPixels[initialRoomPixelIndex + 1] = initialRoomGrey;
    initialRoomPixels[initialRoomPixelIndex + 2] = initialRoomGrey;
    initialRoomPixelIndex += 4;
  }

  initialRoomContext.putImageData(initialRoomImageData, 0, 0);
  initialRoomTexture = new initialRoomThree.CanvasTexture(initialRoomCanvas);
  initialRoomTexture.colorSpace = initialRoomThree.SRGBColorSpace;
  initialRoomTexture.magFilter = initialRoomThree.NearestFilter;
  initialRoomTexture.minFilter = initialRoomThree.NearestFilter;
  return initialRoomTexture;
}

function initialRoomShouldUseFinalRunColor() {
  return initialRoomGetGraphicsLevel() >= 2;
}

function initialRoomGetFinalRunParticleColors(initialRoomColors) {
  if (initialRoomShouldUseFinalRunColor()) {
    return initialRoomColors;
  }

  return initialRoomColors.map(function (initialRoomColor) {
    var initialRoomRgb = initialRoomHexToRgb(initialRoomColor);
    var initialRoomGrey = Math.round((initialRoomRgb.r * 0.299) + (initialRoomRgb.g * 0.587) + (initialRoomRgb.b * 0.114));
    var initialRoomGreyHex = initialRoomGrey.toString(16).padStart(2, "0");

    return "#" + initialRoomGreyHex + initialRoomGreyHex + initialRoomGreyHex;
  });
}

function initialRoomGetFinalRunBlobTexture() {
  if (initialRoomShouldUseFinalRunColor()) {
    return initialRoomFinalRunState.blobTexture;
  }

  return initialRoomFinalRunState.blobGreyscaleTexture || initialRoomFinalRunState.blobTexture;
}

function initialRoomGetFinalRunSnakeTexture() {
  if (initialRoomShouldUseFinalRunColor()) {
    return initialRoomFinalRunState.snakeTexture || initialRoomFinalRunState.blobTexture;
  }

  return initialRoomFinalRunState.snakeGreyscaleTexture || initialRoomFinalRunState.snakeTexture || initialRoomGetFinalRunBlobTexture();
}

function initialRoomGetFinalRunWizardTexture() {
  if (initialRoomShouldUseFinalRunColor()) {
    return initialRoomFinalRunState.wizardTexture;
  }

  return initialRoomFinalRunState.wizardGreyscaleTexture || initialRoomFinalRunState.wizardTexture;
}

function initialRoomResetFinalRunBlobSpawns() {
  initialRoomFinalRunState.blobs.forEach(function (initialRoomBlob) {
    if (initialRoomBlob.sprite.parent) {
      initialRoomBlob.sprite.parent.remove(initialRoomBlob.sprite);
    }
  });
  initialRoomFinalRunState.blobs = [];
  initialRoomFinalRunState.blobSpawnIndex = 0;
  initialRoomFinalRunState.snakeSpawnIndex = 0;
  initialRoomFinalRunState.nextBlobSpawnAt = performance.now() + finalRunConfig.tank.blobs.firstSpawnDelay;
  initialRoomFinalRunState.nextSnakeSpawnAt = performance.now() + finalRunConfig.tank.blobs.firstSpawnDelay + (finalRunConfig.tank.blobs.maxSpawnDelay * 2);
}

function initialRoomLoadFinalRunWizardTexture() {
  var initialRoomThree = initialRoomFinalRunState.three;

  if (initialRoomFinalRunState.wizardTexture) {
    return;
  }

  new initialRoomThree.TextureLoader().load(globalsState.enemyDefinitions.sorcerer.image, function (initialRoomTexture) {
    initialRoomTexture.colorSpace = initialRoomThree.SRGBColorSpace;
    initialRoomTexture.magFilter = initialRoomThree.NearestFilter;
    initialRoomTexture.minFilter = initialRoomThree.NearestFilter;
    initialRoomFinalRunState.wizardTexture = initialRoomTexture;
    initialRoomFinalRunState.wizardGreyscaleTexture = initialRoomCreateFinalRunGreyscaleTexture(initialRoomTexture);
  });
}

function initialRoomLoadFinalRunFireballTexture() {
  var initialRoomThree = initialRoomFinalRunState.three;

  if (initialRoomFinalRunState.fireballTexture) {
    return;
  }

  new initialRoomThree.TextureLoader().load("src/img/item/LargeFlame.gif", function (initialRoomTexture) {
    initialRoomTexture.colorSpace = initialRoomThree.SRGBColorSpace;
    initialRoomTexture.magFilter = initialRoomThree.NearestFilter;
    initialRoomTexture.minFilter = initialRoomThree.NearestFilter;
    initialRoomFinalRunState.fireballTexture = initialRoomTexture;
  });
}

function initialRoomResetFinalRunWizardSpawns() {
  initialRoomFinalRunState.wizards.forEach(function (initialRoomWizard) {
    initialRoomRemoveFinalRunWizard(initialRoomWizard);
  });
  initialRoomFinalRunState.wizards = [];
  initialRoomFinalRunState.wizardSpawnIndex = 0;
  initialRoomFinalRunState.nextWizardSpawnAt = performance.now() + finalRunConfig.tank.wizards.firstSpawnDelay;
  initialRoomResetFinalRunBoss();
}

function initialRoomResetFinalRunBoss() {
  if (initialRoomFinalRunState.boss) {
    initialRoomRemoveFinalRunBoss();
  }

  initialRoomFinalRunState.boss = null;
  initialRoomFinalRunState.bossSpawned = false;
  initialRoomFinalRunState.bossDefeated = false;
  initialRoomResetFinalRunCredits();
}

function initialRoomResetFinalRunCredits() {
  initialRoomFinalRunState.credits.forEach(initialRoomRemoveFinalRunCredit);
  initialRoomFinalRunState.credits = [];
  initialRoomFinalRunState.creditLines = [];
  initialRoomFinalRunState.creditSpawnIndex = 0;
  initialRoomFinalRunState.nextCreditSpawnAt = 0;
  initialRoomFinalRunState.creditsStarted = false;
  initialRoomFinalRunState.finalCreditStopStartedAt = 0;
}

function initialRoomCreateFinalRunBox(initialRoomWidth, initialRoomHeight, initialRoomDepth, initialRoomFillRole, initialRoomEdgeRole) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomGroup = new initialRoomThree.Object3D();
  var initialRoomGeometry = new initialRoomThree.BoxGeometry(initialRoomWidth, initialRoomHeight, initialRoomDepth);
  var initialRoomFillMaterial = new initialRoomThree.MeshBasicMaterial({ color: "#ffffff" });
  var initialRoomEdgeMaterial = new initialRoomThree.LineBasicMaterial({ color: "#050505" });
  var initialRoomMesh = new initialRoomThree.Mesh(initialRoomGeometry, initialRoomFillMaterial);
  var initialRoomEdges = new initialRoomThree.LineSegments(
    new initialRoomThree.EdgesGeometry(initialRoomGeometry),
    initialRoomEdgeMaterial
  );

  initialRoomFinalRunState.tankMaterials.push({
    material: initialRoomFillMaterial,
    role: initialRoomFillRole
  });
  initialRoomFinalRunState.tankMaterials.push({
    material: initialRoomEdgeMaterial,
    role: initialRoomEdgeRole
  });
  initialRoomGroup.add(initialRoomMesh);
  initialRoomGroup.add(initialRoomEdges);
  return initialRoomGroup;
}

function initialRoomBuildFinalRunCrosshair() {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomCrosshairGeometry = new initialRoomThree.BufferGeometry();
  var initialRoomSize = finalRunConfig.tank.crosshair.size;
  var initialRoomGap = finalRunConfig.tank.crosshair.gap;
  var initialRoomVertices = new Float32Array([
    -initialRoomSize, 0, 0,
    -initialRoomGap, 0, 0,
    initialRoomGap, 0, 0,
    initialRoomSize, 0, 0,
    0, -initialRoomSize, 0,
    0, -initialRoomGap, 0,
    0, initialRoomGap, 0,
    0, initialRoomSize, 0
  ]);

  initialRoomFinalRunState.crosshairMaterial = new initialRoomThree.LineBasicMaterial({ color: "#ffffff" });
  initialRoomCrosshairGeometry.setAttribute("position", new initialRoomThree.BufferAttribute(initialRoomVertices, 3));
  initialRoomFinalRunState.crosshair = new initialRoomThree.LineSegments(initialRoomCrosshairGeometry, initialRoomFinalRunState.crosshairMaterial);
  initialRoomFinalRunState.camera.add(initialRoomFinalRunState.crosshair);
  initialRoomUpdateFinalRunCrosshairColor();
}

function initialRoomUpdateFinalRunTankColors() {
  var initialRoomTankConfig = finalRunConfig.tank;
  var initialRoomUseColor = initialRoomGetGraphicsLevel() >= 2;
  var initialRoomFillColor = initialRoomUseColor ? initialRoomTankConfig.fillColor : initialRoomTankConfig.greyscaleFillColor;
  var initialRoomEdgeColor = initialRoomUseColor ? initialRoomTankConfig.edgeColor : initialRoomTankConfig.greyscaleEdgeColor;

  initialRoomFinalRunState.tankMaterials.forEach(function (initialRoomTankMaterial) {
    if (initialRoomTankMaterial.role === "tankFill") {
      initialRoomTankMaterial.material.color.set(initialRoomFillColor);
    } else {
      initialRoomTankMaterial.material.color.set(initialRoomEdgeColor);
    }
  });
}

function initialRoomUpdateFinalRunCrosshairColor() {
  var initialRoomCrosshairConfig = finalRunConfig.tank.crosshair;
  var initialRoomUseColor = initialRoomGetGraphicsLevel() >= 2;
  var initialRoomCrosshairColor = initialRoomUseColor ? initialRoomCrosshairConfig.color : initialRoomCrosshairConfig.greyscaleColor;

  if (initialRoomFinalRunState.crosshairMaterial) {
    initialRoomFinalRunState.crosshairMaterial.color.set(initialRoomCrosshairColor);
  }

  if (initialRoomFinalRunState.crosshairElement) {
    Array.prototype.slice.call(initialRoomFinalRunState.crosshairElement.children).forEach(function (initialRoomLine) {
      initialRoomLine.style.background = initialRoomCrosshairColor;
    });
  }
}

function initialRoomUpdateFinalRunEnemyTextureModes() {
  var initialRoomBlobTexture = initialRoomGetFinalRunBlobTexture();
  var initialRoomSnakeTexture = initialRoomGetFinalRunSnakeTexture();
  var initialRoomWizardTexture = initialRoomGetFinalRunWizardTexture();

  initialRoomFinalRunState.blobs.forEach(function (initialRoomBlob) {
    if (initialRoomBlob.sprite && initialRoomBlob.sprite.material) {
      initialRoomBlob.sprite.material.map = initialRoomBlob.kind === "snake" ? initialRoomSnakeTexture : initialRoomBlobTexture;
      initialRoomBlob.sprite.material.needsUpdate = true;
    }
  });

  initialRoomFinalRunState.wizards.forEach(function (initialRoomWizard) {
    if (initialRoomWizard.sprite && initialRoomWizard.sprite.material) {
      initialRoomWizard.sprite.material.map = initialRoomWizardTexture;
      initialRoomWizard.sprite.material.needsUpdate = true;
    }
  });

  if (initialRoomFinalRunState.boss && initialRoomFinalRunState.boss.sprite && initialRoomFinalRunState.boss.sprite.material) {
    initialRoomFinalRunState.boss.sprite.material.map = initialRoomBlobTexture;
    initialRoomFinalRunState.boss.sprite.material.needsUpdate = true;
  }
}

function initialRoomUpdateFinalRunTankAim() {
  var initialRoomTankConfig = finalRunConfig.tank;
  var initialRoomPivot = initialRoomFinalRunState.tankNozzlePivot;
  var initialRoomViewModel = initialRoomFinalRunState.tankViewModel;
  var initialRoomNow = performance.now() / 1000;
  var initialRoomTargetX = (0.5 - (initialRoomFinalRunMouse.x / Math.max(1, window.innerWidth))) * 5.6;
  var initialRoomTargetZ = -initialRoomTankConfig.nozzle.targetDepth;
  var initialRoomDeltaX = initialRoomTargetX;
  var initialRoomDeltaZ = initialRoomTargetZ - initialRoomTankConfig.nozzle.pivotZ;
  var initialRoomYaw = Math.atan2(initialRoomDeltaX, -initialRoomDeltaZ);
  var initialRoomMaxPitch = (initialRoomTankConfig.nozzle.maxPitchDegrees * Math.PI) / 180;
  var initialRoomVerticalAim = 1 - (initialRoomFinalRunMouse.y / Math.max(1, window.innerHeight));
  var initialRoomPitch = initialRoomVerticalAim * initialRoomMaxPitch * initialRoomTankConfig.nozzle.aimYScale;
  var initialRoomBob = (Math.sin(initialRoomNow * 8.7) * 0.58) + (Math.sin(initialRoomNow * 13.9 + 1.7) * 0.32) + (Math.sin(initialRoomNow * 23.1 + 0.3) * 0.1);

  if (!initialRoomPivot) {
    return;
  }

  if (initialRoomViewModel) {
    initialRoomViewModel.position.y = initialRoomGetFinalRunCreditStopProgress(performance.now()) < 1 ? initialRoomBob * initialRoomTankConfig.bobAmount : 0;
  }

  initialRoomPitch = Math.max(0, Math.min(initialRoomMaxPitch, initialRoomPitch));
  initialRoomPivot.rotation.order = "YXZ";
  initialRoomPivot.rotation.y = initialRoomYaw;
  initialRoomPivot.rotation.x = initialRoomPitch;
  initialRoomPivot.rotation.z = 0;
  initialRoomUpdateFinalRunCrosshairPosition();
}

function initialRoomUpdateFinalRunBlobs(initialRoomNow) {
  var initialRoomBlobConfig = finalRunConfig.tank.blobs;

  if (initialRoomCanSpawnFinalRunEnemies(initialRoomNow) && initialRoomFinalRunState.blobTexture && initialRoomNow >= initialRoomFinalRunState.nextBlobSpawnAt) {
    initialRoomSpawnFinalRunBlob(initialRoomNow);
    initialRoomFinalRunState.nextBlobSpawnAt = initialRoomNow + initialRoomGetFinalRunBlobSpawnDelay(initialRoomNow);
  }

  if (initialRoomCanSpawnFinalRunEnemies(initialRoomNow) && initialRoomFinalRunState.snakeTexture && initialRoomNow >= initialRoomFinalRunState.nextSnakeSpawnAt) {
    initialRoomSpawnFinalRunSnake(initialRoomNow);
    initialRoomFinalRunState.nextSnakeSpawnAt = initialRoomNow + (initialRoomGetFinalRunBlobSpawnDelay(initialRoomNow) * 6);
  }

  initialRoomFinalRunState.blobs = initialRoomFinalRunState.blobs.filter(function (initialRoomBlob) {
    if (initialRoomNow - initialRoomBlob.spawnedAt > initialRoomBlobConfig.maxLifetime) {
      initialRoomRemoveFinalRunBlob(initialRoomBlob);
      return false;
    }

    if (initialRoomDoesFinalRunBlobHitTank(initialRoomBlob)) {
      if (initialRoomBlob.kind !== "snake") {
        initialRoomDamagePlayer(initialRoomBlobConfig.damage, "redSlime");
        initialRoomUpdateFinalRunHpElement();
      }
      initialRoomRemoveFinalRunBlob(initialRoomBlob);
      return false;
    }

    return true;
  });
}

function initialRoomCanSpawnFinalRunEnemies(initialRoomNow) {
  return initialRoomNow - initialRoomFinalRunState.runStartedAt < finalRunConfig.tank.enemySpawnStopTime;
}

function initialRoomGetFinalRunElapsed(initialRoomNow) {
  return Math.max(0, initialRoomNow - initialRoomFinalRunState.runStartedAt);
}

function initialRoomGetFinalRunSpawnRampProgress(initialRoomNow) {
  var initialRoomRampStart = finalRunConfig.tank.wizards.firstSpawnDelay;
  var initialRoomRampEnd = finalRunConfig.tank.enemySpawnStopTime;

  return Math.max(0, Math.min(1, (initialRoomGetFinalRunElapsed(initialRoomNow) - initialRoomRampStart) / Math.max(1, initialRoomRampEnd - initialRoomRampStart)));
}

function initialRoomGetFinalRunBlobSpawnDelay(initialRoomNow) {
  var initialRoomBlobConfig = finalRunConfig.tank.blobs;
  var initialRoomRampProgress = initialRoomGetFinalRunSpawnRampProgress(initialRoomNow);
  var initialRoomMinDelay = initialRoomBlobConfig.minSpawnDelay + ((initialRoomBlobConfig.lateMinSpawnDelay - initialRoomBlobConfig.minSpawnDelay) * initialRoomRampProgress);
  var initialRoomMaxDelay = initialRoomBlobConfig.maxSpawnDelay + ((initialRoomBlobConfig.lateMaxSpawnDelay - initialRoomBlobConfig.maxSpawnDelay) * initialRoomRampProgress);

  return initialRoomMinDelay + (Math.random() * (initialRoomMaxDelay - initialRoomMinDelay));
}

function initialRoomUpdateFinalRunWizards(initialRoomNow) {
  var initialRoomWizardConfig = finalRunConfig.tank.wizards;

  if (initialRoomCanSpawnFinalRunEnemies(initialRoomNow) && initialRoomFinalRunState.wizardTexture && initialRoomNow >= initialRoomFinalRunState.nextWizardSpawnAt) {
    initialRoomSpawnFinalRunWizard(initialRoomNow);
    initialRoomFinalRunState.nextWizardSpawnAt = initialRoomNow + initialRoomGetFinalRunWizardSpawnDelay(initialRoomNow);
  }

  initialRoomFinalRunState.wizards = initialRoomFinalRunState.wizards.filter(function (initialRoomWizard) {
    var initialRoomAge = initialRoomNow - initialRoomWizard.spawnedAt;

    if (initialRoomAge > initialRoomWizardConfig.maxLifetime) {
      initialRoomRemoveFinalRunWizard(initialRoomWizard);
      return false;
    }

    if (initialRoomWizard.state === "attached" && initialRoomShouldDetachFinalRunWizard(initialRoomWizard, initialRoomNow)) {
      initialRoomDetachFinalRunWizard(initialRoomWizard, initialRoomNow);
    }

    if (initialRoomWizard.state === "floating") {
      initialRoomUpdateFinalRunFloatingWizard(initialRoomWizard, initialRoomNow);
      initialRoomTryFinalRunWizardFireball(initialRoomWizard, initialRoomNow);
    }

    return true;
  });
}

function initialRoomUpdateFinalRunBoss(initialRoomNow) {
  var initialRoomBossConfig = finalRunConfig.tank.boss;

  if (!initialRoomFinalRunState.bossSpawned && initialRoomGetFinalRunElapsed(initialRoomNow) >= initialRoomBossConfig.spawnTime) {
    initialRoomSpawnFinalRunBoss(initialRoomNow);
  }

  if (!initialRoomFinalRunState.boss) {
    return;
  }

  if (initialRoomDoesFinalRunBossHitTank(initialRoomNow)) {
    initialRoomDamagePlayer(initialRoomBossConfig.damage, "finalRunFace");
    initialRoomUpdateFinalRunHpElement();
  }
}

function initialRoomSpawnFinalRunBoss(initialRoomNow) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomBossConfig = finalRunConfig.tank.boss;
  var initialRoomCurrentRoll = initialRoomFinalRunState.groundRollGroup ? initialRoomFinalRunState.groundRollGroup.rotation.x : 0;
  var initialRoomBossMaterial = null;
  var initialRoomBossSprite = null;

  if (!initialRoomFinalRunState.blobTexture) {
    return;
  }

  initialRoomBossMaterial = new initialRoomThree.SpriteMaterial({
    map: initialRoomGetFinalRunBlobTexture(),
    transparent: true
  });
  initialRoomBossSprite = new initialRoomThree.Sprite(initialRoomBossMaterial);
  initialRoomBossSprite.scale.set(initialRoomBossConfig.scale, initialRoomBossConfig.scale, initialRoomBossConfig.scale);
  initialRoomPositionFinalRunSurfaceObject(
    initialRoomBossSprite,
    initialRoomBossConfig.roadX,
    initialRoomBossConfig.spawnAngle - initialRoomCurrentRoll,
    initialRoomBossConfig.surfaceOffset
  );
  initialRoomFinalRunState.groundRollGroup.add(initialRoomBossSprite);
  initialRoomFinalRunState.boss = {
    sprite: initialRoomBossSprite,
    spawnedAt: initialRoomNow,
    hp: initialRoomBossConfig.hp || 1
  };
  initialRoomFinalRunState.bossSpawned = true;
}

function initialRoomDoesFinalRunBossHitTank(initialRoomNow) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomBossConfig = finalRunConfig.tank.boss;
  var initialRoomWorldPosition = new initialRoomThree.Vector3();
  var initialRoomProjectedPosition = null;

  if (!initialRoomFinalRunState.boss || initialRoomNow - initialRoomFinalRunState.boss.spawnedAt < initialRoomBossConfig.minHitAge) {
    return false;
  }

  initialRoomFinalRunState.boss.sprite.getWorldPosition(initialRoomWorldPosition);
  initialRoomProjectedPosition = initialRoomWorldPosition.clone().project(initialRoomFinalRunState.camera);

  return Math.abs(initialRoomProjectedPosition.x) <= initialRoomBossConfig.hitScreenHalfWidth &&
    initialRoomProjectedPosition.y <= -initialRoomBossConfig.hitScreenY &&
    initialRoomProjectedPosition.z >= -1 &&
    initialRoomProjectedPosition.z <= 1;
}

function initialRoomRemoveFinalRunBoss() {
  if (!initialRoomFinalRunState.boss) {
    return;
  }

  if (initialRoomFinalRunState.boss.sprite.parent) {
    initialRoomFinalRunState.boss.sprite.parent.remove(initialRoomFinalRunState.boss.sprite);
  }

  initialRoomFinalRunState.boss.sprite.material.dispose();
  initialRoomFinalRunState.boss = null;
}

function initialRoomDefeatFinalRunBoss() {
  if (!initialRoomFinalRunState.boss) {
    return;
  }

  initialRoomRemoveFinalRunBoss();
  initialRoomFinalRunState.bossDefeated = true;
  if (typeof archipelagoClientSendGoal === "function") {
    archipelagoClientSendGoal();
  }
  initialRoomStartFinalRunCredits(performance.now());
}

function initialRoomDamageFinalRunBoss() {
  if (!initialRoomFinalRunState.boss) {
    return;
  }

  initialRoomFinalRunState.boss.hp = Math.max(0, (initialRoomFinalRunState.boss.hp || 1) - 1);

  if (initialRoomFinalRunState.boss.hp <= 0) {
    initialRoomDefeatFinalRunBoss();
  }
}

function initialRoomStartFinalRunCredits(initialRoomNow) {
  if (initialRoomFinalRunState.creditsStarted) {
    return;
  }

  initialRoomFinalRunState.creditLines = initialRoomGetFinalRunCreditLines();
  initialRoomFinalRunState.creditSpawnIndex = 0;
  initialRoomFinalRunState.nextCreditSpawnAt = initialRoomNow + finalRunConfig.tank.credits.firstSpawnDelay;
  initialRoomFinalRunState.creditsStarted = true;
}

function initialRoomLoadCreditsSource() {
  if (window.shellipelagoCredits || initialRoomCreditsLoadStarted) {
    return;
  }

  initialRoomCreditsLoadStarted = true;
  fetch("src/credits.md").then(function (initialRoomResponse) {
    if (!initialRoomResponse.ok) {
      return "";
    }

    return initialRoomResponse.text();
  }).then(function (initialRoomCreditsText) {
    if (initialRoomCreditsText) {
      window.shellipelagoCredits = initialRoomCreditsText;
    }
  }).catch(function () {});
}

function initialRoomGetFinalRunCreditLines() {
  var initialRoomCreditsSource = window.shellipelagoCredits || "";

  return initialRoomCreditsSource.split(/\r?\n\s*\r?\n/).map(function (initialRoomCreditBlock) {
    return initialRoomCreditBlock.split(/\r?\n/).map(function (initialRoomLine) {
      return initialRoomLine.trim();
    }).filter(function (initialRoomLine) {
      return Boolean(initialRoomLine);
    }).join("\n");
  }).filter(function (initialRoomCreditBlock) {
    return Boolean(initialRoomCreditBlock);
  });
}

function initialRoomUpdateFinalRunCredits(initialRoomNow) {
  var initialRoomCreditConfig = finalRunConfig.tank.credits;

  if (!initialRoomFinalRunState.creditsStarted) {
    return;
  }

  if (initialRoomFinalRunState.creditSpawnIndex < initialRoomFinalRunState.creditLines.length && initialRoomNow >= initialRoomFinalRunState.nextCreditSpawnAt) {
    initialRoomSpawnFinalRunCredit(initialRoomNow);
    initialRoomFinalRunState.nextCreditSpawnAt = initialRoomNow + initialRoomCreditConfig.spawnDelay;
  }

  initialRoomFinalRunState.credits.forEach(function (initialRoomCredit) {
    if (initialRoomCredit.isFinal && !initialRoomFinalRunState.finalCreditStopStartedAt && initialRoomShouldStopOnFinalRunCredit(initialRoomCredit)) {
      initialRoomFinalRunState.finalCreditStopStartedAt = initialRoomNow;
    }
  });

  initialRoomFinalRunState.credits = initialRoomFinalRunState.credits.filter(function (initialRoomCredit) {
    if (initialRoomFinalRunState.groundRollAmount - initialRoomCredit.spawnRoll < Math.PI * 2) {
      return true;
    }

    initialRoomRemoveFinalRunCredit(initialRoomCredit);
    return false;
  });
}

function initialRoomSpawnFinalRunCredit(initialRoomNow) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomCreditConfig = finalRunConfig.tank.credits;
  var initialRoomLine = initialRoomFinalRunState.creditLines[initialRoomFinalRunState.creditSpawnIndex];
  var initialRoomTexture = initialRoomCreateFinalRunCreditTexture(initialRoomThree, initialRoomLine);
  var initialRoomMaterial = new initialRoomThree.SpriteMaterial({
    map: initialRoomTexture,
    transparent: true
  });
  var initialRoomSprite = new initialRoomThree.Sprite(initialRoomMaterial);
  var initialRoomLanePhase = ((initialRoomFinalRunState.creditSpawnIndex * 0.38196601125) % 1) - 0.5;
  var initialRoomCurrentRoll = initialRoomFinalRunState.groundRollGroup ? initialRoomFinalRunState.groundRollGroup.rotation.x : 0;
  var initialRoomSpawnAngle = initialRoomCreditConfig.spawnAngle - initialRoomCurrentRoll + ((Math.random() - 0.5) * initialRoomCreditConfig.spawnAngleJitter * 2);
  var initialRoomAspect = initialRoomTexture.image.width / initialRoomTexture.image.height;
  var initialRoomIsFinalCredit = initialRoomFinalRunState.creditSpawnIndex === initialRoomFinalRunState.creditLines.length - 1;
  var initialRoomScale = initialRoomCreditConfig.scale * (initialRoomIsFinalCredit ? initialRoomCreditConfig.finalScaleMultiplier : 1);

  initialRoomSprite.scale.set(initialRoomScale * initialRoomAspect, initialRoomScale, initialRoomScale);
  initialRoomPositionFinalRunSurfaceObject(initialRoomSprite, initialRoomLanePhase * initialRoomCreditConfig.roadHalfWidth * 2, initialRoomSpawnAngle, initialRoomCreditConfig.surfaceOffset);
  initialRoomFinalRunState.groundRollGroup.add(initialRoomSprite);
  initialRoomFinalRunState.credits.push({
    sprite: initialRoomSprite,
    spawnedAt: initialRoomNow,
    spawnRoll: initialRoomFinalRunState.groundRollAmount,
    peakY: -Infinity,
    isFinal: initialRoomIsFinalCredit
  });
  initialRoomFinalRunState.creditSpawnIndex += 1;
}

function initialRoomCreateFinalRunCreditTexture(initialRoomThree, initialRoomText) {
  var initialRoomCanvas = document.createElement("canvas");
  var initialRoomContext = initialRoomCanvas.getContext("2d");
  var initialRoomCreditConfig = finalRunConfig.tank.credits;
  var initialRoomPadding = 18;
  var initialRoomLines = initialRoomText.split("\n");
  var initialRoomLineHeight = Math.ceil(initialRoomCreditConfig.fontSize * 1.18);
  var initialRoomMeasuredWidth = 0;
  var initialRoomTexture = null;

  initialRoomContext.font = initialRoomCreditConfig.fontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomMeasuredWidth = initialRoomLines.reduce(function (initialRoomMaxWidth, initialRoomLine) {
    return Math.max(initialRoomMaxWidth, Math.ceil(initialRoomContext.measureText(initialRoomLine).width));
  }, 0);
  initialRoomCanvas.width = Math.max(128, initialRoomMeasuredWidth + (initialRoomPadding * 2));
  initialRoomCanvas.height = (initialRoomLineHeight * initialRoomLines.length) + (initialRoomPadding * 2);
  initialRoomContext.imageSmoothingEnabled = false;
  initialRoomContext.font = initialRoomCreditConfig.fontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textBaseline = "top";
  initialRoomContext.textAlign = "center";
  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomLines.forEach(function (initialRoomLine, initialRoomLineIndex) {
    initialRoomContext.fillText(initialRoomLine, initialRoomCanvas.width / 2, initialRoomPadding + (initialRoomLineIndex * initialRoomLineHeight));
  });
  initialRoomTexture = new initialRoomThree.CanvasTexture(initialRoomCanvas);
  initialRoomTexture.colorSpace = initialRoomThree.SRGBColorSpace;
  initialRoomTexture.magFilter = initialRoomThree.NearestFilter;
  initialRoomTexture.minFilter = initialRoomThree.NearestFilter;
  return initialRoomTexture;
}

function initialRoomShouldStopOnFinalRunCredit(initialRoomCredit) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomWorldPosition = new initialRoomThree.Vector3();
  var initialRoomPeakBuffer = 0.035;
  var initialRoomMinimumRollTravel = Number(finalRunConfig.tank.credits.finalStopMinRollTravel) || 0;

  initialRoomCredit.sprite.getWorldPosition(initialRoomWorldPosition);

  if (initialRoomWorldPosition.y > initialRoomCredit.peakY) {
    initialRoomCredit.peakY = initialRoomWorldPosition.y;
    return false;
  }

  if (initialRoomFinalRunState.groundRollAmount - initialRoomCredit.spawnRoll < initialRoomMinimumRollTravel) {
    return false;
  }

  return initialRoomCredit.peakY > -Infinity && initialRoomWorldPosition.y < initialRoomCredit.peakY - initialRoomPeakBuffer;
}

function initialRoomRemoveFinalRunCredit(initialRoomCredit) {
  if (initialRoomCredit.sprite.parent) {
    initialRoomCredit.sprite.parent.remove(initialRoomCredit.sprite);
  }

  if (initialRoomCredit.sprite.material.map) {
    initialRoomCredit.sprite.material.map.dispose();
  }

  initialRoomCredit.sprite.material.dispose();
}

function initialRoomGetFinalRunWizardSpawnDelay(initialRoomNow) {
  var initialRoomWizardConfig = finalRunConfig.tank.wizards;
  var initialRoomRampProgress = initialRoomGetFinalRunSpawnRampProgress(initialRoomNow);
  var initialRoomMinDelay = initialRoomWizardConfig.minSpawnDelay + ((initialRoomWizardConfig.lateMinSpawnDelay - initialRoomWizardConfig.minSpawnDelay) * initialRoomRampProgress);
  var initialRoomMaxDelay = initialRoomWizardConfig.maxSpawnDelay + ((initialRoomWizardConfig.lateMaxSpawnDelay - initialRoomWizardConfig.maxSpawnDelay) * initialRoomRampProgress);

  return initialRoomMinDelay + (Math.random() * (initialRoomMaxDelay - initialRoomMinDelay));
}

function initialRoomSpawnFinalRunWizard(initialRoomNow) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomWizardConfig = finalRunConfig.tank.wizards;
  var initialRoomWizardMaterial = new initialRoomThree.SpriteMaterial({
    map: initialRoomGetFinalRunWizardTexture(),
    transparent: true
  });
  var initialRoomWizardSprite = new initialRoomThree.Sprite(initialRoomWizardMaterial);
  var initialRoomSide = initialRoomFinalRunState.wizardSpawnIndex % 2 === 0 ? -1 : 1;
  var initialRoomLaneX = initialRoomSide * (initialRoomWizardConfig.roadHalfWidth + initialRoomWizardConfig.sideOffset + (Math.random() * initialRoomWizardConfig.laneJitter));
  var initialRoomAnglePhase = ((initialRoomFinalRunState.wizardSpawnIndex * 0.5176380902) % 1) - 0.5;
  var initialRoomCurrentRoll = initialRoomFinalRunState.groundRollGroup ? initialRoomFinalRunState.groundRollGroup.rotation.x : 0;
  var initialRoomWorldSpawnAngle = initialRoomWizardConfig.spawnAngle + (initialRoomAnglePhase * initialRoomWizardConfig.spawnAngleJitter * 2);
  var initialRoomSpawnAngle = initialRoomWorldSpawnAngle - initialRoomCurrentRoll;

  initialRoomWizardSprite.scale.set(initialRoomWizardConfig.scale, initialRoomWizardConfig.scale, initialRoomWizardConfig.scale);
  initialRoomPositionFinalRunSurfaceObject(initialRoomWizardSprite, initialRoomLaneX, initialRoomSpawnAngle, initialRoomWizardConfig.surfaceOffset);
  initialRoomFinalRunState.groundRollGroup.add(initialRoomWizardSprite);
  initialRoomFinalRunState.wizards.push({
    sprite: initialRoomWizardSprite,
    spawnedAt: initialRoomNow,
    state: "attached",
    basePosition: null,
    floatStartedAt: 0,
    nextFireAt: 0,
    peakY: -Infinity,
    phase: Math.random() * Math.PI * 2
  });
  initialRoomFinalRunState.wizardSpawnIndex += 1;
}

function initialRoomShouldDetachFinalRunWizard(initialRoomWizard, initialRoomNow) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomWizardConfig = finalRunConfig.tank.wizards;
  var initialRoomWorldPosition = new initialRoomThree.Vector3();
  var initialRoomAge = initialRoomNow - initialRoomWizard.spawnedAt;
  var initialRoomPeakBuffer = 0.04;

  initialRoomWizard.sprite.getWorldPosition(initialRoomWorldPosition);

  if (initialRoomWorldPosition.y > initialRoomWizard.peakY) {
    initialRoomWizard.peakY = initialRoomWorldPosition.y;
    return false;
  }

  return initialRoomAge >= initialRoomWizardConfig.minDetachAge &&
    initialRoomWizard.peakY > -Infinity &&
    initialRoomWorldPosition.y < initialRoomWizard.peakY - initialRoomPeakBuffer;
}

function initialRoomDetachFinalRunWizard(initialRoomWizard, initialRoomNow) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomWorldPosition = new initialRoomThree.Vector3();

  initialRoomWizard.sprite.getWorldPosition(initialRoomWorldPosition);
  initialRoomFinalRunState.groundRollGroup.remove(initialRoomWizard.sprite);
  initialRoomWizard.sprite.position.copy(initialRoomWorldPosition);
  initialRoomFinalRunState.scene.add(initialRoomWizard.sprite);
  initialRoomWizard.state = "floating";
  initialRoomWizard.basePosition = initialRoomWorldPosition.clone();
  initialRoomWizard.floatStartedAt = initialRoomNow;
  initialRoomWizard.nextFireAt = initialRoomNow;
}

function initialRoomUpdateFinalRunFloatingWizard(initialRoomWizard, initialRoomNow) {
  var initialRoomWizardConfig = finalRunConfig.tank.wizards;
  var initialRoomElapsed = ((initialRoomNow - initialRoomWizard.floatStartedAt) / 1000) * initialRoomWizardConfig.pendulumSpeed + initialRoomWizard.phase;

  initialRoomWizard.sprite.position.set(
    initialRoomWizard.basePosition.x + (Math.sin(initialRoomElapsed) * initialRoomWizardConfig.pendulumX),
    initialRoomWizard.basePosition.y + (Math.sin(initialRoomElapsed * 0.78 + 1.4) * initialRoomWizardConfig.pendulumY),
    initialRoomWizard.basePosition.z
  );
}

function initialRoomTryFinalRunWizardFireball(initialRoomWizard, initialRoomNow) {
  if (initialRoomNow < initialRoomWizard.nextFireAt) {
    return;
  }

  initialRoomSpawnFinalRunWizardFireball(initialRoomWizard, initialRoomNow);
  initialRoomWizard.nextFireAt = initialRoomNow + finalRunConfig.tank.fireballs.interval;
}

function initialRoomSpawnFinalRunWizardFireball(initialRoomWizard, initialRoomNow) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomFireballConfig = finalRunConfig.tank.fireballs;
  var initialRoomStartPosition = new initialRoomThree.Vector3();
  var initialRoomTargetPosition = initialRoomGetFinalRunTankHitPosition();
  var initialRoomDirection = null;
  var initialRoomFireballMaterial = null;
  var initialRoomFireballSprite = null;

  if (!initialRoomFinalRunState.fireballTexture || !initialRoomTargetPosition) {
    return;
  }

  initialRoomWizard.sprite.getWorldPosition(initialRoomStartPosition);
  initialRoomDirection = initialRoomTargetPosition.clone().sub(initialRoomStartPosition).normalize();
  initialRoomFireballMaterial = new initialRoomThree.SpriteMaterial({
    map: initialRoomFinalRunState.fireballTexture,
    transparent: true
  });
  initialRoomFireballSprite = new initialRoomThree.Sprite(initialRoomFireballMaterial);
  initialRoomFireballSprite.position.copy(initialRoomStartPosition);
  initialRoomFireballSprite.scale.set(initialRoomFireballConfig.scale, initialRoomFireballConfig.scale, initialRoomFireballConfig.scale);
  initialRoomFinalRunState.scene.add(initialRoomFireballSprite);
  initialRoomFinalRunState.fireballs.push({
    sprite: initialRoomFireballSprite,
    velocity: initialRoomDirection.multiplyScalar(initialRoomFireballConfig.speed),
    spawnedAt: initialRoomNow,
    targetPosition: initialRoomTargetPosition
  });
  initialRoomPlaySfx("wizardShot");
}

function initialRoomGetFinalRunTankHitPosition() {
  var initialRoomThree = initialRoomFinalRunState.three;

  if (!initialRoomFinalRunState.camera) {
    return null;
  }

  initialRoomFinalRunState.camera.updateWorldMatrix(true, false);
  return initialRoomFinalRunState.camera.localToWorld(new initialRoomThree.Vector3(0, -1.25, -2.6));
}

function initialRoomUpdateFinalRunFireballs(initialRoomDeltaSeconds, initialRoomNow) {
  var initialRoomFireballConfig = finalRunConfig.tank.fireballs;
  var initialRoomTankHitPosition = initialRoomGetFinalRunTankHitPosition();
  var initialRoomNextFireballs = [];

  initialRoomFinalRunState.fireballs.forEach(function (initialRoomFireball) {
    if (initialRoomNow - initialRoomFireball.spawnedAt > initialRoomFireballConfig.maxLifetime) {
      initialRoomRemoveFinalRunFireball(initialRoomFireball);
      return;
    }

    initialRoomFireball.sprite.position.addScaledVector(initialRoomFireball.velocity, initialRoomDeltaSeconds);

    if (initialRoomTankHitPosition && initialRoomFireball.sprite.position.distanceTo(initialRoomTankHitPosition) <= initialRoomFireballConfig.hitRadius) {
      initialRoomDamagePlayer(initialRoomFireballConfig.damage, "wizardShot");
      initialRoomUpdateFinalRunHpElement();
      initialRoomRemoveFinalRunFireball(initialRoomFireball);
      return;
    }

    initialRoomNextFireballs.push(initialRoomFireball);
  });

  initialRoomFinalRunState.fireballs = initialRoomNextFireballs;
}

function initialRoomRemoveFinalRunFireball(initialRoomFireball) {
  if (initialRoomFireball.sprite.parent) {
    initialRoomFireball.sprite.parent.remove(initialRoomFireball.sprite);
  }

  initialRoomFireball.sprite.material.dispose();
}

function initialRoomSpawnFinalRunBlob(initialRoomNow) {
  initialRoomSpawnFinalRunRoadSprite(initialRoomNow, "blob");
}

function initialRoomSpawnFinalRunSnake(initialRoomNow) {
  initialRoomSpawnFinalRunRoadSprite(initialRoomNow, "snake");
}

function initialRoomSpawnFinalRunRoadSprite(initialRoomNow, initialRoomKind) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomBlobConfig = finalRunConfig.tank.blobs;
  var initialRoomTexture = initialRoomKind === "snake" ? initialRoomGetFinalRunSnakeTexture() : initialRoomGetFinalRunBlobTexture();
  var initialRoomBlobMaterial = new initialRoomThree.SpriteMaterial({
    map: initialRoomTexture,
    transparent: true
  });
  var initialRoomBlobSprite = new initialRoomThree.Sprite(initialRoomBlobMaterial);
  var initialRoomSpawnIndex = initialRoomKind === "snake" ? initialRoomFinalRunState.snakeSpawnIndex : initialRoomFinalRunState.blobSpawnIndex;
  var initialRoomLanePhase = ((initialRoomSpawnIndex * 0.61803398875) % 1) - 0.5;
  var initialRoomAnglePhase = ((initialRoomSpawnIndex * 0.41421356237) % 1) - 0.5;
  var initialRoomCurrentRoll = initialRoomFinalRunState.groundRollGroup ? initialRoomFinalRunState.groundRollGroup.rotation.x : 0;
  var initialRoomLaneX = (initialRoomLanePhase * initialRoomBlobConfig.roadHalfWidth * 2) + ((Math.random() - 0.5) * initialRoomBlobConfig.laneJitter * 2);
  var initialRoomWorldSpawnAngle = initialRoomBlobConfig.spawnAngle + (initialRoomAnglePhase * initialRoomBlobConfig.spawnAngleJitter * 2) + ((Math.random() - 0.5) * initialRoomBlobConfig.spawnAngleJitter * 0.35);
  var initialRoomSpawnAngle = initialRoomWorldSpawnAngle - initialRoomCurrentRoll;
  var initialRoomScale = initialRoomKind === "snake" ? initialRoomBlobConfig.scale * 0.95 : initialRoomBlobConfig.scale;

  initialRoomLaneX = Math.max(-initialRoomBlobConfig.roadHalfWidth, Math.min(initialRoomBlobConfig.roadHalfWidth, initialRoomLaneX));
  initialRoomBlobSprite.scale.set(initialRoomScale, initialRoomScale, initialRoomScale);
  initialRoomPositionFinalRunSurfaceObject(initialRoomBlobSprite, initialRoomLaneX, initialRoomSpawnAngle, 0.65);
  initialRoomFinalRunState.groundRollGroup.add(initialRoomBlobSprite);
  initialRoomFinalRunState.blobs.push({
    sprite: initialRoomBlobSprite,
    kind: initialRoomKind,
    spawnedAt: initialRoomNow
  });
  if (initialRoomKind === "snake") {
    initialRoomFinalRunState.snakeSpawnIndex += 1;
  } else {
    initialRoomFinalRunState.blobSpawnIndex += 1;
  }
}

function initialRoomPositionFinalRunSurfaceObject(initialRoomObject, initialRoomLocalX, initialRoomSurfaceAngle, initialRoomSurfaceOffset) {
  var initialRoomRadius = initialRoomGetFinalRunSphereRadius();
  var initialRoomSurfaceNormal = initialRoomGetFinalRunSurfaceNormal(initialRoomLocalX, initialRoomSurfaceAngle);

  initialRoomObject.position.copy(initialRoomSurfaceNormal.clone().multiplyScalar(initialRoomRadius + initialRoomSurfaceOffset));
}

function initialRoomDoesFinalRunBlobHitTank(initialRoomBlob) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomBlobConfig = finalRunConfig.tank.blobs;
  var initialRoomWorldPosition = new initialRoomThree.Vector3();
  var initialRoomProjectedPosition = null;

  if (performance.now() - initialRoomBlob.spawnedAt < initialRoomBlobConfig.minHitAge) {
    return false;
  }

  initialRoomBlob.sprite.getWorldPosition(initialRoomWorldPosition);
  initialRoomProjectedPosition = initialRoomWorldPosition.clone().project(initialRoomFinalRunState.camera);

  return Math.abs(initialRoomProjectedPosition.x) <= initialRoomBlobConfig.hitScreenHalfWidth &&
    initialRoomProjectedPosition.y <= -initialRoomBlobConfig.hitScreenY &&
    initialRoomProjectedPosition.z >= -1 &&
    initialRoomProjectedPosition.z <= 1;
}

function initialRoomRemoveFinalRunBlob(initialRoomBlob) {
  if (initialRoomBlob.sprite.parent) {
    initialRoomBlob.sprite.parent.remove(initialRoomBlob.sprite);
  }

  initialRoomBlob.sprite.material.dispose();
}

function initialRoomRemoveFinalRunWizard(initialRoomWizard) {
  if (initialRoomWizard.sprite.parent) {
    initialRoomWizard.sprite.parent.remove(initialRoomWizard.sprite);
  }

  initialRoomWizard.sprite.material.dispose();
}

function initialRoomApplyFinalRunShotImpact() {
  if (initialRoomTryFinalRunEnemyShotImpact()) {
    return;
  }

  initialRoomTryFinalRunSurfaceShotImpact();
}

function initialRoomTryFinalRunEnemyShotImpact() {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomImpactConfig = finalRunConfig.tank.impactCloud;
  var initialRoomMouseX = initialRoomFinalRunMouse.x;
  var initialRoomMouseY = initialRoomFinalRunMouse.y;
  var initialRoomBestEnemy = null;
  var initialRoomBestDistance = Infinity;

  initialRoomFinalRunState.blobs.forEach(function (initialRoomBlob) {
    initialRoomFindFinalRunShotEnemyCandidate(initialRoomBlob, "blob", initialRoomImpactConfig.enemyHitRadius);
  });
  initialRoomFinalRunState.wizards.forEach(function (initialRoomWizard) {
    initialRoomFindFinalRunShotEnemyCandidate(initialRoomWizard, "wizard", finalRunConfig.tank.wizards.hitRadius);
  });
  if (initialRoomFinalRunState.boss) {
    initialRoomFindFinalRunShotEnemyCandidate(initialRoomFinalRunState.boss, "boss", finalRunConfig.tank.boss.shotHitRadius);
  }
  initialRoomFinalRunState.credits.forEach(function (initialRoomCredit) {
    if (initialRoomCredit.shot) {
      return;
    }
    initialRoomFindFinalRunShotEnemyCandidate(initialRoomCredit, "credit", finalRunConfig.tank.credits.shotHitRadius);
  });

  function initialRoomFindFinalRunShotEnemyCandidate(initialRoomEnemy, initialRoomEnemyKind, initialRoomHitRadius) {
    var initialRoomWorldPosition = new initialRoomThree.Vector3();
    var initialRoomProjectedPosition = null;
    var initialRoomScreenX = 0;
    var initialRoomScreenY = 0;
    var initialRoomDistance = 0;

    initialRoomEnemy.sprite.getWorldPosition(initialRoomWorldPosition);
    initialRoomProjectedPosition = initialRoomWorldPosition.clone().project(initialRoomFinalRunState.camera);

    if (initialRoomProjectedPosition.z < -1 || initialRoomProjectedPosition.z > 1) {
      return;
    }

    initialRoomScreenX = ((initialRoomProjectedPosition.x + 1) / 2) * window.innerWidth;
    initialRoomScreenY = ((1 - initialRoomProjectedPosition.y) / 2) * window.innerHeight;
    initialRoomDistance = Math.sqrt(
      ((initialRoomScreenX - initialRoomMouseX) * (initialRoomScreenX - initialRoomMouseX)) +
      ((initialRoomScreenY - initialRoomMouseY) * (initialRoomScreenY - initialRoomMouseY))
    );

    if (initialRoomDistance <= initialRoomHitRadius && initialRoomDistance < initialRoomBestDistance) {
      initialRoomBestEnemy = {
        enemy: initialRoomEnemy,
        kind: initialRoomEnemyKind,
        position: initialRoomWorldPosition
      };
      initialRoomBestDistance = initialRoomDistance;
    }
  }

  if (!initialRoomBestEnemy) {
    return false;
  }

  initialRoomSpawnFinalRunImpactCloud(initialRoomBestEnemy.position, true);

  if (initialRoomBestEnemy.kind === "boss") {
    initialRoomDamageFinalRunBoss();
  } else if (initialRoomBestEnemy.kind === "credit") {
    initialRoomMarkFinalRunCreditShot(initialRoomBestEnemy.enemy);
  } else if (initialRoomBestEnemy.kind === "wizard") {
    initialRoomRemoveFinalRunWizard(initialRoomBestEnemy.enemy);
    initialRoomFinalRunState.wizards = initialRoomFinalRunState.wizards.filter(function (initialRoomWizard) {
      return initialRoomWizard !== initialRoomBestEnemy.enemy;
    });
  } else {
    initialRoomRemoveFinalRunBlob(initialRoomBestEnemy.enemy);
    initialRoomFinalRunState.blobs = initialRoomFinalRunState.blobs.filter(function (initialRoomBlob) {
      return initialRoomBlob !== initialRoomBestEnemy.enemy;
    });
  }

  return true;
}

function initialRoomMarkFinalRunCreditShot(initialRoomCredit) {
  if (!initialRoomCredit || initialRoomCredit.shot) {
    return;
  }

  initialRoomCredit.shot = true;
  if (initialRoomCredit.sprite && initialRoomCredit.sprite.material) {
    initialRoomCredit.sprite.material.color.set("#555555");
  }
}

function initialRoomTryFinalRunSurfaceShotImpact() {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomRaycaster = new initialRoomThree.Raycaster();
  var initialRoomPointer = new initialRoomThree.Vector2(
    (initialRoomFinalRunMouse.x / Math.max(1, window.innerWidth)) * 2 - 1,
    -((initialRoomFinalRunMouse.y / Math.max(1, window.innerHeight)) * 2 - 1)
  );
  var initialRoomImpactObjects = [];
  var initialRoomHits = null;

  if (initialRoomFinalRunState.groundSphere) {
    initialRoomImpactObjects.push(initialRoomFinalRunState.groundSphere);
  }

  initialRoomFinalRunState.rocks.forEach(function (initialRoomRockState) {
    initialRoomImpactObjects.push(initialRoomRockState.mesh);
  });

  if (initialRoomImpactObjects.length === 0) {
    return false;
  }

  initialRoomFinalRunState.scene.updateMatrixWorld(true);
  initialRoomRaycaster.setFromCamera(initialRoomPointer, initialRoomFinalRunState.camera);
  initialRoomHits = initialRoomRaycaster.intersectObjects(initialRoomImpactObjects, false);

  if (!initialRoomHits.length) {
    return false;
  }

  initialRoomSpawnFinalRunImpactCloud(initialRoomHits[0].point, false);
  return true;
}

function initialRoomSpawnFinalRunImpactCloud(initialRoomPosition, initialRoomIsEnemyHit) {
  var initialRoomImpactConfig = finalRunConfig.tank.impactCloud;
  var initialRoomColors = initialRoomImpactConfig.dustColors.slice();

  if (initialRoomIsEnemyHit) {
    initialRoomColors = initialRoomColors.concat(initialRoomImpactConfig.bloodColors);
  }

  initialRoomSpawnFinalRunParticleCloud(initialRoomPosition, {
    particleCount: initialRoomImpactConfig.particleCount + (initialRoomIsEnemyHit ? 8 : 0),
    duration: initialRoomImpactConfig.duration,
    spread: initialRoomImpactConfig.spread,
    speed: initialRoomImpactConfig.speed,
    colors: initialRoomGetFinalRunParticleColors(initialRoomColors),
    lift: 0.04,
    startScale: 0.7,
    scaleJitter: 0.9
  });
}

function initialRoomFireFinalRunNozzle() {
  var initialRoomTankConfig = finalRunConfig.tank;

  if (!initialRoomFinalRunState.tankNozzleRecoilGroup) {
    return;
  }

  initialRoomPlaySfx("tank");
  initialRoomFinalRunState.nozzleRecoilStartedAt = performance.now();
  initialRoomFinalRunState.tankNozzleRecoilGroup.position.z = initialRoomTankConfig.nozzle.recoilZ;
  initialRoomSpawnFinalRunMuzzleCloud();
  initialRoomApplyFinalRunShotImpact();
}

function initialRoomUpdateFinalRunNozzleRecoil(initialRoomNow) {
  var initialRoomTankConfig = finalRunConfig.tank;
  var initialRoomElapsed = initialRoomNow - initialRoomFinalRunState.nozzleRecoilStartedAt;
  var initialRoomProgress = 0;

  if (!initialRoomFinalRunState.tankNozzleRecoilGroup || !initialRoomFinalRunState.nozzleRecoilStartedAt) {
    return;
  }

  initialRoomProgress = Math.min(1, initialRoomElapsed / initialRoomTankConfig.nozzle.recoilDuration);
  initialRoomFinalRunState.tankNozzleRecoilGroup.position.z = initialRoomTankConfig.nozzle.recoilZ * (1 - initialRoomProgress);

  if (initialRoomProgress >= 1) {
    initialRoomFinalRunState.tankNozzleRecoilGroup.position.z = 0;
    initialRoomFinalRunState.nozzleRecoilStartedAt = 0;
  }
}

function initialRoomSpawnFinalRunMuzzleCloud() {
  var initialRoomTankConfig = finalRunConfig.tank;
  var initialRoomCloudConfig = initialRoomTankConfig.muzzleCloud;
  var initialRoomMuzzlePosition = initialRoomGetFinalRunMuzzleWorldPosition();

  initialRoomSpawnFinalRunParticleCloud(initialRoomMuzzlePosition, {
    particleCount: initialRoomCloudConfig.particleCount,
    duration: initialRoomCloudConfig.duration,
    spread: initialRoomCloudConfig.spread,
    speed: initialRoomCloudConfig.speed,
    colors: initialRoomGetFinalRunParticleColors(initialRoomCloudConfig.colors),
    lift: 0.12,
    startScale: 0.55,
    scaleJitter: 0.8
  });
}

function initialRoomSpawnFinalRunParticleCloud(initialRoomPosition, initialRoomCloudConfig) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomParticleIndex = 0;

  if (!initialRoomPosition || !initialRoomFinalRunState.muzzleParticleGeometry) {
    return;
  }

  while (initialRoomParticleIndex < initialRoomCloudConfig.particleCount) {
    var initialRoomParticleColor = initialRoomCloudConfig.colors[initialRoomParticleIndex % initialRoomCloudConfig.colors.length];
    var initialRoomParticleMaterial = new initialRoomThree.MeshBasicMaterial({
      color: initialRoomParticleColor,
      transparent: true,
      opacity: 1
    });
    var initialRoomParticle = new initialRoomThree.Mesh(initialRoomFinalRunState.muzzleParticleGeometry, initialRoomParticleMaterial);
    var initialRoomVelocity = new initialRoomThree.Vector3(
      (Math.random() - 0.5) * initialRoomCloudConfig.spread,
      (Math.random() - 0.2) * initialRoomCloudConfig.spread,
      (Math.random() - 0.5) * initialRoomCloudConfig.spread
    ).normalize().multiplyScalar(initialRoomCloudConfig.speed * (0.35 + Math.random()));

    initialRoomParticle.position.copy(initialRoomPosition);
    initialRoomParticle.scale.setScalar((initialRoomCloudConfig.startScale || 0.55) + (Math.random() * (initialRoomCloudConfig.scaleJitter || 0.8)));
    initialRoomFinalRunState.scene.add(initialRoomParticle);
    initialRoomFinalRunState.muzzleParticles.push({
      mesh: initialRoomParticle,
      velocity: initialRoomVelocity,
      startedAt: performance.now(),
      duration: initialRoomCloudConfig.duration,
      lift: initialRoomCloudConfig.lift || 0
    });
    initialRoomParticleIndex += 1;
  }
}

function initialRoomGetFinalRunMuzzleWorldPosition() {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomTankConfig = finalRunConfig.tank;
  var initialRoomRecoilGroup = initialRoomFinalRunState.tankNozzleRecoilGroup;

  if (!initialRoomRecoilGroup) {
    return null;
  }

  initialRoomRecoilGroup.updateWorldMatrix(true, false);
  return initialRoomRecoilGroup.localToWorld(new initialRoomThree.Vector3(0, 0, -initialRoomTankConfig.nozzle.length));
}

function initialRoomUpdateFinalRunMuzzleParticles(initialRoomDeltaSeconds, initialRoomNow) {
  var initialRoomNextParticles = [];

  initialRoomFinalRunState.muzzleParticles.forEach(function (initialRoomParticle) {
    var initialRoomProgress = (initialRoomNow - initialRoomParticle.startedAt) / initialRoomParticle.duration;

    if (initialRoomProgress >= 1) {
      initialRoomFinalRunState.scene.remove(initialRoomParticle.mesh);
      initialRoomParticle.mesh.material.dispose();
      return;
    }

    initialRoomParticle.mesh.position.addScaledVector(initialRoomParticle.velocity, initialRoomDeltaSeconds);
    initialRoomParticle.mesh.position.y += initialRoomDeltaSeconds * initialRoomParticle.lift;
    initialRoomParticle.mesh.material.opacity = Math.max(0.35, 1 - (initialRoomProgress * 0.65));
    initialRoomParticle.mesh.scale.multiplyScalar(1 + (initialRoomDeltaSeconds * 1.1));
    initialRoomNextParticles.push(initialRoomParticle);
  });

  initialRoomFinalRunState.muzzleParticles = initialRoomNextParticles;
}

function initialRoomUpdateFinalRunCrosshairPosition() {
  var initialRoomCrosshair = initialRoomFinalRunState.crosshair;
  var initialRoomCrosshairConfig = finalRunConfig.tank.crosshair;

  if (!initialRoomCrosshair) {
    return;
  }

  initialRoomCrosshair.position.set(
    ((initialRoomFinalRunMouse.x / Math.max(1, window.innerWidth)) - 0.5) * 5.6,
    (0.5 - (initialRoomFinalRunMouse.y / Math.max(1, window.innerHeight))) * 3.2,
    initialRoomCrosshairConfig.z
  );
}

function initialRoomUpdateFinalRunScreenCrosshair() {
  if (!initialRoomFinalRunState.crosshairElement) {
    return;
  }

  initialRoomFinalRunState.crosshairElement.style.display = initialRoomFinalRunState.active ? "block" : "none";
  initialRoomFinalRunState.crosshairElement.style.left = initialRoomFinalRunMouse.x + "px";
  initialRoomFinalRunState.crosshairElement.style.top = initialRoomFinalRunMouse.y + "px";
}

function initialRoomBuildFinalRunEnvironment() {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomGroundGeometry = new initialRoomThree.SphereGeometry(24, 48, 24);
  var initialRoomRockGeometry = new initialRoomThree.DodecahedronGeometry(0.55, 0);
  var initialRoomRockIndex = 0;
  var initialRoomRandomRockIndex = 0;
  var initialRoomPoleRockIndex = 0;
  var initialRoomSunGeometry = new initialRoomThree.IcosahedronGeometry(0.32, 0);

  initialRoomFinalRunState.graphicsLevel = initialRoomGraphicsLevel;
  initialRoomUpdateFinalRunMaterials();
  initialRoomFinalRunState.scene.background = new initialRoomThree.Color(initialRoomGetFinalRunSkyColor());

  initialRoomFinalRunState.groundRollGroup = new initialRoomThree.Object3D();
  initialRoomFinalRunState.groundRollAmount = 0;
  initialRoomFinalRunState.groundRollGroup.position.set(0, -25.5, -10);
  initialRoomFinalRunState.scene.add(initialRoomFinalRunState.groundRollGroup);

  initialRoomFinalRunState.groundSphere = new initialRoomThree.Mesh(initialRoomGroundGeometry, initialRoomFinalRunState.materials.ground);
  initialRoomFinalRunState.groundSphere.rotation.z = Math.PI / 2;
  initialRoomFinalRunState.groundRollGroup.add(initialRoomFinalRunState.groundSphere);

  initialRoomFinalRunState.sunMarker = new initialRoomThree.Mesh(initialRoomSunGeometry, initialRoomFinalRunState.materials.sunMarker);
  initialRoomFinalRunState.sunMarker.position.set(6, 5.5, -10);
  initialRoomFinalRunState.sunMarker.visible = initialRoomGraphicsLevel > 0;
  initialRoomFinalRunState.scene.add(initialRoomFinalRunState.sunMarker);

  initialRoomFinalRunState.rocks = [];
  while (initialRoomRockIndex < 72) {
    initialRoomCreateFinalRunRoadRock(initialRoomRockGeometry, initialRoomRockIndex);
    initialRoomRockIndex += 1;
  }

  while (initialRoomRandomRockIndex < 72) {
    initialRoomCreateFinalRunRandomRock(initialRoomRockGeometry, initialRoomRandomRockIndex);
    initialRoomRandomRockIndex += 1;
  }

  while (initialRoomPoleRockIndex < 96) {
    initialRoomCreateFinalRunPoleRock(initialRoomRockGeometry, initialRoomPoleRockIndex);
    initialRoomPoleRockIndex += 1;
  }
}

function initialRoomCreateFinalRunRoadRock(initialRoomRockGeometry, initialRoomRockIndex) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomSide = initialRoomRockIndex % 2 === 0 ? -1 : 1;
  var initialRoomPathIndex = Math.floor(initialRoomRockIndex / 2);
  var initialRoomRoadRockCount = 36;
  var initialRoomSurfaceAngle = ((initialRoomPathIndex / initialRoomRoadRockCount) * Math.PI * 2) - Math.PI;
  var initialRoomRock = new initialRoomThree.Mesh(initialRoomRockGeometry, initialRoomFinalRunState.materials.rock);
  var initialRoomRockState = {
    mesh: initialRoomRock,
    side: initialRoomSide,
    surfaceAngle: initialRoomSurfaceAngle,
    baseX: 4.5,
    offset: (initialRoomRockIndex % 3) * 0.18
  };

  initialRoomRock.scale.setScalar(0.85 + ((initialRoomRockIndex % 4) * 0.12));
  initialRoomFinalRunState.groundRollGroup.add(initialRoomRock);
  initialRoomFinalRunState.rocks.push(initialRoomRockState);
  initialRoomPositionFinalRunRock(initialRoomRockState);
}

function initialRoomCreateFinalRunRandomRock(initialRoomRockGeometry, initialRoomRockIndex) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomSide = initialRoomRockIndex % 2 === 0 ? -1 : 1;
  var initialRoomRandomRockCount = 36;
  var initialRoomSurfaceAngle = ((Math.floor(initialRoomRockIndex / 2) / initialRoomRandomRockCount) * Math.PI * 2) - Math.PI + ((initialRoomRockIndex % 5) * 0.021);
  var initialRoomRock = new initialRoomThree.Mesh(initialRoomRockGeometry, initialRoomFinalRunState.materials.rock);
  var initialRoomRockState = {
    mesh: initialRoomRock,
    side: initialRoomSide,
    surfaceAngle: initialRoomSurfaceAngle,
    baseX: 6.8,
    offset: (initialRoomRockIndex * 0.71) % 4.2
  };

  initialRoomRock.scale.setScalar(0.55 + ((initialRoomRockIndex % 5) * 0.11));
  initialRoomFinalRunState.groundRollGroup.add(initialRoomRock);
  initialRoomFinalRunState.rocks.push(initialRoomRockState);
  initialRoomPositionFinalRunRock(initialRoomRockState);
}

function initialRoomCreateFinalRunPoleRock(initialRoomRockGeometry, initialRoomRockIndex) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomSide = initialRoomRockIndex % 2 === 0 ? -1 : 1;
  var initialRoomPoleRockCount = 48;
  var initialRoomSurfaceAngle = ((Math.floor(initialRoomRockIndex / 2) / initialRoomPoleRockCount) * Math.PI * 2) - Math.PI + ((initialRoomRockIndex % 7) * 0.017);
  var initialRoomRock = new initialRoomThree.Mesh(initialRoomRockGeometry, initialRoomFinalRunState.materials.rock);
  var initialRoomRockState = {
    mesh: initialRoomRock,
    side: initialRoomSide,
    surfaceAngle: initialRoomSurfaceAngle,
    baseX: 13.4,
    offset: (initialRoomRockIndex * 0.83) % 6.2
  };

  initialRoomRock.scale.setScalar(0.45 + ((initialRoomRockIndex % 6) * 0.08));
  initialRoomFinalRunState.groundRollGroup.add(initialRoomRock);
  initialRoomFinalRunState.rocks.push(initialRoomRockState);
  initialRoomPositionFinalRunRock(initialRoomRockState);
}

function initialRoomPositionFinalRunRock(initialRoomRockState) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomRadius = initialRoomGetFinalRunSphereRadius();
  var initialRoomLocalX = (initialRoomRockState.baseX + initialRoomRockState.offset) * initialRoomRockState.side;
  var initialRoomSurfaceNormal = initialRoomGetFinalRunSurfaceNormal(initialRoomLocalX, initialRoomRockState.surfaceAngle);

  initialRoomRockState.mesh.position.copy(initialRoomSurfaceNormal.clone().multiplyScalar(initialRoomRadius + 0.38));
  initialRoomRockState.mesh.quaternion.setFromUnitVectors(new initialRoomThree.Vector3(0, 1, 0), initialRoomSurfaceNormal);
  initialRoomRockState.mesh.rotateY(initialRoomRockState.side * 0.28);
}

function initialRoomGetFinalRunSphereRadius() {
  return 24;
}

function initialRoomGetFinalRunSurfaceNormal(initialRoomLocalX, initialRoomSurfaceAngle) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomRadius = initialRoomGetFinalRunSphereRadius();
  var initialRoomSurfaceRadius = Math.sqrt(Math.max(0, (initialRoomRadius * initialRoomRadius) - (initialRoomLocalX * initialRoomLocalX)));
  var initialRoomLocalY = Math.cos(initialRoomSurfaceAngle) * initialRoomSurfaceRadius;
  var initialRoomLocalZ = Math.sin(initialRoomSurfaceAngle) * initialRoomSurfaceRadius;

  return new initialRoomThree.Vector3(initialRoomLocalX, initialRoomLocalY, initialRoomLocalZ).normalize();
}

function initialRoomUpdateFinalRunMaterials() {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomUseTextures = initialRoomGraphicsLevel > 0;
  var initialRoomGroundTexture = initialRoomUseTextures ? initialRoomCreateFinalRunGroundTexture(initialRoomThree, initialRoomGraphicsLevel) : null;
  var initialRoomRockTexture = initialRoomUseTextures ? initialRoomCreateFinalRunRockTexture(initialRoomThree, initialRoomGraphicsLevel) : null;

  initialRoomDisposeFinalRunMaterials();
  initialRoomFinalRunState.materials = {
    ground: new initialRoomThree.MeshLambertMaterial({
      color: initialRoomUseTextures ? 0xffffff : 0x777777,
      map: initialRoomGroundTexture
    }),
    rock: new initialRoomThree.MeshLambertMaterial({
      color: initialRoomUseTextures ? 0xffffff : 0x8a8a8a,
      map: initialRoomRockTexture
    }),
    sunMarker: new initialRoomThree.MeshBasicMaterial({
      color: initialRoomGraphicsLevel >= 2 ? 0xf7f7f1 : 0xd8d8d8
    })
  };
}

function initialRoomDisposeFinalRunMaterials() {
  Object.keys(initialRoomFinalRunState.materials || {}).forEach(function (initialRoomMaterialKey) {
    var initialRoomMaterial = initialRoomFinalRunState.materials[initialRoomMaterialKey];

    if (initialRoomMaterial.map) {
      initialRoomMaterial.map.dispose();
    }

    initialRoomMaterial.dispose();
  });
}

function initialRoomCreateFinalRunGroundTexture(initialRoomThree, initialRoomGraphicsLevel) {
  var initialRoomCanvas = document.createElement("canvas");
  var initialRoomContext = initialRoomCanvas.getContext("2d");
  var initialRoomTexture = null;
  var initialRoomDotIndex = 0;
  var initialRoomBaseColor = initialRoomGraphicsLevel >= 2 ? "#f1f7aa" : "#b8b8b8";
  var initialRoomDotColor = initialRoomGraphicsLevel >= 2 ? "#ffc488" : "#8f8f8f";

  initialRoomCanvas.width = 64;
  initialRoomCanvas.height = 64;
  initialRoomContext.imageSmoothingEnabled = false;
  initialRoomContext.fillStyle = initialRoomBaseColor;
  initialRoomContext.fillRect(0, 0, initialRoomCanvas.width, initialRoomCanvas.height);

  while (initialRoomDotIndex < 28) {
    initialRoomContext.fillStyle = initialRoomDotColor;
    initialRoomContext.fillRect((initialRoomDotIndex * 19) % 64, (initialRoomDotIndex * 31) % 64, 2, 2);
    initialRoomDotIndex += 1;
  }

  initialRoomTexture = new initialRoomThree.CanvasTexture(initialRoomCanvas);
  initialRoomTexture.colorSpace = initialRoomThree.SRGBColorSpace;
  initialRoomTexture.wrapS = initialRoomThree.RepeatWrapping;
  initialRoomTexture.wrapT = initialRoomThree.RepeatWrapping;
  initialRoomTexture.repeat.set(8, 4);
  initialRoomTexture.magFilter = initialRoomThree.NearestFilter;
  initialRoomTexture.minFilter = initialRoomThree.NearestFilter;
  return initialRoomTexture;
}

function initialRoomCreateFinalRunRockTexture(initialRoomThree, initialRoomGraphicsLevel) {
  var initialRoomCanvas = document.createElement("canvas");
  var initialRoomContext = initialRoomCanvas.getContext("2d");
  var initialRoomTexture = null;
  var initialRoomPalette = initialRoomGraphicsLevel >= 2 ? ["#2b2638", "#5d557b", "#9a91c8", "#e8edff", "#050505"] : ["#161616", "#555555", "#999999", "#eeeeee", "#050505"];

  initialRoomCanvas.width = 16;
  initialRoomCanvas.height = 16;
  initialRoomContext.imageSmoothingEnabled = false;
  initialRoomContext.fillStyle = initialRoomPalette[1];
  initialRoomContext.fillRect(0, 0, 16, 16);
  initialRoomContext.fillStyle = initialRoomPalette[2];
  initialRoomContext.fillRect(3, 1, 8, 5);
  initialRoomContext.fillStyle = initialRoomPalette[0];
  initialRoomContext.fillRect(9, 7, 6, 7);
  initialRoomContext.fillStyle = initialRoomPalette[3];
  initialRoomContext.fillRect(1, 5, 4, 4);
  initialRoomContext.fillStyle = initialRoomPalette[4];
  initialRoomContext.fillRect(0, 12, 16, 4);
  initialRoomContext.fillRect(12, 4, 4, 12);

  initialRoomTexture = new initialRoomThree.CanvasTexture(initialRoomCanvas);
  initialRoomTexture.colorSpace = initialRoomThree.SRGBColorSpace;
  initialRoomTexture.magFilter = initialRoomThree.NearestFilter;
  initialRoomTexture.minFilter = initialRoomThree.NearestFilter;
  return initialRoomTexture;
}

function initialRoomGetFinalRunSkyColor() {
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomDayColor = initialRoomGraphicsLevel >= 2 ? "#13a4d8" : "#8e949c";
  var initialRoomNightColor = "#000000";
  var initialRoomProgress = initialRoomGetFinalRunSkyTransitionProgress(performance.now());

  if (initialRoomProgress <= 0) {
    return initialRoomDayColor;
  }

  return initialRoomMixHexColors(initialRoomDayColor, initialRoomNightColor, initialRoomProgress);
}

function initialRoomGetFinalRunSkyTransitionProgress(initialRoomNow) {
  var initialRoomSkyConfig = finalRunConfig.tank.skyTransition;
  var initialRoomElapsed = initialRoomGetFinalRunElapsed(initialRoomNow);

  return Math.max(0, Math.min(1, (initialRoomElapsed - initialRoomSkyConfig.start) / Math.max(1, initialRoomSkyConfig.end - initialRoomSkyConfig.start)));
}

function initialRoomMixHexColors(initialRoomStartHex, initialRoomEndHex, initialRoomProgress) {
  var initialRoomStart = initialRoomHexToRgb(initialRoomStartHex);
  var initialRoomEnd = initialRoomHexToRgb(initialRoomEndHex);

  return initialRoomRgbToHex(
    Math.round(initialRoomStart.r + ((initialRoomEnd.r - initialRoomStart.r) * initialRoomProgress)),
    Math.round(initialRoomStart.g + ((initialRoomEnd.g - initialRoomStart.g) * initialRoomProgress)),
    Math.round(initialRoomStart.b + ((initialRoomEnd.b - initialRoomStart.b) * initialRoomProgress))
  );
}

function initialRoomHexToRgb(initialRoomHex) {
  var initialRoomCleanHex = initialRoomHex.replace("#", "");

  return {
    r: parseInt(initialRoomCleanHex.slice(0, 2), 16),
    g: parseInt(initialRoomCleanHex.slice(2, 4), 16),
    b: parseInt(initialRoomCleanHex.slice(4, 6), 16)
  };
}

function initialRoomRefreshFinalRunGraphicsMode() {
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();

  if (!initialRoomFinalRunState.initialized || initialRoomGraphicsLevel === initialRoomFinalRunState.graphicsLevel) {
    return;
  }

  initialRoomFinalRunState.graphicsLevel = initialRoomGraphicsLevel;
  initialRoomUpdateFinalRunMaterials();
  initialRoomFinalRunState.scene.background = new initialRoomFinalRunState.three.Color(initialRoomGetFinalRunSkyColor());
  initialRoomFinalRunState.groundSphere.material = initialRoomFinalRunState.materials.ground;
  initialRoomFinalRunState.sunMarker.material = initialRoomFinalRunState.materials.sunMarker;
  initialRoomFinalRunState.sunMarker.visible = initialRoomGraphicsLevel > 0;
  initialRoomUpdateFinalRunTankColors();
  initialRoomUpdateFinalRunCrosshairColor();
  initialRoomUpdateFinalRunEnemyTextureModes();
  initialRoomFinalRunState.rocks.forEach(function (initialRoomRockState) {
    initialRoomRockState.mesh.material = initialRoomFinalRunState.materials.rock;
  });
}

function initialRoomResizeFinalRunRenderer() {
  if (!initialRoomFinalRunState.renderer || !initialRoomFinalRunState.camera) {
    return;
  }

  initialRoomFinalRunState.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  initialRoomFinalRunState.renderer.setSize(window.innerWidth, window.innerHeight, false);
  initialRoomFinalRunState.camera.aspect = window.innerWidth / window.innerHeight;
  initialRoomFinalRunState.camera.updateProjectionMatrix();
}

function initialRoomStartFinalRunLoop() {
  if (!initialRoomFinalRunState.active || !initialRoomFinalRunState.initialized || initialRoomFinalRunState.frameId) {
    return;
  }

  initialRoomFinalRunState.lastFrameTime = performance.now();
  initialRoomFinalRunState.frameId = window.requestAnimationFrame(initialRoomRenderFinalRun);
}

function initialRoomRenderFinalRun(initialRoomNow) {
  var initialRoomDeltaSeconds = Math.min(0.05, (initialRoomNow - initialRoomFinalRunState.lastFrameTime) / 1000);
  var initialRoomWallNow = Date.now();

  if (!initialRoomFinalRunState.active) {
    initialRoomFinalRunState.frameId = 0;
    return;
  }

  initialRoomUpdateMessageFeed();

  if (initialRoomIsGameOver && initialRoomWallNow >= initialRoomRoomReloadAt) {
    initialRoomReloadAfterGameOver();
    return;
  }

  initialRoomFinalRunState.lastFrameTime = initialRoomNow;
  initialRoomRefreshFinalRunGraphicsMode();

  if (initialRoomFinalRunState.world) {
    initialRoomFinalRunState.world.timestep = initialRoomDeltaSeconds;
    initialRoomFinalRunState.world.step();
  }

  if (initialRoomFinalRunState.groundRollGroup) {
    var initialRoomRollStep = initialRoomDeltaSeconds * initialRoomGetFinalRunSphereRollSpeed(initialRoomNow);

    initialRoomFinalRunState.groundRollGroup.rotation.x += initialRoomRollStep;
    initialRoomFinalRunState.groundRollAmount += Math.abs(initialRoomRollStep);
  }

  initialRoomUpdateFinalRunTankAim();
  initialRoomUpdateFinalRunSky(initialRoomNow);
  initialRoomUpdateFinalRunBlobs(initialRoomNow);
  initialRoomUpdateFinalRunWizards(initialRoomNow);
  initialRoomUpdateFinalRunBoss(initialRoomNow);
  initialRoomUpdateFinalRunCredits(initialRoomNow);
  initialRoomUpdateFinalRunHpElement();
  initialRoomUpdateFinalRunNozzleRecoil(initialRoomNow);
  initialRoomUpdateFinalRunMuzzleParticles(initialRoomDeltaSeconds, initialRoomNow);
  initialRoomUpdateFinalRunFireballs(initialRoomDeltaSeconds, initialRoomNow);
  initialRoomFinalRunState.renderer.render(initialRoomFinalRunState.scene, initialRoomFinalRunState.camera);
  initialRoomDrawMessageFeed();
  initialRoomDrawFinalRunMessageLogOverlay();
  initialRoomFinalRunState.frameId = window.requestAnimationFrame(initialRoomRenderFinalRun);
}

function initialRoomUpdateFinalRunSky(initialRoomNow) {
  var initialRoomThree = initialRoomFinalRunState.three;
  var initialRoomSkyConfig = finalRunConfig.tank.skyTransition;
  var initialRoomProgress = initialRoomGetFinalRunSkyTransitionProgress(initialRoomNow);
  var initialRoomSunX = initialRoomSkyConfig.sunStart.x + ((initialRoomSkyConfig.sunEnd.x - initialRoomSkyConfig.sunStart.x) * initialRoomProgress);
  var initialRoomSunY = initialRoomSkyConfig.sunStart.y + ((initialRoomSkyConfig.sunEnd.y - initialRoomSkyConfig.sunStart.y) * initialRoomProgress);
  var initialRoomSunZ = initialRoomSkyConfig.sunStart.z + ((initialRoomSkyConfig.sunEnd.z - initialRoomSkyConfig.sunStart.z) * initialRoomProgress);

  initialRoomFinalRunState.scene.background = new initialRoomThree.Color(initialRoomGetFinalRunSkyColor());

  if (initialRoomFinalRunState.sunMarker) {
    initialRoomFinalRunState.sunMarker.position.set(initialRoomSunX, initialRoomSunY, initialRoomSunZ);
    initialRoomFinalRunState.sunMarker.visible = initialRoomGetGraphicsLevel() > 0 && initialRoomProgress < 1;
  }
}

function initialRoomGetFinalRunSphereRollSpeed(initialRoomNow) {
  var initialRoomRollConfig = finalRunConfig.tank.sphereRoll;
  var initialRoomElapsed = initialRoomGetFinalRunElapsed(initialRoomNow);
  var initialRoomRampProgress = Math.max(0, Math.min(1, (initialRoomElapsed - initialRoomRollConfig.rampStart) / Math.max(1, initialRoomRollConfig.rampEnd - initialRoomRollConfig.rampStart)));
  var initialRoomMultiplier = 1 + ((initialRoomRollConfig.maxMultiplier - 1) * initialRoomRampProgress);
  var initialRoomCreditStopProgress = initialRoomGetFinalRunCreditStopProgress(initialRoomNow);

  if (initialRoomFinalRunState.bossDefeated) {
    initialRoomMultiplier = finalRunConfig.tank.credits.rollMultiplier;
  }

  return initialRoomRollConfig.speed * initialRoomMultiplier * (1 - initialRoomCreditStopProgress);
}

function initialRoomGetFinalRunCreditStopProgress(initialRoomNow) {
  if (!initialRoomFinalRunState.finalCreditStopStartedAt) {
    return 0;
  }

  return Math.max(0, Math.min(1, (initialRoomNow - initialRoomFinalRunState.finalCreditStopStartedAt) / finalRunConfig.tank.credits.stopDuration));
}

function initialRoomClampCameraAxis(initialRoomTarget, initialRoomVisibleTiles, initialRoomRoomTiles) {
  var initialRoomHalfVisibleTiles = initialRoomVisibleTiles / 2;
  var initialRoomMinimumCamera = initialRoomHalfVisibleTiles;
  var initialRoomMaximumCamera = initialRoomRoomTiles - initialRoomHalfVisibleTiles;

  if (initialRoomVisibleTiles >= initialRoomRoomTiles) {
    return initialRoomRoomTiles / 2;
  }

  return Math.max(initialRoomMinimumCamera, Math.min(initialRoomTarget, initialRoomMaximumCamera));
}

function initialRoomGetTile(initialRoomTileX, initialRoomTileY) {
  return mapManagerGetEffectiveTile(initialRoomCurrentRoom, initialRoomTileX, initialRoomTileY);
}

function initialRoomTileToScreen(initialRoomTileX, initialRoomTileY) {
  return {
    x: initialRoomView.offsetX + (initialRoomTileX * initialRoomView.tileSize),
    y: initialRoomView.offsetY + (initialRoomTileY * initialRoomView.tileSize)
  };
}

function initialRoomWorldToScreen(initialRoomWorldX, initialRoomWorldY) {
  return {
    x: initialRoomView.offsetX + (initialRoomWorldX * initialRoomView.tileSize),
    y: initialRoomView.offsetY + (initialRoomWorldY * initialRoomView.tileSize)
  };
}

function initialRoomGetGraphicsLevel() {
  return globalsState.progression.graphicsLevel || 0;
}

function initialRoomGetTileRenderCacheKey(initialRoomTile) {
  if (!initialRoomTile || !initialRoomTile.sprite) {
    return "";
  }

  return [
    Math.round(initialRoomView.tileSize),
    initialRoomGetGraphicsLevel(),
    initialRoomGetTileVisualKey(initialRoomTile)
  ].join("|");
}

function initialRoomGetTileVisualKey(initialRoomTile) {
  var initialRoomBackgroundKey = initialRoomTile.backgroundTile ? initialRoomGetTileVisualKey(initialRoomTile.backgroundTile) : "";
  var initialRoomSprite = initialRoomGetRenderableTileSprite(initialRoomTile);
  var initialRoomItemName = initialRoomSprite.name || "";
  var initialRoomColorReplacementKey = initialRoomGetColorReplacementKey(initialRoomTile);

  if (initialRoomTile.type === "check" && initialRoomIsCheckTileCollected(initialRoomTile) && initialRoomSprite.source === "item" && initialRoomItemName === "chest") {
    initialRoomItemName = "chest_open";
  }

  return [
    initialRoomBackgroundKey,
    initialRoomSprite.source,
    initialRoomItemName,
    initialRoomSprite.x || 0,
    initialRoomSprite.y || 0,
    initialRoomColorReplacementKey
  ].join(":");
}

function initialRoomGetColorReplacementKey(initialRoomTile) {
  if (initialRoomGetGraphicsLevel() < 2) {
    return "";
  }

  return initialRoomGetTileRenderColorReplacements(initialRoomTile).map(function (initialRoomReplacement) {
    return initialRoomReplacement.from + ">" + initialRoomReplacement.to;
  }).join(",");
}

function initialRoomGetTileRenderColorReplacements(initialRoomTile) {
  var initialRoomReplacements = initialRoomNormalizeColorReplacements(initialRoomTile ? initialRoomTile.colorReplacements : null);
  var initialRoomHintReplacements = initialRoomGetEssentialPickupHintReplacements(initialRoomTile);
  var initialRoomDoorReplacements = initialRoomGetDoorChannelColorReplacements(initialRoomTile);
  var initialRoomDestructibleReplacements = initialRoomGetDestructibleLocationColorReplacements(initialRoomTile);

  return initialRoomReplacements.concat(initialRoomHintReplacements, initialRoomDoorReplacements, initialRoomDestructibleReplacements);
}

function initialRoomGetDestructibleLocationColorReplacements(initialRoomTile) {
  if (!initialRoomIsUncheckedGeneratedDestructibleLocation(initialRoomTile)) {
    return [];
  }

  if (initialRoomIsFireOnlyDestructibleLocation(initialRoomTile)) {
    return initialRoomFireOnlyDestructibleLocationReplacements;
  }

  return initialRoomDestructibleLocationReplacements;
}

function initialRoomIsUncheckedGeneratedDestructibleLocation(initialRoomTile) {
  var initialRoomGeneratedLocation = null;

  if (!initialRoomIsDestructableCheckTile(initialRoomTile) || initialRoomIsDestructableCheckDestroyed(initialRoomTile)) {
    return false;
  }

  initialRoomGeneratedLocation = initialRoomGetGeneratedArchipelagoLocation(initialRoomTile);

  return Boolean(
    initialRoomGeneratedLocation &&
    globalsState.archipelago.connected &&
    typeof archipelagoClientHasMissingLocation === "function" &&
    archipelagoClientHasMissingLocation(initialRoomGeneratedLocation.id)
  );
}

function initialRoomIsFireOnlyDestructibleLocation(initialRoomTile) {
  var initialRoomHasFireVulnerability = false;
  var initialRoomHasSwordVulnerability = false;

  (initialRoomTile.vulnerable || []).forEach(function (initialRoomVulnerability) {
    var initialRoomVulnerabilityType = initialRoomNormalizeVulnerabilityType(String(initialRoomVulnerability || "").split(":")[0]);

    if (initialRoomVulnerabilityType === "fire") {
      initialRoomHasFireVulnerability = true;
    }

    if (initialRoomVulnerabilityType === "sword") {
      initialRoomHasSwordVulnerability = true;
    }
  });

  return initialRoomHasFireVulnerability && !initialRoomHasSwordVulnerability;
}

function initialRoomGetEssentialPickupHintReplacements(initialRoomTile) {
  if (!initialRoomShouldShowEssentialPickupHints() || !initialRoomIsUnopenedChestCheck(initialRoomTile)) {
    return [];
  }

  if (initialRoomIsHintChest(initialRoomTile)) {
    return initialRoomHintPickupReplacements;
  }

  if (initialRoomIsTrapDrop(initialRoomTile.expectedDrop)) {
    return initialRoomTrapPickupHintReplacements;
  }

  if (initialRoomIsEssentialPickupDrop(initialRoomTile.expectedDrop)) {
    return initialRoomEssentialPickupHintReplacements;
  }

  return [];
}

function initialRoomIsHintChest(initialRoomTile) {
  return Boolean(
    initialRoomTile &&
    (
      initialRoomTile.hint ||
      initialRoomTile.containsHint ||
      initialRoomTile.hasHint ||
      initialRoomIsHintDrop(initialRoomTile.expectedDrop)
    )
  );
}

function initialRoomIsHintDrop(initialRoomExpectedDrop) {
  return /hint/i.test(String(initialRoomExpectedDrop || ""));
}

function initialRoomShouldShowEssentialPickupHints() {
  var initialRoomSlotData = globalsState.archipelago.slotData || {};

  if (Object.prototype.hasOwnProperty.call(initialRoomSlotData, "show_essential_pickup_hints")) {
    return Boolean(initialRoomSlotData.show_essential_pickup_hints);
  }

  if (Object.prototype.hasOwnProperty.call(initialRoomSlotData, "showEssentialPickupHints")) {
    return Boolean(initialRoomSlotData.showEssentialPickupHints);
  }

  return globalsState.showEssentialPickupHints !== false;
}

function initialRoomIsUnopenedChestCheck(initialRoomTile) {
  var initialRoomSprite = initialRoomTile ? initialRoomGetRenderableTileSprite(initialRoomTile) : null;

  return Boolean(
    initialRoomTile &&
    initialRoomTile.type === "check" &&
    !initialRoomIsCheckTileCollected(initialRoomTile) &&
    initialRoomSprite &&
    initialRoomSprite.source === "item" &&
    initialRoomSprite.name === "chest"
  );
}

function initialRoomNormalizeExpectedDropBase(initialRoomExpectedDrop) {
  var initialRoomProgressiveBase = progressionManagerGetProgressiveCheckBase(initialRoomExpectedDrop);

  return initialRoomProgressiveBase || initialRoomExpectedDrop;
}

function initialRoomIsEssentialPickupDrop(initialRoomExpectedDrop) {
  var initialRoomDropBase = initialRoomNormalizeExpectedDropBase(initialRoomExpectedDrop);

  if (!initialRoomDropBase || initialRoomDropBase === "empty" || initialRoomIsItemPoolCheckKey(initialRoomDropBase)) {
    return false;
  }

  return Boolean(globalsState.progressiveCheckDefinitions[initialRoomDropBase] || globalsState.checkDefinitions[initialRoomDropBase]);
}

function initialRoomIsTrapDrop(initialRoomExpectedDrop) {
  var initialRoomDropBase = initialRoomNormalizeExpectedDropBase(initialRoomExpectedDrop);

  return Boolean(globalsState.checkDefinitions[initialRoomDropBase] && globalsState.checkDefinitions[initialRoomDropBase].trap);
}

function initialRoomNormalizeColorReplacements(initialRoomColorReplacements) {
  return (initialRoomColorReplacements || []).filter(function (initialRoomReplacement) {
    return initialRoomReplacement.from && initialRoomReplacement.to;
  }).slice(0, 16).map(function (initialRoomReplacement) {
    return {
      from: initialRoomReplacement.from.toLowerCase(),
      to: initialRoomReplacement.to.toLowerCase()
    };
  });
}

function initialRoomRgbToHex(initialRoomRed, initialRoomGreen, initialRoomBlue) {
  return "#" + [initialRoomRed, initialRoomGreen, initialRoomBlue].map(function (initialRoomValue) {
    return initialRoomValue.toString(16).padStart(2, "0");
  }).join("");
}

function initialRoomGetRenderableTileSprite(initialRoomTile) {
  if (!initialRoomTile || !initialRoomTile.sprite) {
    return null;
  }

  if (!initialRoomIsAnimatedWaterTile(initialRoomTile) || initialRoomGetWaterFrameIndex() === 0) {
    return initialRoomTile.sprite;
  }

  var initialRoomNextWaterTile = initialRoomGetNextWaterTile(initialRoomTile.sprite.x, initialRoomTile.sprite.y);

  return {
    source: "tileset",
    x: initialRoomNextWaterTile.x,
    y: initialRoomNextWaterTile.y
  };
}

function initialRoomIsAnimatedWaterTile(initialRoomTile) {
  return Boolean(
    initialRoomTile &&
    initialRoomTile.sprite &&
    initialRoomTile.sprite.source === "tileset" &&
    initialRoomWaterTiles.length > 0 &&
    (
      initialRoomTile.tileType === "Water" ||
      initialRoomTile.typeOverride === "Water" ||
      initialRoomTile.tileType === "Lava" ||
      initialRoomTile.typeOverride === "Lava"
    )
  );
}

function initialRoomGetWaterFrameIndex() {
  return Math.floor(Date.now() / initialRoomWaterFrameDuration) % 2;
}

function initialRoomGetNextWaterTile(initialRoomTileX, initialRoomTileY) {
  return {
    x: initialRoomTileX + 1,
    y: initialRoomTileY
  };
}

function initialRoomDrawFloorTile(initialRoomTileX, initialRoomTileY, initialRoomTile) {
  var initialRoomPosition = initialRoomTileToScreen(initialRoomTileX, initialRoomTileY);
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomDrawX = initialRoomGraphicsLevel > 0 ? Math.floor(initialRoomPosition.x) : initialRoomPosition.x;
  var initialRoomDrawY = initialRoomGraphicsLevel > 0 ? Math.floor(initialRoomPosition.y) : initialRoomPosition.y;
  var initialRoomDrawSize = initialRoomGraphicsLevel > 0 ? Math.ceil(initialRoomView.tileSize) + 1 : initialRoomView.tileSize;
  var initialRoomRenderableTile = initialRoomIsDestructableCheckDestroyed(initialRoomTile) ?
    initialRoomGetRoomGroundTile(initialRoomTileX, initialRoomTileY) :
    initialRoomTile;

  if (initialRoomIsBlockerDestroyed(initialRoomTile)) {
    initialRoomRenderableTile = initialRoomGetRoomGroundTile(initialRoomTileX, initialRoomTileY);
  }

  if (initialRoomIsShopTile(initialRoomTile) && initialRoomIsShopItemHidden(initialRoomTile)) {
    initialRoomRenderableTile = initialRoomTile.backgroundTile || mapManagerGetDefaultTile(initialRoomCurrentRoom, initialRoomTileX, initialRoomTileY);
  }

  if (initialRoomIsRoomEntranceTile(initialRoomTile) && initialRoomIsRoomEntranceUnlocked(initialRoomTile)) {
    initialRoomRenderableTile = initialRoomGetRoomGroundTile(initialRoomTileX, initialRoomTileY);
  }

  if (initialRoomIsLockedRoomEntranceTile(initialRoomTile)) {
    initialRoomRenderableTile = initialRoomGetLockedRoomEntranceRenderTile(initialRoomTile);
  }

  if (initialRoomIsLockedDoorTile(initialRoomTile)) {
    initialRoomRenderableTile = initialRoomGetLockedRoomEntranceRenderTile(initialRoomTile);
  }

  initialRoomContext.fillStyle = "#30333a";
  initialRoomContext.fillRect(initialRoomDrawX, initialRoomDrawY, initialRoomDrawSize, initialRoomDrawSize);

  if (initialRoomGraphicsLevel > 0) {
    initialRoomDrawTileSprite(initialRoomRenderableTile, initialRoomPosition);
  }

  if (initialRoomGraphicsLevel === 0) {
    initialRoomDrawTileInnerEdges(initialRoomPosition, "#262930");
  }
}

var initialRoomDoorChannelBaseColor = "#928fb8";
var initialRoomDoorChannelColors = ["#9f8faf", "#8f98b8", "#8fb0a0", "#b0aa8f", "#a58fb8", "#b89a8f", "#8fb4b8", "#aaaab4"];

function initialRoomGetDoorChannelColor(initialRoomTile) {
  var initialRoomChannel = Math.max(1, initialRoomGetDoorChannel(initialRoomTile) || 1);

  return initialRoomDoorChannelColors[(initialRoomChannel - 1) % initialRoomDoorChannelColors.length];
}

function initialRoomGetDoorChannelColorReplacements(initialRoomTile) {
  if (!initialRoomIsDoorTile(initialRoomTile)) {
    return [];
  }

  return [{
    from: initialRoomDoorChannelBaseColor,
    to: initialRoomGetDoorChannelColor(initialRoomTile)
  }];
}

function initialRoomDrawSpecialTile(initialRoomTile) {
  var initialRoomPosition = initialRoomTileToScreen(initialRoomTile.x, initialRoomTile.y);

  if (initialRoomIsEnemyTile(initialRoomTile)) {
    return;
  }

  if (initialRoomIsDestructableCheckDestroyed(initialRoomTile)) {
    return;
  }

  if (initialRoomIsShopTile(initialRoomTile) && initialRoomIsShopItemHidden(initialRoomTile)) {
    return;
  }

  if (initialRoomIsBlockerDestroyed(initialRoomTile)) {
    return;
  }

  if (initialRoomIsRoomEntranceTile(initialRoomTile) && initialRoomIsRoomEntranceUnlocked(initialRoomTile)) {
    return;
  }

  if (initialRoomGetGraphicsLevel() > 0 && initialRoomIsLockedRoomEntranceTile(initialRoomTile)) {
    initialRoomDrawTileSprite(initialRoomGetLockedRoomEntranceRenderTile(initialRoomTile), initialRoomPosition);
    return;
  }

  if (initialRoomGetGraphicsLevel() > 0 && initialRoomIsLockedDoorTile(initialRoomTile)) {
    initialRoomDrawTileSprite(initialRoomGetLockedRoomEntranceRenderTile(initialRoomTile), initialRoomPosition);
    return;
  }

  if (initialRoomGetGraphicsLevel() > 0 && initialRoomIsShopTile(initialRoomTile) && initialRoomTile.sprite) {
    initialRoomDrawTileSprite(initialRoomGetRenderableShopTile(initialRoomTile), initialRoomPosition);
    initialRoomDrawShopCostOverlay(initialRoomTile, initialRoomPosition);
    return;
  }

  if (initialRoomGetGraphicsLevel() > 0 && initialRoomTile.type === "check" && initialRoomIsCheckTileCollected(initialRoomTile) && initialRoomTile.sprite) {
    initialRoomDrawTileSprite(initialRoomTile, initialRoomPosition);
    return;
  }

  if (initialRoomGetGraphicsLevel() > 0 && initialRoomTile.type === "check" && !initialRoomIsCheckTileCollected(initialRoomTile)) {
    initialRoomDrawTileSprite(initialRoomTile, initialRoomPosition);
    return;
  }

  if (initialRoomGetGraphicsLevel() > 0 && initialRoomIsBlockingTileType(initialRoomTile) && initialRoomTile.sprite) {
    initialRoomDrawTileSprite(initialRoomTile, initialRoomPosition);
    return;
  }

  if (initialRoomIsShopTile(initialRoomTile)) {
    initialRoomContext.fillStyle = "#202020";
    initialRoomContext.strokeStyle = "#ffcf7a";
  } else if (initialRoomTile.type === "check" && initialRoomIsCheckTileCollected(initialRoomTile)) {
    initialRoomContext.fillStyle = "#050505";
    initialRoomContext.strokeStyle = "#050505";
  } else if (initialRoomIsDestructableCheckTile(initialRoomTile)) {
    initialRoomContext.fillStyle = "#5f6670";
    initialRoomContext.strokeStyle = "#454b53";
  } else if (initialRoomTile.type === "check") {
    initialRoomContext.fillStyle = "#f7f7f1";
    initialRoomContext.strokeStyle = "#050505";
  } else if (initialRoomIsBlockingTileType(initialRoomTile)) {
    initialRoomContext.fillStyle = "#5f6670";
    initialRoomContext.strokeStyle = "#454b53";
  } else {
    return;
  }

  initialRoomContext.fillRect(initialRoomPosition.x, initialRoomPosition.y, initialRoomView.tileSize, initialRoomView.tileSize);
  initialRoomDrawTileInnerBorder(initialRoomPosition, initialRoomContext.strokeStyle);
  if (initialRoomIsShopTile(initialRoomTile)) {
    initialRoomDrawShopCostOverlay(initialRoomTile, initialRoomPosition);
  }
}

function initialRoomIsDestructableCheckTile(initialRoomTile) {
  return Boolean(initialRoomTile && (
    initialRoomTile.tileType === "DestructableCheck" ||
    initialRoomTile.typeOverride === "DestructableCheck"
  ));
}

function initialRoomIsShopTile(initialRoomTile) {
  return Boolean(initialRoomTile && (
    initialRoomTile.type === "shop" ||
    initialRoomTile.tileType === "ShopItem" ||
    initialRoomTile.typeOverride === "ShopItem"
  ));
}

function initialRoomIsShopItemHidden(initialRoomTile) {
  var initialRoomShopKey = initialRoomGetShopRuntimeKey(initialRoomTile);

  return Boolean(
    initialRoomHiddenShopItems[initialRoomShopKey] ||
    initialRoomRemovedShopItems[initialRoomShopKey] ||
    initialRoomIsGeneratedArchipelagoLocationChecked(initialRoomTile)
  );
}

function initialRoomGetRenderableShopTile(initialRoomTile) {
  var initialRoomOffer = initialRoomGetShopOffer(initialRoomTile);
  var initialRoomIconKey = initialRoomGetPickupIconKey(initialRoomOffer.drop);
  var initialRoomRenderableTile = Object.assign({}, initialRoomTile);

  initialRoomRenderableTile.sprite = {
    source: "item",
    name: initialRoomIconKey || "shop"
  };

  return initialRoomRenderableTile;
}

function initialRoomDrawShopCostOverlay(initialRoomTile, initialRoomPosition) {
  var initialRoomOffer = initialRoomGetShopOffer(initialRoomTile);
  var initialRoomCost = Number(initialRoomOffer.cost) || 0;
  var initialRoomText = initialRoomCost + "E";
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomPadding = Math.max(initialRoomPixelUnit, Math.floor(initialRoomView.tileSize / 20));
  var initialRoomFontSize = Math.max(initialRoomPixelUnit * 3, Math.floor(initialRoomView.tileSize * 0.22));

  initialRoomContext.save();
  initialRoomContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textAlign = "right";
  initialRoomContext.textBaseline = "bottom";
  initialRoomContext.lineJoin = "miter";
  initialRoomContext.lineWidth = Math.max(initialRoomPixelUnit, Math.floor(initialRoomView.tileSize / 18));
  initialRoomContext.strokeStyle = "#050505";
  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.strokeText(initialRoomText, initialRoomPosition.x + initialRoomView.tileSize - initialRoomPadding, initialRoomPosition.y + initialRoomView.tileSize - initialRoomPadding);
  initialRoomContext.fillText(initialRoomText, initialRoomPosition.x + initialRoomView.tileSize - initialRoomPadding, initialRoomPosition.y + initialRoomView.tileSize - initialRoomPadding);
  initialRoomContext.restore();
}

function initialRoomGetShopRuntimeKey(initialRoomTile) {
  return initialRoomGetShopRuntimeKeyForRoom(initialRoomTile, initialRoomCurrentRoom);
}

function initialRoomGetShopRuntimeKeyForRoom(initialRoomTile, initialRoomRoom) {
  if (!initialRoomRoom || !initialRoomTile) {
    return "";
  }

  return initialRoomRoom.id + ":shop:" + initialRoomTile.x + "," + initialRoomTile.y;
}

function initialRoomGetDestructableCheckRuntimeKey(initialRoomTile, initialRoomRoom) {
  var initialRoomRuntimeRoom = initialRoomRoom || initialRoomCurrentRoom;

  if (!initialRoomRuntimeRoom || !initialRoomTile) {
    return "";
  }

  return initialRoomRuntimeRoom.id + ":" + initialRoomTile.x + "," + initialRoomTile.y;
}

function initialRoomGetRuntimeTileKey(initialRoomTile) {
  if (!initialRoomCurrentRoom || !initialRoomTile) {
    return "";
  }

  return initialRoomCurrentRoom.id + ":" + initialRoomTile.x + "," + initialRoomTile.y;
}

function initialRoomIsDestructableCheckDestroyed(initialRoomTile, initialRoomRoom) {
  if (!initialRoomIsDestructableCheckTile(initialRoomTile)) {
    return false;
  }

  return Boolean(initialRoomDestroyedDestructableChecks[initialRoomGetDestructableCheckRuntimeKey(initialRoomTile, initialRoomRoom)]);
}

function initialRoomIsBlockerDestroyed(initialRoomTile) {
  return Boolean(initialRoomTile && initialRoomDestroyedBlockers[initialRoomGetRuntimeTileKey(initialRoomTile)]);
}

function initialRoomIsEnemyTile(initialRoomTile) {
  return Boolean(initialRoomTile && (
    initialRoomTile.type === "enemy" ||
    initialRoomTile.tileType === "Enemy" ||
    initialRoomTile.typeOverride === "Enemy" ||
    (initialRoomTile.sprite && initialRoomTile.sprite.source === "enemy")
  ));
}

function initialRoomDrawTileSprite(initialRoomTile, initialRoomPosition) {
  if (!initialRoomTile || !initialRoomTile.sprite) {
    return;
  }

  if (initialRoomTile.sprite.source === "enemy") {
    if (initialRoomTile.backgroundTile) {
      initialRoomDrawTileSprite(initialRoomTile.backgroundTile, initialRoomPosition);
    }

    return;
  }

  var initialRoomCacheKey = initialRoomGetTileRenderCacheKey(initialRoomTile);
  var initialRoomCachedCanvas = initialRoomTileRenderCache[initialRoomCacheKey];

  if (!initialRoomCachedCanvas) {
    initialRoomCachedCanvas = initialRoomCreateTileRenderCache(initialRoomTile);
    initialRoomTileRenderCache[initialRoomCacheKey] = initialRoomCachedCanvas;
  }

  initialRoomContext.drawImage(
    initialRoomCachedCanvas,
    Math.floor(initialRoomPosition.x),
    Math.floor(initialRoomPosition.y),
    Math.ceil(initialRoomView.tileSize) + 1,
    Math.ceil(initialRoomView.tileSize) + 1
  );
}

function initialRoomDrawEnemyBasic(initialRoomPosition) {
  var initialRoomCenterX = initialRoomPosition.x + (initialRoomView.tileSize / 2);
  var initialRoomCenterY = initialRoomPosition.y + (initialRoomView.tileSize / 2);
  var initialRoomRadius = initialRoomView.tileSize * 0.35;
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomOuterCells = Math.ceil(initialRoomRadius / initialRoomPixelUnit);
  var initialRoomCellCount = (initialRoomOuterCells * 2) + 1;
  var initialRoomEnemySize = initialRoomCellCount * initialRoomPixelUnit;
  var initialRoomOriginX = Math.round(initialRoomCenterX - (initialRoomEnemySize / 2));
  var initialRoomOriginY = Math.round(initialRoomCenterY - (initialRoomEnemySize / 2));
  var initialRoomCellY = 0;

  initialRoomContext.fillStyle = "#050505";

  while (initialRoomCellY < initialRoomCellCount) {
    var initialRoomCellX = 0;

    while (initialRoomCellX < initialRoomCellCount) {
      var initialRoomCellCenterX = initialRoomOriginX + ((initialRoomCellX + 0.5) * initialRoomPixelUnit) - initialRoomCenterX;
      var initialRoomCellCenterY = initialRoomOriginY + ((initialRoomCellY + 0.5) * initialRoomPixelUnit) - initialRoomCenterY;
      var initialRoomDistance = Math.sqrt((initialRoomCellCenterX * initialRoomCellCenterX) + (initialRoomCellCenterY * initialRoomCellCenterY));

      if (initialRoomDistance <= initialRoomRadius) {
        initialRoomContext.fillRect(
          initialRoomOriginX + (initialRoomCellX * initialRoomPixelUnit),
          initialRoomOriginY + (initialRoomCellY * initialRoomPixelUnit),
          initialRoomPixelUnit,
          initialRoomPixelUnit
        );
      }

      initialRoomCellX += 1;
    }

    initialRoomCellY += 1;
  }
}

function initialRoomDrawEnemySprite(initialRoomTile, initialRoomPosition) {
  var initialRoomEnemyImage = initialRoomEnemyImages[initialRoomTile.sprite.name];

  if (!initialRoomEnemyImage) {
    return;
  }

  initialRoomContext.save();

  if (initialRoomGetGraphicsLevel() === 1) {
    initialRoomContext.filter = "grayscale(1)";
  }

  initialRoomContext.drawImage(
    initialRoomEnemyImage,
    Math.floor(initialRoomPosition.x),
    Math.floor(initialRoomPosition.y),
    Math.ceil(initialRoomView.tileSize) + 1,
    Math.ceil(initialRoomView.tileSize) + 1
  );
  initialRoomContext.restore();
}

function initialRoomDrawRuntimeEnemies() {
  if (initialRoomGetGraphicsLevel() > 0) {
    initialRoomSyncEnemySprites();
    initialRoomDrawCanvasRuntimeEnemies();
    return;
  }

  initialRoomEnemyLayer.innerHTML = "";
  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (initialRoomEnemy.state === "hidden" || initialRoomEnemy.state === "vanished") {
      return;
    }

    initialRoomDrawEnemyBasic({
      x: initialRoomView.offsetX + ((initialRoomEnemy.x - 0.5) * initialRoomView.tileSize),
      y: initialRoomView.offsetY + ((initialRoomEnemy.y - 0.5) * initialRoomView.tileSize)
    });
  });
}

function initialRoomDrawCanvasRuntimeEnemies() {
  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    var initialRoomEnemyImagePath = "";
    var initialRoomEnemyImage = null;

    if (!initialRoomShouldRenderEnemyOnCanvas(initialRoomEnemy)) {
      return;
    }

    initialRoomEnemyImagePath = initialRoomGetRuntimeEnemyImagePath(initialRoomEnemy, Date.now());
    initialRoomEnemyImage = initialRoomGetRuntimeEnemyCanvasImage(initialRoomEnemyImagePath);

    if (!initialRoomEnemyImage || !initialRoomEnemyImage.complete) {
      return;
    }

    initialRoomContext.save();
    initialRoomContext.globalAlpha = initialRoomEnemy.state === "hidden" ? 0.25 : 1;
    if (initialRoomGetGraphicsLevel() === 1) {
      initialRoomContext.filter = "grayscale(1)";
    }

    if (initialRoomShouldMirrorEnemySprite(initialRoomEnemy)) {
      initialRoomContext.translate(initialRoomView.offsetX + (initialRoomEnemy.x * initialRoomView.tileSize), 0);
      initialRoomContext.scale(-1, 1);
      initialRoomContext.drawImage(
        initialRoomEnemyImage,
        Math.floor(-(initialRoomView.offsetX + ((initialRoomEnemy.x + 0.5) * initialRoomView.tileSize))),
        Math.floor(initialRoomView.offsetY + ((initialRoomEnemy.y - 0.5) * initialRoomView.tileSize)),
        Math.ceil(initialRoomView.tileSize) + 1,
        Math.ceil(initialRoomView.tileSize) + 1
      );
    } else {
      initialRoomContext.drawImage(
        initialRoomEnemyImage,
        Math.floor(initialRoomView.offsetX + ((initialRoomEnemy.x - 0.5) * initialRoomView.tileSize)),
        Math.floor(initialRoomView.offsetY + ((initialRoomEnemy.y - 0.5) * initialRoomView.tileSize)),
        Math.ceil(initialRoomView.tileSize) + 1,
        Math.ceil(initialRoomView.tileSize) + 1
      );
    }
    initialRoomContext.restore();
  });
}

function initialRoomShouldRenderEnemyOnCanvas(initialRoomEnemy) {
  return Boolean(
    initialRoomHasTankForm() &&
    initialRoomEnemy &&
    initialRoomEnemy.enemyType === "snake" &&
    initialRoomEnemy.state !== "vanished"
  );
}

function initialRoomGetRuntimeEnemyCanvasImage(initialRoomImagePath) {
  if (!initialRoomImagePath) {
    return null;
  }

  if (!initialRoomRuntimeEnemyCanvasImages[initialRoomImagePath]) {
    initialRoomRuntimeEnemyCanvasImages[initialRoomImagePath] = new Image();
    initialRoomRuntimeEnemyCanvasImages[initialRoomImagePath].src = initialRoomImagePath;
  }

  return initialRoomRuntimeEnemyCanvasImages[initialRoomImagePath];
}

function initialRoomDrawProjectiles() {
  initialRoomProjectiles.forEach(function (initialRoomProjectile) {
    var initialRoomScreenX = initialRoomView.offsetX + (initialRoomProjectile.x * initialRoomView.tileSize);
    var initialRoomScreenY = initialRoomView.offsetY + (initialRoomProjectile.y * initialRoomView.tileSize);
    var initialRoomPixelUnit = initialRoomGetPixelUnit();

    if (initialRoomProjectile.level >= 2) {
      initialRoomDrawLargeProjectile(initialRoomScreenX, initialRoomScreenY, initialRoomPixelUnit);
    } else {
      initialRoomDrawSmallProjectile(initialRoomScreenX, initialRoomScreenY, initialRoomPixelUnit);
    }
  });
}

function initialRoomDrawWizardFireballs() {
  initialRoomWizardFireballs.forEach(function (initialRoomFireball) {
    var initialRoomScreenX = initialRoomView.offsetX + (initialRoomFireball.x * initialRoomView.tileSize);
    var initialRoomScreenY = initialRoomView.offsetY + (initialRoomFireball.y * initialRoomView.tileSize);
    var initialRoomPixelUnit = initialRoomGetPixelUnit();
    var initialRoomSize = initialRoomPixelUnit * 5;

    initialRoomContext.fillStyle = initialRoomGetGraphicsLevel() >= 2 ? "#f05b2f" : "#f7f7f1";
    initialRoomContext.fillRect(Math.round(initialRoomScreenX - (initialRoomSize / 2)), Math.round(initialRoomScreenY - (initialRoomSize / 2)), initialRoomSize, initialRoomSize);
    initialRoomContext.fillStyle = initialRoomGetGraphicsLevel() >= 2 ? "#ffd166" : "#050505";
    initialRoomContext.fillRect(Math.round(initialRoomScreenX - initialRoomPixelUnit), Math.round(initialRoomScreenY - initialRoomPixelUnit), initialRoomPixelUnit * 2, initialRoomPixelUnit * 2);
  });
}

function initialRoomDrawMeleeAttacks(initialRoomLayer) {
  var initialRoomNow = Date.now();

  initialRoomMeleeAttacks.forEach(function (initialRoomAttack) {
    var initialRoomIsOverPlayerAttack = initialRoomAttack.direction.y > 0;

    if ((initialRoomLayer === "overPlayer") !== initialRoomIsOverPlayerAttack) {
      return;
    }

    if (initialRoomNow >= initialRoomAttack.expiresAt) {
      return;
    }

    if (initialRoomGetGraphicsLevel() > 0 && initialRoomAttack.level >= 2) {
      initialRoomDrawMeleeSwing(initialRoomAttack, initialRoomNow);
      return;
    }

    initialRoomAttack.points.forEach(function (initialRoomPoint) {
      initialRoomDrawMeleeAttackPoint(initialRoomPoint, initialRoomAttack.direction, 0, initialRoomAttack.level);
    });
  });
}

function initialRoomDrawMeleeSwing(initialRoomAttack, initialRoomNow) {
  var initialRoomProgress = Math.max(0, Math.min(0.999, (initialRoomNow - initialRoomAttack.startedAt) / (initialRoomAttack.expiresAt - initialRoomAttack.startedAt)));
  var initialRoomPointIndex = Math.min(initialRoomAttack.points.length - 1, Math.floor(initialRoomProgress * initialRoomAttack.points.length));
  var initialRoomRotationOffset = initialRoomGetSwingRotationOffset(initialRoomPointIndex, initialRoomAttack.points.length);

  initialRoomDrawMeleeAttackPoint(initialRoomAttack.points[initialRoomPointIndex], initialRoomAttack.direction, initialRoomRotationOffset, initialRoomAttack.level);
}

function initialRoomGetSwingRotationOffset(initialRoomPointIndex, initialRoomPointCount) {
  if (initialRoomPointIndex === 0) {
    return Math.PI * 0.25;
  }

  if (initialRoomPointIndex === initialRoomPointCount - 1) {
    return -Math.PI * 0.25;
  }

  return 0;
}

function initialRoomDrawMeleeAttackPoint(initialRoomPoint, initialRoomDirection, initialRoomRotationOffset, initialRoomSwordLevel) {
  var initialRoomCenterX = initialRoomView.offsetX + (initialRoomPoint.x * initialRoomView.tileSize);
  var initialRoomCenterY = initialRoomView.offsetY + (initialRoomPoint.y * initialRoomView.tileSize);
  var initialRoomSize = initialRoomView.tileSize * 0.9;

  if (initialRoomGetGraphicsLevel() === 0 || !initialRoomSwordImage) {
    initialRoomDrawBasicMeleeBar(initialRoomCenterX, initialRoomCenterY, initialRoomSize, initialRoomDirection, initialRoomSwordLevel);
    return;
  }

  initialRoomContext.save();
  initialRoomContext.translate(initialRoomCenterX, initialRoomCenterY);
  initialRoomContext.rotate(initialRoomGetSwordRotation(initialRoomDirection) + initialRoomRotationOffset);
  if (initialRoomGetGraphicsLevel() === 1) {
    initialRoomContext.filter = "grayscale(1) contrast(1.35)";
  }
  initialRoomContext.drawImage(initialRoomGetSwordImage(initialRoomSwordLevel), -initialRoomSize / 2, -initialRoomSize / 2, initialRoomSize, initialRoomSize);
  initialRoomContext.restore();
}

function initialRoomGetSwordImage(initialRoomSwordLevel) {
  if (initialRoomSwordLevel < 3 || initialRoomGetGraphicsLevel() < 2) {
    return initialRoomSwordImage;
  }

  if (!initialRoomRedSwordImage) {
    initialRoomRedSwordImage = initialRoomCreateRedSwordImage();
  }

  return initialRoomRedSwordImage || initialRoomSwordImage;
}

function initialRoomCreateRedSwordImage() {
  var initialRoomWidth = initialRoomSwordImage.naturalWidth || initialRoomSwordImage.width;
  var initialRoomHeight = initialRoomSwordImage.naturalHeight || initialRoomSwordImage.height;
  var initialRoomCanvas = document.createElement("canvas");
  var initialRoomContext = null;
  var initialRoomImageData = null;
  var initialRoomPixels = null;
  var initialRoomIndex = 0;

  if (!initialRoomWidth || !initialRoomHeight) {
    return null;
  }

  initialRoomCanvas.width = initialRoomWidth;
  initialRoomCanvas.height = initialRoomHeight;
  initialRoomContext = initialRoomCanvas.getContext("2d", { willReadFrequently: true });
  initialRoomContext.imageSmoothingEnabled = false;

  try {
    initialRoomContext.drawImage(initialRoomSwordImage, 0, 0, initialRoomWidth, initialRoomHeight);
    initialRoomImageData = initialRoomContext.getImageData(0, 0, initialRoomWidth, initialRoomHeight);
  } catch (initialRoomError) {
    return null;
  }

  initialRoomPixels = initialRoomImageData.data;

  while (initialRoomIndex < initialRoomPixels.length) {
    initialRoomReplaceSwordGreyPixel(initialRoomPixels, initialRoomIndex);
    initialRoomIndex += 4;
  }

  initialRoomContext.putImageData(initialRoomImageData, 0, 0);
  return initialRoomCanvas;
}

function initialRoomReplaceSwordGreyPixel(initialRoomPixels, initialRoomIndex) {
  var initialRoomRed = initialRoomPixels[initialRoomIndex];
  var initialRoomGreen = initialRoomPixels[initialRoomIndex + 1];
  var initialRoomBlue = initialRoomPixels[initialRoomIndex + 2];
  var initialRoomAlpha = initialRoomPixels[initialRoomIndex + 3];
  var initialRoomMax = Math.max(initialRoomRed, initialRoomGreen, initialRoomBlue);
  var initialRoomMin = Math.min(initialRoomRed, initialRoomGreen, initialRoomBlue);
  var initialRoomGrey = Math.round((initialRoomRed + initialRoomGreen + initialRoomBlue) / 3);
  var initialRoomRedScale = 0;

  if (initialRoomAlpha === 0 || initialRoomMax - initialRoomMin > 18 || initialRoomGrey < 64) {
    return;
  }

  initialRoomRedScale = Math.max(0, Math.min(1, (initialRoomGrey - 64) / 191));
  initialRoomPixels[initialRoomIndex] = Math.round(92 + (initialRoomRedScale * 132));
  initialRoomPixels[initialRoomIndex + 1] = Math.round(6 + (initialRoomRedScale * 34));
  initialRoomPixels[initialRoomIndex + 2] = Math.round(6 + (initialRoomRedScale * 34));
}

function initialRoomDrawBasicMeleeBar(initialRoomCenterX, initialRoomCenterY, initialRoomSize, initialRoomDirection, initialRoomSwordLevel) {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomBarThickness = Math.max(initialRoomPixelUnit, initialRoomView.tileSize / 12);

  initialRoomContext.fillStyle = initialRoomSwordLevel >= 3 && initialRoomGetGraphicsLevel() >= 2 ? "#d92b2b" : "#f7f7f1";

  if (initialRoomDirection.x !== 0) {
    initialRoomContext.fillRect(
      Math.round(initialRoomCenterX - (initialRoomSize / 2)),
      Math.round(initialRoomCenterY - (initialRoomBarThickness / 2)),
      Math.ceil(initialRoomSize),
      Math.ceil(initialRoomBarThickness)
    );
    return;
  }

  initialRoomContext.fillRect(
    Math.round(initialRoomCenterX - (initialRoomBarThickness / 2)),
    Math.round(initialRoomCenterY - (initialRoomSize / 2)),
    Math.ceil(initialRoomBarThickness),
    Math.ceil(initialRoomSize)
  );
}

function initialRoomGetSwordRotation(initialRoomDirection) {
  if (initialRoomDirection.y < 0) {
    return -Math.PI * 0.25;
  }

  if (initialRoomDirection.y > 0) {
    return Math.PI * 0.75;
  }

  if (initialRoomDirection.x < 0) {
    return -Math.PI * 0.75;
  }

  return Math.PI * 0.25;
}

function initialRoomDrawSmallProjectile(initialRoomScreenX, initialRoomScreenY, initialRoomPixelUnit) {
  var initialRoomSize = Math.max(initialRoomPixelUnit, initialRoomView.tileSize / 8);

  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(
    Math.round(initialRoomScreenX - (initialRoomSize / 2)),
    Math.round(initialRoomScreenY - (initialRoomSize / 2)),
    Math.ceil(initialRoomSize),
    Math.ceil(initialRoomSize)
  );
}

function initialRoomDrawLargeProjectile(initialRoomScreenX, initialRoomScreenY, initialRoomPixelUnit) {
  var initialRoomCellSize = Math.max(initialRoomPixelUnit, initialRoomView.tileSize / 8);
  var initialRoomOriginX = Math.round(initialRoomScreenX - initialRoomCellSize);
  var initialRoomOriginY = Math.round(initialRoomScreenY - initialRoomCellSize);

  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(initialRoomOriginX, initialRoomOriginY, initialRoomCellSize * 2, initialRoomCellSize * 2);

  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.fillRect(initialRoomOriginX + initialRoomCellSize, initialRoomOriginY - initialRoomCellSize, initialRoomCellSize, initialRoomCellSize);
  initialRoomContext.fillRect(initialRoomOriginX + (initialRoomCellSize * 2), initialRoomOriginY + initialRoomCellSize, initialRoomCellSize, initialRoomCellSize);
  initialRoomContext.fillRect(initialRoomOriginX, initialRoomOriginY + (initialRoomCellSize * 2), initialRoomCellSize, initialRoomCellSize);
  initialRoomContext.fillRect(initialRoomOriginX - initialRoomCellSize, initialRoomOriginY, initialRoomCellSize, initialRoomCellSize);
}

function initialRoomSyncEnemySprites() {
  var initialRoomActiveEnemyKeys = {};
  var initialRoomNow = Date.now();

  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    var initialRoomEnemyImage = initialRoomEnemyLayer.querySelector('[data-enemy-key="' + initialRoomEnemy.id + '"]');
    var initialRoomScreenX = initialRoomView.offsetX + ((initialRoomEnemy.x - 0.5) * initialRoomView.tileSize);
    var initialRoomScreenY = initialRoomView.offsetY + ((initialRoomEnemy.y - 0.5) * initialRoomView.tileSize);
    var initialRoomEnemyImagePath = initialRoomGetRuntimeEnemyImagePath(initialRoomEnemy, initialRoomNow);

    if (initialRoomShouldRenderEnemyOnCanvas(initialRoomEnemy)) {
      if (initialRoomEnemyImage) {
        initialRoomEnemyLayer.removeChild(initialRoomEnemyImage);
      }
      return;
    }

    initialRoomActiveEnemyKeys[initialRoomEnemy.id] = true;

    if (!initialRoomEnemyImage) {
      initialRoomEnemyImage = document.createElement("img");
      initialRoomEnemyImage.dataset.enemyKey = initialRoomEnemy.id;
      initialRoomEnemyImage.alt = "";
      initialRoomEnemyImage.style.position = "absolute";
      initialRoomEnemyImage.style.imageRendering = "pixelated";
      initialRoomEnemyImage.style.pointerEvents = "none";
      initialRoomEnemyLayer.appendChild(initialRoomEnemyImage);
    }

    if (initialRoomEnemyImage.dataset.enemyImagePath !== initialRoomEnemyImagePath) {
      initialRoomEnemyImage.dataset.enemyImagePath = initialRoomEnemyImagePath;
      initialRoomEnemyImage.src = initialRoomEnemyImagePath;
    }

    initialRoomEnemyImage.style.display = initialRoomEnemy.state === "vanished" ? "none" : "";
    initialRoomEnemyImage.style.transform = initialRoomShouldMirrorEnemySprite(initialRoomEnemy) ? "scaleX(-1)" : "";
    initialRoomEnemyImage.style.transformOrigin = "center center";
    initialRoomEnemyImage.style.left = Math.floor(initialRoomScreenX) + "px";
    initialRoomEnemyImage.style.top = Math.floor(initialRoomScreenY) + "px";
    initialRoomEnemyImage.style.width = (Math.ceil(initialRoomView.tileSize) + 1) + "px";
    initialRoomEnemyImage.style.height = (Math.ceil(initialRoomView.tileSize) + 1) + "px";
    initialRoomEnemyImage.style.filter = initialRoomGetGraphicsLevel() === 1 ? "grayscale(1)" : "";
    initialRoomEnemyImage.style.opacity = initialRoomEnemy.state === "hidden" ? "0.25" : "1";
  });

  Array.prototype.slice.call(initialRoomEnemyLayer.querySelectorAll("[data-enemy-key]")).forEach(function (initialRoomEnemyImage) {
    if (!initialRoomActiveEnemyKeys[initialRoomEnemyImage.dataset.enemyKey]) {
      initialRoomEnemyLayer.removeChild(initialRoomEnemyImage);
    }
  });
}

function initialRoomGetRuntimeEnemyImagePath(initialRoomEnemy, initialRoomNow) {
  var initialRoomEnemyDefinition = globalsState.enemyDefinitions[initialRoomEnemy.enemyType];

  if (!initialRoomEnemyDefinition) {
    return "";
  }

  if (initialRoomEnemy.state === "dying" && initialRoomEnemyDefinition.deathImage) {
    return initialRoomEnemyDefinition.deathImage;
  }

  if (initialRoomEnemy.state === "hidden" && initialRoomEnemyDefinition.previewImage) {
    return initialRoomEnemyDefinition.previewImage;
  }

  if (initialRoomNow < initialRoomEnemy.hurtUntil && initialRoomEnemyDefinition.hurtImage) {
    return initialRoomEnemyDefinition.hurtImage;
  }

  if (initialRoomEnemy.state === "attack" && initialRoomEnemyDefinition.attackImages && initialRoomEnemyDefinition.attackImages[initialRoomEnemy.facingDirection]) {
    return initialRoomEnemyDefinition.attackImages[initialRoomEnemy.facingDirection];
  }

  if (initialRoomEnemyDefinition.images && initialRoomEnemyDefinition.images[initialRoomEnemy.facingDirection]) {
    return initialRoomEnemyDefinition.images[initialRoomEnemy.facingDirection];
  }

  return initialRoomEnemyDefinition.image;
}

function initialRoomShouldMirrorEnemySprite(initialRoomEnemy) {
  return Boolean((initialRoomEnemy.enemyType === "snake" || initialRoomEnemy.enemyType === "sorcerer") && initialRoomEnemy.facingDirection === "left");
}

function initialRoomCreateTileRenderCache(initialRoomTile) {
  var initialRoomTileCanvas = document.createElement("canvas");
  var initialRoomTileContext = initialRoomTileCanvas.getContext("2d");

  initialRoomTileCanvas.width = Math.round(initialRoomView.tileSize);
  initialRoomTileCanvas.height = Math.round(initialRoomView.tileSize);
  initialRoomTileContext.imageSmoothingEnabled = false;
  initialRoomDrawTileSpriteToContext(initialRoomTileContext, initialRoomTile, initialRoomTileCanvas.width, initialRoomTileCanvas.height);

  return initialRoomTileCanvas;
}

function initialRoomDrawTileSpriteToContext(initialRoomTileContext, initialRoomTile, initialRoomTargetWidth, initialRoomTargetHeight) {
  if (initialRoomTile.backgroundTile) {
    initialRoomDrawTileSpriteToContext(initialRoomTileContext, initialRoomTile.backgroundTile, initialRoomTargetWidth, initialRoomTargetHeight);
  }

  var initialRoomSprite = initialRoomGetRenderableTileSprite(initialRoomTile);

  if (!initialRoomSprite) {
    return;
  }

  initialRoomTileContext.save();

  if (initialRoomGetGraphicsLevel() === 1) {
    initialRoomTileContext.filter = "grayscale(1)";
  }

  if (initialRoomSprite.source === "item") {
    var initialRoomItemImage = initialRoomGetItemSpriteImage(initialRoomTile, initialRoomSprite);

    if (initialRoomItemImage) {
      initialRoomDrawImageWithColorReplacements(
        initialRoomTileContext,
        initialRoomItemImage,
        0,
        0,
        initialRoomItemImage.width,
        initialRoomItemImage.height,
        0,
        0,
        initialRoomTargetWidth,
        initialRoomTargetHeight,
        initialRoomGetTileRenderColorReplacements(initialRoomTile)
      );
    }
    initialRoomTileContext.restore();
    return;
  }

  if (initialRoomSprite.source === "tileset" && initialRoomTilesetImage) {
    initialRoomDrawImageWithColorReplacements(
      initialRoomTileContext,
      initialRoomTilesetImage,
      initialRoomSprite.x * initialRoomTilesetTileSize,
      initialRoomSprite.y * initialRoomTilesetTileSize,
      initialRoomTilesetTileSize,
      initialRoomTilesetTileSize,
      0,
      0,
      initialRoomTargetWidth,
      initialRoomTargetHeight,
      initialRoomGetTileRenderColorReplacements(initialRoomTile)
    );
  }

  initialRoomTileContext.restore();
}

function initialRoomGetItemSpriteImage(initialRoomTile, initialRoomSprite) {
  if (initialRoomTile.type === "check" && initialRoomIsCheckTileCollected(initialRoomTile) && initialRoomSprite.name === "chest") {
    return initialRoomOpenChestImage;
  }

  if (initialRoomSprite.name === "chest") {
    return initialRoomChestImage;
  }

  return initialRoomPickupIconImages[initialRoomSprite.name] || initialRoomChestImage;
}

function initialRoomDrawImageWithColorReplacements(initialRoomTargetContext, initialRoomImage, initialRoomSourceX, initialRoomSourceY, initialRoomSourceWidth, initialRoomSourceHeight, initialRoomTargetX, initialRoomTargetY, initialRoomTargetWidth, initialRoomTargetHeight, initialRoomColorReplacements) {
  var initialRoomReplacements = initialRoomNormalizeColorReplacements(initialRoomColorReplacements);

  if (initialRoomGetGraphicsLevel() < 2 || initialRoomReplacements.length === 0) {
    initialRoomTargetContext.drawImage(
      initialRoomImage,
      initialRoomSourceX,
      initialRoomSourceY,
      initialRoomSourceWidth,
      initialRoomSourceHeight,
      initialRoomTargetX,
      initialRoomTargetY,
      initialRoomTargetWidth,
      initialRoomTargetHeight
    );
    return;
  }

  var initialRoomReplacementCanvas = document.createElement("canvas");
  var initialRoomReplacementContext = initialRoomReplacementCanvas.getContext("2d");
  var initialRoomReplacementMap = {};

  initialRoomReplacementCanvas.width = initialRoomSourceWidth;
  initialRoomReplacementCanvas.height = initialRoomSourceHeight;
  initialRoomReplacementContext.imageSmoothingEnabled = false;

  try {
    initialRoomReplacementContext.drawImage(initialRoomImage, initialRoomSourceX, initialRoomSourceY, initialRoomSourceWidth, initialRoomSourceHeight, 0, 0, initialRoomSourceWidth, initialRoomSourceHeight);
  } catch (initialRoomError) {
    initialRoomTargetContext.drawImage(
      initialRoomImage,
      initialRoomSourceX,
      initialRoomSourceY,
      initialRoomSourceWidth,
      initialRoomSourceHeight,
      initialRoomTargetX,
      initialRoomTargetY,
      initialRoomTargetWidth,
      initialRoomTargetHeight
    );
    return;
  }

  initialRoomReplacements.forEach(function (initialRoomReplacement) {
    initialRoomReplacementMap[initialRoomReplacement.from] = initialRoomReplacement.to;
  });

  var initialRoomImageData = null;
  var initialRoomIndex = 0;

  try {
    initialRoomImageData = initialRoomReplacementContext.getImageData(0, 0, initialRoomSourceWidth, initialRoomSourceHeight);
  } catch (initialRoomError) {
    initialRoomTargetContext.drawImage(
      initialRoomImage,
      initialRoomSourceX,
      initialRoomSourceY,
      initialRoomSourceWidth,
      initialRoomSourceHeight,
      initialRoomTargetX,
      initialRoomTargetY,
      initialRoomTargetWidth,
      initialRoomTargetHeight
    );
    return;
  }

  while (initialRoomIndex < initialRoomImageData.data.length) {
    var initialRoomHex = initialRoomRgbToHex(
      initialRoomImageData.data[initialRoomIndex],
      initialRoomImageData.data[initialRoomIndex + 1],
      initialRoomImageData.data[initialRoomIndex + 2]
    );
    var initialRoomReplacementColor = initialRoomReplacementMap[initialRoomHex];

    if (initialRoomReplacementColor) {
      initialRoomImageData.data[initialRoomIndex] = parseInt(initialRoomReplacementColor.slice(1, 3), 16);
      initialRoomImageData.data[initialRoomIndex + 1] = parseInt(initialRoomReplacementColor.slice(3, 5), 16);
      initialRoomImageData.data[initialRoomIndex + 2] = parseInt(initialRoomReplacementColor.slice(5, 7), 16);
    }

    initialRoomIndex += 4;
  }

  initialRoomReplacementContext.putImageData(initialRoomImageData, 0, 0);
  initialRoomTargetContext.drawImage(
    initialRoomReplacementCanvas,
    0,
    0,
    initialRoomSourceWidth,
    initialRoomSourceHeight,
    initialRoomTargetX,
    initialRoomTargetY,
    initialRoomTargetWidth,
    initialRoomTargetHeight
  );
}

function initialRoomDrawTileInnerEdges(initialRoomPosition, initialRoomEdgeColor) {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();

  initialRoomContext.fillStyle = initialRoomEdgeColor;
  initialRoomContext.fillRect(
    initialRoomPosition.x + initialRoomView.tileSize - initialRoomPixelUnit,
    initialRoomPosition.y,
    initialRoomPixelUnit,
    initialRoomView.tileSize
  );
  initialRoomContext.fillRect(
    initialRoomPosition.x,
    initialRoomPosition.y + initialRoomView.tileSize - initialRoomPixelUnit,
    initialRoomView.tileSize,
    initialRoomPixelUnit
  );
}

function initialRoomDrawTileInnerBorder(initialRoomPosition, initialRoomEdgeColor) {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();

  initialRoomContext.fillStyle = initialRoomEdgeColor;
  initialRoomContext.fillRect(initialRoomPosition.x, initialRoomPosition.y, initialRoomView.tileSize, initialRoomPixelUnit);
  initialRoomContext.fillRect(initialRoomPosition.x, initialRoomPosition.y, initialRoomPixelUnit, initialRoomView.tileSize);
  initialRoomContext.fillRect(
    initialRoomPosition.x + initialRoomView.tileSize - initialRoomPixelUnit,
    initialRoomPosition.y,
    initialRoomPixelUnit,
    initialRoomView.tileSize
  );
  initialRoomContext.fillRect(
    initialRoomPosition.x,
    initialRoomPosition.y + initialRoomView.tileSize - initialRoomPixelUnit,
    initialRoomView.tileSize,
    initialRoomPixelUnit
  );
}

function initialRoomDrawRoom() {
  var initialRoomStartTileX = Math.max(0, Math.floor(initialRoomView.cameraX - (initialRoomView.visibleTilesX / 2)) - 1);
  var initialRoomStartTileY = Math.max(0, Math.floor(initialRoomView.cameraY - (initialRoomView.visibleTilesY / 2)) - 1);
  var initialRoomEndTileX = Math.min(mapManagerData.roomWidth, Math.ceil(initialRoomView.cameraX + (initialRoomView.visibleTilesX / 2)) + 1);
  var initialRoomEndTileY = Math.min(mapManagerData.roomHeight, Math.ceil(initialRoomView.cameraY + (initialRoomView.visibleTilesY / 2)) + 1);
  var initialRoomTileY = initialRoomStartTileY;

  while (initialRoomTileY < initialRoomEndTileY) {
    var initialRoomTileX = initialRoomStartTileX;

    while (initialRoomTileX < initialRoomEndTileX) {
      var initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

      initialRoomDrawFloorTile(initialRoomTileX, initialRoomTileY, initialRoomTile);
      initialRoomDrawSpecialTile(initialRoomTile);
      initialRoomTileX += 1;
    }

    initialRoomTileY += 1;
  }
}

function initialRoomDrawBombs() {
  var initialRoomNow = Date.now();

  initialRoomBombs.forEach(function (initialRoomBomb) {
    if (initialRoomNow >= initialRoomBomb.explodedAt) {
      initialRoomDrawExplosion(initialRoomBomb);
      return;
    }

    initialRoomDrawBomb(initialRoomBomb);
  });

  initialRoomSyncExplosionEffects(initialRoomNow);
}

function initialRoomDrawTankShots() {
  var initialRoomNow = Date.now();

  initialRoomTankShots = initialRoomTankShots.filter(function (initialRoomShot) {
    return initialRoomNow < initialRoomShot.expiresAt;
  });

  initialRoomTankShots.forEach(function (initialRoomShot) {
    initialRoomDrawTankShotLine(initialRoomShot);
  });
}

function initialRoomDrawDestructibleBursts() {
  var initialRoomNow = Date.now();

  initialRoomDestructibleBursts = initialRoomDestructibleBursts.filter(function (initialRoomBurst) {
    return initialRoomNow < initialRoomBurst.expiresAt;
  });

  initialRoomDestructibleBursts.forEach(function (initialRoomBurst) {
    var initialRoomAgePercent = Math.max(0, Math.min(1, (initialRoomNow - initialRoomBurst.startedAt) / initialRoomBurst.duration));
    var initialRoomPixelUnit = initialRoomGetPixelUnit();
    var initialRoomCenter = initialRoomWorldToScreen(initialRoomBurst.x + 0.5, initialRoomBurst.y + 0.5);
    var initialRoomParticleIndex = 0;

    initialRoomContext.save();
    initialRoomContext.fillStyle = initialRoomBurst.color;

    while (initialRoomParticleIndex < initialRoomBurst.count) {
      var initialRoomAngle = (Math.PI * 2 * initialRoomParticleIndex) / initialRoomBurst.count;
      var initialRoomDistance = initialRoomPixelUnit * (2 + (initialRoomAgePercent * 6)) * (initialRoomParticleIndex % 2 === 0 ? 1 : 0.7);
      var initialRoomParticleX = initialRoomCenter.x + (Math.cos(initialRoomAngle) * initialRoomDistance);
      var initialRoomParticleY = initialRoomCenter.y + (Math.sin(initialRoomAngle) * initialRoomDistance);

      initialRoomContext.fillRect(
        Math.round(initialRoomParticleX - initialRoomPixelUnit),
        Math.round(initialRoomParticleY - initialRoomPixelUnit),
        initialRoomPixelUnit * 2,
        initialRoomPixelUnit * 2
      );

      initialRoomParticleIndex += 1;
    }

    initialRoomContext.restore();
  });
}

function initialRoomDrawTankShotLine(initialRoomShot) {
  var initialRoomStart = initialRoomWorldToScreen(initialRoomShot.startX, initialRoomShot.startY);
  var initialRoomEnd = initialRoomWorldToScreen(initialRoomShot.endX, initialRoomShot.endY);
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomBorderColor = initialRoomGraphicsLevel >= 2 ? "#d03b32" : "#8f949d";

  initialRoomContext.save();
  initialRoomContext.lineCap = "butt";

  if (initialRoomGraphicsLevel > 0) {
    initialRoomDrawTankShotStroke(initialRoomStart, initialRoomEnd, initialRoomBorderColor, initialRoomPixelUnit * 6);
  }

  initialRoomDrawTankShotStroke(initialRoomStart, initialRoomEnd, "#f7f7f1", initialRoomGraphicsLevel > 0 ? initialRoomPixelUnit * 3 : initialRoomPixelUnit * 3);

  if (initialRoomGraphicsLevel > 0) {
    initialRoomDrawTankShotImpactParticles(initialRoomShot, initialRoomEnd.x, initialRoomEnd.y, initialRoomPixelUnit, initialRoomBorderColor);
  }

  initialRoomContext.restore();
}

function initialRoomDrawTankShotStroke(initialRoomStart, initialRoomEnd, initialRoomColor, initialRoomWidth) {
  initialRoomContext.strokeStyle = initialRoomColor;
  initialRoomContext.lineWidth = initialRoomWidth;
  initialRoomContext.beginPath();
  initialRoomContext.moveTo(initialRoomStart.x, initialRoomStart.y);
  initialRoomContext.lineTo(initialRoomEnd.x, initialRoomEnd.y);
  initialRoomContext.stroke();
}

function initialRoomDrawTankShotImpactParticles(initialRoomShot, initialRoomX, initialRoomY, initialRoomPixelUnit, initialRoomColor) {
  var initialRoomNow = Date.now();
  var initialRoomAgePercent = Math.max(0, Math.min(1, (initialRoomNow - initialRoomShot.startedAt) / initialRoomTankShotDuration));
  var initialRoomParticleIndex = 0;
  var initialRoomImpactRadius = initialRoomPixelUnit * (2 + Math.round(initialRoomAgePercent * 7));

  initialRoomContext.fillStyle = initialRoomColor;

  while (initialRoomParticleIndex < 10) {
    var initialRoomAngle = (Math.PI * 2 * initialRoomParticleIndex) / 10;
    var initialRoomDistance = initialRoomImpactRadius * (initialRoomParticleIndex % 2 === 0 ? 1 : 0.62);
    var initialRoomParticleX = initialRoomX + (Math.cos(initialRoomAngle) * initialRoomDistance);
    var initialRoomParticleY = initialRoomY + (Math.sin(initialRoomAngle) * initialRoomDistance);

    initialRoomContext.fillRect(
      Math.round(initialRoomParticleX - initialRoomPixelUnit),
      Math.round(initialRoomParticleY - initialRoomPixelUnit),
      initialRoomPixelUnit * 2,
      initialRoomPixelUnit * 2
    );

    initialRoomParticleIndex += 1;
  }
}

function initialRoomSyncExplosionEffects(initialRoomNow) {
  var initialRoomActiveEffectKeys = {};

  if (initialRoomGetGraphicsLevel() === 0) {
    initialRoomEffectLayer.innerHTML = "";
    return;
  }

  initialRoomBombs.forEach(function (initialRoomBomb) {
    if (initialRoomNow < initialRoomBomb.explodedAt || initialRoomNow >= initialRoomBomb.explodedAt + initialRoomGetExplosionDuration(initialRoomBomb)) {
      return;
    }

    initialRoomGetBombExplosionTiles(initialRoomBomb).forEach(function (initialRoomExplosionTile) {
      var initialRoomEffectKey = initialRoomBomb.placedAt + ":" + initialRoomExplosionTile.x + "," + initialRoomExplosionTile.y;
      var initialRoomEffectImage = initialRoomEffectLayer.querySelector('[data-effect-key="' + initialRoomEffectKey + '"]');
      var initialRoomPosition = initialRoomTileToScreen(initialRoomExplosionTile.x, initialRoomExplosionTile.y);

      initialRoomActiveEffectKeys[initialRoomEffectKey] = true;

      if (!initialRoomEffectImage) {
        initialRoomEffectImage = document.createElement("img");
        initialRoomEffectImage.dataset.effectKey = initialRoomEffectKey;
        initialRoomEffectImage.src = initialRoomExplosionPath + "?effect=" + initialRoomEffectKey;
        initialRoomEffectImage.alt = "";
        initialRoomEffectImage.style.position = "absolute";
        initialRoomEffectImage.style.imageRendering = "pixelated";
        initialRoomEffectImage.style.pointerEvents = "none";
        initialRoomEffectLayer.appendChild(initialRoomEffectImage);
      }

      initialRoomEffectImage.style.left = Math.floor(initialRoomPosition.x) + "px";
      initialRoomEffectImage.style.top = Math.floor(initialRoomPosition.y) + "px";
      initialRoomEffectImage.style.width = (Math.ceil(initialRoomView.tileSize) + 1) + "px";
      initialRoomEffectImage.style.height = (Math.ceil(initialRoomView.tileSize) + 1) + "px";
      initialRoomEffectImage.style.filter = initialRoomGetGraphicsLevel() === 1 ? "grayscale(1)" : "";
    });
  });

  Array.prototype.slice.call(initialRoomEffectLayer.querySelectorAll("[data-effect-key]")).forEach(function (initialRoomEffectImage) {
    if (!initialRoomActiveEffectKeys[initialRoomEffectImage.dataset.effectKey]) {
      initialRoomEffectLayer.removeChild(initialRoomEffectImage);
    }
  });
}

function initialRoomDrawBomb(initialRoomBomb) {
  var initialRoomPosition = initialRoomTileToScreen(initialRoomBomb.x, initialRoomBomb.y);

  if (initialRoomBomb.kind === "fire") {
    return;
  }

  if (initialRoomGetGraphicsLevel() === 0 || !initialRoomBombImage) {
    initialRoomDrawBombBasic(initialRoomPosition);
    return;
  }

  initialRoomDrawOverlayImage(initialRoomBombImage, initialRoomPosition);
}

function initialRoomDrawExplosion(initialRoomBomb) {
  initialRoomGetBombExplosionTiles(initialRoomBomb).forEach(function (initialRoomExplosionTile) {
    var initialRoomPosition = initialRoomTileToScreen(initialRoomExplosionTile.x, initialRoomExplosionTile.y);

    if (initialRoomGetGraphicsLevel() === 0) {
      initialRoomDrawExplosionBasic(initialRoomPosition);
    }
  });
}

function initialRoomDrawOverlayImage(initialRoomImage, initialRoomPosition) {
  initialRoomContext.save();

  if (initialRoomGetGraphicsLevel() === 1) {
    initialRoomContext.filter = "grayscale(1)";
  }

  initialRoomContext.drawImage(
    initialRoomImage,
    Math.floor(initialRoomPosition.x),
    Math.floor(initialRoomPosition.y),
    Math.ceil(initialRoomView.tileSize) + 1,
    Math.ceil(initialRoomView.tileSize) + 1
  );
  initialRoomContext.restore();
}

function initialRoomDrawBombBasic(initialRoomPosition) {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomCenterX = initialRoomPosition.x + (initialRoomView.tileSize / 2);
  var initialRoomCenterY = initialRoomPosition.y + (initialRoomView.tileSize / 2);
  var initialRoomArm = initialRoomPixelUnit * 2;

  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.fillRect(initialRoomCenterX - (initialRoomPixelUnit / 2), initialRoomCenterY - initialRoomArm, initialRoomPixelUnit, initialRoomArm * 2);
  initialRoomContext.fillRect(initialRoomCenterX - initialRoomArm, initialRoomCenterY - (initialRoomPixelUnit / 2), initialRoomArm * 2, initialRoomPixelUnit);
  initialRoomContext.fillRect(initialRoomCenterX - initialRoomPixelUnit, initialRoomCenterY - initialRoomPixelUnit, initialRoomPixelUnit * 2, initialRoomPixelUnit * 2);
}

function initialRoomDrawExplosionBasic(initialRoomPosition) {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomInset = initialRoomPixelUnit * 4;
  var initialRoomStep = initialRoomPixelUnit * 2;
  var initialRoomStartX = initialRoomPosition.x + initialRoomInset;
  var initialRoomEndX = initialRoomPosition.x + initialRoomView.tileSize - initialRoomInset;
  var initialRoomStartY = initialRoomPosition.y + initialRoomInset;
  var initialRoomEndY = initialRoomPosition.y + initialRoomView.tileSize - initialRoomInset;
  var initialRoomOffset = 0;

  initialRoomContext.fillStyle = "#f7f7f1";

  while (initialRoomOffset <= initialRoomEndX - initialRoomStartX) {
    initialRoomContext.fillRect(initialRoomStartX + initialRoomOffset, initialRoomStartY + initialRoomOffset, initialRoomPixelUnit, initialRoomPixelUnit);
    initialRoomContext.fillRect(initialRoomEndX - initialRoomOffset, initialRoomStartY + initialRoomOffset, initialRoomPixelUnit, initialRoomPixelUnit);
    initialRoomOffset += initialRoomStep;
  }
}

function initialRoomGetExplosionDuration(initialRoomBomb) {
  return initialRoomBomb.duration || initialRoomExplosionDuration;
}

function initialRoomDrawPlayer() {
  if (!initialRoomShouldDrawPlayer()) {
    return;
  }

  if (initialRoomHasTankForm()) {
    initialRoomDrawTankPlayer();
    return;
  }

  if (initialRoomGetGraphicsLevel() > 0) {
    initialRoomDrawPlayerSprite();
    return;
  }

  var initialRoomRadius = initialRoomView.tileSize * initialRoomPlayer.radius;
  var initialRoomScreenX = initialRoomView.offsetX + (initialRoomPlayer.x * initialRoomView.tileSize);
  var initialRoomScreenY = initialRoomView.offsetY + (initialRoomPlayer.y * initialRoomView.tileSize);
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomOuterCells = Math.ceil(initialRoomRadius / initialRoomPixelUnit);
  var initialRoomCellCount = (initialRoomOuterCells * 2) + 1;
  var initialRoomPlayerSize = initialRoomCellCount * initialRoomPixelUnit;
  var initialRoomBorderWidth = initialRoomPixelUnit;
  var initialRoomOriginX = Math.round(initialRoomScreenX - (initialRoomPlayerSize / 2));
  var initialRoomOriginY = Math.round(initialRoomScreenY - (initialRoomPlayerSize / 2));
  var initialRoomCellY = 0;

  initialRoomContext.fillStyle = "#050505";
  while (initialRoomCellY < initialRoomCellCount) {
    var initialRoomCellX = 0;

    while (initialRoomCellX < initialRoomCellCount) {
      var initialRoomCellCenterX = initialRoomOriginX + ((initialRoomCellX + 0.5) * initialRoomPixelUnit) - initialRoomScreenX;
      var initialRoomCellCenterY = initialRoomOriginY + ((initialRoomCellY + 0.5) * initialRoomPixelUnit) - initialRoomScreenY;
      var initialRoomDistance = Math.sqrt((initialRoomCellCenterX * initialRoomCellCenterX) + (initialRoomCellCenterY * initialRoomCellCenterY));

      if (initialRoomDistance <= initialRoomRadius) {
        initialRoomContext.fillRect(
          initialRoomOriginX + (initialRoomCellX * initialRoomPixelUnit),
          initialRoomOriginY + (initialRoomCellY * initialRoomPixelUnit),
          initialRoomPixelUnit,
          initialRoomPixelUnit
        );
      }

      initialRoomCellX += 1;
    }

    initialRoomCellY += 1;
  }

  initialRoomDrawPlayerInterior(initialRoomRadius, initialRoomPixelUnit, initialRoomCellCount, initialRoomBorderWidth, initialRoomOriginX, initialRoomOriginY, initialRoomScreenX, initialRoomScreenY);
}

function initialRoomDrawTankPlayer() {
  initialRoomDrawTankChassis();
}

function initialRoomDrawTankChassis() {
  var initialRoomScreenX = initialRoomView.offsetX + (initialRoomPlayer.x * initialRoomView.tileSize);
  var initialRoomScreenY = initialRoomView.offsetY + (initialRoomPlayer.y * initialRoomView.tileSize);
  var initialRoomTankWidth = initialRoomView.tileSize * 2;
  var initialRoomTankLength = initialRoomView.tileSize * 3;
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomTankX = Math.round(-initialRoomTankWidth / 2);
  var initialRoomTankY = Math.round(-initialRoomTankLength / 2);
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomBodyColor = initialRoomGraphicsLevel >= 2 ? "#4f8f4e" : "#f7f7f1";
  var initialRoomTreadColor = "#050505";
  var initialRoomAccentColor = initialRoomGraphicsLevel >= 2 ? "#2f5f35" : "#5f6670";

  initialRoomContext.save();
  initialRoomContext.translate(initialRoomScreenX, initialRoomScreenY);
  initialRoomContext.rotate(initialRoomPlayer.tankAngle + (Math.PI / 2));

  if (initialRoomTankBodyImage) {
    var initialRoomTankSpriteWidth = initialRoomView.tileSize * 3;
    var initialRoomTankSpriteX = Math.round(-initialRoomTankSpriteWidth / 2);

    if (initialRoomGraphicsLevel < 2) {
      initialRoomContext.filter = "grayscale(1)";
    }
    initialRoomContext.imageSmoothingEnabled = false;
    initialRoomContext.drawImage(
      initialRoomTankBodyImage,
      initialRoomTankSpriteX,
      initialRoomTankY,
      initialRoomTankSpriteWidth,
      initialRoomTankLength
    );
    initialRoomContext.restore();
    return;
  }

  initialRoomContext.fillStyle = initialRoomTreadColor;
  initialRoomContext.fillRect(initialRoomTankX, initialRoomTankY, initialRoomTankWidth, initialRoomTankLength);

  initialRoomContext.fillStyle = initialRoomBodyColor;
  initialRoomContext.fillRect(
    initialRoomTankX + (initialRoomPixelUnit * 2),
    initialRoomTankY + (initialRoomPixelUnit * 2),
    initialRoomTankWidth - (initialRoomPixelUnit * 4),
    initialRoomTankLength - (initialRoomPixelUnit * 4)
  );

  initialRoomContext.fillStyle = initialRoomAccentColor;
  initialRoomContext.fillRect(
    initialRoomTankX + (initialRoomTankWidth * 0.25),
    initialRoomTankY + (initialRoomTankLength * 0.32),
    initialRoomTankWidth * 0.5,
    initialRoomTankLength * 0.24
  );

  initialRoomContext.restore();
}

function initialRoomDrawTankCannon(initialRoomTankY, initialRoomPixelUnit) {
  var initialRoomCannonLength = initialRoomView.tileSize;
  var initialRoomCannonWidth = initialRoomPixelUnit * 3;

  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(
    Math.round(-initialRoomCannonWidth / 2),
    Math.round(initialRoomTankY - initialRoomCannonLength),
    Math.ceil(initialRoomCannonWidth),
    Math.ceil(initialRoomCannonLength)
  );
}

function initialRoomDrawTankTurret(initialRoomScreenX, initialRoomScreenY, initialRoomPixelUnit) {
  var initialRoomTurretAngle = Math.atan2(initialRoomMouse.y - initialRoomScreenY, initialRoomMouse.x - initialRoomScreenX);
  var initialRoomTurretRadius = initialRoomView.tileSize * 0.34;
  var initialRoomBarrelLength = initialRoomView.tileSize * 1.05;
  var initialRoomBarrelWidth = initialRoomPixelUnit * 4;
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomTurretColor = initialRoomGraphicsLevel >= 2 ? "#6fac5a" : "#f7f7f1";
  var initialRoomTurretWidth = initialRoomView.tileSize * 3;
  var initialRoomTurretLength = initialRoomView.tileSize * 3;

  initialRoomContext.save();
  initialRoomContext.translate(initialRoomScreenX, initialRoomScreenY);
  initialRoomContext.rotate(initialRoomTurretAngle + (Math.PI / 2));

  if (initialRoomTankTurretImage) {
    if (initialRoomGraphicsLevel < 2) {
      initialRoomContext.filter = "grayscale(1)";
    }
    initialRoomContext.imageSmoothingEnabled = false;
    initialRoomContext.drawImage(
      initialRoomTankTurretImage,
      Math.round(-initialRoomTurretWidth / 2),
      Math.round(-initialRoomTurretLength / 2),
      initialRoomTurretWidth,
      initialRoomTurretLength
    );
    initialRoomContext.restore();
    return;
  }

  initialRoomContext.rotate(-(Math.PI / 2));

  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(0, Math.round(-initialRoomBarrelWidth / 2), Math.ceil(initialRoomBarrelLength), Math.ceil(initialRoomBarrelWidth));

  initialRoomContext.fillStyle = initialRoomTurretColor;
  initialRoomContext.fillRect(
    Math.round(-initialRoomTurretRadius),
    Math.round(-initialRoomTurretRadius),
    Math.ceil(initialRoomTurretRadius * 2),
    Math.ceil(initialRoomTurretRadius * 2)
  );

  initialRoomContext.restore();
}

function initialRoomDrawTankTurretOverlay() {
  if (!initialRoomHasTankForm() || !initialRoomShouldDrawPlayer()) {
    return;
  }

  initialRoomDrawTankTurret(
    initialRoomView.offsetX + (initialRoomPlayer.x * initialRoomView.tileSize),
    initialRoomView.offsetY + (initialRoomPlayer.y * initialRoomView.tileSize),
    initialRoomGetPixelUnit()
  );
}

function initialRoomShouldDrawPlayer() {
  var initialRoomNow = Date.now();

  if (initialRoomIsInvisibleTrapActive()) {
    return false;
  }

  if (initialRoomHasTankForm()) {
    return true;
  }

  if (initialRoomNow >= initialRoomPlayer.invulnerableUntil) {
    return true;
  }

  return Math.floor(initialRoomNow / 100) % 2 === 0;
}

function initialRoomDrawPlayerSprite() {
  var initialRoomFrameInfo = initialRoomGetPlayerSpriteFrame();
  var initialRoomImage = initialRoomFrameInfo.image;
  var initialRoomScreenX = initialRoomView.offsetX + (initialRoomPlayer.x * initialRoomView.tileSize);
  var initialRoomScreenY = initialRoomView.offsetY + (initialRoomPlayer.y * initialRoomView.tileSize);
  var initialRoomSpriteSize = initialRoomView.tileSize;
  var initialRoomSpriteX = Math.round(initialRoomScreenX - (initialRoomSpriteSize / 2));
  var initialRoomSpriteY = Math.round(initialRoomScreenY - (initialRoomSpriteSize / 2));

  if (!initialRoomImage) {
    initialRoomDrawPlayerCircle();
    return;
  }

  initialRoomContext.save();

  if (initialRoomGetGraphicsLevel() === 1) {
    initialRoomContext.filter = "grayscale(1)";
  }

  if (initialRoomFrameInfo.flipX) {
    initialRoomContext.translate(initialRoomSpriteX + initialRoomSpriteSize, initialRoomSpriteY);
    initialRoomContext.scale(-1, 1);
    initialRoomContext.drawImage(initialRoomImage, 0, 0, initialRoomSpriteSize, initialRoomSpriteSize);
  } else {
    initialRoomContext.drawImage(initialRoomImage, initialRoomSpriteX, initialRoomSpriteY, initialRoomSpriteSize, initialRoomSpriteSize);
  }

  initialRoomContext.restore();
}

function initialRoomDrawPlayerCircle() {
  var initialRoomGraphicsLevel = globalsState.progression.graphicsLevel;

  globalsState.progression.graphicsLevel = 0;
  initialRoomDrawPlayer();
  globalsState.progression.graphicsLevel = initialRoomGraphicsLevel;
}

function initialRoomGetPlayerSpriteFrame() {
  var initialRoomDirectionKey = initialRoomGetPlayerSpriteDirectionKey();
  var initialRoomFrameKey = initialRoomGetPlayerSpriteFrameKey();
  var initialRoomDirectionImages = initialRoomPlayerImages[initialRoomDirectionKey] || initialRoomPlayerImages.down || {};

  return {
    image: initialRoomDirectionImages[initialRoomFrameKey] || initialRoomDirectionImages.neutral,
    flipX: initialRoomDirectionKey === "side" && initialRoomPlayer.facingDirection.x < 0
  };
}

function initialRoomGetPlayerSpriteDirectionKey() {
  if (initialRoomPlayer.facingDirection.y < 0) {
    return "up";
  }

  if (initialRoomPlayer.facingDirection.x !== 0) {
    return "side";
  }

  return "down";
}

function initialRoomGetPlayerSpriteFrameKey() {
  if (!initialRoomIsPlayerMoving()) {
    return "neutral";
  }

  if (initialRoomGetGraphicsLevel() === 1) {
    var initialRoomStepFrame = Math.floor(Date.now() / initialRoomMonochromePlayerFrameDuration) % 2;

    return initialRoomStepFrame === 1 ? "step1" : "neutral";
  }

  return initialRoomGetColorPlayerFrameKey();
}

function initialRoomIsPlayerMoving() {
  return Boolean(initialRoomPlayer.moveDirection || initialRoomGetInputDirection());
}

function initialRoomGetColorPlayerFrameKey() {
  var initialRoomFrameIndex = Math.floor(Date.now() / initialRoomColorPlayerFrameDuration) % 3;

  if (initialRoomFrameIndex === 1) {
    return "step1";
  }

  if (initialRoomFrameIndex === 2) {
    return "step2";
  }

  return "neutral";
}

function initialRoomDrawPlayerInterior(initialRoomRadius, initialRoomPixelUnit, initialRoomCellCount, initialRoomBorderWidth, initialRoomOriginX, initialRoomOriginY, initialRoomScreenX, initialRoomScreenY) {
  var initialRoomInteriorRadius = initialRoomRadius - initialRoomBorderWidth;
  var initialRoomCellY = 0;

  initialRoomContext.fillStyle = "#f7f7f1";

  while (initialRoomCellY < initialRoomCellCount) {
    var initialRoomCellX = 0;
    var initialRoomRunStart = null;

    while (initialRoomCellX < initialRoomCellCount) {
      var initialRoomCellCenterX = initialRoomOriginX + ((initialRoomCellX + 0.5) * initialRoomPixelUnit) - initialRoomScreenX;
      var initialRoomCellCenterY = initialRoomOriginY + ((initialRoomCellY + 0.5) * initialRoomPixelUnit) - initialRoomScreenY;
      var initialRoomIsInterior = Math.sqrt((initialRoomCellCenterX * initialRoomCellCenterX) + (initialRoomCellCenterY * initialRoomCellCenterY)) <= initialRoomInteriorRadius;

      if (initialRoomIsInterior && initialRoomRunStart === null) {
        initialRoomRunStart = initialRoomCellX;
      }

      if ((!initialRoomIsInterior || initialRoomCellX === initialRoomCellCount - 1) && initialRoomRunStart !== null) {
        var initialRoomRunEnd = initialRoomIsInterior && initialRoomCellX === initialRoomCellCount - 1 ? initialRoomCellX + 1 : initialRoomCellX;

        initialRoomContext.fillRect(
          initialRoomOriginX + (initialRoomRunStart * initialRoomPixelUnit),
          initialRoomOriginY + (initialRoomCellY * initialRoomPixelUnit),
          (initialRoomRunEnd - initialRoomRunStart) * initialRoomPixelUnit,
          initialRoomPixelUnit
        );
        initialRoomRunStart = null;
      }

      initialRoomCellX += 1;
    }

    initialRoomCellY += 1;
  }
}

function initialRoomGetPixelUnit() {
  return Math.max(1, Math.round(initialRoomView.tileSize / initialRoomPixelUnitDivisor));
}

function initialRoomGetMessagePixelUnit() {
  if (initialRoomFinalRunState.active) {
    return Math.max(2, Math.round(Math.min(initialRoomMessageCanvas.width, initialRoomMessageCanvas.height) / 240));
  }

  return initialRoomGetPixelUnit();
}

function initialRoomLoadFont() {
  if (!window.FontFace || !document.fonts) {
    return;
  }

  var initialRoomFont = new FontFace(initialRoomFontFamily, "url('src/font/Perfect DOS VGA 437.ttf')");

  initialRoomFont.load().then(function (initialRoomLoadedFont) {
    document.fonts.add(initialRoomLoadedFont);
  }).catch(function () {
  });
}

function initialRoomUpdateMessageFeed() {
  if (initialRoomIsTextEntryActive) {
    return;
  }

  var initialRoomNow = Date.now();

  if (initialRoomCurrentMessage && initialRoomMessageQueue.length === 0 && initialRoomNow - initialRoomCurrentMessageStartTime >= initialRoomMessageDuration) {
    initialRoomCurrentMessage = "";
  }
}

function initialRoomIsOnlineModeActive() {
  return Boolean(globalsState.archipelago.connected && globalsState.archipelago.socket);
}

function initialRoomIsSlotOptionEnabled(initialRoomSnakeKey, initialRoomCamelKey) {
  var initialRoomSlotData = globalsState.archipelago.slotData || {};

  if (Object.prototype.hasOwnProperty.call(initialRoomSlotData, initialRoomSnakeKey)) {
    return Boolean(initialRoomSlotData[initialRoomSnakeKey]);
  }

  if (Object.prototype.hasOwnProperty.call(initialRoomSlotData, initialRoomCamelKey)) {
    return Boolean(initialRoomSlotData[initialRoomCamelKey]);
  }

  return false;
}

function initialRoomIsDeathLinkEnabled() {
  return initialRoomIsSlotOptionEnabled("death_link", "deathLink");
}

function initialRoomIsEnergyLinkEnabled() {
  return initialRoomIsSlotOptionEnabled("energy_link", "energyLink");
}

function initialRoomIsRingLinkEnabled() {
  return initialRoomIsSlotOptionEnabled("ring_link", "ringLink");
}

function initialRoomIsTrapLinkEnabled() {
  return initialRoomIsSlotOptionEnabled("trap_link", "trapLink");
}

function initialRoomWithSuppressedLinkBroadcast(initialRoomCallback) {
  var initialRoomPreviousSuppressLinkBroadcast = initialRoomSuppressLinkBroadcast;

  initialRoomSuppressLinkBroadcast = true;
  try {
    initialRoomCallback();
  } finally {
    initialRoomSuppressLinkBroadcast = initialRoomPreviousSuppressLinkBroadcast;
  }
}

function initialRoomBroadcastLinkedPickup(initialRoomRewardKey, initialRoomAmount, initialRoomEventId) {
  var initialRoomPayload = { amount: initialRoomAmount || 1 };

  if (initialRoomSuppressLinkBroadcast || !initialRoomIsOnlineModeActive()) {
    return;
  }

  if (initialRoomEventId) {
    initialRoomPayload.eventId = initialRoomEventId;
  }

  if ((initialRoomRewardKey === "potion" || initialRoomRewardKey === "energyGem") && initialRoomIsEnergyLinkEnabled()) {
    if (typeof initialRoomPlayer !== "undefined") {
      initialRoomPlayer.energy = Math.max(0, initialRoomPlayer.energy - (Number(initialRoomPayload.amount) || 1));
    }

    if (typeof archipelagoClientSendEnergyLinkAdd === "function") {
      archipelagoClientSendEnergyLinkAdd(Number(initialRoomPayload.amount) || 1);
    }
    return;
  }

  if ((initialRoomRewardKey === "moneybag" || initialRoomRewardKey === "roundPouch" || initialRoomRewardKey === "roundsPickup") && initialRoomIsRingLinkEnabled()) {
    initialRoomPayload.amount = initialRoomAmount || 5;
    if (typeof archipelagoClientConnectionId !== "undefined") {
      initialRoomPayload.source = archipelagoClientConnectionId;
    }
    archipelagoClientSendBounce("RingLink", initialRoomPayload);
    return;
  }

}

function initialRoomSpendRounds(initialRoomAmount, initialRoomReason) {
  var initialRoomSpendAmount = Math.max(0, Number(initialRoomAmount) || 0);
  var initialRoomEventId = "";

  if (initialRoomSpendAmount <= 0) {
    return false;
  }

  if (initialRoomPlayer.rounds < initialRoomSpendAmount) {
    return false;
  }

  initialRoomPlayer.rounds -= initialRoomSpendAmount;

  if (initialRoomIsRingLinkEnabled() && !initialRoomSuppressLinkBroadcast && initialRoomIsOnlineModeActive()) {
    initialRoomEventId = "ring-spend:" + (initialRoomReason || "rounds") + ":" + Date.now() + ":" + Math.random().toString(36).slice(2);
    initialRoomBroadcastLinkedPickup("moneybag", -initialRoomSpendAmount, initialRoomEventId);
  }

  return true;
}

function initialRoomReceiveLinkedPickup(initialRoomRewardKey, initialRoomAmount) {
  var initialRoomLinkedAmount = Number(initialRoomAmount);

  if (!initialRoomRewardKey) {
    return;
  }

  if (!Number.isFinite(initialRoomLinkedAmount)) {
    initialRoomLinkedAmount = 1;
  }

  initialRoomWithSuppressedLinkBroadcast(function () {
    if (initialRoomRewardKey === "potion" || initialRoomRewardKey === "energyGem") {
      if (!initialRoomIsEnergyLinkEnabled()) {
        return;
      }

      initialRoomSyncPlayerResourceMaxes();
      initialRoomPlayer.energy += initialRoomAmount || 1;
      initialRoomShowPickupIcon("potion");
      return;
    }

    if (initialRoomRewardKey === "moneybag" || initialRoomRewardKey === "roundPouch" || initialRoomRewardKey === "roundsPickup") {
      var initialRoomRoundAmount = Number(initialRoomAmount);

      if (!initialRoomIsRingLinkEnabled()) {
        return;
      }

      if (!Number.isFinite(initialRoomRoundAmount)) {
        initialRoomRoundAmount = 5;
      }

      initialRoomSyncPlayerResourceMaxes();
      initialRoomPlayer.rounds = Math.max(0, Math.min(initialRoomPlayer.maxRounds, initialRoomPlayer.rounds + initialRoomRoundAmount));
      if (initialRoomRoundAmount > 0) {
        initialRoomShowPickupIcon("moneybag");
      }
      return;
    }

    if (initialRoomRewardKey === "health" || initialRoomRewardKey === "healthPotion" || initialRoomRewardKey === "healthPickup") {
      return;
    }
  });
}

function initialRoomGetTrapLinkName(initialRoomTrapKey) {
  var initialRoomTrapDefinition = globalsState.checkDefinitions[initialRoomTrapKey];

  if (!initialRoomTrapDefinition || !initialRoomTrapDefinition.trap) {
    return "";
  }

  return initialRoomTrapDefinition.label || initialRoomTrapDefinition.name || "";
}

function initialRoomGetTrapLinkKey(initialRoomTrapName) {
  var initialRoomTrapAliases = {
    "Banana Trap": "trapStun",
    "Banana Peel Trap": "trapStun",
    "Bonk Trap": "trapStun",
    "Camera Rotate Trap": "trapScreenFlip",
    "Chaos Trap": "trapReverse",
    "Chaos Control Trap": "trapStun",
    "Clear Image Trap": "trapInvisible",
    "Confound Trap": "trapReverse",
    "Confuse Trap": "trapReverse",
    "Confusion Trap": "trapReverse",
    "Controller Drift Trap": "trapReverse",
    "Cutscene Trap": "trapScreenFlip",
    "Damage Trap": "trapDeath",
    "Deisometric Trap": "trapScreenFlip",
    "Double Damage": "trapDeath",
    "Dry Trap": "trapSlow",
    "Enemy Ball Trap": "suddenlySnake",
    "Explosion Trap": "trapDeath",
    "Exposition Trap": "trapScreenFlip",
    "Extreme Chaos Mode": "trapReverse",
    "Fast Trap": "trapFast",
    "Fish Eye Trap": "trapZoom",
    "Flip Horizontal Trap": "trapScreenFlip",
    "Flip Trap": "trapScreenFlip",
    "Flip Vertical Trap": "trapScreenFlip",
    "Frost Trap": "trapStun",
    "Freeze Trap": "trapStun",
    "Frozen Trap": "trapStun",
    "Fuzzy Trap": "trapReverse",
    "Gravity Trap": "trapSlow",
    "Honey Trap": "trapStun",
    "Ice Floor Trap": "trapStun",
    "Ice Trap": "trapStun",
    "Input Sequence Trap": "trapReverse",
    "Instant Death Trap": "trapDeath",
    "Invert Colors Trap": "trapScreenFlip",
    "Inverted Mouse Trap": "trapReverse",
    "Literature Trap": "trapScreenFlip",
    "Math Quiz Trap": "trapStun",
    "No Guarding": "trapStun",
    "One Hit KO": "trapDeath",
    "Paralyze Trap": "trapStun",
    "Paralysis Trap": "trapStun",
    "Police Trap": "suddenlySnake",
    "Poison Trap": "trapDeath",
    "Reverse Trap": "trapReverse",
    "Reverse Controls Trap": "trapReverse",
    "Reversal Trap": "trapReverse",
    "Screen Flip Trap": "trapScreenFlip",
    "Shake Trap": "trapStun",
    "Slow Trap": "trapSlow",
    "Slowness Trap": "trapSlow",
    "Snake Trap": "suddenlySnake",
    "Space Trap": "trapZoom",
    "Sticky Floor Trap": "trapSlow",
    "Sticky Hands Trap": "trapSlow",
    "Stun Trap": "trapStun",
    "Thwimp Trap": "suddenlySnake",
    "Time Limit": "trapFast",
    "Time Warp Trap": "trapFast",
    "Timer Trap": "trapFast",
    "Tiny Trap": "trapZoom",
    "Toxin Trap": "trapDeath",
    "Whirlpool Trap": "trapSlow",
    "W I D E Trap": "trapZoom",
    "Zoom In Trap": "trapZoom",
    "Zoom Out Trap": "trapZoom"
  };
  var initialRoomTrapKey = "";

  if (!initialRoomTrapName) {
    return "";
  }

  if (globalsState.checkDefinitions[initialRoomTrapName] && globalsState.checkDefinitions[initialRoomTrapName].trap) {
    return initialRoomTrapName;
  }

  if (initialRoomTrapAliases[initialRoomTrapName]) {
    return initialRoomTrapAliases[initialRoomTrapName];
  }

  Object.keys(globalsState.checkDefinitions).some(function (initialRoomCheckKey) {
    var initialRoomCheckDefinition = globalsState.checkDefinitions[initialRoomCheckKey];

    if (initialRoomCheckDefinition && initialRoomCheckDefinition.trap && initialRoomCheckDefinition.label === initialRoomTrapName) {
      initialRoomTrapKey = initialRoomCheckKey;
      return true;
    }

    return false;
  });

  return initialRoomTrapKey;
}

function initialRoomBroadcastTrapLink(initialRoomTrapKey, initialRoomEventId) {
  var initialRoomTrapName = initialRoomGetTrapLinkName(initialRoomTrapKey);
  var initialRoomPayload = { trap_name: initialRoomTrapName };

  if (!initialRoomTrapName || initialRoomSuppressLinkBroadcast || !initialRoomIsOnlineModeActive() || !initialRoomIsTrapLinkEnabled()) {
    return;
  }

  if (initialRoomEventId) {
    initialRoomPayload.eventId = initialRoomEventId;
  }

  archipelagoClientSendBounce("TrapLink", initialRoomPayload);
}

function initialRoomReceiveTrapLink(initialRoomTrapName) {
  var initialRoomTrapKey = initialRoomGetTrapLinkKey(initialRoomTrapName);

  if (!initialRoomTrapKey || !initialRoomIsTrapLinkEnabled()) {
    return;
  }

  initialRoomWithSuppressedLinkBroadcast(function () {
    initialRoomApplyTrap(initialRoomTrapKey);
  });
}

function initialRoomBroadcastDeathLink() {
  var initialRoomDeathLinkEventId = "";
  var initialRoomDeathLinkCause = "";

  if (initialRoomSuppressLinkBroadcast || !initialRoomIsOnlineModeActive() || !initialRoomIsDeathLinkEnabled()) {
    return;
  }

  initialRoomDeathLinkEventId = "death:" + (globalsState.archipelago.slotId || globalsState.archipelago.slot || "slot") + ":" + Date.now();
  initialRoomDeathLinkCause = initialRoomGetDeathLinkCause();

  if (!archipelagoClientSendDeathLink(initialRoomDeathLinkCause, initialRoomDeathLinkEventId) && isDebug) {
    console.warn("DeathLink was enabled, but the client could not send it.");
    return;
  }

  if (isDebug) {
    console.log("Sent DeathLink: " + initialRoomDeathLinkCause);
  }
}

function initialRoomGetDeathLinkCause() {
  var initialRoomPlayerName = globalsState.archipelago.slot || "A player";
  var initialRoomDeathMessages = {
    snake: " was bit by a venomous snake",
    tank: " ran out of metal on the bottom of their tank",
    redSlime: " stepped in red slime",
    negaSlime: " couldn't outrun the nega slime",
    wizardShot: " was shot by a wizard",
    wizardContact: " stepped in a wizard",
    bomb: " forgot to read the manual on bombs",
    finalRunFace: " was unable to click on face"
  };

  return initialRoomPlayerName + (initialRoomDeathMessages[initialRoomLastDeathReason] || " died in Shellipelago");
}

function initialRoomReceiveDeathLink(initialRoomDeathLinkData) {
  var initialRoomDeathLinkCause = initialRoomDeathLinkData && initialRoomDeathLinkData.cause;

  if (!initialRoomIsDeathLinkEnabled()) {
    return;
  }

  initialRoomWithSuppressedLinkBroadcast(function () {
    if (initialRoomDeathLinkCause) {
      initialRoomQueueMessage(initialRoomDeathLinkCause, { fromServer: true });
    }

    initialRoomKillPlayer("deathLink");
  });
}

function initialRoomQueueMessage(initialRoomMessage, initialRoomOptions) {
  if (!initialRoomMessage) {
    return;
  }

  var initialRoomMessageOptions = initialRoomOptions || {};

  if (
    initialRoomIsOnlineModeActive() &&
    !initialRoomMessageOptions.fromServer &&
    !initialRoomMessageOptions.allowOnlineLocal
  ) {
    return;
  }

  initialRoomMessageHistory.push(initialRoomMessage);
  if (initialRoomAreMessagePopupsMuted && !initialRoomIsTextEntryActive) {
    initialRoomMessageLogPulseUntil = Date.now() + 900;
    initialRoomPlaySfx("message");
    return;
  }

  initialRoomCurrentMessage = initialRoomMessage;
  initialRoomCurrentMessageFlipped = initialRoomTrapState.flipMessagesRemaining > 0 && !initialRoomIsTextEntryActive;
  if (initialRoomCurrentMessageFlipped) {
    initialRoomTrapState.flipMessagesRemaining -= 1;
  }
  initialRoomCurrentMessageStartTime = Date.now();
  initialRoomMessageQueue = [];
  initialRoomPlaySfx("message");
}

function initialRoomShowNextQueuedMessage() {
  initialRoomCurrentMessage = initialRoomMessageQueue.shift() || "";
  initialRoomCurrentMessageFlipped = initialRoomTrapState.flipMessagesRemaining > 0 && Boolean(initialRoomCurrentMessage);
  initialRoomCurrentMessageStartTime = Date.now();

  if (initialRoomCurrentMessageFlipped) {
    initialRoomTrapState.flipMessagesRemaining -= 1;
  }
}

function initialRoomDrawMessageFeed() {
  initialRoomMessageContext.clearRect(0, 0, initialRoomMessageCanvas.width, initialRoomMessageCanvas.height);

  if (initialRoomIsMapOpen || initialRoomIsStatusOpen || initialRoomIsMessageLogOpen || (initialRoomAreMessagePopupsMuted && !initialRoomIsTextEntryActive) || (!initialRoomCurrentMessage && !initialRoomIsTextEntryActive)) {
    return;
  }

  var initialRoomPixelUnit = initialRoomGetMessagePixelUnit();
  var initialRoomBoxMargin = initialRoomPixelUnit * 4;
  var initialRoomBoxPadding = initialRoomPixelUnit * 3;
  var initialRoomBoxHeight = initialRoomPixelUnit * 28;
  var initialRoomBoxX = initialRoomBoxMargin;
  var initialRoomBoxY = initialRoomMessageCanvas.height - initialRoomBoxHeight - initialRoomBoxMargin;
  var initialRoomBoxWidth = initialRoomMessageCanvas.width - (initialRoomBoxMargin * 2);
  var initialRoomFontSize = Math.max(32, initialRoomPixelUnit * 8);

  initialRoomMessageContext.fillStyle = "#050505";
  initialRoomMessageContext.fillRect(initialRoomBoxX, initialRoomBoxY, initialRoomBoxWidth, initialRoomBoxHeight);
  initialRoomMessageContext.fillStyle = "#f7f7f1";
  initialRoomMessageContext.fillRect(
    initialRoomBoxX + initialRoomPixelUnit,
    initialRoomBoxY + initialRoomPixelUnit,
    initialRoomBoxWidth - (initialRoomPixelUnit * 2),
    initialRoomBoxHeight - (initialRoomPixelUnit * 2)
  );
  initialRoomMessageContext.fillStyle = "#191b20";
  initialRoomMessageContext.fillRect(
    initialRoomBoxX + (initialRoomPixelUnit * 2),
    initialRoomBoxY + (initialRoomPixelUnit * 2),
    initialRoomBoxWidth - (initialRoomPixelUnit * 4),
    initialRoomBoxHeight - (initialRoomPixelUnit * 4)
  );

  initialRoomMessageContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomMessageContext.fillStyle = "#f7f7f1";
  initialRoomMessageContext.textBaseline = "top";
  initialRoomDrawWrappedMessage(
    initialRoomMessageContext,
    initialRoomIsTextEntryActive ? "> " + initialRoomTextEntryValue + "_" : initialRoomCurrentMessage,
    initialRoomBoxX + initialRoomBoxPadding,
    initialRoomBoxY + initialRoomBoxPadding,
    initialRoomBoxWidth - (initialRoomBoxPadding * 2),
    initialRoomFontSize + initialRoomPixelUnit
  );
}

function initialRoomDrawWrappedMessage(initialRoomDrawContext, initialRoomMessage, initialRoomX, initialRoomY, initialRoomMaxWidth, initialRoomLineHeight) {
  if (initialRoomCurrentMessageFlipped && !initialRoomIsTextEntryActive) {
    initialRoomDrawContext.save();
    initialRoomDrawContext.translate(initialRoomDrawContext.canvas.width, 0);
    initialRoomDrawContext.scale(-1, 1);
    initialRoomDrawWrappedMessageLines(initialRoomDrawContext, initialRoomMessage, initialRoomDrawContext.canvas.width - initialRoomX - initialRoomMaxWidth, initialRoomY, initialRoomMaxWidth, initialRoomLineHeight);
    initialRoomDrawContext.restore();
    return;
  }

  initialRoomDrawWrappedMessageLines(initialRoomDrawContext, initialRoomMessage, initialRoomX, initialRoomY, initialRoomMaxWidth, initialRoomLineHeight);
}

function initialRoomDrawWrappedMessageLines(initialRoomDrawContext, initialRoomMessage, initialRoomX, initialRoomY, initialRoomMaxWidth, initialRoomLineHeight) {
  var initialRoomWords = initialRoomMessage.split(" ");
  var initialRoomLine = "";
  var initialRoomIndex = 0;

  while (initialRoomIndex < initialRoomWords.length) {
    var initialRoomTestLine = initialRoomLine ? initialRoomLine + " " + initialRoomWords[initialRoomIndex] : initialRoomWords[initialRoomIndex];

    if (initialRoomDrawContext.measureText(initialRoomTestLine).width > initialRoomMaxWidth && initialRoomLine) {
      initialRoomDrawContext.fillText(initialRoomLine, initialRoomX, initialRoomY);
      initialRoomLine = initialRoomWords[initialRoomIndex];
      initialRoomY += initialRoomLineHeight;
    } else {
      initialRoomLine = initialRoomTestLine;
    }

    initialRoomIndex += 1;
  }

  if (initialRoomLine) {
    initialRoomDrawContext.fillText(initialRoomLine, initialRoomX, initialRoomY);
  }
}

function initialRoomDrawHud() {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomMargin = initialRoomPixelUnit * 4;
  var initialRoomBarWidth = Math.min(initialRoomCanvas.width * 0.42, initialRoomPixelUnit * 96);
  var initialRoomBarHeight = initialRoomPixelUnit * 8;
  var initialRoomLabelWidth = initialRoomPixelUnit * 13;
  var initialRoomHudFontSize = Math.max(28, initialRoomPixelUnit * 7);
  var initialRoomEffectiveMaxHp = initialRoomGetEffectiveMaxHp();
  var initialRoomHpPercent = initialRoomEffectiveMaxHp > 0 ? Math.max(0, Math.min(1, initialRoomPlayer.hp / initialRoomEffectiveMaxHp)) : 0;
  var initialRoomReadoutX = initialRoomMargin + initialRoomLabelWidth + initialRoomBarWidth + (initialRoomPixelUnit * 5);
  var initialRoomReadoutY = initialRoomMargin + (initialRoomBarHeight / 2);
  var initialRoomReadoutGap = initialRoomPixelUnit * 34;

  initialRoomSyncPlayerResourceMaxes();

  initialRoomContext.save();
  initialRoomContext.font = initialRoomHudFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textBaseline = "middle";
  initialRoomContext.lineJoin = "round";
  initialRoomContext.lineWidth = Math.max(2, initialRoomPixelUnit);

  initialRoomDrawOutlinedHudText("HP", initialRoomMargin, initialRoomReadoutY);
  initialRoomContext.fillRect(initialRoomMargin + initialRoomLabelWidth, initialRoomMargin, initialRoomBarWidth, initialRoomBarHeight);

  initialRoomContext.fillStyle = initialRoomGetHudHpFillColor();
  initialRoomContext.fillRect(
    initialRoomMargin + initialRoomLabelWidth + initialRoomPixelUnit,
    initialRoomMargin + initialRoomPixelUnit,
    Math.max(0, (initialRoomBarWidth - (initialRoomPixelUnit * 2)) * initialRoomHpPercent),
    initialRoomBarHeight - (initialRoomPixelUnit * 2)
  );

  initialRoomDrawOutlinedHudText("E " + initialRoomPlayer.energy, initialRoomReadoutX, initialRoomReadoutY);
  initialRoomReadoutX += initialRoomReadoutGap;

  if (initialRoomPlayer.maxRounds > 0) {
    initialRoomDrawOutlinedHudText("R " + initialRoomPlayer.rounds + "/" + initialRoomPlayer.maxRounds, initialRoomReadoutX, initialRoomReadoutY);
  }

  initialRoomContext.restore();
}

function initialRoomGetHudHpFillColor() {
  if (!initialRoomHasTankForm()) {
    return initialRoomGetGraphicsLevel() >= 2 ? "#48c463" : "#f7f7f1";
  }

  if (initialRoomGetGraphicsLevel() >= 2) {
    return "#4e8dff";
  }

  return initialRoomGetGraphicsLevel() === 1 ? "#8f949d" : "#f7f7f1";
}

function initialRoomSyncPlayerResourceMaxes() {
  initialRoomPlayer.maxHp = 1 + progressionManagerGetProgressiveValue("hp");
  initialRoomPlayer.maxEnergy = 0;
  initialRoomPlayer.maxRounds = (progressionManagerGetProgressiveValue("rounds") * 2) + initialRoomGetWeaponGrantedMaxRounds();
  initialRoomPlayer.hp = Math.min(initialRoomPlayer.hp, initialRoomGetEffectiveMaxHp());
  initialRoomPlayer.rounds = Math.min(initialRoomPlayer.rounds, initialRoomPlayer.maxRounds);
}

function initialRoomGetWeaponGrantedMaxRounds() {
  var initialRoomWeaponRoundBonus = 0;

  if (progressionManagerGetProgressiveValue("bomb") > 0) {
    initialRoomWeaponRoundBonus += 5;
  }

  if (progressionManagerGetProgressiveValue("gun") > 0) {
    initialRoomWeaponRoundBonus += 5;
  }

  return initialRoomWeaponRoundBonus;
}

function initialRoomGetEffectiveMaxHp() {
  if (initialRoomHasTankForm()) {
    return Math.max(1, Math.ceil(initialRoomPlayer.maxHp / 2));
  }

  return initialRoomPlayer.maxHp;
}

function initialRoomDrawOutlinedHudText(initialRoomText, initialRoomX, initialRoomY) {
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.strokeText(initialRoomText, initialRoomX, initialRoomY);
  initialRoomContext.fillText(initialRoomText, initialRoomX, initialRoomY);
}

function initialRoomDrawPickupIcon() {
  var initialRoomNow = Date.now();

  if (!initialRoomPickupIcon || initialRoomGetGraphicsLevel() <= 0 || initialRoomNow >= initialRoomPickupIcon.expiresAt) {
    if (initialRoomPickupIcon && initialRoomNow >= initialRoomPickupIcon.expiresAt) {
      initialRoomPickupIcon = null;
    }
    return;
  }

  var initialRoomImage = initialRoomPickupIconImages[initialRoomPickupIcon.iconKey];

  if (!initialRoomImage) {
    return;
  }

  var initialRoomSize = initialRoomView.tileSize;
  var initialRoomX = initialRoomView.offsetX + (initialRoomPlayer.x * initialRoomView.tileSize) - (initialRoomSize / 2);
  var initialRoomY = initialRoomView.offsetY + ((initialRoomPlayer.y - 0.92) * initialRoomView.tileSize) - (initialRoomSize / 2);

  initialRoomContext.save();
  if (initialRoomGetGraphicsLevel() === 1) {
    initialRoomContext.filter = "grayscale(1) contrast(1.35)";
  }
  initialRoomContext.drawImage(initialRoomImage, Math.round(initialRoomX), Math.round(initialRoomY), Math.ceil(initialRoomSize), Math.ceil(initialRoomSize));
  initialRoomContext.restore();
}

function initialRoomDrawMapOverlay() {
  if (!initialRoomIsMapOpen) {
    return;
  }

  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomUnlockedRing = globalsState.progression.progressiveRooms || 0;
  var initialRoomGridSize = (initialRoomUnlockedRing * 2) + 1;
  var initialRoomMaxOverlayWidth = initialRoomCanvas.width - (initialRoomPixelUnit * 16);
  var initialRoomMaxOverlayHeight = initialRoomCanvas.height - (initialRoomPixelUnit * 16);
  var initialRoomCellSize = Math.max(initialRoomPixelUnit * 6, Math.floor(Math.min(initialRoomMaxOverlayWidth, initialRoomMaxOverlayHeight) / initialRoomGridSize));
  var initialRoomMapSize = initialRoomCellSize * initialRoomGridSize;
  var initialRoomMapX = Math.floor((initialRoomCanvas.width - initialRoomMapSize) / 2);
  var initialRoomMapY = Math.floor((initialRoomCanvas.height - initialRoomMapSize) / 2);
  var initialRoomTitle = initialRoomGetCurrentRoomDisplayName();
  var initialRoomTitleFontSize = Math.max(24, initialRoomPixelUnit * 8);
  var initialRoomTitleY = Math.max(initialRoomPixelUnit * 4, initialRoomMapY - (initialRoomPixelUnit * 10));
  var initialRoomRoomY = -initialRoomUnlockedRing;
  var initialRoomHoveredRoom = null;

  initialRoomContext.save();
  initialRoomContext.fillStyle = "rgba(5, 5, 5, 0.82)";
  initialRoomContext.fillRect(0, 0, initialRoomCanvas.width, initialRoomCanvas.height);
  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(
    initialRoomMapX - (initialRoomPixelUnit * 2),
    initialRoomMapY - (initialRoomPixelUnit * 2),
    initialRoomMapSize + (initialRoomPixelUnit * 4),
    initialRoomMapSize + (initialRoomPixelUnit * 4)
  );

  while (initialRoomRoomY <= initialRoomUnlockedRing) {
    var initialRoomRoomX = -initialRoomUnlockedRing;

    while (initialRoomRoomX <= initialRoomUnlockedRing) {
      if (mapManagerIsRoomUnlocked(initialRoomRoomX, initialRoomRoomY)) {
        var initialRoomCellX = initialRoomMapX + ((initialRoomRoomX + initialRoomUnlockedRing) * initialRoomCellSize);
        var initialRoomCellY = initialRoomMapY + ((initialRoomRoomY + initialRoomUnlockedRing) * initialRoomCellSize);

        initialRoomDrawMapRoomCell(
          initialRoomRoomX,
          initialRoomRoomY,
          initialRoomCellX,
          initialRoomCellY,
          initialRoomCellSize,
          initialRoomPixelUnit
        );

        if (initialRoomMouse.x >= initialRoomCellX &&
          initialRoomMouse.x <= initialRoomCellX + initialRoomCellSize &&
          initialRoomMouse.y >= initialRoomCellY &&
          initialRoomMouse.y <= initialRoomCellY + initialRoomCellSize) {
          initialRoomHoveredRoom = initialRoomGetMapRoomDisplayName(initialRoomRoomX, initialRoomRoomY);
        }
      }

      initialRoomRoomX += 1;
    }

    initialRoomRoomY += 1;
  }

  initialRoomContext.font = initialRoomTitleFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textAlign = "center";
  initialRoomContext.textBaseline = "top";
  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(0, initialRoomTitleY - initialRoomPixelUnit, initialRoomCanvas.width, initialRoomTitleFontSize + (initialRoomPixelUnit * 2));
  initialRoomContext.strokeStyle = "#050505";
  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(2, initialRoomPixelUnit);
  initialRoomContext.strokeText(initialRoomTitle, initialRoomCanvas.width / 2, initialRoomTitleY);
  initialRoomContext.fillText(initialRoomTitle, initialRoomCanvas.width / 2, initialRoomTitleY);

  if (initialRoomHoveredRoom) {
    initialRoomDrawMapTooltip(initialRoomHoveredRoom, initialRoomPixelUnit);
  }

  initialRoomContext.restore();
}

function initialRoomGetCurrentRoomDisplayName() {
  if (!initialRoomCurrentRoom) {
    return "";
  }

  return initialRoomCurrentRoom.name || initialRoomCurrentRoom.id || ("Room " + initialRoomCurrentRoom.x + "," + initialRoomCurrentRoom.y);
}

function initialRoomGetMapRoomDisplayName(initialRoomRoomX, initialRoomRoomY) {
  var initialRoomRoom = mapManagerGetRoom(initialRoomRoomX, initialRoomRoomY);

  if (!initialRoomRoom) {
    return "Room " + initialRoomRoomX + "," + initialRoomRoomY;
  }

  return initialRoomRoom.name || initialRoomRoom.id || ("Room " + initialRoomRoomX + "," + initialRoomRoomY);
}

function initialRoomDrawMapTooltip(initialRoomText, initialRoomPixelUnit) {
  var initialRoomPadding = initialRoomPixelUnit * 2;
  var initialRoomFontSize = Math.max(16, initialRoomPixelUnit * 4);
  var initialRoomTooltipWidth = 0;
  var initialRoomTooltipHeight = initialRoomFontSize + (initialRoomPadding * 2);
  var initialRoomTooltipX = initialRoomMouse.x + (initialRoomPixelUnit * 3);
  var initialRoomTooltipY = initialRoomMouse.y + (initialRoomPixelUnit * 3);

  initialRoomContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomTooltipWidth = initialRoomContext.measureText(initialRoomText).width + (initialRoomPadding * 2);
  initialRoomTooltipX = Math.min(initialRoomTooltipX, initialRoomCanvas.width - initialRoomTooltipWidth - initialRoomPixelUnit);
  initialRoomTooltipY = Math.min(initialRoomTooltipY, initialRoomCanvas.height - initialRoomTooltipHeight - initialRoomPixelUnit);
  initialRoomTooltipX = Math.max(initialRoomPixelUnit, initialRoomTooltipX);
  initialRoomTooltipY = Math.max(initialRoomPixelUnit, initialRoomTooltipY);

  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(initialRoomTooltipX, initialRoomTooltipY, initialRoomTooltipWidth, initialRoomTooltipHeight);
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(1, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomTooltipX, initialRoomTooltipY, initialRoomTooltipWidth, initialRoomTooltipHeight);
  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.textAlign = "left";
  initialRoomContext.textBaseline = "top";
  initialRoomContext.fillText(initialRoomText, initialRoomTooltipX + initialRoomPadding, initialRoomTooltipY + initialRoomPadding);
}

function initialRoomDrawStatusOverlay() {
  if (!initialRoomIsStatusOpen) {
    return;
  }

  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomPanelX = initialRoomPixelUnit * 10;
  var initialRoomPanelY = initialRoomPixelUnit * 10;
  var initialRoomPanelWidth = initialRoomCanvas.width - (initialRoomPixelUnit * 20);
  var initialRoomPanelHeight = initialRoomCanvas.height - (initialRoomPixelUnit * 20);
  var initialRoomItems = initialRoomGetStatusProgressionItems();

  initialRoomContext.save();
  initialRoomContext.fillStyle = "rgba(5, 5, 5, 0.82)";
  initialRoomContext.fillRect(0, 0, initialRoomCanvas.width, initialRoomCanvas.height);
  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(initialRoomPanelX, initialRoomPanelY, initialRoomPanelWidth, initialRoomPanelHeight);
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(2, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomPanelX, initialRoomPanelY, initialRoomPanelWidth, initialRoomPanelHeight);
  initialRoomDrawStatusProgressionGrid(initialRoomItems, initialRoomPanelX, initialRoomPanelY, initialRoomPanelWidth, initialRoomPanelHeight, initialRoomPixelUnit);
  initialRoomContext.restore();
}

function initialRoomDrawMessageLogOverlay() {
  if (!initialRoomIsMessageLogOpen) {
    initialRoomMessageLogCloseRect = null;
    return;
  }

  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomPanelX = initialRoomPixelUnit * 10;
  var initialRoomPanelY = initialRoomPixelUnit * 10;
  var initialRoomPanelWidth = initialRoomCanvas.width - (initialRoomPixelUnit * 20);
  var initialRoomPanelHeight = initialRoomCanvas.height - (initialRoomPixelUnit * 20);
  var initialRoomPadding = initialRoomPixelUnit * 5;
  var initialRoomTitleFontSize = Math.max(26, initialRoomPixelUnit * 7);
  var initialRoomLineHeight = Math.max(18, initialRoomPixelUnit * 5);
  var initialRoomFontSize = Math.max(18, initialRoomPixelUnit * 4);
  var initialRoomInputHeight = initialRoomLineHeight * 2;
  var initialRoomCloseSize = Math.max(34, initialRoomPixelUnit * 10);
  var initialRoomTextX = initialRoomPanelX + initialRoomPadding;
  var initialRoomLogTop = initialRoomPanelY + initialRoomPadding + initialRoomTitleFontSize + initialRoomPixelUnit * 4;
  var initialRoomLogBottom = initialRoomPanelY + initialRoomPanelHeight - initialRoomPadding - initialRoomInputHeight - initialRoomPixelUnit * 3;
  var initialRoomVisibleLineCount = Math.max(1, Math.floor((initialRoomLogBottom - initialRoomLogTop) / initialRoomLineHeight));
  var initialRoomLines = initialRoomWrapMessagesForLog(initialRoomMessageHistory, initialRoomPanelWidth - (initialRoomPadding * 2), initialRoomFontSize);
  var initialRoomVisibleLines = initialRoomLines.slice(Math.max(0, initialRoomLines.length - initialRoomVisibleLineCount));
  var initialRoomLineIndex = 0;

  initialRoomContext.save();
  initialRoomContext.fillStyle = "rgba(5, 5, 5, 0.82)";
  initialRoomContext.fillRect(0, 0, initialRoomCanvas.width, initialRoomCanvas.height);
  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(initialRoomPanelX, initialRoomPanelY, initialRoomPanelWidth, initialRoomPanelHeight);
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(2, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomPanelX, initialRoomPanelY, initialRoomPanelWidth, initialRoomPanelHeight);

  initialRoomContext.font = initialRoomTitleFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textAlign = "left";
  initialRoomContext.textBaseline = "top";
  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.fillText("Message Log", initialRoomTextX, initialRoomPanelY + initialRoomPadding);

  initialRoomMessageLogCloseRect = {
    x: initialRoomPanelX + initialRoomPanelWidth - initialRoomPadding - initialRoomCloseSize,
    y: initialRoomPanelY + initialRoomPadding,
    width: initialRoomCloseSize,
    height: initialRoomCloseSize
  };
  initialRoomContext.strokeRect(initialRoomMessageLogCloseRect.x, initialRoomMessageLogCloseRect.y, initialRoomMessageLogCloseRect.width, initialRoomMessageLogCloseRect.height);
  initialRoomContext.textAlign = "center";
  initialRoomContext.textBaseline = "middle";
  initialRoomContext.fillText("X", initialRoomMessageLogCloseRect.x + initialRoomMessageLogCloseRect.width / 2, initialRoomMessageLogCloseRect.y + initialRoomMessageLogCloseRect.height / 2);

  initialRoomContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textAlign = "left";
  initialRoomContext.textBaseline = "top";
  while (initialRoomLineIndex < initialRoomVisibleLines.length) {
    initialRoomContext.fillText(initialRoomVisibleLines[initialRoomLineIndex], initialRoomTextX, initialRoomLogTop + (initialRoomLineIndex * initialRoomLineHeight));
    initialRoomLineIndex += 1;
  }

  initialRoomContext.strokeRect(initialRoomTextX, initialRoomLogBottom + initialRoomPixelUnit, initialRoomPanelWidth - (initialRoomPadding * 2), initialRoomInputHeight);
  initialRoomContext.fillText(
    initialRoomIsTextEntryActive ? "> " + initialRoomTextEntryValue + "_" : ">",
    initialRoomTextX + initialRoomPixelUnit * 2,
    initialRoomLogBottom + initialRoomPixelUnit * 2
  );
  initialRoomContext.restore();
}

function initialRoomDrawFinalRunMessageLogOverlay() {
  if (!initialRoomIsMessageLogOpen) {
    return;
  }

  initialRoomDrawMessageLogToContext(initialRoomMessageContext, initialRoomMessageCanvas.width, initialRoomMessageCanvas.height);
}

function initialRoomDrawMessageLogToContext(initialRoomDrawContext, initialRoomWidth, initialRoomHeight) {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomPanelX = initialRoomPixelUnit * 10;
  var initialRoomPanelY = initialRoomPixelUnit * 10;
  var initialRoomPanelWidth = initialRoomWidth - (initialRoomPixelUnit * 20);
  var initialRoomPanelHeight = initialRoomHeight - (initialRoomPixelUnit * 20);
  var initialRoomPadding = initialRoomPixelUnit * 5;
  var initialRoomTitleFontSize = Math.max(26, initialRoomPixelUnit * 7);
  var initialRoomLineHeight = Math.max(18, initialRoomPixelUnit * 5);
  var initialRoomFontSize = Math.max(18, initialRoomPixelUnit * 4);
  var initialRoomInputHeight = initialRoomLineHeight * 2;
  var initialRoomCloseSize = Math.max(34, initialRoomPixelUnit * 10);
  var initialRoomTextX = initialRoomPanelX + initialRoomPadding;
  var initialRoomLogTop = initialRoomPanelY + initialRoomPadding + initialRoomTitleFontSize + initialRoomPixelUnit * 4;
  var initialRoomLogBottom = initialRoomPanelY + initialRoomPanelHeight - initialRoomPadding - initialRoomInputHeight - initialRoomPixelUnit * 3;
  var initialRoomVisibleLineCount = Math.max(1, Math.floor((initialRoomLogBottom - initialRoomLogTop) / initialRoomLineHeight));
  var initialRoomLines = initialRoomWrapMessagesForLog(initialRoomMessageHistory, initialRoomPanelWidth - (initialRoomPadding * 2), initialRoomFontSize);
  var initialRoomVisibleLines = initialRoomLines.slice(Math.max(0, initialRoomLines.length - initialRoomVisibleLineCount));
  var initialRoomLineIndex = 0;

  initialRoomDrawContext.save();
  initialRoomDrawContext.fillStyle = "rgba(5, 5, 5, 0.82)";
  initialRoomDrawContext.fillRect(0, 0, initialRoomWidth, initialRoomHeight);
  initialRoomDrawContext.fillStyle = "#050505";
  initialRoomDrawContext.fillRect(initialRoomPanelX, initialRoomPanelY, initialRoomPanelWidth, initialRoomPanelHeight);
  initialRoomDrawContext.strokeStyle = "#f7f7f1";
  initialRoomDrawContext.lineWidth = Math.max(2, initialRoomPixelUnit);
  initialRoomDrawContext.strokeRect(initialRoomPanelX, initialRoomPanelY, initialRoomPanelWidth, initialRoomPanelHeight);
  initialRoomDrawContext.font = initialRoomTitleFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomDrawContext.textAlign = "left";
  initialRoomDrawContext.textBaseline = "top";
  initialRoomDrawContext.fillStyle = "#f7f7f1";
  initialRoomDrawContext.fillText("Message Log", initialRoomTextX, initialRoomPanelY + initialRoomPadding);
  initialRoomMessageLogCloseRect = {
    x: initialRoomPanelX + initialRoomPanelWidth - initialRoomPadding - initialRoomCloseSize,
    y: initialRoomPanelY + initialRoomPadding,
    width: initialRoomCloseSize,
    height: initialRoomCloseSize
  };
  initialRoomDrawContext.strokeRect(initialRoomMessageLogCloseRect.x, initialRoomMessageLogCloseRect.y, initialRoomMessageLogCloseRect.width, initialRoomMessageLogCloseRect.height);
  initialRoomDrawContext.textAlign = "center";
  initialRoomDrawContext.textBaseline = "middle";
  initialRoomDrawContext.fillText("X", initialRoomMessageLogCloseRect.x + initialRoomMessageLogCloseRect.width / 2, initialRoomMessageLogCloseRect.y + initialRoomMessageLogCloseRect.height / 2);
  initialRoomDrawContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomDrawContext.textAlign = "left";
  initialRoomDrawContext.textBaseline = "top";
  while (initialRoomLineIndex < initialRoomVisibleLines.length) {
    initialRoomDrawContext.fillText(initialRoomVisibleLines[initialRoomLineIndex], initialRoomTextX, initialRoomLogTop + (initialRoomLineIndex * initialRoomLineHeight));
    initialRoomLineIndex += 1;
  }
  initialRoomDrawContext.strokeRect(initialRoomTextX, initialRoomLogBottom + initialRoomPixelUnit, initialRoomPanelWidth - (initialRoomPadding * 2), initialRoomInputHeight);
  initialRoomDrawContext.fillText(
    initialRoomIsTextEntryActive ? "> " + initialRoomTextEntryValue + "_" : ">",
    initialRoomTextX + initialRoomPixelUnit * 2,
    initialRoomLogBottom + initialRoomPixelUnit * 2
  );
  initialRoomDrawContext.restore();
}

function initialRoomWrapMessagesForLog(initialRoomMessages, initialRoomMaxWidth, initialRoomFontSize) {
  var initialRoomLines = [];

  initialRoomContext.save();
  initialRoomContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomMessages.forEach(function (initialRoomMessage) {
    initialRoomLines = initialRoomLines.concat(initialRoomWrapMessageToLines(initialRoomMessage, initialRoomMaxWidth));
  });
  initialRoomContext.restore();

  return initialRoomLines.length > 0 ? initialRoomLines : ["No messages yet."];
}

function initialRoomWrapMessageToLines(initialRoomMessage, initialRoomMaxWidth) {
  var initialRoomWords = String(initialRoomMessage || "").split(" ");
  var initialRoomLines = [];
  var initialRoomLine = "";

  initialRoomWords.forEach(function (initialRoomWord) {
    var initialRoomTestLine = initialRoomLine ? initialRoomLine + " " + initialRoomWord : initialRoomWord;

    if (initialRoomContext.measureText(initialRoomTestLine).width > initialRoomMaxWidth && initialRoomLine) {
      initialRoomLines.push(initialRoomLine);
      initialRoomLine = initialRoomWord;
    } else {
      initialRoomLine = initialRoomTestLine;
    }
  });

  if (initialRoomLine) {
    initialRoomLines.push(initialRoomLine);
  }

  return initialRoomLines;
}

function initialRoomGetStatusProgressionItems() {
  return initialRoomStatusProgressionKeys.map(function (initialRoomCheckKey) {
    var initialRoomProgressiveDefinition = globalsState.progressiveCheckDefinitions[initialRoomCheckKey];
    var initialRoomCheckDefinition = globalsState.checkDefinitions[initialRoomCheckKey];

    if (initialRoomProgressiveDefinition) {
      return {
        key: initialRoomCheckKey,
        label: initialRoomProgressiveDefinition.label,
        progressive: true,
        value: progressionManagerGetProgressiveValue(initialRoomCheckKey),
        max: initialRoomProgressiveDefinition.count
      };
    }

    return {
      key: initialRoomCheckKey,
      label: initialRoomCheckDefinition ? initialRoomCheckDefinition.label : initialRoomCheckKey,
      progressive: false,
      value: globalsState.progression[initialRoomCheckKey] || globalsState.checks[initialRoomCheckKey] ? 1 : 0,
      max: 1
    };
  });
}

function initialRoomShouldHideStatusProgressionItem(initialRoomCheckKey) {
  var initialRoomDefinition = globalsState.checkDefinitions[initialRoomCheckKey];
  var initialRoomProgressiveMatch = String(initialRoomCheckKey || "").match(/^([a-zA-Z]+)\d+$/);

  return initialRoomCheckKey === "empty" ||
    initialRoomCheckKey === "itemPool" ||
    initialRoomCheckKey === "energy" ||
    initialRoomCheckKey === "healthPotion" ||
    initialRoomCheckKey === "energyGem" ||
    initialRoomCheckKey === "roundPouch" ||
    /^itemPool\d+$/.test(String(initialRoomCheckKey || "")) ||
    Boolean(initialRoomDefinition && initialRoomDefinition.trap) ||
    Boolean(initialRoomProgressiveMatch && globalsState.progressiveCheckDefinitions[initialRoomProgressiveMatch[1]]);
}

function initialRoomDrawStatusProgressionGrid(initialRoomItems, initialRoomPanelX, initialRoomPanelY, initialRoomPanelWidth, initialRoomPanelHeight, initialRoomPixelUnit) {
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomPadding = initialRoomPixelUnit * 6;
  var initialRoomGridX = initialRoomPanelX + initialRoomPadding;
  var initialRoomGridY = initialRoomPanelY + initialRoomPadding;
  var initialRoomGridWidth = initialRoomPanelWidth - (initialRoomPadding * 2);
  var initialRoomGridHeight = initialRoomPanelHeight - (initialRoomPadding * 2);
  var initialRoomSlotGap = initialRoomPixelUnit * 2;
  var initialRoomColumns = 5;
  var initialRoomRows = 3;
  var initialRoomSlotSize = Math.floor(Math.min(
    (initialRoomGridWidth - (initialRoomSlotGap * (initialRoomColumns - 1))) / initialRoomColumns,
    (initialRoomGridHeight - (initialRoomSlotGap * (initialRoomRows - 1))) / initialRoomRows
  ));
  var initialRoomHoveredItem = null;

  initialRoomSlotSize = Math.max(initialRoomGraphicsLevel === 0 ? 72 : 48, initialRoomSlotSize);
  initialRoomGridX += Math.max(0, Math.floor((initialRoomGridWidth - ((initialRoomSlotSize * initialRoomColumns) + (initialRoomSlotGap * (initialRoomColumns - 1)))) / 2));
  initialRoomGridY += Math.max(0, Math.floor((initialRoomGridHeight - ((initialRoomSlotSize * initialRoomRows) + (initialRoomSlotGap * (initialRoomRows - 1)))) / 2));

  initialRoomItems.forEach(function (initialRoomItem, initialRoomIndex) {
    var initialRoomColumn = initialRoomIndex % initialRoomColumns;
    var initialRoomRow = Math.floor(initialRoomIndex / initialRoomColumns);
    var initialRoomX = initialRoomGridX + (initialRoomColumn * (initialRoomSlotSize + initialRoomSlotGap));
    var initialRoomY = initialRoomGridY + (initialRoomRow * (initialRoomSlotSize + initialRoomSlotGap));

    if (initialRoomY + initialRoomSlotSize > initialRoomGridY + initialRoomGridHeight) {
      return;
    }

    initialRoomDrawStatusProgressionSlot(initialRoomItem, initialRoomX, initialRoomY, initialRoomSlotSize, initialRoomPixelUnit, initialRoomGraphicsLevel);

    if (initialRoomMouse.x >= initialRoomX && initialRoomMouse.x <= initialRoomX + initialRoomSlotSize && initialRoomMouse.y >= initialRoomY && initialRoomMouse.y <= initialRoomY + initialRoomSlotSize) {
      initialRoomHoveredItem = initialRoomItem;
    }
  });

  if (initialRoomHoveredItem && initialRoomHoveredItem.value > 0) {
    initialRoomDrawStatusTooltip(initialRoomHoveredItem.label, initialRoomPixelUnit);
  }
}

function initialRoomDrawStatusProgressionSlot(initialRoomItem, initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit, initialRoomGraphicsLevel) {
  var initialRoomHasItem = initialRoomItem.value > 0;
  var initialRoomIsComplete = initialRoomItem.progressive && initialRoomItem.value >= initialRoomItem.max;
  var initialRoomStatusIcon = initialRoomGetStatusProgressionIcon(initialRoomItem);

  if (initialRoomGraphicsLevel === 0) {
    initialRoomDrawBasicStatusProgressionSlot(initialRoomItem, initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit);
    return;
  }

  initialRoomContext.fillStyle = initialRoomHasItem ? "#050505" : "#747981";
  initialRoomContext.fillRect(initialRoomX, initialRoomY, initialRoomSize, initialRoomSize);
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(2, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomX, initialRoomY, initialRoomSize, initialRoomSize);

  if (initialRoomHasItem && initialRoomStatusIcon) {
    initialRoomDrawStatusProgressionIcon(initialRoomStatusIcon, initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit, initialRoomGraphicsLevel);
  } else if (!initialRoomHasItem) {
    initialRoomContext.font = Math.max(22, initialRoomPixelUnit * 7) + "px '" + initialRoomFontFamily + "', monospace";
    initialRoomContext.textAlign = "center";
    initialRoomContext.textBaseline = "middle";
    initialRoomContext.fillStyle = "#f7f7f1";
    initialRoomContext.fillText("?", initialRoomX + (initialRoomSize / 2), initialRoomY + (initialRoomSize / 2));
  }

  if (initialRoomItem.progressive && initialRoomHasItem) {
    initialRoomDrawStatusProgressionLevel(initialRoomItem.value, initialRoomIsComplete, initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit);
  }

  if (initialRoomHasItem) {
    initialRoomDrawStatusUseKey(initialRoomGetStatusUseKey(initialRoomItem.key), initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit);
  }
}

function initialRoomDrawBasicStatusProgressionSlot(initialRoomItem, initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit) {
  var initialRoomHasItem = initialRoomItem.value > 0;
  var initialRoomLabel = initialRoomHasItem ? (initialRoomItem.progressive ? initialRoomItem.label + " " + initialRoomItem.value : initialRoomItem.label) : "";

  initialRoomContext.fillStyle = initialRoomHasItem ? "#050505" : "#747981";
  initialRoomContext.fillRect(initialRoomX, initialRoomY, initialRoomSize, initialRoomSize);
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(2, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomX, initialRoomY, initialRoomSize, initialRoomSize);
  initialRoomContext.font = Math.max(12, initialRoomPixelUnit * 3) + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textAlign = "center";
  initialRoomContext.textBaseline = "middle";
  initialRoomContext.fillStyle = "#f7f7f1";

  if (initialRoomLabel) {
    initialRoomWrapStatusText(initialRoomLabel, initialRoomX + (initialRoomSize / 2), initialRoomY + (initialRoomSize / 2), initialRoomSize - (initialRoomPixelUnit * 2), initialRoomPixelUnit * 4);
  }
}

function initialRoomGetStatusProgressionIcon(initialRoomItem) {
  var initialRoomIconKey = initialRoomGetPickupIconKey(initialRoomItem.key);

  return initialRoomPickupIconImages[initialRoomIconKey] || null;
}

function initialRoomDrawStatusProgressionIcon(initialRoomImage, initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit, initialRoomGraphicsLevel) {
  var initialRoomInset = initialRoomPixelUnit * 2;

  initialRoomContext.save();

  if (initialRoomGraphicsLevel === 1) {
    initialRoomContext.filter = "grayscale(1)";
  }

  initialRoomContext.imageSmoothingEnabled = false;
  initialRoomContext.drawImage(
    initialRoomImage,
    Math.floor(initialRoomX + initialRoomInset),
    Math.floor(initialRoomY + initialRoomInset),
    Math.ceil(initialRoomSize - (initialRoomInset * 2)),
    Math.ceil(initialRoomSize - (initialRoomInset * 2))
  );
  initialRoomContext.restore();
}

function initialRoomDrawStatusProgressionLevel(initialRoomValue, initialRoomIsComplete, initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit) {
  var initialRoomBadgeSize = Math.max(initialRoomPixelUnit * 6, 24);
  var initialRoomBadgeX = initialRoomX + initialRoomSize - initialRoomBadgeSize;
  var initialRoomBadgeY = initialRoomY + initialRoomSize - initialRoomBadgeSize;

  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(initialRoomBadgeX, initialRoomBadgeY, initialRoomBadgeSize, initialRoomBadgeSize);
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(1, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomBadgeX, initialRoomBadgeY, initialRoomBadgeSize, initialRoomBadgeSize);
  initialRoomContext.font = Math.max(16, initialRoomPixelUnit * 5) + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textAlign = "center";
  initialRoomContext.textBaseline = "middle";
  initialRoomContext.fillStyle = initialRoomIsComplete ? "#f7c948" : "#f7f7f1";
  initialRoomContext.fillText(String(initialRoomValue), initialRoomBadgeX + (initialRoomBadgeSize / 2), initialRoomBadgeY + (initialRoomBadgeSize / 2));
}

function initialRoomGetStatusUseKey(initialRoomItemKey) {
  var initialRoomUseKeys = {
    bomb: "Q",
    fire: "G",
    gun: "SP/LMB",
    sword: "F"
  };

  return initialRoomUseKeys[initialRoomItemKey] || "";
}

function initialRoomDrawStatusUseKey(initialRoomUseKey, initialRoomX, initialRoomY, initialRoomSize, initialRoomPixelUnit) {
  var initialRoomFontSize = Math.max(12, initialRoomPixelUnit * 3);
  var initialRoomBadgeWidth = 0;
  var initialRoomBadgeHeight = Math.max(initialRoomPixelUnit * 5, 18);

  if (!initialRoomUseKey) {
    return;
  }

  initialRoomContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomBadgeWidth = Math.max(initialRoomPixelUnit * 6, Math.ceil(initialRoomContext.measureText(initialRoomUseKey).width + (initialRoomPixelUnit * 4)));
  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(initialRoomX, initialRoomY, initialRoomBadgeWidth, initialRoomBadgeHeight);
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(1, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomX, initialRoomY, initialRoomBadgeWidth, initialRoomBadgeHeight);
  initialRoomContext.textAlign = "center";
  initialRoomContext.textBaseline = "middle";
  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.fillText(initialRoomUseKey, initialRoomX + (initialRoomBadgeWidth / 2), initialRoomY + (initialRoomBadgeHeight / 2));
}

function initialRoomWrapStatusText(initialRoomText, initialRoomX, initialRoomY, initialRoomMaxWidth, initialRoomLineHeight) {
  var initialRoomWords = String(initialRoomText).split(" ");
  var initialRoomLines = [];
  var initialRoomLine = "";

  initialRoomWords.forEach(function (initialRoomWord) {
    var initialRoomTestLine = initialRoomLine ? initialRoomLine + " " + initialRoomWord : initialRoomWord;

    if (initialRoomContext.measureText(initialRoomTestLine).width > initialRoomMaxWidth && initialRoomLine) {
      initialRoomLines.push(initialRoomLine);
      initialRoomLine = initialRoomWord;
    } else {
      initialRoomLine = initialRoomTestLine;
    }
  });

  if (initialRoomLine) {
    initialRoomLines.push(initialRoomLine);
  }

  initialRoomLines.slice(0, 3).forEach(function (initialRoomLineText, initialRoomLineIndex) {
    initialRoomContext.fillText(initialRoomLineText, initialRoomX, initialRoomY + ((initialRoomLineIndex - ((Math.min(initialRoomLines.length, 3) - 1) / 2)) * initialRoomLineHeight));
  });
}

function initialRoomDrawStatusTooltip(initialRoomText, initialRoomPixelUnit) {
  var initialRoomPadding = initialRoomPixelUnit * 2;
  var initialRoomTooltipX = Math.min(initialRoomMouse.x + (initialRoomPixelUnit * 3), initialRoomCanvas.width - (initialRoomPixelUnit * 60));
  var initialRoomTooltipY = Math.min(initialRoomMouse.y + (initialRoomPixelUnit * 3), initialRoomCanvas.height - (initialRoomPixelUnit * 12));
  var initialRoomFontSize = Math.max(16, initialRoomPixelUnit * 4);
  var initialRoomWidth = 0;

  initialRoomContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomWidth = initialRoomContext.measureText(initialRoomText).width + (initialRoomPadding * 2);
  initialRoomContext.fillStyle = "#050505";
  initialRoomContext.fillRect(initialRoomTooltipX, initialRoomTooltipY, initialRoomWidth, initialRoomFontSize + (initialRoomPadding * 2));
  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(1, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomTooltipX, initialRoomTooltipY, initialRoomWidth, initialRoomFontSize + (initialRoomPadding * 2));
  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.textAlign = "left";
  initialRoomContext.textBaseline = "top";
  initialRoomContext.fillText(initialRoomText, initialRoomTooltipX + initialRoomPadding, initialRoomTooltipY + initialRoomPadding);
}

function initialRoomDrawTopRightMenuIcons() {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomSize = initialRoomPixelUnit * 10;
  var initialRoomGap = initialRoomPixelUnit * 2;
  var initialRoomY = initialRoomPixelUnit * 4;
  var initialRoomIconX = initialRoomCanvas.width - initialRoomPixelUnit * 4 - initialRoomSize;
  var initialRoomIcons = [
    { letter: "B", active: initialRoomAreMessagePopupsMuted, iconKey: "messageBox" },
    { letter: "N", active: initialRoomIsStatusOpen, iconKey: "status" },
    { letter: "L", active: initialRoomIsMessageLogOpen, iconKey: "log" },
    { letter: "M", active: initialRoomIsMapOpen, iconKey: "map" }
  ];

  initialRoomTopRightMenuIconRects = [];
  if (initialRoomHasSfxUnlock()) {
    initialRoomIcons.push({ letter: "P", active: initialRoomIsSfxMuted, iconKey: "sfx" });
  }

  if (initialRoomHasBgmUnlock()) {
    initialRoomIcons.push({ letter: "O", active: initialRoomIsBgmMuted, iconKey: "bgm" });
  }

  initialRoomIcons.forEach(function (initialRoomIcon) {
    var initialRoomDrawX = initialRoomIconX;

    if (initialRoomIcon.iconKey === "log" && initialRoomMessageLogPulseUntil > Date.now() && !initialRoomIsMessageLogOpen) {
      initialRoomDrawX += Math.round(Math.sin(Date.now() / 28) * initialRoomPixelUnit * 2);
    }

    initialRoomTopRightMenuIconRects.push({
      x: initialRoomIconX,
      y: initialRoomY,
      width: initialRoomSize,
      height: initialRoomSize,
      iconKey: initialRoomIcon.iconKey
    });
    initialRoomDrawLetterIcon(initialRoomIcon.letter, initialRoomDrawX, initialRoomY, initialRoomSize, initialRoomIcon.active, initialRoomIcon.iconKey);
    initialRoomIconX -= initialRoomSize + initialRoomGap;
  });
}

function initialRoomDrawLetterIcon(initialRoomLetter, initialRoomX, initialRoomY, initialRoomSize, initialRoomIsActive, initialRoomIconKey) {
  var initialRoomPixelUnit = initialRoomGetPixelUnit();
  var initialRoomIconImage = initialRoomGetTopRightMenuIcon(initialRoomIconKey);

  initialRoomContext.save();
  initialRoomContext.fillStyle = initialRoomIsActive ? "#f7f7f1" : "#050505";
  initialRoomContext.fillRect(initialRoomX, initialRoomY, initialRoomSize, initialRoomSize);

  if (initialRoomIconImage && initialRoomGetGraphicsLevel() > 0) {
    initialRoomContext.save();
    initialRoomContext.globalAlpha = initialRoomIsActive ? 0.45 : 0.72;

    if (initialRoomGetGraphicsLevel() === 1) {
      initialRoomContext.filter = "grayscale(1)";
    }

    initialRoomContext.imageSmoothingEnabled = false;
    initialRoomContext.drawImage(
      initialRoomIconImage,
      Math.floor(initialRoomX + initialRoomPixelUnit),
      Math.floor(initialRoomY + initialRoomPixelUnit),
      Math.ceil(initialRoomSize - (initialRoomPixelUnit * 2)),
      Math.ceil(initialRoomSize - (initialRoomPixelUnit * 2))
    );
    initialRoomContext.restore();
  }

  if (initialRoomIsActive && (initialRoomIconKey === "bgm" || initialRoomIconKey === "sfx" || initialRoomIconKey === "messageBox")) {
    initialRoomContext.strokeStyle = "#d94141";
    initialRoomContext.lineWidth = Math.max(2, initialRoomPixelUnit);
    initialRoomContext.beginPath();
    initialRoomContext.moveTo(initialRoomX + initialRoomPixelUnit, initialRoomY + initialRoomSize - initialRoomPixelUnit);
    initialRoomContext.lineTo(initialRoomX + initialRoomSize - initialRoomPixelUnit, initialRoomY + initialRoomPixelUnit);
    initialRoomContext.stroke();
  }

  initialRoomContext.strokeStyle = "#f7f7f1";
  initialRoomContext.lineWidth = Math.max(2, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomX, initialRoomY, initialRoomSize, initialRoomSize);
  initialRoomContext.font = Math.max(14, initialRoomPixelUnit * 5) + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.textAlign = "right";
  initialRoomContext.textBaseline = "bottom";
  initialRoomContext.fillStyle = initialRoomIsActive ? "#050505" : "#f7f7f1";
  initialRoomContext.fillText(initialRoomLetter, initialRoomX + initialRoomSize - initialRoomPixelUnit, initialRoomY + initialRoomSize - initialRoomPixelUnit);
  initialRoomContext.restore();
}

function initialRoomGetTopRightMenuIcon(initialRoomIconKey) {
  var initialRoomIconMap = {
    bgm: "bgm",
    log: "log",
    map: "freeGrid",
    messageBox: "log",
    sfx: "sfx",
    status: "itemPool"
  };

  return initialRoomPickupIconImages[initialRoomIconMap[initialRoomIconKey]] || null;
}

function initialRoomDrawMapRoomCell(initialRoomRoomX, initialRoomRoomY, initialRoomX, initialRoomY, initialRoomCellSize, initialRoomPixelUnit) {
  var initialRoomBaseColor = initialRoomGetCachedMapRoomColor(initialRoomRoomX, initialRoomRoomY);
  var initialRoomIsCurrentRoom = initialRoomCurrentRoom && initialRoomCurrentRoom.x === initialRoomRoomX && initialRoomCurrentRoom.y === initialRoomRoomY;
  var initialRoomBlinkOn = Math.floor(Date.now() / 350) % 2 === 0;
  var initialRoomInset = Math.max(1, initialRoomPixelUnit);
  var initialRoomCurrentColor = initialRoomGetGraphicsLevel() >= 2 ? "#2f7dff" : "#f7f7f1";

  initialRoomContext.fillStyle = initialRoomIsCurrentRoom && initialRoomBlinkOn ? initialRoomCurrentColor : initialRoomBaseColor;
  initialRoomContext.fillRect(initialRoomX, initialRoomY, initialRoomCellSize, initialRoomCellSize);
  initialRoomContext.strokeStyle = "#050505";
  initialRoomContext.lineWidth = Math.max(1, initialRoomPixelUnit);
  initialRoomContext.strokeRect(initialRoomX, initialRoomY, initialRoomCellSize, initialRoomCellSize);

  if (initialRoomIsCurrentRoom && !initialRoomBlinkOn) {
    initialRoomContext.strokeStyle = initialRoomCurrentColor;
    initialRoomContext.lineWidth = Math.max(1, initialRoomPixelUnit * 2);
    initialRoomContext.strokeRect(
      initialRoomX + initialRoomInset,
      initialRoomY + initialRoomInset,
      initialRoomCellSize - (initialRoomInset * 2),
      initialRoomCellSize - (initialRoomInset * 2)
    );
  }

  initialRoomDrawMapVisitedRoomEdges(initialRoomRoomX, initialRoomRoomY, initialRoomX, initialRoomY, initialRoomCellSize, initialRoomPixelUnit);
  initialRoomDrawMapRoomCellMarkers(initialRoomRoomX, initialRoomRoomY, initialRoomX, initialRoomY, initialRoomCellSize, initialRoomPixelUnit);
}

function initialRoomDrawMapRoomCellMarkers(initialRoomRoomX, initialRoomRoomY, initialRoomX, initialRoomY, initialRoomCellSize, initialRoomPixelUnit) {
  var initialRoomStatus = initialRoomGetCachedMapRoomStatus(initialRoomRoomX, initialRoomRoomY);
  var initialRoomFontSize = Math.max(8, Math.floor(initialRoomCellSize * 0.26));
  var initialRoomPadding = Math.max(1, initialRoomPixelUnit);

  if (!initialRoomStatus) {
    return;
  }

  initialRoomContext.save();
  initialRoomContext.font = initialRoomFontSize + "px '" + initialRoomFontFamily + "', monospace";
  initialRoomContext.fillStyle = "#f7f7f1";
  initialRoomContext.strokeStyle = "#050505";
  initialRoomContext.lineWidth = Math.max(2, Math.floor(initialRoomPixelUnit / 2));

  if (initialRoomStatus.visitedWarp) {
    initialRoomDrawMapCellMarkerText("W", initialRoomX + initialRoomCellSize - initialRoomPadding, initialRoomY + initialRoomPadding, "right", "top");
  }

  if (initialRoomStatus.enemyRemaining > 0) {
    initialRoomDrawMapCellMarkerText(String(initialRoomStatus.enemyRemaining), initialRoomX + initialRoomPadding, initialRoomY + initialRoomCellSize - initialRoomPadding, "left", "bottom");
  }

  if (initialRoomStatus.destructibleRemaining > 0) {
    initialRoomDrawMapCellMarkerText(String(initialRoomStatus.destructibleRemaining), initialRoomX + initialRoomCellSize - initialRoomPadding, initialRoomY + initialRoomCellSize - initialRoomPadding, "right", "bottom");
  }

  if (initialRoomStatus.optionalTotal > 0 && initialRoomStatus.optionalRemaining <= 0) {
    initialRoomDrawMapCellMarkerText("✓", initialRoomX + Math.floor(initialRoomCellSize / 2), initialRoomY + Math.floor(initialRoomCellSize / 2), "center", "middle");
  }

  initialRoomContext.restore();
}

function initialRoomDrawMapCellMarkerText(initialRoomText, initialRoomX, initialRoomY, initialRoomAlign, initialRoomBaseline) {
  initialRoomContext.textAlign = initialRoomAlign;
  initialRoomContext.textBaseline = initialRoomBaseline;
  initialRoomContext.strokeText(initialRoomText, initialRoomX, initialRoomY);
  initialRoomContext.fillText(initialRoomText, initialRoomX, initialRoomY);
}

function initialRoomDrawMapVisitedRoomEdges(initialRoomRoomX, initialRoomRoomY, initialRoomX, initialRoomY, initialRoomCellSize, initialRoomPixelUnit) {
  var initialRoomEdges = initialRoomVisitedRoomEdges[initialRoomGetVisitedRoomEdgeKey(initialRoomRoomX, initialRoomRoomY)];
  var initialRoomLineLength = Math.max(initialRoomPixelUnit * 3, Math.floor(initialRoomCellSize * 0.18));
  var initialRoomLineThickness = Math.max(2, initialRoomPixelUnit);
  var initialRoomCenterX = initialRoomX + Math.floor(initialRoomCellSize / 2);
  var initialRoomCenterY = initialRoomY + Math.floor(initialRoomCellSize / 2);

  if (!initialRoomEdges) {
    return;
  }

  initialRoomContext.fillStyle = "#f7f7f1";

  if (initialRoomEdges.north) {
    initialRoomContext.fillRect(
      initialRoomCenterX - Math.floor(initialRoomLineLength / 2),
      initialRoomY - Math.floor(initialRoomLineThickness / 2),
      initialRoomLineLength,
      initialRoomLineThickness
    );
  }

  if (initialRoomEdges.south) {
    initialRoomContext.fillRect(
      initialRoomCenterX - Math.floor(initialRoomLineLength / 2),
      initialRoomY + initialRoomCellSize - Math.floor(initialRoomLineThickness / 2),
      initialRoomLineLength,
      initialRoomLineThickness
    );
  }

  if (initialRoomEdges.west) {
    initialRoomContext.fillRect(
      initialRoomX - Math.floor(initialRoomLineThickness / 2),
      initialRoomCenterY - Math.floor(initialRoomLineLength / 2),
      initialRoomLineThickness,
      initialRoomLineLength
    );
  }

  if (initialRoomEdges.east) {
    initialRoomContext.fillRect(
      initialRoomX + initialRoomCellSize - Math.floor(initialRoomLineThickness / 2),
      initialRoomCenterY - Math.floor(initialRoomLineLength / 2),
      initialRoomLineThickness,
      initialRoomLineLength
    );
  }
}

function initialRoomRefreshMapStatusCache() {
  var initialRoomUnlockedRing = globalsState.progression.progressiveRooms || 0;
  var initialRoomRoomY = -initialRoomUnlockedRing;

  initialRoomMapStatusCache = {};

  while (initialRoomRoomY <= initialRoomUnlockedRing) {
    var initialRoomRoomX = -initialRoomUnlockedRing;

    while (initialRoomRoomX <= initialRoomUnlockedRing) {
      if (mapManagerIsRoomUnlocked(initialRoomRoomX, initialRoomRoomY)) {
        initialRoomMapStatusCache[mapManagerGetCoordinateKey(initialRoomRoomX, initialRoomRoomY)] = initialRoomGetMapRoomCheckStatus(initialRoomRoomX, initialRoomRoomY);
      }

      initialRoomRoomX += 1;
    }

    initialRoomRoomY += 1;
  }
}

function initialRoomGetCachedMapRoomColor(initialRoomRoomX, initialRoomRoomY) {
  var initialRoomStatus = initialRoomGetCachedMapRoomStatus(initialRoomRoomX, initialRoomRoomY);
  var initialRoomRoom = mapManagerGetRoom(initialRoomRoomX, initialRoomRoomY);
  var initialRoomUseColor = initialRoomGetGraphicsLevel() >= 2;

  if (initialRoomRoom && initialRoomRoom.finalRun) {
    return initialRoomUseColor ? "#8e4bd8" : "#8f949d";
  }

  if (initialRoomStatus.available > 0) {
    return initialRoomUseColor ? "#41b95f" : "#d7d7d0";
  }

  if (initialRoomStatus.blocked > 0) {
    return initialRoomUseColor ? "#c43d3d" : "#8f949d";
  }

  return initialRoomUseColor ? "#747981" : "#4a4f58";
}

function initialRoomGetCachedMapRoomStatus(initialRoomRoomX, initialRoomRoomY) {
  var initialRoomCacheKey = mapManagerGetCoordinateKey(initialRoomRoomX, initialRoomRoomY);
  var initialRoomStatus = initialRoomMapStatusCache && initialRoomMapStatusCache[initialRoomCacheKey] ?
    initialRoomMapStatusCache[initialRoomCacheKey] :
    null;

  if (!initialRoomStatus) {
    initialRoomStatus = initialRoomGetMapRoomCheckStatus(initialRoomRoomX, initialRoomRoomY);

    if (initialRoomMapStatusCache) {
      initialRoomMapStatusCache[initialRoomCacheKey] = initialRoomStatus;
    }
  }

  return initialRoomStatus;
}

function initialRoomGetMapRoomCheckStatus(initialRoomRoomX, initialRoomRoomY) {
  var initialRoomRoom = mapManagerGetRoom(initialRoomRoomX, initialRoomRoomY);
  var initialRoomStatus = {
    available: 0,
    blocked: 0,
    remaining: 0,
    destructibleRemaining: 0,
    enemyRemaining: 0,
    optionalRemaining: 0,
    optionalTotal: 0,
    visitedWarp: false
  };
  var initialRoomCanAccessRoom = false;

  if (!initialRoomRoom) {
    return initialRoomStatus;
  }

  initialRoomStatus.visitedWarp = initialRoomHasVisitedWarpRoom(initialRoomRoomX, initialRoomRoomY);
  initialRoomCanAccessRoom = initialRoomCanMeetRequirementGroups(initialRoomRoom.requirements || []);

  initialRoomRoom.tiles.forEach(function (initialRoomTile) {
    initialRoomAddOptionalMapLocationStatus(initialRoomStatus, initialRoomRoom, initialRoomTile);

    if (!initialRoomIsMapCheckTile(initialRoomTile) || !initialRoomIsMapMeaningfulCheckTile(initialRoomTile) || initialRoomIsMapCheckCollected(initialRoomTile, initialRoomRoom)) {
      return;
    }

    initialRoomStatus.remaining += 1;

    if (initialRoomCanAccessRoom && initialRoomCanOpenMapCheckTile(initialRoomTile)) {
      initialRoomStatus.available += 1;
    } else {
      initialRoomStatus.blocked += 1;
    }
  });

  return initialRoomStatus;
}

function initialRoomAddOptionalMapLocationStatus(initialRoomStatus, initialRoomRoom, initialRoomTile) {
  var initialRoomGeneratedLocation = initialRoomGetGeneratedArchipelagoLocation(initialRoomTile, initialRoomRoom);
  var initialRoomCategory = initialRoomGeneratedLocation ? initialRoomGeneratedLocation.category : "";
  var initialRoomIsDestructibleLocation = initialRoomCategory === "easy_destructible";
  var initialRoomIsEnemyLocation = initialRoomCategory === "enemy";
  var initialRoomLocationIsMissing = false;

  if (!initialRoomGeneratedLocation || !globalsState.archipelago.connected) {
    return;
  }

  if (initialRoomIsDestructibleLocation && !initialRoomIsArchipelagoOptionEnabled("add_easy_destructible_checks", initialRoomCategory)) {
    return;
  }

  if (initialRoomIsEnemyLocation && !initialRoomIsArchipelagoOptionEnabled("enemies_are_checks", initialRoomCategory)) {
    return;
  }

  if (!initialRoomIsDestructibleLocation && !initialRoomIsEnemyLocation) {
    return;
  }

  initialRoomStatus.optionalTotal += 1;
  initialRoomLocationIsMissing = archipelagoClientHasMissingLocation(initialRoomGeneratedLocation.id);

  if (!initialRoomLocationIsMissing) {
    return;
  }

  initialRoomStatus.optionalRemaining += 1;

  if (initialRoomIsDestructibleLocation) {
    initialRoomStatus.destructibleRemaining += 1;
  }

  if (initialRoomIsEnemyLocation) {
    initialRoomStatus.enemyRemaining += 1;
  }
}

function initialRoomIsArchipelagoOptionEnabled(initialRoomOptionKey, initialRoomFallbackCategory) {
  var initialRoomSlotData = globalsState.archipelago.slotData || {};
  var initialRoomCamelKey = initialRoomOptionKey.replace(/_([a-z])/g, function (initialRoomMatch, initialRoomLetter) {
    return initialRoomLetter.toUpperCase();
  });

  if (Object.prototype.hasOwnProperty.call(initialRoomSlotData, initialRoomOptionKey)) {
    return Boolean(initialRoomSlotData[initialRoomOptionKey]);
  }

  if (Object.prototype.hasOwnProperty.call(initialRoomSlotData, initialRoomCamelKey)) {
    return Boolean(initialRoomSlotData[initialRoomCamelKey]);
  }

  return initialRoomArchipelagoLocationCategoryIsEnabled(initialRoomFallbackCategory);
}

function initialRoomArchipelagoLocationCategoryIsEnabled(initialRoomCategory) {
  var initialRoomLocationIds = (globalsState.archipelago.missingLocations || []).concat(globalsState.archipelago.checkedLocations || []);
  var initialRoomLocationIndex = 0;

  while (initialRoomLocationIndex < initialRoomLocationIds.length) {
    if (initialRoomGetGeneratedArchipelagoLocationCategoryById(initialRoomLocationIds[initialRoomLocationIndex]) === initialRoomCategory) {
      return true;
    }

    initialRoomLocationIndex += 1;
  }

  return false;
}

function initialRoomGetGeneratedArchipelagoLocationCategoryById(initialRoomLocationId) {
  var initialRoomTargetId = Number(initialRoomLocationId);
  var initialRoomLocationKey = "";

  if (typeof archipelagoGeneratedLocationCoordToLocation === "undefined") {
    return "";
  }

  for (initialRoomLocationKey in archipelagoGeneratedLocationCoordToLocation) {
    if (Object.prototype.hasOwnProperty.call(archipelagoGeneratedLocationCoordToLocation, initialRoomLocationKey) &&
      Number(archipelagoGeneratedLocationCoordToLocation[initialRoomLocationKey].id) === initialRoomTargetId) {
      return archipelagoGeneratedLocationCoordToLocation[initialRoomLocationKey].category || "";
    }
  }

  return "";
}

function initialRoomIsMapCheckTile(initialRoomTile) {
  return Boolean(initialRoomTile && (
    initialRoomTile.type === "check" ||
    initialRoomIsShopTile(initialRoomTile) ||
    initialRoomIsEnemyTile(initialRoomTile) ||
    initialRoomIsDestructableCheckTile(initialRoomTile) ||
    (initialRoomIsDoorTile(initialRoomTile) && initialRoomIsMapMeaningfulCheckTile(initialRoomTile))
  ));
}

function initialRoomIsMapMeaningfulCheckTile(initialRoomTile) {
  var initialRoomDropKey = initialRoomGetMapCheckDropKey(initialRoomTile);

  return Boolean(initialRoomDropKey && initialRoomDropKey !== "empty" && !initialRoomIsItemPoolCheckKey(initialRoomDropKey));
}

function initialRoomGetMapCheckDropKey(initialRoomTile) {
  if (!initialRoomTile) {
    return "";
  }

  if (initialRoomIsEnemyTile(initialRoomTile)) {
    return initialRoomTile.expectedDrop || initialRoomTile.checkKey || "itemPool1";
  }

  if (initialRoomIsShopTile(initialRoomTile)) {
    return initialRoomTile.shopDrop || "";
  }

  return initialRoomTile.expectedDrop || initialRoomTile.checkKey || "";
}

function initialRoomIsMapCheckCollected(initialRoomTile, initialRoomRoom) {
  if (initialRoomIsShopTile(initialRoomTile)) {
    var initialRoomShopKey = initialRoomGetShopRuntimeKeyForRoom(initialRoomTile, initialRoomRoom);

    return Boolean(
      initialRoomPurchasedShopItems[initialRoomShopKey] ||
      initialRoomHiddenShopItems[initialRoomShopKey] ||
      initialRoomRemovedShopItems[initialRoomShopKey] ||
      initialRoomIsGeneratedArchipelagoLocationChecked(initialRoomTile, initialRoomRoom)
    );
  }

  if (initialRoomIsEnemyTile(initialRoomTile)) {
    return initialRoomTile.checkKey ? initialRoomIsLocationChecked(initialRoomTile.checkKey) : false;
  }

  if (initialRoomIsDestructableCheckTile(initialRoomTile)) {
    if (initialRoomTile.checkKey && initialRoomIsLocationChecked(initialRoomTile.checkKey)) {
      return true;
    }

    return initialRoomIsDestructableCheckDestroyed(initialRoomTile, initialRoomRoom);
  }

  return initialRoomIsCheckTileCollected(initialRoomTile, initialRoomRoom);
}

function initialRoomCanOpenMapCheckTile(initialRoomTile) {
  if (initialRoomIsEnemyTile(initialRoomTile)) {
    return initialRoomCanCollectTileRequirements(initialRoomTile);
  }

  if (initialRoomIsDestructableCheckTile(initialRoomTile)) {
    return initialRoomCanCollectTileRequirements(initialRoomTile) && initialRoomCanDestroyMapCheckTile(initialRoomTile);
  }

  return initialRoomCanCollectTileRequirements(initialRoomTile);
}

function initialRoomCanDestroyMapCheckTile(initialRoomTile) {
  var initialRoomCanDestroy = false;

  (initialRoomTile.vulnerable || []).forEach(function (initialRoomVulnerability) {
    if (initialRoomDoesVulnerabilityMatch(initialRoomVulnerability, "sword", Math.min(3, progressionManagerGetProgressiveValue("sword")))) {
      initialRoomCanDestroy = true;
    }

    if (initialRoomDoesVulnerabilityMatch(initialRoomVulnerability, "bomb", initialRoomGetBombLevel())) {
      initialRoomCanDestroy = true;
    }

    if (initialRoomDoesVulnerabilityMatch(initialRoomVulnerability, "cannon", initialRoomHasTankForm() ? 1 : 0)) {
      initialRoomCanDestroy = true;
    }

    if (initialRoomDoesVulnerabilityMatch(initialRoomVulnerability, "tank", initialRoomHasTankForm() ? 1 : 0)) {
      initialRoomCanDestroy = true;
    }

    if (initialRoomDoesVulnerabilityMatch(initialRoomVulnerability, "gun", Math.min(2, progressionManagerGetProgressiveValue("gun")))) {
      initialRoomCanDestroy = true;
    }
  });

  return initialRoomCanDestroy;
}

function initialRoomDraw() {
  if (initialRoomFinalRunState.active) {
    return;
  }

  initialRoomUpdateView();
  initialRoomUpdateRuntimeLayerVisibility();
  initialRoomUpdateMessageFeed();
  initialRoomContext.clearRect(0, 0, initialRoomCanvas.width, initialRoomCanvas.height);
  initialRoomContext.fillStyle = "#1c1e23";
  initialRoomContext.fillRect(0, 0, initialRoomCanvas.width, initialRoomCanvas.height);
  initialRoomDrawRoom();
  initialRoomDrawRuntimeEnemies();
  initialRoomDrawBombs();
  initialRoomDrawProjectiles();
  initialRoomDrawWizardFireballs();
  initialRoomDrawMeleeAttacks("underPlayer");
  initialRoomDrawPlayer();
  initialRoomDrawMeleeAttacks("overPlayer");
  initialRoomDrawTankShots();
  initialRoomDrawTankTurretOverlay();
  initialRoomDrawDestructibleBursts();
  initialRoomDrawPickupIcon();
  initialRoomDrawHud();
  initialRoomDrawTopRightMenuIcons();
  initialRoomDrawMapOverlay();
  initialRoomDrawStatusOverlay();
  initialRoomDrawMessageLogOverlay();
  initialRoomDrawMessageFeed();
}

function initialRoomIsBlockingTile(initialRoomTileX, initialRoomTileY) {
  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return true;
  }

  var initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  return initialRoomTile && initialRoomIsBlockingTileType(initialRoomTile);
}

function initialRoomIsBlockingTileType(initialRoomTile) {
  if (!initialRoomTile || initialRoomTile.type === "walkable") {
    return false;
  }

  if (initialRoomIsShopTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsBlockerDestroyed(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsRoomEntranceTile(initialRoomTile) && initialRoomIsRoomEntranceUnlocked(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsWaterTile(initialRoomTile) && initialRoomHasWaterWalkers()) {
    return false;
  }

  if (initialRoomIsEnemyTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsDestructableCheckDestroyed(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsBlockerDestroyed(initialRoomTile)) {
    return false;
  }

  if (initialRoomTile.type === "check") {
    return !initialRoomIsCheckTileCollected(initialRoomTile);
  }

  return true;
}

function initialRoomIsJumpTile(initialRoomTile) {
  var initialRoomTileType = initialRoomTile ? initialRoomTile.typeOverride || initialRoomTile.tileType : "";

  return initialRoomTileType === "JumpS" ||
    initialRoomTileType === "JumpN" ||
    initialRoomTileType === "JumpE" ||
    initialRoomTileType === "JumpW";
}

function initialRoomCanEnterJumpTile(initialRoomTile, initialRoomDirection, initialRoomTileX, initialRoomTileY) {
  var initialRoomTileType = initialRoomTile ? initialRoomTile.typeOverride || initialRoomTile.tileType : "";

  if (!initialRoomIsJumpTile(initialRoomTile)) {
    return false;
  }

  if (!initialRoomDirection) {
    return false;
  }

  if (initialRoomTileType === "JumpS") {
    return initialRoomDirection.y >= 0 || initialRoomPlayer.y <= initialRoomTileY + 0.5;
  }

  if (initialRoomTileType === "JumpN") {
    return initialRoomDirection.y <= 0 || initialRoomPlayer.y >= initialRoomTileY + 0.5;
  }

  if (initialRoomTileType === "JumpE") {
    return initialRoomDirection.x >= 0 || initialRoomPlayer.x <= initialRoomTileX + 0.5;
  }

  if (initialRoomTileType === "JumpW") {
    return initialRoomDirection.x <= 0 || initialRoomPlayer.x >= initialRoomTileX + 0.5;
  }

  return false;
}

function initialRoomDoesJumpTileForceDirection(initialRoomTile, initialRoomDirection) {
  var initialRoomTileType = initialRoomTile ? initialRoomTile.typeOverride || initialRoomTile.tileType : "";

  if (!initialRoomDirection) {
    return false;
  }

  return (initialRoomTileType === "JumpS" && initialRoomDirection.y > 0) ||
    (initialRoomTileType === "JumpN" && initialRoomDirection.y < 0) ||
    (initialRoomTileType === "JumpE" && initialRoomDirection.x > 0) ||
    (initialRoomTileType === "JumpW" && initialRoomDirection.x < 0);
}

function initialRoomIsPlayerBlockingTileType(initialRoomTile, initialRoomDirection, initialRoomTileX, initialRoomTileY) {
  if (initialRoomHasTankForm() && initialRoomIsJumpTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomCanEnterJumpTile(initialRoomTile, initialRoomDirection, initialRoomTileX, initialRoomTileY)) {
    return false;
  }

  return initialRoomIsBlockingTileType(initialRoomTile);
}

function initialRoomCanTileMoveTo(initialRoomNextX, initialRoomNextY, initialRoomDirection) {
  var initialRoomTileX = Math.floor(initialRoomNextX);
  var initialRoomTileY = Math.floor(initialRoomNextY);
  var initialRoomTile = null;

  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return false;
  }

  initialRoomTryDestroyPickaxeTile(initialRoomTileX, initialRoomTileY);
  initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  return !initialRoomIsPlayerBlockingTileType(initialRoomTile, initialRoomDirection, initialRoomTileX, initialRoomTileY);
}

function initialRoomCanFreeMoveTo(initialRoomNextX, initialRoomNextY) {
  var initialRoomPlayerRadius = initialRoomGetPlayerCollisionRadius();
  var initialRoomLeftTile = Math.floor(initialRoomNextX - initialRoomPlayerRadius);
  var initialRoomRightTile = Math.floor(initialRoomNextX + initialRoomPlayerRadius);
  var initialRoomTopTile = Math.floor(initialRoomNextY - initialRoomPlayerRadius);
  var initialRoomBottomTile = Math.floor(initialRoomNextY + initialRoomPlayerRadius);
  var initialRoomDirection = {
    x: Math.sign(initialRoomNextX - initialRoomPlayer.x),
    y: Math.sign(initialRoomNextY - initialRoomPlayer.y)
  };

  return !initialRoomIsPlayerBlockedTile(initialRoomLeftTile, initialRoomTopTile, initialRoomDirection) &&
    !initialRoomIsPlayerBlockedTile(initialRoomRightTile, initialRoomTopTile, initialRoomDirection) &&
    !initialRoomIsPlayerBlockedTile(initialRoomLeftTile, initialRoomBottomTile, initialRoomDirection) &&
    !initialRoomIsPlayerBlockedTile(initialRoomRightTile, initialRoomBottomTile, initialRoomDirection);
}

function initialRoomIsPlayerBlockedTile(initialRoomTileX, initialRoomTileY, initialRoomDirection) {
  var initialRoomTile = null;

  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return true;
  }

  initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  initialRoomTryDestroyPickaxeTile(initialRoomTileX, initialRoomTileY);
  initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  return initialRoomTile && initialRoomIsPlayerBlockingTileType(initialRoomTile, initialRoomDirection, initialRoomTileX, initialRoomTileY);
}

function initialRoomTryDestroyPickaxeTile(initialRoomTileX, initialRoomTileY) {
  var initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  if (progressionManagerGetProgressiveValue("pickaxe") <= 0 && !globalsState.progression.pickaxe) {
    return false;
  }

  if (!initialRoomCanDestroyDestructableCheck(initialRoomTile, "pickaxe", 1)) {
    return false;
  }

  initialRoomDestroyDestructableCheck(initialRoomTile);
  return true;
}

function initialRoomGetPlayerCollisionRadius() {
  return initialRoomHasTankForm() ? 1.15 : initialRoomPlayer.radius;
}

function initialRoomHasTankForm() {
  return Boolean(
    globalsState.progression.tankTreads &&
    globalsState.progression.tankChassis &&
    globalsState.progression.tankCannon
  );
}

function initialRoomCanEnemyMoveTo(initialRoomNextX, initialRoomNextY, initialRoomEnemyRadius, initialRoomEnemy) {
  var initialRoomLeftTile = Math.floor(initialRoomNextX - initialRoomEnemyRadius);
  var initialRoomRightTile = Math.floor(initialRoomNextX + initialRoomEnemyRadius);
  var initialRoomTopTile = Math.floor(initialRoomNextY - initialRoomEnemyRadius);
  var initialRoomBottomTile = Math.floor(initialRoomNextY + initialRoomEnemyRadius);

  return !initialRoomIsEnemyBlockedTile(initialRoomLeftTile, initialRoomTopTile, initialRoomEnemy) &&
    !initialRoomIsEnemyBlockedTile(initialRoomRightTile, initialRoomTopTile, initialRoomEnemy) &&
    !initialRoomIsEnemyBlockedTile(initialRoomLeftTile, initialRoomBottomTile, initialRoomEnemy) &&
    !initialRoomIsEnemyBlockedTile(initialRoomRightTile, initialRoomBottomTile, initialRoomEnemy);
}

function initialRoomIsEnemyBlockedTile(initialRoomTileX, initialRoomTileY, initialRoomEnemy) {
  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return true;
  }

  var initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  if (!initialRoomTile || initialRoomTile.type === "walkable" || initialRoomIsEnemyTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomEnemy && initialRoomEnemy.canCrossWater && initialRoomIsWaterTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsDestructableCheckDestroyed(initialRoomTile)) {
    return false;
  }

  if (initialRoomTile.type === "check") {
    return !initialRoomIsCheckTileCollected(initialRoomTile);
  }

  return initialRoomIsBlockingTileType(initialRoomTile);
}

function initialRoomIsWaterTile(initialRoomTile) {
  return Boolean(initialRoomTile && (
    initialRoomTile.tileType === "Water" ||
    initialRoomTile.typeOverride === "Water"
  ));
}

function initialRoomIsLavaTile(initialRoomTile) {
  return Boolean(initialRoomTile && (
    initialRoomTile.tileType === "Lava" ||
    initialRoomTile.typeOverride === "Lava"
  ));
}

function initialRoomHasWaterWalkers() {
  return Boolean(globalsState.progression.waterWalkers);
}

function initialRoomIsRoomEntranceTile(initialRoomTile) {
  return Boolean(initialRoomTile && (
    initialRoomTile.tileType === "RoomEntrance" ||
    initialRoomTile.typeOverride === "RoomEntrance" ||
    initialRoomTile.tileType === "RoomEntranceDestructable" ||
    initialRoomTile.typeOverride === "RoomEntranceDestructable"
  ));
}

function initialRoomIsLockedRoomEntranceTile(initialRoomTile) {
  return initialRoomIsRoomEntranceTile(initialRoomTile) && !initialRoomIsRoomEntranceUnlocked(initialRoomTile);
}

function initialRoomGetLockedRoomEntranceRenderTile(initialRoomTile) {
  var initialRoomRenderTile = initialRoomCloneRoom(initialRoomTile);

  initialRoomRenderTile.sprite = {
    source: "tileset",
    x: 5,
    y: 6
  };
  return initialRoomRenderTile;
}

function initialRoomIsDoorTile(initialRoomTile) {
  return Boolean(initialRoomTile && (
    initialRoomTile.tileType === "Door" ||
    initialRoomTile.typeOverride === "Door"
  ));
}

function initialRoomIsLockedDoorTile(initialRoomTile) {
  return initialRoomIsDoorTile(initialRoomTile) && !initialRoomIsDoorUnlocked(initialRoomTile);
}

function initialRoomIsDoorUnlocked(initialRoomTile) {
  var initialRoomLinkedDoor = null;

  if (!initialRoomIsDoorTile(initialRoomTile)) {
    return false;
  }

  initialRoomLinkedDoor = initialRoomFindLinkedDoor(initialRoomTile);
  return Boolean(initialRoomLinkedDoor && initialRoomCanMoveToRoom(initialRoomLinkedDoor.room.x, initialRoomLinkedDoor.room.y));
}

function initialRoomIsRoomEntranceUnlocked(initialRoomTile) {
  if (!initialRoomCurrentRoom || !initialRoomIsRoomEntranceTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomTile.x <= 0) {
    return initialRoomCanMoveToRoom(initialRoomCurrentRoom.x - 1, initialRoomCurrentRoom.y);
  }

  if (initialRoomTile.x >= mapManagerData.roomWidth - 1) {
    return initialRoomCanMoveToRoom(initialRoomCurrentRoom.x + 1, initialRoomCurrentRoom.y);
  }

  if (initialRoomTile.y <= 0) {
    return initialRoomCanMoveToRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y - 1);
  }

  if (initialRoomTile.y >= mapManagerData.roomHeight - 1) {
    return initialRoomCanMoveToRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y + 1);
  }

  return false;
}

function initialRoomGetRoomGroundTile(initialRoomTileX, initialRoomTileY) {
  var initialRoomGroundDefinition = initialRoomCurrentRoom.defaultGround || mapManagerCreateDefaultTileDefinition("walkable", "Walkable");
  var initialRoomGroundTile = {
    id: "ground_" + initialRoomTileX + "_" + initialRoomTileY,
    x: initialRoomTileX,
    y: initialRoomTileY,
    width: 1,
    height: 1,
    type: initialRoomGroundDefinition.type || "walkable",
    tileType: initialRoomGroundDefinition.tileType || "Walkable",
    typeOverride: initialRoomGroundDefinition.typeOverride || initialRoomGroundDefinition.tileType || "Walkable",
    isDefault: true
  };

  if (initialRoomGroundDefinition.sprite) {
    initialRoomGroundTile.sprite = initialRoomGroundDefinition.sprite;
  }

  if (initialRoomGroundDefinition.colorReplacements) {
    initialRoomGroundTile.colorReplacements = initialRoomGroundDefinition.colorReplacements;
  }

  return initialRoomGroundTile;
}

function initialRoomMoveBy(initialRoomDeltaX, initialRoomDeltaY) {
  if (initialRoomHasTankForm()) {
    initialRoomMoveTankBy(initialRoomDeltaX, initialRoomDeltaY);
    return;
  }

  initialRoomMoveBySingleStep(initialRoomDeltaX, initialRoomDeltaY);
}

function initialRoomMoveTankBy(initialRoomDeltaX, initialRoomDeltaY) {
  var initialRoomDistance = Math.sqrt((initialRoomDeltaX * initialRoomDeltaX) + (initialRoomDeltaY * initialRoomDeltaY));
  var initialRoomStepCount = Math.max(1, Math.ceil(initialRoomDistance / 0.035));
  var initialRoomStepX = initialRoomDeltaX / initialRoomStepCount;
  var initialRoomStepY = initialRoomDeltaY / initialRoomStepCount;
  var initialRoomStepIndex = 0;

  while (initialRoomStepIndex < initialRoomStepCount) {
    var initialRoomPreviousX = initialRoomPlayer.x;
    var initialRoomPreviousY = initialRoomPlayer.y;

    initialRoomMoveTankBySingleStep(initialRoomStepX, initialRoomStepY);
    initialRoomTryCollectTankOverlappedChecks();

    if (Math.abs(initialRoomPlayer.x - initialRoomPreviousX) < 0.0001 && Math.abs(initialRoomPlayer.y - initialRoomPreviousY) < 0.0001) {
      return;
    }

    initialRoomStepIndex += 1;
  }
}

function initialRoomMoveTankBySingleStep(initialRoomDeltaX, initialRoomDeltaY) {
  var initialRoomNextX = initialRoomPlayer.x + initialRoomDeltaX;
  var initialRoomNextY = initialRoomPlayer.y + initialRoomDeltaY;

  if (initialRoomTryFreeRoomTransition(initialRoomNextX, initialRoomNextY)) {
    return;
  }

  if (initialRoomCanTankMoveTo(initialRoomNextX, initialRoomPlayer.y)) {
    initialRoomPlayer.x = initialRoomNextX;
  }

  if (initialRoomCanTankMoveTo(initialRoomPlayer.x, initialRoomNextY)) {
    initialRoomPlayer.y = initialRoomNextY;
  }
}

function initialRoomCanTankMoveTo(initialRoomNextX, initialRoomNextY) {
  var initialRoomBounds = initialRoomGetTankCollisionBounds(initialRoomNextX, initialRoomNextY);
  var initialRoomTileY = initialRoomBounds.top;

  while (initialRoomTileY <= initialRoomBounds.bottom) {
    var initialRoomTileX = initialRoomBounds.left;

    while (initialRoomTileX <= initialRoomBounds.right) {
      if (initialRoomDoesTankOverlapTile(initialRoomNextX, initialRoomNextY, initialRoomTileX, initialRoomTileY)) {
        if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
          initialRoomTileX += 1;
          continue;
        }

        if (initialRoomIsTankBlockedTile(initialRoomTileX, initialRoomTileY)) {
          return false;
        }
      }

      initialRoomTileX += 1;
    }

    initialRoomTileY += 1;
  }

  return true;
}

function initialRoomIsTankBlockedTile(initialRoomTileX, initialRoomTileY) {
  var initialRoomTile = null;

  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return true;
  }

  initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  if (!initialRoomTile || initialRoomTile.type === "walkable" || initialRoomIsEnemyTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsBlockerDestroyed(initialRoomTile) || initialRoomIsDestructableCheckDestroyed(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsRoomEntranceTile(initialRoomTile)) {
    return !initialRoomIsRoomEntranceUnlocked(initialRoomTile);
  }

  if (initialRoomIsDoorTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsDestructableCheckTile(initialRoomTile)) {
    return !initialRoomCanTankTreadDestroyDestructableCheck(initialRoomTile);
  }

  if (initialRoomIsJumpTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomTile.type === "check") {
    return false;
  }

  if (initialRoomIsWaterTile(initialRoomTile)) {
    return false;
  }

  return initialRoomIsBlockingTileType(initialRoomTile);
}

function initialRoomGetTankCollisionBounds(initialRoomTankX, initialRoomTankY) {
  var initialRoomCorners = initialRoomGetTankCollisionCorners(initialRoomTankX, initialRoomTankY);
  var initialRoomMinX = initialRoomCorners[0].x;
  var initialRoomMaxX = initialRoomCorners[0].x;
  var initialRoomMinY = initialRoomCorners[0].y;
  var initialRoomMaxY = initialRoomCorners[0].y;
  var initialRoomIndex = 1;

  while (initialRoomIndex < initialRoomCorners.length) {
    initialRoomMinX = Math.min(initialRoomMinX, initialRoomCorners[initialRoomIndex].x);
    initialRoomMaxX = Math.max(initialRoomMaxX, initialRoomCorners[initialRoomIndex].x);
    initialRoomMinY = Math.min(initialRoomMinY, initialRoomCorners[initialRoomIndex].y);
    initialRoomMaxY = Math.max(initialRoomMaxY, initialRoomCorners[initialRoomIndex].y);
    initialRoomIndex += 1;
  }

  return {
    left: Math.floor(initialRoomMinX),
    right: Math.floor(initialRoomMaxX),
    top: Math.floor(initialRoomMinY),
    bottom: Math.floor(initialRoomMaxY)
  };
}

function initialRoomGetTankCollisionCorners(initialRoomTankX, initialRoomTankY) {
  var initialRoomHalfWidth = initialRoomGetTankCollisionHalfWidth();
  var initialRoomHalfLength = initialRoomGetTankCollisionHalfLength();
  var initialRoomAxes = initialRoomGetTankCollisionAxes();

  return [
    initialRoomGetTankCollisionPoint(initialRoomTankX, initialRoomTankY, initialRoomAxes, -initialRoomHalfWidth, -initialRoomHalfLength),
    initialRoomGetTankCollisionPoint(initialRoomTankX, initialRoomTankY, initialRoomAxes, initialRoomHalfWidth, -initialRoomHalfLength),
    initialRoomGetTankCollisionPoint(initialRoomTankX, initialRoomTankY, initialRoomAxes, initialRoomHalfWidth, initialRoomHalfLength),
    initialRoomGetTankCollisionPoint(initialRoomTankX, initialRoomTankY, initialRoomAxes, -initialRoomHalfWidth, initialRoomHalfLength)
  ];
}

function initialRoomDoesTankOverlapTile(initialRoomTankX, initialRoomTankY, initialRoomTileX, initialRoomTileY) {
  var initialRoomTileCenterX = initialRoomTileX + 0.5;
  var initialRoomTileCenterY = initialRoomTileY + 0.5;
  var initialRoomTileDeltaX = initialRoomTileCenterX - initialRoomTankX;
  var initialRoomTileDeltaY = initialRoomTileCenterY - initialRoomTankY;
  var initialRoomAxes = initialRoomGetTankCollisionAxes();
  var initialRoomHalfWidth = initialRoomGetTankCollisionHalfWidth();
  var initialRoomHalfLength = initialRoomGetTankCollisionHalfLength();

  if (Math.abs((initialRoomTileDeltaX * initialRoomAxes.side.x) + (initialRoomTileDeltaY * initialRoomAxes.side.y)) > initialRoomHalfWidth + 0.5) {
    return false;
  }

  if (Math.abs((initialRoomTileDeltaX * initialRoomAxes.forward.x) + (initialRoomTileDeltaY * initialRoomAxes.forward.y)) > initialRoomHalfLength + 0.5) {
    return false;
  }

  return true;
}

function initialRoomGetTankCollisionAxes() {
  var initialRoomForward = initialRoomGetTankForwardVector();

  return {
    forward: initialRoomForward,
    side: {
      x: -initialRoomForward.y,
      y: initialRoomForward.x
    }
  };
}

function initialRoomGetTankCollisionPoint(initialRoomTankX, initialRoomTankY, initialRoomAxes, initialRoomSideDistance, initialRoomForwardDistance) {
  return {
    x: initialRoomTankX + (initialRoomAxes.side.x * initialRoomSideDistance) + (initialRoomAxes.forward.x * initialRoomForwardDistance),
    y: initialRoomTankY + (initialRoomAxes.side.y * initialRoomSideDistance) + (initialRoomAxes.forward.y * initialRoomForwardDistance)
  };
}

function initialRoomGetTankCollisionHalfWidth() {
  return 0.98;
}

function initialRoomGetTankCollisionHalfLength() {
  return 1.48;
}

function initialRoomMoveBySingleStep(initialRoomDeltaX, initialRoomDeltaY) {
  var initialRoomNextX = initialRoomPlayer.x + initialRoomDeltaX;
  var initialRoomNextY = initialRoomPlayer.y + initialRoomDeltaY;

  if (initialRoomTryPlayerDoorWarp(initialRoomNextX, initialRoomNextY)) {
    return;
  }

  if (initialRoomTryPlayerRoomEntranceTransition(initialRoomNextX, initialRoomNextY)) {
    return;
  }

  if (initialRoomCanFreeMoveTo(initialRoomNextX, initialRoomPlayer.y)) {
    initialRoomPlayer.x = initialRoomNextX;
  }

  if (initialRoomCanFreeMoveTo(initialRoomPlayer.x, initialRoomNextY)) {
    initialRoomPlayer.y = initialRoomNextY;
  }
}

function initialRoomTryStartForcedJumpMove(initialRoomDirection, initialRoomMoveAmount) {
  var initialRoomNextX = initialRoomPlayer.x + (initialRoomDirection.x * initialRoomMoveAmount);
  var initialRoomNextY = initialRoomPlayer.y + (initialRoomDirection.y * initialRoomMoveAmount);
  var initialRoomJumpTile = initialRoomFindForcedJumpTile(initialRoomNextX, initialRoomNextY, initialRoomDirection);
  var initialRoomLandingTileX = 0;
  var initialRoomLandingTileY = 0;

  if (!initialRoomJumpTile || initialRoomHasTankForm()) {
    return false;
  }

  initialRoomLandingTileX = initialRoomJumpTile.x + initialRoomDirection.x;
  initialRoomLandingTileY = initialRoomJumpTile.y + initialRoomDirection.y;

  if (initialRoomLandingTileX < 0 || initialRoomLandingTileY < 0 || initialRoomLandingTileX >= mapManagerData.roomWidth || initialRoomLandingTileY >= mapManagerData.roomHeight) {
    return false;
  }

  initialRoomPlayer.moveDirection = initialRoomDirection;
  initialRoomPlayer.targetX = initialRoomDirection.x === 0 ? initialRoomPlayer.x : initialRoomLandingTileX + 0.5;
  initialRoomPlayer.targetY = initialRoomDirection.y === 0 ? initialRoomPlayer.y : initialRoomLandingTileY + 0.5;

  return true;
}

function initialRoomFindForcedJumpTile(initialRoomNextX, initialRoomNextY, initialRoomDirection) {
  var initialRoomPlayerRadius = initialRoomGetPlayerCollisionRadius();
  var initialRoomLeftTile = Math.floor(initialRoomNextX - initialRoomPlayerRadius);
  var initialRoomRightTile = Math.floor(initialRoomNextX + initialRoomPlayerRadius);
  var initialRoomTopTile = Math.floor(initialRoomNextY - initialRoomPlayerRadius);
  var initialRoomBottomTile = Math.floor(initialRoomNextY + initialRoomPlayerRadius);
  var initialRoomTileY = initialRoomTopTile;

  while (initialRoomTileY <= initialRoomBottomTile) {
    var initialRoomTileX = initialRoomLeftTile;

    while (initialRoomTileX <= initialRoomRightTile) {
      if (initialRoomTileX >= 0 && initialRoomTileY >= 0 && initialRoomTileX < mapManagerData.roomWidth && initialRoomTileY < mapManagerData.roomHeight) {
        var initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

        if (initialRoomDoesJumpTileForceDirection(initialRoomTile, initialRoomDirection)) {
          return initialRoomTile;
        }
      }

      initialRoomTileX += 1;
    }

    initialRoomTileY += 1;
  }

  return null;
}

function initialRoomTryCollectTankOverlappedChecks() {
  var initialRoomBounds = initialRoomGetTankCollisionBounds(initialRoomPlayer.x, initialRoomPlayer.y);
  var initialRoomLeftTile = initialRoomBounds.left;
  var initialRoomRightTile = initialRoomBounds.right;
  var initialRoomTopTile = initialRoomBounds.top;
  var initialRoomBottomTile = initialRoomBounds.bottom;
  var initialRoomTileY = initialRoomTopTile;

  while (initialRoomTileY <= initialRoomBottomTile) {
    var initialRoomTileX = initialRoomLeftTile;

    while (initialRoomTileX <= initialRoomRightTile) {
      if (initialRoomTileX >= 0 && initialRoomTileY >= 0 && initialRoomTileX < mapManagerData.roomWidth && initialRoomTileY < mapManagerData.roomHeight && initialRoomDoesTankOverlapTile(initialRoomPlayer.x, initialRoomPlayer.y, initialRoomTileX, initialRoomTileY)) {
        var initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

        if (initialRoomIsChestCheckTile(initialRoomTile)) {
          initialRoomTryCollectCheckTile(initialRoomTile);
        } else if (initialRoomCanTankTreadDestroyDestructableCheck(initialRoomTile)) {
          initialRoomDestroyDestructableCheck(initialRoomTile);
        }
      }

      initialRoomTileX += 1;
    }

    initialRoomTileY += 1;
  }
}

function initialRoomGetInputDirection() {
  var initialRoomIndex = initialRoomInputOrder.length - 1;

  while (initialRoomIndex >= 0) {
    var initialRoomKey = initialRoomInputOrder[initialRoomIndex];

    if (initialRoomKeys[initialRoomKey]) {
      return initialRoomGetDirectionForKey(initialRoomKey);
    }

    initialRoomIndex -= 1;
  }

  return null;
}

function initialRoomGetTankInputDirection() {
  var initialRoomInputX = 0;
  var initialRoomInputY = 0;
  var initialRoomLength = 0;

  if (initialRoomKeys.a || initialRoomKeys.arrowleft) {
    initialRoomInputX += initialRoomIsReverseTrapActive() ? 1 : -1;
  }

  if (initialRoomKeys.d || initialRoomKeys.arrowright) {
    initialRoomInputX += initialRoomIsReverseTrapActive() ? -1 : 1;
  }

  if (initialRoomKeys.w || initialRoomKeys.arrowup) {
    initialRoomInputY += initialRoomIsReverseTrapActive() ? 1 : -1;
  }

  if (initialRoomKeys.s || initialRoomKeys.arrowdown) {
    initialRoomInputY += initialRoomIsReverseTrapActive() ? -1 : 1;
  }

  if (initialRoomInputX === 0 && initialRoomInputY === 0) {
    return null;
  }

  initialRoomLength = Math.sqrt((initialRoomInputX * initialRoomInputX) + (initialRoomInputY * initialRoomInputY));
  return {
    x: initialRoomInputX / initialRoomLength,
    y: initialRoomInputY / initialRoomLength
  };
}

function initialRoomGetDirectionForKey(initialRoomKey) {
  var initialRoomDirection = null;

  if (initialRoomKey === "w" || initialRoomKey === "arrowup") {
    initialRoomDirection = { x: 0, y: -1 };
  }

  if (!initialRoomDirection && (initialRoomKey === "a" || initialRoomKey === "arrowleft")) {
    initialRoomDirection = { x: -1, y: 0 };
  }

  if (!initialRoomDirection && (initialRoomKey === "s" || initialRoomKey === "arrowdown")) {
    initialRoomDirection = { x: 0, y: 1 };
  }

  if (!initialRoomDirection && (initialRoomKey === "d" || initialRoomKey === "arrowright")) {
    initialRoomDirection = { x: 1, y: 0 };
  }

  if (!initialRoomDirection) {
    return null;
  }

  if (initialRoomIsReverseTrapActive()) {
    return {
      x: -initialRoomDirection.x,
      y: -initialRoomDirection.y
    };
  }

  return initialRoomDirection;
}

function initialRoomTrackKeyPress(initialRoomKey) {
  var initialRoomDirection = initialRoomGetDirectionForKey(initialRoomKey);

  if (!initialRoomDirection) {
    return;
  }

  initialRoomInputOrder = initialRoomInputOrder.filter(function (initialRoomExistingKey) {
    return initialRoomExistingKey !== initialRoomKey;
  });
  initialRoomInputOrder.push(initialRoomKey);
}

function initialRoomSetFacingDirection(initialRoomDirection) {
  initialRoomPlayer.facingDirection = {
    x: initialRoomDirection.x,
    y: initialRoomDirection.y
  };
}

function initialRoomTrackKeyRelease(initialRoomKey) {
  initialRoomInputOrder = initialRoomInputOrder.filter(function (initialRoomExistingKey) {
    return initialRoomExistingKey !== initialRoomKey;
  });
}

function initialRoomStartTileMove(initialRoomDirection) {
  var initialRoomCurrentTileX = Math.floor(initialRoomPlayer.x);
  var initialRoomCurrentTileY = Math.floor(initialRoomPlayer.y);
  var initialRoomNextX = initialRoomCurrentTileX + initialRoomDirection.x;
  var initialRoomNextY = initialRoomCurrentTileY + initialRoomDirection.y;

  initialRoomSetFacingDirection(initialRoomDirection);

  if (initialRoomTryDoorWarp(initialRoomNextX, initialRoomNextY, initialRoomDirection)) {
    return;
  }

  if (initialRoomTryRoomEntranceTransition(initialRoomNextX, initialRoomNextY)) {
    return;
  }

  if (!initialRoomCanTileMoveTo(initialRoomNextX, initialRoomNextY, initialRoomDirection)) {
    return;
  }

  initialRoomPlayer.moveDirection = initialRoomDirection;
  initialRoomPlayer.targetX = initialRoomNextX + 0.5;
  initialRoomPlayer.targetY = initialRoomNextY + 0.5;
}

function initialRoomGetFrameNormalizedDelta(initialRoomDeltaSeconds) {
  return initialRoomDeltaSeconds * 144;
}

function initialRoomUpdateTileLockedMovement(initialRoomDeltaSeconds) {
  var initialRoomMoveAmount = (initialRoomPlayer.speed * initialRoomGetMovementSpeedMultiplier() * initialRoomGetFrameNormalizedDelta(initialRoomDeltaSeconds)) / initialRoomView.movementTileSize;

  if (initialRoomIsMeleeActive()) {
    return;
  }

  if (!initialRoomPlayer.moveDirection) {
    var initialRoomInputDirection = initialRoomGetInputDirection();

    if (initialRoomInputDirection) {
      initialRoomStartTileMove(initialRoomInputDirection);
    }

    return;
  }

  initialRoomAdvanceTileMove(initialRoomMoveAmount);
}

function initialRoomAdvanceTileMove(initialRoomMoveAmount) {
  if (initialRoomPlayer.moveDirection.x !== 0) {
    var initialRoomDistanceX = initialRoomPlayer.targetX - initialRoomPlayer.x;
    var initialRoomStepX = Math.sign(initialRoomDistanceX) * Math.min(Math.abs(initialRoomDistanceX), initialRoomMoveAmount);
    initialRoomPlayer.x += initialRoomStepX;
  }

  if (initialRoomPlayer.moveDirection.y !== 0) {
    var initialRoomDistanceY = initialRoomPlayer.targetY - initialRoomPlayer.y;
    var initialRoomStepY = Math.sign(initialRoomDistanceY) * Math.min(Math.abs(initialRoomDistanceY), initialRoomMoveAmount);
    initialRoomPlayer.y += initialRoomStepY;
  }

  if (Math.abs(initialRoomPlayer.x - initialRoomPlayer.targetX) < 0.0001 && Math.abs(initialRoomPlayer.y - initialRoomPlayer.targetY) < 0.0001) {
    initialRoomPlayer.x = initialRoomPlayer.targetX;
    initialRoomPlayer.y = initialRoomPlayer.targetY;
    initialRoomPlayer.moveDirection = null;
  }
}

function initialRoomUpdateFreeMovement(initialRoomDeltaSeconds) {
  var initialRoomInputDirection = initialRoomGetInputDirection();
  var initialRoomMoveAmount = (initialRoomPlayer.speed * initialRoomGetMovementSpeedMultiplier() * initialRoomGetFrameNormalizedDelta(initialRoomDeltaSeconds)) / initialRoomView.movementTileSize;

  if (initialRoomIsMeleeActive()) {
    return;
  }

  if (initialRoomPlayer.moveDirection) {
    initialRoomAdvanceTileMove(initialRoomMoveAmount);
    return;
  }

  if (initialRoomInputDirection) {
    initialRoomSetFacingDirection(initialRoomInputDirection);
    if (initialRoomTryStartForcedJumpMove(initialRoomInputDirection, initialRoomMoveAmount)) {
      return;
    }

    initialRoomMoveBy(initialRoomInputDirection.x * initialRoomMoveAmount, initialRoomInputDirection.y * initialRoomMoveAmount);
  }
}

function initialRoomUpdateTankMovement(initialRoomDeltaSeconds) {
  var initialRoomInputDirection = initialRoomGetTankInputDirection();
  var initialRoomMoveAmount = 0;
  var initialRoomForward = null;

  if (initialRoomIsMeleeActive() || !initialRoomInputDirection) {
    return;
  }

  initialRoomPlayer.tankTargetAngle = initialRoomGetAngleForDirection(initialRoomInputDirection);
  initialRoomTurnTankTowardTarget(initialRoomDeltaSeconds);
  initialRoomUpdateTankFacingDirection();
  initialRoomForward = initialRoomGetTankForwardVector();
  initialRoomMoveAmount = (initialRoomPlayer.speed * initialRoomGetMovementSpeedMultiplier() * 0.5 * initialRoomGetTankSpeedMultiplier() * initialRoomGetFrameNormalizedDelta(initialRoomDeltaSeconds)) / initialRoomView.movementTileSize;

  initialRoomMoveBy(initialRoomForward.x * initialRoomMoveAmount, initialRoomForward.y * initialRoomMoveAmount);
}

function initialRoomGetAngleForDirection(initialRoomDirection) {
  return Math.atan2(initialRoomDirection.y, initialRoomDirection.x);
}

function initialRoomTurnTankTowardTarget(initialRoomDeltaSeconds) {
  var initialRoomAngleDifference = initialRoomNormalizeAngle(initialRoomPlayer.tankTargetAngle - initialRoomPlayer.tankAngle);
  var initialRoomMaxTurn = initialRoomTankTurnSpeed * initialRoomDeltaSeconds;
  var initialRoomTurnAmount = Math.sign(initialRoomAngleDifference) * Math.min(Math.abs(initialRoomAngleDifference), initialRoomMaxTurn);

  initialRoomPlayer.tankAngle = initialRoomNormalizeAngle(initialRoomPlayer.tankAngle + initialRoomTurnAmount);
}

function initialRoomGetTankSpeedMultiplier() {
  return Math.abs(initialRoomNormalizeAngle(initialRoomPlayer.tankTargetAngle - initialRoomPlayer.tankAngle)) < 0.05 ? 2 : 1;
}

function initialRoomGetTankForwardVector() {
  return {
    x: Math.cos(initialRoomPlayer.tankAngle),
    y: Math.sin(initialRoomPlayer.tankAngle)
  };
}

function initialRoomUpdateTankFacingDirection() {
  var initialRoomForward = initialRoomGetTankForwardVector();

  if (Math.abs(initialRoomForward.x) > Math.abs(initialRoomForward.y)) {
    initialRoomSetFacingDirection({ x: initialRoomForward.x >= 0 ? 1 : -1, y: 0 });
  } else {
    initialRoomSetFacingDirection({ x: 0, y: initialRoomForward.y >= 0 ? 1 : -1 });
  }
}

function initialRoomNormalizeAngle(initialRoomAngle) {
  while (initialRoomAngle <= -Math.PI) {
    initialRoomAngle += Math.PI * 2;
  }

  while (initialRoomAngle > Math.PI) {
    initialRoomAngle -= Math.PI * 2;
  }

  return initialRoomAngle;
}

function initialRoomUpdateTankSpawnState() {
  var initialRoomHasTank = initialRoomHasTankForm();

  if (initialRoomHasTank && !initialRoomWasTankForm) {
    initialRoomPlayer.hp = Math.min(initialRoomPlayer.hp, initialRoomGetEffectiveMaxHp());
    initialRoomDestroyTankVulnerableChecksAroundSpawn();
  }

  initialRoomWasTankForm = initialRoomHasTank;
}

function initialRoomDestroyTankVulnerableChecksAroundSpawn() {
  var initialRoomCenterX = Math.floor(initialRoomPlayer.x);
  var initialRoomCenterY = Math.floor(initialRoomPlayer.y);
  var initialRoomRadius = 5;
  var initialRoomTileY = initialRoomCenterY - initialRoomRadius;

  while (initialRoomTileY <= initialRoomCenterY + initialRoomRadius) {
    var initialRoomTileX = initialRoomCenterX - initialRoomRadius;

    while (initialRoomTileX <= initialRoomCenterX + initialRoomRadius) {
      if (initialRoomCanTankSpawnDestroyDestructibleCheck(initialRoomTileX, initialRoomTileY, initialRoomCenterX, initialRoomCenterY, initialRoomRadius)) {
        initialRoomDestroyDestructableCheck(initialRoomGetTile(initialRoomTileX, initialRoomTileY));
      }

      initialRoomTileX += 1;
    }

    initialRoomTileY += 1;
  }
}

function initialRoomCanTankSpawnDestroyDestructibleCheck(initialRoomTileX, initialRoomTileY, initialRoomCenterX, initialRoomCenterY, initialRoomRadius) {
  var initialRoomTile = null;
  var initialRoomDeltaX = initialRoomTileX - initialRoomCenterX;
  var initialRoomDeltaY = initialRoomTileY - initialRoomCenterY;

  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight || mapManagerIsBorderTile(initialRoomTileX, initialRoomTileY)) {
    return false;
  }

  if (Math.sqrt((initialRoomDeltaX * initialRoomDeltaX) + (initialRoomDeltaY * initialRoomDeltaY)) > initialRoomRadius) {
    return false;
  }

  initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);
  return initialRoomCanTankTreadDestroyDestructableCheck(initialRoomTile);
}

function initialRoomUpdateEnemies(initialRoomDeltaSeconds) {
  var initialRoomNow = Date.now();

  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (initialRoomEnemy.state === "dying") {
      return;
    }

    if (initialRoomNow < initialRoomEnemy.stunnedUntil) {
      return;
    }

    if (initialRoomEnemy.isShopkeep) {
      return;
    }

    if (initialRoomEnemy.enemyType === "snake") {
      initialRoomUpdateSnakeEnemy(initialRoomEnemy, initialRoomDeltaSeconds);
      return;
    }

    if (initialRoomEnemy.enemyType === "sorcerer") {
      initialRoomUpdateWizardEnemy(initialRoomEnemy, initialRoomNow);
      return;
    }

    if (initialRoomEnemy.enemyType === "blob" || initialRoomEnemy.enemyType === "negaBlob") {
      initialRoomUpdateBlobEnemy(initialRoomEnemy, initialRoomDeltaSeconds);
    }
  });
  initialRoomUpdateSnakeLoopSounds();
}

function initialRoomUpdateSnakeLoopSounds() {
  var initialRoomActiveSnakeIds = {};

  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (initialRoomEnemy.enemyType !== "snake" || initialRoomEnemy.state !== "chase" || !initialRoomIsEnemyTargetable(initialRoomEnemy) || !initialRoomCanPlaySfx()) {
      return;
    }

    initialRoomActiveSnakeIds[initialRoomEnemy.id] = true;

    if (!initialRoomSnakeLoopSounds[initialRoomEnemy.id]) {
      initialRoomSnakeLoopSounds[initialRoomEnemy.id] = new Audio(initialRoomSoundPaths.snake);
      initialRoomSnakeLoopSounds[initialRoomEnemy.id].loop = true;
      initialRoomSnakeLoopSounds[initialRoomEnemy.id].volume = 0.35;
      initialRoomSnakeLoopSounds[initialRoomEnemy.id].play().catch(function () {});
    }
  });

  Object.keys(initialRoomSnakeLoopSounds).forEach(function (initialRoomEnemyId) {
    if (initialRoomActiveSnakeIds[initialRoomEnemyId]) {
      return;
    }

    initialRoomSnakeLoopSounds[initialRoomEnemyId].pause();
    initialRoomSnakeLoopSounds[initialRoomEnemyId].currentTime = 0;
    delete initialRoomSnakeLoopSounds[initialRoomEnemyId];
  });
}

function initialRoomUpdateWizardEnemy(initialRoomEnemy, initialRoomNow) {
  var initialRoomDistanceToPlayer = initialRoomGetDistance(initialRoomEnemy.x, initialRoomEnemy.y, initialRoomPlayer.x, initialRoomPlayer.y);
  var initialRoomDeltaX = initialRoomPlayer.x - initialRoomEnemy.x;
  var initialRoomDeltaY = initialRoomPlayer.y - initialRoomEnemy.y;

  if (initialRoomEnemy.state === "idle") {
    initialRoomEnemy.facingDirection = initialRoomGetEnemyFacingDirection(initialRoomDeltaX, initialRoomDeltaY);

    if (initialRoomDistanceToPlayer <= initialRoomWizardActivationRange) {
      initialRoomWizardFire(initialRoomEnemy, initialRoomNow);
    }

    return;
  }

  if (initialRoomEnemy.state === "attack" && initialRoomNow >= initialRoomEnemy.vanishAt) {
    initialRoomEnemy.state = "vanished";
    initialRoomPlaySfx("wizardVanish");
    initialRoomWizardHop(initialRoomEnemy);
    initialRoomWizardHop(initialRoomEnemy);
    initialRoomWizardHop(initialRoomEnemy);
    initialRoomEnemy.reappearAt = initialRoomNow + initialRoomWizardReappearDelay;
    return;
  }

  if (initialRoomEnemy.state === "vanished" && initialRoomNow >= initialRoomEnemy.reappearAt) {
    initialRoomEnemy.state = "attack";
    initialRoomEnemy.facingDirection = initialRoomGetEnemyFacingDirection(initialRoomDeltaX, initialRoomDeltaY);
    initialRoomWizardFire(initialRoomEnemy, initialRoomNow);
  }
}

function initialRoomWizardFire(initialRoomEnemy, initialRoomNow) {
  var initialRoomDeltaX = initialRoomPlayer.x - initialRoomEnemy.x;
  var initialRoomDeltaY = initialRoomPlayer.y - initialRoomEnemy.y;
  var initialRoomDistance = Math.sqrt((initialRoomDeltaX * initialRoomDeltaX) + (initialRoomDeltaY * initialRoomDeltaY));

  initialRoomEnemy.state = "attack";
  initialRoomEnemy.facingDirection = initialRoomGetEnemyFacingDirection(initialRoomDeltaX, initialRoomDeltaY);
  initialRoomEnemy.vanishAt = initialRoomNow + initialRoomWizardPostShotDelay;

  if (initialRoomDistance <= 0.001) {
    return;
  }

  initialRoomWizardFireballs.push({
    x: initialRoomEnemy.x,
    y: initialRoomEnemy.y,
    direction: {
      x: initialRoomDeltaX / initialRoomDistance,
      y: initialRoomDeltaY / initialRoomDistance
    },
    radius: 0.18,
    damage: initialRoomWizardFireballDamage,
    sourceEnemyId: initialRoomEnemy.id,
    expiresAt: initialRoomNow + 4000
  });
  initialRoomPlaySfx("wizardShot");
}

function initialRoomWizardHop(initialRoomEnemy) {
  var initialRoomDestination = initialRoomFindWizardTeleportTile(initialRoomEnemy.x, initialRoomEnemy.y);

  initialRoomEnemy.x = initialRoomDestination.x + 0.5;
  initialRoomEnemy.y = initialRoomDestination.y + 0.5;
}

function initialRoomFindWizardTeleportTile(initialRoomWorldX, initialRoomWorldY) {
  var initialRoomOriginX = Math.floor(initialRoomWorldX);
  var initialRoomOriginY = Math.floor(initialRoomWorldY);
  var initialRoomDistance = 2;

  while (initialRoomDistance >= 0) {
    var initialRoomCandidates = initialRoomGetWizardTeleportCandidates(initialRoomOriginX, initialRoomOriginY, initialRoomDistance);

    if (initialRoomCandidates.length > 0) {
      return initialRoomCandidates[Math.floor(Math.random() * initialRoomCandidates.length)];
    }

    initialRoomDistance -= 1;
  }

  return {
    x: initialRoomOriginX,
    y: initialRoomOriginY
  };
}

function initialRoomGetWizardTeleportCandidates(initialRoomOriginX, initialRoomOriginY, initialRoomDistance) {
  var initialRoomCandidates = [];
  var initialRoomOffsetY = -initialRoomDistance;

  while (initialRoomOffsetY <= initialRoomDistance) {
    var initialRoomOffsetX = -initialRoomDistance;

    while (initialRoomOffsetX <= initialRoomDistance) {
      var initialRoomTileX = initialRoomOriginX + initialRoomOffsetX;
      var initialRoomTileY = initialRoomOriginY + initialRoomOffsetY;

      if (Math.max(Math.abs(initialRoomOffsetX), Math.abs(initialRoomOffsetY)) === initialRoomDistance && initialRoomCanWizardTeleportTo(initialRoomTileX, initialRoomTileY)) {
        initialRoomCandidates.push({
          x: initialRoomTileX,
          y: initialRoomTileY
        });
      }

      initialRoomOffsetX += 1;
    }

    initialRoomOffsetY += 1;
  }

  return initialRoomCandidates;
}

function initialRoomCanWizardTeleportTo(initialRoomTileX, initialRoomTileY) {
  if (initialRoomTileX <= 0 || initialRoomTileY <= 0 || initialRoomTileX >= mapManagerData.roomWidth - 1 || initialRoomTileY >= mapManagerData.roomHeight - 1) {
    return false;
  }

  return !initialRoomIsBlockingTile(initialRoomTileX, initialRoomTileY);
}

function initialRoomUpdateSnakeEnemy(initialRoomEnemy, initialRoomDeltaSeconds) {
  var initialRoomDistanceToPlayer = initialRoomGetDistance(initialRoomEnemy.x, initialRoomEnemy.y, initialRoomPlayer.x, initialRoomPlayer.y);
  var initialRoomDeltaX = initialRoomPlayer.x - initialRoomEnemy.x;
  var initialRoomDeltaY = initialRoomPlayer.y - initialRoomEnemy.y;

  if (initialRoomEnemy.state === "hidden" && initialRoomDistanceToPlayer <= 1) {
    initialRoomEnemy.state = "chase";
  }

  if (initialRoomEnemy.state === "chase") {
    initialRoomEnemy.facingDirection = initialRoomGetEnemyFacingDirection(initialRoomDeltaX, initialRoomDeltaY);
    initialRoomMoveEnemyToward(initialRoomEnemy, initialRoomPlayer.x, initialRoomPlayer.y, initialRoomEnemy.chaseSpeed, initialRoomDeltaSeconds);
  }
}

function initialRoomGetEnemyFacingDirection(initialRoomDeltaX, initialRoomDeltaY) {
  if (Math.abs(initialRoomDeltaX) > Math.abs(initialRoomDeltaY)) {
    return initialRoomDeltaX < 0 ? "left" : "right";
  }

  return initialRoomDeltaY < 0 ? "up" : "down";
}

function initialRoomUpdateBlobEnemy(initialRoomEnemy, initialRoomDeltaSeconds) {
  var initialRoomDistanceToPlayer = initialRoomGetDistance(initialRoomEnemy.x, initialRoomEnemy.y, initialRoomPlayer.x, initialRoomPlayer.y);

  if (initialRoomDistanceToPlayer <= 5) {
    initialRoomEnemy.state = "chase";
  } else if (initialRoomEnemy.state === "chase") {
    initialRoomEnemy.state = "idle";
    initialRoomEnemy.targetIndex = 0;
  }

  if (initialRoomEnemy.state === "chase") {
    initialRoomMoveEnemyToward(initialRoomEnemy, initialRoomPlayer.x, initialRoomPlayer.y, initialRoomEnemy.chaseSpeed, initialRoomDeltaSeconds);
    return;
  }

  initialRoomUpdateBlobIdle(initialRoomEnemy, initialRoomDeltaSeconds);
}

function initialRoomUpdateBlobIdle(initialRoomEnemy, initialRoomDeltaSeconds) {
  var initialRoomTarget = initialRoomEnemy.corral[initialRoomEnemy.targetIndex % initialRoomEnemy.corral.length];

  if (initialRoomGetDistance(initialRoomEnemy.x, initialRoomEnemy.y, initialRoomTarget.x, initialRoomTarget.y) < 0.08) {
    initialRoomEnemy.targetIndex = (initialRoomEnemy.targetIndex + 1) % initialRoomEnemy.corral.length;
    initialRoomTarget = initialRoomEnemy.corral[initialRoomEnemy.targetIndex];
  }

  initialRoomMoveEnemyToward(initialRoomEnemy, initialRoomTarget.x, initialRoomTarget.y, initialRoomEnemy.idleSpeed, initialRoomDeltaSeconds);
}

function initialRoomMoveEnemyToward(initialRoomEnemy, initialRoomTargetX, initialRoomTargetY, initialRoomSpeed, initialRoomDeltaSeconds) {
  var initialRoomDeltaX = initialRoomTargetX - initialRoomEnemy.x;
  var initialRoomDeltaY = initialRoomTargetY - initialRoomEnemy.y;
  var initialRoomDistance = Math.sqrt((initialRoomDeltaX * initialRoomDeltaX) + (initialRoomDeltaY * initialRoomDeltaY));

  if (initialRoomDistance <= 0.001) {
    return;
  }

  var initialRoomStep = Math.min(initialRoomDistance, initialRoomSpeed * initialRoomDeltaSeconds);
  var initialRoomMoveX = (initialRoomDeltaX / initialRoomDistance) * initialRoomStep;
  var initialRoomMoveY = (initialRoomDeltaY / initialRoomDistance) * initialRoomStep;
  var initialRoomNextX = initialRoomEnemy.x + initialRoomMoveX;
  var initialRoomNextY = initialRoomEnemy.y + initialRoomMoveY;

  if (initialRoomCanEnemyMoveTo(initialRoomNextX, initialRoomEnemy.y, initialRoomEnemy.radius, initialRoomEnemy)) {
    initialRoomEnemy.x = initialRoomNextX;
  }

  if (initialRoomCanEnemyMoveTo(initialRoomEnemy.x, initialRoomNextY, initialRoomEnemy.radius, initialRoomEnemy)) {
    initialRoomEnemy.y = initialRoomNextY;
  }
}

function initialRoomGetDistance(initialRoomFirstX, initialRoomFirstY, initialRoomSecondX, initialRoomSecondY) {
  var initialRoomDeltaX = initialRoomSecondX - initialRoomFirstX;
  var initialRoomDeltaY = initialRoomSecondY - initialRoomFirstY;

  return Math.sqrt((initialRoomDeltaX * initialRoomDeltaX) + (initialRoomDeltaY * initialRoomDeltaY));
}

function initialRoomUpdateBombs() {
  var initialRoomNow = Date.now();

  initialRoomBombs.forEach(function (initialRoomBomb) {
    if (initialRoomBomb.kind !== "fire" && !initialRoomBomb.playedExplosionSfx && initialRoomNow >= initialRoomBomb.explodedAt) {
      initialRoomPlaySfx("bomb");
      initialRoomBomb.playedExplosionSfx = true;
    }

    if (!initialRoomBomb.explosionTiles && initialRoomNow >= initialRoomBomb.explodedAt) {
      initialRoomCreateBombExplosionObjects(initialRoomBomb, initialRoomNow);
    }
  });

  initialRoomBombs = initialRoomBombs.filter(function (initialRoomBomb) {
    var initialRoomIsActive = initialRoomNow < initialRoomBomb.explodedAt + initialRoomGetExplosionDuration(initialRoomBomb);

    if (!initialRoomIsActive) {
      initialRoomRemoveBombExplosionObjects(initialRoomBomb);
    }

    return initialRoomIsActive;
  });

  if (initialRoomBombs.length === 0 && initialRoomEffectLayer.childNodes.length > 0) {
    initialRoomEffectLayer.innerHTML = "";
  }
}

function initialRoomUpdateCombat(initialRoomDeltaSeconds) {
  initialRoomUpdateProjectiles(initialRoomDeltaSeconds);
  initialRoomUpdateWizardFireballs(initialRoomDeltaSeconds);
  initialRoomUpdateMeleeAttacks();
  initialRoomApplyEnemyContactDamage();
  initialRoomApplyExplosionDamage();
  initialRoomUpdateEnemyDeaths();
}

function initialRoomUpdateWizardFireballs(initialRoomDeltaSeconds) {
  var initialRoomNow = Date.now();

  initialRoomWizardFireballs = initialRoomWizardFireballs.filter(function (initialRoomFireball) {
    return initialRoomUpdateWizardFireball(initialRoomFireball, initialRoomDeltaSeconds, initialRoomNow);
  });
}

function initialRoomUpdateWizardFireball(initialRoomFireball, initialRoomDeltaSeconds, initialRoomNow) {
  initialRoomFireball.x += initialRoomFireball.direction.x * initialRoomWizardFireballSpeed * initialRoomDeltaSeconds;
  initialRoomFireball.y += initialRoomFireball.direction.y * initialRoomWizardFireballSpeed * initialRoomDeltaSeconds;

  if (initialRoomNow >= initialRoomFireball.expiresAt || initialRoomFireball.x < 0 || initialRoomFireball.y < 0 || initialRoomFireball.x >= mapManagerData.roomWidth || initialRoomFireball.y >= mapManagerData.roomHeight) {
    return false;
  }

  if (initialRoomGetDistance(initialRoomFireball.x, initialRoomFireball.y, initialRoomPlayer.x, initialRoomPlayer.y) <= initialRoomFireball.radius + initialRoomGetPlayerCollisionRadius()) {
    initialRoomDamagePlayer(initialRoomFireball.damage, "wizardShot");
    return false;
  }

  return !initialRoomTryWizardFireballHitEnemy(initialRoomFireball, initialRoomNow);
}

function initialRoomTryWizardFireballHitEnemy(initialRoomFireball, initialRoomNow) {
  var initialRoomDidHit = false;

  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (initialRoomDidHit || initialRoomEnemy.id === initialRoomFireball.sourceEnemyId || !initialRoomIsEnemyTargetable(initialRoomEnemy)) {
      return;
    }

    if (initialRoomGetDistance(initialRoomFireball.x, initialRoomFireball.y, initialRoomEnemy.x, initialRoomEnemy.y) > initialRoomFireball.radius + initialRoomEnemy.radius) {
      return;
    }

    initialRoomDamageEnemy(initialRoomEnemy, initialRoomFireball.damage, initialRoomNow);
    initialRoomDidHit = true;
  });

  return initialRoomDidHit;
}

function initialRoomIsEnemyTargetable(initialRoomEnemy) {
  return Boolean(initialRoomEnemy && initialRoomEnemy.state !== "dying" && initialRoomEnemy.state !== "hidden" && initialRoomEnemy.state !== "vanished");
}

function initialRoomUpdateMeleeAttacks() {
  var initialRoomNow = Date.now();

  initialRoomMeleeAttacks = initialRoomMeleeAttacks.filter(function (initialRoomAttack) {
    return initialRoomNow < initialRoomAttack.expiresAt;
  });
}

function initialRoomIsMeleeActive() {
  var initialRoomNow = Date.now();

  return initialRoomMeleeAttacks.some(function (initialRoomAttack) {
    return initialRoomNow < initialRoomAttack.movementLockUntil;
  });
}

function initialRoomCanStartMeleeAttack(initialRoomNow) {
  if (initialRoomNow < initialRoomNextMeleeAllowedAt) {
    return false;
  }

  return !initialRoomMeleeAttacks.some(function (initialRoomAttack) {
    return initialRoomNow < initialRoomAttack.expiresAt;
  });
}

function initialRoomUpdateEnemyDeaths() {
  var initialRoomNow = Date.now();

  initialRoomEnemies = initialRoomEnemies.filter(function (initialRoomEnemy) {
    return initialRoomEnemy.state !== "dying" || initialRoomNow < initialRoomEnemy.deathUntil;
  });
}

function initialRoomUpdateProjectiles(initialRoomDeltaSeconds) {
  var initialRoomNow = Date.now();

  initialRoomProjectiles = initialRoomProjectiles.filter(function (initialRoomProjectile) {
    return initialRoomUpdateProjectile(initialRoomProjectile, initialRoomDeltaSeconds, initialRoomNow);
  });
}

function initialRoomUpdateProjectile(initialRoomProjectile, initialRoomDeltaSeconds, initialRoomNow) {
  var initialRoomMoveDistance = initialRoomProjectile.speed * initialRoomDeltaSeconds;
  var initialRoomNextX = initialRoomProjectile.x + (initialRoomProjectile.direction.x * initialRoomMoveDistance);
  var initialRoomNextY = initialRoomProjectile.y + (initialRoomProjectile.direction.y * initialRoomMoveDistance);

  initialRoomProjectile.x = initialRoomNextX;
  initialRoomProjectile.y = initialRoomNextY;

  if (initialRoomNow >= initialRoomProjectile.expiresAt || initialRoomProjectile.x < 0 || initialRoomProjectile.y < 0 || initialRoomProjectile.x >= mapManagerData.roomWidth || initialRoomProjectile.y >= mapManagerData.roomHeight) {
    return false;
  }

  return !initialRoomTryProjectileHitEnemy(initialRoomProjectile, initialRoomNow);
}

function initialRoomTryProjectileHitEnemy(initialRoomProjectile, initialRoomNow) {
  var initialRoomDidHit = false;

  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (initialRoomDidHit || !initialRoomIsEnemyTargetable(initialRoomEnemy)) {
      return;
    }

    if (initialRoomGetDistance(initialRoomProjectile.x, initialRoomProjectile.y, initialRoomEnemy.x, initialRoomEnemy.y) > initialRoomProjectile.radius + initialRoomEnemy.radius) {
      return;
    }

    initialRoomDamageEnemy(initialRoomEnemy, initialRoomProjectile.damage, initialRoomNow);
    initialRoomDidHit = true;
  });

  return initialRoomDidHit;
}

function initialRoomApplyEnemyContactDamage() {
  var initialRoomNow = Date.now();

  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (!initialRoomCanEnemyContactPlayer(initialRoomEnemy)) {
      return;
    }

    var initialRoomContactDistance = initialRoomGetPlayerCollisionRadius() + initialRoomEnemy.radius;

    if (initialRoomGetDistance(initialRoomPlayer.x, initialRoomPlayer.y, initialRoomEnemy.x, initialRoomEnemy.y) <= initialRoomContactDistance) {
      if (initialRoomHasTankForm()) {
        initialRoomDamageEnemy(initialRoomEnemy, 50, initialRoomNow);
      }

      if (initialRoomEnemy.contactDamage > 0 && (!initialRoomHasTankForm() || initialRoomEnemy.enemyType !== "snake")) {
        initialRoomDamagePlayer(
          initialRoomHasTankForm() && initialRoomEnemy.enemyType === "sorcerer" ? 1 : initialRoomEnemy.contactDamage,
          initialRoomGetEnemyContactDeathReason(initialRoomEnemy)
        );
      }
    }
  });
}

function initialRoomGetEnemyContactDeathReason(initialRoomEnemy) {
  if (initialRoomEnemy.enemyType === "snake") {
    return "snake";
  }

  if (initialRoomEnemy.enemyType === "negaBlob") {
    return "negaSlime";
  }

  if (initialRoomEnemy.enemyType === "sorcerer") {
    return "wizardContact";
  }

  if (initialRoomEnemy.enemyType === "blob") {
    return "redSlime";
  }

  return initialRoomHasTankForm() ? "tank" : "";
}

function initialRoomCanEnemyContactPlayer(initialRoomEnemy) {
  if (!initialRoomEnemy || initialRoomEnemy.state === "dying" || initialRoomEnemy.state === "vanished") {
    return false;
  }

  if (initialRoomHasTankForm() && initialRoomEnemy.enemyType === "snake") {
    return true;
  }

  return initialRoomIsEnemyTargetable(initialRoomEnemy);
}

function initialRoomApplyExplosionDamage() {
  var initialRoomExplosionKeys = Object.keys(initialRoomActiveExplosionTiles);

  initialRoomExplosionKeys.forEach(function (initialRoomExplosionKey) {
    var initialRoomExplosion = initialRoomActiveExplosionTiles[initialRoomExplosionKey];

    initialRoomApplyExplosionDamageToPlayer(initialRoomExplosion);
    initialRoomApplyExplosionDamageToEnemies(initialRoomExplosion);
    initialRoomApplyExplosionDamageToDestructableChecks(initialRoomExplosion);
    initialRoomApplyExplosionChainToBombs(initialRoomExplosion);
  });
}

function initialRoomApplyExplosionDamageToPlayer(initialRoomExplosion) {
  if (initialRoomExplosion.damageType === "fire") {
    return;
  }

  if (Math.floor(initialRoomPlayer.x) === initialRoomExplosion.x && Math.floor(initialRoomPlayer.y) === initialRoomExplosion.y) {
    initialRoomDamagePlayer(initialRoomExplosion.damage, "bomb");
  }
}

function initialRoomApplyExplosionDamageToEnemies(initialRoomExplosion) {
  var initialRoomNow = Date.now();

  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (!initialRoomIsEnemyExplosionTargetable(initialRoomEnemy)) {
      return;
    }

    if (Math.floor(initialRoomEnemy.x) !== initialRoomExplosion.x || Math.floor(initialRoomEnemy.y) !== initialRoomExplosion.y) {
      return;
    }

    if (initialRoomEnemy.hitBombIds[initialRoomExplosion.bombId]) {
      return;
    }

    initialRoomEnemy.hitBombIds[initialRoomExplosion.bombId] = true;
    initialRoomDamageEnemy(initialRoomEnemy, initialRoomExplosion.damage, initialRoomNow);
  });
}

function initialRoomIsEnemyExplosionTargetable(initialRoomEnemy) {
  return Boolean(initialRoomIsEnemyTargetable(initialRoomEnemy) || (
    initialRoomEnemy &&
    initialRoomEnemy.enemyType === "snake" &&
    initialRoomEnemy.state === "hidden"
  ));
}

function initialRoomDamageEnemy(initialRoomEnemy, initialRoomDamage, initialRoomNow, initialRoomStunDuration) {
  var initialRoomWasAlive = initialRoomEnemy.hp > 0;

  initialRoomEnemy.hp = Math.max(0, initialRoomEnemy.hp - initialRoomDamage);
  initialRoomEnemy.hurtUntil = initialRoomNow + initialRoomEnemyHurtDuration;

  if (initialRoomStunDuration) {
    initialRoomEnemy.stunnedUntil = Math.max(initialRoomEnemy.stunnedUntil || 0, initialRoomNow + initialRoomStunDuration);
  }

  if (initialRoomWasAlive && initialRoomEnemy.hp <= 0) {
    if (initialRoomEnemy.isShopkeep) {
      initialRoomHandleShopkeepDeath(initialRoomEnemy);
    }
    initialRoomHandleEnemyCheck(initialRoomEnemy);
    initialRoomStartEnemyDeath(initialRoomEnemy, initialRoomNow);
  }
}

function initialRoomHandleShopkeepDeath(initialRoomEnemy) {
  (initialRoomCurrentRoom.tiles || []).forEach(function (initialRoomTile) {
    var initialRoomShopKey = initialRoomGetShopRuntimeKey(initialRoomTile);

    if (!initialRoomIsShopTile(initialRoomTile)) {
      return;
    }

    if (initialRoomEnemy.removeShopItemsOnDeath) {
      initialRoomRemovedShopItems[initialRoomShopKey] = true;
    } else {
      initialRoomFreeShopItems[initialRoomShopKey] = true;
    }
  });
  initialRoomMapStatusCache = null;
}

function initialRoomStartEnemyDeath(initialRoomEnemy, initialRoomNow) {
  if (initialRoomEnemy.state === "dying") {
    return;
  }

  initialRoomEnemy.state = "dying";
  initialRoomEnemy.deathStartedAt = initialRoomNow;
  initialRoomEnemy.deathUntil = initialRoomNow + initialRoomEnemyDeathDuration;
  initialRoomEnemy.hurtUntil = 0;
}


function initialRoomMaybeSendEnemyHint(initialRoomEnemy) {
  if (!initialRoomEnemy || typeof archipelagoClientSendHintForTrigger !== "function") {
    return false;
  }

  return archipelagoClientSendHintForTrigger(initialRoomGetEnemyHintTriggerKey(initialRoomEnemy));
}

function initialRoomGetEnemyHintTriggerKey(initialRoomEnemy) {
  if (!initialRoomCurrentRoom || !initialRoomEnemy) {
    return "";
  }

  return initialRoomCurrentRoom.x + "," + initialRoomCurrentRoom.y + ":" + initialRoomEnemy.spawnTileX + "," + initialRoomEnemy.spawnTileY;
}

function initialRoomHandleEnemyCheck(initialRoomEnemy) {
  var initialRoomCheckKey = initialRoomEnemy.checkKey || "";
  var initialRoomRewardKey = initialRoomEnemy.expectedDrop || "itemPool1";
  var initialRoomRewardWasAlreadyGained = initialRoomIsRewardAlreadyGained(initialRoomRewardKey);
  var initialRoomGeneratedLocation = null;

  initialRoomMaybeSendEnemyHint(initialRoomEnemy);

  if (!initialRoomCheckKey) {
    if (globalsState.archipelago.connected) {
      initialRoomGeneratedLocation = initialRoomGetGeneratedArchipelagoLocation(initialRoomEnemy);

      if (initialRoomGeneratedLocation && archipelagoClientHasMissingLocation(initialRoomGeneratedLocation.id)) {
        return archipelagoClientSendGeneratedLocationCheck(initialRoomGeneratedLocation);
      }

      initialRoomHandleOpenedCheck("itemPool1");
      return true;
    }

    initialRoomApplyLooseReward(initialRoomRewardKey);
    initialRoomHandleOpenedCheck(initialRoomRewardKey);
    initialRoomSaveOfflineProgress();
    return true;
  }

  if (initialRoomIsLocationChecked(initialRoomCheckKey)) {
    initialRoomHandleOpenedCheck("itemPool1");
    initialRoomSaveOfflineProgress();
    return true;
  }

  if (globalsState.archipelago.connected) {
    if (archipelagoClientSendLocationCheck(initialRoomCheckKey)) {
      return true;
    }

    return false;
  }

  if (initialRoomRewardKey === "empty") {
    globalsState.locations[initialRoomCheckKey].checked = true;
    initialRoomSaveOfflineProgress();
    return true;
  }

  if (initialRoomRewardWasAlreadyGained) {
    globalsState.locations[initialRoomCheckKey].checked = true;
    initialRoomHandleOpenedCheck("itemPool1");
    initialRoomSaveOfflineProgress();
    return true;
  }

  if (progressionManagerCollectLocation(initialRoomCheckKey, initialRoomRewardKey)) {
    initialRoomRecordOfflineReward(initialRoomCheckKey, initialRoomRewardKey);
    initialRoomSaveOfflineProgress();
    initialRoomHandleOpenedCheck(initialRoomRewardKey);
    return true;
  }

  return false;
}

function initialRoomCanCollectEnemyCheck(initialRoomEnemy) {
  return initialRoomCanMeetRequirementGroups(initialRoomEnemy.requirements || []);
}

function initialRoomApplyExplosionDamageToDestructableChecks(initialRoomExplosion) {
  var initialRoomTile = initialRoomGetTile(initialRoomExplosion.x, initialRoomExplosion.y);

  if (!initialRoomCanDestroyDestructableCheck(initialRoomTile, initialRoomExplosion.damageType || "bomb", initialRoomExplosion.bombLevel || initialRoomGetBombLevel())) {
    return;
  }

  initialRoomDestroyDestructableCheck(initialRoomTile);
}

function initialRoomCanDestroyDestructableCheck(initialRoomTile, initialRoomDamageType, initialRoomDamageLevel) {
  if (!initialRoomIsDestructableCheckTile(initialRoomTile) || initialRoomIsDestructableCheckDestroyed(initialRoomTile)) {
    return false;
  }

  return (initialRoomTile.vulnerable || []).some(function (initialRoomVulnerability) {
    return initialRoomDoesVulnerabilityMatch(initialRoomVulnerability, initialRoomDamageType, initialRoomDamageLevel);
  });
}

function initialRoomCanTankTreadDestroyDestructableCheck(initialRoomTile) {
  return initialRoomCanDestroyDestructableCheck(initialRoomTile, "tankTreads", 1);
}

function initialRoomDoesVulnerabilityMatch(initialRoomVulnerability, initialRoomDamageType, initialRoomDamageLevel) {
  var initialRoomVulnerabilityParts = String(initialRoomVulnerability).toLowerCase().split(":");
  var initialRoomVulnerabilityType = initialRoomNormalizeVulnerabilityType(initialRoomVulnerabilityParts[0]);
  var initialRoomNormalizedDamageType = initialRoomNormalizeVulnerabilityType(initialRoomDamageType);
  var initialRoomRequiredLevel = initialRoomVulnerabilityParts.length > 1 ? Number(initialRoomVulnerabilityParts[1]) : 0;

  if (initialRoomVulnerabilityType !== initialRoomNormalizedDamageType) {
    return false;
  }

  return !initialRoomRequiredLevel || initialRoomDamageLevel >= initialRoomRequiredLevel;
}

function initialRoomNormalizeVulnerabilityType(initialRoomType) {
  var initialRoomNormalizedType = String(initialRoomType || "").toLowerCase();

  if (initialRoomNormalizedType === "bullet") {
    return "gun";
  }

  if (initialRoomNormalizedType === "tank" || initialRoomNormalizedType === "tanktreads" || initialRoomNormalizedType === "tankcannon") {
    return "tank";
  }

  return initialRoomNormalizedType;
}

function initialRoomIsGeneratedArchipelagoLocationActive(initialRoomGeneratedLocation) {
  if (!initialRoomGeneratedLocation || !globalsState.archipelago.connected) {
    return false;
  }

  return archipelagoClientHasMissingLocation(initialRoomGeneratedLocation.id) ||
    archipelagoClientHasCheckedLocation(initialRoomGeneratedLocation.id);
}

function initialRoomDestroyLocalOnlyDestructableCheck(initialRoomRuntimeKey, initialRoomWasAlreadyDestroyed) {
  initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey] = true;

  if (!initialRoomWasAlreadyDestroyed) {
    initialRoomHandleOpenedCheck("itemPool1");
  }

  return true;
}

function initialRoomDestroyDestructableCheck(initialRoomTile) {
  var initialRoomCheckKey = initialRoomTile.checkKey || "";
  var initialRoomRewardKey = initialRoomTile.expectedDrop || initialRoomCheckKey;
  var initialRoomRuntimeKey = initialRoomGetDestructableCheckRuntimeKey(initialRoomTile);
  var initialRoomWasAlreadyDestroyed = Boolean(initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey]);
  var initialRoomRewardWasAlreadyGained = initialRoomIsRewardAlreadyGained(initialRoomRewardKey);
  var initialRoomGeneratedLocation = null;

  initialRoomCreateDestructibleBurst(initialRoomTile);

  if (!initialRoomCheckKey) {
    if (globalsState.archipelago.connected) {
      initialRoomGeneratedLocation = initialRoomGetGeneratedArchipelagoLocation(initialRoomTile);

      if (!initialRoomIsGeneratedArchipelagoLocationActive(initialRoomGeneratedLocation)) {
        return initialRoomDestroyLocalOnlyDestructableCheck(initialRoomRuntimeKey, initialRoomWasAlreadyDestroyed);
      }

      if (archipelagoClientSendGeneratedLocationCheck(initialRoomGeneratedLocation)) {
        initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey] = true;
        return true;
      }

      if (archipelagoClientHasCheckedLocation(initialRoomGeneratedLocation.id)) {
        initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey] = true;
        return true;
      }

      return false;
    }

    initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey] = true;
    if (initialRoomRewardKey && !initialRoomWasAlreadyDestroyed) {
      if (initialRoomRewardWasAlreadyGained) {
        initialRoomHandleOpenedCheck("itemPool2");
      } else {
        initialRoomApplyLooseReward(initialRoomRewardKey);
        initialRoomHandleOpenedCheck(initialRoomRewardKey);
      }
    }
    initialRoomSaveOfflineProgress();
    return true;
  }

  if (globalsState.archipelago.connected) {
    if (archipelagoClientSendLocationCheck(initialRoomCheckKey)) {
      initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey] = true;
      return true;
    }

    return false;
  }

  if (initialRoomIsLocationChecked(initialRoomCheckKey)) {
    initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey] = true;
    initialRoomHandleOpenedCheck("itemPool1");
    initialRoomSaveOfflineProgress();
    return true;
  }

  if (initialRoomRewardKey === "empty") {
    initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey] = true;
    globalsState.locations[initialRoomCheckKey].checked = true;
    initialRoomSaveOfflineProgress();
    return true;
  }

  if (progressionManagerCollectLocation(initialRoomCheckKey, initialRoomRewardKey)) {
    initialRoomDestroyedDestructableChecks[initialRoomRuntimeKey] = true;
    initialRoomRecordOfflineReward(initialRoomCheckKey, initialRoomRewardKey);
    initialRoomSaveOfflineProgress();
    initialRoomHandleOpenedCheck(initialRoomRewardKey);
    return true;
  }

  return false;
}

function initialRoomIsRewardAlreadyGained(initialRoomRewardKey) {
  var initialRoomProgressiveBase = progressionManagerGetProgressiveCheckBase(initialRoomRewardKey);
  var initialRoomProgressiveDefinition = initialRoomProgressiveBase ? globalsState.progressiveCheckDefinitions[initialRoomProgressiveBase] : null;

  if (!initialRoomRewardKey || initialRoomRewardKey === "empty" || initialRoomIsItemPoolCheckKey(initialRoomRewardKey)) {
    return false;
  }

  if (initialRoomProgressiveDefinition) {
    return progressionManagerGetProgressiveValue(initialRoomProgressiveBase) >= initialRoomProgressiveDefinition.count;
  }

  return Boolean(globalsState.progression[initialRoomRewardKey] || globalsState.checks[initialRoomRewardKey]);
}

function initialRoomCreateDestructibleBurst(initialRoomTile) {
  var initialRoomGraphicsLevel = initialRoomGetGraphicsLevel();
  var initialRoomNow = Date.now();

  if (!initialRoomTile) {
    return;
  }

  if (initialRoomGraphicsLevel <= 0) {
    return;
  }

  initialRoomDestructibleBursts.push({
    x: initialRoomTile.x,
    y: initialRoomTile.y,
    color: initialRoomGraphicsLevel < 2 ? "#8f949d" : initialRoomGetTileCenterPixelColor(initialRoomTile),
    count: 6,
    duration: 260,
    startedAt: initialRoomNow,
    expiresAt: initialRoomNow + 260
  });
}

function initialRoomGetTileCenterPixelColor(initialRoomTile) {
  var initialRoomSprite = initialRoomTile && initialRoomTile.sprite;
  var initialRoomCenterX = 0;
  var initialRoomCenterY = 0;

  if (!initialRoomSprite || initialRoomSprite.source !== "tileset" || !initialRoomTilesetImage) {
    return "#f7f7f1";
  }

  initialRoomCenterX = (initialRoomSprite.x * initialRoomTilesetTileSize) + Math.floor(initialRoomTilesetTileSize / 2);
  initialRoomCenterY = (initialRoomSprite.y * initialRoomTilesetTileSize) + Math.floor(initialRoomTilesetTileSize / 2);

  return initialRoomGetImagePixelColor(initialRoomTilesetImage, initialRoomCenterX, initialRoomCenterY, initialRoomTile.colorReplacements);
}

function initialRoomGetImagePixelColor(initialRoomImage, initialRoomX, initialRoomY, initialRoomColorReplacements) {
  var initialRoomSampleCanvas = document.createElement("canvas");
  var initialRoomSampleContext = initialRoomSampleCanvas.getContext("2d");
  var initialRoomPixelData = null;
  var initialRoomHex = "#f7f7f1";
  var initialRoomReplacementMap = {};

  initialRoomSampleCanvas.width = 1;
  initialRoomSampleCanvas.height = 1;

  try {
    initialRoomSampleContext.drawImage(initialRoomImage, initialRoomX, initialRoomY, 1, 1, 0, 0, 1, 1);
    initialRoomPixelData = initialRoomSampleContext.getImageData(0, 0, 1, 1).data;
  } catch (initialRoomError) {
    return initialRoomHex;
  }

  initialRoomHex = initialRoomRgbToHex(initialRoomPixelData[0], initialRoomPixelData[1], initialRoomPixelData[2]);

  initialRoomNormalizeColorReplacements(initialRoomColorReplacements).forEach(function (initialRoomReplacement) {
    initialRoomReplacementMap[initialRoomReplacement.from] = initialRoomReplacement.to;
  });

  return initialRoomGetGraphicsLevel() >= 2 && initialRoomReplacementMap[initialRoomHex] ? initialRoomReplacementMap[initialRoomHex] : initialRoomHex;
}

function initialRoomApplyExplosionChainToBombs(initialRoomExplosion) {
  var initialRoomNow = Date.now();

  initialRoomBombs.forEach(function (initialRoomBomb) {
    if (initialRoomBomb.kind !== "fire" && initialRoomBomb.x === initialRoomExplosion.x && initialRoomBomb.y === initialRoomExplosion.y && !initialRoomBomb.explosionTiles && initialRoomBomb.explodedAt > initialRoomNow) {
      initialRoomBomb.explodedAt = initialRoomNow;
    }
  });
}

function initialRoomDamagePlayer(initialRoomDamage, initialRoomDeathReason) {
  var initialRoomNow = Date.now();
  var initialRoomIsTank = initialRoomHasTankForm();
  var initialRoomAppliedDamage = initialRoomIsTank ? 1 : initialRoomDamage;

  if (initialRoomIsGameOver || (!initialRoomIsTank && initialRoomNow < initialRoomPlayer.invulnerableUntil) || initialRoomPlayer.hp <= 0) {
    return false;
  }

  initialRoomPlayer.hp = Math.max(0, Math.min(initialRoomPlayer.hp, initialRoomGetEffectiveMaxHp()) - initialRoomAppliedDamage);

  if (!initialRoomIsTank) {
    initialRoomPlayer.invulnerableUntil = initialRoomNow + 2000;
  }

  if (initialRoomPlayer.hp <= 0) {
    initialRoomLastDeathReason = initialRoomIsTank && initialRoomDeathReason !== "finalRunFace" ? "tank" : (initialRoomDeathReason || "");
    initialRoomStartGameOver(initialRoomNow);
  }

  return true;
}

function initialRoomKillPlayer(initialRoomDeathReason) {
  if (initialRoomIsGameOver || initialRoomPlayer.hp <= 0) {
    return false;
  }

  initialRoomLastDeathReason = initialRoomHasTankForm() && initialRoomDeathReason !== "finalRunFace" ? "tank" : (initialRoomDeathReason || "");
  initialRoomPlayer.hp = 0;
  initialRoomStartGameOver(Date.now());
  return true;
}

function initialRoomStartGameOver(initialRoomNow) {
  var initialRoomShouldShowLocalGameOver = !initialRoomIsOnlineModeActive() || !initialRoomIsDeathLinkEnabled();

  initialRoomStopBgm();
  initialRoomStopSnakeLoops();
  initialRoomPlaySfx("gameover");
  initialRoomIsGameOver = true;
  initialRoomRoomReloadAt = initialRoomNow + initialRoomGetGameOverMessageDuration();
  initialRoomCurrentMessage = "";
  initialRoomCurrentMessageFlipped = false;
  initialRoomMessageQueue = [];
  initialRoomQueueMessage("game over", { allowOnlineLocal: initialRoomShouldShowLocalGameOver });
  initialRoomIsTextEntryActive = false;
  initialRoomTextEntryValue = "";
  initialRoomIsMapOpen = false;
  initialRoomIsStatusOpen = false;
  initialRoomKeys = {};
  initialRoomInputOrder = [];
  initialRoomPlayer.moveDirection = null;

  if (initialRoomFinalRunState.active) {
    initialRoomMessageCanvas.style.display = "block";
    initialRoomUpdateMessageCanvasBounds();
  }

  initialRoomBroadcastDeathLink();
}

function initialRoomGetGameOverMessageDuration() {
  return Math.max(initialRoomGameOverDuration, initialRoomMessageMinimumDuration);
}

function initialRoomReloadAfterGameOver() {
  initialRoomIsGameOver = false;
  initialRoomLastDeathReason = "";
  initialRoomRoomReloadAt = 0;
  initialRoomNextBgmAt = 0;
  initialRoomMessageCanvas.style.display = "block";
  initialRoomExitFinalRun();
  initialRoomResetFinalRunSceneForFreshEntry();
  initialRoomRemovedShopItems = {};
  initialRoomFreeShopItems = {};
  initialRoomCurrentRoom = mapManagerEnsureRoom(0, 0);
  initialRoomResetRoomRuntimeState();
  initialRoomResetPlayerForCurrentRoom();
  initialRoomLoadRoomEnemies();
  initialRoomCurrentMessage = "";
  initialRoomCurrentMessageFlipped = false;
  initialRoomMessageQueue = [];
  initialRoomLastUpdateTime = Date.now();
}

function initialRoomResetFinalRunSceneForFreshEntry() {
  if (initialRoomFinalRunState.frameId) {
    window.cancelAnimationFrame(initialRoomFinalRunState.frameId);
  }

  initialRoomFinalRunState.frameId = 0;
  initialRoomFinalRunState.blobs.forEach(initialRoomRemoveFinalRunBlob);
  initialRoomFinalRunState.blobs = [];
  initialRoomFinalRunState.wizards.forEach(initialRoomRemoveFinalRunWizard);
  initialRoomFinalRunState.wizards = [];
  initialRoomFinalRunState.fireballs.forEach(initialRoomRemoveFinalRunFireball);
  initialRoomFinalRunState.fireballs = [];
  initialRoomRemoveFinalRunBoss();
  initialRoomResetFinalRunCredits();
  initialRoomFinalRunState.muzzleParticles.forEach(function (initialRoomParticle) {
    if (initialRoomParticle.mesh.parent) {
      initialRoomParticle.mesh.parent.remove(initialRoomParticle.mesh);
    }

    if (initialRoomParticle.mesh.material) {
      initialRoomParticle.mesh.material.dispose();
    }
  });
  initialRoomFinalRunState.muzzleParticles = [];

  if (initialRoomFinalRunState.scene) {
    initialRoomDisposeFinalRunSceneObject(initialRoomFinalRunState.scene);
  }

  if (initialRoomFinalRunState.renderer) {
    if (initialRoomFinalRunState.renderer.domElement && initialRoomFinalRunState.renderer.domElement.parentNode) {
      initialRoomFinalRunState.renderer.domElement.parentNode.removeChild(initialRoomFinalRunState.renderer.domElement);
    }

    initialRoomFinalRunState.renderer.dispose();
  }

  if (initialRoomFinalRunState.statusElement && initialRoomFinalRunState.statusElement.parentNode) {
    initialRoomFinalRunState.statusElement.parentNode.removeChild(initialRoomFinalRunState.statusElement);
  }

  if (initialRoomFinalRunState.blobTexture) {
    initialRoomFinalRunState.blobTexture.dispose();
  }

  if (initialRoomFinalRunState.blobGreyscaleTexture) {
    initialRoomFinalRunState.blobGreyscaleTexture.dispose();
  }

  if (initialRoomFinalRunState.snakeTexture) {
    initialRoomFinalRunState.snakeTexture.dispose();
  }

  if (initialRoomFinalRunState.snakeGreyscaleTexture) {
    initialRoomFinalRunState.snakeGreyscaleTexture.dispose();
  }

  if (initialRoomFinalRunState.wizardTexture) {
    initialRoomFinalRunState.wizardTexture.dispose();
  }

  if (initialRoomFinalRunState.wizardGreyscaleTexture) {
    initialRoomFinalRunState.wizardGreyscaleTexture.dispose();
  }

  if (initialRoomFinalRunState.fireballTexture) {
    initialRoomFinalRunState.fireballTexture.dispose();
  }

  initialRoomFinalRunState.loading = false;
  initialRoomFinalRunState.initialized = false;
  initialRoomFinalRunState.renderer = null;
  initialRoomFinalRunState.scene = null;
  initialRoomFinalRunState.camera = null;
  initialRoomFinalRunState.cube = null;
  initialRoomFinalRunState.groundRollGroup = null;
  initialRoomFinalRunState.groundSphere = null;
  initialRoomFinalRunState.groundRollAmount = 0;
  initialRoomFinalRunState.sunLight = null;
  initialRoomFinalRunState.sunMarker = null;
  initialRoomFinalRunState.tankViewModel = null;
  initialRoomFinalRunState.tankNozzlePivot = null;
  initialRoomFinalRunState.tankNozzleRecoilGroup = null;
  initialRoomFinalRunState.tankMaterials = [];
  initialRoomFinalRunState.crosshair = null;
  initialRoomFinalRunState.crosshairMaterial = null;
  initialRoomFinalRunState.muzzleParticleGeometry = null;
  initialRoomFinalRunState.nozzleRecoilStartedAt = 0;
  initialRoomFinalRunState.blobTexture = null;
  initialRoomFinalRunState.blobGreyscaleTexture = null;
  initialRoomFinalRunState.blobSpawnIndex = 0;
  initialRoomFinalRunState.nextBlobSpawnAt = 0;
  initialRoomFinalRunState.snakeTexture = null;
  initialRoomFinalRunState.snakeGreyscaleTexture = null;
  initialRoomFinalRunState.snakeSpawnIndex = 0;
  initialRoomFinalRunState.nextSnakeSpawnAt = 0;
  initialRoomFinalRunState.wizardTexture = null;
  initialRoomFinalRunState.wizardGreyscaleTexture = null;
  initialRoomFinalRunState.wizardSpawnIndex = 0;
  initialRoomFinalRunState.nextWizardSpawnAt = 0;
  initialRoomFinalRunState.fireballTexture = null;
  initialRoomFinalRunState.bossSpawned = false;
  initialRoomFinalRunState.bossDefeated = false;
  initialRoomFinalRunState.runStartedAt = 0;
  initialRoomFinalRunState.rocks = [];
  initialRoomFinalRunState.materials = {};
  initialRoomFinalRunState.graphicsLevel = -1;
  initialRoomFinalRunState.world = null;
  initialRoomFinalRunState.statusElement = null;
}

function initialRoomDisposeFinalRunSceneObject(initialRoomObject) {
  initialRoomObject.traverse(function (initialRoomChild) {
    if (initialRoomChild.geometry) {
      initialRoomChild.geometry.dispose();
    }

    if (Array.isArray(initialRoomChild.material)) {
      initialRoomChild.material.forEach(function (initialRoomMaterial) {
        initialRoomDisposeFinalRunMaterial(initialRoomMaterial);
      });
    } else if (initialRoomChild.material) {
      initialRoomDisposeFinalRunMaterial(initialRoomChild.material);
    }
  });
}

function initialRoomDisposeFinalRunMaterial(initialRoomMaterial) {
  if (initialRoomMaterial.map) {
    initialRoomMaterial.map.dispose();
  }

  initialRoomMaterial.dispose();
}

function initialRoomResetRoomRuntimeState() {
  initialRoomStopSnakeLoops();
  initialRoomBombs.forEach(function (initialRoomBomb) {
    initialRoomRemoveBombExplosionObjects(initialRoomBomb);
  });
  initialRoomBombs = [];
  initialRoomTankShots = [];
  initialRoomDestructibleBursts = [];
  initialRoomProjectiles = [];
  initialRoomWizardFireballs = [];
  initialRoomMeleeAttacks = [];
  initialRoomNextMeleeAllowedAt = 0;
  initialRoomNextTankShotAllowedAt = 0;
  initialRoomActiveExplosionTiles = {};
  initialRoomDestroyedDestructableChecks = {};
  initialRoomDestroyedBlockers = {};
  initialRoomEffectLayer.innerHTML = "";
  initialRoomEnemyLayer.innerHTML = "";
}

function initialRoomResetStartupInputState() {
  initialRoomKeys = {};
  initialRoomInputOrder = [];
  initialRoomIsTextEntryActive = false;
  initialRoomTextEntryValue = "";
  initialRoomIsMapOpen = false;
  initialRoomIsStatusOpen = false;
  initialRoomIsMessageLogOpen = false;
  initialRoomMessageLogCloseRect = null;
  initialRoomMapStatusCache = null;
  initialRoomIsGameOver = false;
  initialRoomRoomReloadAt = 0;
  initialRoomDoorWarpCooldownUntil = 0;
  initialRoomLastUpdateTime = 0;
  initialRoomPlayer.moveDirection = null;
  initialRoomTrapState.stunUntil = 0;
  initialRoomTrapState.invisibleUntil = 0;
  initialRoomTrapState.fastUntil = 0;
  initialRoomTrapState.slowUntil = 0;
  initialRoomTrapState.reverseUntil = 0;
  initialRoomTrapState.flipMessagesRemaining = 0;
  initialRoomTrapState.zoomRoomId = "";
}

function initialRoomResetPlayerForCurrentRoom() {
  initialRoomSyncPlayerResourceMaxes();
  initialRoomPlayer.x = Math.floor(mapManagerData.roomWidth / 2) + 0.5;
  initialRoomPlayer.y = Math.floor(mapManagerData.roomHeight / 2) + 0.5;
  initialRoomPlayer.targetX = initialRoomPlayer.x;
  initialRoomPlayer.targetY = initialRoomPlayer.y;
  initialRoomPlayer.hp = initialRoomGetEffectiveMaxHp();
  initialRoomPlayer.rounds = initialRoomPlayer.maxRounds;
  initialRoomPlayer.invulnerableUntil = 0;
  initialRoomPlayer.moveDirection = null;
}

function initialRoomSaveOfflineProgress() {
  var initialRoomSaveKey = globalsState.offlineSaveKey || "shellipelagoOfflineSave";
  var initialRoomSaveVersion = globalsState.offlineSaveVersion || "1.1";

  if (globalsState.archipelago.connected) {
    return;
  }

  try {
    localStorage.setItem(initialRoomSaveKey, JSON.stringify({
      version: initialRoomSaveVersion,
      progression: initialRoomClonePlainObject(globalsState.progression),
      checks: initialRoomClonePlainObject(globalsState.checks),
      checkedLocations: initialRoomGetCheckedLocationKeys(),
      offlineRewards: initialRoomGetOfflineRewardMap(),
      openedRuntimeChecks: initialRoomClonePlainObject(initialRoomOpenedRuntimeChecks),
      purchasedShopItems: initialRoomClonePlainObject(initialRoomPurchasedShopItems),
      hiddenShopItems: initialRoomClonePlainObject(initialRoomHiddenShopItems),
      visitedRoomEdges: initialRoomCloneVisitedRoomEdges(),
      visitedWarpRooms: initialRoomCloneVisitedWarpRooms(),
      playerResources: {
        hp: initialRoomPlayer.hp,
        energy: initialRoomPlayer.energy,
        rounds: initialRoomPlayer.rounds
      }
    }));
  } catch (initialRoomError) {
    console.error(initialRoomError);
  }
}

function initialRoomLoadOfflineProgress() {
  var initialRoomSaveKey = globalsState.offlineSaveKey || "shellipelagoOfflineSave";
  var initialRoomSaveVersion = globalsState.offlineSaveVersion || "1.1";
  var initialRoomRawSave = "";
  var initialRoomSave = null;

  if (globalsState.archipelago.connected || !globalsState.shouldLoadOfflineSave) {
    return;
  }

  initialRoomRawSave = localStorage.getItem(initialRoomSaveKey);

  if (!initialRoomRawSave) {
    return;
  }

  try {
    initialRoomSave = JSON.parse(initialRoomRawSave);
  } catch (initialRoomError) {
    console.error(initialRoomError);
    localStorage.removeItem(initialRoomSaveKey);
    return;
  }

  if (!initialRoomSave || String(initialRoomSave.version || "") !== initialRoomSaveVersion) {
    localStorage.removeItem(initialRoomSaveKey);
    return;
  }

  initialRoomApplyPlainObject(globalsState.progression, initialRoomSave.progression || {});
  initialRoomApplyPlainObject(globalsState.checks, initialRoomSave.checks || {});
  initialRoomApplyCheckedLocations(initialRoomSave.checkedLocations || []);
  initialRoomOfflineRewardOverrides = Object.assign(
    initialRoomBuildOfflineRewardMapFromCheckedLocations(initialRoomSave.checkedLocations || []),
    initialRoomBuildOfflineRewardMapFromRuntimeState(initialRoomSave.openedRuntimeChecks || {}, initialRoomSave.purchasedShopItems || {}),
    initialRoomClonePlainObject(initialRoomSave.offlineRewards || {})
  );
  initialRoomApplyOfflineRewards(initialRoomOfflineRewardOverrides);
  initialRoomOpenedRuntimeChecks = initialRoomClonePlainObject(initialRoomSave.openedRuntimeChecks || {});
  initialRoomPurchasedShopItems = initialRoomClonePlainObject(initialRoomSave.purchasedShopItems || {});
  initialRoomHiddenShopItems = initialRoomClonePlainObject(initialRoomSave.hiddenShopItems || {});
  initialRoomRemovedShopItems = {};
  initialRoomFreeShopItems = {};
  initialRoomVisitedRoomEdges = initialRoomCloneVisitedRoomEdges(initialRoomSave.visitedRoomEdges || {});
  initialRoomVisitedWarpRooms = initialRoomCloneVisitedWarpRooms(initialRoomSave.visitedWarpRooms || {});
  initialRoomApplySavedPlayerResources(initialRoomSave.playerResources || {});
}

function initialRoomClonePlainObject(initialRoomObject) {
  return Object.assign({}, initialRoomObject || {});
}

function initialRoomCloneVisitedRoomEdges(initialRoomSource) {
  var initialRoomClone = {};
  var initialRoomEdges = initialRoomSource || initialRoomVisitedRoomEdges;

  Object.keys(initialRoomEdges || {}).forEach(function (initialRoomKey) {
    initialRoomClone[initialRoomKey] = initialRoomClonePlainObject(initialRoomEdges[initialRoomKey]);
  });

  return initialRoomClone;
}

function initialRoomCloneVisitedWarpRooms(initialRoomSource) {
  return initialRoomClonePlainObject(initialRoomSource || initialRoomVisitedWarpRooms);
}

function initialRoomApplyPlainObject(initialRoomTarget, initialRoomSource) {
  Object.keys(initialRoomSource || {}).forEach(function (initialRoomKey) {
    initialRoomTarget[initialRoomKey] = initialRoomSource[initialRoomKey];
  });
}

function initialRoomGetCheckedLocationKeys() {
  return Object.keys(globalsState.locations).filter(function (initialRoomLocationKey) {
    return globalsState.locations[initialRoomLocationKey].checked;
  });
}

function initialRoomGetOfflineRewardMap() {
  var initialRoomRewardMap = initialRoomClonePlainObject(initialRoomOfflineRewardOverrides);

  initialRoomGetCheckedLocationKeys().forEach(function (initialRoomLocationKey) {
    var initialRoomRewardKey = initialRoomGetOfflineRewardForLocationKey(initialRoomLocationKey);

    if (initialRoomRewardKey) {
      initialRoomRewardMap[initialRoomLocationKey] = initialRoomRewardKey;
    }
  });

  return initialRoomRewardMap;
}

function initialRoomBuildOfflineRewardMapFromCheckedLocations(initialRoomCheckedLocationKeys) {
  var initialRoomRewardMap = {};

  (initialRoomCheckedLocationKeys || []).forEach(function (initialRoomLocationKey) {
    var initialRoomRewardKey = initialRoomGetOfflineRewardForLocationKey(initialRoomLocationKey);

    if (initialRoomRewardKey) {
      initialRoomRewardMap[initialRoomLocationKey] = initialRoomRewardKey;
    }
  });

  return initialRoomRewardMap;
}

function initialRoomBuildOfflineRewardMapFromRuntimeState(initialRoomOpenedChecks, initialRoomPurchasedShops) {
  var initialRoomRewardMap = {};

  (mapManagerData.rooms || []).forEach(function (initialRoomRoom) {
    (initialRoomRoom.tiles || []).forEach(function (initialRoomTile) {
      var initialRoomRuntimeCheckKey = initialRoomGetRuntimeCheckKey(initialRoomTile, initialRoomRoom);
      var initialRoomShopKey = initialRoomRoom.id + ":shop:" + initialRoomTile.x + "," + initialRoomTile.y;
      var initialRoomRewardKey = "";

      if (initialRoomOpenedChecks && initialRoomOpenedChecks[initialRoomRuntimeCheckKey]) {
        initialRoomRewardKey = initialRoomTile.expectedDrop || initialRoomTile.checkKey || "";
        if (initialRoomRewardKey) {
          initialRoomRewardMap[initialRoomRuntimeCheckKey] = initialRoomRewardKey;
        }
      }

      if (initialRoomPurchasedShops && initialRoomPurchasedShops[initialRoomShopKey]) {
        initialRoomRewardKey = initialRoomTile.shopDrop || "";
        if (initialRoomRewardKey) {
          initialRoomRewardMap[initialRoomShopKey] = initialRoomRewardKey;
        }
      }
    });
  });

  return initialRoomRewardMap;
}

function initialRoomGetOfflineRewardForLocationKey(initialRoomLocationKey) {
  var initialRoomLocationTile = initialRoomFindTileForLocationKey(initialRoomLocationKey);
  var initialRoomLocationEnemy = initialRoomFindEnemyForLocationKey(initialRoomLocationKey);
  var initialRoomRewardKey = "";

  if (initialRoomLocationTile) {
    initialRoomRewardKey = initialRoomLocationTile.expectedDrop || initialRoomLocationTile.shopDrop || initialRoomLocationTile.checkKey || "";
  } else if (initialRoomLocationEnemy) {
    initialRoomRewardKey = initialRoomLocationEnemy.expectedDrop || initialRoomLocationEnemy.checkKey || "";
  } else {
    initialRoomRewardKey = initialRoomLocationKey;
  }

  if (!initialRoomRewardKey || initialRoomRewardKey === "empty" || initialRoomIsItemPoolCheckKey(initialRoomRewardKey)) {
    return "";
  }

  return initialRoomRewardKey;
}

function initialRoomFindTileForLocationKey(initialRoomLocationKey) {
  var initialRoomFoundTile = null;

  (mapManagerData.rooms || []).some(function (initialRoomRoom) {
    return (initialRoomRoom.tiles || []).some(function (initialRoomTile) {
      if (initialRoomTile && initialRoomTile.checkKey === initialRoomLocationKey) {
        initialRoomFoundTile = initialRoomTile;
        return true;
      }

      return false;
    });
  });

  return initialRoomFoundTile;
}

function initialRoomFindEnemyForLocationKey(initialRoomLocationKey) {
  var initialRoomFoundEnemy = null;

  (mapManagerData.rooms || []).some(function (initialRoomRoom) {
    return (initialRoomRoom.enemies || []).some(function (initialRoomEnemy) {
      if (initialRoomEnemy && initialRoomEnemy.checkKey === initialRoomLocationKey) {
        initialRoomFoundEnemy = initialRoomEnemy;
        return true;
      }

      return false;
    });
  });

  return initialRoomFoundEnemy;
}

function initialRoomApplyOfflineRewards(initialRoomOfflineRewards) {
  var initialRoomProgressiveCounts = {};
  var initialRoomProgressiveRoomLevel = 0;

  Object.keys(initialRoomOfflineRewards || {}).forEach(function (initialRoomLocationKey) {
    var initialRoomRewardKey = initialRoomOfflineRewards[initialRoomLocationKey];
    var initialRoomProgressiveBase = "";

    if (!initialRoomShouldRestoreOfflineReward(initialRoomRewardKey)) {
      return;
    }

    if (progressionManagerIsProgressiveRoomCheck(initialRoomRewardKey)) {
      initialRoomProgressiveRoomLevel = Math.max(initialRoomProgressiveRoomLevel, progressionManagerGetProgressiveRoomRing(initialRoomRewardKey));
      return;
    }

    initialRoomProgressiveBase = progressionManagerGetProgressiveCheckBase(initialRoomRewardKey);

    if (initialRoomProgressiveBase) {
      initialRoomProgressiveCounts[initialRoomProgressiveBase] = (initialRoomProgressiveCounts[initialRoomProgressiveBase] || 0) + 1;
      return;
    }

    if (globalsState.checkDefinitions[initialRoomRewardKey]) {
      globalsState.progression[initialRoomRewardKey] = true;
      globalsState.checks[initialRoomRewardKey] = true;
    }
  });

  Object.keys(initialRoomProgressiveCounts).forEach(function (initialRoomProgressiveBase) {
    var initialRoomDefinition = globalsState.progressiveCheckDefinitions[initialRoomProgressiveBase];
    var initialRoomValue = Math.min(initialRoomDefinition.count, initialRoomProgressiveCounts[initialRoomProgressiveBase]);

    if (initialRoomProgressiveBase === "progressiveRoom") {
      initialRoomProgressiveRoomLevel = Math.max(initialRoomProgressiveRoomLevel, initialRoomValue);
      return;
    }

    if (initialRoomProgressiveBase === "graphics") {
      globalsState.progression.graphicsLevel = Math.max(globalsState.progression.graphicsLevel || 0, initialRoomValue);
      globalsState.progression.graphics = globalsState.progression.graphicsLevel > 0;
      globalsState.checks.graphics = globalsState.progression.graphics;
      return;
    }

    globalsState.progression[initialRoomProgressiveBase] = Math.max(globalsState.progression[initialRoomProgressiveBase] || 0, initialRoomValue);
    globalsState.checks[initialRoomProgressiveBase] = globalsState.progression[initialRoomProgressiveBase] > 0;
  });

  if (initialRoomProgressiveRoomLevel > 0) {
    globalsState.progression.progressiveRooms = Math.max(globalsState.progression.progressiveRooms || 0, initialRoomProgressiveRoomLevel);
    for (var initialRoomRoomLevel = 1; initialRoomRoomLevel <= globalsState.progression.progressiveRooms; initialRoomRoomLevel += 1) {
      globalsState.progression["progressiveRoom" + initialRoomRoomLevel] = true;
      globalsState.checks["progressiveRoom" + initialRoomRoomLevel] = true;
    }
  }

  initialRoomSyncPlayerResourceMaxes();
}

function initialRoomShouldRestoreOfflineReward(initialRoomRewardKey) {
  if (!initialRoomRewardKey || initialRoomRewardKey === "empty" || initialRoomIsItemPoolCheckKey(initialRoomRewardKey)) {
    return false;
  }

  if (initialRoomIsTrapDrop(initialRoomRewardKey)) {
    return false;
  }

  return Boolean(
    globalsState.checkDefinitions[initialRoomRewardKey] ||
    globalsState.progressiveCheckDefinitions[initialRoomRewardKey] ||
    progressionManagerGetProgressiveCheckBase(initialRoomRewardKey)
  );
}

function initialRoomRecordOfflineReward(initialRoomLocationKey, initialRoomRewardKey) {
  if (globalsState.archipelago.connected || !initialRoomLocationKey || !initialRoomShouldRestoreOfflineReward(initialRoomRewardKey)) {
    return;
  }

  initialRoomOfflineRewardOverrides[initialRoomLocationKey] = initialRoomRewardKey;
}

function initialRoomApplyCheckedLocations(initialRoomCheckedLocationKeys) {
  Object.keys(globalsState.locations).forEach(function (initialRoomLocationKey) {
    globalsState.locations[initialRoomLocationKey].checked = false;
  });

  initialRoomCheckedLocationKeys.forEach(function (initialRoomLocationKey) {
    if (globalsState.locations[initialRoomLocationKey]) {
      globalsState.locations[initialRoomLocationKey].checked = true;
    }
  });
}

function initialRoomApplySavedPlayerResources(initialRoomPlayerResources) {
  initialRoomSyncPlayerResourceMaxes();
  initialRoomPlayer.hp = Math.max(1, Math.min(initialRoomGetEffectiveMaxHp(), Number(initialRoomPlayerResources.hp) || initialRoomGetEffectiveMaxHp()));
  initialRoomPlayer.energy = Math.max(0, Number(initialRoomPlayerResources.energy) || 0);
  initialRoomPlayer.rounds = Math.max(0, Math.min(initialRoomPlayer.maxRounds, Number(initialRoomPlayerResources.rounds) || 0));
}

function initialRoomUpdate() {
  var initialRoomNow = Date.now();
  var initialRoomDeltaSeconds = initialRoomLastUpdateTime ? Math.min(0.05, (initialRoomNow - initialRoomLastUpdateTime) / 1000) : 0;

  initialRoomLastUpdateTime = initialRoomNow;
  initialRoomUpdateBgm(initialRoomNow);
  initialRoomUpdateTrapState(initialRoomNow);

  if (initialRoomFinalRunState.active) {
    return;
  }

  if (initialRoomIsGameOver) {
    if (initialRoomNow >= initialRoomRoomReloadAt) {
      initialRoomReloadAfterGameOver();
    }

    return;
  }

  if (initialRoomIsTextEntryActive) {
    return;
  }

  if (initialRoomIsMessageLogOpen) {
    return;
  }

  if (initialRoomIsMapOpen) {
    return;
  }

  if (initialRoomIsStatusOpen) {
    return;
  }

  initialRoomUpdateBombs();

  initialRoomUpdateTankSpawnState();

  if (initialRoomIsStunTrapActive()) {
    initialRoomUpdateEnemies(initialRoomDeltaSeconds);
    initialRoomUpdateCombat(initialRoomDeltaSeconds);
    return;
  }

  if (initialRoomHasTankForm()) {
    initialRoomUpdateTankMovement(initialRoomDeltaSeconds);
    initialRoomUpdateEnemies(initialRoomDeltaSeconds);
    initialRoomUpdateCombat(initialRoomDeltaSeconds);
    return;
  }

  if (globalsState.progression.freeGrid) {
    initialRoomUpdateFreeMovement(initialRoomDeltaSeconds);
    initialRoomUpdateEnemies(initialRoomDeltaSeconds);
    initialRoomUpdateCombat(initialRoomDeltaSeconds);
    return;
  }

  initialRoomUpdateTileLockedMovement(initialRoomDeltaSeconds);
  initialRoomUpdateEnemies(initialRoomDeltaSeconds);
  initialRoomUpdateCombat(initialRoomDeltaSeconds);
}

function initialRoomUpdateTrapState(initialRoomNow) {
  if (initialRoomTrapState.zoomRoomId && (!initialRoomCurrentRoom || initialRoomCurrentRoom.id !== initialRoomTrapState.zoomRoomId)) {
    initialRoomTrapState.zoomRoomId = "";
  }

  if (initialRoomTrapState.fastUntil <= initialRoomNow) {
    initialRoomTrapState.fastUntil = 0;
  }

  if (initialRoomTrapState.slowUntil <= initialRoomNow) {
    initialRoomTrapState.slowUntil = 0;
  }
}

function initialRoomIsStunTrapActive() {
  return Date.now() < initialRoomTrapState.stunUntil;
}

function initialRoomIsInvisibleTrapActive() {
  return Date.now() < initialRoomTrapState.invisibleUntil;
}

function initialRoomIsReverseTrapActive() {
  return Date.now() < initialRoomTrapState.reverseUntil;
}

function initialRoomIsZoomTrapActive() {
  return Boolean(initialRoomTrapState.zoomRoomId && initialRoomCurrentRoom && initialRoomCurrentRoom.id === initialRoomTrapState.zoomRoomId);
}

function initialRoomGetMovementSpeedMultiplier() {
  var initialRoomNow = Date.now();
  var initialRoomMultiplier = 1;

  if (initialRoomTrapState.fastUntil > initialRoomNow) {
    initialRoomMultiplier *= 3;
  }

  if (initialRoomTrapState.slowUntil > initialRoomNow) {
    initialRoomMultiplier *= 0.5;
  }

  return initialRoomMultiplier;
}

function initialRoomLoop() {
  initialRoomUpdate();
  initialRoomDraw();
  window.requestAnimationFrame(initialRoomLoop);
}

function initialRoomOpenTextEntry() {
  initialRoomIsTextEntryActive = true;
  initialRoomTextEntryValue = "";
  initialRoomCurrentMessage = "";
  initialRoomKeys = {};
  initialRoomInputOrder = [];
  initialRoomPlayer.moveDirection = null;
}

function initialRoomPlaceBomb() {
  var initialRoomBombLevel = initialRoomGetBombLevel();
  var initialRoomBombCost = initialRoomBombLevel;
  var initialRoomTileX = Math.floor(initialRoomPlayer.x);
  var initialRoomTileY = Math.floor(initialRoomPlayer.y);
  var initialRoomNow = Date.now();
  var initialRoomExistingBomb = initialRoomBombs.some(function (initialRoomBomb) {
    return initialRoomBomb.x === initialRoomTileX && initialRoomBomb.y === initialRoomTileY && initialRoomNow < initialRoomBomb.explodedAt;
  });

  if (initialRoomHasTankForm()) {
    return;
  }

  if (initialRoomBombLevel <= 0 || initialRoomExistingBomb || initialRoomPlayer.rounds < initialRoomBombCost) {
    return;
  }

  if (!initialRoomSpendRounds(initialRoomBombCost, "bomb")) {
    return;
  }

  initialRoomBombs.push({
    id: initialRoomNow + ":" + initialRoomTileX + "," + initialRoomTileY,
    kind: "bomb",
    x: initialRoomTileX,
    y: initialRoomTileY,
    level: initialRoomBombLevel,
    radius: initialRoomGetBombRadius(initialRoomBombLevel),
    damage: initialRoomGetBombDamage(initialRoomBombLevel),
    placedAt: initialRoomNow,
    explodedAt: initialRoomNow + initialRoomBombFuseDuration
  });
}

function initialRoomPlaceFire() {
  var initialRoomDirection = initialRoomPlayer.facingDirection || { x: 0, y: 1 };
  var initialRoomTileX = Math.floor(initialRoomPlayer.x + initialRoomDirection.x);
  var initialRoomTileY = Math.floor(initialRoomPlayer.y + initialRoomDirection.y);
  var initialRoomNow = Date.now();

  if (initialRoomHasTankForm() || !globalsState.progression.fire || initialRoomPlayer.energy < 1) {
    return;
  }

  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return;
  }

  initialRoomPlayer.energy -= 1;
  if (initialRoomIsEnergyLinkEnabled() && initialRoomIsOnlineModeActive() && typeof archipelagoClientSendEnergyLinkDeplete === "function") {
    archipelagoClientSendEnergyLinkDeplete(1, "fire:" + initialRoomNow + ":" + Math.random().toString(36).slice(2));
  }

  initialRoomBombs.push({
    id: "fire:" + initialRoomNow + ":" + initialRoomTileX + "," + initialRoomTileY,
    kind: "fire",
    x: initialRoomTileX,
    y: initialRoomTileY,
    level: 1,
    radius: 0,
    damage: 2,
    placedAt: initialRoomNow,
    explodedAt: initialRoomNow,
    duration: initialRoomFireDuration
  });
  initialRoomCreateBombExplosionObjects(initialRoomBombs[initialRoomBombs.length - 1], initialRoomNow);
  initialRoomPlaySfx("fire");
}

function initialRoomShoot(initialRoomRequestedDirection) {
  var initialRoomGunLevel = Math.min(2, progressionManagerGetProgressiveValue("gun"));
  var initialRoomProjectileLevel = initialRoomGunLevel;
  var initialRoomDirection = initialRoomNormalizeShotDirection(initialRoomRequestedDirection || initialRoomPlayer.facingDirection || { x: 0, y: 1 });
  var initialRoomNow = Date.now();

  if (initialRoomHasTankForm() || initialRoomNow < initialRoomNextProjectileShotAllowedAt) {
    return;
  }

  initialRoomSyncPlayerResourceMaxes();

  if (initialRoomProjectileLevel <= 0) {
    return;
  }

  if (initialRoomPlayer.rounds <= 0) {
    return;
  }

  if (!initialRoomSpendRounds(1, "gun")) {
    return;
  }

  initialRoomProjectiles.push({
    x: initialRoomPlayer.x + (initialRoomDirection.x * 0.45),
    y: initialRoomPlayer.y + (initialRoomDirection.y * 0.45),
    direction: {
      x: initialRoomDirection.x,
      y: initialRoomDirection.y
    },
    level: initialRoomProjectileLevel,
    damage: initialRoomProjectileLevel,
    radius: initialRoomProjectileLevel >= 2 ? 0.16 : 0.08,
    speed: initialRoomProjectileSpeed,
    expiresAt: initialRoomNow + (initialRoomProjectileLevel >= 2 ? 1800 : 900)
  });
  initialRoomNextProjectileShotAllowedAt = initialRoomNow + initialRoomProjectileShotCooldownMs;
  initialRoomPlaySfx("bullet");
}

function initialRoomNormalizeShotDirection(initialRoomDirection) {
  var initialRoomDeltaX = Number(initialRoomDirection && initialRoomDirection.x) || 0;
  var initialRoomDeltaY = Number(initialRoomDirection && initialRoomDirection.y) || 0;
  var initialRoomLength = Math.sqrt((initialRoomDeltaX * initialRoomDeltaX) + (initialRoomDeltaY * initialRoomDeltaY));

  if (initialRoomLength <= 0.001) {
    return { x: 0, y: 1 };
  }

  return {
    x: initialRoomDeltaX / initialRoomLength,
    y: initialRoomDeltaY / initialRoomLength
  };
}

function initialRoomShootTowardMouse() {
  var initialRoomPlayerScreen = initialRoomWorldToScreen(initialRoomPlayer.x, initialRoomPlayer.y);

  initialRoomShoot({
    x: initialRoomMouse.x - initialRoomPlayerScreen.x,
    y: initialRoomMouse.y - initialRoomPlayerScreen.y
  });
}

function initialRoomFireTankCannon() {
  var initialRoomNow = Date.now();
  var initialRoomPlayerScreen = initialRoomWorldToScreen(initialRoomPlayer.x, initialRoomPlayer.y);
  var initialRoomDeltaX = initialRoomMouse.x - initialRoomPlayerScreen.x;
  var initialRoomDeltaY = initialRoomMouse.y - initialRoomPlayerScreen.y;
  var initialRoomLength = Math.sqrt((initialRoomDeltaX * initialRoomDeltaX) + (initialRoomDeltaY * initialRoomDeltaY));
  var initialRoomDirection = null;
  var initialRoomShot = null;

  if (!initialRoomHasTankForm() || initialRoomNow < initialRoomNextTankShotAllowedAt) {
    return;
  }

  if (initialRoomLength <= 0.001) {
    initialRoomDirection = initialRoomGetTankForwardVector();
  } else {
    initialRoomDirection = {
      x: initialRoomDeltaX / initialRoomLength,
      y: initialRoomDeltaY / initialRoomLength
    };
  }

  initialRoomShot = initialRoomTraceTankCannonShot(initialRoomDirection, initialRoomNow);
  initialRoomTankShots.push(initialRoomShot);
  initialRoomDamageEnemiesInTankShot(initialRoomShot, initialRoomNow);
  initialRoomApplyTankShotImpact(initialRoomShot);
  initialRoomNextTankShotAllowedAt = initialRoomNow + initialRoomTankShotCooldown;
  initialRoomPlaySfx("tank");
}

function initialRoomTraceTankCannonShot(initialRoomDirection, initialRoomNow) {
  var initialRoomNozzleDistance = 1.42;
  var initialRoomStartX = initialRoomPlayer.x + (initialRoomDirection.x * initialRoomNozzleDistance);
  var initialRoomStartY = initialRoomPlayer.y + (initialRoomDirection.y * initialRoomNozzleDistance);
  var initialRoomEndX = initialRoomStartX;
  var initialRoomEndY = initialRoomStartY;
  var initialRoomStep = 0.08;
  var initialRoomDistance = 0;
  var initialRoomMaxDistance = Math.max(mapManagerData.roomWidth, mapManagerData.roomHeight) * 1.5;
  var initialRoomImpactTile = null;

  while (initialRoomDistance < initialRoomMaxDistance) {
    initialRoomEndX = initialRoomStartX + (initialRoomDirection.x * initialRoomDistance);
    initialRoomEndY = initialRoomStartY + (initialRoomDirection.y * initialRoomDistance);

    if (initialRoomEndX < 0 || initialRoomEndY < 0 || initialRoomEndX >= mapManagerData.roomWidth || initialRoomEndY >= mapManagerData.roomHeight) {
      break;
    }

    initialRoomImpactTile = initialRoomGetTile(Math.floor(initialRoomEndX), Math.floor(initialRoomEndY));

    if (initialRoomIsTankShotImpactTile(initialRoomImpactTile)) {
      break;
    }

    initialRoomImpactTile = null;
    initialRoomDistance += initialRoomStep;
  }

  return {
    id: initialRoomNow,
    startX: initialRoomStartX,
    startY: initialRoomStartY,
    endX: initialRoomEndX,
    endY: initialRoomEndY,
    direction: {
      x: initialRoomDirection.x,
      y: initialRoomDirection.y
    },
    normal: {
      x: -initialRoomDirection.y,
      y: initialRoomDirection.x
    },
    impactTile: initialRoomImpactTile,
    startedAt: initialRoomNow,
    expiresAt: initialRoomNow + initialRoomTankShotDuration
  };
}

function initialRoomIsTankShotImpactTile(initialRoomTile) {
  if (!initialRoomTile || initialRoomIsEnemyTile(initialRoomTile) || initialRoomIsBlockerDestroyed(initialRoomTile) || initialRoomIsDestructableCheckDestroyed(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsWaterTile(initialRoomTile) || initialRoomIsLavaTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsJumpTile(initialRoomTile)) {
    return false;
  }

  if (initialRoomIsShopTile(initialRoomTile)) {
    return !initialRoomIsShopItemHidden(initialRoomTile);
  }

  if (initialRoomTile.type === "check") {
    return !initialRoomIsCheckTileCollected(initialRoomTile);
  }

  if (initialRoomIsDestructableCheckTile(initialRoomTile)) {
    return true;
  }

  return initialRoomIsBlockingTileType(initialRoomTile);
}

function initialRoomApplyTankShotImpact(initialRoomShot) {
  if (initialRoomShot.impactTile && initialRoomIsShopTile(initialRoomShot.impactTile)) {
    initialRoomTryBuyShopTile(initialRoomShot.impactTile);
    return;
  }

  if (initialRoomShot.impactTile && initialRoomIsChestCheckTile(initialRoomShot.impactTile)) {
    initialRoomTryCollectCheckTile(initialRoomShot.impactTile);
    return;
  }

  if (!initialRoomShot.impactTile || (
    !initialRoomCanDestroyDestructableCheck(initialRoomShot.impactTile, "cannon", 1) &&
    !initialRoomCanDestroyDestructableCheck(initialRoomShot.impactTile, "tank", 1)
  )) {
    return;
  }

  initialRoomDestroyDestructableCheck(initialRoomShot.impactTile);
}

function initialRoomDamageEnemiesInTankShot(initialRoomShot, initialRoomNow) {
  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (!initialRoomIsEnemyTargetable(initialRoomEnemy)) {
      return;
    }

    if (initialRoomGetPointToSegmentDistance(initialRoomEnemy.x, initialRoomEnemy.y, initialRoomShot.startX, initialRoomShot.startY, initialRoomShot.endX, initialRoomShot.endY) > initialRoomEnemy.radius + 0.28) {
      return;
    }

    initialRoomDamageEnemy(initialRoomEnemy, 9, initialRoomNow, initialRoomEnemySwordStunDuration);
  });
}

function initialRoomGetPointToSegmentDistance(initialRoomPointX, initialRoomPointY, initialRoomStartX, initialRoomStartY, initialRoomEndX, initialRoomEndY) {
  var initialRoomSegmentX = initialRoomEndX - initialRoomStartX;
  var initialRoomSegmentY = initialRoomEndY - initialRoomStartY;
  var initialRoomSegmentLengthSquared = (initialRoomSegmentX * initialRoomSegmentX) + (initialRoomSegmentY * initialRoomSegmentY);
  var initialRoomProjection = 0;
  var initialRoomClosestX = initialRoomStartX;
  var initialRoomClosestY = initialRoomStartY;

  if (initialRoomSegmentLengthSquared > 0) {
    initialRoomProjection = ((initialRoomPointX - initialRoomStartX) * initialRoomSegmentX + (initialRoomPointY - initialRoomStartY) * initialRoomSegmentY) / initialRoomSegmentLengthSquared;
    initialRoomProjection = Math.max(0, Math.min(1, initialRoomProjection));
    initialRoomClosestX = initialRoomStartX + (initialRoomProjection * initialRoomSegmentX);
    initialRoomClosestY = initialRoomStartY + (initialRoomProjection * initialRoomSegmentY);
  }

  return initialRoomGetDistance(initialRoomPointX, initialRoomPointY, initialRoomClosestX, initialRoomClosestY);
}

function initialRoomMeleeAttack() {
  var initialRoomSwordLevel = Math.min(3, progressionManagerGetProgressiveValue("sword"));
  var initialRoomDirection = initialRoomPlayer.facingDirection || { x: 0, y: 1 };
  var initialRoomNow = Date.now();
  var initialRoomPoints = [];

  if (initialRoomHasTankForm()) {
    return;
  }

  if (initialRoomSwordLevel <= 0) {
    return;
  }

  if (!initialRoomCanStartMeleeAttack(initialRoomNow)) {
    return;
  }

  initialRoomPoints = initialRoomGetMeleeAttackPoints(initialRoomSwordLevel, initialRoomDirection);
  initialRoomDestroySwordVulnerableChecksInMeleeArea(initialRoomSwordLevel, initialRoomDirection);
  initialRoomDamageEnemiesInMeleeArea(initialRoomSwordLevel, initialRoomDirection, initialRoomGetSwordDamage(initialRoomSwordLevel), initialRoomNow);
  initialRoomNextMeleeAllowedAt = initialRoomNow + initialRoomMeleeDuration + initialRoomMeleeRecoveryDuration;

  initialRoomMeleeAttacks.push({
    points: initialRoomPoints,
    direction: {
      x: initialRoomDirection.x,
      y: initialRoomDirection.y
    },
    level: initialRoomSwordLevel,
    startedAt: initialRoomNow,
    expiresAt: initialRoomNow + initialRoomMeleeDuration,
    movementLockUntil: initialRoomNow + initialRoomMeleeDuration
  });
}

function initialRoomGetSwordDamage(initialRoomSwordLevel) {
  if (initialRoomSwordLevel >= 3) {
    return 8;
  }

  return Math.max(1, initialRoomSwordLevel) * 2;
}

function initialRoomGetMeleeAttackPoints(initialRoomSwordLevel, initialRoomDirection) {
  var initialRoomForwardDistance = 0.58;
  var initialRoomFrontPoint = {
    x: initialRoomPlayer.x + (initialRoomDirection.x * initialRoomForwardDistance),
    y: initialRoomPlayer.y + (initialRoomDirection.y * initialRoomForwardDistance)
  };
  var initialRoomPoints = [initialRoomFrontPoint];
  var initialRoomSide = {
    x: -initialRoomDirection.y,
    y: initialRoomDirection.x
  };
  var initialRoomSideDistance = 0.82;

  if (initialRoomSwordLevel >= 2) {
    initialRoomPoints = [{
      x: initialRoomFrontPoint.x + (initialRoomSide.x * initialRoomSideDistance),
      y: initialRoomFrontPoint.y + (initialRoomSide.y * initialRoomSideDistance)
    }, initialRoomFrontPoint, {
      x: initialRoomFrontPoint.x - (initialRoomSide.x * initialRoomSideDistance),
      y: initialRoomFrontPoint.y - (initialRoomSide.y * initialRoomSideDistance)
    }];
  }

  return initialRoomPoints;
}

function initialRoomDamageEnemiesInMeleeArea(initialRoomSwordLevel, initialRoomDirection, initialRoomDamage, initialRoomNow) {
  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (!initialRoomIsEnemyTargetable(initialRoomEnemy)) {
      return;
    }

    if (!initialRoomIsEnemyInMeleeArea(initialRoomEnemy, initialRoomSwordLevel, initialRoomDirection)) {
      return;
    }

    initialRoomDamageEnemy(initialRoomEnemy, initialRoomDamage, initialRoomNow, initialRoomEnemySwordStunDuration);
  });
}

function initialRoomDestroySwordVulnerableChecksInMeleeArea(initialRoomSwordLevel, initialRoomDirection) {
  initialRoomGetMeleeCheckTiles(initialRoomSwordLevel, initialRoomDirection).forEach(function (initialRoomTile) {
    if (!initialRoomCanDestroyDestructableCheck(initialRoomTile, "sword", initialRoomSwordLevel)) {
      return;
    }

    initialRoomDestroyDestructableCheck(initialRoomTile);
  });
}

function initialRoomGetMeleeCheckTiles(initialRoomSwordLevel, initialRoomDirection) {
  var initialRoomTileKeys = {};
  var initialRoomTiles = [];
  var initialRoomPlayerTileX = Math.floor(initialRoomPlayer.x);
  var initialRoomPlayerTileY = Math.floor(initialRoomPlayer.y);
  var initialRoomSide = {
    x: -initialRoomDirection.y,
    y: initialRoomDirection.x
  };
  var initialRoomFrontTile = {
    x: initialRoomPlayerTileX + initialRoomDirection.x,
    y: initialRoomPlayerTileY + initialRoomDirection.y
  };

  initialRoomAddMeleeCheckTile(initialRoomTiles, initialRoomTileKeys, initialRoomFrontTile.x, initialRoomFrontTile.y);

  if (initialRoomSwordLevel >= 2) {
    initialRoomAddMeleeCheckTile(initialRoomTiles, initialRoomTileKeys, initialRoomFrontTile.x + initialRoomSide.x, initialRoomFrontTile.y + initialRoomSide.y);
    initialRoomAddMeleeCheckTile(initialRoomTiles, initialRoomTileKeys, initialRoomFrontTile.x - initialRoomSide.x, initialRoomFrontTile.y - initialRoomSide.y);
  }

  return initialRoomTiles;
}

function initialRoomAddMeleeCheckTile(initialRoomTiles, initialRoomTileKeys, initialRoomTileX, initialRoomTileY) {
  var initialRoomTileKey = mapManagerGetCoordinateKey(initialRoomTileX, initialRoomTileY);

  if (initialRoomTileKeys[initialRoomTileKey] || initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return;
  }

  initialRoomTileKeys[initialRoomTileKey] = true;
  initialRoomTiles.push(initialRoomGetTile(initialRoomTileX, initialRoomTileY));
}

function initialRoomIsEnemyInMeleeArea(initialRoomEnemy, initialRoomSwordLevel, initialRoomDirection) {
  var initialRoomDeltaX = initialRoomEnemy.x - initialRoomPlayer.x;
  var initialRoomDeltaY = initialRoomEnemy.y - initialRoomPlayer.y;
  var initialRoomForwardDistance = (initialRoomDeltaX * initialRoomDirection.x) + (initialRoomDeltaY * initialRoomDirection.y);
  var initialRoomSideDistance = Math.abs((initialRoomDeltaX * -initialRoomDirection.y) + (initialRoomDeltaY * initialRoomDirection.x));
  var initialRoomForwardReach = 1.15 + initialRoomEnemy.radius;
  var initialRoomSideReach = (initialRoomSwordLevel >= 2 ? 1.28 : 0.46) + initialRoomEnemy.radius;

  return initialRoomForwardDistance >= -initialRoomEnemy.radius &&
    initialRoomForwardDistance <= initialRoomForwardReach &&
    initialRoomSideDistance <= initialRoomSideReach;
}

function initialRoomGetBombLevel() {
  return Math.min(3, progressionManagerGetProgressiveValue("bomb"));
}

function initialRoomGetBombRadius(initialRoomBombLevel) {
  return Math.max(1, Math.min(3, initialRoomBombLevel));
}

function initialRoomGetBombDamage(initialRoomBombLevel) {
  return Math.max(1, Math.min(3, initialRoomBombLevel)) * 3;
}

function initialRoomGetBombExplosionTiles(initialRoomBomb) {
  if (initialRoomBomb.explosionTiles) {
    return initialRoomBomb.explosionTiles;
  }

  return initialRoomCreateExplosionTileObjects(initialRoomBomb);
}

function initialRoomCreateExplosionTileObjects(initialRoomBomb) {
  var initialRoomTiles = [];
  var initialRoomTileKeys = {};
  var initialRoomDirections = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];
  var initialRoomRadius = initialRoomBomb.radius || 1;
  var initialRoomSquareRadius = Math.max(0, initialRoomRadius - 1);
  var initialRoomOffsetY = -initialRoomSquareRadius;

  if (initialRoomBomb.kind === "fire") {
    initialRoomAddExplosionTile(initialRoomTiles, initialRoomTileKeys, initialRoomBomb.x, initialRoomBomb.y);
    return initialRoomMapExplosionTiles(initialRoomTiles, initialRoomBomb);
  }

  while (initialRoomOffsetY <= initialRoomSquareRadius) {
    var initialRoomOffsetX = -initialRoomSquareRadius;

    while (initialRoomOffsetX <= initialRoomSquareRadius) {
      initialRoomAddExplosionTile(initialRoomTiles, initialRoomTileKeys, initialRoomBomb.x + initialRoomOffsetX, initialRoomBomb.y + initialRoomOffsetY);
      initialRoomOffsetX += 1;
    }

    initialRoomOffsetY += 1;
  }

  initialRoomDirections.forEach(function (initialRoomDirection) {
    var initialRoomDistance = 1;

    while (initialRoomDistance <= initialRoomRadius) {
      initialRoomAddExplosionTile(
        initialRoomTiles,
        initialRoomTileKeys,
        initialRoomBomb.x + (initialRoomDirection.x * initialRoomDistance),
        initialRoomBomb.y + (initialRoomDirection.y * initialRoomDistance)
      );
      initialRoomDistance += 1;
    }
  });

  return initialRoomMapExplosionTiles(initialRoomTiles, initialRoomBomb);
}

function initialRoomMapExplosionTiles(initialRoomTiles, initialRoomBomb) {
  return initialRoomTiles.filter(function (initialRoomTile) {
    return initialRoomTile.x >= 0 &&
      initialRoomTile.y >= 0 &&
      initialRoomTile.x < mapManagerData.roomWidth &&
      initialRoomTile.y < mapManagerData.roomHeight;
  }).map(function (initialRoomTile) {
    return {
      x: initialRoomTile.x,
      y: initialRoomTile.y,
      bombId: initialRoomBomb.id || initialRoomBomb.placedAt + ":" + initialRoomBomb.x + "," + initialRoomBomb.y,
      damage: initialRoomBomb.damage || 3,
      bombLevel: initialRoomBomb.level || 1,
      damageType: initialRoomBomb.kind === "fire" ? "fire" : "bomb",
      expiresAt: initialRoomBomb.explodedAt + initialRoomGetExplosionDuration(initialRoomBomb)
    };
  });
}

function initialRoomAddExplosionTile(initialRoomTiles, initialRoomTileKeys, initialRoomTileX, initialRoomTileY) {
  var initialRoomTileKey = mapManagerGetCoordinateKey(initialRoomTileX, initialRoomTileY);

  if (initialRoomTileKeys[initialRoomTileKey]) {
    return;
  }

  initialRoomTileKeys[initialRoomTileKey] = true;
  initialRoomTiles.push({
    x: initialRoomTileX,
    y: initialRoomTileY
  });
}

function initialRoomCreateBombExplosionObjects(initialRoomBomb, initialRoomNow) {
  initialRoomBomb.explosionTiles = initialRoomCreateExplosionTileObjects(initialRoomBomb);

  if (initialRoomBomb.kind === "bomb" && initialRoomBomb.level >= 3) {
    initialRoomStartScreenShake(initialRoomBombLevelThreeShakeDuration, initialRoomBombLevelThreeShakeMagnitude);
    initialRoomKillBuriedSnakesForBomb(initialRoomBomb, initialRoomNow);
  }

  initialRoomBomb.explosionTiles.forEach(function (initialRoomExplosionTile) {
    initialRoomExplosionTile.createdAt = initialRoomNow;
    initialRoomActiveExplosionTiles[mapManagerGetCoordinateKey(initialRoomExplosionTile.x, initialRoomExplosionTile.y)] = initialRoomExplosionTile;
  });
}

function initialRoomKillBuriedSnakesForBomb(initialRoomBomb, initialRoomNow) {
  initialRoomEnemies.forEach(function (initialRoomEnemy) {
    if (!initialRoomIsBuriedSnake(initialRoomEnemy)) {
      return;
    }

    if (initialRoomEnemy.hitBombIds[initialRoomBomb.id]) {
      return;
    }

    initialRoomEnemy.hitBombIds[initialRoomBomb.id] = true;
    initialRoomDamageEnemy(initialRoomEnemy, Math.max(initialRoomEnemy.hp, initialRoomBomb.damage || 1), initialRoomNow);
  });
}

function initialRoomIsBuriedSnake(initialRoomEnemy) {
  return Boolean(
    initialRoomEnemy &&
    initialRoomEnemy.enemyType === "snake" &&
    initialRoomEnemy.state === "hidden"
  );
}

function initialRoomRemoveBombExplosionObjects(initialRoomBomb) {
  if (!initialRoomBomb.explosionTiles) {
    return;
  }

  initialRoomBomb.explosionTiles.forEach(function (initialRoomExplosionTile) {
    var initialRoomExplosionKey = mapManagerGetCoordinateKey(initialRoomExplosionTile.x, initialRoomExplosionTile.y);

    if (initialRoomActiveExplosionTiles[initialRoomExplosionKey] === initialRoomExplosionTile) {
      delete initialRoomActiveExplosionTiles[initialRoomExplosionKey];
    }
  });
}

function initialRoomGetExplosionObjectAt(initialRoomTileX, initialRoomTileY) {
  return initialRoomActiveExplosionTiles[mapManagerGetCoordinateKey(initialRoomTileX, initialRoomTileY)] || null;
}

function initialRoomLoadRoomEnemies() {
  initialRoomEnemies = [];
  initialRoomEnemyLayer.innerHTML = "";

  (initialRoomCurrentRoom.tiles || []).forEach(function (initialRoomTile) {
    if (!initialRoomIsEnemyTile(initialRoomTile)) {
      return;
    }

    var initialRoomEnemyType = initialRoomTile.enemyType || (initialRoomTile.sprite && initialRoomTile.sprite.name) || "";

    if (initialRoomEnemyType !== "blob" && initialRoomEnemyType !== "negaBlob" && initialRoomEnemyType !== "snake" && initialRoomEnemyType !== "sorcerer") {
      return;
    }

    initialRoomEnemies.push(initialRoomCreateBlobEnemy(initialRoomTile, initialRoomEnemyType));
  });
}

function initialRoomCreateBlobEnemy(initialRoomTile, initialRoomEnemyType) {
  var initialRoomHomeX = initialRoomTile.x + 0.5;
  var initialRoomHomeY = initialRoomTile.y + 0.5;
  var initialRoomSpeedMultiplier = initialRoomEnemyType === "negaBlob" ? 2 : 1;
  var initialRoomIsSnake = initialRoomEnemyType === "snake";
  var initialRoomIsWizard = initialRoomEnemyType === "sorcerer";
  var initialRoomMaxHp = initialRoomEnemyType === "negaBlob" ? 6 : 3;
  var initialRoomBaseContactDamage = initialRoomIsWizard ? 10 : (initialRoomEnemyType === "negaBlob" || initialRoomIsSnake ? 3 : 1);

  return {
    id: initialRoomCurrentRoom.id + ":" + initialRoomEnemyType + ":" + initialRoomTile.x + "," + initialRoomTile.y,
    enemyType: initialRoomEnemyType,
    state: initialRoomIsSnake ? "hidden" : "idle",
    spawnTileX: initialRoomTile.x,
    spawnTileY: initialRoomTile.y,
    x: initialRoomHomeX,
    y: initialRoomHomeY,
    homeX: initialRoomHomeX,
    homeY: initialRoomHomeY,
    hp: initialRoomMaxHp,
    maxHp: initialRoomMaxHp,
    checkKey: initialRoomTile.checkKey || "",
    expectedDrop: initialRoomTile.expectedDrop || "itemPool1",
    requirements: (initialRoomTile.requirements || []).slice(),
    isShopkeep: Boolean(initialRoomTile.isShopkeep),
    removeShopItemsOnDeath: Boolean(initialRoomTile.removeShopItemsOnDeath),
    contactDamage: initialRoomTile.isShopkeep ? 0 : (initialRoomIsSnake ? Math.max(1, initialRoomBaseContactDamage - 1) : initialRoomBaseContactDamage),
    facingDirection: "down",
    hitBombIds: {},
    hurtUntil: 0,
    stunnedUntil: 0,
    deathStartedAt: 0,
    deathUntil: 0,
    radius: 0.35,
    idleSpeed: initialRoomIsSnake ? 0 : 0.65 * initialRoomSpeedMultiplier,
    chaseSpeed: initialRoomIsSnake ? 3.1 : 1.15 * initialRoomSpeedMultiplier,
    canCrossWater: initialRoomEnemyType === "negaBlob" || initialRoomIsSnake,
    targetIndex: 0,
    vanishAt: 0,
    reappearAt: 0,
    corral: initialRoomGetBlobCorral(initialRoomHomeX, initialRoomHomeY, initialRoomEnemyType === "negaBlob")
  };
}

function initialRoomGetBlobCorral(initialRoomHomeX, initialRoomHomeY, initialRoomCanCrossWater) {
  var initialRoomCorralEnemy = {
    canCrossWater: initialRoomCanCrossWater
  };

  return [
    { x: initialRoomHomeX, y: initialRoomHomeY },
    { x: initialRoomHomeX + 1, y: initialRoomHomeY },
    { x: initialRoomHomeX + 1, y: initialRoomHomeY + 1 },
    { x: initialRoomHomeX, y: initialRoomHomeY + 1 }
  ].filter(function (initialRoomPoint) {
    return initialRoomCanEnemyMoveTo(initialRoomPoint.x, initialRoomPoint.y, 0.35, initialRoomCorralEnemy);
  }).concat([{ x: initialRoomHomeX, y: initialRoomHomeY }]);
}

function initialRoomCloseTextEntry() {
  initialRoomIsTextEntryActive = false;
  initialRoomTextEntryValue = "";
}

function initialRoomSubmitTextEntry() {
  var initialRoomSubmittedMessage = initialRoomTextEntryValue.trim();

  initialRoomCloseTextEntry();

  if (!initialRoomSubmittedMessage) {
    return;
  }

  if (initialRoomIsOnlineModeActive()) {
    if (typeof archipelagoClientSendChatMessage === "function") {
      archipelagoClientSendChatMessage(initialRoomSubmittedMessage);
    }
    return;
  }

  initialRoomQueueMessage(initialRoomSubmittedMessage);
  initialRoomLastMessageTime = Date.now();
}

function initialRoomHandleTextEntryKey(initialRoomEvent) {
  if (!initialRoomIsTextEntryActive) {
    return false;
  }

  initialRoomEvent.preventDefault();

  if (initialRoomIsMessageLogOpen && initialRoomEvent.key === "Enter" && initialRoomEvent.shiftKey) {
    initialRoomCloseTextEntry();
    initialRoomCloseMessageLog();
    return true;
  }

  if (initialRoomEvent.key === "Enter") {
    initialRoomSubmitTextEntry();
    return true;
  }

  if (initialRoomEvent.key === "Escape") {
    initialRoomCloseTextEntry();
    return true;
  }

  if (initialRoomEvent.key === "Backspace") {
    initialRoomTextEntryValue = initialRoomTextEntryValue.slice(0, -1);
    return true;
  }

  if (initialRoomEvent.key.length === 1) {
    initialRoomTextEntryValue += initialRoomEvent.key;
    return true;
  }

  return true;
}

function initialRoomToggleMap() {
  if (!initialRoomIsMapOpen && !initialRoomCanOpenMapOverlay()) {
    return false;
  }

  initialRoomIsMapOpen = !initialRoomIsMapOpen;
  if (initialRoomIsMapOpen) {
    initialRoomIsStatusOpen = false;
    initialRoomRefreshMapStatusCache();
  } else {
    initialRoomMapStatusCache = null;
  }
  initialRoomKeys = {};
  initialRoomInputOrder = [];
  initialRoomPlayer.moveDirection = null;
  return true;
}

function initialRoomToggleStatus() {
  if (!initialRoomIsStatusOpen && !initialRoomCanOpenMapOverlay()) {
    return false;
  }

  initialRoomIsStatusOpen = !initialRoomIsStatusOpen;
  if (initialRoomIsStatusOpen) {
    initialRoomIsMapOpen = false;
    initialRoomMapStatusCache = null;
  }
  initialRoomKeys = {};
  initialRoomInputOrder = [];
  initialRoomPlayer.moveDirection = null;
  return true;
}

function initialRoomCanOpenMapOverlay() {
  return initialRoomHasTankForm() || !initialRoomIsPlayerActivelyMoving();
}

function initialRoomIsPlayerActivelyMoving() {
  return Boolean(
    initialRoomPlayer.moveDirection ||
    initialRoomGetInputDirection() ||
    Math.abs(initialRoomPlayer.x - initialRoomPlayer.targetX) > 0.0001 ||
    Math.abs(initialRoomPlayer.y - initialRoomPlayer.targetY) > 0.0001
  );
}

function initialRoomOpenMessageLog() {
  if (!initialRoomCanOpenMapOverlay()) {
    return false;
  }

  initialRoomIsMessageLogOpen = true;
  initialRoomMessageLogPulseUntil = 0;
  initialRoomIsMapOpen = false;
  initialRoomIsStatusOpen = false;
  initialRoomMapStatusCache = null;
  initialRoomKeys = {};
  initialRoomInputOrder = [];
  initialRoomPlayer.moveDirection = null;
  return true;
}

function initialRoomCloseMessageLog() {
  initialRoomIsMessageLogOpen = false;
  initialRoomMessageLogCloseRect = null;
  initialRoomCloseTextEntry();
}

function initialRoomIsPointInRect(initialRoomX, initialRoomY, initialRoomRect) {
  return Boolean(initialRoomRect &&
    initialRoomX >= initialRoomRect.x &&
    initialRoomX <= initialRoomRect.x + initialRoomRect.width &&
    initialRoomY >= initialRoomRect.y &&
    initialRoomY <= initialRoomRect.y + initialRoomRect.height);
}

function initialRoomToggleBgmMute() {
  initialRoomIsBgmMuted = !initialRoomIsBgmMuted;

  if (initialRoomIsBgmMuted) {
    initialRoomStopBgm();
  } else {
    initialRoomNextBgmAt = 0;
  }

  initialRoomUpdateFinalRunAudioToggles();
}

function initialRoomToggleSfxMute() {
  initialRoomIsSfxMuted = !initialRoomIsSfxMuted;

  if (initialRoomIsSfxMuted) {
    initialRoomStopSnakeLoops();
  }

  initialRoomUpdateFinalRunAudioToggles();
}

function initialRoomToggleMessagePopupMute() {
  initialRoomAreMessagePopupsMuted = !initialRoomAreMessagePopupsMuted;
  if (initialRoomAreMessagePopupsMuted && !initialRoomIsTextEntryActive) {
    initialRoomCurrentMessage = "";
    initialRoomCurrentMessageFlipped = false;
    initialRoomMessageQueue = [];
  }
  initialRoomUpdateFinalRunAudioToggles();
}

function initialRoomHandleTopRightMenuClick() {
  var initialRoomClickedIcon = null;

  initialRoomTopRightMenuIconRects.some(function (initialRoomIconRect) {
    if (initialRoomIsPointInRect(initialRoomMouse.x, initialRoomMouse.y, initialRoomIconRect)) {
      initialRoomClickedIcon = initialRoomIconRect.iconKey;
      return true;
    }

    return false;
  });

  if (!initialRoomClickedIcon) {
    return false;
  }

  if (initialRoomClickedIcon === "messageBox") {
    initialRoomToggleMessagePopupMute();
    return true;
  }

  if (initialRoomClickedIcon === "status") {
    initialRoomToggleStatus();
    return true;
  }

  if (initialRoomClickedIcon === "log") {
    if (initialRoomIsMessageLogOpen) {
      initialRoomCloseMessageLog();
    } else {
      initialRoomOpenMessageLog();
    }
    return true;
  }

  if (initialRoomClickedIcon === "map") {
    initialRoomToggleMap();
    return true;
  }

  if (initialRoomClickedIcon === "bgm" && initialRoomHasBgmUnlock()) {
    initialRoomToggleBgmMute();
    return true;
  }

  if (initialRoomClickedIcon === "sfx" && initialRoomHasSfxUnlock()) {
    initialRoomToggleSfxMute();
    return true;
  }

  return false;
}

function initialRoomIsEditableKeyTarget(initialRoomTarget) {
  if (!initialRoomTarget) {
    return false;
  }

  return Boolean(initialRoomTarget.closest && initialRoomTarget.closest("input, textarea, select, [contenteditable='true']"));
}

function initialRoomShouldHandleGlobalKeyInput() {
  return Boolean(initialRoomCanvas.parentNode || initialRoomFinalRunState.active);
}

window.addEventListener("keydown", function (initialRoomEvent) {
  if (!initialRoomShouldHandleGlobalKeyInput()) {
    return;
  }

  if (initialRoomIsEditableKeyTarget(initialRoomEvent.target)) {
    return;
  }

  if (initialRoomHandleTextEntryKey(initialRoomEvent)) {
    return;
  }

  if (initialRoomFinalRunState.active) {
    if (initialRoomIsMessageLogOpen) {
      if (initialRoomEvent.key.toLowerCase() === "l" && !initialRoomIsTextEntryActive && !initialRoomEvent.repeat) {
        initialRoomCloseMessageLog();
        initialRoomEvent.preventDefault();
        return;
      }

      if (initialRoomEvent.key === "Enter" && initialRoomEvent.shiftKey) {
        initialRoomCloseMessageLog();
        initialRoomEvent.preventDefault();
        return;
      }

      if (initialRoomEvent.key === "Enter" && !initialRoomEvent.repeat) {
        initialRoomOpenTextEntry();
        initialRoomEvent.preventDefault();
        return;
      }

      if (initialRoomEvent.key === "Escape") {
        initialRoomCloseMessageLog();
        initialRoomEvent.preventDefault();
        return;
      }

      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key === "Enter" && !initialRoomEvent.repeat) {
      initialRoomOpenTextEntry();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key.toLowerCase() === "l" && !initialRoomEvent.repeat) {
      initialRoomOpenMessageLog();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key.toLowerCase() === "b" && !initialRoomEvent.repeat) {
      initialRoomToggleMessagePopupMute();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key.toLowerCase() === "o" && initialRoomHasBgmUnlock() && !initialRoomEvent.repeat) {
      initialRoomToggleBgmMute();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key.toLowerCase() === "p" && initialRoomHasSfxUnlock() && !initialRoomEvent.repeat) {
      initialRoomToggleSfxMute();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key !== "Escape") {
      initialRoomEvent.preventDefault();
    }

    return;
  }

  if (initialRoomIsGameOver) {
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomIsMessageLogOpen) {
    if (initialRoomEvent.key.toLowerCase() === "l" && !initialRoomIsTextEntryActive && !initialRoomEvent.repeat) {
      initialRoomCloseMessageLog();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key === "Enter" && initialRoomEvent.shiftKey) {
      initialRoomCloseMessageLog();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key === "Enter" && !initialRoomEvent.repeat) {
      initialRoomOpenTextEntry();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomEvent.key === "Escape") {
      initialRoomCloseMessageLog();
      initialRoomEvent.preventDefault();
      return;
    }

    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "l" && !initialRoomEvent.repeat) {
    initialRoomOpenMessageLog();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "m" && !initialRoomEvent.repeat) {
    initialRoomToggleMap();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "n" && !initialRoomEvent.repeat) {
    initialRoomToggleStatus();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "b" && !initialRoomEvent.repeat) {
    initialRoomToggleMessagePopupMute();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "o" && initialRoomHasBgmUnlock() && !initialRoomEvent.repeat) {
    initialRoomToggleBgmMute();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "p" && initialRoomHasSfxUnlock() && !initialRoomEvent.repeat) {
    initialRoomToggleSfxMute();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomIsMapOpen || initialRoomIsStatusOpen) {
    if (initialRoomEvent.key === "Escape") {
      initialRoomIsMapOpen = false;
      initialRoomIsStatusOpen = false;
      initialRoomMapStatusCache = null;
    }

    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key === "Enter" && initialRoomCanOpenMapOverlay()) {
    initialRoomOpenTextEntry();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "e") {
    initialRoomTryCollectNearbyCheck();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "q") {
    if (initialRoomHasTankForm()) {
      initialRoomEvent.preventDefault();
      return;
    }

    initialRoomPlaceBomb();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "g") {
    if (initialRoomHasTankForm()) {
      initialRoomEvent.preventDefault();
      return;
    }

    initialRoomPlaceFire();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.code === "Space" || initialRoomEvent.key === " ") {
    if (initialRoomHasTankForm()) {
      initialRoomEvent.preventDefault();
      return;
    }

    if (!initialRoomEvent.repeat) {
      initialRoomShoot();
    }
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomEvent.key.toLowerCase() === "f") {
    if (initialRoomHasTankForm()) {
      initialRoomEvent.preventDefault();
      return;
    }

    initialRoomMeleeAttack();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomKeys[initialRoomEvent.key.toLowerCase()]) {
    return;
  }

  initialRoomKeys[initialRoomEvent.key.toLowerCase()] = true;
  initialRoomTrackKeyPress(initialRoomEvent.key.toLowerCase());
});

window.addEventListener("keyup", function (initialRoomEvent) {
  if (!initialRoomShouldHandleGlobalKeyInput()) {
    return;
  }

  if (initialRoomIsEditableKeyTarget(initialRoomEvent.target)) {
    return;
  }

  if (initialRoomFinalRunState.active) {
    return;
  }

  if (initialRoomIsTextEntryActive || initialRoomIsGameOver) {
    return;
  }

  initialRoomKeys[initialRoomEvent.key.toLowerCase()] = false;
  initialRoomTrackKeyRelease(initialRoomEvent.key.toLowerCase());
});

window.addEventListener("mousemove", function (initialRoomEvent) {
  initialRoomMouse.x = initialRoomEvent.clientX;
  initialRoomMouse.y = initialRoomEvent.clientY;

  initialRoomFinalRunMouse.x = initialRoomEvent.clientX;
  initialRoomFinalRunMouse.y = initialRoomEvent.clientY;
  initialRoomUpdateFinalRunScreenCrosshair();
});

window.addEventListener("mousedown", function (initialRoomEvent) {
  initialRoomMouse.x = initialRoomEvent.clientX;
  initialRoomMouse.y = initialRoomEvent.clientY;
  initialRoomFinalRunMouse.x = initialRoomEvent.clientX;
  initialRoomFinalRunMouse.y = initialRoomEvent.clientY;
  initialRoomUpdateFinalRunScreenCrosshair();

  if (!initialRoomShouldHandleGlobalKeyInput()) {
    return;
  }

  if (initialRoomIsEditableKeyTarget(initialRoomEvent.target) ||
    (initialRoomEvent.target && initialRoomEvent.target.closest && initialRoomEvent.target.closest(".screen-map-editor"))) {
    return;
  }

  if (initialRoomFinalRunState.active) {
    if (initialRoomFinalRunState.audioToggleElement &&
      initialRoomEvent.target &&
      initialRoomFinalRunState.audioToggleElement.contains(initialRoomEvent.target)) {
      return;
    }

    if (initialRoomIsMessageLogOpen && initialRoomIsPointInRect(initialRoomMouse.x, initialRoomMouse.y, initialRoomMessageLogCloseRect)) {
      initialRoomCloseMessageLog();
      initialRoomEvent.preventDefault();
      return;
    }

    if (initialRoomIsTextEntryActive || initialRoomIsMessageLogOpen || initialRoomIsGameOver) {
      initialRoomEvent.preventDefault();
      return;
    }

    initialRoomFireFinalRunNozzle();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomHandleTopRightMenuClick()) {
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomIsMessageLogOpen && initialRoomIsPointInRect(initialRoomMouse.x, initialRoomMouse.y, initialRoomMessageLogCloseRect)) {
    initialRoomCloseMessageLog();
    initialRoomEvent.preventDefault();
    return;
  }

  if (initialRoomIsTextEntryActive || initialRoomIsMessageLogOpen || initialRoomIsGameOver || initialRoomIsMapOpen || initialRoomIsStatusOpen) {
    return;
  }

  if (initialRoomHasTankForm()) {
    initialRoomFireTankCannon();
    initialRoomEvent.preventDefault();
    return;
  }

  if (progressionManagerGetProgressiveValue("gun") > 0) {
    initialRoomShootTowardMouse();
    initialRoomEvent.preventDefault();
    return;
  }

  initialRoomEvent.preventDefault();
});

window.addEventListener("resize", initialRoomResizeCanvas);

globalsState.loadedModules.push("initialRoom");

function initialRoomIsCheckTileCollected(initialRoomTile, initialRoomRoom) {
  if (!initialRoomTile) {
    return false;
  }

  if (!initialRoomTile.checkKey) {
    return Boolean(
      initialRoomOpenedRuntimeChecks[initialRoomGetRuntimeCheckKey(initialRoomTile, initialRoomRoom)] ||
      initialRoomIsGeneratedArchipelagoLocationChecked(initialRoomTile, initialRoomRoom)
    );
  }

  return initialRoomIsLocationChecked(initialRoomTile.checkKey);
}

function initialRoomIsGeneratedArchipelagoLocationChecked(initialRoomTile, initialRoomRoom) {
  var initialRoomGeneratedLocation = initialRoomGetGeneratedArchipelagoLocation(initialRoomTile, initialRoomRoom);

  if (!initialRoomGeneratedLocation || !globalsState.archipelago.connected) {
    return false;
  }

  return globalsState.archipelago.checkedLocations.some(function (initialRoomCheckedLocationId) {
    return String(initialRoomCheckedLocationId) === String(initialRoomGeneratedLocation.id);
  });
}

function initialRoomIsLocationChecked(initialRoomCheckKey) {
  var initialRoomCheckLocation = initialRoomCheckKey ? globalsState.locations[initialRoomCheckKey] : null;

  return Boolean(initialRoomCheckLocation && initialRoomCheckLocation.checked);
}

function initialRoomGetTileCheckKey(initialRoomTile) {
  if (!initialRoomTile) {
    return "";
  }

  return initialRoomTile.checkKey || initialRoomGetRuntimeCheckKey(initialRoomTile);
}

function initialRoomGetRuntimeCheckKey(initialRoomTile, initialRoomRoom) {
  var initialRoomRuntimeRoom = initialRoomRoom || initialRoomCurrentRoom;

  if (!initialRoomRuntimeRoom || !initialRoomTile) {
    return "";
  }

  return "runtime:" + initialRoomRuntimeRoom.id + ":" + initialRoomTile.x + "," + initialRoomTile.y;
}

function initialRoomGetGeneratedArchipelagoLocation(initialRoomTile, initialRoomRoom) {
  var initialRoomRuntimeRoom = initialRoomRoom || initialRoomCurrentRoom;
  var initialRoomGeneratedLocationKey = "";

  if (!initialRoomRuntimeRoom || !initialRoomTile || typeof archipelagoGeneratedLocationCoordToLocation === "undefined") {
    return null;
  }

  initialRoomGeneratedLocationKey = initialRoomRuntimeRoom.x + "," + initialRoomRuntimeRoom.y + ":" + (initialRoomTile.spawnTileX !== undefined ? initialRoomTile.spawnTileX : initialRoomTile.x) + "," + (initialRoomTile.spawnTileY !== undefined ? initialRoomTile.spawnTileY : initialRoomTile.y);
  return archipelagoGeneratedLocationCoordToLocation[initialRoomGeneratedLocationKey] || null;
}

function initialRoomTryCollectCheckTile(initialRoomTile) {
  var initialRoomCheckKey = initialRoomGetTileCheckKey(initialRoomTile);
  var initialRoomRewardKey = initialRoomTile && initialRoomTile.expectedDrop ? initialRoomTile.expectedDrop : initialRoomCheckKey;
  var initialRoomGeneratedLocation = null;

  if (!initialRoomTile || initialRoomTile.type !== "check" || !initialRoomCheckKey || initialRoomIsCheckTileCollected(initialRoomTile)) {
    return false;
  }

  if (!initialRoomTile.checkKey) {
    if (globalsState.archipelago.connected) {
      initialRoomGeneratedLocation = initialRoomGetGeneratedArchipelagoLocation(initialRoomTile);

      if (initialRoomGeneratedLocation && archipelagoClientHasMissingLocation(initialRoomGeneratedLocation.id)) {
        return archipelagoClientSendGeneratedLocationCheck(initialRoomGeneratedLocation);
      }

      if (initialRoomGeneratedLocation && archipelagoClientHasCheckedLocation(initialRoomGeneratedLocation.id)) {
        return false;
      }

      initialRoomOpenedRuntimeChecks[initialRoomCheckKey] = true;
      initialRoomHandleOpenedCheck("itemPool1");
      return true;
    }

    initialRoomOpenedRuntimeChecks[initialRoomCheckKey] = true;
    initialRoomRecordOfflineReward(initialRoomCheckKey, initialRoomRewardKey);
    initialRoomApplyLooseReward(initialRoomRewardKey);
    initialRoomHandleOpenedCheck(initialRoomRewardKey);
    initialRoomSaveOfflineProgress();
    return true;
  }

  if (globalsState.archipelago.connected) {
    if (archipelagoClientSendLocationCheck(initialRoomCheckKey)) {
      return true;
    }

    return false;
  }

  if (progressionManagerCollectLocation(initialRoomCheckKey, initialRoomRewardKey)) {
    initialRoomRecordOfflineReward(initialRoomCheckKey, initialRoomRewardKey);
    initialRoomSaveOfflineProgress();
    initialRoomHandleOpenedCheck(initialRoomRewardKey);
    return true;
  }

  return false;
}

function initialRoomCanCollectTileRequirements(initialRoomTile) {
  return initialRoomCanMeetRequirementGroups(initialRoomTile.requirements || []);
}

function initialRoomCanMeetRequirementGroups(initialRoomRequirements) {
  return initialRoomNormalizeRequirementGroups(initialRoomRequirements).every(function (initialRoomRequirementGroup) {
    return initialRoomRequirementGroup.some(function (initialRoomRequirement) {
      return progressionManagerHasRequirement(initialRoomRequirement);
    });
  });
}

function initialRoomNormalizeRequirementGroups(initialRoomRequirements) {
  if (!Array.isArray(initialRoomRequirements)) {
    return [];
  }

  return initialRoomRequirements.map(function (initialRoomRequirement) {
    if (Array.isArray(initialRoomRequirement)) {
      return initialRoomRequirement.filter(Boolean);
    }

    return initialRoomRequirement ? [initialRoomRequirement] : [];
  }).filter(function (initialRoomRequirementGroup) {
    return initialRoomRequirementGroup.length > 0;
  });
}

function initialRoomHandleOpenedCheck(initialRoomCheckKey) {
  if (initialRoomCheckKey === "empty") {
    return;
  }

  if (initialRoomIsTrapDrop(initialRoomCheckKey)) {
    return;
  }

  if (initialRoomIsItemPoolCheckKey(initialRoomCheckKey)) {
    initialRoomHandleItemPoolDrop(initialRoomCheckKey);
    return;
  }

  var initialRoomCheckDefinition = globalsState.checkDefinitions[initialRoomCheckKey];
  var initialRoomCheckName = initialRoomCheckDefinition ? initialRoomCheckDefinition.label : initialRoomCheckKey;

  initialRoomQueueMessage("You found your " + initialRoomCheckName);
  initialRoomShowPickupIcon(initialRoomCheckKey);
}

function initialRoomApplyTrap(initialRoomTrapKey) {
  var initialRoomNow = Date.now();
  var initialRoomTrapName = globalsState.checkDefinitions[initialRoomTrapKey] ? globalsState.checkDefinitions[initialRoomTrapKey].label : "Trap";

  initialRoomQueueMessage(initialRoomTrapName + "!");

  if (initialRoomTrapKey === "trapStun") {
    initialRoomTrapState.stunUntil = initialRoomNow + 5000;
    initialRoomPlayer.moveDirection = null;
    initialRoomPlayer.targetX = initialRoomPlayer.x;
    initialRoomPlayer.targetY = initialRoomPlayer.y;
    initialRoomKeys = {};
    initialRoomInputOrder = [];
    return;
  }

  if (initialRoomTrapKey === "trapInvisible") {
    initialRoomTrapState.invisibleUntil = initialRoomNow + 30000;
    return;
  }

  if (initialRoomTrapKey === "trapFast") {
    initialRoomTrapState.fastUntil = initialRoomNow + 15000;
    return;
  }

  if (initialRoomTrapKey === "trapSlow") {
    initialRoomTrapState.slowUntil = initialRoomNow + 15000;
    return;
  }

  if (initialRoomTrapKey === "trapReverse") {
    initialRoomTrapState.reverseUntil = initialRoomNow + 30000;
    return;
  }

  if (initialRoomTrapKey === "trapScreenFlip") {
    initialRoomTrapState.flipMessagesRemaining = 3;
    return;
  }

  if (initialRoomTrapKey === "trapZoom") {
    initialRoomTrapState.zoomRoomId = initialRoomCurrentRoom ? initialRoomCurrentRoom.id : "";
    initialRoomUpdateView();
    return;
  }

  if (initialRoomTrapKey === "trapDeath") {
    initialRoomKillPlayer("deathTrap");
    return;
  }

  if (initialRoomTrapKey === "suddenlySnake") {
    initialRoomSpawnSuddenlySnake();
  }
}

function initialRoomSpawnSuddenlySnake() {
  var initialRoomTileX = Math.floor(initialRoomPlayer.x);
  var initialRoomTileY = Math.floor(initialRoomPlayer.y);
  var initialRoomSnakeTile = {
    id: "suddenly_snake_" + Date.now() + "_" + Math.floor(Math.random() * 1000000),
    x: initialRoomTileX,
    y: initialRoomTileY,
    type: "enemy",
    tileType: "Enemy",
    typeOverride: "Enemy",
    enemyType: "snake",
    sprite: {
      source: "enemy",
      name: "snake"
    },
    expectedDrop: "itemPool1"
  };
  var initialRoomSnake = initialRoomCreateBlobEnemy(initialRoomSnakeTile, "snake");

  initialRoomSnake.id = initialRoomSnakeTile.id;
  initialRoomSnake.x = initialRoomPlayer.x;
  initialRoomSnake.y = initialRoomPlayer.y;
  initialRoomSnake.homeX = initialRoomPlayer.x;
  initialRoomSnake.homeY = initialRoomPlayer.y;
  initialRoomSnake.state = "chase";
  initialRoomSnake.facingDirection = initialRoomPlayer.facingDirection || "down";
  initialRoomEnemies.push(initialRoomSnake);
}

function initialRoomApplyLooseReward(initialRoomRewardKey) {
  if (!initialRoomRewardKey || initialRoomRewardKey === "empty" || initialRoomIsItemPoolCheckKey(initialRoomRewardKey)) {
    return;
  }

  if (progressionManagerCanReceive(initialRoomRewardKey)) {
    progressionManagerApplyReward(initialRoomRewardKey);
    initialRoomSyncPlayerResourceMaxes();
  }
}

function initialRoomHandleItemPoolDrop(initialRoomItemPoolKey) {
  var initialRoomRewards = initialRoomItemPoolRewards[initialRoomItemPoolKey] || initialRoomItemPoolRewards.itemPool1;
  var initialRoomReward = initialRoomRewards[Math.floor(Math.random() * initialRoomRewards.length)];
  var initialRoomUsableRewards = null;

  if (initialRoomReward && initialRoomReward.key !== "empty" && initialRoomReward.canUse && !initialRoomReward.canUse()) {
    initialRoomUsableRewards = initialRoomRewards.filter(function (initialRoomCandidateReward) {
      return !initialRoomCandidateReward.canUse || initialRoomCandidateReward.canUse();
    });

    if (initialRoomUsableRewards.length > 0) {
      initialRoomReward = initialRoomUsableRewards[Math.floor(Math.random() * initialRoomUsableRewards.length)];
    }
  }

  initialRoomReward.apply();
  if (initialRoomReward.key === "empty") {
    return;
  }

  initialRoomQueueMessage("You found your " + initialRoomReward.label);
  initialRoomShowPickupIcon(initialRoomReward.key);
  initialRoomBroadcastLinkedPickup(initialRoomReward.key, initialRoomReward.amount || 1);
}

function initialRoomGetShopOffer(initialRoomTile) {
  var initialRoomShopKey = initialRoomGetShopRuntimeKey(initialRoomTile);
  var initialRoomArchipelagoCost = initialRoomGetArchipelagoShopCost(initialRoomTile);

  if (initialRoomPurchasedShopItems[initialRoomShopKey] || initialRoomIsItemPoolCheckKey(initialRoomTile.shopDrop)) {
    if (!initialRoomShopItemPoolOffers[initialRoomShopKey]) {
      initialRoomShopItemPoolOffers[initialRoomShopKey] = initialRoomCreateShopItemPoolOffer();
    }

    if (initialRoomFreeShopItems[initialRoomShopKey]) {
      initialRoomShopItemPoolOffers[initialRoomShopKey].cost = 0;
    } else if (initialRoomArchipelagoCost !== null) {
      initialRoomShopItemPoolOffers[initialRoomShopKey].cost = initialRoomArchipelagoCost;
    }

    return initialRoomShopItemPoolOffers[initialRoomShopKey];
  }

  if (initialRoomFreeShopItems[initialRoomShopKey]) {
    return {
      drop: initialRoomTile.shopDrop || "itemPool1",
      cost: 0
    };
  }

  return {
    drop: initialRoomTile.shopDrop || "itemPool1",
    cost: initialRoomArchipelagoCost !== null ? initialRoomArchipelagoCost : Number(initialRoomTile.shopCost) || 0
  };
}

function initialRoomGetArchipelagoShopCost(initialRoomTile) {
  var initialRoomGeneratedLocation = null;
  var initialRoomShopCosts = globalsState.archipelago.slotData ? globalsState.archipelago.slotData.shop_costs : null;
  var initialRoomCost = null;

  if (!globalsState.archipelago.connected || !initialRoomShopCosts) {
    return null;
  }

  initialRoomGeneratedLocation = initialRoomGetGeneratedArchipelagoLocation(initialRoomTile);

  if (!initialRoomGeneratedLocation || initialRoomShopCosts[String(initialRoomGeneratedLocation.id)] === undefined) {
    return null;
  }

  initialRoomCost = Number(initialRoomShopCosts[String(initialRoomGeneratedLocation.id)]);
  return Number.isFinite(initialRoomCost) ? Math.max(0, initialRoomCost) : null;
}

function initialRoomCreateShopItemPoolOffer() {
  if (Math.random() < 0.5) {
    return {
      drop: "healthPickup",
      cost: 5 + Math.floor(Math.random() * 11)
    };
  }

  return {
    drop: "roundsPickup",
    cost: 20 + Math.floor(Math.random() * 11)
  };
}

function initialRoomTryBuyShopTile(initialRoomTile) {
  var initialRoomShopKey = initialRoomGetShopRuntimeKey(initialRoomTile);
  var initialRoomOffer = initialRoomGetShopOffer(initialRoomTile);
  var initialRoomGeneratedLocation = null;
  var initialRoomOnlineLocalReward = "";

  if (initialRoomIsShopItemHidden(initialRoomTile)) {
    return false;
  }

  if (initialRoomPlayer.energy < initialRoomOffer.cost) {
    initialRoomQueueMessage("Need " + initialRoomOffer.cost + " energy");
    return false;
  }

  if (globalsState.archipelago.connected) {
    initialRoomGeneratedLocation = initialRoomGetGeneratedArchipelagoLocation(initialRoomTile);

    if (initialRoomGeneratedLocation && archipelagoClientHasMissingLocation(initialRoomGeneratedLocation.id)) {
      if (!archipelagoClientSendGeneratedLocationCheck(initialRoomGeneratedLocation)) {
        return false;
      }
    } else if (initialRoomGeneratedLocation && archipelagoClientHasCheckedLocation(initialRoomGeneratedLocation.id)) {
      initialRoomOnlineLocalReward = "itemPool1";
    } else {
      initialRoomOnlineLocalReward = initialRoomOffer.drop;
    }

    initialRoomPlayer.energy -= initialRoomOffer.cost;
    if (initialRoomIsEnergyLinkEnabled() && typeof archipelagoClientSendEnergyLinkDeplete === "function") {
      archipelagoClientSendEnergyLinkDeplete(initialRoomOffer.cost, "shop:" + initialRoomShopKey + ":" + Date.now());
    }

    if (initialRoomOnlineLocalReward) {
      initialRoomApplyShopReward(initialRoomOnlineLocalReward);
    }

    initialRoomPurchasedShopItems[initialRoomShopKey] = true;
    initialRoomHiddenShopItems[initialRoomShopKey] = true;
    delete initialRoomShopItemPoolOffers[initialRoomShopKey];
    initialRoomMapStatusCache = null;
    return true;
  }

  initialRoomPlayer.energy -= initialRoomOffer.cost;
  initialRoomApplyShopReward(initialRoomOffer.drop);
  initialRoomRecordOfflineReward(initialRoomShopKey, initialRoomOffer.drop);
  initialRoomPurchasedShopItems[initialRoomShopKey] = true;
  initialRoomHiddenShopItems[initialRoomShopKey] = true;
  delete initialRoomShopItemPoolOffers[initialRoomShopKey];
  initialRoomMapStatusCache = null;
  initialRoomSaveOfflineProgress();
  return true;
}

function initialRoomApplyShopReward(initialRoomRewardKey) {
  if (initialRoomRewardKey === "healthPickup") {
    initialRoomSyncPlayerResourceMaxes();
    initialRoomPlayer.hp = Math.min(initialRoomGetEffectiveMaxHp(), initialRoomPlayer.hp + 1);
    initialRoomQueueMessage("You found your Health Potion");
    initialRoomShowPickupIcon("healthPickup");
    return;
  }

  if (initialRoomRewardKey === "roundsPickup") {
    initialRoomSyncPlayerResourceMaxes();
    initialRoomPlayer.rounds = Math.min(initialRoomPlayer.maxRounds, initialRoomPlayer.rounds + 5);
    initialRoomQueueMessage("You found your Round Pouch");
    initialRoomShowPickupIcon("roundsPickup");
    return;
  }

  if (initialRoomIsItemPoolCheckKey(initialRoomRewardKey)) {
    initialRoomHandleItemPoolDrop(initialRoomRewardKey);
    return;
  }

  initialRoomApplyLooseReward(initialRoomRewardKey);
  initialRoomHandleOpenedCheck(initialRoomRewardKey);
}

function initialRoomShowPickupIcon(initialRoomRewardKey) {
  var initialRoomIconKey = initialRoomGetPickupIconKey(initialRoomRewardKey);

  if (initialRoomGetGraphicsLevel() <= 0 || !initialRoomIconKey) {
    return;
  }

  initialRoomPickupIcon = {
    iconKey: initialRoomIconKey,
    expiresAt: Date.now() + initialRoomPickupIconDuration
  };
}

function initialRoomGetPickupIconKey(initialRoomRewardKey) {
  var initialRoomBaseKey = String(initialRoomRewardKey || "").replace(/\d+$/, "");

  if (initialRoomPickupIconPaths[initialRoomRewardKey]) {
    return initialRoomRewardKey;
  }

  if (initialRoomPickupIconPaths[initialRoomBaseKey]) {
    return initialRoomBaseKey;
  }

  return "itemPool";
}

function initialRoomIsItemPoolCheckKey(initialRoomCheckKey) {
  return /^itemPool\d*$/.test(String(initialRoomCheckKey || ""));
}

function initialRoomTryCollectNearbyCheck() {
  var initialRoomPlayerTileX = Math.floor(initialRoomPlayer.x);
  var initialRoomPlayerTileY = Math.floor(initialRoomPlayer.y);
  var initialRoomOffsets = [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ];
  var initialRoomOffsetIndex = 0;

  while (initialRoomOffsetIndex < initialRoomOffsets.length) {
    var initialRoomOffset = initialRoomOffsets[initialRoomOffsetIndex];
    var initialRoomTile = initialRoomGetTile(initialRoomPlayerTileX + initialRoomOffset.x, initialRoomPlayerTileY + initialRoomOffset.y);

    if (initialRoomIsShopTile(initialRoomTile) && initialRoomTryBuyShopTile(initialRoomTile)) {
      return true;
    }

    if (initialRoomIsChestCheckTile(initialRoomTile) && initialRoomTryCollectCheckTile(initialRoomTile)) {
      return true;
    }

    initialRoomOffsetIndex += 1;
  }

  return false;
}

function initialRoomIsChestCheckTile(initialRoomTile) {
  return Boolean(initialRoomTile &&
    initialRoomTile.type === "check" &&
    !initialRoomIsDestructableCheckTile(initialRoomTile));
}

function initialRoomClampPlayerAxis(initialRoomValue) {
  return Math.max(1.5, Math.min(initialRoomValue, mapManagerData.roomWidth - 1.5));
}

function initialRoomIsDevelopedMapRoom(initialRoomRoom) {
  return Boolean(initialRoomRoom && (
    initialRoomRoom.finalRun ||
    ((initialRoomRoom.tiles || []).length > 0)
  ));
}

function initialRoomCanUseFallbackRoom(initialRoomRoomX, initialRoomRoomY) {
  return mapManagerGetRoomRing(initialRoomRoomX, initialRoomRoomY) <= globalsState.progression.progressiveRooms;
}

function initialRoomCanMoveToRoom(initialRoomRoomX, initialRoomRoomY) {
  var initialRoomTargetRoom = mapManagerGetRoom(initialRoomRoomX, initialRoomRoomY);

  if (initialRoomCurrentRoom && initialRoomCurrentRoom.isFallbackRoom) {
    return true;
  }

  if (initialRoomIsDevelopedMapRoom(initialRoomTargetRoom)) {
    return mapManagerIsRoomUnlocked(initialRoomRoomX, initialRoomRoomY);
  }

  return initialRoomCanUseFallbackRoom(initialRoomRoomX, initialRoomRoomY);
}

function initialRoomResolveRoomTransition(initialRoomRoomX, initialRoomRoomY) {
  var initialRoomTargetRoom = mapManagerGetRoom(initialRoomRoomX, initialRoomRoomY);

  if (initialRoomCurrentRoom && initialRoomCurrentRoom.isFallbackRoom) {
    if (initialRoomIsDevelopedMapRoom(initialRoomTargetRoom) && mapManagerIsRoomUnlocked(initialRoomRoomX, initialRoomRoomY)) {
      return initialRoomTargetRoom;
    }

    return initialRoomCreateFallbackRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y);
  }

  if (initialRoomIsDevelopedMapRoom(initialRoomTargetRoom)) {
    if (!mapManagerIsRoomUnlocked(initialRoomRoomX, initialRoomRoomY)) {
      return null;
    }

    return initialRoomTargetRoom;
  }

  if (!initialRoomCanUseFallbackRoom(initialRoomRoomX, initialRoomRoomY)) {
    return null;
  }

  return initialRoomCreateFallbackRoom(initialRoomRoomX, initialRoomRoomY);
}

function initialRoomCloneRoom(initialRoomRoom) {
  return JSON.parse(JSON.stringify(initialRoomRoom));
}

function initialRoomCreateFallbackRoom(initialRoomRoomX, initialRoomRoomY) {
  var initialRoomRoom = initialRoomCreateFallbackRoomBase(initialRoomRoomX, initialRoomRoomY);

  initialRoomRoom.id = "fallback_snake_pits_" + initialRoomRoomX + "_" + initialRoomRoomY + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
  initialRoomRoom.isFallbackRoom = true;
  initialRoomRoom.tiles = initialRoomCreateFallbackRoomTiles(initialRoomRoom);

  return initialRoomRoom;
}

function initialRoomCreateFallbackRoomBase(initialRoomRoomX, initialRoomRoomY) {
  return {
    id: "fallback_snake_pits_" + initialRoomRoomX + "_" + initialRoomRoomY,
    x: initialRoomRoomX,
    y: initialRoomRoomY,
    width: 1,
    height: 1,
    name: "The Snake Pits",
    tiles: [],
    defaultBorder: {
      type: "blocker",
      tileType: "RoomEntrance",
      typeOverride: "RoomEntrance",
      sprite: {
        source: "tileset",
        x: 5,
        y: 6
      }
    },
    defaultGround: {
      type: "walkable",
      tileType: "Walkable",
      typeOverride: "Walkable",
      sprite: {
        source: "tileset",
        x: 10,
        y: 2
      }
    }
  };
}

function initialRoomCreateFallbackRoomTiles(initialRoomRoom) {
  var initialRoomBaseTiles = [];
  var initialRoomSnakeTiles = [];
  var initialRoomSnakeIndex = 0;

  while (initialRoomSnakeIndex < initialRoomFallbackSnakeCount) {
    initialRoomSnakeTiles.push(initialRoomCreateFallbackSnakeTile(initialRoomSnakeIndex, 0, 0));
    initialRoomSnakeIndex += 1;
  }

  initialRoomRoom.tiles = initialRoomBaseTiles;
  initialRoomRandomizeFallbackSnakeTiles(initialRoomRoom, initialRoomSnakeTiles).forEach(function (initialRoomTile) {
    initialRoomBaseTiles.push(initialRoomTile);
  });

  if (Math.random() < initialRoomFallbackWizardChance) {
    initialRoomBaseTiles.push(initialRoomCreateFallbackWizardTile(initialRoomRoom));
  }

  return initialRoomBaseTiles;
}

function initialRoomCreateFallbackSnakeTile(initialRoomIndex, initialRoomTileX, initialRoomTileY) {
  return {
    id: "enemy_snake_" + initialRoomIndex,
    x: initialRoomTileX,
    y: initialRoomTileY,
    width: 1,
    height: 1,
    type: "enemy",
    tileType: "Enemy",
    typeOverride: "Enemy",
    enemyType: "snake",
    expectedDrop: "itemPool1",
    sprite: {
      source: "enemy",
      name: "snake"
    },
    backgroundTile: {
      type: "walkable",
      tileType: "Walkable",
      typeOverride: "Walkable",
      sprite: {
        source: "tileset",
        x: 10,
        y: 2
      }
    }
  };
}

function initialRoomRandomizeFallbackSnakeTiles(initialRoomRoom, initialRoomSnakeTiles) {
  var initialRoomRandomizedTiles = [];
  var initialRoomOccupiedTiles = {};

  (initialRoomRoom.tiles || []).forEach(function (initialRoomTile) {
    initialRoomOccupiedTiles[mapManagerGetCoordinateKey(initialRoomTile.x, initialRoomTile.y)] = true;
  });

  initialRoomSnakeTiles.forEach(function (initialRoomSnakeTile, initialRoomIndex) {
    var initialRoomPoint = initialRoomGetRandomFallbackEnemyPoint(initialRoomRoom, initialRoomOccupiedTiles);

    initialRoomSnakeTile.x = initialRoomPoint.x;
    initialRoomSnakeTile.y = initialRoomPoint.y;
    initialRoomSnakeTile.id = "enemy_snake_" + initialRoomPoint.x + "_" + initialRoomPoint.y + "_" + initialRoomIndex;
    initialRoomOccupiedTiles[mapManagerGetCoordinateKey(initialRoomPoint.x, initialRoomPoint.y)] = true;
    initialRoomRandomizedTiles.push(initialRoomSnakeTile);
  });

  return initialRoomRandomizedTiles;
}

function initialRoomGetRandomFallbackEnemyPoint(initialRoomRoom, initialRoomOccupiedTiles) {
  var initialRoomAttempt = 0;
  var initialRoomMinX = initialRoomFallbackEnemyMargin;
  var initialRoomMinY = initialRoomFallbackEnemyMargin;
  var initialRoomMaxX = Math.max(initialRoomMinX, mapManagerData.roomWidth - initialRoomFallbackEnemyMargin - 1);
  var initialRoomMaxY = Math.max(initialRoomMinY, mapManagerData.roomHeight - initialRoomFallbackEnemyMargin - 1);

  while (initialRoomAttempt < 200) {
    var initialRoomPoint = {
      x: initialRoomMinX + Math.floor(Math.random() * ((initialRoomMaxX - initialRoomMinX) + 1)),
      y: initialRoomMinY + Math.floor(Math.random() * ((initialRoomMaxY - initialRoomMinY) + 1))
    };

    if (initialRoomIsFallbackEnemyPointAvailable(initialRoomRoom, initialRoomPoint.x, initialRoomPoint.y, initialRoomOccupiedTiles)) {
      return initialRoomPoint;
    }

    initialRoomAttempt += 1;
  }

  return {
    x: Math.floor(mapManagerData.roomWidth / 2),
    y: Math.floor(mapManagerData.roomHeight / 2)
  };
}

function initialRoomIsFallbackEnemyPointAvailable(initialRoomRoom, initialRoomTileX, initialRoomTileY, initialRoomOccupiedTiles) {
  var initialRoomKey = mapManagerGetCoordinateKey(initialRoomTileX, initialRoomTileY);
  var initialRoomTile = mapManagerGetEffectiveTile(initialRoomRoom, initialRoomTileX, initialRoomTileY);

  if (initialRoomOccupiedTiles[initialRoomKey]) {
    return false;
  }

  if (initialRoomIsRoomEntranceTile(initialRoomTile) || initialRoomIsEnemyTile(initialRoomTile)) {
    return false;
  }

  return !initialRoomIsBlockingTileType(initialRoomTile);
}

function initialRoomCreateFallbackWizardTile(initialRoomRoom) {
  var initialRoomCenterX = Math.floor(mapManagerData.roomWidth / 2);
  var initialRoomCenterY = Math.floor(mapManagerData.roomHeight / 2);
  var initialRoomPoint = initialRoomIsFallbackEnemyPointAvailable(initialRoomRoom, initialRoomCenterX, initialRoomCenterY, {}) ?
    { x: initialRoomCenterX, y: initialRoomCenterY } :
    initialRoomGetRandomFallbackEnemyPoint(initialRoomRoom, {});

  return {
    id: "enemy_sorcerer_" + initialRoomPoint.x + "_" + initialRoomPoint.y,
    x: initialRoomPoint.x,
    y: initialRoomPoint.y,
    width: 1,
    height: 1,
    type: "enemy",
    tileType: "Enemy",
    typeOverride: "Enemy",
    enemyType: "sorcerer",
    expectedDrop: "itemPool1",
    sprite: {
      source: "enemy",
      name: "sorcerer"
    },
    backgroundTile: initialRoomRoom.defaultGround ? initialRoomCloneRoom(initialRoomRoom.defaultGround) : null
  };
}

function initialRoomGetVisitedRoomEdgeKey(initialRoomRoomX, initialRoomRoomY) {
  return mapManagerGetCoordinateKey(initialRoomRoomX, initialRoomRoomY);
}

function initialRoomMarkVisitedRoomEdge(initialRoomRoomX, initialRoomRoomY, initialRoomDirection) {
  var initialRoomKey = initialRoomGetVisitedRoomEdgeKey(initialRoomRoomX, initialRoomRoomY);

  if (!initialRoomDirection) {
    return;
  }

  if (!initialRoomVisitedRoomEdges[initialRoomKey]) {
    initialRoomVisitedRoomEdges[initialRoomKey] = {};
  }

  initialRoomVisitedRoomEdges[initialRoomKey][initialRoomDirection] = true;
}

function initialRoomMarkVisitedWarpRooms(initialRoomSourceRoom, initialRoomTargetRoom) {
  if (initialRoomSourceRoom) {
    initialRoomVisitedWarpRooms[mapManagerGetCoordinateKey(initialRoomSourceRoom.x, initialRoomSourceRoom.y)] = true;
  }

  if (initialRoomTargetRoom) {
    initialRoomVisitedWarpRooms[mapManagerGetCoordinateKey(initialRoomTargetRoom.x, initialRoomTargetRoom.y)] = true;
  }

  initialRoomMapStatusCache = null;
  initialRoomSaveOfflineProgress();
}

function initialRoomHasVisitedWarpRoom(initialRoomRoomX, initialRoomRoomY) {
  return Boolean(initialRoomVisitedWarpRooms[mapManagerGetCoordinateKey(initialRoomRoomX, initialRoomRoomY)]);
}

function initialRoomGetOppositeCardinalDirection(initialRoomDirection) {
  return {
    north: "south",
    south: "north",
    west: "east",
    east: "west"
  }[initialRoomDirection] || "";
}

function initialRoomGetTransitionDirection(initialRoomFromX, initialRoomFromY, initialRoomToX, initialRoomToY) {
  var initialRoomDeltaX = initialRoomToX - initialRoomFromX;
  var initialRoomDeltaY = initialRoomToY - initialRoomFromY;

  if (initialRoomDeltaX === 1 && initialRoomDeltaY === 0) {
    return "east";
  }

  if (initialRoomDeltaX === -1 && initialRoomDeltaY === 0) {
    return "west";
  }

  if (initialRoomDeltaX === 0 && initialRoomDeltaY === 1) {
    return "south";
  }

  if (initialRoomDeltaX === 0 && initialRoomDeltaY === -1) {
    return "north";
  }

  return "";
}

function initialRoomRecordRoomTransition(initialRoomFromRoom, initialRoomToRoom) {
  var initialRoomDirection = "";

  if (!initialRoomFromRoom || !initialRoomToRoom) {
    return;
  }

  initialRoomDirection = initialRoomGetTransitionDirection(
    initialRoomFromRoom.x,
    initialRoomFromRoom.y,
    initialRoomToRoom.x,
    initialRoomToRoom.y
  );

  if (!initialRoomDirection) {
    return;
  }

  initialRoomMarkVisitedRoomEdge(initialRoomFromRoom.x, initialRoomFromRoom.y, initialRoomDirection);
  initialRoomMarkVisitedRoomEdge(initialRoomToRoom.x, initialRoomToRoom.y, initialRoomGetOppositeCardinalDirection(initialRoomDirection));
  initialRoomSaveOfflineProgress();
}

function initialRoomMoveToRoom(initialRoomRoomX, initialRoomRoomY, initialRoomPlayerX, initialRoomPlayerY) {
  var initialRoomNextRoom = null;
  var initialRoomPreviousRoom = initialRoomCurrentRoom;

  if (!initialRoomCanMoveToRoom(initialRoomRoomX, initialRoomRoomY)) {
    return false;
  }

  initialRoomNextRoom = initialRoomResolveRoomTransition(initialRoomRoomX, initialRoomRoomY);

  if (!initialRoomNextRoom) {
    return false;
  }

  initialRoomCurrentRoom = initialRoomNextRoom;
  initialRoomRecordRoomTransition(initialRoomPreviousRoom, initialRoomNextRoom);
  initialRoomHiddenShopItems = {};
  initialRoomRemovedShopItems = {};
  initialRoomFreeShopItems = {};
  initialRoomPlayer.x = initialRoomPlayerX;
  initialRoomPlayer.y = initialRoomPlayerY;
  initialRoomPlayer.targetX = initialRoomPlayer.x;
  initialRoomPlayer.targetY = initialRoomPlayer.y;
  initialRoomPlayer.moveDirection = null;
  initialRoomSyncFinalRunStateForRoom();
  if (!initialRoomFinalRunState.active) {
    initialRoomLoadRoomEnemies();
    if (initialRoomHasTankForm()) {
      initialRoomDestroyTankVulnerableChecksAroundSpawn();
    }
  }
  return true;
}

function initialRoomTryTileRoomTransition(initialRoomNextTileX, initialRoomNextTileY) {
  if (initialRoomNextTileX <= 0) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x - 1, initialRoomCurrentRoom.y, mapManagerData.roomWidth - 1.5, initialRoomPlayer.y);
  }

  if (initialRoomNextTileX >= mapManagerData.roomWidth - 1) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x + 1, initialRoomCurrentRoom.y, 1.5, initialRoomPlayer.y);
  }

  if (initialRoomNextTileY <= 0) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y - 1, initialRoomPlayer.x, mapManagerData.roomHeight - 1.5);
  }

  if (initialRoomNextTileY >= mapManagerData.roomHeight - 1) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y + 1, initialRoomPlayer.x, 1.5);
  }

  return false;
}

function initialRoomTryRoomEntranceTransition(initialRoomTileX, initialRoomTileY) {
  var initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  if (!initialRoomIsRoomEntranceTile(initialRoomTile) || !initialRoomIsRoomEntranceUnlocked(initialRoomTile)) {
    return false;
  }

  return initialRoomMoveThroughRoomEdge(initialRoomTileX, initialRoomTileY, initialRoomPlayer.x, initialRoomPlayer.y);
}

function initialRoomTryDoorWarp(initialRoomTileX, initialRoomTileY, initialRoomExitDirection) {
  var initialRoomTile = null;
  var initialRoomLinkedDoor = null;
  var initialRoomLanding = null;

  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return false;
  }

  initialRoomTile = initialRoomGetTile(initialRoomTileX, initialRoomTileY);

  if (initialRoomHasTankForm() || Date.now() < initialRoomDoorWarpCooldownUntil || !initialRoomIsDoorTile(initialRoomTile)) {
    return false;
  }

  initialRoomLinkedDoor = initialRoomFindLinkedDoor(initialRoomTile);

  if (!initialRoomLinkedDoor || !initialRoomCanMoveToRoom(initialRoomLinkedDoor.room.x, initialRoomLinkedDoor.room.y)) {
    return false;
  }

  initialRoomLanding = initialRoomFindDoorWarpLanding(initialRoomLinkedDoor.room, initialRoomLinkedDoor.tile, initialRoomExitDirection);
  initialRoomMarkVisitedWarpRooms(initialRoomCurrentRoom, initialRoomLinkedDoor.room);
  initialRoomWarpToDoorRoom(initialRoomLinkedDoor.room, initialRoomLanding.x, initialRoomLanding.y);
  initialRoomDoorWarpCooldownUntil = Date.now() + 300;
  return true;
}

function initialRoomTryPlayerDoorWarp(initialRoomNextX, initialRoomNextY) {
  var initialRoomPlayerRadius = initialRoomGetPlayerCollisionRadius();
  var initialRoomLeftTile = Math.floor(initialRoomNextX - initialRoomPlayerRadius);
  var initialRoomRightTile = Math.floor(initialRoomNextX + initialRoomPlayerRadius);
  var initialRoomTopTile = Math.floor(initialRoomNextY - initialRoomPlayerRadius);
  var initialRoomBottomTile = Math.floor(initialRoomNextY + initialRoomPlayerRadius);
  var initialRoomExitDirection = initialRoomGetDoorExitDirection(initialRoomNextX - initialRoomPlayer.x, initialRoomNextY - initialRoomPlayer.y);
  var initialRoomTileY = initialRoomTopTile;

  while (initialRoomTileY <= initialRoomBottomTile) {
    var initialRoomTileX = initialRoomLeftTile;

    while (initialRoomTileX <= initialRoomRightTile) {
      if (initialRoomTryDoorWarp(initialRoomTileX, initialRoomTileY, initialRoomExitDirection)) {
        return true;
      }

      initialRoomTileX += 1;
    }

    initialRoomTileY += 1;
  }

  return false;
}

function initialRoomFindLinkedDoor(initialRoomSourceTile) {
  var initialRoomSourceChannel = initialRoomGetDoorChannel(initialRoomSourceTile);
  var initialRoomDoorIndex = null;
  var initialRoomDoors = null;
  var initialRoomDoorIndexPosition = 0;

  if (!initialRoomSourceChannel) {
    return null;
  }

  initialRoomDoorIndex = initialRoomGetDoorChannelIndex();
  initialRoomDoors = initialRoomDoorIndex[initialRoomSourceChannel] || [];

  while (initialRoomDoorIndexPosition < initialRoomDoors.length) {
    var initialRoomDoor = initialRoomDoors[initialRoomDoorIndexPosition];

    if (!initialRoomIsSameDoorTile(initialRoomDoor.room, initialRoomDoor.tile, initialRoomSourceTile)) {
      return initialRoomDoor;
    }

    initialRoomDoorIndexPosition += 1;
  }

  return null;
}

function initialRoomGetDoorChannelIndex() {
  var initialRoomRooms = null;

  if (initialRoomDoorChannelIndex) {
    return initialRoomDoorChannelIndex;
  }

  initialRoomDoorChannelIndex = {};
  initialRoomRooms = Array.isArray(mapManagerData && mapManagerData.rooms) ? mapManagerData.rooms : [];

  initialRoomRooms.forEach(function (initialRoomRoom) {
    var initialRoomTiles = Array.isArray(initialRoomRoom.tiles) ? initialRoomRoom.tiles : [];

    initialRoomTiles.forEach(function (initialRoomTile) {
      var initialRoomDoorChannel = initialRoomGetDoorChannel(initialRoomTile);

      if (!initialRoomIsDoorTile(initialRoomTile) || !initialRoomDoorChannel) {
        return;
      }

      if (!initialRoomDoorChannelIndex[initialRoomDoorChannel]) {
        initialRoomDoorChannelIndex[initialRoomDoorChannel] = [];
      }

      initialRoomDoorChannelIndex[initialRoomDoorChannel].push({
        room: initialRoomRoom,
        tile: initialRoomTile
      });
    });
  });

  return initialRoomDoorChannelIndex;
}

function initialRoomGetDoorChannel(initialRoomTile) {
  return Number(initialRoomTile && (initialRoomTile.doorChannel || initialRoomTile.channel)) || 0;
}

function initialRoomIsSameDoorTile(initialRoomRoom, initialRoomTile, initialRoomSourceTile) {
  return initialRoomCurrentRoom &&
    initialRoomRoom.x === initialRoomCurrentRoom.x &&
    initialRoomRoom.y === initialRoomCurrentRoom.y &&
    initialRoomTile.x === initialRoomSourceTile.x &&
    initialRoomTile.y === initialRoomSourceTile.y;
}

function initialRoomGetDoorExitDirection(initialRoomDeltaX, initialRoomDeltaY) {
  if (Math.abs(initialRoomDeltaX) > Math.abs(initialRoomDeltaY)) {
    return { x: initialRoomDeltaX >= 0 ? 1 : -1, y: 0 };
  }

  if (Math.abs(initialRoomDeltaY) > 0) {
    return { x: 0, y: initialRoomDeltaY >= 0 ? 1 : -1 };
  }

  return initialRoomPlayer.facingDirection || { x: 0, y: 1 };
}

function initialRoomFindDoorWarpLanding(initialRoomTargetRoom, initialRoomTargetTile, initialRoomExitDirection) {
  var initialRoomDirection = initialRoomExitDirection || initialRoomPlayer.facingDirection || { x: 0, y: 1 };
  var initialRoomDirections = [
    { x: initialRoomDirection.x, y: initialRoomDirection.y },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: -1 }
  ];
  var initialRoomIndex = 0;

  while (initialRoomIndex < initialRoomDirections.length) {
    var initialRoomLandingX = initialRoomTargetTile.x + initialRoomDirections[initialRoomIndex].x;
    var initialRoomLandingY = initialRoomTargetTile.y + initialRoomDirections[initialRoomIndex].y;

    if (initialRoomIsDoorLandingTileOpen(initialRoomTargetRoom, initialRoomLandingX, initialRoomLandingY)) {
      return {
        x: initialRoomLandingX + 0.5,
        y: initialRoomLandingY + 0.5
      };
    }

    initialRoomIndex += 1;
  }

  return {
    x: initialRoomTargetTile.x + 0.5,
    y: initialRoomTargetTile.y + 0.5
  };
}

function initialRoomIsDoorLandingTileOpen(initialRoomTargetRoom, initialRoomTileX, initialRoomTileY) {
  var initialRoomTile = null;

  if (initialRoomTileX < 0 || initialRoomTileY < 0 || initialRoomTileX >= mapManagerData.roomWidth || initialRoomTileY >= mapManagerData.roomHeight) {
    return false;
  }

  initialRoomTile = mapManagerGetEffectiveTile(initialRoomTargetRoom, initialRoomTileX, initialRoomTileY);
  return Boolean(initialRoomTile && initialRoomTile.type === "walkable" && !initialRoomIsDoorTile(initialRoomTile));
}

function initialRoomWarpToDoorRoom(initialRoomNextRoom, initialRoomPlayerX, initialRoomPlayerY) {
  initialRoomCurrentRoom = initialRoomNextRoom;
  initialRoomHiddenShopItems = {};
  initialRoomPlayer.x = initialRoomPlayerX;
  initialRoomPlayer.y = initialRoomPlayerY;
  initialRoomPlayer.targetX = initialRoomPlayer.x;
  initialRoomPlayer.targetY = initialRoomPlayer.y;
  initialRoomPlayer.moveDirection = null;
  initialRoomSyncFinalRunStateForRoom();
  if (!initialRoomFinalRunState.active) {
    initialRoomLoadRoomEnemies();
    if (initialRoomHasTankForm()) {
      initialRoomDestroyTankVulnerableChecksAroundSpawn();
    }
  }
}

function initialRoomTryPlayerRoomEntranceTransition(initialRoomNextX, initialRoomNextY) {
  var initialRoomPlayerRadius = initialRoomGetPlayerCollisionRadius();
  var initialRoomLeftTile = Math.floor(initialRoomNextX - initialRoomPlayerRadius);
  var initialRoomRightTile = Math.floor(initialRoomNextX + initialRoomPlayerRadius);
  var initialRoomTopTile = Math.floor(initialRoomNextY - initialRoomPlayerRadius);
  var initialRoomBottomTile = Math.floor(initialRoomNextY + initialRoomPlayerRadius);
  var initialRoomTileY = initialRoomTopTile;

  while (initialRoomTileY <= initialRoomBottomTile) {
    var initialRoomTileX = initialRoomLeftTile;

    while (initialRoomTileX <= initialRoomRightTile) {
      if (initialRoomTryRoomEntranceTransition(initialRoomTileX, initialRoomTileY)) {
        return true;
      }

      initialRoomTileX += 1;
    }

    initialRoomTileY += 1;
  }

  return false;
}

function initialRoomMoveThroughRoomEdge(initialRoomTileX, initialRoomTileY, initialRoomPlayerX, initialRoomPlayerY) {
  if (initialRoomTileX <= 0) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x - 1, initialRoomCurrentRoom.y, mapManagerData.roomWidth - 1.5, initialRoomClampPlayerAxis(initialRoomPlayerY));
  }

  if (initialRoomTileX >= mapManagerData.roomWidth - 1) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x + 1, initialRoomCurrentRoom.y, 1.5, initialRoomClampPlayerAxis(initialRoomPlayerY));
  }

  if (initialRoomTileY <= 0) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y - 1, initialRoomClampPlayerAxis(initialRoomPlayerX), mapManagerData.roomHeight - 1.5);
  }

  if (initialRoomTileY >= mapManagerData.roomHeight - 1) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y + 1, initialRoomClampPlayerAxis(initialRoomPlayerX), 1.5);
  }

  return false;
}

function initialRoomTryFreeRoomTransition(initialRoomNextX, initialRoomNextY) {
  if (!initialRoomHasTankForm()) {
    return false;
  }

  if (initialRoomNextX < 0) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x - 1, initialRoomCurrentRoom.y, mapManagerData.roomWidth - 1.5, initialRoomClampPlayerAxis(initialRoomPlayer.y));
  }

  if (initialRoomNextX >= mapManagerData.roomWidth) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x + 1, initialRoomCurrentRoom.y, 1.5, initialRoomClampPlayerAxis(initialRoomPlayer.y));
  }

  if (initialRoomNextY < 0) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y - 1, initialRoomClampPlayerAxis(initialRoomPlayer.x), mapManagerData.roomHeight - 1.5);
  }

  if (initialRoomNextY >= mapManagerData.roomHeight) {
    return initialRoomMoveToRoom(initialRoomCurrentRoom.x, initialRoomCurrentRoom.y + 1, initialRoomClampPlayerAxis(initialRoomPlayer.x), 1.5);
  }

  return false;
}

function initialRoomStart() {
  if (initialRoomHasStarted) {
    return;
  }

  initialRoomResetStartupInputState();

  Promise.all([
    mapManagerLoadMap(),
    initialRoomLoadImage(initialRoomTilesetPath),
    initialRoomLoadImage(initialRoomChestPath),
    initialRoomLoadImage(initialRoomOpenChestPath),
    initialRoomLoadImage(initialRoomBombPath),
    initialRoomLoadImage(initialRoomExplosionPath),
    initialRoomLoadImage(initialRoomSwordPath),
    initialRoomLoadPlayerImages(),
    initialRoomLoadImage(initialRoomTankBodyPath),
    initialRoomLoadImage(initialRoomTankTurretPath),
    initialRoomLoadEnemyImages(),
    initialRoomLoadTilesetData()
  ]).then(function (initialRoomResults) {
    initialRoomTilesetImage = initialRoomResults[1];
    initialRoomChestImage = initialRoomResults[2];
    initialRoomOpenChestImage = initialRoomResults[3];
    initialRoomBombImage = initialRoomResults[4];
    initialRoomExplosionImage = initialRoomResults[5];
    initialRoomSwordImage = initialRoomResults[6];
    initialRoomTankBodyImage = initialRoomResults[8];
    initialRoomTankTurretImage = initialRoomResults[9];
    initialRoomSetTilesetData(initialRoomResults[11]);
    initialRoomCurrentRoom = initialRoomGetInitialRoom();
    initialRoomLoadPickupIconImages();
    initialRoomPlayer.x = Math.floor(mapManagerData.roomWidth / 2) + 0.5;
    initialRoomPlayer.y = Math.floor(mapManagerData.roomHeight / 2) + 0.5;
    initialRoomPlayer.targetX = initialRoomPlayer.x;
    initialRoomPlayer.targetY = initialRoomPlayer.y;
    initialRoomSyncPlayerResourceMaxes();
    initialRoomPlayer.hp = initialRoomGetEffectiveMaxHp();
    initialRoomLoadOfflineProgress();
    initialRoomSyncFinalRunStateForRoom();
    if (!initialRoomFinalRunState.active) {
      initialRoomLoadRoomEnemies();
    }
    initialRoomHasStarted = true;
    initialRoomLoadFont();
    initialRoomLastMessageTime = Date.now();
    initialRoomCurrentMessageStartTime = 0;
    document.body.appendChild(initialRoomCanvas);
    document.body.appendChild(initialRoomEnemyLayer);
    document.body.appendChild(initialRoomEffectLayer);
    document.body.appendChild(initialRoomFinalRunLayer);
    document.body.appendChild(initialRoomMessageCanvas);
    initialRoomCanvas.tabIndex = 0;
    try {
      initialRoomCanvas.focus({ preventScroll: true });
    } catch (initialRoomFocusError) {
      initialRoomCanvas.focus();
    }
    initialRoomResizeCanvas();
    initialRoomLoop();
  }).catch(function (initialRoomError) {
    console.error(initialRoomError);
    document.body.textContent = initialRoomError.message;
  });
}
