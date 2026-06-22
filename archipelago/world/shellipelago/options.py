from dataclasses import dataclass

from Options import Choice, DefaultOnToggle, OptionSet, PerGameCommonOptions, Toggle


ESSENTIAL_ITEMS = frozenset({
    "Graphics",
    "Progressive Room",
    "Bombs",
    "Gun",
    "Fire",
    "Sword",
    "Pickaxe",
    "Water Walkers",
    "Tank Treads",
    "Tank Chassis",
    "Tank Cannon",
    "SFX",
    "BGM",
    "Energy",
})

MAX_RESOURCE_UPGRADES = frozenset({
    "Max HP",
    "Max Rounds",
})

TRAPS = frozenset({
    "Stun Trap",
    "Invisible Trap",
    "Fast Trap",
    "Slow Trap",
    "Reverse Trap",
    "Screen Flip Trap",
    "Zoom Trap",
    "Death Trap",
    "Suddenly Snake",
})

HINT_LOCATIONS = frozenset({
    "Easy Checks",
    "Chests",
    "Enemies",
    "Post Game Checks",
})


class Goal(Choice):
    """Goal required to complete Shellipelago."""

    display_name = "Goal"
    option_complete_final_run = 0
    option_build_tank = 1
    default = 0


class ShuffleEssentialItems(DefaultOnToggle):
    """Shuffle essential Shellipelago progression items."""

    display_name = "Shuffle Essential Items"


class EssentialItemsInMyWorld(OptionSet):
    """Essential items allowed to appear in this player's world."""

    display_name = "Essential Items In My World"
    valid_keys = ESSENTIAL_ITEMS
    default = ESSENTIAL_ITEMS


class EssentialItemsInOtherWorlds(OptionSet):
    """Essential items allowed to appear in other players' worlds."""

    display_name = "Essential Items In Other Worlds"
    valid_keys = ESSENTIAL_ITEMS
    default = ESSENTIAL_ITEMS


class ShuffleMaxResourceUpgrades(DefaultOnToggle):
    """Shuffle max HP and max rounds upgrades."""

    display_name = "Shuffle Max Resource Upgrades"


class MaxResourceUpgradesInMyWorld(OptionSet):
    """Max resource upgrades allowed to appear in this player's world."""

    display_name = "Max Resource Upgrades In My World"
    valid_keys = MAX_RESOURCE_UPGRADES
    default = MAX_RESOURCE_UPGRADES


class MaxResourceUpgradesInOtherWorlds(OptionSet):
    """Max resource upgrades allowed to appear in other players' worlds."""

    display_name = "Max Resource Upgrades In Other Worlds"
    valid_keys = MAX_RESOURCE_UPGRADES
    default = MAX_RESOURCE_UPGRADES


class AddEasyDestructibleChecks(Toggle):
    """Add normal destructible objects as checks."""

    display_name = "Add Easy Destructible Checks"


class AddEndgameDestructibleChecks(Toggle):
    """Add tank-only/endgame destructibles as checks."""

    display_name = "Add Endgame Destructible Checks"


class EnemiesAreChecks(Toggle):
    """Enemies grant checks when defeated."""

    display_name = "Enemies Are Checks"


class ShuffleShops(Toggle):
    """Shuffle shop item locations. Fixed shop progression can still be shuffled when this is off."""

    display_name = "Shuffle Shops"


class AddHintsToChecks(Toggle):
    """Add hint items to checks."""

    display_name = "Add Hints To Checks"


class ShowEssentialPickupHints(DefaultOnToggle):
    """Show special graphics for essential pickups in the client."""

    display_name = "Show Essential Pickup Hints"


class IncludeHintLocations(Toggle):
    """Add dedicated hint locations."""

    display_name = "Include Hint Locations"


class HintLocations(OptionSet):
    """Which location categories may become hint locations."""

    display_name = "Hint Locations"
    valid_keys = HINT_LOCATIONS
    default = frozenset({"Enemies"})


