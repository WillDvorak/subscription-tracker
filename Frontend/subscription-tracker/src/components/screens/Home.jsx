import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { SubscriptionDataContext } from "../contexts/SubscriptionDataContext";
import "./Home.css";

function getMonthlyCost(sub) {
    const price = parseFloat(sub.price) || 0;
    const cycle = (sub.renewCycle || sub.renewCycleTime || "").toLowerCase().trim();
    switch (cycle) {
        case "weekly":     return (price * 52) / 12;
        case "monthly":    return price;
        case "quarterly":  return price / 3;
        case "biannually": return price / 6;
        case "yearly":     return price / 12;
        default:           return 0;
    }
}

function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Home() {
    const [subscriptions] = useContext(SubscriptionDataContext);
    const navigate = useNavigate();

    const monthlyBurn = subscriptions.reduce(
        (sum, sub) => sum + getMonthlyCost(sub), 0
    );
    const annualProjection = monthlyBurn * 12;

    const renewingSoon = subscriptions
        .map((sub) => ({ ...sub, days: daysUntil(sub.renewDate) }))
        .filter((sub) => sub.days !== null && sub.days >= 0 && sub.days <= 7)
        .sort((a, b) => a.days - b.days);

    const recentlyRenewed = subscriptions
        .map((sub) => ({ ...sub, days: daysUntil(sub.renewDate) }))
        .filter((sub) => sub.days !== null && sub.days < 0 && sub.days >= -7)
        .sort((a, b) => b.days - a.days);

    const categoryTotals = subscriptions.reduce((acc, sub) => {
        const cat = (sub.category && sub.category.trim()) || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + getMonthlyCost(sub);
        return acc;
    }, {});
    const topCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric"
    });

    return (
        <Container fluid>
            {/* Header */}
            <div className="home-header">
                <div className="home-eyebrow">{today}</div>
                <h1 className="home-title">Dashboard</h1>
                <p className="home-desc">Your subscription overview at a glance.</p>
            </div>

            {/* Stat cards */}
            <div className="home-stats-row">
                <div className="home-stat-card" onClick={() => navigate("/spending")} role="button">
                    <div className="home-stat-label">Monthly Burn</div>
                    <div className="home-stat-value accent">
                        ${monthlyBurn.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="home-stat-card" onClick={() => navigate("/subscriptions")} role="button">
                    <div className="home-stat-label">Tracked</div>
                    <div className="home-stat-value">
                        {subscriptions.length}
                        <span className="home-stat-suffix">subscriptions</span>
                    </div>
                </div>
                <div className="home-stat-card" onClick={() => navigate("/spending")} role="button">
                    <div className="home-stat-label">Annual Projection</div>
                    <div className="home-stat-value">
                        ${annualProjection.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="home-stat-card" onClick={() => navigate("/subscriptions")} role="button">
                    <div className="home-stat-label">Renewing Soon</div>
                    <div className="home-stat-value warn">
                        {renewingSoon.length}
                        <span className="home-stat-suffix">within 7 days</span>
                    </div>
                </div>
            </div>

            <Row className="g-3 mt-2">
                {/* Left column: Renewing Soon + Recently Renewed */}
                <Col lg={8}>
                    {/* Renewing Soon */}
                    <div className="home-widget">
                        <div className="home-widget-header">
                            <div className="home-widget-title">Renewing Soon</div>
                            <span className="home-widget-subtitle">Next 7 days</span>
                        </div>
                        {renewingSoon.length === 0 ? (
                            <p className="home-empty">Nothing renewing in the next 7 days.</p>
                        ) : (
                            renewingSoon.map((sub) => (
                                <div key={sub.id} className="home-renewal-item" style={{ "--item-accent": sub.color || "var(--accent)" }}>
                                    <div
                                        className="home-renewal-logo"
                                        style={{ backgroundColor: sub.color || "var(--accent)" }}
                                    >
                                        {sub.imgUrl
                                            ? <img src={sub.imgUrl} alt={sub.title} />
                                            : sub.title?.charAt(0).toUpperCase()
                                        }
                                    </div>
                                    <div className="home-renewal-info">
                                        <div className="home-renewal-title">{sub.title}</div>
                                        <div className="home-renewal-meta">{sub.category || "Uncategorized"}</div>
                                    </div>
                                    <div className="home-renewal-right">
                                        <div className="home-renewal-price">${parseFloat(sub.price).toFixed(2)}</div>
                                        <div className={`home-renewal-days ${sub.days === 0 ? "today" : sub.days <= 2 ? "urgent" : "soon"}`}>
                                            {sub.days === 0 ? "Today" : `in ${sub.days}d`}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Recently Renewed */}
                    <div className="home-widget mt-3">
                        <div className="home-widget-header">
                            <div className="home-widget-title">Recently Renewed</div>
                            <span className="home-widget-subtitle">Past 7 days</span>
                        </div>
                        {recentlyRenewed.length === 0 ? (
                            <p className="home-empty">No renewals in the past 7 days.</p>
                        ) : (
                            recentlyRenewed.map((sub) => (
                                <div key={sub.id} className="home-renewal-item" style={{ "--item-accent": sub.color || "var(--accent)" }}>
                                    <div
                                        className="home-renewal-logo"
                                        style={{ backgroundColor: sub.color || "var(--accent)" }}
                                    >
                                        {sub.imgUrl
                                            ? <img src={sub.imgUrl} alt={sub.title} />
                                            : sub.title?.charAt(0).toUpperCase()
                                        }
                                    </div>
                                    <div className="home-renewal-info">
                                        <div className="home-renewal-title">{sub.title}</div>
                                        <div className="home-renewal-meta">{sub.category || "Uncategorized"}</div>
                                    </div>
                                    <div className="home-renewal-right">
                                        <div className="home-renewal-price">${parseFloat(sub.price).toFixed(2)}</div>
                                        <div className="home-renewal-days renewed">
                                            {Math.abs(sub.days)}d ago
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Col>

                {/* Right column: Top Categories */}
                <Col lg={4}>
                    <div className="home-widget">
                        <div className="home-widget-header">
                            <div className="home-widget-title">Top Categories</div>
                            <span className="home-widget-subtitle">By monthly spend</span>
                        </div>
                        {topCategories.length === 0 ? (
                            <p className="home-empty">No categories yet.</p>
                        ) : (
                            <>
                                {topCategories.map(([name, total], i) => {
                                    const max = topCategories[0][1];
                                    const pct = Math.round((total / max) * 100);
                                    return (
                                        <div key={name} className="home-category-item">
                                            <div className="home-category-row">
                                                <span className="home-category-name">{name}</span>
                                                <span className="home-category-amount">
                                                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
                                                </span>
                                            </div>
                                            <div className="home-category-bar-track">
                                                <div
                                                    className="home-category-bar-fill"
                                                    style={{ width: `${pct}%`, opacity: 1 - i * 0.15 }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <div
                                    className="home-category-link"
                                    onClick={() => navigate("/spending")}
                                    role="button"
                                >
                                    View full breakdown →
                                </div>
                            </>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
