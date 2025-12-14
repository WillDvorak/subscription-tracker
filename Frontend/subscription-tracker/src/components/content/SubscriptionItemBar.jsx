import { Card, Row, Col, Button } from "react-bootstrap";
import { memo, useState } from "react";

/**
 * 
 * @param {int} props.priority -> priority of subscription, how to sort.
 * @param {string/hex} props.color -> background color.
 * @param {string/hex} props.textColor -> text color.
 * @param {string} props.imgUrl -> url for subscription image.
 * @param {string} props.title -> title of subscription (main name).
 * @param {int} props.price -> price of subscription every cycle.
 * @param {string} props.renewCycle -> how often it renews.
 * @param {string} props.renewDate -> when the next renewal is.
 * @param {string} props.category -> what category the subscription is (entertainment/utility).
 * @param {CallbackFunction} props.setSubs -> setSubscriptionsStateVariable
 * @param {CallbackFunction} props.setIsCreating
 * 
 * @returns A formatted bar of subscription information
 *  that will get organized by the subscription list
 */
function SubscriptionItemBar(props) {

    const editData = {
        title: props.title,
        renewCycle: props.renewCycle,
        renewDate: props.renewDate,
        price: props.price,
        category: props.category,
        priority: props.priority,
        textColor: props.textColor,
        color: props.color,
    }

    const [viewingMore, setViewingMore] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const nowDate = new Date();
    console.log(nowDate.getFullYear());

    const date = new Date(props.renewDate);
    const formattedDate = date.toString().split(" ", 4);
    formattedDate[2] = (parseInt(formattedDate[2]) + 1).toString();
    console.log(formattedDate);


    // Check number of days in current month
    function daysInThisMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }

    // Function to check next renewal date
    function getNextRenewDate(renewDate, renewMonth, renewYear, renewCycle) {

        const monthVals = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        }

        const renewCycleValues = {
            Monthly: 1,
            Quarterly: 3,
            Biannually: 6,
            Annually: 12,
        }

        const daysInThisMonth = daysInThisMonth();
        const currentDateData = new Date();
        const currentDay = currentDateData.getDay()
        const currentMonth = currentDateData.getMonth()
        const currentYear = currentDateData.getFullYear()

        let resultDay = renewDate;
        let resultMonth = renewMonth;
        let resultYear = renewYear;

        // If before renewDate do nothing 
        // if ((currentDay > renewDate) && (monthVals[renewMonth] >= currentMonth ||(monthVals[renewMonth] < currentMonth))) {
        //     resultMonth = (monthVals[resultMonth] + renewCycleValues[renewCycle])
        //     if (resultMonth > 11 ) {
        //         renewMonth
        //     }
        //     resultMonth = Object.keys(monthVals).find(key => monthVals[key] === resultMonth);

        //     if (new Date(resultYear))
        // }
        return `${resultMonth}. ${resultDay}, ${resultYear}`

    }

    return (
        <Card
            onClick={() => {
                setViewingMore(!viewingMore);
            }}
            className="subItem"
            style={{
                backgroundColor: props.color,
                minHeight: 100,
                minWidth: "50vw",
                marginBottom: 8,
                maxWidth: "100%",
                borderColor: "black",
                borderWidth: 4,
                borderRadius: 12,
            }}
        >
            <Card.Body>
                <Row style={{ alignItems: "center"}}>
                    <Col xs lg="2">
                        {props.imgUrl && (
                            <img
                                style={{
                                    width: "60px",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                    borderRadius: "8px"
                                }}
                                src={props.imgUrl}
                                alt={`${props.title} logo`}
                            />
                        )}
                    </Col>

                    <Col>
                        {/* Large Header */}
                        <p style={{
                            textDecoration: "none",
                            color: props.textColor,
                            fontWeight: "bold",
                            fontSize: 40,
                        }}>
                            {props.title}
                        </p>

                    </Col>

                    {/* Right Aligned Price */}
                    <Col>
                        <div style={{ fontSize: 30, color: props.textColor, textAlign: "right" }}>
                            ${props.price}
                        </div>
                    </Col>
                </Row>

                {/* Extra details: */}
                {viewingMore ? (
                    <>
                        <div
                            style={{
                                width: "100%",
                                height: 2,
                                backgroundColor: "black",
                                marginBottom: 5,
                                marginTop: 10,
                            }}
                        ></div>

                        {/* Renewal info */}
                        <Row style={{ color: props.textColor, marginBottom: 8 }}>
                            <Col>
                                <div style={{ fontSize: 20 }}>
                                    Renews: {props.renewCycle} on {formattedDate[1]} {formattedDate[2]}
                                </div>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                                Next Renewal: {formattedDate[1]}. {formattedDate[2]}, {formattedDate[3]}
                            </Col>
                        </Row>

                        {/* Category / Priority */}
                        <Row style={{ color: props.textColor, marginBottom: 8 }}>
                            <Col>
                                <div style={{ fontSize: 18 }}>
                                    Category: {props.category || "Uncategorized"}
                                </div>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 18 }}>
                                    Priority: {props.priority}
                                </div>
                            </Col>
                        </Row>

                        {/* Billing details */}
                        <Row style={{ color: props.textColor, marginBottom: 12 }}>
                            <Col>
                                <div style={{ fontSize: 18 }}>
                                    Billed Amount: ${props.price} per {props.renewCycle}
                                </div>
                            </Col>
                            <Col style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 18 }}>
                                    Original Renew Date: {props.renewDate}
                                </div>
                            </Col>
                        </Row>

                        {/* Actions */}
                        <Row>
                            <Col>
                                <Button
                                    style={{
                                        width: "100%",
                                        backgroundColor: "transparent",
                                        border: "2px solid black",
                                        fontWeight: "bolder",
                                        fontSize: 20,
                                        color: props.textColor,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent re-toggling card
                                        console.log(editData)
                                        props.setSelected(editData);
                                        props.setIsCreating(false)
                                        props.setIsEditing(true);
                                    }}
                                >
                                    Edit Subscription
                                </Button>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div></div>
                )}

            </Card.Body>


        </Card>
    );
}

export default memo(SubscriptionItemBar);