import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-4 h-screen">
        <h1 className="sm:text-7xl text-6xl font-atirose text-brand-500 ">
          Ministries
        </h1>
        <p
          className="font-quad text-sm text-gray-400 text-center uppercase
max-w-5xl"
        >
          Ministries are House of Wizards sub-DAOs focused on a specific niche.
          While the Forgotten Council oversees DAO operations as a whole, the
          ministries are comprised of smaller, specialized teams, in order to
          more quickly organize and allocate funding.
        </p>

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

        <div className="flex flex-row justify-center flex-wrap gap-6">
          <Link className="[&_a]:hover:text-green" href="/ministries/art">
            <Card className="w-[250px] px-4 py-10 h-auto flex flex-col items-center bg-transparent border border-brand-900 hover:scale-105 hover:border-brand-500 cursor-pointer">
              <Image
                alt="Ministry of Art illustration"
                src="/img/ministry_art.png"
              />
              <span className="font-atirose text-brand-500 text-2xl">
                Ministry of Art
              </span>
            </Card>
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