class AddTrapsToPool(Toggle):
    """Allow trap items to be placed as rewards. Existing trap locations are shuffled by essential item shuffling."""

    display_name = "Add Traps To Pool"


class TrapPoolSpawn(OptionSet):
    """Trap types that can spawn from the trap item pool."""

    display_name = "Trap Pool Spawn"
    valid_keys = TRAPS
    default = TRAPS


class TrapPoolInMyWorld(OptionSet):
    """Trap items allowed in this player's world."""

    display_name = "Trap Pool In My World"
    valid_keys = TRAPS
    default = TRAPS


class TrapPoolInOtherWorlds(OptionSet):
    """Trap items allowed in other players' worlds."""

    display_name = "Trap Pool In Other Worlds"
    valid_keys = TRAPS
    default = TRAPS


class OtherPlayersCanFindItemPoolDrops(Toggle):
    """Expose item-pool-only drops as Archipelago locations."""

    display_name = "Other Players Can Find Item Pool Drops"


class RingLink(DefaultOnToggle):
    """Enable Ring Link."""

    display_name = "Ring Link"


class EnergyLink(DefaultOnToggle):
    """Enable Energy Link."""

    display_name = "Energy Link"


class DeathLink(Toggle):
    """Enable Death Link."""

    display_name = "Death Link"


class TrapLink(Toggle):
    """Enable Trap Link."""

    display_name = "Trap Link"


class TrapLinkSpawn(OptionSet):
    """Trap Link trap types that can spawn."""

    display_name = "Trap Link Spawn"
    valid_keys = TRAPS
    default = TRAPS


class TrapLinkInMyWorld(OptionSet):
    """Trap Link traps allowed in this player's world."""

    display_name = "Trap Link In My World"
    valid_keys = TRAPS
    default = TRAPS


class TrapLinkInOtherWorlds(OptionSet):
    """Trap Link traps allowed in other players' worlds."""

    display_name = "Trap Link In Other Worlds"
    valid_keys = TRAPS
    default = TRAPS


class ItemLink(DefaultOnToggle):
    """Enable Item Link."""

    display_name = "Item Link"


@dataclass
class ShellipelagoOptions(PerGameCommonOptions):
    goal: Goal
    shuffle_essential_items: ShuffleEssentialItems
    essential_items_in_my_world: EssentialItemsInMyWorld
    essential_items_in_other_worlds: EssentialItemsInOtherWorlds
    shuffle_max_resource_upgrades: ShuffleMaxResourceUpgrades
    max_resource_upgrades_in_my_world: MaxResourceUpgradesInMyWorld
    max_resource_upgrades_in_other_worlds: MaxResourceUpgradesInOtherWorlds
    add_easy_destructible_checks: AddEasyDestructibleChecks
    add_endgame_destructible_checks: AddEndgameDestructibleChecks
    enemies_are_checks: EnemiesAreChecks
    shuffle_shops: ShuffleShops
    add_hints_to_checks: AddHintsToChecks
    show_essential_pickup_hints: ShowEssentialPickupHints
    include_hint_locations: IncludeHintLocations
    hint_locations: HintLocations
    add_traps_to_pool: AddTrapsToPool
    trap_pool_spawn: TrapPoolSpawn
    trap_pool_in_my_world: TrapPoolInMyWorld
    trap_pool_in_other_worlds: TrapPoolInOtherWorlds
    other_players_can_find_item_pool_drops: OtherPlayersCanFindItemPoolDrops
    ring_link: RingLink
    energy_link: EnergyLink
    death_link: DeathLink
    trap_link: TrapLink
    trap_link_spawn: TrapLinkSpawn
    trap_link_in_my_world: TrapLinkInMyWorld
    trap_link_in_other_worlds: TrapLinkInOtherWorlds
    item_link: ItemLink
