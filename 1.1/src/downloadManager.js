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

function downloadManagerYamlList(downloadManagerItems) {
  if (!downloadManagerItems || !downloadManagerItems.length) {
    return " []";
  }

  return "\n" + downloadManagerItems.map(function (downloadManagerItem) {
    return "    - " + downloadManagerItem;
  }).join("\n");
}

function downloadManagerBuildYaml(downloadManagerOptions) {
  var downloadManagerYamlLines = [
    "# Shellipelago version: " + (globalsState.shellipelagoVersion || "1.1"),
    "description: Shellipelago player file.",
    "game: Shellipelago",
    "name: " + downloadManagerOptions.slot,
    "",
    "Shellipelago:",
    "  progression_balancing: " + downloadManagerYamlNumber(downloadManagerOptions.progressionBalancing, 50),
    "  accessibility: full",
    "  shuffle_essential_items: " + downloadManagerYamlBoolean(downloadManagerOptions.shuffleEssentialItems),
    "  essential_items_in_my_world:" + downloadManagerYamlList(downloadManagerOptions.essentialLocal),
    "  essential_items_in_other_worlds:" + downloadManagerYamlList(downloadManagerOptions.essentialNonLocal),
    "  shuffle_max_resource_upgrades: " + downloadManagerYamlBoolean(downloadManagerOptions.shuffleMaxResourceUpgrades),
    "  max_resource_upgrades_in_my_world:" + downloadManagerYamlList(downloadManagerOptions.resourceLocal),
    "  max_resource_upgrades_in_other_worlds:" + downloadManagerYamlList(downloadManagerOptions.resourceNonLocal),
    "  add_easy_destructible_checks: " + downloadManagerYamlBoolean(downloadManagerOptions.addEasyDestructibleChecks),
    "  add_endgame_destructible_checks: " + downloadManagerYamlBoolean(downloadManagerOptions.addEndgameDestructibleChecks),
    "  enemies_are_checks: " + downloadManagerYamlBoolean(downloadManagerOptions.enemiesAreChecks),
    "  shuffle_shops: " + downloadManagerYamlBoolean(downloadManagerOptions.shuffleShops),
    "  add_hints_to_checks: " + downloadManagerYamlBoolean(downloadManagerOptions.addHintsToChecks),
    "  show_essential_pickup_hints: " + downloadManagerYamlBoolean(downloadManagerOptions.showEssentialPickupHints),
    "  include_hint_locations: " + downloadManagerYamlBoolean(downloadManagerOptions.includeHintLocations),
    "  hint_locations:" + downloadManagerYamlList(downloadManagerOptions.hintLocations),
    "  add_traps_to_pool: " + downloadManagerYamlBoolean(downloadManagerOptions.addTrapsToPool),
    "  trap_pool_spawn:" + downloadManagerYamlList(downloadManagerOptions.trapPoolSpawn),
    "  trap_pool_in_my_world:" + downloadManagerYamlList(downloadManagerOptions.trapPoolLocal),
    "  trap_pool_in_other_worlds:" + downloadManagerYamlList(downloadManagerOptions.trapPoolNonLocal),
    "  other_players_can_find_item_pool_drops: " + downloadManagerYamlBoolean(downloadManagerOptions.otherPlayersCanFindItemPoolDrops),
    "  ring_link: " + downloadManagerYamlBoolean(downloadManagerOptions.ringLink),
    "  energy_link: " + downloadManagerYamlBoolean(downloadManagerOptions.energyLink),
    "  death_link: " + downloadManagerYamlBoolean(downloadManagerOptions.deathLink),
    "  trap_link: " + downloadManagerYamlBoolean(downloadManagerOptions.trapLink),
    "  trap_link_spawn:" + downloadManagerYamlList(downloadManagerOptions.trapLinkSpawn),
    "  trap_link_in_my_world:" + downloadManagerYamlList(downloadManagerOptions.trapLinkLocal),
    "  trap_link_in_other_worlds:" + downloadManagerYamlList(downloadManagerOptions.trapLinkNonLocal),
    "  item_link: " + downloadManagerYamlBoolean(downloadManagerOptions.itemLink),
    ""
  ];

  if (downloadManagerOptions.addEndgameDestructibleChecks) {
    downloadManagerYamlLines.splice(
      1,
      0,
      "# HOST: This player has chosen to include post-game checks. This will slow down the game significantly and may lock other games behind completion of this one.",
      "# If you're running a no-release world, you should set add_endgame_destructible_checks to false.",
      ""
    );
  }

  return downloadManagerYamlLines.join("\n");
}

globalsState.loadedModules.push("downloadManager");
