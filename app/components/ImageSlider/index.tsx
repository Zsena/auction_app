import React, { useState } from "react";
import Lightbox from "../Lightbox";

type ImageSliderProps = {
  images: string[];
  auctionType: string;
};

const ImageSlider: React.FC<ImageSliderProps> = ({ images, auctionType }) => {
  const [current, setCurrent] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  const nextSlide = () =>
    setCurrent((current) => (current === images.length - 1 ? 0 : current + 1));
  const prevSlide = () =>
    setCurrent((current) => (current === 0 ? images.length - 1 : current - 1));
  const toggleLightbox = () => setLightboxVisible(!lightboxVisible);
  const selectSlide = (index: number) => setCurrent(index);

  // mini image max num
  const visibleThumbnails = images.slice(0, 4);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
      {/* main image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 h-full cursor-pointer flex justify-center items-center px-4"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 h-full cursor-pointer flex justify-center items-center px-4"
          >
            &#10095;
          </button>
        </>
      )}
      {images.map(
        (image, index) =>
          index === current && (
            <img
              key={index}
              src={`https://auction-api-dev.mptrdev.com/download_file?folder=${
                auctionType === "online"
                  ? "Online_auctions"
                  : "Offline_auctions"
              }&file=${image}&download=0`}
              alt={`Auction Image ${index + 1}`}
              className="w-full max-w-xl h-auto rounded-lg shadow-xl cursor-pointer mb-4"
              onClick={toggleLightbox}
            />
          )
      )}

      {/* mini images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {visibleThumbnails.map((image, index) => (
            <img
              key={index}
              src={`https://auction-api-dev.mptrdev.com/download_file?folder=${
                auctionType === "online"
                  ? "Online_auctions"
                  : "Offline_auctions"
              }&file=${image}&download=0`}
              alt={`Thumbnail ${index + 1}`}
              className={`w-24 h-24 object-cover rounded-lg shadow-lg cursor-pointer ${
                index === current ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => selectSlide(index)}
            />
          ))}
        </div>
      )}
      {/* Lightbox if active */}
      {lightboxVisible && (
        <Lightbox
          src={`https://auction-api-dev.mptrdev.com/download_file?folder=${
            auctionType === "online" ? "Online_auctions" : "Offline_auctions"
          }&file=${images[current]}&download=0`}
          alt={`Auction Image ${current + 1}`}
          onClose={toggleLightbox}
          onPrev={prevSlide}
          onNext={nextSlide}
          showNavigation={images.length > 1}
        />
      )}
    </div>
  );
};

export default ImageSlider;
