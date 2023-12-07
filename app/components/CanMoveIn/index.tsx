"use client";

import { ChangeEvent } from "react";

interface CanMoveInProps {
    value: boolean;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const CanMoveIn: React.FC<CanMoveInProps> = (props: CanMoveInProps) => {

  return (
    <label className="block mt-4 text-sm">
    <span className="text-gray-700 dark:text-gray-400">Beköltözhető</span>
    <select
      className="primary-select"
      value={props.value.toString()}
      onChange={props.onChange}
    >
      <option value="true">Igen</option>
      <option value="false">Nem</option>
    </select>
  </label>
  );
};

export default CanMoveIn;