import { useNavigate } from "react-router";
import { Container } from "react-bootstrap";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Container fluid>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
                <div style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem" }}>
                    Error 404
                </div>
                <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.25rem 0 1rem" }}>
                    Page Not Found
                </h1>
                <p style={{ color: "var(--text-secondary)", maxWidth: "400px", marginBottom: "2rem" }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        backgroundColor: "var(--accent)",
                        color: "white",
                        border: "none",
                        borderRadius: "var(--radius)",
                        padding: "0.7rem 1.5rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.95rem",
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        </Container>
    );
}
