const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const buildAllSource = fs.readFileSync(path.join(__dirname, "..", "scripts", "build-all.js"), "utf8");
const androidSource = fs.readFileSync(path.join(__dirname, "..", "scripts", "package-android.js"), "utf8");
const hostedSource = fs.readFileSync(path.join(__dirname, "..", "scripts", "build-hosted.js"), "utf8");
const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("Android packaging is an opt-in build-all target", () => {
  assert.match(buildAllSource, /function shouldBuildAndroid/);
  assert.match(buildAllSource, /arg === "--android"/);
  assert.match(buildAllSource, /if \(buildAndroid\)/);
});

test("Android package embeds the offline build in a signed WebView APK", () => {
  assert.match(androidSource, /file:\/\/\/android_asset\/index\.html/);
  assert.match(androidSource, /android\.permission\.INTERNET/);
  assert.match(androidSource, /setJavaScriptEnabled\(true\)/);
  assert.match(androidSource, /setDomStorageEnabled\(true\)/);
  assert.match(androidSource, /"src", "font"/);
  assert.match(androidSource, /"src", "img"/);
  assert.match(androidSource, /"src", "sound"/);
  assert.match(androidSource, /apksigner\.bat/);
  assert.match(androidSource, /debug\.keystore/);
});

test("browser, PWA, and Android icons use the player sprite icon", () => {
  assert.match(indexSource, /src\/app-icon-48\.png/);
  assert.match(indexSource, /src\/app-icon-192\.png/);
  assert.match(hostedSource, /src\/app-icon-192\.png/);
  assert.match(hostedSource, /src\/app-icon-512\.png/);
  assert.match(androidSource, /app-icon-512\.png/);
  assert.match(androidSource, /android:icon="@drawable\/app_icon"/);
});
