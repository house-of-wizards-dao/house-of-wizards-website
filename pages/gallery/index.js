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

const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/";
const IMAGES_PER_PAGE = 20;
const IMAGES_PER_BATCH = 50; // Number of images to load in each batch

// Add image transformation parameters with better optimization
const getImageUrl = (bucket, userId, name, size = null) => {
  const baseUrl = `${CDNURL}${bucket}/${userId}/${name}`;
  
  // Don't transform GIFs or videos
  if (name.toLowerCase().endsWith('.gif') || name.toLowerCase().endsWith('.mp4')) {
    return baseUrl;
  }
  
  // Use different optimization strategies based on size needs
  switch(size) {
    case 'thumbnail':
      return `${baseUrl}?width=250&height=250&resize=contain&quality=20`;
    case 'preview':
      return `${baseUrl}?width=600&height=600&resize=contain&quality=75`;
    case 'full':
      return `${baseUrl}?quality=90`; // Reduced from 100 to 90 for better performance
    default:
      return baseUrl;
  }
};

// Optimized blurDataURL for faster placeholder rendering
const BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiM5OTk5OTkiLz48L3N2Zz4=';

// Extracted Modal Component for better code splitting
const ImageModal = React.memo(({ item, onClose, isOpen }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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

  // Reset image loaded state when modal closes or item changes
  useEffect(() => {
    if (!isOpen) {
      setImageLoaded(false);
    }
  }, [isOpen, item]);

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
              preload="metadata"
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
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner color="default" size="lg" />
                </div>
              )}
              <Image
                src={getImageUrl(item.bucket, item.userId, item.name, 'full')}
                alt={item.description || "Gallery image"}
                width={1200}
                height={800}
                className={`w-auto rounded-xl transition-all duration-300 ${isZoomed ? 'max-h-[80vh]' : 'max-h-[70vh]'} ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                style={{ 
                  objectFit: 'contain',
                  pointerEvents: isZoomed ? 'none' : 'auto'
                }}
                quality={85}
                unoptimized={item.name.toLowerCase().endsWith('.gif')}
                draggable={false}
                priority
                onLoadingComplete={() => setImageLoaded(true)}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
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

// Optimized Gallery Item Component with better image loading 
const GalleryItem = React.memo(({ item, onClick, priority, inView }) => {
  const [loaded, setLoaded] = useState(false);
  
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
      {item.bucket === 'files' && item.name.toLowerCase().endsWith('.mp4') ? (
        <div className="w-full aspect-square relative">
          <video 
            className="w-full aspect-square object-cover rounded-xl p-4"
            preload="none"
            poster={`${CDNURL}${item.bucket}/${item.userId}/${item.name}?width=250&height=250&resize=contain&frame=1`}
          >
            <source src={getImageUrl(item.bucket, item.userId, item.name)} type="video/mp4" />
          </video>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#9564b4]/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-square relative">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-xl"></div>
            </div>
          )}
          <Image
            src={getImageUrl(item.bucket, item.userId, item.name, 'thumbnail')}
            alt={item.description || "Gallery thumbnail"}
            width={250}
            height={250}
            className={`w-full aspect-square object-cover rounded-xl p-4 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            quality={50}
            unoptimized={item.name.toLowerCase().endsWith('.gif')}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            onLoadingComplete={() => setLoaded(true)}
          />
        </div>
      )}
      
      <div className="mt-3 w-full border-t-1 border-darkviolet p-4">
        <p className="text-foreground sm:text-md text-sm text-center truncate uppercase">
          {item.description || ""}
        </p>
        <p className="text-violet font-atirose text-lg text-center">
          {item.userName}
        </p>
      </div>
    </div>
  );
});

