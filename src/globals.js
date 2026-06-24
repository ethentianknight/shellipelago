var globalsState = {
  loadedModules: [],
  shellipelagoVersion: "1.8",
  startInFinalRun: false,
  progressiveRoomMaxRing: 5,
  showEssentialPickupHints: true,
  musicTracks: [
    "maintheme.mp3",
    "bossmusic.mp3",
    "Crossing the Chasm.mp3",
    "Desert City.mp3",
    "Desert of Lost Souls.mp3",
    "Destiny Day.mp3",
    "Myst on the Moor.mp3",
    "Night Cave.mp3"
  ],
  enemyDefinitions: {
    blob: {
      label: "Blob",
      image: "src/img/enemy/BLOB/ENEMIES_PixelPackTOPDOWN8BIT_Blob Walk.gif",
      hurtImage: "src/img/enemy/BLOB/ENEMIES_PixelPackTOPDOWN8BIT_Blob Hurt.gif",
      deathImage: "src/img/enemy/BLOB/ENEMIES_PixelPackTOPDOWN8BIT_Blob Death.gif"
    },
    negaBlob: {
      label: "Nega Blob",
      image: "src/img/enemy/NEGABLOB/ENEMIES_PixelPackTOPDOWN8BIT_NegaBlob Walk.gif",
      hurtImage: "src/img/enemy/NEGABLOB/ENEMIES_PixelPackTOPDOWN8BIT_NegaBlob Hurt.gif",
      deathImage: "src/img/enemy/NEGABLOB/ENEMIES_PixelPackTOPDOWN8BIT_NegaBlob Death.gif"
    },
    snake: {
      label: "Snake",
      image: "src/img/enemy/SNAKE/ENEMIES_PixelPackTOPDOWN8BIT_Snake Walk D.gif",
      images: {
        down: "src/img/enemy/SNAKE/ENEMIES_PixelPackTOPDOWN8BIT_Snake Walk D.gif",
        up: "src/img/enemy/SNAKE/ENEMIES_PixelPackTOPDOWN8BIT_Snake Walk U.gif",
        right: "src/img/enemy/SNAKE/ENEMIES_PixelPackTOPDOWN8BIT_Snake Walk R.gif",
        left: "src/img/enemy/SNAKE/ENEMIES_PixelPackTOPDOWN8BIT_Snake Walk R.gif"
      },
      previewImage: "src/img/enemy/SNAKE/snake_down.png",
      deathImage: "src/img/enemy/SNAKE/ENEMIES_PixelPackTOPDOWN8BIT_Snake Death.gif"
    },
    sorcerer: {
      label: "Sorcerer",
      image: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Walk D.gif",
      images: {
        down: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Walk D.gif",
        up: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Walk U.gif",
        right: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Walk R.gif",
        left: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Walk R.gif"
      },
      attackImages: {
        down: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Attack D.gif",
        up: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Attack U.gif",
        right: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Attack R.gif",
        left: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Attack R.gif"
      },
      hurtImage: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Hurt D.gif",
      deathImage: "src/img/enemy/SORCERER/ENEMIES_PixelPackTOPDOWN8BIT_Sorcerer Death D.gif"
    }
  },
  progressiveCheckDefinitions: {
    graphics: {
      label: "Graphics",
      count: 3
    },
    progressiveRoom: {
      label: "Progressive Room",
      count: 5
    },
    bomb: {
      label: "Bombs",
      count: 3
    },
    gun: {
      label: "Gun",
      count: 2
    },
    sword: {
      label: "Sword",
      count: 3
    },
    hp: {
      label: "Max HP",
      count: 30
    },
    rounds: {
      label: "Max Rounds",
      count: 40
    }
  },
  progression: {
    graphics: false,
    graphicsLevel: 0,
    bomb: 0,
    gun: 0,
    sword: 0,
    waterWalkers: false,
    hp: 0,
    rounds: 0,
    freeGrid: false,
    progressiveRooms: 0
  },
  checkDefinitions: {
    empty: {
      id: "empty",
      label: "Empty",
      requires: []
    },
    itemPool: {
      id: "item_pool",
      label: "Item Pool",
      requires: []
    },
    freeGrid: {
      id: "free_grid",
      label: "Free Grid",
      requires: [],
      hiddenFromPools: true
    },
    trapStun: {
      id: "trap_stun",
      label: "Stun Trap",
      requires: [],
      trap: true
    },
    trapInvisible: {
      id: "trap_invisible",
      label: "Invisible Trap",
      requires: [],
      trap: true
    },
    trapFast: {
      id: "trap_fast",
      label: "Fast Trap",
      requires: [],
      trap: true
    },
    trapSlow: {
      id: "trap_slow",
      label: "Slow Trap",
      requires: [],
      trap: true
    },
    trapReverse: {
      id: "trap_reverse",
      label: "Reverse Trap",
      requires: [],
      trap: true
    },
    trapScreenFlip: {
      id: "trap_screen_flip",
      label: "Screen Flip Trap",
      requires: [],
      trap: true
    },
    trapZoom: {
      id: "trap_zoom",
      label: "Zoom Trap",
      requires: [],
      trap: true
    },
    trapDeath: {
      id: "trap_death",
      label: "Death Trap",
      requires: [],
      trap: true
    },
    suddenlySnake: {
      id: "suddenly_snake",
      label: "Suddenly Snake",
      requires: [],
      trap: true
    }
  },
  checks: {
    empty: false,
    itemPool: false,
    freeGrid: false,
    trapStun: false,
    trapInvisible: false,
    trapFast: false,
    trapSlow: false,
    trapReverse: false,
    trapScreenFlip: false,
    trapZoom: false,
    trapDeath: false,
    suddenlySnake: false
  },
  locations: {
    empty: {
      id: 99999,
      name: "Empty",
      checked: false
    },
    itemPool: {
      id: 100000,
      name: "Item Pool",
      checked: false
    },
    freeGrid: {
      id: 100001,
      name: "Free Grid",
      checked: false
    },
    trapStun: {
      id: 100002,
      name: "Stun Trap",
      checked: false
    },
    trapInvisible: {
      id: 100003,
      name: "Invisible Trap",
      checked: false
    },
    trapFast: {
      id: 100004,
      name: "Fast Trap",
      checked: false
    },
    trapSlow: {
      id: 100005,
      name: "Slow Trap",
      checked: false
    },
    trapReverse: {
      id: 100006,
      name: "Reverse Trap",
      checked: false
    },
    trapScreenFlip: {
      id: 100007,
      name: "Screen Flip Trap",
      checked: false
    },
    trapZoom: {
      id: 100008,
      name: "Zoom Trap",
      checked: false
    },
    trapDeath: {
      id: 100009,
      name: "Death Trap",
      checked: false
    },
    suddenlySnake: {
      id: 100010,
      name: "Suddenly Snake",
      checked: false
    }
  },
  archipelago: {
    connected: false,
    host: "",
    port: "38281",
    slot: "",
    password: "",
    socket: null,
    team: null,
    slotId: null,
    playerNames: {},
    playerGames: {},
    dataPackage: {
      itemNamesByGame: {},
      locationNamesByGame: {}
    },
    checkedLocations: [],
    missingLocations: [],
    slotData: {},
    receivedItems: [],
    linkEvents: {},
    hintedLocations: {},
    nextItemIndex: 0,
    goalSent: false
  },
  deviceMode: ""
};

