var mapEditorState = {
  previewState: "color",
  roomTileCount: 32,
  mainRadius: mapManagerMainRadius,
  roomMapCellSize: 32,
  tilesetTileSize: 16,
  selectedPaletteSource: "tileset",
  selectedItemName: "chest",
  selectedShopDrop: "itemPool1",
  selectedEnemyType: "blob",
  selectedPaintTypeOverride: null,
  selectedCheckKey: "",
  selectedVulnerableTypes: [],
  selectedColorSource: "",
  selectedColorReplacements: [],
  isEyedropperActive: false,
  isCheckEditMode: false,
  selectedTilesetX: 0,
  selectedTilesetY: 0,
  selectedRoomX: 0,
  selectedRoomY: 0,
  selectedRoom: null,
  tilesetCanvas: null,
  tilesetContext: null,
  editorCanvas: null,
  editorContext: null,
  overviewCanvas: null,
  overviewContext: null,
  tilesetImage: null,
  chestImage: null,
  floppydiskImage: null,
  shopImage: null,
  enemyImages: {},
  tilesetData: null,
  colorSampleCanvas: null,
  colorSampleContext: null,
  isPainting: false,
  lastPaintedTileKey: ""
};
var mapEditorTilesetPath = "src/img/tileset/PixelPackTOPDOWN8BIT.png";
var mapEditorChestPath = "src/img/item/item8BIT_chest.png";
var mapEditorFloppydiskPath = "src/img/item/item8BIT_floppydisk.png";
var mapEditorShopPath = "src/img/item/item8BIT_coin.png";
var mapEditorTilesetDataPath = "src/data/tileset.json";
var mapEditorDefaultTilesetType = "Blocker";
var mapEditorCurrentDrawColorReplacements = [];
var mapEditorDoorChannelBaseColor = "#928fb8";
var mapEditorDoorChannelColors = ["#9f8faf", "#8f98b8", "#8fb0a0", "#b0aa8f", "#a58fb8", "#b89a8f", "#8fb4b8", "#aaaab4"];
var mapEditorReplacementColors = [
  "",
  "#ffffff",
  "#f7e26b",
  "#f58b3a",
  "#d94141",
  "#b85ee6",
  "#4f78ff",
  "#40bcd8",
  "#47c96b",
  "#8b5a32",
  "#050505"
];
var mapEditorTileTypeOptions = [
  "Walkable",
  "Blocker",
  "JumpS",
  "JumpE",
  "JumpW",
  "JumpN",
  "Water",
  "Lava",
  "RoomEntrance",
  "RoomEntranceDestructable",
  "Door",
  "Chest",
  "DestructableCheck"
];
var mapEditorCheckTileTypes = ["Chest", "DestructableCheck"];
var mapEditorShopTileType = "ShopItem";
// Tank treads and tank cannon vulnerabilities both mean "tank" for Archipelago logic,
// because all three tank pieces are required before either capability can be used.
var mapEditorVulnerableAttributeOptions = ["bomb", "gun", "sword", "fire", "pickaxe", "tankTreads", "tankCannon"];
var mapEditorEnemyDamageRequirementValues = ["tank", "bomb:1", "sword:1", "fire", "gun:1"];

function mapEditorLoadImage(mapEditorImagePath) {
  return new Promise(function (mapEditorResolve, mapEditorReject) {
    var mapEditorImage = new Image();

    mapEditorImage.onload = function () {
      mapEditorResolve(mapEditorImage);
    };
    mapEditorImage.onerror = function () {
      mapEditorReject(new Error("Unable to load image: " + mapEditorImagePath));
    };
    mapEditorImage.src = mapEditorImagePath;
  });
}

function mapEditorLoadTilesetData() {
  return fetch(mapEditorTilesetDataPath).then(function (mapEditorResponse) {
    if (!mapEditorResponse.ok) {
      return null;
    }

    return mapEditorResponse.json();
  }).catch(function () {
    return null;
  });
}

function mapEditorLoadEnemyImages() {
  var mapEditorEnemyKeys = Object.keys(globalsState.enemyDefinitions);
  var mapEditorPromises = mapEditorEnemyKeys.map(function (mapEditorEnemyKey) {
    return mapEditorLoadImage(globalsState.enemyDefinitions[mapEditorEnemyKey].image);
  });

  return Promise.all(mapEditorPromises).then(function (mapEditorImages) {
    var mapEditorEnemyImages = {};

    mapEditorImages.forEach(function (mapEditorImage, mapEditorIndex) {
      mapEditorEnemyImages[mapEditorEnemyKeys[mapEditorIndex]] = mapEditorImage;
    });

    return mapEditorEnemyImages;
  });
}

function mapEditorNormalizeTilesetData(mapEditorTilesetData) {
  var mapEditorNormalizedData = mapEditorTilesetData || {};

  if (!mapEditorNormalizedData.tileSize) {
    mapEditorNormalizedData.tileSize = mapEditorState.tilesetTileSize;
  }

  if (!mapEditorNormalizedData.defaultType) {
    mapEditorNormalizedData.defaultType = mapEditorDefaultTilesetType;
  }

  if (!mapEditorNormalizedData.tiles) {
    mapEditorNormalizedData.tiles = {};
  }

  return mapEditorNormalizedData;
}

function mapEditorGetTilesetKey(mapEditorTileX, mapEditorTileY) {
  return mapEditorTileX + "," + mapEditorTileY;
}

function mapEditorGetSelectedTilesetKey() {
  return mapEditorGetTilesetKey(mapEditorState.selectedTilesetX, mapEditorState.selectedTilesetY);
}

function mapEditorGetTilesetTileType(mapEditorTileX, mapEditorTileY) {
  var mapEditorTileData = mapEditorState.tilesetData.tiles[mapEditorGetTilesetKey(mapEditorTileX, mapEditorTileY)];

  return mapEditorTileData && mapEditorTileData.type ? mapEditorTileData.type : mapEditorState.tilesetData.defaultType;
}

function mapEditorGetTilesetTileData(mapEditorTileX, mapEditorTileY) {
  return mapEditorState.tilesetData.tiles[mapEditorGetTilesetKey(mapEditorTileX, mapEditorTileY)] || {};
}

function mapEditorSetTilesetTileVulnerable(mapEditorTileX, mapEditorTileY, mapEditorVulnerableTypes) {
  var mapEditorTileKey = mapEditorGetTilesetKey(mapEditorTileX, mapEditorTileY);
  var mapEditorTileData = mapEditorState.tilesetData.tiles[mapEditorTileKey] || {};

  if (mapEditorVulnerableTypes.length > 0) {
    mapEditorTileData.vulnerable = mapEditorVulnerableTypes.slice();
  } else {
    delete mapEditorTileData.vulnerable;
  }

  if (!mapEditorTileData.type && !mapEditorTileData.vulnerable) {
    delete mapEditorState.tilesetData.tiles[mapEditorTileKey];
    return;
  }

  mapEditorState.tilesetData.tiles[mapEditorTileKey] = mapEditorTileData;
}

function mapEditorSetTilesetTileType(mapEditorTileX, mapEditorTileY, mapEditorTileType) {
  var mapEditorTileKey = mapEditorGetTilesetKey(mapEditorTileX, mapEditorTileY);
  var mapEditorTileData = mapEditorState.tilesetData.tiles[mapEditorTileKey] || {};

  if (mapEditorTileType === mapEditorState.tilesetData.defaultType) {
    delete mapEditorTileData.type;
  } else {
    mapEditorTileData.type = mapEditorTileType;
  }

  if (!mapEditorTileData.type && !mapEditorTileData.vulnerable) {
    delete mapEditorState.tilesetData.tiles[mapEditorTileKey];
    return;
  }

  mapEditorState.tilesetData.tiles[mapEditorTileKey] = mapEditorTileData;
}

function mapEditorGetGameplayType(mapEditorTileType) {
  if (mapEditorTileType === "Walkable") {
    return "walkable";
  }

  if (mapEditorTileType === mapEditorShopTileType) {
    return "shop";
  }

  if (mapEditorTileType === "Enemy") {
    return "enemy";
  }

  if (mapEditorCheckTileTypes.indexOf(mapEditorTileType) !== -1) {
    return "check";
  }

  return "blocker";
}

function mapEditorDownloadTilesetData() {
  downloadManagerDownloadText("tileset.json", JSON.stringify(mapEditorState.tilesetData, null, 2) + "\n");
}

function mapEditorUpdateRoomNameControl() {
  document.querySelector("#map-room-name").value = mapEditorState.selectedRoom.name || "";
  document.querySelector("#map-room-bgm").value = mapEditorState.selectedRoom.bgm || "";
  document.querySelector("#map-final-run-room").checked = Boolean(mapEditorState.selectedRoom.finalRun);
  mapEditorUpdateRoomRequirementsSummary();
}

function mapEditorPopulateRoomBgmControl() {
  var mapEditorBgmSelect = document.querySelector("#map-room-bgm");
  var mapEditorDefaultOption = document.createElement("option");

  mapEditorBgmSelect.innerHTML = "";
  mapEditorDefaultOption.value = "";
  mapEditorDefaultOption.textContent = "Default";
  mapEditorBgmSelect.appendChild(mapEditorDefaultOption);

  globalsState.musicTracks.forEach(function (mapEditorMusicTrack) {
    var mapEditorOption = document.createElement("option");

    mapEditorOption.value = mapEditorMusicTrack;
    mapEditorOption.textContent = mapEditorMusicTrack.replace(/\.mp3$/i, "");
    mapEditorBgmSelect.appendChild(mapEditorOption);
  });
}

function mapEditorRgbToHex(mapEditorRed, mapEditorGreen, mapEditorBlue) {
  return "#" + [mapEditorRed, mapEditorGreen, mapEditorBlue].map(function (mapEditorValue) {
    return mapEditorValue.toString(16).padStart(2, "0");
  }).join("");
}

function mapEditorNormalizeColorReplacements(mapEditorColorReplacements) {
  return (mapEditorColorReplacements || []).filter(function (mapEditorReplacement) {
    return mapEditorReplacement.from && mapEditorReplacement.to;
  }).slice(0, 16).map(function (mapEditorReplacement) {
    return {
      from: mapEditorReplacement.from.toLowerCase(),
      to: mapEditorReplacement.to.toLowerCase()
    };
  });
}

function mapEditorGetSelectedSourceImageInfo() {
  if (mapEditorState.selectedPaletteSource === "item") {
    var mapEditorItemImage = mapEditorState.selectedItemName === "floppydisk" ? mapEditorState.floppydiskImage : mapEditorState.chestImage;

    return {
      image: mapEditorItemImage,
      x: 0,
      y: 0,
      width: mapEditorItemImage.width,
      height: mapEditorItemImage.height
    };
  }

  if (mapEditorState.selectedPaletteSource === "enemy") {
    var mapEditorEnemyImage = mapEditorState.enemyImages[mapEditorState.selectedEnemyType];

    return {
      image: mapEditorEnemyImage,
      x: 0,
      y: 0,
      width: mapEditorEnemyImage.width,
      height: mapEditorEnemyImage.height
    };
  }

  return {
    image: mapEditorState.tilesetImage,
    x: mapEditorState.selectedTilesetX * mapEditorState.tilesetTileSize,
    y: mapEditorState.selectedTilesetY * mapEditorState.tilesetTileSize,
    width: mapEditorState.tilesetTileSize,
    height: mapEditorState.tilesetTileSize
  };
}

function mapEditorGetSelectedColorOptions() {
  var mapEditorImageInfo = mapEditorGetSelectedSourceImageInfo();
  var mapEditorColorCounts = {};

  mapEditorState.colorSampleCanvas.width = mapEditorImageInfo.width;
  mapEditorState.colorSampleCanvas.height = mapEditorImageInfo.height;
  mapEditorState.colorSampleContext.clearRect(0, 0, mapEditorImageInfo.width, mapEditorImageInfo.height);
  mapEditorState.colorSampleContext.drawImage(
    mapEditorImageInfo.image,
    mapEditorImageInfo.x,
    mapEditorImageInfo.y,
    mapEditorImageInfo.width,
    mapEditorImageInfo.height,
    0,
    0,
    mapEditorImageInfo.width,
    mapEditorImageInfo.height
  );

  var mapEditorImageData = mapEditorState.colorSampleContext.getImageData(0, 0, mapEditorImageInfo.width, mapEditorImageInfo.height);
  var mapEditorIndex = 0;

  while (mapEditorIndex < mapEditorImageData.data.length) {
    var mapEditorRed = mapEditorImageData.data[mapEditorIndex];
    var mapEditorGreen = mapEditorImageData.data[mapEditorIndex + 1];
    var mapEditorBlue = mapEditorImageData.data[mapEditorIndex + 2];
    var mapEditorAlpha = mapEditorImageData.data[mapEditorIndex + 3];

    if (mapEditorAlpha > 0) {
      var mapEditorHex = mapEditorRgbToHex(mapEditorRed, mapEditorGreen, mapEditorBlue);
      mapEditorColorCounts[mapEditorHex] = (mapEditorColorCounts[mapEditorHex] || 0) + 1;
    }

    mapEditorIndex += 4;
  }

  return Object.keys(mapEditorColorCounts).sort(function (mapEditorFirst, mapEditorSecond) {
    return mapEditorColorCounts[mapEditorSecond] - mapEditorColorCounts[mapEditorFirst];
  }).slice(0, 16);
}

function mapEditorUpdateColorControls() {
  var mapEditorSourceGrid = document.querySelector("#map-color-source-grid");
  var mapEditorTargetGrid = document.querySelector("#map-color-target-grid");
  var mapEditorColorList = document.querySelector("#map-color-list");
  var mapEditorColorOptions = mapEditorGetSelectedColorOptions();

  if (!mapEditorState.selectedColorSource || mapEditorColorOptions.indexOf(mapEditorState.selectedColorSource) === -1) {
    mapEditorState.selectedColorSource = mapEditorColorOptions[0] || "";
  }

  mapEditorSourceGrid.innerHTML = "";
  mapEditorColorOptions.forEach(function (mapEditorColor) {
    var mapEditorButton = mapEditorCreateColorButton(mapEditorColor, mapEditorColor === mapEditorState.selectedColorSource);

    mapEditorButton.addEventListener("click", function () {
      mapEditorState.selectedColorSource = mapEditorColor;
      mapEditorUpdateColorControls();
    });
    mapEditorSourceGrid.appendChild(mapEditorButton);
  });

  mapEditorTargetGrid.innerHTML = "";
  mapEditorReplacementColors.forEach(function (mapEditorColor) {
    var mapEditorButton = mapEditorCreateColorButton(mapEditorColor, false);

    mapEditorButton.addEventListener("click", function () {
      mapEditorApplyColorReplacement(mapEditorColor);
    });
    mapEditorTargetGrid.appendChild(mapEditorButton);
  });

  if (mapEditorColorOptions.length === 0) {
    mapEditorSourceGrid.textContent = "No source colors.";
  }

  mapEditorColorList.innerHTML = "";

  if (mapEditorState.selectedColorReplacements.length === 0) {
    mapEditorColorList.textContent = "No replacements.";
    return;
  }

  mapEditorState.selectedColorReplacements.forEach(function (mapEditorReplacement) {
    var mapEditorRow = document.createElement("div");

    mapEditorRow.innerHTML = "<span class=\"map-color-swatch\" style=\"background:" + mapEditorReplacement.from + "\"></span>" +
      mapEditorReplacement.from +
      " -> <span class=\"map-color-swatch\" style=\"background:" + mapEditorReplacement.to + "\"></span>" +
      mapEditorReplacement.to;
    mapEditorColorList.appendChild(mapEditorRow);
  });
}

function mapEditorCreateColorButton(mapEditorColor, mapEditorIsSelected) {
  var mapEditorButton = document.createElement("button");

  mapEditorButton.className = "map-color-button" + (mapEditorIsSelected ? " is-selected" : "") + (!mapEditorColor ? " is-none" : "");
  mapEditorButton.type = "button";
  mapEditorButton.title = mapEditorColor || "None";
  mapEditorButton.setAttribute("aria-label", mapEditorColor || "None");

  if (mapEditorColor) {
    mapEditorButton.style.background = mapEditorColor;
  }

  return mapEditorButton;
}

function mapEditorApplyColorReplacement(mapEditorTargetColor) {
  var mapEditorSourceColor = mapEditorState.selectedColorSource;

  if (!mapEditorSourceColor) {
    return;
  }

  mapEditorState.selectedColorReplacements = mapEditorState.selectedColorReplacements.filter(function (mapEditorReplacement) {
    return mapEditorReplacement.from !== mapEditorSourceColor;
  });

  if (mapEditorTargetColor) {
    mapEditorState.selectedColorReplacements.push({
      from: mapEditorSourceColor,
      to: mapEditorTargetColor
    });
  }

  mapEditorState.selectedColorReplacements = mapEditorNormalizeColorReplacements(mapEditorState.selectedColorReplacements);
  mapEditorUpdateColorControls();
  mapEditorDraw();
}

function mapEditorClearColorReplacements() {
  mapEditorState.selectedColorReplacements = [];
  mapEditorUpdateColorControls();
  mapEditorDraw();
}

function mapEditorGetGridPosition(mapEditorCanvas, mapEditorGridSize, mapEditorX, mapEditorY) {
  var mapEditorCellSize = mapEditorCanvas.width / mapEditorGridSize;

  return {
    x: mapEditorX * mapEditorCellSize,
    y: mapEditorY * mapEditorCellSize,
    size: mapEditorCellSize
  };
}

