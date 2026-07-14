const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const now = new Date();
const stamp = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
  String(now.getHours()).padStart(2, "0"),
  String(now.getMinutes()).padStart(2, "0"),
  String(now.getSeconds()).padStart(2, "0"),
].join("");
const outputDirectory = path.join(__dirname, "output", stamp);
const testFiles = fs.readdirSync(__dirname)
  .filter((fileName) => fileName.endsWith(".test.js"))
  .sort()
  .map((fileName) => path.join(__dirname, fileName));
const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  cwd: path.resolve(__dirname, ".."),
  encoding: "utf8",
});
const output = `${result.stdout || ""}${result.stderr || ""}`;

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, "results.txt"), output);
process.stdout.write(output);
process.exitCode = result.status || 0;
