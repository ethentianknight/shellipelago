const fs = require("fs");
const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const sourceVersionPath = path.join(rootPath, "src", "version.js");
const globalsPath = path.join(rootPath, "src", "globals.js");
const packagePath = path.join(rootPath, "package.json");
const worldInitPath = path.join(rootPath, "archipelago", "world", "shellipelago", "__init__.py");
const worldMetadataPath = path.join(rootPath, "archipelago", "world", "shellipelago", "archipelago.json");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text, "utf8");
}

function readVersion() {
  const source = readText(sourceVersionPath);
  const match = source.match(/var\s+shellipelagoVersion\s*=\s*"([^"]+)"/);

  if (!match) {
    throw new Error("Could not find shellipelagoVersion in src/version.js");
  }

  return match[1];
}

function getNextVersion(version) {
  const match = String(version || "").match(/^(\d+)\.(\d+)$/);

  if (!match) {
    throw new Error("Expected Shellipelago version to use major.minor format, got: " + version);
  }

  return match[1] + "." + (Number(match[2]) + 1);
}

function toSemver(version) {
  return version + ".0";
}

function replaceRequired(source, pattern, replacement, label) {
  if (!pattern.test(source)) {
    throw new Error("Could not update " + label);
  }

  const nextSource = source.replace(pattern, replacement);

  return nextSource;
}

function writeVersion(version) {
  writeText(
    sourceVersionPath,
    [
      "var shellipelagoVersion = " + JSON.stringify(version) + ";",
      "",
      "if (typeof globalsState !== \"undefined\") {",
      "  globalsState.shellipelagoVersion = shellipelagoVersion;",
      "  globalsState.loadedModules.push(\"version\");",
      "}",
      ""
    ].join("\n")
  );

  writeText(
    globalsPath,
    replaceRequired(
      readText(globalsPath),
      /shellipelagoVersion:\s*"[^"]+"/,
      "shellipelagoVersion: " + JSON.stringify(version),
      "src/globals.js version"
    )
  );

  writeText(
    worldInitPath,
    replaceRequired(
      readText(worldInitPath),
      /__version__\s*=\s*"[^"]+"/,
      "__version__ = " + JSON.stringify(version),
      "APWorld version"
    )
  );

  const packageJson = JSON.parse(readText(packagePath));
  packageJson.version = toSemver(version);
  writeText(packagePath, JSON.stringify(packageJson, null, 2) + "\n");

  const worldMetadata = JSON.parse(readText(worldMetadataPath));
  worldMetadata.world_version = toSemver(version);
  writeText(worldMetadataPath, JSON.stringify(worldMetadata, null, 2) + "\n");
}

function syncVersion() {
  const version = readVersion();
  writeVersion(version);
  return version;
}

function incrementVersion() {
  const version = getNextVersion(readVersion());
  writeVersion(version);
  return version;
}

module.exports = {
  getNextVersion,
  incrementVersion,
  readVersion,
  syncVersion,
  toSemver,
  writeVersion
};
