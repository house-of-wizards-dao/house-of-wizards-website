import DefaultLayout from "@/layouts/default";
import { useState, useEffect, startTransition } from "react";
import { useUser,useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from 'next/link';
import { FaTwitter, FaDiscord, FaGlobe } from 'react-icons/fa';
import { Image } from "@nextui-org/image";
import {Spinner} from "@nextui-org/spinner";
import { Container } from "react-bootstrap";
import { Card, CardBody, CardFooter } from "@nextui-org/card";

  const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/avatars/";

export default function IndexPage() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  async function fetchAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
  
    if (data) {
      startTransition(() => {
        setAllUsers(data);
      });
    } else {
      console.error('Error fetching users:', error);
    }
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await fetchAllUsers().finally(() => setLoading(false));;
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return <Spinner className="h-screen w-full" color="default" labelColor="foreground"/>;
  }
  

  return (
    <DefaultLayout>
      <Container className="flex flex-col max-w-8xl mx-auto">
        <div className="px-4">
        <h3 className="text-violet font-atirose sm:text-7xl text-6xl text-center sm:mb-6  mb-4">Forgotten Artist</h3>
        <p className="font-quad sm:text-sm text-xs text-grey text-center uppercase">Seeking a talented artist to bring our creative vision to life?</p>
        <p className="font-quad sm:text-sm text-xs text-grey text-center uppercase">Just browse below so you can pick one</p>
        </div>
        
        <div className="w-full my-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="100%" 
            viewBox="0 0 330 8" 
            fill="none" 
            preserveAspectRatio="none"
            className="w-full"
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
                <rect width="330" height="8" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className="flex flex-row justify-center flex-wrap sm:gap-6 gap-3 max-w-7xl mx-auto">
          {allUsers.map((user) =>(
            <Card className=" rounded-md sm:w-[300px] sm:h-[450px] w-[180px] h-[320px] border border-darkviolet bg-transparent hover:scale-105 hover:border-violet" key={user.id}>
                <CardBody className="p-0 border-b-1 border-darkviolet p-4">
                  <Image 
                    className="sm:w-full aspect-square" 
                    src={user.avatar_url ? `${CDNURL}${user.avatar_url}` : '/img/avatar.png'}
                    alt={`${user.name}'s avatar`}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AoNxbhL3xvpeNluNyeQ0pwCxJGwA5NCiQ5nZ23P1j+n//2Q=="
                  />
                </CardBody>
                <CardFooter className="flex flex-col items-start p-4">
                  <Link className="cursor-pointer text-[#A986D9] font-atirose sm:text-2xl text-xl truncate" href={`/user/${user.id}`}>{user.name}</Link>
                  <p className="truncate text-xs uppercase w-[95%]">{user.description || <p>None</p>}</p>
                  <div className="flex flex-col w-full mt-4">
                  <div className="flex flex-row items-center gap-2">
                    <FaGlobe size={18} className="text-white"/>
                    {user?.website ? (
                      <Link isExternal href={user.website} className="text-xs uppercase truncate">
                        {user.website}
                      </Link>
                    ) : (
                      <span className="text-xs uppercase text-white">None</span>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <FaTwitter size={18} className="text-white"/>
                    {user?.twitter ? (
                      <Link isExternal href={`https://twitter.com/${user.twitter}`} className="text-xs uppercase">
                        {user.twitter}
                      </Link>
                    ) : (
                      <span className="text-xs uppercase text-white">None</span>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <FaDiscord size={18} className="text-white"/>
                    {user?.discord ? (
                      <span className="text-xs uppercase">
                        {user.discord}
                      </span>
                    ) : (
                      <span className="text-xs uppercase text-white">None</span>
                    )}
                  </div>
                    </div>
                </CardFooter>
            </Card>

          ))}
        </div>
      </Container>
    </DefaultLayout>
  );
}
 