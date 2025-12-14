import { Card, Table } from "react-bootstrap";

export default function CategoryTotalsTable({ categoryEntries }) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-3">Category Totals</h5>
        {categoryEntries.length === 0 ? (
          <p className="text-muted mb-0">
            No categories to show yet. Add subscriptions with categories to see
            this breakdown.
          </p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Category</th>
                <th>Monthly Total (est.)</th>
                <th>Yearly Total (est.)</th>
              </tr>
            </thead>
            <tbody>
              {categoryEntries.map(([categoryName, totals]) => (
                <tr key={categoryName}>
                  <td>{categoryName}</td>
                  <td>${totals.monthlyTotal.toFixed(2)}</td>
                  <td>${totals.yearlyTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
