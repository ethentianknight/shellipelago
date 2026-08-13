const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const buildPaths = require("./build-paths");

const rootPath = path.resolve(__dirname, "..");
const sourcePath = path.join(rootPath, "src");
const outputPath = path.join(buildPaths.buildPath, buildPaths.hostedFolderName);
const outputSourcePath = path.join(outputPath, "src");

function copyDirectory(sourceDirectory, targetDirectory) {
  fs.mkdirSync(targetDirectory, { recursive: true });
  fs.readdirSync(sourceDirectory, { withFileTypes: true }).forEach((entry) => {
    const sourceEntryPath = path.join(sourceDirectory, entry.name);
    const targetEntryPath = path.join(targetDirectory, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourceEntryPath, targetEntryPath);
      return;
    }

    if (entry.name.toLowerCase() === "shellipelago.zip") {
      return;
    }

    fs.copyFileSync(sourceEntryPath, targetEntryPath);
  });
}

function addPwaMarkup(indexSource) {
  const headMarkup = [
    '  <meta name="theme-color" content="#15181f">',
    '  <link rel="manifest" href="manifest.webmanifest">',
    '  <link rel="icon" href="src/pwa-icon.svg" type="image/svg+xml">'
  ].join("\n");
  const registration = [
    "  <script>",
    "    if (\"serviceWorker\" in navigator && location.protocol !== \"file:\") {",
    "      window.addEventListener(\"load\", function () {",
    "        navigator.serviceWorker.register(\"./service-worker.js\").catch(function (error) {",
    "          console.error(\"Unable to register Shellipelago offline support.\", error);",
    "        });",
    "      });",
    "    }",
    "  </script>"
  ].join("\n");

  return indexSource
    .replace("</head>", headMarkup + "\n</head>")
    .replace("</body>", registration + "\n</body>");
}

function listFiles(directory, relativeDirectory) {
  const relativeBase = relativeDirectory || "";
  let files = [];

  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.posix.join(relativeBase, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(listFiles(fullPath, relativePath));
      return;
    }

    files.push(relativePath);
  });

  return files.sort();
}

function shouldPrecache(relativePath) {
  if (relativePath === "service-worker.js") {
    return false;
  }

  if (/^src\/data\/\d+\.\d+\//.test(relativePath)) {
    return false;
  }

  return !relativePath.toLowerCase().endsWith("shellipelago.zip");
}

function getCacheSignature(files) {
  const hash = crypto.createHash("sha256");

  files.forEach((relativePath) => {
    hash.update(relativePath);
    hash.update(fs.readFileSync(path.join(outputPath, ...relativePath.split("/"))));
  });

  return hash.digest("hex").slice(0, 16);
}

function encodeUrlPath(relativePath) {
  return "./" + relativePath.split("/").map(encodeURIComponent).join("/");
}

function writeManifest() {
  const manifest = {
    name: "Shellipelago",
    short_name: "Shellipelago",
    description: "Shellipelago Archipelago client",
    id: "./",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#15181f",
    theme_color: "#15181f",
    icons: [
      {
        src: "src/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(path.join(outputPath, "manifest.webmanifest"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

function writeServiceWorker() {
  const files = listFiles(outputPath).filter(shouldPrecache);
  const cacheName = "shellipelago-hosted-" + getCacheSignature(files);
  const urls = files.map(encodeUrlPath);
  const source = [
    "const CACHE_NAME = " + JSON.stringify(cacheName) + ";",
    "const PRECACHE_URLS = " + JSON.stringify(urls, null, 2) + ";",
    "",
    "self.addEventListener(\"install\", function (event) {",
    "  event.waitUntil((async function () {",
    "    const cache = await caches.open(CACHE_NAME);",
    "    for (const url of PRECACHE_URLS) {",
    "      await cache.add(new Request(url, { cache: \"reload\" }));",
    "    }",
    "    await self.skipWaiting();",
    "  }()));",
    "});",
    "",
    "self.addEventListener(\"activate\", function (event) {",
    "  event.waitUntil((async function () {",
    "    const names = await caches.keys();",
    "    await Promise.all(names.filter(function (name) {",
    "      return name.startsWith(\"shellipelago-hosted-\") && name !== CACHE_NAME;",
    "    }).map(function (name) {",
    "      return caches.delete(name);",
    "    }));",
    "    await self.clients.claim();",
    "  }()));",
    "});",
    "",
    "self.addEventListener(\"fetch\", function (event) {",
    "  const request = event.request;",
    "  const requestUrl = new URL(request.url);",
    "",
    "  if (request.method !== \"GET\" || requestUrl.origin !== self.location.origin) {",
    "    return;",
    "  }",
    "",
    "  event.respondWith((async function () {",
    "    const cached = await caches.match(request);",
    "    if (cached) {",
    "      return cached;",
    "    }",
    "",
    "    try {",
    "      const response = await fetch(request);",
    "      if (response.ok) {",
    "        const cache = await caches.open(CACHE_NAME);",
    "        await cache.put(request, response.clone());",
    "      }",
    "      return response;",
    "    } catch (error) {",
    "      if (request.mode === \"navigate\") {",
    "        return caches.match(\"./index.html\");",
    "      }",
    "      throw error;",
    "    }",
    "  }()));",
    "});",
    ""
  ].join("\n");

  fs.writeFileSync(path.join(outputPath, "service-worker.js"), source, "utf8");
  return { cacheName, fileCount: files.length };
}

fs.rmSync(outputPath, { recursive: true, force: true });
fs.mkdirSync(outputPath, { recursive: true });
fs.writeFileSync(
  path.join(outputPath, "index.html"),
  addPwaMarkup(fs.readFileSync(path.join(rootPath, "index.html"), "utf8")),
  "utf8"
);
copyDirectory(sourcePath, outputSourcePath);
writeManifest();
const result = writeServiceWorker();

console.log(
  "Built hosted PWA " + path.relative(rootPath, outputPath) +
  " with " + result.fileCount + " offline files (" + result.cacheName + ")"
);
