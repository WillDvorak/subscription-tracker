import { HashRouter, Route, Routes } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { apiFetch } from './api/api';

import './App.css';

import Home from './components/screens/Home';
import SubscriptionList from './components/screens/SubscriptionList';
import CalendarScreen from './components/screens/CalendarScreen';
import SpendingScreen from './components/screens/SpendingScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import Layout from './components/layout/Layout';
import LoginAndRegisterScreen from './components/screens/LoginAndRegisterScreen';

import NotFoundPage from './components/screens/404Page';

import { SubscriptionDataContext } from './components/contexts/SubscriptionDataContext';
import { AuthContext } from './components/contexts/AuthContext';

// Shown to first-time guests who have nothing in localStorage yet.
const SAMPLE_SUBSCRIPTIONS = [
  {
    id: 1, title: "Netflix", price: 15.99, renewCycle: "Monthly",
    renewDate: "2026-06-15", nextRenewalDate: "2026-07-15", lastRenewalDate: "2026-06-15",
    priority: "High", active: true, category: "Entertainment", color: "#E50914",
    imgUrl: "https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg",
  },
  {
    id: 2, title: "Spotify", price: 11.99, renewCycle: "Monthly",
    renewDate: "2026-06-01", nextRenewalDate: "2026-07-01", lastRenewalDate: "2026-06-01",
    priority: "Medium", active: true, category: "Music", color: "#1DB954",
    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  },
  {
    id: 3, title: "Adobe Creative Cloud", price: 54.99, renewCycle: "Monthly",
    renewDate: "2026-06-20", nextRenewalDate: "2026-07-20", lastRenewalDate: "2026-06-20",
    priority: "Extreme", active: true, category: "Software", color: "#FF0000",
    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg",
  },
  {
    id: 4, title: "YouTube Premium", price: 13.99, renewCycle: "Monthly",
    renewDate: "2026-06-10", nextRenewalDate: "2026-07-10", lastRenewalDate: "2026-06-10",
    priority: "Low", active: false, category: "Entertainment", color: "#FF0000",
    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
  },
  {
    id: 5, title: "GitHub Pro", price: 4.00, renewCycle: "Monthly",
    renewDate: "2026-06-28", nextRenewalDate: "2026-07-28", lastRenewalDate: "2026-06-28",
    priority: "High", active: true, category: "Development", color: "#6e40c9",
    imgUrl: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  },
];

function loadGuestSubs() {
  const saved = localStorage.getItem("subscriptions");
  return saved ? JSON.parse(saved) : SAMPLE_SUBSCRIPTIONS;
}

function App() {

  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Guests start from localStorage (or sample data); logged-in users start
  // empty and will be populated by the API once that's wired up.
  const [subscriptions, setSubscriptions] = useState(() =>
    token ? [] : loadGuestSubs()
  );

  // Persist token to localStorage.
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Save subscriptions to localStorage on every change, but only for guests.
  // Logged-in users' data lives in the backend, not the browser.
  useEffect(() => {
    if (!token) {
      localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    }
  }, [subscriptions, token]);

  // Fetch subscriptions from the API whenever we have a token.
  // Covers both: initial load (returning user with token in localStorage)
  // and login (token just changed from null to a value).
  useEffect(() => {
    if (!token) return;
    apiFetch("/api/subscriptions", {}, token)
      .then(setSubscriptions)
      .catch(() => setSubscriptions([])); // token may be expired — fail gracefully
  }, [token]);

  // Swap data source when the user logs out.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!token) {
      setSubscriptions(loadGuestSubs());
    }
  }, [token]);

  return (<>
    <SubscriptionDataContext.Provider value={[subscriptions, setSubscriptions]}>
    <AuthContext.Provider value={[token, setToken]}>
      <HashRouter>
        {/* Page content */}
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/subscriptions" element={<SubscriptionList categories={categories} setCategories={setCategories} />} />
            <Route path="/calendar" element={<CalendarScreen />} />
            <Route path='/spending' element={<SpendingScreen />} />
            <Route path='/settings' element={<SettingsScreen />} />
            <Route path='/login' element={<LoginAndRegisterScreen/>} />

            {/* 404, must be at bottom */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
    </SubscriptionDataContext.Provider>
  </>);
}

export default App;
