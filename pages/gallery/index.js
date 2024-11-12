import DefaultLayout from "@/layouts/default";
import React, { useState, useEffect, useCallback, Suspense, useRef, useMemo, startTransition } from "react";
import { Container } from "react-bootstrap";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@nextui-org/button";
import Image from 'next/image';
import { Spinner } from "@nextui-org/spinner";
import { IoIosCloseCircle, IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";

const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/";
const IMAGES_PER_PAGE = 40;

// Extracted Modal Component for better code splitting
const ImageModal = React.memo(({ item, onClose, isOpen }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const modalRef = useRef();

  const handleZoomToggle = () => {
    if (!isDragging) {
      setIsZoomed(!isZoomed);
      setDragPosition({ x: 0, y: 0 });
    }
  };

  const handleDragStart = useCallback((e) => {
    if (!isZoomed) return;
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    dragStartPosition.current = {
      x: clientX - dragPosition.x,
      y: clientY - dragPosition.y
    };
  }, [isZoomed, dragPosition]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging || !isZoomed) return;
    e.preventDefault();
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    setDragPosition({
      x: clientX - dragStartPosition.current.x,
      y: clientY - dragStartPosition.current.y
    });
  }, [isDragging, isZoomed]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!item || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-background border-1.5 border-[#242424] sm:p-6 p-4 rounded-xl max-w-[90vw] w-fit relative">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            {!item.name.toLowerCase().endsWith('.mp4') && (
              <button
                onClick={handleZoomToggle}
                className="text-[#9564b4] hover:text-[#7d4d9c] transition-colors"
              >
                {isZoomed ? <BiZoomOut size={24} /> : <BiZoomIn size={24} />}
              </button>
            )}
          </div>
          <IoIosCloseCircle 
            onClick={onClose}
            className="sm:text-2xl text-md text-[#9564b4] cursor-pointer hover:text-[#7d4d9c] transition-colors" 
          />
        </div>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}`}>
          {item.name.toLowerCase().endsWith('.mp4') ? (
            <video 
              controls 
              className="w-full aspect-video object-contain rounded-xl"
              style={{ maxHeight: isZoomed ? '90vh' : '70vh' }}
            >
              <source src={`${CDNURL}${item.bucket}/${item.userId}/${item.name}`} type="video/mp4" />
            </video>
          ) : (
            <div 
              className="flex justify-center items-center transition-transform duration-300"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              style={{
                transform: isZoomed ? `scale(1.5) translate(${dragPosition.x}px, ${dragPosition.y}px)` : 'none',
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none'
              }}
            >
              <Image
                src={`${CDNURL}${item.bucket}/${item.userId}/${item.name}`}
                alt={item.description}
                width={1200}
                height={800}
                className={`w-auto rounded-xl transition-all duration-300 ${isZoomed ? 'max-h-[80vh]' : 'max-h-[70vh]'}`}
                style={{ 
                  objectFit: 'contain',
                  pointerEvents: isZoomed ? 'none' : 'auto'
                }}
                unoptimized={item.name.toLowerCase().endsWith('.gif')}
                draggable={false}
                loading="eager"
                priority
              />
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-foreground font-medium sm:text-md text-sm font-pop mb-1">{item.description}</p>
          <p className="text-[#9564b4] font-serif font-bold italic">{item.userName}</p>
        </div>
      </div>
    </div>
  );
});

// Extracted Gallery Item Component
const GalleryItem = React.memo(({ item, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    className="hover:bg-[#1c1c1c] hover:shadow-md cursor-pointer flex flex-col justify-between items-center p-4 border-1.5 border-[#242424] rounded-2xl transition-all duration-200"
    onClick={() => onClick(item)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onClick(item);
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
        width={150}
        height={150}
        className="w-full aspect-square object-cover rounded-xl"
        unoptimized={item.name.toLowerCase().endsWith('.gif')}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AoNxbhL3xvpeNluNyeQ0pwCxJGwA5NCiQ5nZ23P1j+n//2Q=="
        loading="lazy"
      />
    )}
    
    <div className="mt-3 w-full">
      <p className="font-quad text-foreground sm:text-md text-sm text-center truncate">
        {item.description}
      </p>
      <p className="text-foreground sm:text-md text-sm truncate text-center">
        <i className="text-[#9564b4] font-serif font-bold">{item.userName}</i>
      </p>
    </div>
  </div>
));

// Main Gallery Component
function GalleryPage() {
  const supabase = useSupabaseClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Memoized derived states
  const allArtists = useMemo(() => 
    [...new Set(content.map(item => item.userName))],
    [content]
  );

  const filteredContent = useMemo(() => 
    selectedArtist ? content.filter(item => item.userName === selectedArtist) : content,
    [content, selectedArtist]
  );

  const currentItems = useMemo(() => 
    filteredContent.slice(
      (currentPage - 1) * IMAGES_PER_PAGE,
      currentPage * IMAGES_PER_PAGE
    ),
    [filteredContent, currentPage]
  );

  const pageCount = useMemo(() => 
    Math.ceil(filteredContent.length / IMAGES_PER_PAGE),
    [filteredContent.length]
  );

  // Fetch gallery data
  const fetchAllImages = useCallback(async () => {
    try {
      const [{ data: users }, { data: imageDescData }, { data: fileDescData }] = await Promise.all([
        supabase.from('profiles').select('id, name'),
        supabase.from('image_descriptions').select('*'),
        supabase.from('file_descriptions').select('*')
      ]);

      const allContent = await Promise.all(
        users.map(async (user) => {
          const [imageData, fileData] = await Promise.all([
            supabase.storage.from('images').list(user.id + "/"),
            supabase.storage.from('files').list(user.id + "/")
          ]);

          return [
            ...(imageData.data || []).map(img => ({
              ...img,
              userId: user.id,
              userName: user.name,
              bucket: 'images',
              description: imageDescData?.find(desc => 
                desc.image_name === img.name && desc.user_id === user.id
              )?.description
            })),
            ...(fileData.data || []).map(file => ({
              ...file,
              userId: user.id,
              userName: user.name,
              bucket: 'files',
              description: fileDescData?.find(desc => 
                desc.file_name === file.name && desc.user_id === user.id
              )?.description
            }))
          ];
        })
      );
      startTransition(() => {
        setContent(allContent.flat());
      });
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAllImages();
  }, [fetchAllImages]);

  const handleItemClick = useCallback((item) => {
    setSelectedItem(item);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedItem(null);
  }, []);

  if (loading) {
    return <Spinner className="h-screen w-full" color="default" labelColor="foreground"/>;
  }

  return (
    <DefaultLayout>
     <Container className="sm:my-16 sm:p-0 p-4 flex flex-col sm:gap-6 gap-3 justify-center items-center max-w-7xl mx-auto">
        <h1 className="font-serif text-[#9564b4] italic sm:text-5xl text-3xl">
          Gallery
        </h1>
        
        {/* Artist filter - Optimized with memoized options */}
        <div className="w-full">
        <select 
  className="cursor-pointer bg-background text-foreground rounded-md sm:text-md text-sm p-2"
  value={selectedArtist || ''}
  onChange={(e) => {
    startTransition(() => {
      setSelectedArtist(e.target.value || null);
    });
  }}
>
            <option value="">All Artists</option>
            {allArtists.map(artist => (
              <option key={artist} value={artist}>{artist}</option>
            ))}
          </select>
        </div>

        {/* Gallery grid - Using virtualization for large lists */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
          {currentItems.map((item) => (
            <GalleryItem
              key={`${item.bucket}-${item.userId}-${item.name}`}
              item={item}
              onClick={handleItemClick}
            />
          ))}
        </div>

        {/* Pagination - Memoized calculations */}
        {pageCount > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <Button
              className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <IoIosArrowRoundBack className="text-2xl"/>
            </Button>
            
            {Array.from({ length: pageCount }, (_, i) => (
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
              onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
              disabled={currentPage === pageCount}
            >
              <IoIosArrowRoundForward className="text-2xl"/>
            </Button>
          </div>
        )}

        {/* Modal - Extracted to separate component */}
        <ImageModal
          item={selectedItem}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />
      </Container>
    </DefaultLayout>
  );
}

// Error Boundary Component - Optimized with static methods
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
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Reload Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Export wrapped component
export default function GalleryPageWrapper() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner color="default" labelColor="foreground"/>}>
        <GalleryPage />
      </Suspense>
    </ErrorBoundary>
  );
}