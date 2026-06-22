const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const rootPath = path.resolve(__dirname, "..");
const buildPath = path.join(rootPath, "build");
const outPath = path.join(buildPath, "out");
const stagingRootPath = path.join(buildPath, "package-staging");
const sourceZipPath = path.join(rootPath, "src", "shellipelago.zip");

function assertInsideRoot(targetPath) {
  const relativePath = path.relative(rootPath, targetPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Refusing to write outside project root: " + targetPath);
  }
}

function copyDirectory(sourceDirectory, targetDirectory, shouldSkip) {
  if (!fs.existsSync(sourceDirectory)) {
    return;
  }

  fs.mkdirSync(targetDirectory, { recursive: true });

  fs.readdirSync(sourceDirectory, { withFileTypes: true }).forEach((entry) => {
    const sourceEntryPath = path.join(sourceDirectory, entry.name);
    const targetEntryPath = path.join(targetDirectory, entry.name);

    if (shouldSkip && shouldSkip(sourceEntryPath, entry)) {
      return;
    }

    if (entry.isDirectory()) {
      copyDirectory(sourceEntryPath, targetEntryPath, shouldSkip);
      return;
    }

    fs.copyFileSync(sourceEntryPath, targetEntryPath);
  });
}

function stageAppFiles(stagingPath, options) {
  const skipGameZip = options && options.skipGameZip;

  fs.mkdirSync(stagingPath, { recursive: true });
  fs.copyFileSync(path.join(rootPath, "index.html"), path.join(stagingPath, "index.html"));
  copyDirectory(path.join(rootPath, "src"), path.join(stagingPath, "src"), (sourceEntryPath, entry) => {
    if (!skipGameZip || entry.isDirectory()) {
      return false;
    }

    return path.basename(sourceEntryPath).toLowerCase() === "shellipelago.zip";
  });
  copyDirectory(path.join(rootPath, "scripts"), path.join(stagingPath, "scripts"));
}

function stageBuiltHtml(stagingPath) {
  fs.mkdirSync(stagingPath, { recursive: true });
  fs.copyFileSync(path.join(buildPath, "index.html"), path.join(stagingPath, "index.html"));
  copyDirectory(path.join(buildPath, "src"), path.join(stagingPath, "src"), (sourceEntryPath, entry) => {
    if (entry.isDirectory()) {
      return false;
    }

    return path.basename(sourceEntryPath).toLowerCase() === "shellipelago.zip";
  });
}

function quotePowerShell(value) {
  return "'" + String(value).replace(/'/g, "''") + "'";
}

function zipStagingContents(stagingPath, zipPath) {
  assertInsideRoot(stagingPath);
  assertInsideRoot(zipPath);

  if (!fs.existsSync(stagingPath)) {
    throw new Error("Missing staging path: " + stagingPath);
  }

  fs.rmSync(zipPath, { force: true });

  if (!fs.readdirSync(stagingPath).length) {
    throw new Error("No files to zip in staging path: " + stagingPath);
  }

  const command = [
    "$ErrorActionPreference = 'Stop'",
    "Add-Type -AssemblyName System.IO.Compression",
    "Add-Type -AssemblyName System.IO.Compression.FileSystem",
    "$staging = " + quotePowerShell(stagingPath),
    "$zipPath = " + quotePowerShell(zipPath),
    "$stream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::CreateNew)",
    "$zip = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)",
    "try {",
    "Get-ChildItem -LiteralPath $staging -Directory -Recurse | Sort-Object FullName | ForEach-Object {",
    "$rel = ($_.FullName.Substring($staging.Length) -replace '^[\\\\/]+', '').Replace([string][char]92, '/') + '/'",
    "$null = $zip.CreateEntry($rel)",
    "}",
    "Get-ChildItem -LiteralPath $staging -File -Recurse | Sort-Object FullName | ForEach-Object {",
    "$rel = ($_.FullName.Substring($staging.Length) -replace '^[\\\\/]+', '').Replace([string][char]92, '/')",
    "$null = [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)",
    "}",
    "} finally {",
    "$zip.Dispose()",
    "$stream.Dispose()",
    "}"
  ].join("; ");
  const result = childProcess.spawnSync("powershell.exe", ["-NoProfile", "-Command", command], {
    cwd: stagingPath,
    stdio: "inherit",
    windowsHide: true
  });

  if (result.status !== 0) {
    throw new Error("Failed to create zip: " + zipPath);
  }
}

function removeSourceGameZip() {
  [
    path.join(rootPath, "src", "shellipelago.zip"),
    path.join(rootPath, "src", "Shellipelago.zip")
  ].forEach((zipPath) => {
    assertInsideRoot(zipPath);
    fs.rmSync(zipPath, { force: true });
  });
}

function copyApworld() {
  const sourceApworldPath = path.join(buildPath, "archipelago", "shellipelago.apworld");
  const targetApworldPath = path.join(outPath, "shellipelago.apworld");

  if (!fs.existsSync(sourceApworldPath)) {
    throw new Error("Missing built apworld: " + sourceApworldPath);
  }

  fs.copyFileSync(sourceApworldPath, targetApworldPath);
}

function copyFreshGameZipToBuild() {
  const buildGameZipPath = path.join(buildPath, "src", "shellipelago.zip");

  if (!fs.existsSync(path.dirname(buildGameZipPath))) {
    return;
  }

  fs.copyFileSync(sourceZipPath, buildGameZipPath);
}

function packageRelease() {
  const htmlStagingPath = path.join(stagingRootPath, "html");
  const sourceGameWithDownloadStagingPath = path.join(stagingRootPath, "source-game-with-download");
  const electronStagingPath = path.join(buildPath, "electron", "Shellipelago-win32-x64");

  assertInsideRoot(outPath);
  assertInsideRoot(stagingRootPath);
  fs.rmSync(outPath, { recursive: true, force: true });
  fs.rmSync(stagingRootPath, { recursive: true, force: true });
  fs.mkdirSync(outPath, { recursive: true });

  copyApworld();

  removeSourceGameZip();
  stageBuiltHtml(htmlStagingPath);
  zipStagingContents(htmlStagingPath, sourceZipPath);
  copyFreshGameZipToBuild();

  zipStagingContents(htmlStagingPath, path.join(outPath, "Shellipelago HTML.zip"));

  stageAppFiles(sourceGameWithDownloadStagingPath, { skipGameZip: false });
  zipStagingContents(sourceGameWithDownloadStagingPath, path.join(outPath, "Shellipelago.zip"));

  if (!fs.existsSync(electronStagingPath)) {
    throw new Error("Missing Electron package: " + electronStagingPath);
  }

  zipStagingContents(electronStagingPath, path.join(outPath, "Shellipelago-win32-x64.zip"));
  fs.rmSync(stagingRootPath, { recursive: true, force: true });

  console.log("Packaged release files in " + path.relative(rootPath, outPath));
}

packageRelease();
