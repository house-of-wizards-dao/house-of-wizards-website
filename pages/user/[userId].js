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

const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/images/";
const CDNURLS = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/";
const AVATAR_CDN_URL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/avatars/";
const IMAGES_PER_PAGE = 15;
const CDNURLSS = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/files/";

export default function UserProfile() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const supabase = useSupabaseClient();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Combined items array for pagination
  const allItems = [...images, ...files];
  const indexOfLastItem = currentPage * IMAGES_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - IMAGES_PER_PAGE;
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);

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

  const fetchUserImages = useCallback(async () => {
    // Add cache-control header to images request
    const { data: imageData, error: imageError } = await supabase
      .storage
      .from('images')
      .list(userId + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
        headers: { 'Cache-Control': 'public, max-age=3600' }
      });

    if (imageError) {
      console.error('Error fetching user images:', imageError);
      return;
    }

    const { data: descriptionData, error: descriptionError } = await supabase
      .from('image_descriptions')
      .select('*')
      .eq('user_id', userId);

    if (descriptionError) {
      console.error('Error fetching image descriptions:', descriptionError);
      return;
    }

    const imagesWithDescriptions = imageData.map(image => ({
      ...image,
      description: descriptionData.find(desc => desc.image_name === image.name)?.description || 'No description'
    }));

    setImages(imagesWithDescriptions);
  }, [userId, supabase]);

  // Combine data fetching into a single effect
  useEffect(() => {
    if (userId) {
      setLoading(true);
      Promise.all([fetchUserData(), fetchUserImages()])
        .then(([userData]) => userData && getFiles(userData))
        .finally(() => setLoading(false));
    }
  }, [userId, fetchUserData, fetchUserImages]);

  async function getFiles(userData) {
    const { data, error } = await supabase
      .storage
      .from('files')
      .list(userData.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
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

  // Optimize image rendering
  function renderItemPreview(item, isFile) {
    const fileUrl = isFile 
      ? `${CDNURLSS}${user?.id}/${item.name}`
      : `${CDNURL}${user?.id}/${item.name}`;
    
    return (
      <Image
        src={fileUrl}
        alt={item.description}
        width={350}
        height={350}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
        className="object-cover rounded-xl aspect-square"
      />
    );
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
          className="rounded-full mb-6"
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
          {currentItems.map((item) => {
            const isFile = 'fileType' in item;
            return (
              <div
                role="button"
                tabIndex="0"
                className="hover:bg-[#1c1c1c] hover:shadow-md cursor-pointer flex flex-col justify-between items-center sm:w-fit w-[48%] p-4 border-1.5 border-[#242424] rounded-2xl"
                key={`${item.bucket || 'file'}-${user.id}-${item.name}`}
                onClick={() => openModal(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openModal(item);
                  }
                }}
              >
                <div className="sm:p-2 p-1">
                  {isFile && item.fileType?.startsWith('image/') ? (
                    renderItemPreview(item, true)
                  ) : isFile && item.fileType?.startsWith('video/') ? (
                    <video width="350" height="350" controls className="object-cover rounded-xl aspect-square" loading="lazy">
                      <track kind="captions" src="captions.vtt" srcLang="en" label="English" />
                      <source src={renderItemPreview(item, false)} type={item.fileType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    renderItemPreview(item, false)
                  )}
                </div>
                <p className="text-foreground font-pop font-medium truncate w-[300px] text-center sm:text-md text-md mt-2">
                  {item.description}
                </p>
              </div>
            );
          })}
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

          {Array.from({ length: Math.ceil(allItems.length / IMAGES_PER_PAGE) }, (_, i) => (
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
              Math.min(Math.ceil(allItems.length / IMAGES_PER_PAGE), prev + 1)
            )}
            disabled={currentPage === Math.ceil(allItems.length / IMAGES_PER_PAGE)}
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
                <Image
                  src={selectedItemUrl}
                  alt={selectedItem.description}
                  width={700}
                  height={700}
                  priority={true}
                  className="rounded-xl w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
              <p className="text-foreground font-medium text-center sm:text-md text-sm font-pop mb-1 mt-4">{selectedItem.description}</p>
            </div>
          </div>
        )}
      </Container>
    </DefaultLayout>
  );
}