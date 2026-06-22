var mainScriptElement = document.currentScript;
var mainBasePath = mainScriptElement ? mainScriptElement.src.replace(/[^/]*$/, "") : "src/";

function mainLoadScript(mainScriptPath) {
  return new Promise(function (mainResolve, mainReject) {
    var mainScript = document.createElement("script");
    mainScript.src = mainBasePath + mainScriptPath;
    mainScript.onload = mainResolve;
    mainScript.onerror = function () {
      mainReject(new Error("Unable to load script: " + mainScriptPath));
    };
    document.head.appendChild(mainScript);
  });
}

mainLoadScript("registry.js")
  .then(function () {
    return registryLoadModules(mainLoadScript);
  })
  .catch(function (mainError) {
    console.error(mainError);
  });
