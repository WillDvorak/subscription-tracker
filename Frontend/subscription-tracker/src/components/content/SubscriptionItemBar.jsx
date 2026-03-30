import { Card, Row, Col, Button } from "react-bootstrap";
import { memo, useState } from "react";

/**
 * 
 * @param {object} props.subInfo -> Object containing: title, price, category, 
 *                                      priority, renewCycle, renewDate, textColor, bgColor
 * @param {CallbackFunction} props.setSubs -> setSubscriptionsStateVariable
 * @param {CallbackFunction} props.setIsCreating
 * 
 * @returns A formatted bar of subscription information
 *  that will get organized by the subscription list
 */
function SubscriptionItemBar(props) {


    const [viewingMore, setViewingMore] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card
            onClick={() => {
                setViewingMore(!viewingMore);
            }}
            className="subItem"
            style={{
                backgroundColor: props.subInfo.color,
                minWidth: "40vw",
                marginBottom: 8,
                maxWidth: "100%",
                borderColor: "black",
                borderWidth: 4,
                borderRadius: 12,
            }}
        >
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs lg="2" style={{display: "flex", justifyContent:"center"}}>
                        {props.subInfo.imgUrl && (
                            <img
                                style={{
                                    minWidth: "60px",
                                    maxWidth: "90px",
                                    height: "60px",
                                    borderRadius: "8px",
                                    display: "block",
                                }}
                                src={props.subInfo.imgUrl}
                                alt={`${props.subInfo.title} logo`}
                            />
                        )}
                    </Col>

                    <Col>
                        <div>
                            <h2
                                style={{
                                    textDecoration: "none",
                                    color: props.subInfo.textColor,
                                    fontWeight: "bold",
                                    margin: 0,
                                    lineHeight: 1.1,
                                }}
                            >
                                {props.subInfo.title}
                            </h2>
                            <p style={{ margin: 0 }}>Renews:</p>
                            <p style={{ margin: 0 }}>INSERT CATEGORY</p>
                        </div>
                    </Col>

                    <Col>
                        <div
                            style={{
                                fontSize: 30,
                                color: props.subInfo.textColor,
                                textAlign: "right",
                            }}
                        >
                            ${props.subInfo.price}
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default memo(SubscriptionItemBar);