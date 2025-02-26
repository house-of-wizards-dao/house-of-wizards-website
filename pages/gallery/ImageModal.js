import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from 'next/image';
import { IoIosCloseCircle } from "react-icons/io";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";
import PropTypes from 'prop-types';

// Add image transformation parameters
const CDNURL = "https://czflihgzksfynoqfilot.supabase.co/storage/v1/object/public/";

const getImageUrl = (bucket, userId, name, isThumb = false) => {
  const baseUrl = `${CDNURL}${bucket}/${userId}/${name}`;
  if (name.toLowerCase().endsWith('.gif') || name.toLowerCase().endsWith('.mp4')) {
    return baseUrl; // Don't transform GIFs or videos
  }
  // Add more aggressive image optimization for thumbnails
  return isThumb ? `${baseUrl}?width=200&quality=50` : `${baseUrl}?quality=85`;
};

const ImageModal = ({ item, onClose, isOpen }) => {
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
                alt={item.description || "Gallery image"}
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
};

ImageModal.propTypes = {
  item: PropTypes.shape({
    bucket: PropTypes.string,
    userId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    userName: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default ImageModal;