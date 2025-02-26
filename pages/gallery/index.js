import DefaultLayout from "@/layouts/default";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback, Suspense, useRef, useMemo, startTransition } from "react";
import { Container } from "react-bootstrap";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@nextui-org/button";
import Image from 'next/image';
import { Spinner } from "@nextui-org/spinner";
import { IoIosCloseCircle, IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";
import PropTypes from 'prop-types';

const CDNURL = "https://bdmtbvaqmjiwxbuxflup.supabase.co/storage/v1/object/public/files/";
const IMAGES_PER_PAGE = 20;

// Add file transformation parameters
const getFileUrl = (userId, name, isThumb = false) => {
  const baseUrl = `${CDNURL}${userId}/${name}`;
  if (name.toLowerCase().endsWith('.gif') || name.toLowerCase().endsWith('.mp4')) {
    return baseUrl; // Don't transform GIFs or videos
  }
  // Reduce quality for thumbnails more aggressively, and add size limits for full images
  return isThumb 
    ? `${baseUrl}?width=250&height=250&resize=contain&quality=20` 
    : `${baseUrl}?width=1000&height=1000&resize=contain&quality=80`;
};

// Extracted Modal Component for better code splitting
const ImageModal = React.memo(({ item, onClose, isOpen }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.5); // Add configurable zoom level
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const modalRef = useRef();
  const imageContainerRef = useRef();

  const handleZoomToggle = () => {
    if (!isDragging) {
      // Reset position when toggling zoom
      setDragPosition({ x: 0, y: 0 });
      setIsZoomed(!isZoomed);
    }
  };

  const handleZoomIn = () => {
    if (isZoomed) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Limit max zoom to 3x
    } else {
      setIsZoomed(true);
    }
  };

  const handleZoomOut = () => {
    if (isZoomed && zoomLevel > 1.25) {
      setZoomLevel(prev => prev - 0.25);
    } else {
      setIsZoomed(false);
      setZoomLevel(1.5); // Reset to default zoom level
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
    
    // Prevent default behavior to avoid text selection during drag
    e.preventDefault();
    
    // Change cursor immediately
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = 'grabbing';
    }
  }, [isZoomed, dragPosition]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging || !isZoomed) return;
    e.preventDefault();
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    // Calculate boundaries based on zoom level to prevent dragging too far
    const containerRect = imageContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const maxX = (containerRect.width * (zoomLevel - 1)) / 2;
    const maxY = (containerRect.height * (zoomLevel - 1)) / 2;
    
    const newX = clientX - dragStartPosition.current.x;
    const newY = clientY - dragStartPosition.current.y;
    
    // Apply boundaries
    const boundedX = Math.max(-maxX, Math.min(maxX, newX));
    const boundedY = Math.max(-maxY, Math.min(maxY, newY));
    
    setDragPosition({
      x: boundedX,
      y: boundedY
    });
  }, [isDragging, isZoomed, zoomLevel]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    // Reset cursor
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = 'grab';
    }
  }, []);

  // Reset zoom and position when changing images
  useEffect(() => {
    setIsZoomed(false);
    setDragPosition({ x: 0, y: 0 });
    setZoomLevel(1.5);
  }, [item]);

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

    // Add wheel event for zooming with mouse wheel
    const handleWheel = (event) => {
      if (modalRef.current && modalRef.current.contains(event.target)) {
        event.preventDefault();
        if (event.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, onClose, handleDragEnd, handleZoomIn, handleZoomOut]);

  if (!item || !isOpen) return null;

  const isVideo = item.fileType?.startsWith('video/') || item.name.toLowerCase().endsWith('.mp4');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-background border-1.5 border-darkviolet sm:p-6 p-4 rounded-xl max-w-[90vw] w-fit relative">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            {!isVideo && (
              <>
                <button
                  onClick={handleZoomIn}
                  className="text-[#9564b4] hover:text-[#7d4d9c] transition-colors"
                  aria-label="Zoom in"
                >
                  <BiZoomIn size={24} />
                </button>
                {isZoomed && (
                  <button
                    onClick={handleZoomOut}
                    className="text-[#9564b4] hover:text-[#7d4d9c] transition-colors"
                    aria-label="Zoom out"
                  >
                    <BiZoomOut size={24} />
                  </button>
                )}
              </>
            )}
          </div>
          <IoIosCloseCircle 
            onClick={onClose}
            className="sm:text-2xl text-md text-[#9564b4] cursor-pointer hover:text-[#7d4d9c] transition-colors" 
          />
        </div>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}`}>
          {isVideo ? (
            <video 
              controls 
              className="w-full aspect-video object-contain rounded-xl"
              style={{ maxHeight: isZoomed ? '90vh' : '70vh' }}
              preload="metadata"
            >
              <source src={getFileUrl(item.userId, item.name)} type={item.fileType || "video/mp4"} />
            </video>
          ) : (
            <div 
              ref={imageContainerRef}
              className="flex justify-center items-center transition-transform duration-300"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              style={{
                transform: isZoomed ? `scale(${zoomLevel}) translate(${dragPosition.x}px, ${dragPosition.y}px)` : 'none',
                cursor: isDragging ? 'grabbing' : isZoomed ? 'grab' : 'zoom-in',
                touchAction: 'none',
                willChange: 'transform', // Optimize for animations
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              <Image
                src={getFileUrl(item.userId, item.name, false)}
                alt={item.description || "Gallery image"}
                width={1000}
                height={800}
                className={`w-auto rounded-xl transition-all duration-300 ${isZoomed ? 'max-h-[80vh]' : 'max-h-[70vh]'}`}
                style={{ 
                  objectFit: 'contain',
                  pointerEvents: isZoomed ? 'none' : 'auto'
                }}
                quality={80}
                unoptimized={item.name.toLowerCase().endsWith('.gif')}
                draggable={false}
                loading="eager"
                priority
              />
            </div>
          )}
        </div>
        <div className="mt-4 text-center flex items-center flex-col">
          <p className="text-foreground font-medium sm:text-lg text-md font-pop mb-1 w-[80%] uppercase">{item.description}</p>
          <p className="text-[#9564b4] font-atirose text-2xl">{item.userName}</p>
        </div>
      </div>
    </div>
  );
});

// Extracted Gallery Item Component
const GalleryItem = React.memo(({ item, onClick, priority }) => {
  const isVideo = item.fileType?.startsWith('video/') || item.name.toLowerCase().endsWith('.mp4');
  
  return (
    <div
      role="button"
      tabIndex={0}
      className="hover:scale-105 hover:border-violet cursor-pointer flex flex-col justify-between items-center border-1.5 border-darkviolet rounded-2xl transition-all duration-200"
      onClick={() => onClick(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(item);
        }
      }}
    >
      {isVideo ? (
        <video 
          className="w-full aspect-square object-cover rounded-xl p-4"
          preload="none"
          poster={`${CDNURL}${item.userId}/${item.name}?width=150&height=150&format=webp&quality=30`}
        >
          <source src={getFileUrl(item.userId, item.name)} type={item.fileType || "video/mp4"} />
        </video>
      ) : (
        <Image
          src={getFileUrl(item.userId, item.name, true)}
          alt={item.description || "Gallery image"}
          width={150}
          height={150}
          className="w-full aspect-square object-cover rounded-xl p-4"
          quality={40}
          unoptimized={item.name.toLowerCase().endsWith('.gif')}
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23999999'/%3E%3Cpath d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='%23777777' stroke-width='0.5'/%3E%3C/svg%3E"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
      )}
      
      <div className="mt-3 w-full border-t-1 border-darkviolet p-4">
        <p className="text-foreground sm:text-md text-sm text-center truncate uppercase">
          {item.description}
        </p>
        <div className="text-foreground sm:text-md text-sm truncate text-center">
          <span className="text-violet font-atirose text-lg">{item.userName}</span>
        </div>
      </div>
    </div>
  );
});

// Main Gallery Component
function GalleryPage() {
  const supabase = useSupabaseClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [content, setContent] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const isLoading = content.length === 0;

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

  // Add virtualization for large galleries
  const IMAGES_TO_PRELOAD = 8; // Only preload first 8 images
  
  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, name');
        
        if (usersError) {
          throw new Error("Failed to fetch users: " + usersError.message);
        }

        const { data: fileDescData, error: fileDescError } = await supabase
          .from('file_descriptions')
          .select('*');
          
        if (fileDescError) {
          throw new Error("Failed to fetch file descriptions: " + fileDescError.message);
        }

        const allContent = await Promise.all(
          users.map(async (user) => {
            const { data: fileData, error: fileError } = await supabase
              .storage.from('files')
              .list(user.id + "/");
              
            if (fileError) {
              console.error(`Error fetching files for user ${user.id}:`, fileError);
              return [];
            }
            
            return (fileData || []).map(file => ({
              ...file,
              userId: user.id,
              userName: user.name,
              description: fileDescData?.find(desc => 
                desc.file_name === file.name && desc.user_id === user.id
              )?.description,
              fileType: fileDescData?.find(desc => 
                desc.file_name === file.name && desc.user_id === user.id
              )?.file_type
            }));
          })
        );

        // Sort content by most recent first and filter out items without descriptions
        const flatContent = allContent.flat()
          .filter(item => item.description) // Only show items with descriptions
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
          
        startTransition(() => {
          setContent(flatContent);
        });
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      }
    };

    fetchAllContent();
  }, [supabase]);

  const handleItemClick = useCallback((item) => {
    startTransition(() => {
      setSelectedItem(item);
      setModalOpen(true);
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    startTransition(() => {
      setModalOpen(false);
      setSelectedItem(null);
    });
  }, []);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Container className="flex flex-col sm:gap-6 gap-3 justify-center items-center max-w-8xl mx-auto">
          <div className="h-screen w-full flex items-center justify-center">
            <Spinner color="default" labelColor="foreground"/>
          </div>
        </Container>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Container className="flex flex-col sm:gap-6 gap-3 justify-center items-center max-w-8xl mx-auto">
        <h1 className="font-atirose text-[#9564b4] sm:text-7xl text-6xl">
          Gallery
        </h1>

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

        <div className="max-w-7xl">
          <div className="mb-6 px-4">
            <select 
              className="cursor-pointer bg-background text-foreground rounded-md sm:text-md text-sm p-2"
              value={selectedArtist || ''}
              onChange={(e) => {
                startTransition(() => {
                  setSelectedArtist(e.target.value || null);
                  setCurrentPage(1);
                });
              }}
            >
              <option value="">All Artists</option>
              {allArtists.map(artist => (
                <option key={artist} value={artist}>{artist}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full px-4">
            {currentItems.map((item, index) => (
              <GalleryItem
                key={`${item.userId}-${item.name}`}
                item={item}
                onClick={handleItemClick}
                priority={index < IMAGES_TO_PRELOAD} // Only prioritize first few images
              />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button
                className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
                onClick={() => startTransition(() => setCurrentPage(prev => Math.max(1, prev - 1)))}
                disabled={currentPage === 1}
              >
                <IoIosArrowRoundBack className="text-2xl"/>
              </Button>
              
              {Array.from({ length: pageCount }, (_, i) => (
                <Button
                  key={i}
                  onClick={() => startTransition(() => setCurrentPage(i + 1))}
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
                onClick={() => startTransition(() => setCurrentPage(prev => Math.min(pageCount, prev + 1)))}
                disabled={currentPage === pageCount}
              >
                <IoIosArrowRoundForward className="text-2xl"/>
              </Button>
            </div>
          )}

          <ImageModal
            item={selectedItem}
            isOpen={modalOpen}
            onClose={handleCloseModal}
          />
        </div>
      </Container>
    </DefaultLayout>
  );
}

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

// Export wrapped component with dynamic import
export default dynamic(() => Promise.resolve(function GalleryPageWrapper() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center">
            <Spinner color="default" labelColor="foreground"/>
          </div>
        }>
          <GalleryPage />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner color="default" labelColor="foreground"/>
    </div>
  )
});

GalleryItem.propTypes = {
  item: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    fileType: PropTypes.string,
    userName: PropTypes.string
  }),
  onClick: PropTypes.func.isRequired,
  priority: PropTypes.bool.isRequired
};

ImageModal.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};