// DropdownMenu.tsx
"use client";

// DropdownMenu.tsx

import { useState } from "react";

interface DropdownMenuProps {
  items: string[];
  title: string;
  customClass?: string;
  listColor?: string;
  customIcon?: React.ReactNode;
  alignClass?: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  title,
  customClass,
  listColor,
  customIcon,
  alignClass = "right-0"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block text-left`}>
      <button
        onClick={toggleDropdown}
        type="button"
        className={`${customClass}`}
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true"
      >
        {title}
        {customIcon && <span className="mr-2">{customIcon}</span>}
      </button>

      {isOpen && (
        <div
          className={`origin-top-right absolute ${alignClass} mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`block px-4 py-2 text-sm text-gray-700 ${listColor} hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
