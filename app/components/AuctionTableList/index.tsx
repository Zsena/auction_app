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

interface TableHead {
  address: string;
  starting_price: string;
  minimal_price: string;
  auction_type: string;
  bidding_ladder: string;
  online_auction_planned_end_time: string;
  post_code_to_settlement: string;
}

interface LocalBuildingType {
  created_at: string;
  id: number;
  name: string;
}

interface Auction {
  final_result: null;
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
  const [selectedBuildingType, setSelectedBuildingType] = useState<string>("");
  const [showOnlineAuctions, setShowOnlineAuctions] = useState(true);
  const [showOfflineAuctions, setShowOfflineAuctions] = useState(true);
  const [selectedClassification, setSelectedClassification] =
    useState<string>("");
  const [auctionType, setAuctionType] = useState<string>("");
  const [canMoveIn, setCanMoveIn] = useState<boolean | null>(null);
  const [sortField, setSortField] = useState<string>("address");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const page_size = 30;
  const [selectedStartingPrice, setSelectedStartingPrice] =
    useState<StartingPriceRange | null>(null);
  const [selectedMinimalPrice, setSelectedMinimalPrice] =
    useState<MinimalPriceRange | null>(null);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  useEffect(() => {
    let isMounted = true;

    // A sort logika hozzáadása
    const sorts = [
      { model: "Auction", field: sortField, direction: sortDirection },
    ];

    const fetchData = async () => {
      try {
        const filters = [];
        if (query)
          filters.push({
            field: "address_short",
            op: "like",
            value: "%" + query + "%",
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

        // const requestBody = {
        //   filters,
        //   page_number: currentPage,
        //   page_size,
        //   sorts: [{ field: sortField, direction: sortDirection }],
        // };

        // const response = await fetch(
        //   "https://auction-api-dev.mptrdev.com/auctions",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(requestBody),
        //   }
        // );

        // if (!response.ok) {
        //   throw new Error(
        //     `Network response was not ok: ${response.status} ${response.statusText}`
        //   );
        // }

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

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        //console.log(data);

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
        setLoading(false); // Állapot frissítése, ha hiba történik
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    query,
    selectedBuildingType,
    showOnlineAuctions,
    showOfflineAuctions,
    selectedClassification,
    auctionType,
    canMoveIn,
    sortField,
    sortDirection,
    selectedStartingPrice,
    selectedMinimalPrice,
    selectedCounties,
  ]); // mount

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
    // if (field === "post_code_to_settlement") {
    //   setAuctions(
    //     [...auctions].sort((a, b) => {
    //       // parse num
    //       const postCodeA = parseInt(a.post_code_to_settlement.post_code, 10);
    //       const postCodeB = parseInt(b.post_code_to_settlement.post_code, 10);

    //       // if number
    //       if (!isNaN(postCodeA) && !isNaN(postCodeB)) {
    //         return sortDirection === "asc"
    //           ? postCodeA - postCodeB
    //           : postCodeB - postCodeA;
    //       } else {
    //         return 0;
    //       }
    //     })
    //   );
    // } else {
    //   // base sorting
    //   if (sortField === field) {
    //     setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    //   } else {
    //     setSortField(field);
    //     setSortDirection("asc");
    //   }
    // }
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      //console.log(sortDirection);
    } else {
      setSortField(field);
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

  const handleCanMoveInChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setCanMoveIn(selectedValue === "true");
  };

  const handleAuctionTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedType = event.target.value;
    console.log("Selected auction type:", selectedType); // Debugging line
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

  const filteredAuctions = auctions.map((auction) => {
    let auctionStatus = "Folyamatos";

    if (auction.auction_type === "online") {
      auctionStatus = auction.final_result === null ? "Élő" : "Befejezett";
    }

    auctionStatus = JSON.stringify(auction);

    return { ...auction, displayStatus: auctionStatus };
  });

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
                      placeholderValue="Település"
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
                </div>
              </div>
              <div className="relative w-full lg:mx-6 focus-within:text-teal-500">
                <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 h-full">
                  <StartingPriceFilter onChange={handleStartingPriceChange} />
                  <MinimalPriceFilter onChange={handleMinimalPriceChange} />
                  {/* <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Lejárat
                    </span>
                    <select className="primary-select">
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                      <option>Option 4</option>
                      <option>Option 5</option>
                    </select>
                  </label> */}
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
              placeholderValue="Gyorskeresés"
              value={query}
              onChange={searchValue}
            />
          </div>

          <div className="w-full overflow-x-auto rounded-lg">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="table-head">
                  <th className="px-4 py-3 min-w-[160px]">
                    <span>{props.post_code_to_settlement}</span>
                    {/* <button
                      title="Rendezés"
                      className="ml-2"
                      onClick={() => handleSortChange('post_code_to_settlement')}
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
                    </button> */}
                  </th>

                  <th className="px-4 py-3 min-w-[160px]">
                    <span className="relative -top-[5px]">{props.address}</span>
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
                  <th className="px-4 py-3 min-w-[160px]">
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
                  <th className="px-4 py-3 min-w-[160px]">
                    <span className="relative -top-[5px]">
                      {props.minimal_price}
                    </span>
                    <button
                      title="Rendezés"
                      className="ml-2"
                      onClick={() => handleSortChange("minimal_price")}
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
                  <th className="px-4 py-3 min-w-[160px]">
                    <span>{props.auction_type}</span>
                  </th>
                  <th className="px-4 py-3 min-w-[160px]">
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
                  <th className="px-4 py-3 min-w-[160px]">
                    <span className="relative -top-[5px]">
                      {props.online_auction_planned_end_time}
                    </span>
                    <button
                      title="Rendezés"
                      className="ml-2"
                      onClick={() =>
                        handleSortChange("online_auction_planned_end_time")
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
                          <div className="relative hidden w-14 h-14 mr-3 rounded-full md:block">
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

                    <td className="px-4 py-3 text-sm">{`${auction.minimal_price.toLocaleString()} Ft`}</td>
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
                      </span>
                      
                      {canMoveIn && auction.auction_type !== "offline" && (
                        <span className="px-2 text-xs py-1 font-semibold leading-tight rounded-full dark:text-green-100 ml-2 bg-teal-600 text-white">
                          Beköltözhető
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {`${auction.bidding_ladder.toLocaleString()} Ft`}
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAuctions.length > 0 ? ( // Check if there are items to display
              <div className="flex justify-end mt-4">
                <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                      {/* left arrow */}
                      {currentPage > 1 && (
                        <li>
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-teal"
                          >
                            <svg
                              aria-hidden="true"
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                                fillRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </li>
                      )}

                      {/* Pagination */}
                      {Array.from({ length: totalPages }, (_, index) => {
                        // first page
                        if (index === 0) {
                          return (
                            <li key={index}>
                              <button
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-teal ${
                                  currentPage === index + 1
                                    ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700 rounded-md"
                                    : ""
                                }`}
                              >
                                {index + 1}
                              </button>
                            </li>
                          );
                        }
                        // first 3 page
                        else if (
                          currentPage <= 3 &&
                          (index + 1 <= 5 || index + 1 === totalPages)
                        ) {
                          return (
                            <li key={index}>
                              <button
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-teal ${
                                  currentPage === index + 1
                                    ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700 rounded-md"
                                    : ""
                                }`}
                              >
                                {index + 1}
                              </button>
                            </li>
                          );
                        }
                        // last 3 page
                        else if (
                          currentPage >= totalPages - 2 &&
                          (index + 1 >= totalPages - 4 || index === 0)
                        ) {
                          return (
                            <li key={index}>
                              <button
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-teal ${
                                  currentPage === index + 1
                                    ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700 rounded-md"
                                    : ""
                                }`}
                              >
                                {index + 1}
                              </button>
                            </li>
                          );
                        }
                        // current page and surrounding pages
                        else if (
                          index + 1 >= currentPage - 1 &&
                          index + 1 <= currentPage + 1
                        ) {
                          return (
                            <li key={index}>
                              <button
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-teal ${
                                  currentPage === index + 1
                                    ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700 rounded-md"
                                    : ""
                                }`}
                              >
                                {index + 1}
                              </button>
                            </li>
                          );
                        }
                        // last page
                        else if (index === totalPages - 1) {
                          return (
                            <li key={index}>
                              <button
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-teal ${
                                  currentPage === index + 1
                                    ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700 rounded-md"
                                    : ""
                                }`}
                              >
                                {index + 1}
                              </button>
                            </li>
                          );
                        }
                        // dots
                        else if (index === 1 || index === totalPages - 2) {
                          return (
                            <li key={index}>
                              <span className="px-3 py-1">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}

                      {/* right arrow */}
                      {currentPage < totalPages && (
                        <li>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-teal"
                          >
                            <svg
                              className="w-4 h-4 fill-current"
                              aria-hidden="true"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                                fillRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </span>
              </div>
            ) : (
              <h3 className="pt-5 text-3xl font-bold text-center w-full">
                Nem található online árverés! Próbáld meg más keresési
                feltételekkel.
              </h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionTableList;
