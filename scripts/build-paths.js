const path = require("path");
const versionManager = require("./version-manager");

const rootPath = path.resolve(__dirname, "..");
const buildPath = path.join(rootPath, "build");
const version = versionManager.readVersion();
const versionTag = "v" + version;

module.exports = {
  rootPath,
  buildPath,
  version,
  versionTag,
  archipelagoFolderName: "archipelago_" + versionTag,
  electronFolderName: "Shellipelago-win32-x64_" + versionTag,
  webFolderName: "shellipelago_web_" + versionTag,
  outFolderName: "out_" + versionTag,
  stagingFolderName: "package-staging_" + versionTag,
  electronStagingFolderName: "electron-app_" + versionTag,
};
