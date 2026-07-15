import { useState, useContext } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import "./SubscriptionInputForm.css";
import { AuthContext } from "../contexts/AuthContext";
import { apiFetch } from "../../api/api";


export default function SubscriptionInputForm(props) {

    const [token] = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        renewCycle: "Monthly",
        renewDate: "",
        price: 0.00,
        category: "",
        priority: "Medium",
        color: "#ffffff",
        imgUrl: "",
    });

    const [priceInput, setPriceInput] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const priceRegex = /^\d*\.?\d{0,2}$/;
    // digits, optional one dot, max 2 decimals

    const handlePriceChange = (e) => {
        const { name, value } = e.target;


        // Allow empty string so user can clear the field
        if (value === "" || priceRegex.test(value)) {
            setPriceInput(value);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            renewCycle: "Monthly",
            renewDate: "",
            price: "",
            category: "",
            priority: "Medium",
            color: "#ffffff",
            imgUrl: "",
        });
        setPriceInput("");
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const payload = {
            title: formData.title,
            renewCycle: formData.renewCycle,
            renewDate: formData.renewDate,
            price: parseFloat(priceInput),
            priority: formData.priority,
            category: formData.category,
            color: formData.color,
            imgUrl: formData.imgUrl,
            active: true,
        };

        if (token) {
            // Logged in: persist to the API and use the server's response
            // (the server computes nextRenewalDate, lastRenewalDate, and assigns the real id)
            try {
                const created = await apiFetch("/api/subscriptions", { method: "POST", body: payload }, token);
                props.setSubscriptions((prev) => [...prev, created]);
                resetForm();
                props.onClose?.();
            } catch (err) {
                setError(err.message || "Failed to add subscription.");
            } finally {
                setSubmitting(false);
            }
        } else {
            // Guest: add locally with a temporary id
            props.setSubscriptions((prev) => [
                ...prev,
                { ...payload, id: Date.now(), nextRenewalDate: formData.renewDate, lastRenewalDate: null },
            ]);
            resetForm();
            props.onClose?.();
            setSubmitting(false);
        }
    };


    return (
        <Card className="mb-4 sub-form-card">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Wifi"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    placeholder="9.99"
                                    value={priceInput}
                                    onChange={handlePriceChange}
                                    required
                                />

                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Renewal Cycle</Form.Label>
                                <Form.Select
                                    name="renewCycle"
                                    value={formData.renewCycle}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Biannually">Biannually</option>
                                    <option value="Yearly">Yearly</option>
                                    <option value="Other">Other</option>
                                </Form.Select>

                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Renewal Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="renewDate"
                                    placeholder="e.g. Dec. 19"
                                    value={formData.renewDate}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    placeholder="e.g. Entertainment"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Priority</Form.Label>
                                <Form.Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Extreme">Extreme</option>


                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Accent Color{" "}
                                    <span
                                        className="color-swatch-preview"
                                        style={{ backgroundColor: formData.color }}
                                    />
                                </Form.Label>
                                <HexColorPicker
                                    className="accent-color-picker"
                                    color={formData.color}
                                    onChange={(color) =>
                                        setFormData((prev) => ({ ...prev, color }))
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="imgUrl"
                                    placeholder="https://..."
                                    value={formData.imgUrl}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {formData.imgUrl && (
                                <>
                                    <div className="img-url-preview">
                                        <img
                                            src={formData.imgUrl}
                                            alt="Preview"
                                            onError={(e) => { e.target.style.display = "none"; }}
                                            onLoad={(e) => { e.target.style.display = "block"; }}
                                        />
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                    {error && (
                        <div className="mb-3" style={{ color: "var(--color-danger, #e55)", fontSize: "0.875rem" }}>
                            {error}
                        </div>
                    )}
                    <Row>
                        <Col xs={12} md={6}>
                            <Button type="submit" variant="success" style={{ width: "100%" }} disabled={submitting}>
                                {submitting ? "Adding..." : "Add Subscription"}
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button
                                style={{ width: "100%" }}
                                type="button"
                                variant="secondary"
                                onClick={resetForm}
                            >
                                Clear
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}
