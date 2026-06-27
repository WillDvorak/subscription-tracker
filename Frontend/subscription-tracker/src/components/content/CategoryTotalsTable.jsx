import { useState } from "react";
import "../screens/SpendingScreen.css";

export default function CategoryTotalsTable({ categoryEntries }) {
    const [sortField, setSortField] = useState("monthlyTotal");
    const [sortDir, setSortDir] = useState("desc");

    function handleSort(field) {
        if (field === sortField) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    }

    function arrow(field) {
        if (sortField !== field) return null;
        return <span className="sort-arrow">{sortDir === "asc" ? " ▲" : " ▼"}</span>;
    }

    if (categoryEntries.length === 0) {
        return (
            <div className="spending-table-wrap">
                <p className="spending-empty">
                    No categories yet. Add subscriptions with categories to see this breakdown.
                </p>
            </div>
        );
    }

    const sorted = categoryEntries.slice().sort((a, b) => {
        let valA, valB;
        switch (sortField) {
            case "monthlyTotal": valA = a[1].monthlyTotal; valB = b[1].monthlyTotal; break;
            case "yearlyTotal":  valA = a[1].yearlyTotal;  valB = b[1].yearlyTotal;  break;
            default:             valA = a[0].toLowerCase(); valB = b[0].toLowerCase();
        }
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div className="spending-table-wrap">
            <table className="spending-table">
                <thead>
                    <tr>
                        <th className="sortable-th" onClick={() => handleSort("name")}>
                            Category{arrow("name")}
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("monthlyTotal")}>
                            Monthly (est.){arrow("monthlyTotal")}
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("yearlyTotal")}>
                            Yearly (est.){arrow("yearlyTotal")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map(([name, totals]) => (
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
