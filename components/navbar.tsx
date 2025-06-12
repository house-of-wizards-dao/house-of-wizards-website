import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { TwitterIcon, DiscordIcon } from "@/components/icons";

// Avatar CDN URL
const AVATAR_CDN_URL =
  "https://wqpyojcwtcuzpmghjwpp.supabase.co/storage/v1/object/public/avatars/";

export const Navbar = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [avatar, setAvatar] = useState(null);

  // Fetch the user's avatar from the profiles table
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        if (!error && data && data.avatar_url) {
          setAvatar(data.avatar_url);
        }
      }
    };

    fetchUserAvatar();
  }, [user, supabase]);

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
              src="/img/logo-white.png"
              width={150}
            />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent>
        <div className="hidden lg:flex gap-6 justify-start ml-2 uppercase">
          {/*           <NavbarItem className="text-sm hover:text-[#9564b4]">
            <NextLink href="/about">
              About
            </NextLink>
          </NavbarItem> */}
          <Dropdown className="border border-violet mt-2">
            <DropdownTrigger>
              <button className="hover:text-[#9564b4] text-sm p-0 bg-transparent data-[hover=true]:bg-transparent uppercase">
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
              <DropdownItem key="artists" textValue="Artist">
                <NextLink className="uppercase" href="/artists">
                  Artist
                </NextLink>
              </DropdownItem>
              <DropdownItem key="gallery" textValue="Gallery">
                <NextLink className="uppercase" href="/gallery">
                  Gallery
                </NextLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown className="border border-violet mt-2">
            <DropdownTrigger>
              <button className="hover:text-[#9564b4] text-sm p-0 bg-transparent data-[hover=true]:bg-transparent uppercase">
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
              <DropdownItem key="talent" textValue="Talent">
                <NextLink className="uppercase" href="/talent">
                  Talent
                </NextLink>
              </DropdownItem>
              <DropdownItem key="community" textValue="Community">
                <NextLink className="uppercase" href="/community">
                  Community
                </NextLink>
              </DropdownItem>
              <DropdownItem key="signup" textValue="Join">
                <NextLink className="uppercase" href="/signup">
                  Join
                </NextLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavbarItem className="text-sm hover:text-[#9564b4]">
            <NextLink className="flex items-center gap-2" href="/ministries">
              Ministries
            </NextLink>
          </NavbarItem>
          <NavbarItem className="text-sm hover:text-[#9564b4]">
            <NextLink
              className="flex items-center gap-2"
              href="https://snapshot.org/#/forgottengov.eth"
              target="_blank"
            >
              Vote
              <FaExternalLinkAlt />
            </NextLink>
          </NavbarItem>
          {/*<NavbarItem  className="text-sm text-gray-400">
            <NextLink
              className="flex items-center gap-2 pointer-events-none"
              href="/auction"
              aria-disabled="true"
              
            >
              Auction
              <FaExternalLinkAlt />
            </NextLink>
          </NavbarItem>*/}
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
          <Link
            isExternal
            href="https://discord.gg/forgottenrunes"
            title="Discord"
          >
            <DiscordIcon className="text-white hover:text-[#9564b4]" />
          </Link>
          {user && (
            <NextLink href="/signup" title="Your Profile">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#9564b4] hover:border-white transition-colors">
                {avatar ? (
                  <Image
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    height={32}
                    src={`${AVATAR_CDN_URL}${avatar}`}
                    unoptimized
                    width={32}
                  />
                ) : (
                  <div className="w-full h-full bg-[#9564b4] flex items-center justify-center text-white font-bold">
                    {user.user_metadata?.name
                      ? user.user_metadata.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>
            </NextLink>
          )}
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
              href="/artists"
            >
              Artist
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2"
              href="/gallery"
            >
              Gallery
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2"
              href="/talent"
            >
              Talent
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2"
              href="/community"
            >
              Community
            </NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink
              className="text-white text-lg uppercase w-full block py-2"
              href="/signup"
            >
              Join
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
              <FaExternalLinkAlt size={14} />
            </NextLink>
          </NavbarMenuItem>
          {user && (
            <NavbarMenuItem className="pt-4 border-t border-gray-600 mt-4">
              <NextLink
                className="text-white text-lg uppercase w-full block py-2 flex items-center gap-2"
                href="/signup"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#9564b4]">
                  {avatar ? (
                    <Image
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      height={24}
                      src={`${AVATAR_CDN_URL}${avatar}`}
                      unoptimized
                      width={24}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#9564b4] flex items-center justify-center text-white text-xs font-bold">
                      {user.user_metadata?.name
                        ? user.user_metadata.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}
                </div>
                Profile
              </NextLink>
            </NavbarMenuItem>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
