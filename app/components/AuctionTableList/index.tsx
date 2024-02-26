import React, { useEffect, useState, ChangeEvent } from "react";
import ListSearch from "../ListSearch";
import BuildingType from "../BuildingType";
import Status from "../Status";
import Classification from "../Classification";
import CanMoveIn from "../CanMoveIn";
import Link from "next/link";
import StartingPriceFilter from "../StartingPriceFilter";
import MinimalPriceFilter from "../MinimalPriceFilter";
import Collapsible from "react-collapsible";
import CountyCheckboxList from "../CountyCheckboxList";
import CurrentRound from "../CurrentRound";
import Pagination from "../Pagination";

interface TableHead {
  address: string;
  starting_price: string;
  minimal_price: string;
  auction_type: string;
  bidding_ladder: string;
  round_end_time: string;
  post_code_to_settlement: string;
  current_round: string;
  round_min_price: string;
  online_auction_planned_end_time: string;
  highest_bid: string;
  execution_number: string;
  scraped_at: string;
}

interface LocalBuildingType {
  created_at: string;
  id: number;
  name: string;
}

interface LastAuctionHistory {
  final_result: null | string;
  is_current: boolean;
  highest_bid: number | null;
}

interface Auction {
  last_auction_history: LastAuctionHistory;
  id: number;
  address: string;
  auction_advance: number;
  starting_price: number;
  minimal_price: number;
  link_to_first_image: string;
  online_auction_strat_time: string;
  online_auction_planned_end_time: string;
  city: string;
  parcel_number: number;
  auction_type: string;
  bidding_ladder: number;
  building_types: LocalBuildingType[];
  can_move_in: boolean;
  address_short: string;
  post_code_to_settlement: {
    post_code: string;
  };
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
  execution_number: string;
  scraped_at: string;
}

interface StartingPriceRange {
  min: number;
  max: number;
}

interface MinimalPriceRange {
  min: number;
  max: number;
}

