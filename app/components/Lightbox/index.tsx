import React from "react";

interface LightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  showNavigation: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({
  src,
  alt,
  onClose,
  onPrev,
  onNext,
  showNavigation,
}) => {
  const handleInnerClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl px-4"
        onClick={handleInnerClick}
      >
        <img
          src={src}
          alt={alt || "Lightbox image"}
          className="block w-full mx-auto rounded-xl max-h-[600px] object-contain"
        />
        <button
          className="absolute -top-20 right-5 md:right-0 rounded-full text-black bg-white text-3xl py-2 px-4"
          onClick={onClose}
        >
          &times;
        </button>
        {showNavigation && (
          <>
            <button
              className="absolute left-0 md:-left-10 top-[45%] text-white text-3xl p-2"
              onClick={onPrev}
            >
              &#10094;
            </button>
            <button
              className="absolute right-0 md:-right-10 top-[45%] text-white text-3xl p-2"
              onClick={onNext}
            >
              &#10095;
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
