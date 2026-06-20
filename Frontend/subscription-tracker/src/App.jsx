import { HashRouter, Route, Routes, Link } from 'react-router';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';

import './App.css';

import Home from './components/screens/Home';
import SubscriptionList from './components/screens/SubscriptionList';
import CalendarScreen from './components/screens/CalendarScreen';
import SpendingScreen from './components/screens/SpendingScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import Layout from './components/layout/Layout';

import { SubscriptionDataContext } from './components/contexts/SubscriptionDataContext';
import { AuthContext } from './components/contexts/AuthContext';


function App() {

  const [categories, setCategories] = useState([]);
  const [subscriptions, setSubscriptions] = useState([
  {
    "id": 1,
    "title": "Netflix",
    "price": 15.99,
    "renewCycle": "Monthly",
    "renewDate": "2026-06-15",
    "nextRenewalDate": "2026-07-15",
    "lastRenewalDate": "2026-06-15",
    "priority": "High",
    "active": true,
    "category": "Entertainment",
    "color": "#E50914",
    "textColor": "#FFFFFF",
    "imgUrl": "https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg",
    "createdAt": "2026-06-01T10:00:00.000000",
    "userId": 2
  },
  {
    "id": 2,
    "title": "Spotify",
    "price": 11.99,
    "renewCycle": "Monthly",
    "renewDate": "2026-06-01",
    "nextRenewalDate": "2026-07-01",
    "lastRenewalDate": "2026-06-01",
    "priority": "Medium",
    "active": true,
    "category": "Music",
    "color": "#1DB954",
    "textColor": "#000000",
    "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    "createdAt": "2026-06-01T10:05:00.000000",
    "userId": 2
  },
  {
    "id": 3,
    "title": "Adobe Creative Cloud",
    "price": 54.99,
    "renewCycle": "Monthly",
    "renewDate": "2026-06-20",
    "nextRenewalDate": "2026-07-20",
    "lastRenewalDate": "2026-06-20",
    "priority": "Extreme",
    "active": true,
    "category": "Software",
    "color": "#FF0000",
    "textColor": "#FFFFFF",
    "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg",
    "createdAt": "2026-06-01T10:10:00.000000",
    "userId": 2
  },
  {
    "id": 4,
    "title": "YouTube Premium",
    "price": 13.99,
    "renewCycle": "Monthly",
    "renewDate": "2026-06-10",
    "nextRenewalDate": "2026-07-10",
    "lastRenewalDate": "2026-06-10",
    "priority": "Low",
    "active": false,
    "category": "Entertainment",
    "color": "#FF0000",
    "textColor": "#FFFFFF",
    "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    "createdAt": "2026-06-01T10:15:00.000000",
    "userId": 2
  },
  {
    "id": 5,
    "title": "GitHub Pro",
    "price": 4.00,
    "renewCycle": "Monthly",
    "renewDate": "2026-06-28",
    "nextRenewalDate": "2026-07-28",
    "lastRenewalDate": "2026-06-28",
    "priority": "High",
    "active": true,
    "category": "Development",
    "color": "#6e40c9",
    "textColor": "#FFFFFF",
    "imgUrl": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
    "createdAt": "2026-06-01T10:20:00.000000",
    "userId": 2
  }
]);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token])

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
          </Route>
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
    </SubscriptionDataContext.Provider>
  </>);
}

export default App;
