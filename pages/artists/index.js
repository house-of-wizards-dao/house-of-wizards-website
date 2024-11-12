import DefaultLayout from "@/layouts/default";
import { useState, useEffect, startTransition } from "react";
import { useUser,useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from 'next/link';
import { FaTwitter, FaDiscord, FaGlobe } from 'react-icons/fa';
import {Tooltip} from "@nextui-org/tooltip"
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
      <Container className="flex flex-col max-w-7xl p-4 mx-auto">
        <h3 className="text-[#9564b4] font-serif italic sm:text-4xl text-3xl text-center mb-3">Forgotten Artist</h3>
        <p className="font-quad sm:text-md text-sm text-grey text-center">Seeking a talented artist to bring our creative vision to life?</p>
        <p className="font-quad sm:text-md text-sm text-grey text-center mb-3">Just browse below so you can pick one</p>

        <div className="flex flex-row justify-center flex-wrap sm:gap-6 gap-3 mt-4">
          {allUsers.map((user) =>(
            <Card className="sm:w-[300px] sm:h-[450px] w-[180px] h-[320px]" key={user.id}>
                <CardBody>
                  <Image 
                    className="sm:w-full aspect-square" 
                    src={user.avatar_url ? `${CDNURL}${user.avatar_url}` : '/img/avatar.png'}
                    alt={`${user.name}'s avatar`}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AoNxbhL3xvpeNluNyeQ0pwCxJGwA5NCiQ5nZ23P1j+n//2Q=="
                  />
                </CardBody>
                <CardFooter className="px-4 flex flex-col items-start">
                  <Link className="cursor-pointer text-[#9564b4] font-serif italic sm:text-lg text-md truncate" href={`/user/${user.id}`}>{user.name}</Link>
                  <p className="truncate sm:text-sm text-xs">{user.description || <p>None</p>}</p>
                  <div className="flex flex-col w-full mt-4">
                  <div className="flex flex-row items-center gap-2">
                    <FaGlobe size={18} className="text-white"/>
                    {user?.website ? (
                      <Link isExternal href={user.website} className="sm:text-sm text-xs truncate">
                        {user.website}
                      </Link>
                    ) : (
                      <span className="sm:text-sm text-xs text-white">None</span>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <FaTwitter size={18} className="text-white"/>
                    {user?.twitter ? (
                      <Link isExternal href={`https://twitter.com/${user.twitter}`} className="sm:text-sm text-xs">
                        {user.twitter}
                      </Link>
                    ) : (
                      <span className="sm:text-sm text-xs text-white">None</span>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <FaDiscord size={18} className="text-white"/>
                    {user?.discord ? (
                      <span className="sm:text-sm text-xs">
                        {user.discord}
                      </span>
                    ) : (
                      <span className="sm:text-sm text-xs text-white">None</span>
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
 