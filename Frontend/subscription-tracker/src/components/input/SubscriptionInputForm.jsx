import { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import "./SubscriptionInputForm.css";


export default function SubscriptionInputForm(props) {

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const renewDateArr = formData.renewDate.split("-");


        console.log("Submitting form with data:", formData);

        props.setSubscriptions((prev) => [
            ...prev,
            {
                id: Date.now(),
                title: formData.title,
                renewCycle: formData.renewCycle,
                renewDate: formData.renewDate,
                price: parseFloat(priceInput).toFixed(2),
                color: formData.color,
                priority: formData.priority,
                category: formData.category,
                imgUrl: formData.imgUrl,
            },
        ]);

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
        props.onClose?.();
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
                    <Row>
                        <Col xs={12} md={6}>
                            <Button type="submit" variant="success" style={{ width: "100%" }}>
                                Add Subscription
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button
                                style={{ width: "100%" }}
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setFormData({
                                        title: "",
                                        renewCycle: "",
                                        renewDate: "",
                                        price: 0.00,
                                        category: "",
                                        priority: "Medium",
                                        color: "#ffffff"
                                    });
                                    setPriceInput("")
                                }}
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
