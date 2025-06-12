import { useState, useEffect, startTransition } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { FaTwitter, FaDiscord, FaGlobe } from "react-icons/fa";
import Image from "next/image";
import { Spinner } from "@nextui-org/spinner";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import type { UserProfile } from "@/types";

import DefaultLayout from "@/layouts/default";

const CDNURL =
  "https://wqpyojcwtcuzpmghjwpp.supabase.co/storage/v1/object/public/avatars/";

export default function IndexPage(): JSX.Element {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchAllUsers(): Promise<void> {
    try {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        return;
      }

      if (data) {
        startTransition(() => {
          setAllUsers(data as UserProfile[]);
        });
      }
    } catch (err) {}
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (): Promise<void> => {
      if (isMounted) {
        await fetchAllUsers().finally(() => setLoading(false));
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, supabase, fetchAllUsers]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <Spinner color="default" labelColor="foreground" size="lg" />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col mx-auto h-screen">
        <div className="px-4">
          <h3 className="text-violet font-atirose sm:text-7xl text-6xl text-center sm:mb-6 mb-4">
            Forgotten Artist
          </h3>
          <p className="font-quad sm:text-sm text-xs text-grey text-center uppercase">
            Seeking a talented artist to bring our creative vision to life?
          </p>
          <p className="font-quad sm:text-sm text-xs text-grey text-center uppercase">
            Just browse below so you can pick one
          </p>
        </div>

        <div className="w-full my-4">
          <svg
            aria-label="Decorative separator"
            className="w-full"
            fill="none"
            preserveAspectRatio="none"
            role="img"
            viewBox="0 0 330 8"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_453_22)">
              <path
                d="M35 3L-0.5 7.5V12.5H330V7.5L294.5 3H271L242 0H87.5L58.5 3H35Z"
                fill="transparent"
              />
              <path
                d="M59.0303 3.5303L58.8107 3.75H58.5H35.3107L0.25 7.8107V11.75H329.25V7.8107L294.189 3.75H271H270.689L270.47 3.5303L241.689 0.75H87.8107L59.0303 3.5303Z"
                stroke="#A986D9"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <defs>
              <clipPath id="clip0_453_22">
                <rect fill="white" height="8" width="330" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className="flex flex-row justify-center flex-wrap sm:gap-6 gap-3 max-w-7xl mx-auto">
          {allUsers
            .filter((userProfile) => userProfile.role !== "admin")
            .map((userProfile) => (
              <Link key={userProfile.id} href={`/user/${userProfile.id}`}>
                <Card className="rounded-md sm:w-[300px] sm:h-[450px] w-[195px] h-[350px] border border-darkviolet bg-transparent hover:scale-105 hover:border-violet cursor-pointer transition-transform duration-200">
                  <CardBody className="p-0 border-b-1 border-darkviolet p-4">
                    <Image
                      alt={`${userProfile.name || "User"}'s avatar`}
                      blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23999999'/%3E%3C/svg%3E"
                      className="w-full aspect-square object-cover rounded-lg"
                      height={300}
                      placeholder="blur"
                      src={
                        userProfile.avatar_url
                          ? `${CDNURL}${userProfile.avatar_url}`
                          : "/img/logo.png"
                      }
                      unoptimized
                      width={300}
                    />
                  </CardBody>
                  <CardFooter className="flex flex-col items-start p-4">
                    <span className="text-[#A986D9] font-atirose sm:text-2xl text-xl truncate">
                      {userProfile.name || "Anonymous"}
                    </span>
                    <p className="truncate text-xs uppercase w-[95%]">
                      {userProfile.description || "No description available"}
                    </p>
                    <div className="flex flex-col w-full mt-4 space-y-1">
                      <div className="flex flex-row items-center gap-2">
                        <FaGlobe
                          aria-hidden="true"
                          className="text-white"
                          size={18}
                        />
                        {userProfile?.website ? (
                          <a
                            aria-label={`Visit ${userProfile.name || "user"}'s website`}
                            className="text-xs uppercase truncate hover:underline"
                            href={userProfile.website}
                            rel="noopener noreferrer"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {userProfile.website}
                          </a>
                        ) : (
                          <span className="text-xs uppercase text-white">
                            None
                          </span>
                        )}
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <FaTwitter
                          aria-hidden="true"
                          className="text-white"
                          size={18}
                        />
                        {userProfile?.twitter ? (
                          <a
                            aria-label={`Visit ${userProfile.name || "user"}'s Twitter profile`}
                            className="text-xs uppercase hover:underline"
                            href={`https://twitter.com/${userProfile.twitter}`}
                            rel="noopener noreferrer"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {userProfile.twitter}
                          </a>
                        ) : (
                          <span className="text-xs uppercase text-white">
                            None
                          </span>
                        )}
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <FaDiscord
                          aria-hidden="true"
                          className="text-white"
                          size={18}
                        />
                        {userProfile?.discord ? (
                          <span
                            className="text-xs uppercase"
                            title={`Discord: ${userProfile.discord}`}
                          >
                            {userProfile.discord}
                          </span>
                        ) : (
                          <span className="text-xs uppercase text-white">
                            None
                          </span>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