// Main Gallery Component with optimized data loading
function GalleryPage() {
  const supabase = useSupabaseClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [content, setContent] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasLoadedAllData, setHasLoadedAllData] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [pagesToLoad, setPagesToLoad] = useState(1);

  const loadMoreTimeout = useRef(null);
  const contentCache = useRef({
    profiles: null,
    imageDesc: null,
    fileDesc: null,
    galleryItems: []
  });

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

  // Load initial data only once
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        setIsLoadingData(true);
        
        // Only fetch the base data if not already in cache
        if (!contentCache.current.profiles) {
          const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('id, name');
          
          if (usersError) {
            throw new Error("Failed to fetch users: " + usersError.message);
          }
          
          contentCache.current.profiles = users;
          
          const [{ data: imageDescData }, { data: fileDescData }] = await Promise.all([
            supabase.from('image_descriptions').select('*'),
            supabase.from('file_descriptions').select('*')
          ]);
          
          contentCache.current.imageDesc = imageDescData;
          contentCache.current.fileDesc = fileDescData;
        }
        
        // Load first batch of data
        await loadBatchData(1);
        setIsLoadingData(false);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        setLoadingError(error.message);
        setIsLoadingData(false);
      }
    };

    fetchBaseData();
    
    return () => {
      if (loadMoreTimeout.current) {
        clearTimeout(loadMoreTimeout.current);
      }
    };
  }, [supabase]);

  // Load more content when reaching a new page
  useEffect(() => {
    const loadMore = async () => {
      if (!hasLoadedAllData && currentPage >= pagesToLoad) {
        setPagesToLoad(prev => prev + 1);
        await loadBatchData(pagesToLoad + 1);
      }
    };
    
    if (!isLoadingData && currentPage >= pagesToLoad - 1) {
      loadMoreTimeout.current = setTimeout(loadMore, 100);
    }
    
    return () => {
      if (loadMoreTimeout.current) {
        clearTimeout(loadMoreTimeout.current);
      }
    };
  }, [currentPage, pagesToLoad, hasLoadedAllData, isLoadingData]);

  // Function to load a batch of data
  const loadBatchData = async (batchNumber) => {
    try {
      setIsLoadingData(true);
      
      const profiles = contentCache.current.profiles;
      const imageDescData = contentCache.current.imageDesc;
      const fileDescData = contentCache.current.fileDesc;
      
      if (!profiles) return;
      
      // Calculate which users to load in this batch
      const startIndex = (batchNumber - 1) * IMAGES_PER_BATCH;
      const endIndex = startIndex + IMAGES_PER_BATCH;
      const batchProfiles = profiles.slice(startIndex, endIndex);
      
      if (batchProfiles.length === 0) {
        setHasLoadedAllData(true);
        setIsLoadingData(false);
        return;
      }
      
      const batchContent = await Promise.all(
        batchProfiles.map(async (user) => {
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

      const newItems = batchContent.flat();
      contentCache.current.galleryItems = [...contentCache.current.galleryItems, ...newItems];
      
      startTransition(() => {
        setContent(contentCache.current.galleryItems);
        setIsLoadingData(false);
      });
      
    } catch (error) {
      console.error("Error loading batch data:", error);
      setLoadingError(error.message);
      setIsLoadingData(false);
    }
  };

  // Preload the next set of images when a user opens the modal
  useEffect(() => {
    if (selectedItem && filteredContent.length > 0) {
      const currentIndex = filteredContent.findIndex(
        item => item.bucket === selectedItem.bucket && 
               item.userId === selectedItem.userId && 
               item.name === selectedItem.name
      );
      
      if (currentIndex !== -1) {
        // Preload next few images
        const nextItems = filteredContent.slice(
          currentIndex + 1, 
          currentIndex + 4
        );
        
        nextItems.forEach(item => {
          if (!item.name.toLowerCase().endsWith('.mp4')) {
            const img = new Image();
            img.src = getImageUrl(item.bucket, item.userId, item.name, 'preview');
          }
        });
      }
    }
  }, [selectedItem, filteredContent]);

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

  const handleLoadMore = useCallback(() => {
    if (!isLoadingData && currentPage < pageCount) {
      startTransition(() => {
        setCurrentPage(prev => prev + 1);
      });
    }
  }, [currentPage, pageCount, isLoadingData]);

  // Functions for pagination
  const handlePageChange = useCallback((pageNumber) => {
    if (!isLoadingData) {
      startTransition(() => {
        setCurrentPage(pageNumber);
      });
    }
  }, [isLoadingData]);

  const handlePrevPage = useCallback(() => {
    if (!isLoadingData && currentPage > 1) {
      startTransition(() => {
        setCurrentPage(prev => prev - 1);
      });
    }
  }, [currentPage, isLoadingData]);

  const handleNextPage = useCallback(() => {
    if (!isLoadingData && currentPage < pageCount) {
      startTransition(() => {
        setCurrentPage(prev => prev + 1);
      });
    }
  }, [currentPage, pageCount, isLoadingData]);

  if (isLoadingData && content.length === 0) {
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

  if (loadingError) {
    return (
      <DefaultLayout>
        <Container className="flex flex-col sm:gap-6 gap-3 justify-center items-center max-w-8xl mx-auto">
          <div className="h-screen w-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Error loading gallery</h2>
            <p className="text-red-500 mb-4">{loadingError}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Try Again
            </Button>
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
                key={`${item.bucket}-${item.userId}-${item.name}`}
                item={item}
                onClick={handleItemClick}
                priority={index < 8}
                inView={true}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex justify-center mt-6 gap-2 items-center flex-wrap">
              <Button
                className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
                onClick={handlePrevPage}
                disabled={isLoadingData || currentPage === 1}
                aria-label="Previous page"
              >
                <IoIosArrowRoundBack className="text-2xl"/>
              </Button>
              
              {(() => {
                // Determine which page numbers to show (for large page counts)
                let pageNumbers = [];
                if (pageCount <= 7) {
                  // Show all pages if 7 or fewer
                  pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
                } else {
                  // Always include first and last pages
                  pageNumbers.push(1);
                  
                  // Show ellipsis if not near the beginning
                  if (currentPage > 3) {
                    pageNumbers.push('...');
                  }
                  
                  // Add pages around current page
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(pageCount - 1, currentPage + 1);
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(i);
                  }
                  
                  // Show ellipsis if not near the end
                  if (currentPage < pageCount - 2) {
                    pageNumbers.push('...');
                  }
                  
                  // Add last page if not already included
                  if (pageCount > 1) {
                    pageNumbers.push(pageCount);
                  }
                }
                
                return pageNumbers.map((pageNum, index) => 
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1 text-foreground">...</span>
                  ) : (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-full ${
                        currentPage === pageNum 
                          ? 'bg-[#9564b4] text-white' 
                          : 'bg-black text-white hover:bg-[#333333]'
                      }`}
                      disabled={isLoadingData}
                      aria-label={`Page ${pageNum}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </Button>
                  )
                );
              })()}
              
              <Button
                className="px-3 py-1 rounded-full bg-black text-white disabled:opacity-50"
                onClick={handleNextPage}
                disabled={isLoadingData || currentPage === pageCount}
                aria-label="Next page"
              >
                <IoIosArrowRoundForward className="text-2xl"/>
              </Button>
              
              {isLoadingData && (
                <div className="ml-3">
                  <Spinner size="sm" color="default" />
                </div>
              )}
            </div>
          )}
          
          {pageCount > 7 && (
            <div className="text-center text-foreground text-sm mt-2">
              Page {currentPage} of {pageCount}
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
    bucket: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    // ... other prop definitions
  }),
  onClick: PropTypes.func.isRequired,
  priority: PropTypes.bool.isRequired
};