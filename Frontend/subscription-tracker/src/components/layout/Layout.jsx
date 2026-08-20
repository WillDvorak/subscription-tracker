import { useContext, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { HouseDoor, ColumnsGap, CalendarEvent, GraphUp, GearFill, PlusCircle, BoxArrowInRight, BoxArrowLeft } from "react-bootstrap-icons";
import "./Layout.css";

import { AuthContext } from "../contexts/AuthContext";

export default function Layout() {

    const [token, setToken] = useContext(AuthContext);
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    function handleLogout() {
        setToken(null);
        setShowLogoutModal(false);
        navigate("/");
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
                    <button className="add-sub-btn" onClick={() => navigate("/subscriptions", { state: { openAdd: true } })}>
                        <PlusCircle className="nav-icon"/> Add Subscription
                    </button>
                    <div className="sidebar-footer-links">
                        <NavLink to="/settings" className="nav-link-item">
                            <GearFill className="nav-icon"/> Settings
                        </NavLink>
                        {token ? (
                            <button className="nav-link-item logout-btn" onClick={() => setShowLogoutModal(true)}>
                                <BoxArrowLeft className="nav-icon"/>Sign Out
                            </button>
                        ) : (
                            <NavLink to="/login" className="nav-link-item">
                               <BoxArrowInRight className="nav-icon"/>Sign In
                            </NavLink>
                        )}
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>

            {showLogoutModal && (
                <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Sign out?</h2>
                        <p className="modal-body">You'll need to sign back in to access your subscriptions.</p>
                        <div className="modal-actions">
                            <button className="modal-btn modal-btn--cancel" onClick={() => setShowLogoutModal(false)}>
                                Cancel
                            </button>
                            <button className="modal-btn modal-btn--confirm" onClick={handleLogout}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}