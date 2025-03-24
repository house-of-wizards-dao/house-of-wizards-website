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
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

// Add the same CDN URL constant used in your signup page
const AVATAR_CDN_URL = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/avatars/";

export const Navbar = () => {
  const { theme } = useTheme();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [avatar, setAvatar] = useState(null);
  
  // Fetch the user's avatar from the profiles table
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (!error && data && data.avatar_url) {
          setAvatar(data.avatar_url);
        }
      }
    };
    
    fetchUserAvatar();
  }, [user, supabase]);

  // Add this console log to check if user data is available
  console.log("User data:", user);
  console.log("User metadata:", user?.user_metadata);

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
{/*           <NavbarItem className="text-sm hover:text-[#9564b4]">
            <NextLink href="/about">
              About
            </NextLink>
          </NavbarItem> */}
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
          <Link isExternal href="https://discord.gg/forgottenrunes" title="Discord">
            <DiscordIcon className="text-white hover:text-[#9564b4]" />
          </Link>
          {user && (
            <NextLink href="/signup" title="Your Profile">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#9564b4] hover:border-white transition-colors">
                {avatar ? (
                  <img
                    src={`${AVATAR_CDN_URL}${avatar}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#9564b4] flex items-center justify-center text-white font-bold">
                    {user.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : 'U'}
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