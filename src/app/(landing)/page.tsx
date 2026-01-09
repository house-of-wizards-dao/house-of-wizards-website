import NextImage from "next/image";
import { LoreWidget } from "@/app/(landing)/LoreWidget";

export default function LorePage() {
  return (
    <>
      <div className="relative h-[450px] overflow-hidden">
        <NextImage
          src="/img/merlin_last_supper.png"
          alt="House of Wizards Banner"
          fill
          priority={true}
          className="object-cover object-center"
        />
      </div>
      <section className="pt-32 pb-32 px-8">
        <LoreWidget />
    </section>
  </>
  );
}

