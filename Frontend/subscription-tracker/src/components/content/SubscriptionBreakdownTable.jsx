import { useState } from "react";

import "../screens/SpendingScreen.css";

export default function SubscriptionBreakdownTable({ subscriptions, getMonthlyCost }) {

    const [sortField, setSortField] = useState("title");
    const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"
    const COLUMNS = [
    { label: "Title",          field: "title"      },
    { label: "Category",       field: "category"   },
    { label: "Priority",       field: "priority"   },
    { label: "Price",          field: "price"      },
    { label: "Cycle",          field: "renewCycle" },
    { label: "Next Renewal",   field: "renewDate"  },
    { label: "Monthly (Est.)", field: "monthly"    },
    { label: "Yearly (Est.)",  field: "yearly"     },
    ];

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

    const sortedSubs = subscriptions.slice().sort((a, b) => {
        let valA, valB;

        switch (sortField) {
            case "price":
                valA = parseFloat(a.price) || 0;
                valB = parseFloat(b.price) || 0;
                break;
            case "monthly":
                valA = getMonthlyCost(a);
                valB = getMonthlyCost(b);
                break;
            case "renewDate":
                valA = a.renewDate || "";
                valB = b.renewDate || "";
                break; // "YYYY-MM-DD" strings sort correctly with plain string comparison
            default: // title, category, priority, cycle — plain strings
                valA = (a[sortField] || "").toLowerCase();
                valB = (b[sortField] || "").toLowerCase();
        }

        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

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
                        {COLUMNS.map(({ label, field }) => (
                            <th key={field} className="sortable-th" onClick={() => handleSort(field)}>
                                {label}{arrow(field)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedSubs.map((sub) => {
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
