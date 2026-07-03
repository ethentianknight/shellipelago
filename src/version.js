var shellipelagoVersion = "1.10";

if (typeof globalsState !== "undefined") {
  globalsState.shellipelagoVersion = shellipelagoVersion;
  globalsState.loadedModules.push("version");
}
