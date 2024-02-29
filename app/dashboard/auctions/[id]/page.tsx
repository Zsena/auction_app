"use client";

import ImageSlider from "@/app/components/ImageSlider";
import { useEffect, useState } from "react";
import Collapsible from "react-collapsible";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";

interface LastAuctionHistory {
  id: number;
  final_price: number;
  final_result: null | string;
  is_current: boolean;
  highest_bid: number | null;
  scraped_at: string;
  number_of_bids: number;
}

interface Auction {
  address: string;
  auction_advance: number;
  last_auction_history: LastAuctionHistory;
  link_to_first_image: string;
  auction_type: string;
  execution_number: string;
  execution_company_id: string | number;
  description: string;
  minimal_price: string;
  starting_price: string;
  bidding_ladder: number;
  online_auction_start_time: string;
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
  biddings: Bidding[];
  round_1_min_price: number;
  round_2_min_price: number;
  round_3_min_price: number;
  round_2_discount: number;
  round_3_discount: number;
  round_1_start_time: string;
  round_1_end_time: string;
  round_2_start_time: string;
  round_2_end_time: string;
  round_3_start_time: string;
  round_3_end_time: string;
  current_round: any;
  scraped_at: string;
}

interface Bidding {
  auction_id: number;
  bid_amount: number;
  bid_date: string;
  created_at: string;
  id: number;
  is_current: boolean;
  is_final: boolean;
  nick_name: string;
  scraped_at: string;
  source_file_timestamp: string;
  valid: boolean | null;
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
  const [currentRound, setCurrentRound] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);

    handleResize();
    const auctionId = window.location.pathname.split("/").pop();

    fetchAuctionData(auctionId!)
      .then((data) => {
        setAuctionData(data);
        setLoading(false);
      })
      .catch((error: unknown) => {
        setLoading(false);
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentRound]);

  // determine the state of the auction
  const getAuctionStatus = () => {
    if (!auctionData || !auctionData.auction) return "N/A"; //If there is no data or the auction is not defined

    const lastAuctionHistory = auctionData.auction.last_auction_history;

    if (auctionData.auction.auction_type === "offline") {
      return "Folyamatos";
    } else {
      if (lastAuctionHistory && lastAuctionHistory.final_result === null) {
        return "Élő";
      } else {
        return "Befejezett";
      }
    }
  };

  const formatDateToHU = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getAuctionEndTimeStyled = (
    auction: Auction
  ): { endTime: string; styleClass: string } => {
    // Default: the scheduled end of the auction if there are no bids
    let currentRoundEndTime = auction.online_auction_planned_end_time;
    let roundEndText = "Tervezett vége"; // if there are no bids
    let styleClass =
      "w-fit text-xs bg-gray-200 text-gray-800 rounded-full text-center p-2"; // Default style if there are no bids

    if (auction.biddings.length > 0) {
      // If there are bids, we will decide according to the following logic
      const lastBid = auction.biddings[auction.biddings.length - 1];
      const lastBidDate = new Date(lastBid.bid_date);
      const round1EndDate = new Date(auction.round_1_end_time);
      const round2EndDate = new Date(auction.round_2_end_time);

      if (lastBidDate <= round1EndDate) {
        currentRoundEndTime = auction.round_2_end_time;
        roundEndText = "Első szakasz vége";
        styleClass =
          "w-fit text-xs bg-blue-200 text-blue-800 rounded-full text-center p-2";
      } else if (lastBidDate <= round2EndDate) {
        currentRoundEndTime = auction.round_3_end_time;
        roundEndText = "Második szakasz vége";
        styleClass =
          "w-fit text-xs bg-green-200 text-green-800 rounded-full text-center p-2";
      } else {
        // The third stage is over if the bids have passed the second stage
        roundEndText = "Harmadik szakasz vége";
        styleClass =
          "w-fit text-xs bg-indigo-200 text-indigo-800 rounded-full text-center p-2";
      }
    }

    return {
      endTime: `${formatDateToHU(currentRoundEndTime)} (${roundEndText})`,
      styleClass,
    };
  };

  const getRoundMinPrice = (auction: Auction) => {
    const formatPrice = (price: number) => {
      return price.toLocaleString() + " Ft";
    };

    if (
      auction.current_round === "Lejárt aukció" &&
      auction.last_auction_history.final_result === null
    ) {
      return formatPrice(0);
    }

    switch (auction.current_round) {
      case "1":
        return formatPrice(auction.round_1_min_price);
      case "2":
        return formatPrice(auction.round_2_min_price);
      case "3":
        return formatPrice(auction.round_3_min_price);
      default:
        return formatPrice(0);
    }
  };

  const getRoundDisplay = (currentRound: any) => {
    if (currentRound === "1") {
      const firstResult = {
        name: "Első szakasz",
        class: "bg-blue-200 text-blue-800",
      };
      return firstResult;
    } else if (currentRound === "2") {
      const secondResult = {
        name: "Második szakasz",
        class: "bg-green-200 text-green-800",
      };
      return secondResult;
    } else if (currentRound === "3") {
      const thirdResult = {
        name: "Harmadik szakasz",
        class: "bg-indigo-200 text-indigo-800",
      };
      return thirdResult;
    } else if (currentRound === null) {
      const nullResult = {
        name: "Folyamatos",
        class: "bg-gray-200 text-gray-800",
      };
      return nullResult;
    } else if (currentRound === "El nem kezdődött aukció") {
      const fouthResult = {
        name: "El nem kezdődött",
        class: "bg-gray-200 text-gray-800",
      };
      return fouthResult;
    } else {
      return { name: "Lejárt az idő", class: "bg-red-200 text-red-800" };
    }
  };

  const getCurrentRoundForAuction = (auction: Auction) => {
    const now = new Date();

    if (
      auction.round_1_start_time !== null &&
      new Date(auction.round_1_start_time) > now
    ) {
      return "El nem kezdődött aukció"; // Auction not started
    } else if (
      auction.round_1_start_time !== null &&
      auction.round_1_end_time !== null &&
      new Date(auction.round_1_start_time) <= now &&
      now <= new Date(auction.round_1_end_time)
    ) {
      return "1"; // Round 1
    } else if (
      auction.round_2_start_time !== null &&
      auction.round_2_end_time !== null &&
      new Date(auction.round_2_start_time) <= now &&
      now <= new Date(auction.round_2_end_time)
    ) {
      return "2"; // Round 2
    } else if (
      auction.round_3_start_time !== null &&
      auction.round_3_end_time !== null &&
      new Date(auction.round_3_start_time) <= now &&
      now <= new Date(auction.round_3_end_time)
    ) {
      return "3"; // Round 3
    } else if (
      auction.round_3_end_time !== null &&
      new Date(auction.round_3_end_time) < now
    ) {
      return "Lejárt aukció"; // Auction expired
    } else {
      return null; // Default case, if no other condition is met
    }
  };

  const downloadAsXLS = () => {
    const bids = auctionData?.auction.biddings?.length
      ? auctionData.auction.biddings.map((bid) => ({
          Érvényes: bid.valid === null ? "Igen" : "Nem",
          Álnév: bid.nick_name,
          Licit: bid.bid_amount,
          "Licit dátum": formatDateToHU(bid.bid_date),
        }))
      : [];

    // if bids not empty
    if (bids.length > 0) {
      const ws = XLSX.utils.json_to_sheet(bids);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Licitnapló");
      XLSX.writeFile(wb, "licitnaplo.xlsx");
    } else {
      console.log("Nincsenek licit adatok az exportáláshoz.");
    }
  };

  return (
    <div
      className={
        "results " + (loading ? "flex items-center justify-center py-20" : "")
      }
    >
      {loading ? (
        <div
          className="w-12 h-12 rounded-full animate-spin absolute
        border-8 border-solid border-teal-700 border-t-transparent"
        ></div>
      ) : (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
          <div className="container px-2 lg:px-6 mx-auto">
            {auctionData && (
              <>
                <section className="my-20">
                  <h1 className="text-3xl xl:text-5xl font-bold text-center text-gray-800 dark:text-white">
                    Ingatlan árverés
                  </h1>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
                      Cím: {auctionData.auction.address}
                    </h2>
                  </div>
                </section>
                <div className="flex flex-col justify-center items-start xl:items-stretch gap-8">
                  <section className="w-full image-container">
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
                  </section>
                  <section className="my-8 w-full">
                    <article className="border-2 border-gray-200 rounded-lg p-2 md:p-5 bg-white dark:bg-gray-800 shadow">
                      <h2 className="text-2xl mb-4 uppercase font-medium">
                        Ingatlan alap adatai
                      </h2>
                      <section className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-center space-x-3">
                          <Icon
                            icon="fluent:clipboard-number-123-16-regular"
                            className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                          />
                          <div className="w-2/3">
                            <div className="font-medium uppercase">
                              Végrehajtási ügyszám
                            </div>
                            <div className="font-light">
                              {auctionData.auction.execution_number}
                            </div>
                          </div>
                        </div>
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
                            icon="mdi:company"
                            className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                          />
                          <div className="w-2/3">
                            <div className="font-medium uppercase">
                              Végrehajtó cég száma:
                            </div>
                            <div className="font-light">
                              {auctionData.auction.execution_company_id}
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
                            <div className="font-medium uppercase">
                              Szakasz min. ár:
                            </div>
                            <div className="font-light">
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  getRoundDisplay(
                                    auctionData.auction.current_round
                                  ).class
                                }`}
                              >
                                {getRoundMinPrice(auctionData.auction)}
                              </span>
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
                            icon="icon-park-outline:database-forbid"
                            className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                          />
                          <div className="font-medium">
                            <div className="font-medium uppercase">
                              Eddigi licitek száma (db):
                            </div>
                            <div className="font-light">
                              <span className="text-teal-500 dark:text-teal-400 font-bold">
                                {auctionData.auction.last_auction_history
                                  .number_of_bids
                                  ? auctionData.auction.last_auction_history.number_of_bids.toLocaleString()
                                  : 0}{" "}
                                db
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Icon
                            icon="ri:auction-line"
                            className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                          />
                          <div className="font-medium">
                            <div className="font-medium uppercase">
                              Aukciós szakasz
                            </div>
                            <div className="font-light">
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  getRoundDisplay(
                                    getCurrentRoundForAuction(
                                      auctionData.auction
                                    )
                                  ).class
                                }`}
                              >
                                {
                                  getRoundDisplay(
                                    getCurrentRoundForAuction(
                                      auctionData.auction
                                    )
                                  ).name
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Icon
                            icon="ri:auction-line"
                            className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                          />
                          <div className="w-2/3">
                            <div className="font-medium uppercase">
                              Legmagasabb licit:
                            </div>
                            <div className="font-light">
                              {auctionData.auction.last_auction_history &&
                              auctionData.auction.last_auction_history
                                .highest_bid != null ? (
                                <span className="text-teal-500 dark:text-teal-400 font-bold">
                                  {auctionData.auction.last_auction_history.highest_bid.toLocaleString()}{" "}
                                  Ft
                                </span>
                              ) : (
                                <span className="text-red-500 dark:text-gray-400 font-bold">
                                  0 Ft
                                </span>
                              )}
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
                              Árverés kezdete:
                            </div>
                            <div className="font-light">
                              {auctionData.auction.online_auction_start_time
                                ? formatDateToHU(
                                    auctionData.auction
                                      .online_auction_start_time
                                  )
                                : "Nincs megadva"}
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
                              Árverés vége:
                            </div>
                            <div className="font-medium">
                              <p
                                className={
                                  getAuctionEndTimeStyled(auctionData.auction)
                                    .styleClass
                                }
                              >
                                {
                                  getAuctionEndTimeStyled(auctionData.auction)
                                    .endTime
                                }
                              </p>
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
                      </section>
                    </article>
                  </section>
                  <section className="w-full border-2 border-gray-200 rounded-lg p-2 md:p-5 bg-white dark:bg-gray-800 shadow">
                    <h2 className="text-2xl mb-4 uppercase font-medium">
                      Ingatlan ajánlati előzményei
                    </h2>
                    <section className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-center space-x-3">
                        <Icon
                          icon="ri:auction-line"
                          className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                        />
                        <div className="w-2/3">
                          <div className="font-medium uppercase">
                            Aukció típusa
                          </div>
                          <div className="font-light">{getAuctionStatus()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon
                          icon="ri:auction-fill"
                          className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                        />
                        <div className="w-2/3">
                          <div className="font-medium uppercase">
                            Nyertes licit
                          </div>
                          <div className="font-light">
                            {auctionData.auction.last_auction_history
                              .final_price
                              ? `${auctionData.auction.last_auction_history.final_price.toLocaleString()} Ft`
                              : "Nincs nyertes licit"}
                          </div>
                        </div>
                      </div>
                    </section>
                  </section>
                  {auctionData && (
                    <article className="border-2 border-gray-200 rounded-lg p-2 md:p-5 bg-white dark:bg-gray-800 shadow">
                      <h2 className="text-2xl mb-4 uppercase font-medium border-b pb-4">
                        Ingatlan leírása:
                      </h2>
                      <p className="text-gray-600 dark:text-white">
                        {auctionData.auction.description}
                      </p>
                    </article>
                  )}
                  <section className="w-full">
                    <Collapsible
                      open={isDesktop}
                      triggerOpenedClassName="text-sm p-4 w-fit flex items-center font-semibold text-cyan-100 bg-cyan-700 rounded-lg shadow-md mx-auto"
                      triggerClassName="text-sm p-4 w-fit flex items-center font-semibold text-indigo-100 bg-indigo-700 rounded-lg shadow-md mx-auto"
                      trigger="További adatok megjelenítése + "
                      triggerWhenOpen="További adatok bezárása - "
                    >
                      <aside className="w-full border-2 border-gray-200 rounded-lg p-2 md:p-5 bg-white dark:bg-gray-800 shadow my-8">
                        <h2 className="text-2xl mb-4 uppercase font-medium">
                          További adatok
                        </h2>
                        <section className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
                          <div className="flex items-center space-x-3">
                            <Icon
                              icon="bi:card-checklist"
                              className="w-5 h-5 lg:w-10 lg:h-10 text-red-400"
                            />
                            <div className="w-2/3">
                              <div className="font-medium uppercase">
                                Besorolás
                              </div>
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
                              <div className="font-medium uppercase">
                                Fekvés:
                              </div>
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
                  {auctionData?.auction.biddings &&
                    auctionData.auction.biddings.length > 0 && (
                      <>
                        <section className="w-full">
                          <Collapsible
                            open={isDesktop}
                            triggerOpenedClassName="text-sm p-4 w-fit flex items-center font-semibold text-cyan-100 bg-cyan-700 rounded-lg shadow-md mx-auto"
                            triggerClassName="text-sm p-4 w-fit flex items-center font-semibold text-indigo-100 bg-indigo-700 rounded-lg shadow-md mx-auto"
                            trigger="Licitnapló megjelenítése + "
                            triggerWhenOpen="Licitnapló bezárása - "
                          >
                            <section className="w-full border-2 border-gray-200 rounded-lg p-2 md:p-5 bg-white dark:bg-gray-800 shadow my-8">
                              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                                <h2 className="text-2xl uppercase font-medium">
                                  Licitnapló
                                </h2>
                                <button
                                  onClick={downloadAsXLS}
                                  className="primary-btn w-fit"
                                >
                                  Licitnapló letöltése XLS-ben
                                </button>
                              </div>
                              {auctionData?.auction.biddings.map(
                                (bid, index) => (
                                  <div
                                    key={index}
                                    className="grid gap-6 mt-8 md:grid-cols-4"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2/3">
                                        <div className="font-medium uppercase">
                                          Érvényes
                                        </div>
                                        <div className="font-light">
                                          {bid.valid === null ? "Igen" : "Nem"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2/3">
                                        <div className="font-medium uppercase">
                                          Álnév
                                        </div>
                                        <div className="font-light">
                                          {bid.nick_name}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2/3">
                                        <div className="font-medium uppercase">
                                          Licit
                                        </div>
                                        <div className="font-light">
                                          {" "}
                                          {bid.bid_amount.toLocaleString()} Ft
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2/3">
                                        <div className="font-medium uppercase">
                                          Licit dátuma
                                        </div>
                                        <div className="font-light">
                                          {" "}
                                          {formatDateToHU(bid.bid_date)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </section>
                          </Collapsible>
                        </section>
                      </>
                    )}
                </div>
              </>
            )}
          </div>
          <div className="mb-8">
            <a
              className="flex my-8 items-center justify-between p-4 mb-8 mx-6 text-sm font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:shadow-outline-teal"
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
        </div>
      )}
    </div>
  );
};

export default AuctionDetailsPage;
