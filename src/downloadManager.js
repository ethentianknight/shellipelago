function downloadManagerDownloadText(downloadManagerFileName, downloadManagerText) {
  var downloadManagerBlob = new Blob([downloadManagerText], { type: "text/yaml;charset=utf-8" });
  var downloadManagerUrl = URL.createObjectURL(downloadManagerBlob);
  var downloadManagerLink = document.createElement("a");

  downloadManagerLink.href = downloadManagerUrl;
  downloadManagerLink.download = downloadManagerFileName;
  document.body.appendChild(downloadManagerLink);
  downloadManagerLink.click();
  downloadManagerLink.remove();
  URL.revokeObjectURL(downloadManagerUrl);
}

function downloadManagerBase64ToBlob(downloadManagerBase64, downloadManagerType) {
  var downloadManagerBinary = atob(downloadManagerBase64);
  var downloadManagerBytes = new Uint8Array(downloadManagerBinary.length);
  var downloadManagerIndex = 0;

  while (downloadManagerIndex < downloadManagerBinary.length) {
    downloadManagerBytes[downloadManagerIndex] = downloadManagerBinary.charCodeAt(downloadManagerIndex);
    downloadManagerIndex += 1;
  }

  return new Blob([downloadManagerBytes], { type: downloadManagerType });
}

function downloadManagerDownloadApworld() {
  var downloadManagerBase64 = window.shellipelagoApworldBase64 || "";

  if (downloadManagerBase64) {
    downloadManagerDownloadBlob(
      "shellipelago.apworld",
      downloadManagerBase64ToBlob(downloadManagerBase64, "application/zip")
    );
    return;
  }

  fetch("src/shellipelago.apworld").then(function (downloadManagerResponse) {
    if (!downloadManagerResponse.ok) {
      throw new Error("Unable to fetch src/shellipelago.apworld.");
    }

    return downloadManagerResponse.blob();
  }).then(function (downloadManagerBlob) {
    downloadManagerDownloadBlob("shellipelago.apworld", downloadManagerBlob);
  }).catch(function (downloadManagerError) {
    console.error(downloadManagerError);
  });
}

function downloadManagerDownloadGame() {
  return fetch("src/shellipelago.zip").then(function (downloadManagerResponse) {
    if (!downloadManagerResponse.ok) {
      throw new Error("Unable to fetch src/shellipelago.zip.");
    }

    return downloadManagerResponse.blob();
  }).then(function (downloadManagerBlob) {
    downloadManagerDownloadBlob("shellipelago.zip", downloadManagerBlob);
    return true;
  });
}

function downloadManagerDownloadBlob(downloadManagerFileName, downloadManagerBlob) {
  var downloadManagerUrl = URL.createObjectURL(downloadManagerBlob);
  var downloadManagerLink = document.createElement("a");

  downloadManagerLink.href = downloadManagerUrl;
  downloadManagerLink.download = downloadManagerFileName;
  document.body.appendChild(downloadManagerLink);
  downloadManagerLink.click();
  downloadManagerLink.remove();
  URL.revokeObjectURL(downloadManagerUrl);
}

function downloadManagerYamlBoolean(downloadManagerValue) {
  return downloadManagerValue ? "true" : "false";
}

function downloadManagerYamlNumber(downloadManagerValue, downloadManagerDefaultValue) {
  var downloadManagerNumber = Number(downloadManagerValue);

  if (!Number.isFinite(downloadManagerNumber)) {
    return downloadManagerDefaultValue;
  }

  return Math.max(0, Math.min(99, Math.floor(downloadManagerNumber)));
}

function downloadManagerYamlPercentage(downloadManagerValue, downloadManagerDefaultValue) {
  var downloadManagerNumber = Number(downloadManagerValue);

  if (!Number.isFinite(downloadManagerNumber)) {
    return downloadManagerDefaultValue;
  }

  return Math.max(0, Math.min(100, Math.floor(downloadManagerNumber)));
}

function downloadManagerYamlList(downloadManagerItems) {
  if (!downloadManagerItems || !downloadManagerItems.length) {
    return " []";
  }

  return "\n" + downloadManagerItems.map(function (downloadManagerItem) {
    return "    - " + downloadManagerItem;
  }).join("\n");
}

function downloadManagerYamlMapping(downloadManagerItems) {
  var downloadManagerKeys = Object.keys(downloadManagerItems || {});

  if (!downloadManagerKeys.length) {
    return " {}";
  }

  return "\n" + downloadManagerKeys.map(function (downloadManagerKey) {
    return "    " + downloadManagerKey + ": " + Math.max(0, Math.floor(Number(downloadManagerItems[downloadManagerKey]) || 0));
  }).join("\n");
}

