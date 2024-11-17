import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem
} from "@nextui-org/navbar";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@nextui-org/dropdown";

import { Button } from "@nextui-org/button";
import { IoMdArrowDropdown } from "react-icons/io";
import { Image } from "@nextui-org/image";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";
import { TwitterIcon, GithubIcon, DiscordIcon } from "@/components/icons";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme } = useTheme();

  return (
    <NextUINavbar className="sm:p-8 p-4" maxWidth="xl" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
           <Image className="rounded-none" width={150} src="/img/logo-white.png"/>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent>
        <div className="hidden lg:flex gap-6 justify-start ml-2 uppercase">
          <NavbarItem className="text-sm hover:text-[#9564b4]">
            <NextLink href="/about">
              About
            </NextLink>
          </NavbarItem>
          <Dropdown className="border border-violet mt-2">
            <DropdownTrigger>
              <button 
                className="hover:text-[#9564b4] text-sm p-0 bg-transparent data-[hover=true]:bg-transparent uppercase"
              >
                Gallery
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Gallery options"
              className="w-auto text-center"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem key="artists">
                <NextLink className="uppercase" href="/artists">
                  Artist
                </NextLink>
              </DropdownItem>
              <DropdownItem key="gallery">
                <NextLink className="uppercase" href="/gallery">
                  Gallery
                </NextLink>
              </DropdownItem>
              
            </DropdownMenu>
          </Dropdown>
          <Dropdown className="border border-violet mt-2">
            <DropdownTrigger>
              <button 
                className="hover:text-[#9564b4] text-sm p-0 bg-transparent data-[hover=true]:bg-transparent uppercase"
              >
                Community
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Gallery options"
              className="w-auto text-center"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem key="talent">
                <NextLink className="uppercase" href="/talent">
                  Talent
                </NextLink>
              </DropdownItem>
              <DropdownItem key="community">
                <NextLink className="uppercase" href="/community">
                  Community
                </NextLink>
              </DropdownItem>
              <DropdownItem key="signup">
                <NextLink className="uppercase" href="/signup">
                    Join
                </NextLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavbarItem className="text-sm hover:text-[#9564b4]">
            <NextLink
              className="flex items-center gap-2"
              href="/ministries"
            >
              Ministries
            </NextLink>
          </NavbarItem>
          <NavbarItem className="text-sm hover:text-[#9564b4]">
            <NextLink
              className="flex items-center gap-2"
              target="_blank"
              href="https://snapshot.org/#/forgottengov.eth"
            >
              Vote
              <FaExternalLinkAlt />
            </NextLink>
          </NavbarItem>
          <NavbarItem  className="text-sm text-gray-400">
            <NextLink
              className="flex items-center gap-2 pointer-events-none"
              href="/auction"
              aria-disabled="true"
              
            >
              Auction
              <FaExternalLinkAlt />
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
            <TwitterIcon className="text-white hover:text-[#9564b4]" />
          </Link>
          <Link isExternal href="https://discord.gg/forgottenrunes" title="Discord">
            <DiscordIcon className="text-white hover:text-[#9564b4]" />
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-14 flex flex-col gap-2">
            <NavbarMenuItem>
              <Link
                className="text-white" href="/about" size="lg">
                About
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-white" href="/gallery" size="lg">
                Gallery
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-white" href="/artists" size="lg">
                Artists
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-white" href="/community" size="lg">
                Community
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-white" href="/council" size="lg">
                Council
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-white" href="/talent" size="lg">
                Talent
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-white" href="/ministries" size="lg">
                Ministries
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-white" href="/vote" size="lg">
                Vote
              </Link>
            </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};