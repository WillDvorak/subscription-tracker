// SubscriptionBreakdownTable.jsx
import { Card, Table } from "react-bootstrap";

/**
 * getMonthlyCost is passed in so this component doesn't need to re-define helpers.
 */
export default function SubscriptionBreakdownTable({
  subscriptions,
  getMonthlyCost,
}) {
  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">Subscription Breakdown</h5>
        {subscriptions.length === 0 ? (
          <p className="text-muted mb-0">
            You don&apos;t have any subscriptions yet. Add some to see your
            spending breakdown.
          </p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Price / Cycle</th>
                <th>Cycle</th>
                <th>Next Renewal</th>
                <th>Monthly Cost (est.)</th>
                <th>Yearly Cost (est.)</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => {
                const monthly = getMonthlyCost(sub);
                const yearly = monthly * 12;
                const cycle =
                  sub.renewCycle || sub.renewCycleTime || "Unknown";
                const price = parseFloat(sub.price);
                const displayPrice = isNaN(price)
                  ? "-"
                  : `$${price.toFixed(2)}`;

                return (
                  <tr key={sub.id}>
                    <td>{sub.title}</td>
                    <td>{sub.category || "-"}</td>
                    <td>{sub.priority || "-"}</td>
                    <td>{displayPrice}</td>
                    <td>{cycle}</td>
                    <td>{sub.renewDate || "-"}</td>
                    <td>${monthly.toFixed(2)}</td>
                    <td>${yearly.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}