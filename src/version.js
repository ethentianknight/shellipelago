var shellipelagoVersion = "1.7";

if (typeof globalsState !== "undefined") {
  globalsState.shellipelagoVersion = shellipelagoVersion;
  globalsState.loadedModules.push("version");
}
