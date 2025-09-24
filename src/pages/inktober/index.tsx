import DefaultLayout from "@/layouts/default";

export default function InktoberPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center gap-4 max-w-8xl min-h-screen">
        <h1 className="sm:text-7xl text-6xl font-atirose text-brand-500">
          Wizard Inktober
        </h1>

        <div className="w-full my-4">
          <svg
            className="w-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 330 8"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_453_22)">
              <path
                d="M35 3L-0.5 7.5V12.5H330V7.5L294.5 3H271L242 0H87.5L58.5 3H35Z"
                fill="transparent"
              />
              <path
                d="M59.0303 3.5303L58.8107 3.75H58.5H35.3107L0.25 7.8107V11.75H329.25V7.8107L294.189 3.75H271H270.689L270.47 3.5303L241.689 0.75H87.8107L59.0303 3.5303Z"
                stroke="#A986D9"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <defs>
              <clipPath id="clip0_453_22">
                <rect fill="white" height="8" width="330" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl flex flex-col gap-8 sm:p-0 p-4">
          <p className="text-lg text-center max-w-3xl mx-auto">
            Welcome to Wizard Inktober! Each day of October, create an ink
            illustration, and win the daily prize or $50 or a warrior nft with
            similar value. Click on the day to see more details on the topic.
            Some will present further options to choose from.
            <a
              href="#rules"
              className="text-brand-500 underline underline-offset-4"
            >
              Read the rules
            </a>
            .
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompts.map((p) => (
              <a
                key={p.day}
                id={`day-${p.day}`}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-content3/20 hover:border-brand-500/60 hover:bg-content1/40 transition-colors p-4"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">
                    Day {p.day}:{" "}
                    <span className="font-atirose text-brand-500">
                      {p.title}
                    </span>
                  </h2>
                </div>
                <p className="text-sm mt-2 text-foreground-600">{p.desc}</p>
              </a>
            ))}
          </div>
          <p id="rules" className="text-lg text-center max-w-3xl mx-auto">
            Rules: follow our{" "}
            <a
              href="https://instagram.com/house_of_wizards_dao"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-500 underline underline-offset-4"
            >
              instagram account
            </a>
            , post your illustration and tag @house_of_wizards_dao, and use the
            #inktober #wizardinktober hashtags. Judging criteria: aesthetics,
            style, details, how much it fits the Forgotten Runes franchise
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
}

