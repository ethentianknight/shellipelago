const fs = require("fs");
const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const mapPath = path.join(rootPath, "src", "data", "map.json");
const archipelagoDataPath = path.join(rootPath, "archipelago", "data");
const worldPath = path.join(rootPath, "archipelago", "world", "shellipelago");
const srcGeneratedPath = path.join(rootPath, "src", "archipelagoGeneratedData.js");

const itemBaseId = 100000;
const locationBaseId = 200000;

const destructibleTypeBySprite = {
  "4,4": "Rock",
  "4,5": "Rock",
  "4,6": "Rock",
  "9,2": "Grass",
  "9,3": "Grass",
  "10,3": "Grass",
  "3,10": "Door",
  "13,16": "Door",
  "11,13": "Jar",
  "2,26": "Stop Sign",
  "2,27": "Stop Sign",
  "3,26": "Stop Sign",
  "3,27": "Stop Sign",
  "4,7": "House",
  "5,7": "House",
  "6,7": "House",
  "4,8": "House",
  "5,8": "House",
  "6,8": "House",
  "7,7": "House",
  "8,7": "House",
  "9,7": "House",
  "7,8": "House",
  "8,8": "House",
  "9,8": "House",
  "4,9": "House",
  "5,9": "House",
  "6,9": "House",
  "4,10": "House",
  "5,10": "House",
  "6,10": "House",
  "4,11": "House",
  "5,11": "House",
  "6,11": "House",
};

const enemyTypeNames = {
  blob: "Slime",
  negaBlob: "Nega Slime",
  snake: "Snake",
  sorcerer: "Mage",
};

const progressiveItems = {
  graphics: { name: "Graphics", count: 2, classification: "progression" },
  progressiveRoom: { name: "Progressive Room", count: 5, classification: "progression" },
  bomb: { name: "Bombs", count: 3, classification: "progression" },
  gun: { name: "Gun", count: 3, classification: "progression" },
  sword: { name: "Sword", count: 3, classification: "progression" },
  fire: { name: "Fire", count: 2, classification: "progression" },
  hp: { name: "Max HP", count: 30, classification: "progression" },
  rounds: { name: "Max Rounds", count: 40, classification: "progression" },
};

const basicItems = {
  sfx: { name: "SFX", classification: "progression" },
  bgm: { name: "BGM", classification: "progression" },
  pickaxe: { name: "Pickaxe", classification: "progression" },
  waterWalkers: { name: "Water Walkers", classification: "progression" },
  tankTreads: { name: "Tank Treads", classification: "progression" },
  tankChassis: { name: "Tank Chassis", classification: "progression" },
  tankCannon: { name: "Tank Cannon", classification: "progression" },
  magnifyingGlass: { name: "Magnifying Glass", classification: "useful" },
  orthopedicInserts: { name: "Orthopedic Inserts", classification: "useful" },
  teleportation: { name: "Teleportation", classification: "useful" },
  steelToe: { name: "Steel Toe", classification: "progression" },
  verminPouch: { name: "Vermin Pouch", classification: "progression" },
};

const fillerItems = {
  healthPotion: { name: "Health Potion", classification: "filler" },
  energyGem: { name: "Energy Gem", classification: "filler" },
  roundPouch: { name: "Round Pouch", classification: "filler" },
  itemPool: { name: "Item Pool", classification: "filler" },
};

const trapItems = {
  trapStun: { name: "Stun Trap", classification: "trap" },
  trapInvisible: { name: "Invisible Trap", classification: "trap" },
  trapFast: { name: "Fast Trap", classification: "trap" },
  trapSlow: { name: "Slow Trap", classification: "trap" },
  trapReverse: { name: "Reverse Trap", classification: "trap" },
  trapScreenFlip: { name: "Screen Flip Trap", classification: "trap" },
  trapZoom: { name: "Zoom In Trap", classification: "trap" },
  trapDeath: { name: "Instant Death Trap", classification: "trap" },
  suddenlySnake: { name: "Snake Trap", classification: "trap" },
};

const dropAliases = {
  bombs: "bomb",
  bomb: "bomb",
  progressiveRooms: "progressiveRoom",
  progressiveRoom: "progressiveRoom",
  maxHp: "hp",
  maxHP: "hp",
  hp: "hp",
  maxRounds: "rounds",
  rounds: "rounds",
  waterWalker: "waterWalkers",
  waterWalkers: "waterWalkers",
  tank: "tank",
  tankTread: "tankTreads",
  tankTreads: "tankTreads",
  tankChassis: "tankChassis",
  tankCannon: "tankCannon",
  bullet: "gun",
  cannon: "tankCannon",
  itemPool1: "itemPool",
  itemPool2: "itemPool",
  itemPool3: "itemPool",
  itemPool4: "itemPool",
  itemPool5: "itemPool",
};