function mapEditorGetRoomPosition(mapEditorCanvas, mapEditorRoomX, mapEditorRoomY) {
  var mapEditorGridSize = (mapEditorState.mainRadius * 2) + 1;
  var mapEditorCellSize = mapEditorCanvas.width / mapEditorGridSize;

  return {
    x: (mapEditorRoomX + mapEditorState.mainRadius) * mapEditorCellSize,
    y: (mapEditorRoomY + mapEditorState.mainRadius) * mapEditorCellSize,
    size: mapEditorCellSize
  };
}

function mapEditorDrawTile(mapEditorTileX, mapEditorTileY) {
  var mapEditorPosition = mapEditorGetGridPosition(mapEditorState.editorCanvas, mapEditorState.roomTileCount, mapEditorTileX, mapEditorTileY);
  var mapEditorTile = mapManagerGetEffectiveTile(mapEditorState.selectedRoom, mapEditorTileX, mapEditorTileY);

  mapEditorState.editorContext.fillStyle = mapEditorGetBaseTileColor(mapEditorTile);
  mapEditorState.editorContext.fillRect(mapEditorPosition.x, mapEditorPosition.y, mapEditorPosition.size, mapEditorPosition.size);

  if (mapEditorState.previewState !== "base") {
    mapEditorDrawTileSprite(mapEditorTile, mapEditorPosition);
  }

  if (mapEditorState.roomTileCount <= 48) {
    mapEditorState.editorContext.strokeStyle = "#d7d3c7";
    mapEditorState.editorContext.lineWidth = 1;
    mapEditorState.editorContext.strokeRect(mapEditorPosition.x, mapEditorPosition.y, mapEditorPosition.size, mapEditorPosition.size);
  }

  if (mapEditorState.isCheckEditMode && !mapEditorIsCheckTile(mapEditorTile) && !mapEditorIsDoorTile(mapEditorTile)) {
    mapEditorState.editorContext.fillStyle = "rgba(0, 0, 0, 0.55)";
    mapEditorState.editorContext.fillRect(mapEditorPosition.x, mapEditorPosition.y, mapEditorPosition.size, mapEditorPosition.size);
  }
}

function mapEditorIsCheckTile(mapEditorTile) {
  return Boolean(mapEditorTile && (
    mapEditorTile.type === "check" ||
    mapEditorTile.type === "shop" ||
    mapEditorTile.type === "enemy" ||
    mapEditorTile.typeOverride === mapEditorShopTileType ||
    mapEditorTile.tileType === mapEditorShopTileType ||
    mapEditorTile.typeOverride === "Enemy" ||
    mapEditorTile.tileType === "Enemy" ||
    mapEditorCheckTileTypes.indexOf(mapEditorTile.typeOverride) !== -1 ||
    mapEditorCheckTileTypes.indexOf(mapEditorTile.tileType) !== -1
  ));
}

function mapEditorIsEnemyCheckTile(mapEditorTile) {
  return Boolean(mapEditorTile && (
    mapEditorTile.type === "enemy" ||
    mapEditorTile.typeOverride === "Enemy" ||
    mapEditorTile.tileType === "Enemy"
  ));
}

function mapEditorIsDoorTile(mapEditorTile) {
  return Boolean(mapEditorTile && (
    mapEditorTile.typeOverride === "Door" ||
    mapEditorTile.tileType === "Door"
  ));
}

function mapEditorGetDoorChannelColor(mapEditorTile) {
  var mapEditorChannel = Math.max(1, Number(mapEditorTile && (mapEditorTile.doorChannel || mapEditorTile.channel)) || 1);

  return mapEditorDoorChannelColors[(mapEditorChannel - 1) % mapEditorDoorChannelColors.length];
}

function mapEditorGetDoorChannelColorReplacements(mapEditorTile) {
  if (!mapEditorIsDoorTile(mapEditorTile)) {
    return [];
  }

  return [{
    from: mapEditorDoorChannelBaseColor,
    to: mapEditorGetDoorChannelColor(mapEditorTile)
  }];
}

function mapEditorIsChestCheckTile(mapEditorTile) {
  return Boolean(mapEditorTile && (
    mapEditorTile.type === "check" &&
    !mapEditorIsDestructableCheckTile(mapEditorTile)
  ));
}

function mapEditorIsShopTile(mapEditorTile) {
  return Boolean(mapEditorTile && (
    mapEditorTile.type === "shop" ||
    mapEditorTile.typeOverride === mapEditorShopTileType ||
    mapEditorTile.tileType === mapEditorShopTileType
  ));
}

function mapEditorGetBaseTileColor(mapEditorTile) {
  if (mapEditorIsShopTile(mapEditorTile)) {
    return "#202020";
  }

  if (mapEditorTile && (mapEditorTile.typeOverride === "DestructableCheck" || mapEditorTile.tileType === "DestructableCheck")) {
    return "#5f5f5f";
  }

  if (mapEditorTile && (mapEditorTile.type === "check" || mapEditorTile.typeOverride === "Chest" || mapEditorTile.tileType === "Chest")) {
    return "#050505";
  }

  if (mapEditorTile && (mapEditorTile.type === "walkable" || mapEditorTile.typeOverride === "Walkable" || mapEditorTile.tileType === "Walkable")) {
    return "#d7d7d7";
  }

  if (mapEditorTile && (mapEditorTile.type === "obstacle" || mapEditorTile.type === "blocker")) {
    return "#5f5f5f";
  }

  if (mapEditorTile) {
    return "#5f5f5f";
  }

  return "#d7d7d7";
}

function mapEditorDrawPreviewImage(mapEditorImage, mapEditorSourceX, mapEditorSourceY, mapEditorSourceWidth, mapEditorSourceHeight, mapEditorTargetX, mapEditorTargetY, mapEditorTargetWidth, mapEditorTargetHeight) {
  var mapEditorReplacementImage = mapEditorGetColorReplacementImage(mapEditorImage, mapEditorSourceX, mapEditorSourceY, mapEditorSourceWidth, mapEditorSourceHeight);

  mapEditorState.editorContext.save();

  if (mapEditorState.previewState === "monochrome") {
    mapEditorState.editorContext.filter = "grayscale(1)";
  }

  mapEditorState.editorContext.drawImage(
    mapEditorReplacementImage,
    0,
    0,
    mapEditorSourceWidth,
    mapEditorSourceHeight,
    mapEditorTargetX,
    mapEditorTargetY,
    mapEditorTargetWidth,
    mapEditorTargetHeight
  );
  mapEditorState.editorContext.restore();
}

function mapEditorGetColorReplacementImage(mapEditorImage, mapEditorSourceX, mapEditorSourceY, mapEditorSourceWidth, mapEditorSourceHeight) {
  var mapEditorCanvas = mapEditorState.colorSampleCanvas;
  var mapEditorContext = mapEditorState.colorSampleContext;
  var mapEditorReplacements = mapEditorCurrentDrawColorReplacements || [];

  mapEditorCanvas.width = mapEditorSourceWidth;
  mapEditorCanvas.height = mapEditorSourceHeight;
  mapEditorContext.clearRect(0, 0, mapEditorSourceWidth, mapEditorSourceHeight);
  mapEditorContext.drawImage(mapEditorImage, mapEditorSourceX, mapEditorSourceY, mapEditorSourceWidth, mapEditorSourceHeight, 0, 0, mapEditorSourceWidth, mapEditorSourceHeight);

  if (mapEditorState.previewState !== "color" || mapEditorReplacements.length === 0) {
    return mapEditorCanvas;
  }

  var mapEditorReplacementMap = {};

  mapEditorReplacements.forEach(function (mapEditorReplacement) {
    mapEditorReplacementMap[mapEditorReplacement.from.toLowerCase()] = mapEditorReplacement.to.toLowerCase();
  });

  var mapEditorImageData = mapEditorContext.getImageData(0, 0, mapEditorSourceWidth, mapEditorSourceHeight);
  var mapEditorIndex = 0;

  while (mapEditorIndex < mapEditorImageData.data.length) {
    var mapEditorHex = mapEditorRgbToHex(
      mapEditorImageData.data[mapEditorIndex],
      mapEditorImageData.data[mapEditorIndex + 1],
      mapEditorImageData.data[mapEditorIndex + 2]
    );
    var mapEditorReplacementColor = mapEditorReplacementMap[mapEditorHex];

    if (mapEditorReplacementColor) {
      mapEditorImageData.data[mapEditorIndex] = parseInt(mapEditorReplacementColor.slice(1, 3), 16);
      mapEditorImageData.data[mapEditorIndex + 1] = parseInt(mapEditorReplacementColor.slice(3, 5), 16);
      mapEditorImageData.data[mapEditorIndex + 2] = parseInt(mapEditorReplacementColor.slice(5, 7), 16);
    }

    mapEditorIndex += 4;
  }

  mapEditorContext.putImageData(mapEditorImageData, 0, 0);
  return mapEditorCanvas;
}

function mapEditorDrawTileSprite(mapEditorTile, mapEditorPosition) {
  if (!mapEditorTile) {
    return;
  }

  if (mapEditorTile.backgroundTile) {
    mapEditorDrawTileSprite(mapEditorTile.backgroundTile, mapEditorPosition);
  }

  mapEditorCurrentDrawColorReplacements = mapEditorNormalizeColorReplacements(mapEditorTile.colorReplacements).concat(mapEditorGetDoorChannelColorReplacements(mapEditorTile));

  if (mapEditorTile.sprite && mapEditorTile.sprite.source === "item") {
    var mapEditorItemImage = mapEditorState.chestImage;

    if (mapEditorTile.sprite.name === "floppydisk") {
      mapEditorItemImage = mapEditorState.floppydiskImage;
    } else if (mapEditorTile.sprite.name === "shop") {
      mapEditorItemImage = mapEditorState.shopImage;
    }

    if (!mapEditorItemImage) {
      mapEditorCurrentDrawColorReplacements = [];
      return;
    }

    mapEditorDrawPreviewImage(
      mapEditorItemImage,
      0,
      0,
      mapEditorItemImage.width,
      mapEditorItemImage.height,
      mapEditorPosition.x,
      mapEditorPosition.y,
      mapEditorPosition.size,
      mapEditorPosition.size
    );
    if (mapEditorIsShopTile(mapEditorTile)) {
      mapEditorDrawShopCostOverlay(mapEditorTile, mapEditorPosition);
    }
    mapEditorCurrentDrawColorReplacements = [];
    return;
  }

  if (mapEditorTile.sprite && mapEditorTile.sprite.source === "enemy") {
    var mapEditorEnemyImage = mapEditorState.enemyImages[mapEditorTile.sprite.name];

    if (!mapEditorEnemyImage) {
      mapEditorCurrentDrawColorReplacements = [];
      return;
    }

    mapEditorDrawPreviewImage(
      mapEditorEnemyImage,
      0,
      0,
      mapEditorEnemyImage.width,
      mapEditorEnemyImage.height,
      mapEditorPosition.x,
      mapEditorPosition.y,
      mapEditorPosition.size,
      mapEditorPosition.size
    );
    mapEditorCurrentDrawColorReplacements = [];
    return;
  }

  if (!mapEditorTile.sprite || mapEditorTile.sprite.source !== "tileset" || !mapEditorState.tilesetImage) {
    mapEditorCurrentDrawColorReplacements = [];
    return;
  }

  mapEditorDrawPreviewImage(
    mapEditorState.tilesetImage,
    mapEditorTile.sprite.x * mapEditorState.tilesetTileSize,
    mapEditorTile.sprite.y * mapEditorState.tilesetTileSize,
    mapEditorState.tilesetTileSize,
    mapEditorState.tilesetTileSize,
    mapEditorPosition.x,
    mapEditorPosition.y,
    mapEditorPosition.size,
    mapEditorPosition.size
  );
  mapEditorCurrentDrawColorReplacements = [];
}

function mapEditorDrawTileset() {
  if (!mapEditorState.tilesetCanvas || !mapEditorState.tilesetImage) {
    return;
  }

  mapEditorState.tilesetContext.clearRect(0, 0, mapEditorState.tilesetCanvas.width, mapEditorState.tilesetCanvas.height);
  mapEditorState.tilesetContext.drawImage(mapEditorState.tilesetImage, 0, 0);
  mapEditorDrawTilesetSelection();
}

function mapEditorDrawTilesetSelection() {
  var mapEditorSelectionX = mapEditorState.selectedTilesetX * mapEditorState.tilesetTileSize;
  var mapEditorSelectionY = mapEditorState.selectedTilesetY * mapEditorState.tilesetTileSize;

  if (mapEditorState.selectedPaletteSource !== "tileset") {
    return;
  }

  mapEditorState.tilesetContext.strokeStyle = "#ffcf7a";
  mapEditorState.tilesetContext.lineWidth = 2;
  mapEditorState.tilesetContext.strokeRect(mapEditorSelectionX + 1, mapEditorSelectionY + 1, mapEditorState.tilesetTileSize - 2, mapEditorState.tilesetTileSize - 2);
}

function mapEditorUpdateItemSelectionButtons() {
  document.querySelector("#map-item-chest").classList.toggle("is-selected", mapEditorState.selectedPaletteSource === "item" && mapEditorState.selectedItemName === "chest");
  document.querySelector("#map-item-floppydisk").classList.toggle("is-selected", mapEditorState.isCheckEditMode);
  document.querySelector("#map-item-enemy").classList.toggle("is-selected", mapEditorState.selectedPaletteSource === "enemy");
  document.querySelector("#map-item-shop").classList.toggle("is-selected", mapEditorState.selectedPaletteSource === "shop");
  document.querySelector("#map-enemy-type").value = mapEditorState.selectedEnemyType;
  document.querySelector("#map-eyedropper").classList.toggle("is-selected", mapEditorState.isEyedropperActive);
}

function mapEditorUpdateSelectedTileTypeControl() {
  var mapEditorTileTypeSelect = document.querySelector("#map-selected-tile-type");

  if (mapEditorState.selectedPaletteSource === "item") {
    mapEditorTileTypeSelect.value = "Chest";
    mapEditorTileTypeSelect.disabled = true;
    mapEditorUpdateVulnerableTypesControl();
    return;
  }

  if (mapEditorState.selectedPaletteSource === "enemy") {
    mapEditorTileTypeSelect.value = "Enemy";
    mapEditorTileTypeSelect.disabled = true;
    mapEditorUpdateVulnerableTypesControl();
    return;
  }

  if (mapEditorState.selectedPaletteSource === "shop") {
    mapEditorTileTypeSelect.value = mapEditorShopTileType;
    mapEditorTileTypeSelect.disabled = true;
    mapEditorUpdateVulnerableTypesControl();
    return;
  }

  mapEditorTileTypeSelect.disabled = false;
  mapEditorTileTypeSelect.value = mapEditorState.selectedPaintTypeOverride || mapEditorGetTilesetTileType(mapEditorState.selectedTilesetX, mapEditorState.selectedTilesetY);
  mapEditorUpdateVulnerableTypesControl();
}

function mapEditorGetSelectedVulnerableTypesFromControl() {
  return mapEditorGetCheckedAttributeValues(document.querySelector("#map-vulnerable-types"));
}

function mapEditorUpdateVulnerableTypesControl() {
  var mapEditorTileType = mapEditorGetSelectedPaintTileType();

  Array.prototype.slice.call(document.querySelectorAll("#map-vulnerable-types label")).forEach(function (mapEditorLabel) {
    var mapEditorInputs = Array.prototype.slice.call(mapEditorLabel.querySelectorAll("input"));

    mapEditorUpdateAttributeRowFromSelectedValue(mapEditorLabel, mapEditorState.selectedVulnerableTypes);
    mapEditorInputs.forEach(function (mapEditorInput) {
      mapEditorInput.disabled = mapEditorTileType !== "DestructableCheck";
    });
  });
}

function mapEditorDrawSelectedRoom() {
  var mapEditorTileY = 0;

  mapEditorState.editorContext.clearRect(0, 0, mapEditorState.editorCanvas.width, mapEditorState.editorCanvas.height);

  if (mapEditorState.selectedRoom.finalRun) {
    mapEditorState.editorContext.fillStyle = "#7f1d1d";
    mapEditorState.editorContext.fillRect(0, 0, mapEditorState.editorCanvas.width, mapEditorState.editorCanvas.height);
    mapEditorState.editorContext.fillStyle = "#f3f0e8";
    mapEditorState.editorContext.font = "bold 28px sans-serif";
    mapEditorState.editorContext.textAlign = "center";
    mapEditorState.editorContext.textBaseline = "middle";
    mapEditorState.editorContext.fillText("Final Run", mapEditorState.editorCanvas.width / 2, mapEditorState.editorCanvas.height / 2);
    return;
  }

  while (mapEditorTileY < mapEditorState.roomTileCount) {
    var mapEditorTileX = 0;

    while (mapEditorTileX < mapEditorState.roomTileCount) {
      mapEditorDrawTile(mapEditorTileX, mapEditorTileY);
      mapEditorTileX += 1;
    }

    mapEditorTileY += 1;
  }

  mapEditorDrawRoomCenterMarkers();
}

