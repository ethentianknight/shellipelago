const fs = require("fs");
const path = require("path");
const buildPaths = require("./build-paths");

const rootPath = path.resolve(__dirname, "..");
const outputPath = path.join(rootPath, "build");

function shouldPreserve(entry) {
  return entry.isDirectory() && entry.name === buildPaths.electronFolderName;
}

if (path.relative(rootPath, outputPath) !== "build") {
  throw new Error("Refusing to clean unexpected build path: " + outputPath);
}

fs.mkdirSync(outputPath, { recursive: true });

fs.readdirSync(outputPath, { withFileTypes: true }).forEach((entry) => {
  if (shouldPreserve(entry)) {
    return;
  }

  fs.rmSync(path.join(outputPath, entry.name), {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 250
  });
});

console.log("Cleaned " + path.relative(rootPath, outputPath) + " except current versioned Electron package");
