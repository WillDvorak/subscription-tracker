import "../screens/SpendingScreen.css";

export default function CategoryTotalsTable({ categoryEntries }) {
    if (categoryEntries.length === 0) {
        return (
            <div className="spending-table-wrap">
                <p className="spending-empty">
                    No categories yet. Add subscriptions with categories to see this breakdown.
                </p>
            </div>
        );
    }

    return (
        <div className="spending-table-wrap">
            <table className="spending-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Monthly (est.)</th>
                        <th>Yearly (est.)</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryEntries.map(([name, totals]) => (
                        <tr key={name}>
                            <td>{name}</td>
                            <td>${totals.monthlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>${totals.yearlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
