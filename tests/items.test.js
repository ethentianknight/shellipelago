const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const items = JSON.parse(fs.readFileSync(path.join(root, "archipelago", "data", "items.json"), "utf8"));
const locations = JSON.parse(fs.readFileSync(path.join(root, "archipelago", "data", "locations.json"), "utf8"));

function placedCounts() {
  return locations.reduce((counts, location) => {
    const key = location.drop_key;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

test("data has all important items placed", (context) => {
  const counts = placedCounts();
  const importantItems = items.filter((item) => item.classification === "progression" || item.classification === "useful");
  const missing = importantItems.flatMap((item) => {
    const placed = counts[item.key] || 0;
    const required = Number(item.count) || 1;
    return placed < required ? [`${item.name}: ${placed}/${required}`] : [];
  });

  context.diagnostic(`HP upgrades placed: ${counts.hp || 0}`);
  context.diagnostic(`Round upgrades placed: ${counts.rounds || 0}`);
  assert.deepEqual(missing, [], `Missing important item placements:\n${missing.join("\n")}`);
});

test("requirements do not exceed item counts", () => {
  const maximumByName = new Map(items.map((item) => [item.name, Number(item.count) || 1]));
  const virtualMaximums = new Map([
    ["Tank", Math.min(
      maximumByName.get("Tank Treads") || 0,
      maximumByName.get("Tank Chassis") || 0,
      maximumByName.get("Tank Cannon") || 0,
    )],
  ]);
  const invalid = [];

  locations.forEach((location) => {
    (location.requirements || []).forEach((row) => {
      row.forEach((requirement) => {
        const maximum = maximumByName.get(requirement.item) ?? virtualMaximums.get(requirement.item);
        const amount = Number(requirement.amount) || 1;
        if (maximum === undefined || amount > maximum) {
          invalid.push(`${location.name}: ${requirement.item} ${amount}/${maximum ?? "missing"}`);
        }
      });
    });
  });

  assert.deepEqual(invalid, [], `Invalid location requirements:\n${invalid.join("\n")}`);
});
