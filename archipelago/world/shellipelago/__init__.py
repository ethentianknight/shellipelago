from BaseClasses import Item, Location, Region, Tutorial
from worlds.AutoWorld import WebWorld, World

from .items import filler_item_names, item_table, trap_item_names
from .locations import location_table
from .options import ShellipelagoOptions


__version__ = "1.2"


starting_item_counts = {
    "Progressive Room": 1,
}


class ShellipelagoItem(Item):
    game = "Shellipelago"


class ShellipelagoLocation(Location):
    game = "Shellipelago"


class ShellipelagoWeb(WebWorld):
    theme = "ocean"
    game_info_languages = ["en"]
    tutorials = [
        Tutorial(
            "Multiworld Setup Guide",
            "A guide to setting up Shellipelago for Archipelago.",
            "English",
            "setup_en.md",
            "setup/en",
            ["Shellipelago Team"],
        )
    ]


def option_enabled(option) -> bool:
    return bool(getattr(option, "value", option))


def option_set_contains(option, name: str) -> bool:
    return name in getattr(option, "value", set())


def option_set_selected(options, local_option_name: str, remote_option_name: str, name: str) -> bool:
    return option_set_contains(getattr(options, local_option_name), name) or option_set_contains(
        getattr(options, remote_option_name), name
    )


def requirement_met(state, player: int, requirement: dict) -> bool:
    item = requirement["item"]
    amount = requirement.get("amount", 1)

    if item == "Tank":
        return (
            state.has("Tank Treads", player)
            and state.has("Tank Chassis", player)
            and state.has("Tank Cannon", player)
        )

    return state.has(item, player, amount)


def requirements_met(state, player: int, requirement_rows: list) -> bool:
    return all(
        any(requirement_met(state, player, requirement) for requirement in requirement_row)
        for requirement_row in requirement_rows
    )


def has_tank(state, player: int) -> bool:
    return (
        state.has("Tank Treads", player)
        and state.has("Tank Chassis", player)
        and state.has("Tank Cannon", player)
    )


