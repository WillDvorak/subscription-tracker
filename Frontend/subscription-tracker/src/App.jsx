import { HashRouter, Route, Routes, Link } from 'react-router';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useContext } from 'react';

import './App.css';

import Home from './components/screens/Home';
import SubscriptionList from './components/screens/SubscriptionList';
import AboutMe from './components/screens/AboutMe';
import CalendarTab from './components/screens/CalendarTab';
import SpendingScreen from './components/screens/SpendingScreen';

import { SubscriptionDataContext } from './components/contexts/SubscriptionDataContext';


function App() {

  const [categories, setCategories] = useState([]);
  const [subscriptions, setSubscriptions] = useState([
        {
            id: 1,
            priority: "High",
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



  return (<>
    <SubscriptionDataContext.Provider value={[ subscriptions, setSubscriptions ]}>
    <HashRouter>
      {/* Primary navigation bar */}
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            SubTracker
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/subscriptions">
                Subscriptions
              </Nav.Link>
              <Nav.Link as={Link} to="/calendar">
                Calendar
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/about">
                About Me
              </Nav.Link> */}
              <Nav.Link as={Link} to="/spending">
                Finance
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscriptions" element={<SubscriptionList categories={categories} setCategories={setCategories}/>} />
        <Route path="/calendar" element={<CalendarTab />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path='/spending' element={<SpendingScreen subscriptions={subscriptions}/>} />
      </Routes>
    </HashRouter>
    </SubscriptionDataContext.Provider>
  </>);
}

export default App;
