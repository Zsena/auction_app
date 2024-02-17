"use client";

import { ChangeEvent } from "react";

interface StatusProps {
  name: string;
  statusName: string;
  selected: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Status: React.FC<StatusProps> = ({
  name,
  statusName,
  selected,
  onChange,
}) => {
  return (
    <div className="flex mt-6 text-sm">
      <label className="flex items-center dark:text-gray-400">
        <input
          type="radio"
          className="primary-radio"
          value={statusName.toLowerCase()}
          checked={selected === statusName.toLowerCase()}
          onChange={onChange}
        />
        <span className="ml-2">{name}</span>
      </label>
    </div>
  );
};

export default Status;
