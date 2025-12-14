import { useState, useContext } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import SubscriptionItemBar from "../content/SubscriptionItemBar.jsx";
import SubscriptionInputForm from "../input/SubscriptionInputForm.jsx";
import EditSubscriptionForm from "../input/EditSubscriptionForm.jsx";

import { SubscriptionDataContext } from "../contexts/SubscriptionDataContext.js";

/**
 * 
 * @returns A screen that displays a list of subscriptions, and allows for adding, editing, and searching subscriptions.
 */

export default function SubscriptionList(props) {

    const [subscriptions, setSubscriptions] = useContext(SubscriptionDataContext)
    const [selectedSubscription, setSelectedSubscription] = useState({})
    console.log(subscriptions)

    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    console.log(isEditing);
    console.log(isCreating);

    function handleSubscriptionEdit(editedSubscription) {

    }




    return (
        <Container fluid >
            <Row>

                <Col xs={12} md={5} >
                    <Card
                        style={{
                            backgroundColor: "transparent"
                        }}>
                        <h1 style={{ backgroundColor: "white", borderRadius: 8, padding: 10, minWidth: "auto", textAlign: "center" }}>{
                            isCreating ? "Add Subscription" : isEditing ? "Edit Subscription" :
                                isSearching ? "Search Subscriptions" : "Manage Subscriptions"
                        }</h1>
                        {isCreating ? <>
                            <SubscriptionInputForm setIsCreating={setIsCreating} setSubscriptions={setSubscriptions} />
                        </> : <></>}
                        {isEditing ? <>
                            <EditSubscriptionForm setSubscriptions={setSubscriptions} selectedSubscription={selectedSubscription} setIsEditing={setIsEditing} setIsCreating={setIsCreating}/>
                        </> : <></>}
                        {isSearching ? <></> : <></>}
                    </Card>
                </Col>

                <Col xs={12} md={7}
                    style={{
                        backgroundColor: "transparent",
                        borderRadius: 10,
                        padding: "1rem",
                        border: "2px solid black",
                    }}>
                    <h1 style={{ backgroundColor: "white", borderRadius: 8, padding: 10, width: 340 }}>My Subscriptions:</h1>
                    {/* TODO: create addsubscriptionbar, when pressed, sets IsCreating state var, changes side to create Subscription*/}
                    {subscriptions && subscriptions.map((sub) => (
                        <SubscriptionItemBar
                            key={sub.id}
                            priority={sub.priority}
                            title={sub.title}
                            price={sub.price}
                            renewCycle={sub.renewCycle}
                            renewDate={sub.renewDate}
                            category={sub.category}
                            color={sub.color}
                            textColor={sub.textColor}
                            imgUrl={sub.imgUrl}
                            setSubs={setSubscriptions}
                            setSelected={setSelectedSubscription}
                            setIsEditing={setIsEditing}
                            setIsCreating={setIsCreating}
                        />
                    )) || <><p>Loading...</p></>}
                </Col>
            </Row>
        </Container>
    );
}