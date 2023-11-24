// import Image from 'next/image'
"use client";

import React, { useEffect, useState } from "react";
import AuctionTableList from "./components/AuctionTableList";

const Home: React.FC = () => {
  return (
    <section className="h-full overflow-y-auto">
      <div className="container px-6 mx-auto grid">
        <h1 className="my-20 text-3xl lg:text-5xl">
          Ingatlan árverések Magyarországon
        </h1>
        <a
          className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-teal-100 bg-teal-700 rounded-lg shadow-md focus:outline-none focus:shadow-outline-teal"
          href="/dashboard/search"
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span>Keress részletesen</span>
          </div>
          <span>Keresés →</span>
        </a>
      </div>
      <section className="my-5">
      </section>
      <AuctionTableList
        firstTh="Cím"
        secondTh="Kikiáltási ár"
        thirdTh="Minimum ár"
        fourthTh="Offline vagy Online"
        fifthTh="Licitlépcső"
        sixTh="Árverés vége"
      />
    </section>
  );
};

export default Home;
