// SpendingScreen.jsx
import { Card, Row, Col, Container } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import CategoryTotalsTable from "../content/CategoryTotalsTable";
import SubscriptionBreakdownTable from "../content/SubscriptionBreakdownTable";

ChartJS.register(ArcElement, Tooltip, Legend);



export default function SpendingScreen({ subscriptions = [] }) {

  // Helper: normalize price to a monthly cost based on renew cycle
  function getMonthlyCost(sub) {
    const pricePerCycle = parseFloat(sub.price) || 0;
    const cycle = (sub.renewCycle || sub.renewCycleTime || "")
      .toLowerCase()
      .trim();

    switch (cycle) {
      case "weekly":
        // billed once per week → ~52 times per year → 52/12 per month
        return (pricePerCycle * 52) / 12;
      case "monthly":
        return pricePerCycle;
      case "quarterly":
        // once every 3 months
        return pricePerCycle / 3;
      case "biannually":
        // once every 6 months
        return pricePerCycle / 6;
      case "yearly":
        // once per year
        return pricePerCycle / 12;
      default:
        // "Other" or missing – treat as 0 for now
        return 0;
    }
  }

  // Helper: generate dynamic colors based on number of categories
  function generateCategoryColors(count) {
    const backgroundColor = [];
    const borderColor = [];

    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / Math.max(count, 1); // spread evenly around the color wheel

      // Softer fill
      backgroundColor.push(`hsla(${hue}, 70%, 55%, 0.2)`);
      // Stronger border
      borderColor.push(`hsla(${hue}, 70%, 45%, 1)`);
    }

    return { backgroundColor, borderColor };
  }

  // Helper: build chart.js doughnut data from subscriptions
  function buildCategoryChartData(subscriptions, mode = "monthly") {
    const categoryTotals = {};

    subscriptions.forEach((sub) => {
      const monthly = getMonthlyCost(sub);
      const value = mode === "yearly" ? monthly * 12 : monthly;
      const categoryName =
        (sub.category && sub.category.trim()) || "Uncategorized";

      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = 0;
      }
      categoryTotals[categoryName] += value;
    });

    const entries = Object.entries(categoryTotals); // [ [categoryName, total], ... ]
    const labels = entries.map(([name]) => name);
    const dataValues = entries.map(([, total]) => Number(total.toFixed(2)));

    const { backgroundColor, borderColor } = generateCategoryColors(
      labels.length
    );

    return {
      labels,
      datasets: [
        {
          label:
            mode === "yearly"
              ? "Yearly Spending by Category"
              : "Monthly Spending by Category",
          data: dataValues,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    };
  }


  // Aggregate totals + category totals
  const { monthlyTotal, yearlyTotal, categoryTotals } = subscriptions.reduce(
    (acc, sub) => {
      const monthly = getMonthlyCost(sub);
      const yearly = monthly * 12;

      acc.monthlyTotal += monthly;
      acc.yearlyTotal += yearly;

      const categoryName =
        (sub.category && sub.category.trim()) || "Uncategorized";

      if (!acc.categoryTotals[categoryName]) {
        acc.categoryTotals[categoryName] = {
          monthlyTotal: 0,
          yearlyTotal: 0,
        };
      }

      acc.categoryTotals[categoryName].monthlyTotal += monthly;
      acc.categoryTotals[categoryName].yearlyTotal += yearly;

      return acc;
    },
    {
      monthlyTotal: 0,
      yearlyTotal: 0,
      categoryTotals: {},
    }
  );

  const categoryEntries = Object.entries(categoryTotals);
  const monthlyCategoryChartData = buildCategoryChartData(
    subscriptions,
    "monthly"
  );
  const yearlyCategoryChartData = buildCategoryChartData(
    subscriptions,
    "yearly"
  );

  return (
    <Container>
      <h1 style={{ color: "white" }}>Overall Spending: </h1>

      {/* Overall totals summary + charts */}
      <Row>
        <Col md={6}>
          <Card style={{ alignItems: "center" }}>
            <h5>Estimated Monthly Spending</h5>
            <Doughnut
              data={monthlyCategoryChartData}
              style={{ maxHeight: 300, maxWidth: 300 }}
            />
            <h2>${monthlyTotal.toFixed(2)}</h2>
          </Card>
        </Col>

        <Col md={6}>
          <Card style={{ alignItems: "center", height: "100%" }}>
            <h5>Estimated Yearly Spending</h5>
            <Doughnut
              data={yearlyCategoryChartData}
              style={{ maxHeight: 300, maxWidth: 300 }}
            />
            <h2>${yearlyTotal.toFixed(2)}</h2>
          </Card>
        </Col>
      </Row>

      <p className="text-muted mb-0" style={{ marginTop: "0.5rem" }}>
        Based on each subscription&apos;s billed price and renewal cycle.
      </p>

      {/* Category totals table */}
      <CategoryTotalsTable categoryEntries={categoryEntries} />

      {/* Subscription breakdown table */}
      <SubscriptionBreakdownTable
        subscriptions={subscriptions}
        getMonthlyCost={getMonthlyCost}
      />
    </Container>
  );
}