import DefaultLayout from "@/layouts/default";
import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { Container } from "react-bootstrap";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@nextui-org/button";
import Image from 'next/image';
import { Spinner } from "@nextui-org/spinner";
import { IoIosCloseCircle, IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";

const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/";
const IMAGES_PER_PAGE = 40;

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Gallery Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <Button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded">
            Reload Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

function GalleryPage() {
  const supabase = useSupabaseClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [allArtists, setAllArtists] = useState([]);
  const modalRef = useRef();

  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  // Fetch gallery data
  const fetchAllImages = useCallback(async () => {
    try {
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, name');

      if (userError) throw userError;

      const allContent = await Promise.all(
        users.flatMap(async (user) => {
          const [imageData, fileData] = await Promise.all([
            supabase.storage.from('images').list(user.id + "/"),
            supabase.storage.from('files').list(user.id + "/")
          ]);

          return [
            ...(imageData.data || []).map(img => ({ ...img, userId: user.id, userName: user.name, bucket: 'images' })),
            ...(fileData.data || []).map(file => ({ ...file, userId: user.id, userName: user.name, bucket: 'files' }))
          ];
        })
      );

      const [imageDescData, fileDescData] = await Promise.all([
        supabase.from('image_descriptions').select('*'),
        supabase.from('file_descriptions').select('*')
      ]);

      const contentWithDesc = allContent.flat().map(item => ({
        ...item,
        description: item.bucket === 'images'
          ? imageDescData.data?.find(desc => desc.image_name === item.name && desc.user_id === item.userId)?.description
          : fileDescData.data?.find(desc => desc.file_name === item.name && desc.user_id === item.userId)?.description
      }));

      setContent(contentWithDesc);
      setAllArtists([...new Set(contentWithDesc.map(item => item.userName))]);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Effects
  useEffect(() => {
    const filtered = selectedArtist
      ? content.filter(item => item.userName === selectedArtist)
      : content;
    setFilteredContent(filtered);
    setCurrentPage(1);
  }, [content, selectedArtist]);

  useEffect(() => {
    fetchAllImages();
  }, [fetchAllImages]);

  // Modal handlers
  useEffect(() => {
    if (!modalOpen) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
        setSelectedItem(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
        setSelectedItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [modalOpen]);

  if (loading) {
    return <Spinner className="h-screen w-full" color="default" labelColor="foreground"/>;
  }

  const currentItems = filteredContent.slice(
    (currentPage - 1) * IMAGES_PER_PAGE,
    currentPage * IMAGES_PER_PAGE
  );

  return (
    <DefaultLayout>
      <Suspense fallback={<Spinner color="default" labelColor="foreground"/>}>
        <Container className="sm:my-16 sm:p-0 p-4 flex flex-col sm:gap-6 gap-3 justify-center items-center max-w-7xl mx-auto">
          <h1 className="font-serif text-[#9564b4] italic sm:text-5xl text-3xl">
            Gallery
          </h1>
          
          {/* Artist filter */}
          <div className="w-full ">
            <select 
              className="cursor-pointer bg-background text-foreground rounded-md sm:text-md text-sm p-2"
              value={selectedArtist || ''}
              onChange={(e) => setSelectedArtist(e.target.value || null)}
            >
              <option value="">All Artists</option>
              {allArtists.map(artist => (
                <option key={artist} value={artist}>{artist}</option>
              ))}
            </select>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
            {currentItems.map((item) => (
              <div
                key={`${item.bucket}-${item.userId}-${item.name}`}
                role="button"
                tabIndex={0}
                className="hover:bg-[#1c1c1c] hover:shadow-md cursor-pointer flex flex-col justify-between items-center p-4 border-1.5 border-[#242424] rounded-2xl transition-all duration-200"
                onClick={() => {
                  setSelectedItem(item);
                  setModalOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedItem(item);
                    setModalOpen(true);
                  }
                }}
              >
                {item.bucket === 'files' && item.name.toLowerCase().endsWith('.mp4') ? (
                  <video controls className="w-full aspect-square object-cover rounded-xl">
                    <source src={`${CDNURL}${item.bucket}/${item.userId}/${item.name}`} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={`${CDNURL}${item.bucket}/${item.userId}/${item.name}`}
                    alt={item.description}
                    width={250}
                    height={250}
                    className="w-full aspect-square object-cover rounded-xl"
                    unoptimized={item.name.toLowerCase().endsWith('.gif')}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AoNxbhL3xvpeNluNyeQ0pwCxJGwA5NCiQ5nZ23P1j+n//2Q=="
                  />
                )}
                
                <div className="mt-3 w-full">
                  <p className="font-quad text-foreground sm:text-md text-sm text-center truncate">
                    {item.description}
                  </p>
                  <p className="text-foreground sm:text-md text-sm truncate text-center">
                    Artist: {item.userName}
                  </p>
                </div>
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
              <IoIosArrowRoundBack className="text-2xl"/>
            </Button>
            
            {Array.from({ length: Math.ceil(filteredContent.length / IMAGES_PER_PAGE) }, (_, i) => (
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
                Math.min(Math.ceil(filteredContent.length / IMAGES_PER_PAGE), prev + 1)
              )}
              disabled={currentPage === Math.ceil(filteredContent.length / IMAGES_PER_PAGE)}
            >
              <IoIosArrowRoundForward className="text-2xl"/>
            </Button>
          </div>

          {/* Modal */}
          {modalOpen && selectedItem && (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-background border-1.5 border-[#242424] sm:p-6 p-4 rounded-xl max-w-[90vw] w-fit relative"
      >
        <div className="flex justify-end mb-2">
       
          
            <IoIosCloseCircle onClick={() => {
              setModalOpen(false);
              setSelectedItem(null);
              setIsZoomed(false);
            }} className="sm:text-2xl text-md text-[#9564b4] cursor-pointer" />
         
        </div>
        
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={handleZoomToggle}
        >
          {selectedItem.bucket === 'files' && selectedItem.name.toLowerCase().endsWith('.mp4') ? (
            <video 
              controls 
              className="w-full aspect-video object-contain rounded-xl"
              style={{ maxHeight: isZoomed ? '90vh' : '70vh' }}
            >
              <source src={`${CDNURL}${selectedItem.bucket}/${selectedItem.userId}/${selectedItem.name}`} type="video/mp4" />
            </video>
          ) : (
            <div className={`flex justify-center items-center transition-transform duration-300 ${
              isZoomed ? 'scale-150 transform-origin-center' : ''
            }`}>
              <Image
                src={`${CDNURL}${selectedItem.bucket}/${selectedItem.userId}/${selectedItem.name}`}
                alt={selectedItem.description}
                width={1200}
                height={800}
                className={`w-auto rounded-xl transition-all duration-300 ${
                  isZoomed ? 'max-h-[90vh]' : 'max-h-[70vh]'
                }`}
                style={{ objectFit: 'contain' }}
                unoptimized={selectedItem.name.toLowerCase().endsWith('.gif')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )}
        </Container></Suspense>
    </DefaultLayout>
  );
}

// Export wrapped component
export default function GalleryPageWrapper() {
  return (
    <ErrorBoundary>
      <GalleryPage />
    </ErrorBoundary>
  );
}