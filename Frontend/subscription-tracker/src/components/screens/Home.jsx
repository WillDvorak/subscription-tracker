import { Container, Row, Col } from "react-bootstrap";

export default function Home() {
    return (
        <Container>
            <div style={{ margin: "0 auto", padding: "2rem", color: "white", textAlign: "center" }}>
                <h1 style={{ fontSize: 150, backgroundColor: "purple", borderRadius: 12, textShadow: "blue" }}>SubTracker</h1>
            </div>
            <Row>
                <Col>
                    <p style={{ fontSize: 30, width: "80%", margin: "0 auto", marginBottom: 20, padding: 15, backgroundColor: "white" }}>
                        SubTracker helps you manage and track all your subscriptions in one place.
                        Stay on top of renewal dates, costs, and never miss a payment again!
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ul style={{ fontSize: 20, margin: "0 auto", textAlign: "center", width: "auto", listStyle: "none", fontWeight: "bold" }}>
                        <li>View and organize your active subscriptions</li>
                        <li>Track renewal cycles and upcoming charges</li>
                        <li>Analyze your monthly spending</li>
                        <li>Customize subscription priorities and categories</li>
                        <li>And much more!</li>
                    </ul>
                </Col>
            </Row>

        </Container>

    );
}