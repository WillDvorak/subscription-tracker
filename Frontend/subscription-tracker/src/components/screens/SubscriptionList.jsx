import { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useLocation } from "react-router";
import { PlusCircle } from "react-bootstrap-icons";
import SubscriptionItemBar from "../content/SubscriptionItemBar.jsx";
import SubscriptionInputForm from "../input/SubscriptionInputForm.jsx";
import EditSubscriptionForm from "../input/EditSubscriptionForm.jsx";
import "./SubscriptionList.css";

import { SubscriptionDataContext } from "../contexts/SubscriptionDataContext.js";
import { getNextRenewalDate, daysUntil } from "../../utils/subscriptionUtils";

// Convert a price to its monthly equivalent based on renewal cycle
function toMonthly(price, renewCycle) {
    const value = parseFloat(price) || 0;
    switch (renewCycle) {
        case "Weekly":
            return value * 4.33;
        case "Quarterly":
            return value / 3;
        case "Biannually":
            return value / 6;
        case "Yearly":
            return value / 12;
        default:
            return value; // Monthly / Other
    }
}

/**
 *
 * @returns A screen that displays a list of subscriptions, and allows for adding, editing, and searching subscriptions.
 */

export default function SubscriptionList(props) {

    const [subscriptions, setSubscriptions] = useContext(SubscriptionDataContext)
    const [selectedSubscription, setSelectedSubscription] = useState({})

    const [isEditing, setIsEditing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all"); // "all" | "active" | "inactive"
    const [search, setSearch] = useState("");

    const location = useLocation();

    useEffect(() => {
        console.log("location state:", location.state);
        if (location.state?.openAdd) {
            setShowAddForm(true);
            // Clear the state so hitting back doesn't re-open it
            window.history.replaceState({}, "");
        }
    }, [location.state]);

    const activeSubs = subscriptions.filter((sub) => sub.active !== false);
    const totalTracked = activeSubs.length;
    const monthlyBurn = activeSubs.reduce(
        (sum, sub) => sum + toMonthly(sub.price, sub.renewCycle || sub.renewCycleTime),
        0
    );
    const annualProjection = monthlyBurn * 12;

    const renewingSoon = activeSubs.filter((sub) => {
        const days = daysUntil(getNextRenewalDate(sub.renewDate, sub.renewCycle));
        return days !== null && days >= 0 && days <= 2;
    }).length;

    

    return (
        <Container fluid>
            <div className="page-header">
                <div className="page-eyebrow">Portfolio Overview</div>
                <div className="sub-list-title-row">
                    <h1 className="page-title">Subscriptions</h1>
                    <div className="sub-list-burn">
                        <div className="sub-list-burn-label">Monthly Burn</div>
                        <div className="sub-list-burn-value">${monthlyBurn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>
                <p className="sub-list-desc">
                    Track every recurring charge with precision. You're tracking{" "}{totalTracked} {totalTracked === 1 ? "subscription" : "subscriptions"}.
                </p>

                <div className="sub-stats-row">
                    <div className="sub-stat-card">
                        <div className="sub-stat-label">Active Services</div>
                        <div className="sub-stat-value">
                            {totalTracked}
                            <span className="sub-stat-suffix">tracked</span>
                        </div>
                    </div>

                    <div className="sub-stat-card">
                        <div className="sub-stat-label">Renewing in 48h</div>
                        <div className="sub-stat-value">
                            <span className="warn">{renewingSoon}</span>
                            <span className="sub-stat-suffix">need attention</span>
                        </div>
                    </div>

                    <div className="sub-stat-card">
                        <div className="sub-stat-label">Annual Projection</div>
                        <div className="sub-stat-value">
                            ${annualProjection.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="sub-stat-suffix">per year</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sub-list-actions">
                <div className="sub-list-filter-btns">
                    {["all", "active", "inactive"].map((f) => (
                        <button
                            key={f}
                            className={`sub-filter-btn ${activeFilter === f ? "sub-filter-btn--active" : ""}`}
                            onClick={() => setActiveFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="sub-list-right-actions">
                    <input
                        className="sub-search-input"
                        type="text"
                        placeholder="Search subscriptions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button className="sub-add-btn" onClick={() => setShowAddForm(true)}>
                        <PlusCircle className="nav-icon" /> Add Subscription
                    </Button>
                </div>
            </div>

            <Row>
                <Col xs={12}>
                    {subscriptions.filter((sub) => {
                        if (activeFilter === "active" && sub.active === false) return false;
                        if (activeFilter === "inactive" && sub.active !== false) return false;
                        if (search.trim()) {
                            const q = search.toLowerCase();
                            return (
                                sub.title?.toLowerCase().includes(q) ||
                                sub.category?.toLowerCase().includes(q)
                            );
                        }
                        return true;
                    }).map((sub) => (
                        <SubscriptionItemBar
                            key={sub.id}
                            subInfo={sub}
                            setSubs={setSubscriptions}
                            setSelected={setSelectedSubscription}
                            setIsEditing={setIsEditing}
                            setIsCreating={setShowAddForm}
                        />
                    )) || <p>Loading...</p>}
                </Col>
            </Row>

            <Modal show={showAddForm} onHide={() => setShowAddForm(false)} centered>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Add Subscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SubscriptionInputForm
                        setSubscriptions={setSubscriptions}
                        onClose={() => setShowAddForm(false)}
                    />
                </Modal.Body>
            </Modal>

            <Modal show={isEditing} onHide={() => setIsEditing(false)} centered>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Edit Subscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditSubscriptionForm
                        selectedSubscription={selectedSubscription}
                        setSubscriptions={setSubscriptions}
                        onClose={() => setIsEditing(false)}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}