function mapEditorDrawRoomCenterMarkers() {
  var mapEditorCenter = mapEditorState.editorCanvas.width / 2;
  var mapEditorInset = 4;
  var mapEditorRadius = 3;

  mapEditorState.editorContext.fillStyle = "#ff3b30";
  mapEditorDrawRoomCenterMarker(mapEditorCenter, mapEditorInset, mapEditorRadius);
  mapEditorDrawRoomCenterMarker(mapEditorCenter, mapEditorState.editorCanvas.height - mapEditorInset, mapEditorRadius);
  mapEditorDrawRoomCenterMarker(mapEditorInset, mapEditorCenter, mapEditorRadius);
  mapEditorDrawRoomCenterMarker(mapEditorState.editorCanvas.width - mapEditorInset, mapEditorCenter, mapEditorRadius);
}

function mapEditorDrawRoomCenterMarker(mapEditorX, mapEditorY, mapEditorRadius) {
  mapEditorState.editorContext.beginPath();
  mapEditorState.editorContext.arc(mapEditorX, mapEditorY, mapEditorRadius, 0, Math.PI * 2);
  mapEditorState.editorContext.fill();
}

function mapEditorDrawRoom(mapEditorRoomX, mapEditorRoomY) {
  var mapEditorPosition = mapEditorGetRoomPosition(mapEditorState.overviewCanvas, mapEditorRoomX, mapEditorRoomY);
  var mapEditorRoom = mapManagerGetRoom(mapEditorRoomX, mapEditorRoomY);

  if (!mapManagerIsRoomInsideMapRadius(mapEditorRoomX, mapEditorRoomY)) {
    mapEditorState.overviewContext.fillStyle = "#8a5a32";
  } else if (mapEditorRoom && mapEditorRoom.finalRun) {
    mapEditorState.overviewContext.fillStyle = "#d93a3a";
  } else if (mapEditorRoomX === 0 && mapEditorRoomY === 0) {
    mapEditorState.overviewContext.fillStyle = "#58b36b";
  } else if (mapEditorRoom) {
    mapEditorState.overviewContext.fillStyle = "#3f7fd8";
  } else {
    mapEditorState.overviewContext.fillStyle = "#f6f4ea";
  }

  mapEditorState.overviewContext.fillRect(mapEditorPosition.x, mapEditorPosition.y, mapEditorPosition.size, mapEditorPosition.size);
  mapEditorState.overviewContext.strokeStyle = mapEditorRoomX === mapEditorState.selectedRoomX && mapEditorRoomY === mapEditorState.selectedRoomY ? "#f3f0e8" : "#22252d";
  mapEditorState.overviewContext.lineWidth = mapEditorRoomX === mapEditorState.selectedRoomX && mapEditorRoomY === mapEditorState.selectedRoomY ? 3 : 1;
  mapEditorState.overviewContext.strokeRect(mapEditorPosition.x, mapEditorPosition.y, mapEditorPosition.size, mapEditorPosition.size);
}

function mapEditorDrawMainMap() {
  var mapEditorRoomY = -mapEditorState.mainRadius;

  mapEditorState.overviewContext.clearRect(0, 0, mapEditorState.overviewCanvas.width, mapEditorState.overviewCanvas.height);

  while (mapEditorRoomY <= mapEditorState.mainRadius) {
    var mapEditorRoomX = -mapEditorState.mainRadius;

    while (mapEditorRoomX <= mapEditorState.mainRadius) {
      mapEditorDrawRoom(mapEditorRoomX, mapEditorRoomY);
      mapEditorRoomX += 1;
    }

    mapEditorRoomY += 1;
  }
}

function mapEditorDraw() {
  if (!mapEditorState.editorCanvas) {
    return;
  }

  mapEditorDrawTileset();
  mapEditorDrawSelectedRoom();
  mapEditorDrawMainMap();
}

function mapEditorGetClickedTile(mapEditorEvent) {
  var mapEditorRect = mapEditorState.editorCanvas.getBoundingClientRect();
  var mapEditorScaleX = mapEditorState.editorCanvas.width / mapEditorRect.width;
  var mapEditorScaleY = mapEditorState.editorCanvas.height / mapEditorRect.height;
  var mapEditorCellSize = mapEditorState.editorCanvas.width / mapEditorState.roomTileCount;
  var mapEditorCanvasX = (mapEditorEvent.clientX - mapEditorRect.left) * mapEditorScaleX;
  var mapEditorCanvasY = (mapEditorEvent.clientY - mapEditorRect.top) * mapEditorScaleY;

  return {
    x: Math.floor(mapEditorCanvasX / mapEditorCellSize),
    y: Math.floor(mapEditorCanvasY / mapEditorCellSize)
  };
}

function mapEditorGetClickedRoom(mapEditorEvent) {
  var mapEditorRect = mapEditorState.overviewCanvas.getBoundingClientRect();
  var mapEditorGridSize = (mapEditorState.mainRadius * 2) + 1;
  var mapEditorScaleX = mapEditorState.overviewCanvas.width / mapEditorRect.width;
  var mapEditorScaleY = mapEditorState.overviewCanvas.height / mapEditorRect.height;
  var mapEditorCellSize = mapEditorState.overviewCanvas.width / mapEditorGridSize;
  var mapEditorCanvasX = (mapEditorEvent.clientX - mapEditorRect.left) * mapEditorScaleX;
  var mapEditorCanvasY = (mapEditorEvent.clientY - mapEditorRect.top) * mapEditorScaleY;

  return {
    x: Math.floor(mapEditorCanvasX / mapEditorCellSize) - mapEditorState.mainRadius,
    y: Math.floor(mapEditorCanvasY / mapEditorCellSize) - mapEditorState.mainRadius
  };
}

function mapEditorGetClickedTilesetTile(mapEditorEvent) {
  var mapEditorRect = mapEditorState.tilesetCanvas.getBoundingClientRect();
  var mapEditorScaleX = mapEditorState.tilesetCanvas.width / mapEditorRect.width;
  var mapEditorScaleY = mapEditorState.tilesetCanvas.height / mapEditorRect.height;
  var mapEditorCanvasX = (mapEditorEvent.clientX - mapEditorRect.left) * mapEditorScaleX;
  var mapEditorCanvasY = (mapEditorEvent.clientY - mapEditorRect.top) * mapEditorScaleY;

  return {
    x: Math.floor(mapEditorCanvasX / mapEditorState.tilesetTileSize),
    y: Math.floor(mapEditorCanvasY / mapEditorState.tilesetTileSize)
  };
}

function mapEditorSelectTilesetTile(mapEditorEvent) {
  var mapEditorTile = mapEditorGetClickedTilesetTile(mapEditorEvent);
  var mapEditorColumns = Math.floor(mapEditorState.tilesetImage.width / mapEditorState.tilesetTileSize);
  var mapEditorRows = Math.floor(mapEditorState.tilesetImage.height / mapEditorState.tilesetTileSize);

  if (mapEditorTile.x < 0 || mapEditorTile.y < 0 || mapEditorTile.x >= mapEditorColumns || mapEditorTile.y >= mapEditorRows) {
    return;
  }

  mapEditorState.selectedTilesetX = mapEditorTile.x;
  mapEditorState.selectedTilesetY = mapEditorTile.y;
  mapEditorState.selectedPaletteSource = "tileset";
  mapEditorState.selectedPaintTypeOverride = null;
  mapEditorState.selectedVulnerableTypes = (mapEditorGetTilesetTileData(mapEditorTile.x, mapEditorTile.y).vulnerable || []).slice();
  mapEditorState.isCheckEditMode = false;
  mapEditorUpdateItemSelectionButtons();
  mapEditorUpdateSelectedTileTypeControl();
  mapEditorUpdateColorControls();
  document.querySelector("#map-editor-status").textContent = "Selected tileset tile " + mapEditorTile.x + "," + mapEditorTile.y + " (" + mapEditorGetTilesetTileType(mapEditorTile.x, mapEditorTile.y) + ", default).";
  mapEditorDraw();
}

function mapEditorSelectItem(mapEditorItemName) {
  mapEditorState.selectedPaletteSource = "item";
  mapEditorState.selectedItemName = mapEditorItemName;
  mapEditorState.selectedPaintTypeOverride = "Chest";
  mapEditorState.isCheckEditMode = false;
  mapEditorUpdateItemSelectionButtons();
  mapEditorUpdateSelectedTileTypeControl();
  mapEditorUpdateColorControls();
  document.querySelector("#map-editor-status").textContent = "Selected item " + mapEditorItemName + ".";
  mapEditorDraw();
}

function mapEditorSelectEnemy() {
  mapEditorState.selectedPaletteSource = "enemy";
  mapEditorState.selectedPaintTypeOverride = "Enemy";
  mapEditorState.isCheckEditMode = false;
  mapEditorUpdateItemSelectionButtons();
  mapEditorUpdateSelectedTileTypeControl();
  mapEditorUpdateColorControls();
  document.querySelector("#map-editor-status").textContent = "Selected enemy " + globalsState.enemyDefinitions[mapEditorState.selectedEnemyType].label + ".";
  mapEditorDraw();
}

function mapEditorSelectShopItem() {
  mapEditorState.selectedPaletteSource = "shop";
  mapEditorState.selectedPaintTypeOverride = mapEditorShopTileType;
  mapEditorState.isCheckEditMode = false;
  mapEditorUpdateItemSelectionButtons();
  mapEditorUpdateSelectedTileTypeControl();
  mapEditorUpdateColorControls();
  document.querySelector("#map-editor-status").textContent = "Selected shop item.";
  mapEditorDraw();
}

function mapEditorDrawShopCostOverlay(mapEditorTile, mapEditorPosition) {
  var mapEditorCost = Number(mapEditorTile.shopCost) || 0;
  var mapEditorText = mapEditorCost + "E";
  var mapEditorPadding = Math.max(2, Math.floor(mapEditorPosition.size / 20));
  var mapEditorFontSize = Math.max(8, Math.floor(mapEditorPosition.size * 0.22));

  mapEditorState.editorContext.save();
  mapEditorState.editorContext.font = "bold " + mapEditorFontSize + "px 'Perfect DOS VGA 437', monospace";
  mapEditorState.editorContext.textAlign = "right";
  mapEditorState.editorContext.textBaseline = "bottom";
  mapEditorState.editorContext.lineJoin = "miter";
  mapEditorState.editorContext.lineWidth = Math.max(2, Math.floor(mapEditorPosition.size / 18));
  mapEditorState.editorContext.strokeStyle = "#050505";
  mapEditorState.editorContext.fillStyle = "#f7f7f1";
  mapEditorState.editorContext.strokeText(mapEditorText, mapEditorPosition.x + mapEditorPosition.size - mapEditorPadding, mapEditorPosition.y + mapEditorPosition.size - mapEditorPadding);
  mapEditorState.editorContext.fillText(mapEditorText, mapEditorPosition.x + mapEditorPosition.size - mapEditorPadding, mapEditorPosition.y + mapEditorPosition.size - mapEditorPadding);
  mapEditorState.editorContext.restore();
}

function mapEditorPopulateEnemyTypeControl() {
  var mapEditorEnemySelect = document.querySelector("#map-enemy-type");

  mapEditorEnemySelect.innerHTML = "";
  Object.keys(globalsState.enemyDefinitions).forEach(function (mapEditorEnemyKey) {
    var mapEditorOption = document.createElement("option");

    mapEditorOption.value = mapEditorEnemyKey;
    mapEditorOption.textContent = globalsState.enemyDefinitions[mapEditorEnemyKey].label;
    mapEditorOption.selected = mapEditorEnemyKey === mapEditorState.selectedEnemyType;
    mapEditorEnemySelect.appendChild(mapEditorOption);
  });
}

function mapEditorToggleEyedropper() {
  mapEditorState.isEyedropperActive = !mapEditorState.isEyedropperActive;
  mapEditorState.isCheckEditMode = false;
  mapEditorUpdateItemSelectionButtons();
  document.querySelector("#map-editor-status").textContent = mapEditorState.isEyedropperActive ? "Eyedropper active." : "Eyedropper inactive.";
  mapEditorDraw();
}

function mapEditorToggleCheckEditMode() {
  mapEditorState.isCheckEditMode = !mapEditorState.isCheckEditMode;
  mapEditorState.isEyedropperActive = false;
  mapEditorUpdateItemSelectionButtons();
  document.querySelector("#map-editor-status").textContent = mapEditorState.isCheckEditMode ? "Check/door edit mode active." : "Check/door edit mode inactive.";
  mapEditorDraw();
}

function mapEditorGetSelectedPaintTileType() {
  if (mapEditorState.selectedPaintTypeOverride) {
    return mapEditorState.selectedPaintTypeOverride;
  }

  if (mapEditorState.selectedPaletteSource === "item") {
    return "Chest";
  }

  if (mapEditorState.selectedPaletteSource === "shop") {
    return mapEditorShopTileType;
  }

  if (mapEditorState.selectedPaletteSource === "enemy") {
    return "Enemy";
  }

  return mapEditorGetTilesetTileType(mapEditorState.selectedTilesetX, mapEditorState.selectedTilesetY);
}

function mapEditorGetTileOverrides(mapEditorCheckKey, mapEditorTileType, mapEditorTileX, mapEditorTileY) {
  if (mapEditorTileType === "Enemy") {
    return {
      tileType: "Enemy",
      typeOverride: "Enemy",
      enemyType: mapEditorState.selectedEnemyType,
      expectedDrop: "itemPool1",
      sprite: {
        source: "enemy",
        name: mapEditorState.selectedEnemyType
      },
      backgroundTile: mapEditorGetDefaultBackgroundTileDefinition(mapEditorTileX, mapEditorTileY)
    };
  }

  if (mapEditorCheckTileTypes.indexOf(mapEditorTileType) !== -1) {
    var mapEditorCheckOverrides = {
      tileType: mapEditorTileType,
      typeOverride: mapEditorTileType
    };

    if (mapEditorState.selectedPaletteSource === "item" && mapEditorTileType === "Chest") {
      mapEditorCheckOverrides.sprite = {
        source: "item",
        name: mapEditorState.selectedItemName
      };
    } else {
      mapEditorCheckOverrides.sprite = {
        source: "tileset",
        x: mapEditorState.selectedTilesetX,
        y: mapEditorState.selectedTilesetY
      };
    }

    if (mapEditorCheckKey) {
      mapEditorCheckOverrides.checkKey = mapEditorCheckKey;
    }

    mapEditorCheckOverrides.expectedDrop = "itemPool1";

    if (mapEditorTileType === "DestructableCheck") {
      mapEditorCheckOverrides.vulnerable = mapEditorState.selectedVulnerableTypes.length > 0 ? mapEditorState.selectedVulnerableTypes.slice() : ["tankTreads", "tankCannon"];
    }

    mapEditorCheckOverrides.backgroundTile = mapEditorGetDefaultBackgroundTileDefinition(mapEditorTileX, mapEditorTileY);

    if (mapEditorState.selectedColorReplacements.length > 0) {
      mapEditorCheckOverrides.colorReplacements = mapEditorNormalizeColorReplacements(mapEditorState.selectedColorReplacements);
    }

    return mapEditorCheckOverrides;
  }

  if (mapEditorTileType === mapEditorShopTileType) {
    return {
      tileType: mapEditorShopTileType,
      typeOverride: mapEditorShopTileType,
      shopDrop: mapEditorState.selectedShopDrop || "itemPool1",
      shopCost: 10,
      sprite: {
        source: "item",
        name: "shop"
      },
      backgroundTile: mapEditorGetDefaultBackgroundTileDefinition(mapEditorTileX, mapEditorTileY)
    };
  }

  var mapEditorOverrides = {
    tileType: mapEditorTileType,
    typeOverride: mapEditorTileType,
    sprite: {
      source: "tileset",
      x: mapEditorState.selectedTilesetX,
      y: mapEditorState.selectedTilesetY
    }
  };

  if (mapEditorState.selectedColorReplacements.length > 0) {
    mapEditorOverrides.colorReplacements = mapEditorNormalizeColorReplacements(mapEditorState.selectedColorReplacements);
  }

  return mapEditorOverrides;
}

function mapEditorGetDefaultBackgroundTileDefinition(mapEditorTileX, mapEditorTileY) {
  var mapEditorDefaultTile = mapManagerGetDefaultTile(mapEditorState.selectedRoom, mapEditorTileX, mapEditorTileY);
  var mapEditorBackgroundTile = {
    type: mapEditorDefaultTile.type,
    tileType: mapEditorDefaultTile.tileType,
    typeOverride: mapEditorDefaultTile.typeOverride
  };

  if (mapEditorDefaultTile.sprite) {
    mapEditorBackgroundTile.sprite = mapEditorDefaultTile.sprite;
  }

  if (mapEditorDefaultTile.colorReplacements) {
    mapEditorBackgroundTile.colorReplacements = mapEditorDefaultTile.colorReplacements;
  }

  return mapEditorBackgroundTile;
}

function mapEditorGetSelectedTilesetTileDefinition() {
  var mapEditorTileType = mapEditorGetTilesetTileType(mapEditorState.selectedTilesetX, mapEditorState.selectedTilesetY);

  var mapEditorTileDefinition = {
    type: mapEditorGetGameplayType(mapEditorTileType),
    tileType: mapEditorTileType,
    typeOverride: mapEditorTileType,
    sprite: {
      source: "tileset",
      x: mapEditorState.selectedTilesetX,
      y: mapEditorState.selectedTilesetY
    }
  };

  if (mapEditorState.selectedColorReplacements.length > 0) {
    mapEditorTileDefinition.colorReplacements = mapEditorNormalizeColorReplacements(mapEditorState.selectedColorReplacements);
  }

  if (mapEditorTileType === "DestructableCheck") {
    mapEditorTileDefinition.vulnerable = mapEditorState.selectedVulnerableTypes.length > 0 ? mapEditorState.selectedVulnerableTypes.slice() : ["tankTreads", "tankCannon"];

    if (mapEditorState.selectedCheckKey) {
      mapEditorTileDefinition.checkKey = mapEditorState.selectedCheckKey;
    }
  }

  return mapEditorTileDefinition;
}

