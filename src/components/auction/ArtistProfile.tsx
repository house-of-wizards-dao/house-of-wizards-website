import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Link } from "@nextui-org/link";
import { Button } from "@/components/ui/Button";
import { Artist } from "@/types";

interface ArtistProfileProps {
  artist: Artist;
  className?: string;
}

export function ArtistProfile({ artist, className }: ArtistProfileProps) {
  return (
    <Card className={className}>
      <CardBody className="text-center">
        <Avatar
          src={artist.image}
          name={artist.name}
          size="lg"
          className="mx-auto mb-4"
        />

        <h3 className="text-xl font-bold text-white mb-2">{artist.name}</h3>

        {artist.bio && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {artist.bio}
          </p>
        )}

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-4">
          {artist.website && (
            <Link
              href={artist.website}
              isExternal
              className="text-gray-400 hover:text-brand-400 transition-colors"
              aria-label="Artist website"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          )}

          {artist.twitter && (
            <Link
              href={`https://twitter.com/${artist.twitter.replace("@", "")}`}
              isExternal
              className="text-gray-400 hover:text-brand-400 transition-colors"
              aria-label="Artist Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </Link>
          )}

          {artist.instagram && (
            <Link
              href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
              isExternal
              className="text-gray-400 hover:text-brand-400 transition-colors"
              aria-label="Artist Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.25-3.197-1.045-.748-.794-1.173-1.977-1.173-3.274 0-1.297.425-2.48 1.173-3.274.749-.795 1.9-1.045 3.197-1.045s2.448.25 3.197 1.045c.748.794 1.173 1.977 1.173 3.274 0 1.297-.425 2.48-1.173 3.274-.749.795-1.9 1.045-3.197 1.045zm7.138 0c-1.297 0-2.448-.25-3.197-1.045-.748-.794-1.173-1.977-1.173-3.274 0-1.297.425-2.48 1.173-3.274.749-.795 1.9-1.045 3.197-1.045s2.448.25 3.197 1.045c.748.794 1.173 1.977 1.173 3.274 0 1.297-.425 2.48-1.173 3.274-.749.795-1.9 1.045-3.197 1.045z" />
              </svg>
            </Link>
          )}

          {artist.portfolio && (
            <Link
              href={artist.portfolio}
              isExternal
              className="text-gray-400 hover:text-brand-400 transition-colors"
              aria-label="Artist portfolio"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Link href={`/artists/${artist.id}`}>
            <Button variant="outline" size="sm" fullWidth>
              View Artist Profile
            </Button>
          </Link>

          {artist.portfolio && (
            <Link href={artist.portfolio} isExternal>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                rightIcon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                }
              >
                View Portfolio
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-lg font-bold text-white">12</p>
            <p className="text-xs text-gray-400 uppercase">Artworks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">8</p>
            <p className="text-xs text-gray-400 uppercase">Auctions</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
