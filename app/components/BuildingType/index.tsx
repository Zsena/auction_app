"use client";

import { ChangeEvent } from "react";

interface BuildingTypeProps {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const BuildingType: React.FC<BuildingTypeProps> = (props: BuildingTypeProps) => {

  return (
      <label className="block mt-4 text-sm">
        <span className="text-gray-700 dark:text-gray-400">Épület típusa</span>
        <select className="primary-select" onChange={props.onChange} >
          <option value="nincs">nincs</option>
          <option value="lakóház">lakóház</option>
          <option value="öröklakás">öröklakás</option>
          <option value="gazdasági épület">gazdasági épület</option>
          <option value="egyéb">egyéb</option>
          <option value="garázs">garázs</option>
          <option value="üdülő">üdülő</option>
          <option value="pince">pince</option>
        </select>
      </label>
  );
};

export default BuildingType;

