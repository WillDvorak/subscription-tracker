import { useState } from "react"
import { Container } from "react-bootstrap";

import LoginAndRegisterForm from "../input/LoginAndRegisterForm"
import "./LoginAndRegisterScreen.css";

export default function LoginAndRegisterScreen(){

    const [isLoggingIn, setIsLoggingIn] = useState(true);


    return (
    <Container fluid>
        <div className="page-header">
            <div className="page-eyebrow">{isLoggingIn ? "Welcome back" : "Register for an account"}</div>
            <h1 className="page-title">{isLoggingIn ? "Sign In" : "Register"}</h1>
            <p className="login-desc">{isLoggingIn ? "Good to see you again." : "Happy to have you."}</p>
        </div>

        <div className="auth-container">
            <div className="auth-card">
                <LoginAndRegisterForm isLoggingIn={isLoggingIn} setIsLoggingIn={setIsLoggingIn} />
            </div>
        </div>
    </Container>
    )
}