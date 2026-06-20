import { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import "./SubscriptionInputForm.css";

/**
 * @param {object}  props.selectedSubscription  subscription object to edit
 * @param {func}    props.setSubscriptions       state setter from parent
 * @param {func}    props.setIsEditing           toggle edit mode off
 * @param {func}    props.onClose                close the modal
 */
// Converts any CSS color (named, rgb, hex) to a hex string for HexColorPicker
function toHex(color) {
    if (!color) return "#7c3aed";
    if (/^#[0-9a-f]{6}$/i.test(color)) return color;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function EditSubscriptionForm(props) {

    const sub = props.selectedSubscription || {};

    const [formData, setFormData] = useState({
        title: sub.title || "",
        renewCycle: sub.renewCycle || "Monthly",
        renewDate: sub.renewDate || "",
        category: sub.category || "",
        priority: sub.priority || "Medium",
        color: toHex(sub.color),
        imgUrl: sub.imgUrl || "",
    });

    const [priceInput, setPriceInput] = useState(sub.price?.toString() || "");

    // Sync form when a different subscription is selected
    useEffect(() => {
        setFormData({
            title: sub.title || "",
            renewCycle: sub.renewCycle || "Monthly",
            renewDate: sub.renewDate || "",
            category: sub.category || "",
            priority: sub.priority || "Medium",
            color: toHex(sub.color),
            imgUrl: sub.imgUrl || "",
        });
        setPriceInput(sub.price?.toString() || "");
    }, [props.selectedSubscription]);

    const priceRegex = /^\d*\.?\d{0,2}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e) => {
        const { value } = e.target;
        if (value === "" || priceRegex.test(value)) {
            setPriceInput(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPrice = priceInput === "" ? sub.price : parseFloat(priceInput).toFixed(2);

        props.setSubscriptions((prev) =>
            prev.map((s) =>
                s.id === sub.id
                    ? { ...s, ...formData, price: newPrice }
                    : s
            )
        );

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
                                <Form.Select name="renewCycle" value={formData.renewCycle} onChange={handleChange} required>
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
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Priority</Form.Label>
                                <Form.Select name="priority" value={formData.priority} onChange={handleChange}>
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
                                    onChange={(color) => setFormData((prev) => ({ ...prev, color }))}
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
                                <div className="img-url-preview">
                                    <img
                                        src={formData.imgUrl}
                                        alt="Preview"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                        onLoad={(e) => { e.target.style.display = "block"; }}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md={6}>
                            <Button type="submit" variant="success" style={{ width: "100%" }}>
                                Save Changes
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button
                                type="button"
                                variant="secondary"
                                style={{ width: "100%" }}
                                onClick={() => props.onClose?.()}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default EditSubscriptionForm;
