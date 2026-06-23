var shellipelagoVersion = "1.4";

if (typeof globalsState !== "undefined") {
  globalsState.shellipelagoVersion = shellipelagoVersion;
  globalsState.loadedModules.push("version");
}
