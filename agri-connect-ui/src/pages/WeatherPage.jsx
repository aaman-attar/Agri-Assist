import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = '0012b499ea158d52cd94850657755711'; // Replace with your actual API key

const WeatherPage = () => {
  const [location, setLocation] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const getBackgroundImage = (condition) => {
    if (!condition) return '/sunny.gif';
    const main = condition.toLowerCase();
    if (main.includes('rain')) return '/rain.gif';
    if (main.includes('cloud')) return '/cloudy.gif';
    if (main.includes('storm') || main.includes('thunder')) return '/storm.gif';
    return '/sunny.gif';
  };

  const fetchWeather = async (city) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setError('');
    } catch (err) {
      setError('City not found');
      setWeather(null);
    }
  };

  useEffect(() => {
    const farmer = JSON.parse(localStorage.getItem('farmer'));
    if (farmer?.location) {
      setLocation(farmer.location);
      fetchWeather(farmer.location);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity);
    }
  };

  const bgImage = getBackgroundImage(weather?.weather?.[0]?.main);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url("${bgImage}")` }}
    >
      <div className="max-w-md mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded shadow p-6 w-full">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center translatable">
          🌦️ Weather Report
        </h2>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city name"
            className="flex-1 border border-gray-300 p-2 rounded"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <span className="translatable">Search</span>
          </button>
        </form>

        {error && <p className="text-red-600 mb-4 text-center translatable">{error}</p>}

        {weather && (
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-semibold text-blue-900">
              📍 {weather.name}
            </h3>

            {/* Weather Icon */}
            {weather.weather[0].icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="mx-auto"
              />
            )}

            <div className="text-xl font-medium text-gray-800 translatable">
              {weather.weather[0].main} - {weather.weather[0].description}
            </div>

            <div className="flex justify-around text-gray-700 text-base mt-4">
              <div className="translatable">
                🌡️ <strong>{weather.main.temp}°C</strong><br />
                Feels like: {weather.main.feels_like}°C
              </div>
              <div className="translatable">
                💧 <strong>{weather.main.humidity}%</strong><br />
                Humidity
              </div>
              <div className="translatable">
                💨 <strong>{weather.wind.speed} m/s</strong><br />
                Wind Speed
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 translatable">
              🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}<br />
              🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
