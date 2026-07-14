const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const locations = JSON.parse(fs.readFileSync(path.join(root, "archipelago", "data", "locations.json"), "utf8"));
const guardedChests = new Set([
  "Small Beach: Chest #2",
  "Nega Slime's Lair: Chest #1",
  "Forgotten Graves: Chest #1",
  "Forgotten Graves: Chest #2",
  "Miner's Grave: Chest #3",
  "Slime Stock: Chest",
  "Goopy Switchback: Chest",
  "Slime Smile: Chest",
  "Slime Clusters: Chest",
  "Snake Wave: Chest",
  "Moist Mountain: Chest",
  "Hodgepodge Harangue: Chest",
  "Dilapidated Trail: Chest",
  "Southwest Slimelines: Chest",
]);

function hasRequirement(location, item, minimumAmount = 1) {
  return location.requirements.some((row) => row.some((requirement) => (
    requirement.item === item && requirement.amount >= minimumAmount
  )));
}

function graphicsLevel(location) {
  const levels = location.requirements.flatMap((row) => row
    .filter((requirement) => requirement.item === "Graphics")
    .map((requirement) => requirement.amount));

  return levels.length ? Math.max(...levels) : 0;
}

test("chest weapon graphics", () => {
  const invalid = locations.filter((location) => {
    if (location.category !== "chest") {
      return false;
    }

    if (guardedChests.has(location.name)) {
      return false;
    }

    const needsGraphics2 = hasRequirement(location, "Bombs") || hasRequirement(location, "Pickaxe");
    const needsGraphics1 = hasRequirement(location, "Sword") ||
      hasRequirement(location, "Fire") ||
      hasRequirement(location, "Gun", 2) ||
      hasRequirement(location, "Water Walkers");
    const expectedGraphics = needsGraphics2 ? 2 : (needsGraphics1 ? 1 : 0);

    return expectedGraphics > 0 && graphicsLevel(location) < expectedGraphics;
  }).map((location) => ({
    name: location.name,
    graphics: graphicsLevel(location),
  }));

  assert.deepEqual(invalid, []);
});
