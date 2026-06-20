import { useState, useContext } from 'react';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import { SubscriptionDataContext } from '../contexts/SubscriptionDataContext';
import "./CalendarScreen.css";

export default function CalendarScreen() {

    const [subscriptions] = useContext(SubscriptionDataContext);

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

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

    const renewalsOnDay = (day) =>
        subscriptions.filter((sub) => {
            if (!sub.renewDate) return false;
            const d = new Date(sub.renewDate);
            return d.getUTCDate() === day &&
                d.getUTCMonth() === month &&
                d.getUTCFullYear() === year;
        });

    const isToday = (day) =>
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    return (
        <>
            <div className="calendar-eyebrow">Track your payment dates</div>
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
            </div>

            {/* Grid */}
            <div className="calendar-grid">
                {daysOfWeek.map((day) => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}
                {cells.map((cell, i) =>
                    cell ? (
                        <div key={i} className={`calendar-cell ${isToday(cell) ? "calendar-cell--today" : ""}`}>
                            <span className="calendar-cell-number">{cell}</span>
                            <div className="calendar-cell-dots">
                                {renewalsOnDay(cell).map((sub) => (
                                    <span
                                        key={sub.id}
                                        className="calendar-dot"
                                        style={{ backgroundColor: sub.color || "var(--accent)" }}
                                        title={sub.title}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div key={i} className="calendar-cell calendar-cell--empty" />
                    )
                )}
            </div>
        </>
    );
}
