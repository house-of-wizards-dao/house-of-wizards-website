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
      <main className="w-full">
        {children}
      </main>
      <footer className="flex items-center justify-center flex-col p-4">
        <div className="flex flex-col items-center justify-center p-6 gap-3">
          <Image className="rounded-none" src="/img/logo-white.png" alt="logo" width={150}/>
          <div className="flex flex-row gap-3">
            <Link className="text-white text-xs">About</Link>
            <Link className="text-white text-xs">Artist</Link>
            <Link className="text-white text-xs">Art</Link>
            <Link className="text-white text-xs">Community</Link>
            <Link className="text-white text-xs">Council</Link>
            <Link className="text-white text-xs">Talent</Link>
            <Link className="text-white text-xs">Ministires</Link>
            <Link className="text-white text-xs">Vote</Link>
          </div>
          <div className="flex flex-col items-center w-[700px]">
            <p className="text-xs text-white">All right reserved. 2024.</p>
            <p className="text-xs text-white">Forgotten Runes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
