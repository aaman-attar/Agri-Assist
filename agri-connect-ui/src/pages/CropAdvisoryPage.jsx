import React, { useState } from 'react';
import { predictCrop } from '../services/api';
import { FaThermometerHalf, FaCloudRain, FaSeedling, FaCalendarAlt } from 'react-icons/fa';

const CropAdvisoryPage = () => {
  const [form, setForm] = useState({
    soil_type: '',
    temperature: '',
    rainfall: '',
    season: '',
  });

  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      const res = await predictCrop(form);
      if (res.data && res.data.recommended_crop) {
        setResult(res.data.recommended_crop);
      } else {
        setError('Prediction failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || 'Prediction failed. Please check inputs.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center translatable">
          🌾 AI Crop Advisory
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex items-center gap-2">
            <FaSeedling className="text-green-700" />
            <select
              name="soil_type"
              value={form.soil_type}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded"
            >
              <option value="" className="translatable">Select Soil Type</option>
              <option value="Loamy" className="translatable">Loamy</option>
              <option value="Sandy" className="translatable">Sandy</option>
              <option value="Clayey" className="translatable">Clayey</option>
              <option value="Silty" className="translatable">Silty</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FaThermometerHalf className="text-red-600" />
            <input
              type="number"
              name="temperature"
              placeholder="Temperature (°C)"
              value={form.temperature}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaCloudRain className="text-blue-600" />
            <input
              type="number"
              name="rainfall"
              placeholder="Rainfall (mm)"
              value={form.rainfall}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            <select
              name="season"
              value={form.season}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded"
            >
              <option value="" className="translatable">Select Season</option>
              <option value="Kharif" className="translatable">Kharif</option>
              <option value="Rabi" className="translatable">Rabi</option>
              <option value="Zaid" className="translatable">Zaid</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
          >
            <span className="translatable">Get Advisory</span>
          </button>
        </form>

        {result && (
          <div className="mt-6 text-center">
            <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded shadow-md">
              <p className="text-green-800 text-lg">
                <span className="translatable">✅ Recommended Crop:</span> <span className="font-bold">{result}</span>
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-600 text-center mt-4 translatable">{error}</p>
        )}
      </div>
    </div>
  );
};

export default CropAdvisoryPage;
