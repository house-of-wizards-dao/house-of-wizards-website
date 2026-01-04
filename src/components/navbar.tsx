"use client";

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

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
}

export interface SocialLink {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationLinks: NavLink[] = [
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Community",
    href: "/community",
  },
  {
    label: "Ministries",
    href: "/ministries",
  },
  {
    label: "Burns",
    href: "/burns",
  },
  {
    label: "PFP",
    href: "/pfp-mint",
  },
  {
    label: "Vote",
    href: "https://snapshot.org/#/forgottengov.eth",
    external: true,
    icon: (
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
    ),
  },
];

const socialLinks: SocialLink[] = [
  {
    href: "https://x.com/FRWCCouncil",
    title: "Twitter",
    icon: TwitterIcon,
  },
  {
    href: "https://instagram.com/house_of_wizards_dao",
    title: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://discord.gg/forgottenrunes",
    title: "Discord",
    icon: DiscordIcon,
  },
];

const ExternalLinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
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
);

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

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

      {/* Desktop Navigation Links */}
      <NavbarContent className="hidden lg:flex gap-6 justify-start ml-2 uppercase">
        {navigationLinks.map((link) => (
          <NavbarItem key={link.href} className="text-sm hover:text-brand-500 transition-colors">
            <NextLink
              className="flex items-center gap-2"
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.label}
              {link.icon}
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Desktop Social Links */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-4">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <Link
                key={social.href}
                isExternal
                href={social.href}
                title={social.title}
              >
                <IconComponent className="text-white hover:text-brand-500" />
              </Link>
            );
          })}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      <NavbarMenu className="bg-black/95 backdrop-blur-sm !opacity-100 !visible z-[9999] fixed top-0 left-0 right-0 bottom-0">
        <div className="mx-4 mt-4 flex flex-col gap-2">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-brand-500 transition-colors p-2"
              aria-label="Close menu"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {navigationLinks.map((link) => (
            <NavbarMenuItem key={link.href}>
              <NextLink
                className="text-white text-lg uppercase w-full flex items-center gap-2 py-2 hover:text-brand-500 transition-colors"
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                onClick={handleLinkClick}
              >
                {link.label}
                {link.external && <ExternalLinkIcon />}
              </NextLink>
            </NavbarMenuItem>
          ))}
          <div className="mt-6 pt-6 border-t border-neutral-700">
            <div className="flex gap-4 justify-start">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.href}
                    isExternal
                    href={social.href}
                    title={social.title}
                    onClick={handleLinkClick}
                  >
                    <IconComponent className="text-white hover:text-brand-500 transition-colors w-6 h-6" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