const prompts = [
  {
    day: 1,
    title: "Secret Tower",
    desc: "Birthplace of the cult, and holds the Book of Lore.",
    href: "https://www.forgottenrunes.com/tower",
  },
  {
    day: 2,
    title: "Wizard with Giant Ladybug",
    desc: "Pick a wizard with a giant ladybug.",
    href: "https://www.forgottenrunes.com/gallery/wizards?familiar=Giant%20Ladybug",
  },
  {
    day: 3,
    title: "Demon in a Bottle",
    desc: "Corked chaos, contained.",
    href: "https://wizzypedia.forgottenrunes.com/Demon_in_a_Bottle",
  },
  {
    day: 4,
    title: "Chaos Chimera",
    desc: "Many heads, one will.",
    href: "https://wizzypedia.forgottenrunes.com/Chaos_Chimera",
  },
  {
    day: 5,
    title: "Impling",
    desc: "Mischief in miniature.",
    href: "https://www.forgottenrunes.com/gallery/spawn?species=Imp",
  },
  {
    day: 6,
    title: "Cosmic Arcanist",
    desc: "Pick a cosmic arcanist.",
    href: "https://www.forgottenrunes.com/gallery/wizards?head=Cosmic%20Arcanist",
  },
  {
    day: 7,
    title: "The Gate to the Seventh Realm",
    desc: "The gate which held the beasts.",
    href: "https://wizzypedia.forgottenrunes.com/The_Gate_to_the_Seventh_Realm",
  },
  {
    day: 8,
    title: "Cyborg Warrior",
    desc: "Pick a cyborg warrior.",
    href: "https://www.forgottenrunes.com/gallery/warriors?body=Cyborg%20Body",
  },
  {
    day: 9,
    title: "Soul with Blaze Frog",
    desc: "Pick a soul with a blaze frog.",
    href: "https://www.forgottenrunes.com/gallery/souls?familiar=Blaze%20Frog",
  },
  {
    day: 10,
    title: "Gigas Chad",
    desc: "Strongest beast?",
    href: "https://wizzypedia.forgottenrunes.com/Gigas_Chad",
  },
  {
    day: 11,
    title: "Wizard with Lunar Staff",
    desc: "Pick a wizard with a lunar staff.",
    href: "https://www.forgottenrunes.com/gallery/wizards?prop=Lunar%20Staff",
  },
  {
    day: 12,
    title: "Goblin's Brain in a Jar",
    desc: "Best consumed with a spoon.",
    href: "https://wizzypedia.forgottenrunes.com/Goblin%27s_Brain_in_a_Jar",
  },
  {
    day: 13,
    title: "Warrior with Goat",
    desc: "Pick a warrior with a goat.",
    href: "https://www.forgottenrunes.com/gallery/warriors?companion=Null%20Goat&companion=Black%20Goat&companion=Silver%20Goat",
  },
  {
    day: 14,
    title: "Quantum Shadow",
    desc: "Enigmatic material and region in the Runiverse.",
    href: "https://wizzypedia.forgottenrunes.com/The_Quantum_Shadow",
  },
  {
    day: 15,
    title: "Warrior with Turtle",
    desc: "Pick a warrior with a turtle.",
    href: "https://www.forgottenrunes.com/gallery/warriors?companion=Mutant%20Snapping%20Turtle",
  },
  {
    day: 16,
    title: "Seven Tailed Kitsune",
    desc: "The most beautiful beast.",
    href: "https://wizzypedia.forgottenrunes.com/Seven_Tailed_Kitsune",
  },
  {
    day: 17,
    title: "Pile of Blood and Guts",
    desc: "Grim remnants.",
    href: "https://www.forgottenrunes.com/lore/souls/169/0",
  },
  {
    day: 18,
    title: "Wizard with the World Egg",
    desc: "Pick a wizard with a world egg.",
    href: "https://www.forgottenrunes.com/gallery/wizards?prop=The%20World%20Egg",
  },
  {
    day: 19,
    title: "Cucumdog",
    desc: "Controversial delicacy.",
    href: "https://wizzypedia.forgottenrunes.com/Cucumdog",
  },
  {
    day: 20,
    title: "Pony",
    desc: "What goes to bed with its shoes on?",
    href: "https://www.forgottenrunes.com/gallery/ponies",
  },
  {
    day: 21,
    title: "Warrior with Food",
    desc: "Pick a warrior with food.",
    href: "https://www.forgottenrunes.com/gallery/warriors?weapon=Cheeseburger&weapon=Bowl%20of%20Ramen&weapon=Hambone",
  },
  {
    day: 22,
    title: "Wizard with Mesozoic Cockatrice",
    desc: "Pick a wizard with a cockatrice.",
    href: "https://www.forgottenrunes.com/gallery/wizards?familiar=Mesozoic%20Cockatrice",
  },
  {
    day: 23,
    title: "Shroom Shack",
    desc: "Runiverse hospitality.",
    href: "https://wizzypedia.forgottenrunes.com/Shroom_Shack",
  },
  {
    day: 24,
    title: "Book of Voynich",
    desc: "A mysterious reading for sure.",
    href: "https://wizzypedia.forgottenrunes.com/Book_of_Voynich",
  },
  {
    day: 25,
    title: "Eternal Rose",
    desc: "Beautiful and eternal.",
    href: "https://wizzypedia.forgottenrunes.com/Eternal_Rose",
  },
  {
    day: 26,
    title: "White Wizard",
    desc: "Pick a white hat wizard.",
    href: "https://www.forgottenrunes.com/gallery/wizards?head=White%20Wizard",
  },
  {
    day: 27,
    title: "Chimera",
    desc: "They are cute when they are young.",
    href: "https://www.forgottenrunes.com/gallery/spawn?species=Chimera",
  },
  {
    day: 28,
    title: "Kobold Warrior",
    desc: "Pick a kobold warrior.",
    href: "https://www.forgottenrunes.com/gallery/warriors?head=Wild%20Kobold&head=Kobold%20Grunt&head=Kobold%20Captain",
  },
  {
    day: 29,
    title: "Skull Head",
    desc: "Pick a soul with a skull head.",
    href: "https://www.forgottenrunes.com/gallery/souls?head=Imp%20Skull&head=Felis%20Skull&head=Hue%20Skeleton&head=Kobold%20Skull&head=Anuran%20Skull&head=Hunter%20Skull&head=Corvid%20Skull&head=Wolfkin%20Skull&head=Canaanite%20Skull&head=Braindrain%20Skull&head=Evil%20One%27s%20Skull&head=Grim%20Reaper%27s%20Skull&head=Blood%20Eater%20Revenant",
  },
  {
    day: 30,
    title: "Nightmare Imp",
    desc: "The Prince of Nightmares.",
    href: "https://wizzypedia.forgottenrunes.com/Nightmare_Imp",
  },
  {
    day: 31,
    title: "Pumpkin Head Wizard",
    desc: "Pick a pumpkin head wizard.",
    href: "https://www.forgottenrunes.com/gallery/wizards?head=Pumpkin%20Head",
  },
] as const;
