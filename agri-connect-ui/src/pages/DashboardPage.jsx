import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { translateBatch } from '../services/api';

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
  const [translatedLabels, setTranslatedLabels] = useState({ welcome: '', features: {} });
  const [currentLang, setCurrentLang] = useState('en');
  const [observer, setObserver] = useState(null);

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

  const buildWelcomeText = () =>
    `Welcome ${farmer?.name || ''} from ${farmer?.location || ''}`;

  const collectTranslatableElements = () => {
    return Array.from(document.querySelectorAll('.translatable'));
  };

  const getOriginalText = (el) => {
    if (!el.dataset.originalText) {
      el.dataset.originalText = el.textContent || '';
    }
    return el.dataset.originalText;
  };

  const translatePageTexts = async (target) => {
    const els = collectTranslatableElements();
    if (els.length === 0) return;

    const texts = els.map(getOriginalText);
    try {
      const res = await translateBatch(texts, target);
      const translations = Array.isArray(res?.data?.translations) ? res.data.translations : [];
      els.forEach((el, idx) => {
        const t = translations[idx];
        if (typeof t === 'string' && t.length > 0) {
          el.textContent = t;
        }
      });
    } catch (e) {
      console.error('Batch translate failed', e);
    }
  };

  const handleTranslate = async (target) => {
    setCurrentLang(target);
    // translate the page elements
    await translatePageTexts(target);
    // Also update local hint for existing fallback translations
    setLang(target);
  };

  useEffect(() => {
    // Set up MutationObserver to translate new elements dynamically
    const obs = new MutationObserver((mutations) => {
      const added = [];
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const el = node;
            if (el.classList && el.classList.contains('translatable')) {
              added.push(el);
            }
            el.querySelectorAll && added.push(...el.querySelectorAll('.translatable'));
          }
        });
      });
      if (added.length > 0) {
        // translate only newly added ones
        const texts = added.map(getOriginalText);
        translateBatch(texts, currentLang)
          .then((res) => {
            const translations = Array.isArray(res?.data?.translations) ? res.data.translations : [];
            added.forEach((el, idx) => {
              const t = translations[idx];
              if (typeof t === 'string' && t.length > 0) {
                el.textContent = t;
              }
            });
          })
          .catch((e) => console.error('Observer translate failed', e));
      }
    });

    obs.observe(document.body, { childList: true, subtree: true });
    setObserver(obs);
    return () => {
      try { obs.disconnect(); } catch {}
    };
  }, [currentLang]);

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
        <div className="bg-white/80 rounded px-2 py-1 text-sm flex items-center gap-2">
          <span className="text-gray-700 translatable">{t('change_language')}:</span>
          <select
            value={currentLang}
            onChange={(e) => handleTranslate(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="hi">Hindi</option>
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
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center translatable">
          👋 {translatedLabels.welcome || t('welcome', { name: farmer?.name || '', location: farmer?.location || '' })}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              to={feature.route}
              key={feature.name}
              className="block bg-white bg-opacity-90 p-6 rounded shadow-lg border border-green-200 hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-green-700 translatable">
                {translatedLabels.features[feature.name] || t(feature.translationKey)}
              </h2>
              <p className="text-sm text-gray-600 mt-2 translatable">Click to explore {feature.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
