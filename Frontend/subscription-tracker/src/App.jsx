import { HashRouter, Route, Routes, Link } from 'react-router';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';

import './App.css';

import Home from './components/screens/Home';
import SubscriptionList from './components/screens/SubscriptionList';
import CalendarTab from './components/screens/CalendarTab';
import SpendingScreen from './components/screens/SpendingScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import Layout from './components/layout/Layout';

import { SubscriptionDataContext } from './components/contexts/SubscriptionDataContext';
import { AuthContext } from './components/contexts/AuthContext';


function App() {

  const [categories, setCategories] = useState([]);
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      priority: "Extreme",
      title: "Netflix",
      price: 15.99,
      renewCycle: "Monthly",
      renewDate: "2025-12-19",
      category: "Entertainment",
      color: "red",
      textColor: "white",
      imgUrl: "https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940"
    },
    {
      id: 2,
      priority: "Medium",
      title: "Spotify",
      price: 9.99,
      renewCycle: "Monthly",
      renewDate: "2025-12-23",
      category: "Music",
      color: "green",
      textColor: "white",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
    },
    {
      id: 3,
      priority: "Low",
      title: "Disney+",
      price: 7.99,
      renewCycle: "Monthly",
      renewDate: "2025-12-17",
      category: "Entertainment",
      color: "blue",
      textColor: "white",

      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg"
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
            <Route path="/calendar" element={<CalendarTab />} />
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
