export const warriorTraitParts = [
  "background",
  "weapon",
  "rune",
  "companion",
  "head",
  "body",
  "shield",
] as const;

export type WarriorTraitPart = (typeof warriorTraitParts)[number];

export type Trait = {
  idx: number;
  displayName: string;
  description?: string;
  part: WarriorTraitPart;
  filename: string;
};

export const warriorTraits: Trait[] = [
  {
    idx: 0,
    filename: "bg_black.png",
    part: "background",
    displayName: "Black",
  },
  {
    idx: 1,
    filename: "bg_blue.png",
    part: "background",
    displayName: "Blue",
  },
  {
    idx: 2,
    filename: "bg_green.png",
    part: "background",
    displayName: "Green",
  },
  {
    idx: 3,
    filename: "bg_purple.png",
    part: "background",
    displayName: "Purple",
  },
  {
    idx: 4,
    filename: "bg_red.png",
    part: "background",
    displayName: "Red",
  },
  {
    idx: 5,
    filename: "body_amazon_green_skindark.png",
    part: "body",
    displayName: "Green Amazonian Jumpsuit",
  },
  {
    idx: 6,
    filename: "body_amazon_green_skinlight.png",
    part: "body",
    displayName: "Green Amazonian Jumpsuit",
  },
  {
    idx: 7,
    filename: "body_amazon_red_skindark.png",
    part: "body",
    displayName: "Red Amazonian Jumpsuit",
  },
  {
    idx: 8,
    filename: "body_amazon_yellow_skinlight.png",
    part: "body",
    displayName: "Yellow Amazonian Jumpsuit",
  },
  {
    idx: 9,
    filename: "body_athena_skinlight.png",
    part: "body",
    displayName: "Athenian Robe",
  },
  {
    idx: 10,
    filename: "body_auraknight_blue.png",
    part: "body",
    displayName: "Aura Knight with Blue Cloak",
  },
  {
    idx: 11,
    filename: "body_auraknight_red.png",
    part: "body",
    displayName: "Aura Knight with Red Cloak",
  },
  {
    idx: 12,
    filename: "body_auraknight_yellow.png",
    part: "body",
    displayName: "Aura Knight with Yellow Cloak",
  },
  {
    idx: 13,
    filename: "body_bandArmor_brown.png",
    part: "body",
    displayName: "Banded Armor of Earth",
  },
  {
    idx: 14,
    filename: "body_bandArmor_green.png",
    part: "body",
    displayName: "Banded Armor of the Forest",
  },
  {
    idx: 15,
    filename: "body_bandArmor_purple.png",
    part: "body",
    displayName: "Banded Armor of the Ether",
  },
  {
    idx: 16,
    filename: "body_barbarian_skindark.png",
    part: "body",
    displayName: "Classic Gold Barbarian Briefs",
  },
  {
    idx: 17,
    filename: "body_barbarian_skinlight.png",
    part: "body",
    displayName: "Classic Leather Barbarian Briefs",
  },
  {
    idx: 18,
    filename: "body_bea_skindark.png",
    part: "body",
    displayName: "Battle Bikini",
  },
  {
    idx: 19,
    filename: "body_byzantine.png",
    part: "body",
    displayName: "Gold Lamellar",
  },
  {
    idx: 20,
    filename: "body_clericknight_skindark.png",
    part: "body",
    displayName: "Blue Medieval Livery",
  },
  {
    idx: 21,
    filename: "body_clericknight_skinlight.png",
    part: "body",
    displayName: "Green Medieval Livery",
  },
  {
    idx: 22,
    filename: "body_cloak_blue.png",
    part: "body",
    displayName: "Traveller's Cloak Blue",
  },
  {
    idx: 23,
    filename: "body_cloak_red.png",
    part: "body",
    displayName: "Traveller's Cloak Red",
  },
  {
    idx: 24,
    filename: "body_cloak_yellow.png",
    part: "body",
    displayName: "Traveller's Cloak Yellow",
  },
  {
    idx: 25,
    filename: "body_colorArmor.png",
    part: "body",
    displayName: "Hue Master Pass Guardian",
  },
  {
    idx: 26,
    filename: "body_commando_skindark.png",
    part: "body",
    displayName: "Commando Fatigues",
  },
  {
    idx: 27,
    filename: "body_commando_skinlight.png",
    part: "body",
    displayName: "Commando Fatigues",
  },
  {
    idx: 28,
    filename: "body_cyberhalf_skindark.png",
    part: "body",
    displayName: "Cyborg Body",
  },
  {
    idx: 29,
    filename: "body_cyberhalf_skinlight.png",
    part: "body",
    displayName: "Cyborg Body",
  },
  {
    idx: 30,
    filename: "body_cyberviking.png",
    part: "body",
    displayName: "Cyber Viking",
  },
  {
    idx: 31,
    filename: "body_darkAssasin.png",
    part: "body",
    displayName: "Dark Assassin Tunic",
  },
  {
    idx: 32,
    filename: "body_desert.png",
    part: "body",
    displayName: "Desert Wear",
  },
  {
    idx: 33,
    filename: "body_dom_fem_skindark.png",
    part: "body",
    displayName: "White Dominatrix Gear",
  },
  {
    idx: 34,
    filename: "body_dom_fem_skinlight.png",
    part: "body",
    displayName: "Black Dominatrix Gear",
  },
  {
    idx: 35,
    filename: "body_dom_male_skindark.png",
    part: "body",
    displayName: "White Dominatrix Gear",
  },
  {
    idx: 36,
    filename: "body_dom_male_skinlight.png",
    part: "body",
    displayName: "Black Dominatrix Gear",
  },
  {
    idx: 37,
    filename: "body_fem_knight_blue_skinlight.png",
    part: "body",
    displayName: "Blue Knight",
  },
  {
    idx: 38,
    filename: "body_fem_knight_brown_skindark.png",
    part: "body",
    displayName: "Brown Knight",
  },
  {
    idx: 39,
    filename: "body_fem_knight_color.png",
    part: "body",
    displayName: "Rainbow Knight",
  },
  {
    idx: 40,
    filename: "body_fem_knight_green_skinlight.png",
    part: "body",
    displayName: "Green Knight",
  },
  {
    idx: 41,
    filename: "body_fem_knight_purple_skindark.png",
    part: "body",
    displayName: "Purple Knight",
  },
  {
    idx: 42,
    filename: "body_fem_knight_red_skinmid.png",
    part: "body",
    displayName: "Red Knight",
  },
  {
    idx: 43,
    filename: "body_fem_knight_white_skindark.png",
    part: "body",
    displayName: "White Knight",
  },
  {
    idx: 44,
    filename: "body_fem_knight_yellow_skinlight.png",
    part: "body",
    displayName: "Yellow Knight",
  },
  {
    idx: 45,
    filename: "body_fembarian_skindark.png",
    part: "body",
    displayName: "Classic Gold Barbarian Bikini",
  },
  {
    idx: 46,
    filename: "body_fembarian_skinlight.png",
    part: "body",
    displayName: "Classic Leather Barbarian Bikini",
  },
  {
    idx: 47,
    filename: "body_femcaptain.png",
    part: "body",
    displayName: "Pirate Captain",
  },
  {
    idx: 48,
    filename: "body_femguard_skindark.png",
    part: "body",
    displayName: "Honor Guard of the South",
  },
  {
    idx: 49,
    filename: "body_femguard_skinlight.png",
    part: "body",
    displayName: "Honor Guard of the North",
  },
  {
    idx: 50,
    filename: "body_femofficer.png",
    part: "body",
    displayName: "Officer Uniform",
  },
  {
    idx: 51,
    filename: "body_fempirateWar.png",
    part: "body",
    displayName: "Pirate Garb",
  },
  {
    idx: 52,
    filename: "body_femwolf.png",
    part: "body",
    displayName: "Northern Barbarian ",
  },
  {
    idx: 53,
    filename: "body_fur_skindark.png",
    part: "body",
    displayName: "Fur Barbarian",
  },
  {
    idx: 54,
    filename: "body_fur_skinlight.png",
    part: "body",
    displayName: "Fur Barbarian",
  },
  {
    idx: 55,
    filename: "body_gaul_skindark.png",
    part: "body",
    displayName: "Gallus Gear",
  },
  {
    idx: 56,
    filename: "body_gaul_skinlight.png",
    part: "body",
    displayName: "Gallus Gear",
  },
  {
    idx: 57,
    filename: "body_gladiator_skindark.png",
    part: "body",
    displayName: "Murmillo Gear",
  },
  {
    idx: 58,
    filename: "body_gladiator_skinlight.png",
    part: "body",
    displayName: "Murmillo Gear",
  },
  {
    idx: 59,
    filename: "body_gloryKnight_skindark.png",
    part: "body",
    displayName: "Glory Knight",
  },
  {
    idx: 60,
    filename: "body_gloryKnight_skinlight.png",
    part: "body",
    displayName: "Glory Knight",
  },
  {
    idx: 61,
    filename: "body_goblin_brute.png",
    part: "body",
    displayName: "Goblin Toga",
  },
  {
    idx: 62,
    filename: "body_goblin_leather.png",
    part: "body",
    displayName: "Goblin Footsoldier",
  },
  {
    idx: 63,
    filename: "body_goblin_skull.png",
    part: "body",
    displayName: "Goblin Raider",
  },
  {
    idx: 64,
    filename: "body_grillknight_blue_skindark.png",
    part: "body",
    displayName: "Iron Knight of the Heath",
  },
  {
    idx: 65,
    filename: "body_grillknight_green_skinlight.png",
    part: "body",
    displayName: "Iron Knight of the Hills",
  },
  {
    idx: 66,
    filename: "body_gruffer_skindark.png",
    part: "body",
    displayName: "Street Hoodlum",
  },
  {
    idx: 67,
    filename: "body_gruffer_skinlight.png",
    part: "body",
    displayName: "Street Hoodlum",
  },
  {
    idx: 68,
    filename: "body_guardian_blue.png",
    part: "body",
    displayName: "Guardian Zero",
  },
  {
    idx: 69,
    filename: "body_guardian_grey.png",
    part: "body",
    displayName: "Guardian of the Flame",
  },
  {
    idx: 70,
    filename: "body_highlander.png",
    part: "body",
    displayName: "Highlander's Tartan",
  },
  {
    idx: 71,
    filename: "body_judo_skindark.png",
    part: "body",
    displayName: "Equatorial Keikogi",
  },
  {
    idx: 72,
    filename: "body_judo_skinlight.png",
    part: "body",
    displayName: "Capital City Keikogi",
  },
  {
    idx: 73,
    filename: "body_knight_blue.png",
    part: "body",
    displayName: "Blue Hedge Knight Armor",
  },
  {
    idx: 74,
    filename: "body_knight_brown.png",
    part: "body",
    displayName: "Brown Hedge Knight Armor",
  },
  {
    idx: 75,
    filename: "body_knight_green.png",
    part: "body",
    displayName: "Green Hedge Knight Armor",
  },
  {
    idx: 76,
    filename: "body_knight_purple.png",
    part: "body",
    displayName: "Purple Hedge Knight Armor",
  },
  {
    idx: 77,
    filename: "body_knight_red.png",
    part: "body",
    displayName: "Red Hedge Knight Armor",
  },
  {
    idx: 78,
    filename: "body_knight_white.png",
    part: "body",
    displayName: "White Hedge Knight Armor",
  },
  {
    idx: 79,
    filename: "body_knight_yellow.png",
    part: "body",
    displayName: "Yellow Hedge Knight Armor",
  },
  {
    idx: 80,
    filename: "body_knight.png",
    part: "body",
    displayName: "Alchemist Armor",
  },
  {
    idx: 81,
    filename: "body_knightair.png",
    part: "body",
    displayName: "Armor of Air",
  },
  {
    idx: 82,
    filename: "body_knightearth.png",
    part: "body",
    displayName: "Armor of Earth",
  },
  {
    idx: 83,
    filename: "body_knightfire.png",
    part: "body",
    displayName: "Armor of Fire",
  },
  {
    idx: 84,
    filename: "body_knightTurtle_green.png",
    part: "body",
    displayName: "Terrapin Armor",
  },
  {
    idx: 85,
    filename: "body_knightTurtle_yellow.png",
    part: "body",
    displayName: "Chelonian Armor",
  },
  {
    idx: 86,
    filename: "body_knightwater.png",
    part: "body",
    displayName: "Armor of Water",
  },
  {
    idx: 87,
    filename: "body_kobold_black.png",
    part: "body",
    displayName: "Kobold Grunt Gear",
  },
  {
    idx: 88,
    filename: "body_kobold_red.png",
    part: "body",
    displayName: "Kobold Captain Gear",
  },
  {
    idx: 89,
    filename: "body_lea_skinlight.png",
    part: "body",
    displayName: "Red Battle Bikini",
  },
  {
    idx: 90,
    filename: "body_mado.png",
    part: "body",
    displayName: "Tundra Robe",
  },
  {
    idx: 91,
    filename: "body_martial_skindark.png",
    part: "body",
    displayName: "North Island MMA Pants",
  },
  {
    idx: 92,
    filename: "body_martial_skinlight.png",
    part: "body",
    displayName: "South Island MMA Pants",
  },
  {
    idx: 93,
    filename: "body_megasuit.png",
    part: "body",
    displayName: "Megasuit",
  },
  {
    idx: 94,
    filename: "body_meso_skindark.png",
    part: "body",
    displayName: "Majestic Epic Gear",
  },
  {
    idx: 95,
    filename: "body_meso_skinlight.png",
    part: "body",
    displayName: "Exalted Epic Gear",
  },
  {
    idx: 96,
    filename: "body_meso_skinmid.png",
    part: "body",
    displayName: "Sovereign Epic Gear",
  },
  {
    idx: 97,
    filename: "body_mma_skindark.png",
    part: "body",
    displayName: "Red Boxing Shorts",
  },
  {
    idx: 98,
    filename: "body_mma_skinlight.png",
    part: "body",
    displayName: "Blue Boxing Shorts",
  },
  {
    idx: 99,
    filename: "body_nordarmour_skindark.png",
    part: "body",
    displayName: "Nord Armor",
  },
  {
    idx: 100,
    filename: "body_nordarmour_skinlight.png",
    part: "body",
    displayName: "Nord Armor",
  },
  {
    idx: 101,
    filename: "body_nude_skindark.png",
    part: "body",
    displayName: "Nude",
  },
  {
    idx: 102,
    filename: "body_nude_skinlight.png",
    part: "body",
    displayName: "Nude",
  },
  {
    idx: 103,
    filename: "body_onepiece_black_skinlight.png",
    part: "body",
    displayName: "Black One Piece",
  },
  {
    idx: 104,
    filename: "body_onepiece_green_skinmid.png",
    part: "body",
    displayName: "Green One Piece",
  },
  {
    idx: 105,
    filename: "body_onepiece_red_skinlight.png",
    part: "body",
    displayName: "Red One Piece",
  },
  {
    idx: 106,
    filename: "body_onepiece_white_skinmid.png",
    part: "body",
    displayName: "White One Piece",
  },
  {
    idx: 107,
    filename: "body_onepiece_yellow_skindark.png",
    part: "body",
    displayName: "Yellow One Piece",
  },
  {
    idx: 108,
    filename: "body_pirateWar.png",
    part: "body",
    displayName: "Pirate Garb",
  },
  {
    idx: 109,
    filename: "body_plateArmor_black.png",
    part: "body",
    displayName: "Dominion Plate Armor",
  },
  {
    idx: 110,
    filename: "body_plateArmor_blue.png",
    part: "body",
    displayName: "Skylord Plate Armor",
  },
  {
    idx: 111,
    filename: "body_plateArmor_red.png",
    part: "body",
    displayName: "Omega Plate Armor",
  },
  {
    idx: 112,
    filename: "body_plateArmor_white.png",
    part: "body",
    displayName: "Tower Plate Armor",
  },
  {
    idx: 113,
    filename: "body_prismknight.png",
    part: "body",
    displayName: "Prism Armor",
  },
  {
    idx: 114,
    filename: "body_provoc_green_skinmid.png",
    part: "body",
    displayName: "Green Provocator Garb",
  },
  {
    idx: 115,
    filename: "body_provoc_purple_skindark.png",
    part: "body",
    displayName: "Purple Provocator Garb",
  },
  {
    idx: 116,
    filename: "body_provoc_red_skinlight.png",
    part: "body",
    displayName: "Red Provocator Garb",
  },
  {
    idx: 117,
    filename: "body_provoc_yellow_skindark.png",
    part: "body",
    displayName: "Yellow Provocator Garb",
  },
  {
    idx: 118,
    filename: "body_redcover.png",
    part: "body",
    displayName: "Red Suit",
  },
  {
    idx: 119,
    filename: "body_rin.png",
    part: "body",
    displayName: "Sakura Dress",
  },
  {
    idx: 120,
    filename: "body_roadwarrior_fem_skindark.png",
    part: "body",
    displayName: "Yellow Road Spandex",
  },
  {
    idx: 121,
    filename: "body_roadwarrior_fem_skinlight.png",
    part: "body",
    displayName: "Green Road Spandex",
  },
  {
    idx: 122,
    filename: "body_roadwarrior_fem_skinmid.png",
    part: "body",
    displayName: "Green Road Spandex",
  },
  {
    idx: 123,
    filename: "body_roadwarrior_goblin.png",
    part: "body",
    displayName: "Goblin Road Warrior",
  },
  {
    idx: 124,
    filename: "body_roadwarrior_kobold.png",
    part: "body",
    displayName: "Kobold Road Warrior",
  },
  {
    idx: 125,
    filename: "body_roadwarrior_skindark.png",
    part: "body",
    displayName: "Orange Road Warrior",
  },
  {
    idx: 126,
    filename: "body_roadwarrior_skinlight.png",
    part: "body",
    displayName: "Purple Road Warrior",
  },
  {
    idx: 127,
    filename: "body_robo_blue.png",
    part: "body",
    displayName: "Superalloy Bot ",
  },
  {
    idx: 128,
    filename: "body_robo_gold.png",
    part: "body",
    displayName: "Chrysopoeia Bot ",
  },
  {
    idx: 129,
    filename: "body_robo_grey.png",
    part: "body",
    displayName: "Argyropoeia Bot",
  },
  {
    idx: 130,
    filename: "body_samurai_dark.png",
    part: "body",
    displayName: "Dark Ronin Armor",
  },
  {
    idx: 131,
    filename: "body_samurai_red.png",
    part: "body",
    displayName: "Red Ronin Armor",
  },
  {
    idx: 132,
    filename: "body_sari.png",
    part: "body",
    displayName: "Battle Sari",
  },
  {
    idx: 133,
    filename: "body_sariwar.png",
    part: "body",
    displayName: "Divine Battle Garment",
  },
  {
    idx: 134,
    filename: "body_sharp_purple.png",
    part: "body",
    displayName: "Purple Belt Ruffian",
  },
  {
    idx: 135,
    filename: "body_sharp_yellow.png",
    part: "body",
    displayName: "Gold Belt Ruffian",
  },
  {
    idx: 136,
    filename: "body_shirtarmor_blue.png",
    part: "body",
    displayName: "Blue Tunic Armor",
  },
  {
    idx: 137,
    filename: "body_shirtarmor_brown.png",
    part: "body",
    displayName: "Brown Tunic Armor",
  },
  {
    idx: 138,
    filename: "body_shirtarmor_green.png",
    part: "body",
    displayName: "Green Tunic Armor",
  },
  {
    idx: 139,
    filename: "body_shirtarmor_purple.png",
    part: "body",
    displayName: "Purple Tunic Armor",
  },
  {
    idx: 140,
    filename: "body_shirtarmor_red.png",
    part: "body",
    displayName: "Red Tunic Armor",
  },
  {
    idx: 141,
    filename: "body_shirtarmor_white.png",
    part: "body",
    displayName: "White Tunic Armor",
  },
  {
    idx: 142,
    filename: "body_shirtarmor_yellow.png",
    part: "body",
    displayName: "Yellow Tunic Armor",
  },
  {
    idx: 143,
    filename: "body_spartan_gold_skindark.png",
    part: "body",
    displayName: "Gladiator's Cloak with Purple Briefs",
  },
  {
    idx: 144,
    filename: "body_spartan_gold_skinlight.png",
    part: "body",
    displayName: "Gladiator's Cloak with Leather Briefs",
  },
  {
    idx: 145,
    filename: "body_spartan_silver_skinlight.png",
    part: "body",
    displayName: "Gladiator's Cloak with Olive Briefs",
  },
  {
    idx: 146,
    filename: "body_spartan_silver_skinmid.png",
    part: "body",
    displayName: "Gladiator's Cloak with Green Briefs",
  },
  {
    idx: 147,
    filename: "body_spikeBarb_skindark.png",
    part: "body",
    displayName: "Auric Spike Armor",
  },
  {
    idx: 148,
    filename: "body_spikeBarb_skinlight.png",
    part: "body",
    displayName: "Amethyst Spike Armor",
  },
  {
    idx: 149,
    filename: "body_starcleric_blue.png",
    part: "body",
    displayName: "Sapphire Paladin Gear",
  },
  {
    idx: 150,
    filename: "body_starcleric_green.png",
    part: "body",
    displayName: "Xanthous Paladin Gear",
  },
  {
    idx: 151,
    filename: "body_starcleric_white.png",
    part: "body",
    displayName: "Alabaster Paladin Gear",
  },
  {
    idx: 152,
    filename: "body_streetpunk_brown_skinlight.png",
    part: "body",
    displayName: "Street Punk with Brown Camo",
  },
  {
    idx: 153,
    filename: "body_streetpunk_fem_skindark.png",
    part: "body",
    displayName: "Street Punk with Rose Camo",
  },
  {
    idx: 154,
    filename: "body_streetpunk_fem_skinlight.png",
    part: "body",
    displayName: "Street Punk with Violet Camo",
  },
  {
    idx: 155,
    filename: "body_streetpunk_fem_skinmid.png",
    part: "body",
    displayName: "Street Punk with Teal Camo",
  },
  {
    idx: 156,
    filename: "body_streetpunk_goblin.png",
    part: "body",
    displayName: "Street Punk Goblin",
  },
  {
    idx: 157,
    filename: "body_streetpunk_green_skindark.png",
    part: "body",
    displayName: "Street Punk with Green Camo",
  },
  {
    idx: 158,
    filename: "body_streetpunk_kobold.png",
    part: "body",
    displayName: "Street Punk Kobold",
  },
  {
    idx: 159,
    filename: "body_streetpunk_purple_skinlight.png",
    part: "body",
    displayName: "Street Punk with Brown Camo",
  },
  {
    idx: 160,
    filename: "body_streetpunk_red_skinmid.png",
    part: "body",
    displayName: "Street Punk with Red Camo",
  },
  {
    idx: 161,
    filename: "body_suit_skindark.png",
    part: "body",
    displayName: "Business Suit",
  },
  {
    idx: 162,
    filename: "body_suit_skinlight.png",
    part: "body",
    displayName: "Business Suit",
  },
  {
    idx: 163,
    filename: "body_surdarmour_skindark.png",
    part: "body",
    displayName: "Surd Armor ",
  },
  {
    idx: 164,
    filename: "body_surdarmour_skinlight.png",
    part: "body",
    displayName: "Surd Armor ",
  },
  {
    idx: 165,
    filename: "body_suspenders_skindark.png",
    part: "body",
    displayName: "Red Macho Pants",
  },
  {
    idx: 166,
    filename: "body_suspenders_skinlight.png",
    part: "body",
    displayName: "Purple Macho Pants",
  },
  {
    idx: 167,
    filename: "body_valkyrie_skindark.png",
    part: "body",
    displayName: "Purple Valkyrie Armor",
  },
  {
    idx: 168,
    filename: "body_valkyrie_skinlight.png",
    part: "body",
    displayName: "Blue Valkyrie Armor",
  },
  {
    idx: 169,
    filename: "body_vampiresuit.png",
    part: "body",
    displayName: "Blood Suit",
  },
  {
    idx: 170,
    filename: "body_wildbone_fem.png",
    part: "body",
    displayName: "Bone Warrior",
  },
  {
    idx: 171,
    filename: "body_wildfem.png",
    part: "body",
    displayName: "Zuli Suit",
  },
  {
    idx: 172,
    filename: "body_woodarmor_fem.png",
    part: "body",
    displayName: "Woodland Armor",
  },
  {
    idx: 173,
    filename: "body_woodfem_brown_skinlight.png",
    part: "body",
    displayName: "North Woodland Cloak",
  },
  {
    idx: 174,
    filename: "body_woodfem_green_skinmid.png",
    part: "body",
    displayName: "West Woodland Cloak",
  },
  {
    idx: 175,
    filename: "body_woodfem_skindark.png",
    part: "body",
    displayName: "South Woodland Cloak",
  },
  {
    idx: 176,
    filename: "body_wrestler_skindark.png",
    part: "body",
    displayName: "Yellow Wrestling Singlet",
  },
  {
    idx: 177,
    filename: "body_wrestler_skinlight.png",
    part: "body",
    displayName: "Purple Wrestling Singlet",
  },
  {
    idx: 178,
    filename: "body_wrestler_skinmid.png",
    part: "body",
    displayName: "Yellow Wrestling Singlet",
  },
  {
    idx: 179,
    filename: "companion_baboon.png",
    part: "companion",
    displayName: "Hamadryas Baboon",
    description:
      "The Hamadryas Baboon is a Warrior Companion and an intimidating partner. When threatened or perturbed, the Hamadryas Baboon may yawn to show an opponent their teeth. Many Warriors bonded to these Baboon Companions have also adopted this behavior when entering battle. These creatures are thought to have been brought from the Old World by the arrival of the Emissary, and archaeological Wizards have unearthed Pre-Singularity depictions of these Baboons even prior to the Emissary's arrival.",
  },
  {
    idx: 180,
    filename: "companion_beetle_blue.png",
    part: "companion",
    displayName: "Ultramarine Rhinoceros Beetle",
    description:
      "The Ultramarine Rhinoceros Beetle is a Warrior Companion and relative of the Aurelian Rhinoceros Beetle and Orchid Rhinoceros Beetle. Like their cousins, the Ultramarine Rhinoceros Beetles are notable for their tough exoskeletons and large horns. In Goblin Town, these specific Beetles are bred and used in gambling fights.",
  },
  {
    idx: 181,
    filename: "companion_beetle_gold.png",
    part: "companion",
    displayName: "Aurelian Rhinoceros Beetle",
    description:
      "The Aurelian Rhinoceros Beetle is a giant golden beetle with a horn adorning its head. These Warrior Companions are prized for their thick exoskeletons, which make them serviceable tanks on the field of battle. When disturbed, they are known to emit an unnerving hiss, which make them excellent Companions to use on watch for enemies.",
  },
  {
    idx: 182,
    filename: "companion_beetle_purple.png",
    part: "companion",
    displayName: "Orchid Rhinoceros Beetle",
    description:
      "The Orchid Rhinoceros Beetle is a Warrior Companion and giant purple beetle adorned with a large horn upon its head. It is closely related to the Aurelian Rhinoceros Beetle and Ultramarine Rhinoceros Beetle. These beetles are known for their tough exteriors that serve as excellent cover in battle. Environmentalists loathe these giant insects for the harm they cause in the Banana Groves, with many Green Hat Wizards attempting to relocate them and conserve the land.",
  },
  {
    idx: 183,
    filename: "companion_boar_blue.png",
    part: "companion",
    displayName: "Royal Razorback",
    description:
      "The Royal Razorback is a feral pig and Warrior Companion which sports a coat of brilliant blue hair. These animals were once overhunted nearly to extinction for their coats, which were favored as wall displays by ancient monarchs, along with their tusks from which were carved tools and jewelry. The arrival of the Warriors in the Runiverse put an end to this tradition as they began to develop deep bonds with the creatures.",
  },
  {
    idx: 184,
    filename: "companion_boar_brown.png",
    part: "companion",
    displayName: "Dirt Pig",
    description:
      "The Dirt Pig is a Warrior Companion which dwells in the more temperate regions of the Runiverse. This bristly-haired swine is herbivorous, but is well-equipped for protection by virtue of its large, protruding tusks. They are often found wallowing in dirt and mud to keep themselves cool.",
  },
  {
    idx: 185,
    filename: "companion_boar_dark.png",
    part: "companion",
    displayName: "Styxian Boar",
    description:
      "The Styxian Boar is a Warrior Companion and relative of the Dirt Pig, Royal Razorback, and Scarlet Swine. These animals wander The Veld and are considered bad luck by many bands of traveling Warrior, who hold a superstition that the creatures were born from the River of the Dead. Warriors who form bonds with these Boars know this to be untrue.",
  },
  {
    idx: 186,
    filename: "companion_boar_red.png",
    part: "companion",
    displayName: "Scarlet Swine",
    description:
      "The Scarlet Swine is a Warrior Companion related to the Dirt Pig, Styxian Boar, and Royal Razorback. This pig is recognizable by its fiery red bristles and generally keeps within its social groups. The tusks of the Scarlet Swine serve as protection during battle, though the animals are usually amiable unless provoked.",
  },
  {
    idx: 187,
    filename: "companion_buff.png",
    part: "companion",
    displayName: "Buffkin",
    description:
      "Buffkins are a Warrior Companion and herd animal which is most often found in large concentrations in Buffkin Plains. These lage, lumbering beasts are highly effective beasts of burden for traveling Warriors. Due to their large forms, Buffkins are also formidable partners on the battlefield. The Buffkin is the subject of the Buffkin Card in the Runes Trading Cards Game.",
  },
  {
    idx: 188,
    filename: "companion_cassowary.png",
    part: "companion",
    displayName: "Greater Cassowary",
    description:
      "The Greater Cassowary is a Warrior Companion and large flightless bird. Although these great birds are typically shy and wary toward humans, they are fierce when protecting themselves or their bonded Warrior. Their talons may easily cause great injury by the rending and evisceration of flesh.",
  },
  {
    idx: 189,
    filename: "companion_cobra_black.png",
    part: "companion",
    displayName: "Sable Cobra",
    description:
      "The Sable Cobra is a Warrior Companion and a venomous snake found in the Runiverse. Related to the Sand Cobra and the Albino Cobra, these snakes are notable for the hoods around their heads which they flare during times of disturbance. The Sable Cobra can grow to intimidating lengths over 6 ft. long.",
  },
  {
    idx: 190,
    filename: "companion_cobra_brown.png",
    part: "companion",
    displayName: "Sand Cobra",
    description:
      "The Sand Cobra is a Warrior Companion and venomous snake recognizable for the hood around its head which is flares during times of intimidation. When disturbed, the Sand Cobra raises the upper length of its body into an attacking position. Unlike the Sable Cobra and the Albino Cobra, the Sand Cobra may also project its venom toward perceived threats.",
  },
  {
    idx: 191,
    filename: "companion_cobra_white.png",
    part: "companion",
    displayName: "Albino Cobra",
    description:
      "The Albino Cobra is a Warrior Companion with a white coloring to its scales due to genetic mutation. These cobras often have a diminished sense of sight in comparison with other types of cobra, but their bonded Warriors are often quick to claim that the venom of an Albino Snake is the most deadly in the Runiverse and without cure.",
  },
  {
    idx: 192,
    filename: "companion_demonHound.png",
    part: "companion",
    displayName: "Demon Hound",
    description:
      'The Demon Hound is a Warrior Companion and ferocious creature, displaying a near-canine appearance with sharp fangs protruding from its mouth and horns atop its head. It is often said that these beasts were once the guardians of the Underworld in the days before the Singularity when reality warped and planes began to intersect. For this reason, these large dogs are also known colloquially as "hellhounds."',
  },
  {
    idx: 193,
    filename: "companion_drone.png",
    part: "companion",
    displayName: "Attack Drone",
    description:
      "The Attack Drone is a curious Warrior Companion, and one of the few inorganic Companions that a Warrior might take. The Drone was first cobbled and reassembled from scavenged parts by Warrior tinkerers from Old World parts from before the Singularity. These remnants of the past serve well as Companions, equipped with an onboard artificial intelligence which serves well for espionage and subsequent attack.",
  },
  {
    idx: 194,
    filename: "companion_duck.png",
    part: "companion",
    displayName: "Duck",
    description:
      'The Duck is an unusual Warrior Companion, however, it is also in some ways representative of their nonmagical abilities. Wizards may often refer to Warriors and other nonmagical people by the term "duck." While this is generally meant as a slur, some Warriors have come to appreciate and appropriate the term. Many Ducks of the Runiverse, both literal and figurative, reside in the aptly-named Duckwood. The term "Duck" is used colloquially to refer to non-magic denizens of The Runiverse. It was an internal joke developed by Bisonic during the development of the Runiverse Game.',
  },
  {
    idx: 195,
    filename: "companion_eagle_brown.png",
    part: "companion",
    displayName: "Wild Eagle",
    description:
      "The Wild Eagle is a majestic Warrior Companion which is representative of the strength of their bonded Warrior. The Wild Eagle is one of the largest birds in the Runiverse and generally lives in seclusion, aside from those who serve as Companions. In battle, the Wild Eagle is fierce with a grip that is known to break the bones of its enemies.",
  },
  {
    idx: 196,
    filename: "companion_eagle_gold.png",
    part: "companion",
    displayName: "Eagle of Halcyon",
    description:
      "The Eagle of Halcyon is a gilded bird and Warrior Companion which nests at sea in the time of the winter solstice. These rare birds often bond to seafaring Warriors, who swear by their strange ability to calm even the most monstrous waves. Warriors bonded to Eagles of Halcyon are typically beyond their time of fighting, and seek peace and serenity above all else.",
  },
  {
    idx: 197,
    filename: "companion_eagle_harpy.png",
    part: "companion",
    displayName: "Harpy Eagle",
    description:
      "The Harpy Eagle is a massive bird of prey and a steadfast Warrior Companion. It is considered a relative of Raptors, with its closest extant relative believed to be the Obsidian Raptor. A Harpy Eagle may eagerly prey on Null and Silver Goats, which occasionally begets animosity between Warrior clans. These birds' large, sharp talons are a terror on the battlefield.",
  },
  {
    idx: 198,
    filename: "companion_goat_black.png",
    part: "companion",
    displayName: "Black Goat",
    description:
      "The Black Goat is a Warrior Companion that is highly adaptable to many environments with a very low demand for feed. This makes them excellent for bonding with nomadic Warriors who travel the Runiverse. Notably, these goats may feast on many types of vegetation when the need arises, but will succumb to fatality if ingesting a large amount of carrots.",
  },
  {
    idx: 199,
    filename: "companion_goat_purple.png",
    part: "companion",
    displayName: "Null Goat",
    description:
      "Native to the BattleMage Mountains, Null Goats are a species of goat that have developed Magic-resistant skull & horns in order to fend off Magic users that hunt in the mountains. Shepherds who also inhabit the area have begun domesticating the animals as they are fiercely loyal & excellent sentries. Originally conceptualized by Giveahoot on 11/19/2021, the Null Goat was made into an actual companion in the Runiverse within the Warriors collection. The Null Goat is also the subject of the Null Goat Card in Giveahoot's Runes Trading Card Game.",
  },
  {
    idx: 200,
    filename: "companion_goat_white.png",
    part: "companion",
    displayName: "Silver Goat",
    description:
      "The Silver Goat is a Warrior Companion and relative of the Black Goat. These animals have no preferred territory and can adapt to nearly any habitat. While the coat of the Silver Goat has a silvery sheen, these animals are also have the uncanny capability to detect silver deposits in the Runiverse. Many traveling Warriors bonded to Silver Goats earn their living through a trade of extracted silver.",
  },
  {
    idx: 201,
    filename: "companion_greywolf.png",
    part: "companion",
    displayName: "Grey Wolf",
    description:
      "The Grey Wolf is a Warrior Companion and social creature which prefers to bond with Warriors within clans, rather than Warriors who operate alone. It is not uncommon for multiple Warriors bonded to Grey Wolves to form clans based on the common ground of their Companions. These wolves are fiercely territorial and will not tolerate the presence of other creatures unless it is insisted upon by their bonded Warrior.",
  },
  {
    idx: 202,
    filename: "companion_griffin.png",
    part: "companion",
    displayName: "Garuda's Griffin",
    description:
      "Garuda's Griffin is a Warrior Companion and one of many ancient creatures brought back into the Runiverse by the arrival of the Emissary. The griffin's name was adopted from a deity from the times before the Singularity, which bore similar features to the griffon in hybrid physicality of a lion and an eagle. Wizards often attempt to befriend Warriors bonded to Garuda's Griffons due to the alchemical properties found in their feathers.",
  },
  {
    idx: 203,
    filename: "companion_hawk.png",
    part: "companion",
    displayName: "Spectacled Falcon",
    description:
      "The Spectacled Falcon is a Warrior Companion which earns its name by the dark rim around its eyes, appearing nearly like spectacles. Falcons are prized Companions among Warriors. They are the fasted birds in the Runiverse, and are often used as scouts during Warrior missions.",
  },
  {
    idx: 204,
    filename: "companion_hornet.png",
    part: "companion",
    displayName: "Gigas Hornet",
    description:
      "The Gigas Hornet is a Warrior Companion found mostly jungle biomes of the Runiverse. This gargantuan insect has an unusually thick exoskeleton which is useful for fending off attacks. While it has strong mandibles, the Gigas Hornet is most notably known for its venomous sting. It is widely known that if the wound of a Gigas Hornet's lancing alone does not fell its enemy, the venom will. The Gigas Hornet is also the subject of the Gigas Hornet Card in the Runes Trading Card Game.",
  },
  {
    idx: 205,
    filename: "companion_hyena.png",
    part: "companion",
    displayName: "Hyena",
    description:
      "The Hyena is an often controversial Warrior Companion, given their nature of scavenging from human corpses, though this behavior is rare from Hyenas who share a bond with a Warrior. Survivors from many wars between Warrior clans over the years report hyenas involved indulging themselves on the fallen. In turn, Dark Witches and Wizards are known to use parts of the Hyena in some practices of Black Magic.",
  },
  {
    idx: 206,
    filename: "companion_jaguar_red.png",
    part: "companion",
    displayName: "Crimson Jaguar",
    description:
      "The Crimson Jaguar is a Warrior Companion and one of the largest cats in the Runiverse, along with the Golden Jaguar. The Crimson Jaguar displays a brilliant deep red coat adorned with rosettes, but its beauty should not betray its strength and brutality. The Crimson Jaguar uses its powerful jaw to bite directly through the skull of its prey, They are fierce hunters and Warriors who bond with these creatures are well-respected in their clans.",
  },
  {
    idx: 207,
    filename: "companion_jaguar_yellow.png",
    part: "companion",
    displayName: "Golden Jaguar",
    description:
      "The Golden Jaguar is a Warrior Companion and one of the largest cats in the Runiverse along with the Crimson Jaguar. The Golden Jaguar displays a distinctive golden coat dotted with rosettes, giving a striking appearance to this apex predator. These cats are fantastic swimmers, hunting in rivers and lakes as well as on land. Golden Jaguars will also mark their territory and make themselves known with scrapes on surrounding trees and other landmarks.",
  },
  {
    idx: 208,
    filename: "companion_lynx.png",
    part: "companion",
    displayName: "Northern Lynx",
    description:
      "The Northern Lynx is a Warrior Companion and large cat with a bobbed tail, spotted coat, and tufted ears. These large felines typically populate the Northern regions of the Runiverse, as indicated by their name. These lynxes sometimes fall prey to Grey Wolves and often are in contest for food with the Woodland Wolverine. Northern Lynxes are crepuscular, sleeping much of the day, but will aid bonded Warriors easily for ambushes.",
  },
  {
    idx: 209,
    filename: "companion_macaw.png",
    part: "companion",
    displayName: "Scarlet Macaw",
    description:
      "The Scarlet Macaw is a Warrior Companion and mischievous bird which prefers the humid evergreen forests of the Runiverse. Notable for its vibrant display of feathers, the Scarlet Macaw is also adept with mimicry of human speech. Warriors who bond with these birds are known to apply this ability during times where vocal deception is necessary.",
  },
  {
    idx: 210,
    filename: "companion_magpie.png",
    part: "companion",
    displayName: "Magpie",
    description:
      "Magpies are a highly intelligent bird known to for bonds with Warriors as Companions. The social nature of these birds causes them to split their time between their Companions and their own flock. Although it may seem that multiple Magpie-bonded Warriors might form a clan of their own as a result, the loud calls of the animals have caused issues historically for those who have attempted this type of formation.",
  },
  {
    idx: 211,
    filename: "companion_mandrill.png",
    part: "companion",
    displayName: "Old World Mandrill",
    description:
      "The Old World Mandrill is a Warrior Companion and monkey which was introduced to the Runiverse with the arrival of the Emissary. The Old World Mandrill can commonly be found in The Baobabs and the jungles surrounding Green Wizard City, however, it is not uncommon to find their hordes wandering The Veld. They are known to groom each other as well as their bonded Warriors, even when there is no apparent gain. Old World Mandrills are notable for their colorful faces and posteriors.",
  },
  {
    idx: 212,
    filename: "companion_manowar.png",
    part: "companion",
    displayName: "Man o' War",
    description:
      "The Man o' War is a curious aquatic Warrior Companion. Many seafaring Warriors bond with the dangerous marine creatures, favoring their long, stinging tentacles to turn the tide in battle and occasionally utilizing detached tentacles to enhance weaponry, as their venomous sting lingers even after separating from the body. Some Warriors seek magical enchantment for their Companions, giving them the power of levitation and ability to exist on land.",
  },
  {
    idx: 213,
    filename: "companion_manticore.png",
    part: "companion",
    displayName: "Valley Manticore",
    description:
      "The Valley Manticore is a Warrior Companion and native to Manticore Valley. These strange creatures bear the face of a human, the body of a lion, and the tail of a scorpion. Although left mostly undisturbed, Manticores are occasionally present for Goblin racing which takes place in their valley, and will prey on any stray racer which presents itself, devouring them whole.",
  },
  {
    idx: 214,
    filename: "companion_nightwolf.png",
    part: "companion",
    displayName: "Night Wolf",
    description:
      "The Night Wolf is a Warrior Companion and relative of the Grey Wolf. However, unlike the Grey Wolf, it is uncommon to see Night Wolves in packs as they are typically lone predators unless bonded to a Warrior. Though they may be mistaken for the Onyx Wolf, Night Wolves are larger in stature. Some Warriors claim their Night Wolves may lead them into Dreams, much like Ghost Wolves, where they may encounter invading Souls or the typically inhabiting Dream Masters.",
  },
  {
    idx: 215,
    filename: "companion_panther.png",
    part: "companion",
    displayName: "Onyx Panther",
    description:
      "The Onyx Panther is a Warrior Companion and melanistic color variant of Golden and Crimson Jaguar. Although nearly imperceptible, rosettes are still present in the Onyx Panther's deep coat. Many Warriors bonded with Onyx Panthers say the sight of their Companion's spots swiftly leads to sight of the Grim Reaper.",
  },
  {
    idx: 216,
    filename: "companion_peacock.png",
    part: "companion",
    displayName: "Quantum Peacock",
    description:
      "The Quantum Peacock is a rare Warrior Companion with a stunning display of tail feathers. Like the spiral in the shell of the Astral Snail, the feathers of the Quantum Peacock are thought to open portals to worlds beyond, and Warriors who have bonded to these unique birds wear the badge of interdimensional protector.",
  },
  {
    idx: 217,
    filename: "companion_penguin.png",
    part: "companion",
    displayName: "Battle Penguin",
    description:
      'Battle Penguins are a rare Companion in the Warriors collection, with only 27 Warriors owning one as a companion. The "Penguins" Affiliation Group seems to refer to these creatures. Some Warriors such as wish to hunt, harm, or terrorize Battle Penguins. Some Battle Penguins live in Penguin Capital where they are given protection from such threats. The first printing of Battle Penguin Merch can be found in the Treasure Trove, a community merch project. It was a Battle Penguin Toque, said to have magical warming powers to help keep Wizards warm in the winter. Song-a-Day man wore his Battle Penguin toque in his BTC ETF video.',
  },
  {
    idx: 218,
    filename: "companion_pitHound.png",
    part: "companion",
    displayName: "Field Hound",
    description:
      "The Field Hound is a Warrior Companion trained for partnership in hunting game. Field Hounds are well-known for their tracking abilities with some trained to point, flush, and retrieve. These hounds have intense focus when they are at work on the hunt, but during times of rest are irresistably amicable and many bonded Warriors describe their Field Hound to be their best friend.",
  },
  {
    idx: 219,
    filename: "companion_raptor_black.png",
    part: "companion",
    displayName: "Obsidian Raptor",
    description:
      "The Obsidian Raptor is a Warrior Companion and one of many ancient creatures brought back into the Runiverse by the arrival of the Emissary. The Obsidian Raptor is a solitary hunter, like the Cardinal Raptor, aside from any Warrior to which it might bond. This neosaur is most active at night. Though crepuscular, rather than nocturnal in nature, the raptor spends much of its time slumbering in dark caves when not actively on a hunt.",
  },
  {
    idx: 220,
    filename: "companion_raptor_blue.png",
    part: "companion",
    displayName: "Azure Raptor",
    description:
      "The Azure Raptor is a Warrior Companion and one of many ancient creatures brought back into the Runiverse from the Old World by the arrival of the Emissary. This blue neosaur prefers warm coastal territory, though it is incapable of swimming. Like the Ash Raptor, the Azure raptor exels in pack tactics and scavenging. Though they lack the physicality to tread water, they are invaluable scavenging aids and often assist Warriors with catching fish in shallow rivers",
  },
  {
    idx: 221,
    filename: "companion_raptor_red.png",
    part: "companion",
    displayName: "Cardinal Raptor",
    description:
      "The Cardinal Raptor is a Warrior Companion and one of many ancient creatures brought back into the Runiverse by the arrival of the Emissary. Unlike the Ash Raptor and Azure Raptor, the Cardinal Raptor is a lone hunter with no pack but the companionship of its bonded Warrior. It has this in common with the Obsidian Raptor. This neosaur prefers desert climates, but will adapt to any location with moderate heat.",
  },
  {
    idx: 222,
    filename: "companion_raptor_white.png",
    part: "companion",
    displayName: "Ash Raptor",
    description:
      "The Ash Raptor is a Warrior Companion and one of many ancient creatures brought back into the Runiverse from the Old World by the arrival of the Emissary. The stark white Ash Raptor is a pack animal by instinct and will view all of those in its bonded Warrior's clan as its pack. These neosaurs excel in ambush tactics and are known for their agility.",
  },
  {
    idx: 223,
    filename: "companion_ratel.png",
    part: "companion",
    displayName: "Nastyass Honey Badger",
    description:
      "The Nastyass Honey Badger is a Warrior Companion and one of the fiercest animals in the Runiverse, considering its relatively small size. This creature is known to prey on other animals that may potentially bond to Warriors, particularly Sand Cobras and the larvae of Gigas Hornets. Even if the Honey Badger gets bitten or stung trying to get its meal, it simply doesn't care.",
  },
  {
    idx: 224,
    filename: "companion_rattlesnake.png",
    part: "companion",
    displayName: "Rattlesnake",
    description:
      "The Rattlesnake is a Warrior Companion and venemous partner. These snakes can typically be found in the cliffs of Muscle Mountain, Mount Titan, and other similar habitats, using the rocks as cover to hide from predators and ambush prey. When threatened, the Rattlesnake quickly vibrates its tail to ward potential predators away. Rattlesnakes also consume their prey whole and head-first, digesting both flesh and bone.",
  },
  {
    idx: 225,
    filename: "companion_robodog.png",
    part: "companion",
    displayName: "Robo Dog",
    description:
      "Robo Dogs are mechanical hounds that were created to serve as companions to Warriors. They are incredibly loyal and possess advanced sensory systems that allow them to track and hunt down their targets with precision. They possess great strength and can withstand heavy damage in battle. Their metallic exteriors make them resistant to fire and electric attacks. These companionable creatures have a unique bond with their partners, and will go to any length to protect them. The Robo Dog is the subject of the Robo Dog Card in the Runes Trading Card Game.",
  },
  {
    idx: 227,
    filename: "companion_tritops_blue.png",
    part: "companion",
    displayName: "Cerulean Ceratopsian",
    description:
      "The Cerulean Ceratopsian is a Warrior Companion and one of many ancient creatures brought back into the Runiverse by the arrival of the Emissary. This is an herbivorous, beaked, quadrupedal neosaur with large horns which it uses for the protection of itself and its bonded Warrior. Though typically gentle, the Ceratopsian can cause brutal carnage on the battlefield.",
  },
  {
    idx: 228,
    filename: "companion_tritops_green.png",
    part: "companion",
    displayName: "Grassland Ceratopsian",
    description:
      "The Grassland Ceratopsian is a Warrior Companion and one of many ancient creatures brought back into the Runiverse by the arrival of the Emissary. This beaked herbivore is a quadrupedal neosaur, and much like the Cerulean Ceratopsian is mostly a gentle giant when undisturbed. However, when led into battle or provoked, the Grassland Ceratopsian will not hesitate to gore enemies with its horns.",
  },
  {
    idx: 229,
    filename: "companion_turtle.png",
    part: "companion",
    displayName: "Mutant Snapping Turtle",
    description:
      "The Mutant Snapping Turtle is a Warrior Companion which, as its name suggests has mutated from the traditional snapping turtle in the time since the Singularity. These mutants sport spiked shells along with their powerful jaws which provide a great amount of protection. Warriors who have lost a bonded Mutant Snapping Turtle Companion are often marked by a shield created from the creature's carapace. These Mutant Turtles may move at a much quicker pace than their enemies often anticipate.",
  },
  {
    idx: 230,
    filename: "companion_wolverine.png",
    part: "companion",
    displayName: "Woodland Wolverine",
    description:
      'The Woodland Wolverine is a Warrior Companion and voracious eater, leading to a nickname of "The Glutton" in various parts of the Runiverse. The Woodland Wolverine has a strength and ferocity inconsistent with its small stature, and this uncharacteristic nature is often played to its advantage by their bonded Warriors against unfamiliar foes.',
  },
  {
    idx: 232,
    filename: "head_akon.png",
    part: "head",
    displayName: "Warrior Monk",
  },
  {
    idx: 233,
    filename: "head_arabian.png",
    part: "head",
    displayName: "Desert Warrior",
  },
  {
    idx: 234,
    filename: "head_armak.png",
    part: "head",
    displayName: "Indigo Mendicant",
  },
  {
    idx: 235,
    filename: "head_armok.png",
    part: "head",
    displayName: "Olive Mendicant",
  },
  {
    idx: 236,
    filename: "head_arnie.png",
    part: "head",
    displayName: "Motor Assassin",
  },
  {
    idx: 237,
    filename: "head_athena.png",
    part: "head",
    displayName: "Athenian",
  },
  {
    idx: 238,
    filename: "head_bambam.png",
    part: "head",
    displayName: "Bambam",
  },
  {
    idx: 239,
    filename: "head_barga.png",
    part: "head",
    displayName: "Wrestler Giant",
  },
  {
    idx: 240,
    filename: "head_bargo.png",
    part: "head",
    displayName: "Grappler Giant",
  },
  {
    idx: 241,
    filename: "head_base_skindark.png",
    part: "head",
    displayName: "Basic Bro",
  },
  {
    idx: 242,
    filename: "head_base_skinlight.png",
    part: "head",
    displayName: "Basic Bro",
  },
  {
    idx: 243,
    filename: "head_bearman.png",
    part: "head",
    displayName: "Grizzly Man",
  },
  {
    idx: 244,
    filename: "head_berserker_skindark.png",
    part: "head",
    displayName: "Blonde Bearded Berserker",
  },
  {
    idx: 245,
    filename: "head_berserker_skinlight.png",
    part: "head",
    displayName: "Red Bearded Berserker",
  },
  {
    idx: 246,
    filename: "head_biffi.png",
    part: "head",
    displayName: "Red Horn Lady Buff",
  },
  {
    idx: 247,
    filename: "head_bill.png",
    part: "head",
    displayName: "Forgotten Man",
  },
  {
    idx: 248,
    filename: "head_blueman.png",
    part: "head",
    displayName: "Colloidal Silver Man",
  },
  {
    idx: 249,
    filename: "head_brandan.png",
    part: "head",
    displayName: "Jungle Commando",
  },
  {
    idx: 250,
    filename: "head_brawler_skindark.png",
    part: "head",
    displayName: "Bruiser",
  },
  {
    idx: 251,
    filename: "head_brawler_skinlight.png",
    part: "head",
    displayName: "Bruiser",
  },
  {
    idx: 252,
    filename: "head_brianne.png",
    part: "head",
    displayName: "Ishkuzai",
  },
  {
    idx: 253,
    filename: "head_brock.png",
    part: "head",
    displayName: "Jungle Commando",
  },
  {
    idx: 254,
    filename: "head_buckethead_gold.png",
    part: "head",
    displayName: "BucketHead: Atomic 79",
  },
  {
    idx: 255,
    filename: "head_buckethead.png",
    part: "head",
    displayName: "BucketHead: Atomic 26",
  },
  {
    idx: 256,
    filename: "head_buffy.png",
    part: "head",
    displayName: "Yellow Horn Lady Buff",
  },
  {
    idx: 257,
    filename: "head_byzantine.png",
    part: "head",
    displayName: "Stratiotai",
  },
  {
    idx: 258,
    filename: "head_catgirl.png",
    part: "head",
    displayName: "Cat Girl",
  },
  {
    idx: 259,
    filename: "head_chad_skindark.png",
    part: "head",
    displayName: "Chad Bro",
  },
  {
    idx: 260,
    filename: "head_chad_skinlight.png",
    part: "head",
    displayName: "Chad Bro",
  },
  {
    idx: 261,
    filename: "head_chane.png",
    part: "head",
    displayName: "Kushite",
  },
  {
    idx: 262,
    filename: "head_chun.png",
    part: "head",
    displayName: "Kempo",
  },
  {
    idx: 263,
    filename: "head_cloud.png",
    part: "head",
    displayName: "Cloud Champion",
  },
  {
    idx: 264,
    filename: "head_conan.png",
    part: "head",
    displayName: "Barbarian",
  },
  {
    idx: 265,
    filename: "head_crom.png",
    part: "head",
    displayName: "Thrall Ruffian",
  },
  {
    idx: 266,
    filename: "head_crusader.png",
    part: "head",
    displayName: "Templar ",
  },
  {
    idx: 267,
    filename: "head_cyberhood.png",
    part: "head",
    displayName: "Cyber Marauder",
  },
  {
    idx: 268,
    filename: "head_cyberwolf.png",
    part: "head",
    displayName: "Cyber Wolfkin",
  },
  {
    idx: 269,
    filename: "head_cyborg.png",
    part: "head",
    displayName: "Meta Skull",
  },
  {
    idx: 270,
    filename: "head_darell.png",
    part: "head",
    displayName: "Forgotten Man",
  },
  {
    idx: 271,
    filename: "head_dormok.png",
    part: "head",
    displayName: "Jarl Raider",
  },
  {
    idx: 272,
    filename: "head_drakul.png",
    part: "head",
    displayName: "Vampyre",
  },
  {
    idx: 273,
    filename: "head_dreamknight.png",
    part: "head",
    displayName: "Dream Knight",
  },
  {
    idx: 274,
    filename: "head_elephant.png",
    part: "head",
    displayName: "Loxodonta",
  },
  {
    idx: 275,
    filename: "head_ewo.png",
    part: "head",
    displayName: "Olympian",
  },
  {
    idx: 276,
    filename: "head_executioner.png",
    part: "head",
    displayName: "Executioner",
  },
  {
    idx: 277,
    filename: "head_fanhelmet.png",
    part: "head",
    displayName: "Imperial Helmet",
  },
  {
    idx: 278,
    filename: "head_femhelm_blue.png",
    part: "head",
    displayName: "Winter Warrior",
  },
  {
    idx: 279,
    filename: "head_femhelm_brush.png",
    part: "head",
    displayName: "Spring Warrior",
  },
  {
    idx: 280,
    filename: "head_femhelm_green.png",
    part: "head",
    displayName: "Summer Warrior",
  },
  {
    idx: 281,
    filename: "head_femhelm_red.png",
    part: "head",
    displayName: "Autumn Warrior",
  },
  {
    idx: 282,
    filename: "head_fuchow.png",
    part: "head",
    displayName: "Strongman",
  },
  {
    idx: 283,
    filename: "head_furgnome.png",
    part: "head",
    displayName: "Wild Furgnome ",
  },
  {
    idx: 284,
    filename: "head_furgnomehelmet.png",
    part: "head",
    displayName: "Furgnome Mercenary",
  },
  {
    idx: 285,
    filename: "head_furgnomehorn.png",
    part: "head",
    displayName: "Furgnome Marauder",
  },
  {
    idx: 286,
    filename: "head_garth.png",
    part: "head",
    displayName: "Hood of Torment",
  },
  {
    idx: 287,
    filename: "head_gerj.png",
    part: "head",
    displayName: "Purple Viking Helm",
  },
  {
    idx: 288,
    filename: "head_gilgamesh.png",
    part: "head",
    displayName: "Akkadian ",
  },
  {
    idx: 289,
    filename: "head_gilgamish.png",
    part: "head",
    displayName: "Akkadian ",
  },
  {
    idx: 290,
    filename: "head_gilgamosh.png",
    part: "head",
    displayName: "Akkadian ",
  },
  {
    idx: 291,
    filename: "head_gladiator.png",
    part: "head",
    displayName: "Gladiator Helmet",
  },
  {
    idx: 292,
    filename: "head_glorf.png",
    part: "head",
    displayName: "Gold Dwarven Helm",
  },
  {
    idx: 293,
    filename: "head_glork.png",
    part: "head",
    displayName: "Blue Dwarven Helm",
  },
  {
    idx: 294,
    filename: "head_glorn.png",
    part: "head",
    displayName: "Purple Dwarven Helm",
  },
  {
    idx: 295,
    filename: "head_goblin_bald.png",
    part: "head",
    displayName: "Goblin",
  },
  {
    idx: 296,
    filename: "head_goblin_cap.png",
    part: "head",
    displayName: "Capped Goblin",
  },
  {
    idx: 297,
    filename: "head_goblin_skull.png",
    part: "head",
    displayName: "Goblin Chieftain",
  },
  {
    idx: 298,
    filename: "head_gorj.png",
    part: "head",
    displayName: "Yellow Viking Helm",
  },
  {
    idx: 299,
    filename: "head_grace.png",
    part: "head",
    displayName: "Nubian",
  },
  {
    idx: 300,
    filename: "head_guardian_blue.png",
    part: "head",
    displayName: "Guardian Helm",
  },
  {
    idx: 301,
    filename: "head_guardian_grey.png",
    part: "head",
    displayName: "Flame Guardian Helm",
  },
  {
    idx: 302,
    filename: "head_gunthor.png",
    part: "head",
    displayName: "Foot Soldier Helm",
  },
  {
    idx: 303,
    filename: "head_helmet_spike.png",
    part: "head",
    displayName: "Spiked Helm",
  },
  {
    idx: 304,
    filename: "head_helmet.png",
    part: "head",
    displayName: "Contender Helm",
  },
  {
    idx: 305,
    filename: "head_helmethorn_dark.png",
    part: "head",
    displayName: "Blood Horn Helm",
  },
  {
    idx: 306,
    filename: "head_helmethorn_light.png",
    part: "head",
    displayName: "Ether Horn Helm",
  },
  {
    idx: 307,
    filename: "head_hindi.png",
    part: "head",
    displayName: "Vedic Warrior",
  },
  {
    idx: 308,
    filename: "head_horse.png",
    part: "head",
    displayName: "Horse Head",
  },
  {
    idx: 309,
    filename: "head_impeh.png",
    part: "head",
    displayName: "Zimbala",
  },
  {
    idx: 310,
    filename: "head_impy.png",
    part: "head",
    displayName: "Imp Warrior",
  },
  {
    idx: 311,
    filename: "head_jardem.png",
    part: "head",
    displayName: "Earth Guard",
  },
  {
    idx: 312,
    filename: "head_jaxon.png",
    part: "head",
    displayName: "Horror Mask",
  },
  {
    idx: 313,
    filename: "head_jeff.png",
    part: "head",
    displayName: "Forgotten Man",
  },
  {
    idx: 314,
    filename: "head_jeremy.png",
    part: "head",
    displayName: "Action Man",
  },
  {
    idx: 315,
    filename: "head_john.png",
    part: "head",
    displayName: "Cool Guy",
  },
  {
    idx: 316,
    filename: "head_jordan.png",
    part: "head",
    displayName: "Sea Guard",
  },
  {
    idx: 317,
    filename: "head_joremy.png",
    part: "head",
    displayName: "Stunt Man",
  },
  {
    idx: 318,
    filename: "head_jules.png",
    part: "head",
    displayName: "Bad Mofo",
  },
  {
    idx: 319,
    filename: "head_knight_blue.png",
    part: "head",
    displayName: "Blue Knight Helm",
  },
  {
    idx: 320,
    filename: "head_knight_gold.png",
    part: "head",
    displayName: "Gold Knight Helm",
  },
  {
    idx: 321,
    filename: "head_knight_green.png",
    part: "head",
    displayName: "Green Knight Helm",
  },
  {
    idx: 322,
    filename: "head_legionnaire.png",
    part: "head",
    displayName: "Legionnaire Helmet",
  },
  {
    idx: 323,
    filename: "head_lina.png",
    part: "head",
    displayName: "Kempo",
  },
  {
    idx: 324,
    filename: "head_lion.png",
    part: "head",
    displayName: "Leo",
  },
  {
    idx: 325,
    filename: "head_lizard.png",
    part: "head",
    displayName: "Komodi",
  },
  {
    idx: 326,
    filename: "head_logan.png",
    part: "head",
    displayName: "Lycan Warrior",
  },
  {
    idx: 327,
    filename: "head_logum.png",
    part: "head",
    displayName: "Lycan Warrior",
  },
  {
    idx: 328,
    filename: "head_manuel.png",
    part: "head",
    displayName: "Cool Guy",
  },
  {
    idx: 329,
    filename: "head_marci.png",
    part: "head",
    displayName: "Kelt",
  },
  {
    idx: 330,
    filename: "head_margaret.png",
    part: "head",
    displayName: "Corvid in Fedora",
  },
  {
    idx: 331,
    filename: "head_marlan.png",
    part: "head",
    displayName: "Frankish Helm",
  },
  {
    idx: 332,
    filename: "head_marsha.png",
    part: "head",
    displayName: "Xanthe ",
  },
  {
    idx: 333,
    filename: "head_matthew.png",
    part: "head",
    displayName: "Scout",
  },
  {
    idx: 334,
    filename: "head_maude.png",
    part: "head",
    displayName: "Divanae",
  },
  {
    idx: 335,
    filename: "head_medSkull.png",
    part: "head",
    displayName: "Medieval Skull",
  },
  {
    idx: 336,
    filename: "head_mellah.png",
    part: "head",
    displayName: "Styxian",
  },
  {
    idx: 337,
    filename: "head_mello.png",
    part: "head",
    displayName: "Hibernian",
  },
  {
    idx: 338,
    filename: "head_metabot.png",
    part: "head",
    displayName: "Metabot",
  },
  {
    idx: 339,
    filename: "head_miguel.png",
    part: "head",
    displayName: "Forgotten Man",
  },
  {
    idx: 340,
    filename: "head_mucho.png",
    part: "head",
    displayName: "Macho Man",
  },
  {
    idx: 341,
    filename: "head_mushy.png",
    part: "head",
    displayName: "Fungus",
  },
  {
    idx: 342,
    filename: "head_nala.png",
    part: "head",
    displayName: "Abyssinian",
  },
  {
    idx: 343,
    filename: "head_natrix.png",
    part: "head",
    displayName: "Dominatrix",
  },
  {
    idx: 344,
    filename: "head_nourga.png",
    part: "head",
    displayName: "Flower of the Wheel",
  },
  {
    idx: 345,
    filename: "head_onna.png",
    part: "head",
    displayName: "Onna-Musha",
  },
  {
    idx: 346,
    filename: "head_parah.png",
    part: "head",
    displayName: "Corsair",
  },
  {
    idx: 347,
    filename: "head_pari.png",
    part: "head",
    displayName: "Corsair",
  },
  {
    idx: 348,
    filename: "head_piper.png",
    part: "head",
    displayName: "Avalonian",
  },
  {
    idx: 349,
    filename: "head_pippa.png",
    part: "head",
    displayName: "Marsh Girl",
  },
  {
    idx: 350,
    filename: "head_pippin.png",
    part: "head",
    displayName: "Moorish Girl",
  },
  {
    idx: 351,
    filename: "head_polarman.png",
    part: "head",
    displayName: "Polar Man",
  },
  {
    idx: 352,
    filename: "head_prisma.png",
    part: "head",
    displayName: "Prisma Helm",
  },
  {
    idx: 353,
    filename: "head_puzu.png",
    part: "head",
    displayName: "Anuran Warrior",
  },
  {
    idx: 354,
    filename: "head_rin.png",
    part: "head",
    displayName: "Oni Girl",
  },
  {
    idx: 355,
    filename: "head_riona.png",
    part: "head",
    displayName: "Psyche Warrior",
  },
  {
    idx: 356,
    filename: "head_robby.png",
    part: "head",
    displayName: "Brownlander",
  },
  {
    idx: 357,
    filename: "head_rocketman.png",
    part: "head",
    displayName: "Rocket Helm",
  },
  {
    idx: 358,
    filename: "head_rockmer.png",
    part: "head",
    displayName: "East Sider",
  },
  {
    idx: 359,
    filename: "head_rockmov.png",
    part: "head",
    displayName: "South Sider",
  },
  {
    idx: 360,
    filename: "head_rocktim.png",
    part: "head",
    displayName: "Mandinka",
  },
  {
    idx: 361,
    filename: "head_rocky.png",
    part: "head",
    displayName: "Action Hero",
  },
  {
    idx: 362,
    filename: "head_rommi.png",
    part: "head",
    displayName: "Meriotic Warrior",
  },
  {
    idx: 363,
    filename: "head_ronny.png",
    part: "head",
    displayName: "Meriotic Warrior",
  },
  {
    idx: 364,
    filename: "head_rothkor.png",
    part: "head",
    displayName: "Durm and Strang",
  },
  {
    idx: 365,
    filename: "head_samurai_dark.png",
    part: "head",
    displayName: "Dark Ronin",
  },
  {
    idx: 366,
    filename: "head_samurai_red.png",
    part: "head",
    displayName: "Red Ronin",
  },
  {
    idx: 367,
    filename: "head_sel.png",
    part: "head",
    displayName: "Peahen Warrior",
  },
  {
    idx: 368,
    filename: "head_shana.png",
    part: "head",
    displayName: "Lady Barbarian",
  },
  {
    idx: 369,
    filename: "head_sharon.png",
    part: "head",
    displayName: "Woodlander",
  },
  {
    idx: 370,
    filename: "head_sharyl.png",
    part: "head",
    displayName: "Forgotten Lady",
  },
  {
    idx: 371,
    filename: "head_shawn.png",
    part: "head",
    displayName: "Highlander",
  },
  {
    idx: 372,
    filename: "head_shellah.png",
    part: "head",
    displayName: "Archipelagian",
  },
  {
    idx: 373,
    filename: "head_shelley.png",
    part: "head",
    displayName: "Archipelagian",
  },
  {
    idx: 374,
    filename: "head_sherah.png",
    part: "head",
    displayName: "Forgotten Lady",
  },
  {
    idx: 375,
    filename: "head_sherry.png",
    part: "head",
    displayName: "Forgotten Lady",
  },
  {
    idx: 376,
    filename: "head_shivrek.png",
    part: "head",
    displayName: "Wild Woman",
  },
  {
    idx: 377,
    filename: "head_shutterknight.png",
    part: "head",
    displayName: "Shutter Knight",
  },
  {
    idx: 378,
    filename: "head_sloane.png",
    part: "head",
    displayName: "Bonnie Lass",
  },
  {
    idx: 379,
    filename: "head_sloanna.png",
    part: "head",
    displayName: "Daughter of the Brine",
  },
  {
    idx: 380,
    filename: "head_sol.png",
    part: "head",
    displayName: "Peacock Warrior",
  },
  {
    idx: 381,
    filename: "head_spartan_skindark.png",
    part: "head",
    displayName: "Praetorian",
  },
  {
    idx: 382,
    filename: "head_spartan_skinlight.png",
    part: "head",
    displayName: "Praetorian",
  },
  {
    idx: 383,
    filename: "head_spz.png",
    part: "head",
    displayName: "Cyber Viking",
  },
  {
    idx: 384,
    filename: "head_stan.png",
    part: "head",
    displayName: "Mescaline Warrior",
  },
  {
    idx: 385,
    filename: "head_steve.png",
    part: "head",
    displayName: "Forgotten Man",
  },
  {
    idx: 386,
    filename: "head_tania.png",
    part: "head",
    displayName: "She Wolf",
  },
  {
    idx: 387,
    filename: "head_tiger.png",
    part: "head",
    displayName: "Tigris",
  },
  {
    idx: 388,
    filename: "head_tora.png",
    part: "head",
    displayName: "Lady of the Oasis ",
  },
  {
    idx: 389,
    filename: "head_tori.png",
    part: "head",
    displayName: "Lady of the Oasis ",
  },
  {
    idx: 390,
    filename: "head_toru.png",
    part: "head",
    displayName: "Lady of the Oasis ",
  },
  {
    idx: 391,
    filename: "head_tv.png",
    part: "head",
    displayName: "TV",
  },
  {
    idx: 392,
    filename: "head_valkyrie.png",
    part: "head",
    displayName: "Valkyrie",
  },
  {
    idx: 393,
    filename: "head_valkyrun.png",
    part: "head",
    displayName: "Valkyrie",
  },
  {
    idx: 394,
    filename: "head_velbeh.png",
    part: "head",
    displayName: "Lady of the Mountain ",
  },
  {
    idx: 395,
    filename: "head_velbi.png",
    part: "head",
    displayName: "Lady of the Mountain ",
  },
  {
    idx: 396,
    filename: "head_victor.png",
    part: "head",
    displayName: "Happy Viking",
  },
  {
    idx: 397,
    filename: "head_visorman.png",
    part: "head",
    displayName: "Visor Knight",
  },
  {
    idx: 398,
    filename: "head_voideth.png",
    part: "head",
    displayName: "Darkling",
  },
  {
    idx: 399,
    filename: "head_wambe.png",
    part: "head",
    displayName: "Kobold Captain",
  },
  {
    idx: 400,
    filename: "head_wembo.png",
    part: "head",
    displayName: "Kobold Grunt",
  },
  {
    idx: 401,
    filename: "head_whartel.png",
    part: "head",
    displayName: "Weirdling",
  },
  {
    idx: 402,
    filename: "head_wharton.png",
    part: "head",
    displayName: "Elder",
  },
  {
    idx: 403,
    filename: "head_willson.png",
    part: "head",
    displayName: "Dune Man",
  },
  {
    idx: 404,
    filename: "head_willy.png",
    part: "head",
    displayName: "Brigand",
  },
  {
    idx: 405,
    filename: "head_womble.png",
    part: "head",
    displayName: "Wild Kobold ",
  },
  {
    idx: 406,
    filename: "head_yan.png",
    part: "head",
    displayName: "Shaolin",
  },
  {
    idx: 407,
    filename: "head_zubbik.png",
    part: "head",
    displayName: "Mountain Warrior",
  },
  {
    idx: 409,
    filename: "rune_air.png",
    part: "rune",
    displayName: "Rune of Air",
    description:
      "The element of air represents intellect, communication, and knowledge. It is useful on spells related to mental clarity and wisdom. The Rune of Air whispers secrets through the leaves and guides the drifting clouds. Elusive and ever-moving, this rune is invoked by those who seek clarity of thought, swift movement, or freedom from worldly constraints. Uvlius's studies of Runes conclude that the Rune of Air is not directly tied to a word in this set, but he theorizes it may govern the unseen ideas that connect all things, the breath between words.",
  },
  {
    idx: 410,
    filename: "rune_brass.png",
    part: "rune",
    displayName: "Rune of Brass",
    description:
      "Forged in smoke and solder, the Rune of Brass hums with the resonance of invention. It is the rune of artisans, tinkerers, and machines that seem to think for themselves. Brass binds structure to spirit. Uvlius has yet to complete his association of Brass with a specific Word, though he believes it resonates strongly with tools, melody, or measure.",
  },
  {
    idx: 411,
    filename: "rune_brimstone.png",
    part: "rune",
    displayName: "Rune of Brimstone",
    description:
      'The Rune of Brimstone embodies purification through fire—capable of both cleansing and total destruction in large quantities. This rune is used to eradicate the old, broken, or impure, making way for renewal and new beginnings. The Rune of Brimstone crackles with the power of rebellion and change. It is invoked in moments of defiance, when the status quo must be burned away to make room for something new. Uvlius\'s studies of Runes conclude that the Rune of Brimstone is often represented by the word "Defy", as brimstone conjures rebellion, fire, and the will to break boundaries.',
  },
  {
    idx: 412,
    filename: "rune_cinnabar.png",
    part: "rune",
    displayName: "Rune of Cinnabar",
    description:
      "This vivid, red-orange rune channels raw life force and transformation. Cinnabar pulses with alchemical energy, capable of healing or poisoning—depending on the will of the caster. Uvlius's studies of Runes conclude that the Rune of Cinnabar is often represented by the word \"Avocado\", as cinnabar symbolizes vitality and magical transformation—qualities found in nature's nutrient-rich fruit.",
  },
  {
    idx: 413,
    filename: "rune_down.png",
    part: "rune",
    displayName: "Rune of Down",
    description:
      'Misc A rune used to decrease power of spells, abilities, and any subtractive function. Featherlight and comforting, the Rune of Down brings rest, gentleness, and quiet protection. It is often stitched into blankets, whispered into lullabies, or hidden in the hush of falling snow. Uvlius\'s studies of Runes conclude that the Rune of Down is often represented by the word "Sock", as down brings softness, warmth, and comfort—just like a cozy sock.',
  },
  {
    idx: 414,
    filename: "rune_earth.png",
    part: "rune",
    displayName: "Rune of Earth",
    description:
      'Elemental Earth is the foundation upon which life is built. This rune confers stability, fertility, physicality, and healing to spells. A foundational rune of patience and growth, the Rune of Earth holds steady under all things. It is the rune of farmers, builders, and those who dig deep for strength. Uvlius\'s studies of Runes conclude that the Rune of Earth is often represented by the word "Hand", as hands plant seeds, shape clay, and build—perfectly grounded in the elemental power of Earth.',
  },
  {
    idx: 415,
    filename: "rune_fire.png",
    part: "rune",
    displayName: "Rune of Fire",
    description:
      "Elemental Fire is the element of energy, passion, and purification. Spells augmented with this rune are supercharged with the destructive or purifying force of fire. The Rune of Fire blazes with passion, destruction, and rebirth. It is the rune of the forge and the flame, representing both creativity and chaos. Invoked in moments of urgency or inspiration, it leaves nothing unchanged. Uvlius believes Fire may be too wild to be pinned to a single word from his current research—but suspects it may align with expressions of boldness, heat, or raw power.",
  },
  {
    idx: 416,
    filename: "rune_jupiter.png",
    part: "rune",
    displayName: "Rune of Jupiter",
    description:
      'Planetary / Alchemy From the ruler of the gods himself, Jupiter, a rune of growth, prosperity, and wisdom. The influence of this rune can enhance learning and wealth accumulation. Majestic and generous, the Rune of Jupiter governs expansion, fortune, and journeys across land or stars. It is a rune of leadership, belief, and wide-open skies. Uvlius\'s studies of Runes conclude that the Rune of Jupiter is often represented by the word "Ticket", as Jupiter governs expansion and adventure, and a ticket is a gateway to grand journeys.',
  },
  {
    idx: 417,
    filename: "rune_lime.png",
    part: "rune",
    displayName: "Rune of Lime",
    description:
      "Bright, sharp, and full of energy, the Rune of Lime cuts through stagnation with zesty clarity. It carries the essence of surprise and sparkle, often favored by tricksters and spirits of renewal. Uvlius has not yet linked Lime to a definitive Word, but suspects it hums in harmony with laughter, refreshment, or the zing of a clever idea.",
  },
  {
    idx: 418,
    filename: "rune_mars.png",
    part: "rune",
    displayName: "Rune of Mars",
    description:
      "Planetary / Alchemy Violence! War! Conflict! The rune of aggression and battle. Tempering magic with the Rune of Mars can add extreme power, especially with spells of destruction. The Rune of Mars is a rune of warriors and conflict. It pulses with adrenaline, strategy, and courage. It is invoked by those preparing to fight—or protect. Uvlius's field notes suggest Mars may tie to urgent action or challenge, but a precise Word remains elusive in this set.",
  },
  {
    idx: 419,
    filename: "rune_mercury.png",
    part: "rune",
    displayName: "Rune of Mercury",
    description:
      'Planetary / Alchemy Based on the speediest planet in the solar system, and the god of communication, trickery, and deceit. This rune can add speed to spells, and aid in communication magic. Fleet-footed and clever, the Rune of Mercury governs motion, messages, and mental agility. It zips through the world like thought itself—connecting people, ideas, and places. Uvlius\'s studies of Runes conclude that the Rune of Mercury is often represented by the word "Follow", as Mercury, the messenger, leads through language and movement, guiding those who follow.',
  },
  {
    idx: 420,
    filename: "rune_neptune.png",
    part: "rune",
    displayName: "Rune of Neptune",
    description:
      "Planetary / Alchemy A rune of dreams, illusions, and intuition. Wizards using this rune find it intensifies psychic abilities and is helpful in penetrating mystical planes of alternate realities Deep, dreamy, and unknowable, the Rune of Neptune governs illusions, emotions, and the tides of magic. It is called upon for visions, dreams, and journeys beneath the surface. Uvlius has not completed Neptune’s entry in his active scrolls, but suspects it is submerged in mysteries tied to depth, dreams, or water’s pull.",
  },
  {
    idx: 421,
    filename: "rune_omega.png",
    part: "rune",
    displayName: "Rune of Omega",
    description:
      "Misc A rune of supreme power and a final state of being. Wizards wielding this rune are often incredibly powerful having pushed their arcane practice to it's limits. The Rune of Omega marks the end of things: the final page, the closing bell, the last breath. But endings hold power, and this rune is revered in rituals of completion and rest. Uvlius has not linked Omega to a word in this particular set, but notes it often whispers behind moments of finality, graduation, or graceful exit.",
  },
  {
    idx: 422,
    filename: "rune_pluto.png",
    part: "rune",
    displayName: "Rune of Pluto",
    description:
      'Planetary / Alchemy A planet located in the extremity of the solar system and the namesake of the god of the underworld, this rune embodies extremities, power, change, death and rebirth. This rune is often employed in communion with demons, darkness, and the shadow self. Mysterious and transformative, the Rune of Pluto governs the unseen—death, rebirth, and the power of what lies below. It is both feared and honored, for it changes all who touch it. Uvlius\'s studies of Runes conclude that the Rune of Pluto is often represented by the word "Disease", as Pluto evokes transformation, endings, and the unseen forces that challenge life.',
  },
  {
    idx: 423,
    filename: "rune_power.png",
    part: "rune",
    displayName: "Rune of Power",
  },
  {
    idx: 424,
    filename: "rune_protection.png",
    part: "rune",
    displayName: "Rune of Protection",
  },
  {
    idx: 425,
    filename: "rune_saturn.png",
    part: "rune",
    displayName: "Rune of Saturn",
    description:
      'Planetary / Alchemy With a glyph shaped like a scythe, this rune is favored by farmers for its influence in agriculture and husbandry. This rune instills discipline and structure, and is great for bringing stability to magic. The Rune of Saturn turns with slow gravity. It governs time, discipline, memory, and the patterns that shape fate. In its presence, all things must wait and endure. Uvlius\'s studies of Runes conclude that the Rune of Saturn is often represented by the word "Year", as Saturn rules over time, cycles, and the steady march of seasons.',
  },
  {
    idx: 426,
    filename: "rune_sigma.png",
    part: "rune",
    displayName: "Rune of Sigma",
    description:
      'Misc This rune is quite mysterious, and its uses are still being discovered. Though difficult to define, is is most often considered a rune of transcendence, with its users often on paths of spiritual independence. Associated with logic, mathematics, and the sum of parts, the Rune of Sigma is invoked in calculations and predictions. It is both pattern and precision. Uvlius\'s studies of Runes conclude that the Rune of Sigma is often represented by the word "Twice", as Sigma reflects patterns, math, and repetition—concepts captured in doubling.',
  },
  {
    idx: 427,
    filename: "rune_steel.png",
    part: "rune",
    displayName: "Rune of Steel",
    description:
      'Cold, exact, and enduring, the Rune of Steel sharpens resolve and fortifies the body and mind. It is drawn by smiths, soldiers, and those who do not bend. Uvlius\'s studies of Runes conclude that the Rune of Steel is often represented by the word "Resist", as steel symbolizes resilience and strength—resistance forged in metal.',
  },
  {
    idx: 428,
    filename: "rune_sun.png",
    part: "rune",
    displayName: "Rune of Sun",
    description:
      "Radiant and life-giving, the Rune of Sun blazes with warmth, vision, and illumination. It is a rune of clarity, growth, and shining one’s truth into the world. Uvlius has not definitively matched the Sun rune with a word from this set but believes it is present in all acts of hope, illumination, and beginning again.",
  },
  {
    idx: 429,
    filename: "rune_up.png",
    part: "rune",
    displayName: "Rune of Up",
  },
  {
    idx: 430,
    filename: "rune_uranus.png",
    part: "rune",
    displayName: "Rune of Uranus",
    description:
      "Planetary / Alchemy A rune of freedom, innovation, and rebellion, Uranus is an excellent amplifier for creative expression. It is a rune that is often found influencing the most genius and original thinkers of ever age. Wild, eccentric, and revolutionary, the Rune of Uranus governs chaos that becomes genius. It breaks old rules, invents new paths, and shocks stagnant systems awake. Uvlius considers Uranus a difficult rune to categorize, but imagines it might one day be tied to surprising words like “Zap,” “Flip,” or “Unravel.”",
  },
  {
    idx: 431,
    filename: "rune_venus.png",
    part: "rune",
    displayName: "Rune of Venus",
    description:
      'Planetary / Alchemy A rune of love, beauty, emotion, and aesthetics. The rune can be used to influence relationships and matters of the heart The Rune of Venus glows with beauty, love, and magnetic charm. It is the rune of attraction, art, softness, and the tenderest forms of power. Uvlius\'s studies of Runes conclude that the Rune of Venus is often represented by the word "Wink", as Venus radiates charm, beauty, and flirtation—a wink holds all three.',
  },
  {
    idx: 432,
    filename: "rune_water.png",
    part: "rune",
    displayName: "Rune of Water",
    description:
      "Elemental Water is the element of intuition, emotion, and the subconscious. This rune is invoked in rituals and spells of love and psychic abilities. Flowing, feeling, and ever-changing, the Rune of Water speaks to emotion, adaptability, and intuition. It can nurture or erode, depending on the current. Uvlius has not yet matched Water to a word in this series, but believes it dances closely with themes of emotion, reflection, and connection.",
  },
  {
    idx: 434,
    filename: "shield_3tri.png",
    part: "shield",
    displayName: "Triple Triangle Shield",
    description:
      "The Triple Triangle Shield is a round Shield wielded by Warriors characterized by yellow trim and an emblem of three yellow triangles on a purple field. The three triangles found on this Shield represent a strength in numbers, and while many Warriors prefer to fight alone, many enjoy the thrill of battle with kith of their clans. As such, the Triple Triangle Shield may summon assistance from a comrade when necessary, often summoning two to complete the triad.",
  },
  {
    idx: 435,
    filename: "shield_aegis.png",
    part: "shield",
    displayName: "Aegis",
    description:
      "A replica of the legendary shield, Aegis. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Because these eight Shields are based on the legendary Aegis, they are round and bear an emblem depicting the head of the Gorgon, Medusa. Aegis inspires terror in enemies and offers divine protection to Warriors who carry it.",
  },
  {
    idx: 436,
    filename: "shield_bloodSkull.png",
    part: "shield",
    displayName: "Shield of Blood Skull",
    description:
      "The Shield of Blood Skull is a macabre heater Shield wielded by Warriors which is constructed from iron and trimmed in red-hued metal. It bears the emblem of a human skull with blood dropping from the sockets of its eyes. Warriors who wield this Shield may associate themself in a Clan of Blood Skull and devote themselves to menacing tactics and acts of terror upon their enemies.",
  },
  {
    idx: 437,
    filename: "shield_bolt.png",
    part: "shield",
    displayName: "Bolt Shield",
    description:
      "The Bolt Shield is a round Shield wielded by Warriors which allows them to defy attacks from Electromancers and Spells such as Thor’s Wrath and Odin’s Despair. It is emblazoned with the image of a lightning bolt and offers sturdy protection against physical attacks as well. The Bolt Shield is crafted from tough iron and trimmed in gold. When this shield absorbs Spells of electricity, it may hold them and send them back toward enemies at the wielder’s command, though weakened in its return.",
  },
  {
    idx: 438,
    filename: "shield_buckler.png",
    part: "shield",
    displayName: "Iron Buckler",
    description:
      "The Iron Buckler is a small, round Shield wielded by Warriors. The Buckler has a domed center which is used primarily for deflecting enemy blows and is favored for its lightness, but it may not absorb heavy attacks like its larger counterparts. As this Shield is carried in the hand rather than on the arm, it allows the wielder to use it for offense by delivering forceful punches with the domed at its center. These Shields are often used with Weapons like the Falchion or Rapier. This Buckler is constructed with wood plated with iron.",
  },
  {
    idx: 439,
    filename: "shield_butterfly.png",
    part: "shield",
    displayName: "Butterfly Shield",
    description:
      "The Butterfly Shield is a round Shield wielded by Warriors which symbolizes a specific art of defense in which the wielder was trained. To float like a butterfly is better than any defense offered by a material Shield. Some Warriors who wield these Shields tell tales of receiving defensive instruction from visitors from another world and emblazon the Pink Butterfly upon their Shields in their honor.",
  },
  {
    idx: 440,
    filename: "shield_chevron_red.png",
    part: "shield",
    displayName: "Red Herald Shield",
    description:
      "The Red Herald Shield is a long kite-style Shield wielded by Warriors. These steel shields bear red trim and a red triple cross emblem with the lower third band containing two vertical lines at each end. This is a protective item wielded by heralds, and as such has the length to protect a Warrior’s side and legs while on a mount. Those who carry these Shields generally do not need their protection, as the news they carry makes them part of a neutral and protected class. However, not all who walk the Runiverse follow the law.",
  },
  {
    idx: 441,
    filename: "shield_chevron_yellow.png",
    part: "shield",
    displayName: "Gold Herald Shield",
    description:
      "The Gold Herald Shield is a long kite-style Shield wielded by Warriors. These dark iron shields bear trimming of gold with rib-like bands down a golden center spine. This is the protective item wielded by heralds, and as such has the length to protect a Warrior’s side and legs while on a mount. Those who carry these Shields generally do not need their protection, as the news they carry makes them part of a neutral and protected class. However, not all who walk the Runiverse follow the law.",
  },
  {
    idx: 442,
    filename: "shield_circle_blue.png",
    part: "shield",
    displayName: "Blue Buckler",
    description:
      "The Blue Buckler is a small, round Shield wielded by Warriors. The Buckler has a domed center which is used primarily for deflecting enemy blows and is favored for its lightness, but it may not absorb heavy attacks like its larger counterparts. As this Shield is carried in the hand rather than on the arm, it allows the wielder to use it for offense by delivering forceful punches with the domed at its center. These Shields are often used with Weapons like the Falchion or Rapier. This Buckler is constructed with hardened leather dyed blue with a bronze central boss.",
  },
  {
    idx: 443,
    filename: "shield_circle_cross_gold.png",
    part: "shield",
    displayName: "Red Aspis",
    description:
      "The Red Aspis is a round Shield wielded by Warriors characterized by its curious concave shape which is a design of ancient people predating the Technological Singularity. It has a grip toward the edge of the Shield with a secondary fastening on the forearm for support. The interesting shape of the Aspis supposedly assists masses of Warriors to push against enemies in formation. This Aspis is wooden, painted red and embellished with a cross of rouge metal coming to a central boss.",
  },
  {
    idx: 444,
    filename: "shield_circle_cross_green.png",
    part: "shield",
    displayName: "Green Aspis",
    description:
      "The Green Aspis is a round Shield wielded by Warriors characterized by its curious concave shape which is a design of ancient people predating the Technological Singularity. It has a grip toward the edge of the Shield with a secondary fastening on the forearm for support. The interesting shape of the Aspis supposedly assists masses of Warriors to push against enemies in formation. This Aspis is wooden, painted green and embellished with a cross of green-hued metal coming to a central boss.",
  },
  {
    idx: 445,
    filename: "shield_circle_green.png",
    part: "shield",
    displayName: "Green Buckler",
    description:
      "The Green Buckler is a small, round Shield wielded by Warriors. The Buckler has a domed center which is used primarily for deflecting enemy blows and is favored for its lightness, but it may not absorb heavy attacks like its larger counterparts. As this Shield is carried in the hand rather than on the arm, it allows the wielder to use it for offense by delivering forceful punches with the domed at its center. These Shields are often used with Weapons like the Falchion or Rapier. This Buckler is constructed with hardened leather dyed green with an iron central boss.",
  },
  {
    idx: 446,
    filename: "shield_circle_yellow.png",
    part: "shield",
    displayName: "Yellow Buckler",
    description:
      "The Yellow Buckler is a small, round Shield wielded by Warriors. The Buckler has a domed center which is used primarily for deflecting enemy blows and is favored for its lightness, but it may not absorb heavy attacks like its larger counterparts. As this Shield is carried in the hand rather than on the arm, it allows the wielder to use it for offense by delivering forceful punches with the domed at its center. These Shields are often used with Weapons like the Falchion or Rapier. This Buckler is constructed with hardened leather dyed yellow with a central boss of curious red-hued metal.",
  },
  {
    idx: 447,
    filename: "shield_circlewood.png",
    part: "shield",
    displayName: "Wooden Buckler",
    description:
      "The Wooden Buckler is a small, round Shield wielded by Warriors. The Buckler has a domed center which is used primarily for deflecting enemy blows and is favored for its lightness, but it may not absorb heavy attacks like its larger counterparts. As this Shield is carried in the hand rather than on the arm, it allows the wielder to use it for offense by delivering forceful punches with the domed at its center. These Shields are often used with Weapons like the Falchion or Rapier. This Buckler is constructed from glued wood planks with an iron central boss and iron edge trim.",
  },
  {
    idx: 448,
    filename: "shield_dotta.png",
    part: "shield",
    displayName: "Dotta Shield",
    description:
      "The Dotta Shield is a rare round Shield found within the Runiverse which bears the face of Hedge Wizard Dotta of the Carnival. There are few Warriors who wield the Dotta Shield, which symbolizes a completed “homeschooled” training with Dotta in Hedge Wizard Wood. While this Wizard does not often make himself difficult to find, not many Warriors have the necessary skill and disposition for acceptance into his tutelage.",
  },
  {
    idx: 449,
    filename: "shield_eye.png",
    part: "shield",
    displayName: "Illuminatus Shield",
    description:
      "The Illuminatus Shield is a rare and coveted triangular Shield wielded by Warriors within the Runiverse. This Shield is recognizable for its shape, which appears as an upside-down Illuminatus head, and it is notable as the Shield carried by The Emissary. The Warriors who carry the Illuminatus Shield fight to protect the secrets which live behind secrets, but it is unknown whether they work with or against those enigmatic Wizards whose shape their Shield bears.",
  },
  {
    idx: 450,
    filename: "shield_fire.png",
    part: "shield",
    displayName: "Fire Shield",
    description:
      "The Fire Shield is a round Shield wielded by Warriors which allows them to defy attacks from Pyromancers and Spells such as Salamander’s Tongue and Basilisk’s Hiss. It is emblazoned with the image of a flame and offers sturdy protection against physical attacks as well. The Fire Shield is crafted from tough iron and trimmed in gold. When this shield absorbs Spells of fire, it may hold them and send them back toward enemies at the wielder’s command, though weakened in its return.",
  },
  {
    idx: 451,
    filename: "shield_frog.png",
    part: "shield",
    displayName: "Frog Shield",
    description:
      "The Frog Shield is a Shield wielded by Warriors which signifies the completion of martial arts training with the Frog Masters and Sage Toads of the Marsh. Not many Warriors are able to withstand the tough conditions of the Marsh where its inhabitants thrive. However, once their training is complete, students of these masters know a discipline matched by few else in the Runiverse. This shield is emblazoned with a golden image of a frog face.",
  },
  {
    idx: 452,
    filename: "shield_goat.png",
    part: "shield",
    displayName: "Shield of the Black Goat",
    description:
      "The Shield of the Black Goat is a round Shield found within the Runiverse which bears the face of an Evil One—specifically, Evil Arcanist Black Goat of the Wood—on a purple field. There are few Warriors who wield the Shield of the Black Goat, which symbolizes that these wielders have dismantled old icons. These Warriors have danced with the Black Goat in the Wood under the cover of night and built fires in the woods which strike fear into the hearts of wolves. Warriors wielding the Shield of the Black Goat may also know an esoteric tongue understood by no others.",
  },
  {
    idx: 453,
    filename: "shield_goldcircle.png",
    part: "shield",
    displayName: "Golden Round Shield",
    description:
      "The Golden Round Shield is a rare and coveted round Shield wielded by Warriors which is made entirely of gold reinforced by Magic. The Golden Round Shield provides ample protection for all of its luxury. It is easily maneuvered and versatile, useful for shoving as well as shielding from attacks. The Golden Round Shield blinds enemies with its radiance, giving the wielder an advantage in combat.",
  },
  {
    idx: 454,
    filename: "shield_goldsquare.png",
    part: "shield",
    displayName: "Golden Pavise Shield",
    description:
      "The Golden Pavise Shield is a rare and coveted rectangular Shield wielded by Warriors which is made entirely of gold reinforced by Magic. It is convex with an outward curve that is used to help deflect incoming projectiles. The Pavise can cover most of a Warrior’s body, and may be used with a stand as static cover. However, some Warriors have taken up the pavise with enarmes for luxurious mobile protection.",
  },
  {
    idx: 455,
    filename: "shield_guardian.png",
    part: "shield",
    displayName: "Guardian Shield",
    description:
      "The Guardian Shield is a Shield wielded by Warriors which is characterized by its wide, winged top which narrows to a point at the bottom opposite a central top peak. It is of a kite-like design and constructed from steel with golden trim and a golden circular design at its center with rays almost like that of a sun. The Guardian Shield repels all offenses from opposing Wizards, thwarting Magic of any kind.",
  },
  {
    idx: 456,
    filename: "shield_hazard.png",
    part: "shield",
    displayName: "Toxin Shield",
    description:
      "The Toxin Shield is a round Shield wielded by Warriors. It is divided into three distinct green sections and a central, domed boss. This Shield surrounds the wielding Warrior with a cloud of toxins to which the Warrior is immune. The toxin cloud prevents many kinds of enemies from reaching a Warrior with a Toxin Shield, but if any are able to reach the Warrior, the Shield also acts as typical protective equipment.",
  },
  {
    idx: 457,
    filename: "shield_heart.png",
    part: "shield",
    displayName: "Eternal Love Shield",
    description:
      "The Eternal Love Shield is a Shield wielded by Warriors. It is emblazoned with the image of Seraphim’s Touch, which is a Spell practiced by Souls, but rather than give life, the Eternal Love Shield protects it. This Shield surrounds the wielding Warrior with a materialized combination of all of the love they have ever received. This protection allows safe travel through the Nightmare Dominion, and some say it will even defy advances from the Lich Emperor Supreme and the Zombie King of the Undead.",
  },
  {
    idx: 458,
    filename: "shield_holy_cyber.png",
    part: "shield",
    displayName: "White Holy Shield",
    description:
      "The White Holy Shield is a teardrop-shaped kite Shield constructed from steel with turquoise trim and wielded by Warriors. This Shield bears a lavender upward arrow with fringes toward the bottom of the symbol. These Shields have been blessed and offer the wielder a protection from divine forces. The Warriors who wield White Holy Shields are often paladins who fight as champions of justice and ideals which they consider to be holy.",
  },
  {
    idx: 459,
    filename: "shield_holy_gold.png",
    part: "shield",
    displayName: "Gold Holy Shield",
    description:
      "The Gold Holy Shield is a teardrop-shaped kite Shield constructed from steel and wielded by Warriors. This Shield bears a golden upward arrow with fringes toward the bottom of the symbol. These Shields have been blessed and offer the wielder a protection from divine forces. The Warriors who wield Gold Holy Shields are often paladins who fight as champions of justice and ideals which they consider to be holy.",
  },
  {
    idx: 460,
    filename: "shield_horseshoe.png",
    part: "shield",
    displayName: "Horseshoe Shield",
    description:
      "The Horseshoe Shield is a round Shield wielded by Warriors which is trimmed in gold and depicts a golden Lucky Horseshoe. Those who bear the Horseshoe Shield have favorable combat and often experience unexplained evasions and missed strikes from their opponents. Much like the Horseshoes that many Wizards carry and hang over their doors, this Shield also wards against Black Magic.",
  },
  {
    idx: 461,
    filename: "shield_infinity.png",
    part: "shield",
    displayName: "Infinity Shield",
    description:
      'The Infinity Shield is a round Shield wielded by Warriors which is trimmed in gold and bears a golden infinity emblem. Some Warriors will say this emblem symbolized their everlasting dedication to their craft and their clan while others will claim it is an embedded Rune of Infinity, and that the Shield was enchanted by a Wizard who has an affinity with the Infinite. This Shield is unbreakable. Infinity Shield was the answer to Day 13 of Runiverse Riddles in the Dark: "I offer protection without end, a timeless defender on which you can depend. What am I?"',
  },
  {
    idx: 462,
    filename: "shield_kite_blue.png",
    part: "shield",
    displayName: "Blue Kite",
    description:
      "The Blue Kite is a Shield wielded by Warriors which is characterized by its wide, winged top which narrows to a point at the bottom opposite a central top peak. This kite-like shape gives the Shield its name. The Blue Kite is constructed from glued wood planks covered with leather and trimmed in blue metal. This metal also runs across the shield in three distinct waves. The Blue Kite also repels all Wizard attacks of Blue Magic and is ideal for use with mounts.",
  },
  {
    idx: 463,
    filename: "shield_kite_brown.png",
    part: "shield",
    displayName: "Brown Kite",
    description:
      "The Brown Kite is a Shield wielded by Warriors which is characterized by its wide, winged top which narrows to a point at the bottom opposite a central top peak. This kite-like shape gives the Shield its name. The Brown Kite is constructed from glued wood planks covered with leather and trimmed in bronzed metal. This metal also runs across the shield in three distinct waves. The Brown Kite also repels all Wizard attacks of Orange Magic and is ideal for use with mounts.",
  },
  {
    idx: 464,
    filename: "shield_kite_down.png",
    part: "shield",
    displayName: "Shield of Down Only",
    description:
      "The Shield of Down Only is a golden-trimmed kite-style Shield wielded by Warriors which bears a golden emblem of two stacked arrows pointing downward on a field of gray steel. There is Magic about the Shield of Down Only, and Warriors who wield it can drain the very power of their enemies with shoves and blocks. Every blow in a battle taken by the Shield is weaker than the last.",
  },
  {
    idx: 465,
    filename: "shield_kite_green.png",
    part: "shield",
    displayName: "Green Kite",
    description:
      "The Green Kite is a Shield wielded by Warriors which is characterized by its wide, winged top which narrows to a point at the bottom opposite a central top peak. This kite-like shape gives the Shield its name. The Green Kite is constructed from glued wood planks covered with leather and trimmed in a curious green-hued metal. This metal also bands the shield in three distinct waves. The Green Kite also repels all Wizard attacks of Green Magic and is ideal for use with mounts.",
  },
  {
    idx: 466,
    filename: "shield_kite_purple.png",
    part: "shield",
    displayName: "Purple Kite",
    description:
      "The Purple Kite is a Shield wielded by Warriors which is characterized by its wide, winged top which narrows to a point at the bottom opposite a central top peak. This kite-like shape gives the Shield its name. The Purple Kite is constructed from glued wood planks covered with leather and trimmed in a curious lavender-hued metal. This metal also bands the shield in three distinct waves. The Purple Kite also repels all Wizard attacks of chaotic Purple Magic and is ideal for use with mounts.",
  },
  {
    idx: 467,
    filename: "shield_kite_red.png",
    part: "shield",
    displayName: "Red Kite",
    description:
      "The Red Kite is a Shield wielded by Warriors which is characterized by its wide, winged top which narrows to a point at the bottom opposite a central top peak. This kite-like shape gives the Shield its name. The Red Kite is constructed from glued wood planks covered with leather and trimmed in a curious rouge metal. This metal also bands the shield in three distinct waves. The Red Kite also repels all Wizard attacks of Red Magic and is ideal for use with mounts.",
  },
  {
    idx: 468,
    filename: "shield_kite_up.png",
    part: "shield",
    displayName: "Shield of Up Only",
    description:
      "The Shield of Up Only is a golden-trimmed kite-style Shield wielded by Warriors which bears a golden emblem of two stacked arrows pointing upward on a field of gray steel. There is Magic about the Shield of Up Only, and Warriors who wield it can increase the faculties of their own Might with shoves and blocks. Every blow in a battle taken by the Shield fills the wielding Warrior with vitality.",
  },
  {
    idx: 469,
    filename: "shield_kite_white.png",
    part: "shield",
    displayName: "White Kite",
    description:
      "The White Kite is a Shield wielded by Warriors which is characterized by its wide, winged top which narrows to a point at the bottom opposite a central top peak. This kite-like shape gives the Shield its name. The White Kite is constructed from glued wood planks covered with leather and trimmed in a curious blanched metal. This metal also bands the shield in three distinct waves. The White Kite also repels all Wizard attacks of White Magic and is ideal for use with mounts.",
  },
  {
    idx: 470,
    filename: "shield_kite_yellow.png",
    part: "shield",
    displayName: "Yellow Kite",
    description:
      "The Yellow Kite is a Shield wielded by Warriors which is characterized by its wide, winged top which narrows to a point at the bottom opposite a central top peak. This kite-like shape gives the Shield its name. The Yellow Kite is constructed from glued wood planks covered with leather dyed lavender and trimmed in a curious yellow metal. This metal also bands the shield in three distinct waves. The Yellow Kite also repels all Wizard attacks of Yellow Magic and is ideal for use with mounts.",
  },
  {
    idx: 471,
    filename: "shield_kraken.png",
    part: "shield",
    displayName: "Kraken Shield",
    description:
      "The Kraken Shield is a heater Shield wielded by Warriors which is characterized by a depiction of a lavender Kraken on the Shield’s face and with a border of blue-hued metal which shimmers like the sea. This Shield is favored by seafaring Warriors who seek the mythical beast over waves of the Great Blue Water.",
  },
  {
    idx: 472,
    filename: "shield_lotus.png",
    part: "shield",
    displayName: "Lotus Shield",
    description:
      "The Lotus Shield is a round Shield wielded by Warriors. It is wrought in a metal which has the hue of foliage and an image of a flowering red lotus is emblazoned on the face. Warriors who carry the Lotus Shield are generally known for their wisdom, and often these Warriors have trained with Frog Masters in the Marsh, much like those who bear the Frog Shield.",
  },
  {
    idx: 473,
    filename: "shield_magic.png",
    part: "shield",
    displayName: "Magic Shield",
    description:
      "The Magic Shield is a kite-style Shield wielded by Warriors which is emblazoned with the Rune of Magic. While this Shield is not protective against Magic itself, like the Guardian Shield, it is imbued with Magic such that it can block any physical attack. It will protect its wielder as long as it stays within their grip. The Magic Shield cannot be broken, cracked, or otherwise destroyed by material means.",
  },
  {
    idx: 474,
    filename: "shield_might.png",
    part: "shield",
    displayName: "Might Shield",
    description:
      "The Might Shield is a kite-style Shield wielded by Warriors which enhances their Might. It is emblazoned with the Rune of Might, which is an inversion of the Rune of Magic suggesting the Warrior's path is founded upon a strong, stable, common sense and an upright perspective firmly grounded on the material plane. Foes fear Warriors with the Might Shield, not for the Shield itself, but for its effects on the strength and tenacity of the Warrior who holds it.",
  },
  {
    idx: 475,
    filename: "shield_moon.png",
    part: "shield",
    displayName: "Shield of the Moon",
    description:
      "The Shield of the Moon is a round Shield wielded by Warriors which is characterized by its gold trim and the emblem of a crescent moon and star on a purple field. As a foil to the Shield of the Sun, this Shield enhances the wielding Warrior’s defences while they fight beneath the stars. Some of the Warriors who wield the Shield of the Moon also claim that it also gives them the power of night vision.",
  },
  {
    idx: 476,
    filename: "shield_peace.png",
    part: "shield",
    displayName: "Peace Shield",
    description:
      "The Peace Shield is a Shield wielded by Warriors and is notable for the golden symbol of peace emblazoned on a purple field. Warriors who carry the Peace Shield are typically pacifists by nature, and signify their peaceful nature through this Shield. However, these Warriors should not be underestimated, as they will use all of their Might in self-defense. Some Warriors may also carry this Shield as a decoy to dishonorably ambush unsuspecting foes.",
  },
  {
    idx: 477,
    filename: "shield_pony.png",
    part: "shield",
    displayName: "Pony Shield",
    description:
      "The Pony Shield is a long Shield wielded by Warriors which bears the emblem of a Pony’s head on a red-orange field. Aptly, Due to the Shield’s length, it is ideal for use with mounts and covers a great deal of the wielding rider’s body. When raised with intent, the Pony Shield may be also used to summon a Pony from the Elysian Fields at a Warrior’s beckoning regardless of their location in the Runiverse.",
  },
  {
    idx: 478,
    filename: "shield_prism.png",
    part: "shield",
    displayName: "Prism Shield",
    description:
      "The Prism Shield is a rare heater Shield wielded by Warriors. The Prism Shield is constructed from Chroma Crystals harvested from Chroma Crystal Row and trimmed with dark Shadow Crystals. The combination of these elements give the Prism Shield a unique ability for protection against all things Shadow. Some say these Shields even have the power to provide cover from the Quantum Shadow itself; however, there is no documented testing of this theory.",
  },
  {
    idx: 479,
    filename: "shield_samurai.png",
    part: "shield",
    displayName: "Tate Shield",
    description:
      "The Tate Shield is a curiously-shaped red Shield wielded by Warriors. It also has horizontal banded ribs for reinforcement which allow for slight flexing under heavy blows without breaking. The Tate Shield predates the Technological Singularity, and Runiverse historians note the possibility of redundancy in its name, as the word “Tate” translates to “Shield” the ancient language of its origin.",
  },
  {
    idx: 480,
    filename: "shield_shroom.png",
    part: "shield",
    displayName: "Mushroom Shield",
    description:
      "The Mushroom Shield is a round Shield wielded by Warriors that is trimmed in gold with a golden mushroom emblazoned on it. Warriors who carry the Mushroom Shield usually hold some form of loyalty to the Fungus people. Those who bear this Shield fight for the rights of the Fungus, bear shields in their honor, or occasionally toil under their banners for payment.",
  },
  {
    idx: 481,
    filename: "shield_skull.png",
    part: "shield",
    displayName: "Shield of the Skull",
    description:
      "The Shield of the Skull is a gold-trimmed oval Shield wielded by Warriors which bears the emblem of a human skull on an iron field. Warriors who bear this Shield do not fear the Grim Reaper and believe this Shield to protect them from the grip of Death. This Shield is furthermore used to intimidate opponents with its imagery, giving enemies a stark reminder of their fleeting mortality as they clash.",
  },
  {
    idx: 482,
    filename: "shield_skullflame.png",
    part: "shield",
    displayName: "Shield of the Flaming Skull ",
  },
  {
    idx: 483,
    filename: "shield_snake.png",
    part: "shield",
    displayName: "Snake Shield",
    description:
      "The Snake Shield is a gold-trimmed round Shield wielded by Warriors which bears the image of a golden asp emblazoned on a field of iron. Those who take up the Snake Shield find protection from the various snake Familiars of Wizards and snake Companions of other Warriors, many of which have deadly venom. When carrying this Shield, a bitten Warrior will suffer no more than minor swelling from the wound. However, the Shield does not ward against the Ghost Snake or Skeleton Snake.",
  },
  {
    idx: 484,
    filename: "shield_speaker.png",
    part: "shield",
    displayName: "Sonic Shield",
    description:
      "The Sonic Shield is a dark, round Shield with a domed central boss wielded by Warriors. This Shield surrounds the wielding Warrior in a barrier of silence and dispels most minor Magic that attempts to penetrate it. The Sonic Shield is particularly useful when dealing with Banshees or other Souls with Banshee’s Harps and Bells.",
  },
  {
    idx: 485,
    filename: "shield_sun.png",
    part: "shield",
    displayName: "Shield of the Sun",
    description:
      "The Shield of the Sun is a round Shield wielded by Warriors which is characterized by its gold trim and the emblem of a crescent moon and star on a purple field. As a foil to the Shield of the Moon, this Shield enhances the wielding Warrior’s defences while they fight during the day. Some of the Warriors who wield the Shield of the Sun also claim that it stores energy from the sun’s rays, replenishing their strength in battle.",
  },
  {
    idx: 486,
    filename: "shield_tomb.png",
    part: "shield",
    displayName: "Tomb Shield",
    description:
      'The Tomb Shield is a Shield made of a headstone which is wielded by Warriors. Some say these improvised Shields were the markings of old Wizards’ graves and that they have absorbed some of the remaining Magic from the earth where they were buried. This is why the Tomb Shields are able to withstand mighty blows without cracking. Despite the dubious origins and their hefty weight, many Warriors favor the Tomb Shield. Tomb Shield was the answer to Day 3 of Runiverse Riddles in the Dark: "Guarding warriors in their sleep, in crypts where shadows creep. I am the defense of the deceased that the living often keep."',
  },
  {
    idx: 487,
    filename: "shield_tri.png",
    part: "shield",
    displayName: "Shield of Balance",
    description:
      "The Shield of Balance is a Shield wielded by Warriors. It has a unique kite-like shape with the wide, winged top and a central top peak, but unlike the Runiverse kite Shields, the Shield of Balance has a rounded bottom. It is trimmed in gold and bears a diamond emblem split horizontally in the middle, forming opposing arrows on a lavender field. Wielding the Shield of Balance offers Magical protection equal to that of a Warrior’s Might.",
  },
  {
    idx: 488,
    filename: "shield_water.png",
    part: "shield",
    displayName: "Water Elemental Shield",
    description:
      "= Lore = The Water Elemental Shield is a Shield wielded by Warriors that has been steeped in Magic and emblazoned with symbols of splashing water. The Element of Water with which the Shield has been infused protects the bearer from rushing torrents and defies Spells like Kelpie’s Fury. A Warrior with this Shield could pass through a typhoon unscathed and even walk to the bottom of the Great Blue Water and back to land. A thrust of the Water Elemental Shield will also send a rush of water directed toward an enemy.",
  },
  {
    idx: 489,
    filename: "shield_widex_red.png",
    part: "shield",
    displayName: "Tanker Heater Shield",
    description:
      "The Tanker Heater Shield is a steel heater Shield wielded by Warriors. This Shield is trimmed with red-hued metal and bears an emblem similar to that of the Rune of Sun. The Tanker Heater Shield is a heavy protective device used by Warriors who exude the greatest of Might. It is a bold piece of equipment that may withstand a surprising variety of attacks despite having no magical properties.",
  },
  {
    idx: 490,
    filename: "shield_widex_yellow.png",
    part: "shield",
    displayName: "Mercenary Heater Shield",
    description:
      "The Mercenary Heater Shield is a heater-style shield wielded by Warriors characterized by its lavender and golden trim upon a steel face. Some say the golden X which crosses the Shield represents the absence of fealty to any clan or kingdom by those who carry it. When Warriors march with these Shields under any banner, it is certain that they do so for a high fine. Their loyalty lies only with currency.",
  },
  {
    idx: 491,
    filename: "shield_wind.png",
    part: "shield",
    displayName: "Air Elemental Shield",
    description:
      "The Air Elemental Shield is a Shield wielded by Warriors that has been steeped in Magic and emblazoned with billowing symbols of rushing air. The Element of Air with which the Shield has been infused protects the bearer from gales of any force and defies Spells like Zephyr’s Laugh. A Warrior with this Shield could pass through a hurricane unscathed and stand unmoved before the great beating of a dragon’s wings. A thrust of the Air Elemental Shield will also send a strong gust directed toward an enemy.",
  },
  {
    idx: 492,
    filename: "shield_wolf.png",
    part: "shield",
    displayName: "Wolf Shield",
    description:
      "The Wolf Shield is a gold-trimmed round Shield wielded by Warriors which bears the image of a golden wolf head emblazoned on a field of iron. Those who wield the Wolf Shield are protected from all harm that might befall them from enemies residing in Dreams. The Wolf Shield bears its canid symbol due to the claim that Night Wolves may lead their bonded Warriors into the Dream World, and many presume Dream Masters had a hand in the forging of these Shields.",
  },
  {
    idx: 493,
    filename: "shield_wood.png",
    part: "shield",
    displayName: "Wooden Shield",
    description:
      "The Wooden Shield is a round wooden Shield wielded by Warriors. It is constructed from glued wooden planks with no ornamentation or reinforcement of any kind. The Wooden Shield is the most basic form of protection that a Warrior might carry, and generally, they are seen in the grip of Warriors who are in training, though some go on to bear them long after their initial training in the art of Might is complete, much like the Journeyman Falchion.",
  },
  {
    idx: 494,
    filename: "item_ale.png",
    part: "weapon",
    displayName: "Mug of Ale",
    description:
      "A popular drink among all folk of the Runiverse—Brown Hat Wizards in particular are known to imbibe. Most Wizards can handle their drink, and barmen across the land are happy to serve them, but tales of drunken Wizard bar fights have prompted some pubs to invoke a strict three-mug limit on Wizardkind. Lore The Mug of Ale is a supposed Warrior Weapon, and a popular drink among all folk of the Runiverse—Warriors and Wizards alike are known to imbibe. Unlike Wizards, however, bartenders have not yet implemented any drinking restrictions upon Warriors. While this Weapon is mostly useful in attack of the wielder’s own senses, Warriors have used both empty and full mugs as projectiles and blunt instruments in brawls.",
  },
  {
    idx: 495,
    filename: "item_beer_green.png",
    part: "weapon",
    displayName: "Bottle of Goblin Beer ",
  },
  {
    idx: 496,
    filename: "item_beer_purple.png",
    part: "weapon",
    displayName: "Bottle of Rune Beer",
    description:
      "The Bottle of Rune Beer is a supposed Weapon wielded by Warriors and a favorite of those whose days on the battlefield are behind them. Unlike Goblin Beer, it is refined by Wizards who share a similar appetite for relaxation and unwinding. Some say the brews are also imbued with Rune Magic while others say this is merely appropriate branding. Although a Warrior might consider anything in their grasp to be a Weapon if needed, the bottle when broken is a crude instrument at best.",
  },
  {
    idx: 498,
    filename: "item_hambone.png",
    part: "weapon",
    displayName: "Hambone",
    description:
      "The Hambone is an improvised Warrior Weapon mainly favored by Warriors whose days on the battlefield are behind them. Many of those who carry a Hambone have grown large on the diet that it provides, discarding fully gnawed remnants and swiftly finding another full flank of meat in their hand. However, it is not totally uncommon for the inedible portions to become Bone Clubs in their own right.",
  },
  {
    idx: 499,
    filename: "item_hamburger.png",
    part: "weapon",
    displayName: "Cheeseburger",
    description:
      "The Cheeseburger is a supposed Weapon wielded by Warriors and a favorite of those whose days on the battlefield are behind them. While a Warrior might consider anything in their grasp to be a Weapon if needed, one might be hard-pressed to find a way in which to inflict harm with this delicious meal. In any case, the Cheeseburger will fill any empty belly and revitalize a Warrior’s spirit.",
  },
  {
    idx: 500,
    filename: "item_lollipop.png",
    part: "weapon",
    displayName: "Lollipop",
    description:
      "The Lollipop is a supposed Warrior Weapon mainly favored by Warriors whose days on the battlefield are behind them. While a Warrior might consider anything in their grasp to be a Weapon if needed, this is almost certainly just an oversized candy treat. However, there are those who suspect the sucker to sheath a circular blade, while others suppose the Lollipop’s swirls hold curious powers not unlike the shell of an Astral Snail.",
  },
  {
    idx: 501,
    filename: "item_ramen.png",
    part: "weapon",
    displayName: "Bowl of Ramen",
    description:
      "The Bowl of Ramen is a supposed Weapon wielded by Warriors and a favorite of those whose days on the battlefield are behind them. While a Warrior might consider anything in their grasp to be a Weapon if needed, the bowl and chopsticks would only serve the most seasoned Warrior well. In any case, the noodles, broth, meat, and poached egg found in the bowl will fill any empty belly and revitalize a Warrior’s spirit.",
  },
  {
    idx: 502,
    filename: "item_tuna.png",
    part: "weapon",
    displayName: "Frozen Tuna",
    description:
      "The Frozen Tuna is an unusual and improvised Warrior Weapon which is usually found wielded by Warriors in the cold northern regions of the Runiverse. While it seems comical, a blow from a Frozen Tuna may deal a significant amount of damage to an unsuspecting foe, as the object is essentially a giant club of ice, but these Weapons become much less useful in warm climates. However, they make an excellent meal when thawed and cooked.",
  },
  {
    idx: 504,
    filename: "weapon_axe_cyber.png",
    part: "weapon",
    displayName: "Cyber Axe",
    description:
      "The Cyber Axe is a Warrior Weapon which was first crafted by the Cyber Vikings. The Cyber Axe features a head with twin blades which were first fashioned from scavenged parts of ancient technology leftover from the time before the Singularity. In their forging, these Axes have retained or regained a small amount of Magic from their original components, and may cleave portals through which their users can communicate with one blade while its opposite will terminate the connection. An enemy felled with a Cyber Axe is reduced to data, which is stored in the Axe itself.",
  },
  {
    idx: 505,
    filename: "weapon_axe_dane_fire.png",
    part: "weapon",
    displayName: "Flaming Dane Axe",
    description:
      "The Flaming Dane Axe is a Warrior Weapon which is rarely seen. It consists of a Dane Axe engulfed in flame. Like the Firebrand, some believe the Flaming Dane Axe to be alight due to mystical powers, while others state Warriors wielding these weapons are responsible for clever application of flammable materials like, Toad Oil, which they ignite before battle.",
  },
  {
    idx: 506,
    filename: "weapon_axe_dane.png",
    part: "weapon",
    displayName: "Dane Axe",
    description:
      "The Dane Axe is a Warrior Weapon from an ancient time before the Technological Singularity. Sometimes referred to as a broadaxe, this weapon is characterized by its long shaft, wide blade, and bearded design. The Dane Axe is constructed to be used as a two-handed weapon and is ideal for cutting through both shields and armor on the battlefield. Its silhouette is most recognizable, and is highly regarded as a weapon used by elite Warriors.",
  },
  {
    idx: 507,
    filename: "weapon_axe_goblin.png",
    part: "weapon",
    displayName: "Goblin Axe",
    description:
      "The Goblin Axe is a Warrior Weapon which is common in Goblin Town, though it may be found wielded by Warriors across the Runiverse. It is constructed of green metal influenced by its Goblin creators, and the toe and heel of the blade form horns. The butt of the axe also forms two horns which allow for violence any way the instrument swings. A ruby is embedded in its cheek, though many say the gems in Goblin-made weapons are fakes.",
  },
  {
    idx: 508,
    filename: "weapon_axe.png",
    part: "weapon",
    displayName: "Battle Axe",
    description:
      "The Battle Axe is a Warrior Weapon that can be found on almost any battlefield. Axe-wielders are often seen as brutish—swinging their thick blades at the enemy in heavy slashes. As such, it is a Weapon which Wizards often associate with Warriors. The cheek of the Battle Axe's head is adorned with a cut red beryl in its center.",
  },
  {
    idx: 509,
    filename: "weapon_ballbat.png",
    part: "weapon",
    displayName: "Spiked Ball bat",
    description:
      "The Spiked Ball Bat is an improvised Weapon wielded by Warriors consisting of a baseball bat which has been driven through with long nails, adding piercing capabilities to the blunt force attacks of the bludgeoning bat. This is a cruel and brutal Weapon which is often seen among the likes of other improvised weapons like the Wratchet or Pipe Wrench and may fail the wielder if it becomes lodged in flesh or armor after a blow.",
  },
  {
    idx: 510,
    filename: "weapon_ballchain.png",
    part: "weapon",
    displayName: "Spiked Ball and Chain",
    description:
      "The Spiked Ball and Chain is a Warrior Weapon which features a spiked ball attached by a chain to a wooden handle. Sometimes this weapon may be referred to as a “flail” or a “chain mace”. This is a brutal and powerful weapon which uses the force of its momentum when swung in arcs to crack armor, shields, and bone. This weapon can also bend around shields or parries in unanticipated ways to still reach enemies.",
  },
  {
    idx: 511,
    filename: "weapon_bamboo.png",
    part: "weapon",
    displayName: "Bamboo Pole",
    description:
      "The Bamboo Pole is a Warrior Weapon commonly found in and around the areas of the Bamboo Forests. Many Ronins begin their weapons training with a Bamboo Pole, learning to use it as an extension of themselves before graduating to a deadlier bladed polearm. However, some Master Warriors' Might becomes so great that even a simple Bamboo Pole is worth more in their hands than a sword in the hands of a fool.",
  },
  {
    idx: 512,
    filename: "weapon_bass.png",
    part: "weapon",
    displayName: "Bass",
    description:
      "The Bass is a strange Warrior Weapon, which some believe to be first wielded by Dr. Slurp, Synthesizer of Sound. Though not oft carried in such a manner, the Bass proves to be a powerful instrument in its monstrous and heavy tones, bringing all foes who hear to their knees. If necessary, the Bass may also be applied for blunt force by wielding its neck.",
  },
  {
    idx: 513,
    filename: "weapon_bomb_black.png",
    part: "weapon",
    displayName: "Black Bomb",
    description:
      "The Black Bomb is a Warrior Weapon wielded by a certain kind of cavalier Warrior. The one holding a Black Bomb typically does not hold their safety in high value, and may be willing to destroy their foes at nearly any cost or casualty. Filled with Exploding Salts, this Weapon is unconcerned and unrelenting. The Black Bomb is devastation bound in a small package.",
  },
  {
    idx: 514,
    filename: "weapon_bomb_red.png",
    part: "weapon",
    displayName: "Red Bomb",
    description:
      "The Red Bomb is a Warrior Weapon wielded by a certain kind of cavalier Warrior. The one holding a Red Bomb typically does not hold their safety in high value, and may be willing to destroy their foes at nearly any cost or casualty. In addition to its devastating blast caused by Exploding Salts within it, the Red Bomb also spreads vast flames upon explosion. It is a promise of utter destruction.",
  },
  {
    idx: 515,
    filename: "weapon_bomb_skull.png",
    part: "weapon",
    displayName: "Death Bomb",
    description:
      "The Death Bomb is a Warrior Weapon wielded by brutish and conniving Warriors. The one holding a Death Bomb may be willing to destroy their foes at nearly any cost or casualty, as the bomb is packed with poisons along with Exploding Salts that ensure the destruction of anything which was unaffected by the bomb’s explosion and threatening shrapnel. Woe unto any foe that meets the Death Bomb.",
  },
  {
    idx: 516,
    filename: "weapon_bone.png",
    part: "weapon",
    displayName: "Bone Club",
    description:
      "The Bone Club is a Warrior Weapon constructed of the femur of any number of large beasts. It is a favorite improvisational weapon of Goblins for its simplicity and abundance. Other Warriors who favor Bone Clubs may often tie fabric around one end to fashion a grip, which also gives the club a slightly less brutish appearance.",
  },
  {
    idx: 517,
    filename: "weapon_boomerang_green.png",
    part: "weapon",
    displayName: "Jungle Boomerang",
    description:
      "The Jungle Boomerang is a Warrior Weapon made of light wood in the shape of a large “V”. It has a cut emerald embedded in its center and is banded with ornamentations of blue ribbon on either side. Masterful Warriors who specialize in the weaponized boomerang excel in ranged combat with the ability to throw the Boomerang such that it returns even after its strike. When forced into close combat, these large Boomerangs can also deliver incredible strikes like that of a club.",
  },
  {
    idx: 518,
    filename: "weapon_boomerang_yellow.png",
    part: "weapon",
    displayName: "Plains Boomerang",
    description:
      "The Plains Boomerang is a Warrior Weapon made of dark wood in the shape of a large “V”. It has a cut yellow diamond embedded in its center and is banded with ornamentations of lavender ribbon on either side. Masterful Warriors who specialize in the weaponized boomerang excel in ranged combat with the ability to throw the Boomerang such that it returns even after its strike. When forced into close combat, these large Boomerangs can also deliver incredible strikes like that of a club.",
  },
  {
    idx: 519,
    filename: "weapon_bostaff.png",
    part: "weapon",
    displayName: "Bo Staff",
    description:
      "The Bo Staff is a Weapon wielded by Warriors which predates the Technological Singularity into ancient times. The Bo Staff typically measures around 71 inches and is most often crafted of unfinished hardwood, though some Bamboo Poles may also be considered Bo Staves. Warriors adept with the Bo Staff use the Weapon for a variety of blocks, strikes, sweeps, and entrapments. It is mainly used for self-defense.",
  },
  {
    idx: 520,
    filename: "weapon_butcher.png",
    part: "weapon",
    displayName: "Butcher Knife",
    description:
      "The Butcher Knife is a Warrior Weapon and tool used for the cleaving of meat. However, some Warriors have taken this from simple butchery into their own trade of war. The Butcher Knife is a very portable weapon, though savage in its usage. The thick blade creates long, deep wounds that often result in death of a victim due to rapid loss of blood.",
  },
  {
    idx: 521,
    filename: "weapon_chainsaw_blue.png",
    part: "weapon",
    displayName: "Blue Chainsaw",
    description:
      "The Blue Chainsaw is an unusual Weapon wielded by Warriors with a rotating chain with teeth for cutting which is driven around a guide bar. The Chainsaw is a dangerous weapon both for the safety of the wielder and all those who come across its path. It is seen as a brutish Weapon, even by many Warriors, and scoffed at by those who prefer to practice the art of Might with instruments requiring a more delicate precision.",
  },
  {
    idx: 522,
    filename: "weapon_chainsaw_red.png",
    part: "weapon",
    displayName: "Red Chainsaw",
    description:
      "The Red Chainsaw is an unusual Weapon wielded by Warriors with a rotating chain with teeth for cutting which is driven around a guide bar. The Chainsaw is a dangerous weapon both for the safety of the wielder and all those who come across its path. It is seen as a brutish Weapon, even by many Warriors, and scoffed at by those who prefer to practice the art of Might with instruments requiring a more delicate precision.",
  },
  {
    idx: 523,
    filename: "weapon_chainsaw_yellow.png",
    part: "weapon",
    displayName: "Yellow Chainsaw",
    description:
      "The Yellow Chainsaw is an unusual Weapon wielded by Warriors with a rotating chain with teeth for cutting which is driven around a guide bar. The Chainsaw is a dangerous weapon both for the safety of the wielder and all those who come across its path. It is seen as a brutish Weapon, even by many Warriors, and scoffed at by those who prefer to practice the art of Might with instruments requiring a more delicate precision.",
  },
  {
    idx: 524,
    filename: "weapon_chakram.png",
    part: "weapon",
    displayName: "Chakram",
    description:
      "The Chakram is a Warrior Weapon formed from a circular disc with sharpened edges around its circumference, sometimes accompanied by teeth for an additional bite. The Chakram may be wielded in-hand or thrown, and serves its Warrior well in either application. The size of a Chakram depends on the preference of its wielder, and some are even small enough to be worn around the wrist.",
  },
  {
    idx: 525,
    filename: "weapon_claws_gold.png",
    part: "weapon",
    displayName: "Tiger Claws",
    description:
      "The Tiger Claws are a unique Weapon wielded by GoldClaw Champion of the Jungle—a Tigris Warrior. These Claws fit over the Warrior’s hand, emphasizing his natural weapon with three sharp, elongated claws of metal fixed to a mitt. The Tiger Claws give deep and devastating slashes to all who meet their fury.",
  },
  {
    idx: 527,
    filename: "weapon_claymore_crystal.png",
    part: "weapon",
    displayName: "Crystal Claymore",
    description:
      "The Crystal Claymore is a Warrior Weapon and a special blade forged from materials found in Chroma Crystal Row. Many believe the art of forging a Crystal Claymore was passed down to Warriors from the Hue Masters, while others believe them to be a bastardization of Hue Master works, of which violence may come across as rare. In all instances, the Warrior who wields the Crystal Claymore holds a masterfully crafted prismatic blade.",
  },
  {
    idx: 528,
    filename: "weapon_claymore.png",
    part: "weapon",
    displayName: "Master Claymore",
    description:
      "The Master Claymore is a Warrior Weapon notable for its unique, upturned crossguard with quatrefoil terminals on the ends. which readily traps enemy blades when clashing. The large sword generally requires two hands to effectively wield, but when properly taken up, the Master Claymore delivers powerful thrusts and slashes of devastating power. Some may occasionally call these “Great Swords” due to their size and ability against armored foes.",
  },
  {
    idx: 529,
    filename: "weapon_cleaver_green.png",
    part: "weapon",
    displayName: "Malachite Cleaver",
    description:
      "The Malachite Cleaver is a Weapon wielded by Warriors which is constructed from steel and inlaid with magically-reinforced malachite. The Weapon’s crossguard and grip are also ornamented and inlaid with malachite, giving the weapon a unique, green appearance. The Cleaver’s blade is broad, heavy, and intimidating. It can hack through armor and shields of those who oppose its wielder.",
  },
  {
    idx: 530,
    filename: "weapon_cleaver_purple.png",
    part: "weapon",
    displayName: "Giant Cleaver",
    description:
      "The Giant Cleaver is a Warrior Weapon and a massive sword which some Warriors claim to have won in contests with Giants who originally used the blades. Other Warriors have similar claims, though opting to tell of their heroic feats of cleaving those Giants with the Weapons, garnering their name. In any case, the Giant Cleaver requires superhuman strength to wield, and Warriors who prefer them act with raw strength over finesse in combat.",
  },
  {
    idx: 531,
    filename: "weapon_cleaver_red.png",
    part: "weapon",
    displayName: "Titan Cleaver",
    description:
      "The Titan Cleaver is a Warrior Weapon and a massive sword with which some Warriors claim to have bested the Titans of the Runiverse. Many of those who wield a Titan Cleaver say Titan-slaying Warriors are why there are so few, if any, who still roam the world. In any case, the Titan Cleaver requires superhuman strength to wield, and Warriors who prefer them act with raw strength over finesse in combat.",
  },
  {
    idx: 532,
    filename: "weapon_club.png",
    part: "weapon",
    displayName: "Wooden Club",
    description:
      "The Wooden Club is an improvised Weapon wielded by Warriors. This is a hefty piece of wood, which can be carved or simply found and swung, depending on the wielding Warrior and their needs or attachment to the Weapon. The Wooden Club is best used for delivering blows of blunt force. It’s one of the simplest Weapons found in the Runiverse, but with enough dedication, it could become something greater. Even Heracles used his own form of Wooden Club.",
  },
  {
    idx: 533,
    filename: "weapon_crowbar.png",
    part: "weapon",
    displayName: "Crowbar",
    description:
      "The Crowbar is an improvised Weapon wielded by Warriors and a useful workman’s tool. In mechanical application, the bar can be used to gain significant leverage with its curved end. The Crowbar can also be used to gain tactical leverage in the hands of a menace, who may decide to make a blunt force weapon of the device, or use its curved end to nefariously rake over a victim.",
  },
  {
    idx: 534,
    filename: "weapon_doubleblade_gold.png",
    part: "weapon",
    displayName: "Aurelian Double Blade",
    description:
      "The Aurelian Double Blade is a Warrior Weapon and a fickle polearm to master. Some Warriors swear by the advantage of the opposing dual blades of this golden weapon, claiming versatility, while those who choose to train in other martial arts declare the Double Blade a mere decoration for showmanship and demonstration.",
  },
  {
    idx: 535,
    filename: "weapon_doubleblade_purple.png",
    part: "weapon",
    displayName: "Lavender Double Blade",
    description:
      "The Lavender Double Blade is a Warrior Weapon and a fickle polearm to master. Some Warriors swear by the advantage of the opposing dual blades of the weapon, claiming versatility, while those who choose to train in other martial arts declare the Double Blade a mere decoration for showmanship and demonstration.",
  },
  {
    idx: 536,
    filename: "weapon_dragonpike_gold.png",
    part: "weapon",
    displayName: "Gilded Dragon Pike",
    description:
      "The Gilded Dragon Pike is a Weapon wielded by Warriors. It is a polearm characterized by its golden shaft, and its blade which is adorned with two golden rings. Many Warriors who wield Gilded Dragon Pikes indicate that the inclusion of gold in the weapon might be used to distract a dragon’s attention during battle, and the rings might sing with intimidation. These Weapons are preferred by those who fight with techniques of distance between themselves and their enemies.",
  },
  {
    idx: 537,
    filename: "weapon_dragonpike_green.png",
    part: "weapon",
    displayName: "Malachite Dragon Pike",
    description:
      "The Malachite Dragon Pike is a Weapon wielded by Warriors. It is a polearm characterized by its rouge shaft, and its blade which is magically-reinforced malachite blade adorned with two silver rings. Many Warriors who wield Malachite Dragon Pikes indicate that the inclusion of jangling rings in the blade is intended to distract a dragon (or any opponent) during battle. These Weapons are preferred by those who fight with techniques of distance between themselves and their enemies.",
  },
  {
    idx: 538,
    filename: "weapon_dragonpike_silver.png",
    part: "weapon",
    displayName: "Silver Dragon Pike",
    description:
      "The Silver Dragon Pike is a Weapon wielded by Warriors. It is a polearm characterized by its silver shaft, and its curiously lavender blade which is adorned with two silver rings. Many Warriors who wield Silver Dragon Pikes indicate that the inclusion of jangling rings in the blade is intended to distract a dragon (or any opponent) during battle. These Weapons are preferred by those who fight with techniques of distance between themselves and their enemies.",
  },
  {
    idx: 539,
    filename: "weapon_dragonsword_blue.png",
    part: "weapon",
    displayName: "Lazurite Dragon Sword",
    description:
      "The Lazurite Dragon Sword is a Weapon wielded by Warriors with a rare, cut red diamond embedded in the blade’s hilt, encircled in a gold setting which also flows into its winged quillons. As its name suggests, the Lazurite Dragon Sword is crafted of Lazurite, and while not typically hard enough for combat purposes, when forged in dragon fire, the mineral hardens into a beautiful blade as strong as steel. However, some false Lazulite Dragon Swords exist—sold by untrustworthy merchants—which will fail their wielders in battle. True blades are crafted by smiths in Obsidian City.",
  },
  {
    idx: 540,
    filename: "weapon_dragonsword_gold.png",
    part: "weapon",
    displayName: "Amber Dragon Sword",
    description:
      "The Amber Dragon Sword is a Weapon wielded by Warriors. The blade is said to have been fired in the combustive breath of an Amber Dragon. While many speculate this beast to be either extinct or locked behind a Gate to another Realm, Warriors hold these weapons to be precious indeed with their glowing aurelian blades; majestic, winged quillons of silver; and embedded amethyst in the fuller.",
  },
  {
    idx: 541,
    filename: "weapon_dragonsword_red.png",
    part: "weapon",
    displayName: "Tiger Eye Dragon Sword",
    description:
      "The Tiger Eye Dragon Sword is a Weapon wielded by Warriors with a rare, cut emerald embedded in the blade’s hilt, encircled in a fascinating setting of lavender metal which also flows into its winged quillons. As its name suggests, the Tiger Eye Dragon Sword is crafted of Tiger Eye, and while not typically hard enough for combat purposes, when forged in dragon fire, the gem hardens into a gleaming, striated, red blade as strong as steel. However, some false Tiger Eye Dragon Swords exist—sold by untrustworthy merchants—which will fail their wielders in battle. True blades are crafted by smiths in Obsidian City.",
  },
  {
    idx: 542,
    filename: "weapon_durendal.png",
    part: "weapon",
    displayName: "Durendal",
    description:
      "A replica of the legendary sword, Durendal. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Because these eight swords are based on the legendary Durendal, these perfect replicas have exceptional durability; contain powerful blessings of holy saints; and embody the ideals of chivalry, heroism, and courage.",
  },
  {
    idx: 543,
    filename: "weapon_estoc.png",
    part: "weapon",
    displayName: "Estoc",
    description:
      "The Estoc is a Weapon wielded by Warriors featuring a long blade used for piercing techniques, and its name translates to “thrust” in an ancient language. Curiously, it is edgeless, without sharpness in the length of the blade, as it is not a weapon for slashing. The Estoc’s tip instead is sharpened, making the sword effective against gaps in plate armor. It is rigid and long, perfect for passing through the mail of an opposing Warrior. An Estoc may also be called a “Tuck.”",
  },
  {
    idx: 544,
    filename: "weapon_excalibur.png",
    part: "weapon",
    displayName: "Excalibur",
    description:
      "A replica of the legendary sword, Excalibur. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. For Excalibur, the artificers are thought to hail from Avalon, for its regal and healing properties are characteristic of their craft. Because these eight swords are based on the legendary Excalibur, these perfect replicas are nearly indestructible, can heal wounds, command authority, and even allow their masters to walk on water.",
  },
  {
    idx: 545,
    filename: "weapon_feysword_blue.png",
    part: "weapon",
    displayName: "Agapanthus Fey Sword",
    description:
      "The Agapanthus Fey Sword is a Weapon Wielded by Warriors and a blade containing a blessing of The Fey. The blue steel draws forth an enhanced Might from Nixies and its yellow adornment calls out the stubborn fervor of Kobolds in loan to the wielding Warrior.",
  },
  {
    idx: 546,
    filename: "weapon_feysword_red.png",
    part: "weapon",
    displayName: "Amaryllis Fey Sword",
    description:
      "The Amaryllis Fey Sword is a Weapon wielded by Warriors and a blade containing a blessing of The Fey. The red steel calls upon the blood of the Warrior’s ancestry and the green metal ornamentation asks the Goblins of the Fey for their mischief and Faeries for their guile which undoubtedly give the Warrior holding the Amaryllis Fey Sword an advantage in battle.",
  },
  {
    idx: 547,
    filename: "weapon_flamethrower.png",
    part: "weapon",
    displayName: "Flame Thrower",
    description:
      "The Flame Thrower is a Warrior Weapon wielded by Warriors who have found inspiration from Pyromancer Wizards. Once the Warriors saw the great power of the Pyromancers, they were elated to find pieces of a device from the days before the Technological Singularity which would allow them to imitate this destructive power. Pyromancers, in particular, scorn Warriors wielding Flame Throwers, stating they do not understand the great nature of fire.",
  },
  {
    idx: 548,
    filename: "weapon_gaebolg.png",
    part: "weapon",
    displayName: "Gae Bolg",
    description:
      'A replica of the legendary spear, Gae Bolg. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Because these eight spears are based on the legendary Gae Bolg, these perfect replicas have the ability to inflict wounds that are impossible to heal. It is also known as the "Spear of Mortal Pain."',
  },
  {
    idx: 549,
    filename: "weapon_gladius.png",
    part: "weapon",
    displayName: "Gladius",
    description:
      "The Gladius is a Warrior Weapon and a special type of shortsword. It is both compact and deadly, intended to be used one-handed and likely in combination with a shield. While it can be used for slashing, the Gladius is a weapon mainly for thrusting techniques in close combat. Warriors who carry a Gladius favor it for its ease of draw and maneuverability in tight ranks.",
  },
  {
    idx: 550,
    filename: "weapon_goldenbow.png",
    part: "weapon",
    displayName: "Apollo's Bow",
    description:
      "Apollo's Bow is a Warrior Weapon and a bow modeled after an instrument belonging to a Pre-Singularity deity. Some Warriors who carry Apollo's Bow claim it to be the true belonging of a mythic god, due to its ability to deliver every arrow accurately, with some even summon plagues upon strike if the firing Warrior is at the zenith of their Might.",
  },
  {
    idx: 551,
    filename: "weapon_grasscutter.png",
    part: "weapon",
    displayName: "Grasscutter",
    description:
      "A replica of the legendary sword, Grasscutter. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Emissaries from the Spirit Villa were heavily consulted in the crafting of this weapon. Because these eight swords are based on the legendary Grasscutter, these perfect replicas have supernatural abilities, ward off evil spirits, and can purify water. Some historians speak of similarities between Grasscutter and Kusanagi.",
  },
  {
    idx: 552,
    filename: "weapon_gungnir.png",
    part: "weapon",
    displayName: "Gungnir",
    description:
      "A replica of the legendary trident, Gungnir. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Because these eight swords are based on the legendary Gungnir, these perfect replicas have unerring aim and always return to the wielder when cast out toward foes.",
  },
  {
    idx: 553,
    filename: "weapon_hammer_brown.png",
    part: "weapon",
    displayName: "Wooden Hammer",
    description:
      "The Wooden Hammer is a two-handed Warrior Weapon characterized by its wrapped, golden shaft and weighty hardwood head adorned with a large circular aquamarine on its cheek. The Wooden Hammer is an unusual Weapon for Warriors in that it is used to deliver crushing blows, rather than slashes or pierces of more common Warrior instruments.",
  },
  {
    idx: 554,
    filename: "weapon_hammer_grey.png",
    part: "weapon",
    displayName: "Iron Hammer",
    description:
      "The Iron Hammer is a two-handed Warrior Weapon characterized by its wrapped, golden shaft and weighty, iron hammer head. The Hammer's cheek is adorned with a large circular aquamarine set in a golden rim. The Iron Hammer is an unusual Weapon for Warriors in that it is used to deliver crushing blows, rather than slashes or pierces of more common Warrior instruments.",
  },
  {
    idx: 555,
    filename: "weapon_harpe.png",
    part: "weapon",
    displayName: "Harpe",
    description:
      "The Harpe is a legendary Warrior Weapon notable for its golden hooked blade which appears almost as a sickle. Some say that Heracles used one such weapon to slay the mighty, many-headed Hydra. There are eight known replicas of Heracles’ blade in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City.",
  },
  {
    idx: 556,
    filename: "weapon_heraclesclub.png",
    part: "weapon",
    displayName: "Club of Heracles",
    description:
      "The Club of Heracles is a Warrior Weapon fashioned after a primitive cudgel found in the ancient days before the Technological Singularity. The blunt weapon is typically made of olive wood and is carved with knobs at its striking end to deepen its traumatic blows. This weapon is most often and aptly associated with Heracles himself.",
  },
  {
    idx: 558,
    filename: "weapon_joyeuse.png",
    part: "weapon",
    displayName: "Joyeuse",
    description:
      "A replica of the legendary sword, Joyeuse. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Because these eight swords are based on the legendary Joyeuse, these perfect replicas are unbreakable and contain the strange ability to change colors thirty times per day.",
  },
  {
    idx: 559,
    filename: "weapon_kanabo.png",
    part: "weapon",
    displayName: "Kanabo",
    description:
      "The Kanabo is a Warrior Weapon often associated with legendary Warriors as well as with demons. This Weapon is a weighty club crafted from wood and lined with metal studs which strengthen its impact against enemies, crushing both bones and armor. This brutal, two-handed Weapon can range anywhere from 3 to 6 ft. in length.",
  },
  {
    idx: 560,
    filename: "weapon_katana.png",
    part: "weapon",
    displayName: "Katana",
    description:
      "The Katana is a Warrior Weapon renowned across the Runiverse for its craftsmanship, and is an iconic Weapon. This beautiful, single-edged blade represents the very soul of the Warrior who wields it, and represents a high level of discipline, honor, and skill. Below the strong and flexible blade is a circular guard which protects the Warrior’s hand from enemy strikes. Those who carry Katanas keep the blades highly polished, showing off the distinct hamon when drawn from its ornate wooden scabbard.",
  },
  {
    idx: 561,
    filename: "weapon_knife.png",
    part: "weapon",
    displayName: "Hunting Knife",
    description:
      "The Hunting Knife is a Weapon wielded by Warriors as well as a versatile field tool used for dressing and processing game after a hunt. This knife is a reliable and efficient Weapon which is tough enough to handle bones, joints, and hide without chipping. In the hands of a skilled Warrior, this easily concealable blade can be just as effective in battle as in the field.",
  },
  {
    idx: 562,
    filename: "weapon_kusanagi.png",
    part: "weapon",
    displayName: "Kusanagi",
    description:
      "A replica of the legendary sword, Kusanagi. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Because these eight swords are based on the legendary Kusanagi, these perfect replicas have a certain control over the wind. Some believe that a special mirror and jewel exist in the Runiverse which, when paired with Kusanagi, allow the bearer divine power. Some sources say this blade shares similar history to that of Grasscutter.",
  },
  {
    idx: 563,
    filename: "weapon_longbow.png",
    part: "weapon",
    displayName: "Longbow",
    description:
      "The Longbow is a Weapon wielded by Warriors which is useful both in hunting and combat. Though this is a simple Weapon, it is capable of powerful and precise shots. At close or medium range, the Longbow is also capable of piercing armor, making it excellent for ranged combat against enemy factions. This bow requires significant training and strength, and Warriors who wield longbows can be identified by the asymmetric musculature of their draw arm.",
  },
  {
    idx: 564,
    filename: "weapon_longsword_blue.png",
    part: "weapon",
    displayName: "Blue Longsword",
    description:
      "The Blue Longsword is a Warrior Weapon which is characterized by its lengthy, blue, two-handed grip and basket hilt adorned with a topaz gem. Some Warriors refer to these blades as “Bastard Swords” due to their uncertain origin and irregularity. Those who do not have a discerning eye may also mistake a longsword as a broadsword. Curiously, the name of the longsword itself is derived by the length of its grip rather than its blade, though many do have double-edged blades up to 43 inches.",
  },
  {
    idx: 565,
    filename: "weapon_longsword_brown.png",
    part: "weapon",
    displayName: "Brown Longsword",
    description:
      "The Brown Longsword is a Warrior Weapon which is characterized by its lengthy, brown, two-handed grip and basket hilt. Some Warriors refer to these blades as “Bastard Swords” due to their uncertain origin and irregularity. Those who do not have a discerning eye may also mistake a longsword as a broadsword. Curiously, the name of the longsword itself is derived by the length of its grip rather than its blade, though many do have double-edged blades up to 43 inches.",
  },
  {
    idx: 566,
    filename: "weapon_longsword_green.png",
    part: "weapon",
    displayName: "Green Longsword",
    description:
      "The Green Longsword is a Warrior Weapon which is characterized by its lengthy, green, two-handed grip and basket hilt adorned with a garnet gemstone. Some Warriors refer to these blades as “Bastard Swords” due to their uncertain origin and irregularity. Those who do not have a discerning eye may also miscategorize a longsword as a broadsword. Curiously, the name of the longsword itself is derived by the length of its grip rather than its blade, though many do have double-edged blades up to 43 inches.",
  },
  {
    idx: 567,
    filename: "weapon_longsword_purple.png",
    part: "weapon",
    displayName: "Purple Longsword",
    description:
      'The Purple Longsword is a Warrior Weapon which is characterized by its lengthy, purple, two-handed grip and basket hilt adorned with a yellow cat’s eye opal. Some Warriors refer to these blades as “Bastard Swords” due to their uncertain origin and irregularity. Those who do not have a discerning eye may also mistake a longsword as a broadsword. Curiously, the name of the longsword itself is derived by the length of its grip rather than its blade, though many do have double-edged blades up to 43 inches. Purple Longsword was the answer to Day 9 of Runiverse Riddles in the Dark. "Long and lean, I gleam in purple sheen. In the hand of a knight, I am an awe-striking sight."',
  },
  {
    idx: 568,
    filename: "weapon_longsword_red.png",
    part: "weapon",
    displayName: "Red Longsword",
    description:
      "The Red Longsword is a Warrior Weapon which is characterized by its lengthy, red, two-handed grip and basket hilt adorned with an oval sapphire. Some Warriors refer to these blades as “Bastard Swords” due to their uncertain origin and irregularity. Those who do not have a discerning eye may also mistake a longsword as a broadsword. Curiously, the name of the longsword itself is derived by the length of its grip rather than its blade, though many do have double-edged blades up to 43 inches.",
  },
  {
    idx: 569,
    filename: "weapon_longsword_white.png",
    part: "weapon",
    displayName: "White Longsword",
    description:
      "The White Longsword is a Warrior Weapon which is characterized by its lengthy, white, two-handed grip and basket hilt adorned with an oval cut of aquamarine. Some Warriors refer to these blades as “Bastard Swords” due to their uncertain origin and irregularity. Those who do not have a discerning eye may also mistake a longsword as a broadsword. Curiously, the name of the longsword itself is derived by the length of its grip rather than its blade, though many do have double-edged blades up to 43 inches.",
  },
  {
    idx: 570,
    filename: "weapon_mace.png",
    part: "weapon",
    displayName: "Mace",
    description:
      "The Mace is a Warrior Weapon used to deliver crushing, bludgeoning blows which smash bones, armor, and shields. The head of the mace also contains spikes which help to penetrate defenses and make the weapon much more deadly. The shaft of the Mace may also be long enough for wielding two-handed, but also comes in a one-handed variety. Warriors practiced with the Mace are adept in their timing and footwork.",
  },
  {
    idx: 571,
    filename: "weapon_masamune.png",
    part: "weapon",
    displayName: "Masamune",
    description:
      "Eight legendary swords forged in the forgotten techniques of the mythical swordsmith, Masamune. These swords were created by an unknown group of artificers and alchemists with the help of blacksmiths from the Lake of Lanterns. They are regarded among the finest swords in the entire Runiverse, for their exquisite craftsmanship, superb cutting ability, and legendary beauty. It is believed that only the most elite Warriors can wield such a blade as these blades have “quiet souls” and will not cut anything that is innocent or undeserving. Wielding a Masamune is a test of a Warrior’s character.",
  },
  {
    idx: 572,
    filename: "weapon_mjolnir.png",
    part: "weapon",
    displayName: "Mjolnir",
    description:
      "A replica of the legendary hammer, Mjolnir. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Because these eight hammers are based on the legendary Mjolnir, these perfect replicas are unbreakable, return to the wielder when thrown, and call down lightning when swung.",
  },
  {
    idx: 573,
    filename: "weapon_morningstar.png",
    part: "weapon",
    displayName: "Morningstar",
    description:
      "The Morningstar is a Warrior Weapon resembling a Mace with a long shaft for wielding with both hands. The round head of the Morningstar is studded with evenly-spaced spikes which can pierce the armor of foes while still delivering powerful blunt force. The long shaft of the Morning star is wrapped to provide a grip for the bearer, and gives more of a distance between the wielder and their enemy for sweeping attacks.",
  },
  {
    idx: 574,
    filename: "weapon_needle.png",
    part: "weapon",
    displayName: "Tuck",
    description:
      'The Tuck is a Weapon wielded by Warriors featuring a long blade used for piercing techniques. Curiously, it is edgeless, without sharpness in the length of the blade, as it is not a weapon for slashing. The Tuck’s tip instead is sharpened, making the sword effective against gaps in plate armor. It is rigid and long, perfect for passing through the mail of an opposing Warrior. A Tuck may also be called an “Estoc,” though those with this title may be differentiated by more ornate hilts. Tuck was the answer to Day 5 of Runiverse Riddles in the Dark "When day is done, I am the one to make sure your work is done. I put away, I neaten, I fold, with me, everything is under hold."',
  },
  {
    idx: 575,
    filename: "weapon_nunchucku.png",
    part: "weapon",
    displayName: "Nunchaku",
    description:
      "Nunchaku are a Warrior Weapon characterized by two short hardwood rods connected by a chain. While unassuming, this weapon is known for its versatility in striking, trapping, and blocking. Masters of the Nunchaku enter into a state of flow when wielding the Weapon, confusing and intimidating their enemy with spins and flourishes of the rods, blurring movement before unleashing a stunning strike.",
  },
  {
    idx: 576,
    filename: "weapon_partisan.png",
    part: "weapon",
    displayName: "Partisan",
    description:
      "The Partisan is a polearm Weapon wielded by Warriors characterized by its broad blade capable of slashing as well as thrusting. The Partisan is a favorite weapon in large bands of Warriors who fight in formation, creating great walls of blades. The shape of the Partisan’s blade also allows for a modicum of control of opponents’ Weapons with the ability to hook and trap.",
  },
  {
    idx: 577,
    filename: "weapon_poleaxe_gold.png",
    part: "weapon",
    displayName: "Golden Poleaxe",
    description:
      "The Golden Poleaxe is a powerful two-handed Warrior Weapon characterized by its golden axe head attached to a long shaft. The Poleaxe excels against armored opponents and is equipped with a gilded top spike for thrusting. The center of the axe blade’s cheek is adorned with an oval ruby and its heel and toe both form horns with the butt of the axe also coming to dual spike tips.",
  },
  {
    idx: 578,
    filename: "weapon_poleaxe_grey.png",
    part: "weapon",
    displayName: "Silver Poleaxe",
    description:
      "The Silver Poleaxe is a powerful two-handed Warrior Weapon characterized by its silver axe head attached to a long wooden shaft. The Poleaxe excels against armored opponents and is equipped with a top spike for thrusting attacks. The center of the axe blade’s cheek is adorned with an oval blue opal, and its heel and toe both form horns with the butt of the axe also coming to dual spike tips.",
  },
  {
    idx: 579,
    filename: "weapon_rapier.png",
    part: "weapon",
    displayName: "Rapier",
    description:
      "The Rapier is a Warrior Weapon characterized by its long and slender blade with a pointed tip intended for thrusting techniques and defensive parries. The blade’s swept hilt protects the hand of the wielder from enemy attacks. The Rapier is an elegant blade which favors a Warrior’s finesse and precision over their brute strength. Often a Warrior will carry a small Buckler shield for defense with a Rapier.",
  },
  {
    idx: 580,
    filename: "weapon_sabre.png",
    part: "weapon",
    displayName: "Sabre",
    description:
      "The Sabre is a Warrior Weapon that is characterized by its curved, single-edge blade used for slashing enemies. This blade’s hilt features a knuckle guard which protects the Warrior’s hand during battle. Sabres are favored for their light weight and maneuverability when compared to larger blades, like broadswords. The blade also has a Pre-Sigularity history relating it to the Scimitar.",
  },
  {
    idx: 581,
    filename: "weapon_sai.png",
    part: "weapon",
    displayName: "Sai",
    description:
      "The Sai is a Weapon wielded by Warriors that resembles a handheld Trident. While Sai may be used singularly, they are typically wielded in pairs, and occasionally a Warrior may wear a third Sai tucked in their belt for access in the event that they become disarmed. Sai are non-lethal weapons mainly used to trap, deflect, and control opposing weapons. As such, they are generally not sharpened.",
  },
  {
    idx: 582,
    filename: "weapon_scimitar.png",
    part: "weapon",
    displayName: "Scimitar",
    description:
      "The Scimitar is a Warrior Weapon that is characterized by its curved, single-edge blade used for slashing enemies and a hilt with asymmetrical quillons. It is a predecessor to the Sabre and has a more pronounced curvature than most Sabres. Scimitars are favored for these deeply curved blades which are capable of making powerful sweeping slashes that are difficult to parry with straight blades.",
  },
  {
    idx: 583,
    filename: "weapon_shortbow.png",
    part: "weapon",
    displayName: "Shortbow",
    description:
      "The Shortbow is a Weapon wielded by Warriors. It is simple, wooden, and compact, which makes it best for short-range and medium-range targets. Compared to a Longbow, the Short bow is quicker to draw and fire, requiring much less effort at the sacrifice of shooting distance. The Shortbow is favored for horseback archery as well as hunting.",
  },
  {
    idx: 584,
    filename: "weapon_shortsword_blue.png",
    part: "weapon",
    displayName: "Blue Shortsword",
    description:
      "The Blue Shortsword is a Warrior Weapon notable for its stunted blade inlaid with an oval sapphire in its fuller. It also features a blue crossguard and one-handed grip. The sword’s categorization is a minor misnomer, as these weapons have much commonality with knives, though their blades may be long for many to consider them such. Many shortswords are fashioned of iron, and are shorter than other blades due to the characteristics of the metal. Shortswords are often given to young Warriors as well as adult Warriors of smaller stature.",
  },
  {
    idx: 585,
    filename: "weapon_shortsword_red.png",
    part: "weapon",
    displayName: "Red Shortsword",
    description:
      "The Red Shortsword is a Warrior Weapon notable for its stunted blade inlaid with an oval ruby in its fuller. It also features a red crossguard and one-handed grip. The sword’s categorization is a minor misnomer as these weapons have much commonality with knives, though their blades may be long for many to consider them such. Many of these blades are fashioned of iron, and are shorter than other blades due to the characteristics of the metal. Shortswords are often given to young Warriors as well as adult Warriors of smaller stature.",
  },
  {
    idx: 586,
    filename: "weapon_skullspear.png",
    part: "weapon",
    displayName: "Skull Spear",
    description:
      "The Skull Spear is a menacing polearm wielded by Warriors which is similar in form to the Spetum. However, the Skull Spear’s primary spearhead is grimly ornamented with the bloody skull of a former foe. Warriors who carry a Skull Spear or Skull Sword generally have a particular pride in the vanquishing of their enemy whose head is impaled by their weapon and will tell anyone who will listen the story of their battle.",
  },
  {
    idx: 587,
    filename: "weapon_skullsword.png",
    part: "weapon",
    displayName: "Skull Sword",
    description:
      "The Skull Sword is a menacing blade wielded by Warriors which is similar in form to the Brown Longsword. However, the Skull Sword is grimly ornamented with the bloody skull of a former foe about its ricasso. Warriors who carry a Skull Sword or Skull Spear generally have a particular pride in the vanquishing of their enemy whose head is impaled by their weapon and will tell anyone who will listen the story of their battle.",
  },
  {
    idx: 588,
    filename: "weapon_slingshot.png",
    part: "weapon",
    displayName: "Slingshot",
    description:
      "The Slingshot is a rudimentary and unassuming Warrior weapon used to hurl stones or other small projectiles at foes by the use of elastic force. The Y-shaped yoke is wooden and strung with a rubber band containing a leather pouch at its midpoint which holds its ammunition. The weapon has a variety of uses, from common mischief to small game hunting. However, there are also tales of skillful use of the slingshot to slay giants.",
  },
  {
    idx: 589,
    filename: "weapon_spear_byzantine.png",
    part: "weapon",
    displayName: "Stratiotai Spear",
    description:
      "The Stratiotai Spear is a Warrior polearm Weapon which has historic connection to the eponymous group of people who existed Pre-Singularity. The Stratiotai Spear is characterized by its long, golden spearhead, which is useful for deep penetration of armor with a caveat that it may be less durable than shorter spearheads. Warriors wielding the Stratiotai Spear often tie a ribbon at the socket which flutters and catches enemies eyes, distracting them in combat.",
  },
  {
    idx: 590,
    filename: "weapon_spear_wild.png",
    part: "weapon",
    displayName: "Bush Spear",
    description:
      "The Bush Spear is a Warrior Weapon which dates back before the Technological Singularity, and some historians suppose the Bush Spear arrived in early ancient times. It consists of a simple iron blade fixed to a long pole, and is used mainly for thrusting attacks, but can also be thrown at great distance. Some of these spears are decorated with feathers of the Macaw to hide the point of the blade’s attachment to the spear.",
  },
  {
    idx: 591,
    filename: "weapon_spear.png",
    part: "weapon",
    displayName: "Spetum",
    description:
      "The Spetum is a Warrior polearm Weapon characterized by its central thrusting blade flanked by two lateral blades, which are sometimes sharpened, allowing the wielder to slash as well as attack with thrusts. Like the Ranseur, the Spetum may also be useful for trapping blades and controlling weapons of the opposition, and similarly Warriors practiced in the Spetum often tie ornaments at the socket—handkerchiefs from loved ones or colorful ribbons to show allegiance.",
  },
  {
    idx: 592,
    filename: "weapon_speargold.png",
    part: "weapon",
    displayName: "Ranseur",
    description:
      "The Ranseur is a polearm Weapon wielded by Warriors that is notable for its golden tip, which bears two lateral prongs on either side of the main tip that are used for trapping enemy weapons during combat and pulling riders from their mounts. This trident-like shape gives Ranseur Warriors a tactical advantage against any manner of cavalry. Many Warriors tie ornaments at the Ramseur's socket—handkerchiefs from loved ones or colorful ribbons to show allegiance.",
  },
  {
    idx: 593,
    filename: "weapon_spearWing.png",
    part: "weapon",
    displayName: "Pantheon Spear",
    description:
      "The Pantheon Spear is a polearm Weapon wielded by Warriors notable for its slender golden tip flanked by two wings. These magical wings allow the weapon to return to a Warrior when thrown and also direct the spear for precise strikes when used as a projectile. The butt of the spear is also tipped with gold, allowing for strikes with either end of the polearm, increasing versatility. Those who wield the Pantheon Spears believe themselves to be the champions of divine will.",
  },
  {
    idx: 594,
    filename: "weapon_sword_bigbarb_blue.png",
    part: "weapon",
    displayName: "Blue Broadsword",
    description:
      "The Blue Broadsword is a Weapon wielded by Warriors, even in the times before the coming of the Emissary. There are many types of broadsword with a category as wide as their blades, and typified by any such blade larger than that of a dueling sword with a basket hilt which protects the wielding Warrior’s hand. This one is blue, and the fuller is inlaid with two oval crystals of topaz.",
  },
  {
    idx: 595,
    filename: "weapon_sword_bigbarb_red.png",
    part: "weapon",
    displayName: "Red Broadsword",
    description:
      "The Red Broadsword is a Weapon wielded by Warriors, even in the times before the coming of the Emissary. There are many types of broadsword with a category as wide as their blades, and typified by any such blade larger than that of a dueling sword with a basket hilt which protects the wielding Warrior’s hand. This one is red, and the fuller is inlaid with two oval emerald gemstones.",
  },
  {
    idx: 596,
    filename: "weapon_sword_blood.png",
    part: "weapon",
    displayName: "Blood Sword",
    description:
      "The Blood Sword is a Warrior Weapon, though some say it is a curse set upon the Runiverse by the Blood Eaters of the Nightmare Dominion. With each rending of flesh, the Blood Sword grows more powerful. It grows sharper with each life it steals, and its color will deepen until the crimson metal becomes black. A blackened Blood Sword will draw the Dominion’s children toward it, wishing to crack the blade and drink its power.",
  },
  {
    idx: 597,
    filename: "weapon_sword_eye_meta.png",
    part: "weapon",
    displayName: "Meta Sword",
    description:
      "The Meta Sword is a Weapon wielded by Warriors and is a blade brought to the Runiverse with the arrival of the Emissary along with the Quantum Sword. The Meta Sword is legendary. It is a Weapon of all Weapons—a transcendent blade that is self-aware, and it can only be used for certain cosmic tasks. Notably, the Emissary himself entered the world wielding a Meta Sword.",
  },
  {
    idx: 598,
    filename: "weapon_sword_eye_quantum.png",
    part: "weapon",
    displayName: "Quantum Sword",
    description:
      "The Quantum Sword is a Warrior Weapon and legendary blade which was first brought to the Runiverse by the arrival of the Emissary along with the Meta Sword. If the Sacred Key Master's key can open any door—including the doors to the Realms 1-7—then the Quantum Sword can simply hew them open, provided it is wielded by a Warrior with enough Quantum Style.",
  },
  {
    idx: 599,
    filename: "weapon_sword_falchion_gold.png",
    part: "weapon",
    displayName: "Journeyman Falchion",
    description:
      "The Journeyman Falchion is a Weapon wielded by Warriors with a hilt of gold and distinct broad blade which is slightly curved—widening toward its tip. The classic profile of the Journeyman Falchion is intended to help a Warrior cleave foes with minimal effort. These are trusty blades typically given to Warriors who have finished training with a Bamboo Pole and are ready to carry cold steel.",
  },
  {
    idx: 600,
    filename: "weapon_sword_falchion_red.png",
    part: "weapon",
    displayName: "Rogue Falchion",
    description:
      "The Rogue Falchion is a Weapon wielded by Warriors with a hilt of crimson and distinct broad blade which is slightly curved—widening toward its tip. The classic profile of the Rogue Falchion is intended to help a Warrior cleave foes with minimal effort. Warriors who have mastered the blade and wish to signify an elevated rank while continuing to wield a Falchion will cast aside the gold of their Journeyman Falchion in favor of the rouge Rogue.",
  },
  {
    idx: 601,
    filename: "weapon_sword_firebrand.png",
    part: "weapon",
    displayName: "Firebrand",
    description:
      "Firebrand is a Warrior Weapon which appears as a sword engulfed in flames. Some believe the fire surrounding the blade to be generated by divine will and power, while others simply say Firebrand wielding Warriors coat their blades in flammable Toad Oil which they ignite before battle. There is a legend that tells of an immaculate garden hidden somewhere in the Runiverse with its entrance protected by a Warrior wielding a Firebrand.",
  },
  {
    idx: 602,
    filename: "weapon_sword_gear.png",
    part: "weapon",
    displayName: "Guardian Sword",
    description:
      "The Guardian Sword is a Weapon wielded by Warriors with a strong, broad blade and a cruciform hilt made of gold. The Guardian Sword is notable for its reputation as a gift to those who have sworn fealty as Guardians of either important persons or sacred realms in the Runiverse. Some say that devastation will befall the Warrior who draws this blade without the honor of a sworn oath of protection.",
  },
  {
    idx: 603,
    filename: "weapon_sword_goblin.png",
    part: "weapon",
    displayName: "Goblin Sword",
    description:
      'The Goblin Sword is a Warrior Weapon which is common in Goblin Town, though it may be found wielded by Warriors across the Runiverse. It is constructed of green metal influenced by its Goblin creators, and the blade appears in the form of a sabre, typical of Goblin slashing form. The Goblin Sword is adorned with ruby encrusting just above the swept quillons of its hilt, though many say the gems in Goblin-made weapons are fakes. Goblin Sword was the answer to Day 4 of MeepleDad\'s Runiverse Riddles n the Dark: "Crafted not by man or elf, but creatures full of mischief and stealth. Not as shiny, not as neat, but it can cut just as deep."',
  },
  {
    idx: 604,
    filename: "weapon_sword_gold.png",
    part: "weapon",
    displayName: "Golden Sword",
    description:
      "The Golden Sword is a Weapon wielded by Warriors which is notable for its gleaming golden blade and aurelian basket hilt. The gold from which this blade was forged is no ordinary gold—it does not possess the usual malleability of the soft metal and shines as if the dawn itself were caught inside it. It is a sight to behold and it holds an impression upon those who have seen it drawn and lived to remember its glory.",
  },
  {
    idx: 605,
    filename: "weapon_sword_jade.png",
    part: "weapon",
    displayName: "Jade Sword",
    description:
      "The Jade Sword is a Warrior Weapon made from precious, deep green stones of jade. The edge seems impossibly sharp to have been carved from stone, though Warriors who wield them claim they slice cleaner than steel. The large emerald basket hilt supports the weighty blade, with a long two-handed grip. Some whisper that those who carry these blades are the champions of Elves.",
  },
  {
    idx: 606,
    filename: "weapon_sword_jewel_green.png",
    part: "weapon",
    displayName: "Sol Sword",
    description:
      "The Sol Sword is a Warrior Weapon with a flared blade similar to that of a Falchion with a cut oval peridot set in gold within its fuller. The Sol Sword also has a blue crossguard with downturned quillons. With the Sol Sword’s gem catches rays of the sun, it stores energy within the weapon, which can then be released by a wielding Warrior at the zenith of their Might as projectiles of heat which can burn or even disintegrate enemies.",
  },
  {
    idx: 607,
    filename: "weapon_sword_jewel_red.png",
    part: "weapon",
    displayName: "Ishtar Sword",
    description:
      "The Ishtar Sword is a Weapon wielded by Warriors which is characterized by its flared blade with a cut gem of rubellite embedded in its fuller. The sword also has a distinct yellow crossbar with downturned quillons. Some Warriors claim their Ishtar Sword was passed down from an ancient goddess of war. Curiously, Warriors wielding an Ishtar Sword are known to attract owls.",
  },
  {
    idx: 608,
    filename: "weapon_sword_pirate.png",
    part: "weapon",
    displayName: "Pirate Sword",
    description:
      "The Pirate Sword is a Warrior Weapon with a broad blade like that of a cutlass and a similar hilt styled with a knuckle guard which protects to full hand of the wielder. This single-edged blade curves and tapers to a clipped point which easily cuts through enemy sails, rigging, and flesh. The Pirate Sword is common among seafaring Warriors who are renowned for the agile footwork required for close-quarters swashbuckling on cramped decks.",
  },
  {
    idx: 609,
    filename: "weapon_sword_rainbow.png",
    part: "weapon",
    displayName: "Sword of Rainbows",
    description:
      "The Sword of Rainbows is a legendary Warrior Weapon which bears a similar shape to the Blood Sword and Jade Sword but is forged from Shadow Crystals of Chroma Crystal Row. To ward against the Dark Magic contained in the Crystals, its large ricasso is embedded with a rainbow of ruby, yellow diamonds, emeralds, sapphire, and amethyst. Many across the Runiverse say that this is one of the only physical Weapons that can harm Shadows.",
  },
  {
    idx: 610,
    filename: "weapon_sword_razor.png",
    part: "weapon",
    displayName: "Night Razor",
    description:
      "The Night Razor is a Warrior Weapon notable for its dark character and unique claw-shaped guard. Its blade gleams with a dark black sheen with traces of violet in an unnatural and cosmic alloy with three inlaid gems of blue turquoise. Only the expert smiths of Obsidian City could craft a blade of this caliber and design. Those who wield Night Razors say they were forged under a lunar eclipse and that the Weapon is weightless in their hand.",
  },
  {
    idx: 611,
    filename: "weapon_sword_spartan.png",
    part: "weapon",
    displayName: "Gladiator Sword",
    description:
      "The Gladiator Sword is a Warrior Weapon and a special kind of sabre wielded most by Warriors who participate in arena combat. Its hilt has a guard which protects the wielder’s hand in battle. The Gladiator sword is used mainly with slashing techniques, and as such, Warriors who carry them may come off as brutish. However, as will all weaponry, true masters can exhibit style in their form.",
  },
  {
    idx: 612,
    filename: "weapon_swordBabylon.png",
    part: "weapon",
    displayName: "Sword of Babylon",
    description:
      "The Sword of Babylon is Weapon wielded by Warriors—most famously wielded by the legendary Warrior Gligamesh. The Sword of Babylon is characterized by its golden, double-edged blade which comes to a sharp point. It also features ornamental, winged quillons on its hilt. This is a beautiful and prized weapon, and although there is little mysticism about it, those who wield it often say they feel Gligamesh’s power within.",
  },
  {
    idx: 613,
    filename: "weapon_swordlightning.png",
    part: "weapon",
    displayName: "Lightning Sword",
    description:
      "The Lightning Sword is a Weapon wielded by Warriors which has been infused with the Magic and finalized with a casting of Thor’s Wrath. A zapping electricity encircles the Lightning Sword’s broad blade and purple cruciform hilt—curiously without harm to its wielder. Warriors who take up this sword must attune to the blade to prevent electrocution, and attempts to bear it unattuned generally result in death.",
  },
  {
    idx: 614,
    filename: "weapon_tizona.png",
    part: "weapon",
    displayName: "Tizona",
    description:
      "A replica of the legendary sword, Tizona. There are eight known replicas in existence, and they were created by an unknown group of artificers and alchemists with the help of blacksmiths from Obsidian City. Because these eight swords are based on the legendary Tizona, these perfect replicas strike fear into those who behold them and may only be wielded by Warriors which the blades deems worthy. The replicas bear the inscription “Iesus Nazarenus” and the number 1040.",
  },
  {
    idx: 615,
    filename: "weapon_trident.png",
    part: "weapon",
    displayName: "Trident",
    description:
      "The Trident is a colorful Warrior polearm Weapon characterized by its three-pronged spearhead, which are all used for piercing. The Trident was historically used Pre-Singularity for spearfishing, and there are those who still use it as a tool for this purpose. Some believe the Trident to be descended from on high as a Weapon which was used by deities to control the sea.",
  },
  {
    idx: 616,
    filename: "weapon_tyrfing.png",
    part: "weapon",
    displayName: "Tyrfing",
    description:
      "A replica of the legendary cursed sword, Tyrfing. There are eight known replicas in existence, and they were created by an unknown group of Dwarves. Because these eight swords are based on the legendary Tyrfing, these perfect replicas can cut through anything, never miss their targets, and glow like fire when drawn. They also bear the curses of Tyrfing, slaying at least once with every unsheathing and bringing ill fates to their Warriors and their kin.",
  },
  {
    idx: 617,
    filename: "weapon_whip.png",
    part: "weapon",
    displayName: "Whip",
    description:
      "The Whip is a Weapon wielded by Warriors which is a flexible tool for lashing and entangling opponents from a short distance. When used masterfully, the Whip can inflict deep cuts or even break bones. Warriors also use Whips to distract opponents with its intimidating sound and flashing movements. While it is advantageous with its unpredictability, a Whip is largely ineffective against armored enemies.",
  },
  {
    idx: 618,
    filename: "weapon_wratchet.png",
    part: "weapon",
    displayName: "Wratchet",
    description:
      "The Wratchet is an improvised Weapon wielded by Warriors in the same vein as the Pipe Wrench. It is first and foremost a tool used for tightening large bolts or lugnuts, but in a pinch, the Wratchet can be used to deliver unexpected bludgeoning force. The clawed end of the Wratched may also be useful in battle to trap an opponent’s weapon, provided the wielder has enough finesse.",
  },
  {
    idx: 619,
    filename: "weapon_wrench_green.png",
    part: "weapon",
    displayName: "West Side Pipe Wrench",
    description:
      "The West Side Pipe Wrench is an improvised Warrior Weapon and useful mechanical tool. Mainly used in adjusting pipes and pipe fittings, Warriors have also been known to lug these instruments for applying blunt force trauma to any manner of foes. In areas where the West Side Pipe Wrench is a common weapon, pugilists may also equip themselves with Wratchets, knuckledusters, Baseball Bats, or even oil drums.",
  },
  {
    idx: 620,
    filename: "weapon_wrench_red.png",
    part: "weapon",
    displayName: "East Side Pipe Wrench",
    description:
      "The East Side Pipe Wrench is an improvised Warrior Weapon and useful mechanical tool. Mainly used in adjusting pipes and pipe fittings, Warriors have also been known to lug these instruments for applying blunt force trauma to any manner of foes. In areas where the East Side Pipe Wrench is a common weapon, pugilists may also equip themselves with wratchets, knuckledusters, baseball bats, or even oil drums.",
  },
];
