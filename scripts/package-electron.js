const fs = require("fs");
const path = require("path");
const electronPackager = require("@electron/packager");

const packager = electronPackager.packager || electronPackager.default || electronPackager;

const rootPath = path.resolve(__dirname, "..");
const buildPath = path.join(rootPath, "build");
const stagingPath = path.join(buildPath, "electron-app");
const electronOutputPath = path.join(buildPath, "electron");
const buildIndexPath = path.join(buildPath, "index.html");
const buildSrcPath = path.join(buildPath, "src");
const scriptsPath = path.join(rootPath, "scripts");
const versionManager = require("./version-manager");

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

function writeElectronMain() {
  const mainSource = `const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: "#15181f",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
`;

  fs.writeFileSync(path.join(stagingPath, "electron-main.js"), mainSource, "utf8");
}

function writeElectronPackage() {
  const packageJson = {
    name: "shellipelago",
    productName: "Shellipelago",
    version: versionManager.toSemver(versionManager.readVersion()),
    main: "electron-main.js",
    private: true
  };

  fs.writeFileSync(path.join(stagingPath, "package.json"), JSON.stringify(packageJson, null, 2), "utf8");
}

async function packageElectron() {
  if (!fs.existsSync(buildIndexPath)) {
    throw new Error("Missing built index.html. Run scripts/build.js before packaging Electron.");
  }

  fs.rmSync(stagingPath, { recursive: true, force: true });
  console.log("Cleaning " + path.relative(rootPath, electronOutputPath));
  try {
    fs.rmSync(electronOutputPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 });
  } catch (error) {
    if (error && error.code === "EBUSY") {
      console.warn("Skipped Electron packaging because the previous package is locked.");
      console.warn("Close Shellipelago.exe or any process using build\\electron and rerun npm run package:electron.");
      return;
    }

    throw error;
  }

  fs.mkdirSync(stagingPath, { recursive: true });

  fs.copyFileSync(buildIndexPath, path.join(stagingPath, "index.html"));
  copyDirectory(buildSrcPath, path.join(stagingPath, "src"));
  copyDirectory(scriptsPath, path.join(stagingPath, "scripts"));
  writeElectronMain();
  writeElectronPackage();

  await packager({
    dir: stagingPath,
    out: electronOutputPath,
    overwrite: true,
    platform: process.platform,
    arch: process.arch,
    name: "Shellipelago",
    asar: false,
    appCopyright: "Shellipelago",
    prune: true,
    quiet: true
  });

  fs.rmSync(stagingPath, { recursive: true, force: true });
  console.log("Packaged " + path.relative(rootPath, electronOutputPath));
}

packageElectron().catch((error) => {
  console.error(error);
  process.exit(1);
});
