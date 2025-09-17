import React, { useEffect, useState } from 'react';
import { getListingDetail } from '../services/api';
import { useParams } from 'react-router-dom';

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

//   useEffect(() => {
//     getListingDetail(id).then(res => setListing(res.data));
//   }, [id]);

useEffect(() => {
  getListingDetail(id).then(res => {
    console.log("Image Path:", res.data.image); // ✅ Debug here
    setListing(res.data);
  });
}, [id]);


  if (!listing) return <div className="p-6 translatable">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto border rounded shadow">
      <h2 className="text-3xl font-bold mb-4 translatable">{listing.title}</h2>
    <p className="translatable">{`http://127.0.0.1:8000${listing.image}`}</p>
      {listing.image && (
        <img
  src={listing.image.startsWith('http') ? listing.image : `http://127.0.0.1:8000${listing.image}`}
  alt={listing.title}
  className="w-full max-h-64 object-cover mb-4 rounded"
/>

      )}

      <p className="text-gray-700 mb-2">{listing.description}</p>
      <p className="text-green-700 font-bold mb-2 text-lg">₹{listing.price}</p>

      <div className="mb-2">
        <strong className="translatable">Category:</strong> {listing.category}
      </div>
      <div className="mb-2">
        <strong className="translatable">Location:</strong> {listing.location}
      </div>
      <div className="mb-2">
        <strong className="translatable">Contact:</strong> {listing.contact}
      </div>

      <p className="text-sm text-gray-500">
        <span className="translatable">Posted on</span> {new Date(listing.date_posted).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ListingDetailPage;