const canonicalDropKeys = {};

for (const group of [progressiveItems, basicItems, fillerItems, trapItems]) {
  for (const key of Object.keys(group)) {
    canonicalDropKeys[key.toLowerCase()] = key;
  }
}

canonicalDropKeys.tank = "tank";

const normalizedDropAliases = Object.fromEntries(
  Object.entries(dropAliases).map(([key, value]) => [key.toLowerCase(), value])
);

function normalizeKey(value) {
  return String(value || "").replace(/[^a-z0-9]+/gi, "");
}

function canonicalDrop(value) {
  const rawKey = normalizeKey(value);
  const lowerKey = rawKey.toLowerCase();
  const progressiveMatch = rawKey.match(/^([a-zA-Z]+)\d+$/);

  if (progressiveMatch) {
    const progressiveBase = canonicalDrop(progressiveMatch[1]);

    if (progressiveItems[progressiveBase]) {
      return progressiveBase;
    }
  }

  return dropAliases[rawKey] || normalizedDropAliases[lowerKey] || canonicalDropKeys[lowerKey] || rawKey;
}

function itemNameForDrop(value) {
  const key = canonicalDrop(value);

  if (progressiveItems[key]) {
    return progressiveItems[key].name;
  }

  if (basicItems[key]) {
    return basicItems[key].name;
  }

  if (trapItems[key]) {
    return trapItems[key].name;
  }

  if (fillerItems[key]) {
    return fillerItems[key].name;
  }

  return "";
}

function isTrapDrop(value) {
  return Boolean(trapItems[canonicalDrop(value)]);
}

function isItemPoolDrop(value) {
  return canonicalDrop(value) === "itemPool";
}

function isEmptyDrop(value) {
  return canonicalDrop(value) === "empty" || !canonicalDrop(value);
}

function isEssentialDrop(value) {
  const key = canonicalDrop(value);

  return Boolean(progressiveItems[key] || basicItems[key]);
}

function isResourceDrop(value) {
  const key = canonicalDrop(value);

  return key === "hp" || key === "rounds";
}

function isDestructible(tile) {
  return Boolean(tile && (tile.tileType === "DestructableCheck" || tile.typeOverride === "DestructableCheck"));
}

function isBurnableDestructible(tile) {
  return isDestructible(tile) && (tile.vulnerable || []).some((vulnerability) => canonicalDrop(vulnerability) === "fire");
}

function isEnemy(tile) {
  return Boolean(tile && (tile.type === "enemy" || tile.tileType === "Enemy" || tile.typeOverride === "Enemy"));
}

function isSnakeEnemy(tile) {
  return isEnemy(tile) && canonicalDrop(tile.enemyType || (tile.enemy && tile.enemy.name)) === "snake";
}

function enemyTypeName(tile) {
  if (tile && tile.isShopkeep) {
    return "Shopkeep";
  }

  const key = canonicalDrop(tile && (tile.enemyType || (tile.enemy && tile.enemy.name)));

  return enemyTypeNames[key] || String(key || "Enemy");
}

function destructibleTypeName(tile) {
  const sprite = tile && tile.sprite || {};

  return destructibleTypeBySprite[`${sprite.x},${sprite.y}`] || "Unknown";
}

function isShop(tile) {
  return Boolean(tile && tile.type === "shop");
}

function isChest(tile) {
  return Boolean(tile && tile.type === "check" && !isDestructible(tile));
}

function roomRing(room) {
  return Math.max(Math.abs(Number(room.x) || 0), Math.abs(Number(room.y) || 0));
}

function locationCategory(tile) {
  if (isShop(tile)) {
    return "shop";
  }

  if (isEnemy(tile)) {
    return "enemy";
  }

  if (isDestructible(tile)) {
    return "easy_destructible";
  }

  return "chest";
}

function tileDrop(tile) {
  if (isShop(tile)) {
    return tile.shopDrop || "itemPool1";
  }

  return tile.expectedDrop || tile.checkKey || "itemPool1";
}

