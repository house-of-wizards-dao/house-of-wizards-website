import NextImage from "next/image";
import { LazyImage } from "@/components/ui/LazyImage";
import { ScrollToTeamButton } from "@/components/ScrollToTeamButton";

const teamMembers = [
  {
    name: "Bridge",
    image: "/img/council/head_Wizzy_purple.png",
  },
  {
    name: "DFI",
    image: "/img/council/head_Chookie.png",
  },
  {
    name: "feckless",
    image: "/img/council/head_Ratko.png",
  },
  {
    name: "Madotsuki",
    image: "/img/council/head_Carly.png",
  },
  {
    name: "MeepleDad",
    image: "/img/council/head_Marlow.png",
  },
  {
    name: "R3ptar",
    image: "/img/council/head_Pino.png",
  },
  {
    name: "SharkChild",
    image: "/img/council/head_Eyebol.png",
  },
  {
    name: "Sharon",
    image: "/img/council/head_Artis.png",
  },
  {
    name: "TadMajor",
    image: "/img/council/head_Woomba.png",
  },
  {
    name: "vmark",
    image: "/img/council/head_Jack.png",
  },
];

export default function IndexPage() {
  return (
    <>
      <div className="relative h-[450px] overflow-hidden">
        <NextImage
          src="/img/merlin_last_supper.png"
          alt="House of Wizards Banner"
          fill
          priority={true}
          className="object-cover object-center"
        />
      </div>
      <section className="pt-64 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h1 className="text-4xl md:text-5xl font-atirose text-violet font-bold leading-tight">
              The House of Wizards is a Forgotten Runes Community DAO.
            </h1>
            <div className="space-y-6">
              <p className="text-gray-300 text-base leading-relaxed">
                The House of Wizards, comprised of Forgotten Runes token
                holders, funds community proposals that support art, lore,
                development, and other creative endeavors.
              </p>
              <p className="text-gray-300 text-base leading-relaxed">
                Looking for funding as a community member? Start by submitting
                a proposal to bring your ideas to life. Interested in joining
                the community? Visit forgotten.market to explore Forgotten
                Runes collections.
              </p>
            </div>
            <div className="pt-6">
              <ScrollToTeamButton />
            </div>
          </div>
          <div className="relative h-[600px]">
            <div className="absolute inset-0">
              <NextImage
                src="/img/dao.jpg"
                alt="dao"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-darkGray py-32 px-8" id="team-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-brand-500 text-5xl md:text-6xl font-atirose mb-10">
              Forgotten Council
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              The Forgotten Council is the group of wizards and warriors
              holding the keys to the DAO multisig wallet, is responsible for
              facilitating governance - everything from running votes for new
              proposals to managing the ministries and carrying out multisig
              transactions.
            </p>
          </div>

          <div className="flex flex-row flex-wrap gap-8 justify-center mt-16">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="w-[200px] sm:w-[220px] flex flex-col items-center transform transition-all duration-300 hover:scale-105"
              >
                <div className="mb-6 overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <LazyImage
                    alt={member.name}
                    className="w-full h-full object-cover"
                    height={96}
                    src={member.image}
                    width={96}
                    fallback={
                      <div className="w-full h-full bg-gradient-to-br from-violet/20 to-purple-500/20 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    }
                    errorFallback={
                      <div className="w-full h-full bg-gradient-to-br from-violet/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-violet text-lg font-medium">
                          {member.name[0]}
                        </span>
                      </div>
                    }
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-atirose text-center text-violet">
                    {member.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
