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
    "  # Adds many locations and can significantly slow down a playthrough.",
    "  add_easy_destructible_checks: " + downloadManagerYamlBoolean(downloadManagerOptions.addEasyDestructibleChecks),
    "  enemies_are_checks: " + downloadManagerYamlBoolean(downloadManagerOptions.enemiesAreChecks),
    "  shuffle_shops: " + downloadManagerYamlBoolean(downloadManagerOptions.shuffleShops),
    "  show_essential_pickup_hints: " + downloadManagerYamlBoolean(downloadManagerOptions.showEssentialPickupHints),
    "  enemies_are_hints: " + downloadManagerYamlBoolean(downloadManagerOptions.enemiesAreHints),
    "  add_traps_to_pool: " + downloadManagerYamlBoolean(downloadManagerOptions.addTrapsToPool),
    "  trap_pool_spawn:" + downloadManagerYamlList(downloadManagerOptions.trapPoolSpawn),
    "  trap_pool_in_my_world:" + downloadManagerYamlList(downloadManagerOptions.trapPoolLocal),
    "  trap_pool_in_other_worlds:" + downloadManagerYamlList(downloadManagerOptions.trapPoolNonLocal),
    "  other_players_can_find_item_pool_drops: " + downloadManagerYamlBoolean(downloadManagerOptions.otherPlayersCanFindItemPoolDrops),
    "  # Syncs Rounds with rings in other games that have Ring Link enabled.",
    "  ring_link: " + downloadManagerYamlBoolean(downloadManagerOptions.ringLink),
    "  # Syncs Energy with other clients. Shellipelago energy resets to 0 when the browser game reloads.",
    "  energy_link: " + downloadManagerYamlBoolean(downloadManagerOptions.energyLink),
    "  # Sends deaths to other players with Death Link enabled.",
    "  death_link: " + downloadManagerYamlBoolean(downloadManagerOptions.deathLink),
    "  # Sends supported traps to other players with Trap Link enabled.",
    "  trap_link: " + downloadManagerYamlBoolean(downloadManagerOptions.trapLink),
    "  # Shares supported Shellipelago pickups with players using the same item link name and game.",
    "  item_link: " + downloadManagerYamlBoolean(downloadManagerOptions.itemLink),
    ""
  ];

  return downloadManagerYamlLines.join("\n");
}

globalsState.loadedModules.push("downloadManager");
