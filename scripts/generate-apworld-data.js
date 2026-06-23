const fs = require("fs");
const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const mapPath = path.join(rootPath, "src", "data", "map.json");
const archipelagoDataPath = path.join(rootPath, "archipelago", "data");
const worldPath = path.join(rootPath, "archipelago", "world", "shellipelago");
const srcGeneratedPath = path.join(rootPath, "src", "archipelagoGeneratedData.js");

const itemBaseId = 100000;
const locationBaseId = 200000;

const progressiveItems = {
  graphics: { name: "Graphics", count: 3, classification: "progression" },
  progressiveRoom: { name: "Progressive Room", count: 5, classification: "progression" },
  bomb: { name: "Bombs", count: 3, classification: "progression" },
  gun: { name: "Gun", count: 2, classification: "progression" },
  sword: { name: "Sword", count: 3, classification: "progression" },
  energy: { name: "Energy", count: 9, classification: "filler" },
  hp: { name: "Max HP", count: 30, classification: "filler" },
  rounds: { name: "Max Rounds", count: 40, classification: "progression" },
};

const basicItems = {
  fire: { name: "Fire", classification: "progression" },
  sfx: { name: "SFX", classification: "progression" },
  bgm: { name: "BGM", classification: "progression" },
  pickaxe: { name: "Pickaxe", classification: "progression" },
  waterWalkers: { name: "Water Walkers", classification: "progression" },
  tankTreads: { name: "Tank Treads", classification: "progression" },
  tankChassis: { name: "Tank Chassis", classification: "progression" },
  tankCannon: { name: "Tank Cannon", classification: "progression" },
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
  trapZoom: { name: "Zoom Trap", classification: "trap" },
  trapDeath: { name: "Death Trap", classification: "trap" },
  suddenlySnake: { name: "Suddenly Snake", classification: "trap" },
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

function isEnemy(tile) {
  return Boolean(tile && (tile.type === "enemy" || tile.tileType === "Enemy" || tile.typeOverride === "Enemy"));
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

function vulnerabilityRequirement(token) {
  const key = canonicalDrop(token);

  if (key === "tankTreads" || key === "tankCannon" || key === "tank") {
    return { item: "Tank", amount: 1 };
  }

  if (key === "bomb") {
    return { item: "Bombs", amount: 1 };
  }

  if (key === "gun") {
    return { item: "Gun", amount: 1 };
  }

  if (key === "sword") {
    return { item: "Sword", amount: 1 };
  }

  if (key === "fire") {
    return { item: "Fire", amount: 1 };
  }

  if (key === "pickaxe") {
    return { item: "Pickaxe", amount: 1 };
  }

  return null;
}

function addImpliedRequirementRows(rows) {
  const flatRequirements = rows.flat();

  if (flatRequirements.some((requirement) => requirement.item === "Progressive Room" && requirement.amount >= 2)) {
    addRequirementRow(rows, [{ item: "Graphics", amount: 1 }]);
  }

  if (flatRequirements.some((requirement) => requirement.item === "Gun" || requirement.item === "Bombs")) {
    addRequirementRow(rows, [{ item: "Max Rounds", amount: 2 }]);
  }

  if (flatRequirements.some((requirement) => requirement.item === "Gun" || requirement.item === "Fire")) {
    addRequirementRow(rows, [{ item: "Sword", amount: 1 }]);
  }

  if (flatRequirements.some((requirement) => requirement.item === "Pickaxe" || requirement.item === "Bombs" || requirement.item === "Fire")) {
    addRequirementRow(rows, [{ item: "Graphics", amount: 2 }]);
  }
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

  if (isEnemy(tile)) {
    addRequirementRow(rows, [
      { item: "Tank", amount: 1 },
      { item: "Bombs", amount: 1 },
      { item: "Sword", amount: 1 },
      { item: "Fire", amount: 1 },
      { item: "Gun", amount: 1 },
    ]);
  }

  if (isDestructible(tile)) {
    const vulnerabilityRow = (tile.vulnerable || []).map(vulnerabilityRequirement).filter(Boolean);

    addRequirementRow(rows, vulnerabilityRow);
  }

  addImpliedRequirementRows(rows);
  return rows;
}

function locationName(room, tile, index) {
  const roomName = room.name || room.id || `${room.x},${room.y}`;
  const typeName = {
    chest: "Chest",
    easy_destructible: "Destructible",
    enemy: "Enemy",
    shop: "Shop",
  }[locationCategory(tile)] || "Check";

  return `${roomName} (${room.x},${room.y}) ${typeName} ${tile.x},${tile.y} #${index}`;
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
  let index = 1;

  mapData.rooms.forEach((room) => {
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
        name: locationName(room, tile, index),
        room: room.name || room.id || `${room.x},${room.y}`,
        room_x: room.x,
        room_y: room.y,
        tile_x: tile.x,
        tile_y: tile.y,
        category,
        drop_key: canonicalDrop(drop),
        drop_name: itemNameForDrop(drop),
        item_pool: isItemPoolDrop(drop),
        trap_location: isTrapDrop(drop),
        essential_location: isEssentialDrop(drop),
        resource_location: isResourceDrop(drop),
        requirements: locationRequirements(room, tile),
      });

      id += 1;
      index += 1;
    });
  });

  return locations;
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function writePythonData(filePath, variableName, data, header) {
  fs.writeFileSync(filePath, [
    header || "import json",
    "",
    `${variableName} = json.loads(r'''`,
    JSON.stringify(data, null, 2),
    "''')",
    "",
  ].join("\n"));
}

function writeItemsPy(items) {
  const header = [
    "import json",
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
  writePythonData(path.join(worldPath, "locations.py"), "raw_location_table", locations, "import json");
  fs.appendFileSync(path.join(worldPath, "locations.py"), [
    "location_table = {location['name']: location for location in raw_location_table}",
    "",
  ].join("\n"));
}

function writeGeneratedClientData(items, locations) {
  const itemIdToKeys = {};
  const itemIdToNames = {};

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
      { id: location.id, name: location.name, category: location.category },
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