function mapEditorSetSelectedRoomDefault(mapEditorDefaultKey) {
  var mapEditorStatus = document.querySelector("#map-editor-status");

  if (mapEditorState.selectedRoom.finalRun) {
    mapEditorStatus.textContent = "Final run rooms do not use room defaults.";
    return;
  }

  if (mapEditorState.selectedPaletteSource !== "tileset") {
    mapEditorStatus.textContent = "Select a tileset tile before setting room defaults.";
    return;
  }

  mapEditorState.selectedRoom[mapEditorDefaultKey] = mapEditorGetSelectedTilesetTileDefinition();
  mapEditorStatus.textContent = "Set " + mapEditorDefaultKey + " for room " + mapEditorState.selectedRoom.id + ".";
  mapEditorDraw();
}

function mapEditorPlaceTile(mapEditorEvent) {
  var mapEditorTile = mapEditorGetClickedTile(mapEditorEvent);
  var mapEditorStatus = document.querySelector("#map-editor-status");
  var mapEditorTileKey = mapManagerGetCoordinateKey(mapEditorTile.x, mapEditorTile.y);

  if (mapEditorTileKey === mapEditorState.lastPaintedTileKey) {
    return;
  }

  if (mapEditorState.selectedRoom.finalRun) {
    mapEditorStatus.textContent = "Final run rooms do not use placed tiles.";
    mapEditorState.lastPaintedTileKey = mapEditorTileKey;
    return;
  }

  if (mapEditorState.isEyedropperActive) {
    mapEditorSampleTileBrush(mapEditorTile.x, mapEditorTile.y);
    mapEditorState.lastPaintedTileKey = mapEditorTileKey;
    return;
  }

  if (mapEditorState.isCheckEditMode) {
    mapEditorEditCheckTile(mapEditorTile.x, mapEditorTile.y);
    mapEditorState.lastPaintedTileKey = mapEditorTileKey;
    return;
  }

  mapEditorPlaceSelectedBrushAt(mapEditorTile.x, mapEditorTile.y);
  mapEditorState.lastPaintedTileKey = mapEditorTileKey;
  mapEditorStatus.textContent = "Edited tile " + mapEditorTileKey + " in room " + mapEditorState.selectedRoom.id + " (" + (mapEditorState.selectedPaintTypeOverride ? "override active" : "default") + ").";
  mapEditorDraw();
}

function mapEditorPlaceSelectedBrushAt(mapEditorStartTileX, mapEditorStartTileY) {
  var mapEditorTileType = mapEditorGetSelectedPaintTileType();
  var mapEditorGameplayType = mapEditorGetGameplayType(mapEditorTileType);
  var mapEditorCheckKey = mapEditorCheckTileTypes.indexOf(mapEditorTileType) !== -1 ? mapEditorState.selectedCheckKey : "";

  if (mapEditorStartTileX < 0 || mapEditorStartTileY < 0 || mapEditorStartTileX >= mapEditorState.roomTileCount || mapEditorStartTileY >= mapEditorState.roomTileCount) {
    return;
  }

  mapManagerSetTile(
    mapEditorState.selectedRoom,
    mapEditorStartTileX,
    mapEditorStartTileY,
    mapEditorGameplayType,
    mapEditorGetTileOverrides(mapEditorCheckKey, mapEditorTileType, mapEditorStartTileX, mapEditorStartTileY)
  );
}

function mapEditorSampleTileBrush(mapEditorTileX, mapEditorTileY) {
  var mapEditorTile = mapManagerGetEffectiveTile(mapEditorState.selectedRoom, mapEditorTileX, mapEditorTileY);

  if (!mapEditorTile || !mapEditorTile.sprite) {
    return;
  }

  if (mapEditorTile.sprite.source === "item") {
    if (mapEditorIsShopTile(mapEditorTile)) {
      mapEditorState.selectedPaletteSource = "shop";
      mapEditorState.selectedShopDrop = mapEditorTile.shopDrop || "itemPool1";
    } else {
      mapEditorState.selectedPaletteSource = "item";
      mapEditorState.selectedItemName = mapEditorTile.sprite.name === "floppydisk" || mapEditorTile.sprite.name === "shop" ? "chest" : mapEditorTile.sprite.name || "chest";
    }
  } else if (mapEditorTile.sprite.source === "enemy") {
    mapEditorState.selectedPaletteSource = "enemy";
    mapEditorState.selectedEnemyType = mapEditorTile.sprite.name || mapEditorTile.enemyType || "blob";
  } else if (mapEditorTile.sprite.source === "tileset") {
    mapEditorState.selectedPaletteSource = "tileset";
    mapEditorState.selectedTilesetX = mapEditorTile.sprite.x;
    mapEditorState.selectedTilesetY = mapEditorTile.sprite.y;
  }

  mapEditorState.selectedPaintTypeOverride = mapEditorTile.typeOverride || mapEditorTile.tileType || null;
  mapEditorState.selectedCheckKey = mapEditorTile.checkKey || "";
  mapEditorState.selectedVulnerableTypes = (mapEditorTile.vulnerable || []).slice();
  mapEditorState.selectedColorReplacements = mapEditorNormalizeColorReplacements(mapEditorTile.colorReplacements);
  mapEditorState.isCheckEditMode = false;
  mapEditorUpdateItemSelectionButtons();
  mapEditorUpdateSelectedTileTypeControl();
  mapEditorUpdateColorControls();
  document.querySelector("#map-editor-status").textContent = "Sampled tile " + mapManagerGetCoordinateKey(mapEditorTileX, mapEditorTileY) + ".";
  mapEditorDraw();
}

function mapEditorEditCheckTile(mapEditorTileX, mapEditorTileY) {
  var mapEditorEffectiveTile = mapManagerGetEffectiveTile(mapEditorState.selectedRoom, mapEditorTileX, mapEditorTileY);
  var mapEditorExplicitTile = mapManagerGetTile(mapEditorState.selectedRoom, mapEditorTileX, mapEditorTileY);
  var mapEditorTileKey = mapManagerGetCoordinateKey(mapEditorTileX, mapEditorTileY);

  if (!mapEditorIsCheckTile(mapEditorEffectiveTile) && !mapEditorIsDoorTile(mapEditorEffectiveTile)) {
    document.querySelector("#map-editor-status").textContent = "Only checks and doors can be edited in check edit mode.";
    return;
  }

  if (!mapEditorExplicitTile) {
    mapManagerSetTile(mapEditorState.selectedRoom, mapEditorTileX, mapEditorTileY, mapEditorEffectiveTile.type, mapEditorCopyCheckEditableTile(mapEditorEffectiveTile));
    mapEditorExplicitTile = mapManagerGetTile(mapEditorState.selectedRoom, mapEditorTileX, mapEditorTileY);
  }

  if (mapEditorIsDoorTile(mapEditorExplicitTile)) {
    mapEditorOpenDoorEditor(mapEditorExplicitTile, function () {
      document.querySelector("#map-editor-status").textContent = "Edited door " + mapEditorTileKey + ".";
      mapEditorDraw();
    });
    return;
  }

  mapEditorOpenCheckEditor(mapEditorExplicitTile, function () {
    mapEditorState.selectedCheckKey = mapEditorExplicitTile.checkKey || "";
    mapEditorState.selectedVulnerableTypes = (mapEditorExplicitTile.vulnerable || []).slice();
    mapEditorUpdateVulnerableTypesControl();
    document.querySelector("#map-editor-status").textContent = "Edited check " + mapEditorTileKey + ".";
    mapEditorDraw();
  });
}

function mapEditorCopyCheckEditableTile(mapEditorTile) {
  var mapEditorCopy = {
    tileType: mapEditorTile.tileType,
    typeOverride: mapEditorTile.typeOverride
  };

  ["checkKey", "expectedDrop", "shopDrop", "shopCost", "sprite", "colorReplacements", "backgroundTile", "vulnerable", "requirements", "enemyType", "isShopkeep", "removeShopItemsOnDeath", "doorChannel"].forEach(function (mapEditorKey) {
    if (mapEditorTile[mapEditorKey]) {
      mapEditorCopy[mapEditorKey] = JSON.parse(JSON.stringify(mapEditorTile[mapEditorKey]));
    }
  });

  return mapEditorCopy;
}

function mapEditorOpenDoorEditor(mapEditorTile, mapEditorOnSave) {
  var mapEditorBackdrop = document.createElement("div");
  var mapEditorModal = document.createElement("form");
  var mapEditorChannelInput = mapEditorCreateNumberField("Channel", mapEditorTile.doorChannel || 1, 1, 9999);

  mapEditorBackdrop.className = "map-check-modal-backdrop";
  mapEditorModal.className = "map-check-modal";
  mapEditorModal.innerHTML = "<h2>Edit Door</h2>";
  mapEditorModal.appendChild(mapEditorChannelInput.wrapper);
  mapEditorModal.appendChild(mapEditorCreateCheckEditorActions(mapEditorBackdrop));
  mapEditorBackdrop.appendChild(mapEditorModal);
  document.body.appendChild(mapEditorBackdrop);

  mapEditorModal.addEventListener("submit", function (mapEditorEvent) {
    mapEditorEvent.preventDefault();
    mapEditorTile.doorChannel = Math.max(1, Number(mapEditorChannelInput.input.value) || 1);
    document.body.removeChild(mapEditorBackdrop);
    mapEditorOnSave();
  });

  mapEditorBackdrop.addEventListener("click", function (mapEditorEvent) {
    if (mapEditorEvent.target === mapEditorBackdrop) {
      document.body.removeChild(mapEditorBackdrop);
    }
  });

  mapEditorChannelInput.input.focus();
}

function mapEditorOpenCheckEditor(mapEditorTile, mapEditorOnSave) {
  var mapEditorBackdrop = document.createElement("div");
  var mapEditorModal = document.createElement("form");
  var mapEditorExpectedDrop = mapEditorTile.expectedDrop || "itemPool1";
  var mapEditorIsShopItem = mapEditorIsShopTile(mapEditorTile);
  var mapEditorExpectedSelect = mapEditorCreateCheckSelect("Expected Drop", mapEditorGetExpectedDropOptions(mapEditorExpectedDrop), mapEditorNormalizeExpectedDropForSelect(mapEditorExpectedDrop), false);
  var mapEditorShopDropSelect = mapEditorCreateCheckSelect("Shop Item", mapEditorGetShopDropOptions(), mapEditorTile.shopDrop || "itemPool1", false);
  var mapEditorShopCostInput = mapEditorCreateNumberField("Energy Cost", mapEditorTile.shopCost || 10, 0, 999);
  var mapEditorVulnerableList = mapEditorCreateCheckAttributeList("Vulnerable", mapEditorTile.vulnerable || [], mapEditorGetVulnerableAttributeOptions());
  var mapEditorIsDestructableCheck = mapEditorIsDestructableCheckTile(mapEditorTile);
  var mapEditorEditableRequirements = mapEditorTile.requirements || [];
  var mapEditorRequirementList = null;
  var mapEditorIsEnemyCheck = mapEditorIsEnemyCheckTile(mapEditorTile);
  var mapEditorShopkeepToggle = mapEditorCreateBooleanField("Is shopkeep", Boolean(mapEditorTile.isShopkeep));
  var mapEditorRemoveShopItemsToggle = mapEditorCreateBooleanField("Remove items on death", Boolean(mapEditorTile.removeShopItemsOnDeath));

  if (mapEditorIsDestructableCheck) {
    mapEditorEditableRequirements = mapEditorRemoveVulnerableRequirementGroups(mapEditorEditableRequirements);
  }
  if (mapEditorIsEnemyCheck) {
    mapEditorEditableRequirements = mapEditorRemoveEnemyDamageRequirementGroups(mapEditorEditableRequirements);
  }
  mapEditorRequirementList = mapEditorCreateCheckRequirementGroups(mapEditorEditableRequirements);

  mapEditorBackdrop.className = "map-check-modal-backdrop";
  mapEditorModal.className = "map-check-modal";
  mapEditorModal.innerHTML = "<h2>Edit Check</h2>";
  if (mapEditorIsShopItem) {
    mapEditorModal.appendChild(mapEditorShopDropSelect.wrapper);
    mapEditorModal.appendChild(mapEditorShopCostInput.wrapper);
  } else {
    mapEditorModal.appendChild(mapEditorExpectedSelect.wrapper);
  }
  if (!mapEditorIsEnemyCheck && !mapEditorIsShopItem) {
    mapEditorModal.appendChild(mapEditorVulnerableList.wrapper);
  }
  if (mapEditorIsEnemyCheck) {
    mapEditorModal.appendChild(mapEditorShopkeepToggle.wrapper);
    mapEditorModal.appendChild(mapEditorRemoveShopItemsToggle.wrapper);
  }
  mapEditorModal.appendChild(mapEditorRequirementList.wrapper);
  if (mapEditorIsDestructableCheck) {
    mapEditorSyncVulnerableRequirementRow(mapEditorRequirementList.wrapper, mapEditorGetCheckedAttributeValues(mapEditorVulnerableList.wrapper));
    mapEditorVulnerableList.wrapper.addEventListener("change", function () {
      mapEditorSyncVulnerableRequirementRow(mapEditorRequirementList.wrapper, mapEditorGetCheckedAttributeValues(mapEditorVulnerableList.wrapper));
    });
  }
  if (mapEditorIsEnemyCheck) {
    mapEditorSyncEnemyDamageRequirementRow(mapEditorRequirementList.wrapper);
  }
  mapEditorModal.appendChild(mapEditorCreateCheckEditorActions(mapEditorBackdrop));
  mapEditorBackdrop.appendChild(mapEditorModal);
  document.body.appendChild(mapEditorBackdrop);

  mapEditorModal.addEventListener("submit", function (mapEditorEvent) {
    mapEditorEvent.preventDefault();
    mapEditorSaveCheckEditor(mapEditorTile, {
      expectedDrop: mapEditorExpectedSelect.select.value,
      shopDrop: mapEditorShopDropSelect.select.value,
      shopCost: Number(mapEditorShopCostInput.input.value) || 0,
      vulnerable: mapEditorIsEnemyCheck || mapEditorIsShopItem ? [] : mapEditorGetCheckedAttributeValues(mapEditorVulnerableList.wrapper),
      requirements: mapEditorGetRequirementGroups(mapEditorRequirementList.wrapper),
      isShopkeep: mapEditorShopkeepToggle.input.checked,
      removeShopItemsOnDeath: mapEditorRemoveShopItemsToggle.input.checked
    });
    document.body.removeChild(mapEditorBackdrop);
    mapEditorOnSave();
  });

  mapEditorBackdrop.addEventListener("click", function (mapEditorEvent) {
    if (mapEditorEvent.target === mapEditorBackdrop) {
      document.body.removeChild(mapEditorBackdrop);
    }
  });

  mapEditorExpectedSelect.select.focus();
}

function mapEditorIsDestructableCheckTile(mapEditorTile) {
  return Boolean(mapEditorTile && (
    mapEditorTile.typeOverride === "DestructableCheck" ||
    mapEditorTile.tileType === "DestructableCheck"
  ));
}

function mapEditorGetExpectedDropOptions(mapEditorSelectedDrop) {
  var mapEditorSelectedProgressiveMatch = String(mapEditorSelectedDrop || "").match(/^([a-zA-Z]+)\d+$/);
  var mapEditorUsedDrops = mapEditorGetUsedExpectedDrops();
  var mapEditorNormalizedSelectedDrop = mapEditorSelectedProgressiveMatch && globalsState.progressiveCheckDefinitions[mapEditorSelectedProgressiveMatch[1]] ? mapEditorSelectedProgressiveMatch[1] : mapEditorSelectedDrop;
  var mapEditorOptions = mapEditorGetCollapsedCheckOptions().map(function (mapEditorOption) {
    return {
      key: mapEditorOption.key,
      label: mapEditorOption.label,
      disabled: mapEditorOption.key !== "itemPool" &&
        !mapEditorIsItemPoolCheckKey(mapEditorOption.key) &&
        !mapEditorIsProgressiveBaseCheckKey(mapEditorOption.key) &&
        mapEditorOption.key !== "empty" &&
        mapEditorOption.key !== mapEditorNormalizedSelectedDrop &&
        mapEditorUsedDrops.indexOf(mapEditorOption.key) !== -1
    };
  });

  return mapEditorOptions;
}

function mapEditorGetShopDropOptions() {
  return mapEditorGetCollapsedCheckOptions().concat([
    { key: "healthPickup", label: "Health Potion" },
    { key: "roundsPickup", label: "Round Pouch" }
  ]);
}

function mapEditorNormalizeExpectedDropForSelect(mapEditorSelectedDrop) {
  var mapEditorSelectedProgressiveMatch = String(mapEditorSelectedDrop || "").match(/^([a-zA-Z]+)\d+$/);

  return mapEditorSelectedProgressiveMatch && globalsState.progressiveCheckDefinitions[mapEditorSelectedProgressiveMatch[1]] ? mapEditorSelectedProgressiveMatch[1] : mapEditorSelectedDrop;
}

