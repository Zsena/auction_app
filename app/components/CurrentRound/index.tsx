
"use client";

import React from "react";

interface CurrentRoundProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CurrentRound: React.FC<CurrentRoundProps> = ({ onChange }) => {
  return (
    <label className="block mt-4 text-sm">
      <span className="text-gray-700 dark:text-gray-400">Aukciós szakasz</span>
      <select className="primary-select mt-2" onChange={onChange} defaultValue="">
        <option value="">Összes kör</option>
        <option value="1">Első szakasz</option>
        <option value="2">Második szakasz</option>
        <option value="3">Harmadik szakasz</option>
      </select>
    </label>
  );
};

export default CurrentRound;