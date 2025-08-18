import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const features = [
  { name: 'Market Price', route: '/market-prices' },
  { name: 'Weather', route: '/weather' },
  { name: 'AI-Based Crop Advisory', route: '/advisory' },
  { name: 'Quick Tips', route: '/quick-tips' },
  { name: 'Marketplace', route: '/marketplace' },
];

const DashboardPage = () => {
  const [farmer, setFarmer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('farmer');
    if (stored) {
      setFarmer(JSON.parse(stored));
    } else {
      navigate('/'); // redirect if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('farmer');
    localStorage.removeItem('farmerPhone');
    navigate('/');
  };

  return (
    <div
      className="min-h-screen bg-green-50 relative"
      style={{
        backgroundImage: `url("/farm-bg.gif")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <FaSignOutAlt /> Logout
      </button>

      <div className="bg-white bg-opacity-80 max-w-4xl mx-auto mt-16 p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          👋 Welcome {farmer?.name} from {farmer?.location}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              to={feature.route}
              key={feature.name}
              className="block bg-white bg-opacity-90 p-6 rounded shadow-lg border border-green-200 hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-green-700">{feature.name}</h2>
              <p className="text-sm text-gray-600 mt-2">Click to explore {feature.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