function mapEditorGetCollapsedCheckOptions() {
  var mapEditorSeenProgressives = {};
  var mapEditorOptions = [];

  progressionManagerGetCheckOptions().forEach(function (mapEditorOption) {
    var mapEditorProgressiveMatch = mapEditorOption.key.match(/^([a-zA-Z]+)\d+$/);
    var mapEditorDefinition = globalsState.checkDefinitions[mapEditorOption.key];

    if (mapEditorDefinition && mapEditorDefinition.hiddenFromPools) {
      return;
    }

    if (mapEditorProgressiveMatch && globalsState.progressiveCheckDefinitions[mapEditorProgressiveMatch[1]]) {
      if (!mapEditorSeenProgressives[mapEditorProgressiveMatch[1]]) {
        mapEditorSeenProgressives[mapEditorProgressiveMatch[1]] = true;
        mapEditorOptions.push({
          key: mapEditorProgressiveMatch[1],
          label: globalsState.progressiveCheckDefinitions[mapEditorProgressiveMatch[1]].label
        });
      }
      return;
    }

    mapEditorOptions.push(mapEditorOption);
  });

  return mapEditorOptions;
}

function mapEditorGetUsedExpectedDrops() {
  var mapEditorUsedDrops = [];

  mapManagerData.rooms.forEach(function (mapEditorRoom) {
    (mapEditorRoom.tiles || []).forEach(function (mapEditorTile) {
      if (mapEditorTile.expectedDrop && mapEditorTile.expectedDrop !== "empty" && !mapEditorIsItemPoolCheckKey(mapEditorTile.expectedDrop) && mapEditorUsedDrops.indexOf(mapEditorTile.expectedDrop) === -1) {
        mapEditorUsedDrops.push(mapEditorTile.expectedDrop);
      }
    });
  });

  return mapEditorUsedDrops;
}

function mapEditorIsItemPoolCheckKey(mapEditorCheckKey) {
  return /^itemPool\d*$/.test(String(mapEditorCheckKey || ""));
}

function mapEditorIsProgressiveBaseCheckKey(mapEditorCheckKey) {
  return Boolean(globalsState.progressiveCheckDefinitions[mapEditorCheckKey]);
}

function mapEditorCreateCheckSelect(mapEditorLabel, mapEditorOptions, mapEditorValue, mapEditorAllowNone) {
  var mapEditorWrapper = document.createElement("label");
  var mapEditorText = document.createElement("span");
  var mapEditorSelect = document.createElement("select");

  mapEditorWrapper.className = "map-check-modal-field";
  mapEditorText.textContent = mapEditorLabel;
  mapEditorWrapper.appendChild(mapEditorText);

  if (mapEditorAllowNone) {
    mapEditorSelect.appendChild(mapEditorCreateSelectOption("", "None", mapEditorValue));
  }

  mapEditorOptions.forEach(function (mapEditorOption) {
    mapEditorSelect.appendChild(mapEditorCreateSelectOption(mapEditorOption.key, mapEditorOption.label, mapEditorValue, mapEditorOption.disabled));
  });

  mapEditorWrapper.appendChild(mapEditorSelect);

  return {
    wrapper: mapEditorWrapper,
    select: mapEditorSelect
  };
}

function mapEditorCreateNumberField(mapEditorLabel, mapEditorValue, mapEditorMin, mapEditorMax) {
  var mapEditorWrapper = document.createElement("label");
  var mapEditorText = document.createElement("span");
  var mapEditorInput = document.createElement("input");

  mapEditorWrapper.className = "map-check-modal-field";
  mapEditorText.textContent = mapEditorLabel;
  mapEditorInput.type = "number";
  mapEditorInput.min = String(mapEditorMin);
  mapEditorInput.max = String(mapEditorMax);
  mapEditorInput.step = "1";
  mapEditorInput.value = String(mapEditorValue);
  mapEditorWrapper.appendChild(mapEditorText);
  mapEditorWrapper.appendChild(mapEditorInput);

  return {
    wrapper: mapEditorWrapper,
    input: mapEditorInput
  };
}

function mapEditorCreateBooleanField(mapEditorLabel, mapEditorValue) {
  var mapEditorWrapper = document.createElement("label");
  var mapEditorInput = document.createElement("input");
  var mapEditorText = document.createElement("span");

  mapEditorWrapper.className = "map-check-modal-field map-checkbox-field";
  mapEditorInput.type = "checkbox";
  mapEditorInput.checked = Boolean(mapEditorValue);
  mapEditorText.textContent = mapEditorLabel;
  mapEditorWrapper.appendChild(mapEditorInput);
  mapEditorWrapper.appendChild(mapEditorText);

  return {
    wrapper: mapEditorWrapper,
    input: mapEditorInput
  };
}

function mapEditorOpenRoomRequirementsEditor() {
  var mapEditorBackdrop = document.createElement("div");
  var mapEditorModal = document.createElement("form");
  var mapEditorRequirementList = mapEditorCreateCheckRequirementGroups(mapEditorState.selectedRoom.requirements || []);

  mapEditorBackdrop.className = "map-check-modal-backdrop";
  mapEditorModal.className = "map-check-modal";
  mapEditorModal.innerHTML = "<h2>Room Requirements</h2>";
  mapEditorModal.appendChild(mapEditorRequirementList.wrapper);
  mapEditorModal.appendChild(mapEditorCreateCheckEditorActions(mapEditorBackdrop));
  mapEditorBackdrop.appendChild(mapEditorModal);
  document.body.appendChild(mapEditorBackdrop);

  mapEditorModal.addEventListener("submit", function (mapEditorEvent) {
    var mapEditorRequirements = [];

    mapEditorEvent.preventDefault();
    mapEditorRequirements = mapEditorGetRequirementGroups(mapEditorRequirementList.wrapper);

    if (mapEditorRequirements.length > 0) {
      mapEditorState.selectedRoom.requirements = mapEditorRequirements;
    } else {
      delete mapEditorState.selectedRoom.requirements;
    }

    document.body.removeChild(mapEditorBackdrop);
    mapEditorUpdateRoomRequirementsSummary();
    document.querySelector("#map-editor-status").textContent = "Edited room requirements for " + mapManagerGetCoordinateKey(mapEditorState.selectedRoomX, mapEditorState.selectedRoomY) + ".";
    mapEditorDraw();
  });

  mapEditorBackdrop.addEventListener("click", function (mapEditorEvent) {
    if (mapEditorEvent.target === mapEditorBackdrop) {
      document.body.removeChild(mapEditorBackdrop);
    }
  });
}

function mapEditorUpdateRoomRequirementsSummary() {
  var mapEditorSummary = document.querySelector("#map-room-requirements-summary");
  var mapEditorRequirementText = "";

  if (!mapEditorSummary || !mapEditorState.selectedRoom) {
    return;
  }

  mapEditorRequirementText = mapEditorFormatRequirementGroupsSummary(mapEditorState.selectedRoom.requirements || []);
  mapEditorSummary.textContent = "Room requirements: " + (mapEditorRequirementText || "none");
}

function mapEditorFormatRequirementGroupsSummary(mapEditorRequirements) {
  var mapEditorGroups = mapEditorNormalizeRequirementGroups(mapEditorRequirements);

  if (mapEditorGroups.length === 0) {
    return "";
  }

  return mapEditorGroups.map(function (mapEditorGroup) {
    return mapEditorGroup.map(mapEditorFormatRequirementLabel).join(" or ");
  }).join("; ");
}

function mapEditorFormatRequirementLabel(mapEditorRequirement) {
  var mapEditorBaseKey = mapEditorGetRequirementBaseKey(mapEditorRequirement);
  var mapEditorProgressiveBase = progressionManagerGetProgressiveCheckBase(mapEditorRequirement);
  var mapEditorLevel = String(mapEditorRequirement || "").split(":")[1];
  var mapEditorDefinition = globalsState.progressiveCheckDefinitions[mapEditorProgressiveBase || mapEditorBaseKey] || globalsState.checkDefinitions[mapEditorBaseKey];
  var mapEditorLabel = mapEditorBaseKey === "tank" ? "Tank" : (mapEditorDefinition ? mapEditorDefinition.label : mapEditorBaseKey);

  if (mapEditorProgressiveBase && String(mapEditorRequirement || "").indexOf(":") === -1) {
    return mapEditorDefinition.label + " " + String(mapEditorRequirement).replace(mapEditorProgressiveBase, "");
  }

  if (globalsState.progressiveCheckDefinitions[mapEditorBaseKey]) {
    return mapEditorLabel + " " + (Number(mapEditorLevel) || 1);
  }

  return mapEditorLabel;
}

function mapEditorCreateSelectOption(mapEditorValue, mapEditorLabel, mapEditorSelectedValue, mapEditorDisabled) {
  var mapEditorOption = document.createElement("option");

  mapEditorOption.value = mapEditorValue;
  mapEditorOption.textContent = mapEditorLabel;
  mapEditorOption.selected = mapEditorValue === mapEditorSelectedValue;
  mapEditorOption.disabled = Boolean(mapEditorDisabled);

  return mapEditorOption;
}

function mapEditorCreateCheckAttributeList(mapEditorLegendText, mapEditorSelectedValues, mapEditorOptions) {
  var mapEditorFieldset = document.createElement("fieldset");
  var mapEditorLegend = document.createElement("legend");

  mapEditorFieldset.className = "map-check-attribute-list";
  mapEditorLegend.textContent = mapEditorLegendText;
  mapEditorFieldset.appendChild(mapEditorLegend);

  (mapEditorOptions || mapEditorGetCheckAttributeOptions()).forEach(function (mapEditorOption) {
    mapEditorFieldset.appendChild(mapEditorCreateCheckAttributeRow(mapEditorOption, mapEditorSelectedValues));
  });

  return {
    wrapper: mapEditorFieldset
  };
}

function mapEditorNormalizeRequirementGroups(mapEditorRequirements) {
  if (!Array.isArray(mapEditorRequirements)) {
    return [];
  }

  return mapEditorRequirements.map(function (mapEditorRequirement) {
    if (Array.isArray(mapEditorRequirement)) {
      return mapEditorRequirement.filter(Boolean);
    }

    return mapEditorRequirement ? [mapEditorRequirement] : [];
  }).filter(function (mapEditorRequirementGroup) {
    return mapEditorRequirementGroup.length > 0;
  });
}

function mapEditorRemoveVulnerableRequirementGroups(mapEditorRequirements) {
  return mapEditorNormalizeRequirementGroups(mapEditorRequirements).filter(function (mapEditorRequirementGroup) {
    return !mapEditorIsVulnerableRequirementGroup(mapEditorRequirementGroup);
  });
}

function mapEditorIsVulnerableRequirementGroup(mapEditorRequirementGroup) {
  return mapEditorRequirementGroup.length > 0 && mapEditorRequirementGroup.every(function (mapEditorRequirement) {
    return mapEditorVulnerableAttributeOptions.indexOf(mapEditorGetRequirementBaseKey(mapEditorRequirement)) !== -1;
  });
}

function mapEditorRemoveEnemyDamageRequirementGroups(mapEditorRequirements) {
  return mapEditorNormalizeRequirementGroups(mapEditorRequirements).filter(function (mapEditorRequirementGroup) {
    return !mapEditorIsEnemyDamageRequirementGroup(mapEditorRequirementGroup);
  });
}

function mapEditorIsEnemyDamageRequirementGroup(mapEditorRequirementGroup) {
  var mapEditorNormalizedGroup = mapEditorRequirementGroup.map(function (mapEditorRequirement) {
    return mapEditorNormalizeRequirementValue(mapEditorRequirement);
  }).sort();
  var mapEditorNormalizedDamageRequirements = mapEditorEnemyDamageRequirementValues.map(function (mapEditorRequirement) {
    return mapEditorNormalizeRequirementValue(mapEditorRequirement);
  }).sort();

  return mapEditorNormalizedGroup.length === mapEditorNormalizedDamageRequirements.length &&
    mapEditorNormalizedGroup.every(function (mapEditorRequirement, mapEditorIndex) {
      return mapEditorRequirement === mapEditorNormalizedDamageRequirements[mapEditorIndex];
    });
}

function mapEditorNormalizeRequirementValue(mapEditorRequirement) {
  var mapEditorBaseKey = mapEditorGetRequirementBaseKey(mapEditorRequirement);

  if (globalsState.progressiveCheckDefinitions[mapEditorBaseKey]) {
    return mapEditorBaseKey + ":" + Math.max(1, Number(String(mapEditorRequirement || "").split(":")[1]) || 1);
  }

  return mapEditorBaseKey;
}

function mapEditorGetRequirementBaseKey(mapEditorRequirement) {
  return String(mapEditorRequirement || "").split(":")[0];
}

function mapEditorCreateCheckRequirementGroups(mapEditorRequirements) {
  var mapEditorFieldset = document.createElement("fieldset");
  var mapEditorLegend = document.createElement("legend");
  var mapEditorRows = document.createElement("div");
  var mapEditorAddButton = document.createElement("button");
  var mapEditorGroups = mapEditorNormalizeRequirementGroups(mapEditorRequirements);

  mapEditorFieldset.className = "map-check-requirement-groups";
  mapEditorLegend.textContent = "Requirements";
  mapEditorRows.className = "map-check-requirement-rows";
  mapEditorFieldset.appendChild(mapEditorLegend);
  mapEditorFieldset.appendChild(mapEditorRows);

  if (mapEditorGroups.length === 0) {
    mapEditorGroups.push([]);
  }

  mapEditorGroups.forEach(function (mapEditorGroup) {
    mapEditorRows.appendChild(mapEditorCreateCheckRequirementGroupRow(mapEditorGroup));
  });

  mapEditorAddButton.className = "secondary-button map-check-add-row";
  mapEditorAddButton.type = "button";
  mapEditorAddButton.textContent = "Add requirement row";
  mapEditorAddButton.addEventListener("click", function () {
    mapEditorRows.appendChild(mapEditorCreateCheckRequirementGroupRow([]));
  });
  mapEditorFieldset.appendChild(mapEditorAddButton);

  return {
    wrapper: mapEditorFieldset
  };
}

function mapEditorSyncVulnerableRequirementRow(mapEditorWrapper, mapEditorVulnerableValues) {
  var mapEditorRows = mapEditorWrapper.querySelector(".map-check-requirement-rows");
  var mapEditorExistingAutoRow = mapEditorRows.querySelector("[data-auto-vulnerable='true']");

  if (mapEditorExistingAutoRow) {
    mapEditorRows.removeChild(mapEditorExistingAutoRow);
  }

  if (mapEditorVulnerableValues.length === 0) {
    return;
  }

  mapEditorRows.appendChild(mapEditorCreateVulnerableRequirementRow(mapEditorVulnerableValues));
}

function mapEditorCreateVulnerableRequirementRow(mapEditorVulnerableValues) {
  var mapEditorRow = mapEditorCreateCheckRequirementGroupRow(mapEditorVulnerableValues, {
    locked: true,
    title: "Any of vulnerable",
    options: mapEditorGetVulnerableAttributeOptions()
  });

  mapEditorRow.dataset.autoVulnerable = "true";
  return mapEditorRow;
}

function mapEditorSyncEnemyDamageRequirementRow(mapEditorWrapper) {
  var mapEditorRows = mapEditorWrapper.querySelector(".map-check-requirement-rows");
  var mapEditorExistingAutoRow = mapEditorRows.querySelector("[data-auto-enemy-damage='true']");

  if (mapEditorExistingAutoRow) {
    mapEditorRows.removeChild(mapEditorExistingAutoRow);
  }

  mapEditorRows.appendChild(mapEditorCreateEnemyDamageRequirementRow());
}

function mapEditorCreateEnemyDamageRequirementRow() {
  var mapEditorRow = mapEditorCreateCheckRequirementGroupRow(mapEditorEnemyDamageRequirementValues, {
    locked: true,
    title: "Any of damage",
    options: mapEditorGetEnemyDamageRequirementOptions()
  });

  mapEditorRow.dataset.autoEnemyDamage = "true";
  return mapEditorRow;
}

function mapEditorGetEnemyDamageRequirementOptions() {
  return [
    { key: "tank", label: "Tank", progressive: false },
    { key: "bomb", label: "Bombs", progressive: true },
    { key: "sword", label: "Sword", progressive: true },
    { key: "fire", label: "Fire", progressive: false },
    { key: "gun", label: "Gun", progressive: true }
  ];
}

