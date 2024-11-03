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
import { Image } from "@nextui-org/image";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { TwitterIcon, GithubIcon, DiscordIcon } from "@/components/icons";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme } = useTheme();

  return (
    <NextUINavbar className="p-8" maxWidth="xl" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
           <Image className="rounded-none" width={150} src="/img/logo-white.png"/>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent>
        <div className="hidden lg:flex gap-8 justify-start ml-2">
          <NavbarItem className="font-medium">
            <NextLink href="/about">
              About
            </NextLink>
          </NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <button 
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
              >
                Gallery
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Gallery options"
              className="w-[240px] text-center"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem key="artists">
                <NextLink href="/artists">
                  Artist
                </NextLink>
              </DropdownItem>
              <DropdownItem key="gallery">
                <NextLink href="/gallery">
                  Gallery
                </NextLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavbarItem className="font-medium">
            <NextLink href="/community">
              Community
            </NextLink>
          </NavbarItem>
          <NavbarItem className="font-medium">
            <NextLink
              className="flex items-center gap-2"
              href="/"
            >
              Vote
              <FaExternalLinkAlt />
            </NextLink>
          </NavbarItem>
          <NavbarItem className="font-medium">
            <NextLink
              className="flex items-center gap-2"
              href="/"
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
          <Link isExternal href={siteConfig.links.twitter} title="Twitter">
            <TwitterIcon className="text-white" />
          </Link>
          <Link isExternal href={siteConfig.links.discord} title="Discord">
            <DiscordIcon className="text-white" />
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};