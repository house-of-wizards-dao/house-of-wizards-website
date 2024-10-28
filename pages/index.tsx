import { Image } from "@nextui-org/image";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="border">
        
      </div>
      <div className="flex items-center justify-center">
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
      </div>
    </DefaultLayout>
  );
}
