const fs = require("fs");
const path = require("path");
const versionManager = require("./version-manager");

const rootPath = path.resolve(__dirname, "..");
const dataPath = path.join(rootPath, "src", "data");
const sourceMapPath = path.join(dataPath, "map.json");
const version = versionManager.readVersion();
const versionedMapDirectory = path.join(dataPath, version);
const versionedMapPath = path.join(versionedMapDirectory, "map.json");

if (!fs.existsSync(sourceMapPath)) {
  throw new Error("Could not find src/data/map.json to snapshot.");
}

fs.mkdirSync(versionedMapDirectory, { recursive: true });
fs.copyFileSync(sourceMapPath, versionedMapPath);

console.log("Snapshotted src/data/map.json to src/data/" + version + "/map.json");
