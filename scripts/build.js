const fs = require("fs");
const path = require("path");
const buildPaths = require("./build-paths");

const rootPath = path.resolve(__dirname, "..");
const sourcePath = path.join(rootPath, "src");
const archipelagoPath = path.join(rootPath, "archipelago");
const templatesPath = path.join(sourcePath, "templates");
const imagePath = path.join(sourcePath, "img");
const dataPath = path.join(sourcePath, "data");
const fontPath = path.join(sourcePath, "font");
const soundPath = path.join(sourcePath, "sound");
const vendorPath = path.join(sourcePath, "vendor");
const creditsPath = path.join(sourcePath, "credits.md");
const outputPath = path.join(rootPath, "build");
const outputWebPath = path.join(outputPath, buildPaths.webFolderName);
const outputArchipelagoPath = path.join(outputPath, buildPaths.archipelagoFolderName);
const apworldPath = path.join(outputArchipelagoPath, "shellipelago.apworld");
const sourceApworldPath = path.join(sourcePath, "shellipelago.apworld");
const sourceGameZipPath = path.join(sourcePath, "shellipelago.zip");
const indexPath = path.join(rootPath, "index.html");
const registryPath = path.join(sourcePath, "registry.js");
const cssPath = path.join(sourcePath, "main.css");
const mapPath = path.join(sourcePath, "data", "map.json");
const tilesetDataPath = path.join(sourcePath, "data", "tileset.json");
const outputIndexPath = path.join(outputWebPath, "index.html");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function getRegistryModules(registrySource) {
  const modulesMatch = registrySource.match(/var\s+registryModules\s*=\s*\[([\s\S]*?)\];/);

  if (!modulesMatch) {
    throw new Error("Could not find registryModules in src/registry.js");
  }

  const modules = [];
  const modulePattern = /["']([^"']+\.js)["']/g;
  let moduleMatch = modulePattern.exec(modulesMatch[1]);

  while (moduleMatch) {
    modules.push(moduleMatch[1]);
    moduleMatch = modulePattern.exec(modulesMatch[1]);
  }

  return modules;
}

function wrapScript(fileName, source) {
  return [
    "",
    "/* " + fileName + " */",
    source.trim(),
    ""
  ].join("\n");
}

function getBuildScriptSource(fileName, source) {
  if (fileName === "globals.js") {
    return source.replace("var isBuild = false;", "var isBuild = true;");
  }

  return source;
}

function copyDirectory(sourceDirectory, targetDirectory) {
  if (!fs.existsSync(sourceDirectory)) {
    return;
  }

  fs.mkdirSync(targetDirectory, { recursive: true });

  fs.readdirSync(sourceDirectory, { withFileTypes: true }).forEach((entry) => {
    const sourceEntryPath = path.join(sourceDirectory, entry.name);
    const targetEntryPath = path.join(targetDirectory, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourceEntryPath, targetEntryPath);
      return;
    }

    fs.copyFileSync(sourceEntryPath, targetEntryPath);
  });
}

function getTemplateHtml() {
  if (!fs.existsSync(templatesPath)) {
    return "";
  }

  return fs.readdirSync(templatesPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => {
      const templateName = path.basename(entry.name, ".html");
      const templateSource = extractShardHtml(readText(path.join(templatesPath, entry.name)));

      return '<template data-template-name="' + templateName + '">\n' + templateSource + "\n</template>";
    })
    .join("\n");
}

function extractShardHtml(shardSource) {
  const shardMatch = shardSource.match(/<template\s+data-shard[^>]*>([\s\S]*?)<\/template>/i);

  return (shardMatch ? shardMatch[1] : shardSource).trim();
}

function getTemplateScript() {
  const templateMap = {};

  if (!fs.existsSync(templatesPath)) {
    return "";
  }

  fs.readdirSync(templatesPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .forEach((entry) => {
      const templateName = path.basename(entry.name, ".html");
      templateMap[templateName] = extractShardHtml(readText(path.join(templatesPath, entry.name)));
    });

  return "<script>\nwindow.shellipelagoTemplates = " + JSON.stringify(templateMap, null, 2) + ";\n</script>";
}

function getApworldScript() {
  if (!fs.existsSync(apworldPath)) {
    return "<script>\nwindow.shellipelagoApworldBase64 = \"\";\n</script>";
  }

  const apworldBase64 = fs.readFileSync(apworldPath).toString("base64");

  return "<script>\nwindow.shellipelagoApworldBase64 = " + JSON.stringify(apworldBase64) + ";\n</script>";
}

function getMapScript() {
  const mapData = fs.existsSync(mapPath) ? JSON.parse(readText(mapPath)) : { width: 64, height: 64, cells: [] };

  return "<script>\nwindow.shellipelagoMapData = " + JSON.stringify(mapData, null, 2) + ";\n</script>";
}

function getVersionedMapScript() {
  const versionedMaps = {};

  if (fs.existsSync(dataPath)) {
    fs.readdirSync(dataPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^\d+\.\d+$/.test(entry.name))
      .forEach((entry) => {
        const versionedMapPath = path.join(dataPath, entry.name, "map.json");

        if (fs.existsSync(versionedMapPath)) {
          versionedMaps[entry.name] = JSON.parse(readText(versionedMapPath));
        }
      });
  }

  return "<script>\nwindow.shellipelagoVersionedMapData = " + JSON.stringify(versionedMaps, null, 2) + ";\n</script>";
}

function getTilesetDataScript() {
  const tilesetData = fs.existsSync(tilesetDataPath) ? JSON.parse(readText(tilesetDataPath)) : { tiles: {} };

  return "<script>\nwindow.shellipelagoTilesetData = " + JSON.stringify(tilesetData, null, 2) + ";\n</script>";
}

function getCreditsScript() {
  const credits = fs.existsSync(creditsPath) ? readText(creditsPath) : "";

  return "<script>\nwindow.shellipelagoCredits = " + JSON.stringify(credits) + ";\n</script>";
}

function getImageDataScript() {
  const imageData = {};
  const mimeTypes = {
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
  };

  function addImages(directoryPath) {
    fs.readdirSync(directoryPath, { withFileTypes: true }).forEach((entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        addImages(entryPath);
        return;
      }

      const mimeType = mimeTypes[path.extname(entry.name).toLowerCase()];

      if (!mimeType) {
        return;
      }

      const relativePath = path.relative(rootPath, entryPath).split(path.sep).join("/");
      imageData[relativePath] = "data:" + mimeType + ";base64," + fs.readFileSync(entryPath).toString("base64");
    });
  }

  if (fs.existsSync(imagePath)) {
    addImages(imagePath);
  }

  return "<script>\nwindow.shellipelagoImageData = " + JSON.stringify(imageData) + ";\n</script>";
}

