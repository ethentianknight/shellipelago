const fs = require("fs");
const path = require("path");

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
const outputArchipelagoPath = path.join(outputPath, "archipelago");
const apworldPath = path.join(outputArchipelagoPath, "shellipelago.apworld");
const sourceApworldPath = path.join(sourcePath, "shellipelago.apworld");
const sourceGameZipPath = path.join(sourcePath, "shellipelago.zip");
const indexPath = path.join(rootPath, "index.html");
const registryPath = path.join(sourcePath, "registry.js");
const cssPath = path.join(sourcePath, "main.css");
const mapPath = path.join(sourcePath, "data", "map.json");
const tilesetDataPath = path.join(sourcePath, "data", "tileset.json");
const outputIndexPath = path.join(outputPath, "index.html");

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

function getTilesetDataScript() {
  const tilesetData = fs.existsSync(tilesetDataPath) ? JSON.parse(readText(tilesetDataPath)) : { tiles: {} };

  return "<script>\nwindow.shellipelagoTilesetData = " + JSON.stringify(tilesetData, null, 2) + ";\n</script>";
}

function getCreditsScript() {
  const credits = fs.existsSync(creditsPath) ? readText(creditsPath) : "";

  return "<script>\nwindow.shellipelagoCredits = " + JSON.stringify(credits) + ";\n</script>";
}

const indexSource = readText(indexPath);
const registrySource = readText(registryPath);
const cssSource = readText(cssPath);
const templateHtml = getTemplateHtml();
const templateScript = getTemplateScript();
const apworldScript = getApworldScript();
const mapScript = getMapScript();
const tilesetDataScript = getTilesetDataScript();
const creditsScript = getCreditsScript();
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
const outputIndex = outputWithTemplates.replace(/<script\s+src=["']src\/main\.js["']><\/script>/, templateScript + "\n" + apworldScript + "\n" + mapScript + "\n" + tilesetDataScript + "\n" + creditsScript + "\n" + bundledScript);

if (outputWithStyle === indexSource) {
  throw new Error("Could not find src/main.css link in index.html");
}

if (outputIndex === outputWithTemplates) {
  throw new Error("Could not find src/main.js script tag in index.html");
}

fs.mkdirSync(outputPath, { recursive: true });
fs.writeFileSync(outputIndexPath, outputIndex, "utf8");
copyDirectory(archipelagoPath, outputArchipelagoPath);
copyDirectory(imagePath, path.join(outputPath, "src", "img"));
copyDirectory(dataPath, path.join(outputPath, "src", "data"));
copyDirectory(fontPath, path.join(outputPath, "src", "font"));
copyDirectory(soundPath, path.join(outputPath, "src", "sound"));
copyDirectory(vendorPath, path.join(outputPath, "src", "vendor"));

if (fs.existsSync(sourceApworldPath)) {
  fs.copyFileSync(sourceApworldPath, path.join(outputPath, "src", "shellipelago.apworld"));
}

if (fs.existsSync(sourceGameZipPath)) {
  fs.copyFileSync(sourceGameZipPath, path.join(outputPath, "src", "shellipelago.zip"));
}

console.log("Built " + path.relative(rootPath, outputIndexPath));
console.log("Copied " + path.relative(rootPath, outputArchipelagoPath));
