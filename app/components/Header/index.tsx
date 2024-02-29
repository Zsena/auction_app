"use client";

import { useState } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import ToggleNav from "../ToggleNav";
import NavList from "../NavList/navlist";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between lg:justify-end h-full px-6 mx-auto text-teal-700 dark:text-teal-300">
        <div className="w-full">
          <a
            className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center"
            href="/"
          >
            <span className="text-teal-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14.005 20.003v2h-12v-2h12ZM14.59.689l7.778 7.778l-1.414 1.414l-1.061-.353l-2.475 2.475l5.657 5.657l-1.414 1.414l-5.657-5.657L13.6 15.82l.283 1.131l-1.415 1.415l-7.778-7.779l1.414-1.414l1.132.283l6.293-6.293l-.353-1.06L14.59.688Zm.707 3.536l-7.071 7.07l3.535 3.536l7.071-7.071l-3.535-3.535Z"
                />
              </svg>
            </span>
            <span className="ml-2">Aukciók</span>
          </a>
        </div>
        {/* <!-- Mobile hamburger --> */}

        {/* right menu */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <ThemeSwitcher />
          </li>
          <li>
            <ToggleNav isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            {isMenuOpen && (
              <aside className="z-20 fixed top-0 left-0 w-64 h-full overflow-y-auto bg-white dark:bg-gray-800">
                <div className="p-4">
                  <ToggleNav isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                  <NavList />
                </div>
              </aside>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