function mapEditorCreateCheckRequirementGroupRow(mapEditorSelectedValues, mapEditorSettings) {
  var mapEditorRowSettings = mapEditorSettings || {};
  var mapEditorRow = document.createElement("div");
  var mapEditorRowHeader = document.createElement("div");
  var mapEditorRowTitle = document.createElement("span");
  var mapEditorRemoveButton = document.createElement("button");
  var mapEditorOptions = document.createElement("div");

  mapEditorRow.className = "map-check-requirement-row";
  mapEditorRowHeader.className = "map-check-requirement-row-header";
  mapEditorRowTitle.textContent = mapEditorRowSettings.title || "Any of";
  mapEditorRemoveButton.className = "secondary-button map-check-remove-row";
  mapEditorRemoveButton.type = "button";
  mapEditorRemoveButton.textContent = "Remove";
  mapEditorRemoveButton.hidden = Boolean(mapEditorRowSettings.locked);
  mapEditorRemoveButton.addEventListener("click", function () {
    mapEditorRow.parentNode.removeChild(mapEditorRow);
  });
  mapEditorRowHeader.appendChild(mapEditorRowTitle);
  mapEditorRowHeader.appendChild(mapEditorRemoveButton);
  mapEditorRow.appendChild(mapEditorRowHeader);

  mapEditorOptions.className = "map-check-requirement-options";
  (mapEditorRowSettings.options || mapEditorGetCheckAttributeOptions()).forEach(function (mapEditorOption) {
    var mapEditorOptionRow = mapEditorCreateCheckAttributeRow(mapEditorOption, mapEditorSelectedValues);

    if (mapEditorRowSettings.locked) {
      Array.prototype.slice.call(mapEditorOptionRow.querySelectorAll("input")).forEach(function (mapEditorInput) {
        mapEditorInput.disabled = true;
      });
    }

    mapEditorOptions.appendChild(mapEditorOptionRow);
  });
  mapEditorRow.appendChild(mapEditorOptions);

  return mapEditorRow;
}

function mapEditorRenderVulnerableTypesControl() {
  var mapEditorFieldset = document.querySelector("#map-vulnerable-types");
  var mapEditorLegend = mapEditorFieldset.querySelector("legend");

  mapEditorFieldset.innerHTML = "";
  mapEditorFieldset.appendChild(mapEditorLegend);
  mapEditorGetVulnerableAttributeOptions().forEach(function (mapEditorOption) {
    mapEditorFieldset.appendChild(mapEditorCreateCheckAttributeRow(mapEditorOption, mapEditorState.selectedVulnerableTypes));
  });
}

function mapEditorGetVulnerableAttributeOptions() {
  return mapEditorVulnerableAttributeOptions.map(function (mapEditorKey) {
    var mapEditorDefinition = globalsState.checkDefinitions[mapEditorKey];

    return {
      key: mapEditorKey,
      label: mapEditorDefinition ? mapEditorDefinition.label : mapEditorKey,
      progressive: false
    };
  });
}

function mapEditorGetCheckAttributeOptions() {
  var mapEditorOptions = [];

  mapEditorOptions.push({
    key: "tank",
    label: "Tank",
    progressive: false
  });

  progressionManagerGetCheckOptions().forEach(function (mapEditorOption) {
    var mapEditorProgressiveMatch = mapEditorOption.key.match(/^([a-zA-Z]+)\d+$/);

    if (mapEditorIsItemPoolCheckKey(mapEditorOption.key)) {
      return;
    }

    if (globalsState.progressiveCheckDefinitions[mapEditorOption.key]) {
      mapEditorOptions.push({
        key: mapEditorOption.key,
        label: globalsState.progressiveCheckDefinitions[mapEditorOption.key].label,
        progressive: true
      });
      return;
    }

    if (mapEditorProgressiveMatch && globalsState.progressiveCheckDefinitions[mapEditorProgressiveMatch[1]]) {
      if (!mapEditorOptions.some(function (mapEditorExistingOption) {
        return mapEditorExistingOption.key === mapEditorProgressiveMatch[1];
      })) {
        mapEditorOptions.push({
          key: mapEditorProgressiveMatch[1],
          label: globalsState.progressiveCheckDefinitions[mapEditorProgressiveMatch[1]].label,
          progressive: true
        });
      }
      return;
    }

    mapEditorOptions.push({
      key: mapEditorOption.key,
      label: mapEditorOption.label,
      progressive: false
    });
  });

  return mapEditorOptions;
}

function mapEditorCreateCheckAttributeRow(mapEditorOption, mapEditorSelectedValues) {
  var mapEditorLabel = document.createElement("label");
  var mapEditorCheckbox = document.createElement("input");

  mapEditorCheckbox.type = "checkbox";
  mapEditorCheckbox.value = mapEditorOption.key;
  mapEditorLabel.dataset.key = mapEditorOption.key;
  mapEditorLabel.dataset.progressive = mapEditorOption.progressive ? "true" : "false";
  mapEditorLabel.appendChild(mapEditorCheckbox);
  mapEditorLabel.appendChild(document.createTextNode(" " + mapEditorOption.label));

  if (mapEditorOption.progressive) {
    var mapEditorLevelInput = document.createElement("input");

    mapEditorLevelInput.type = "number";
    mapEditorLevelInput.min = "1";
    mapEditorLevelInput.max = String(globalsState.progressiveCheckDefinitions[mapEditorOption.key].count);
    mapEditorLevelInput.step = "1";
    mapEditorLevelInput.value = "1";
    mapEditorLevelInput.className = "map-check-level-input";
    mapEditorLabel.appendChild(mapEditorLevelInput);
  }

  mapEditorUpdateAttributeRowFromSelectedValue(mapEditorLabel, mapEditorSelectedValues);

  return mapEditorLabel;
}

function mapEditorUpdateAttributeRowFromSelectedValue(mapEditorLabel, mapEditorSelectedValues) {
  var mapEditorCheckbox = mapEditorLabel.querySelector("input[type='checkbox']");
  var mapEditorLevelInput = mapEditorLabel.querySelector("input[type='number']");
  var mapEditorKey = mapEditorLabel.dataset.key;
  var mapEditorSelectedValue = mapEditorSelectedValues.find(function (mapEditorValue) {
    return mapEditorValue === mapEditorKey || mapEditorValue.indexOf(mapEditorKey + ":") === 0;
  });

  mapEditorCheckbox.checked = Boolean(mapEditorSelectedValue);

  if (mapEditorLevelInput) {
    mapEditorLevelInput.value = mapEditorSelectedValue && mapEditorSelectedValue.indexOf(":") !== -1 ? String(Math.max(1, Number(mapEditorSelectedValue.split(":")[1]) || 1)) : "1";
  }
}

function mapEditorCreateCheckEditorActions(mapEditorBackdrop) {
  var mapEditorActions = document.createElement("div");
  var mapEditorCancelButton = document.createElement("button");
  var mapEditorSaveButton = document.createElement("button");

  mapEditorActions.className = "map-check-modal-actions";
  mapEditorCancelButton.className = "secondary-button";
  mapEditorCancelButton.type = "button";
  mapEditorCancelButton.textContent = "Cancel";
  mapEditorCancelButton.addEventListener("click", function () {
    document.body.removeChild(mapEditorBackdrop);
  });
  mapEditorSaveButton.className = "primary-button";
  mapEditorSaveButton.type = "submit";
  mapEditorSaveButton.textContent = "Save";
  mapEditorActions.appendChild(mapEditorCancelButton);
  mapEditorActions.appendChild(mapEditorSaveButton);

  return mapEditorActions;
}

function mapEditorGetCheckedAttributeValues(mapEditorWrapper) {
  return Array.prototype.slice.call(mapEditorWrapper.querySelectorAll("label")).filter(function (mapEditorLabel) {
    var mapEditorCheckbox = mapEditorLabel.querySelector("input[type='checkbox']");

    return mapEditorCheckbox && mapEditorCheckbox.checked;
  }).map(function (mapEditorLabel) {
    var mapEditorKey = mapEditorLabel.dataset.key;
    var mapEditorLevelInput = mapEditorLabel.querySelector("input[type='number']");

    if (mapEditorLevelInput) {
      return mapEditorKey + ":" + (Number(mapEditorLevelInput.value) || 1);
    }

    return mapEditorKey;
  });
}

function mapEditorGetRequirementGroups(mapEditorWrapper) {
  return Array.prototype.slice.call(mapEditorWrapper.querySelectorAll(".map-check-requirement-row")).map(function (mapEditorRow) {
    return mapEditorGetCheckedAttributeValues(mapEditorRow);
  }).filter(function (mapEditorGroup) {
    return mapEditorGroup.length > 0;
  });
}

function mapEditorSaveCheckEditor(mapEditorTile, mapEditorValues) {
  if (Object.prototype.hasOwnProperty.call(mapEditorValues, "checkKey")) {
    if (mapEditorValues.checkKey) {
      mapEditorTile.checkKey = mapEditorValues.checkKey;
    } else {
      delete mapEditorTile.checkKey;
    }
  }

  if (!mapEditorIsShopTile(mapEditorTile) && mapEditorValues.expectedDrop) {
    mapEditorTile.expectedDrop = mapEditorValues.expectedDrop;
  } else {
    delete mapEditorTile.expectedDrop;
  }

  if (mapEditorIsShopTile(mapEditorTile)) {
    mapEditorTile.shopDrop = mapEditorValues.shopDrop || "itemPool1";
    mapEditorTile.shopCost = Number(mapEditorValues.shopCost) || 0;
  } else {
    delete mapEditorTile.shopDrop;
    delete mapEditorTile.shopCost;
  }

  if (mapEditorValues.vulnerable.length > 0) {
    mapEditorTile.vulnerable = mapEditorValues.vulnerable;
  } else {
    delete mapEditorTile.vulnerable;
  }

  if (mapEditorValues.requirements.length > 0) {
    mapEditorTile.requirements = mapEditorValues.requirements;
  } else {
    delete mapEditorTile.requirements;
  }

  if (mapEditorIsEnemyCheckTile(mapEditorTile) && mapEditorValues.isShopkeep) {
    mapEditorTile.isShopkeep = true;
  } else {
    delete mapEditorTile.isShopkeep;
  }

  if (mapEditorIsEnemyCheckTile(mapEditorTile) && mapEditorValues.removeShopItemsOnDeath) {
    mapEditorTile.removeShopItemsOnDeath = true;
  } else {
    delete mapEditorTile.removeShopItemsOnDeath;
  }
}

function mapEditorStartPainting(mapEditorEvent) {
  mapEditorState.isPainting = true;
  mapEditorState.lastPaintedTileKey = "";
  mapEditorPlaceTile(mapEditorEvent);

  if (mapEditorState.isCheckEditMode) {
    mapEditorState.isPainting = false;
  }
}

function mapEditorContinuePainting(mapEditorEvent) {
  if (!mapEditorState.isPainting) {
    return;
  }

  if (mapEditorState.isCheckEditMode) {
    return;
  }

  mapEditorPlaceTile(mapEditorEvent);
}

function mapEditorStopPainting() {
  mapEditorState.isPainting = false;
  mapEditorState.lastPaintedTileKey = "";
}

function mapEditorSelectRoom(mapEditorEvent) {
  var mapEditorRoom = mapEditorGetClickedRoom(mapEditorEvent);
  var mapEditorStatus = document.querySelector("#map-editor-status");

  if (!mapEditorIsRoomInEditorBounds(mapEditorRoom.x, mapEditorRoom.y)) {
    return;
  }

  mapEditorSetSelectedRoom(mapEditorRoom.x, mapEditorRoom.y);
  mapEditorStatus.textContent = "Selected room " + mapManagerGetCoordinateKey(mapEditorRoom.x, mapEditorRoom.y) + ".";
  mapEditorDraw();
}

function mapEditorHoverRoom(mapEditorEvent) {
  var mapEditorRoomCoordinate = mapEditorGetClickedRoom(mapEditorEvent);
  var mapEditorStatus = document.querySelector("#map-editor-status");

  if (!mapEditorIsRoomInEditorBounds(mapEditorRoomCoordinate.x, mapEditorRoomCoordinate.y)) {
    mapEditorStatus.textContent = "Selected room " + mapManagerGetCoordinateKey(mapEditorState.selectedRoomX, mapEditorState.selectedRoomY) + ".";
    return;
  }

  mapEditorStatus.textContent = mapEditorGetRoomCheckSummary(mapEditorRoomCoordinate.x, mapEditorRoomCoordinate.y);
}

function mapEditorLeaveRoomOverview() {
  document.querySelector("#map-editor-status").textContent = "Selected room " + mapManagerGetCoordinateKey(mapEditorState.selectedRoomX, mapEditorState.selectedRoomY) + ".";
}

function mapEditorIsRoomInEditorBounds(mapEditorRoomX, mapEditorRoomY) {
  return mapEditorRoomX >= -mapEditorState.mainRadius &&
    mapEditorRoomX <= mapEditorState.mainRadius &&
    mapEditorRoomY >= -mapEditorState.mainRadius &&
    mapEditorRoomY <= mapEditorState.mainRadius;
}

function mapEditorGetRoomCheckSummary(mapEditorRoomX, mapEditorRoomY) {
  var mapEditorRoom = mapManagerGetRoom(mapEditorRoomX, mapEditorRoomY);
  var mapEditorRoomName = mapEditorRoom && mapEditorRoom.name ? " - " + mapEditorRoom.name : "";
  var mapEditorLines = ["Room " + mapManagerGetCoordinateKey(mapEditorRoomX, mapEditorRoomY) + mapEditorRoomName];
  var mapEditorChecks = mapEditorRoom ? mapEditorGetRoomCheckLines(mapEditorRoom) : [];

  if (mapEditorChecks.length === 0) {
    mapEditorLines.push("No non-item-pool drops.");
  } else {
    mapEditorLines = mapEditorLines.concat(mapEditorChecks);
  }

  return mapEditorLines.join("\n");
}

function mapEditorGetRoomCheckLines(mapEditorRoom) {
  return (mapEditorRoom.tiles || []).filter(function (mapEditorTile) {
    return mapEditorIsCheckTile(mapEditorTile) && mapEditorIsNonItemPoolDropTile(mapEditorTile);
  }).map(function (mapEditorTile) {
    return mapEditorFormatRoomCheckLine(mapEditorTile);
  });
}

function mapEditorFormatRoomCheckLine(mapEditorTile) {
  var mapEditorTileLabel = mapEditorGetRoomCheckTileLabel(mapEditorTile);
  var mapEditorDropKey = mapEditorGetTileDropKey(mapEditorTile);
  var mapEditorDropLabel = mapEditorGetCheckDropLabel(mapEditorDropKey || "itemPool1");
  var mapEditorDetails = "";

  if (mapEditorIsShopTile(mapEditorTile)) {
    mapEditorDetails = " (" + (Number(mapEditorTile.shopCost) || 0) + " E)";
  }

  return mapManagerGetCoordinateKey(mapEditorTile.x, mapEditorTile.y) + ": " + mapEditorTileLabel + " -> " + mapEditorDropLabel + mapEditorDetails;
}

function mapEditorIsNonItemPoolDropTile(mapEditorTile) {
  var mapEditorDropKey = mapEditorGetTileDropKey(mapEditorTile);

  return Boolean(mapEditorDropKey && mapEditorDropKey !== "empty" && !mapEditorIsItemPoolCheckKey(mapEditorDropKey));
}

function mapEditorGetTileDropKey(mapEditorTile) {
  return mapEditorIsShopTile(mapEditorTile) ? mapEditorTile.shopDrop : mapEditorTile.expectedDrop;
}

function mapEditorOpenCheckCountsPopup() {
  var mapEditorBackdrop = document.createElement("div");
  var mapEditorModal = document.createElement("div");
  var mapEditorCounts = mapEditorBuildCheckCountReport();
  var mapEditorActions = document.createElement("div");
  var mapEditorCloseButton = document.createElement("button");

  mapEditorBackdrop.className = "map-check-modal-backdrop";
  mapEditorModal.className = "map-check-modal map-check-count-modal";
  mapEditorModal.appendChild(mapEditorCreateCheckCountHeader(mapEditorCounts));
  mapEditorModal.appendChild(mapEditorCreateCheckCountWarnings(mapEditorCounts));
  mapEditorModal.appendChild(mapEditorCreateCheckCountTable(mapEditorCounts));
  mapEditorActions.className = "map-check-modal-actions";
  mapEditorCloseButton.className = "primary-button";
  mapEditorCloseButton.type = "button";
  mapEditorCloseButton.textContent = "Close";
  mapEditorCloseButton.addEventListener("click", function () {
    document.body.removeChild(mapEditorBackdrop);
  });
  mapEditorActions.appendChild(mapEditorCloseButton);
  mapEditorModal.appendChild(mapEditorActions);
  mapEditorBackdrop.appendChild(mapEditorModal);
  mapEditorBackdrop.addEventListener("click", function (mapEditorEvent) {
    if (mapEditorEvent.target === mapEditorBackdrop) {
      document.body.removeChild(mapEditorBackdrop);
    }
  });
  document.body.appendChild(mapEditorBackdrop);
}

