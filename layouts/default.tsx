import { Link, LinkIcon } from "@nextui-org/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";

import { Image } from "@nextui-org/image";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="w-full py-12">
        {children}
      </main>
      <footer className="flex items-center justify-center flex-col p-4">
        <div className="flex flex-col items-center justify-center p-6 gap-3">
          <Image className="rounded-none" src="/img/logo-white.png" alt="logo" width={150}/>
          {/* <div className="flex flex-row gap-3">
            <Link href="/about" className="text-white text-xs cursor-pointer hover:text-[#9564b4]">About</Link>
            <Link href="/artists" className="text-white text-xs cursor-pointer hover:text-[#9564b4]">Artists</Link>
            <Link href="/gallery" className="text-white text-xs cursor-pointer hover:text-[#9564b4]">Gallery</Link>
            <Link href="/community" className="text-white text-xs cursor-pointer hover:text-[#9564b4]">Community</Link>
            <Link href="/about" className="text-white text-xs cursor-pointer hover:text-[#9564b4]">Council</Link>
            <Link href="/talent" className="text-white text-xs cursor-pointer hover:text-[#9564b4]">Talent</Link>
            <Link href="/ministries" className="text-white text-xs cursor-pointer hover:text-[#9564b4]">Ministires</Link>
            <Link href="https://snapshot.org/#/forgottengov.eth" className="text-white text-xs cursor-pointer hover:text-[#9564b4]">Vote</Link>
          </div> */}
          <div className="flex flex-col items-center sm:w-[700px] w-full">
            <p className="text-xs text-white uppercase">All right reserved. 2024.</p>
            <p className="text-xs text-white uppercase">Forgotten Runes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
