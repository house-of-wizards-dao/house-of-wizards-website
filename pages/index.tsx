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
    name: "Nikolas Gibbons",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/dotta.png"
  },
  {
    name: "Sienna Hewitt",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/dragonfetus.png"
  },
  {
    name: "Zahra Christensen",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/jitcy.png"
  },
  {
    name: "Zahra Christensen",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/madotsuki.png"
  },
  {
    name: "Zahra Christensen",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/meph.png"
  },
  {
    name: "Zahra Christensen",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/R Y F.png"
  },
  {
    name: "Zahra Christensen",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/r3ptar.png"
  },
  {
    name: "Zahra Christensen",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/Slickchick.png"
  },
  {
    name: "Zahra Christensen",
    role: "Lorem Ipsum",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/img/council/tv.png"
  },
  {
    name: "Zahra Christensen",
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
      {/* <div className="flex items-center justify-center">
        <div className="flex flex-row items-center justify-center w-[800px] gap-8">
          <div className="w-full flex items-center justify-center">
            <Image className="w-full rounded-none" src="/img/wizard-grid.png"/>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-6">
            <h1 className="text-[#9564b4] font-black text-3xl">The House of Wizards is a Forgotten Runes Community DAO.</h1>
            <p className="text-md">Comprised of Forgotten Runes token holders, the House of Wizards funds community proposals centered on art, lore, development, and more.</p>
            <p className="text-md">Community member looking for funding? Head over to the forum to get started on a proposal. Interested in joining the community? Shop forgotten.market to browse Forgotten Runes collections.</p>
          </div>
        </div>
      </div> */}

      <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
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
      </section>

      <div className="bg-[#121212] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#9564b4] text-4xl font-serif italic mb-6">
            Forgotten Council
          </h2>
          <p className="text-gray-300">
            The Forgotten Council is the group of wizards and warriors holding the keys to the DAO multisig wallet, is responsible for facilitating governance - everything from running votes for new proposals to managing the ministries and carrying out multisig transactions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="relative group">
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
    </DefaultLayout>
  );
}
