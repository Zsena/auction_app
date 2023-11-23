import React from "react";

const Footer = () => {
  return (
    <footer className="px-4 sm:px-6 py-6 bg-gray-50 dark:bg-gray-900">
      <div className="text-center text-sm text-gray-500">
        <span className="dark:text-gray-100 text-gray-900 font-bold text-lg mr-2">
          {" "}
          Copyright MPTR Dev -
        </span>{" "}
        © {new Date().getFullYear()} All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