function downloadManagerAddLocalityItems(downloadManagerLocalityItems, downloadManagerLocal, downloadManagerNonLocal) {
  var downloadManagerAllItems = {};

  (downloadManagerLocal || []).forEach(function (downloadManagerItem) {
    downloadManagerAllItems[downloadManagerItem] = true;
  });
  (downloadManagerNonLocal || []).forEach(function (downloadManagerItem) {
    downloadManagerAllItems[downloadManagerItem] = true;
  });

  Object.keys(downloadManagerAllItems).forEach(function (downloadManagerItem) {
    var downloadManagerCanBeLocal = (downloadManagerLocal || []).indexOf(downloadManagerItem) !== -1;
    var downloadManagerCanBeNonLocal = (downloadManagerNonLocal || []).indexOf(downloadManagerItem) !== -1;

    if (downloadManagerCanBeLocal && !downloadManagerCanBeNonLocal) {
      downloadManagerLocalityItems.localItems.push(downloadManagerItem);
    } else if (downloadManagerCanBeNonLocal && !downloadManagerCanBeLocal) {
      downloadManagerLocalityItems.nonLocalItems.push(downloadManagerItem);
    }
  });
}

function downloadManagerBuildLocalityItems(downloadManagerOptions) {
  var downloadManagerLocalityItems = {
    localItems: [],
    nonLocalItems: []
  };

  downloadManagerAddLocalityItems(
    downloadManagerLocalityItems,
    downloadManagerOptions.essentialLocal,
    downloadManagerOptions.essentialNonLocal
  );
  downloadManagerAddLocalityItems(
    downloadManagerLocalityItems,
    downloadManagerOptions.resourceLocal,
    downloadManagerOptions.resourceNonLocal
  );
  downloadManagerAddLocalityItems(
    downloadManagerLocalityItems,
    downloadManagerOptions.trapPoolLocal,
    downloadManagerOptions.trapPoolNonLocal
  );

  return downloadManagerLocalityItems;
}

function downloadManagerBuildYaml(downloadManagerOptions) {
  var downloadManagerLocalityItems = downloadManagerBuildLocalityItems(downloadManagerOptions);
  var downloadManagerYamlLines = [
    "# Shellipelago version: " + (globalsState.shellipelagoVersion || "1.1"),
    "description: Shellipelago player file.",
    "game: Shellipelago",
    "name: " + downloadManagerOptions.slot,
    "",
    "Shellipelago:",
    "  progression_balancing: " + downloadManagerYamlNumber(downloadManagerOptions.progressionBalancing, 50),
    "  accessibility: full",
    "  local_items:" + downloadManagerYamlList(downloadManagerLocalityItems.localItems),
    "  non_local_items:" + downloadManagerYamlList(downloadManagerLocalityItems.nonLocalItems),
    "  shuffle_essential_items: " + downloadManagerYamlBoolean(downloadManagerOptions.shuffleEssentialItems),
    "  shuffle_max_resource_upgrades: " + downloadManagerYamlBoolean(downloadManagerOptions.shuffleMaxResourceUpgrades),
    "  # Adds many locations and can significantly slow down a playthrough.",
    "  add_easy_destructible_checks: " + downloadManagerYamlBoolean(downloadManagerOptions.addEasyDestructibleChecks),
    "  enemies_are_checks: " + downloadManagerYamlBoolean(downloadManagerOptions.enemiesAreChecks),
    "  shuffle_shops: " + downloadManagerYamlBoolean(downloadManagerOptions.shuffleShops),
    "  show_essential_pickup_hints: " + downloadManagerYamlBoolean(downloadManagerOptions.showEssentialPickupHints),
    "  enemies_are_hints: " + downloadManagerYamlBoolean(downloadManagerOptions.enemiesAreHints),
    "  add_traps_to_pool: " + downloadManagerYamlBoolean(downloadManagerOptions.addTrapsToPool),
    "  trap_fill_percentage: " + downloadManagerYamlPercentage(downloadManagerOptions.trapFillPercentage, 25),
    "  trap_pool_spawn:" + downloadManagerYamlList(downloadManagerOptions.trapPoolSpawn),
    "  trap_weights:" + downloadManagerYamlMapping(downloadManagerOptions.trapWeights),
    "  other_players_can_find_item_pool_drops: " + downloadManagerYamlBoolean(downloadManagerOptions.otherPlayersCanFindItemPoolDrops),
    "  # Syncs Rounds with rings in other games that have Ring Link enabled.",
    "  ring_link: " + downloadManagerYamlBoolean(downloadManagerOptions.ringLink),
    "  # Syncs Energy with other clients that have Energy Link enabled.",
    "  energy_link: " + downloadManagerYamlBoolean(downloadManagerOptions.energyLink),
    "  # Sends deaths to other players with Death Link enabled.",
    "  death_link: " + downloadManagerYamlBoolean(downloadManagerOptions.deathLink),
    "  # Sends supported traps to other players with Trap Link enabled.",
    "  trap_link: " + downloadManagerYamlBoolean(downloadManagerOptions.trapLink),
    ""
  ];

  if (downloadManagerOptions.itemLink) {
    downloadManagerYamlLines = downloadManagerYamlLines.concat([
      "  item_links:",
      "    - name: Shellipelago",
      "      item_pool:",
      "        - Linkable",
      "      replacement_item: null",
      "      link_replacement: false",
      "      skip_if_solo: true",
      ""
    ]);
  }

  return downloadManagerYamlLines.join("\n");
}

globalsState.loadedModules.push("downloadManager");
