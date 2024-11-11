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
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-center">Landing Page Here</h1>
      </div>
    </DefaultLayout>
  );
}