function mapEditorBuildCheckCountReport() {
  var mapEditorGroups = mapEditorCreateEmptyCheckCountGroups();
  var mapEditorTotal = 0;
  var mapEditorPlaced = 0;
  var mapEditorEnemyCount = 0;
  var mapEditorChestCount = 0;

  mapManagerData.rooms.forEach(function (mapEditorRoom) {
    (mapEditorRoom.tiles || []).forEach(function (mapEditorTile) {
      var mapEditorRawDrop = mapEditorGetTileDropKey(mapEditorTile) || "itemPool1";
      var mapEditorNormalizedDrop = mapEditorNormalizeDropForCount(mapEditorRawDrop);
      var mapEditorGroup = null;

      if (!mapEditorIsCountableCheckTile(mapEditorTile)) {
        return;
      }

      if (mapEditorIsEnemyCheckTile(mapEditorTile)) {
        mapEditorEnemyCount += 1;
      }

      if (mapEditorIsChestCheckTile(mapEditorTile)) {
        mapEditorChestCount += 1;
      }

      if (!mapEditorIsPostgameCheckTile(mapEditorRoom, mapEditorTile)) {
        mapEditorPlaced += 1;
      }

      if (!mapEditorGroups[mapEditorNormalizedDrop]) {
        mapEditorGroups[mapEditorNormalizedDrop] = {
          key: mapEditorNormalizedDrop,
          label: mapEditorGetCheckDropLabel(mapEditorNormalizedDrop),
          count: 0,
          locations: [],
          rawDrops: {}
        };
      }

      mapEditorGroup = mapEditorGroups[mapEditorNormalizedDrop];
      mapEditorGroup.count += 1;
      mapEditorGroup.rawDrops[mapEditorRawDrop] = (mapEditorGroup.rawDrops[mapEditorRawDrop] || 0) + 1;
      mapEditorGroup.locations.push(mapEditorFormatCheckCountLocation(mapEditorRoom, mapEditorTile, mapEditorRawDrop));
      mapEditorTotal += 1;
    });
  });

  return {
    total: mapEditorTotal,
    placed: mapEditorPlaced,
    enemyCount: mapEditorEnemyCount,
    chestCount: mapEditorChestCount,
    groups: Object.keys(mapEditorGroups).map(function (mapEditorKey) {
      return mapEditorGroups[mapEditorKey];
    }).sort(mapEditorSortCheckCountGroups),
    warnings: mapEditorGetCheckCountWarnings(mapEditorGroups)
  };
}

function mapEditorCreateEmptyCheckCountGroups() {
  var mapEditorGroups = {};

  mapEditorGetCollapsedCheckOptions().forEach(function (mapEditorOption) {
    var mapEditorNormalizedDrop = mapEditorNormalizeDropForCount(mapEditorOption.key);

    if (!mapEditorGroups[mapEditorNormalizedDrop]) {
      mapEditorGroups[mapEditorNormalizedDrop] = {
        key: mapEditorNormalizedDrop,
        label: mapEditorGetCheckDropLabel(mapEditorNormalizedDrop),
        count: 0,
        locations: [],
        rawDrops: {}
      };
    }
  });

  [
    { key: "healthPickup", label: "Health Potion" },
    { key: "roundsPickup", label: "Round Pouch" }
  ].forEach(function (mapEditorOption) {
    if (!mapEditorGroups[mapEditorOption.key]) {
      mapEditorGroups[mapEditorOption.key] = {
        key: mapEditorOption.key,
        label: mapEditorOption.label,
        count: 0,
        locations: [],
        rawDrops: {}
      };
    }
  });

  return mapEditorGroups;
}

function mapEditorIsCountableCheckTile(mapEditorTile) {
  return Boolean(mapEditorTile && (
    mapEditorIsChestCheckTile(mapEditorTile) ||
    mapEditorIsDestructableCheckTile(mapEditorTile) ||
    mapEditorIsEnemyCheckTile(mapEditorTile) ||
    mapEditorIsShopTile(mapEditorTile)
  ));
}

function mapEditorIsPostgameCheckTile(mapEditorRoom, mapEditorTile) {
  var mapEditorVulnerabilities = mapEditorTile.vulnerable || [];

  if (mapEditorVulnerabilities.length === 0) {
    return false;
  }

  return mapEditorVulnerabilities.every(function (mapEditorVulnerability) {
    var mapEditorVulnerabilityKey = mapEditorGetRequirementBaseKey(mapEditorVulnerability);

    return mapEditorVulnerabilityKey === "tankTreads" || mapEditorVulnerabilityKey === "tankCannon";
  });
}

function mapEditorNormalizeDropForCount(mapEditorDropKey) {
  var mapEditorProgressiveBase = progressionManagerGetProgressiveCheckBase(mapEditorDropKey);

  if (mapEditorProgressiveBase) {
    return mapEditorProgressiveBase;
  }

  return mapEditorDropKey || "itemPool1";
}

function mapEditorSortCheckCountGroups(mapEditorFirst, mapEditorSecond) {
  if (mapEditorFirst.count !== mapEditorSecond.count) {
    return mapEditorFirst.count - mapEditorSecond.count;
  }

  if (mapEditorFirst.key === "empty") {
    return 1;
  }

  if (mapEditorSecond.key === "empty") {
    return -1;
  }

  if (mapEditorIsItemPoolCheckKey(mapEditorFirst.key) && !mapEditorIsItemPoolCheckKey(mapEditorSecond.key)) {
    return 1;
  }

  if (!mapEditorIsItemPoolCheckKey(mapEditorFirst.key) && mapEditorIsItemPoolCheckKey(mapEditorSecond.key)) {
    return -1;
  }

  return mapEditorFirst.label.localeCompare(mapEditorSecond.label);
}

function mapEditorGetCheckCountWarnings(mapEditorGroups) {
  var mapEditorWarnings = [];

  Object.keys(mapEditorGroups).forEach(function (mapEditorKey) {
    var mapEditorGroup = mapEditorGroups[mapEditorKey];
    var mapEditorProgressiveDefinition = globalsState.progressiveCheckDefinitions[mapEditorKey];

    if (mapEditorKey === "empty" || mapEditorIsItemPoolCheckKey(mapEditorKey)) {
      return;
    }

    if (mapEditorProgressiveDefinition && mapEditorGroup.count > mapEditorProgressiveDefinition.count) {
      mapEditorWarnings.push(mapEditorGroup.label + " has " + mapEditorGroup.count + " placements, max progressive count is " + mapEditorProgressiveDefinition.count + ".");
      return;
    }

    if (!mapEditorProgressiveDefinition && mapEditorGroup.count > 1) {
      mapEditorWarnings.push(mapEditorGroup.label + " appears " + mapEditorGroup.count + " times.");
    }
  });

  return mapEditorWarnings;
}

function mapEditorFormatCheckCountLocation(mapEditorRoom, mapEditorTile, mapEditorRawDrop) {
  var mapEditorRoomName = mapEditorRoom.name ? " " + mapEditorRoom.name : "";
  var mapEditorTileLabel = mapEditorGetRoomCheckTileLabel(mapEditorTile);

  return mapEditorRoom.x + "," + mapEditorRoom.y + mapEditorRoomName + " @ " + mapEditorTile.x + "," + mapEditorTile.y + " (" + mapEditorTileLabel + ", " + mapEditorRawDrop + ")";
}

function mapEditorCreateCheckCountHeader(mapEditorCounts) {
  var mapEditorFragment = document.createDocumentFragment();
  var mapEditorTitle = document.createElement("h2");
  var mapEditorSummary = document.createElement("p");

  mapEditorTitle.textContent = "Check Counts";
  mapEditorSummary.className = "map-check-count-summary";
  mapEditorSummary.textContent = "Placed checks: " + mapEditorCounts.placed + ". Total checks: " + mapEditorCounts.total + ". Chests: " + mapEditorCounts.chestCount + ". Enemies: " + mapEditorCounts.enemyCount + ". Drop values: " + mapEditorCounts.groups.length + ".";
  mapEditorFragment.appendChild(mapEditorTitle);
  mapEditorFragment.appendChild(mapEditorSummary);

  return mapEditorFragment;
}

function mapEditorCreateCheckCountWarnings(mapEditorCounts) {
  var mapEditorWrapper = document.createElement("div");

  mapEditorWrapper.className = "map-check-count-warnings";

  if (mapEditorCounts.warnings.length === 0) {
    mapEditorWrapper.textContent = "No duplicate warnings.";
    return mapEditorWrapper;
  }

  mapEditorCounts.warnings.forEach(function (mapEditorWarning) {
    var mapEditorWarningNode = document.createElement("p");

    mapEditorWarningNode.textContent = mapEditorWarning;
    mapEditorWrapper.appendChild(mapEditorWarningNode);
  });

  return mapEditorWrapper;
}

function mapEditorCreateCheckCountTable(mapEditorCounts) {
  var mapEditorTable = document.createElement("table");
  var mapEditorHead = document.createElement("thead");
  var mapEditorBody = document.createElement("tbody");
  var mapEditorHeaderRow = document.createElement("tr");

  ["Drop", "Count", "Locations"].forEach(function (mapEditorHeader) {
    var mapEditorCell = document.createElement("th");

    mapEditorCell.textContent = mapEditorHeader;
    mapEditorHeaderRow.appendChild(mapEditorCell);
  });
  mapEditorHead.appendChild(mapEditorHeaderRow);
  mapEditorTable.className = "map-check-count-table";
  mapEditorTable.appendChild(mapEditorHead);

  mapEditorCounts.groups.forEach(function (mapEditorGroup) {
    var mapEditorRow = document.createElement("tr");
    var mapEditorDropCell = document.createElement("td");
    var mapEditorCountCell = document.createElement("td");
    var mapEditorLocationsCell = document.createElement("td");

    mapEditorDropCell.textContent = mapEditorGroup.label + " [" + mapEditorGroup.key + "]";
    mapEditorCountCell.textContent = String(mapEditorGroup.count);
    mapEditorLocationsCell.textContent = mapEditorGroup.locations.length > 0 ? mapEditorGroup.locations.join("; ") : "Unplaced";
    mapEditorRow.appendChild(mapEditorDropCell);
    mapEditorRow.appendChild(mapEditorCountCell);
    mapEditorRow.appendChild(mapEditorLocationsCell);
    mapEditorBody.appendChild(mapEditorRow);
  });

  mapEditorTable.appendChild(mapEditorBody);
  return mapEditorTable;
}

function mapEditorOpenDependencyGraphPopup() {
  var mapEditorBackdrop = document.createElement("div");
  var mapEditorModal = document.createElement("div");
  var mapEditorGraph = mapEditorBuildDependencyGraphReport();
  var mapEditorActions = document.createElement("div");
  var mapEditorCloseButton = document.createElement("button");

  mapEditorBackdrop.className = "map-check-modal-backdrop";
  mapEditorModal.className = "map-check-modal map-check-count-modal";
  mapEditorModal.appendChild(mapEditorCreateDependencyGraphHeader(mapEditorGraph));
  mapEditorModal.appendChild(mapEditorCreateDependencyGraphWarnings(mapEditorGraph));
  mapEditorModal.appendChild(mapEditorCreateDependencyGraphTable(mapEditorGraph));
  mapEditorActions.className = "map-check-modal-actions";
  mapEditorCloseButton.className = "primary-button";
  mapEditorCloseButton.type = "button";
  mapEditorCloseButton.textContent = "Close";
  mapEditorCloseButton.addEventListener("click", function () {
    document.body.removeChild(mapEditorBackdrop);
  });
  mapEditorActions.appendChild(mapEditorCloseButton);
  mapEditorModal.appendChild(mapEditorActions);
  mapEditorBackdrop.appendChild(mapEditorModal);
  mapEditorBackdrop.addEventListener("click", function (mapEditorEvent) {
    if (mapEditorEvent.target === mapEditorBackdrop) {
      document.body.removeChild(mapEditorBackdrop);
    }
  });
  document.body.appendChild(mapEditorBackdrop);
}

function mapEditorBuildDependencyGraphReport() {
  var mapEditorLocations = mapEditorGetDependencyGraphLocations();
  var mapEditorState = mapEditorCreateDependencyGraphState();
  var mapEditorPending = mapEditorLocations.slice();
  var mapEditorSpheres = [];
  var mapEditorSphereIndex = 0;
  var mapEditorPlacedDropKeys = {};
  var mapEditorUnplacedDrops = [];

  mapEditorLocations.forEach(function (mapEditorLocation) {
    mapEditorPlacedDropKeys[mapEditorNormalizeDropForCount(mapEditorLocation.dropKey)] = true;
  });

  while (mapEditorPending.length > 0) {
    var mapEditorAvailable = mapEditorPending.filter(function (mapEditorLocation) {
      return mapEditorDependencyRequirementsMet(mapEditorLocation.requirements, mapEditorState);
    });

    if (mapEditorAvailable.length === 0) {
      break;
    }

    mapEditorSpheres.push({
      index: mapEditorSphereIndex,
      locations: mapEditorAvailable
    });
    mapEditorAvailable.forEach(function (mapEditorLocation) {
      mapEditorApplyDependencyReward(mapEditorState, mapEditorLocation.dropKey);
    });
    mapEditorPending = mapEditorPending.filter(function (mapEditorLocation) {
      return mapEditorAvailable.indexOf(mapEditorLocation) === -1;
    });
    mapEditorSphereIndex += 1;
  }

  mapEditorGetEssentialDropOptions().forEach(function (mapEditorOption) {
    if (!mapEditorPlacedDropKeys[mapEditorOption.key]) {
      mapEditorUnplacedDrops.push(mapEditorOption);
    }
  });

  return {
    locations: mapEditorLocations,
    spheres: mapEditorSpheres,
    blocked: mapEditorPending,
    unplacedDrops: mapEditorUnplacedDrops
  };
}

function mapEditorGetDependencyGraphLocations() {
  var mapEditorLocations = [];

  mapManagerData.rooms.forEach(function (mapEditorRoom) {
    (mapEditorRoom.tiles || []).forEach(function (mapEditorTile) {
      var mapEditorDropKey = mapEditorNormalizeDropForCount(mapEditorGetTileDropKey(mapEditorTile));

      if (!mapEditorIsCountableCheckTile(mapEditorTile) || !mapEditorIsEssentialDropKey(mapEditorDropKey)) {
        return;
      }

      mapEditorLocations.push({
        dropKey: mapEditorDropKey,
        dropLabel: mapEditorGetCheckDropLabel(mapEditorDropKey),
        location: mapEditorFormatDependencyLocation(mapEditorRoom, mapEditorTile),
        requirements: mapEditorGetDependencyRequirements(mapEditorRoom, mapEditorTile)
      });
    });
  });

  return mapEditorLocations.sort(function (mapEditorFirst, mapEditorSecond) {
    return mapEditorFirst.dropLabel.localeCompare(mapEditorSecond.dropLabel) || mapEditorFirst.location.localeCompare(mapEditorSecond.location);
  });
}

function mapEditorGetDependencyRequirements(mapEditorRoom, mapEditorTile) {
  var mapEditorRequirements = [];
  var mapEditorRing = mapManagerGetRoomRing(mapEditorRoom.x, mapEditorRoom.y);

  if (mapEditorRing > 0) {
    mapEditorRequirements.push(["progressiveRoom:" + mapEditorRing]);
  }

  mapEditorRequirements = mapEditorRequirements.concat(mapEditorNormalizeRequirementGroups(mapEditorRoom.requirements || []));
  mapEditorRequirements = mapEditorRequirements.concat(mapEditorNormalizeRequirementGroups(mapEditorTile.requirements || []));

  return mapEditorRequirements;
}

function mapEditorCreateDependencyGraphState() {
  var mapEditorState = {
    booleans: {},
    progressives: {}
  };

  Object.keys(globalsState.progressiveCheckDefinitions).forEach(function (mapEditorProgressiveKey) {
    mapEditorState.progressives[mapEditorProgressiveKey] = 0;
  });

  return mapEditorState;
}

function mapEditorDependencyRequirementsMet(mapEditorRequirements, mapEditorState) {
  return mapEditorRequirements.every(function (mapEditorRequirementGroup) {
    return mapEditorRequirementGroup.some(function (mapEditorRequirement) {
      return mapEditorDependencyRequirementMet(mapEditorRequirement, mapEditorState);
    });
  });
}

function mapEditorDependencyRequirementMet(mapEditorRequirement, mapEditorState) {
  var mapEditorBaseKey = mapEditorGetRequirementBaseKey(mapEditorRequirement);
  var mapEditorLevel = Number(String(mapEditorRequirement || "").split(":")[1]) || 1;

  if (mapEditorBaseKey === "tank") {
    return Boolean(mapEditorState.booleans.tankTreads && mapEditorState.booleans.tankChassis && mapEditorState.booleans.tankCannon);
  }

  if (globalsState.progressiveCheckDefinitions[mapEditorBaseKey]) {
    return (mapEditorState.progressives[mapEditorBaseKey] || 0) >= Math.max(1, mapEditorLevel);
  }

  return Boolean(mapEditorState.booleans[mapEditorBaseKey]);
}

function mapEditorApplyDependencyReward(mapEditorState, mapEditorDropKey) {
  var mapEditorProgressiveBase = progressionManagerGetProgressiveCheckBase(mapEditorDropKey) || (globalsState.progressiveCheckDefinitions[mapEditorDropKey] ? mapEditorDropKey : "");

  if (mapEditorProgressiveBase) {
    mapEditorState.progressives[mapEditorProgressiveBase] = Math.min(
      globalsState.progressiveCheckDefinitions[mapEditorProgressiveBase].count,
      (mapEditorState.progressives[mapEditorProgressiveBase] || 0) + 1
    );
    return;
  }

  mapEditorState.booleans[mapEditorDropKey] = true;
}

function mapEditorGetEssentialDropOptions() {
  return mapEditorGetCollapsedCheckOptions().filter(function (mapEditorOption) {
    return mapEditorIsEssentialDropKey(mapEditorOption.key);
  });
}

function mapEditorIsEssentialDropKey(mapEditorDropKey) {
  var mapEditorDefinition = globalsState.checkDefinitions[mapEditorDropKey];

  if (!mapEditorDropKey || mapEditorDropKey === "empty" || mapEditorIsItemPoolCheckKey(mapEditorDropKey)) {
    return false;
  }

  if (mapEditorDropKey === "hp" || mapEditorDropKey === "rounds") {
    return false;
  }

  if (mapEditorDefinition && (mapEditorDefinition.trap || mapEditorDefinition.hiddenFromPools)) {
    return false;
  }

  return Boolean(globalsState.progressiveCheckDefinitions[mapEditorDropKey] || globalsState.checkDefinitions[mapEditorDropKey]);
}

