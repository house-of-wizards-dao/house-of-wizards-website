import { Card } from "@nextui-org/card";
import { PageTitle } from "@/components/PageTitle";

export default function CommunityPage() {
  return (
    <div className="flex flex-col items-center gap-4 max-w-8xl h-screen">
      <PageTitle title="Community" />

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
  );
}

