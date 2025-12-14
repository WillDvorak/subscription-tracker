import { useState } from 'react';
import Calendar from 'react-calendar';

export default function CalendarTab() {
  const [value, onChange] = useState(new Date());

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto", color: "white", height: "100vh"}}>
            <h1>Subscription Calendar</h1>
            <p>
                Use the calendar below to view when your subscriptions are set to renew.
                Days with renewals will be highlighted in the future.
            </p>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}