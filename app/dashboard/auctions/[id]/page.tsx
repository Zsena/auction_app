"use client";

import { useEffect, useState } from "react";

interface AuctionHistory {
  auction_id: number;
  bidding_history: string;
  bidding_history_updated_at: string;
  change_in_number_of_bids: number;
  created_at: string;
  highest_bid: null | number;
  highest_bid_submitted_date: null | string;
  id: number;
  number_of_bids: number;
  removed: boolean;
  scraped_at: string;
  source_file_timestamp: string;
}

interface Auction {
  address: string;
  auction_advance: number;
  auction_histories: AuctionHistory[];
  link_to_first_image: string;
  auction_type: string;
  execution_number: string;
  description: string;
}

interface AuctionData {
  auction: Auction;
}

const fetchAuctionData = async (auctionId: string) => {
  const apiUrl = `https://auction-api-dev.mptrdev.com/auction?id=${auctionId}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch auction data: ${response.status}`);
  }

  return response.json() as Promise<AuctionData>;
};

const AuctionDetailsPage: React.FC = () => {
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auctionId = window.location.pathname.split("/").pop();

    fetchAuctionData(auctionId!)
      .then((data) => {
        setAuctionData(data);
        setLoading(false);
        console.log("Fetched data:", data);
      })
      .catch((error: unknown) => {
        setLoading(false);
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      });
  }, []);

  const renderAuctionHistories = (histories: AuctionHistory[]) => (
    <div>
      <h2 className="text-xl font-semibold">Árverés információk:</h2>
      {histories.map((history) => (
        <div key={history.id}>
          <h6>Bidding History ID: {history.auction_id}</h6>
          <p>Bidding History: {history.bidding_history}</p>
          <p>Change in Number of Bids: {history.change_in_number_of_bids}</p>
        </div>
      ))}
    </div>
  );

  return (
    <section className="h-full overflow-y-auto">
      <div className="container px-6 mx-auto grid">
        {auctionData && (
          <>
            <h1 className="my-20 text-3xl xl:text-5xl">
              <div>
                <h2 className="text-xl font-semibold">Ingatlan árverés:</h2>
                <p>{auctionData.auction.address}</p>
              </div>
            </h1>

            <section className="flex flex-col justify-center xl:flex-row xl:justify-between pt-8">
              <div className="relative w-full xl:w-1/2 h-full mr-3 rounded-lg my-4">
                {auctionData && (
                  <img
                    className="object-cover w-full h-full rounded-lg shadow-xl"
                    src={
                      "https://auction-api-dev.mptrdev.com/download_file?folder=" +
                      (auctionData.auction.auction_type === "online"
                        ? "Online_auctions"
                        : "Offline_auctions") +
                      "&file=" +
                      auctionData.auction.link_to_first_image +
                      "&download=0"
                    }
                    alt=""
                    loading="lazy"
                  />
                )}
                <div
                  className="absolute inset-0 rounded-full shadow-inner"
                  aria-hidden="true"
                ></div>
              </div>
              <aside className="w-full xl:w-1/2 my-4">
                <h2 className="text-3xl font-semibold pb-2 border-b-4">
                  Ingatlan alap adatok:
                </h2>
                {auctionData && (
                  <div className="mt-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Végrehajtási ügyszám:
                      </h2>
                      <p>{auctionData.auction.execution_number}</p>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        Auction Advance:
                      </h2>
                      <p>{auctionData.auction.auction_advance}</p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">
                        Auction Histories:
                      </h2>
                      {renderAuctionHistories(
                        auctionData.auction.auction_histories
                      )}
                    </div>
                  </div>
                )}
              </aside>
            </section>
            {auctionData && (
              <section className="mt-8">
                <article className="border-2 rounded-lg p-5">
                  <h2 className="text-xl font-semibold">Ingatlan leírása:</h2>
                  <p>{auctionData.auction.description}</p>
                </article>
              </section>
            )}
          </>
        )}
      </div>
      <a
        className="mt-10 flex items-center justify-between p-4 mb-8 text-sm font-semibold text-teal-100 bg-teal-700 rounded-lg shadow-md focus:outline-none focus:shadow-outline-teal"
        href="/"
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            {/* ... SVG path ... */}
          </svg>
          <span>Vissza a listaoldalra</span>
        </div>
        <span>Keresés →</span>
      </a>
    </section>
  );
};

export default AuctionDetailsPage;
