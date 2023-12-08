// import Image from 'next/image'
"use client";

import React, { useEffect, useState } from "react";
import AuctionTableList from "./components/AuctionTableList";
import SearchBox from "./components/BuildingType";

const Home: React.FC = () => {
  return (
    <section className="h-full overflow-y-auto">
      <div className="container px-6 mx-auto grid">
        <h1 className="my-20 text-3xl lg:text-5xl">
          Ingatlan árverések Magyarországon
        </h1>
      </div>
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
