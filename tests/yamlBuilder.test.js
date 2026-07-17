const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const downloadManagerSource = fs.readFileSync(
  path.join(__dirname, "..", "src", "downloadManager.js"),
  "utf8"
);
const introScreenSource = fs.readFileSync(
  path.join(__dirname, "..", "src", "introScreen.js"),
  "utf8"
).split('globalsState.loadedModules.push("introScreen");')[0];

function createDownloadManager() {
  const sandbox = {
    Blob,
    JSON,
    Math,
    Number,
    Object,
    String,
    globalsState: {
      loadedModules: [],
      shellipelagoVersion: "1.14"
    }
  };

  vm.createContext(sandbox);
  vm.runInContext(downloadManagerSource, sandbox, { filename: "src/downloadManager.js" });
  return sandbox;
}

function createYamlOptions() {
  return {
    slot: "Builder Test",
    progressionBalancing: 50,
    essentialLocal: [],
    essentialNonLocal: [],
    resourceLocal: [],
    resourceNonLocal: [],
    trapPoolLocal: [],
    trapPoolNonLocal: [],
    startInventory: {
      Sword: 2,
      "Max HP": 12,
      "Tank Treads": 1
    },
    startHints: ["Sword"],
    startLocationHints: ["Opening Room: Chest #1"],
    excludeLocations: ["Grasslands: Rock ([2,3])"],
    priorityLocations: ["Castle: Chest #2"],
    shuffleEssentialItems: true,
    shuffleMaxResourceUpgrades: true,
    addEasyDestructibleChecks: false,
    enemiesAreChecks: false,
    shuffleShops: true,
    showEssentialPickupHints: true,
    enemiesAreHints: false,
    addTrapsToPool: false,
    trapFillPercentage: 25,
    trapPoolSpawn: [],
    trapWeights: {},
    otherPlayersCanFindItemPoolDrops: false,
    ringLink: false,
    energyLink: false,
    deathLink: false,
    trapLink: false,
    itemLink: false
  };
}

function createIntroScreenParser() {
  const sandbox = {
    Array,
    Boolean,
    JSON,
    Math,
    Number,
    Object,
    String,
    console,
    document: {
      body: {
        appendChild() {}
      },
      createElement() {
        return {};
      }
    }
  };

  vm.createContext(sandbox);
  vm.runInContext(introScreenSource, sandbox, { filename: "src/introScreen.js" });
  return sandbox;
}

test("YAML builder writes Archipelago common item and location options", () => {
  const sandbox = createDownloadManager();
  const yaml = sandbox.downloadManagerBuildYaml(createYamlOptions());

  assert.match(yaml, /  start_inventory:\n    Sword: 2\n    Max HP: 12\n    Tank Treads: 1/);
  assert.match(yaml, /  start_hints:\n    - Sword/);
  assert.match(yaml, /  start_location_hints:\n    - "Opening Room: Chest #1"/);
  assert.match(yaml, /  exclude_locations:\n    - "Grasslands: Rock \(\[2,3\]\)"/);
  assert.match(yaml, /  priority_locations:\n    - "Castle: Chest #2"/);
});

test("YAML builder emits empty common options safely", () => {
  const sandbox = createDownloadManager();
  const options = createYamlOptions();

  options.startInventory = {};
  options.startHints = [];
  options.startLocationHints = [];
  options.excludeLocations = [];
  options.priorityLocations = [];

  const yaml = sandbox.downloadManagerBuildYaml(options);

  assert.match(yaml, /  start_inventory: \{\}/);
  assert.match(yaml, /  start_hints: \[\]/);
  assert.match(yaml, /  start_location_hints: \[\]/);
  assert.match(yaml, /  exclude_locations: \[\]/);
  assert.match(yaml, /  priority_locations: \[\]/);
});

test("YAML builder imports starting items and quoted location lists", () => {
  const downloadManager = createDownloadManager();
  const introScreen = createIntroScreenParser();
  const parsed = introScreen.introScreenParseYamlOptions(
    downloadManager.downloadManagerBuildYaml(createYamlOptions())
  );

  assert.equal(parsed.startInventory.Sword, 2);
  assert.equal(parsed.startInventory["Max HP"], 12);
  assert.equal(parsed.startInventory["Tank Treads"], 1);
  assert.deepEqual(Array.from(parsed.startHints), ["Sword"]);
  assert.deepEqual(Array.from(parsed.startLocationHints), ["Opening Room: Chest #1"]);
  assert.deepEqual(Array.from(parsed.excludeLocations), ["Grasslands: Rock ([2,3])"]);
  assert.deepEqual(Array.from(parsed.priorityLocations), ["Castle: Chest #2"]);
});

test("YAML builder recognizes chest checks without matching chest room names", () => {
  const introScreen = createIntroScreenParser();

  assert.equal(introScreen.introScreenIsYamlChestLocation("The Start: Chest #1"), true);
  assert.equal(introScreen.introScreenIsYamlChestLocation("Trapped Chest: Snake #1"), false);
  assert.equal(introScreen.introScreenGetYamlItemMaximum("Sword"), 3);
  assert.equal(introScreen.introScreenGetYamlItemMaximum("Max HP"), 30);
});
