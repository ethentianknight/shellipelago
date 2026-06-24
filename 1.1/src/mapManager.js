var mapManagerData = window.shellipelagoMapData || {
  roomWidth: 32,
  roomHeight: 32,
  rooms: [
    {
      id: "initial_room",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      tiles: []
    }
  ]
};
var mapManagerMainRadius = 5;

function mapManagerLoadMap() {
  if (window.shellipelagoMapData || isBuild) {
    mapManagerNormalizeRooms();
    return Promise.resolve(mapManagerData);
  }

  return fetch("src/data/map.json").then(function (mapManagerResponse) {
    if (!mapManagerResponse.ok) {
      throw new Error("Unable to load map.json");
    }

    return mapManagerResponse.json();
  }).then(function (mapManagerLoadedMap) {
    mapManagerData = mapManagerLoadedMap;
    mapManagerNormalizeRooms();
    return mapManagerData;
  });
}

function mapManagerNormalizeRooms() {
  mapManagerData.rooms.forEach(function (mapManagerRoom) {
    if (!mapManagerRoom.tiles) {
      mapManagerRoom.tiles = [];
    }

    mapManagerNormalizeRoomDefaults(mapManagerRoom);
  });
}

function mapManagerNormalizeRoomDefaults(mapManagerRoom) {
  if (!mapManagerRoom.defaultBorder) {
    mapManagerRoom.defaultBorder = mapManagerCreateDefaultTileDefinition("blocker", "Blocker");
  }

  if (!mapManagerRoom.defaultGround) {
    mapManagerRoom.defaultGround = mapManagerCreateDefaultTileDefinition("walkable", "Walkable");
  }
}

function mapManagerCreateDefaultTileDefinition(mapManagerType, mapManagerTileType, mapManagerSprite) {
  var mapManagerDefaultTile = {
    type: mapManagerType,
    tileType: mapManagerTileType
  };

  if (mapManagerSprite) {
    mapManagerDefaultTile.sprite = mapManagerSprite;
  }

  return mapManagerDefaultTile;
}

function mapManagerGetCoordinateKey(mapManagerX, mapManagerY) {
  return mapManagerX + "," + mapManagerY;
}

function mapManagerGetRoomRing(mapManagerRoomX, mapManagerRoomY) {
  return Math.max(Math.abs(mapManagerRoomX), Math.abs(mapManagerRoomY));
}

function mapManagerIsRoomInsideMapRadius(mapManagerRoomX, mapManagerRoomY) {
  return Math.sqrt((mapManagerRoomX * mapManagerRoomX) + (mapManagerRoomY * mapManagerRoomY)) <= mapManagerMainRadius;
}

function mapManagerIsRoomUnlocked(mapManagerRoomX, mapManagerRoomY) {
  return mapManagerGetRoomRing(mapManagerRoomX, mapManagerRoomY) <= globalsState.progression.progressiveRooms &&
    mapManagerIsRoomInsideMapRadius(mapManagerRoomX, mapManagerRoomY);
}

function mapManagerGetRoom(mapManagerRoomX, mapManagerRoomY) {
  var mapManagerFoundRoom = null;

  mapManagerData.rooms.forEach(function (mapManagerRoom) {
    if (mapManagerRoom.x === mapManagerRoomX && mapManagerRoom.y === mapManagerRoomY) {
      mapManagerFoundRoom = mapManagerRoom;
    }
  });

  return mapManagerFoundRoom;
}

function mapManagerEnsureRoom(mapManagerRoomX, mapManagerRoomY) {
  var mapManagerRoom = mapManagerGetRoom(mapManagerRoomX, mapManagerRoomY);

  if (mapManagerRoom) {
    return mapManagerRoom;
  }

  mapManagerRoom = {
    id: "room_" + mapManagerRoomX + "_" + mapManagerRoomY,
    x: mapManagerRoomX,
    y: mapManagerRoomY,
    width: 1,
    height: 1,
    tiles: []
  };
  mapManagerNormalizeRoomDefaults(mapManagerRoom);
  mapManagerData.rooms.push(mapManagerRoom);

  return mapManagerRoom;
}

function mapManagerSeedRoomBorder(mapManagerRoom) {
  var mapManagerTileX = 0;

  while (mapManagerTileX < mapManagerData.roomWidth) {
    mapManagerSetTile(mapManagerRoom, mapManagerTileX, 0, "blocker");
    mapManagerSetTile(mapManagerRoom, mapManagerTileX, mapManagerData.roomHeight - 1, "blocker");
    mapManagerTileX += 1;
  }

  var mapManagerTileY = 1;

  while (mapManagerTileY < mapManagerData.roomHeight - 1) {
    mapManagerSetTile(mapManagerRoom, 0, mapManagerTileY, "blocker");
    mapManagerSetTile(mapManagerRoom, mapManagerData.roomWidth - 1, mapManagerTileY, "blocker");
    mapManagerTileY += 1;
  }
}

function mapManagerResizeRoom(mapManagerRoom, mapManagerSize) {
  mapManagerData.roomWidth = mapManagerSize;
  mapManagerData.roomHeight = mapManagerSize;
  mapManagerRoom.tiles = mapManagerRoom.tiles.filter(function (mapManagerTile) {
    return mapManagerTile.x < mapManagerSize && mapManagerTile.y < mapManagerSize;
  });
  mapManagerNormalizeRoomDefaults(mapManagerRoom);
}

function mapManagerIsBorderTile(mapManagerTileX, mapManagerTileY) {
  return mapManagerTileX === 0 ||
    mapManagerTileY === 0 ||
    mapManagerTileX === mapManagerData.roomWidth - 1 ||
    mapManagerTileY === mapManagerData.roomHeight - 1;
}

