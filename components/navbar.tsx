import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";

import { Image } from "@nextui-org/image";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Link } from "@nextui-org/link";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
} from "@/components/icons";

import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme } = useTheme();

  return (
    <NextUINavbar className="p-8" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
           <Image className="rounded-none" width={200} src={theme === "dark" ? "/img/logo-white.png" : "/img/logo-black.png"}/>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent>
      <div className="hidden lg:flex gap-8 justify-start ml-2">
            <NavbarItem className="font-medium">
              <NextLink
                className=""
                href="/"
              >
                About
              </NextLink>
            </NavbarItem>
            <NavbarItem className="font-medium">
              <NextLink
                className=""
                href="/"
              >
                Gallery
              </NextLink>
            </NavbarItem>
            <NavbarItem className="font-medium">
              <NextLink
                className=""
                href="/"
              >
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
                Discuss
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
            <TwitterIcon className={theme === "dark" ? "text-white" : "text-black"} />
          </Link>
          <Link isExternal href={siteConfig.links.discord} title="Discord">
            <DiscordIcon className={theme === "dark" ? "text-white" : "text-black"} />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
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
