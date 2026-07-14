const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const locations = JSON.parse(fs.readFileSync(path.join(root, "archipelago", "data", "locations.json"), "utf8"));

function hasRequirement(location, item, minimumAmount = 1) {
  return location.requirements.some((row) => row.some((requirement) => (
    requirement.item === item && requirement.amount >= minimumAmount
  )));
}

test("gun requires two max rounds", () => {
  const invalid = locations
    .filter((location) => (
      location.category === "chest" &&
      hasRequirement(location, "Gun") &&
      !location.requirements.some((row) => {
        const expectedItems = hasRequirement(location, "Steel Toe") ? ["Max Rounds", "Steel Toe", "Sword"] : ["Max Rounds", "Sword"];
        const actualItems = row.map((requirement) => requirement.item).sort();

        return JSON.stringify(actualItems) === JSON.stringify(expectedItems) &&
          row.some((requirement) => requirement.item === "Max Rounds" && requirement.amount >= 2);
      })
    ))
    .map((location) => location.name);

  assert.deepEqual(invalid, []);
});