function isPostgameDestructible(tile) {
  const vulnerabilities = (tile.vulnerable || []).map(canonicalDrop).filter(Boolean);

  return vulnerabilities.length > 0 && vulnerabilities.every((vulnerability) => (
    vulnerability === "tank" || vulnerability === "tankTreads" || vulnerability === "tankCannon"
  ));
}

function requirementFromToken(token) {
  const parts = String(token || "").split(":");
  const key = canonicalDrop(parts[0]);
  const requestedAmount = Math.max(1, Number(parts[1]) || 1);

  if (!key) {
    return null;
  }

  if (key === "tank") {
    return { item: "Tank", amount: 1 };
  }

  if (progressiveItems[key]) {
    return { item: progressiveItems[key].name, amount: requestedAmount };
  }

  if (basicItems[key]) {
    return { item: basicItems[key].name, amount: 1 };
  }

  return null;
}

function normalizeRequirementRows(rows) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((row) => {
    const rowItems = Array.isArray(row) ? row : [row];

    return rowItems.map(requirementFromToken).filter(Boolean);
  }).filter((row) => row.length);
}

function addRequirementRow(rows, row) {
  const cleanRow = row.filter(Boolean);
  const serialized = JSON.stringify(cleanRow);

  if (cleanRow.length && !rows.some((existingRow) => JSON.stringify(existingRow) === serialized)) {
    rows.push(cleanRow);
  }
}

function removeRedundantRequirementRows(rows) {
  const reducedRows = rows.filter((row, rowIndex) => !rows.some((candidate, candidateIndex) => {
    if (candidateIndex === rowIndex || candidate.length >= row.length) {
      return false;
    }

    return candidate.every((candidateRequirement) => row.some((requirement) => (
      requirement.item === candidateRequirement.item &&
      requirement.amount === candidateRequirement.amount
    )));
  }));

  rows.length = 0;
  reducedRows.forEach((row) => rows.push(row));
}

function addEnemyRoundsRequirementRows(rows) {
  const roundsItems = new Set(["Bombs", "Fire", "Gun"]);
  const originalRows = rows.slice();

  originalRows.forEach((row) => {
    if (!row.some((requirement) => roundsItems.has(requirement.item))) {
      return;
    }

    addRequirementRow(rows, row.filter((requirement) => !roundsItems.has(requirement.item)).concat([
      { item: "Max Rounds", amount: 2 },
    ]));
  });
}

function addGuardedChestRoundsRequirementRow(rows) {
  const hasGunRequirement = rows.some((row) => row.some((requirement) => requirement.item === "Gun"));
  const hasSteelToeRequirement = rows.some((row) => row.some((requirement) => requirement.item === "Steel Toe"));

  if (!hasGunRequirement) {
    return;
  }

  addRequirementRow(rows, [
    { item: "Max Rounds", amount: 2 },
    { item: "Sword", amount: 1 },
    hasSteelToeRequirement ? { item: "Steel Toe", amount: 1 } : null,
  ]);
}

function vulnerabilityRequirement(token) {
  const parts = String(token || "").split(":");
  const key = canonicalDrop(token);
  const requestedAmount = Math.max(1, Number(parts[1]) || 1);

  if (key === "tankTreads" || key === "tankCannon" || key === "tank") {
    return { item: "Tank", amount: 1 };
  }

  if (key === "bomb") {
    return { item: "Bombs", amount: requestedAmount };
  }

  if (key === "gun") {
    return { item: "Gun", amount: requestedAmount };
  }

  if (key === "sword") {
    return { item: "Sword", amount: requestedAmount };
  }

  if (key === "fire") {
    return { item: "Fire", amount: requestedAmount };
  }

  if (key === "pickaxe") {
    return { item: "Pickaxe", amount: 1 };
  }

  return null;
}

