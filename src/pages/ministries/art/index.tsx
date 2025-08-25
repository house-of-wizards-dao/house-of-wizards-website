import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex sm:min-h-screen flex-col items-center gap-4">
        <h1 className="sm:text-7xl text-6xl text-center font-atirose text-[#9564b4]">
          Ministry of Art
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
        <p className="max-w-5xl text-center mx-auto sm:text-md text-sm p-4">
          The Ministry of Art is a DAO that generously issues grants to create
          Forgotten Runes art. This can be anything from paintings, comics,
          sculptures, murals, videogames - any art that contributes to the story
          of the Runiverse. Anyone can request funding from the ministry to
          support projects in the scope of the mandate.
        </p>
        {/* <div className="flex flex-row justify-center flex-wrap gap-6">
            <Card className="w-[180px] px-4 py-10 h-auto">
              <h1 className="text-lg">Warriors</h1>
              <p className="text-8xl font-black text-[#9564b4]">1</p>
              <p className="text-md">Vote</p>
            </Card>
            <Card className="w-[180px]  px-4 py-10 h-auto">
              <h1 className="text-lg">Wizards</h1>
              <p className="text-8xl font-black text-[#9564b4]">2</p>
              <p className="text-md">Vote</p>
            </Card>
            <Card className="w-[180px]  px-4 py-10 h-auto">
              <h1 className="text-lg">Ponies</h1>
              <p className="text-8xl font-black text-[#9564b4]">4</p>
              <p className="text-md">Vote</p>
            </Card>
            <Card className="w-[180px]  px-4 py-10 h-auto">
              <h1 className="text-lg">Souls</h1>
              <p className="text-8xl font-black text-[#9564b4]">8</p>
              <p className="text-md">Vote</p>
            </Card>
            <Card className="w-[180px] px-4 py-10 h-auto">
              <h1 className="text-lg">Beast</h1>
              <p className="text-8xl font-black text-[#9564b4]">50</p>
              <p className="text-md">Vote</p>
            </Card>
          </div> */}
        <Image
          alt="Cultural content and art ministry information graphic"
          className="px-4"
          src="/img/cultcontent.png"
        />
        <p className="max-w-5xl mx-auto sm:text-md text-sm text-center">
          To request funding please fill out the{" "}
          <Link
            isExternal
            className="font-atirose text-[#9564b4] sm:text-xl text-lg"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfY8gtHsO-vusX0GV1jn9y_Nza0OV0vRTFOITKI8k2NHUetGw/viewform"
          >
            Funding Request Form
          </Link>
          .
        </p>
      </section>
    </DefaultLayout>
  );
}
