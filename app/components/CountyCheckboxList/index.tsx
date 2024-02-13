import React, { useState } from "react";

interface County {
    id: number;
    name: string;
    checked: boolean;
  }
  
interface CountyCheckboxListProps {
  selectedCounties: string[]; // Kiválasztott megyék nevei
  onCountySelectionChange: (name: string, isChecked: boolean) => void; // Módosítva: név alapú
}

const counties: County[] = [
  { id: 1, name: "Bács-Kiskun", checked: false },
  { id: 2, name: "Baranya", checked: false },
  { id: 3, name: "Békés", checked: false },
  { id: 4, name: "Borsod-Abaúj-Zemplén", checked: false },
  { id: 5, name: "Csongrád-Csanád", checked: false },
  { id: 6, name: "Fejér", checked: false },
  { id: 7, name: "Győr-Moson-Sopron", checked: false },
  { id: 8, name: "Hajdú-Bihar", checked: false },
  { id: 9, name: "Heves", checked: false },
  { id: 10, name: "Jász-Nagykun-Szolnok", checked: false },
  { id: 11, name: "Komárom-Esztergom", checked: false },
  { id: 12, name: "Nógrád", checked: false },
  { id: 13, name: "Pest", checked: false },
  { id: 14, name: "Somogy", checked: false },
  { id: 15, name: "Szabolcs-Szatmár-Bereg", checked: false },
  { id: 16, name: "Tolna", checked: false },
  { id: 17, name: "Vas", checked: false },
  { id: 18, name: "Veszprém", checked: false },
  { id: 19, name: "Zala", checked: false },
  { id: 20, name: "Budapest", checked: false },
];

const CountyCheckboxList: React.FC<CountyCheckboxListProps> = ({ selectedCounties, onCountySelectionChange }) => {
    return (
      <div className="flex flex-wrap gap-4 p-4">
        {counties.map((county) => (
          <label key={county.id} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCounties.includes(county.name)}
              onChange={(e) => onCountySelectionChange(county.name, e.target.checked)}
              className="form-checkbox h-5 w-5 text-teal-600"
            />
            <span className="text-gray-700">{county.name}</span>
          </label>
        ))}
      </div>
    );
  };

export default CountyCheckboxList;
