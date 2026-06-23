const fs = require("fs");
const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const mapPath = path.join(rootPath, "src", "data", "map.json");
const mapData = JSON.parse(fs.readFileSync(mapPath, "utf8"));

function isBorderTile(x, y) {
  return x === 0 || y === 0 || x === mapData.roomWidth - 1 || y === mapData.roomHeight - 1;
}

function explicitTileAt(room, x, y) {
  return (room.tiles || []).find((tile) => tile.x === x && tile.y === y) || null;
}

function defaultTileAt(room, x, y) {
  const definition = isBorderTile(x, y) ? room.defaultBorder : room.defaultGround;

  if (!definition) {
    return null;
  }

  return {
    id: `default_${x}_${y}`,
    x,
    y,
    isDefault: true,
    ...definition,
  };
}

function effectiveTileAt(room, x, y) {
  return explicitTileAt(room, x, y) || defaultTileAt(room, x, y);
}

function isDestructible(tile) {
  return Boolean(tile && (tile.tileType === "DestructableCheck" || tile.typeOverride === "DestructableCheck"));
}

function vulnerabilityBase(value) {
  return String(value || "").split(":")[0];
}

function hasVulnerability(tile, type) {
  return (tile.vulnerable || []).map(vulnerabilityBase).includes(type);
}

const mismatches = [];

for (const room of mapData.rooms || []) {
  for (let y = 0; y < mapData.roomHeight; y += 1) {
    for (let x = 0; x < mapData.roomWidth; x += 1) {
      const tile = effectiveTileAt(room, x, y);

      if (!isDestructible(tile)) {
        continue;
      }

      const hasBomb = hasVulnerability(tile, "bomb");
      const hasPickaxe = hasVulnerability(tile, "pickaxe");

      if (hasBomb === hasPickaxe) {
        continue;
      }

      mismatches.push({
        room: room.id || `room_${room.x}_${room.y}`,
        roomX: room.x,
        roomY: room.y,
        tileId: tile.id || "",
        tileX: x,
        tileY: y,
        source: tile.isDefault ? (isBorderTile(x, y) ? "defaultBorder" : "defaultGround") : "explicit",
        hasBomb,
        hasPickaxe,
        vulnerable: tile.vulnerable || [],
        expectedDrop: tile.expectedDrop || "",
        checkKey: tile.checkKey || "",
      });
    }
  }
}

console.log(`Checked ${mapData.rooms.length} rooms for bomb/pickaxe destructible vulnerability mismatches.`);

if (!mismatches.length) {
  console.log("No mismatches found.");
  process.exit(0);
}

console.log(`Found ${mismatches.length} mismatches:`);
console.log("");

for (const mismatch of mismatches) {
  const missing = mismatch.hasBomb ? "missing pickaxe" : "missing bomb";
  const drop = mismatch.expectedDrop || mismatch.checkKey;
  const dropText = drop ? ` drop=${drop}` : "";

  console.log(
    [
      `${mismatch.room} (${mismatch.roomX},${mismatch.roomY})`,
      `tile (${mismatch.tileX},${mismatch.tileY})`,
      mismatch.source,
      missing,
      `vulnerable=[${mismatch.vulnerable.join(", ")}]`,
      `id=${mismatch.tileId}${dropText}`,
    ].join(" | ")
  );
}

