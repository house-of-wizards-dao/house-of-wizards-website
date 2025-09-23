import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { useState } from "react";
import Image from "next/image";

import { TwitterIcon, DiscordIcon } from "@/components/icons";
import { InstagramIcon } from "lucide-react";

// Avatar URL placeholder (Supabase removed)
const getAvatarCDNURL = () =>
  "/img/logo-white.png";

export const Navbar = () => {
  const [avatar] = useState<string | null>(null);

  // User data and metadata are available through the user object

  return (
    <NextUINavbar className="sm:p-8 p-4" maxWidth="xl" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
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

      <NavbarContent>
        <div className="hidden lg:flex gap-6 justify-start ml-2 uppercase">
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
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-4">
          <Link isExternal href="https://x.com/FRWCCouncil" title="Twitter">
            <TwitterIcon className="text-white hover:text-brand-500" />
          </Link>
          <Link isExternal href="https://instagram.com/house_of_wizards_dao" title="Instagram">
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

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-14 flex flex-col gap-2">
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2"
              href="/community"
            >
              Members
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2"
              href="/ministries"
            >
              Ministries
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2 flex items-center gap-2"
              href="https://snapshot.org/#/forgottengov.eth"
              target="_blank"
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
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
