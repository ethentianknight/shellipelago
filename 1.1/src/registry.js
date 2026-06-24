var registryModules = [
  "globals.js",
  "version.js",
  "checkMobile.js",
  "shardManager.js",
  "downloadManager.js",
  "progressionManager.js",
  "mapManager.js",
  "finalRunConfig.js",
  "archipelagoGeneratedData.js",
  "mapEditor.js",
  "archipelagoClient.js",
  "introScreen.js",
  "initialRoom.js"
];

function registryLoadModules(registryLoadScript) {
  var registrySequence = Promise.resolve();

  registryModules.forEach(function (registryModulePath) {
    registrySequence = registrySequence.then(function () {
      return registryLoadScript(registryModulePath);
    });
  });

  return registrySequence;
}
