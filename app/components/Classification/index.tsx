"use client";

import { ChangeEvent } from "react";

interface ClassificationProps {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const Classification: React.FC<ClassificationProps> = (
  props: ClassificationProps
) => {
  return (
    <label className="block mt-4 text-sm">
      <span className="text-gray-700 dark:text-gray-400">Besorolás</span>
      <select className="primary-select" onChange={props.onChange}>
        <option value="egyéb">egyéb</option>
        <option value="ipari">ipari</option>
        <option value="lakóépület">lakóépület</option>
        <option value="mezőgazdasági">mezőgazdasági</option>
      </select>
    </label>
  );
};

export default Classification;
