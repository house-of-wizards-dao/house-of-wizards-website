import { Card } from "@nextui-org/card";
import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex min-h-screen flex-col items-center justify-center gap-4 py-8 px-4">
        <div className="inline-block max-w-7lg text-center justify-center flex flex-col gap-6">
          <h1 className="text-5xl font-serif italic text-[#9564b4]">Community</h1>
          <p className="max-w-5xl text-lg">The House of Wizards includes nearly all <i className="font-serif text-[#9564b4]">Forgoten Runes</i> token holders. The <i className="font-serif text-[#9564b4]">Beast Spawn</i> and <i className="font-serif text-[#9564b4]">Gate to the 7th Realm</i> collections
          do not currently have voting power in the DAO. Voting weight is distributed per token as follows:</p>
          <div className="flex flex-row justify-center flex-wrap sm:gap-6 gap-3">
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
          </div>
          <p className="max-w-5xl text-lg">Anyone holding a token from these collection is alson eligible to <i className="font-serif text-[#9564b4]">to submit proposals</i>.
            Looking to get a project team together? Check out the <i className="font-serif text-[#9564b4]">talent</i>!</p>
        </div>
      </section>
    </DefaultLayout>
  );
}
