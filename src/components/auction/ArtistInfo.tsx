import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  UserIcon,
  GlobeAltIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

import type { Artist } from "@/types";

interface ArtistInfoProps {
  artist?: Artist;
  className?: string;
}

export function ArtistInfo({ artist, className }: ArtistInfoProps) {
  if (!artist) {
    return (
      <div className={`${className}`}>
        <Card className="bg-neutral-800/50 border border-neutral-700">
          <CardBody className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-700 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-neutral-500" />
            </div>
            <p className="text-neutral-400">Artist information not available</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 border border-neutral-700 backdrop-blur-sm">
        <CardHeader className="pb-0">
          <h3 className="text-lg font-semibold text-white">About the Artist</h3>
        </CardHeader>
        <CardBody className="p-6 pt-4">
          <div className="space-y-6">
            {/* Artist Avatar & Name */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {artist.image ? (
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand-500/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-semibold text-xl">
                    {artist.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-white mb-1">
                  {artist.name}
                </h4>
                <p className="text-brand-400 text-sm font-medium">
                  Digital Artist
                </p>
              </div>
            </div>

            {/* Artist Bio */}
            {artist.bio && (
              <div>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {artist.bio}
                </p>
              </div>
            )}

            {/* Social Links */}
            <div className="space-y-3">
              <div className="text-sm text-neutral-400 font-medium">
                Connect
              </div>
              <div className="space-y-2">
                {artist.website && (
                  <Link
                    href={artist.website}
                    isExternal
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <GlobeAltIcon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        Website
                      </div>
                      <div className="text-neutral-400 text-xs">
                        Visit artist portfolio
                      </div>
                    </div>
                  </Link>
                )}

                {artist.twitter && (
                  <Link
                    href={`https://twitter.com/${artist.twitter.replace("@", "")}`}
                    isExternal
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center group-hover:bg-blue-400/30 transition-colors">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        Twitter
                      </div>
                      <div className="text-neutral-400 text-xs">
                        {artist.twitter}
                      </div>
                    </div>
                  </Link>
                )}

                {artist.instagram && (
                  <Link
                    href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
                    isExternal
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                      <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.246.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.186 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.631-.167 5.65-2.185 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.773 2.246 17.754.227 14.123.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        Instagram
                      </div>
                      <div className="text-neutral-400 text-xs">
                        {artist.instagram}
                      </div>
                    </div>
                  </Link>
                )}

                {artist.portfolio && (
                  <Link
                    href={artist.portfolio}
                    isExternal
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <UserIcon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        Portfolio
                      </div>
                      <div className="text-neutral-400 text-xs">
                        View more works
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Contact Artist Button */}
            <div className="pt-4 border-t border-neutral-700/50">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-brand-500/20 to-brand-600/20 border border-brand-500/30 text-brand-400 hover:bg-gradient-to-r hover:from-brand-500/30 hover:to-brand-600/30 transition-all duration-300"
                startContent={<ChatBubbleLeftIcon className="w-4 h-4" />}
              >
                Contact Artist
              </Button>
            </div>


            {/* Artist Badge */}
            <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-brand-500/10 to-brand-600/10 border border-brand-500/20 rounded-lg">
              <div className="w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-brand-400 text-sm font-medium">
                Verified Artist
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
