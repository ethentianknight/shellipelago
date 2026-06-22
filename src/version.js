var shellipelagoVersion = "1.2";

if (typeof globalsState !== "undefined") {
  globalsState.shellipelagoVersion = shellipelagoVersion;
  globalsState.loadedModules.push("version");
}
