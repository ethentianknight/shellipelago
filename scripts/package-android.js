const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const buildPaths = require("./build-paths");
const versionManager = require("./version-manager");

const rootPath = buildPaths.rootPath;
const buildPath = buildPaths.buildPath;
const stagingPath = path.join(buildPath, buildPaths.androidStagingFolderName);
const outputPath = path.join(buildPath, buildPaths.androidApkName);
const indexPath = path.join(buildPath, buildPaths.webFolderName, "index.html");
const packageName = "com.ethentianknight.shellipelago";
const minimumApi = 26;

function compareVersions(left, right) {
  const leftParts = left.split(/[.-]/).map((part) => Number(part) || 0);
  const rightParts = right.split(/[.-]/).map((part) => Number(part) || 0);
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    if ((leftParts[index] || 0) !== (rightParts[index] || 0)) return (leftParts[index] || 0) - (rightParts[index] || 0);
  }
  return 0;
}

function findSdkPath() {
  const candidates = [
    process.env.ANDROID_SDK_ROOT,
    process.env.ANDROID_HOME,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Android", "Sdk")
  ].filter(Boolean);
  const sdkPath = candidates.find((candidate) => fs.existsSync(path.join(candidate, "platforms")));
  if (!sdkPath) throw new Error("Android SDK not found. Set ANDROID_SDK_ROOT or install Android Studio.");
  return sdkPath;
}

function findNewestChild(parentPath, requiredFile) {
  if (!fs.existsSync(parentPath)) return null;
  const names = fs.readdirSync(parentPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(parentPath, entry.name, requiredFile)))
    .map((entry) => entry.name)
    .sort(compareVersions);
  return names.length ? path.join(parentPath, names[names.length - 1]) : null;
}

function findJdkPath() {
  const candidates = [
    process.env.JAVA_HOME,
    path.join(process.env.ProgramFiles || "C:\\Program Files", "Android", "Android Studio", "jbr"),
    path.join(process.env.ProgramFiles || "C:\\Program Files", "Eclipse Adoptium", "jdk-17.0.18.8-hotspot")
  ].filter(Boolean);
  const jdkPath = candidates.find((candidate) => fs.existsSync(path.join(candidate, "bin", "javac.exe")));
  if (!jdkPath) throw new Error("JDK not found. Android Studio's bundled JDK or JAVA_HOME is required.");
  return jdkPath;
}

function run(command, args, options) {
  const result = childProcess.spawnSync(command, args, Object.assign({ cwd: stagingPath, encoding: "utf8" }, options || {}));
  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error(path.basename(command) + " failed with exit code " + result.status);
  }
  return result;
}

function copyDirectory(sourceDirectory, targetDirectory) {
  if (!fs.existsSync(sourceDirectory)) return;
  fs.mkdirSync(targetDirectory, { recursive: true });
  fs.readdirSync(sourceDirectory, { withFileTypes: true }).forEach((entry) => {
    const sourcePath = path.join(sourceDirectory, entry.name);
    const targetPath = path.join(targetDirectory, entry.name);
    if (entry.isDirectory()) copyDirectory(sourcePath, targetPath);
    else fs.copyFileSync(sourcePath, targetPath);
  });
}

function writeAndroidSources() {
  const javaPath = path.join(stagingPath, "java", "com", "ethentianknight", "shellipelago");
  fs.mkdirSync(javaPath, { recursive: true });
  fs.mkdirSync(path.join(stagingPath, "assets"), { recursive: true });
  fs.mkdirSync(path.join(stagingPath, "res", "values"), { recursive: true });
  fs.mkdirSync(path.join(stagingPath, "res", "drawable-nodpi"), { recursive: true });
  fs.copyFileSync(indexPath, path.join(stagingPath, "assets", "index.html"));
  copyDirectory(path.join(buildPath, buildPaths.webFolderName, "src", "font"), path.join(stagingPath, "assets", "src", "font"));
  copyDirectory(path.join(buildPath, buildPaths.webFolderName, "src", "img"), path.join(stagingPath, "assets", "src", "img"));
  copyDirectory(path.join(buildPath, buildPaths.webFolderName, "src", "sound"), path.join(stagingPath, "assets", "src", "sound"));
  fs.copyFileSync(path.join(rootPath, "src", "app-icon-512.png"), path.join(stagingPath, "res", "drawable-nodpi", "app_icon.png"));
  fs.writeFileSync(path.join(stagingPath, "res", "values", "strings.xml"), `<?xml version="1.0" encoding="utf-8"?>
<resources><string name="app_name">Shellipelago</string></resources>
`, "utf8");

  fs.writeFileSync(path.join(stagingPath, "AndroidManifest.xml"), `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="${packageName}">
  <uses-permission android:name="android.permission.INTERNET" />
  <application android:allowBackup="true" android:hardwareAccelerated="true" android:icon="@drawable/app_icon" android:label="@string/app_name" android:roundIcon="@drawable/app_icon" android:theme="@android:style/Theme.Material.Light.NoActionBar" android:usesCleartextTraffic="true">
    <activity android:name=".MainActivity" android:configChanges="keyboardHidden|orientation|screenSize" android:exported="true" android:screenOrientation="sensorPortrait">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
  </application>
</manifest>
`, "utf8");

  fs.writeFileSync(path.join(javaPath, "MainActivity.java"), `package ${packageName};

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
  private WebView webView;

  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    hideSystemUi();
    webView = new WebView(this);
    WebSettings settings = webView.getSettings();
    settings.setJavaScriptEnabled(true);
    settings.setDomStorageEnabled(true);
    settings.setDatabaseEnabled(true);
    settings.setAllowFileAccess(true);
    settings.setAllowContentAccess(true);
    settings.setMediaPlaybackRequiresUserGesture(false);
    settings.setBuiltInZoomControls(false);
    settings.setDisplayZoomControls(false);
    settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
    webView.setWebViewClient(new WebViewClient());
    webView.setWebChromeClient(new WebChromeClient());
    webView.setLongClickable(false);
    CookieManager.getInstance().setAcceptCookie(true);
    CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
    setContentView(webView);
    webView.loadUrl("file:///android_asset/index.html");
  }

  private void hideSystemUi() {
    getWindow().getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
      View.SYSTEM_UI_FLAG_FULLSCREEN |
      View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
      View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
      View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
      View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    );
  }

  @Override public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideSystemUi();
  }

  @Override public void onBackPressed() {
    if (webView != null && webView.canGoBack()) webView.goBack();
    else super.onBackPressed();
  }

  @Override protected void onDestroy() {
    if (webView != null) webView.destroy();
    super.onDestroy();
  }
}
`, "utf8");
}

