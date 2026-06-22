import { useState, useContext, useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { SubscriptionDataContext } from '../contexts/SubscriptionDataContext';
import "./CalendarScreen.css";

const MAX_VISIBLE_PILLS = 3;
const MONTH_STEP = { Monthly: 1, Quarterly: 3, Biannually: 6, Yearly: 12 };

// Returns the day-of-month numbers (in the given year/month) on which
// this subscription renews, projecting forward/backward from renewDate
// using renewCycle (instead of only matching the literal renewDate).
function getOccurrenceDaysInMonth(sub, year, month, daysInMonth) {
    if (!sub.renewDate) return [];

    const [ay, amRaw, adRaw] = sub.renewDate.split("-").map(Number);
    const anchorMonth = amRaw - 1;
    const anchorDay = adRaw;

    if (sub.renewCycle === "Weekly") {
        const anchorUTC = Date.UTC(ay, anchorMonth, anchorDay);
        const days = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const cur = Date.UTC(year, month, d);
            const diffDays = Math.round((cur - anchorUTC) / 86400000);
            if (diffDays >= 0 && diffDays % 7 === 0) days.push(d);
        }
        return days;
    }

    const step = MONTH_STEP[sub.renewCycle];
    if (!step) {
        // "Other" / unknown cycle — treat as one-time, only on the literal renewDate
        return (year === ay && month === anchorMonth) ? [Math.min(anchorDay, daysInMonth)] : [];
    }

    const anchorTotalMonths = ay * 12 + anchorMonth;
    const targetTotalMonths = year * 12 + month;
    const diff = targetTotalMonths - anchorTotalMonths;
    if (diff < 0 || diff % step !== 0) return [];
    return [Math.min(anchorDay, daysInMonth)];
}

export default function CalendarScreen() {

    const [subscriptions] = useContext(SubscriptionDataContext);
    const navigate = useNavigate();

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    const monthName = new Date(year, month, 1).toLocaleString("en-US", { month: "long" });
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const today = new Date();

    function prevMonth() {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    }

    function nextMonth() {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    }

    // Map of day-of-month -> array of subscriptions renewing that day.
    // Inactive subscriptions don't renew anymore, so they're left off the calendar entirely.
    const occurrencesByDay = useMemo(() => {
        const map = {};
        for (let d = 1; d <= daysInMonth; d++) map[d] = [];
        subscriptions
            .filter((sub) => sub.active !== false)
            .forEach((sub) => {
                getOccurrenceDaysInMonth(sub, year, month, daysInMonth).forEach((d) => {
                    map[d].push(sub);
                });
            });
        return map;
    }, [subscriptions, year, month, daysInMonth]);

    const { monthTotal, monthCount } = useMemo(() => {
        let total = 0;
        let count = 0;
        Object.values(occurrencesByDay).forEach((subs) => {
            subs.forEach((sub) => {
                total += parseFloat(sub.price) || 0;
                count += 1;
            });
        });
        return { monthTotal: total, monthCount: count };
    }, [occurrencesByDay]);

    const isToday = (day) =>
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    // A renewal is "past" if its calendar date is strictly before today's date
    const isPastDay = (day) => {
        const cellDate = new Date(year, month, day);
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return cellDate < todayMidnight;
    };

    const renewalsOnDay = (day) => occurrencesByDay[day] || [];

    function openDayDetails(day) {
        if (renewalsOnDay(day).length === 0) return;
        setSelectedDay(day);
    }

    const selectedSubs = selectedDay ? renewalsOnDay(selectedDay) : [];
    const selectedDateLabel = selectedDay
        ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(year, month, selectedDay))
        : "";

    return (
        <>
            <div className="calendar-eyebrow">Track your payments</div>
            <div className="calendar-title">Calendar</div>

            {/* Month nav */}
            <div className="calendar-nav">
                <button className="calendar-nav-btn" onClick={prevMonth}>
                    <ArrowLeft />
                </button>
                <span className="calendar-month-label">{monthName} {year}</span>
                <button className="calendar-nav-btn" onClick={nextMonth}>
                    <ArrowRight />
                </button>

                <div className="calendar-month-summary">
                    <span className="calendar-month-summary-value">
                        ${monthTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="calendar-month-summary-label">
                        across {monthCount} {monthCount === 1 ? "renewal" : "renewals"} this month
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="calendar-grid">
                {daysOfWeek.map((day) => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}
                {cells.map((cell, i) => {
                    if (!cell) return <div key={i} className="calendar-cell calendar-cell--empty" />;

                    const subs = renewalsOnDay(cell);
                    const visible = subs.slice(0, MAX_VISIBLE_PILLS);
                    const overflowCount = subs.length - visible.length;
                    const past = isPastDay(cell);

                    return (
                        <div
                            key={i}
                            className={`calendar-cell ${isToday(cell) ? "calendar-cell--today" : ""} ${subs.length > 0 ? "calendar-cell--clickable" : ""}`}
                            onClick={() => openDayDetails(cell)}
                        >
                            <span className="calendar-cell-number">{cell}</span>
                            <div className={`calendar-cell-events ${past ? "calendar-cell-events--past" : ""}`}>
                                {visible.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="calendar-event-pill"
                                        style={{ "--pill-accent": sub.color || "var(--accent)" }}
                                        title={`${sub.title} — $${(parseFloat(sub.price) || 0).toFixed(2)}`}
                                    >
                                        <span className="calendar-event-dot" />
                                        <span className="calendar-event-title">{sub.title}</span>
                                        <span className="calendar-event-price">
                                            ${(parseFloat(sub.price) || 0).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                                {overflowCount > 0 && (
                                    <div className="calendar-event-more">+{overflowCount} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Day detail modal */}
            <Modal show={selectedDay !== null} onHide={() => setSelectedDay(null)} centered>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Renewing {selectedDateLabel}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="calendar-detail-list">
                        {selectedSubs.map((sub) => (
                            <div
                                key={sub.id}
                                className="calendar-detail-row"
                                onClick={() => navigate("/subscriptions")}
                            >
                                <span
                                    className="calendar-detail-swatch"
                                    style={{ backgroundColor: sub.color || "var(--accent)" }}
                                />
                                <div className="calendar-detail-info">
                                    <div className="calendar-detail-title">{sub.title}</div>
                                    <div className="calendar-detail-meta">
                                        {sub.category || "Uncategorized"} · {sub.renewCycle}
                                    </div>
                                </div>
                                <div className="calendar-detail-price">
                                    ${(parseFloat(sub.price) || 0).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
