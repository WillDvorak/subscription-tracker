import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

/**
 * @param {object}  props.selectedSubsciption  subscription object to edit
 * @param {func}    props.setSubscriptions     state setter from parent
 * @param {func}    props.setIsEditing         toggle edit mode off
 */
function EditSubscriptionForm(props) {

    const selectedSubsciption = props.selectedSubsciption || {
        id: null,
        title: "",
        renewCycle: "",
        renewDate: "",
        price: 0.0,
        category: "",
        priority: "Medium",
        textColor: "#000000",
        color: "#ffffff",
    };

    const [formData, setFormData] = useState({
        title: selectedSubsciption.title,
        renewCycle: selectedSubsciption.renewCycle,
        renewDate: selectedSubsciption.renewDate,
        price: selectedSubsciption.price,
        category: selectedSubsciption.category,
        priority: selectedSubsciption.priority || "Medium",
        textColor: selectedSubsciption.textColor || "#000000",
        color: selectedSubsciption.color || "#ffffff",
    });

    const [priceInput, setPriceInput] = useState(
        selectedSubsciption.price?.toString() || ""
    );

    // Update form if a different subscription gets selected
    useEffect(() => {
        setFormData({
            title: selectedSubsciption.title,
            renewCycle: selectedSubsciption.renewCycle,
            renewDate: selectedSubsciption.renewDate,
            price: selectedSubsciption.price,
            category: selectedSubsciption.category,
            priority: selectedSubsciption.priority || "Medium",
            textColor: selectedSubsciption.textColor || "#000000",
            color: selectedSubsciption.color || "#ffffff",
        });
        setPriceInput(selectedSubsciption.price?.toString() || "");
    }, []);

    // digits, optional one dot, max 2 decimals
    const priceRegex = /^\d*\.?\d{0,2}$/;
    const handlePriceChange = (e) => {
        const { value } = e.target;

        if (value === "" || priceRegex.test(value)) {
            setPriceInput(value);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPrice =
            priceInput === "" ? formData.price : parseFloat(priceInput).toFixed(2);

        console.log("Submitting edit with data:", {
            ...formData,
            price: newPrice,
        });

        props.setSubscriptions((prev) =>
            prev.map((sub) =>
                sub.id === selectedSubsciption.id
                    ? {
                        ...sub,
                        title: formData.title,
                        renewCycle: formData.renewCycle,
                        renewDate: formData.renewDate,
                        price: newPrice,
                        category: formData.category,
                        priority: formData.priority,
                        textColor: formData.textColor,
                        color: formData.color,
                    }
                    : sub
            )
        );

        props.setIsEditing(false);
    };

    return (
        <Card>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Title */}
                    <Row>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Current Title: {selectedSubsciption.title}</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter new title"
                                onChange={handleChange}
                                value={formData.title}
                                required
                            />
                        </Form.Group>
                    </Row>

                    {/* Price */}
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Current Price: {selectedSubsciption.price}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    placeholder={selectedSubsciption.price}
                                    value={priceInput}
                                    onChange={handlePriceChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Renewal Cycle */}
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formRenewCycle">
                                <Form.Label>
                                    Current Renewal Cycle: {selectedSubsciption.renewCycle}
                                </Form.Label>
                                <Form.Select
                                    name="renewCycle"
                                    onChange={handleChange}
                                    value={formData.renewCycle}
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
                    </Row>

                    {/* Renewal Date */}
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formRenewDate">
                                <Form.Label>
                                    Current Renewal Date: {selectedSubsciption.renewDate}
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="renewDate"
                                    placeholder="e.g. Dec. 19"
                                    onChange={handleChange}
                                    value={formData.renewDate}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Category & Priority */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    placeholder="e.g. Entertainment"
                                    onChange={handleChange}
                                    value={formData.category}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formPriority">
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

                    {/* Colors */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Background Color</Form.Label>
                                <Form.Control
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Text Color</Form.Label>
                                <Form.Control
                                    type="color"
                                    name="textColor"
                                    value={formData.textColor}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Actions */}
                    <Row>
                        <Col xs={12} md={6} className="mb-2">
                            <Button
                                variant="success"
                                type="submit"
                                style={{ width: "100%" }}
                            >
                                Save Changes
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button
                                variant="danger"
                                style={{ width: "100%" }}
                                onClick={() => {
                                    props.setIsEditing(false)
                                    props.setIsCreating(true)
                                }
                                }
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
