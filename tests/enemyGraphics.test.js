const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const map = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "map.json"), "utf8"));
const locations = JSON.parse(fs.readFileSync(path.join(root, "archipelago", "data", "locations.json"), "utf8"));

test("enemy graphics preserved", () => {
  const missing = [];

  map.rooms.forEach((room) => {
    room.tiles.filter((tile) => tile.tileType === "Enemy").forEach((tile) => {
      const graphics = (tile.requirements || []).flat().filter((requirement) => String(requirement).startsWith("graphics:"));

      graphics.forEach((requirement) => {
        const level = Number(requirement.split(":")[1]);
        const location = locations.find((candidate) => candidate.category === "enemy" &&
          candidate.room_x === room.x && candidate.room_y === room.y &&
          candidate.tile_x === tile.x && candidate.tile_y === tile.y);
        const generatedLevel = location ? Math.max(0, ...location.requirements.flatMap((row) => row
          .filter((entry) => entry.item === "Graphics")
          .map((entry) => entry.amount))) : 0;

        if (!location || generatedLevel < level) {
          missing.push({ enemy: `${room.name} ${tile.x},${tile.y}`, expected: level, actual: generatedLevel });
        }
      });
    });
  });

  assert.deepEqual(missing, []);
});
