import { Image } from "@nextui-org/image";
import DefaultLayout from "@/layouts/default";

const teamMembers = [
  {
    name: "Bambam",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/bambam.png"
  },
  {
    name: "Dotta",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/dotta.png"
  },
  {
    name: "Dragonfetus",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/dragonfetus.png"
  },
  {
    name: "Jitcy",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/jitcy.png"
  },
  {
    name: "Madotsuki",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/madotsuki.png"
  },
  {
    name: "Meph",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/meph.png"
  },
  {
    name: "RYF",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/R Y F.png"
  },
  {
    name: "Reptar",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/r3ptar.png"
  },
  {
    name: "Slickchick",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/Slickchick.png"
  },
  {
    name: "TV",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/tv.png"
  },
  {
    name: "Wazir",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/wazir.png"
  }
];

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="bg-[url('/img/banner.png')] h-[500px] bg-center">
      </div>
      
      <section className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-4xl text-[#9564b4] font-bold">
           The House of Wizards is a <i className="font-serif font-normal">Forgotten Runes</i> Community DAO.
          </h1>
          <p className="text-gray-300 text-lg">
            The House of Wizards, comprised of Forgotten Runes token holders, funds community proposals that support art, lore, development, and other creative endeavors.
          </p>
          <p className="text-gray-300 text-lg">
            Looking for funding as a community member? Start by submitting a proposal to bring your ideas to life. Interested in joining the community? Visit forgotten.market to explore Forgotten Runes collections.
          </p>
          <button className="bg-[#9564b4] text-white px-6 py-3 rounded-lg">
            Meet the Team
          </button>
        </div>
        <div className="relative h-96">
          <div className="absolute inset-0">
            {/* Replace with your actual hero image */}
            <div className="bg-purple-100 rounded-lg h-full w-full"/>
          </div>
        </div>
        </div>
      </section>

      <div className="bg-[#121212] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto sm:mb-16 mb-0">
          <h2 className="text-[#9564b4] text-4xl font-serif italic mb-6">
            Forgotten Council
          </h2>
          <p className="text-gray-300">
            The Forgotten Council is the group of wizards and warriors holding the keys to the DAO multisig wallet, is responsible for facilitating governance - everything from running votes for new proposals to managing the ministries and carrying out multisig transactions.
          </p>
        </div>

        <div className="flex flex-row flex-wrap sm:gap-6 gap-3 justify-center">
          {teamMembers.map((member, index) => (
            <div key={index} className="w-[170px] sm:w-[190px]">
              <div className="aspect-[3/4] mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <p className="text-sm text-gray-500">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className="sm:min-h-screen flex items-center justify-center p-8">
        <div className="max-w-5xl w-full mx-auto flex sm:flex-row flex-col-reverse sm:gap-14 gap-8 items-center">
          {/* Form Section */}
          <div className="w-full max-w-md">
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#9564b4] transition-colors"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#9564b4] transition-colors"
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Share your thoughts"
                  rows={4}
                  className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#9564b4] transition-colors resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-white text-black py-3 px-6 rounded-full font-medium hover:bg-[#9564b4] hover:te transition-colors"
              >
                SEND
              </button>
            </form>
          </div>

          {/* Text Section */}
          <div className="text-white sm:space-y-16 space-y-8">
            <div className="">
              <h2 className="text-5xl font-serif">Contact <i className="font-serif text-[#9564b4]">Us</i></h2>
            </div>
            <p className="text-gray-400 max-w-md">
              It is very important for us to keep in touch with you, so we are always ready to answer any question that interests you. Shoot!
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