function locationRequirements(room, tile) {
  const rows = [];
  const ring = roomRing(room);

  addRequirementRow(rows, [{ item: "Progressive Room", amount: 1 }]);

  if (ring > 1) {
    addRequirementRow(rows, [{ item: "Progressive Room", amount: ring }]);
  }

  normalizeRequirementRows(room.requirements).forEach((row) => addRequirementRow(rows, row));
  normalizeRequirementRows(tile.requirements).forEach((row) => addRequirementRow(rows, row));

  if (isShop(tile)) {
    addRequirementRow(rows, [{ item: "Sword", amount: 1 }]);
  }

  if (isDestructible(tile)) {
    const vulnerabilityRow = (tile.vulnerable || []).map(vulnerabilityRequirement).filter(Boolean);

    addRequirementRow(rows, [{ item: "Graphics", amount: isBurnableDestructible(tile) ? 1 : 2 }]);
    addRequirementRow(rows, vulnerabilityRow);
  }

  if (isSnakeEnemy(tile)) {
    addRequirementRow(rows, [{ item: "Graphics", amount: 1 }]);
  }

  removeRedundantRequirementRows(rows);

  if (isChest(tile)) {
    addGuardedChestRoundsRequirementRow(rows);
  }

  if (isEnemy(tile)) {
    const baseEnemyVulnerabilities = [
      { item: "Sword", amount: 1 },
      { item: "Bombs", amount: 1 },
      { item: "Fire", amount: 1 },
    ];

    if (canonicalDrop(tile.enemyType || (tile.enemy && tile.enemy.name)) !== "negaBlob") {
      baseEnemyVulnerabilities.push({ item: "Gun", amount: 1 });
    }

    addRequirementRow(rows, baseEnemyVulnerabilities);
    addEnemyRoundsRequirementRows(rows);
  }

  return rows;
}

function locationName(room, tile, roomLocationOrder) {
  const roomName = room.name || room.id || `${room.x},${room.y}`;
  const category = locationCategory(tile);

  if (category === "enemy") {
    const enemyNumber = roomLocationOrder.enemy.size > 1 ? ` #${roomLocationOrder.enemy.get(tile)}` : "";

    return `${roomName}: ${enemyTypeName(tile)}${enemyNumber}`;
  }

  if (category === "easy_destructible") {
    return `${roomName}: ${destructibleTypeName(tile)} ([${tile.x},${tile.y}])`;
  }

  if (category === "shop") {
    return `${roomName}: Shop #${roomLocationOrder.shop.get(tile)} (${itemNameForDrop(tileDrop(tile))})`;
  }

  const chestNumber = roomLocationOrder.chest.size > 1 ? ` #${roomLocationOrder.chest.get(tile)}` : "";

  return `${roomName}: Chest${chestNumber}`;
}

function buildRoomLocationOrder(room) {
  const order = {
    chest: new Map(),
    enemy: new Map(),
    shop: new Map(),
  };

  (room.tiles || []).filter((tile) => isChest(tile) && !isEmptyDrop(tileDrop(tile))).forEach((tile, index) => {
    order.chest.set(tile, index + 1);
  });

  (room.tiles || []).filter(isEnemy).forEach((tile, index) => {
    order.enemy.set(tile, index + 1);
  });

  (room.tiles || []).filter(isShop).sort((first, second) => (
    (Number(first.x) - Number(second.x)) || (Number(first.y) - Number(second.y))
  )).forEach((tile, index) => {
    order.shop.set(tile, index + 1);
  });

  return order;
}

function buildItems() {
  const items = [];
  let id = itemBaseId;

  [progressiveItems, basicItems, fillerItems, trapItems].forEach((group) => {
    Object.keys(group).forEach((key) => {
      const definition = group[key];

      items.push({
        key,
        id,
        name: definition.name,
        classification: definition.classification,
        trap: Boolean(trapItems[key]),
        count: definition.count || 1,
      });
      id += 1;
    });
  });

  return items;
}