function getFinalRunDataScript() {
  const threePath = path.join(vendorPath, "three", "three.module.js");
  const rapierPath = path.join(vendorPath, "rapier3d", "rapier.es.js");
  const rapierWasmPath = path.join(vendorPath, "rapier3d", "rapier_wasm3d_bg.wasm");

  if (!fs.existsSync(threePath) || !fs.existsSync(rapierPath) || !fs.existsSync(rapierWasmPath)) {
    return "<script>\nwindow.shellipelagoFinalRunData = null;\n</script>";
  }

  const finalRunData = {
    threeModuleUrl: "data:text/javascript;base64," + fs.readFileSync(threePath).toString("base64"),
    rapierModuleUrl: "data:text/javascript;base64," + fs.readFileSync(rapierPath).toString("base64"),
    rapierWasmBase64: fs.readFileSync(rapierWasmPath).toString("base64")
  };

  return "<script>\nwindow.shellipelagoFinalRunData = " + JSON.stringify(finalRunData) + ";\n</script>";
}

const indexSource = readText(indexPath);
const registrySource = readText(registryPath);
const cssSource = readText(cssPath);
const templateHtml = getTemplateHtml();
const templateScript = getTemplateScript();
const apworldScript = getApworldScript();
const mapScript = getMapScript();
const versionedMapScript = getVersionedMapScript();
const tilesetDataScript = getTilesetDataScript();
const creditsScript = getCreditsScript();
const imageDataScript = getImageDataScript();
const finalRunDataScript = getFinalRunDataScript();
const registryModules = getRegistryModules(registrySource);
const scriptSources = [wrapScript("registry.js", registrySource)];

registryModules.forEach((moduleFile) => {
  const modulePath = path.join(sourcePath, moduleFile);
  scriptSources.push(wrapScript(moduleFile, getBuildScriptSource(moduleFile, readText(modulePath))));
});

const bundledStyle = "<style>\n" + cssSource.trim() + "\n</style>";
const bundledScript = "<script>\n" + scriptSources.join("\n") + "\n</script>";
const outputWithStyle = indexSource.replace(/<link\s+rel=["']stylesheet["']\s+href=["']src\/main\.css["']>/, bundledStyle);
const outputWithTemplates = outputWithStyle.replace(/<body>/, "<body>\n" + templateHtml);
const outputIndex = outputWithTemplates.replace(/<script\s+src=["']src\/main\.js["']><\/script>/, templateScript + "\n" + apworldScript + "\n" + mapScript + "\n" + versionedMapScript + "\n" + tilesetDataScript + "\n" + creditsScript + "\n" + imageDataScript + "\n" + finalRunDataScript + "\n" + bundledScript);

if (outputWithStyle === indexSource) {
  throw new Error("Could not find src/main.css link in index.html");
}

if (outputIndex === outputWithTemplates) {
  throw new Error("Could not find src/main.js script tag in index.html");
}

fs.mkdirSync(outputWebPath, { recursive: true });
fs.writeFileSync(outputIndexPath, outputIndex, "utf8");
copyDirectory(archipelagoPath, outputArchipelagoPath);
copyDirectory(imagePath, path.join(outputWebPath, "src", "img"));
copyDirectory(dataPath, path.join(outputWebPath, "src", "data"));
copyDirectory(fontPath, path.join(outputWebPath, "src", "font"));
copyDirectory(soundPath, path.join(outputWebPath, "src", "sound"));
copyDirectory(vendorPath, path.join(outputWebPath, "src", "vendor"));

if (fs.existsSync(sourceApworldPath)) {
  fs.copyFileSync(sourceApworldPath, path.join(outputWebPath, "src", "shellipelago.apworld"));
}

if (fs.existsSync(sourceGameZipPath)) {
  fs.copyFileSync(sourceGameZipPath, path.join(outputWebPath, "src", "shellipelago.zip"));
}

console.log("Built " + path.relative(rootPath, outputIndexPath));
console.log("Copied " + path.relative(rootPath, outputArchipelagoPath));
