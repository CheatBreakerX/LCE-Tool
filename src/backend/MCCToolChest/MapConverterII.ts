import { BlockColorIndex } from "./BlockColorIndex";
import { BlockId } from "./BlockId";
import { ColorGroup } from "../Substrate/Data/ColorGroup";
import { Color } from "../LCETool/Util/Color";
import { Util } from "../LCETool/Util/Util";

export class MapConverterII {
	constructor() {
		this.colorGroupSize = 4;
		this.colorIndex = Util.cloneArray(MapConverterII.globalColorIndex);

		this.blockIndex = new BlockColorIndex[4096];
		for (var x = 0; x < this.blockIndex.length; x++) {
			this.blockIndex[x] = new BlockColorIndex();
		}

		this.blockIndex[BlockId.AIR].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.STONE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.GRASS].setColorIndex(0, ColorGroup.Grass);
		this.blockIndex[BlockId.DIRT].setColorIndex(0, ColorGroup.Dirt);
		this.blockIndex[BlockId.COBBLESTONE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.WOOD_PLANK].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.SAPLING].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.BEDROCK].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.WATER].setColorIndex(0, ColorGroup.Water);
		this.blockIndex[BlockId.STATIONARY_WATER].setColorIndex(0, ColorGroup.Water);
		this.blockIndex[BlockId.LAVA].setColorIndex(0, ColorGroup.Lava);
		this.blockIndex[BlockId.STATIONARY_LAVA].setColorIndex(0, ColorGroup.Lava);
		this.blockIndex[BlockId.SAND].setColorIndex(0, ColorGroup.Sand);
		this.blockIndex[BlockId.SAND].setColorIndex(1, ColorGroup.Red);
		this.blockIndex[BlockId.GRAVEL].setColorIndex(0, ColorGroup.Sand);
		this.blockIndex[BlockId.GOLD_ORE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.IRON_ORE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.COAL_ORE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.WOOD].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.LEAVES].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.SPONGE].setColorIndex(0, ColorGroup.Yellow);
		this.blockIndex[BlockId.GLASS].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.LAPIS_ORE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.LAPIS_BLOCK].setColorIndex(0, ColorGroup.Lapis);
		this.blockIndex[BlockId.DISPENSER].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.SANDSTONE].setColorIndex(0, ColorGroup.Sand);
		this.blockIndex[BlockId.NOTE_BLOCK].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.BED].setColorIndex(0, ColorGroup.Other);
		this.blockIndex[BlockId.POWERED_RAIL].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.DETECTOR_RAIL].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.STICKY_PISTON].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.COBWEB].setColorIndex(0, ColorGroup.Other);
		this.blockIndex[BlockId.TALL_GRASS].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.DEAD_SHRUB].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.PISTON].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.PISTON_HEAD].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.WOOL].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.WOOL].setColorIndex(1, ColorGroup.Orange);
		this.blockIndex[BlockId.WOOL].setColorIndex(2, ColorGroup.Magenta);
		this.blockIndex[BlockId.WOOL].setColorIndex(3, ColorGroup.LightBlue);
		this.blockIndex[BlockId.WOOL].setColorIndex(4, ColorGroup.Yellow);
		this.blockIndex[BlockId.WOOL].setColorIndex(5, ColorGroup.Lime);
		this.blockIndex[BlockId.WOOL].setColorIndex(6, ColorGroup.Pink);
		this.blockIndex[BlockId.WOOL].setColorIndex(7, ColorGroup.Grey);
		this.blockIndex[BlockId.WOOL].setColorIndex(8, ColorGroup.LightGrey);
		this.blockIndex[BlockId.WOOL].setColorIndex(9, ColorGroup.Cyan);
		this.blockIndex[BlockId.WOOL].setColorIndex(10, ColorGroup.Purple);
		this.blockIndex[BlockId.WOOL].setColorIndex(11, ColorGroup.Blue);
		this.blockIndex[BlockId.WOOL].setColorIndex(12, ColorGroup.Brown);
		this.blockIndex[BlockId.WOOL].setColorIndex(13, ColorGroup.Green);
		this.blockIndex[BlockId.WOOL].setColorIndex(14, ColorGroup.Red);
		this.blockIndex[BlockId.WOOL].setColorIndex(15, ColorGroup.Black);
		this.blockIndex[BlockId.PISTON_MOVING].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.YELLOW_FLOWER].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.RED_ROSE].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.BROWN_MUSHROOM].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.RED_MUSHROOM].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.GOLD_BLOCK].setColorIndex(0, ColorGroup.Gold);
		this.blockIndex[BlockId.IRON_BLOCK].setColorIndex(0, ColorGroup.Metal);
		this.blockIndex[BlockId.DOUBLE_STONE_SLAB].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.STONE_SLAB].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.BRICK_BLOCK].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.TNT].setColorIndex(0, ColorGroup.Lava);
		this.blockIndex[BlockId.BOOKSHELF].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.MOSS_STONE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.OBSIDIAN].setColorIndex(0, ColorGroup.Black);
		this.blockIndex[BlockId.TORCH].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.FIRE].setColorIndex(0, ColorGroup.Lava);
		this.blockIndex[BlockId.MONSTER_SPAWNER].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.WOOD_STAIRS].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.CHEST].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.REDSTONE_WIRE].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.DIAMOND_ORE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.DIAMOND_BLOCK].setColorIndex(0, ColorGroup.Diamond);
		this.blockIndex[BlockId.CRAFTING_TABLE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.CROPS].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.FARMLAND].setColorIndex(0, ColorGroup.Dirt);
		this.blockIndex[BlockId.FURNACE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.BURNING_FURNACE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.SIGN_POST].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.WOOD_DOOR].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.LADDER].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.RAILS].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.COBBLESTONE_STAIRS].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.WALL_SIGN].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.LEVER].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.STONE_PLATE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.IRON_DOOR].setColorIndex(0, ColorGroup.Metal);
		this.blockIndex[BlockId.WOOD_PLATE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.REDSTONE_ORE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.GLOWING_REDSTONE_ORE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.REDSTONE_TORCH_OFF].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.REDSTONE_TORCH_ON].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.STONE_BUTTON].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.SNOW].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.ICE].setColorIndex(0, ColorGroup.Ice);
		this.blockIndex[BlockId.SNOW_BLOCK].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.CACTUS].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.CLAY_BLOCK].setColorIndex(0, ColorGroup.Clay);
		this.blockIndex[BlockId.SUGAR_CANE].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.JUKEBOX].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.FENCE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.PUMPKIN].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.NETHERRACK].setColorIndex(0, ColorGroup.Netherrack);
		this.blockIndex[BlockId.SOUL_SAND].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.GLOWSTONE_BLOCK].setColorIndex(0, ColorGroup.Sand);
		this.blockIndex[BlockId.PORTAL].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.JACK_O_LANTERN].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.CAKE_BLOCK].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.REDSTONE_REPEATER_ON].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.REDSTONE_REPEATER_OFF].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.LOCKED_CHEST].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.TRAPDOOR].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.SILVERFISH_STONE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.STONE_BRICK].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.HUGE_RED_MUSHROOM].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.HUGE_BROWN_MUSHROOM].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.IRON_BARS].setColorIndex(0, ColorGroup.Metal);
		this.blockIndex[BlockId.GLASS_PANE].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.MELON].setColorIndex(0, ColorGroup.Lime);
		this.blockIndex[BlockId.PUMPKIN_STEM].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.MELON_STEM].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.VINES].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.FENCE_GATE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.BRICK_STAIRS].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.STONE_BRICK_STAIRS].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.MYCELIUM].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.LILLY_PAD].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.NETHER_BRICK].setColorIndex(0, ColorGroup.Netherrack);
		this.blockIndex[BlockId.NETHER_BRICK_FENCE].setColorIndex(0, ColorGroup.Netherrack);
		this.blockIndex[BlockId.NETHER_BRICK_STAIRS].setColorIndex(0, ColorGroup.Netherrack);
		this.blockIndex[BlockId.NETHER_WART].setColorIndex(0, ColorGroup.Netherrack);
		this.blockIndex[BlockId.ENCHANTMENT_TABLE].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.BREWING_STAND].setColorIndex(0, ColorGroup.Metal);
		this.blockIndex[BlockId.CAULDRON].setColorIndex(0, ColorGroup.Grey);
		this.blockIndex[BlockId.END_PORTAL].setColorIndex(0, ColorGroup.Black);
		this.blockIndex[BlockId.END_PORTAL_FRAME].setColorIndex(0, ColorGroup.Green);
		this.blockIndex[BlockId.END_STONE].setColorIndex(0, ColorGroup.Yellow);
		this.blockIndex[BlockId.DRAGON_EGG].setColorIndex(0, ColorGroup.Black);
		this.blockIndex[BlockId.REDSTONE_LAMP_OFF].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.REDSTONE_LAMP_ON].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.DOUBLE_WOOD_SLAB].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.WOOD_SLAB].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.COCOA_PLANT].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.SANDSTONE_STAIRS].setColorIndex(0, ColorGroup.Sand);
		this.blockIndex[BlockId.EMERALD_ORE].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.ENDER_CHEST].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.TRIPWIRE_HOOK].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.TRIPWIRE].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.EMERALD_BLOCK].setColorIndex(0, ColorGroup.Emerald);
		this.blockIndex[BlockId.SPRUCE_WOOD_STAIRS].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.BIRCH_WOOD_STAIRS].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.JUNGLE_WOOD_STAIRS].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.COMMAND_BLOCK].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.BEACON_BLOCK].setColorIndex(0, ColorGroup.Diamond);
		this.blockIndex[BlockId.COBBLESTONE_WALL].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.FLOWER_POT].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.CARROTS].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.POTATOES].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.WOOD_BUTTON].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.HEADS].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.ANVIL].setColorIndex(0, ColorGroup.Metal);
		this.blockIndex[BlockId.TRAPPED_CHEST].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.WEIGHTED_PRESSURE_PLATE_LIGHT].setColorIndex(0, ColorGroup.Gold);
		this.blockIndex[BlockId.WEIGHTED_PRESSURE_PLATE_HEAVY].setColorIndex(0, ColorGroup.Metal);
		this.blockIndex[BlockId.REDSTONE_COMPARATOR_INACTIVE].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.REDSTONE_COMPARATOR_ACTIVE].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.DAYLIGHT_SENSOR].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.REDSTONE_BLOCK].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.NETHER_QUARTZ_ORE].setColorIndex(0, ColorGroup.Netherrack);
		this.blockIndex[BlockId.HOPPER].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.QUARTZ_BLOCK].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.QUARTZ_STAIRS].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.ACTIVATOR_RAIL].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.DROPPER].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(1, ColorGroup.Orange);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(2, ColorGroup.Magenta);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(3, ColorGroup.LightBlue);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(4, ColorGroup.Yellow);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(5, ColorGroup.Lime);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(6, ColorGroup.Pink);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(7, ColorGroup.Grey);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(8, ColorGroup.LightGrey);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(9, ColorGroup.Cyan);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(10, ColorGroup.Purple);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(11, ColorGroup.Blue);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(12, ColorGroup.Brown);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(13, ColorGroup.Green);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(14, ColorGroup.Red);
		this.blockIndex[BlockId.STAINED_CLAY].setColorIndex(15, ColorGroup.Black);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(1, ColorGroup.Orange);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(2, ColorGroup.Magenta);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(3, ColorGroup.LightBlue);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(4, ColorGroup.Yellow);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(5, ColorGroup.Lime);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(6, ColorGroup.Pink);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(7, ColorGroup.Grey);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(8, ColorGroup.LightGrey);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(9, ColorGroup.Cyan);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(10, ColorGroup.Purple);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(11, ColorGroup.Blue);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(12, ColorGroup.Brown);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(13, ColorGroup.Green);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(14, ColorGroup.Red);
		this.blockIndex[BlockId.STAINED_GLASS_PANE].setColorIndex(15, ColorGroup.Black);
		this.blockIndex[BlockId.LEAVES_ACACIA_DARK_OAK].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.WOOD_ACACIA_DARK_OAK].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.WOOD_ACACIA_DARK_OAK].setColorIndex(1, ColorGroup.Brown);
		this.blockIndex[BlockId.ACACIA_STAIRS].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.DARK_OAK_STAIRS].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.SLIME_BLOCK].setColorIndex(0, ColorGroup.Lime);
		this.blockIndex[BlockId.BARRIER].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.IRON_TRAPDOOR].setColorIndex(0, ColorGroup.Metal);
		this.blockIndex[BlockId.PRISMARINE].setColorIndex(0, ColorGroup.Diamond);
		this.blockIndex[BlockId.SEA_LANTERN].setColorIndex(0, ColorGroup.Diamond);
		this.blockIndex[BlockId.HAY_BLOCK].setColorIndex(0, ColorGroup.Gold);
		this.blockIndex[BlockId.CARPET].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.CARPET].setColorIndex(1, ColorGroup.Orange);
		this.blockIndex[BlockId.CARPET].setColorIndex(2, ColorGroup.Magenta);
		this.blockIndex[BlockId.CARPET].setColorIndex(3, ColorGroup.LightBlue);
		this.blockIndex[BlockId.CARPET].setColorIndex(4, ColorGroup.Yellow);
		this.blockIndex[BlockId.CARPET].setColorIndex(5, ColorGroup.Lime);
		this.blockIndex[BlockId.CARPET].setColorIndex(6, ColorGroup.Pink);
		this.blockIndex[BlockId.CARPET].setColorIndex(7, ColorGroup.Grey);
		this.blockIndex[BlockId.CARPET].setColorIndex(8, ColorGroup.LightGrey);
		this.blockIndex[BlockId.CARPET].setColorIndex(9, ColorGroup.Cyan);
		this.blockIndex[BlockId.CARPET].setColorIndex(10, ColorGroup.Purple);
		this.blockIndex[BlockId.CARPET].setColorIndex(11, ColorGroup.Blue);
		this.blockIndex[BlockId.CARPET].setColorIndex(12, ColorGroup.Brown);
		this.blockIndex[BlockId.CARPET].setColorIndex(13, ColorGroup.Green);
		this.blockIndex[BlockId.CARPET].setColorIndex(14, ColorGroup.Red);
		this.blockIndex[BlockId.CARPET].setColorIndex(15, ColorGroup.Black);
		this.blockIndex[BlockId.HARDENED_CLAY].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.COAL_BLOCK].setColorIndex(0, ColorGroup.Black);
		this.blockIndex[BlockId.PACKED_ICE].setColorIndex(0, ColorGroup.Ice);
		this.blockIndex[BlockId.DOUBLE_PLANT].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.STANDING_BANNER].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.WALL_BANNER].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.DAYLIGHT_DETECTOR_INVERTED].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.RED_SANDSTONE].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.RED_SANDSTONE_STAIRS].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.DOUBLE_STONE_SLAB2].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.STONE_SLAB2].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.SPRUCE_FENCE_GATE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.BIRCH_FENCE_GATE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.JUNGLE_FENCE_GATE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.DARK_OAK_FENCE_GATE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.ACACIA_FENCE_GATE].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.SPRUCE_FENCE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.BIRCH_FENCE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.JUNGLE_FENCE].setColorIndex(0, ColorGroup.Wood);
		this.blockIndex[BlockId.DARK_OAK_FENCE].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.ACACIA_FENCE].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.SPRUCE_DOOR].setColorIndex(0, ColorGroup.Obsidian);
		this.blockIndex[BlockId.BIRCH_DOOR].setColorIndex(0, ColorGroup.Sand);
		this.blockIndex[BlockId.JUNGLE_DOOR].setColorIndex(0, ColorGroup.Dirt);
		this.blockIndex[BlockId.ACACIA_DOOR].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.DARK_OAK_DOOR].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.END_ROD].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.CHORUS_PLANT].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.CHORUS_FLOWER].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.PURPUR_BLOCK].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.PURPUR_PILLAR].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.PURPUR_STAIRS].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.PURPUR_DOUBLE_SLAB].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.PURPUR_SLAB].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.END_BRICKS].setColorIndex(0, ColorGroup.Lime);
		this.blockIndex[BlockId.BEETROOTS].setColorIndex(0, ColorGroup.Plant);
		this.blockIndex[BlockId.GRASS_PATH].setColorIndex(0, ColorGroup.Grass);
		this.blockIndex[BlockId.END_GATEWAY].setColorIndex(0, ColorGroup.Other);
		this.blockIndex[BlockId.REPEATING_COMMAND_BLOCK].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.CHAIN_COMMAND_BLOCK].setColorIndex(0, ColorGroup.Green);
		this.blockIndex[BlockId.FROSTED_ICE].setColorIndex(0, ColorGroup.Ice);
		this.blockIndex[BlockId.MAGMA_BLOCK].setColorIndex(0, ColorGroup.Lava);
		this.blockIndex[BlockId.NETHER_WART_BLOCK].setColorIndex(0, ColorGroup.Netherrack);
		this.blockIndex[BlockId.RED_NETHER_BRICK].setColorIndex(0, ColorGroup.Netherrack);
		this.blockIndex[BlockId.BONE_BLOCK].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.STRUCTURE_VOID].setColorIndex(0, ColorGroup.Unexplored);
		this.blockIndex[BlockId.OBSERVER].setColorIndex(0, ColorGroup.Stone);
		this.blockIndex[BlockId.WHITE_SHULKER_BOX].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.ORANGE_SHULKER_BOX].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.MAGENTA_SHULKER_BOX].setColorIndex(0, ColorGroup.Magenta);
		this.blockIndex[BlockId.LIGHT_BLUE_SHULKER_BOX].setColorIndex(0, ColorGroup.LightBlue);
		this.blockIndex[BlockId.YELLOW_SHULKER_BOX].setColorIndex(0, ColorGroup.Yellow);
		this.blockIndex[BlockId.LIME_SHULKER_BOX].setColorIndex(0, ColorGroup.Lime);
		this.blockIndex[BlockId.PINK_SHULKER_BOX].setColorIndex(0, ColorGroup.Pink);
		this.blockIndex[BlockId.GRAY_SHULKER_BOX].setColorIndex(0, ColorGroup.Grey);
		this.blockIndex[BlockId.LIGHT_GRAY_SHULKER_BOX].setColorIndex(0, ColorGroup.LightGrey);
		this.blockIndex[BlockId.CYAN_SHULKER_BOX].setColorIndex(0, ColorGroup.Cyan);
		this.blockIndex[BlockId.PURPLE_SHULKER_BOX].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.BLUE_SHULKER_BOX].setColorIndex(0, ColorGroup.Blue);
		this.blockIndex[BlockId.BROWN_SHULKER_BOX].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.GREEN_SHULKER_BOX].setColorIndex(0, ColorGroup.Green);
		this.blockIndex[BlockId.RED_SHULKER_BOX].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.BLACK_SHULKER_BOX].setColorIndex(0, ColorGroup.Black);
		this.blockIndex[BlockId.WHITE_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.White);
		this.blockIndex[BlockId.ORANGE_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Orange);
		this.blockIndex[BlockId.MAGENTA_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Magenta);
		this.blockIndex[BlockId.LIGHT_BLUE_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.LightBlue);
		this.blockIndex[BlockId.YELLOW_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Yellow);
		this.blockIndex[BlockId.LIME_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Lime);
		this.blockIndex[BlockId.PINK_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Pink);
		this.blockIndex[BlockId.GRAY_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Grey);
		this.blockIndex[BlockId.LIGHT_GRAY_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.LightGrey);
		this.blockIndex[BlockId.CYAN_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Cyan);
		this.blockIndex[BlockId.PURPLE_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Purple);
		this.blockIndex[BlockId.BLUE_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Blue);
		this.blockIndex[BlockId.BROWN_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Brown);
		this.blockIndex[BlockId.GREEN_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Green);
		this.blockIndex[BlockId.RED_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Red);
		this.blockIndex[BlockId.BLACK_GLAZED_TERRACOTTA].setColorIndex(0, ColorGroup.Black);
		this.blockIndex[BlockId.CONCRETE].setColorIndex(0, ColorGroup.LightGrey);
		this.blockIndex[BlockId.CONCRETE_POWDER].setColorIndex(0, ColorGroup.LightGrey);
		this.blockIndex[BlockId.STRUCTURE_BLOCK].setColorIndex(0, ColorGroup.LightGrey);
	}

	getColorIndex(): Color[] {
		return this.colorIndex;
	}

	getBlockIndex(): BlockColorIndex[] {
		return this.blockIndex;
	}

	getColorGroupSize(): number {
		return this.colorGroupSize;
	}

	private colorIndex: Color[];
	private blockIndex: BlockColorIndex[];
	private colorGroupSize: number;

	static readonly globalColorIndex: Color[] = [
		new Color(0, 0, 0, 0),
		new Color(0, 0, 0, 0),
		new Color(0, 0, 0, 0),
		new Color(0, 0, 0, 0),
		new Color(88, 124, 39, 255),
		new Color(108, 151, 47, 255),
		new Color(125, 176, 55, 255),
		new Color(66, 93, 29, 255),
		new Color(172, 162, 114, 255),
		new Color(210, 199, 138, 255),
		new Color(244, 230, 161, 255),
		new Color(128, 122, 85, 255),
		new Color(138, 138, 138, 255),
		new Color(169, 169, 169, 255),
		new Color(197, 197, 197, 255),
		new Color(104, 104, 104, 255),
		new Color(178, 0, 0, 255),
		new Color(217, 0, 0, 255),
		new Color(252, 0, 0, 255),
		new Color(133, 0, 0, 255),
		new Color(111, 111, 178, 255),
		new Color(136, 136, 217, 255),
		new Color(158, 158, 252, 255),
		new Color(83, 83, 133, 255),
		new Color(116, 116, 116, 255),
		new Color(142, 142, 142, 255),
		new Color(165, 165, 165, 255),
		new Color(87, 87, 87, 255),
		new Color(0, 86, 0, 255),
		new Color(0, 105, 0, 255),
		new Color(0, 123, 0, 255),
		new Color(0, 64, 0, 255),
		new Color(178, 178, 178, 255),
		new Color(217, 217, 217, 255),
		new Color(252, 252, 252, 255),
		new Color(133, 133, 133, 255),
		new Color(114, 117, 127, 255),
		new Color(139, 142, 156, 255),
		new Color(162, 166, 182, 255),
		new Color(85, 87, 96, 255),
		new Color(105, 75, 53, 255),
		new Color(128, 93, 65, 255),
		new Color(149, 108, 76, 255),
		new Color(78, 56, 39, 255),
		new Color(78, 78, 78, 255),
		new Color(95, 95, 95, 255),
		new Color(111, 111, 111, 255),
		new Color(58, 58, 58, 255),
		new Color(44, 44, 178, 255),
		new Color(54, 54, 217, 255),
		new Color(63, 63, 252, 255),
		new Color(33, 33, 133, 255),
		new Color(99, 83, 49, 255),
		new Color(122, 101, 61, 255),
		new Color(141, 118, 71, 255),
		new Color(74, 62, 38, 255),
		new Color(178, 175, 170, 255),
		new Color(217, 214, 208, 255),
		new Color(252, 249, 242, 255),
		new Color(133, 131, 127, 255),
		new Color(150, 88, 36, 255),
		new Color(184, 108, 43, 255),
		new Color(213, 125, 50, 255),
		new Color(113, 66, 27, 255),
		new Color(124, 52, 150, 255),
		new Color(151, 64, 184, 255),
		new Color(176, 75, 213, 255),
		new Color(93, 39, 113, 255),
		new Color(71, 107, 150, 255),
		new Color(87, 130, 184, 255),
		new Color(101, 151, 213, 255),
		new Color(53, 80, 113, 255),
		new Color(159, 159, 36, 255),
		new Color(195, 195, 43, 255),
		new Color(226, 226, 50, 255),
		new Color(120, 120, 27, 255),
		new Color(88, 142, 17, 255),
		new Color(108, 174, 21, 255),
		new Color(125, 202, 25, 255),
		new Color(66, 107, 13, 255),
		new Color(168, 88, 115, 255),
		new Color(206, 108, 140, 255),
		new Color(239, 125, 163, 255),
		new Color(126, 66, 86, 255),
		new Color(52, 52, 52, 255),
		new Color(64, 64, 64, 255),
		new Color(75, 75, 75, 255),
		new Color(39, 39, 39, 255),
		new Color(107, 107, 107, 255),
		new Color(130, 130, 130, 255),
		new Color(151, 151, 151, 255),
		new Color(80, 80, 80, 255),
		new Color(52, 88, 107, 255),
		new Color(64, 108, 130, 255),
		new Color(75, 125, 151, 255),
		new Color(39, 66, 80, 255),
		new Color(88, 43, 124, 255),
		new Color(108, 53, 151, 255),
		new Color(125, 62, 176, 255),
		new Color(66, 33, 93, 255),
		new Color(36, 52, 124, 255),
		new Color(43, 64, 151, 255),
		new Color(50, 75, 176, 255),
		new Color(27, 39, 93, 255),
		new Color(71, 52, 36, 255),
		new Color(87, 64, 43, 255),
		new Color(101, 75, 50, 255),
		new Color(53, 39, 27, 255),
		new Color(71, 88, 36, 255),
		new Color(87, 108, 43, 255),
		new Color(101, 125, 50, 255),
		new Color(53, 66, 27, 255),
		new Color(107, 36, 36, 255),
		new Color(130, 43, 43, 255),
		new Color(151, 50, 50, 255),
		new Color(80, 27, 27, 255),
		new Color(17, 17, 17, 255),
		new Color(21, 21, 21, 255),
		new Color(25, 25, 25, 255),
		new Color(13, 13, 13, 255),
		new Color(174, 166, 53, 255),
		new Color(212, 203, 65, 255),
		new Color(247, 235, 76, 255),
		new Color(130, 125, 39, 255),
		new Color(63, 152, 148, 255),
		new Color(78, 186, 181, 255),
		new Color(91, 216, 210, 255),
		new Color(47, 114, 111, 255),
		new Color(51, 89, 178, 255),
		new Color(62, 109, 217, 255),
		new Color(73, 129, 252, 255),
		new Color(39, 66, 133, 255),
		new Color(0, 151, 39, 255),
		new Color(0, 185, 49, 255),
		new Color(0, 214, 57, 255),
		new Color(0, 113, 30, 255),
		new Color(90, 59, 34, 255),
		new Color(110, 73, 41, 255),
		new Color(127, 85, 48, 255),
		new Color(67, 44, 25, 255),
		new Color(78, 1, 0, 255),
		new Color(95, 1, 0, 255),
		new Color(111, 2, 0, 255),
		new Color(58, 1, 0, 255)
	];
}