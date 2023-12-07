import React, { useEffect, useState, ChangeEvent } from "react";
import ListSearch from "../ListSearch";
import BuildingType from "../BuildingType";
import Status from "../Status";

interface TableHead {
  firstTh: string;
  secondTh: string;
  thirdTh: string;
  fourthTh: string;
  fifthTh: string;
  sixTh: string;
}

interface BuildingType {
  created_at: string;
  id: number;
  name: string;
}

interface Auction {
  id: number;
  address: string;
  auction_advance: number;
  starting_price: number;
  minimal_price: number;
  link_to_first_image: string;
  online_auction_strat_time: string;
  online_auction_planned_end_time: string;
  post_code: number;
  city: string;
  parcel_number: number;
  auction_type: string;
  bidding_ladder: number;
  building_types: BuildingType[];
}

const AuctionTableList: React.FC<TableHead> = (props: TableHead) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Új állapotváltozó a loading állapot követésére
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [query, setQuery] = useState("");
  const [selectedBuildingType, setSelectedBuildingType] =
    useState<string>("nincs");
  const [showOnlineAuctions, setShowOnlineAuctions] = useState(true);

  const page_size = 30;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch("https://auction-api-dev.mptrdev.com/auctions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filters: [
              {
                model: "Auction",
                field: "address",
                op: "like",
                value: "%" + query + "%",
              },
              {
                model: "BuildingType",
                field: "name",
                op: "like",
                value: "%" + selectedBuildingType + "%",
              },
            ],
            page_number: currentPage,
            page_size: page_size,
            total_count: "",
            sorts: [{ model: "Auction", field: "id", direction: "asc" }],
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
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
  }, [currentPage, query, selectedBuildingType]); // mount

  const handlePageChange = (newPage: number) => {
    // console.log('New Page:', newPage);

    setCurrentPage(newPage);
  };

  const searchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleBuildingTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setSelectedBuildingType(selectedType);
  };

  const handleOnlineChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowOnlineAuctions(event.target.checked);
  };

  const filteredAuctions = showOnlineAuctions
    ? auctions.filter((auction) => auction.auction_type === "online")
    : auctions;

  return (
    <div
      className={
        "results " + (loading ? "flex items-center justify-center py-20" : "")
      }
    >
      {loading ? ( // Loading állapot ellenőrzése
        <div
          className="w-12 h-12 rounded-full animate-spin absolute
          border-8 border-solid border-teal-700 border-t-transparent"
        ></div>
      ) : (
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
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
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Besorolás
                  </span>
                  <select className="primary-select">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                    <option>Option 4</option>
                    <option>Option 5</option>
                  </select>
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Beköltözhető
                  </span>
                  <select className="primary-select">
                    <option>Igen</option>
                    <option>Nem</option>
                  </select>
                </label>
                <Status name="online" onChange={handleOnlineChange} />
              </div>
            </div>
            <div className="relative w-full lg:mx-6 focus-within:text-teal-500">
              <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 h-full">
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Kikiáltási ár
                  </span>
                  <select className="primary-select">
                    <option>$1,000</option>
                    <option>$5,000</option>
                    <option>$10,000</option>
                    <option>$25,000</option>
                  </select>
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Aktuális ár
                  </span>
                  <select className="primary-select">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                    <option>Option 4</option>
                    <option>Option 5</option>
                  </select>
                </label>
                <label className="block mt-4 text-sm">
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
                </label>
              </div>
            </div>
          </div>
          <ListSearch
            placeholderValue="Gyorskeresés"
            value={query}
            onChange={searchValue}
          />
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">{props.firstTh}</th>
                  <th className="px-4 py-3">{props.secondTh}</th>
                  <th className="px-4 py-3">{props.thirdTh}</th>
                  <th className="px-4 py-3">{props.fourthTh}</th>
                  <th className="px-4 py-3">{props.fifthTh}</th>
                  <th className="px-4 py-3">{props.sixTh}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {filteredAuctions.map((auction) => (
                  <tr
                    key={auction.id}
                    className="text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-14 h-14 mr-3 rounded-full md:block">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src={
                              "http://127.0.0.1:3491/download_file?folder=Offline_auctions&file=" +
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
                          <p className="font-semibold">{auction.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{`${auction.starting_price.toLocaleString()} Ft`}</td>

                    <td className="px-4 py-3 text-sm">{`${auction.minimal_price.toLocaleString()} Ft`}</td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`px-2 py-1 font-semibold leading-tight  rounded-full dark:text-green-100 ${
                          auction.auction_type === "offline"
                            ? "bg-red-300 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {auction.auction_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {auction.bidding_ladder}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {auction.online_auction_planned_end_time}
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
