import React, { useEffect, useState } from 'react';
import { getQuickTips } from '../services/api';

const QuickTipsPage = () => {
  const [tips, setTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [dropdownCategory, setDropdownCategory] = useState('All');
  const [searchCategory, setSearchCategory] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'All',
    'Water',
    'Soil',
    'Irrigation',
    'Crop Management',
    'Seeds',
    'Crop Planning',
    'Weather',
    'Hygiene',
    'Pest Control',
    'Management',
    'Nursery',
    'Weed Control',
    'Plant Health',
    'Fertilizers',
    'Post-Harvest',
    'Market',
    'Safety',
    'Community',
  ];

  useEffect(() => {
    getQuickTips()
      .then((res) => {
        setTips(res.data);
        setFilteredTips(res.data);
      })
      .catch((err) => {
        console.error('Error fetching tips:', err);
        setError('Failed to fetch tips.');
      });
  }, []);

  const handleSearch = () => {
    const categoryToUse = searchCategory.trim()
      ? searchCategory.trim().toLowerCase()
      : dropdownCategory !== 'All'
      ? dropdownCategory.toLowerCase()
      : '';

    if (categoryToUse) {
      const filtered = tips.filter((tip) =>
        tip.category.toLowerCase().includes(categoryToUse)
      );
      setFilteredTips(filtered);
    } else {
      setFilteredTips(tips); // No filter, show all
    }
  };

  return (
    <div className="p-6 min-h-screen bg-green-50">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center translatable">🌿 Quick Farming Tips</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
        {/* Dropdown filter */}
        <select
          value={dropdownCategory}
          onChange={(e) => setDropdownCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat} className="translatable">
              {cat}
            </option>
          ))}
        </select>

        {/* Manual text filter */}
        <input
          type="text"
          placeholder="Or type category name"
          className="border p-2 rounded w-64"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <span className="translatable">Search</span>
        </button>
      </div>

      {error && <p className="text-red-600 text-center translatable">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTips.map((tip) => (
          <div key={tip.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong className="translatable">Category:</strong> {tip.category}
            </p>
            <p className="text-gray-700">{tip.content}</p>
          </div>
        ))}
        {filteredTips.length === 0 && (
          <p className="col-span-full text-center text-gray-600 translatable">No tips found.</p>
        )}
      </div>
    </div>
  );
};

export default QuickTipsPage;
