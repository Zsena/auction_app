"use client";

import { ChangeEvent } from "react";

interface StatusProps {
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Status: React.FC<StatusProps> = (props: StatusProps) => {
  return (
    <div className="flex mt-6 text-sm">
      <label className="flex items-center dark:text-gray-400">
        <input
          type="checkbox"
          className="primary-checkbox"
          onChange={props.onChange}
          defaultChecked
        />
        <span className="ml-2">{props.name}</span>
      </label>
    </div>
  );
};

export default Status;
