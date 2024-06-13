export class LootTableLookup {
	static ConvertLootTable(inLootTable: string): string {
		var text: string = inLootTable;
		var num: number = inLootTable.lastIndexOf('/');
		if (num > 0) {
			var key: string = inLootTable.substring(num + 1);
			if (LootTableLookup.lootTableXRef.hasOwnProperty(key)) {
				text = "loot_tables/chests/" + LootTableLookup.lootTableXRef[key];
			}
		}
		return text;
	}

	static lootTableXRef: object = {
		"abandoned_mineshaft": "abandoned_mineshaft.json",
		"buried_treasure": "buriedtreasure.json",
		"desert_pyramid": "desert_pyramid.json",
		"end_city_treasure": "end_city_treasure.json",
		"igloo_chest": "igloo_chest.json",
		"jungle_temple": "jungle_temple.json",
		"jungle_temple_dispenser": "dispenser_trap.json",
		"nether_bridge": "nether_bridge.json",
		"shipwreck_map": "shipwreck.json",
		"shipwreck_supply": "shipwrecksupply.json",
		"shipwreck_treasure": "shipwrecktreasure.json",
		"simple_dungeon": "simple_dungeon.json",
		"spawn_bonus_chest": "spawn_bonus_chest.json",
		"stronghold_corridor": "stronghold_corridor.json",
		"stronghold_crossing": "stronghold_crossing.json",
		"stronghold_library": "stronghold_library.json",
		"underwater_ruin_big": "underwater_ruin_big.json",
		"underwater_ruin_small": "underwater_ruin_small.json",
		"village_blacksmith": "village_blacksmith.json",
		"woodland_mansion": "woodland_mansion.json"
	};
}