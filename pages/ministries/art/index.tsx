import { Image } from "@nextui-org/image";
import DefaultLayout from "@/layouts/default";
import { Link } from "@nextui-org/link";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex sm:min-h-screen flex-col items-center justify-center gap-4 p-4">
        <div className="inline-block max-w-7lg text-center justify-center flex flex-col gap-6">
          <h1 className="text-5xl font-serif italic text-[#9564b4]">Ministry of Art</h1>
          <p className="max-w-5xl mx-auto text-lg">The Ministry of Art is a DAO that generously issues grants to create Forgotten Runes art. This can be anything from paintings, comics, sculptures, murals, videogames - any art that contributes to the story of the Runiverse. Anyone can request funding from the ministry to support projects in the scope of the mandate.</p>
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
          <Image src="/img/cultcontent.png"/>
          <p className="max-w-5xl mx-auto text-lg">To request funding please fill out the <Link className="font-serif italic text-[#9564b4] text-xl" isExternal href='https://docs.google.com/forms/d/e/1FAIpQLSdK1SUgOYYVbnatzeAxcs8NQCuxD9L41a61GvjDuLvbhv-_2A/viewform'>Funding Request Form</Link>.</p>
        </div>
      </section>
    </DefaultLayout>
  );
}
