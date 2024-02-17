// Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
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
                          ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700"
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
                          ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700"
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
                          ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700"
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
                          ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700"
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
                          ? "text-white transition-colors duration-150 bg-teal-700 border border-r-0 border-teal-700"
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
  );
};

export default Pagination;
