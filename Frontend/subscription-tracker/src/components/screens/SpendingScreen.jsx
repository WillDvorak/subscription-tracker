import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CategoryTotalsTable from "../content/CategoryTotalsTable";
import SubscriptionBreakdownTable from "../content/SubscriptionBreakdownTable";
import { SubscriptionDataContext } from "../contexts/SubscriptionDataContext";
import "./SpendingScreen.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_PALETTE = [
    "#a78bfa", "#34d399", "#60a5fa", "#f59e0b",
    "#f87171", "#e879f9", "#2dd4bf", "#fb923c",
];

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

function buildChartData(subscriptions, mode = "monthly") {
    const totals = {};
    subscriptions.forEach((sub) => {
        const monthly = getMonthlyCost(sub);
        const value = mode === "yearly" ? monthly * 12 : monthly;
        const cat = (sub.category && sub.category.trim()) || "Uncategorized";
        totals[cat] = (totals[cat] || 0) + value;
    });

    const labels = Object.keys(totals);
    const data = Object.values(totals).map((v) => Number(v.toFixed(2)));
    const colors = labels.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]);

    return {
        labels,
        datasets: [{
            data,
            backgroundColor: colors.map((c) => c + "33"),
            borderColor: colors,
            borderWidth: 2,
        }],
    };
}

const chartOptions = {
    cutout: "68%",
    maintainAspectRatio: false,
    plugins: {
        // Legend is rendered as plain HTML below instead (see spending-chart-legend),
        // so an arbitrary number of categories never resizes/shifts the canvas itself.
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => `  $${ctx.raw.toFixed(2)}`,
            },
        },
    },
};

// Pulls {label, color} pairs out of a chart.js dataset so we can render
// our own legend markup instead of relying on the in-canvas legend plugin.
function getLegendItems(chartData) {
    return chartData.labels.map((label, i) => ({
        label,
        color: chartData.datasets[0].borderColor[i],
    }));
}



export default function SpendingScreen() {
    const [subscriptions] = useContext(SubscriptionDataContext);

    const { monthlyTotal, yearlyTotal, categoryTotals } = subscriptions.reduce(
        (acc, sub) => {
            const monthly = getMonthlyCost(sub);
            acc.monthlyTotal += monthly;
            acc.yearlyTotal += monthly * 12;
            const cat = (sub.category && sub.category.trim()) || "Uncategorized";
            if (!acc.categoryTotals[cat]) {
                acc.categoryTotals[cat] = { monthlyTotal: 0, yearlyTotal: 0 };
            }
            acc.categoryTotals[cat].monthlyTotal += monthly;
            acc.categoryTotals[cat].yearlyTotal += monthly * 12;
            return acc;
        },
        { monthlyTotal: 0, yearlyTotal: 0, categoryTotals: {} }
    );

    const categoryEntries = Object.entries(categoryTotals);
    const topCategory = categoryEntries.sort(
        (a, b) => b[1].monthlyTotal - a[1].monthlyTotal
    )[0]?.[0] ?? "—";

    const monthlyCategoryChartData = buildChartData(subscriptions, "monthly");
    const yearlyCategoryChartData = buildChartData(subscriptions, "yearly");

    return (
        <Container fluid>
            {/* Header */}
            <div className="page-header">
                <div className="page-eyebrow">Financial Overview</div>
                <div className="spending-title-row">
                    <h1 className="page-title">Spending Analysis</h1>
                    <div className="spending-burn">
                        <div className="spending-burn-label">Monthly Burn</div>
                        <div className="spending-burn-value">
                            ${monthlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>
                <p className="spending-desc">
                    Track where your money goes across all recurring charges.
                </p>

                <div className="spending-stats-row">
                    <div className="spending-stat-card">
                        <div className="spending-stat-label">Monthly Total</div>
                        <div className="spending-stat-value">
                            ${monthlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="spending-stat-card">
                        <div className="spending-stat-label">Annual Projection</div>
                        <div className="spending-stat-value">
                            ${yearlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="spending-stat-card">
                        <div className="spending-stat-label">Categories</div>
                        <div className="spending-stat-value">{categoryEntries.length}</div>
                    </div>
                    <div className="spending-stat-card">
                        <div className="spending-stat-label">Top Category</div>
                        <div className="spending-stat-value spending-stat-value--sm">{topCategory}</div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="spending-section-label">Spending by Category</div>
            <Row className="mb-4 g-3">
                <Col md={6}>
                    <div className="spending-chart-card">
                        <div className="spending-chart-title">Monthly</div>
                        <div className="spending-chart-legend">
                            {getLegendItems(monthlyCategoryChartData).map((item) => (
                                <div className="spending-legend-item" key={item.label}>
                                    <span className="spending-legend-swatch" style={{ "--legend-color": item.color }} />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                        <div className="spending-chart-wrap">
                            <Doughnut data={monthlyCategoryChartData} options={chartOptions} />
                            <div className="spending-chart-center">
                                <div className="spending-chart-center-value">
                                    ${monthlyTotal.toFixed(2)}
                                </div>
                                <div className="spending-chart-center-label">/ mo</div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="spending-chart-card">
                        <div className="spending-chart-title">Annual</div>
                        <div className="spending-chart-legend">
                            {getLegendItems(yearlyCategoryChartData).map((item) => (
                                <div className="spending-legend-item" key={item.label}>
                                    <span className="spending-legend-swatch" style={{ "--legend-color": item.color }} />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                        <div className="spending-chart-wrap">
                            <Doughnut data={yearlyCategoryChartData} options={chartOptions} />
                            <div className="spending-chart-center">
                                <div className="spending-chart-center-value">
                                    ${yearlyTotal.toFixed(2)}
                                </div>
                                <div className="spending-chart-center-label">/ yr</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Tables */}
            <div className="spending-section-label">Subscription Breakdown</div>
            <SubscriptionBreakdownTable
                subscriptions={subscriptions}
                getMonthlyCost={getMonthlyCost}
            />
            
            <div className="spending-section-label">Category Breakdown</div>
            <CategoryTotalsTable categoryEntries={categoryEntries} />

        </Container>
    );
}
