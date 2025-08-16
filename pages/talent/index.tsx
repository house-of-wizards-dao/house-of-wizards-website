import { FC, useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Globe, Twitter, Camera, X } from "lucide-react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Spinner } from "@nextui-org/spinner";

import DefaultLayout from "@/layouts/default";

interface BioProps {
  id?: string;
  name: string;
  twitter: string;
  discord: string;
  focus: string;
  skillset: string;
  site?: string;
  imageName?: string;
  avatar_url?: string;
  user_id?: string;
}

const AVATAR_STORAGE_URL =
  "https://ctyeiwzxltrqyrbcbrii.supabase.co/storage/v1/object/public/talent-avatars/";

interface AddTalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTalentAdded: () => void;
}

const Bio: FC<BioProps> = ({
  name,
  twitter,
  discord,
  focus,
  skillset,
  site = "",
  imageName = "",
  avatar_url = "",
}) => {
  return (
    <div className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm rounded-xl hover:border-violet hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
      <div className="flex flex-col sm:flex-row p-6 gap-4">
        {/* Image Section */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto sm:mx-0">
            <Image
              alt={`${name}'s avatar`}
              className="rounded-xl object-cover w-full h-full"
              height={112}
              src={
                avatar_url
                  ? (avatar_url.startsWith('http') 
                      ? avatar_url 
                      : `${AVATAR_STORAGE_URL}${avatar_url}`)
                  : `/img/talent/${imageName || `${name}.png`}`
              }
              width={112}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/img/talent/${name}.png`;
                target.onerror = () => {
                  target.src = "/img/logo.png"; // fallback to logo
                };
              }}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </div>
        </div>

        {/* Bio Details */}
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            {/* Name and Focus */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-2">
              <h3 className="text-lg font-medium text-white">{name}</h3>
              <span className="inline-block bg-violet/20 border border-violet text-violet text-xs px-3 py-1 rounded-full">
                {focus}
              </span>
            </div>
            {/* Skillset */}
            <p className="text-sm text-gray-300 line-clamp-2">{skillset}</p>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap gap-3">
            {/* Website */}
            {site && (
              <Link
                href={site}
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center gap-2 text-gray-400 hover:text-violet transition-colors"
              >
                <Globe size={14} />
                <span className="text-sm">Portfolio</span>
              </Link>
            )}

            {/* Twitter */}
            {twitter && (
              <Link
                href={`https://twitter.com/${twitter}`}
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center gap-2 text-gray-400 hover:text-violet transition-colors"
              >
                <Twitter size={14} />
                <span className="text-sm">@{twitter}</span>
              </Link>
            )}

            {/* Discord */}
            {discord && (
              <button
                className="flex items-center gap-2 text-gray-400 hover:text-violet transition-colors group"
                title="Click to copy Discord handle"
                onClick={(e) => {
                  navigator.clipboard.writeText(discord);
                  // Show a temporary "Copied!" message
                  const button = e.currentTarget as HTMLButtonElement;
                  const originalText =
                    button.querySelector("span:last-child")?.textContent;
                  const span = button.querySelector("span:last-child");
                  if (span) {
                    span.textContent = "Copied!";
                    span.classList.add("opacity-100");
                    setTimeout(() => {
                      span.textContent = originalText || "(click to copy)";
                      span.classList.remove("opacity-100");
                    }, 2000);
                  }
                }}
              >
                <MessageCircle size={14} />
                <span className="text-sm">{discord}</span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  (click to copy)
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Talent Modal Component
const AddTalentModal: FC<AddTalentModalProps> = ({
  isOpen,
  onClose,
  onTalentAdded,
}) => {
  const [formData, setFormData] = useState<Omit<BioProps, "id" | "user_id">>({
    name: "",
    twitter: "",
    discord: "",
    focus: "Developer",
    skillset: "",
    site: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const supabase = useSupabaseClient();
  const user = useUser();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to add yourself to the talent board");
      return;
    }

    if (!formData.name || !formData.skillset || !formData.focus) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      let avatar_url = "";

      // Upload avatar if provided
      if (avatarFile) {
        try {
          const fileExt = avatarFile.name.split(".").pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("talent-avatars")
            .upload(fileName, avatarFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            // Continue without avatar instead of throwing error
            setError(
              "Avatar upload failed. Profile will be created without avatar.",
            );
          } else {
            avatar_url = fileName;
          }
        } catch (uploadErr) {
          // Continue without avatar
          setError(
            "Avatar upload failed. Profile will be created without avatar.",
          );
        }
      }

      const { error: insertError } = await supabase.from("talents").insert({
        ...formData,
        avatar_url,
        user_id: user.id,
      });

      if (insertError) {
        throw insertError;
      }

      // Reset form
      setFormData({
        name: "",
        twitter: "",
        discord: "",
        focus: "Developer",
        skillset: "",
        site: "",
      });
      setAvatarFile(null);
      setAvatarPreview("");

      onTalentAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add talent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-darkviolet rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-darkviolet">
          <h2 className="text-2xl font-atirose text-violet">
            Add Yourself to the Talent Board
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-88px)]"
        >
          {error && (
            <div className="bg-red-900/20 border border-red-600 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-background/50 border-2 border-dashed border-darkviolet flex items-center justify-center">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="mx-auto text-gray-400 text-2xl mb-2" />
                    <p className="text-xs text-gray-400">Upload Avatar</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Choose avatar image"
              />
            </div>
            <p className="text-xs text-gray-400">
              Click to upload avatar (optional, max 5MB)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-background/50 border border-darkviolet rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet transition-colors"
              placeholder="Your name or handle"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Focus Area <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.focus}
              onChange={(e) =>
                setFormData({ ...formData, focus: e.target.value })
              }
              className="w-full bg-background/50 border border-darkviolet rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet transition-colors"
              required
            >
              <option value="Developer">Developer</option>
              <option value="Artist">Artist</option>
              <option value="Writer">Writer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Musician + Dev">Musician + Dev</option>
              <option value="Filmmaker">Filmmaker</option>
              <option value="Biz Dev">Biz Dev</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skills & Expertise <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.skillset}
              onChange={(e) =>
                setFormData({ ...formData, skillset: e.target.value })
              }
              className="w-full bg-background/50 border border-darkviolet rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet transition-colors resize-none"
              placeholder="Describe your skills and what you can offer..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Portfolio/Website
            </label>
            <input
              type="url"
              value={formData.site}
              onChange={(e) =>
                setFormData({ ...formData, site: e.target.value })
              }
              className="w-full bg-background/50 border border-darkviolet rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet transition-colors"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Twitter Handle
              </label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    twitter: e.target.value.replace("@", ""),
                  })
                }
                className="w-full bg-background/50 border border-darkviolet rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet transition-colors"
                placeholder="username (without @)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Discord Handle
              </label>
              <input
                type="text"
                value={formData.discord}
                onChange={(e) =>
                  setFormData({ ...formData, discord: e.target.value })
                }
                className="w-full bg-background/50 border border-darkviolet rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet transition-colors"
                placeholder="username#0000"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-violet hover:bg-violet-600 text-white px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  <span>Adding...</span>
                </>
              ) : (
                "Add to Talent Board"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-darkviolet text-gray-300 hover:border-violet hover:bg-violet/20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Talent: FC = () => {
  const [selectedFocus, setSelectedFocus] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [talents, setTalents] = useState<BioProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const supabase = useSupabaseClient();
  const user = useUser();

  // Static talents data - commented out to show only database entries
  // Uncomment if you want to show both static and database talents
  /*
  const staticTalents: BioProps[] = [
    {
      name: "swiftpaw",
      twitter: "thomas_djb",
      discord: "swiftpaw#8880",
      focus: "Artist",
      skillset: "3D animation / modeling, sound design",
      site: "https://instagram.com/thomas_djb",
    },
    {
      name: "pleasures",
      twitter: "hellopleasures",
      discord: "itsmepleasures",
      focus: "Developer",
      skillset: "Front-End Developer with a little bit of backend.",
      site: "https://pleasures.lol",
    },
    {
      name: "smolprotecc",
      twitter: "smolprotecc",
      discord: "smolprotecc#0690",
      focus: "Developer",
      skillset: "fiddler, general purpose troubleshooter",
      site: "https://github.com/smolprotecc",
    },
    {
      name: "MeepleDad",
      twitter: "MeepleDad",
      discord: "MeepleDad#3144",
      focus: "Project Manager",
      skillset:
        "Project management, business development, talent coach, audio editor, podcaster, product production",
      site: "http://theMeeple.ca",
    },
    {
      name: "Dragonfetus",
      twitter: "Dragonfetus0",
      discord: "Dragonfetus0#6889",
      focus: "Writer",
      skillset:
        "Lore writing, Data Analysis, Ideation, Social Media Management, Hypnosis, NLP, Spell Casting, Intuitive Communication",
    },
    {
      name: "taxil",
      twitter: "taxxil",
      discord: "taxil#8577",
      focus: "Writer",
      skillset: "Editing, curating, world-building",
    },
    {
      name: "niftyminer",
      twitter: "nifty_miner",
      discord: "niftyminer#8148",
      focus: "Developer",
      skillset: "fullstack, solidity",
      site: "https://github.com/vmaark",
    },
    {
      name: "Kel 1/1",
      twitter: "Kel_1of1",
      discord: "Kel [1/1]#7777",
      focus: "Writer",
      skillset:
        "Technical writing, instructional design, lore-writing (samples on kel1of1.com)",
      site: "https://kel1of1.com",
      imageName: "Kel.png",
    },
    {
      name: "sami kitty",
      twitter: "sami_kitty_",
      discord: "sami kitty#6487",
      focus: "Artist",
      skillset: "Ceramics, model making, clay, photography",
    },
    {
      name: "Leif Dojang",
      twitter: "LDojangMusic",
      discord: "Leif Dojang#9004",
      focus: "Artist",
      skillset: "Musician and composer",
      site: "https://tonewoodblack.tumblr.com",
    },
    {
      name: "Fabula",
      twitter: "fabulaxr",
      discord: "FABULA.eth#6887",
      focus: "Writer",
      skillset:
        "TTRPG writing, design and production, Pro blockchain game executive. Game Designer, Producer",
    },
    {
      name: "youngwhizzie",
      twitter: "youngwhizzie",
      discord: "youngwhizzie#5234",
      focus: "Artist",
      skillset: "Pixel art and graphic design",
    },
    {
      name: "MewnCat",
      twitter: "MewnCat",
      discord: "MewnCat#7367",
      focus: "Artist",
      skillset:
        "3D artist with a background in graphic design, post production and retouching",
    },
    {
      name: "Fan",
      twitter: "",
      discord: "",
      focus: "Developer",
      skillset: "frontend + backend development",
    },
    {
      name: "Lehnwa",
      twitter: "Lehnwaa",
      discord: "Lehnwa#9895",
      focus: "Artist",
      skillset:
        "Making fan art and commissions, full body character pieces (2D)",
      site: "https://www.youtube.com/c/Lehnwa",
    },
    {
      name: "RamiWrites",
      twitter: "RamiWrites",
      discord: "RamiWrites#0001",
      focus: "Writer",
      skillset: "Writing fiction",
      site: "https://www.dreamconduit.org",
    },
    {
      name: "Tad",
      twitter: "tadmajor",
      discord: "tad#4318",
      focus: "Artist",
      skillset: "pixel art, animation",
      site: "https://thepixelshop.app",
    },
    {
      name: "Mafriends",
      twitter: "MafriendsArt",
      discord: "Mafriends#1731",
      focus: "Artist",
      skillset: "Pixel art, Illustrations, 3D, 2D animation and more!",
    },
    {
      name: "tv",
      twitter: "tv3636",
      discord: "tv#3636",
      focus: "Developer",
      skillset: "full stack dev - react, typescript, python, solidity",
      site: "https://github.com/tv3636",
    },
    {
      name: "Dr. Slurp",
      twitter: "dr_slurp",
      discord: "dr.slurp#0001",
      focus: "Musician + Dev",
      skillset:
        "Music production, sound design, solidity, natural language processing, AI, metadata",
      site: "https://www.research-josh.com",
    },
    {
      name: "Critikal",
      twitter: "cryptocritikal",
      discord: "Critikal#7708",
      focus: "Artist",
      skillset: "Comic style art, illustrator",
    },
    {
      name: "Aufek",
      twitter: "aufek",
      discord: "aufek#7544",
      focus: "Writer",
      skillset: "Writer, World Builder, Design and Theory",
    },
    {
      name: "Artis Rock",
      twitter: "artisrock",
      discord: "ArtisRock#9499",
      focus: "Artist",
      skillset: "Illustration and Product Design",
    },
    {
      name: "Grayling",
      twitter: "0xGrayling",
      discord: "Grayling#7948",
      focus: "Artist",
      skillset: "Music Composition, Audio",
      site: "https://tonewoodblack.tumblr.com",
    },
    {
      name: "link0x",
      twitter: "link0x",
      discord: "link#3123",
      focus: "Artist",
      skillset: "3D Artist",
      site: "https://www.artstation.com/artbysmitty",
    },
    {
      name: "PHLERP",
      twitter: "PhlerpDesigns",
      discord: "Phlerp#6729",
      focus: "Artist",
      skillset: "2D Digital Artist & animator, Gif & meme creator and animator",
      site: "https://phlerpdesigns.com",
    },
    {
      name: "Derek the Sphinx",
      twitter: "derekthesphinx",
      discord: "Derek the Sphinx#1806",
      focus: "Writer",
      skillset:
        "lore writing, story editing, copy editing. Examples of lore can be found at https://lore-arcs.vercel.app (with more to follow)",
      site: "https://lore-arcs.vercel.app",
    },
    {
      name: "pva",
      twitter: "heypva",
      discord: "pva#4312",
      focus: "Filmmaker",
      skillset:
        "Filmmaker. 3D Artist. Illustrator. Writer. Video Editor. Baby Developer.",
      site: "https://instagram.com/heypva",
    },
    {
      name: "Purples",
      twitter: "nic_aud",
      discord: "jabun#2978",
      focus: "Developer",
      skillset: "Frontend development & amateur UI/UX designer",
    },
    {
      name: "feckless",
      twitter: "fecklessmage",
      discord: "maxwell#9000",
      focus: "Artist",
      skillset: "Illustration, Animation, Pixel Art, Video Editing",
      site: "https://feckless.art",
    },
    {
      name: "sudojames",
      twitter: "sudoWright",
      discord: "sudojames#0001",
      focus: "Writer",
      skillset: "Lore writing and character building.",
      site: "https://sudojames.eth.xyz",
      imageName: "sudojames.gif",
    },
    {
      name: "Beaver0",
      twitter: "beaverzero",
      discord: "beaver0#1496",
      focus: "Writer",
      skillset:
        "Project lead for Sitka World, marketing, team up with my wife for kick-ass creative writing",
      site: "https://www.sitkaworld.com",
    },
    {
      name: "JPOneSix",
      twitter: "JPOneSix",
      discord: "JPOneSix#0409",
      focus: "Biz Dev",
      skillset: "Partnerships // Biz Dev // Sales",
    },
    {
      name: "Tania del Rio",
      twitter: "taniadelrio",
      discord: "taniadelrio#1111",
      focus: "Artist",
      skillset: "Illustration, comics, lore writing, editing",
      site: "https://caniscoven.xyz",
    },
    {
      name: "Dalawho",
      twitter: "Dala_who",
      discord: "",
      focus: "Developer",
      skillset: "Solidity, Python, JS, TS",
    },
    {
      name: "Meph",
      twitter: "Meph1587",
      discord: "Meph 🐍#6661",
      focus: "Developer",
      skillset: "Solidity Magic",
      site: "https://github.com/Meph1587",
      imageName: "Meph.jpeg",
    },
    {
      name: "DoubleR",
      twitter: "0xDouble_R",
      discord: "Kariak#2221",
      focus: "Developer",
      skillset: "Front End dev with business background",
    },
    {
      name: "fantasyfuturegyal",
      twitter: "nygi_xxv",
      discord: "nygixxv#2691",
      focus: "Artist",
      skillset:
        "Mixed-Media, Lore writing, Branding, Illustration, Virtual Reality, Abstraction, AI, Digital Art, Animation",
      site: "https://linktr.ee/nygixxv",
    },
    {
      name: "The Atelier of Ozzz",
      twitter: "ozzzmabro",
      discord: "ozzz#2875",
      focus: "Artist",
      skillset: "Pixel painting, lore building",
      site: "https://atelier.artiva.app/",
      imageName: "The Atelier of Ozzz.jpeg",
    },
    {
      name: "SPZ",
      twitter: "SorcererIlyas",
      discord: "spz#0001",
      focus: "Developer",
      skillset:
        "Full-Stack: Solidity, React/TypeScript. Artist: Composer, Writer.",
      site: "https://muse.io/spz",
      imageName: "spz.gif",
    },
    {
      name: "Cosmic Nightjar",
      twitter: "CosmicBirdsNFT",
      discord: "Cosmic Nightjar#4927",
      focus: "Artist",
      skillset:
        "Wildlife biologist, vector artist, craft maxi (origami, beadwork, cross-stitch and more!), creator of Cosmic Birds of Ornithia",
      site: "https://cosmicbirdsnft.com",
    },
    // Add all other talents here...
  ];
  */

  // Fetch talents from Supabase
  const fetchTalents = useCallback(async () => {
    try {
      // Use active_talents view to exclude soft-deleted talents
      const { data, error } = await supabase
        .from("active_talents")
        .select(
          "id, name, twitter, discord, focus, skillset, site, avatar_url, user_id, created_at",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Only use database talents
      setTalents(data || []);
    } catch (error) {
      // Set empty array if database fetch fails
      setTalents([]);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTalents();
  }, [fetchTalents]);

  // Extract unique focus areas and sort them
  const focusAreas = useMemo(() => {
    const areas = new Set(talents.map((talent) => talent.focus));

    return ["All", ...Array.from(areas)].sort();
  }, [talents]);

  // Filter talents based on selected focus
  const filteredTalents = useMemo(() => {
    if (selectedFocus === "All") {
      return talents;
    }

    return talents.filter((talent) => talent.focus === selectedFocus);
  }, [talents, selectedFocus]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <Spinner color="default" size="lg" />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto py-16 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-atirose text-violet text-5xl md:text-6xl mb-6">
            Talent Board
          </h1>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-gray-300 text-base leading-relaxed">
              Looking for collaborators to work on a Forgotten Runes project?
              Use the talent board below to find community members with the
              perfect skillset for your team.
            </p>
            <p className="text-gray-300 text-base">
              Interested in being considered for work on community projects?
            </p>

            {/* Add to Board Button */}
            <button
              onClick={() => {
                if (!user) {
                  setShowLoginMessage(true);
                  setTimeout(() => setShowLoginMessage(false), 3000);
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="inline-block mt-6 bg-violet hover:bg-violet-600 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Add yourself to the board!
            </button>

            {showLoginMessage && (
              <div className="mt-4 text-sm text-red-400">
                Please log in to add yourself to the talent board
              </div>
            )}
          </div>
        </div>

        <div className="w-full mb-12">
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

        <div className="max-w-7xl mx-auto">
          {/* Focus Filter */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((focus) => (
                  <button
                    key={focus}
                    className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                      selectedFocus === focus
                        ? "bg-violet text-white shadow-lg"
                        : "bg-transparent border border-darkviolet text-gray-300 hover:border-violet hover:bg-violet/20"
                    }`}
                    onClick={() => setSelectedFocus(focus)}
                  >
                    {focus}
                  </button>
                ))}
              </div>

              {/* Talent Count */}
              <div className="text-sm text-gray-400">
                {filteredTalents.length}{" "}
                {filteredTalents.length === 1 ? "talent" : "talents"}
              </div>
            </div>
          </div>

          {/* Talent Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTalents.map((talent, index) => (
              <Bio key={talent.id || `${talent.name}-${index}`} {...talent} />
            ))}
          </div>
        </div>
      </div>

      {/* Add Talent Modal */}
      <AddTalentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTalentAdded={fetchTalents}
      />
    </DefaultLayout>
  );
};

export default Talent;
