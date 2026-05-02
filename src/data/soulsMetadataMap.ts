export type SoulAttribute = {
  trait_type: string;
  value: string | number;
};

export type SoulMetadata = {
  name: string;
  image: string;
  attributes: SoulAttribute[];
  background_color?: string;
  metadataUri: string;
};

export const soulsMetadataMap: Record<string, SoulMetadata> = {
  10: {
    name: "Lewd Revenant Edge Arcanist Artchick",
    image: "https://portal.forgottenrunes.com/api/souls/img/10",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 10
      },
      {
        trait_type: "Transmuted from",
        value: "Edge Arcanist Artchick"
      },
      {
        trait_type: "Burn order",
        value: 29
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/10"
  },
  16: {
    name: "Wraith Knight Alessar of the Scum Barrel",
    image: "https://portal.forgottenrunes.com/api/souls/img/16",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 16
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Alessar of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 360
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/16"
  },
  28: {
    name: "The Ghost of Gremplin",
    image: "https://portal.forgottenrunes.com/api/souls/img/28",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skipper Ghost"
      },
      {
        trait_type: "Head",
        value: "Gremplin Ghost"
      },
      {
        trait_type: "Prop",
        value: "A Big Magic Stick with Ether Fire"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 28
      },
      {
        trait_type: "Transmuted from",
        value: "The Great and Magical UserGnome"
      },
      {
        trait_type: "Burn order",
        value: 5
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/28"
  },
  29: {
    name: "Golden Lich LeggoMyGreggo",
    image: "https://portal.forgottenrunes.com/api/souls/img/29",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Golden Lich"
      },
      {
        trait_type: "Prop",
        value: "Sulfer Spear"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snail"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 29
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer LeggoMyGreggo"
      },
      {
        trait_type: "Burn order",
        value: 543
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/29"
  },
  30: {
    name: "Eldritch Horror Great Old One Andolini",
    image: "https://portal.forgottenrunes.com/api/souls/img/30",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Eldritch Horror"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 30
      },
      {
        trait_type: "Transmuted from",
        value: "Great Old One Andolini"
      },
      {
        trait_type: "Burn order",
        value: 390
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/30"
  },
  58: {
    name: "Wraith Knight Hestia of the Ether Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/58",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 58
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Hestia of the Wild"
      },
      {
        trait_type: "Burn order",
        value: 273
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/58"
  },
  72: {
    name: "Wraith Knight Supa Wizz 9272",
    image: "https://portal.forgottenrunes.com/api/souls/img/72",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Charred Pipe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 72
      },
      {
        trait_type: "Transmuted from",
        value: "Supa Wizz 9272"
      },
      {
        trait_type: "Burn order",
        value: 643
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/72"
  },
  98: {
    name: "Ghost Pumpkin Gourdon of Limbo",
    image: "https://portal.forgottenrunes.com/api/souls/img/98",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Ghost Pumpkin"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 98
      },
      {
        trait_type: "Transmuted from",
        value: "Bard Gourdon of the Platonic Shadow"
      },
      {
        trait_type: "Burn order",
        value: 525
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/98"
  },
  101: {
    name: "Paranormal Phantasm Milton ",
    image: "https://portal.forgottenrunes.com/api/souls/img/101",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Transmuted from number",
        value: 101
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Milton "
      },
      {
        trait_type: "Burn order",
        value: 284
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/101"
  },
  106: {
    name: "Wraith Captain Zubin of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/106",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 106
      },
      {
        trait_type: "Transmuted from",
        value: " Zubin of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 645
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/106"
  },
  110: {
    name: "Horned Phantasm Jasper of the Paranormal",
    image: "https://portal.forgottenrunes.com/api/souls/img/110",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 110
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Jasper of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 575
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/110"
  },
  133: {
    name: "Bloody Mary",
    image: "https://portal.forgottenrunes.com/api/souls/img/133",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Houppelande"
      },
      {
        trait_type: "Head",
        value: "Mary Tudor"
      },
      {
        trait_type: "Prop",
        value: "Mary's Torch"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 133
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Maia of the River"
      },
      {
        trait_type: "Burn order",
        value: 421
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/133"
  },
  142: {
    name: "Blood Eater Revenant Galatea of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/142",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Transmuted from number",
        value: 142
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Galatea of the Isle"
      },
      {
        trait_type: "Burn order",
        value: 688
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/142"
  },
  146: {
    name: "Shaded Spectre Allistair of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/146",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Affinity",
        value: "Shade"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 146
      },
      {
        trait_type: "Transmuted from",
        value: " Allistair in the Shadows"
      },
      {
        trait_type: "Burn order",
        value: 409
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/146"
  },
  165: {
    name: "Veiled Phantasm Carmilla of Limbo",
    image: "https://portal.forgottenrunes.com/api/souls/img/165",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 165
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Carmilla of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 86
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/165"
  },
  169: {
    name: "Pile of Blood and Guts",
    image: "https://portal.forgottenrunes.com/api/souls/img/169",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Pile of Blood and Guts"
      },
      {
        trait_type: "Transmuted from number",
        value: 169
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Seth of the Mountain"
      },
      {
        trait_type: "Burn order",
        value: 647
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/169"
  },
  177: {
    name: "Death Crow Crowley of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/177",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Corvid Skull"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Transmuted from number",
        value: 177
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Crowley of Mu"
      },
      {
        trait_type: "Burn order",
        value: 209
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/177"
  },
  181: {
    name: "Toru the Video Ghost",
    image: "https://portal.forgottenrunes.com/api/souls/img/181",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Head",
        value: "Toru"
      },
      {
        trait_type: "Transmuted from number",
        value: 181
      },
      {
        trait_type: "Transmuted from",
        value: "Void Disciple Voidoth of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 279
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/181"
  },
  184: {
    name: "Lich Marquis Iprix of the Ether Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/184",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 184
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Iprix of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 224
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/184"
  },
  240: {
    name: "Gouged Revenant Celah of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/240",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Transmuted from number",
        value: 240
      },
      {
        trait_type: "Transmuted from",
        value: "Spellsinger Celah of Avalon"
      },
      {
        trait_type: "Burn order",
        value: 144
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/240"
  },
  248: {
    name: "Horned Phantasm Uvlius of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/248",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 248
      },
      {
        trait_type: "Transmuted from",
        value: " Uvlius of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 570
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/248"
  },
  260: {
    name: "Shaded Spectre Eden ",
    image: "https://portal.forgottenrunes.com/api/souls/img/260",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 260
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Eden "
      },
      {
        trait_type: "Burn order",
        value: 411
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/260"
  },
  271: {
    name: "Wraith Knight Xerxes of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/271",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 271
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Xerxes of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 478
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/271"
  },
  277: {
    name: "Gouged Revenant Zelda of the Fetid Ruins",
    image: "https://portal.forgottenrunes.com/api/souls/img/277",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Transmuted from number",
        value: 277
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Zelda of the River"
      },
      {
        trait_type: "Burn order",
        value: 539
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/277"
  },
  283: {
    name: "Grave Robbing Kobold Trollin of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/283",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Kobold Skull"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 283
      },
      {
        trait_type: "Transmuted from",
        value: "Hex Mage Trollin of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 476
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/283"
  },
  322: {
    name: "Death Shroom Mushy of the Ether Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/322",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Ghoul Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 322
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Mushy of the Cold"
      },
      {
        trait_type: "Burn order",
        value: 62
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/322"
  },
  331: {
    name: "Wraith Knight Judas of the Smell",
    image: "https://portal.forgottenrunes.com/api/souls/img/331",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Broom on Fire"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 331
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Judas of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 163
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/331"
  },
  334: {
    name: "Void Phantasm Wolfram of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/334",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Broom on Fire"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 334
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Wolfram of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 184
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/334"
  },
  336: {
    name: "Transcendent Illuminatus Ilu of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/336",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Transcendent Illuminatus"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 336
      },
      {
        trait_type: "Transmuted from",
        value: "Holy Magus Ilu of the Ice"
      },
      {
        trait_type: "Burn order",
        value: 51
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/336"
  },
  343: {
    name: "Blood Eater Revenant Marceline of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/343",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Cockatrice"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Transmuted from number",
        value: 343
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Marceline of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 102
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/343"
  },
  361: {
    name: "Rotten Revenant Gunthor of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/361",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Flaming Rose"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Revenant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 361
      },
      {
        trait_type: "Transmuted from",
        value: "Illusionist Gunthor of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 717
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/361"
  },
  404: {
    name: "Channel 3 Poltergeist Imeena of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/404",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Blight Tattered"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 404
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Imeena of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 256
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/404"
  },
  421: {
    name: "Wraith Devout Apollo of the Ether Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/421",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Odin's Despair: the Dark Cloud Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Transmuted from number",
        value: 421
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Apollo of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 63
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/421"
  },
  428: {
    name: "Lecherous Ghoul Ivy of the Brimstone Havens",
    image: "https://portal.forgottenrunes.com/api/souls/img/428",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 428
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Ivy of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 458
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/428"
  },
  435: {
    name: "Lich Duke Angus of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/435",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Fox Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 435
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Angus from the Shadow"
      },
      {
        trait_type: "Burn order",
        value: 414
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/435"
  },
  445: {
    name: "Channel 3 Poltergeist Armstrong of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/445",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Owl"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Transmuted from number",
        value: 445
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Armstrong of the Platonic Shadow"
      },
      {
        trait_type: "Burn order",
        value: 480
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/445"
  },
  463: {
    name: "Ethereal Urn",
    image: "https://portal.forgottenrunes.com/api/souls/img/463",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Undesirable",
        value: "Ethereal Urn"
      },
      {
        trait_type: "Transmuted from number",
        value: 463
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Caligula of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 440
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/463"
  },
  464: {
    name: "Wooden Ghost Bobbin of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/464",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Soul of Wooden Boy"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 464
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Bobbin of the Bastion"
      },
      {
        trait_type: "Burn order",
        value: 504
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/464"
  },
  469: {
    name: "Grave Robbing Kobold Woomba of the Abandoned Waste",
    image: "https://portal.forgottenrunes.com/api/souls/img/469",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Kobold Skull"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Transmuted from number",
        value: 469
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Woomba of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 78
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/469"
  },
  474: {
    name: "Glitch Poltergeist is here...",
    image: "https://portal.forgottenrunes.com/api/souls/img/474",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Glitched Poltergeist"
      },
      {
        trait_type: "Head",
        value: "Glitched Poltergeist"
      },
      {
        trait_type: "Affinity",
        value: "Video"
      },
      {
        trait_type: "# Traits",
        value: "2"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 474
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Soya of the Ice"
      },
      {
        trait_type: "Burn order",
        value: 64
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/474"
  },
  480: {
    name: "Rotten Revenant Lin of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/480",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body Shade"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Book of Dark Magic"
      },
      {
        trait_type: "Transmuted from number",
        value: 480
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Lin of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 679
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/480"
  },
  482: {
    name: "Skeleton Izible of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/482",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Imp Skull"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Transmuted from number",
        value: 482
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Izible of the Bastion"
      },
      {
        trait_type: "Burn order",
        value: 609
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/482"
  },
  493: {
    name: "Rotten Revenant Katherine of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/493",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 493
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Katherine of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 181
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/493"
  },
  512: {
    name: "Lecherous Ghoul Florah of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/512",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Transmuted from number",
        value: 512
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Florah of the Mountain"
      },
      {
        trait_type: "Burn order",
        value: 680
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/512"
  },
  553: {
    name: "Horned Phantasm Celeste of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/553",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 553
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Celeste of the Field"
      },
      {
        trait_type: "Burn order",
        value: 463
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/553"
  },
  566: {
    name: "Wild Zombie Homer of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/566",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Fox"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Transmuted from number",
        value: 566
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Homer of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 378
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/566"
  },
  572: {
    name: "Lewd Revenant Bathsheba of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/572",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Transmuted from number",
        value: 572
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Bathsheba of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 350
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/572"
  },
  573: {
    name: "Wraith Deacon Bathsheba of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/573",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 573
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Bathsheba of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 347
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/573"
  },
  575: {
    name: "Horned Phantasm Basil of the Paranormal",
    image: "https://portal.forgottenrunes.com/api/souls/img/575",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 575
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Basil of Xanadu"
      },
      {
        trait_type: "Burn order",
        value: 136
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/575"
  },
  576: {
    name: "Wraith Knight Eden of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/576",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 576
      },
      {
        trait_type: "Transmuted from",
        value: "Augurer Eden of the Circle"
      },
      {
        trait_type: "Burn order",
        value: 33
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/576"
  },
  579: {
    name: "Night Ghoul Naoki of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/579",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 579
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Naoki of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 351
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/579"
  },
  580: {
    name: "Lich Duke Artis of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/580",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Fox Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Transmuted from number",
        value: 580
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Artis of the Brine"
      },
      {
        trait_type: "Burn order",
        value: 464
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/580"
  },
  621: {
    name: "Paranormal Phantasm Ethan of the Static Snow",
    image: "https://portal.forgottenrunes.com/api/souls/img/621",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Ether Staff 2.0"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 621
      },
      {
        trait_type: "Transmuted from",
        value: "Hex Mage Ethan of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 359
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/621"
  },
  628: {
    name: "Blight Zombie Otto of the Scum Barrel",
    image: "https://portal.forgottenrunes.com/api/souls/img/628",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 628
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Otto of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 387
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/628"
  },
  633: {
    name: "Lecherous Ghoul Blaise of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/633",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Odin's Despair: the Dark Cloud Spell"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 633
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Blaise of the Sands"
      },
      {
        trait_type: "Burn order",
        value: 722
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/633"
  },
  652: {
    name: "Lich Despot Rita of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/652",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Lich"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 652
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Rita of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 718
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/652"
  },
  658: {
    name: "Gangrenous Zombie Milo of the Severed Innocence",
    image: "https://portal.forgottenrunes.com/api/souls/img/658",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Inverted Horseshoe"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 658
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Milo from the Abyss"
      },
      {
        trait_type: "Burn order",
        value: 656
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/658"
  },
  665: {
    name: "Horned Phantasm Carly of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/665",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 665
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Carly of the Mist"
      },
      {
        trait_type: "Burn order",
        value: 585
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/665"
  },
  671: {
    name: "Void Phantasm Lin of the Haze",
    image: "https://portal.forgottenrunes.com/api/souls/img/671",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 671
      },
      {
        trait_type: "Transmuted from",
        value: "Oracle Lin of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 1
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/671"
  },
  693: {
    name: "Lewd Revenant Aleister of the Machine",
    image: "https://portal.forgottenrunes.com/api/souls/img/693",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 693
      },
      {
        trait_type: "Transmuted from",
        value: " Aleister of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 425
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/693"
  },
  697: {
    name: "Shaded Spectre Sabina of the Ectoplasmic Horizon",
    image: "https://portal.forgottenrunes.com/api/souls/img/697",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 697
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Sabina of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 557
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/697"
  },
  705: {
    name: "Ethereal Spectre Zaros of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/705",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 705
      },
      {
        trait_type: "Transmuted from",
        value: " Zaros of the Isle"
      },
      {
        trait_type: "Burn order",
        value: 187
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/705"
  },
  711: {
    name: "Lewd Revenant Apollo of the Brimstone Havens",
    image: "https://portal.forgottenrunes.com/api/souls/img/711",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Hummingbird"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 711
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Apollo of the Dunes"
      },
      {
        trait_type: "Burn order",
        value: 619
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/711"
  },
  721: {
    name: "Ectoplasmic Spectre Salvatore of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/721",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 721
      },
      {
        trait_type: "Transmuted from",
        value: "Illusionist Salvatore of the Platonic Shadow"
      },
      {
        trait_type: "Burn order",
        value: 568
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/721"
  },
  727: {
    name: "Blood Eater Revenant George of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/727",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 727
      },
      {
        trait_type: "Transmuted from",
        value: "Magus George of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 709
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/727"
  },
  733: {
    name: "Hunted Stag Epher of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/733",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Transmuted from number",
        value: 733
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Epher of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 644
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/733"
  },
  810: {
    name: "Lich Despot Eric of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/810",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Transmuted from number",
        value: 810
      },
      {
        trait_type: "Transmuted from",
        value: "Augurer Eric of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 225
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/810"
  },
  818: {
    name: "Lich Baron Victoria of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/818",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 818
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Victoria of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 365
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/818"
  },
  821: {
    name: "Lich Marquis Sonja of the Plague Lands",
    image: "https://portal.forgottenrunes.com/api/souls/img/821",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Transmuted from number",
        value: 821
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Sonja of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 657
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/821"
  },
  847: {
    name: "Hue Skeleton Colorman of Carnal Delights",
    image: "https://portal.forgottenrunes.com/api/souls/img/847",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Hue Skeleton"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Transmuted from number",
        value: 847
      },
      {
        trait_type: "Transmuted from",
        value: "Colormancer Colorman of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 377
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/847"
  },
  865: {
    name: "Gangrenous Zombie Calista of the Spooklight",
    image: "https://portal.forgottenrunes.com/api/souls/img/865",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 865
      },
      {
        trait_type: "Transmuted from",
        value: " Calista of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 738
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/865"
  },
  867: {
    name: "Wraith Captain Alizam of the Fetid Ruins",
    image: "https://portal.forgottenrunes.com/api/souls/img/867",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 867
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Alizam of the Mist"
      },
      {
        trait_type: "Burn order",
        value: 694
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/867"
  },
  906: {
    name: "Wraith Devout Aleister of the Eternal Melancholy",
    image: "https://portal.forgottenrunes.com/api/souls/img/906",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 906
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Aleister of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 134
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/906"
  },
  920: {
    name: "Wraith Deacon Reza of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/920",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 920
      },
      {
        trait_type: "Transmuted from",
        value: "Void Disciple Reza of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 222
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/920"
  },
  928: {
    name: "Rotten Revenant Hadrien of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/928",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 928
      },
      {
        trait_type: "Transmuted from",
        value: " Hadrien of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 190
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/928"
  },
  952: {
    name: "Necro Frog Woomba of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/952",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 952
      },
      {
        trait_type: "Transmuted from",
        value: "Thaumaturge Woomba of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 586
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/952"
  },
  955: {
    name: "Wraith Knight Zubin of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/955",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Anti Hourglass"
      },
      {
        trait_type: "Affinity",
        value: "Wraith"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 955
      },
      {
        trait_type: "Transmuted from",
        value: "Chronomancer Zubin of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 571
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/955"
  },
  965: {
    name: "Putrid Zombie Voidoth of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/965",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 965
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Voidoth of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 459
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/965"
  },
  988: {
    name: "Night Ghoul Maia of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/988",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 988
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Maia of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 566
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/988"
  },
  1001: {
    name: "Wild Zombie Armstrong of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/1001",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "A Big Magic Stick with Ether Fire"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1001
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Armstrong of the Mountain"
      },
      {
        trait_type: "Burn order",
        value: 401
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1001"
  },
  1013: {
    name: "Grave Robbing Kobold Yookoo of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/1013",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Kobold Skull"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1013
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Yookoo of the Woodlands"
      },
      {
        trait_type: "Burn order",
        value: 499
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1013"
  },
  1019: {
    name: "Ethereal Spectre Thana of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/1019",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1019
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Thana of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 149
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1019"
  },
  1020: {
    name: "Lich Marquis Layla of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/1020",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Quantum Key"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1020
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Layla of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 161
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1020"
  },
  1023: {
    name: "Channel 1 Poltergeist Nicolas of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/1023",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1023
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Nicolas of the Atheneum"
      },
      {
        trait_type: "Burn order",
        value: 157
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1023"
  },
  1028: {
    name: "Lecherous Ghoul Aleister of Unparalleled Vulgarity",
    image: "https://portal.forgottenrunes.com/api/souls/img/1028",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1028
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Aleister of the Inferno"
      },
      {
        trait_type: "Burn order",
        value: 182
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1028"
  },
  1033: {
    name: "Canaanite Lord Bullock of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/1033",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Canaanite Skull"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1033
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Bullock of the Sands"
      },
      {
        trait_type: "Burn order",
        value: 34
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1033"
  },
  1045: {
    name: "Paranormal Phantasm Soya of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/1045",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1045
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Soya of the Citadel"
      },
      {
        trait_type: "Burn order",
        value: 702
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1045"
  },
  1046: {
    name: "Horned Phantasm Artis of the Gloom",
    image: "https://portal.forgottenrunes.com/api/souls/img/1046",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Hummingbird Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1046
      },
      {
        trait_type: "Transmuted from",
        value: "Cosmic Mage Artis of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 392
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1046"
  },
  1049: {
    name: "Gouged Revenant Aiko of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/1049",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snail"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Transmuted from number",
        value: 1049
      },
      {
        trait_type: "Transmuted from",
        value: "Cartomancer Aiko of the Bastion"
      },
      {
        trait_type: "Burn order",
        value: 312
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1049"
  },
  1056: {
    name: "Veiled Phantasm Merlon of the Impenetrable Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/1056",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1056
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Merlon of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 342
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1056"
  },
  1069: {
    name: "Night Ghoul Zixin of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/1069",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Anti Hourglass"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Shade"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1069
      },
      {
        trait_type: "Transmuted from",
        value: "Chronomancer Zixin of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 326
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1069"
  },
  1078: {
    name: "Veiled Phantasm Axel of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/1078",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Ghoul Stone Staff"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1078
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Axel of Cuckoo Land"
      },
      {
        trait_type: "Burn order",
        value: 280
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1078"
  },
  1093: {
    name: "Ectoplasmic Spectre Marius of the Ectoplasmic Horizon",
    image: "https://portal.forgottenrunes.com/api/souls/img/1093",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Broom on Fire"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1093
      },
      {
        trait_type: "Transmuted from",
        value: "Voodoo Priest Marius of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 243
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1093"
  },
  1099: {
    name: "Veiled Phantasm Udor of the Fuliginous Fog",
    image: "https://portal.forgottenrunes.com/api/souls/img/1099",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1099
      },
      {
        trait_type: "Transmuted from",
        value: " Udor of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 467
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1099"
  },
  1103: {
    name: "Holy Spectre Gunthor of the ???",
    image: "https://portal.forgottenrunes.com/api/souls/img/1103",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Odin's Despair: the Dark Cloud Spell"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1103
      },
      {
        trait_type: "Transmuted from",
        value: "Electromancer Gunthor of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 556
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1103"
  },
  1126: {
    name: "Putrid Zombie Casper of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/1126",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1126
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Casper of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 91
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1126"
  },
  1140: {
    name: "Paranormal Phantasm Rita of the Fuliginous Fog",
    image: "https://portal.forgottenrunes.com/api/souls/img/1140",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Odin's Despair: the Dark Cloud Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1140
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Rita of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 630
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1140"
  },
  1143: {
    name: "Lich Marquis Aleister of the Ether Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/1143",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1143
      },
      {
        trait_type: "Transmuted from",
        value: "Cryptomancer Aleister of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 715
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1143"
  },
  1156: {
    name: "Immaculate Urn",
    image: "https://portal.forgottenrunes.com/api/souls/img/1156",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Undesirable",
        value: "Immaculate Urn"
      },
      {
        trait_type: "Transmuted from number",
        value: 1156
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Celeste of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 45
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1156"
  },
  1181: {
    name: "Death Shroom Mycho of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/1181",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1181
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Mycho of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 191
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1181"
  },
  1185: {
    name: "Houngan Necromancer Eliphas of Gross Gorge",
    image: "https://portal.forgottenrunes.com/api/souls/img/1185",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Entropy Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Transmuted from number",
        value: 1185
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Eliphas of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 698
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1185"
  },
  1186: {
    name: "Channel 1 Poltergeist Angus of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/1186",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Soul"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1186
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Angus of the Carnival"
      },
      {
        trait_type: "Burn order",
        value: 85
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1186"
  },
  1195: {
    name: "Lewd Revenant Lamia of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/1195",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Transmuted from number",
        value: 1195
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Lamia of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 156
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1195"
  },
  1225: {
    name: "Wraith Captain Zane of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/1225",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1225
      },
      {
        trait_type: "Transmuted from",
        value: "Void Disciple Zane of Xanadu"
      },
      {
        trait_type: "Burn order",
        value: 547
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1225"
  },
  1230: {
    name: "Night Ghoul Iris of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/1230",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1230
      },
      {
        trait_type: "Transmuted from",
        value: "Solar Mage Iris of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 242
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1230"
  },
  1235: {
    name: "Cloud of Ectoplasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/1235",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Cloud of Ectoplasm"
      },
      {
        trait_type: "Transmuted from number",
        value: 1235
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Shizu of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 41
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1235"
  },
  1275: {
    name: "Channel 3 Poltergeist Basil of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/1275",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1275
      },
      {
        trait_type: "Transmuted from",
        value: "Clairvoyant Basil of the Palms"
      },
      {
        trait_type: "Burn order",
        value: 287
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1275"
  },
  1277: {
    name: "Wraith Deacon Cassius of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/1277",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1277
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Cassius of the Garden"
      },
      {
        trait_type: "Burn order",
        value: 456
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1277"
  },
  1282: {
    name: "Lewd Revenant Rita of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/1282",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Transmuted from number",
        value: 1282
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Rita of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 524
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1282"
  },
  1294: {
    name: "Lecherous Ghoul Uday of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/1294",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Vile of Vomit"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Disgusting"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1294
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Uday of the Temple"
      },
      {
        trait_type: "Burn order",
        value: 83
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1294"
  },
  1295: {
    name: "Lewd Revenant Rowena of Carnal Delights",
    image: "https://portal.forgottenrunes.com/api/souls/img/1295",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Quantum Key"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1295
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Rowena of the Inferno"
      },
      {
        trait_type: "Burn order",
        value: 60
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1295"
  },
  1314: {
    name: "Gouged Revenant Aldus of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/1314",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1314
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Aldus of the Atheneum"
      },
      {
        trait_type: "Burn order",
        value: 226
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1314"
  },
  1315: {
    name: "Rotten Revenant Aleister of the Gloom",
    image: "https://portal.forgottenrunes.com/api/souls/img/1315",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Charred Bone Stave"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1315
      },
      {
        trait_type: "Transmuted from",
        value: " Aleister of the Waste"
      },
      {
        trait_type: "Burn order",
        value: 200
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1315"
  },
  1327: {
    name: "Malodorous Ghoul Ofaris of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/1327",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Vile of Vomit"
      },
      {
        trait_type: "Affinity",
        value: "Disease"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1327
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Ofaris of Elysium"
      },
      {
        trait_type: "Burn order",
        value: 292
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1327"
  },
  1367: {
    name: "Hunted Stag Umber of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/1367",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1367
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Umber of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 598
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1367"
  },
  1369: {
    name: "Gangrenous Zombie Gunthor of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/1369",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1369
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Gunthor of the Circle"
      },
      {
        trait_type: "Burn order",
        value: 109
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1369"
  },
  1370: {
    name: "Rotten Revenant Gogol of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/1370",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1370
      },
      {
        trait_type: "Transmuted from",
        value: "Bard Gogol of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 484
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1370"
  },
  1409: {
    name: "Wild Zombie Cromwell of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/1409",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1409
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Cromwell of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 237
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1409"
  },
  1443: {
    name: "Paranormal Phantasm Tengu of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/1443",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Transmuted from number",
        value: 1443
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Tengu of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 155
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1443"
  },
  1446: {
    name: "Necro Frog Rixxa of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/1446",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1446
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Rixxa of El Dorado"
      },
      {
        trait_type: "Burn order",
        value: 97
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1446"
  },
  1458: {
    name: "Wraith Devout Victoria of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/1458",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1458
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Victoria of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 455
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1458"
  },
  1466: {
    name: "Houngan Necromancer Auguste of the Eternal Melancholy",
    image: "https://portal.forgottenrunes.com/api/souls/img/1466",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Transmuted from number",
        value: 1466
      },
      {
        trait_type: "Transmuted from",
        value: "Voodoo Priest Auguste of the Dunes"
      },
      {
        trait_type: "Burn order",
        value: 544
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1466"
  },
  1483: {
    name: "Wraith Deacon Malcom of the Brimstone Havens",
    image: "https://portal.forgottenrunes.com/api/souls/img/1483",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1483
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Malcom of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 71
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1483"
  },
  1498: {
    name: "Lewd Revenant Azahl of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/1498",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Flaming Rose"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1498
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Azahl of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 558
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1498"
  },
  1562: {
    name: "Ghost Flame Charlord of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/1562",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Ghost Flame"
      },
      {
        trait_type: "Prop",
        value: "Mystic Ice Cream melted"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Fox"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1562
      },
      {
        trait_type: "Transmuted from",
        value: "Null Mage Charlord of the Light"
      },
      {
        trait_type: "Burn order",
        value: 89
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1562"
  },
  1604: {
    name: "Death Shroom Amanita of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/1604",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1604
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Amanita of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 14
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1604"
  },
  1632: {
    name: "White Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/1632",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "White Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 1632
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Apollo of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 363
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1632"
  },
  1634: {
    name: "Ghost Pumpkin Pepo of the Static Snow",
    image: "https://portal.forgottenrunes.com/api/souls/img/1634",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Ghost Pumpkin"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1634
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Pepo of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 55
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1634"
  },
  1654: {
    name: "Horned Phantasm Cassius of the Glowing Box",
    image: "https://portal.forgottenrunes.com/api/souls/img/1654",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1654
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Cassius of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 28
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1654"
  },
  1667: {
    name: "Grave Robbing Kobold of the Hell Chamber",
    image: "https://portal.forgottenrunes.com/api/souls/img/1667",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Kobold Skull"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1667
      },
      {
        trait_type: "Transmuted from",
        value: "Magus  of the Cold"
      },
      {
        trait_type: "Burn order",
        value: 314
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1667"
  },
  1669: {
    name: "Wraith Captain Nazim of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/1669",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1669
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Nazim of the Oasis"
      },
      {
        trait_type: "Burn order",
        value: 316
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1669"
  },
  1670: {
    name: "Ghost Flame Azar of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/1670",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Ghost Flame"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1670
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Azar of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 319
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1670"
  },
  1678: {
    name: "Grim Ghoul Hagar of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/1678",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Charred Bone Stave"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1678
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Hagar of the Psychic Leap"
      },
      {
        trait_type: "Burn order",
        value: 221
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1678"
  },
  1686: {
    name: "Wooden Ghost Benito of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/1686",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Soul of Wooden Boy"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1686
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Benito of the Thorn"
      },
      {
        trait_type: "Burn order",
        value: 110
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1686"
  },
  1687: {
    name: "Lich Duke Lumos of the Ectoplasmic Horizon",
    image: "https://portal.forgottenrunes.com/api/souls/img/1687",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Blue Shift"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1687
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Lumos of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 330
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1687"
  },
  1693: {
    name: "Lich Despot Nassif of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/1693",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Ether Staff 2.0"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1693
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Nassif of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 227
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1693"
  },
  1704: {
    name: "Zombie King of the Undead",
    image: "https://portal.forgottenrunes.com/api/souls/img/1704",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Regal Decay"
      },
      {
        trait_type: "Head",
        value: "King of the Dead"
      },
      {
        trait_type: "Prop",
        value: "Fresh Brains"
      },
      {
        trait_type: "Affinity",
        value: "Disgusting"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1704
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Diabolos of Tartarus"
      },
      {
        trait_type: "Burn order",
        value: 482
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1704"
  },
  1708: {
    name: "Channel 1 Poltergeist Atlas of the Glowing Box",
    image: "https://portal.forgottenrunes.com/api/souls/img/1708",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Anti Hourglass"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1708
      },
      {
        trait_type: "Transmuted from",
        value: "Chronomancer Atlas of the Bastion"
      },
      {
        trait_type: "Burn order",
        value: 493
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1708"
  },
  1720: {
    name: "Putrid Zombie Voidoth of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/1720",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1720
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Voidoth of the Psychic Leap"
      },
      {
        trait_type: "Burn order",
        value: 189
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1720"
  },
  1722: {
    name: "Blood Eater Revenant Cassiopeia of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/1722",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Blight Tattered"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1722
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Cassiopeia of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 453
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1722"
  },
  1732: {
    name: "Jelly Donut with Slime",
    image: "https://portal.forgottenrunes.com/api/souls/img/1732",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Jelly Donut with Slime"
      },
      {
        trait_type: "Transmuted from number",
        value: 1732
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Magpie of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 293
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1732"
  },
  1764: {
    name: "Night Ghoul Angus of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/1764",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Affinity",
        value: "Shade"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1764
      },
      {
        trait_type: "Transmuted from",
        value: "Evoker Angus of the Temple"
      },
      {
        trait_type: "Burn order",
        value: 684
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1764"
  },
  1779: {
    name: "Channel 1 Poltergeist Alatar of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/1779",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1779
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Alatar of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 123
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1779"
  },
  1780: {
    name: "Wraith Captain Ifran of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/1780",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1780
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Ifran of the Citadel"
      },
      {
        trait_type: "Burn order",
        value: 515
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1780"
  },
  1781: {
    name: "Lich Marquis Ixar of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/1781",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1781
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Ixar of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 465
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1781"
  },
  1792: {
    name: "Putrid Zombie Pumlo of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/1792",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 1792
      },
      {
        trait_type: "Transmuted from",
        value: "Battlemage Pumlo of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 2
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1792"
  },
  1799: {
    name: "Purple Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/1799",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Purple Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 1799
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Alessar of the Sea"
      },
      {
        trait_type: "Burn order",
        value: 418
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1799"
  },
  1804: {
    name: "Ethereal Spectre Titania of the Penumbra",
    image: "https://portal.forgottenrunes.com/api/souls/img/1804",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body Shade"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1804
      },
      {
        trait_type: "Transmuted from",
        value: "Bard Titania of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 486
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1804"
  },
  1818: {
    name: "Lich Baron of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/1818",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Lich"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1818
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer  of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 648
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1818"
  },
  1820: {
    name: "Lich Baron Sondra of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/1820",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Ether Staff 2.0"
      },
      {
        trait_type: "Familiar",
        value: "Wolf Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1820
      },
      {
        trait_type: "Transmuted from",
        value: "Oracle Sondra of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 151
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1820"
  },
  1834: {
    name: "Canaanite Lord Oxnard of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/1834",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Canaanite Skull"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1834
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Oxnard of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 96
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1834"
  },
  1847: {
    name: "Shaded Spectre Lucinda of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/1847",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 1847
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Lucinda of the Fey"
      },
      {
        trait_type: "Burn order",
        value: 649
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1847"
  },
  1848: {
    name: "Houngan Necromancer Le Blanc of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/1848",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1848
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Le Blanc of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 517
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1848"
  },
  1849: {
    name: "Houngan Necromancer Gaspard of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/1849",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 1849
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Gaspard of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 341
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1849"
  },
  1855: {
    name: "Lich Baron Iprix of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/1855",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1855
      },
      {
        trait_type: "Transmuted from",
        value: "Cleric Iprix of El Dorado"
      },
      {
        trait_type: "Burn order",
        value: 266
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1855"
  },
  1864: {
    name: "Lewd Revenant Ekmira of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/1864",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Ether Staff 2.0"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Transmuted from number",
        value: 1864
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Ekmira of the Event Horizon"
      },
      {
        trait_type: "Burn order",
        value: 439
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1864"
  },
  1872: {
    name: "Lecherous Ghoul Naoki of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/1872",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1872
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Naoki of the Tundra"
      },
      {
        trait_type: "Burn order",
        value: 683
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1872"
  },
  1949: {
    name: "Ethereal Spectre Chiyo of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/1949",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1949
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Chiyo of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 76
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1949"
  },
  1955: {
    name: "Lich Despot Ratko of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/1955",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1955
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Ratko of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 587
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1955"
  },
  1970: {
    name: "Death Shroom Hongo of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/1970",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1970
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Hongo of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 216
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1970"
  },
  1972: {
    name: "Channel 3 Poltergeist Milton of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/1972",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1972
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Milton of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 290
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1972"
  },
  1981: {
    name: "Ethereal Spectre Crowley of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/1981",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1981
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Crowley of the Inferno"
      },
      {
        trait_type: "Burn order",
        value: 452
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1981"
  },
  1983: {
    name: "Veiled Phantasm Aldus of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/1983",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1983
      },
      {
        trait_type: "Transmuted from",
        value: " Aldus of the Thorn"
      },
      {
        trait_type: "Burn order",
        value: 269
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1983"
  },
  1986: {
    name: "Horned Phantasm The Goblin King",
    image: "https://portal.forgottenrunes.com/api/souls/img/1986",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1986
      },
      {
        trait_type: "Transmuted from",
        value: "The Goblin King"
      },
      {
        trait_type: "Burn order",
        value: 247
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1986"
  },
  1990: {
    name: "Lich Marquis Larissa of Gross Gorge",
    image: "https://portal.forgottenrunes.com/api/souls/img/1990",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Consumption Tattered"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1990
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Larissa of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 592
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1990"
  },
  1996: {
    name: "Ectoplasmic Spectre George of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/1996",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 1996
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer George of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 600
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/1996"
  },
  2004: {
    name: "Wooden Ghost Corky of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/2004",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Soul of Wooden Boy"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2004
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Corky of the Havens"
      },
      {
        trait_type: "Burn order",
        value: 220
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2004"
  },
  2008: {
    name: "Ashpile",
    image: "https://portal.forgottenrunes.com/api/souls/img/2008",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile"
      },
      {
        trait_type: "Transmuted from number",
        value: 2008
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Apollo "
      },
      {
        trait_type: "Burn order",
        value: 278
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2008"
  },
  2012: {
    name: "Wraith Knight Aden of the Pale Moon",
    image: "https://portal.forgottenrunes.com/api/souls/img/2012",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Transmuted from number",
        value: 2012
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Aden of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 238
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2012"
  },
  2015: {
    name: "Rotten Revenant Titania of the Eternal Melancholy",
    image: "https://portal.forgottenrunes.com/api/souls/img/2015",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2015
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Titania of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 81
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2015"
  },
  2027: {
    name: "Ectoplasmic Spectre Zelroth of the XYZ",
    image: "https://portal.forgottenrunes.com/api/souls/img/2027",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Quantum Key"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2027
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Zelroth of the Secret Fire"
      },
      {
        trait_type: "Burn order",
        value: 262
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2027"
  },
  2035: {
    name: "Putrid Zombie Jaffer of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/2035",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2035
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Jaffer of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 327
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2035"
  },
  2041: {
    name: "Channel 1 Poltergeist George of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/2041",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Transmuted from number",
        value: 2041
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer George of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 624
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2041"
  },
  2067: {
    name: "Channel 1 Poltergeist Ratko of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/2067",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Transmuted from number",
        value: 2067
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Ratko of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 417
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2067"
  },
  2073: {
    name: "Ashpile",
    image: "https://portal.forgottenrunes.com/api/souls/img/2073",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile"
      },
      {
        trait_type: "Transmuted from number",
        value: 2073
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Jadis of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 101
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2073"
  },
  2080: {
    name: "Wraith Captain Soran of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/2080",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Transmuted from number",
        value: 2080
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Soran of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 627
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2080"
  },
  2086: {
    name: "Lecherous Ghoul Azahl of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/2086",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2086
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Azahl of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 442
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2086"
  },
  2104: {
    name: "Void Phantasm Zane of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/2104",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Affinity",
        value: "Void"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2104
      },
      {
        trait_type: "Transmuted from",
        value: "Summoner Zane of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 164
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2104"
  },
  2106: {
    name: "Night Ghoul Rita of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/2106",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Entropy Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Shade"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2106
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Rita of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 394
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2106"
  },
  2116: {
    name: "Death Shroom Buttons of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/2116",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2116
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Buttons of the Circle"
      },
      {
        trait_type: "Burn order",
        value: 125
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2116"
  },
  2120: {
    name: "Death Shroom Mushy of the Haze",
    image: "https://portal.forgottenrunes.com/api/souls/img/2120",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2120
      },
      {
        trait_type: "Transmuted from",
        value: "Conjurer Mushy of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 580
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2120"
  },
  2164: {
    name: "Ethereal Spectre Jianyu of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/2164",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2164
      },
      {
        trait_type: "Transmuted from",
        value: "Aeromancer Jianyu of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 672
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2164"
  },
  2177: {
    name: "Blight Zombie Azahl of the Severed Innocence",
    image: "https://portal.forgottenrunes.com/api/souls/img/2177",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2177
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Azahl of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 39
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2177"
  },
  2201: {
    name: "Blight Zombie Cosmo of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/2201",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Transmuted from number",
        value: 2201
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Cosmo of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 12
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2201"
  },
  2204: {
    name: "Malodorous Ghoul Milo of the Hell Chamber",
    image: "https://portal.forgottenrunes.com/api/souls/img/2204",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2204
      },
      {
        trait_type: "Transmuted from",
        value: "Ice Mage Milo of the Ice"
      },
      {
        trait_type: "Burn order",
        value: 61
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2204"
  },
  2205: {
    name: "Ethereal Urn",
    image: "https://portal.forgottenrunes.com/api/souls/img/2205",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Ethereal Urn"
      },
      {
        trait_type: "Transmuted from number",
        value: 2205
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Celah of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 343
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2205"
  },
  2206: {
    name: "Putrid Zombie Juniper of the Scum Barrel",
    image: "https://portal.forgottenrunes.com/api/souls/img/2206",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2206
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Juniper of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 135
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2206"
  },
  2208: {
    name: "Blood Eater Revenant Ifran of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/2208",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Charred Bone Stave"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Blood"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2208
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Ifran of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 349
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2208"
  },
  2225: {
    name: "Wraith Deacon Shivra of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/2225",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2225
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Shivra of the Quantum Shadow"
      },
      {
        trait_type: "Burn order",
        value: 201
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2225"
  },
  2226: {
    name: "Lich Despot Solomon of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/2226",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2226
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Solomon of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 311
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2226"
  },
  2231: {
    name: "Grim Ghoul Cassius of the Brimstone Havens",
    image: "https://portal.forgottenrunes.com/api/souls/img/2231",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2231
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Cassius of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 553
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2231"
  },
  2245: {
    name: "Houngan Necromancer Gaspard of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/2245",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Death"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2245
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Gaspard of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 710
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2245"
  },
  2248: {
    name: "Paranormal Phantasm Davos of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/2248",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Odin's Despair: the Dark Cloud Spell"
      },
      {
        trait_type: "Transmuted from number",
        value: 2248
      },
      {
        trait_type: "Transmuted from",
        value: "Electromancer Davos of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 501
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2248"
  },
  2260: {
    name: "Grim Ghoul Lucinda of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/2260",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2260
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Lucinda of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 675
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2260"
  },
  2267: {
    name: "Death Crow JackDaw of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/2267",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Corvid Skull"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Transmuted from number",
        value: 2267
      },
      {
        trait_type: "Transmuted from",
        value: "Sky Master JackDaw of Mu"
      },
      {
        trait_type: "Burn order",
        value: 317
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2267"
  },
  2279: {
    name: "Wraith Deacon Eden of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/2279",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2279
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Eden of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 617
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2279"
  },
  2287: {
    name: "Hunted Stag Hind of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/2287",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2287
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Hind of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 117
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2287"
  },
  2309: {
    name: "Pile of Bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/2309",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Pile of Bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 2309
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Carly of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 258
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2309"
  },
  2310: {
    name: "Raspberry Jelly Donut",
    image: "https://portal.forgottenrunes.com/api/souls/img/2310",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Raspberry Jelly Donut"
      },
      {
        trait_type: "Transmuted from number",
        value: 2310
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Sondra of the Field"
      },
      {
        trait_type: "Burn order",
        value: 658
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2310"
  },
  2311: {
    name: "Malodorous Ghoul Aslan of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/2311",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Transmuted from number",
        value: 2311
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Aslan of the Brine"
      },
      {
        trait_type: "Burn order",
        value: 353
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2311"
  },
  2316: {
    name: "Wraith Deacon Dante of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/2316",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2316
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Dante of the Oasis"
      },
      {
        trait_type: "Burn order",
        value: 356
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2316"
  },
  2317: {
    name: "Lecherous Ghoul Aiko of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/2317",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Black Sun Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Transmuted from number",
        value: 2317
      },
      {
        trait_type: "Transmuted from",
        value: "Chaos Mage Aiko of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 357
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2317"
  },
  2337: {
    name: "Horned Phantasm Sondra of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/2337",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Down"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2337
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Sondra of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 103
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2337"
  },
  2352: {
    name: "Malodorous Ghoul Ixar of the Fetid Ruins",
    image: "https://portal.forgottenrunes.com/api/souls/img/2352",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Disease"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2352
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Ixar from the Abyss"
      },
      {
        trait_type: "Burn order",
        value: 611
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2352"
  },
  2366: {
    name: "3-Eye Necromancer Ozohr of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/2366",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Braindrain Skull"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2366
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Ozohr of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 638
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2366"
  },
  2372: {
    name: "Lich Cyborg Voidoth of the Valley of the Void Desciple",
    image: "https://portal.forgottenrunes.com/api/souls/img/2372",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Lich Cyborog"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2372
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Voidoth of the Event Horizon"
      },
      {
        trait_type: "Burn order",
        value: 277
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2372"
  },
  2379: {
    name: "Veiled Phantasm Darick of the Gloom",
    image: "https://portal.forgottenrunes.com/api/souls/img/2379",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2379
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Darick of the Dunes"
      },
      {
        trait_type: "Burn order",
        value: 546
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2379"
  },
  2385: {
    name: "Malodorous Ghoul Alessar of the Brimstone Havens",
    image: "https://portal.forgottenrunes.com/api/souls/img/2385",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Disease"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2385
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Alessar of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 419
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2385"
  },
  2399: {
    name: "Consumption Zombie Aleister of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/2399",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Consumption Zombie"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Transmuted from number",
        value: 2399
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Aleister from the Abyss"
      },
      {
        trait_type: "Burn order",
        value: 202
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2399"
  },
  2409: {
    name: "Void Phantasm Aiko of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/2409",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2409
      },
      {
        trait_type: "Transmuted from",
        value: "Solar Mage Aiko of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 348
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2409"
  },
  2410: {
    name: "Malodorous Ghoul Uvlius of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/2410",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Disease"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2410
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Uvlius of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 94
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2410"
  },
  2417: {
    name: "Lich Despot Auguste of the Machine",
    image: "https://portal.forgottenrunes.com/api/souls/img/2417",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2417
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Auguste of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 153
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2417"
  },
  2430: {
    name: "Wild Zombie Aslan of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/2430",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Transmuted from number",
        value: 2430
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Aslan of the Mist"
      },
      {
        trait_type: "Burn order",
        value: 107
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2430"
  },
  2443: {
    name: "Channel 3 Poltergeist Khudalf of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/2443",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Vile of Vomit"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2443
      },
      {
        trait_type: "Transmuted from",
        value: "Diabolist Khudalf of El Dorado"
      },
      {
        trait_type: "Burn order",
        value: 481
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2443"
  },
  2450: {
    name: "Night Ghoul Pumlo of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/2450",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2450
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Pumlo of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 708
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2450"
  },
  2455: {
    name: "Putrid Zombie Eric of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/2455",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2455
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Eric of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 545
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2455"
  },
  2479: {
    name: "Void Phantasm Celah of the Hell Chamber",
    image: "https://portal.forgottenrunes.com/api/souls/img/2479",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2479
      },
      {
        trait_type: "Transmuted from",
        value: "Oracle Celah of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 371
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2479"
  },
  2486: {
    name: "Void Phantasm Amir of the Fuliginous Fog",
    image: "https://portal.forgottenrunes.com/api/souls/img/2486",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2486
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Amir of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 594
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2486"
  },
  2521: {
    name: "Ectoplasmic Spectre Rodolfo of the Bubonic Beaches",
    image: "https://portal.forgottenrunes.com/api/souls/img/2521",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 2521
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Rodolfo of the Loch"
      },
      {
        trait_type: "Burn order",
        value: 516
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2521"
  },
  2527: {
    name: "Houngan Necromancer Marius of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/2527",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Anti Hourglass"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Transmuted from number",
        value: 2527
      },
      {
        trait_type: "Transmuted from",
        value: "Chronomancer Marius of the Garden"
      },
      {
        trait_type: "Burn order",
        value: 559
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2527"
  },
  2532: {
    name: "Blood Eater Revenant Karasu of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/2532",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 2532
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Karasu of the Ether"
      },
      {
        trait_type: "Burn order",
        value: 308
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2532"
  },
  2544: {
    name: "Wraith Knight Jabir of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/2544",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2544
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Jabir of the Palms"
      },
      {
        trait_type: "Burn order",
        value: 457
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2544"
  },
  2549: {
    name: "Ectoplasmic Spectre Amir of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/2549",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2549
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Amir of the Psychic Leap"
      },
      {
        trait_type: "Burn order",
        value: 635
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2549"
  },
  2577: {
    name: "Void Phantasm Diana of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/2577",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Void"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2577
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Diana of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 82
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2577"
  },
  2581: {
    name: "Rotten Revenant Adrienne of Limbo",
    image: "https://portal.forgottenrunes.com/api/souls/img/2581",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2581
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Adrienne of the River"
      },
      {
        trait_type: "Burn order",
        value: 263
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2581"
  },
  2593: {
    name: "Rotten Revenant Nolan of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/2593",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2593
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Nolan of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 382
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2593"
  },
  2611: {
    name: "Rotten Revenant Bolin of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/2611",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Harp"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2611
      },
      {
        trait_type: "Transmuted from",
        value: "Bard Bolin of El Dorado"
      },
      {
        trait_type: "Burn order",
        value: 494
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2611"
  },
  2677: {
    name: "Green Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/2677",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Green Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 2677
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Arcus of the Platonic Shadow"
      },
      {
        trait_type: "Burn order",
        value: 251
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2677"
  },
  2685: {
    name: "Grim Ghoul Juniper of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/2685",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 2685
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Juniper of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 582
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2685"
  },
  2692: {
    name: "Wraith Knight Astrid of the Bubonic Beaches",
    image: "https://portal.forgottenrunes.com/api/souls/img/2692",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2692
      },
      {
        trait_type: "Transmuted from",
        value: "Oracle Astrid of the Swell"
      },
      {
        trait_type: "Burn order",
        value: 531
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2692"
  },
  2700: {
    name: "Wraith Deacon Nazim of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/2700",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 2700
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Nazim of the Ether"
      },
      {
        trait_type: "Burn order",
        value: 203
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2700"
  },
  2706: {
    name: "Channel 3 Poltergeist Aldus of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/2706",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Transmuted from number",
        value: 2706
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Aldus of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 415
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2706"
  },
  2721: {
    name: "Shaded Spectre Alatar of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/2721",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 2721
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Alatar of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 215
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2721"
  },
  2742: {
    name: "Grim Ghoul Aleister of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/2742",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Down"
      },
      {
        trait_type: "Transmuted from number",
        value: 2742
      },
      {
        trait_type: "Transmuted from",
        value: "Cosmic Mage Aleister of the Quantum Downs"
      },
      {
        trait_type: "Burn order",
        value: 426
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2742"
  },
  2751: {
    name: "Wooden Ghost Jasper of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/2751",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Soul of Wooden Boy"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2751
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Jasper of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 395
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2751"
  },
  2753: {
    name: "Wraith Captain Ivy of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/2753",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2753
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Ivy of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 434
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2753"
  },
  2787: {
    name: "Shaded Spectre Layla of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/2787",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2787
      },
      {
        trait_type: "Transmuted from",
        value: " Layla of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 170
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2787"
  },
  2796: {
    name: "Putrid Zombie Dante of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/2796",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2796
      },
      {
        trait_type: "Transmuted from",
        value: "Thaumaturge Dante of the Citadel"
      },
      {
        trait_type: "Burn order",
        value: 707
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2796"
  },
  2811: {
    name: "Wild Zombie Horace of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/2811",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2811
      },
      {
        trait_type: "Transmuted from",
        value: "Thaumaturge Horace of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 579
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2811"
  },
  2839: {
    name: "Blight Zombie Basil of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/2839",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Book of Dark Magic"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2839
      },
      {
        trait_type: "Transmuted from",
        value: " Basil of the Oasis"
      },
      {
        trait_type: "Burn order",
        value: 309
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2839"
  },
  2843: {
    name: "Wraith Devout Ixar of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/2843",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2843
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Ixar of the Ice"
      },
      {
        trait_type: "Burn order",
        value: 74
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2843"
  },
  2851: {
    name: "Raspberry Jelly Donut",
    image: "https://portal.forgottenrunes.com/api/souls/img/2851",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Raspberry Jelly Donut"
      },
      {
        trait_type: "Transmuted from number",
        value: 2851
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Aleister of Xanadu"
      },
      {
        trait_type: "Burn order",
        value: 147
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2851"
  },
  2854: {
    name: "Consumption Zombie Milton of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/2854",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Consumption Zombie"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Down"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2854
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Milton of the Swell"
      },
      {
        trait_type: "Burn order",
        value: 301
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2854"
  },
  2863: {
    name: "Rotten Revenant Kalo of the Severed Innocence",
    image: "https://portal.forgottenrunes.com/api/souls/img/2863",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2863
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Kalo of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 668
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2863"
  },
  2884: {
    name: "Death Shroom Alice of the Valley of the Void Desciple",
    image: "https://portal.forgottenrunes.com/api/souls/img/2884",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2884
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Alice of the Bastion"
      },
      {
        trait_type: "Burn order",
        value: 231
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2884"
  },
  2892: {
    name: "Wraith Devout Udor ",
    image: "https://portal.forgottenrunes.com/api/souls/img/2892",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2892
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Udor "
      },
      {
        trait_type: "Burn order",
        value: 608
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2892"
  },
  2908: {
    name: "Gangrenous Zombie Lumos of the Fetid Fire",
    image: "https://portal.forgottenrunes.com/api/souls/img/2908",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2908
      },
      {
        trait_type: "Transmuted from",
        value: " Lumos of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 682
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2908"
  },
  2912: {
    name: "Holy Urn",
    image: "https://portal.forgottenrunes.com/api/souls/img/2912",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Holy Urn"
      },
      {
        trait_type: "Transmuted from number",
        value: 2912
      },
      {
        trait_type: "Transmuted from",
        value: "Voodoo Priest Hothor of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 23
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2912"
  },
  2918: {
    name: "Ghost Flame Scorch of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/2918",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Ghost Flame"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2918
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Scorch of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 22
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2918"
  },
  2928: {
    name: "Demonic Goat Faustus of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/2928",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Evil One's Skull"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Transmuted from number",
        value: 2928
      },
      {
        trait_type: "Transmuted from",
        value: "Evil Arcanist Faustus of the Great Blue"
      },
      {
        trait_type: "Burn order",
        value: 57
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2928"
  },
  2932: {
    name: "Night Ghoul Daphne of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/2932",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2932
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Daphne of the Waste"
      },
      {
        trait_type: "Burn order",
        value: 406
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2932"
  },
  2944: {
    name: "Blight Zombie Nicolas of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/2944",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Transmuted from number",
        value: 2944
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Nicolas of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 54
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2944"
  },
  2950: {
    name: "Wraith Captain Nori of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/2950",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2950
      },
      {
        trait_type: "Transmuted from",
        value: "Cleric Nori of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 186
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2950"
  },
  2953: {
    name: "Veiled Phantasm Hu of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/2953",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Down"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 2953
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Hu of Xanadu"
      },
      {
        trait_type: "Burn order",
        value: 302
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2953"
  },
  2987: {
    name: "Eldritch Horror Azathoth of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/2987",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Eldritch Horror"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Transmuted from number",
        value: 2987
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Azathoth of the Oasis"
      },
      {
        trait_type: "Burn order",
        value: 687
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/2987"
  },
  3037: {
    name: "Shaded Spectre Larissa of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/3037",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3037
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Larissa of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 166
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3037"
  },
  3047: {
    name: "Blight Zombie Alatar of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/3047",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3047
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Alatar of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 80
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3047"
  },
  3055: {
    name: "Gouged Revenant Nolan of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/3055",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Affinity",
        value: "Revenant"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3055
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Nolan of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 496
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3055"
  },
  3059: {
    name: "Wraith Deacon Tundror of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/3059",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Quantum Key"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3059
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Tundror of the Wild"
      },
      {
        trait_type: "Burn order",
        value: 441
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3059"
  },
  3088: {
    name: "Lich Marquis Lamia of the Abandoned Waste",
    image: "https://portal.forgottenrunes.com/api/souls/img/3088",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Book of Dark Magic"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Affinity",
        value: "Death"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3088
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Lamia of the Oasis"
      },
      {
        trait_type: "Burn order",
        value: 537
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3088"
  },
  3098: {
    name: "Ethereal Spectre Sylvia of the Ectoplasmic Downs",
    image: "https://portal.forgottenrunes.com/api/souls/img/3098",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Flaming Rose"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3098
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Sylvia of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 618
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3098"
  },
  3115: {
    name: "Rotten Revenant Jeldor of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/3115",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3115
      },
      {
        trait_type: "Transmuted from",
        value: "Battlemage Jeldor of the Ice"
      },
      {
        trait_type: "Burn order",
        value: 114
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3115"
  },
  3122: {
    name: "Lich Marquis Dr. Death of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/3122",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Inverted Horseshoe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3122
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Dr. Death of Xanadu"
      },
      {
        trait_type: "Burn order",
        value: 448
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3122"
  },
  3145: {
    name: "Lecherous Ghoul Aden of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/3145",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3145
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Aden of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 241
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3145"
  },
  3174: {
    name: "Putrid Zombie Malthus of Gross Gorge",
    image: "https://portal.forgottenrunes.com/api/souls/img/3174",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3174
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Malthus of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 368
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3174"
  },
  3176: {
    name: "Horned Phantasm Nazim of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/3176",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3176
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Nazim of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 367
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3176"
  },
  3179: {
    name: "Wraith Deacon Cullen of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/3179",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3179
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Cullen of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 9
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3179"
  },
  3197: {
    name: "Shaded Spectre Ivy of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/3197",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3197
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Ivy of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 105
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3197"
  },
  3214: {
    name: "Malodorous Ghoul Karasu of the Fetid Ruins",
    image: "https://portal.forgottenrunes.com/api/souls/img/3214",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Broom on Fire"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Disease"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3214
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Karasu of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 589
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3214"
  },
  3220: {
    name: "Lich Cyborg Dr. Death of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/3220",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Lich Cyborog"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Cockatrice Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Transmuted from number",
        value: 3220
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Dr. Death of the Ether"
      },
      {
        trait_type: "Burn order",
        value: 274
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3220"
  },
  3224: {
    name: "Lich Marquis Aldus of the Impenetrable Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/3224",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Book of Dark Magic"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Transmuted from number",
        value: 3224
      },
      {
        trait_type: "Transmuted from",
        value: " Aldus of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 379
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3224"
  },
  3231: {
    name: "Channel 1 Poltergeist Victoria of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/3231",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3231
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Victoria of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 533
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3231"
  },
  3240: {
    name: "Necro Frog Poppy of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/3240",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Transmuted from number",
        value: 3240
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Poppy of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 562
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3240"
  },
  3243: {
    name: "Meta Orb",
    image: "https://portal.forgottenrunes.com/api/souls/img/3243",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Undesirable",
        value: "Meta Orb"
      },
      {
        trait_type: "Transmuted from number",
        value: 3243
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Reza of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 158
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3243"
  },
  3246: {
    name: "Paranormal Phantasm Isaac of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/3246",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Transmuted from number",
        value: 3246
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Isaac of the Ether"
      },
      {
        trait_type: "Burn order",
        value: 303
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3246"
  },
  3249: {
    name: "Gouged Revenant Maia of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/3249",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Blood"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3249
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Maia of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 716
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3249"
  },
  3258: {
    name: "Lich Marquis Aiko of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/3258",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3258
      },
      {
        trait_type: "Transmuted from",
        value: "Clairvoyant Aiko of the Astral Plane"
      },
      {
        trait_type: "Burn order",
        value: 124
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3258"
  },
  3259: {
    name: "Void Phantasm Sharx of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/3259",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3259
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Sharx of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 252
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3259"
  },
  3263: {
    name: "Wraith Captain Alizam of the Spooklight",
    image: "https://portal.forgottenrunes.com/api/souls/img/3263",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3263
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Alizam of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 173
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3263"
  },
  3265: {
    name: "Grim Ghoul Astrid of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/3265",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Broom on Fire"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Transmuted from number",
        value: 3265
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Astrid of the River"
      },
      {
        trait_type: "Burn order",
        value: 361
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3265"
  },
  3274: {
    name: "Wraith Devout Azazel of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/3274",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Book of Dark Magic"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3274
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Azazel of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 526
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3274"
  },
  3284: {
    name: "Wraith Captain Bolin of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/3284",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3284
      },
      {
        trait_type: "Transmuted from",
        value: "Stellar Mage Bolin of the Havens"
      },
      {
        trait_type: "Burn order",
        value: 291
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3284"
  },
  3300: {
    name: "Wraith Devout Uday of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/3300",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3300
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Uday of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 740
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3300"
  },
  3336: {
    name: "Cloud of Ectoplasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/3336",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Cloud of Ectoplasm"
      },
      {
        trait_type: "Transmuted from number",
        value: 3336
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Nazim of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 261
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3336"
  },
  3365: {
    name: "Ghost Pumpkin Gourdon of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/3365",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Ghost Pumpkin"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3365
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Gourdon of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 90
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3365"
  },
  3394: {
    name: "Putrid Zombie Caligula of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/3394",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3394
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Caligula of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 352
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3394"
  },
  3415: {
    name: "Lewd Revenant Blaise of Unparalleled Vulgarity",
    image: "https://portal.forgottenrunes.com/api/souls/img/3415",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3415
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Blaise of the Wild"
      },
      {
        trait_type: "Burn order",
        value: 228
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3415"
  },
  3417: {
    name: "Channel 3 Poltergeist Merlon of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/3417",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3417
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Merlon of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 430
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3417"
  },
  3418: {
    name: "Houngan Necromancer Gallo of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/3418",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Transmuted from number",
        value: 3418
      },
      {
        trait_type: "Transmuted from",
        value: "Voodoo Priest Gallo of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 366
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3418"
  },
  3425: {
    name: "Putrid Zombie Merlon of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/3425",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Vile of Vomit"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Affinity",
        value: "Disgusting"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3425
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Merlon of the Fey"
      },
      {
        trait_type: "Burn order",
        value: 6
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3425"
  },
  3429: {
    name: "Horned Phantasm Salvatore of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/3429",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3429
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Salvatore of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 613
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3429"
  },
  3433: {
    name: "Ectoplasm Goop",
    image: "https://portal.forgottenrunes.com/api/souls/img/3433",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Ectoplasm Goop"
      },
      {
        trait_type: "Transmuted from number",
        value: 3433
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Wolfram of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 204
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3433"
  },
  3446: {
    name: "Paranormal Phantasm Aamon of the Paranormal",
    image: "https://portal.forgottenrunes.com/api/souls/img/3446",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3446
      },
      {
        trait_type: "Transmuted from",
        value: "Stellar Mage Aamon of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 271
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3446"
  },
  3468: {
    name: "Ectoplasmic Spectre Zolona of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/3468",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3468
      },
      {
        trait_type: "Transmuted from",
        value: "Cosmic Mage Zolona of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 218
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3468"
  },
  3483: {
    name: "Night Ghoul Xiaosheng of the Asphodel Meadows",
    image: "https://portal.forgottenrunes.com/api/souls/img/3483",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Charred Pipe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3483
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Xiaosheng of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 19
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3483"
  },
  3494: {
    name: "Malodorous Ghoul Hagatha of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/3494",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Odin's Despair: the Dark Cloud Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3494
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Hagatha of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 354
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3494"
  },
  3502: {
    name: "Hue Skeleton Hue of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/3502",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Hue Skeleton"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3502
      },
      {
        trait_type: "Transmuted from",
        value: "Colormancer Hue of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 208
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3502"
  },
  3509: {
    name: "Wild Zombie Darick of the Fetid Fire",
    image: "https://portal.forgottenrunes.com/api/souls/img/3509",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3509
      },
      {
        trait_type: "Transmuted from",
        value: "Augurer Darick of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 374
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3509"
  },
  3562: {
    name: "Wooden Ghost Corky of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/3562",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Soul of Wooden Boy"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3562
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Corky of Xanadu"
      },
      {
        trait_type: "Burn order",
        value: 285
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3562"
  },
  3563: {
    name: "Rotten Revenant Tundror of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/3563",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 3563
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Tundror of the Surf"
      },
      {
        trait_type: "Burn order",
        value: 69
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3563"
  },
  3574: {
    name: "Void Phantasm Udor of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/3574",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3574
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Udor of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 205
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3574"
  },
  3586: {
    name: "Horned Phantasm Circe of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/3586",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3586
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Circe of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 323
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3586"
  },
  3599: {
    name: "Wraith Captain Xerxes of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/3599",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3599
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Xerxes of Alfheim"
      },
      {
        trait_type: "Burn order",
        value: 148
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3599"
  },
  3642: {
    name: "Blueberry Jelly Donut",
    image: "https://portal.forgottenrunes.com/api/souls/img/3642",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Blueberry Jelly Donut"
      },
      {
        trait_type: "Transmuted from number",
        value: 3642
      },
      {
        trait_type: "Transmuted from",
        value: "Spellsinger Nikolas of the Ether"
      },
      {
        trait_type: "Burn order",
        value: 591
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3642"
  },
  3670: {
    name: "Putrid Zombie Nicolas of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/3670",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Flaming Rose"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3670
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Nicolas of the Oasis"
      },
      {
        trait_type: "Burn order",
        value: 705
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3670"
  },
  3684: {
    name: "Channel 3 Poltergeist Magnus of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/3684",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3684
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Magnus of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 320
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3684"
  },
  3698: {
    name: "Wraith Knight Danny of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/3698",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3698
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Danny of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 720
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3698"
  },
  3720: {
    name: "Blueberry Jelly Donut",
    image: "https://portal.forgottenrunes.com/api/souls/img/3720",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Blueberry Jelly Donut"
      },
      {
        trait_type: "Transmuted from number",
        value: 3720
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Morrow of the Bibliotheca"
      },
      {
        trait_type: "Burn order",
        value: 375
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3720"
  },
  3744: {
    name: "Ashpile",
    image: "https://portal.forgottenrunes.com/api/souls/img/3744",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile"
      },
      {
        trait_type: "Transmuted from number",
        value: 3744
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Moka of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 138
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3744"
  },
  3745: {
    name: "Lewd Revenant Cromwell of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/3745",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Revenant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3745
      },
      {
        trait_type: "Transmuted from",
        value: "Ice Mage Cromwell of the Expanse"
      },
      {
        trait_type: "Burn order",
        value: 137
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3745"
  },
  3768: {
    name: "Wild Zombie Goliath of the Shell",
    image: "https://portal.forgottenrunes.com/api/souls/img/3768",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3768
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Goliath of the Sands"
      },
      {
        trait_type: "Burn order",
        value: 719
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3768"
  },
  3774: {
    name: "Wraith Deacon Layla of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/3774",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Transmuted from number",
        value: 3774
      },
      {
        trait_type: "Transmuted from",
        value: "Hydromancer Layla of the Mountain"
      },
      {
        trait_type: "Burn order",
        value: 551
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3774"
  },
  3787: {
    name: "Channel 3 Poltergeist Jerret of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/3787",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3787
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Jerret of the Quantum Downs"
      },
      {
        trait_type: "Burn order",
        value: 665
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3787"
  },
  3791: {
    name: "Death Crow Jay of the Abandoned Waste",
    image: "https://portal.forgottenrunes.com/api/souls/img/3791",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Corvid Skull"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Wraith"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3791
      },
      {
        trait_type: "Transmuted from",
        value: "Cryptomancer Jay of the Secret Fire"
      },
      {
        trait_type: "Burn order",
        value: 10
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3791"
  },
  3794: {
    name: "Channel 3 Poltergeist Ramiz of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/3794",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Ether Staff 2.0"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Infinity"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3794
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Ramiz of the Bibliotheca"
      },
      {
        trait_type: "Burn order",
        value: 289
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3794"
  },
  3802: {
    name: "Fire Eye Iris of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/3802",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Eyeball Fireball"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Transmuted from number",
        value: 3802
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Iris of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 36
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3802"
  },
  3805: {
    name: "Channel 1 Poltergeist Horace of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/3805",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3805
      },
      {
        trait_type: "Transmuted from",
        value: "Oracle Horace of the Cold"
      },
      {
        trait_type: "Burn order",
        value: 331
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3805"
  },
  3808: {
    name: "Malodorous Ghoul Cromwell of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/3808",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Transmuted from number",
        value: 3808
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Cromwell of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 324
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3808"
  },
  3810: {
    name: "Shaded Spectre Beyna of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/3810",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Broom on Fire"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Transmuted from number",
        value: 3810
      },
      {
        trait_type: "Transmuted from",
        value: " Beyna of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 469
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3810"
  },
  3815: {
    name: "Ethereal Spectre Ozohr of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/3815",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3815
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Ozohr of the Morning Star"
      },
      {
        trait_type: "Burn order",
        value: 428
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3815"
  },
  3842: {
    name: "Wraith Devout Zubin of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/3842",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3842
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Zubin of the Fey"
      },
      {
        trait_type: "Burn order",
        value: 461
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3842"
  },
  3925: {
    name: "Fur Ghost Kalo of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/3925",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Furgnome Ghost"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Fox"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3925
      },
      {
        trait_type: "Transmuted from",
        value: "Stellar Mage Kalo of the Field"
      },
      {
        trait_type: "Burn order",
        value: 433
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3925"
  },
  3928: {
    name: "Wraith Deacon Caligari of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/3928",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3928
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Caligari of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 397
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3928"
  },
  3935: {
    name: "Hunted Stag Herne of the Abandoned Waste",
    image: "https://portal.forgottenrunes.com/api/souls/img/3935",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3935
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Herne of the Inferno"
      },
      {
        trait_type: "Burn order",
        value: 502
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3935"
  },
  3959: {
    name: "Lich Baron of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/3959",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Wolf Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3959
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer  of Cuckoo Land"
      },
      {
        trait_type: "Burn order",
        value: 616
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3959"
  },
  3962: {
    name: "Consumption Zombie Ofaris of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/3962",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Consumption Zombie"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 3962
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Ofaris of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 436
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3962"
  },
  3963: {
    name: "Ectoplasmic Spectre Amir of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/3963",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 3963
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Amir of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 111
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/3963"
  },
  4020: {
    name: "Blood Eater Revenant Amir of the Ectoplasmic Horizon",
    image: "https://portal.forgottenrunes.com/api/souls/img/4020",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4020
      },
      {
        trait_type: "Transmuted from",
        value: "Cryptomancer Amir of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 636
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4020"
  },
  4022: {
    name: "Rotten Revenant Merlon of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/4022",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Ghoul Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Owl"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4022
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Merlon of the River"
      },
      {
        trait_type: "Burn order",
        value: 726
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4022"
  },
  4026: {
    name: "Lewd Revenant Malthus of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/4026",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4026
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Malthus of Avalon"
      },
      {
        trait_type: "Burn order",
        value: 669
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4026"
  },
  4030: {
    name: "Grim Ghoul Zubin of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/4030",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4030
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Zubin of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 435
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4030"
  },
  4042: {
    name: "Canaanite Lord Moloch of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/4042",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Canaanite Skull"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Transmuted from number",
        value: 4042
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Moloch of Avalon"
      },
      {
        trait_type: "Burn order",
        value: 497
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4042"
  },
  4047: {
    name: "Ectoplasmic Spectre Basil of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/4047",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Transmuted from number",
        value: 4047
      },
      {
        trait_type: "Transmuted from",
        value: "Medium Basil of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 142
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4047"
  },
  4075: {
    name: "Gouged Revenant Armstrong of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/4075",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Affinity",
        value: "Revenant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4075
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Armstrong of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 254
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4075"
  },
  4094: {
    name: "Channel 1 Poltergeist Tengu of the Glowing Box",
    image: "https://portal.forgottenrunes.com/api/souls/img/4094",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4094
      },
      {
        trait_type: "Transmuted from",
        value: "Cleric Tengu of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 565
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4094"
  },
  4121: {
    name: "Pile of Bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/4121",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Pile of Bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 4121
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Udor of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 246
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4121"
  },
  4128: {
    name: "Lich Despot Florah of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/4128",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4128
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Florah of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 257
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4128"
  },
  4135: {
    name: "Horned Phantasm Auguste of the Impenetrable Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/4135",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4135
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Auguste of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 270
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4135"
  },
  4158: {
    name: "Wraith Knight Jabir of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/4158",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4158
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Jabir of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 56
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4158"
  },
  4170: {
    name: "Canaanite Lord Moloch of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/4170",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Canaanite Skull"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4170
      },
      {
        trait_type: "Transmuted from",
        value: "Void Disciple Moloch of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 116
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4170"
  },
  4206: {
    name: "Ethereal Spectre Aiko of the Hell Chamber",
    image: "https://portal.forgottenrunes.com/api/souls/img/4206",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Wilted Venus Flytrap"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4206
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Aiko of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 699
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4206"
  },
  4230: {
    name: "Blood Eater Revenant Alatar of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/4230",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4230
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Alatar of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 139
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4230"
  },
  4235: {
    name: "The Lich Emperor Supreme",
    image: "https://portal.forgottenrunes.com/api/souls/img/4235",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Supreme Emperor Lich Armor"
      },
      {
        trait_type: "Head",
        value: "Lich Emperor"
      },
      {
        trait_type: "Prop",
        value: "Reaping Hook"
      },
      {
        trait_type: "Affinity",
        value: "Emperor"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4235
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Orpheus of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 555
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4235"
  },
  4241: {
    name: "Cloud of Ectoplasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/4241",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Cloud of Ectoplasm"
      },
      {
        trait_type: "Transmuted from number",
        value: 4241
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Iprix of the Road"
      },
      {
        trait_type: "Burn order",
        value: 362
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4241"
  },
  4252: {
    name: "Golden Lich Zagan of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/4252",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Burned Gold Skeleton"
      },
      {
        trait_type: "Head",
        value: "Golden Lich"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Gold"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4252
      },
      {
        trait_type: "Transmuted from",
        value: "Void Disciple Zagan of the Catacombs"
      },
      {
        trait_type: "Burn order",
        value: 468
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4252"
  },
  4362: {
    name: "Red Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/4362",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Red Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 4362
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Moloch of Limbo"
      },
      {
        trait_type: "Burn order",
        value: 606
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4362"
  },
  4371: {
    name: "Lewd Revenant Layla of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/4371",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Infinity"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4371
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Layla of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 38
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4371"
  },
  4400: {
    name: "Rotten Revenant Celeste of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/4400",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4400
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Celeste of the Field"
      },
      {
        trait_type: "Burn order",
        value: 737
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4400"
  },
  4459: {
    name: "Shaded Spectre Baird of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/4459",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Charred Bone Stave"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4459
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Baird of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 217
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4459"
  },
  4463: {
    name: "Void Phantasm Sarah of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/4463",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Transmuted from number",
        value: 4463
      },
      {
        trait_type: "Transmuted from",
        value: "Cartomancer Sarah of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 46
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4463"
  },
  4464: {
    name: "Veiled Phantasm of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/4464",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4464
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus  of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 492
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4464"
  },
  4470: {
    name: "Rotten Revenant Jerret of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/4470",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Transmuted from number",
        value: 4470
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Jerret of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 530
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4470"
  },
  4483: {
    name: "Lich Despot Lamia of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/4483",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Monkey"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4483
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Lamia of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 306
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4483"
  },
  4496: {
    name: "Eggplant Ghost Meloogen of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/4496",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Veggie Ghost"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Transmuted from number",
        value: 4496
      },
      {
        trait_type: "Transmuted from",
        value: "Hydromancer Meloogen of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 704
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4496"
  },
  4509: {
    name: "Consumption Zombie Cairon of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/4509",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Consumption Zombie"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Pink"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4509
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Cairon of the River"
      },
      {
        trait_type: "Burn order",
        value: 678
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4509"
  },
  4513: {
    name: "Wooden Ghost Bobbin of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/4513",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Soul of Wooden Boy"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4513
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Bobbin of the Atheneum"
      },
      {
        trait_type: "Burn order",
        value: 73
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4513"
  },
  4517: {
    name: "Hunted Stag Umber of the Blur",
    image: "https://portal.forgottenrunes.com/api/souls/img/4517",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4517
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Umber of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 423
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4517"
  },
  4519: {
    name: "Blight Zombie Luther of the Shell",
    image: "https://portal.forgottenrunes.com/api/souls/img/4519",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4519
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Luther of Limbo"
      },
      {
        trait_type: "Burn order",
        value: 338
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4519"
  },
  4532: {
    name: "Lich Duke Jerret of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/4532",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Flaming Rose"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Lich"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4532
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Jerret of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 701
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4532"
  },
  4548: {
    name: "Wraith Deacon Alizam of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/4548",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4548
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Alizam of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 370
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4548"
  },
  4553: {
    name: "Consumption Zombie Eden ",
    image: "https://portal.forgottenrunes.com/api/souls/img/4553",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Consumption Zombie"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Pink"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4553
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Eden "
      },
      {
        trait_type: "Burn order",
        value: 65
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4553"
  },
  4567: {
    name: "Night Ghoul of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/4567",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Charred Pipe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Transmuted from number",
        value: 4567
      },
      {
        trait_type: "Transmuted from",
        value: "  of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 171
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4567"
  },
  4569: {
    name: "Dead Cat Nala of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/4569",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Felis Skull"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Down"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4569
      },
      {
        trait_type: "Transmuted from",
        value: "Chaos Mage Nala of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 334
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4569"
  },
  4605: {
    name: "Wooden Ghost Giacomo ",
    image: "https://portal.forgottenrunes.com/api/souls/img/4605",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Soul of Wooden Boy"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4605
      },
      {
        trait_type: "Transmuted from",
        value: "Summoner Giacomo "
      },
      {
        trait_type: "Burn order",
        value: 337
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4605"
  },
  4607: {
    name: "Holy Spectre Uvlius of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/4607",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Charred Bone Stave"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 4607
      },
      {
        trait_type: "Transmuted from",
        value: "Voodoo Priest Uvlius of the Astral Plane"
      },
      {
        trait_type: "Burn order",
        value: 196
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4607"
  },
  4608: {
    name: "Lecherous Ghoul Soya of Unparalleled Vulgarity",
    image: "https://portal.forgottenrunes.com/api/souls/img/4608",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4608
      },
      {
        trait_type: "Transmuted from",
        value: "Clairvoyant Soya of the Villa"
      },
      {
        trait_type: "Burn order",
        value: 730
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4608"
  },
  4613: {
    name: "Lich Marquis Homer of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/4613",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Transmuted from number",
        value: 4613
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Homer of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 522
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4613"
  },
  4623: {
    name: "Wraith Deacon Eden ",
    image: "https://portal.forgottenrunes.com/api/souls/img/4623",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4623
      },
      {
        trait_type: "Transmuted from",
        value: "Null Mage Eden "
      },
      {
        trait_type: "Burn order",
        value: 744
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4623"
  },
  4643: {
    name: "Canaanite Lord Oxnard of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/4643",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Canaanite Skull"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4643
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Oxnard of the River"
      },
      {
        trait_type: "Burn order",
        value: 697
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4643"
  },
  4651: {
    name: "Channel 3 Poltergeist Calista of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/4651",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4651
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Calista of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 724
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4651"
  },
  4653: {
    name: "Lecherous Ghoul Aiko of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/4653",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4653
      },
      {
        trait_type: "Transmuted from",
        value: "Ice Mage Aiko of the Ice"
      },
      {
        trait_type: "Burn order",
        value: 329
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4653"
  },
  4662: {
    name: "Necro Frog Kryll of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/4662",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Black Sun Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Frog"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4662
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Kryll of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 35
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4662"
  },
  4663: {
    name: "Hunted Stag Actaeon of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/4663",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4663
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Actaeon of the Thorn"
      },
      {
        trait_type: "Burn order",
        value: 646
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4663"
  },
  4665: {
    name: "Lich Marquis David of the Brimstone Havens",
    image: "https://portal.forgottenrunes.com/api/souls/img/4665",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Owl"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4665
      },
      {
        trait_type: "Transmuted from",
        value: " David of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 88
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4665"
  },
  4672: {
    name: "Wraith Deacon Cromwell of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/4672",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Ether Staff 2.0"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4672
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Cromwell of the Palms"
      },
      {
        trait_type: "Burn order",
        value: 322
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4672"
  },
  4689: {
    name: "Blood Eater Revenant David of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/4689",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Transmuted from number",
        value: 4689
      },
      {
        trait_type: "Transmuted from",
        value: " David of Xanadu"
      },
      {
        trait_type: "Burn order",
        value: 195
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4689"
  },
  4740: {
    name: "Channel 1 Poltergeist Milton of the Glowing Box",
    image: "https://portal.forgottenrunes.com/api/souls/img/4740",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Black Sun Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4740
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Milton of the Ether"
      },
      {
        trait_type: "Burn order",
        value: 479
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4740"
  },
  4748: {
    name: "Void Phantasm Miyo of Limbo",
    image: "https://portal.forgottenrunes.com/api/souls/img/4748",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Caped Ethereal Jumpsuit"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Transmuted from number",
        value: 4748
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Miyo of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 128
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4748"
  },
  4770: {
    name: "Wraith Knight Adrienne of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/4770",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4770
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Adrienne of the Carnival"
      },
      {
        trait_type: "Burn order",
        value: 731
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4770"
  },
  4792: {
    name: "Blight Zombie Seth of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/4792",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4792
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Seth of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 495
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4792"
  },
  4795: {
    name: "Green Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/4795",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Green Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 4795
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Giuseppe of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 120
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4795"
  },
  4799: {
    name: "Lewd Revenant Enigma of the Scum Barrel",
    image: "https://portal.forgottenrunes.com/api/souls/img/4799",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4799
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Enigma of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 735
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4799"
  },
  4802: {
    name: "Blood Eater Revenant Apollo of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/4802",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4802
      },
      {
        trait_type: "Transmuted from",
        value: "Spellsinger Apollo of the Waste"
      },
      {
        trait_type: "Burn order",
        value: 429
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4802"
  },
  4819: {
    name: "Malodorous Ghoul Borak of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/4819",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4819
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Borak of the Temple"
      },
      {
        trait_type: "Burn order",
        value: 660
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4819"
  },
  4829: {
    name: "Shaded Spectre Solomon of the Ectoplasmic Horizon",
    image: "https://portal.forgottenrunes.com/api/souls/img/4829",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4829
      },
      {
        trait_type: "Transmuted from",
        value: " Solomon of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 666
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4829"
  },
  4845: {
    name: "Wraith Devout Dante of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/4845",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Transmuted from number",
        value: 4845
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Dante of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 625
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4845"
  },
  4857: {
    name: "Veiled Phantasm of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/4857",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4857
      },
      {
        trait_type: "Transmuted from",
        value: "Holy Monk  of the Field"
      },
      {
        trait_type: "Burn order",
        value: 498
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4857"
  },
  4860: {
    name: "Skeleton of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/4860",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Imp Skull"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 4860
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician  of the Toadstools"
      },
      {
        trait_type: "Burn order",
        value: 700
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4860"
  },
  4865: {
    name: "Wraith Captain Aslan of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/4865",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4865
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Aslan of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 527
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4865"
  },
  4870: {
    name: "Shaded Spectre Nikolas of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/4870",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Ghoul Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4870
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Nikolas of the Havens"
      },
      {
        trait_type: "Burn order",
        value: 451
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4870"
  },
  4872: {
    name: "Veiled Phantasm Faye of the Blur",
    image: "https://portal.forgottenrunes.com/api/souls/img/4872",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4872
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Faye of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 265
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4872"
  },
  4874: {
    name: "Wraith Devout Jabir of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/4874",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4874
      },
      {
        trait_type: "Transmuted from",
        value: "Aeromancer Jabir of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 146
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4874"
  },
  4876: {
    name: "Wraith Knight Faye of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/4876",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4876
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Faye of the Quantum Downs"
      },
      {
        trait_type: "Burn order",
        value: 113
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4876"
  },
  4895: {
    name: "Shaded Spectre Nikolas of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/4895",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4895
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Nikolas in the Shadows"
      },
      {
        trait_type: "Burn order",
        value: 332
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4895"
  },
  4905: {
    name: "Void Phantasm Casper of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/4905",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Transmuted from number",
        value: 4905
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Casper of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 614
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4905"
  },
  4924: {
    name: "Pile of Blood and Guts",
    image: "https://portal.forgottenrunes.com/api/souls/img/4924",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Pile of Blood and Guts"
      },
      {
        trait_type: "Transmuted from number",
        value: 4924
      },
      {
        trait_type: "Transmuted from",
        value: "Conjurer Axis of Atlantis"
      },
      {
        trait_type: "Burn order",
        value: 685
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4924"
  },
  4937: {
    name: "Rotten Revenant Chiron of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/4937",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Golden Unihorn"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snail"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4937
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Chiron of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 742
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4937"
  },
  4944: {
    name: "Channel 3 Poltergeist Iprix of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/4944",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 4944
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Iprix of El Dorado"
      },
      {
        trait_type: "Burn order",
        value: 540
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4944"
  },
  4966: {
    name: "Rose on grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/4966",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Rose on grave"
      },
      {
        trait_type: "Transmuted from number",
        value: 4966
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Aamon of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 511
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/4966"
  },
  5028: {
    name: "Horned Phantasm Qasim of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/5028",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Inverted Horseshoe"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5028
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Qasim of the Mist"
      },
      {
        trait_type: "Burn order",
        value: 605
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5028"
  },
  5035: {
    name: "Holy Spectre Wizard Huizhong of the Asphodel Meadows",
    image: "https://portal.forgottenrunes.com/api/souls/img/5035",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Transmuted from number",
        value: 5035
      },
      {
        trait_type: "Transmuted from",
        value: "Wizard Huizhong of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 26
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5035"
  },
  5041: {
    name: "Gouged Revenant Merlon of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/5041",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Orange"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5041
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Merlon of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 172
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5041"
  },
  5050: {
    name: "Wraith Captain Udor of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/5050",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5050
      },
      {
        trait_type: "Transmuted from",
        value: "Cleric Udor out of the Blizzard"
      },
      {
        trait_type: "Burn order",
        value: 507
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5050"
  },
  5051: {
    name: "Channel 1 Poltergeist Iprix of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/5051",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Quantum Key"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Transmuted from number",
        value: 5051
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Iprix of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 723
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5051"
  },
  5055: {
    name: "Void Phantasm Asmodeus of the Ether Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/5055",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5055
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Asmodeus of the Pit"
      },
      {
        trait_type: "Burn order",
        value: 534
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5055"
  },
  5064: {
    name: "Putrid Zombie Salvatore of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/5064",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5064
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Salvatore of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 412
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5064"
  },
  5068: {
    name: "Wraith Devout Zhan of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/5068",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5068
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Zhan of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 383
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5068"
  },
  5075: {
    name: "Rose on grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/5075",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Rose on grave"
      },
      {
        trait_type: "Transmuted from number",
        value: 5075
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Nolan of the Carnival"
      },
      {
        trait_type: "Burn order",
        value: 670
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5075"
  },
  5137: {
    name: "Blood Eater Revenant Amir of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/5137",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Transmuted from number",
        value: 5137
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Amir of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 590
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5137"
  },
  5140: {
    name: "Ethereal Spectre Basil of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/5140",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5140
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Basil of the Berg"
      },
      {
        trait_type: "Burn order",
        value: 176
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5140"
  },
  5208: {
    name: "Wraith Devout Zagan of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/5208",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Affinity",
        value: "Wraith"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5208
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Zagan of Avalon"
      },
      {
        trait_type: "Burn order",
        value: 3
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5208"
  },
  5224: {
    name: "Ethereal Spectre Adium of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/5224",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5224
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Adium of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 193
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5224"
  },
  5232: {
    name: "Horned Phantasm Aleister of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/5232",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5232
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Aleister of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 126
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5232"
  },
  5233: {
    name: "Brown Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/5233",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Brown Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 5233
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Caligula of Mu"
      },
      {
        trait_type: "Burn order",
        value: 505
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5233"
  },
  5271: {
    name: "Lich Baron Victoria of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/5271",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5271
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Victoria of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 667
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5271"
  },
  5320: {
    name: "Skeleton Kalo of the Haze",
    image: "https://portal.forgottenrunes.com/api/souls/img/5320",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Imp Skull"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5320
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Kalo of the River"
      },
      {
        trait_type: "Burn order",
        value: 500
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5320"
  },
  5325: {
    name: "Channel 3 Poltergeist Milton ",
    image: "https://portal.forgottenrunes.com/api/souls/img/5325",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5325
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Milton "
      },
      {
        trait_type: "Burn order",
        value: 384
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5325"
  },
  5331: {
    name: "Lich Despot Amir of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/5331",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Transmuted from number",
        value: 5331
      },
      {
        trait_type: "Transmuted from",
        value: " Amir of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 340
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5331"
  },
  5343: {
    name: "Rotten Revenant Borak of the Fetid Fire",
    image: "https://portal.forgottenrunes.com/api/souls/img/5343",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5343
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Borak of Avalon"
      },
      {
        trait_type: "Burn order",
        value: 471
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5343"
  },
  5348: {
    name: "Rotten Revenant Bayard of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/5348",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5348
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Bayard of the Psychic Leap"
      },
      {
        trait_type: "Burn order",
        value: 536
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5348"
  },
  5349: {
    name: "Death Shroom Buttons of the Machine",
    image: "https://portal.forgottenrunes.com/api/souls/img/5349",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Inverted Horseshoe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5349
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Buttons of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 112
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5349"
  },
  5352: {
    name: "Lich Marquis Arabella of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/5352",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5352
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Arabella of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 641
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5352"
  },
  5358: {
    name: "Gangrenous Zombie Solomon of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/5358",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5358
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Solomon of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 477
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5358"
  },
  5376: {
    name: "Grape Jelly Donut",
    image: "https://portal.forgottenrunes.com/api/souls/img/5376",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Grape Jelly Donut"
      },
      {
        trait_type: "Transmuted from number",
        value: 5376
      },
      {
        trait_type: "Transmuted from",
        value: " Nikolas of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 548
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5376"
  },
  5404: {
    name: "Ectoplasmic Spectre Dario of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/5404",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 5404
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Dario of El Dorado"
      },
      {
        trait_type: "Burn order",
        value: 162
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5404"
  },
  5423: {
    name: "Lecherous Ghoul Arabella of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/5423",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Harp"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5423
      },
      {
        trait_type: "Transmuted from",
        value: "Spellsinger Arabella of Limbo"
      },
      {
        trait_type: "Burn order",
        value: 662
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5423"
  },
  5425: {
    name: "Blood Eater Revenant Diana of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/5425",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5425
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Diana of the Reach"
      },
      {
        trait_type: "Burn order",
        value: 599
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5425"
  },
  5439: {
    name: "Grave Robbing Kobold Pix of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/5439",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Kobold Skull"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5439
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Pix of the Mountain"
      },
      {
        trait_type: "Burn order",
        value: 673
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5439"
  },
  5455: {
    name: "Blood Eater Revenant Ozohr of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/5455",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Death"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5455
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Ozohr of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 472
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5455"
  },
  5462: {
    name: "Wraith Captain Zaim of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/5462",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5462
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Zaim of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 396
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5462"
  },
  5467: {
    name: "Wraith Captain Taqi of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/5467",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5467
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Taqi of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 207
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5467"
  },
  5469: {
    name: "Wraith Knight Angus of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/5469",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Transmuted from number",
        value: 5469
      },
      {
        trait_type: "Transmuted from",
        value: "Ice Mage Angus of the Ice"
      },
      {
        trait_type: "Burn order",
        value: 686
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5469"
  },
  5497: {
    name: "Lewd Revenant Ophelia of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/5497",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5497
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Ophelia of the Arctic"
      },
      {
        trait_type: "Burn order",
        value: 567
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5497"
  },
  5516: {
    name: "Transcendent Illuminatus Providence of the Impenetrable Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/5516",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Transcendent Illuminatus"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5516
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Providence of the North"
      },
      {
        trait_type: "Burn order",
        value: 198
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5516"
  },
  5528: {
    name: "Skeleton Duzzle of Gross Gorge",
    image: "https://portal.forgottenrunes.com/api/souls/img/5528",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Imp Skull"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Wolf Skeleton"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5528
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Duzzle of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 214
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5528"
  },
  5530: {
    name: "Shaded Spectre of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/5530",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Hamlet's Skull"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Shade"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5530
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer  of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 443
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5530"
  },
  5539: {
    name: "Blight Zombie Azahl of the Bubonic Beaches",
    image: "https://portal.forgottenrunes.com/api/souls/img/5539",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Transmuted from number",
        value: 5539
      },
      {
        trait_type: "Transmuted from",
        value: "Chaos Mage Azahl of the Loch"
      },
      {
        trait_type: "Burn order",
        value: 79
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5539"
  },
  5588: {
    name: "Blue Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/5588",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Undesirable",
        value: "Blue Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 5588
      },
      {
        trait_type: "Transmuted from",
        value: " Maia of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 192
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5588"
  },
  5595: {
    name: "Shaded Spectre Delilah of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/5595",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5595
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Delilah of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 328
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5595"
  },
  5614: {
    name: "Hell Wolf Gorg of the Paranormal",
    image: "https://portal.forgottenrunes.com/api/souls/img/5614",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Wolfkin Skull"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Transmuted from number",
        value: 5614
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Gorg of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 596
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5614"
  },
  5629: {
    name: "Yellow Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/5629",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Yellow Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 5629
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Uvlius of the Field"
      },
      {
        trait_type: "Burn order",
        value: 16
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5629"
  },
  5639: {
    name: "Channel 3 Poltergeist Aleister of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/5639",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5639
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Aleister of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 240
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5639"
  },
  5647: {
    name: "Wraith Deacon Nazim of the Abandoned Waste",
    image: "https://portal.forgottenrunes.com/api/souls/img/5647",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Inverted Horseshoe"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5647
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Nazim of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 381
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5647"
  },
  5659: {
    name: "Marie Laveau",
    image: "https://portal.forgottenrunes.com/api/souls/img/5659",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Fortune Telling Robes"
      },
      {
        trait_type: "Head",
        value: "Marie Laveau"
      },
      {
        trait_type: "Prop",
        value: "Marie's Candle"
      },
      {
        trait_type: "Familiar",
        value: "Python"
      },
      {
        trait_type: "Affinity",
        value: "Voodoo"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5659
      },
      {
        trait_type: "Transmuted from",
        value: "Evoker Angus of the Fey"
      },
      {
        trait_type: "Burn order",
        value: 388
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5659"
  },
  5663: {
    name: "Gangrenous Zombie Onaxx of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/5663",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5663
      },
      {
        trait_type: "Transmuted from",
        value: "Transmuter Onaxx of the Havens"
      },
      {
        trait_type: "Burn order",
        value: 358
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5663"
  },
  5702: {
    name: "Ghost Flame Burnside of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/5702",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Ghost Flame"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Owl"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5702
      },
      {
        trait_type: "Transmuted from",
        value: "Battlemage Burnside of Mu"
      },
      {
        trait_type: "Burn order",
        value: 578
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5702"
  },
  5710: {
    name: "Lich Duke Axel of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/5710",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 5710
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Axel of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 66
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5710"
  },
  5732: {
    name: "Necro Frog Sharx of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/5732",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Transmuted from number",
        value: 5732
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Sharx of Alfheim"
      },
      {
        trait_type: "Burn order",
        value: 690
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5732"
  },
  5733: {
    name: "Paranormal Phantasm Bartholomew of the Abandoned Waste",
    image: "https://portal.forgottenrunes.com/api/souls/img/5733",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5733
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Bartholomew of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 741
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5733"
  },
  5759: {
    name: "Wild Zombie Nolan of Limbo",
    image: "https://portal.forgottenrunes.com/api/souls/img/5759",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Entropy Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5759
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Nolan of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 100
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5759"
  },
  5763: {
    name: "Wild Zombie Cromwell of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/5763",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Transmuted from number",
        value: 5763
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Cromwell of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 305
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5763"
  },
  5766: {
    name: "Tulip on grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/5766",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Undesirable",
        value: "Tulip on grave"
      },
      {
        trait_type: "Transmuted from number",
        value: 5766
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Devon of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 13
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5766"
  },
  5767: {
    name: "Wraith Knight George of the Fetid Fire",
    image: "https://portal.forgottenrunes.com/api/souls/img/5767",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5767
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus George of the Oasis"
      },
      {
        trait_type: "Burn order",
        value: 67
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5767"
  },
  5805: {
    name: "Holy Spectre David of the ???",
    image: "https://portal.forgottenrunes.com/api/souls/img/5805",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Fox Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Spectre"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5805
      },
      {
        trait_type: "Transmuted from",
        value: "Wild Mage David of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 267
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5805"
  },
  5837: {
    name: "Ectoplasm Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/5837",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Ectoplasm Mist"
      },
      {
        trait_type: "Transmuted from number",
        value: 5837
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Angus of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 236
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5837"
  },
  5848: {
    name: "Canaanite Lord Bullock of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/5848",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Canaanite Skull"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 5848
      },
      {
        trait_type: "Transmuted from",
        value: "Conjurer Bullock of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 584
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5848"
  },
  5850: {
    name: "Lich Baron Dr. Death of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/5850",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Regal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5850
      },
      {
        trait_type: "Transmuted from",
        value: "Void Disciple Dr. Death of the River"
      },
      {
        trait_type: "Burn order",
        value: 118
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5850"
  },
  5852: {
    name: "Death Shroom Amanita of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/5852",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Transmuted from number",
        value: 5852
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Amanita of the Reach"
      },
      {
        trait_type: "Burn order",
        value: 310
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5852"
  },
  5907: {
    name: "Blood Eater Revenant Adrienne of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/5907",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Ghoul Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Ghoul"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5907
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Adrienne of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 239
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5907"
  },
  5914: {
    name: "Horned Phantasm Brutus of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/5914",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5914
      },
      {
        trait_type: "Transmuted from",
        value: "Bard Brutus of the Astral Plane"
      },
      {
        trait_type: "Burn order",
        value: 691
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5914"
  },
  5922: {
    name: "Holy Spectre Darick of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/5922",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5922
      },
      {
        trait_type: "Transmuted from",
        value: "Cleric Darick of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 739
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5922"
  },
  5960: {
    name: "Necro Frog Helix of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/5960",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 5960
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Helix of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 437
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5960"
  },
  5971: {
    name: "Horned Phantasm Hecate of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/5971",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5971
      },
      {
        trait_type: "Transmuted from",
        value: "Spellsinger Hecate of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 167
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5971"
  },
  5998: {
    name: "Rotten Revenant Qasim of the Bubonic Beaches",
    image: "https://portal.forgottenrunes.com/api/souls/img/5998",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 5998
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Qasim of the Field"
      },
      {
        trait_type: "Burn order",
        value: 143
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/5998"
  },
  6006: {
    name: "Lewd Revenant Hagar of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/6006",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6006
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Hagar of the Wild"
      },
      {
        trait_type: "Burn order",
        value: 259
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6006"
  },
  6010: {
    name: "Blight Zombie Angus of the Severed Innocence",
    image: "https://portal.forgottenrunes.com/api/souls/img/6010",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6010
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Angus of the Bastion"
      },
      {
        trait_type: "Burn order",
        value: 569
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6010"
  },
  6016: {
    name: "Shaded Spectre Axel of the XYZ",
    image: "https://portal.forgottenrunes.com/api/souls/img/6016",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6016
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Axel of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 508
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6016"
  },
  6031: {
    name: "Blood Eater Revenant of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/6031",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Transmuted from number",
        value: 6031
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist  of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 75
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6031"
  },
  6036: {
    name: "Lich Marquis Vossler of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/6036",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6036
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Vossler of the Atheneum"
      },
      {
        trait_type: "Burn order",
        value: 391
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6036"
  },
  6044: {
    name: "Angelic Dotta",
    image: "https://portal.forgottenrunes.com/api/souls/img/6044",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Angelic Robe"
      },
      {
        trait_type: "Head",
        value: "Angelic Dotta"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Harp"
      },
      {
        trait_type: "Affinity",
        value: "Angel"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6044
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Dotta of the Carnival"
      },
      {
        trait_type: "Burn order",
        value: 424
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6044"
  },
  6054: {
    name: "Putrid Zombie Ariadne of the Scum Barrel",
    image: "https://portal.forgottenrunes.com/api/souls/img/6054",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6054
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Ariadne of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 131
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6054"
  },
  6056: {
    name: "Paranormal Phantasm Iprix of the Hell Chamber",
    image: "https://portal.forgottenrunes.com/api/souls/img/6056",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6056
      },
      {
        trait_type: "Transmuted from",
        value: " Iprix of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 307
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6056"
  },
  6076: {
    name: "Lich Baron Qasim of the Valley of the Void Desciple",
    image: "https://portal.forgottenrunes.com/api/souls/img/6076",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6076
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Qasim of the Mountain"
      },
      {
        trait_type: "Burn order",
        value: 438
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6076"
  },
  6112: {
    name: "Blight Zombie Wizard Lin of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/6112",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6112
      },
      {
        trait_type: "Transmuted from",
        value: "Wizard Lin of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 538
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6112"
  },
  6137: {
    name: "Blight Zombie Eronin of the Bubonic Beaches",
    image: "https://portal.forgottenrunes.com/api/souls/img/6137",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Infinity"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6137
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Eronin of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 288
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6137"
  },
  6147: {
    name: "Gangrenous Zombie Rowena of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/6147",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Down"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6147
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Rowena of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 68
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6147"
  },
  6155: {
    name: "Lecherous Ghoul Pumlo of Carnal Delights",
    image: "https://portal.forgottenrunes.com/api/souls/img/6155",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6155
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Pumlo of Xanadu"
      },
      {
        trait_type: "Burn order",
        value: 676
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6155"
  },
  6163: {
    name: "Channel 3 Poltergeist Arabella of the Asphodel Meadows",
    image: "https://portal.forgottenrunes.com/api/souls/img/6163",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Transmuted from number",
        value: 6163
      },
      {
        trait_type: "Transmuted from",
        value: "Augurer Arabella of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 560
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6163"
  },
  6167: {
    name: "Hunted Stag Devin of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/6167",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6167
      },
      {
        trait_type: "Transmuted from",
        value: "Hydromancer Devin of the Salt"
      },
      {
        trait_type: "Burn order",
        value: 369
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6167"
  },
  6223: {
    name: "Lich Despot Orlando of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/6223",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6223
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Orlando of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 572
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6223"
  },
  6225: {
    name: "Paranormal Phantasm Ekmira of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/6225",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6225
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Ekmira of the Sands"
      },
      {
        trait_type: "Burn order",
        value: 385
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6225"
  },
  6234: {
    name: "Lich Despot Pandora of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/6234",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6234
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Pandora of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 639
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6234"
  },
  6241: {
    name: "Blood Eater Revenant Nolan of the Static Snow",
    image: "https://portal.forgottenrunes.com/api/souls/img/6241",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6241
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Nolan of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 210
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6241"
  },
  6247: {
    name: "Horned Phantasm Milton of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/6247",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6247
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Milton of the Event Horizon"
      },
      {
        trait_type: "Burn order",
        value: 601
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6247"
  },
  6248: {
    name: "Channel 3 Poltergeist Solomon of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/6248",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6248
      },
      {
        trait_type: "Transmuted from",
        value: "Ice Mage Solomon of the Tundra"
      },
      {
        trait_type: "Burn order",
        value: 304
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6248"
  },
  6283: {
    name: "White Lady",
    image: "https://portal.forgottenrunes.com/api/souls/img/6283",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "White Chiffon"
      },
      {
        trait_type: "Head",
        value: "Jane Doe"
      },
      {
        trait_type: "Prop",
        value: "White Skull"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6283
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Delilah of the Wild"
      },
      {
        trait_type: "Burn order",
        value: 564
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6283"
  },
  6303: {
    name: "Wraith Deacon Seth of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/6303",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6303
      },
      {
        trait_type: "Transmuted from",
        value: "Cryptomancer Seth of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 145
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6303"
  },
  6308: {
    name: "Green Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/6308",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Green Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 6308
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Eden of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 321
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6308"
  },
  6311: {
    name: "Lecherous Ghoul Nolan of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/6311",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Transmuted from number",
        value: 6311
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Nolan of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 561
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6311"
  },
  6328: {
    name: "Veiled Phantasm Lenora of the Haze",
    image: "https://portal.forgottenrunes.com/api/souls/img/6328",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6328
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Lenora of the Dunes"
      },
      {
        trait_type: "Burn order",
        value: 655
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6328"
  },
  6335: {
    name: "Wraith Devout Duzzle of the Spooklight",
    image: "https://portal.forgottenrunes.com/api/souls/img/6335",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6335
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Duzzle of Mu"
      },
      {
        trait_type: "Burn order",
        value: 520
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6335"
  },
  6355: {
    name: "Raspberry Jelly Donut",
    image: "https://portal.forgottenrunes.com/api/souls/img/6355",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Raspberry Jelly Donut"
      },
      {
        trait_type: "Transmuted from number",
        value: 6355
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Sahir of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 410
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6355"
  },
  6359: {
    name: "Wraith Captain Nolan of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/6359",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Charred Pipe"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6359
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Nolan of the Cold"
      },
      {
        trait_type: "Burn order",
        value: 11
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6359"
  },
  6386: {
    name: "Ethereal Spectre Zelroth of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/6386",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Black Sun Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6386
      },
      {
        trait_type: "Transmuted from",
        value: "Cosmic Mage Zelroth of Elysium"
      },
      {
        trait_type: "Burn order",
        value: 728
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6386"
  },
  6395: {
    name: "Wraith Knight Rafiq of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/6395",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Death Adder Rod"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Snake"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6395
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Rafiq of Mu"
      },
      {
        trait_type: "Burn order",
        value: 160
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6395"
  },
  6399: {
    name: "3-Eye Necromancer Milo of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/6399",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Sash"
      },
      {
        trait_type: "Head",
        value: "Braindrain Skull"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6399
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Milo of the Light"
      },
      {
        trait_type: "Burn order",
        value: 152
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6399"
  },
  6433: {
    name: "Total Void of Absolute Nothingness",
    image: "https://portal.forgottenrunes.com/api/souls/img/6433",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Total Void of Absolute Nothingness"
      },
      {
        trait_type: "Transmuted from number",
        value: 6433
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Jabir of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 299
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6433"
  },
  6472: {
    name: "Houngan Necromancer Lucien of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/6472",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6472
      },
      {
        trait_type: "Transmuted from",
        value: "Thaumaturge Lucien of the Citadel"
      },
      {
        trait_type: "Burn order",
        value: 736
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6472"
  },
  6489: {
    name: "Wraith Devout Remus of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/6489",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6489
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Remus of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 541
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6489"
  },
  6493: {
    name: "Wraith Deacon Lenora of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/6493",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6493
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Lenora of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 295
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6493"
  },
  6495: {
    name: "Void Phantasm Homer of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/6495",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Void"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6495
      },
      {
        trait_type: "Transmuted from",
        value: "Hydromancer Homer of the River"
      },
      {
        trait_type: "Burn order",
        value: 563
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6495"
  },
  6503: {
    name: "Necro Frog Nixie of the Shell",
    image: "https://portal.forgottenrunes.com/api/souls/img/6503",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6503
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Nixie of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 623
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6503"
  },
  6518: {
    name: "Wraith Devout Baird of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/6518",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6518
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Baird of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 355
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6518"
  },
  6520: {
    name: "Pile of Blood and Guts",
    image: "https://portal.forgottenrunes.com/api/souls/img/6520",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Pile of Blood and Guts"
      },
      {
        trait_type: "Transmuted from number",
        value: 6520
      },
      {
        trait_type: "Transmuted from",
        value: "Thaumaturge Jerret of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 92
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6520"
  },
  6522: {
    name: "Wraith Knight Drusilla of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/6522",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Bugbear's Flame: the Discombobulation Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Wraith"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6522
      },
      {
        trait_type: "Transmuted from",
        value: "Cosmic Mage Drusilla of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 485
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6522"
  },
  6527: {
    name: "Blight Zombie Eden of the Asphodel Meadows",
    image: "https://portal.forgottenrunes.com/api/souls/img/6527",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 6527
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Eden of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 487
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6527"
  },
  6532: {
    name: "Death Crow Crowley of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/6532",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Corvid Skull"
      },
      {
        trait_type: "Prop",
        value: "Entropy Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Cockatrice"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Wraith"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6532
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Crowley of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 282
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6532"
  },
  6536: {
    name: "Ghost Flame Embrose of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/6536",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Ghost Flame"
      },
      {
        trait_type: "Prop",
        value: "Ghoul Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Cockatrice Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Ghoul"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6536
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Embrose of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 84
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6536"
  },
  6625: {
    name: "Wraith Knight Rafiq of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/6625",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6625
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Rafiq of the Toadstools"
      },
      {
        trait_type: "Burn order",
        value: 72
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6625"
  },
  6629: {
    name: "Wraith Knight Setsuko of the Spooklight",
    image: "https://portal.forgottenrunes.com/api/souls/img/6629",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6629
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Setsuko of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 604
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6629"
  },
  6636: {
    name: "Lecherous Ghoul Damien of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/6636",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6636
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Damien of the Field"
      },
      {
        trait_type: "Burn order",
        value: 713
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6636"
  },
  6641: {
    name: "Wraith Knight Rita of the Abandoned Waste",
    image: "https://portal.forgottenrunes.com/api/souls/img/6641",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6641
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Rita of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 346
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6641"
  },
  6642: {
    name: "Ectoplasmic Spectre Thana of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/6642",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6642
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Thana of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 345
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6642"
  },
  6646: {
    name: "Grape Jelly Donut",
    image: "https://portal.forgottenrunes.com/api/souls/img/6646",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Undesirable",
        value: "Grape Jelly Donut"
      },
      {
        trait_type: "Transmuted from number",
        value: 6646
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Hagar of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 344
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6646"
  },
  6652: {
    name: "Wild Zombie Angus of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/6652",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6652
      },
      {
        trait_type: "Transmuted from",
        value: "Diviner Angus of the Bastion"
      },
      {
        trait_type: "Burn order",
        value: 727
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6652"
  },
  6654: {
    name: "Wraith Captain Soya of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/6654",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6654
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Soya of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 129
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6654"
  },
  6673: {
    name: "Hunted Stag Epher of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/6673",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Owl"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6673
      },
      {
        trait_type: "Transmuted from",
        value: "Illusionist Epher of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 98
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6673"
  },
  6676: {
    name: "Red Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/6676",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Red Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 6676
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Edge of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 95
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6676"
  },
  6688: {
    name: "Lich Duke Gwendolin of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/6688",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Transmuted from number",
        value: 6688
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Gwendolin of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 447
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6688"
  },
  6712: {
    name: "Ashpile with bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/6712",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile with bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 6712
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Dante of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 223
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6712"
  },
  6723: {
    name: "Blight Zombie Ofaris of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/6723",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Vile of Vomit"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Disgusting"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6723
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Ofaris of Elysium"
      },
      {
        trait_type: "Burn order",
        value: 70
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6723"
  },
  6724: {
    name: "Void Phantasm Hothor of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/6724",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6724
      },
      {
        trait_type: "Transmuted from",
        value: "Clairvoyant Hothor of Mu"
      },
      {
        trait_type: "Burn order",
        value: 206
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6724"
  },
  6757: {
    name: "Rotten Revenant Ixar of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/6757",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Charred Pipe"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Revenant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6757
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Ixar of the Palms"
      },
      {
        trait_type: "Burn order",
        value: 199
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6757"
  },
  6759: {
    name: "Masque of the Red Death",
    image: "https://portal.forgottenrunes.com/api/souls/img/6759",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Red Death Cape"
      },
      {
        trait_type: "Head",
        value: "The Masque"
      },
      {
        trait_type: "Prop",
        value: "Staff of Red Death"
      },
      {
        trait_type: "Familiar",
        value: "Plague Rat of Red Death"
      },
      {
        trait_type: "Affinity",
        value: "Death"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "4"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6759
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Gwendolin of the North"
      },
      {
        trait_type: "Burn order",
        value: 651
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6759"
  },
  6769: {
    name: "Wraith Deacon Zaim of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/6769",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6769
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Zaim of the Road"
      },
      {
        trait_type: "Burn order",
        value: 7
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6769"
  },
  6810: {
    name: "Holy Spectre Artis of the XYZ",
    image: "https://portal.forgottenrunes.com/api/souls/img/6810",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6810
      },
      {
        trait_type: "Transmuted from",
        value: " Artis of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 154
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6810"
  },
  6820: {
    name: "Ectoplasmic Spectre Lilith of the Fetid Ruins",
    image: "https://portal.forgottenrunes.com/api/souls/img/6820",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6820
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Lilith of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 725
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6820"
  },
  6821: {
    name: "Shaded Spectre Pierre of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/6821",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6821
      },
      {
        trait_type: "Transmuted from",
        value: "Battlemage Pierre of the Inferno"
      },
      {
        trait_type: "Burn order",
        value: 677
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6821"
  },
  6824: {
    name: "Wraith Knight Zeromus of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/6824",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Spectre Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Wraith"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6824
      },
      {
        trait_type: "Transmuted from",
        value: "Void Disciple Zeromus of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 121
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6824"
  },
  6830: {
    name: "Holy Spectre Shigenjo of the Ectoplasmic Downs",
    image: "https://portal.forgottenrunes.com/api/souls/img/6830",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Broom on Fire"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6830
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Shigenjo of the Event Horizon"
      },
      {
        trait_type: "Burn order",
        value: 488
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6830"
  },
  6836: {
    name: "Veiled Phantasm Bayard of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/6836",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6836
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Bayard of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 178
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6836"
  },
  6847: {
    name: "Ghost Orb",
    image: "https://portal.forgottenrunes.com/api/souls/img/6847",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Ghost Orb"
      },
      {
        trait_type: "Transmuted from number",
        value: 6847
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Lumos of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 268
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6847"
  },
  6853: {
    name: "Wraith Deacon Wazir of the Haze",
    image: "https://portal.forgottenrunes.com/api/souls/img/6853",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6853
      },
      {
        trait_type: "Transmuted from",
        value: "Summoner Wazir of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 671
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6853"
  },
  6855: {
    name: "Cloud of Ectoplasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/6855",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Cloud of Ectoplasm"
      },
      {
        trait_type: "Transmuted from number",
        value: 6855
      },
      {
        trait_type: "Transmuted from",
        value: "Evoker Finn from the Abyss"
      },
      {
        trait_type: "Burn order",
        value: 427
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6855"
  },
  6856: {
    name: "Eggplant Ghost Eggplant of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/6856",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Veggie Ghost"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6856
      },
      {
        trait_type: "Transmuted from",
        value: "Illusionist Eggplant of Cuckoo Land"
      },
      {
        trait_type: "Burn order",
        value: 43
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6856"
  },
  6858: {
    name: "Lich Marquis Ariadne of the Asphodel Meadows",
    image: "https://portal.forgottenrunes.com/api/souls/img/6858",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6858
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Ariadne of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 179
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6858"
  },
  6876: {
    name: "Malodorous Ghoul Aleister of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/6876",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Disease"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6876
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Aleister of Tartarus"
      },
      {
        trait_type: "Burn order",
        value: 245
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6876"
  },
  6877: {
    name: "Horned Phantasm Luther of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/6877",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6877
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Luther of the Circle"
      },
      {
        trait_type: "Burn order",
        value: 77
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6877"
  },
  6878: {
    name: "Consumption Zombie Ofaris of the Fetid Fire",
    image: "https://portal.forgottenrunes.com/api/souls/img/6878",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Consumption Zombie"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Affinity",
        value: "Disgusting"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6878
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Ofaris of the Belfry"
      },
      {
        trait_type: "Burn order",
        value: 150
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6878"
  },
  6891: {
    name: "Channel 3 Poltergeist Elena of the Royal Wretch",
    image: "https://portal.forgottenrunes.com/api/souls/img/6891",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6891
      },
      {
        trait_type: "Transmuted from",
        value: "Bard Elena of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 197
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6891"
  },
  6930: {
    name: "Lich Baron Jasper of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/6930",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Disgusting"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6930
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Jasper of the Brine"
      },
      {
        trait_type: "Burn order",
        value: 58
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6930"
  },
  6938: {
    name: "Lewd Revenant Eden of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/6938",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6938
      },
      {
        trait_type: "Transmuted from",
        value: "Battlemage Eden out of the Blizzard"
      },
      {
        trait_type: "Burn order",
        value: 650
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6938"
  },
  6951: {
    name: "Ashpile",
    image: "https://portal.forgottenrunes.com/api/souls/img/6951",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile"
      },
      {
        trait_type: "Transmuted from number",
        value: 6951
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Talon of the Isle"
      },
      {
        trait_type: "Burn order",
        value: 674
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6951"
  },
  6973: {
    name: "Gangrenous Zombie Thana of the Plague Lands",
    image: "https://portal.forgottenrunes.com/api/souls/img/6973",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Orange"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6973
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Thana of the Reach"
      },
      {
        trait_type: "Burn order",
        value: 300
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6973"
  },
  6993: {
    name: "Paranormal Phantasm Sondra of the Fuliginous Fog",
    image: "https://portal.forgottenrunes.com/api/souls/img/6993",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 6993
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Sondra of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 529
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/6993"
  },
  7002: {
    name: "Veiled Phantasm Devon of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/7002",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Entropy Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7002
      },
      {
        trait_type: "Transmuted from",
        value: "Hex Mage Devon of the Road"
      },
      {
        trait_type: "Burn order",
        value: 283
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7002"
  },
  7005: {
    name: "Horned Phantasm Caligula of the Smell",
    image: "https://portal.forgottenrunes.com/api/souls/img/7005",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Fox"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7005
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Caligula of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 554
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7005"
  },
  7019: {
    name: "Golden Lich Azazel of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/7019",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Golden Lich"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Crimson"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7019
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Azazel of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 513
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7019"
  },
  7031: {
    name: "Ashpile with bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/7031",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile with bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 7031
      },
      {
        trait_type: "Transmuted from",
        value: " Isaac of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 603
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7031"
  },
  7033: {
    name: "Ectoplasm Goop",
    image: "https://portal.forgottenrunes.com/api/souls/img/7033",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Ectoplasm Goop"
      },
      {
        trait_type: "Transmuted from number",
        value: 7033
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Cairon of the Toadstools"
      },
      {
        trait_type: "Burn order",
        value: 99
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7033"
  },
  7088: {
    name: "Wraith Knight Bayard of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/7088",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7088
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Bayard of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 460
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7088"
  },
  7096: {
    name: "Horned Phantasm Zelroth of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/7096",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7096
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Zelroth of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 249
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7096"
  },
  7127: {
    name: "Grave Robbing Kobold Bumble of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/7127",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Kobold Skull"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7127
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Bumble of the Bibliotheca"
      },
      {
        trait_type: "Burn order",
        value: 183
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7127"
  },
  7136: {
    name: "Lewd Revenant Angus of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/7136",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7136
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Angus of the Secret Fire"
      },
      {
        trait_type: "Burn order",
        value: 21
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7136"
  },
  7147: {
    name: "Ashpile with bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/7147",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile with bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 7147
      },
      {
        trait_type: "Transmuted from",
        value: " Celah of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 483
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7147"
  },
  7159: {
    name: "Lewd Revenant Tengukensei of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/7159",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7159
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Tengukensei of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 286
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7159"
  },
  7186: {
    name: "Gangrenous Zombie Ofaris of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/7186",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Disgusting"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7186
      },
      {
        trait_type: "Transmuted from",
        value: " Ofaris of the Circle"
      },
      {
        trait_type: "Burn order",
        value: 542
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7186"
  },
  7223: {
    name: "Horned Phantasm Gellert of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/7223",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7223
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Gellert of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 631
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7223"
  },
  7226: {
    name: "Golden Lich Anton of Pandemonium",
    image: "https://portal.forgottenrunes.com/api/souls/img/7226",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Golden Lich"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Cockatrice"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 7226
      },
      {
        trait_type: "Transmuted from",
        value: "Necromancer Anton of the Fey"
      },
      {
        trait_type: "Burn order",
        value: 450
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7226"
  },
  7245: {
    name: "Horned Phantasm Aldus of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/7245",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7245
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Aldus of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 253
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7245"
  },
  7270: {
    name: "Holy Spectre Oberon of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/7270",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7270
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Oberon of the Citadel"
      },
      {
        trait_type: "Burn order",
        value: 449
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7270"
  },
  7273: {
    name: "Lich Despot Wolfram of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/7273",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Death"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7273
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Wolfram of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 32
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7273"
  },
  7274: {
    name: "Grim Reaper",
    image: "https://portal.forgottenrunes.com/api/souls/img/7274",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Reaper Robe"
      },
      {
        trait_type: "Head",
        value: "Grim Reaper's Skull"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Affinity",
        value: "Grim"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7274
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Pino of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 185
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7274"
  },
  7309: {
    name: "Holy Spectre Aldo of the XYZ",
    image: "https://portal.forgottenrunes.com/api/souls/img/7309",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7309
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Aldo of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 399
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7309"
  },
  7312: {
    name: "Gouged Revenant Jasper of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/7312",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Blood"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7312
      },
      {
        trait_type: "Transmuted from",
        value: "Cleric Jasper of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 398
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7312"
  },
  7313: {
    name: "Wraith Knight Quddus of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/7313",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7313
      },
      {
        trait_type: "Transmuted from",
        value: "Conjurer Quddus of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 93
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7313"
  },
  7316: {
    name: "Wraith Captain Darick of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/7316",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Monkey"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7316
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Darick of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 194
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7316"
  },
  7340: {
    name: "Malodorous Ghoul David of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/7340",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Disease"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7340
      },
      {
        trait_type: "Transmuted from",
        value: "Cryptomancer David of the Platonic Shadow"
      },
      {
        trait_type: "Burn order",
        value: 294
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7340"
  },
  7359: {
    name: "Wraith Devout Danny of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/7359",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7359
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Danny of the Belfry"
      },
      {
        trait_type: "Burn order",
        value: 626
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7359"
  },
  7365: {
    name: "Gangrenous Zombie Lamia of the Scum Barrel",
    image: "https://portal.forgottenrunes.com/api/souls/img/7365",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7365
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Lamia of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 211
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7365"
  },
  7381: {
    name: "Void Phantasm Baird of the Gloom",
    image: "https://portal.forgottenrunes.com/api/souls/img/7381",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7381
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Baird of the Road"
      },
      {
        trait_type: "Burn order",
        value: 104
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7381"
  },
  7384: {
    name: "Channel 3 Poltergeist Judas of the Fuliginous Fog",
    image: "https://portal.forgottenrunes.com/api/souls/img/7384",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7384
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Judas of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 583
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7384"
  },
  7387: {
    name: "Hunted Stag Muntjac of the Haze",
    image: "https://portal.forgottenrunes.com/api/souls/img/7387",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Hunter Skull"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7387
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Muntjac of the Mountain"
      },
      {
        trait_type: "Burn order",
        value: 53
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7387"
  },
  7392: {
    name: "Consumption Zombie Sisk of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/7392",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Consumption Zombie"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Transmuted from number",
        value: 7392
      },
      {
        trait_type: "Transmuted from",
        value: "Holy Monk Sisk of the Citadel"
      },
      {
        trait_type: "Burn order",
        value: 213
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7392"
  },
  7412: {
    name: "Wraith Devout Zorko of the Spooklight",
    image: "https://portal.forgottenrunes.com/api/souls/img/7412",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Anti Hourglass"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7412
      },
      {
        trait_type: "Transmuted from",
        value: "Chronomancer Zorko of the Temple"
      },
      {
        trait_type: "Burn order",
        value: 336
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7412"
  },
  7432: {
    name: "Wraith Captain Abaddon of the Ectoplasmic Downs",
    image: "https://portal.forgottenrunes.com/api/souls/img/7432",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7432
      },
      {
        trait_type: "Transmuted from",
        value: "Ghost Eater Abaddon of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 169
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7432"
  },
  7447: {
    name: "Lich Marquis Maia of the Shell",
    image: "https://portal.forgottenrunes.com/api/souls/img/7447",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7447
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Maia of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 25
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7447"
  },
  7456: {
    name: "Grim Ghoul Milton of the Spooklight",
    image: "https://portal.forgottenrunes.com/api/souls/img/7456",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Transmuted from number",
        value: 7456
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Milton of Avalon"
      },
      {
        trait_type: "Burn order",
        value: 489
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7456"
  },
  7467: {
    name: "Lewd Revenant Ilyas of the Paranormal",
    image: "https://portal.forgottenrunes.com/api/souls/img/7467",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7467
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Ilyas of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 119
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7467"
  },
  7476: {
    name: "Ectoplasm Goop",
    image: "https://portal.forgottenrunes.com/api/souls/img/7476",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Ectoplasm Goop"
      },
      {
        trait_type: "Transmuted from number",
        value: 7476
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Davos of the Garden"
      },
      {
        trait_type: "Burn order",
        value: 607
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7476"
  },
  7518: {
    name: "Lich Duke Finn of the Bubonic Beaches",
    image: "https://portal.forgottenrunes.com/api/souls/img/7518",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Transmuted from number",
        value: 7518
      },
      {
        trait_type: "Transmuted from",
        value: "Diviner Finn of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 693
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7518"
  },
  7532: {
    name: "Ashpile with bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/7532",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile with bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 7532
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Aldo of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 132
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7532"
  },
  7543: {
    name: "Lecherous Ghoul Sisk of Unparalleled Vulgarity",
    image: "https://portal.forgottenrunes.com/api/souls/img/7543",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Salacious Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7543
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Sisk of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 255
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7543"
  },
  7550: {
    name: "Shaded Spectre Florah of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/7550",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7550
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic Florah of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 659
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7550"
  },
  7689: {
    name: "Rotten Revenant Milo of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/7689",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Gangrene Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7689
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Milo of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 573
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7689"
  },
  7704: {
    name: "Consumption Zombie Oberon of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/7704",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Consumption Zombie"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Transmuted from number",
        value: 7704
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Oberon of the Psychic Leap"
      },
      {
        trait_type: "Burn order",
        value: 232
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7704"
  },
  7715: {
    name: "Shaded Spectre Pumlo of the ???",
    image: "https://portal.forgottenrunes.com/api/souls/img/7715",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Owl"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7715
      },
      {
        trait_type: "Transmuted from",
        value: "Chaos Mage Pumlo of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 653
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7715"
  },
  7742: {
    name: "Gangrenous Zombie Larissa of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/7742",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Gangrene Tattered"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7742
      },
      {
        trait_type: "Transmuted from",
        value: "Conjurer Larissa of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 535
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7742"
  },
  7743: {
    name: "Wraith Captain Lumos of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/7743",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7743
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Lumos of the Quantum Downs"
      },
      {
        trait_type: "Burn order",
        value: 248
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7743"
  },
  7772: {
    name: "Wraith Deacon Lenora of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/7772",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7772
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Lenora of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 264
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7772"
  },
  7792: {
    name: "Night Ghoul Tundror of the Scum Barrel",
    image: "https://portal.forgottenrunes.com/api/souls/img/7792",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Transmuted from number",
        value: 7792
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Tundror of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 115
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7792"
  },
  7806: {
    name: "Fire Eye Optimus of the Plague Lands",
    image: "https://portal.forgottenrunes.com/api/souls/img/7806",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Eyeball Fireball"
      },
      {
        trait_type: "Prop",
        value: "Vile of Vomit"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Transmuted from number",
        value: 7806
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Optimus of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 400
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7806"
  },
  7824: {
    name: "Night Ghoul Seth of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/7824",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7824
      },
      {
        trait_type: "Transmuted from",
        value: "Illusionist Seth of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 444
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7824"
  },
  7844: {
    name: "Rotten Revenant Celah of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/7844",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Transmuted from number",
        value: 7844
      },
      {
        trait_type: "Transmuted from",
        value: "Evoker Celah of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 681
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7844"
  },
  7866: {
    name: "Lich Duke Zhan of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/7866",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Blue Shift"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7866
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Zhan of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 577
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7866"
  },
  7867: {
    name: "Ectoplasmic Spectre Daria of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/7867",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Monkey"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7867
      },
      {
        trait_type: "Transmuted from",
        value: "Chronomancer Daria of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 229
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7867"
  },
  7872: {
    name: "Lich Marquis Adrienne of the Smell",
    image: "https://portal.forgottenrunes.com/api/souls/img/7872",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7872
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Adrienne of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 615
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7872"
  },
  7874: {
    name: "Paranormal Phantasm Sisk of the Fatal Forever",
    image: "https://portal.forgottenrunes.com/api/souls/img/7874",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Transmuted from number",
        value: 7874
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Sisk of the Mist"
      },
      {
        trait_type: "Burn order",
        value: 597
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7874"
  },
  7880: {
    name: "Necro Frog Pozzik of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/7880",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 7880
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Pozzik of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 106
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7880"
  },
  7893: {
    name: "Grim Ghoul Lin of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/7893",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Transmuted from number",
        value: 7893
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Lin of the Toadstools"
      },
      {
        trait_type: "Burn order",
        value: 315
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7893"
  },
  7909: {
    name: "Gouged Revenant Daphne of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/7909",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Gouged Revenant"
      },
      {
        trait_type: "Prop",
        value: "Anti Hourglass"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7909
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Daphne of the Mountain"
      },
      {
        trait_type: "Burn order",
        value: 721
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7909"
  },
  7910: {
    name: "The Most Hideous Revenant",
    image: "https://portal.forgottenrunes.com/api/souls/img/7910",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Disgusting Decayed Body"
      },
      {
        trait_type: "Head",
        value: "Disgusting Revenant"
      },
      {
        trait_type: "Affinity",
        value: "Revenant"
      },
      {
        trait_type: "# Traits",
        value: "2"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7910
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Cassius of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 509
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7910"
  },
  7916: {
    name: "Blue Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/7916",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Blue Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 7916
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Amir "
      },
      {
        trait_type: "Burn order",
        value: 37
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7916"
  },
  7918: {
    name: "3-Eye Necromancer Zaros of the Nether Regions",
    image: "https://portal.forgottenrunes.com/api/souls/img/7918",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Braindrain Skull"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Transmuted from number",
        value: 7918
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Zaros of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 510
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7918"
  },
  7925: {
    name: "Ethereal Spectre Cromwell of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/7925",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7925
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Cromwell of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 620
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7925"
  },
  7927: {
    name: "Lich Duke Solomon of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/7927",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Transmuted from number",
        value: 7927
      },
      {
        trait_type: "Transmuted from",
        value: "Illusionist Solomon of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 281
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7927"
  },
  7945: {
    name: "Wraith Knight Zorko ",
    image: "https://portal.forgottenrunes.com/api/souls/img/7945",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7945
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Zorko "
      },
      {
        trait_type: "Burn order",
        value: 490
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7945"
  },
  7950: {
    name: "Void Phantasm Robert ",
    image: "https://portal.forgottenrunes.com/api/souls/img/7950",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7950
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Robert "
      },
      {
        trait_type: "Burn order",
        value: 276
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7950"
  },
  7954: {
    name: "Channel 1 Poltergeist Iprix of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/7954",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 7954
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Iprix of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 335
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7954"
  },
  7962: {
    name: "Wraith Captain Ozohr of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/7962",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Emerald Zombie"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Transmuted from number",
        value: 7962
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Ozohr of the Bastion"
      },
      {
        trait_type: "Burn order",
        value: 629
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/7962"
  },
  8006: {
    name: "Putrid Zombie Milo of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/8006",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Neptune"
      },
      {
        trait_type: "Affinity",
        value: "Zombie"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8006
      },
      {
        trait_type: "Transmuted from",
        value: "Chaos Mage Milo of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 462
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8006"
  },
  8045: {
    name: "Wraith Knight Eric of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/8045",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8045
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Eric of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 654
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8045"
  },
  8049: {
    name: "Lewd Revenant Ilyas of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/8049",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Ghost Torch"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8049
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Ilyas of the Secret Fire"
      },
      {
        trait_type: "Burn order",
        value: 706
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8049"
  },
  8074: {
    name: "Canaanite Lord Behemoth of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/8074",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Canaanite Skull"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8074
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Behemoth of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 446
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8074"
  },
  8083: {
    name: "Wraith Devout Angus of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/8083",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8083
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Angus of the Havens"
      },
      {
        trait_type: "Burn order",
        value: 714
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8083"
  },
  8085: {
    name: "Void Phantasm Cassiopeia of the Paranormal",
    image: "https://portal.forgottenrunes.com/api/souls/img/8085",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Void"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Fire"
      },
      {
        trait_type: "Affinity",
        value: "Void"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8085
      },
      {
        trait_type: "Transmuted from",
        value: " Cassiopeia of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 373
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8085"
  },
  8087: {
    name: "Lich Baron Sonja of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/8087",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8087
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Sonja of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 574
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8087"
  },
  8099: {
    name: "Wraith Knight Qasim of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/8099",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Transmuted from number",
        value: 8099
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Qasim of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 404
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8099"
  },
  8103: {
    name: "Lich Despot David of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/8103",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Affinity",
        value: "Lich"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8103
      },
      {
        trait_type: "Transmuted from",
        value: "Mystic David of the Quantum Shadow"
      },
      {
        trait_type: "Burn order",
        value: 318
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8103"
  },
  8111: {
    name: "Gangrenous Zombie Konoha of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/8111",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Transmuted from number",
        value: 8111
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Konoha of Elysium"
      },
      {
        trait_type: "Burn order",
        value: 733
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8111"
  },
  8164: {
    name: "Wraith Knight Thor of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/8164",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Vest"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8164
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Thor of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 621
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8164"
  },
  8184: {
    name: "Wraith Captain Angus of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/8184",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8184
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Angus of Avalon"
      },
      {
        trait_type: "Burn order",
        value: 372
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8184"
  },
  8186: {
    name: "Malodorous Ghoul Merlon of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/8186",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8186
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Merlon of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 475
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8186"
  },
  8191: {
    name: "Ashpile",
    image: "https://portal.forgottenrunes.com/api/souls/img/8191",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile"
      },
      {
        trait_type: "Transmuted from number",
        value: 8191
      },
      {
        trait_type: "Transmuted from",
        value: "Ice Mage Flamos of the Cold"
      },
      {
        trait_type: "Burn order",
        value: 141
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8191"
  },
  8196: {
    name: "Tulip on grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/8196",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Tulip on grave"
      },
      {
        trait_type: "Transmuted from number",
        value: 8196
      },
      {
        trait_type: "Transmuted from",
        value: "Clairvoyant Thor of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 18
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8196"
  },
  8202: {
    name: "Ethereal Spectre Casper of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/8202",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8202
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Casper in the Shadows"
      },
      {
        trait_type: "Burn order",
        value: 122
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8202"
  },
  8210: {
    name: "Shaded Spectre Apollo of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/8210",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8210
      },
      {
        trait_type: "Transmuted from",
        value: "Hex Mage Apollo from the Shadow"
      },
      {
        trait_type: "Burn order",
        value: 40
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8210"
  },
  8213: {
    name: "Ethereal Spectre Bayard of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/8213",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8213
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Bayard of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 47
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8213"
  },
  8240: {
    name: "Lewd Revenant Gunthor of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/8240",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8240
      },
      {
        trait_type: "Transmuted from",
        value: "Stellar Mage Gunthor of the Ether"
      },
      {
        trait_type: "Burn order",
        value: 576
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8240"
  },
  8248: {
    name: "Lewd Revenant Isaac of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/8248",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Devil's Goblet"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sun"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8248
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Isaac from the Shadow"
      },
      {
        trait_type: "Burn order",
        value: 298
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8248"
  },
  8267: {
    name: "Grim Ghoul Delilah of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/8267",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Flaming Rose"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8267
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Delilah out of the Void"
      },
      {
        trait_type: "Burn order",
        value: 416
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8267"
  },
  8288: {
    name: "Flying Dutchman",
    image: "https://portal.forgottenrunes.com/api/souls/img/8288",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Undead Swashbuckler"
      },
      {
        trait_type: "Head",
        value: "Captian of the Namesake"
      },
      {
        trait_type: "Prop",
        value: "Rusted Cutlass"
      },
      {
        trait_type: "Affinity",
        value: "Pirate"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8288
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Nicolas of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 519
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8288"
  },
  8289: {
    name: "Putrid Zombie Ixar of the Severed Innocence",
    image: "https://portal.forgottenrunes.com/api/souls/img/8289",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Amber"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8289
      },
      {
        trait_type: "Transmuted from",
        value: "Augurer Ixar of Atlantis"
      },
      {
        trait_type: "Burn order",
        value: 393
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8289"
  },
  8293: {
    name: "Raspberry Jelly Donut",
    image: "https://portal.forgottenrunes.com/api/souls/img/8293",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Raspberry Jelly Donut"
      },
      {
        trait_type: "Transmuted from number",
        value: 8293
      },
      {
        trait_type: "Transmuted from",
        value: "Augurer Moka of the Circle"
      },
      {
        trait_type: "Burn order",
        value: 59
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8293"
  },
  8343: {
    name: "Wraith Deacon Iprix of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/8343",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Transmuted from number",
        value: 8343
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Iprix of Mu"
      },
      {
        trait_type: "Burn order",
        value: 581
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8343"
  },
  8357: {
    name: "Lich Despot Lumos of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/8357",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8357
      },
      {
        trait_type: "Transmuted from",
        value: " Lumos of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 432
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8357"
  },
  8360: {
    name: "Channel 1 Poltergeist Jeldor of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/8360",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Transmuted from number",
        value: 8360
      },
      {
        trait_type: "Transmuted from",
        value: " Jeldor of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 168
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8360"
  },
  8367: {
    name: "Wraith Deacon Samuel of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/8367",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8367
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster Samuel of the Reach"
      },
      {
        trait_type: "Burn order",
        value: 233
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8367"
  },
  8394: {
    name: "Ectoplasmic Spectre Florah of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/8394",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8394
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Florah of Elysium"
      },
      {
        trait_type: "Burn order",
        value: 734
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8394"
  },
  8397: {
    name: "Ghost Flame Fire Eater of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/8397",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Ghost Flame"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8397
      },
      {
        trait_type: "Transmuted from",
        value: "Pyromancer Fire Eater from the Abyss"
      },
      {
        trait_type: "Burn order",
        value: 405
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8397"
  },
  8399: {
    name: "Wraith Captain Kazud of the Shaded Shores",
    image: "https://portal.forgottenrunes.com/api/souls/img/8399",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Smilodon Kitten"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8399
      },
      {
        trait_type: "Transmuted from",
        value: "Thaumaturge Kazud out of the Void"
      },
      {
        trait_type: "Burn order",
        value: 188
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8399"
  },
  8402: {
    name: "Ethereal Urn",
    image: "https://portal.forgottenrunes.com/api/souls/img/8402",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Undesirable",
        value: "Ethereal Urn"
      },
      {
        trait_type: "Transmuted from number",
        value: 8402
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Nadeem of the Havens"
      },
      {
        trait_type: "Burn order",
        value: 633
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8402"
  },
  8415: {
    name: "Wraith Deacon Ming of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/8415",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Wraith Deacon"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Transmuted from number",
        value: 8415
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Ming of the River"
      },
      {
        trait_type: "Burn order",
        value: 389
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8415"
  },
  8437: {
    name: "Horned Phantasm Samuel of the Static Snow",
    image: "https://portal.forgottenrunes.com/api/souls/img/8437",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Flaming Rose"
      },
      {
        trait_type: "Familiar",
        value: "Fox Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8437
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Samuel of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 712
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8437"
  },
  8465: {
    name: "Wraith Captain Sylvia of the Eternal Melancholy",
    image: "https://portal.forgottenrunes.com/api/souls/img/8465",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8465
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Sylvia of the Secret Fire"
      },
      {
        trait_type: "Burn order",
        value: 235
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8465"
  },
  8499: {
    name: "Channel 1 Poltergeist Jadis of the Grim Hallows",
    image: "https://portal.forgottenrunes.com/api/souls/img/8499",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Spandex"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Vile of Vomit"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8499
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Jadis of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 474
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8499"
  },
  8500: {
    name: "Lich Marquis Lumos ",
    image: "https://portal.forgottenrunes.com/api/souls/img/8500",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8500
      },
      {
        trait_type: "Transmuted from",
        value: "Alchemist Lumos "
      },
      {
        trait_type: "Burn order",
        value: 0
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8500"
  },
  8506: {
    name: "Wraith Knight Allistair of the Mortal Coil",
    image: "https://portal.forgottenrunes.com/api/souls/img/8506",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8506
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Allistair of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 532
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8506"
  },
  8531: {
    name: "Blue Coffin",
    image: "https://portal.forgottenrunes.com/api/souls/img/8531",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Blue Coffin"
      },
      {
        trait_type: "Transmuted from number",
        value: 8531
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Magnus of the Fey"
      },
      {
        trait_type: "Burn order",
        value: 250
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8531"
  },
  8540: {
    name: "Lich Marquis Angus of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/8540",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Lich"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8540
      },
      {
        trait_type: "Transmuted from",
        value: "Hydromancer Angus of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 491
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8540"
  },
  8556: {
    name: "Wild Zombie Angus of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/8556",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Wild Zombie"
      },
      {
        trait_type: "Prop",
        value: "Platypus hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8556
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Angus of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 244
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8556"
  },
  8572: {
    name: "Channel 3 Poltergeist Alessar of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/8572",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8572
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Alessar of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 127
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8572"
  },
  8586: {
    name: "Ectoplasmic Spectre Onaxx of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/8586",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Quantum Key"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8586
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Onaxx of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 663
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8586"
  },
  8602: {
    name: "Wraith Captain Zorko of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/8602",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Charred Bone Stave"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8602
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Zorko of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 518
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8602"
  },
  8631: {
    name: "Lich Marquis Edge of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/8631",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8631
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Edge of the Surf"
      },
      {
        trait_type: "Burn order",
        value: 695
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8631"
  },
  8634: {
    name: "Grave Robbing Kobold Duzzle of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/8634",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Kobold Skull"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Rat"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8634
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Duzzle of the Rock"
      },
      {
        trait_type: "Burn order",
        value: 4
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8634"
  },
  8639: {
    name: "Paranormal Phantasm Carly of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/8639",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Jumpsuit with Hip Pouch"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Anti Hourglass"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Transmuted from number",
        value: 8639
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Carly of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 610
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8639"
  },
  8700: {
    name: "Lich Duke Cairon of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/8700",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Earth"
      },
      {
        trait_type: "Transmuted from number",
        value: 8700
      },
      {
        trait_type: "Transmuted from",
        value: " Cairon of the Lake"
      },
      {
        trait_type: "Burn order",
        value: 177
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8700"
  },
  8702: {
    name: "Death Crow Jagger of the Pale Moon",
    image: "https://portal.forgottenrunes.com/api/souls/img/8702",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Corvid Skull"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8702
      },
      {
        trait_type: "Transmuted from",
        value: "Geomancer Jagger of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 48
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8702"
  },
  8723: {
    name: "Skeleton Impy of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/8723",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Imp Skull"
      },
      {
        trait_type: "Prop",
        value: "Vile of Vomit"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Owl"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8723
      },
      {
        trait_type: "Transmuted from",
        value: "Diabolist Impy of Arcadia"
      },
      {
        trait_type: "Burn order",
        value: 8
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8723"
  },
  8743: {
    name: "Rotten Revenant Ming of Nasty Town",
    image: "https://portal.forgottenrunes.com/api/souls/img/8743",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Howl of Cerberus: the Black Flame Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8743
      },
      {
        trait_type: "Transmuted from",
        value: "Battlemage Ming of the Field"
      },
      {
        trait_type: "Burn order",
        value: 50
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8743"
  },
  8753: {
    name: "Necro Frog Trollin of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/8753",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "Blackness"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8753
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Trollin of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 333
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8753"
  },
  8756: {
    name: "Malodorous Ghoul Alatar of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/8756",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8756
      },
      {
        trait_type: "Transmuted from",
        value: " Alatar of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 376
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8756"
  },
  8757: {
    name: "Veiled Phantasm Fark of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/8757",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Rat"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8757
      },
      {
        trait_type: "Transmuted from",
        value: "Holy Monk Fark of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 470
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8757"
  },
  8791: {
    name: "Veiled Phantasm Chooki of Phantasmagoria",
    image: "https://portal.forgottenrunes.com/api/souls/img/8791",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Veil"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Charred Pipe"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Cockatrice"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Darkness"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8791
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Chooki of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 386
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8791"
  },
  8792: {
    name: "Nosferatu",
    image: "https://portal.forgottenrunes.com/api/souls/img/8792",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Gotchic Frock"
      },
      {
        trait_type: "Head",
        value: "Count Orlok"
      },
      {
        trait_type: "Affinity",
        value: "Vampyre"
      },
      {
        trait_type: "# Traits",
        value: "2"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8792
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Calypso of the Citadel"
      },
      {
        trait_type: "Burn order",
        value: 466
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8792"
  },
  8793: {
    name: "Rotten Revenant Jahid of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/8793",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Book of Dark Magic"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8793
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Jahid out of the Void"
      },
      {
        trait_type: "Burn order",
        value: 230
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8793"
  },
  8799: {
    name: "Holy Spectre Artis of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/8799",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Vile Skeleton"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Entropy Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8799
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Artis of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 528
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8799"
  },
  8800: {
    name: "Pile of Bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/8800",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Undesirable",
        value: "Pile of Bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 8800
      },
      {
        trait_type: "Transmuted from",
        value: "Hex Mage Aleister of the Oasis"
      },
      {
        trait_type: "Burn order",
        value: 44
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8800"
  },
  8884: {
    name: "Holy Spectre Remus of the Spooklight",
    image: "https://portal.forgottenrunes.com/api/souls/img/8884",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Transmuted from number",
        value: 8884
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Remus of the Obelisk"
      },
      {
        trait_type: "Burn order",
        value: 703
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8884"
  },
  8905: {
    name: "Wraith Captain Ilyas of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/8905",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8905
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Ilyas of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 130
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8905"
  },
  8926: {
    name: "Channel 3 Poltergeist Ofaris of the Bleep",
    image: "https://portal.forgottenrunes.com/api/souls/img/8926",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Charred Bone Stave"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8926
      },
      {
        trait_type: "Transmuted from",
        value: "Wild Mage Ofaris of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 325
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8926"
  },
  8927: {
    name: "Holy Spectre Impy of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/8927",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8927
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Impy of the Sacred Pillars"
      },
      {
        trait_type: "Burn order",
        value: 503
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8927"
  },
  8963: {
    name: "Lewd Revenant Crowley of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/8963",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Crow Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8963
      },
      {
        trait_type: "Transmuted from",
        value: "Cosmic Mage Crowley of the Riviera"
      },
      {
        trait_type: "Burn order",
        value: 133
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8963"
  },
  8977: {
    name: "Wraith Knight Azahl ",
    image: "https://portal.forgottenrunes.com/api/souls/img/8977",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Ghoul Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Wolf Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8977
      },
      {
        trait_type: "Transmuted from",
        value: "Sage Azahl "
      },
      {
        trait_type: "Burn order",
        value: 297
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8977"
  },
  8986: {
    name: "Wraith Captain Gogol of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/8986",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Transmuted from number",
        value: 8986
      },
      {
        trait_type: "Transmuted from",
        value: "Cleric Gogol of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 30
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8986"
  },
  8996: {
    name: "Blight Zombie Soya ",
    image: "https://portal.forgottenrunes.com/api/souls/img/8996",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Blight Zombie"
      },
      {
        trait_type: "Prop",
        value: "Cockatrice hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8996
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Soya "
      },
      {
        trait_type: "Burn order",
        value: 175
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8996"
  },
  8997: {
    name: "Tulip on grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/8997",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Tulip on grave"
      },
      {
        trait_type: "Transmuted from number",
        value: 8997
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Angus of the Tundra"
      },
      {
        trait_type: "Burn order",
        value: 602
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8997"
  },
  8998: {
    name: "Channel 1 Poltergeist Gunthor of the Static Snow",
    image: "https://portal.forgottenrunes.com/api/souls/img/8998",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Dryad's Decay: the Rafflesia Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Dog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 8998
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Gunthor of the Mount"
      },
      {
        trait_type: "Burn order",
        value: 313
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/8998"
  },
  9006: {
    name: "Death Crow Rook of the Brimstone Havens",
    image: "https://portal.forgottenrunes.com/api/souls/img/9006",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Corvid Skull"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9006
      },
      {
        trait_type: "Transmuted from",
        value: "Aeromancer Rook of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 42
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9006"
  },
  9011: {
    name: "Lich Despot David of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/9011",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Lich Despot"
      },
      {
        trait_type: "Prop",
        value: "Book of Dark Magic"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bunny"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Transmuted from number",
        value: 9011
      },
      {
        trait_type: "Transmuted from",
        value: "Runecaster David of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 234
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9011"
  },
  9056: {
    name: "Ethereal Spectre Homer of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/9056",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "A dumb stick... on fire"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9056
      },
      {
        trait_type: "Transmuted from",
        value: "Hedge Wizard Homer of the Field"
      },
      {
        trait_type: "Burn order",
        value: 402
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9056"
  },
  9073: {
    name: "Lewd Revenant Magnus of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/9073",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9073
      },
      {
        trait_type: "Transmuted from",
        value: "Cosmic Mage Magnus of the Havens"
      },
      {
        trait_type: "Burn order",
        value: 180
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9073"
  },
  9099: {
    name: "Malodorous Ghoul Eden of the Fetid Ruins",
    image: "https://portal.forgottenrunes.com/api/souls/img/9099",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Sickness"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Sickness"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9099
      },
      {
        trait_type: "Transmuted from",
        value: "Adept Eden of the Ether"
      },
      {
        trait_type: "Burn order",
        value: 159
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9099"
  },
  9117: {
    name: "Channel 1 Poltergeist Gorgana of the Static Snow",
    image: "https://portal.forgottenrunes.com/api/souls/img/9117",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Charred Bone Stave"
      },
      {
        trait_type: "Familiar",
        value: "Bat Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Poltergeist"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9117
      },
      {
        trait_type: "Transmuted from",
        value: "Voodoo Priest Gorgana of the Marsh"
      },
      {
        trait_type: "Burn order",
        value: 445
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9117"
  },
  9130: {
    name: "Holy Spectre Ekmira of the ???",
    image: "https://portal.forgottenrunes.com/api/souls/img/9130",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Holy Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Underworld Peyote"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9130
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Ekmira of the Heath"
      },
      {
        trait_type: "Burn order",
        value: 732
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9130"
  },
  9150: {
    name: "Putrid Zombie Fark of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/9150",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Putrid Zombie"
      },
      {
        trait_type: "Prop",
        value: "Inverted Horseshoe"
      },
      {
        trait_type: "Transmuted from number",
        value: 9150
      },
      {
        trait_type: "Transmuted from",
        value: "Holy Monk Fark of the Keep"
      },
      {
        trait_type: "Burn order",
        value: 24
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9150"
  },
  9179: {
    name: "Lewd Revenant Horace of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/9179",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Shade"
      },
      {
        trait_type: "Head",
        value: "Lewd Revenant"
      },
      {
        trait_type: "Prop",
        value: "Odin's Despair: the Dark Cloud Spell"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9179
      },
      {
        trait_type: "Transmuted from",
        value: "Electromancer Horace of Dreams"
      },
      {
        trait_type: "Burn order",
        value: 165
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9179"
  },
  9198: {
    name: "Wraith Devout Faye of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/9198",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Quartz Orbuculum"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9198
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Faye of the Forest"
      },
      {
        trait_type: "Burn order",
        value: 272
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9198"
  },
  9213: {
    name: "Grim Ghoul Atlas of the Pale Moon",
    image: "https://portal.forgottenrunes.com/api/souls/img/9213",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body of Death"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Empty Mug of Ale"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9213
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Atlas of the Dunes"
      },
      {
        trait_type: "Burn order",
        value: 729
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9213"
  },
  9224: {
    name: "Death Crow Rook of Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/9224",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Corvid Skull"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Owl"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9224
      },
      {
        trait_type: "Transmuted from",
        value: "Aeromancer Rook of the Havens"
      },
      {
        trait_type: "Burn order",
        value: 364
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9224"
  },
  9237: {
    name: "Veiled Phantasm Atlanta of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/9237",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Cinnabar"
      },
      {
        trait_type: "Transmuted from number",
        value: 9237
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Atlanta of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 407
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9237"
  },
  9252: {
    name: "Lich Marquis Celah of the Worms",
    image: "https://portal.forgottenrunes.com/api/souls/img/9252",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brass"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9252
      },
      {
        trait_type: "Transmuted from",
        value: "Summoner Celah of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 549
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9252"
  },
  9289: {
    name: "Blood Eater Revenant Axel of the Thorn",
    image: "https://portal.forgottenrunes.com/api/souls/img/9289",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Mischief Suit"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Thylacine"
      },
      {
        trait_type: "Affinity",
        value: "Mischeif"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9289
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Axel of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 632
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9289"
  },
  9302: {
    name: "Necro Frog Suki of the Majestic Filth",
    image: "https://portal.forgottenrunes.com/api/souls/img/9302",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Aristocrat"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Transmuted from number",
        value: 9302
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Suki of the Hall"
      },
      {
        trait_type: "Burn order",
        value: 634
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9302"
  },
  9308: {
    name: "Gangrenous Zombie Zane of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/9308",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Harp"
      },
      {
        trait_type: "Familiar",
        value: "Bunny Skeleton"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Transmuted from number",
        value: 9308
      },
      {
        trait_type: "Transmuted from",
        value: "Sorcerer Zane of Atlantis"
      },
      {
        trait_type: "Burn order",
        value: 593
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9308"
  },
  9313: {
    name: "Veiled Phantasm Lumos of the Mist",
    image: "https://portal.forgottenrunes.com/api/souls/img/9313",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Transmuted from number",
        value: 9313
      },
      {
        trait_type: "Transmuted from",
        value: " Lumos of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 661
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9313"
  },
  9316: {
    name: "Wraith Knight Oberon of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/9316",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9316
      },
      {
        trait_type: "Transmuted from",
        value: "Summoner Oberon of the Tundra"
      },
      {
        trait_type: "Burn order",
        value: 31
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9316"
  },
  9318: {
    name: "Paranormal Phantasm Elena of the Ether Veil",
    image: "https://portal.forgottenrunes.com/api/souls/img/9318",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Phantasmal body of the Void"
      },
      {
        trait_type: "Head",
        value: "Paranormal Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9318
      },
      {
        trait_type: "Transmuted from",
        value: "Witch Elena of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 506
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9318"
  },
  9329: {
    name: "Wraith Captain Yanlin of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/9329",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Dragon hatchling"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "4"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9329
      },
      {
        trait_type: "Transmuted from",
        value: "Summoner Yanlin of the Reach"
      },
      {
        trait_type: "Burn order",
        value: 595
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9329"
  },
  9343: {
    name: "Ethereal Spectre Silas of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/9343",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Broom on Fire"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Saturn"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9343
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Silas of the Canyon"
      },
      {
        trait_type: "Burn order",
        value: 550
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9343"
  },
  9365: {
    name: "Shaded Spectre Alessar of the ???",
    image: "https://portal.forgottenrunes.com/api/souls/img/9365",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Shade Spectre"
      },
      {
        trait_type: "Prop",
        value: "Poison Apple"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mars"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9365
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Alessar of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 696
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9365"
  },
  9367: {
    name: "Death Shroom Amanita of the Slime Pits",
    image: "https://portal.forgottenrunes.com/api/souls/img/9367",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Bag of Cataclysm"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Snake"
      },
      {
        trait_type: "Transmuted from number",
        value: 9367
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Amanita of the Veil"
      },
      {
        trait_type: "Burn order",
        value: 743
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9367"
  },
  9383: {
    name: "Grave Robbing Kobold Poppy of the Technicolor Nightmare",
    image: "https://portal.forgottenrunes.com/api/souls/img/9383",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Technicolor Skeleton"
      },
      {
        trait_type: "Head",
        value: "Kobold Skull"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Rat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Up Only"
      },
      {
        trait_type: "Transmuted from number",
        value: 9383
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Poppy of the Technochrome"
      },
      {
        trait_type: "Burn order",
        value: 260
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9383"
  },
  9388: {
    name: "Lich Baron Alatar of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/9388",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Dark Mantle"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Affinity",
        value: "Lich"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9388
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Alatar of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 637
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9388"
  },
  9431: {
    name: "Ethereal Spectre Impy of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/9431",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Forever Sparkler"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9431
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Impy of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 174
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9431"
  },
  9445: {
    name: "Lich Marquis Davos of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/9445",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 1 Robe"
      },
      {
        trait_type: "Head",
        value: "Lich Marquis"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9445
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Davos of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 642
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9445"
  },
  9449: {
    name: "Wraith Captain Godfrey of the Chasm",
    image: "https://portal.forgottenrunes.com/api/souls/img/9449",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Soul Reaper Scythe"
      },
      {
        trait_type: "Familiar",
        value: "Resurrected Dodo"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9449
      },
      {
        trait_type: "Transmuted from",
        value: "Chaos Mage Godfrey of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 552
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9449"
  },
  9451: {
    name: "Ethereal Spectre Alessar of Limbo",
    image: "https://portal.forgottenrunes.com/api/souls/img/9451",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Elven Cloak"
      },
      {
        trait_type: "Head",
        value: "Ethereal Spectre"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Hummingbird"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9451
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Alessar of the Garden"
      },
      {
        trait_type: "Burn order",
        value: 403
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9451"
  },
  9500: {
    name: "Wraith Knight Ulysse of the Pile",
    image: "https://portal.forgottenrunes.com/api/souls/img/9500",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Trapped Soul Staff"
      },
      {
        trait_type: "Transmuted from number",
        value: 9500
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Ulysse of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 628
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9500"
  },
  9523: {
    name: "Wraith Captain Orpheus of the Eternal Melancholy",
    image: "https://portal.forgottenrunes.com/api/souls/img/9523",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Captain"
      },
      {
        trait_type: "Prop",
        value: "Wand of Conquest"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9523
      },
      {
        trait_type: "Transmuted from",
        value: " Orpheus of the Pit"
      },
      {
        trait_type: "Burn order",
        value: 212
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9523"
  },
  9528: {
    name: "Rotten Revenant Alatar of the Bottomless Grave",
    image: "https://portal.forgottenrunes.com/api/souls/img/9528",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Putrid Rags"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Medusa's Eye"
      },
      {
        trait_type: "Familiar",
        value: "Ladybug Ghost"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Steel"
      },
      {
        trait_type: "Affinity",
        value: "Brownish"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9528
      },
      {
        trait_type: "Transmuted from",
        value: "Summoner Alatar of the Gnostics"
      },
      {
        trait_type: "Burn order",
        value: 219
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9528"
  },
  9561: {
    name: "Ghost Flame Scorch of the Soft Glitch",
    image: "https://portal.forgottenrunes.com/api/souls/img/9561",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Channel 3 Robe"
      },
      {
        trait_type: "Head",
        value: "Ghost Flame"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Bat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Ghost"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "60 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9561
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Scorch of Tartarus"
      },
      {
        trait_type: "Burn order",
        value: 523
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9561"
  },
  9581: {
    name: "Ashpile with bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/9581",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Ashpile with bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 9581
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Finch of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 664
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9581"
  },
  9592: {
    name: "Necro Frog Oiq of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/9592",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Anuran Skull"
      },
      {
        trait_type: "Prop",
        value: "Candle of Clairvoyance"
      },
      {
        trait_type: "Transmuted from number",
        value: 9592
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Oiq of the Moors"
      },
      {
        trait_type: "Burn order",
        value: 431
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9592"
  },
  9593: {
    name: "Wraith Devout Magnus of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/9593",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Regal Undead"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Dwarve's Heart: the Diamond Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Fox"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9593
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Magnus of the Field"
      },
      {
        trait_type: "Burn order",
        value: 454
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9593"
  },
  9620: {
    name: "Lich Baron Larissa of the Ice Abyss",
    image: "https://portal.forgottenrunes.com/api/souls/img/9620",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Air"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9620
      },
      {
        trait_type: "Transmuted from",
        value: "Charmer Larissa of the Hills"
      },
      {
        trait_type: "Burn order",
        value: 711
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9620"
  },
  9631: {
    name: "Veiled Phantasm Aldus of the Ethereal Realm",
    image: "https://portal.forgottenrunes.com/api/souls/img/9631",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Phantasm of the Veil"
      },
      {
        trait_type: "Prop",
        value: "Banshee's Bell"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9631
      },
      {
        trait_type: "Transmuted from",
        value: "Spellsinger Aldus of the Realm"
      },
      {
        trait_type: "Burn order",
        value: 87
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9631"
  },
  9635: {
    name: "Wraith Knight Circe of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/9635",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Swashbuckling Gear"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Nixie's Lament: the Rain Spell"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9635
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Circe of the Sea"
      },
      {
        trait_type: "Burn order",
        value: 422
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9635"
  },
  9644: {
    name: "Lich Duke Onaxx of the Smell",
    image: "https://portal.forgottenrunes.com/api/souls/img/9644",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Blight Rags"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Transmuted from number",
        value: 9644
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Onaxx of the Sands"
      },
      {
        trait_type: "Burn order",
        value: 140
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9644"
  },
  9659: {
    name: "Eldritch Horror Azathoth of the Spike",
    image: "https://portal.forgottenrunes.com/api/souls/img/9659",
    attributes: [
      {
        trait_type: "Background",
        value: "Conquest"
      },
      {
        trait_type: "Body",
        value: "Ethereal Shoulder Cape"
      },
      {
        trait_type: "Head",
        value: "Eldritch Horror"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Omega"
      },
      {
        trait_type: "Affinity",
        value: "Slime"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9659
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Azathoth of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 380
      }
    ],
    background_color: "1E0200",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9659"
  },
  9669: {
    name: "Wraith Knight Orlando of Limbo",
    image: "https://portal.forgottenrunes.com/api/souls/img/9669",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Tunic"
      },
      {
        trait_type: "Head",
        value: "Wraith Knight"
      },
      {
        trait_type: "Prop",
        value: "Blood Moon Staff"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "3"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "75 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9669
      },
      {
        trait_type: "Transmuted from",
        value: "Thaumaturge Orlando of the Cosmos"
      },
      {
        trait_type: "Burn order",
        value: 15
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9669"
  },
  9670: {
    name: "Channel 3 Poltergeist Setsuko of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/9670",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton"
      },
      {
        trait_type: "Head",
        value: "Channel 3 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "A Big Magic Stick with Ether Fire"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Grey"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9670
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Setsuko of the Citadel"
      },
      {
        trait_type: "Burn order",
        value: 339
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9670"
  },
  9671: {
    name: "Ectoplasmic Spectre Nikolas of the Ectoplasmic Horizon",
    image: "https://portal.forgottenrunes.com/api/souls/img/9671",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ecto Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Ecto Spectre"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Slime"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Ecto Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9671
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Nikolas of the Light"
      },
      {
        trait_type: "Burn order",
        value: 108
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9671"
  },
  9693: {
    name: "Death Shroom Amanita of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/9693",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Death Shroom"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Venus"
      },
      {
        trait_type: "Affinity",
        value: "Mushroom"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9693
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Amanita of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 612
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9693"
  },
  9705: {
    name: "Lich Duke Thor of the River Styxx",
    image: "https://portal.forgottenrunes.com/api/souls/img/9705",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Skeleton with Sash"
      },
      {
        trait_type: "Head",
        value: "Lich Duke"
      },
      {
        trait_type: "Prop",
        value: "Golden Caduceus"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sun"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9705
      },
      {
        trait_type: "Transmuted from",
        value: "Battle Mage Thor of the Palms"
      },
      {
        trait_type: "Burn order",
        value: 296
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9705"
  },
  9706: {
    name: "Grim Ghoul Lenora of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/9706",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body of Death"
      },
      {
        trait_type: "Head",
        value: "Pale Ghoul"
      },
      {
        trait_type: "Prop",
        value: "Skeleton Key"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Carnal"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9706
      },
      {
        trait_type: "Transmuted from",
        value: "Artificer Lenora of the Road"
      },
      {
        trait_type: "Burn order",
        value: 652
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9706"
  },
  9707: {
    name: "Skeleton Kalo of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/9707",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Skeleton in Red Boots"
      },
      {
        trait_type: "Head",
        value: "Imp Skull"
      },
      {
        trait_type: "Prop",
        value: "Seraphim's Touch: the Life Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Skeleton"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9707
      },
      {
        trait_type: "Transmuted from",
        value: "Shadow Mage Kalo of the Plains"
      },
      {
        trait_type: "Burn order",
        value: 514
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9707"
  },
  9733: {
    name: "Gangrenous Zombie Gellert of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/9733",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Corporeal Body"
      },
      {
        trait_type: "Head",
        value: "Gangrene Zombie"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Affinity",
        value: "Verdant"
      },
      {
        trait_type: "# Traits",
        value: "3"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "66 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9733
      },
      {
        trait_type: "Transmuted from",
        value: "Arch-Magician Gellert of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 20
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9733"
  },
  9755: {
    name: "Horned Phantasm Circe of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/9755",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Paranormal Phantasmal Body"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Fire Stone Staff"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Crow"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Mercury"
      },
      {
        trait_type: "Affinity",
        value: "Phantasm"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9755
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Circe of the Field"
      },
      {
        trait_type: "Burn order",
        value: 408
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9755"
  },
  9760: {
    name: "Channel 1 Poltergeist Orpheus of the Hell Chamber",
    image: "https://portal.forgottenrunes.com/api/souls/img/9760",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Channel 1 Poltergeist"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Blaze Frog"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Jupiter"
      },
      {
        trait_type: "Affinity",
        value: "Fire"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9760
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Orpheus of the Valley"
      },
      {
        trait_type: "Burn order",
        value: 27
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9760"
  },
  9781: {
    name: "Death Shroom Amanita of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/9781",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Death Shroom"
      },
      {
        trait_type: "Prop",
        value: "Basilisk's Hiss: the Heat Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Wolf"
      },
      {
        trait_type: "Affinity",
        value: "Purple Haze"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9781
      },
      {
        trait_type: "Transmuted from",
        value: "Aeromancer Amanita of the Tower"
      },
      {
        trait_type: "Burn order",
        value: 49
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9781"
  },
  9788: {
    name: "Houngan Necromancer Hugo of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/9788",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Wight Cape"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Anti Hourglass"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Transmuted from number",
        value: 9788
      },
      {
        trait_type: "Transmuted from",
        value: "Voodoo Priest Hugo of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 473
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9788"
  },
  9798: {
    name: "Pile of Bones",
    image: "https://portal.forgottenrunes.com/api/souls/img/9798",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Undesirable",
        value: "Pile of Bones"
      },
      {
        trait_type: "Transmuted from number",
        value: 9798
      },
      {
        trait_type: "Transmuted from",
        value: "Druid Norix of the Light"
      },
      {
        trait_type: "Burn order",
        value: 588
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9798"
  },
  9805: {
    name: "Lich Baron Merlon of Torment Manor",
    image: "https://portal.forgottenrunes.com/api/souls/img/9805",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Lich Baron"
      },
      {
        trait_type: "Prop",
        value: "Penumbra Potion"
      },
      {
        trait_type: "Transmuted from number",
        value: 9805
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Merlon from the Abyss"
      },
      {
        trait_type: "Burn order",
        value: 420
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9805"
  },
  9807: {
    name: "Ghoul of Insatiable Blood Lust",
    image: "https://portal.forgottenrunes.com/api/souls/img/9807",
    attributes: [
      {
        trait_type: "Background",
        value: "Pestilence"
      },
      {
        trait_type: "Body",
        value: "Blood Gorged Vulgarity"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Bloodlust"
      },
      {
        trait_type: "Affinity",
        value: "Blood"
      },
      {
        trait_type: "# Traits",
        value: "2"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "100 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9807
      },
      {
        trait_type: "Transmuted from",
        value: "Hydromancer Ratko of the Wold"
      },
      {
        trait_type: "Burn order",
        value: 413
      }
    ],
    background_color: "040D04",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9807"
  },
  9819: {
    name: "Holy Spectre Chu Hua of the Death Cloud",
    image: "https://portal.forgottenrunes.com/api/souls/img/9819",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Shade Spectral Body"
      },
      {
        trait_type: "Head",
        value: "Holy Spectre"
      },
      {
        trait_type: "Prop",
        value: "Joker Card"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Owl"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Uranus"
      },
      {
        trait_type: "Affinity",
        value: "Cool Flame"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9819
      },
      {
        trait_type: "Transmuted from",
        value: "Augurer Chu Hua of the Wood"
      },
      {
        trait_type: "Burn order",
        value: 692
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9819"
  },
  9831: {
    name: "Blood Eater Revenant Althea of the Inifinite Nothing",
    image: "https://portal.forgottenrunes.com/api/souls/img/9831",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Phantasm Sash"
      },
      {
        trait_type: "Head",
        value: "Blood Eater Revenant"
      },
      {
        trait_type: "Prop",
        value: "Pixie's Dance: the Razzle Spell"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Frog"
      },
      {
        trait_type: "Affinity",
        value: "White Magic"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9831
      },
      {
        trait_type: "Transmuted from",
        value: "Cleric Althea of the Hollow"
      },
      {
        trait_type: "Burn order",
        value: 689
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9831"
  },
  9835: {
    name: "Night Ghoul Nori of Nightmare Paradise",
    image: "https://portal.forgottenrunes.com/api/souls/img/9835",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Lascivious Body Shade"
      },
      {
        trait_type: "Head",
        value: "Ghoul of Shade"
      },
      {
        trait_type: "Prop",
        value: "The Everlasting Supreme Love Spell"
      },
      {
        trait_type: "Familiar",
        value: "Zombie Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Water"
      },
      {
        trait_type: "Affinity",
        value: "Shade"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9835
      },
      {
        trait_type: "Transmuted from",
        value: "Conjurer Nori of the Brambles"
      },
      {
        trait_type: "Burn order",
        value: 521
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9835"
  },
  9841: {
    name: "Power Orb",
    image: "https://portal.forgottenrunes.com/api/souls/img/9841",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Undesirable",
        value: "Power Orb"
      },
      {
        trait_type: "Transmuted from number",
        value: 9841
      },
      {
        trait_type: "Transmuted from",
        value: "Archmagus Max of the Capital"
      },
      {
        trait_type: "Burn order",
        value: 17
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9841"
  },
  9851: {
    name: "Horned Phantasm Adrienne of the Dread Tower",
    image: "https://portal.forgottenrunes.com/api/souls/img/9851",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Horned Phantasm"
      },
      {
        trait_type: "Prop",
        value: "Double Phoenix Feather"
      },
      {
        trait_type: "Familiar",
        value: "Ghost Snake"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Sigma"
      },
      {
        trait_type: "Transmuted from number",
        value: 9851
      },
      {
        trait_type: "Transmuted from",
        value: "Enchanter Adrienne of the Steppe"
      },
      {
        trait_type: "Burn order",
        value: 52
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9851"
  },
  9894: {
    name: "Rotten Revenant Amir of the Undying Chill",
    image: "https://portal.forgottenrunes.com/api/souls/img/9894",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Decaying Skeleton"
      },
      {
        trait_type: "Head",
        value: "Rotten Revenant"
      },
      {
        trait_type: "Prop",
        value: "Inverted Horseshoe"
      },
      {
        trait_type: "Rune",
        value: "Rune of Souls"
      },
      {
        trait_type: "Affinity",
        value: "Decay"
      },
      {
        trait_type: "# Traits",
        value: "4"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "50 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9894
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Amir of the Grotto"
      },
      {
        trait_type: "Burn order",
        value: 512
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9894"
  },
  9900: {
    name: "Wraith Devout Kazem of Goblin town",
    image: "https://portal.forgottenrunes.com/api/souls/img/9900",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Carnal Body Salaciousness"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Brimstone"
      },
      {
        trait_type: "Transmuted from number",
        value: 9900
      },
      {
        trait_type: "Transmuted from",
        value: "Arcanist Kazem of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 275
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9900"
  },
  9925: {
    name: "Wraith Devout Wazir of the Nightmare Dominion",
    image: "https://portal.forgottenrunes.com/api/souls/img/9925",
    attributes: [
      {
        trait_type: "Background",
        value: "Death"
      },
      {
        trait_type: "Body",
        value: "Ethereal Cleric Robe"
      },
      {
        trait_type: "Head",
        value: "Wraith Devout"
      },
      {
        trait_type: "Prop",
        value: "Neutron Star Staff"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Lime"
      },
      {
        trait_type: "Affinity",
        value: "Wight"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9925
      },
      {
        trait_type: "Transmuted from",
        value: "Magus Wazir of the Sun"
      },
      {
        trait_type: "Burn order",
        value: 622
      }
    ],
    background_color: "000000",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9925"
  },
  9964: {
    name: "Houngan Necromancer Caligari of Gross Gorge",
    image: "https://portal.forgottenrunes.com/api/souls/img/9964",
    attributes: [
      {
        trait_type: "Background",
        value: "Famine"
      },
      {
        trait_type: "Body",
        value: "Consumption Rags"
      },
      {
        trait_type: "Head",
        value: "Houngan Death Lord"
      },
      {
        trait_type: "Prop",
        value: "Death Crook"
      },
      {
        trait_type: "Familiar",
        value: "Skeleton Cat"
      },
      {
        trait_type: "Rune",
        value: "Soul Rune of Pluto"
      },
      {
        trait_type: "Affinity",
        value: "Death"
      },
      {
        trait_type: "# Traits",
        value: "5"
      },
      {
        trait_type: "# Traits in Affinity",
        value: "2"
      },
      {
        trait_type: "% Traits in Affinity",
        value: "40 percent"
      },
      {
        trait_type: "Transmuted from number",
        value: 9964
      },
      {
        trait_type: "Transmuted from",
        value: "Shaman Caligari of the Desert"
      },
      {
        trait_type: "Burn order",
        value: 640
      }
    ],
    background_color: "09071B",
    metadataUri: "https://portal.forgottenrunes.com/api/souls/data/9964"
  }
};
