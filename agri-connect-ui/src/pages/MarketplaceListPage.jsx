import React, { useEffect, useState } from 'react';
import { fetchListings, deleteListing } from '../services/api';
import { Link } from 'react-router-dom';

const MarketplaceListPage = () => {
  const [listings, setListings] = useState([]);
  const [showMyListings, setShowMyListings] = useState(false);
  const farmerPhone = JSON.parse(localStorage.getItem('farmer'))?.phone;

  useEffect(() => {
    fetchListings().then((res) => setListings(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteListing(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredListings = showMyListings
    ? listings.filter((item) => item.contact === farmerPhone)
    : listings;

  return (
    <div className="p-6 min-h-screen bg-green-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-800">🌿 Marketplace</h2>
        <div className="flex gap-2">
          <Link
            to="/create-listing"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Listing
          </Link>
          <button
            onClick={() => setShowMyListings((prev) => !prev)}
            className={`px-4 py-2 rounded ${
              showMyListings
                ? 'bg-gray-400 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {showMyListings ? 'All Listings' : 'My Listings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded shadow hover:shadow-md overflow-hidden relative transition-all"
          >
            {item.image && (
              <img
                src={
                  item.image.startsWith('http')
                    ? item.image
                    : `http://127.0.0.1:8000${item.image}`
                }
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="text-xl font-semibold text-green-800 mb-1">{item.title}</h3>
              <p className="text-gray-600 mb-1">{item.description?.slice(0, 80)}...</p>
              <p className="text-green-600 font-bold mb-1">₹{item.price}</p>
              <p className="text-sm text-gray-700">📍 {item.location}</p>
              <p className="text-sm text-gray-500">📞 {item.contact}</p>
              <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                {item.category}
              </span>

              <Link
                to={`/listing/${item.id}`}
                className="block mt-4 text-blue-600 font-semibold underline"
              >
                View Details
              </Link>

              {item.contact === farmerPhone && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <p className="text-center text-gray-600 mt-10">No listings found.</p>
      )}
    </div>
  );
};

export default MarketplaceListPage;
