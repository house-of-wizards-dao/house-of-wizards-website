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
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { TwitterIcon, DiscordIcon } from "@/components/icons";
import { Web3ConnectButton } from "@/components/Web3ConnectButton";

// Avatar CDN URL - dynamic based on environment
const getAvatarCDNURL = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL environment variable is not set");
    return "https://placeholder.supabase.co/storage/v1/object/public/avatars/";
  }
  return `${supabaseUrl}/storage/v1/object/public/avatars/`;
};

export const Navbar = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [avatar, setAvatar] = useState<string | null>(null);

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
          {/*           <NavbarItem className="text-sm hover:text-brand-500">
            <NextLink href="/about">
              About
            </NextLink>
          </NavbarItem> */}
          <Dropdown className="border border-violet mt-2">
            <DropdownTrigger>
              <button
                className="hover:text-brand-500 text-sm p-0 bg-transparent data-[hover=true]:bg-transparent uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded"
                aria-expanded={false}
                aria-haspopup="true"
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
              <button
                className="hover:text-brand-500 text-sm p-0 bg-transparent data-[hover=true]:bg-transparent uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded"
                aria-expanded={false}
                aria-haspopup="true"
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
          <NavbarItem className="text-sm hover:text-brand-500">
            <NextLink className="flex items-center gap-2" href="/ministries">
              Ministries
            </NextLink>
          </NavbarItem>
          <NavbarItem className="text-sm hover:text-brand-500">
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
          <Web3ConnectButton />
          <Link isExternal href="https://x.com/FRWCCouncil" title="Twitter">
            <TwitterIcon className="text-white hover:text-brand-500" />
          </Link>
          <Link
            isExternal
            href="https://discord.gg/forgottenrunes"
            title="Discord"
          >
            <DiscordIcon className="text-white hover:text-brand-500" />
          </Link>
          {user && (
            <NextLink href="/signup" title="Your Profile">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-brand-500 hover:border-white transition-colors">
                {avatar ? (
                  <Image
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    height={32}
                    src={
                      avatar && avatar.startsWith("http")
                        ? avatar
                        : `${getAvatarCDNURL()}${avatar || "default.png"}`
                    }
                    unoptimized
                    width={32}
                  />
                ) : (
                  <div className="w-full h-full bg-brand-500 flex items-center justify-center text-white font-bold">
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
          {user && (
            <NavbarMenuItem className="pt-4 border-t border-gray-600 mt-4">
              <NextLink
                className="text-white text-lg uppercase w-full block py-2 flex items-center gap-2"
                href="/signup"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-brand-500">
                  {avatar ? (
                    <Image
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      height={24}
                      src={
                        avatar && avatar.startsWith("http")
                          ? avatar
                          : `${getAvatarCDNURL()}${avatar || "default.png"}`
                      }
                      unoptimized
                      width={24}
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
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
