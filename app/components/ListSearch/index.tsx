"use client";

import { ChangeEvent } from "react";

interface ListSearchProps {
  placeholderValue: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ListSearch: React.FC<ListSearchProps> = (props: ListSearchProps) => {
  return (
    <div className="flex justify-between py-2">
      <div className="relative w-full mr-2 focus-within:text-teal-500">
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
          className="primary-input"
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