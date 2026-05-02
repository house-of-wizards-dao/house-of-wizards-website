export const soulTraitParts = [
  "background",
  "body",
  "familiar",
  "head",
  "prop",
  "rune",
  "affinity",
  "undesirable",
] as const;

export type SoulTraitPart = (typeof soulTraitParts)[number];

export type Trait = {
  idx: number;
  displayName: string;
  description?: string;
  part: SoulTraitPart;
};

export const soulTraits: Trait[] = [
  {
    idx: 0,
    displayName: "Conquest",
    part: "background"
  },
  {
    idx: 1,
    displayName: "Death",
    part: "background"
  },
  {
    idx: 2,
    displayName: "Famine",
    part: "background"
  },
  {
    idx: 3,
    displayName: "Pestilence",
    part: "background"
  },
  {
    idx: 4,
    displayName: "Angelic Robe",
    part: "body"
  },
  {
    idx: 5,
    displayName: "Blight Rags",
    part: "body"
  },
  {
    idx: 6,
    displayName: "Blight Tattered",
    part: "body"
  },
  {
    idx: 7,
    displayName: "Blood Gorged Vulgarity",
    part: "body"
  },
  {
    idx: 8,
    displayName: "Burned Gold Skeleton",
    part: "body"
  },
  {
    idx: 9,
    displayName: "Caped Ethereal Jumpsuit",
    part: "body"
  },
  {
    idx: 10,
    displayName: "Carnal Body of Death",
    part: "body"
  },
  {
    idx: 11,
    displayName: "Carnal Body of Shade",
    part: "body"
  },
  {
    idx: 12,
    displayName: "Carnal Body of Sickness",
    part: "body"
  },
  {
    idx: 13,
    displayName: "Carnal Body Salaciousness",
    part: "body"
  },
  {
    idx: 14,
    displayName: "Channel 1 Robe",
    part: "body"
  },
  {
    idx: 15,
    displayName: "Channel 3 Robe",
    part: "body"
  },
  {
    idx: 16,
    displayName: "Consumption Rags",
    part: "body"
  },
  {
    idx: 17,
    displayName: "Consumption Tattered",
    part: "body"
  },
  {
    idx: 18,
    displayName: "Corporeal Body",
    part: "body"
  },
  {
    idx: 19,
    displayName: "Dark Mantle",
    part: "body"
  },
  {
    idx: 20,
    displayName: "Decaying Skeleton",
    part: "body"
  },
  {
    idx: 21,
    displayName: "Disgusting Decayed Body",
    part: "body"
  },
  {
    idx: 22,
    displayName: "Ecto Spectral Body",
    part: "body"
  },
  {
    idx: 23,
    displayName: "Emerald Zombie",
    part: "body"
  },
  {
    idx: 24,
    displayName: "Ethereal Aristocrat",
    part: "body"
  },
  {
    idx: 25,
    displayName: "Ethereal Cleric Robe",
    part: "body"
  },
  {
    idx: 26,
    displayName: "Ethereal Elven Cloak",
    part: "body"
  },
  {
    idx: 27,
    displayName: "Ethereal Jumpsuit with Hip Pouch",
    part: "body"
  },
  {
    idx: 28,
    displayName: "Ethereal Sash",
    part: "body"
  },
  {
    idx: 29,
    displayName: "Ethereal Shoulder Cape",
    part: "body"
  },
  {
    idx: 30,
    displayName: "Ethereal Spectral Body",
    part: "body"
  },
  {
    idx: 31,
    displayName: "Ethereal Swashbuckling Gear",
    part: "body"
  },
  {
    idx: 32,
    displayName: "Ethereal Tunic",
    part: "body"
  },
  {
    idx: 33,
    displayName: "Ethereal Vest",
    part: "body"
  },
  {
    idx: 34,
    displayName: "Fortune Telling Robes",
    part: "body"
  },
  {
    idx: 35,
    displayName: "Gangrene Rags",
    part: "body"
  },
  {
    idx: 36,
    displayName: "Gangrene Tattered",
    part: "body"
  },
  {
    idx: 37,
    displayName: "Glitched Poltergeist",
    part: "body"
  },
  {
    idx: 38,
    displayName: "Gotchic Frock",
    part: "body"
  },
  {
    idx: 39,
    displayName: "Holy Spectral Body",
    part: "body"
  },
  {
    idx: 40,
    displayName: "Houppelande",
    part: "body"
  },
  {
    idx: 41,
    displayName: "Lascivious Body of Death",
    part: "body"
  },
  {
    idx: 42,
    displayName: "Lascivious Body of Sickness",
    part: "body"
  },
  {
    idx: 43,
    displayName: "Lascivious Body Salaciousness",
    part: "body"
  },
  {
    idx: 44,
    displayName: "Lascivious Body Shade",
    part: "body"
  },
  {
    idx: 45,
    displayName: "Mischief Suit",
    part: "body"
  },
  {
    idx: 46,
    displayName: "Paranormal Phantasmal Body",
    part: "body"
  },
  {
    idx: 47,
    displayName: "Phantasm Sash",
    part: "body"
  },
  {
    idx: 48,
    displayName: "Phantasmal body of the Veil",
    part: "body"
  },
  {
    idx: 49,
    displayName: "Phantasmal body of the Void",
    part: "body"
  },
  {
    idx: 50,
    displayName: "Putrid Rags",
    part: "body"
  },
  {
    idx: 51,
    displayName: "Reaper Robe",
    part: "body"
  },
  {
    idx: 52,
    displayName: "Red Death Cape",
    part: "body"
  },
  {
    idx: 53,
    displayName: "Regal Decay",
    part: "body"
  },
  {
    idx: 54,
    displayName: "Regal Undead",
    part: "body"
  },
  {
    idx: 55,
    displayName: "Shade Spectral Body",
    part: "body"
  },
  {
    idx: 56,
    displayName: "Skeleton",
    part: "body"
  },
  {
    idx: 57,
    displayName: "Skeleton in Red Boots",
    part: "body"
  },
  {
    idx: 58,
    displayName: "Skeleton in Spandex",
    part: "body"
  },
  {
    idx: 59,
    displayName: "Skeleton with Sash",
    part: "body"
  },
  {
    idx: 60,
    displayName: "Skipper Ghost",
    part: "body"
  },
  {
    idx: 61,
    displayName: "Supreme Emperor Lich Armor",
    part: "body"
  },
  {
    idx: 62,
    displayName: "Technicolor Skeleton",
    part: "body"
  },
  {
    idx: 63,
    displayName: "Undead Swashbuckler",
    part: "body"
  },
  {
    idx: 64,
    displayName: "Vile Skeleton",
    part: "body"
  },
  {
    idx: 65,
    displayName: "White Chiffon",
    part: "body"
  },
  {
    idx: 66,
    displayName: "Wight Cape",
    part: "body"
  },
  {
    idx: 67,
    displayName: "Bat Skeleton",
    description:
      "The Bat Skeleton is one of many reanimated Soul Familiars. Despite their lack of wings, Bat Skeletons still retain the ability of flight, and their approach can be heard in the scrape and rattle of their flapping bones.",
    part: "familiar"
  },
  {
    idx: 68,
    displayName: "Blaze Frog",
    description:
      "Not to be confused with an Ember Frog, the Blaze Frog is a Soul Familiar that is perpetually on aflame. This is the result of contact with The Sacred Flame. Souls value bonds with Blaze Frogs purely for pyromanic joy. These alight amphibians can be found across the Nightmare Dominion, though many prefer the habitat surrounding the Fetid Fire Canyons.",
    part: "familiar"
  },
  {
    idx: 69,
    displayName: "Bunny Skeleton",
    description:
      "The Bunny Skeleton is one of many reanimated Soul Familiars. Though many different kinds of rabbits can be reanimated through the dark art of necromancy, many Souls seek the remains of Psychic Rabbits for their undead companions.",
    part: "familiar"
  },
  {
    idx: 70,
    displayName: "Cockatrice Skeleton",
    description:
      "The Cockatrice Skeleton is a Soul Familiar which appears to consist of the bones of a Mesozoic Cockatrice, though this notion has not been confirmed by any known ornithologist. Strangely, even the reanimated skeletons of these birds retain the instinct to spirit away the eggs from nests belonging to other species.",
    part: "familiar"
  },
  {
    idx: 71,
    displayName: "Crow Skeleton",
    description:
      "Crow Skeletons are the undead remains of Crackerjack Crows after passing through the Sacred Flame. These Soul Familiars have magical flight which defies biology and collect hordes of pollutants found in the Nightmare Dominion.",
    part: "familiar"
  },
  {
    idx: 72,
    displayName: "Fox Skeleton",
    description:
      "After passing through the Sacred Flame, a Fox Trickster may transmute into a Fox Skeleton. These Soul Familiars display the same cunning as their living counterparts, and use the rattling of their reanimated bones to play tricks on unsuspecting travelers and the enemies of their Soul counterparts.",
    part: "familiar"
  },
  {
    idx: 73,
    displayName: "Ghost Bat",
    description:
      "The Ghost Bat is the discorporeal transmutation of the Forever Bat after passing with a Wizard through the Sacred Flame. Like Forever Bats, Souls who keep Ghost Bats as Familiars allow the phantom bats to feed on themselves. These Familiars feast on Souls' auras and essences rather than their blood.",
    part: "familiar"
  },
  {
    idx: 74,
    displayName: "Ghost Bunny",
    description:
      "The Ghost Bunny is a Soul Familiar, transmuted into a specter after passing with their Wizard through the Sacred Flame. Ghost Bunnies may result from the passing of rabbit Familiars, and they appear to attain similar abilities to Psychic Rabbits, forming connections to their Souls through otherworldly planes.",
    part: "familiar"
  },
  {
    idx: 75,
    displayName: "Ghost Cockatrice",
    description:
      "The Ghost Cockatrice is a Soul Familiar resulting from the passing of a Mesozoic Cockatrice through the Sacred Flame. These ghastly birds are known to haunt Cock's Comb Ridge while away from their bonded Souls. Some believe Souls occasionally migrate from the Nightmare Dominion to the Ridge due to high concentrations of power achieved for their Familiars by way of proximity to the area.",
    part: "familiar"
  },
  {
    idx: 76,
    displayName: "Ghost Crow",
    description:
      "The Ghost Crow is a transmuted form of the Crackerjack Crow once passed throuogh the Sacred Flame. It is a Soul Familiar which is known to make false bonds with other Souls in order to intercept knowledge for the Soul with whom it has a true bond. These Souls refer to this false Familiarity as an act \"perching.\"",
    part: "familiar"
  },
  {
    idx: 77,
    displayName: "Ghost Fox",
    description:
      "The Ghost Fox is a product of transmutation when a Fox Trickster passes through the Sacred Flame. Like the Trickster Foxes from which they result, these Soul Familiars are known to spend large swathes of time away from their bonded Souls making mischief and haunting various locales and people.",
    part: "familiar"
  },
  {
    idx: 78,
    displayName: "Ghost Frog",
    description:
      "The Ghost Frog is a Soul Familiar resulting from passage through the Sacred Flame. Though they possess the power of levitation, as all ghosts do, these curious phantasms prefer to leap as they did in life. This is likely leftover instinct from days before meeting the Flame.",
    part: "familiar"
  },
  {
    idx: 79,
    displayName: "Ghost Hummingbird",
    description:
      "The Ghost Hummingbird is a Soul Familiar resulting from the passage of Jewled Hummingbirds through the Sacred Flame. Strangely, when in flight, these ghosts still produce the same humming rhythm of their living counterparts. Many Souls bonded to Ghost Hummingbirds are known for this preamble which precedes them.",
    part: "familiar"
  },
  {
    idx: 80,
    displayName: "Ghost Monkey",
    description:
      "The Ghost Monkey is a transmuted Soul Familiar resulting from passage through the Sacred Flame. This Familiar is known to attempt to pull its bonded Souls toward Merlin's Tower as if their fates are all intertwined. The Ghost Monkey is also able to duplicate itself and bond with multiple Souls. The frequency of this duplications and the parameters under which it is possible is unknown.",
    part: "familiar"
  },
  {
    idx: 81,
    displayName: "Ghost Owl",
    description:
      "The Ghost Owl is the result of a Great Owl passing through the Sacred Flame. It is widely believed that these Familiars migrate to the Great Owl Obelisk late in the year due to pervasive feelings of unnatural presence at the Obelisk during that time. There is no recorded confirmation of this migratory pattern.",
    part: "familiar"
  },
  {
    idx: 82,
    displayName: "Ghost Rat",
    description:
      "The Ghost Rat may result from a Plague Rat or a Blue Rat through the Sacred Flame. Ghost Rats provide a constant source of annoyance for Skeleton Cats, who attempt to capture them. These ghosts also occasionally take residence in Wizard dwellings, ruining alchemical ingredients.",
    part: "familiar"
  },
  {
    idx: 83,
    displayName: "Ghost Slime",
    description:
      "The Ghost Slime is the result of the passing of a Slime Familiar through the Sacred Flame. Ghost Slime physiology is strange and exist partially between the realm of Reality and the realm of spirits. The slime these ghosts leave behind can be felt on the body, but cannot be removed or washed by physical means.",
    part: "familiar"
  },
  {
    idx: 84,
    displayName: "Ghost Snail",
    description:
      "The Ghost Snail is a Soul Familiar and results from the passage of an Astral Snail through the Sacred Flame. While their living counterparts produce magical slime trails, The trails of the Ghost Snail are said to lead the living to the land of spirits.",
    part: "familiar"
  },
  {
    idx: 85,
    displayName: "Ghost Snake",
    description:
      "The Ghost Snake results from snake Familiars who pass through the Sacred Flame. Ghost Snakes often habitate and slither within the bodies of their bonded Soul. In the time of this occupancy, the bonded Soul may often take on the ability to speak with and command living serpents.",
    part: "familiar"
  },
  {
    idx: 86,
    displayName: "Ghost Wolf",
    description:
      "The Ghost Wolf is a Soul Familiar resulting from the passage of a wolf Familiar through the Sacred Flame. The ghosts can lead their bonded Souls into the land of dreams, much to the chagrin of many Dream Masters. Wizards may also find their way to the land of dreams through leadership of Ghost Wolves, though much less common.",
    part: "familiar"
  },
  {
    idx: 87,
    displayName: "Hummingbird Skeleton",
    description:
      "The Hummingbird Skeleton appears when a Jewled Hummingbird is burned within the Sacred Flame. The rattle of tiny bones as the reanimated skeleton rapidly beats its wings produces a sound that causes severe psychological damage to living creatures who hear it.",
    part: "familiar"
  },
  {
    idx: 88,
    displayName: "Ladybug Ghost",
    description:
      "The Ladybug Ghost is the remnant of a Giant Ladybug which follows its bonded Wizard into the Sacred Flame. While living Giant Ladybugs portend peace and contentedness, bearing witness to a Ladybug Ghost sets a curse of doom upon those whom it visits.",
    part: "familiar"
  },
  {
    idx: 89,
    displayName: "Plague Rat of Red Death",
    part: "familiar"
  },
  {
    idx: 90,
    displayName: "Python",
    description:
      "The Python is one of the few living creatures that may bond to Souls. Occasionally, a snake Familiar will transmute into a Python for reasons unknown. Some posit this may be due to increase in size and quality of intimidation for future existence in the Nightmare Dominion.",
    part: "familiar"
  },
  {
    idx: 91,
    displayName: "Resurrected Dodo",
    description:
      "The Resurrected Dodo may appear to Wizards without Familiars as they trasmute into Souls by passing through the Sacred Flame. This flightless bird is extinct elsewhere in the Runiverse and some say the Flame was rediscovered in ancient texts outlining a process for de-extinction of animals that once walked the world.",
    part: "familiar"
  },
  {
    idx: 92,
    displayName: "Resurrected Smilodon Kitten",
    description:
      "The Resurrected Smilodon Kitten is saber-toothed feline that may appear to some Wizards without Familiars as they pass through the Sacred Flame. These Soul Familiars do not exist anywhere else in the Runiverse outside of this occurance. Though kittens after immediate passage through the Flame, Smilodon Kittens can grow to large size and can stand up to three or more feet when on all fours with canine teeth up to 11 inches.",
    part: "familiar"
  },
  {
    idx: 93,
    displayName: "Resurrected Thylacine",
    description:
      "This striped marsupial may appear to Wizards without Familiars after passage through the Sacred Flame. The Resurrected Thylacine has a dog-like physiology with a curiously large jaw extension up to 80 degrees. The Resurrected Thylacine cannot be found in the Runiverse outside of this occurrence.",
    part: "familiar"
  },
  {
    idx: 94,
    displayName: "Skeleton Cat",
    description:
      "This Skeleton Cat is a result of a feline Familiar passing through the Sacred Flame. These skeletons are known to occasionally hunt Skeleton Rats and Ghost Rats, sometimes returning them to their bonded Soul as gifts. As they are undead, these creatures often return to their own bonded Souls, but cannot do so until revealing a secret.",
    part: "familiar"
  },
  {
    idx: 95,
    displayName: "Skeleton Dog",
    description:
      "The Skeleton Dog is the result of a dog Familiar following its bonded Wizard into the Sacred Flame. These undead creatures seem to have retained all of their quirks from life, including the desire for a scratch around their ear cavity or underside. Skeleton Dogs are also known to gnaw on their own legs.",
    part: "familiar"
  },
  {
    idx: 96,
    displayName: "Skeleton Frog",
    description:
      "The Skeleton Frog is a Soul Familiar resulting from a Wizard's Frog passing through the Sacred Flame. Hearing a croak from a Skeleton Frog is considered to be a death knell among many living Wizards. Some also believe these creatures to have ectoplasmic tongues.",
    part: "familiar"
  },
  {
    idx: 97,
    displayName: "Skeleton Monkey",
    description:
      "The Skeleton Monkey is the result of a Wizard's monkey Familiar passing through the Sacred Flame. These necromantic primates are agile and often hang from their still-prehensile tails. Although small, the Skeleton Monkey makes a perfect companion for Souls and can be quite intimidating due to the exposed teeth of its visage and a seemingly endless energy.",
    part: "familiar"
  },
  {
    idx: 98,
    displayName: "Skeleton Owl",
    description:
      "The Skeleton Owl results from a Great Owl following its bonded Wizard through the Sacred Flame. It is not uncommon for Souls to seek wisdom from Skeleton Owls, though they may spout wicked guidance instead. Strangely, these reanimated skeleton birds often prey on Ghost Rats.",
    part: "familiar"
  },
  {
    idx: 99,
    displayName: "Skeleton Rat",
    description:
      "The Skeleton Rat is a Soul Familiar and remnant of a Wizard's Rat following them into the Sacred Flame. These creatures of reanimated bone often assist Souls in finding rotting food sources. Occasionally, multiple Skeleton Rats will cohabitate closely and eventually intertwine to form Skeleton Rat Kings.",
    part: "familiar"
  },
  {
    idx: 100,
    displayName: "Skeleton Snake",
    description:
      "The Skeleton Snake is a reanimated bone Soul Familiar which results when a Wizard's Snake Familiar follows them into the Sacred Flame. Bites from a Skeleton Snake result in immediate death, though there is no biological reasoning to explain this lethality.",
    part: "familiar"
  },
  {
    idx: 101,
    displayName: "Wolf Skeleton",
    description:
      "The Wolf Skeleton is the result of a Wizard's Wolf Familiar passing with them through the Sacred Flame. The Wolf Skeleton will consider any other reanimated skeleton part of its pack unless shown aggression. Wolf Skeletons are known to lead hordes of Souls and their Familiars for the Lich Emperor Supreme in his never-ending war against the Zombie King of the Undead.",
    part: "familiar"
  },
  {
    idx: 102,
    displayName: "Zombie Bunny",
    description:
      "The Zombie Bunny is a result of a Wizard's Rabbit Familiar passing with them through the Sacred Flame. This Soul Familiar's flesh is rotting and decayed, and through the Sacred Flame, it has acquired a taste for living brains.",
    part: "familiar"
  },
  {
    idx: 103,
    displayName: "Zombie Cat",
    description:
      "The Zombie Cat is a Soul Familiar that results from a Wizard's Cat Familiar following them into the Sacred Flame. These zombies are known to devour the brain of wounded creatures and curl up in their skulls. Zombie Cats are often seen with bare skeletal tails—their flesh often left upon the legs of those who have won their favor.",
    part: "familiar"
  },
  {
    idx: 104,
    displayName: "Zombie Crow",
    description:
      "The Zombie Crow is a Soul Familiar resulting from a Wizard's Crow Familiar passing through the Sacred Flame. Zombie Crows gather in murders to attack and feed not on carrion, but the living who dare trespass in the Nightmare Dominion. These decaying birds are known to make nests of small bones.",
    part: "familiar"
  },
  {
    idx: 105,
    displayName: "Zombie Fox",
    description:
      "The Zombie Fox is a Soul Familiar that results from a Fox Familiar following its bonded Wizard into the Sacred Flame. These Zombie Foxes do not display the same cunning as their living counterparts, or even the same intelligence of Fox Skeletons or Ghost Foxes. They crave the taste of living flesh and lie in wait to enact witless ambushes to attain it.",
    part: "familiar"
  },
  {
    idx: 106,
    displayName: "Zombie Monkey",
    description:
      "The Zombie Monkey is a Soul Familiar which results from a Wizard's Monkey Familiar passing through the Sacred Flame. The Zombie Monkey is a crazed beast that no living being would ever desire to encounter. Like other zombie creatures, the Zombie Monkey has lost all of its living sensibilities and acts in frightful pursuit of flesh on which to feast. Even many Souls fear the frenzy of these small yet powerful creatures.",
    part: "familiar"
  },
  {
    idx: 107,
    displayName: "Zombie Rat",
    description:
      "The Zombie Rat is a Soul Familiar which results from transmutation of a Wizard's Rat Famliar by the Sacred Flame. The Zombie Rat is small but deadly, carrying disease much like that of the Plague Rat. The bite of a Zombie Rat, however, will turn other living beings into drooping undead husks. The Zombie King of the Undead is known to collect large swathes of Zombie Rats in order to strengthen his legions in the endless war against the Lich Emperor Supreme.",
    part: "familiar"
  },
  {
    idx: 108,
    displayName: "Zombie Wolf",
    description:
      "The Zombie Wolf is a Soul Familiar which results from the passing of a Wizard's Wolf Familiar through the Sacred Flame. The Zombie Wolf is loyal to its bonded Soul, rarely leaving their side. However, Zombie Wolves retain the instincts and pack tactics from their days of life and can be seen leading legions of undead under the banner of the Zombie King in his war against the Lich Emperor Supreme.",
    part: "familiar"
  },
  {
    idx: 109,
    displayName: "Angelic Dotta",
    part: "head"
  },
  {
    idx: 110,
    displayName: "Anuran Skull",
    part: "head"
  },
  {
    idx: 111,
    displayName: "Blight Zombie",
    part: "head"
  },
  {
    idx: 112,
    displayName: "Blood Eater Revenant",
    part: "head"
  },
  {
    idx: 113,
    displayName: "Braindrain Skull",
    part: "head"
  },
  {
    idx: 114,
    displayName: "Canaanite Skull",
    part: "head"
  },
  {
    idx: 115,
    displayName: "Captian of the Namesake",
    part: "head"
  },
  {
    idx: 116,
    displayName: "Channel 1 Poltergeist",
    part: "head"
  },
  {
    idx: 117,
    displayName: "Channel 3 Poltergeist",
    part: "head"
  },
  {
    idx: 118,
    displayName: "Consumption Zombie",
    part: "head"
  },
  {
    idx: 119,
    displayName: "Corvid Skull",
    part: "head"
  },
  {
    idx: 120,
    displayName: "Count Orlok",
    part: "head"
  },
  {
    idx: 121,
    displayName: "Death Shroom",
    part: "head"
  },
  {
    idx: 122,
    displayName: "Disgusting Revenant",
    part: "head"
  },
  {
    idx: 123,
    displayName: "Ecto Spectre",
    part: "head"
  },
  {
    idx: 124,
    displayName: "Eldritch Horror",
    part: "head"
  },
  {
    idx: 125,
    displayName: "Ethereal Spectre",
    part: "head"
  },
  {
    idx: 126,
    displayName: "Evil One's Skull",
    part: "head"
  },
  {
    idx: 127,
    displayName: "Eyeball Fireball",
    part: "head"
  },
  {
    idx: 128,
    displayName: "Felis Skull",
    part: "head"
  },
  {
    idx: 129,
    displayName: "Furgnome Ghost",
    part: "head"
  },
  {
    idx: 130,
    displayName: "Gangrene Zombie",
    part: "head"
  },
  {
    idx: 131,
    displayName: "Ghost Flame",
    part: "head"
  },
  {
    idx: 132,
    displayName: "Ghost Pumpkin",
    part: "head"
  },
  {
    idx: 133,
    displayName: "Ghoul of Bloodlust",
    part: "head"
  },
  {
    idx: 134,
    displayName: "Ghoul of Shade",
    part: "head"
  },
  {
    idx: 135,
    displayName: "Ghoul of Sickness",
    part: "head"
  },
  {
    idx: 136,
    displayName: "Glitched Poltergeist",
    part: "head"
  },
  {
    idx: 137,
    displayName: "Golden Lich",
    part: "head"
  },
  {
    idx: 138,
    displayName: "Gouged Revenant",
    part: "head"
  },
  {
    idx: 139,
    displayName: "Gremplin Ghost",
    part: "head"
  },
  {
    idx: 140,
    displayName: "Grim Reaper's Skull",
    part: "head"
  },
  {
    idx: 141,
    displayName: "Holy Spectre",
    part: "head"
  },
  {
    idx: 142,
    displayName: "Horned Phantasm",
    part: "head"
  },
  {
    idx: 143,
    displayName: "Houngan Death Lord",
    part: "head"
  },
  {
    idx: 144,
    displayName: "Hue Skeleton",
    part: "head"
  },
  {
    idx: 145,
    displayName: "Hunter Skull",
    part: "head"
  },
  {
    idx: 146,
    displayName: "Imp Skull",
    part: "head"
  },
  {
    idx: 147,
    displayName: "Jane Doe",
    part: "head"
  },
  {
    idx: 148,
    displayName: "King of the Dead",
    part: "head"
  },
  {
    idx: 149,
    displayName: "Kobold Skull",
    part: "head"
  },
  {
    idx: 150,
    displayName: "Lewd Revenant",
    part: "head"
  },
  {
    idx: 151,
    displayName: "Lich Baron",
    part: "head"
  },
  {
    idx: 152,
    displayName: "Lich Cyborog",
    part: "head"
  },
  {
    idx: 153,
    displayName: "Lich Despot",
    part: "head"
  },
  {
    idx: 154,
    displayName: "Lich Duke",
    part: "head"
  },
  {
    idx: 155,
    displayName: "Lich Emperor",
    part: "head"
  },
  {
    idx: 156,
    displayName: "Lich Marquis",
    part: "head"
  },
  {
    idx: 157,
    displayName: "Marie Laveau",
    part: "head"
  },
  {
    idx: 158,
    displayName: "Mary Tudor",
    part: "head"
  },
  {
    idx: 159,
    displayName: "Pale Ghoul",
    part: "head"
  },
  {
    idx: 160,
    displayName: "Paranormal Phantasm",
    part: "head"
  },
  {
    idx: 161,
    displayName: "Phantasm of the Veil",
    part: "head"
  },
  {
    idx: 162,
    displayName: "Phantasm of the Void",
    part: "head"
  },
  {
    idx: 163,
    displayName: "Putrid Zombie",
    part: "head"
  },
  {
    idx: 164,
    displayName: "Rotten Revenant",
    part: "head"
  },
  {
    idx: 165,
    displayName: "Salacious Ghoul",
    part: "head"
  },
  {
    idx: 166,
    displayName: "Shade Spectre",
    part: "head"
  },
  {
    idx: 167,
    displayName: "Soul of Wooden Boy",
    part: "head"
  },
  {
    idx: 168,
    displayName: "The Masque",
    part: "head"
  },
  {
    idx: 169,
    displayName: "Toru",
    part: "head"
  },
  {
    idx: 170,
    displayName: "Transcendent Illuminatus",
    part: "head"
  },
  {
    idx: 171,
    displayName: "Veggie Ghost",
    part: "head"
  },
  {
    idx: 172,
    displayName: "Wild Zombie",
    part: "head"
  },
  {
    idx: 173,
    displayName: "Wolfkin Skull",
    part: "head"
  },
  {
    idx: 174,
    displayName: "Wraith Captain",
    part: "head"
  },
  {
    idx: 175,
    displayName: "Wraith Deacon",
    part: "head"
  },
  {
    idx: 176,
    displayName: "Wraith Devout",
    part: "head"
  },
  {
    idx: 177,
    displayName: "Wraith Knight",
    part: "head"
  },
  {
    idx: 178,
    displayName: "A Big Magic Stick with Ether Fire",
    description:
      "It’s A Big Magic Stick with Ether Fire. To assume its form, the Soul wielding this Big Stick must garner its ever-burning ether fire from the stolen and snapped Ether Staff of a Wizard.",
    part: "prop"
  },
  {
    idx: 179,
    displayName: "A dumb stick... on fire",
    description:
      "All the power of A Dumb Stick…On Fire originates from the Soul who holds it. Like the unburned Dumb Stick, those on fire can channel great strength. This unassuming wand can only properly be used by the most formidable Souls of The Nightmare Dominion.",
    part: "prop"
  },
  {
    idx: 180,
    displayName: "Anti Hourglass",
    description:
      "The sands of the Anti Hourglass defy reason and gravity, curiously drifting upward into the top chamber from the bottom. Souls wielding the Anti Hourglass may reverse Time, but all changes made in the alternate timeline must be at the service of The Nightmare Dominion or the Soul will become reduced to a pile of ash.",
    part: "prop"
  },
  {
    idx: 181,
    displayName: "Bag of Cataclysm",
    description:
      "Beware the Bag of Cataclysm. Not even the Souls who hold this bag are aware of the devastation that may be wrought by what it produces. It is lined with Dark Magic and has a hunger for destruction to rival The Quantum Shadow.",
    part: "prop"
  },
  {
    idx: 182,
    displayName: "Banshee's Bell",
    description:
      "The Banshee’s Bell is an instrument that should be struck with caution, as its ringing will herald Death Itself. Instead of the sweet and seductive tone of the Siren’s Bell, the Banshee’s Bell emits a horrible wailing sound when rung by a Soul.",
    part: "prop"
  },
  {
    idx: 183,
    displayName: "Banshee's Harp",
    description:
      "The Banshee’s Harp is an instrument of Dark Magic that should be plucked with caution, as the vibration of its strings will herald Death Itself. Some who claim to have heard the Banshee’s Harp say that its strings somehow moan the genealogy of the listener in a terrible lamentation. Its song is nothing like the seductive tune of the Siren's Harp.",
    part: "prop"
  },
  {
    idx: 184,
    displayName: "Basilisk's Hiss: the Heat Spell",
    description:
      "Basilisk’s Hiss is a Dark Magic Soul spell which generates an unburning, magical heat that causes the victim to recede into their own tortured mind. Rumors in the Nightmare Dominion claim that the Basilisk’s Hiss was first learned by observing internal combustion of machines with Artificial Intelligence.",
    part: "prop"
  },
  {
    idx: 185,
    displayName: "Black Sun Staff",
    description:
      "The Black Sun Staff, sometimes referred to as the Crow’s Head Staff, is a powerful focus for Dark Magic used by many Souls. It is a black rod with an ominous, lurid finial with the appearance of a black sun. Magic cast through the Black Sun staff causes dissolution and decomposition.",
    part: "prop"
  },
  {
    idx: 186,
    displayName: "Blood Moon Staff",
    description:
      "The Blood Moon Staff is a rod favored by Souls with a red moon finial used for casting Dark Magic. Spells cast with the Blood Moon Staff are most effective in the dark cover of night, but its true power is revealed during lunar eclipses, when the moon of the Runiverse shines with a deep red hue.",
    part: "prop"
  },
  {
    idx: 187,
    displayName: "Book of Dark Magic",
    description:
      "Just as most Wizards possess a Book of Magic, most Souls possess a Book of Dark Magic. When a Wizard transmutes into a Soul by The Sacred Flame, the magical book to which they are connected—containing their personal philosophies, spells, and reveries—also transforms to reflect their new form.",
    part: "prop"
  },
  {
    idx: 188,
    displayName: "Broom on Fire",
    description:
      "Not just any Broom on Fire, but a magical broom touched with Guillaume’s gift of flight and cursed with the flame of the Fetid Fire Canyon. Many Souls of the Nightmare Dominion will make the \"Crow’s Pilgrimage\" to the Fire Canyon to light the ends of their brooms with an ever-burning flame, signifying their bond with the land of Nightmares.",
    part: "prop"
  },
  {
    idx: 189,
    displayName: "Bugbear's Flame: the Discombobulation Spell",
    description:
      "Bugbear’s Flame is a spell used by Souls which draws energy and inspiration from the mischievous Bugbears. While not particularly useful when used against opposing denizens of the Nightmare Dominion, this Discombobulation Spell leaves Wizards’ heads spinning with the bizarre sound of bongos that fill their minds, causing severe confusion.",
    part: "prop"
  },
  {
    idx: 190,
    displayName: "Candle of Clairvoyance",
    description:
      "The Candle of Clairvoyance is a greatly valued asset to Souls of the Nightmare Dominion and in the war of the Lich Emperor Supreme and the Zombie King of the Undead. Both sides covet the Candle of Clairvoyance, seeking Souls who might be able to see deeply into fire of the burning wick and provide advantage in the knowledge of their opponent’s plans and intentions.",
    part: "prop"
  },
  {
    idx: 191,
    displayName: "Charred Bone Stave",
    description:
      "The Charred Bone Stave is a Bone Stave which was transmuted with a Wizard through the Sacred Flame. When a Bone Stave is charred by the profanity of the Sacred Flame, it becomes a focus for Black Magic and will miscast if used as a conduit for any other forms of Color Magic.",
    part: "prop"
  },
  {
    idx: 192,
    displayName: "Charred Pipe",
    description:
      "It’s a Charred Pipe. Still works, though. Souls frequently use their Charred Pipes for inhalation of a variety of noxious hallucinogenic substances foraged in the Nightmare Dominion. Witches enjoy finding discarded and misplaced Charred Pipes, scraping resin from the bowls into their cauldrons to imbue potions with a malignant edge.",
    part: "prop"
  },
  {
    idx: 193,
    displayName: "Cockatrice hatchling",
    description:
      "The Cockatrice Hatchling is a Cockatrice which has barely emerged from its shell. In the domestic care of a bonded Soul, these hatchlings may stay nestled in their eggs for up to a year.",
    part: "prop"
  },
  {
    idx: 194,
    displayName: "Death Adder Rod",
    description:
      "The Death Adder Rod is a magical focus for Souls. It may also be cast before its wielder to transform into a giant black serpent over which the Soul has little control, unlike Wizards with their Mamba Sticks. While a Death Adder Rod in its snake-form will not become aggressive toward Wizards or Warriors, they are known to consume familiars and companions, inflicting much psychological damage. However, a Death Adder Rod will not attack a Golden Toad.",
    part: "prop"
  },
  {
    idx: 195,
    displayName: "Death Crook",
    description:
      "While the Soul Harvester may bring Death to a Wizard, the Death Crook allows a Soul to shepherd a Wizard or Warrior to Death. A person under the influence of a Death Crook becomes entranced by its wielder, spellbound by the illusion that the possessor has something that they most desire. If the Soul with the Death Crook does not continue the spell or if its spell is broken by an outside force, the transfixed victim will follow the wielder to the ends of the Runiverse.",
    part: "prop"
  },
  {
    idx: 196,
    displayName: "Death Shroom",
    description:
      "The Death Shroom is a fungus native to the Nightmare Dominion and highly prized by the Witches of The Finger. While many unsavory Wizards may forage for Death Shrooms in the Dominion for nefarious purposes, some Purple Hats report extraordinary small doses may only cause death of the ego. If left unspoiled by the touch of those seeking its magical properties, Death Shrooms will eventually gain sentience.",
    part: "prop"
  },
  {
    idx: 197,
    displayName: "Devil's Goblet",
    description:
      "A Devil’s Goblet is a Goblet of Immortality which has been transmuted with a Wizard through the Sacred Flame. The goblet holds an eternally burning fire within it. If the Soul who possesses the Goblet drank from it in their previous life as a Wizard, they must continue to imbibe its fire or forever perish. This leads to horrible disfigurations and deepens their connection with the Nightmare Dominion.",
    part: "prop"
  },
  {
    idx: 198,
    displayName: "Double Phoenix Feather",
    description:
      "While a single Phoenix Feather can resurrect a deceased Wizard, a Double Phoenix Feather can also return the dead back to the plane of the living. However, those revived with a Double Phoenix Feather are reincarnated as a vessel for the Soul who revived them, expanding the consciousness of the Soul wielding the Double Phoenix Feather and diminishing the spirit of their victim.",
    part: "prop"
  },
  {
    idx: 199,
    displayName: "Dragon hatchling",
    description:
      "The Dragon Hatchling is a young dragon which has not yet fully emerged from its shell. It is not known why so many Dragon Hatchlings appear to be in the care of Souls of the Nightmare Dominion. The largely infrequent sightings of dragons across the Runiverse has caused many Wizards to wonder about the vile purposes for which Souls might use these hatchlings.",
    part: "prop"
  },
  {
    idx: 200,
    displayName: "Dryad's Decay: the Rafflesia Spell",
    description:
      "Drayd’s Decay is a bastardization of the Dryad’s Ear spell known among the Wizards. When a Soul casts Dryad’s Decay, they are only channeling the force of the plant family Rafflesiaceae. This spell causes its victim to become odorous with the unbearable stench of rotting flesh. While this may be misfortune enough for some, their new foul and repugnant aura also attracts Blood Eating Revenants and Ghouls of Bloodlust who may feast upon them.",
    part: "prop"
  },
  {
    idx: 201,
    displayName: "Dwarve's Heart: the Diamond Spell",
    description:
      "Dwarve’s Heart is a powerful spell which may be learned by Souls of the Nightmare Dominion. A Soul who casts Dwarve’s Heart can turn their victim into a diamond. The essence of the sufferer’s greed is compacted into a hard gem with its size determined by their lust for wealth. This makes Red Hats particular targets of Dwarve’s Heart, and the diamonds they produce fetch high prices in Gorgon City.",
    part: "prop"
  },
  {
    idx: 202,
    displayName: "Empty Mug of Ale",
    description:
      "An Empty Mug of Ale, bereft of any liquid to quench a Soul’s thirst. Those who hold the Empty Mug of Ale are cursed with the inability to enjoy drink or to satiate their desire for drink until they pass the mug to another. Any liquid poured into it evaporates instantaneously. Souls in the Nightmare Dominion are wary about taking mugs from anyone they do not know personally. Even so, it is not unlike a denizen of the Dominion to coerce an acquaintance to carry the burden.",
    part: "prop"
  },
  {
    idx: 203,
    displayName: "Entropy Staff",
    description:
      "The Entropy Staff is a powerful rod wielded by Souls which contains the ability to disseminate the Magic of a Wizard back into the world, eliminating their corporeal form. The rod is topped with a finial in the shape of a ram's skull with spiraling horns and glowing red eyes. Purple Hats are impervious to spells cast from an Entropy Staff.",
    part: "prop"
  },
  {
    idx: 204,
    displayName: "Ether Staff 2.0",
    description:
      "The Ether Staff 2.0 is an iteration on the Ether Staff. Souls wielding the Ether Staff 2.0 must infuse a portion of their own Magic within the rod upon its first handling. After this initial staking of power, the user can tap into the Magic of all of the staff's previous owners.",
    part: "prop"
  },
  {
    idx: 205,
    displayName: "Fire Stone Staff",
    description:
      "The Fire Stone Staff is a magical focus for Souls which holds a suspended Fire Stone in its crook. This mystical gem draws energy from the Sacred Flame—the First Fire—giving spells cast from the staff a similar effect of perverse transmutation in its resulting fire.",
    part: "prop"
  },
  {
    idx: 206,
    displayName: "Flaming Rose",
    description:
      "The Flaming Rose twists the beauty of the Eternal Rose upon meeting the Sacred Flame, culling the rose's gift of passion and transmuting it into a magical item with the ability to cast spells of lust and base desire.",
    part: "prop"
  },
  {
    idx: 207,
    displayName: "Forever Sparkler",
    description:
      "An unassuming magical focus, the Forever Sparkler is a wand used by many Souls of the Nightmare Dominion. While it may have a jovial appearance, the Forever Sparkler crackles endlessly with an unnatural heat, and these sparklers are often found in many smithies across the Dominion as tools for welding.",
    part: "prop"
  },
  {
    idx: 208,
    displayName: "Fresh Brains",
    description:
      "These are Fresh Brains from a now-deceased creature. Many Souls may be found wandering the Nightmare Dominion with Fresh Brains as a ghastly meal or for other unsavory purposes.",
    part: "prop"
  },
  {
    idx: 209,
    displayName: "Ghost Torch",
    description:
      "The Ghost Torch is a magical item found in the Nightmare Dominion which burns with the unfulfilled desires of a tortured poltergeist. The Ghost Torch peels back the plane of reality allowing the wielding Soul to peer into the Realm of Spirits as a light peels back the darkness.",
    part: "prop"
  },
  {
    idx: 210,
    displayName: "Ghoul Stone Staff",
    description:
      "The Ghoul Stone Staff is a magical rod with a suspended teal gem in its crescent crook. This Ghoul Stone has the power to summon a cadre of Ghouls to the staff's wielder, but the control a wielder might exert over these Ghouls is dependent entirely upon their own connection with the Nightmare Dominion.",
    part: "prop"
  },
  {
    idx: 211,
    displayName: "Golden Caduceus",
    description:
      "The Golden Caduceus results from a Caduceus passing through the Sacred Flame. This golden counterpart possess a similar healing property, though with a necromantic edge. Those healed with a Golden Caduceus eventually rot, revealing an animated Gold Skeleton.",
    part: "prop"
  },
  {
    idx: 212,
    displayName: "Golden Unihorn",
    part: "prop"
  },
  {
    idx: 213,
    displayName: "Hamlet's Skull",
    description:
      "\"I knew him, Horatio.\" Hamlet's Skull is a skull once owned by a prince in the time before the Technological Singularity. The skull belonged to a friend of the prince—a fellow of infinite jest. Wielding Hamlet's skull causes great apathy to opponents and stymies action in the ponderance of Death.",
    part: "prop"
  },
  {
    idx: 214,
    displayName: "Howl of Cerberus: the Black Flame Spell",
    description:
      "Howl of Cerberus is a spell for Souls with the appearance of a black flame. When cast, this dark flame transforms into a ghostly three-headed dog, letting out a spectral howl that echoes through the Nightmare Dominion, disorienting any listeners around the caster.",
    part: "prop"
  },
  {
    idx: 215,
    displayName: "Inverted Horseshoe",
    description:
      "Where the Lucky Horseshoe wards against Black Magic, the Inverted Horseshoe invites Black Magic. Many haunts of the Nightmare Dominion have Inverted Horseshoes above their doorways which prevent entry of practitioners of other schools of Color Magic.",
    part: "prop"
  },
  {
    idx: 216,
    displayName: "Joker Card",
    description:
      "An unexpected magical token, the Joker Card holds a power borne of the twisted and shuffling imagination of Souls of the Nightmare Dominion. There is no particular use for the Joker Card, and its ability is entirely dependent on its wielder.",
    part: "prop"
  },
  {
    idx: 217,
    displayName: "Marie's Candle",
    description:
      "Marie's Candle embodies the energy of a pre-singularity priestess. The wielding Soul may enter a state of trance, allowing themself to become possessed by other spirits as a medium for others to speak between dimensions of reality.",
    part: "prop"
  },
  {
    idx: 218,
    displayName: "Mary's Torch",
    description:
      "Mary's Torch is a peculiar Magic item that gains power each time it is used as the initial flame for an execution by fire. It is largely considered to draw its energy through Time from a queen who reigned before the Singularity.",
    part: "prop"
  },
  {
    idx: 219,
    displayName: "Medusa's Eye",
    description:
      "Medusa's Eye is a threatening optic organ removed from an ancient Gorgon. When wielded by Souls of the Nightmare Dominion, this bloodshot eye retains its power to turn anyone who catches its gaze to stone.",
    part: "prop"
  },
  {
    idx: 220,
    displayName: "Mystic Ice Cream melted",
    description:
      "It's a Mystic Ice Cream Melted. Even a Mystic Ice Cream cannot withstand the heat of passing through the Sacred Flame, melting it into a dismal mess and causing great despondence in all who see it.",
    part: "prop"
  },
  {
    idx: 221,
    displayName: "Neutron Star Staff",
    description:
      "The Neutron Star Staff is a magical rod wielded by Souls of the Nightmare Dominion. They draw their energy from collapsed stars along with Solar and Stellar Staves which have been broken.",
    part: "prop"
  },
  {
    idx: 222,
    displayName: "Nixie's Lament: the Rain Spell",
    description:
      "Calling upon the misery of water spirits who have been kept from their homes in waterfalls and brooks, Nixie's Lament is a spell harnessed by Souls of the Nightmare Dominion. This rain spell is often used to summon torrents of rain to destroy crops and flood areas, making them inhospitable.",
    part: "prop"
  },
  {
    idx: 223,
    displayName: "Odin's Despair: the Dark Cloud Spell",
    description:
      "Odin's Despair is a spell practiced by Souls of the Nightmare Dominion which gathers darkness above its victims head. This cloud will follow the target for varying lengths of time until a sudden lightning strike dispatches them.",
    part: "prop"
  },
  {
    idx: 224,
    displayName: "Penumbra Potion",
    description:
      "The Penumbra Potion is a magical potion which divides those who imbibe it into two distinct forms, creating a shade of the drinker. The shade is free to wander in its own course, and only masterful Souls are able to exert control over its actions. The shade eventually reforms with its original body unless more Penumbra Potion is consumed.",
    part: "prop"
  },
  {
    idx: 225,
    displayName: "Pixie's Dance: the Razzle Spell",
    description:
      "Pixie's Dance is a spell practiced by Souls of the Nightmare Dominion which conjures a group of small sprites who dance about the head of the spell's target, causing an overwhelming sense of merriment and confusion. Occasionally, one of the pixies will follow the target for the remainder of their life.",
    part: "prop"
  },
  {
    idx: 226,
    displayName: "Platypus hatchling",
    description:
      "The Platypus Hatchling is a platypus who has yet to fully leave their egg. Souls of the Nightmare Dominion often bond to these creatures, commiserating in their identification as misfits. However, it is not understood why this bond never results in Familiarity.",
    part: "prop"
  },
  {
    idx: 227,
    displayName: "Poison Apple",
    description:
      "The Poison Apple is a malevolent magical item notoriously rumored to lure those who ingest it into an eternal slumber which can only be broken by true love's first kiss. However, it is well known in the Nightmare Dominion that eating a Poison Apple will result in death.",
    part: "prop"
  },
  {
    idx: 228,
    displayName: "Quantum Key",
    description:
      "The Quantum Key is a mysterious magical item which many historians posit open the Quantum Lock—a theoretical bar preventing those in the Runiverse from reaching The Quantum Ouroboros. Others say the Quantum Key was once used to open the hypothesized Lock, releasing The Quantum Shadow.",
    part: "prop"
  },
  {
    idx: 229,
    displayName: "Quartz Orbuculum",
    description:
      "The Quartz Orbuculum is a scrying tool used by pondering Souls to peer into the unseen. Unlike the Crystal Ball, the Quartz Orbuculum may only reveal happenings within the Nightmare Dominion.",
    part: "prop"
  },
  {
    idx: 230,
    displayName: "Reaping Hook",
    description:
      "The Reaping Hook, or sickle, is a nonmagical yet dangerous improvised weapon wielded by some Souls of the Nightmare Dominion. Though it does not contain powers in or of itself, it can occasionally be used as a focus for Dark Magic if properly attuned.",
    part: "prop"
  },
  {
    idx: 231,
    displayName: "Rusted Cutlass",
    description:
      "It's a Rusted Cutlass. It's seen better days; once polished and sharpened to a fine edge, now it is dull with oxidation and neglect in the Nightmare Dominion. A rusted cutlass can still be quite menacing, though. Even a blunted blade can cause severe damage in the hands of a Soul.",
    part: "prop"
  },
  {
    idx: 232,
    displayName: "Seraphim's Touch: the Life Spell",
    description:
      "Seraphim's Touch is a spell practiced by Souls of the Nightmare Dominion which has the ability to give life to any object. However, Seraphim's Touch cannot be used to reanimate a corpse, and when attempted, it drains the life force from the caster. Some say Seraphim's Touch played a part in the origin of Bread Friend.",
    part: "prop"
  },
  {
    idx: 233,
    displayName: "Skeleton Key",
    description:
      "The Skeleton Key is a key with a skeleton's skull as its bow. Skeleton Keys are magical, and their cuts change depending on the lock into which they are inserted. A Skeleton Key can open many different doors in the Runiverse, but contrary to popular belief, they cannot open every door. For this, one must need a Bear Paw.",
    part: "prop"
  },
  {
    idx: 234,
    displayName: "Soul Reaper Scythe",
    description:
      "The Soul Reaper Scythe is a mystical scythe with the power to reap the Soul of a Wizard, drawing their essence into the weapon and increasing its horrific strength in a macabre feat of Dark Magic.",
    part: "prop"
  },
  {
    idx: 235,
    displayName: "Spectre Stone Staff",
    description:
      "The Spectre Stone Staff is a magical rod wielded by Souls. Taking up this staff grants the ability to call upon various spectres to torture and haunt the intended target. Occasionally, the spectre will have an affinity for the victim and tarry with them for the rest of their days.",
    part: "prop"
  },
  {
    idx: 236,
    displayName: "Staff of Red Death",
    part: "prop"
  },
  {
    idx: 237,
    displayName: "Sulfer Spear",
    description:
      "The Sulfer Spear is a legendary weapon of the Nightmare Dominion forged in the black heart of the Runiverse's Underworld and wielded by a golden lich. Wounds caused by the Sulfer Spear have a prolonged effect and are nonfatal at the time of injury. However, severe rashes expand from the wounds until the entire body is covered while simultaneous respiratory infection slowly strangulates.",
    part: "prop"
  },
  {
    idx: 238,
    displayName: "The Everlasting Supreme Love Spell",
    description:
      "The Everlasting Supreme Love Spell is a spell for Souls which binds its target to the caster in an eternal and unbreakable love. This spell is necessarily malicious in its intent, and has been barred from use by Wizards. However, its use is not uncommon in the Nightmare Dominion for the creation of loyal and enduring servants.",
    part: "prop"
  },
  {
    idx: 239,
    displayName: "Trapped Soul Staff",
    description:
      "The Trapped Soul Staff is a magical rod wielded by Souls of the Nightmare Dominion. Its finial takes the form of a globe with the swirling consciousness of a trapped Soul. The ability that the staff grants its wielder is entirely depended upon the captive Soul's area of expertise.",
    part: "prop"
  },
  {
    idx: 240,
    displayName: "Underworld Peyote",
    description:
      "The Underworld Peyote is an ethereal version of the peyote cactus, ingesting this plant opens a direct line of communication to the Underworld.",
    part: "prop"
  },
  {
    idx: 241,
    displayName: "Vile of Vomit",
    description:
      "It's a Vile of Vomit. In the corked tube swirls a nauseating mixture of gastric acid, saliva, mucus, bile, and partially digested food. Viles of Vomit may be used as ingredients in some potions brewed by Witches of the Finger, though the details of their concoctions are mostly kept within the Sisterhood.",
    part: "prop"
  },
  {
    idx: 242,
    displayName: "Wand of Conquest",
    description:
      "The Wand of Conquest is an instrument of Dark Magic wielded by Souls in the Nightmare Dominion. Brandishing the wand bestows the ability to vanquish foes of lesser power without engaging in combat. This determination of capability is made by the wand itself, and misjudgment of a target has been the demise of many Souls through the ages as the wand deems them weak.",
    part: "prop"
  },
  {
    idx: 243,
    displayName: "White Skull",
    description:
      "A White Skull of the deceased. Many assume that some Souls carry these skulls through the Nightmare Dominion as trophies. Others hypothesize White Skulls aid in forging a connection with the Realm of the Dead. Some historians believe Souls collect skulls as grim trinkets to remind themselves of their humanity that was lost in the Sacred Flame.",
    part: "prop"
  },
  {
    idx: 244,
    displayName: "Wilted Venus Flytrap",
    part: "prop"
  },
  {
    idx: 245,
    displayName: "Rune of Souls",
    part: "rune"
  },
  {
    idx: 246,
    displayName: "Soul Rune of Air",
    description:
      "The element of air represents intellect, communication, and knowledge. It is useful on spells related to mental clarity and wisdom. The Rune of Air whispers secrets through the leaves and guides the drifting clouds. Elusive and ever-moving, this rune is invoked by those who seek clarity of thought, swift movement, or freedom from worldly constraints. Uvlius's studies of Runes conclude that the Rune of Air is not directly tied to a word in this set, but he theorizes it may govern the unseen ideas that connect all things, the breath between words.",
    part: "rune"
  },
  {
    idx: 247,
    displayName: "Soul Rune of Brass",
    description:
      "Forged in smoke and solder, the Rune of Brass hums with the resonance of invention. It is the rune of artisans, tinkerers, and machines that seem to think for themselves. Brass binds structure to spirit. Uvlius has yet to complete his association of Brass with a specific Word, though he believes it resonates strongly with tools, melody, or measure.",
    part: "rune"
  },
  {
    idx: 248,
    displayName: "Soul Rune of Brimstone",
    description:
      'The Rune of Brimstone embodies purification through fire—capable of both cleansing and total destruction in large quantities. This rune is used to eradicate the old, broken, or impure, making way for renewal and new beginnings. The Rune of Brimstone crackles with the power of rebellion and change. It is invoked in moments of defiance, when the status quo must be burned away to make room for something new. Uvlius\'s studies of Runes conclude that the Rune of Brimstone is often represented by the word "Defy", as brimstone conjures rebellion, fire, and the will to break boundaries.',
    part: "rune"
  },
  {
    idx: 249,
    displayName: "Soul Rune of Cinnabar",
    description:
      "This vivid, red-orange rune channels raw life force and transformation. Cinnabar pulses with alchemical energy, capable of healing or poisoning—depending on the will of the caster. Uvlius's studies of Runes conclude that the Rune of Cinnabar is often represented by the word \"Avocado\", as cinnabar symbolizes vitality and magical transformation—qualities found in nature's nutrient-rich fruit.",
    part: "rune"
  },
  {
    idx: 250,
    displayName: "Soul Rune of Down",
    description:
      'Misc A rune used to decrease power of spells, abilities, and any subtractive function. Featherlight and comforting, the Rune of Down brings rest, gentleness, and quiet protection. It is often stitched into blankets, whispered into lullabies, or hidden in the hush of falling snow. Uvlius\'s studies of Runes conclude that the Rune of Down is often represented by the word "Sock", as down brings softness, warmth, and comfort—just like a cozy sock.',
    part: "rune"
  },
  {
    idx: 251,
    displayName: "Soul Rune of Earth",
    description:
      'Elemental Earth is the foundation upon which life is built. This rune confers stability, fertility, physicality, and healing to spells. A foundational rune of patience and growth, the Rune of Earth holds steady under all things. It is the rune of farmers, builders, and those who dig deep for strength. Uvlius\'s studies of Runes conclude that the Rune of Earth is often represented by the word "Hand", as hands plant seeds, shape clay, and build—perfectly grounded in the elemental power of Earth.',
    part: "rune"
  },
  {
    idx: 252,
    displayName: "Soul Rune of Fire",
    description:
      "Elemental Fire is the element of energy, passion, and purification. Spells augmented with this rune are supercharged with the destructive or purifying force of fire. The Rune of Fire blazes with passion, destruction, and rebirth. It is the rune of the forge and the flame, representing both creativity and chaos. Invoked in moments of urgency or inspiration, it leaves nothing unchanged. Uvlius believes Fire may be too wild to be pinned to a single word from his current research—but suspects it may align with expressions of boldness, heat, or raw power.",
    part: "rune"
  },
  {
    idx: 253,
    displayName: "Soul Rune of Infinity",
    description:
      'Misc Perhaps the most powerful rune of all, wizards with infinity enhancement seem to have no limits on their magical abilities. A symbol of boundlessness and eternal loops, the Rune of Infinity hums with cosmic resonance. It is used in rites of reincarnation, perpetual motion, and endless possibility. Uvlius\'s studies of Runes conclude that the Rune of Infinity is often represented by the word "Pyramid", as pyramids, ancient and enduring, mirror the eternal and unending nature of infinity.',
    part: "rune"
  },
  {
    idx: 254,
    displayName: "Soul Rune of Jupiter",
    description:
      'Planetary / Alchemy From the ruler of the gods himself, Jupiter, a rune of growth, prosperity, and wisdom. The influence of this rune can enhance learning and wealth accumulation. Majestic and generous, the Rune of Jupiter governs expansion, fortune, and journeys across land or stars. It is a rune of leadership, belief, and wide-open skies. Uvlius\'s studies of Runes conclude that the Rune of Jupiter is often represented by the word "Ticket", as Jupiter governs expansion and adventure, and a ticket is a gateway to grand journeys.',
    part: "rune"
  },
  {
    idx: 255,
    displayName: "Soul Rune of Lime",
    description:
      "Bright, sharp, and full of energy, the Rune of Lime cuts through stagnation with zesty clarity. It carries the essence of surprise and sparkle, often favored by tricksters and spirits of renewal. Uvlius has not yet linked Lime to a definitive Word, but suspects it hums in harmony with laughter, refreshment, or the zing of a clever idea.",
    part: "rune"
  },
  {
    idx: 256,
    displayName: "Soul Rune of Mars",
    description:
      "Planetary / Alchemy Violence! War! Conflict! The rune of aggression and battle. Tempering magic with the Rune of Mars can add extreme power, especially with spells of destruction. The Rune of Mars is a rune of warriors and conflict. It pulses with adrenaline, strategy, and courage. It is invoked by those preparing to fight—or protect. Uvlius's field notes suggest Mars may tie to urgent action or challenge, but a precise Word remains elusive in this set.",
    part: "rune"
  },
  {
    idx: 257,
    displayName: "Soul Rune of Mercury",
    description:
      'Planetary / Alchemy Based on the speediest planet in the solar system, and the god of communication, trickery, and deceit. This rune can add speed to spells, and aid in communication magic. Fleet-footed and clever, the Rune of Mercury governs motion, messages, and mental agility. It zips through the world like thought itself—connecting people, ideas, and places. Uvlius\'s studies of Runes conclude that the Rune of Mercury is often represented by the word "Follow", as Mercury, the messenger, leads through language and movement, guiding those who follow.',
    part: "rune"
  },
  {
    idx: 258,
    displayName: "Soul Rune of Neptune",
    description:
      "Planetary / Alchemy A rune of dreams, illusions, and intuition. Wizards using this rune find it intensifies psychic abilities and is helpful in penetrating mystical planes of alternate realities Deep, dreamy, and unknowable, the Rune of Neptune governs illusions, emotions, and the tides of magic. It is called upon for visions, dreams, and journeys beneath the surface. Uvlius has not completed Neptune’s entry in his active scrolls, but suspects it is submerged in mysteries tied to depth, dreams, or water’s pull.",
    part: "rune"
  },
  {
    idx: 259,
    displayName: "Soul Rune of Omega",
    description:
      "Misc A rune of supreme power and a final state of being. Wizards wielding this rune are often incredibly powerful having pushed their arcane practice to it's limits. The Rune of Omega marks the end of things: the final page, the closing bell, the last breath. But endings hold power, and this rune is revered in rituals of completion and rest. Uvlius has not linked Omega to a word in this particular set, but notes it often whispers behind moments of finality, graduation, or graceful exit.",
    part: "rune"
  },
  {
    idx: 260,
    displayName: "Soul Rune of Pluto",
    description:
      'Planetary / Alchemy A planet located in the extremity of the solar system and the namesake of the god of the underworld, this rune embodies extremities, power, change, death and rebirth. This rune is often employed in communion with demons, darkness, and the shadow self. Mysterious and transformative, the Rune of Pluto governs the unseen—death, rebirth, and the power of what lies below. It is both feared and honored, for it changes all who touch it. Uvlius\'s studies of Runes conclude that the Rune of Pluto is often represented by the word "Disease", as Pluto evokes transformation, endings, and the unseen forces that challenge life.',
    part: "rune"
  },
  {
    idx: 261,
    displayName: "Soul Rune of Saturn",
    description:
      'Planetary / Alchemy With a glyph shaped like a scythe, this rune is favored by farmers for its influence in agriculture and husbandry. This rune instills discipline and structure, and is great for bringing stability to magic. The Rune of Saturn turns with slow gravity. It governs time, discipline, memory, and the patterns that shape fate. In its presence, all things must wait and endure. Uvlius\'s studies of Runes conclude that the Rune of Saturn is often represented by the word "Year", as Saturn rules over time, cycles, and the steady march of seasons.',
    part: "rune"
  },
  {
    idx: 262,
    displayName: "Soul Rune of Sigma",
    description:
      'Misc This rune is quite mysterious, and its uses are still being discovered. Though difficult to define, is is most often considered a rune of transcendence, with its users often on paths of spiritual independence. Associated with logic, mathematics, and the sum of parts, the Rune of Sigma is invoked in calculations and predictions. It is both pattern and precision. Uvlius\'s studies of Runes conclude that the Rune of Sigma is often represented by the word "Twice", as Sigma reflects patterns, math, and repetition—concepts captured in doubling.',
    part: "rune"
  },
  {
    idx: 263,
    displayName: "Soul Rune of Steel",
    description:
      'Cold, exact, and enduring, the Rune of Steel sharpens resolve and fortifies the body and mind. It is drawn by smiths, soldiers, and those who do not bend. Uvlius\'s studies of Runes conclude that the Rune of Steel is often represented by the word "Resist", as steel symbolizes resilience and strength—resistance forged in metal.',
    part: "rune"
  },
  {
    idx: 264,
    displayName: "Soul Rune of Sun",
    description:
      "Radiant and life-giving, the Rune of Sun blazes with warmth, vision, and illumination. It is a rune of clarity, growth, and shining one’s truth into the world. Uvlius has not definitively matched the Sun rune with a word from this set but believes it is present in all acts of hope, illumination, and beginning again.",
    part: "rune"
  },
  {
    idx: 265,
    displayName: "Soul Rune of Up Only",
    description:
      "Misc A rune used to increase power of spells, abilities, and any additive function. A modern mystery in an ancient shape, the Rune of Up Only points eternally skyward. It represents progress, optimism, and the unshakable belief that tomorrow will be better. Uvlius suspects Up Only resonates with the very nature of ascent—perhaps a word like “Goal” or “Hope” would best align in future investigations.",
    part: "rune"
  },
  {
    idx: 266,
    displayName: "Soul Rune of Uranus",
    description:
      "Planetary / Alchemy A rune of freedom, innovation, and rebellion, Uranus is an excellent amplifier for creative expression. It is a rune that is often found influencing the most genius and original thinkers of ever age. Wild, eccentric, and revolutionary, the Rune of Uranus governs chaos that becomes genius. It breaks old rules, invents new paths, and shocks stagnant systems awake. Uvlius considers Uranus a difficult rune to categorize, but imagines it might one day be tied to surprising words like “Zap,” “Flip,” or “Unravel.”",
    part: "rune"
  },
  {
    idx: 267,
    displayName: "Soul Rune of Venus",
    description:
      'Planetary / Alchemy A rune of love, beauty, emotion, and aesthetics. The rune can be used to influence relationships and matters of the heart The Rune of Venus glows with beauty, love, and magnetic charm. It is the rune of attraction, art, softness, and the tenderest forms of power. Uvlius\'s studies of Runes conclude that the Rune of Venus is often represented by the word "Wink", as Venus radiates charm, beauty, and flirtation—a wink holds all three.',
    part: "rune"
  },
  {
    idx: 268,
    displayName: "Soul Rune of Water",
    description:
      "Elemental Water is the element of intuition, emotion, and the subconscious. This rune is invoked in rituals and spells of love and psychic abilities. Flowing, feeling, and ever-changing, the Rune of Water speaks to emotion, adaptability, and intuition. It can nurture or erode, depending on the current. Uvlius has not yet matched Water to a word in this series, but believes it dances closely with themes of emotion, reflection, and connection.",
    part: "rune"
  },
  {
    idx: 269,
    displayName: "Amber",
    part: "affinity"
  },
  {
    idx: 270,
    displayName: "Angel",
    part: "affinity"
  },
  {
    idx: 271,
    displayName: "Blackness",
    part: "affinity"
  },
  {
    idx: 272,
    displayName: "Blood",
    part: "affinity"
  },
  {
    idx: 273,
    displayName: "Blue Shift",
    part: "affinity"
  },
  {
    idx: 274,
    displayName: "Brownish",
    part: "affinity"
  },
  {
    idx: 275,
    displayName: "Carnal",
    part: "affinity"
  },
  {
    idx: 276,
    displayName: "Cool Flame",
    part: "affinity"
  },
  {
    idx: 277,
    displayName: "Crimson",
    part: "affinity"
  },
  {
    idx: 278,
    displayName: "Darkness",
    part: "affinity"
  },
  {
    idx: 279,
    displayName: "Death",
    part: "affinity"
  },
  {
    idx: 280,
    displayName: "Decay",
    part: "affinity"
  },
  {
    idx: 281,
    displayName: "Disease",
    part: "affinity"
  },
  {
    idx: 282,
    displayName: "Disgusting",
    part: "affinity"
  },
  {
    idx: 283,
    displayName: "Ecto Flame",
    part: "affinity"
  },
  {
    idx: 284,
    displayName: "Emperor",
    part: "affinity"
  },
  {
    idx: 285,
    displayName: "Fire",
    part: "affinity"
  },
  {
    idx: 286,
    displayName: "Frog",
    part: "affinity"
  },
  {
    idx: 287,
    displayName: "Ghost",
    part: "affinity"
  },
  {
    idx: 288,
    displayName: "Ghoul",
    part: "affinity"
  },
  {
    idx: 289,
    displayName: "Gold",
    part: "affinity"
  },
  {
    idx: 290,
    displayName: "Grey",
    part: "affinity"
  },
  {
    idx: 291,
    displayName: "Grim",
    part: "affinity"
  },
  {
    idx: 292,
    displayName: "Lich",
    part: "affinity"
  },
  {
    idx: 293,
    displayName: "Mischeif",
    part: "affinity"
  },
  {
    idx: 294,
    displayName: "Mushroom",
    part: "affinity"
  },
  {
    idx: 295,
    displayName: "Orange",
    part: "affinity"
  },
  {
    idx: 296,
    displayName: "Phantasm",
    part: "affinity"
  },
  {
    idx: 297,
    displayName: "Pink",
    part: "affinity"
  },
  {
    idx: 298,
    displayName: "Pirate",
    part: "affinity"
  },
  {
    idx: 299,
    displayName: "Poltergeist",
    part: "affinity"
  },
  {
    idx: 300,
    displayName: "Purple Haze",
    part: "affinity"
  },
  {
    idx: 301,
    displayName: "Regal",
    part: "affinity"
  },
  {
    idx: 302,
    displayName: "Revenant",
    part: "affinity"
  },
  {
    idx: 303,
    displayName: "Shade",
    part: "affinity"
  },
  {
    idx: 304,
    displayName: "Skeleton",
    part: "affinity"
  },
  {
    idx: 305,
    displayName: "Slime",
    part: "affinity"
  },
  {
    idx: 306,
    displayName: "Snake",
    part: "affinity"
  },
  {
    idx: 307,
    displayName: "Soul",
    part: "affinity"
  },
  {
    idx: 308,
    displayName: "Spectre",
    part: "affinity"
  },
  {
    idx: 309,
    displayName: "Vampyre",
    part: "affinity"
  },
  {
    idx: 310,
    displayName: "Verdant",
    part: "affinity"
  },
  {
    idx: 311,
    displayName: "Video",
    part: "affinity"
  },
  {
    idx: 312,
    displayName: "Void",
    part: "affinity"
  },
  {
    idx: 313,
    displayName: "Voodoo",
    part: "affinity"
  },
  {
    idx: 314,
    displayName: "White Magic",
    part: "affinity"
  },
  {
    idx: 315,
    displayName: "Wight",
    part: "affinity"
  },
  {
    idx: 316,
    displayName: "Wraith",
    part: "affinity"
  },
  {
    idx: 317,
    displayName: "Zombie",
    part: "affinity"
  },
  {
    idx: 318,
    displayName: "Ashpile",
    part: "undesirable"
  },
  {
    idx: 319,
    displayName: "Ashpile with bones",
    part: "undesirable"
  },
  {
    idx: 320,
    displayName: "Blue Coffin",
    part: "undesirable"
  },
  {
    idx: 321,
    displayName: "Blueberry Jelly Donut",
    part: "undesirable"
  },
  {
    idx: 322,
    displayName: "Brown Coffin",
    part: "undesirable"
  },
  {
    idx: 323,
    displayName: "Cloud of Ectoplasm",
    part: "undesirable"
  },
  {
    idx: 324,
    displayName: "Ectoplasm Goop",
    part: "undesirable"
  },
  {
    idx: 325,
    displayName: "Ectoplasm Mist",
    part: "undesirable"
  },
  {
    idx: 326,
    displayName: "Ethereal Urn",
    part: "undesirable"
  },
  {
    idx: 327,
    displayName: "Ghost Orb",
    part: "undesirable"
  },
  {
    idx: 328,
    displayName: "Grape Jelly Donut",
    part: "undesirable"
  },
  {
    idx: 329,
    displayName: "Green Coffin",
    part: "undesirable"
  },
  {
    idx: 330,
    displayName: "Holy Urn",
    part: "undesirable"
  },
  {
    idx: 331,
    displayName: "Immaculate Urn",
    part: "undesirable"
  },
  {
    idx: 332,
    displayName: "Jelly Donut with Slime",
    part: "undesirable"
  },
  {
    idx: 333,
    displayName: "Meta Orb",
    part: "undesirable"
  },
  {
    idx: 334,
    displayName: "Pile of Blood and Guts",
    part: "undesirable"
  },
  {
    idx: 335,
    displayName: "Pile of Bones",
    part: "undesirable"
  },
  {
    idx: 336,
    displayName: "Power Orb",
    part: "undesirable"
  },
  {
    idx: 337,
    displayName: "Purple Coffin",
    part: "undesirable"
  },
  {
    idx: 338,
    displayName: "Raspberry Jelly Donut",
    part: "undesirable"
  },
  {
    idx: 339,
    displayName: "Red Coffin",
    part: "undesirable"
  },
  {
    idx: 340,
    displayName: "Rose on grave",
    part: "undesirable"
  },
  {
    idx: 341,
    displayName: "Total Void of Absolute Nothingness",
    part: "undesirable"
  },
  {
    idx: 342,
    displayName: "Tulip on grave",
    part: "undesirable"
  },
  {
    idx: 343,
    displayName: "White Coffin",
    part: "undesirable"
  },
  {
    idx: 344,
    displayName: "Yellow Coffin",
    part: "undesirable"
  }
];
