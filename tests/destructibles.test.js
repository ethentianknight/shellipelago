const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const map = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "map.json"), "utf8"));
const locations = JSON.parse(fs.readFileSync(path.join(root, "archipelago", "data", "locations.json"), "utf8"));
const locationByCoordinate = new Map(locations.map((location) => [
  `${location.room_x},${location.room_y}:${location.tile_x},${location.tile_y}`,
  location,
]));
const graphicsTwoExceptions = new Set([
  "Sandy Cottage: Door ([4,9])",
]);

function destructibles() {
  return map.rooms.flatMap((room) => room.tiles
    .filter((tile) => tile.tileType === "DestructableCheck" || tile.typeOverride === "DestructableCheck")
    .map((tile) => ({ room, tile })));
}

function vulnerabilities(tile) {
  return (tile.vulnerable || []).map((value) => String(value).toLowerCase());
}

function isIgnoredSwordSprite(tile) {
  return tile.sprite && tile.sprite.source === "tileset" && tile.sprite.x === 11 && tile.sprite.y === 13;
}

function graphicsAmount(room, tile) {
  const location = locationByCoordinate.get(`${room.x},${room.y}:${tile.x},${tile.y}`);
  if (!location) {
    return null;
  }
  const graphicsAmounts = location.requirements.flatMap((row) => row
    .filter((requirement) => requirement.item === "Graphics")
    .map((requirement) => requirement.amount));

  return graphicsAmounts.length ? Math.max(...graphicsAmounts) : 0;
}

test("sword implies fire", () => {
  const invalid = destructibles().filter(({ tile }) => {
    const values = vulnerabilities(tile);
    return !isIgnoredSwordSprite(tile) && values.includes("sword") && !values.includes("fire");
  });

  assert.deepEqual(invalid.map(({ room, tile }) => `${room.name}:${tile.id}`), []);
});

test("burnables require graphics 1", () => {
  const invalid = destructibles().filter(({ room, tile }) => (
    graphicsAmount(room, tile) !== null && vulnerabilities(tile).includes("fire") && graphicsAmount(room, tile) < 1
  ));

  assert.deepEqual(invalid.map(({ room, tile }) => `${room.name}:${tile.id}`), []);
});

test("others require graphics 2", () => {
  const invalid = destructibles().filter(({ room, tile }) => (
    graphicsAmount(room, tile) !== null &&
    !vulnerabilities(tile).includes("fire") &&
    graphicsAmount(room, tile) < 2 &&
    !graphicsTwoExceptions.has(locationByCoordinate.get(`${room.x},${room.y}:${tile.x},${tile.y}`)?.name)
  ));

  assert.deepEqual(invalid.map(({ room, tile }) => `${room.name}:${tile.id}`), []);
});

test("gun levels match vulnerabilities", () => {
  const invalid = destructibles().filter(({ room, tile }) => {
    const gunVulnerability = vulnerabilities(tile).find((value) => value === "gun" || value.startsWith("gun:"));
    const location = locationByCoordinate.get(`${room.x},${room.y}:${tile.x},${tile.y}`);
    const requiredLevel = gunVulnerability && gunVulnerability.includes(":") ? Number(gunVulnerability.split(":")[1]) : 1;

    return gunVulnerability && location && location.requirements.some((row) => row.some((requirement) => (
      requirement.item === "Gun" && requirement.amount < requiredLevel
    )));
  });

  assert.deepEqual(invalid.map(({ room, tile }) => `${room.name}:${tile.id}`), []);
});
