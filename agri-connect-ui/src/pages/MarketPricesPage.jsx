import React, { useEffect, useState } from "react";
import axios from "axios";

const MarketPricesPage = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/market-prices/")
      .then((res) => {
        setPrices(res.data);
        setFilteredPrices(res.data);
      })
      .catch((err) => {
        console.error("Error fetching market prices:", err);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = prices.filter((item) =>
      item.crop.toLowerCase().includes(query) ||
      item.market.toLowerCase().includes(query)
    );
    setFilteredPrices(filtered);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-2">
          🌾 Market Price Dashboard
        </h1>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Search by crop or market"
          className="w-full px-4 py-2 mb-6 rounded border border-green-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse shadow-md">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="px-4 py-3 border-b">Crop</th>
                <th className="px-4 py-3 border-b">Market</th>
                <th className="px-4 py-3 border-b">State</th>
                <th className="px-4 py-3 border-b">Price</th>
                <th className="px-4 py-3 border-b">Unit</th>
                <th className="px-4 py-3 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.length > 0 ? (
                filteredPrices.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-green-50"}
                  >
                    <td className="px-4 py-2 border">{item.crop}</td>
                    <td className="px-4 py-2 border">{item.market}</td>
                    <td className="px-4 py-2 border">
                      <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {item.state}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-green-700 font-semibold">
                      ₹{item.price}
                    </td>
                    <td className="px-4 py-2 border">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-600 py-6"
                  >
                    No matching results. Try a different crop or market.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketPricesPage;
