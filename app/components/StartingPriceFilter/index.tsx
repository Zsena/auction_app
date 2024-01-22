"use client";

import { ChangeEvent } from "react";

interface StartingPriceFilterProps {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const StartingPriceFilter: React.FC<StartingPriceFilterProps> = (props: StartingPriceFilterProps) => {
  return (
    <label className="block mt-4 text-sm">
      <span className="text-gray-700 dark:text-gray-400">Kikiáltási ár</span>
      <select className="primary-select" onChange={props.onChange}>
        <option value="">Összes</option>
        <option value="0-1000000">0 - 1,000,000 Ft</option>
        <option value="1000001-5000000">1,000,001 - 5,000,000 Ft</option>
        <option value="5000001-10000000">5,000,001 - 10,000,000 Ft</option>
        <option value="10000001-">10,000,001 Ft felett</option>
      </select>
    </label>
  );
};

export default StartingPriceFilter;