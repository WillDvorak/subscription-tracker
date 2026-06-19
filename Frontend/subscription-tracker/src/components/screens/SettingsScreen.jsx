import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./SettingsScreen.css";

const SECTIONS = ["General", "Account", "Notifications"];

function SettingsRow({ label, description, children }) {
    return (
        <div className="settings-row">
            <div className="settings-row-info">
                <div className="settings-row-label">{label}</div>
                {description && <div className="settings-row-desc">{description}</div>}
            </div>
            <div className="settings-row-control">{children}</div>
        </div>
    );
}

function SettingsToggle({ checked, onChange }) {
    return (
        <button
            className={`settings-toggle ${checked ? "on" : "off"}`}
            onClick={() => onChange(!checked)}
            type="button"
        >
            <span className="settings-toggle-knob" />
        </button>
    );
}

export default function SettingsScreen() {
    const [activeSection, setActiveSection] = useState("General");

    // General
    // TODO: Currency — every hardcoded "$" symbol needs to be replaced with a currency formatter
    // utility that reads this value. Affected files: SubscriptionList.jsx, SpendingScreen.jsx,
    // Home.jsx, SubscriptionItemBar.jsx, CategoryTotalsTable.jsx, SubscriptionBreakdownTable.jsx.
    // Also affects toLocaleString locale (e.g. 'en-US' → 'en-GB' for GBP).
    const [currency, setCurrency] = useState("USD");

    // TODO: Date Format — renewDate is currently displayed as a raw YYYY-MM-DD string wherever
    // it appears. A shared formatDate(dateStr, format) utility needs to be created and used in
    // SubscriptionItemBar.jsx, SubscriptionBreakdownTable.jsx, and Home.jsx (renewal items).
    const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

    // TODO: Theme — CSS variables are currently hardcoded for dark mode in index.css.
    // Switching themes requires swapping the variable set (e.g. adding a [data-theme="light"]
    // block in index.css and toggling document.documentElement.dataset.theme when this changes).
    const [theme, setTheme] = useState("Dark");

    // TODO: Default Renewal Cycle — SubscriptionInputForm.jsx hardcodes renewCycle: "Monthly"
    // as the initial form state. This setting should be read from context/settings and used
    // as the default value there instead.
    const [defaultCycle, setDefaultCycle] = useState("Monthly");

    // Account
    // TODO: Display Name — currently hardcoded. Should be loaded from the backend user profile
    // (GET /api/user) on mount and saved back (PATCH /api/user) on change. Home.jsx could
    // greet the user by name once this is wired up.
    const [displayName, setDisplayName] = useState("William");

    // TODO: Email — same as display name, should come from the backend user profile.
    // Changing it requires re-verification flow on the backend.
    const [email, setEmail] = useState("realestpineapple@gmail.com");

    // Notifications
    // TODO: Renewal Alerts — needs a backend notification system (email or push).
    // The alertDaysBefore value also controls the "Renewing Soon" threshold in Home.jsx
    // (currently hardcoded to 7) and SubscriptionList.jsx (currently hardcoded to 48 hours).
    // Both should read from this setting once it's in a shared context or fetched from the API.
    const [renewalAlerts, setRenewalAlerts] = useState(true);
    const [alertDaysBefore, setAlertDaysBefore] = useState(7);

    // TODO: Weekly Digest — requires backend job (cron/scheduler) to send a summary email.
    // No frontend changes needed beyond passing the preference to the API.
    const [weeklyDigest, setWeeklyDigest] = useState(false);

    // TODO: Price Change Alerts — requires backend logic to detect price changes when
    // subscriptions are edited and trigger a notification if this is enabled.
    const [priceChangeAlerts, setPriceChangeAlerts] = useState(true);

    return (
        <Container fluid>
            <div className="settings-header">
                <div className="settings-eyebrow">Preferences</div>
                <h1 className="settings-title">Settings</h1>
                <p className="settings-desc">Manage your account, preferences, and notifications.</p>
            </div>

            <Row className="g-4">
                {/* Sidebar nav */}
                <Col lg={3}>
                    <div className="settings-sidenav">
                        {SECTIONS.map((section) => (
                            <button
                                key={section}
                                className={`settings-sidenav-item ${activeSection === section ? "active" : ""}`}
                                onClick={() => setActiveSection(section)}
                            >
                                {section}
                            </button>
                        ))}
                    </div>
                </Col>

                {/* Content */}
                <Col lg={9}>
                    {activeSection === "General" && (
                        <div className="settings-card">
                            <div className="settings-card-title">General</div>

                            <SettingsRow label="Currency" description="Used for all price displays.">
                                <select
                                    className="settings-select"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option value="USD">USD — $</option>
                                    <option value="EUR">EUR — €</option>
                                    <option value="GBP">GBP — £</option>
                                    <option value="CAD">CAD — C$</option>
                                    <option value="AUD">AUD — A$</option>
                                </select>
                            </SettingsRow>

                            <SettingsRow label="Date Format" description="How renewal dates are displayed.">
                                <select
                                    className="settings-select"
                                    value={dateFormat}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                >
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </SettingsRow>

                            <SettingsRow label="Default Renewal Cycle" description="Pre-selected cycle when adding a new subscription.">
                                <select
                                    className="settings-select"
                                    value={defaultCycle}
                                    onChange={(e) => setDefaultCycle(e.target.value)}
                                >
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Biannually">Biannually</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </SettingsRow>

                            <SettingsRow label="Theme" description="App appearance.">
                                <select
                                    className="settings-select"
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                >
                                    <option value="Dark">Dark</option>
                                    <option value="Light">Light (coming soon)</option>
                                    <option value="System">System</option>
                                </select>
                            </SettingsRow>
                        </div>
                    )}

                    {activeSection === "Account" && (
                        <div className="settings-card">
                            <div className="settings-card-title">Account</div>

                            <SettingsRow label="Display Name" description="Shown on your dashboard.">
                                <input
                                    className="settings-input"
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </SettingsRow>

                            <SettingsRow label="Email Address" description="Used for login and notifications.">
                                <input
                                    className="settings-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </SettingsRow>

                            <SettingsRow label="Password" description="Change your account password.">
                                <button className="settings-btn-secondary">Change Password</button>
                            </SettingsRow>

                            <div className="settings-divider" />

                            <SettingsRow label="Delete Account" description="Permanently delete your account and all data.">
                                <button className="settings-btn-danger">Delete Account</button>
                            </SettingsRow>
                        </div>
                    )}

                    {activeSection === "Notifications" && (
                        <div className="settings-card">
                            <div className="settings-card-title">Notifications</div>

                            <SettingsRow label="Renewal Alerts" description="Get notified before a subscription renews.">
                                <SettingsToggle checked={renewalAlerts} onChange={setRenewalAlerts} />
                            </SettingsRow>

                            {renewalAlerts && (
                                <SettingsRow label="Alert Days Before" description="How many days in advance to notify you.">
                                    <select
                                        className="settings-select"
                                        value={alertDaysBefore}
                                        onChange={(e) => setAlertDaysBefore(Number(e.target.value))}
                                    >
                                        <option value={1}>1 day</option>
                                        <option value={3}>3 days</option>
                                        <option value={7}>7 days</option>
                                        <option value={14}>14 days</option>
                                    </select>
                                </SettingsRow>
                            )}

                            <SettingsRow label="Weekly Digest" description="A summary of upcoming renewals every Monday.">
                                <SettingsToggle checked={weeklyDigest} onChange={setWeeklyDigest} />
                            </SettingsRow>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
