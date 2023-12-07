import React, { useEffect, useState, ChangeEvent } from "react";
import ListSearch from "../ListSearch";

interface TableHead {
  firstTh: string;
  secondTh: string;
  thirdTh: string;
  fourthTh: string;
  fifthTh: string;
  sixTh: string;
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
}

const AuctionTableList: React.FC<TableHead> = (props: TableHead) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Új állapotváltozó a loading állapot követésére
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [query, setQuery] = useState("")


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
            "filters": [
              {"model": "Auction", "field": "address", "op": "like", "value": "%" + query + "%"}
            ],
            page_number: currentPage,
            page_size: 10,
            sorts: [],
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        // console.log("Data received:", data);

        if (isMounted) {
          const auctionsArray = data || [];
          if (Array.isArray(auctionsArray)) {
            const totalPagesCount = 10;
            setAuctions(auctionsArray);
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
  }, [currentPage, query]); // mount

  const handlePageChange = (newPage: number) => {
    // console.log('New Page:', newPage);

    setCurrentPage(newPage);
  };

  const searchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

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
         <ListSearch placeholderValue="Gyorskeresés" value={query} onChange={searchValue} />
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
                {auctions.map((auction) => (
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
                              "https://auction-api-dev.mptrdev.com/download_file?folder=Offline_auctions&file=" +
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
                      <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
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
            <div className="flex justify-end mt-4">
              <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul className="inline-flex items-center">
                    <li>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-teal"
                        aria-label="Previous"
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
                    {/* Pagination */}
                    {Array.from({ length: totalPages }, (_, index) => (
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
                    ))}
                    <li>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-teal"
                        aria-label="Next"
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
                  </ul>
                </nav>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionTableList;
