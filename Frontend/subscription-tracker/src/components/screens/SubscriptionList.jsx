import { useState, useContext } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import SubscriptionItemBar from "../content/SubscriptionItemBar.jsx";
import SubscriptionInputForm from "../input/SubscriptionInputForm.jsx";
import EditSubscriptionForm from "../input/EditSubscriptionForm.jsx";
import "./SubscriptionList.css";

import { SubscriptionDataContext } from "../contexts/SubscriptionDataContext.js";

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

    const totalTracked = subscriptions.length;
    const monthlyBurn = subscriptions.reduce(
        (sum, sub) => sum + toMonthly(sub.price, sub.renewCycle || sub.renewCycleTime),
        0
    );
    const annualProjection = monthlyBurn * 12;

    const now = new Date();
    const renewingSoon = subscriptions.filter((sub) => {
        if (!sub.renewDate) return false;
        const renewDate = new Date(sub.renewDate);
        const diffMs = renewDate - now;
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours >= 0 && diffHours <= 48;
    }).length;

    return (
        <Container fluid>
            <div className="sub-list-header">
                <div className="sub-list-eyebrow">Portfolio Overview</div>
                <div className="sub-list-title-row">
                    <h1 className="sub-list-title">Subscriptions</h1>
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
                <h2>My Subscriptions</h2>
                <Button className="sub-add-btn" onClick={() => setShowAddForm(true)}>
                    <PlusCircle className="nav-icon" /> Add Subscription
                </Button>
            </div>

            <Row>
                <Col xs={12}>
                    {subscriptions && subscriptions.map((sub) => (
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
        </Container>
    );
}