function mapManagerGetTile(mapManagerRoom, mapManagerTileX, mapManagerTileY) {
  var mapManagerFoundTile = null;

  mapManagerRoom.tiles.forEach(function (mapManagerTile) {
    if (mapManagerTile.x === mapManagerTileX && mapManagerTile.y === mapManagerTileY) {
      mapManagerFoundTile = mapManagerTile;
    }
  });

  return mapManagerFoundTile;
}

function mapManagerGetDefaultTile(mapManagerRoom, mapManagerTileX, mapManagerTileY) {
  var mapManagerDefaultDefinition = mapManagerIsBorderTile(mapManagerTileX, mapManagerTileY) ? mapManagerRoom.defaultBorder : mapManagerRoom.defaultGround;
  var mapManagerDefaultTile = {
    id: "default_" + mapManagerTileX + "_" + mapManagerTileY,
    x: mapManagerTileX,
    y: mapManagerTileY,
    width: 1,
    height: 1,
    type: mapManagerDefaultDefinition.type,
    tileType: mapManagerDefaultDefinition.tileType,
    typeOverride: mapManagerDefaultDefinition.typeOverride || mapManagerDefaultDefinition.tileType,
    isDefault: true
  };

  if (mapManagerDefaultDefinition.sprite) {
    mapManagerDefaultTile.sprite = mapManagerDefaultDefinition.sprite;
  }

  if (mapManagerDefaultDefinition.colorReplacements) {
    mapManagerDefaultTile.colorReplacements = mapManagerDefaultDefinition.colorReplacements;
  }

  if (mapManagerDefaultDefinition.vulnerable) {
    mapManagerDefaultTile.vulnerable = mapManagerDefaultDefinition.vulnerable;
  }

  if (mapManagerDefaultDefinition.checkKey) {
    mapManagerDefaultTile.checkKey = mapManagerDefaultDefinition.checkKey;
  }

  if (mapManagerDefaultDefinition.expectedDrop) {
    mapManagerDefaultTile.expectedDrop = mapManagerDefaultDefinition.expectedDrop;
  }

  if (mapManagerDefaultDefinition.requirements) {
    mapManagerDefaultTile.requirements = mapManagerDefaultDefinition.requirements;
  }

  if (mapManagerDefaultDefinition.doorChannel) {
    mapManagerDefaultTile.doorChannel = mapManagerDefaultDefinition.doorChannel;
  }

  return mapManagerDefaultTile;
}

function mapManagerGetEffectiveTile(mapManagerRoom, mapManagerTileX, mapManagerTileY) {
  var mapManagerExplicitTile = mapManagerGetTile(mapManagerRoom, mapManagerTileX, mapManagerTileY);

  if (mapManagerExplicitTile) {
    return mapManagerExplicitTile;
  }

  return mapManagerGetDefaultTile(mapManagerRoom, mapManagerTileX, mapManagerTileY);
}

function mapManagerSetTile(mapManagerRoom, mapManagerTileX, mapManagerTileY, mapManagerType, mapManagerDataOverrides) {
  var mapManagerExistingTile = mapManagerGetTile(mapManagerRoom, mapManagerTileX, mapManagerTileY);
  var mapManagerOverrides = mapManagerDataOverrides || {};

  if (mapManagerTileX < 0 || mapManagerTileY < 0 || mapManagerTileX >= mapManagerData.roomWidth || mapManagerTileY >= mapManagerData.roomHeight) {
    return;
  }

  if (mapManagerType === "empty") {
    mapManagerRoom.tiles = mapManagerRoom.tiles.filter(function (mapManagerTile) {
      return mapManagerTile.x !== mapManagerTileX || mapManagerTile.y !== mapManagerTileY;
    });
    return;
  }

  if (mapManagerExistingTile) {
    mapManagerExistingTile.type = mapManagerType;
    delete mapManagerExistingTile.checkKey;
    delete mapManagerExistingTile.sprite;
    delete mapManagerExistingTile.tileType;
    delete mapManagerExistingTile.typeOverride;
    delete mapManagerExistingTile.colorReplacements;
    delete mapManagerExistingTile.backgroundTile;
    delete mapManagerExistingTile.vulnerable;
    delete mapManagerExistingTile.expectedDrop;
    delete mapManagerExistingTile.shopDrop;
    delete mapManagerExistingTile.shopCost;
    delete mapManagerExistingTile.requirements;
    delete mapManagerExistingTile.isShopkeep;
    delete mapManagerExistingTile.removeShopItemsOnDeath;
    delete mapManagerExistingTile.enemyType;
    delete mapManagerExistingTile.doorChannel;
    Object.keys(mapManagerOverrides).forEach(function (mapManagerOverrideKey) {
      mapManagerExistingTile[mapManagerOverrideKey] = mapManagerOverrides[mapManagerOverrideKey];
    });
    return;
  }

  var mapManagerNewTile = {
    id: mapManagerType + "_" + mapManagerTileX + "_" + mapManagerTileY,
    x: mapManagerTileX,
    y: mapManagerTileY,
    width: 1,
    height: 1,
    type: mapManagerType
  };

  Object.keys(mapManagerOverrides).forEach(function (mapManagerOverrideKey) {
    mapManagerNewTile[mapManagerOverrideKey] = mapManagerOverrides[mapManagerOverrideKey];
  });

  mapManagerRoom.tiles.push(mapManagerNewTile);
}

function mapManagerDownloadMap() {
  downloadManagerDownloadText("map.json", JSON.stringify(mapManagerData, null, 2) + "\n");
}

globalsState.loadedModules.push("mapManager");
