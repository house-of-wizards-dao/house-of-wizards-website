import { Card } from "@nextui-org/card";

import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center gap-4 max-w-8xl h-screen">
        <h1 className="sm:text-7xl text-6xl font-atirose text-brand-500">
          Community
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

        <div className="max-w-7xl flex flex-col gap-6 sm:p-0 p-4">
          <p className="text-md text-center">
            The House of Wizards includes nearly all{" "}
            <i className="font-atirose text-xl text-brand-500">
              Forgotten Runes
            </i>{" "}
            token holders. The{" "}
            <i className="font-atirose text-xl text-brand-500">Beast Spawn</i>{" "}
            and{" "}
            <i className="font-atirose text-xl text-brand-500">
              Gate to the 7th Realm
            </i>{" "}
            collections do not currently have voting power in the DAO. Voting
            weight is distributed per token as follows:
          </p>
          <div className="flex flex-row justify-center max-w-3xl mx-auto flex-wrap sm:gap-6 gap-3">
            <Card className="w-[180px] flex flex-col items-center justify-center p-6">
              <h1 className="text-lg">Warriors</h1>
              <p className="text-7xl font-black text-brand-500">1</p>
              <p className="text-md">Vote</p>
            </Card>
            <Card className="w-[180px]  flex flex-col items-center justify-center p-6">
              <h1 className="text-lg">Wizards</h1>
              <p className="text-7xl font-black text-brand-500">2</p>
              <p className="text-md">Vote</p>
            </Card>
            <Card className="w-[180px]  flex flex-col items-center justify-center p-6">
              <h1 className="text-lg">Ponies</h1>
              <p className="text-7xl font-black text-brand-500">4</p>
              <p className="text-md">Vote</p>
            </Card>
            <Card className="w-[180px]  flex flex-col items-center justify-center p-6">
              <h1 className="text-lg">Souls</h1>
              <p className="text-7xl font-black text-brand-500">8</p>
              <p className="text-md">Vote</p>
            </Card>
            <Card className="w-[180px] flex flex-col items-center justify-center p-6">
              <h1 className="text-lg">Beast</h1>
              <p className="text-7xl font-black text-brand-500">50</p>
              <p className="text-md">Vote</p>
            </Card>
          </div>
          <p className="text-md text-center">
            Anyone holding a token from these collection is alson eligible to{" "}
            <i className="font-atirose text-xl text-brand-500">
              to submit proposals
            </i>
            . Looking to get a project team together? Check out the{" "}
            <i className="font-atirose text-xl text-brand-500">talent</i>!
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
}
