"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface ListSearchProps {
  placeholderValue: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ListSearch: React.FC<ListSearchProps> = (props: ListSearchProps) => {
  return (
    <div className="flex justify-end flex-1 lg:mr-5 py-6">
      <div className="relative w-full max-w-xl mr-6 focus-within:text-teal-500">
        <div className="absolute inset-y-0 flex items-center pl-2">
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          className="w-full pl-8 pr-2 py-3 text-sm text-gray-700 placeholder-gray-600 
      bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:ring-gray-200
      dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 
      focus:bg-white focus:ring-teal-300 focus:outline-none focus:ring-2"
          type="text"
          placeholder={props.placeholderValue}
          aria-label="Search"
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
};

export default ListSearch;