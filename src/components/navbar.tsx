import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Image from "next/image";

import { useState } from "react";
import { InstagramIcon, Menu, X } from "lucide-react";
import { TwitterIcon, DiscordIcon } from "@/components/icons";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <NextUINavbar
      className="sm:p-8 p-4"
      maxWidth="xl"
      position="static"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 shrink-0">
          <NextLink
            className="flex justify-start items-center gap-1 shrink-0"
            href="/"
          >
            <Image
              alt="HowDAO logo"
              className="rounded-none"
              height={50}
              priority={true}
              src="/img/logo-white.png"
              width={150}
            />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex gap-6 justify-start ml-2 uppercase">
        <NavbarItem className="text-sm hover:text-brand-500 transition-colors">
          <NextLink className="flex items-center gap-2" href="/community">
            Blog
          </NextLink>
        </NavbarItem>
        <NavbarItem className="text-sm hover:text-brand-500 transition-colors">
          <NextLink className="flex items-center gap-2" href="/community">
            Community
          </NextLink>
        </NavbarItem>
        <NavbarItem className="text-sm hover:text-brand-500 transition-colors">
          <NextLink className="flex items-center gap-2" href="/ministries">
            Ministries
          </NextLink>
        </NavbarItem>
        <NavbarItem className="text-sm hover:text-brand-500 transition-colors">
          <NextLink
            className="flex items-center gap-2"
            href="https://snapshot.org/#/forgottengov.eth"
            target="_blank"
          >
            Vote
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-4">
          <Link isExternal href="https://x.com/FRWCCouncil" title="Twitter">
            <TwitterIcon className="text-white hover:text-brand-500" />
          </Link>
          <Link
            isExternal
            href="https://instagram.com/house_of_wizards_dao"
            title="Instagram"
          >
            <InstagramIcon className="text-white hover:text-brand-500" />
          </Link>
          <Link
            isExternal
            href="https://discord.gg/forgottenrunes"
            title="Discord"
          >
            <DiscordIcon className="text-white hover:text-brand-500" />
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
        <NavbarItem>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-brand-500 transition-colors p-2"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            type="button"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-black/95 backdrop-blur-sm !opacity-100 !visible z-[9999] fixed top-0 left-0 right-0 bottom-0">
        <div className="mx-4 mt-14 flex flex-col gap-2">
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2 hover:text-brand-500 transition-colors"
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2 hover:text-brand-500 transition-colors"
              href="/community"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2 hover:text-brand-500 transition-colors"
              href="/ministries"
              onClick={() => setIsMenuOpen(false)}
            >
              Ministries
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full flex items-center gap-2 py-2 hover:text-brand-500 transition-colors"
              href="https://snapshot.org/#/forgottengov.eth"
              target="_blank"
              onClick={() => setIsMenuOpen(false)}
            >
              Vote
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </NextLink>
          </NavbarMenuItem>
          <div className="mt-6 pt-6 border-t border-neutral-700">
            <div className="flex gap-4 justify-start">
              <Link
                isExternal
                href="https://x.com/FRWCCouncil"
                title="Twitter"
                onClick={() => setIsMenuOpen(false)}
              >
                <TwitterIcon className="text-white hover:text-brand-500 transition-colors w-6 h-6" />
              </Link>
              <Link
                isExternal
                href="https://instagram.com/house_of_wizards_dao"
                title="Instagram"
                onClick={() => setIsMenuOpen(false)}
              >
                <InstagramIcon className="text-white hover:text-brand-500 transition-colors w-6 h-6" />
              </Link>
              <Link
                isExternal
                href="https://discord.gg/forgottenrunes"
                title="Discord"
                onClick={() => setIsMenuOpen(false)}
              >
                <DiscordIcon className="text-white hover:text-brand-500 transition-colors w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
