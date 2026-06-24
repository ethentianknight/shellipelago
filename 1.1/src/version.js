var shellipelagoVersion = "1.1";

if (typeof globalsState !== "undefined") {
  globalsState.shellipelagoVersion = shellipelagoVersion;
  globalsState.loadedModules.push("version");
}
