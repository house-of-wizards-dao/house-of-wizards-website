import { Image } from "@nextui-org/image";
import DefaultLayout from "@/layouts/default";

const teamMembers = [
  {
    name: "Acid",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/acid.png"
  },
  {
    name: "Bridge",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/bridge.png"
  },
  {
    name: "DFI",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/dfi.png"
  },
  {
    name: "MeepleDad",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/meeple.png"
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
    image: "/img/council/R Y F.png"
  },
  {
    name: "SharkChild",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/sharkchild.png"
  },
  {
    name: "Sharon",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/sharon.png"
  },
  {
    name: "TadMajor",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/jitcy.png"
  },
  {
    name: "Reptar",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/reptar.png"
  },
];

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="bg-[url('/img/banner.png')] h-[500px] bg-center">
      </div>
      
      <section className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-atirose text-violet font-bold">
           The House of Wizards is a Forgotten Runes Community DAO.
          </h1>
          <p className="text-gray-300 text-md">
            The House of Wizards, comprised of Forgotten Runes token holders, funds community proposals that support art, lore, development, and other creative endeavors.
          </p>
          <p className="text-gray-300 text-md">
            Looking for funding as a community member? Start by submitting a proposal to bring your ideas to life. Interested in joining the community? Visit forgotten.market to explore Forgotten Runes collections.
          </p>
          <button className="bg-violet text-sm text-white px-6 py-3 rounded-lg">
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
        <div className="text-center max-w-4xl mx-auto sm:mb-16 mb-0">
          <h2 className="text-[#9564b4] text-6xl font-atirose mb-6">
            Forgotten Council
          </h2>
          <p className="text-gray-300 text-md">
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
                <h3 className="text-xl font-atirose text-center text-violet">{member.name}</h3>
                <p className="text-gray-600 text-center">{member.role}</p>
                <p className="text-sm text-gray-500 text-center">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className="flex items-center justify-center sm:py-[200px] py-[100px] sm:p-0 p-4">
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
              <h2 className="text-6xl font-atirose">Contact <i className="font-atirose text-[#9564b4]">Us</i></h2>
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
