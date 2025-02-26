import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import DefaultLayout from "@/layouts/default";
import { Container } from 'react-bootstrap';
import { FaTwitter, FaDiscord, FaGlobe } from 'react-icons/fa';
import { Spinner } from "@nextui-org/spinner";
import Image from 'next/image';
import { IoIosCloseCircle, IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { Button } from '@nextui-org/button';

const CDNURL = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/files/";
const CDNURLS = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/";
const AVATAR_CDN_URL = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/avatars/";
const FILES_PER_PAGE = 15;
const CDNURLSS = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/files/";

export default function UserProfile() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);

  // Pagination
  const indexOfLastItem = currentPage * FILES_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - FILES_PER_PAGE;
  const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

  // Wrap fetch functions in useCallback to prevent unnecessary recreations
  const fetchUserData = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) setUser(data);
    if (error) console.error('Error fetching user data:', error);
    return data;
  }, [userId, supabase]);

  // Combine data fetching into a single effect
  useEffect(() => {
    if (userId) {
      setLoading(true);
      Promise.all([fetchUserData()])
        .then(([userData]) => userData && getFiles(userData))
        .finally(() => setLoading(false));
    }
  }, [userId, fetchUserData]);

  async function getFiles(userData) {
    const { data, error } = await supabase
      .storage
      .from('files')
      .list(userData.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
        headers: { 'Cache-Control': 'public, max-age=3600' }
      });

    if (error) {
      console.log("Error loading files:", error);
      return;
    }

    const { data: descData, error: descError } = await supabase
      .from('file_descriptions')
      .select('*')
      .eq('user_id', userData.id);

    if (descError) {
      console.error("Error fetching descriptions:", descError);
    } else {
      const filesWithDesc = data.map(file => ({
        ...file,
        description: descData.find(desc => desc.file_name === file.name)?.description || '',
        fileType: descData.find(desc => desc.file_name === file.name)?.file_type || ''
      }));
      setFiles(filesWithDesc);
    }
  }

  // Render file preview based on file type
  function renderFilePreview(file) {
    const fileUrl = `${CDNURL}${user?.id}/${file.name}`;
    
    if (file.fileType?.startsWith('video/')) {
      return (
        <video 
          width="350" 
          height="350" 
          controls 
          className="object-cover rounded-xl aspect-square" 
          loading="lazy"
        >
          <source src={fileUrl} type={file.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (file.fileType?.startsWith('image/')) {
      return (
        <Image
          src={fileUrl}
          alt={file.description}
          width={350}
          height={350}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
          className="object-cover rounded-xl aspect-square"
        />
      );
    } else {
      // Default file icon for other file types
      return (
        <div className="flex items-center justify-center w-[350px] h-[350px] bg-[#1c1c1c] rounded-xl">
          <p className="text-white text-lg">File: {file.name}</p>
        </div>
      );
    }
  }

  if (!user) return <div>Loading...</div>;

  if (loading) {
    return <Spinner className="h-screen w-full" color="default" labelColor="foreground" />;
  }

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <DefaultLayout>
      <Container className="flex flex-col items-center max-w-7xl mx-auto">
        <Image
          src={user.avatar_url && user.avatar_url.startsWith('http')
            ? user.avatar_url
            : user.avatar_url
              ? `${AVATAR_CDN_URL}${user.avatar_url}`
              : '/img/avatar.png'
          }
          alt={`${user.name}'s avatar`}
          width={150}
          height={150}
          className="rounded-full mb-6 object-cover"
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
        <h1 className="font-serif text-[#9564b4] italic sm:text-4xl text-3xl">{user.name}&apos;s Work</h1>
        <p className="font-pop text-md text-grey">{user.email}</p>
        <p className="font-pop text-grey text-md mb-4">{user.description}</p>

        {user.website && (
          <a href={user.website} className="font-pop text-grey text-md cursor-pointer flex flex-row gap-3 items-center">
            <FaGlobe size={18} className="text-grey" /> {user.website}
          </a>
        )}

        <div className="flex flex-row gap-3">
          {user.twitter && (
            <a href={`https://twitter.com/${user.twitter}`} className="text-grey font-pop text-md text-foreground cursor-pointer flex flex-row gap-3 items-center">
              <FaTwitter size={18} className="text-grey" /> {user.twitter}
            </a>
          )}
          {user.discord && (
            <span className="text-grey font-pop text-md text-foreground cursor-pointer flex flex-row gap-3 items-center">
              <FaDiscord size={18} className="text-grey" /> {user.discord}
            </span>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="mt-4 flex flex-row justify-center w-full flex-wrap sm:gap-3 gap-3 mx-auto">
          {currentItems.map((file) => (
            <div
              role="button"
              tabIndex="0"
              className="hover:bg-[#1c1c1c] hover:shadow-md cursor-pointer flex flex-col justify-between items-center sm:w-fit w-[48%] p-4 border-1.5 border-[#242424] rounded-2xl"
              key={`file-${user.id}-${file.name}`}
              onClick={() => openModal(file)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  openModal(file);
                }
              }}
            >
              <div className="sm:p-2 p-1">
                {renderFilePreview(file)}
              </div>
              <p className="text-foreground font-pop font-medium truncate w-[300px] text-center sm:text-md text-md mt-2">
                {file.description}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <IoIosArrowRoundBack className="text-2xl" />
          </Button>

          {Array.from({ length: Math.ceil(files.length / FILES_PER_PAGE) }, (_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-full ${
                currentPage === i + 1
                  ? 'bg-[#9564b4] text-white'
                  : 'bg-black text-white hover:bg-[#333333]'
              }`}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
            onClick={() => setCurrentPage(prev =>
              Math.min(Math.ceil(files.length / FILES_PER_PAGE), prev + 1)
            )}
            disabled={currentPage === Math.ceil(files.length / FILES_PER_PAGE)}
          >
            <IoIosArrowRoundForward className="text-2xl" />
          </Button>
        </div>

        {/* Modal */}
        {modalOpen && selectedItem && (
          <div className="fixed inset-0 bg-background bg-opacity-80 flex items-center justify-center z-50 p-6">
            <div className="bg-background border-1.5 border-[#242424] sm:p-5 p-2 rounded-xl max-w-5xl w-fit flex flex-col">
              <div className="">
                <div className="flex flex-col items-end">
                  <IoIosCloseCircle className="mb-2 text-2xl cursor-pointer hover:text-grey" onClick={closeModal} />
                </div>
                {selectedItem.fileType?.startsWith('video/') ? (
                  <video 
                    controls 
                    className="rounded-xl w-full h-auto max-h-[80vh] object-contain"
                    autoPlay
                  >
                    <source src={`${CDNURL}${user?.id}/${selectedItem.name}`} type={selectedItem.fileType} />
                    Your browser does not support the video tag.
                  </video>
                ) : selectedItem.fileType?.startsWith('image/') ? (
                  <Image
                    src={`${CDNURL}${user?.id}/${selectedItem.name}`}
                    alt={selectedItem.description}
                    width={700}
                    height={700}
                    priority={true}
                    className="rounded-xl w-full h-auto max-h-[80vh] object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-[400px] bg-[#1c1c1c] rounded-xl">
                    <p className="text-white text-lg">File: {selectedItem.name}</p>
                  </div>
                )}
              </div>
              <p className="text-foreground font-medium text-center sm:text-md text-sm font-pop mb-1 mt-4">{selectedItem.description}</p>
            </div>
          </div>
        )}
      </Container>
    </DefaultLayout>
  );
}