// ToggleNav.tsx
import React from "react";

interface ToggleNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const ToggleNav: React.FC<ToggleNavProps> = ({
  isOpen,
  toggleMenu,
}) => {
  return (
    <div>
      <button
        className={`w-full p-1 mr-5 -ml-1 rounded-md focus:outline-none focus:shadow-outline-teal ${
            isOpen ? "flex justify-end" : ""
          }`}
        aria-label="Menu"
        onClick={toggleMenu}
      >
        {!isOpen ? (
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ToggleNav;
