"use client";

import ImageSlider from "@/app/components/ImageSlider";
import { Key, useEffect, useState } from "react";
import Collapsible from "react-collapsible";
import { Icon } from "@iconify/react";

interface LastAuctionHistory {
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
  final_price: number;
  final_result: null | string;
  is_current: boolean | number;
}

interface Auction {
  address: string;
  auction_advance: number;
  auction_histories: LastAuctionHistory[];
  link_to_first_image: string;
  auction_type: string;
  execution_number: string;
  description: string;
  minimal_price: string;
  starting_price: string;
  bidding_ladder: number;
  online_auction_strat_time: string;
  online_auction_planned_end_time: string;
  serial_number: number;
  post_code: number;
  city: string;
  parcel_number: string;
  classification: string;
  location_type: string;
  cultivation_type: string;
  registered_land_use: string;
  juristic_classification: string;
  ownership_fraction: string;
  can_move_in: string;
  not_move_out: string;
  viewable: string;
  visibility: string;
  phonenumber: string;
  pdf_link: string;
  no_of_images: string;
  all_images: string[];
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

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="container px-6 mx-auto">
        {auctionData && (
          <>
            <div className="my-20">
              <h1 className="text-3xl xl:text-5xl font-bold text-center text-gray-800 dark:text-white">
                Ingatlan árverés
              </h1>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
                  Cím: {auctionData.auction.address}
                </h2>
              </div>
            </div>

            <section className="flex flex-col justify-center items-start xl:items-stretch gap-8">
              <div className="w-full image-container">
                <section className="flex flex-col justify-center items-start xl:items-stretch gap-8">
                  {/* ImageSlider komponens hozzáadása itt */}
                  {auctionData &&
                    auctionData.auction.all_images &&
                    auctionData.auction.all_images.length > 0 && (
                      <ImageSlider
                        images={auctionData.auction.all_images}
                        auctionType={auctionData.auction.auction_type}
                      />
                    )}
                  {/* A meglévő kód marad változatlan */}
                </section>
                <section className="flex items-center justify-center gap-2 mt-5">
                  <div className="text-center">
                    <a
                      className="text-sm p-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600"
                      href={`https://auction-api-dev.mptrdev.com/download_file?folder=${
                        auctionData.auction.auction_type === "online"
                          ? "Online_auctions"
                          : "Offline_auctions"
                      }&file=${
                        auctionData.auction.link_to_first_image
                      }&download=1`}
                      download
                    >
                      Kép Letöltése
                    </a>
                  </div>
                  <div className="text-center">
                    <a
                      className="text-sm p-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600"
                      href={`https://auction-api-dev.mptrdev.com/download_file?folder=${
                        auctionData.auction.auction_type === "online"
                          ? "Online_auctions"
                          : "Offline_auctions"
                      }&file=${auctionData.auction.pdf_link}&download=1`}
                      download
                    >
                      PDF Letöltése
                    </a>
                  </div>
                </section>
              </div>
              <section className="my-8">
                <article className="border-2 border-gray-200 rounded-lg p-5 bg-white dark:bg-gray-800 shadow">
                  <h2 className="text-2xl mb-4 uppercase font-medium">
                    Ingatlan alap adatai
                  </h2>
                  <section className="grid gap-6 mt-8 md:grid-cols-3">
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:mailbox2"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">Cím</div>
                        <div className="font-light">
                          {auctionData.auction.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="maki:telephone"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Telefonszám:
                        </div>
                        <div className="font-light">
                          {auctionData.auction.phonenumber}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:cash"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Árverési előleg:
                        </div>
                        <div className="font-light">
                          {`${auctionData.auction.auction_advance.toLocaleString()} Ft`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="ri:auction-fill"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Kikiáltási ár:
                        </div>
                        <div className="font-light">
                          {`${auctionData.auction.starting_price.toLocaleString()} Ft`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:cash-coin"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="font-medium">
                        <div className="font-medium uppercase">Minimál ár:</div>
                        <div className="font-light">
                          {`${auctionData.auction.minimal_price.toLocaleString()} Ft`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:graph-up-arrow"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="font-medium">
                        <div className="font-medium uppercase">
                          Licitlépcső:
                        </div>
                        <div className="font-light">
                          {`${auctionData.auction.bidding_ladder.toLocaleString()} Ft`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:calendar3"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Online árverés kezdete:
                        </div>
                        <div className="font-light">
                          {new Date(
                            auctionData.auction.online_auction_strat_time
                          ).toLocaleString("hu-HU", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:calendar3-event"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Online árverés tervezett vége:
                        </div>
                        <div className="font-light">
                          {new Date(
                            auctionData.auction.online_auction_planned_end_time
                          ).toLocaleString("hu-HU", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                      </div>
                    </div>
                  </section>
                </article>
              </section>
              <section className="border-2 border-gray-200 rounded-lg p-5 bg-white dark:bg-gray-800 shadow">
                <h2 className="text-2xl mb-4 uppercase font-medium">
                  Ingatlan ajánlati előzményei
                </h2>
                <section className="grid gap-6 mt-8 md:grid-cols-3">
                  <div className="flex items-center space-x-3">
                    <Icon
                      icon="bi:mailbox2"
                      className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                    />
                    <div className="w-2/3">
                      <div className="font-medium uppercase">Aukció típusa</div>
                      {auctionData.auction.auction_type === "online" &&
                      auctionData.auction.auction_histories.some(
                        (history) => history.is_current === 1
                      ) ? (
                        auctionData.auction.auction_histories.some(
                          (history) => history.final_result === null
                        ) ? (
                          <div className="font-light">Élő</div>
                        ) : (
                          <div className="font-light">Befejezett</div>
                        )
                      ) : (
                        <div className="font-light">Folyamatos</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon
                      icon="ri:auction-fill"
                      className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                    />
                    <div className="w-2/3">
                      <div className="font-medium uppercase">Végső ár</div>
                      {auctionData.auction.auction_histories.map(
                        (history, index) => (
                          <div key={index} className="font-light">
                            {history.final_price}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </section>
              </section>
              {auctionData && (
                <article className="border-2 border-gray-200 rounded-lg p-5 bg-white dark:bg-gray-800 shadow">
                  <h2 className="text-2xl mb-4 uppercase font-medium border-b pb-4">
                    Ingatlan leírása:
                  </h2>
                  <p className="text-gray-600 dark:text-white">
                    {auctionData.auction.description}
                  </p>
                </article>
              )}
              <Collapsible
                triggerOpenedClassName="text-sm p-4 w-fit flex items-center font-semibold text-cyan-100 bg-cyan-700 rounded-lg shadow-md mx-auto"
                triggerClassName="text-sm p-4 w-fit flex items-center font-semibold text-indigo-100 bg-indigo-700 rounded-lg shadow-md mx-auto"
                trigger="További adatok megjelenítése + "
                triggerWhenOpen="További adatok bezárása - "
              >
                <aside className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 my-8">
                  <h2 className="text-2xl mb-4 uppercase font-medium">
                    További adatok
                  </h2>
                  <section className="grid gap-6 mt-8 md:grid-cols-3">
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:card-checklist"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">Besorolás</div>
                        <div className="font-light">
                          {auctionData.auction.classification}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:house-door-fill"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Helyrajzi szám:
                        </div>
                        <div className="font-light">
                          {auctionData.auction.parcel_number}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:map-fill"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">Fekvés:</div>
                        <div className="font-light">
                          {auctionData.auction.location_type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:pentagon"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Művelési ág:
                        </div>
                        <div className="font-light">
                          {auctionData.auction.cultivation_type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:vector-pen"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Bejegyzett földhasználat:
                        </div>
                        <div className="font-light">
                          {auctionData.auction.registered_land_use}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="mingcute:auction-line"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Jogi jelleg:
                        </div>
                        <div className="font-light">
                          {auctionData.auction.juristic_classification}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:grid-1x2-fill"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Tulajdoni hányad:
                        </div>
                        <div className="font-light">
                          {auctionData.auction.ownership_fraction}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:arrows-move"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Beköltözhető:
                        </div>
                        <div className="font-light">
                          {auctionData.auction.can_move_in}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="bi:eye-fill"
                        className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                      />
                      <div className="w-2/3">
                        <div className="font-medium uppercase">
                          Megtekinthető:
                        </div>
                        <div className="font-light">
                          {auctionData.auction.viewable}
                        </div>
                      </div>
                    </div>
                  </section>
                </aside>
              </Collapsible>
            </section>
          </>
        )}
      </div>
      <div className="mb-8">
        <a
          className="flex mt-8 items-center justify-between p-4 mb-8 mx-6 text-sm font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:shadow-outline-teal"
          href="/"
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 lg:w-10 lg:h-10 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {/* SVG path */}
            </svg>
            <span>Vissza a listaoldalra</span>
          </div>
          <span>Keresés →</span>
        </a>
      </div>
      <div className="relative mt-32">
        <div
          className="absolute inset-0 h-20 bg-bottom bg-no-repeat bg-cover -top-20"
          style={{ backgroundImage: `url('/img/trees.png')` }}
        ></div>
      </div>
    </section>
  );
};

export default AuctionDetailsPage;
