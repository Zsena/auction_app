// import Image from 'next/image'
"use client";

import React, { useEffect, useState } from "react";
import AuctionTableList from "./components/AuctionTableList";
import SearchBox from "./components/BuildingType";

const Home: React.FC = () => {
  return (
    <section className="h-full overflow-y-auto">
      <div className="container px-6 mx-auto grid">
        <h1 className="mt-10 mb-5 text-3xl lg:text-5xl text-center">
          Ingatlan árverések Magyarországon
        </h1>
      </div>
      <AuctionTableList
        post_code_to_settlement="Irányítószám"
        address="Cím"
        minimal_price="Min. ár"
        starting_price="Kikiáltási ár"
        auction_type="Státusz"
        bidding_ladder="Licitlépcső"
        round_end_time="Szakasz vége"
        current_round="Aukciós szakasz"
        round_min_price="Szakasz min. ár"
        online_auction_planned_end_time="Árverés vége"
        highest_bid="Legmagasabb licit"
        execution_number="Ügyszám"
        scraped_at="Scrape dátuma"
      />
    </section>
  );
};

export default Home;
