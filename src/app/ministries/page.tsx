import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { PageTitle } from "@/components/PageTitle";

export default function MinistriesPage() {
  return (
    <section className="flex flex-col items-center gap-4 h-screen">
      <PageTitle
        title="Ministries"
        subtitle="Ministries are House of Wizards sub-DAOs focused on a specific niche. While the Forgotten Council oversees DAO operations as a whole, the ministries are comprised of smaller, specialized teams, in order to more quickly organize and allocate funding."
      />

      <div className="flex flex-row justify-center flex-wrap gap-6">
        <Link className="[&_a]:hover:text-green" href="/ministries/art">
          <Card className="w-[250px] px-4 py-10 h-auto flex flex-col items-center bg-transparent border border-brand-900 hover:scale-105 hover:border-brand-500 cursor-pointer">
            <Image
              alt="Ministry of Art illustration"
              loading="lazy"
              src="/img/ministry_art.png"
            />
            <span className="font-atirose text-brand-500 text-2xl">
              Ministry of Art
            </span>
          </Card>
        </Link>
      </div>
    </section>
  );
}

