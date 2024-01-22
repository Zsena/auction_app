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
        post_code_to_settlement="Irányítószám"
        address="Cím"
        starting_price="Kikiáltási ár"
        minimal_price="Minimum ár"
        auction_type="Offline vagy Online"
        bidding_ladder="Licitlépcső"
        online_auction_planned_end_time="Árverés vége"
      />
    </section>
  );
};

export default Home;
