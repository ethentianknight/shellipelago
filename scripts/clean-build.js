const fs = require("fs");
const path = require("path");

const rootPath = path.resolve(__dirname, "..");
const outputPath = path.join(rootPath, "build");
const preservedDirectoryNames = new Set(["electron"]);

if (path.relative(rootPath, outputPath) !== "build") {
  throw new Error("Refusing to clean unexpected build path: " + outputPath);
}

fs.mkdirSync(outputPath, { recursive: true });

fs.readdirSync(outputPath, { withFileTypes: true }).forEach((entry) => {
  if (preservedDirectoryNames.has(entry.name)) {
    return;
  }

  fs.rmSync(path.join(outputPath, entry.name), {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 250
  });
});

console.log("Cleaned " + path.relative(rootPath, outputPath) + " except electron");
