import NextImage from "next/image";
import { LazyImage } from "@/components/ui/LazyImage";

import DefaultLayout from "@/layouts/default";
import ErrorBoundary from "@/components/ErrorBoundary";

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
    name: "MeepleDad",

    image: "/img/council/head_Marlow.png",
  },
  {
    name: "Madotsuki",

    image: "/img/council/head_Carly.png",
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
    name: "R3ptar",

    image: "/img/council/head_Pino.png",
  },
  {
    name: "vmark",

    image: "/img/council/head_Jack.png",
  },
];

export default function IndexPage() {
  return (
    <DefaultLayout>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Error Loading Page
                </h2>
                <p className="text-gray-400 mb-6">
                  There was an error loading the homepage. Please try refreshing
                  the page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-violet hover:bg-violet/80 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        }
      >
        <div className="relative h-[450px] overflow-hidden">
          <NextImage
            src="/img/merlin_last_supper.png"
            alt="House of Wizards Banner"
            fill
            priority={true}
            className="object-cover object-center"
            // sizes="100vw"
          />
        </div>

        <section className="py-32 px-8">
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
                <button
                  aria-label="Scroll to team section"
                  className="bg-violet text-white px-8 py-3 rounded-full hover:bg-violet-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet focus:ring-opacity-50 font-medium shadow-lg hover:shadow-xl"
                  onClick={() => {
                    document.getElementById("team-section")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Meet the Team
                </button>
              </div>
            </div>
            <div className="relative h-[600px]">
              <div className="absolute inset-0">
                {/* Replace with your actual hero image */}
                <div className="bg-gradient-to-br from-violet/20 to-purple-100/30 rounded-3xl h-full w-full backdrop-blur-sm shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        <div className="bg-neutral-darkGray py-32 px-8" id="team-section">
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
                    {/* <p className="text-gray-600 text-center">{member.role}</p>
                <p className="text-sm text-gray-500 text-center">{member.bio}</p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </DefaultLayout>
  );
}
