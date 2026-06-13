import { useContext } from "react";
import { Outlet, NavLink } from "react-router";
import { HouseDoor, ColumnsGap, CalendarEvent, GraphUp, QuestionCircle, PlusCircle, BoxArrowInRight, BoxArrowLeft, BorderWidth } from "react-bootstrap-icons";
import "./Layout.css";

import { AuthContext } from "../contexts/AuthContext";

export default function Layout() {

    const [token, setToken] = useContext(AuthContext);

    function handleLogout() {
        setToken(null);
    }

    return (
        <div className="app-shell">
            {/* Nav Sidebar */}
            <aside className="sidebar">
                {/* logo/brand, nav links, add-subscription button, help/logout */}
                <div className="sidebar-brand">
                    <h1>Recurro</h1>
                    <span className="sidebar-tagline">Subscription Manager</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" className="nav-link-item">
                        <HouseDoor className="nav-icon"/> Home
                    </NavLink>
                    <NavLink to="/subscriptions" className="nav-link-item">
                        <ColumnsGap className="nav-icon"/>
                        {/* <BorderWidth className="nav-icon"/> */} Subscriptions
                    </NavLink>
                    <NavLink to="/calendar" className="nav-link-item">
                        <CalendarEvent className="nav-icon"/> Calendar
                    </NavLink>
                    <NavLink to="/spending" className="nav-link-item">
                        <GraphUp className="nav-icon"/> Finance
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="add-sub-btn">
                        <PlusCircle className="nav-icon"/> Add Subscription
                    </button>
                    <div className="sidebar-footer-links">
                        <NavLink to="/help" className="nav-link-item">
                            <QuestionCircle className="nav-icon"/> Help
                        </NavLink>
                        {token ? (
                            <button className="nav-link-item logout-btn" onClick={handleLogout}>
                                <BoxArrowLeft className="nav-icon"/>Logout
                            </button>
                        ) : (
                            <NavLink to="/login" className="nav-link-item">
                               <BoxArrowInRight className="nav-icon"/>Login
                            </NavLink>
                        )}
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}