function ensureDebugKey(jdkPath) {
  const androidUserPath = path.join(os.homedir(), ".android");
  const keyPath = path.join(androidUserPath, "debug.keystore");
  if (fs.existsSync(keyPath)) return keyPath;
  fs.mkdirSync(androidUserPath, { recursive: true });
  run(path.join(jdkPath, "bin", "keytool.exe"), [
    "-genkeypair", "-keystore", keyPath, "-storepass", "android", "-alias", "androiddebugkey", "-keypass", "android",
    "-dname", "CN=Android Debug,O=Android,C=US", "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000"
  ]);
  return keyPath;
}

function collectFiles(directoryPath, extension) {
  const files = [];
  fs.readdirSync(directoryPath, { withFileTypes: true }).forEach((entry) => {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(entryPath, extension));
    else if (entry.name.endsWith(extension)) files.push(entryPath);
  });
  return files;
}

function packageAndroid() {
  if (!fs.existsSync(indexPath)) throw new Error("Missing offline web build. Run scripts/build.js before Android packaging.");
  const sdkPath = findSdkPath();
  const platformPath = findNewestChild(path.join(sdkPath, "platforms"), "android.jar");
  const toolsPath = findNewestChild(path.join(sdkPath, "build-tools"), "aapt2.exe");
  const jdkPath = findJdkPath();
  if (!platformPath || !toolsPath) throw new Error("Android platform and build-tools packages are required.");
  const targetApiMatch = path.basename(platformPath).match(/android-(\d+)/);
  const targetApi = targetApiMatch ? Number(targetApiMatch[1]) : 35;
  const androidJar = path.join(platformPath, "android.jar");
  const classesPath = path.join(stagingPath, "classes");
  const dexPath = path.join(stagingPath, "dex");
  const baseApkPath = path.join(stagingPath, "base.apk");
  const alignedApkPath = path.join(stagingPath, "aligned.apk");
  const compiledResourcesPath = path.join(stagingPath, "resources.zip");
  const version = versionManager.readVersion();
  const versionCode = Math.max(1, Number(String(version).replace(/\D/g, "")) || 1);

  fs.rmSync(stagingPath, { recursive: true, force: true });
  fs.rmSync(outputPath, { force: true });
  fs.mkdirSync(classesPath, { recursive: true });
  fs.mkdirSync(dexPath, { recursive: true });
  writeAndroidSources();

  const javaFiles = collectFiles(path.join(stagingPath, "java"), ".java");
  run(path.join(jdkPath, "bin", "javac.exe"), ["-encoding", "UTF-8", "-source", "8", "-target", "8", "-bootclasspath", androidJar, "-d", classesPath].concat(javaFiles));
  const classFiles = collectFiles(classesPath, ".class");
  run(path.join(toolsPath, "d8.bat"), ["--lib", androidJar, "--min-api", String(minimumApi), "--output", dexPath].concat(classFiles), { shell: true });
  run(path.join(toolsPath, "aapt2.exe"), ["compile", "--dir", path.join(stagingPath, "res"), "-o", compiledResourcesPath]);
  run(path.join(toolsPath, "aapt2.exe"), [
    "link", "-o", baseApkPath, "-I", androidJar, "--manifest", path.join(stagingPath, "AndroidManifest.xml"),
    "--min-sdk-version", String(minimumApi), "--target-sdk-version", String(targetApi), "--version-code", String(versionCode), "--version-name", version,
    compiledResourcesPath
  ]);
  run(path.join(jdkPath, "bin", "jar.exe"), ["uf", baseApkPath, "-C", dexPath, "classes.dex", "-C", stagingPath, "assets"]);
  run(path.join(toolsPath, "zipalign.exe"), ["-f", "4", baseApkPath, alignedApkPath]);
  const keyPath = ensureDebugKey(jdkPath);
  run(path.join(toolsPath, "apksigner.bat"), [
    "sign", "--ks", keyPath, "--ks-key-alias", "androiddebugkey", "--ks-pass", "pass:android", "--key-pass", "pass:android", "--out", outputPath, alignedApkPath
  ], { shell: true });
  run(path.join(toolsPath, "apksigner.bat"), ["verify", "--verbose", outputPath], { shell: true, stdio: "inherit" });
  fs.rmSync(stagingPath, { recursive: true, force: true });
  console.log("Packaged " + path.relative(rootPath, outputPath) + " (" + (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1) + " MB)");
}

try {
  packageAndroid();
} catch (error) {
  console.error(error);
  process.exit(1);
}