class ShellipelagoWorld(World):
    """A browser game about unlocking movement, checks, and graphics through Archipelago."""

    game = "Shellipelago"
    author = "Shellipelago Team"
    web = ShellipelagoWeb()
    options_dataclass = ShellipelagoOptions
    options: ShellipelagoOptions
    topology_present = False

    item_name_to_id = {item_name: item_data["id"] for item_name, item_data in item_table.items()}
    location_name_to_id = {
        location_name: location_data["id"] for location_name, location_data in location_table.items()
    }

    item_name_groups = {
        "Progression": {
            item_name for item_name, item_data in item_table.items()
            if item_data["classification_name"] == "progression"
        },
        "Resources": {"Max HP", "Max Rounds", "Energy"},
        "Traps": set(trap_item_names),
    }
    location_name_groups = {
        "Checks": set(location_name_to_id.keys()),
        "Chests": {
            location_name for location_name, location_data in location_table.items()
            if location_data["category"] == "chest"
        },
        "Enemies": {
            location_name for location_name, location_data in location_table.items()
            if location_data["category"] == "enemy"
        },
        "Shops": {
            location_name for location_name, location_data in location_table.items()
            if location_data["category"] == "shop"
        },
        "Destructibles": {
            location_name for location_name, location_data in location_table.items()
            if location_data["category"] in {"easy_destructible", "postgame_destructible"}
        },
    }

    def create_item(self, name: str) -> ShellipelagoItem:
        item_data = item_table[name]

        return ShellipelagoItem(name, item_data["classification"], item_data["id"], self.player)

    def get_filler_item_name(self) -> str:
        return self.random.choice(filler_item_names)

    def location_enabled(self, location_data: dict) -> bool:
        category = location_data["category"]
        drop_name = location_data.get("drop_name", "")

        if category == "enemy":
            return option_enabled(self.options.enemies_are_checks)

        if category == "easy_destructible":
            return option_enabled(self.options.add_easy_destructible_checks)

        if category == "postgame_destructible":
            return option_enabled(self.options.add_endgame_destructible_checks)

        if category == "shop":
            if option_enabled(self.options.shuffle_shops):
                return True

            return self.drop_can_shuffle_without_shop_shuffle(location_data)

        if location_data.get("item_pool"):
            return option_enabled(self.options.other_players_can_find_item_pool_drops)

        if location_data.get("trap_location"):
            return option_enabled(self.options.shuffle_essential_items)

        if location_data.get("resource_location"):
            return option_enabled(self.options.shuffle_max_resource_upgrades) and option_set_selected(
                self.options,
                "max_resource_upgrades_in_my_world",
                "max_resource_upgrades_in_other_worlds",
                drop_name,
            )

        if location_data.get("essential_location"):
            return option_enabled(self.options.shuffle_essential_items) and option_set_selected(
                self.options,
                "essential_items_in_my_world",
                "essential_items_in_other_worlds",
                drop_name,
            )

        return True

    def drop_can_shuffle_without_shop_shuffle(self, location_data: dict) -> bool:
        drop_name = location_data.get("drop_name", "")

        if location_data.get("resource_location"):
            return option_enabled(self.options.shuffle_max_resource_upgrades) and option_set_selected(
                self.options,
                "max_resource_upgrades_in_my_world",
                "max_resource_upgrades_in_other_worlds",
                drop_name,
            )

        if location_data.get("essential_location"):
            return option_enabled(self.options.shuffle_essential_items) and option_set_selected(
                self.options,
                "essential_items_in_my_world",
                "essential_items_in_other_worlds",
                drop_name,
            )

        return False

    def enabled_locations(self) -> list:
        return [
            location_data for location_data in location_table.values()
            if self.location_enabled(location_data)
        ]

    def should_place_location_drop_item(self, location_data: dict) -> bool:
        drop_name = location_data.get("drop_name", "")

        if not drop_name or drop_name not in item_table:
            return False

        if location_data.get("item_pool") or location_data.get("trap_location"):
            return False

        if location_data.get("resource_location") or location_data.get("essential_location"):
            return True

        return item_table[drop_name]["classification_name"] in {"progression", "useful"}

    def add_progression_items(self, item_pool: list, enabled_locations: list) -> None:
        skipped_starting_items = {
            item_name: 0 for item_name in starting_item_counts
        }

        for location_data in enabled_locations:
            if self.should_place_location_drop_item(location_data):
                drop_name = location_data["drop_name"]

                if skipped_starting_items.get(drop_name, 0) < starting_item_counts.get(drop_name, 0):
                    skipped_starting_items[drop_name] += 1
                    continue

                item_pool.append(self.create_item(location_data["drop_name"]))

    def add_trap_items(self, item_pool: list, remaining_slots: int) -> None:
        if not option_enabled(self.options.add_traps_to_pool) or remaining_slots <= 0:
            return

        allowed_traps = [
            trap_name for trap_name in trap_item_names
            if option_set_contains(self.options.trap_pool_spawn, trap_name)
            and option_set_selected(self.options, "trap_pool_in_my_world", "trap_pool_in_other_worlds", trap_name)
        ]

        while allowed_traps and remaining_slots > 0:
            item_pool.append(self.create_item(self.random.choice(allowed_traps)))
            remaining_slots -= 1

    def create_items(self) -> None:
        enabled_locations = self.enabled_locations()
        enabled_location_count = len(enabled_locations)
        item_pool = []

        for item_name, item_count in starting_item_counts.items():
            for _ in range(item_count):
                self.multiworld.push_precollected(self.create_item(item_name))

        self.add_progression_items(item_pool, enabled_locations)
        self.add_trap_items(item_pool, enabled_location_count - len(item_pool))

        while len(item_pool) < enabled_location_count:
            item_pool.append(self.create_item(self.get_filler_item_name()))

        self.multiworld.itempool += item_pool[:enabled_location_count]

    def create_regions(self) -> None:
        menu_region = Region("Menu", self.player, self.multiworld)

        for location_data in self.enabled_locations():
            location = ShellipelagoLocation(self.player, location_data["name"], location_data["id"], menu_region)
            location.access_rule = lambda state, requirements=location_data["requirements"]: requirements_met(
                state, self.player, requirements
            )
            menu_region.locations.append(location)

        self.multiworld.regions.append(menu_region)

    def set_rules(self) -> None:
        if self.options.goal.current_key == "build_tank":
            self.multiworld.completion_condition[self.player] = lambda state: has_tank(state, self.player)
            return

        self.multiworld.completion_condition[self.player] = lambda state: has_tank(state, self.player)

    def fill_slot_data(self) -> dict:
        shop_costs = {
            str(location_data["id"]): self.random.randint(1, 150)
            for location_data in self.enabled_locations()
            if location_data["category"] == "shop"
        }

        return {
            "show_essential_pickup_hints": option_enabled(self.options.show_essential_pickup_hints),
            "goal": self.options.goal.current_key,
            "add_hints_to_checks": option_enabled(self.options.add_hints_to_checks),
            "shop_costs": shop_costs,
            "ring_link": option_enabled(self.options.ring_link),
            "energy_link": option_enabled(self.options.energy_link),
            "death_link": option_enabled(self.options.death_link),
            "trap_link": option_enabled(self.options.trap_link),
            "item_link": option_enabled(self.options.item_link),
        }
