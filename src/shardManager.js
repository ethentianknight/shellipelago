var shardManagerPaths = {
  connection: "src/templates/connection.html",
  yamlCreator: "src/templates/yamlCreator.html",
  mapEditor: "src/templates/mapEditor.html"
};

function shardManagerGetName(shardManagerPathOrName) {
  return shardManagerPathOrName.replace(/^.*\/([^/.]+)(?:\.html)?$/, "$1");
}

function shardManagerGetEmbeddedShard(shardManagerName) {
  var shardManagerEmbeddedShards = window.shellipelagoTemplates || {};
  var shardManagerTemplate = document.querySelector('[data-template-name="' + shardManagerName + '"]');

  if (shardManagerEmbeddedShards[shardManagerName]) {
    return shardManagerEmbeddedShards[shardManagerName];
  }

  return shardManagerTemplate ? shardManagerTemplate.innerHTML : "";
}

function shardManagerExtractShard(shardManagerHtml) {
  var shardManagerDocument = new DOMParser().parseFromString(shardManagerHtml, "text/html");
  var shardManagerTemplate = shardManagerDocument.querySelector("template[data-shard]");

  return shardManagerTemplate ? shardManagerTemplate.innerHTML : shardManagerHtml;
}

function shardManagerLoadShard(shardManagerPathOrName) {
  var shardManagerName = shardManagerGetName(shardManagerPathOrName);
  var shardManagerPath = shardManagerPaths[shardManagerName] || shardManagerPathOrName;
  var shardManagerEmbeddedShard = shardManagerGetEmbeddedShard(shardManagerName);

  if (shardManagerEmbeddedShard) {
    return Promise.resolve(shardManagerEmbeddedShard);
  }

  if (isBuild) {
    return Promise.resolve("");
  }

  return fetch(shardManagerPath).then(function (shardManagerResponse) {
    if (!shardManagerResponse.ok) {
      throw new Error("Unable to load shard: " + shardManagerPath);
    }

    return shardManagerResponse.text();
  }).then(function (shardManagerHtml) {
    return shardManagerExtractShard(shardManagerHtml);
  });
}

globalsState.loadedModules.push("shardManager");
