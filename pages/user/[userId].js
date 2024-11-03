import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import DefaultLayout from "@/layouts/default";
import { Container } from 'react-bootstrap';
import { FaTwitter, FaDiscord, FaGlobe } from 'react-icons/fa';
import {Spinner} from "@nextui-org/spinner";
import Image from 'next/image';
import { IoIosCloseCircle } from "react-icons/io";

const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/images/";
const CDNURLS = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/";
const AVATAR_CDN_URL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/avatars/";
const IMAGES_PER_PAGE = 12;
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
  const [ files, setFiles ] = useState([]);
  const [loading, setLoading] = useState(true);

  const indexOfLastImage = currentPage * IMAGES_PER_PAGE;
  const indexOfFirstImage = indexOfLastImage - IMAGES_PER_PAGE;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (userId) {
      fetchUserData().finally(() => setLoading(false));
      fetchUserImages().finally(() => setLoading(false));
    }
  }, [userId]);

  useEffect(() => {
    if(user) {
      getFiles().finally(() => setLoading(false));
    }
  }, [user]);

  async function getImages() {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: {column: "name", order: "asc"}
      });
  
    if(data !== null) {
      // Fetch descriptions for these images
      const { data: descData, error: descError } = await supabase
        .from('image_descriptions')
        .select('*')
        .eq('user_id', user.id);
  
      if (descError) {
        console.error("Error fetching descriptions:", descError);
      } else {
        // Combine image data with descriptions
        const imagesWithDesc = data.map(img => ({
          ...img,
          description: descData.find(desc => desc.image_name === img.name)?.description || ''
        }));
        setImages(imagesWithDesc);
      }
    } else {
      alert("Error loading images");
      console.log(error)
    }
  }

  async function getFiles() {
    const { data, error } = await supabase
      .storage
      .from('files')
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: {column: "name", order: "asc"}
      });
  
    if (error) {
      console.log("Error loading files:", error);
      return;
    }
  
    // Fetch descriptions for these files
    const { data: descData, error: descError } = await supabase
      .from('file_descriptions')
      .select('*')
      .eq('user_id', user.id);
  
    if (descError) {
      console.error("Error fetching descriptions:", descError);
    } else {
      // Combine file data with descriptions
      const filesWithDesc = data.map(file => ({
        ...file,
        description: descData.find(desc => desc.file_name === file.name)?.description || '',
        fileType: descData.find(desc => desc.file_name === file.name)?.file_type || ''
      }));
      setFiles(filesWithDesc);
    }
  }

  async function fetchUserData() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  
    if (data) {
      setUser(data);
    } else {
      console.error('Error fetching user data:', error);
    }
  }

  async function fetchUserImages() {
    const { data: imageData, error: imageError } = await supabase
      .storage
      .from('images')
      .list(userId + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      });
  
    if (imageError) {
      console.error('Error fetching user images:', imageError);
      return;
    }
  
    // Fetch image descriptions
    const { data: descriptionData, error: descriptionError } = await supabase
      .from('image_descriptions')
      .select('*')
      .eq('user_id', userId);
  
    if (descriptionError) {
      console.error('Error fetching image descriptions:', descriptionError);
      return;
    }
  
    // Combine image data with descriptions
    const imagesWithDescriptions = imageData.map(image => ({
      ...image,
      description: descriptionData.find(desc => desc.image_name === image.name)?.description || 'No description'
    }));
  
    setImages(imagesWithDescriptions);
  }

  if (!user) return <div>Loading...</div>;

  if (loading) {
    return <Spinner className="h-screen w-full" color="default" labelColor="foreground"/>;
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
      <Container className="flex flex-col">     
        <Image
          src={user.avatar_url && user.avatar_url.startsWith('http') 
            ? user.avatar_url 
            : user.avatar_url 
              ? `${AVATAR_CDN_URL}${user.avatar_url}`
              : '/img/avatar.png'  // Provide a default avatar image path
          }
          alt={`${user.name}'s avatar`}
          width={150}
          height={150}
          className="rounded-full mb-6"
        />
        <h1 className="font-pop text-foreground sm:text-4xl text-3xl font-bold mb-4">{user.name}&apos;s Work</h1>
        <p className="font-pop text-md text-grey">{user.email}</p>
        <p className="font-pop text-grey text-md mb-4">{user.description}</p>
        {/* Website */}
        {user.website && (
          <a href={user.website} className="font-pop text-grey text-md cursor-pointer flex flex-row gap-3 items-center">
            <FaGlobe size={18} className="text-grey"/> {user.website}
          </a>
        )}
        {/* Socials */}
        <div className="flex flex-row gap-3">
          {user.twitter && (
            <a href={`https://twitter.com/${user.twitter}`} className="text-grey font-pop text-md text-foreground cursor-pointer flex flex-row gap-3 items-center">
              <FaTwitter size={18} className="text-grey"/> {user.twitter}
            </a>
          )}
          {user.discord && (
            <span className="text-grey font-pop text-md text-foreground cursor-pointer flex flex-row gap-3 items-center">
              <FaDiscord size={18} className="text-grey"/> {user.discord}
            </span>
          )}
        </div>
        {/* Art */}
        <div className="mt-10 flex flex-row  w-full flex-wrap sm:gap-3 gap-3 mx-auto">
          {images.map((image) => (
            <div
            role="button"
            tabIndex="0"
            className="hover:bg-[#1c1c1c] hover:shadow-md cursor-pointer flex flex-col justify-between items-center sm:w-fit w-[48%] p-4 border-1.5 border-[#242424] rounded-2xl"
            key={`${item.bucket}-${item.userId}-${item.name}`}
            onClick={() => openModal(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                openModal(item);
              }
            }}
          >
              <div className="sm:p-2 p-1">
                <Image
                  src={CDNURL + user.id + "/" + image.name}
                  alt={image.description}
                  width={350}
                  height={350}
                  className="object-cover rounded-xl aspect-square"
                />
              </div>
              <p className="text-foreground font-pop font-medium truncate w-[300px] text-center sm:text-md text-md">{image.description}</p>
            </div>
          ))}
          {files.map((file) => {
            const fileUrl = `${CDNURLSS}${user.id}/${file.name}`;
              return (
                <div
                role="button"
                tabIndex="0"
                className="hover:bg-[#1c1c1c] hover:shadow-md cursor-pointer flex flex-col justify-between items-center sm:w-fit w-[48%] p-4 border-1.5 border-[#242424] rounded-2xl"
                key={fileUrl}
                onClick={() => openModal(file)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openModal(file);
                  }
                }}
              >
                  <div className="sm:p-2 p-1">
                    {file.fileType.startsWith('image/') ? (
                      <Image
                        src={fileUrl}
                        alt={file.description}
                        width={350}
                        height={350}
                        unoptimized
                        className="object-cover rounded-xl aspect-square"
                      />
                      ) : file.fileType.startsWith('video/') ? (
                        <video width="350" height="350" controls className="object-cover rounded-xl aspect-square">
                          <track kind="captions" src="captions.vtt" srcLang="en" label="English" />
                          <source src={fileUrl} type={file.fileType} />
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                  </div>
                    <p className="text-foreground font-pop font-medium truncate w-[300px] text-center sm:text-md text-md mt-2">{file.description}</p>
                </div>
              )
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(images.length / IMAGES_PER_PAGE) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-[#2c2c2c] rounded-full text-white' : 'bg-grey rounded-full text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && selectedItem && (
          <div className="fixed inset-0 bg-background bg-opacity-80 flex items-center justify-center z-50 p-6">
            <div className="bg-background border-1.5 border-[#242424] sm:p-5 p-2 rounded-xl max-w-5xl w-fit flex flex-col">
              <div className="">
                <div className="flex flex-col items-end">
                  <IoIosCloseCircle className="mb-2 text-2xl cursor-pointer hover:text-grey" onClick={closeModal}/>
                </div>
                {selectedItem?.fileType?.startsWith('image/') ? (
                  <Image
                    src={`${CDNURLSS}${user.id}/${selectedItem.name}`}
                    alt={selectedItem.description}
                    width={700}
                    height={700}
                    className="rounded-xl w-full h-auto max-h-[80vh] object-contain"
                  />
                ) : selectedItem?.fileType?.startsWith('video/') ? (
                  <video width="700" height="700" controls className="rounded-xl w-full h-auto max-h-[80vh] object-contain">
                    <track kind="captions" src="captions.vtt" srcLang="en" label="English" />
                    <source src={`${CDNURLSS}${user.id}/${selectedItem.name}`} type={selectedItem.fileType} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={`${CDNURL}${user.id}/${selectedItem.name}`}
                    alt={selectedItem.description}
                    width={700}
                    height={700}
                    className="rounded-xl w-full h-auto max-h-[80vh] object-contain"
                  />
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