const AuctionTableList: React.FC<TableHead> = (props: TableHead) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [query, setQuery] = useState("");
  const [executionNumberQuery, setExecutionNumberQuery] = useState("");
  const [selectedBuildingType, setSelectedBuildingType] = useState<string>("");
  const [selectedClassification, setSelectedClassification] =
    useState<string>("");
  const [auctionType, setAuctionType] = useState<string>("");
  const [canMoveIn, setCanMoveIn] = useState<boolean | null>(null);
  const [sortField, setSortField] = useState<string>(
    "online_auction_planned_end_time"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const page_size = 30;
  const [selectedStartingPrice, setSelectedStartingPrice] =
    useState<StartingPriceRange | null>(null);
  const [selectedMinimalPrice, setSelectedMinimalPrice] =
    useState<MinimalPriceRange | null>(null);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const filters = [];
        if (query)
          filters.push({
            field: "address_short",
            op: "like",
            value: "%" + query + "%",
          });
        if (executionNumberQuery)
          filters.push({
            field: "execution_number",
            op: "like",
            value: "%" + executionNumberQuery + "%",
          });
        if (selectedBuildingType)
          filters.push({
            field: "building_type_name",
            op: "like",
            value: "%" + selectedBuildingType + "%",
          });
        if (selectedClassification)
          filters.push({
            field: "classification",
            op: "like",
            value: "%" + selectedClassification + "%",
          });

        if (auctionType === "online") {
          filters.push({
            field: "auction_type",
            op: "==",
            value: "online",
          });
          filters.push({
            field: "final_result",
            op: "==",
            value: null,
          });
        } else if (auctionType === "finished") {
          filters.push({
            field: "auction_type",
            op: "==",
            value: "online",
          });
          filters.push({
            field: "final_result",
            op: "!=",
            value: null,
          });
        } else if (auctionType === "offline") {
          filters.push({
            field: "auction_type",
            op: "==",
            value: "offline",
          });
        }

        if (canMoveIn) {
          filters.push({
            field: "can_move_in",
            op: "==",
            value: canMoveIn,
          });
        }
        if (selectedStartingPrice) {
          filters.push({
            field: "starting_price",
            op: "<=",
            value: selectedStartingPrice.max,
          });
          filters.push({
            field: "starting_price",
            op: ">",
            value: selectedStartingPrice.min,
          });
        }
        if (selectedMinimalPrice) {
          filters.push({
            field: "minimal_price",
            op: "<=",
            value: selectedMinimalPrice.max,
          });
          filters.push({
            field: "minimal_price",
            op: ">",
            value: selectedMinimalPrice.min,
          });
        }
        if (selectedCounties.length > 0) {
          filters.push({
            field: "county_name",
            op: "in",
            value: selectedCounties,
          });
        }

        const now = new Date();

        // filters.push({
        //   field: "current_round",
        //   op: "like",
        //   value: "",
        // });

        if (currentRound === 1) {
          filters.push({
            field: "round_1_start_time",
            op: "<=",
            value: formatDate(now),
          });
          filters.push({
            field: "round_1_end_time",
            op: ">=",
            value: formatDate(now),
          });
        } else if (currentRound === 2) {
          filters.push({
            field: "round_2_start_time",
            op: "<=",
            value: formatDate(now),
          });
          filters.push({
            field: "round_2_end_time",
            op: ">=",
            value: formatDate(now),
          });
        } else if (currentRound === 3) {
          filters.push({
            field: "round_3_start_time",
            op: "<=",
            value: formatDate(now),
          });
          filters.push({
            field: "round_3_end_time",
            op: ">=",
            value: formatDate(now),
          });
        }

        const requestBody = {
          filters,
          page_number: currentPage,
          page_size,
          sorts: [{ field: sortField, direction: sortDirection }],
        };

        const response = await fetch(
          "https://auction-api-dev.mptrdev.com/auctions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();

        // const modifiedAuctions = data.auctions.map((auction: Auction) => {

        //   const roundEndTime = getRoundEndTime(auction);
        //   return { ...auction, roundEndTime };
        // });
        // setAuctions(modifiedAuctions);

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`
          );
        }

        console.log(data);

        if (isMounted) {
          const { auctions, total_count } = data || {
            auctions: [],
            total_count: 0,
          };

          if (Array.isArray(auctions)) {
            const totalPagesCount = Math.ceil(total_count / page_size); // Assuming page_size is 30
            setAuctions(auctions);
            setTotalPages(totalPagesCount);
            setLoading(false);

            // if (currentPage > totalPagesCount) {
            //   setCurrentPage(totalPagesCount || 1); // If totalPagesCount 0, then set 1
            // }
          } else {
            console.error("Invalid data format:", data);
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
        setLoading(false); // state update
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    query,
    executionNumberQuery,
    selectedBuildingType,
    selectedClassification,
    auctionType,
    canMoveIn,
    sortField,
    sortDirection,
    selectedStartingPrice,
    selectedMinimalPrice,
    selectedCounties,
    currentRound,
  ]); // mount

  const formatDate = (date: Date): string => {
    const pad = (num: number): string =>
      num < 10 ? `0${num}` : num.toString();
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
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

  const handleCountySelectionChange = (
    selectedCounty: string,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setSelectedCounties((prev) => [...prev, selectedCounty]);
    } else {
      setSelectedCounties((prev) =>
        prev.filter((county) => county !== selectedCounty)
      );
    }
  };

  const handleSortChange = (field: string) => {
    let sortKey = field;

    if (field === "round_end_time") {
      switch (currentRound) {
        case 1:
          sortKey = "round_1_end_time";
          break;
        case 2:
          sortKey = "round_2_end_time";
          break;
        case 3:
          sortKey = "round_3_end_time";
          break;
        default:
          console.error("Invalid round for sorting");
          return;
      }
    }

    if (sortField === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(sortKey);
      setSortDirection("asc");
    }
  };

  const handleStartingPriceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value) {
      const [min, max] = value.split("-").map(Number);
      setSelectedStartingPrice({ min, max });
    } else {
      setSelectedStartingPrice(null);
    }
  };

  const handleMinimalPriceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value) {
      const [min, max] = value.split("-").map(Number);
      setSelectedMinimalPrice({ min, max });
    } else {
      setSelectedMinimalPrice(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    // console.log('New Page:', newPage);
    setCurrentPage(newPage);
  };

  const searchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const searchExecutionNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setExecutionNumberQuery(event.target.value);
  };

  const handleCanMoveInChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setCanMoveIn(selectedValue === "true");
  };

  const handleAuctionTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedType = event.target.value;
    //console.log("Selected auction type:", selectedType); // Debugging line
    setAuctionType(selectedType);
  };

  const handleClassificationChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedClassification(event.target.value);
  };

  const handleBuildingTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const buildingType = event.target.value;
    setSelectedBuildingType(buildingType);

    if (!buildingType || buildingType.toLowerCase() === "nincs") {
      setSelectedClassification("");
    }
  };

  // const filteredAuctions = auctions.map((auction) => {
  //   let auctionStatus = "";

  //   if (auction.auction_type === "offline") {
  //     auctionStatus = "Folyamatos";
  //   } else {
  //     const lastAuctionHistory = auction.last_auction_history;

  //     if (lastAuctionHistory) {
  //       if (lastAuctionHistory.final_result === null) {
  //         auctionStatus = "Élő";
  //       } else {
  //         auctionStatus = "Befejezett";
  //       }
  //     }
  //   }

  //   return { ...auction, displayStatus: auctionStatus };
  // });

  const filteredAuctions = auctions
    // .filter((auction) => {
    //   // Ha az aukció típusa online és "Lejárt Aukció", akkor ne jelenjen meg
    //   if (
    //     auction.auction_type === "online" &&
    //     auction.current_round === "Lejárt aukció" || auction.auction_type === "online" &&
    //     auction.current_round === "El nem kezdődött aukció"
    //   ) {
    //     return false; // Kizárjuk a listából
    //   } else
    //   return true; // Minden más esetben megtartjuk a listában
    // })
    .map((auction) => {
      let auctionStatus = "";

      if (auction.auction_type === "offline") {
        auctionStatus = "Folyamatos";
      } else {
        const lastAuctionHistory = auction.last_auction_history;

        if (lastAuctionHistory && lastAuctionHistory.final_result === null) {
          auctionStatus = "Élő";
        } else {
          auctionStatus = "Befejezett";
        }
      }

      return { ...auction, displayStatus: auctionStatus };
    });

  const handleCurrentRoundChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const round = parseInt(event.target.value, 10);
    setCurrentRound(round);
    console.log("Selected round:", round);
  };

  const getRoundEndTime = (auction: Auction) => {
    if (currentRound === 1) return formatDateToHU(auction.round_1_end_time);
    if (currentRound === 2) return formatDateToHU(auction.round_2_end_time);
    if (currentRound === 3) return formatDateToHU(auction.round_3_end_time);
    return "";
  };

  const getRoundMinPrice = (auction: Auction) => {
    const formatPrice = (price: number) => {
      return price.toLocaleString() + " Ft";
    };

    if (
      auction.current_round === "Lejárt aukció" &&
      auction.last_auction_history.final_result === null
    ) {
      return "0";
    }

    switch (auction.current_round) {
      case "1":
        return formatPrice(auction.round_1_min_price);
      case "2":
        return formatPrice(auction.round_2_min_price);
      case "3":
        return formatPrice(auction.round_3_min_price);
      default:
        return formatPrice(parseInt("0"));
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
        name: "Nincs szakasz",
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
      return { name: "Törölve", class: "bg-red-200 text-red-800" };
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
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <Collapsible
            open
            triggerOpenedClassName="text-sm p-4 w-fit flex items-center font-semibold text-cyan-100 bg-cyan-700 rounded-lg shadow-md ml-5"
            triggerClassName="text-sm p-4 w-fit flex items-center font-semibold text-indigo-100 bg-indigo-700 rounded-lg shadow-md ml-5"
            trigger="Szűrők megjelenítése + "
            triggerWhenOpen="Szűrők bezárása - "
          >
            <div className="flex flex-col lg:flex-row justify-around lg:mr-5 py-6">
              <div className="relative w-full lg:mx-6 focus-within:text-teal-500">
                <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 h-full">
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Település
                    </span>
                    <ListSearch
                      placeholderValue="Keress település nevében"
                      value={query}
                      onChange={searchValue}
                    />
                  </label>
                  <BuildingType onChange={handleBuildingTypeChange} />
                  {/* Conditionally render Classification based on selectedBuildingType */}
                  {selectedBuildingType &&
                    selectedBuildingType.toLowerCase() !== "nincs" && (
                      <Classification onChange={handleClassificationChange} />
                    )}
                  <CanMoveIn
                    value={canMoveIn}
                    onChange={handleCanMoveInChange}
                  />
                  <Status
                    name="Minden árverés"
                    statusName="" // Represents the option to display all auctions
                    selected={auctionType}
                    onChange={handleAuctionTypeChange}
                  />
                  <Status
                    name="Élő árverés"
                    statusName="online" // Intended to request live online auctions from the server
                    selected={auctionType}
                    onChange={handleAuctionTypeChange}
                  />
                  <Status
                    name="Befejezett árverés"
                    statusName="finished" // Intended to request finished online auctions from the server
                    selected={auctionType}
                    onChange={handleAuctionTypeChange}
                  />
                  <Status
                    name="Folyamatos árverés"
                    statusName="offline" // Intended to request offline auctions from the server
                    selected={auctionType}
                    onChange={handleAuctionTypeChange}
                  />
                  <div className="mt-5">
                    <CurrentRound onChange={handleCurrentRoundChange} />
                  </div>
                  {/* {auctionType === "online" && (
                    <div className="mt-5">
                      <CurrentRound onChange={handleCurrentRoundChange} />
                    </div>
                  )} */}
                </div>
              </div>
              <div className="relative w-full lg:mx-6 focus-within:text-teal-500">
                <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 h-full">
                  <StartingPriceFilter onChange={handleStartingPriceChange} />
                  <MinimalPriceFilter onChange={handleMinimalPriceChange} />
                  <h1 className="text-xl font-bold mt-5">
                    Magyarországi vármegyék
                  </h1>
                  <CountyCheckboxList
                    selectedCounties={selectedCounties}
                    onCountySelectionChange={handleCountySelectionChange}
                  />
                </div>
              </div>
            </div>
          </Collapsible>
          <div className="flex justify-end flex-1">
            <ListSearch
              placeholderValue="Ügyszám kereső"
              value={executionNumberQuery}
              onChange={searchExecutionNumber}
            />
            <ListSearch
              placeholderValue="Település gyorskereső"
              value={query}
              onChange={searchValue}
            />
          </div>

          <div className="w-full overflow-x-auto relative overflow-auto h-screen max-h-96 lg:max-h-[84rem] rounded-lg scroller scrollbar-gutter-stable">
            {filteredAuctions.length > 0 ? (
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="table-head sticky top-0 z-20">
                    <th className="px-4 py-3 sticky top-0">
                      <span className="relative -top-[5px]">
                        {props.execution_number}
                      </span>
                      <button
                        title="Rendezés"
                        className="ml-2"
                        onClick={() => handleSortChange("execution_number")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#fff"
                            d="m6.288 4.293l-3.995 4l-.084.095a1 1 0 0 0 .084 1.32l.095.083a1 1 0 0 0 1.32-.084L6 7.41V19l.007.117a1 1 0 0 0 .993.884l.117-.007A1 1 0 0 0 8 19V7.417l2.293 2.29l.095.084a1 1 0 0 0 1.319-1.499l-4.006-4l-.094-.083a1 1 0 0 0-1.32.084M17 4.003l-.117.007a1 1 0 0 0-.883.993v11.58l-2.293-2.29l-.095-.084a1 1 0 0 0-1.319 1.498l4.004 4l.094.084a1 1 0 0 0 1.32-.084l3.996-4l.084-.095a1 1 0 0 0-.084-1.32l-.095-.083a1 1 0 0 0-1.32.084L18 16.587V5.003l-.007-.116A1 1 0 0 0 17 4.003"
                          />
                        </svg>
                      </button>
                    </th>
                    <th className="px-4 py-3 min-w-[100px] sticky top-0">{props.scraped_at}</th>
                    <th className="px-4 py-3 sticky top-0">
                      <span>{props.post_code_to_settlement}</span>
                    </th>
                    <th className="px-4 py-3 min-w-[265px] sticky top-0">
                      <span className="relative -top-[5px]">
                        {props.address}
                      </span>
                      <button
                        title="Rendezés"
                        className="ml-2"
                        onClick={() => handleSortChange("address_short")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#fff"
                            d="m6.288 4.293l-3.995 4l-.084.095a1 1 0 0 0 .084 1.32l.095.083a1 1 0 0 0 1.32-.084L6 7.41V19l.007.117a1 1 0 0 0 .993.884l.117-.007A1 1 0 0 0 8 19V7.417l2.293 2.29l.095.084a1 1 0 0 0 1.319-1.499l-4.006-4l-.094-.083a1 1 0 0 0-1.32.084M17 4.003l-.117.007a1 1 0 0 0-.883.993v11.58l-2.293-2.29l-.095-.084a1 1 0 0 0-1.319 1.498l4.004 4l.094.084a1 1 0 0 0 1.32-.084l3.996-4l.084-.095a1 1 0 0 0-.084-1.32l-.095-.083a1 1 0 0 0-1.32.084L18 16.587V5.003l-.007-.116A1 1 0 0 0 17 4.003"
                          />
                        </svg>
                      </button>
                    </th>
                    <th className="px-4 py-3 min-w-[160px] sticky top-0">
                      <span className="relative -top-[5px]">
                        {props.starting_price}
                      </span>
                      <button
                        title="Rendezés"
                        className="ml-2"
                        onClick={() => handleSortChange("starting_price")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#fff"
                            d="m6.288 4.293l-3.995 4l-.084.095a1 1 0 0 0 .084 1.32l.095.083a1 1 0 0 0 1.32-.084L6 7.41V19l.007.117a1 1 0 0 0 .993.884l.117-.007A1 1 0 0 0 8 19V7.417l2.293 2.29l.095.084a1 1 0 0 0 1.319-1.499l-4.006-4l-.094-.083a1 1 0 0 0-1.32.084M17 4.003l-.117.007a1 1 0 0 0-.883.993v11.58l-2.293-2.29l-.095-.084a1 1 0 0 0-1.319 1.498l4.004 4l.094.084a1 1 0 0 0 1.32-.084l3.996-4l.084-.095a1 1 0 0 0-.084-1.32l-.095-.083a1 1 0 0 0-1.32.084L18 16.587V5.003l-.007-.116A1 1 0 0 0 17 4.003"
                          />
                        </svg>
                      </button>
                    </th>
                    {[1, 2, 3].includes(currentRound) ? (
                      <>
                        <th className="px-4 py-3 min-w-[175px] sticky top-0">
                          <span className="relative -top-[5px]">
                            {props.round_min_price}
                          </span>

                          <button
                            title="Rendezés"
                            className="ml-2"
                            onClick={() =>
                              handleSortChange(
                                `round_${currentRound}_min_price`
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#fff"
                                d="m6.288 4.293l-3.995 4l-.084.095a1 1 0 0 0 .084 1.32l.095.083a1 1 0 0 0 1.32-.084L6 7.41V19l.007.117a1 1 0 0 0 .993.884l.117-.007A1 1 0 0 0 8 19V7.417l2.293 2.29l.095.084a1 1 0 0 0 1.319-1.499l-4.006-4l-.094-.083a1 1 0 0 0-1.32.084M17 4.003l-.117.007a1 1 0 0 0-.883.993v11.58l-2.293-2.29l-.095-.084a1 1 0 0 0-1.319 1.498l4.004 4l.094.084a1 1 0 0 0 1.32-.084l3.996-4l.084-.095a1 1 0 0 0-.084-1.32l-.095-.083a1 1 0 0 0-1.32.084L18 16.587V5.003l-.007-.116A1 1 0 0 0 17 4.003"
                              />
                            </svg>
                          </button>
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 min-w-[160px] sticky top-0">
                          {props.round_min_price}
                        </th>
                      </>
                    )}
                    <th className="px-4 py-3 min-w-[100px] sticky top-0">
                      <span>{props.auction_type}</span>
                    </th>
                    <th className="px-4 py-3 min-w-[160px] sticky top-0">
                      <span className="relative -top-[5px]">
                        {props.bidding_ladder}
                      </span>
                      <button
                        title="Rendezés"
                        className="ml-2"
                        onClick={() => handleSortChange("bidding_ladder")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#fff"
                            d="m6.288 4.293l-3.995 4l-.084.095a1 1 0 0 0 .084 1.32l.095.083a1 1 0 0 0 1.32-.084L6 7.41V19l.007.117a1 1 0 0 0 .993.884l.117-.007A1 1 0 0 0 8 19V7.417l2.293 2.29l.095.084a1 1 0 0 0 1.319-1.499l-4.006-4l-.094-.083a1 1 0 0 0-1.32.084M17 4.003l-.117.007a1 1 0 0 0-.883.993v11.58l-2.293-2.29l-.095-.084a1 1 0 0 0-1.319 1.498l4.004 4l.094.084a1 1 0 0 0 1.32-.084l3.996-4l.084-.095a1 1 0 0 0-.084-1.32l-.095-.083a1 1 0 0 0-1.32.084L18 16.587V5.003l-.007-.116A1 1 0 0 0 17 4.003"
                          />
                        </svg>
                      </button>
                    </th>
                    <th className="px-4 py-3 min-w-[160px] sticky top-0">
                      {props.highest_bid}
                    </th>
                    <th className="px-4 py-3 min-w-[160px] sticky top-0">
                      {props.current_round}
                    </th>
                    {[1, 2, 3].includes(currentRound) ? (
                      <>
                        <th className="px-4 py-3 min-w-[160px] sticky top-0">
                          <span className="relative -top-[5px]">
                            {props.round_end_time}
                          </span>
                          <button
                            title="Rendezés"
                            className="ml-2"
                            onClick={() => handleSortChange("round_end_time")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#fff"
                                d="m6.288 4.293l-3.995 4l-.084.095a1 1 0 0 0 .084 1.32l.095.083a1 1 0 0 0 1.32-.084L6 7.41V19l.007.117a1 1 0 0 0 .993.884l.117-.007A1 1 0 0 0 8 19V7.417l2.293 2.29l.095.084a1 1 0 0 0 1.319-1.499l-4.006-4l-.094-.083a1 1 0 0 0-1.32.084M17 4.003l-.117.007a1 1 0 0 0-.883.993v11.58l-2.293-2.29l-.095-.084a1 1 0 0 0-1.319 1.498l4.004 4l.094.084a1 1 0 0 0 1.32-.084l3.996-4l.084-.095a1 1 0 0 0-.084-1.32l-.095-.083a1 1 0 0 0-1.32.084L18 16.587V5.003l-.007-.116A1 1 0 0 0 17 4.003"
                              />
                            </svg>
                          </button>
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 min-w-[160px] sticky top-0">
                          <span className="relative -top-[5px]">
                            {props.online_auction_planned_end_time}
                          </span>
                          <button
                            title="Rendezés"
                            className="ml-2"
                            onClick={() =>
                              handleSortChange(
                                "online_auction_planned_end_time"
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#fff"
                                d="m6.288 4.293l-3.995 4l-.084.095a1 1 0 0 0 .084 1.32l.095.083a1 1 0 0 0 1.32-.084L6 7.41V19l.007.117a1 1 0 0 0 .993.884l.117-.007A1 1 0 0 0 8 19V7.417l2.293 2.29l.095.084a1 1 0 0 0 1.319-1.499l-4.006-4l-.094-.083a1 1 0 0 0-1.32.084M17 4.003l-.117.007a1 1 0 0 0-.883.993v11.58l-2.293-2.29l-.095-.084a1 1 0 0 0-1.319 1.498l4.004 4l.094.084a1 1 0 0 0 1.32-.084l3.996-4l.084-.095a1 1 0 0 0-.084-1.32l-.095-.083a1 1 0 0 0-1.32.084L18 16.587V5.003l-.007-.116A1 1 0 0 0 17 4.003"
                              />
                            </svg>
                          </button>
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  {filteredAuctions.map((auction) => (
                    <tr
                      key={auction.id}
                      className="text-gray-700 dark:text-gray-400"
                    >
                      <td className="px-4 py-3 text-sm">
                        <p className="font-semibold">
                          {auction.execution_number}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(auction.scraped_at).toLocaleString("hu-HU", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p className="font-semibold">
                          {auction.post_code_to_settlement.post_code}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href="/dashboard/auctions/[id]"
                          as={`/dashboard/auctions/${auction.id}`}
                          passHref
                        >
                          <div className="flex items-center text-sm">
                            <div className="relative hidden w-14 h-14 min-w-[50px] mr-3 rounded-full md:block">
                              <img
                                className="object-cover w-full h-full rounded-full"
                                src={
                                  "https://auction-api-dev.mptrdev.com/download_file?folder=" +
                                  (auction.auction_type === "online"
                                    ? "Online_auctions"
                                    : "Offline_auctions") +
                                  "&file=" +
                                  auction.link_to_first_image +
                                  "&download=0"
                                }
                                alt=""
                                loading="lazy"
                              />
                              <div
                                className="absolute inset-0 rounded-full shadow-inner"
                                aria-hidden="true"
                              ></div>
                            </div>
                            <div>
                              <p className="font-semibold">
                                {auction.address_short}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </td>

                      <td className="px-4 py-3 text-sm">{`${auction.starting_price.toLocaleString()} Ft`}</td>
                      {(auction.auction_type === "online" &&
                        auction.last_auction_history.final_result === null &&
                        [1, 2, 3].includes(currentRound)) ||
                      (auction.auction_type === "online" &&
                        auction.last_auction_history.final_result != null &&
                        [1, 2, 3].includes(currentRound)) ||
                      (auction.auction_type === "offline" &&
                        auction.last_auction_history.final_result != null &&
                        [1, 2, 3].includes(currentRound)) ? (
                        <>
                          <td className="">
                            <p
                              className={`px-2 py-1 font-semibold leading-tight rounded-full text-sm mt-3 w-fit ${
                                getRoundDisplay(
                                  getCurrentRoundForAuction(auction)
                                ).class
                              }`}
                            >
                              {getRoundMinPrice(auction)}
                            </p>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="">
                            <p
                              className={`px-2 py-1 font-semibold leading-tight rounded-full text-sm mt-3 w-fit ${
                                getRoundDisplay(
                                  getCurrentRoundForAuction(auction)
                                ).class
                              }`}
                            >
                              {getRoundMinPrice(auction)}
                            </p>
                          </td>
                        </>
                      )}

                      <td className="px-4 py-3 text-xs">
                        <span
                          className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                            auction.displayStatus === "Folyamatos"
                              ? "bg-blue-300 text-blue-700"
                              : auction.displayStatus === "Élő"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-300 text-red-700"
                          }`}
                        >
                          {auction.displayStatus}
                          {/* {JSON.stringify(auction)} */}
                        </span>
                        {canMoveIn && auction.auction_type !== "offline" && (
                          <span className="px-2 text-xs py-1 font-semibold leading-tight rounded-full dark:text-green-100 ml-2 bg-teal-600 text-white">
                            Beköltözhető
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="border-b border-blue-500 pb-2">
                          {`${auction.bidding_ladder.toLocaleString()} Ft`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {auction.last_auction_history &&
                        auction.last_auction_history.highest_bid ? (
                          <span className="text-teal-500 dark:text-teal-400 font-bold">
                            {auction.last_auction_history.highest_bid.toLocaleString()}{" "}
                            Ft
                          </span>
                        ) : (
                          <span className="text-red-500 dark:text-gray-400 font-bold">
                            0
                          </span>
                        )}
                      </td>

                      <td>
                        <p
                          className={`px-2 py-1 font-semibold leading-tight rounded-full text-sm mt-3 w-fit ${
                            getRoundDisplay(getCurrentRoundForAuction(auction))
                              .class
                          }`}
                        >
                          {
                            getRoundDisplay(getCurrentRoundForAuction(auction))
                              .name
                          }
                        </p>
                      </td>
                      {[1, 2, 3].includes(currentRound) ? (
                        <>
                          <td className="px-4 py-3 text-sm">
                            {getRoundEndTime(auction)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm">
                            {new Date(
                              auction.online_auction_planned_end_time
                            ).toLocaleString("hu-HU", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h3 className="pt-5 text-3xl font-bold text-center w-full">
                Nem található online árverés! Próbáld meg más keresési
                feltételekkel.
              </h3>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AuctionTableList;
