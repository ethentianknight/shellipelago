const childProcess = require("child_process");
const path = require("path");
const versionManager = require("./version-manager");

const rootPath = path.resolve(__dirname, "..");

function shouldIncrementVersion(args) {
  const npmIncrement = process.env.npm_config_increment;
  const normalizedArgs = args.map((arg) => String(arg || "").toLowerCase());

  if (String(npmIncrement || "").toLowerCase() === "false") {
    return false;
  }

  return !normalizedArgs.some((arg) => {
    return arg === "--increment=false" ||
      arg === "increment=false" ||
      arg === "--no-increment";
  });
}

function runBuildStep(command, args) {
  childProcess.execFileSync(command, args, {
    cwd: rootPath,
    stdio: "inherit"
  });
}

const incrementVersion = shouldIncrementVersion(process.argv.slice(2));
const version = incrementVersion ? versionManager.incrementVersion() : versionManager.syncVersion();

console.log("Shellipelago version " + version + (incrementVersion ? " (incremented)" : " (unchanged)"));

runBuildStep(process.execPath, ["scripts/snapshot-version-map.js"]);
runBuildStep(process.execPath, ["scripts/clean-build.js"]);
runBuildStep(process.execPath, ["scripts/package-apworld.js"]);
runBuildStep(process.execPath, ["scripts/build.js"]);
runBuildStep(process.execPath, ["scripts/package-electron.js"]);