function mapEditorFormatDependencyLocation(mapEditorRoom, mapEditorTile) {
  var mapEditorRoomName = mapEditorRoom.name ? " " + mapEditorRoom.name : "";

  return mapEditorRoom.x + "," + mapEditorRoom.y + mapEditorRoomName + " @ " + mapEditorTile.x + "," + mapEditorTile.y + " (" + mapEditorGetRoomCheckTileLabel(mapEditorTile) + ")";
}

function mapEditorCreateDependencyGraphHeader(mapEditorGraph) {
  var mapEditorFragment = document.createDocumentFragment();
  var mapEditorTitle = document.createElement("h2");
  var mapEditorSummary = document.createElement("p");

  mapEditorTitle.textContent = "Dependency Graph";
  mapEditorSummary.className = "map-check-count-summary";
  mapEditorSummary.textContent = mapEditorGraph.locations.length + " essential placements across " + mapEditorGraph.spheres.length + " reachable spheres.";
  mapEditorFragment.appendChild(mapEditorTitle);
  mapEditorFragment.appendChild(mapEditorSummary);

  return mapEditorFragment;
}

function mapEditorCreateDependencyGraphWarnings(mapEditorGraph) {
  var mapEditorWrapper = document.createElement("div");

  mapEditorWrapper.className = "map-check-count-warnings";

  if (mapEditorGraph.blocked.length === 0 && mapEditorGraph.unplacedDrops.length === 0) {
    mapEditorWrapper.textContent = "No blocked or unplaced essential drops.";
    return mapEditorWrapper;
  }

  if (mapEditorGraph.blocked.length > 0) {
    var mapEditorBlocked = document.createElement("p");

    mapEditorBlocked.textContent = "Blocked: " + mapEditorGraph.blocked.map(function (mapEditorLocation) {
      return mapEditorLocation.dropLabel + " at " + mapEditorLocation.location;
    }).join("; ");
    mapEditorWrapper.appendChild(mapEditorBlocked);
  }

  if (mapEditorGraph.unplacedDrops.length > 0) {
    var mapEditorUnplaced = document.createElement("p");

    mapEditorUnplaced.textContent = "Unplaced: " + mapEditorGraph.unplacedDrops.map(function (mapEditorOption) {
      return mapEditorOption.label;
    }).join(", ");
    mapEditorWrapper.appendChild(mapEditorUnplaced);
  }

  return mapEditorWrapper;
}

function mapEditorCreateDependencyGraphTable(mapEditorGraph) {
  var mapEditorTable = document.createElement("table");
  var mapEditorHead = document.createElement("thead");
  var mapEditorBody = document.createElement("tbody");
  var mapEditorHeaderRow = document.createElement("tr");

  ["Sphere", "Drop", "Location", "Requires"].forEach(function (mapEditorHeader) {
    var mapEditorCell = document.createElement("th");

    mapEditorCell.textContent = mapEditorHeader;
    mapEditorHeaderRow.appendChild(mapEditorCell);
  });
  mapEditorHead.appendChild(mapEditorHeaderRow);
  mapEditorTable.className = "map-check-count-table";
  mapEditorTable.appendChild(mapEditorHead);

  mapEditorGraph.spheres.forEach(function (mapEditorSphere) {
    mapEditorSphere.locations.forEach(function (mapEditorLocation) {
      mapEditorBody.appendChild(mapEditorCreateDependencyGraphRow(String(mapEditorSphere.index), mapEditorLocation));
    });
  });

  mapEditorGraph.blocked.forEach(function (mapEditorLocation) {
    mapEditorBody.appendChild(mapEditorCreateDependencyGraphRow("Blocked", mapEditorLocation));
  });

  mapEditorTable.appendChild(mapEditorBody);
  return mapEditorTable;
}

function mapEditorCreateDependencyGraphRow(mapEditorSphereLabel, mapEditorLocation) {
  var mapEditorRow = document.createElement("tr");
  var mapEditorSphereCell = document.createElement("td");
  var mapEditorDropCell = document.createElement("td");
  var mapEditorLocationCell = document.createElement("td");
  var mapEditorRequiresCell = document.createElement("td");

  mapEditorSphereCell.textContent = mapEditorSphereLabel;
  mapEditorDropCell.textContent = mapEditorLocation.dropLabel + " [" + mapEditorLocation.dropKey + "]";
  mapEditorLocationCell.textContent = mapEditorLocation.location;
  mapEditorRequiresCell.textContent = mapEditorFormatRequirementGroupsSummary(mapEditorLocation.requirements) || "Start";
  mapEditorRow.appendChild(mapEditorSphereCell);
  mapEditorRow.appendChild(mapEditorDropCell);
  mapEditorRow.appendChild(mapEditorLocationCell);
  mapEditorRow.appendChild(mapEditorRequiresCell);

  return mapEditorRow;
}

function mapEditorGetRoomCheckTileLabel(mapEditorTile) {
  if (mapEditorIsShopTile(mapEditorTile)) {
    return "Shop";
  }

  if (mapEditorIsEnemyCheckTile(mapEditorTile)) {
    var mapEditorEnemyDefinition = globalsState.enemyDefinitions[mapEditorTile.enemyType || "blob"];
    return mapEditorEnemyDefinition ? mapEditorEnemyDefinition.label : "Enemy";
  }

  if (mapEditorIsDestructableCheckTile(mapEditorTile)) {
    return "Destructible";
  }

  return "Chest";
}

function mapEditorGetCheckDropLabel(mapEditorDropKey) {
  var mapEditorProgressiveBase = progressionManagerGetProgressiveCheckBase(mapEditorDropKey);

  if (globalsState.checkDefinitions[mapEditorDropKey]) {
    return globalsState.checkDefinitions[mapEditorDropKey].label;
  }

  if (mapEditorProgressiveBase && globalsState.checkDefinitions[mapEditorDropKey]) {
    return globalsState.checkDefinitions[mapEditorDropKey].label;
  }

  if (mapEditorProgressiveBase && globalsState.progressiveCheckDefinitions[mapEditorProgressiveBase]) {
    return globalsState.progressiveCheckDefinitions[mapEditorProgressiveBase].label;
  }

  if (globalsState.progressiveCheckDefinitions[mapEditorDropKey]) {
    return globalsState.progressiveCheckDefinitions[mapEditorDropKey].label;
  }

  if (mapEditorDropKey === "healthPickup") {
    return "Health Potion";
  }

  if (mapEditorDropKey === "roundsPickup") {
    return "Round Pouch";
  }

  return mapEditorDropKey || "Item Pool 1";
}

function mapEditorSetSelectedRoom(mapEditorRoomX, mapEditorRoomY) {
  mapEditorState.selectedRoomX = mapEditorRoomX;
  mapEditorState.selectedRoomY = mapEditorRoomY;
  mapEditorState.selectedRoom = mapManagerEnsureRoom(mapEditorRoomX, mapEditorRoomY);
  mapManagerNormalizeRoomDefaults(mapEditorState.selectedRoom);
  mapEditorUpdateRoomNameControl();
}

function mapEditorClearSelectedRoom() {
  var mapEditorStatus = document.querySelector("#map-editor-status");
  var mapEditorClearedRoomKey = mapManagerGetCoordinateKey(mapEditorState.selectedRoomX, mapEditorState.selectedRoomY);

  mapManagerData.rooms = mapManagerData.rooms.filter(function (mapEditorRoom) {
    return mapEditorRoom.x !== mapEditorState.selectedRoomX || mapEditorRoom.y !== mapEditorState.selectedRoomY;
  });

  mapEditorSetSelectedRoom(0, 0);
  mapEditorStatus.textContent = "Cleared room " + mapEditorClearedRoomKey + " and selected room 0,0.";
  mapEditorDraw();
}

function mapEditorSetCanvasSize() {
  var mapEditorEditorSize = 640;
  var mapEditorOverviewSize = mapEditorState.roomMapCellSize * ((mapEditorState.mainRadius * 2) + 1);

  mapEditorState.tilesetCanvas.width = mapEditorState.tilesetImage.width;
  mapEditorState.tilesetCanvas.height = mapEditorState.tilesetImage.height;
  mapEditorState.editorCanvas.width = mapEditorEditorSize;
  mapEditorState.editorCanvas.height = mapEditorEditorSize;
  mapEditorState.overviewCanvas.width = mapEditorOverviewSize;
  mapEditorState.overviewCanvas.height = mapEditorOverviewSize;
}

function mapEditorStart() {
  Promise.all([
    mapManagerLoadMap(),
    mapEditorLoadImage(mapEditorTilesetPath),
    mapEditorLoadImage(mapEditorChestPath),
    mapEditorLoadImage(mapEditorFloppydiskPath),
    mapEditorLoadImage(mapEditorShopPath),
    mapEditorLoadTilesetData(),
    mapEditorLoadEnemyImages()
  ]).then(function (mapEditorResults) {
    mapEditorState.tilesetImage = mapEditorResults[1];
    mapEditorState.chestImage = mapEditorResults[2];
    mapEditorState.floppydiskImage = mapEditorResults[3];
    mapEditorState.shopImage = mapEditorResults[4];
    mapEditorState.tilesetData = mapEditorNormalizeTilesetData(mapEditorResults[5]);
    mapEditorState.enemyImages = mapEditorResults[6];
    mapEditorState.tilesetTileSize = mapEditorState.tilesetData.tileSize;
    mapEditorState.tilesetCanvas = document.querySelector("#map-tileset-canvas");
    mapEditorState.editorCanvas = document.querySelector("#map-editor-canvas");
    mapEditorState.overviewCanvas = document.querySelector("#map-overview-canvas");
    mapEditorState.tilesetContext = mapEditorState.tilesetCanvas.getContext("2d");
    mapEditorState.editorContext = mapEditorState.editorCanvas.getContext("2d");
    mapEditorState.overviewContext = mapEditorState.overviewCanvas.getContext("2d");
    mapEditorState.colorSampleCanvas = document.createElement("canvas");
    mapEditorState.colorSampleContext = mapEditorState.colorSampleCanvas.getContext("2d");
    mapEditorState.roomTileCount = mapManagerData.roomWidth;
    document.querySelector("#map-room-size").value = mapEditorState.roomTileCount;
    mapEditorState.selectedRoom = mapManagerEnsureRoom(mapEditorState.selectedRoomX, mapEditorState.selectedRoomY);
    mapEditorPopulateRoomBgmControl();
    mapEditorUpdateRoomNameControl();
    mapEditorSetCanvasSize();
    mapEditorPopulateEnemyTypeControl();
    mapEditorUpdateItemSelectionButtons();
    mapEditorRenderVulnerableTypesControl();
    mapEditorUpdateSelectedTileTypeControl();
    mapEditorUpdateColorControls();

    document.querySelector("#map-item-chest").addEventListener("click", function () {
      mapEditorSelectItem("chest");
    });
    document.querySelector("#map-item-floppydisk").addEventListener("click", function () {
      mapEditorToggleCheckEditMode();
    });
    document.querySelector("#map-item-enemy").addEventListener("click", mapEditorSelectEnemy);
    document.querySelector("#map-item-shop").addEventListener("click", mapEditorSelectShopItem);
    document.querySelector("#map-enemy-type").addEventListener("change", function (mapEditorEvent) {
      mapEditorState.selectedEnemyType = mapEditorEvent.currentTarget.value;
      mapEditorSelectEnemy();
    });
    document.querySelector("#map-tileset-canvas").addEventListener("click", mapEditorSelectTilesetTile);
    document.querySelector("#map-editor-canvas").addEventListener("pointerdown", mapEditorStartPainting);
    document.querySelector("#map-editor-canvas").addEventListener("pointermove", mapEditorContinuePainting);
    document.querySelector("#map-editor-canvas").addEventListener("pointerup", mapEditorStopPainting);
    document.querySelector("#map-editor-canvas").addEventListener("pointerleave", mapEditorStopPainting);
    document.querySelector("#map-overview-canvas").addEventListener("click", mapEditorSelectRoom);
    document.querySelector("#map-overview-canvas").addEventListener("pointermove", mapEditorHoverRoom);
    document.querySelector("#map-overview-canvas").addEventListener("pointerleave", mapEditorLeaveRoomOverview);
    document.querySelector("#map-room-size").addEventListener("change", function (mapEditorEvent) {
      mapEditorState.roomTileCount = Number(mapEditorEvent.currentTarget.value);
      mapManagerResizeRoom(mapEditorState.selectedRoom, mapEditorState.roomTileCount);
      mapEditorSetCanvasSize();
      mapEditorDraw();
    });
    document.querySelector("#map-room-name").addEventListener("input", function (mapEditorEvent) {
      var mapEditorRoomName = mapEditorEvent.currentTarget.value;

      if (mapEditorRoomName.trim()) {
        mapEditorState.selectedRoom.name = mapEditorRoomName;
      } else {
        delete mapEditorState.selectedRoom.name;
      }
    });
    document.querySelector("#map-room-bgm").addEventListener("change", function (mapEditorEvent) {
      var mapEditorRoomBgm = mapEditorEvent.currentTarget.value;

      if (mapEditorRoomBgm) {
        mapEditorState.selectedRoom.bgm = mapEditorRoomBgm;
      } else {
        delete mapEditorState.selectedRoom.bgm;
      }

      mapEditorDraw();
    });
    document.querySelector("#map-clear-room").addEventListener("click", mapEditorClearSelectedRoom);
    document.querySelector("#map-final-run-room").addEventListener("change", function (mapEditorEvent) {
      if (mapEditorEvent.currentTarget.checked) {
        mapEditorState.selectedRoom.finalRun = true;
        mapEditorState.selectedRoom.tiles = [];
        document.querySelector("#map-editor-status").textContent = "Marked room " + mapEditorState.selectedRoom.id + " as final run and cleared its tiles.";
      } else {
        delete mapEditorState.selectedRoom.finalRun;
        document.querySelector("#map-editor-status").textContent = "Unmarked final run for room " + mapEditorState.selectedRoom.id + ".";
      }

      mapEditorDraw();
    });
    document.querySelector("#map-selected-tile-type").addEventListener("change", function (mapEditorEvent) {
      mapEditorSetTilesetTileType(mapEditorState.selectedTilesetX, mapEditorState.selectedTilesetY, mapEditorEvent.currentTarget.value);
      mapEditorState.selectedPaletteSource = "tileset";
      mapEditorState.selectedPaintTypeOverride = mapEditorEvent.currentTarget.value;
      if (mapEditorEvent.currentTarget.value === "DestructableCheck" && mapEditorState.selectedVulnerableTypes.length === 0) {
        mapEditorState.selectedVulnerableTypes = ["tankTreads", "tankCannon"];
        mapEditorSetTilesetTileVulnerable(mapEditorState.selectedTilesetX, mapEditorState.selectedTilesetY, mapEditorState.selectedVulnerableTypes);
      }
      mapEditorUpdateItemSelectionButtons();
      mapEditorUpdateVulnerableTypesControl();
      document.querySelector("#map-editor-status").textContent = "Set tileset selection to " + mapEditorEvent.currentTarget.value + " (override active).";
      mapEditorDraw();
    });
    document.querySelector("#map-vulnerable-types").addEventListener("change", function () {
      mapEditorState.selectedVulnerableTypes = mapEditorGetSelectedVulnerableTypesFromControl();
      if (mapEditorState.selectedPaletteSource === "tileset" && mapEditorGetSelectedPaintTileType() === "DestructableCheck") {
        mapEditorSetTilesetTileVulnerable(mapEditorState.selectedTilesetX, mapEditorState.selectedTilesetY, mapEditorState.selectedVulnerableTypes);
      }
    });
    document.querySelector("#map-color-clear").addEventListener("click", mapEditorClearColorReplacements);
    document.querySelector("#map-preview-state").addEventListener("change", function (mapEditorEvent) {
      mapEditorState.previewState = mapEditorEvent.currentTarget.value;
      mapEditorDraw();
    });
    document.querySelector("#map-set-border").addEventListener("click", function () {
      mapEditorSetSelectedRoomDefault("defaultBorder");
    });
    document.querySelector("#map-set-ground").addEventListener("click", function () {
      mapEditorSetSelectedRoomDefault("defaultGround");
    });
    document.querySelector("#map-room-requirements").addEventListener("click", mapEditorOpenRoomRequirementsEditor);
    document.querySelector("#map-eyedropper").addEventListener("click", mapEditorToggleEyedropper);
    document.querySelector("#map-check-counts").addEventListener("click", mapEditorOpenCheckCountsPopup);
    document.querySelector("#map-dependency-graph").addEventListener("click", mapEditorOpenDependencyGraphPopup);
    document.querySelector("#map-download-tileset").addEventListener("click", mapEditorDownloadTilesetData);
    document.querySelector("#map-download").addEventListener("click", mapManagerDownloadMap);

    document.querySelector("#map-editor-status").textContent = "Selected room 0,0.";
    mapEditorDraw();
  }).catch(function (mapEditorError) {
    console.error(mapEditorError);
    document.querySelector("#map-editor-status").textContent = mapEditorError.message;
  });
}

globalsState.loadedModules.push("mapEditor");
