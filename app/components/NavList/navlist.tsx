// import DropdownMenu from "../DropdownMenu";

const NavList = () => {
  // const chevronDown = (
  //   <svg
  //     className="w-6 h-6"
  //     fill="none"
  //     stroke="currentColor"
  //     viewBox="0 0 24 24"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <path
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       strokeWidth="2"
  //       d="M19 9l-7 7-7-7"
  //     />
  //   </svg>
  // );

  // const dropdownItems = ["Item 1", "Item 2", "Item 3"];

  return (
      <div className="py-4 text-gray-500 dark:text-gray-400 w-full md:w-64 fixed">
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
          <span className="ml-2">Auction</span>
        </a>
        <ul className="mt-6">
          <li className="relative px-6 py-3">
            <span
              className="absolute inset-y-0 left-0 w-1 bg-teal-700 rounded-tr-lg rounded-br-lg"
              aria-hidden="true"
            ></span>
            <a
              className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
              href="/"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="ml-4">Listaoldal</span>
            </a>
          </li>
        </ul>
        {/* <div className="px-6 my-6 w-full">
          <DropdownMenu
            items={dropdownItems}
            customClass="primary-btn"
            title="asdf"
            listColor="text-teal-500"
            customIcon={chevronDown}
            alignClass="left-0"
          />
        </div> */}
      </div>
  );
};

export default NavList;