function buildLocations(mapData) {
  const locations = [];
  let id = locationBaseId;

  mapData.rooms.forEach((room) => {
    const roomLocationOrder = buildRoomLocationOrder(room);

    (room.tiles || []).forEach((tile) => {
      if (!isChest(tile) && !isDestructible(tile) && !isEnemy(tile) && !isShop(tile)) {
        return;
      }

      if (isDestructible(tile) && isPostgameDestructible(tile)) {
        return;
      }

      const drop = tileDrop(tile);

      if (isEmptyDrop(drop)) {
        return;
      }

      const category = locationCategory(tile);

      locations.push({
        id,
        key: `loc_${id}`,
        name: locationName(room, tile, roomLocationOrder),
        room: room.name || room.id || `${room.x},${room.y}`,
        room_x: room.x,
        room_y: room.y,
        tile_x: tile.x,
        tile_y: tile.y,
        category,
        enemy_type: isEnemy(tile) ? enemyTypeName(tile) : "",
        destructible_type: isDestructible(tile) ? destructibleTypeName(tile) : "",
        drop_key: canonicalDrop(drop),
        drop_name: itemNameForDrop(drop),
        item_pool: isItemPoolDrop(drop),
        trap_location: isTrapDrop(drop),
        essential_location: isEssentialDrop(drop),
        resource_location: isResourceDrop(drop),
        requirements: locationRequirements(room, tile),
      });

      id += 1;
    });
  });

  return locations;
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function pythonLiteral(data) {
  return JSON.stringify(data, null, 2)
    .replace(/\btrue\b/g, "True")
    .replace(/\bfalse\b/g, "False")
    .replace(/\bnull\b/g, "None");
}

function writePythonData(filePath, variableName, data, header) {
  fs.writeFileSync(filePath, [
    header || "",
    "",
    `${variableName} = ${pythonLiteral(data)}`,
    "",
  ].join("\n"));
}

function writeItemsPy(items) {
  const header = [
    "from BaseClasses import ItemClassification",
    "",
    "classification_table = {",
    '    "progression": ItemClassification.progression,',
    '    "useful": ItemClassification.useful,',
    '    "filler": ItemClassification.filler,',
    '    "trap": ItemClassification.trap,',
    "}",
    "",
  ].join("\n");

  writePythonData(path.join(worldPath, "items.py"), "raw_item_table", items, header);
  fs.appendFileSync(path.join(worldPath, "items.py"), [
    "item_table = {",
    "    item['name']: {",
    "        'id': item['id'],",
    "        'key': item['key'],",
    "        'classification': classification_table[item['classification']],",
    "        'classification_name': item['classification'],",
    "        'count': item.get('count', 1),",
    "    } for item in raw_item_table",
    "}",
    "",
    "filler_item_names = [item['name'] for item in raw_item_table if item['classification'] == 'filler' and item['key'] != 'itemPool' and not item.get('trap')]",
    "trap_item_names = [item['name'] for item in raw_item_table if item.get('trap')]",
    "progression_item_names = [item['name'] for item in raw_item_table if item['classification'] == 'progression']",
    "",
  ].join("\n"));
}

function writeLocationsPy(locations) {
  writePythonData(path.join(worldPath, "locations.py"), "raw_location_table", locations, "# Generated from Shellipelago map data. Keep edits in the source map/generator.");
  fs.appendFileSync(path.join(worldPath, "locations.py"), [
    "location_table = {location['name']: location for location in raw_location_table}",
    "",
  ].join("\n"));
}

function writeGeneratedClientData(items, locations) {
  const itemIdToKeys = {};
  const itemIdToNames = {};
  const itemNameToKey = Object.fromEntries(items.map((item) => [item.name, item.key]));

  items.forEach((item) => {
    itemIdToNames[item.id] = item.name;

    if (progressiveItems[item.key]) {
      itemIdToKeys[item.id] = [item.key];
      return;
    }

    if ((basicItems[item.key] || fillerItems[item.key] || trapItems[item.key]) && item.key !== "itemPool") {
      itemIdToKeys[item.id] = [item.key];
    }
  });

  fs.writeFileSync(srcGeneratedPath, [
    "var archipelagoGeneratedItemIdToCheckKeys = ",
    JSON.stringify(itemIdToKeys, null, 2),
    ";\n",
    "var archipelagoGeneratedItemIdToNames = ",
    JSON.stringify(itemIdToNames, null, 2),
    ";\n",
    "var archipelagoGeneratedLocationNameToId = ",
    JSON.stringify(Object.fromEntries(locations.map((location) => [location.name, location.id])), null, 2),
    ";\n",
    "var archipelagoGeneratedLocationCoordToLocation = ",
    JSON.stringify(Object.fromEntries(locations.map((location) => [
      `${location.room_x},${location.room_y}:${location.tile_x},${location.tile_y}`,
      {
        id: location.id,
        name: location.name,
        category: location.category,
        requirements: (location.requirements || []).map((group) => group.map((requirement) => ({
          key: itemNameToKey[requirement.item] || (requirement.item === "Tank" ? "tank" : ""),
          amount: requirement.amount,
        }))),
      },
    ])), null, 2),
    ";\n",
    "globalsState.loadedModules.push(\"archipelagoGeneratedData\");\n",
  ].join(""));
}

const mapData = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const items = buildItems();
const locations = buildLocations(mapData);

fs.mkdirSync(archipelagoDataPath, { recursive: true });
fs.mkdirSync(worldPath, { recursive: true });
writeJson(path.join(archipelagoDataPath, "items.json"), items);
writeJson(path.join(archipelagoDataPath, "locations.json"), locations);
writeItemsPy(items);
writeLocationsPy(locations);
writeGeneratedClientData(items, locations);

console.log(`Generated ${items.length} items and ${locations.length} locations.`);
