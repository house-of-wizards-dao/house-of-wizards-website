import { FC, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DefaultLayout from '@/layouts/default';
import { FaDiscord, FaGlobe, FaTwitter } from 'react-icons/fa';

interface BioProps {
  name: string;
  twitter: string;
  discord: string;
  focus: string;
  skillset: string;
  site?: string;
  imageName?: string;
}

const Bio: FC<BioProps> = ({
  name,
  twitter,
  discord,
  focus,
  skillset,
  site = '',
  imageName = '',
}) => {
  return (
    <div className="border-1 border-darkviolet bg-transparent sm:w-[49%] w-full items-center justify-start gap-3 flex flex-row p-2 rounded-xl">
      {/* Image Section */}
      <div className="basis-1/4">
        <Image 
          src={`/img/talent/${imageName || `${name}.png`}`} 
          height={120} 
          width={120}
          alt={`${name}'s avatar`}
          className="w-full rounded-xl"
        />
      </div>

      {/* Bio Details */}
      <div className="basis-3/4">
        <div>
          {/* Name and Focus */}
          <div className="flex flex-row gap-3 items-center">
            <div className="text-xs">{name}</div>
            <div className="bg-[#9564b4] truncate text-sm text-center px-2 rounded-full border-4 border-[#3b2747]">{focus}</div>
          </div>
          {/* Skillset */}
          <div className="text-xs w-[300px] truncate hover:text-clip ">{skillset}</div>
        </div>

        {/* Links Section */}
        <div className="mt-4">
          {/* Website */}
          {site ? (
            <Link href={site} target="_blank" rel="noopener noreferrer">
              <div className="text-xs flex flex-row items-center gap-1">
                <div>
                  <FaGlobe/>
                </div>
                <div>{site}</div>
              </div>
            </Link>
          ) : (
            <div className="text-xs flex flex-row items-center gap-1">
                  <div>
                    <FaGlobe/>
                  </div>
                  <div className="text-xs text-gray-400">No Portfolio available</div>
                </div>
          )}

          {/* Social Links */}
          <div className="flex flex-col gap-1 mt-1">
            {/* Twitter */}
            {twitter ? (
              <Link 
                href={`https://twitter.com/${twitter}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="text-xs flex flex-row items-center gap-1">
                  <div>
                    <FaTwitter/>
                  </div>
                  <div>{twitter}</div>
                </div>
              </Link>
            ) : (
              <div className="text-xs flex flex-row items-center gap-1">
                  <div>
                    <FaTwitter/>
                  </div>
                  <div className="text-xs text-gray-400">No Twitter profile available</div>
                </div>
              
            )}

            {/* Discord */}
            {discord ? (
              <div 
                onClick={() => navigator.clipboard.writeText(discord)}
                className="text-xs flex flex-row items-center gap-1 cursor-pointer"
              >
                <div>
                  <FaDiscord/>
                </div>
                <div>{discord}</div>
              </div>
            ) : (
              <div className="text-xs flex flex-row items-center gap-1">
                  <div>
                    <FaDiscord/>
                  </div>
                  <div className="text-xs text-gray-400">No Discord handle available</div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Talent: FC = () => {
  const [selectedFocus, setSelectedFocus] = useState<string>('All');

  const talents: BioProps[] = [
    {
        name: "swiftpaw",
        twitter: "thomas_djb",
        discord: "swiftpaw#8880",
        focus: "Artist",
        skillset: "3D animation / modeling, sound design",
        site: "https://instagram.com/thomas_djb"
      },
      {
        name: "pleasures",
        twitter: "hellopleasures",
        discord: "itsmepleasures",
        focus: "Developer",
        skillset: "Front-End Developer with a little bit of backend.",
        site: "https://pleasures.lol"
      },
      {
        name: "smolprotecc",
        twitter: "smolprotecc",
        discord: "smolprotecc#0690",
        focus: "Developer",
        skillset: "fiddler, general purpose troubleshooter",
        site: "https://github.com/smolprotecc"
      },
      {
        name: "MeepleDad",
        twitter: "MeepleDad",
        discord: "MeepleDad#3144",
        focus: "Project Manager",
        skillset: "Project management, business development, talent coach, audio editor, podcaster, product production",
        site: "http://theMeeple.ca"
      },
      {
        name: "Dragonfetus",
        twitter: "Dragonfetus0",
        discord: "Dragonfetus0#6889",
        focus: "Writer",
        skillset: "Lore writing, Data Analysis, Ideation, Social Media Management, Hypnosis, NLP, Spell Casting, Intuitive Communication"
      },
      {
        name: "taxil",
        twitter: "taxxil",
        discord: "taxil#8577",
        focus: "Writer",
        skillset: "Editing, curating, world-building"
      },
      {
        name: "niftyminer",
        twitter: "nifty_miner",
        discord: "niftyminer#8148",
        focus: "Developer",
        skillset: "fullstack, solidity",
        site: "https://github.com/vmaark"
      },
      {
        name: "Kel 1/1",
        twitter: "Kel_1of1",
        discord: "Kel [1/1]#7777",
        focus: "Writer",
        skillset: "Technical writing, instructional design, lore-writing (samples on kel1of1.com)",
        site: "https://kel1of1.com",
        imageName: "Kel.png"
      },
      {
        name: "sami kitty",
        twitter: "sami_kitty_",
        discord: "sami kitty#6487",
        focus: "Artist",
        skillset: "Ceramics, model making, clay, photography"
      },
      {
        name: "Leif Dojang",
        twitter: "LDojangMusic",
        discord: "Leif Dojang#9004",
        focus: "Artist",
        skillset: "Musician and composer",
        site: "https://tonewoodblack.tumblr.com"
      },
      {
        name: "Fabula",
        twitter: "fabulaxr",
        discord: "FABULA.eth#6887",
        focus: "Writer",
        skillset: "TTRPG writing, design and production, Pro blockchain game executive. Game Designer, Producer"
      },
      {
        name: "youngwhizzie",
        twitter: "youngwhizzie",
        discord: "youngwhizzie#5234",
        focus: "Artist",
        skillset: "Pixel art and graphic design"
      },
      {
        name: "MewnCat",
        twitter: "MewnCat",
        discord: "MewnCat#7367",
        focus: "Artist",
        skillset: "3D artist with a background in graphic design, post production and retouching"
      },
      {
        name: "Fan",
        twitter: "",
        discord: "",
        focus: "Developer",
        skillset: "frontend + backend development"
      },
      {
        name: "Lehnwa",
        twitter: "Lehnwaa",
        discord: "Lehnwa#9895",
        focus: "Artist",
        skillset: "Making fan art and commissions, full body character pieces (2D)",
        site: "https://www.youtube.com/c/Lehnwa"
      },
      {
        name: "RamiWrites",
        twitter: "RamiWrites",
        discord: "RamiWrites#0001",
        focus: "Writer",
        skillset: "Writing fiction",
        site: "https://www.dreamconduit.org"
      },
      {
        name: "Tad",
        twitter: "tadmajor",
        discord: "tad#4318",
        focus: "Artist",
        skillset: "pixel art, animation",
        site: "https://thepixelshop.app"
      },
      {
        name: "Mafriends",
        twitter: "MafriendsArt",
        discord: "Mafriends#1731",
        focus: "Artist",
        skillset: "Pixel art, Illustrations, 3D, 2D animation and more!"
      },
      {
        name: "tv",
        twitter: "tv3636",
        discord: "tv#3636",
        focus: "Developer",
        skillset: "full stack dev - react, typescript, python, solidity",
        site: "https://github.com/tv3636"
      },
      {
        name: "Dr. Slurp",
        twitter: "dr_slurp",
        discord: "dr.slurp#0001",
        focus: "Musician + Dev",
        skillset: "Music production, sound design, solidity, natural language processing, AI, metadata",
        site: "https://www.research-josh.com"
      },
      {
        name: "Critikal",
        twitter: "cryptocritikal",
        discord: "Critikal#7708",
        focus: "Artist",
        skillset: "Comic style art, illustrator"
      },
      {
        name: "Aufek",
        twitter: "aufek",
        discord: "aufek#7544",
        focus: "Writer",
        skillset: "Writer, World Builder, Design and Theory"
      },
      {
        name: "Artis Rock",
        twitter: "artisrock",
        discord: "ArtisRock#9499",
        focus: "Artist",
        skillset: "Illustration and Product Design"
      },
      {
        name: "Grayling",
        twitter: "0xGrayling",
        discord: "Grayling#7948",
        focus: "Artist",
        skillset: "Music Composition, Audio",
        site: "https://tonewoodblack.tumblr.com"
      },
      {
        name: "link0x",
        twitter: "link0x",
        discord: "link#3123",
        focus: "Artist",
        skillset: "3D Artist",
        site: "https://www.artstation.com/artbysmitty"
      },
      {
        name: "PHLERP",
        twitter: "PhlerpDesigns",
        discord: "Phlerp#6729",
        focus: "Artist",
        skillset: "2D Digital Artist & animator, Gif & meme creator and animator",
        site: "https://phlerpdesigns.com"
      },
      {
        name: "Derek the Sphinx",
        twitter: "derekthesphinx",
        discord: "Derek the Sphinx#1806",
        focus: "Writer",
        skillset: "lore writing, story editing, copy editing. Examples of lore can be found at https://lore-arcs.vercel.app (with more to follow)",
        site: "https://lore-arcs.vercel.app"
      },
      {
        name: "pva",
        twitter: "heypva",
        discord: "pva#4312",
        focus: "Filmmaker",
        skillset: "Filmmaker. 3D Artist. Illustrator. Writer. Video Editor. Baby Developer.",
        site: "https://instagram.com/heypva"
      },
      {
        name: "Purples",
        twitter: "nic_aud",
        discord: "jabun#2978",
        focus: "Developer",
        skillset: "Frontend development & amateur UI/UX designer"
      },
      {
        name: "feckless",
        twitter: "fecklessmage",
        discord: "maxwell#9000",
        focus: "Artist",
        skillset: "Illustration, Animation, Pixel Art, Video Editing",
        site: "https://feckless.art"
      },
      {
        name: "sudojames",
        twitter: "sudoWright",
        discord: "sudojames#0001",
        focus: "Writer",
        skillset: "Lore writing and character building.",
        site: "https://sudojames.eth.xyz",
        imageName: "sudojames.gif"
      },
      {
        name: "Beaver0",
        twitter: "beaverzero",
        discord: "beaver0#1496",
        focus: "Writer",
        skillset: "Project lead for Sitka World, marketing, team up with my wife for kick-ass creative writing",
        site: "https://www.sitkaworld.com"
      },
      {
        name: "JPOneSix",
        twitter: "JPOneSix",
        discord: "JPOneSix#0409",
        focus: "Biz Dev",
        skillset: "Partnerships // Biz Dev // Sales"
      },
      {
        name: "Tania del Rio",
        twitter: "taniadelrio",
        discord: "taniadelrio#1111",
        focus: "Artist",
        skillset: "Illustration, comics, lore writing, editing",
        site: "https://caniscoven.xyz"
      },
      {
        name: "Dalawho",
        twitter: "Dala_who",
        discord: "",
        focus: "Developer",
        skillset: "Solidity, Python, JS, TS"
      },
      {
        name: "Meph",
        twitter: "Meph1587",
        discord: "Meph 🐍#6661",
        focus: "Developer",
        skillset: "Solidity Magic",
        site: "https://github.com/Meph1587",
        imageName: "Meph.jpeg"
      },
      {
        name: "DoubleR",
        twitter: "0xDouble_R",
        discord: "Kariak#2221",
        focus: "Developer",
        skillset: "Front End dev with business background"
      },
      {
        name: "fantasyfuturegyal",
        twitter: "nygi_xxv",
        discord: "nygixxv#2691",
        focus: "Artist",
        skillset: "Mixed-Media, Lore writing, Branding, Illustration, Virtual Reality, Abstraction, AI, Digital Art, Animation",
        site: "https://linktr.ee/nygixxv"
      },
      {
        name: "The Atelier of Ozzz",
        twitter: "ozzzmabro",
        discord: "ozzz#2875",
        focus: "Artist",
        skillset: "Pixel painting, lore building",
        site: "https://atelier.artiva.app/",
        imageName: "The Atelier of Ozzz.jpeg"
      },
      {
        name: "SPZ",
        twitter: "SorcererIlyas",
        discord: "spz#0001",
        focus: "Developer",
        skillset: "Full-Stack: Solidity, React/TypeScript. Artist: Composer, Writer.",
        site: "https://muse.io/spz",
        imageName: "spz.gif"
      },
      {
        name: "Cosmic Nightjar",
        twitter: "CosmicBirdsNFT",
        discord: "Cosmic Nightjar#4927",
        focus: "Artist",
        skillset: "Wildlife biologist, vector artist, craft maxi (origami, beadwork, cross-stitch and more!), creator of Cosmic Birds of Ornithia",
        site: "https://cosmicbirdsnft.com"
      }
    // Add all other talents here...
  ];

  // Extract unique focus areas and sort them
  const focusAreas = useMemo(() => {
    const areas = new Set(talents.map(talent => talent.focus));
    return ['All', ...Array.from(areas)].sort();
  }, [talents]);

  // Filter talents based on selected focus
  const filteredTalents = useMemo(() => {
    if (selectedFocus === 'All') {
      return talents;
    }
    return talents.filter(talent => talent.focus === selectedFocus);
  }, [talents, selectedFocus]);

  return (
    <DefaultLayout>
      <div className="max-w-8xl mx-auto p-4">
        {/* Header Section */}
        <h1 className="font-atirose text-violet text-center sm:text-7xl text-6xl">Talent</h1>

        {/* Description Section */}
        <div className="mt-4 flex flex-col gap-2 items-center max-w-5xl mx-auto">
          <p className="text-center sm:text-sm text-xs">
            Looking for collaborators to work on a Forgotten Runes project? 
            Use the talent board below to find community members with the perfect skillset for your team.
          </p>
          <p className="text-center sm:text-sm text-xs">
            Interested in being considered for work on community projects?
          </p>
          
          {/* Add to Board Button */}
          <Link 
            href="https://www.addressform.io/form/11013d4a-7611-4693-8ab1-7a27634457d6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-[#9564b4] w-[250px] text-center sm:text-sm text-xs p-2 rounded-full border-4 border-[#3b2747]"
          >
            Add yourself to the board!
          </Link>
        </div>

        <div className="w-full my-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="100%" 
            viewBox="0 0 330 8" 
            fill="none" 
            preserveAspectRatio="none"
            className="w-full"
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
                <rect width="330" height="8" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto">
        {/* Focus Filter */}
        <div className=" mb-4">
          <div className="flex flex-wrap gap-2">
            {focusAreas.map((focus) => (
              <button
                key={focus}
                onClick={() => setSelectedFocus(focus)}
                className={`px-3 text-sm py-1 rounded-full border-2 ${
                  selectedFocus === focus
                    ? 'bg-[#9564b4] text-white border-[#3b2747]'
                    : 'bg-[#321e3e] border-[#9564b4]'
                }`}
              >
                {focus}
              </button>
            ))}
          </div>
        </div>

        {/* Talent Count */}
        <div className="text-sm text-[#9564b4] mb-4">
          Showing {filteredTalents.length} {selectedFocus !== 'All' ? selectedFocus : ''} talents
        </div>

        {/* Talent Grid */}
        <div className="flex flex-row flex-wrap gap-3">
          {filteredTalents.map((talent) => (
            <Bio 
              key={talent.name}
              {...talent}
            />
          ))}
        </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Talent;