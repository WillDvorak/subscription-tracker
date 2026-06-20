import "../screens/SpendingScreen.css";

export default function SubscriptionBreakdownTable({ subscriptions, getMonthlyCost }) {
    if (subscriptions.length === 0) {
        return (
            <div className="spending-table-wrap">
                <p className="spending-empty">
                    No subscriptions yet. Add some to see your spending breakdown.
                </p>
            </div>
        );
    }

    return (
        <div className="spending-table-wrap">
            <table className="spending-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Price</th>
                        <th>Cycle</th>
                        <th>Next Renewal</th>
                        <th>Monthly (est.)</th>
                        <th>Yearly (est.)</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((sub) => {
                        const monthly = getMonthlyCost(sub);
                        const yearly = monthly * 12;
                        const price = parseFloat(sub.price);
                        const cycle = sub.renewCycle || sub.renewCycleTime || "Unknown";

                        return (
                            <tr key={sub.id}>
                                <td>{sub.title}</td>
                                <td>{sub.category || "—"}</td>
                                <td>{sub.priority || "—"}</td>
                                <td>{isNaN(price) ? "—" : `$${price.toFixed(2)}`}</td>
                                <td>{cycle}</td>
                                <td>{sub.renewDate || "—"}</td>
                                <td>${monthly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>${yearly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