globalsState.offlineSaveKey = "shellipelagoOfflineSave";
globalsState.offlineSaveVersion = "1.1";
globalsState.shouldLoadOfflineSave = false;

function globalsRegisterCheck(globalsCheckKey, globalsLabel, globalsLocationId, globalsRequires) {
  if (!globalsState.checkDefinitions[globalsCheckKey]) {
    globalsState.progression[globalsCheckKey] = false;
    globalsState.checkDefinitions[globalsCheckKey] = {
      id: globalsCheckKey,
      label: globalsLabel,
      requires: globalsRequires || []
    };
    globalsState.checks[globalsCheckKey] = false;
    globalsState.locations[globalsCheckKey] = {
      id: globalsLocationId,
      name: globalsLabel,
      checked: false
    };
  }
}

function globalsRegisterProgressiveChecks() {
  var globalsBaseLocationId = 100020;

  Object.keys(globalsState.progressiveCheckDefinitions).forEach(function (globalsProgressiveKey) {
    var globalsProgressiveDefinition = globalsState.progressiveCheckDefinitions[globalsProgressiveKey];
    var globalsLevel = 1;

    while (globalsLevel <= globalsProgressiveDefinition.count) {
      var globalsCheckLabel = globalsProgressiveDefinition.label + " " + globalsLevel;

      globalsRegisterCheck(
        globalsProgressiveKey + globalsLevel,
        globalsCheckLabel,
        globalsBaseLocationId,
        []
      );
      globalsBaseLocationId += 1;
      globalsLevel += 1;
    }
  });
}

function globalsRegisterBasicChecks() {
  var globalsBaseLocationId = 100050;
  var globalsChecks = [
    ["fire", "Fire"],
    ["sfx", "SFX"],
    ["bgm", "BGM"],
    ["pickaxe", "Pickaxe"],
    ["waterWalkers", "Water Walkers"],
    ["tankTreads", "Tank Treads"],
    ["tankChassis", "Tank Chassis"],
    ["tankCannon", "Tank Cannon"]
  ];

  globalsChecks.forEach(function (globalsCheck) {
    globalsRegisterCheck(globalsCheck[0], globalsCheck[1], globalsBaseLocationId, []);
    globalsBaseLocationId += 1;
  });
}

function globalsRegisterProgressiveRooms() {
}

function globalsRegisterItemPools() {
  var globalsPoolIndex = 1;
  var globalsBaseLocationId = 100010;

  while (globalsPoolIndex <= 5) {
    globalsRegisterCheck("itemPool" + globalsPoolIndex, "Item Pool " + globalsPoolIndex, globalsBaseLocationId, []);
    globalsBaseLocationId += 1;
    globalsPoolIndex += 1;
  }
}

globalsRegisterItemPools();
globalsRegisterProgressiveChecks();
globalsRegisterBasicChecks();
globalsRegisterProgressiveRooms();

var isDebug = true;
var isMobile = false;
var isBuild = false;
