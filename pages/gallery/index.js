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
import { debounce } from 'lodash';

const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/";
const IMAGES_PER_PAGE = 20;

// Improved image URL function with better caching
const getImageUrl = (bucket, userId, name, isThumb = false) => {
  const baseUrl = `${CDNURL}${bucket}/${userId}/${name}`;
  if (name.toLowerCase().endsWith('.gif') || name.toLowerCase().endsWith('.mp4')) {
    return baseUrl;
  }
  // Add width/height constraints and format conversion
  return isThumb ? `${baseUrl}?width=300&height=300&format=webp&quality=60` : 
                  `${baseUrl}?width=1200&height=800&format=webp&quality=90`;
};

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
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isOpen, onClose, handleDragEnd]);

  if (!item || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-background border-1.5 border-darkviolet sm:p-6 p-4 rounded-xl max-w-[90vw] w-fit relative">
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
              <source src={getImageUrl(item.bucket, item.userId, item.name)} type="video/mp4" />
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
                src={getImageUrl(item.bucket, item.userId, item.name, false)}
                alt={item.description}
                width={1200}
                height={800}
                className={`w-auto rounded-xl transition-all duration-300 ${isZoomed ? 'max-h-[80vh]' : 'max-h-[70vh]'}`}
                style={{ 
                  objectFit: 'contain',
                  pointerEvents: isZoomed ? 'none' : 'auto'
                }}
                quality={100}
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
const GalleryItem = React.memo(({ item, onClick, priority }) => (
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
    {item.bucket === 'files' && item.name.toLowerCase().endsWith('.mp4') ? (
      <div className="w-full aspect-square rounded-xl p-4 flex items-center justify-center bg-gray-900">
        {/* Only load video player when needed */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    ) : (
      <Image
        src={getImageUrl(item.bucket, item.userId, item.name, true)}
        alt={item.description || "Gallery image"}
        width={300}
        height={300}
        className="w-full aspect-square object-cover rounded-xl p-4"
        quality={60}
        unoptimized={item.name.toLowerCase().endsWith('.gif')}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23999999'/%3E%3Cpath d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='%23777777' stroke-width='0.5'/%3E%3C/svg%3E"
        loading={priority ? "eager" : "lazy"}
        priority={priority}
      />
    )}
    
    <div className="mt-3 w-full border-t-1 border-darkviolet p-4">
      <p className="text-foreground sm:text-md text-sm text-center truncate uppercase">
        {item.description ? item.description : "Untitled"}
      </p>
      <p className="text-violet font-atirose text-lg text-center truncate">
        {item.userName}
      </p>
    </div>
  </div>
));

// Main Gallery Component with improved data loading
function GalleryPage() {
  const supabase = useSupabaseClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [content, setContent] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [artists, setArtists] = useState([]);

  // Server-side pagination with existing tables
  useEffect(() => {
    const fetchPaginatedData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch artists once
        if (artists.length === 0) {
          const { data: artistsData } = await supabase
            .from('profiles')
            .select('id, name');
          
          setArtists(artistsData || []);
        }
        
        // Calculate pagination range
        const from = (currentPage - 1) * IMAGES_PER_PAGE;
        const to = from + IMAGES_PER_PAGE - 1;
        
        // Fetch both image and file descriptions for lookup
        const [{ data: imageDescData }, { data: fileDescData }] = await Promise.all([
          supabase.from('image_descriptions').select('*'),
          supabase.from('file_descriptions').select('*')
        ]);
        
        // Create lookup maps for faster access
        const imageDescMap = {};
        const fileDescMap = {};
        
        if (imageDescData) {
          imageDescData.forEach(desc => {
            const key = `${desc.user_id}-${desc.image_name}`;
            imageDescMap[key] = desc.description;
          });
        }
        
        if (fileDescData) {
          fileDescData.forEach(desc => {
            const key = `${desc.user_id}-${desc.file_name}`;
            fileDescMap[key] = desc.description;
          });
        }
        
        // Fetch only users we need based on filter
        let usersQuery = supabase.from('profiles').select('id, name');
        if (selectedArtist) {
          usersQuery = usersQuery.eq('name', selectedArtist);
        }
        const { data: users } = await usersQuery;
        
        if (!users || users.length === 0) {
          setContent([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }
        
        // Get total count first (for pagination)
        let totalItems = 0;
        for (const user of users) {
          const [imageList, fileList] = await Promise.all([
            supabase.storage.from('images').list(user.id + "/"),
            supabase.storage.from('files').list(user.id + "/")
          ]);
          
          totalItems += (imageList.data?.length || 0) + (fileList.data?.length || 0);
        }
        
        setTotalCount(totalItems);
        
        // Now fetch only the items for the current page
        let allItems = [];
        let itemCount = 0;
        let skipCount = from;
        
        // Process each user's content
        for (const user of users) {
          if (itemCount >= IMAGES_PER_PAGE) break;
          
          const [imageList, fileList] = await Promise.all([
            supabase.storage.from('images').list(user.id + "/"),
            supabase.storage.from('files').list(user.id + "/")
          ]);
          
          // Process images
          if (imageList.data) {
            for (const img of imageList.data) {
              if (skipCount > 0) {
                skipCount--;
                continue;
              }
              
              if (itemCount >= IMAGES_PER_PAGE) break;
              
              const key = `${user.id}-${img.name}`;
              const description = imageDescMap[key];
              
              allItems.push({
                ...img,
                userId: user.id,
                userName: user.name,
                bucket: 'images',
                description: description || '',
                created_at: img.created_at || new Date().toISOString()
              });
              
              itemCount++;
            }
          }
          
          // Process files
          if (fileList.data && itemCount < IMAGES_PER_PAGE) {
            for (const file of fileList.data) {
              if (skipCount > 0) {
                skipCount--;
                continue;
              }
              
              if (itemCount >= IMAGES_PER_PAGE) break;
              
              const key = `${user.id}-${file.name}`;
              const description = fileDescMap[key]; // Use file description map
              
              allItems.push({
                ...file,
                userId: user.id,
                userName: user.name,
                bucket: 'files',
                description: description || '',
                created_at: file.created_at || new Date().toISOString()
              });
              
              itemCount++;
            }
          }
        }
        
        // Sort by created_at
        allItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setContent(allItems);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaginatedData();
  }, [supabase, currentPage, selectedArtist, artists.length]);

  // Memoized derived states - simplified since we're using server pagination
  const pageCount = useMemo(() => 
    Math.ceil(totalCount / IMAGES_PER_PAGE),
    [totalCount]
  );

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

  // 4. Debounce user interactions
  const debouncedSetCurrentPage = useCallback(
    debounce((page) => {
      setCurrentPage(page);
    }, 100),
    []
  );
  
  // 5. Use requestIdleCallback for non-critical operations
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Perform non-critical operations here
      });
    }
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
              {artists.map(artist => (
                <option key={artist.id} value={artist.name}>{artist.name}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="h-96 w-full flex items-center justify-center">
              <Spinner color="default" labelColor="foreground"/>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full px-4">
                {content.map((item, index) => (
                  <GalleryItem
                    key={`${item.bucket}-${item.userId}-${item.name}`}
                    item={item}
                    onClick={handleItemClick}
                    priority={index < 4}
                  />
                ))}
              </div>

              {pageCount > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  <Button
                    className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
                    onClick={() => debouncedSetCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <IoIosArrowRoundBack className="text-2xl"/>
                  </Button>
                  
                  {/* Simplified pagination - only show nearby pages */}
                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    let pageNum;
                    if (pageCount <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pageCount - 2) {
                      pageNum = pageCount - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => debouncedSetCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-full ${
                          currentPage === pageNum 
                            ? 'bg-[#9564b4] text-white' 
                            : 'bg-black text-white hover:bg-[#333333]'
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
                    onClick={() => debouncedSetCurrentPage(Math.min(pageCount, currentPage + 1))}
                    disabled={currentPage === pageCount}
                  >
                    <IoIosArrowRoundForward className="text-2xl"/>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Lazy load the modal only when needed */}
          {modalOpen && (
            <ImageModal
              item={selectedItem}
              isOpen={modalOpen}
              onClose={handleCloseModal}
            />
          )}
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
    bucket: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    // ... other prop definitions
  }),
  onClick: PropTypes.func.isRequired,
  priority: PropTypes.bool.isRequired
};