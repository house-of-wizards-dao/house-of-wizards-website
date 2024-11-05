import { Card } from "@nextui-org/card";
import DefaultLayout from "@/layouts/default";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex min-h-screen flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-7lg text-center justify-center flex flex-col gap-6">
          <h1 className="text-5xl font-serif italic text-[#9564b4]">Ministries</h1>
          <p className="max-w-5xl text-lg">Ministries are House of Wizards sub-DAOs focused on a specific niche. While the <i className="font-serif text-[#9564b4]">Forgotten Council</i> oversees DAO operations as a whole, the ministries are comprised of smaller, specialized teams, in order to more quickly organize and allocate funding.</p>
          <div className="flex flex-row justify-center flex-wrap gap-6">
            <Card className="w-[250px] px-4 py-10 h-auto flex flex-col items-center">
                <Image src="/img/ministry_art.png"/>
                <Link href="/ministries/art" className="font-serif italic text-[#9564b4] text-xl">Ministry of Art</Link>
            </Card>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
