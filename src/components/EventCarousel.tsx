
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface EventCarouselProps {
  images: string[];
}

const INTERVAL = 4000;

const EventCarousel: React.FC<EventCarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset carousel when images change
  useEffect(() => {
    setCurrent(0);
    setIsLoaded(false);
    setImageError(false);
  }, [images]);

  useEffect(() => {
    // Only set up auto-rotation if there are multiple images and no errors
    if (images.length <= 1 || imageError) return;
    
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, INTERVAL);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, images.length, imageError]);

  const goToNext = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setIsLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error("Error loading image:", images[current]);
    setImageError(true);
    setIsLoaded(true);
  };

  if (!images || !images.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded shadow">
        <div className="flex flex-col items-center text-gray-400">
          <ImageOff className="h-12 w-12 mb-2" />
          <p>No images available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full flex items-center justify-center relative">
      <div className="w-full h-64 relative overflow-hidden rounded shadow">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Error placeholder */}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <ImageOff className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Image cannot be displayed</p>
          </div>
        ) : (
          <img
            src={images[current]}
            alt="Event"
            className={`w-full h-64 object-cover transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ maxHeight: 320 }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>
      
      {/* Only show navigation controls if we have multiple images and no errors */}
      {images.length > 1 && !imageError && (
        <>
          {/* Navigation arrows for larger screens */}
          <button
            onClick={goToPrev}
            className="absolute left-2 p-1 bg-black/30 hover:bg-black/50 text-white rounded-full hidden sm:flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 p-1 bg-black/30 hover:bg-black/50 text-white rounded-full hidden sm:flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
          
          {/* Dots navigation */}
          <div className="flex justify-center mt-2 absolute bottom-2 left-0 right-0">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  current === index ? "bg-white" : "bg-gray-400"
                }`}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventCarousel;
