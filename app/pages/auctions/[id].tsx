import React from 'react';
import { useRouter } from 'next/router';

const AuctionDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Auction Details Page</h1>
      <p>ID: {id}</p>
    </div>
  );
};

export default AuctionDetails;
