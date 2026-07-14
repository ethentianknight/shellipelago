const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const map = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "map.json"), "utf8"));
const locations = JSON.parse(fs.readFileSync(path.join(root, "archipelago", "data", "locations.json"), "utf8"));

test("location names are descriptive", () => {
  const invalid = locations.filter((location) => {
    if (location.category === "chest") {
      return !/^.+: Chest(?: #\d+)?$/.test(location.name);
    }

    if (location.category === "enemy") {
      return !/^.+: (Slime|Nega Slime|Snake|Mage|Shopkeep)(?: #\d+)?$/.test(location.name);
    }

    if (location.category === "easy_destructible") {
      return !/^.+: (Rock|Grass|Door|Jar|Stop Sign|House) \(\[\d+,\d+\]\)$/.test(location.name) ||
        location.destructible_type === "Unknown";
    }

    if (location.category === "shop") {
      return !/^.+: Shop #\d+ \(.+\)$/.test(location.name);
    }

    return false;
  }).map((location) => location.name);

  assert.deepEqual(invalid, []);
});

test("chests number only when needed", () => {
  const chestRooms = new Map();

  locations.filter((location) => location.category === "chest").forEach((location) => {
    const roomKey = `${location.room_x},${location.room_y}`;
    const roomLocations = chestRooms.get(roomKey) || [];

    roomLocations.push(location);
    chestRooms.set(roomKey, roomLocations);
  });

  chestRooms.forEach((roomLocations) => {
    roomLocations.forEach((location, index) => {
      if (roomLocations.length === 1) {
        assert.doesNotMatch(location.name, /: Chest #/);
      } else {
        assert.match(location.name, new RegExp(`: Chest #${index + 1}$`));
      }
    });
  });
});

test("shops number left to right", () => {
  const shopRooms = new Map();

  locations.filter((location) => location.category === "shop").forEach((location) => {
    const roomKey = `${location.room_x},${location.room_y}`;
    const roomLocations = shopRooms.get(roomKey) || [];

    roomLocations.push(location);
    shopRooms.set(roomKey, roomLocations);
  });

  shopRooms.forEach((roomLocations) => {
    roomLocations.sort((first, second) => first.tile_x - second.tile_x || first.tile_y - second.tile_y);
    roomLocations.forEach((location, index) => {
      assert.match(location.name, new RegExp(`: Shop #${index + 1} \\(`));
    });
  });
});

test("shopkeeps are named", () => {
  const shopkeeps = locations.filter((location) => location.category === "enemy" && location.enemy_type === "Shopkeep");

  assert.equal(shopkeeps.length, 2);
  shopkeeps.forEach((location) => assert.match(location.name, /: Shopkeep(?: #\d+)?$/));
});

test("one stop sign exists", () => {
  const stopSignSprites = new Set(["2,26", "2,27", "3,26", "3,27"]);
  const stopSigns = map.rooms.flatMap((room) => room.tiles || []).filter((tile) => {
    const sprite = tile.sprite || {};

    return sprite.source === "tileset" && stopSignSprites.has(`${sprite.x},${sprite.y}`);
  });

  assert.equal(stopSigns.length, 1);
});
