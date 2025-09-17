import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const features = [
  { name: 'Market Price', route: '/market-prices', translationKey: 'feature_market_prices' },
  { name: 'Weather', route: '/weather', translationKey: 'feature_weather' },
  { name: 'AI-Based Crop Advisory', route: '/advisory', translationKey: 'feature_ai_advisory' },
  { name: 'Quick Tips', route: '/quick-tips', translationKey: 'feature_quick_tips' },
  { name: 'Marketplace', route: '/marketplace', translationKey: 'feature_marketplace' },
];

const DashboardPage = () => {
  const [farmer, setFarmer] = useState(null);
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();

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
      <div className="absolute top-4 right-4 flex gap-3 items-center">
        <div className="bg-white/80 rounded px-2 py-1 text-sm">
          <label className="mr-2 text-gray-700">{t('change_language')}:</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="en">{t('lang_en')}</option>
            <option value="hi">{t('lang_hi')}</option>
          </select>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaSignOutAlt /> {t('logout')}
        </button>
      </div>

      <div className="bg-white bg-opacity-80 max-w-4xl mx-auto mt-16 p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          👋 {t('welcome', { name: farmer?.name || '', location: farmer?.location || '' })}
        </h1>

        {/* In-card language switcher for better visibility */}
        <div className="flex justify-end items-center mb-4">
          <div className="bg-white/90 rounded px-3 py-2 text-sm border border-green-200">
            <label className="mr-2 text-gray-700">{t('change_language')}:</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="en">{t('lang_en')}</option>
              <option value="hi">{t('lang_hi')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              to={feature.route}
              key={feature.name}
              className="block bg-white bg-opacity-90 p-6 rounded shadow-lg border border-green-200 hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-green-700">{t(feature.translationKey)}</h2>
              <p className="text-sm text-gray-600 mt-2">Click to explore {feature.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
