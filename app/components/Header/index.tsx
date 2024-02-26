"use client";

import { useState } from "react";
// import DropdownMenu from "../DropdownMenu";
import ThemeSwitcher from "../ThemeSwitcher";
import ToggleNav from "../ToggleNav";
import NavList from "../NavList/navlist";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  
  // const dropdownItems = ["Item 1", "Item 2", "Item 3"];
  // const notiIcon = (
  //   <svg
  //     className="w-5 h-5"
  //     aria-hidden="true"
  //     fill="currentColor"
  //     viewBox="0 0 20 20"
  //   >
  //     <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
  //   </svg>
  // );

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between lg:justify-end h-full px-6 mx-auto text-teal-700 dark:text-teal-300">
        {/* <!-- Mobile hamburger --> */}
        <div>
          <ToggleNav isOpen={isMenuOpen} toggleMenu={toggleMenu} />
          {isMenuOpen && (
            <aside className="z-20 fixed top-0 left-0 w-64 h-full overflow-y-auto bg-white dark:bg-gray-800">
              <div className="p-4">
                <ToggleNav isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <NavList />
              </div>
            </aside>
          )}
        </div>
          {/* right menu */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <ThemeSwitcher />
          </li>
          {/* <!-- Notifications menu --> */}
          {/* <DropdownMenu
            items={dropdownItems}
            customClass="primary-btn"
            title="asdf"
            listColor="text-teal-500"
            customIcon={notiIcon}
          /> */}
        </ul>
      </div>
    </header>
  );
};

export default Header;
