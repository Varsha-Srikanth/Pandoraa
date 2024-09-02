import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignIn from "./RegisterPage/SignIn";
import SignUp from "./RegisterPage/SignUp";
import "../Styles/register.css";

const Register = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="wrapper bg-gray-800">
            <nav className="nav">
                <div className="nav-logo">
                    <p>PANDORA</p>
                </div>
                <div
                    className="nav-menu"
                    id="navMenu"
                >
                    <ul>
                        <li
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            Home
                        </li>
                    </ul>
                </div>
                <div className="nav-button">
                    <button
                        className="btn white-btn"
                        id="loginBtn"
                        onClick={() => setShowLogin(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className="btn"
                        id="registerBtn"
                        onClick={() => setShowLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>
            </nav>

            <div className="form-box">
                {showLogin ? (
                    <SignIn handleRegister={() => setShowLogin(false)} />
                ) : (
                    <SignUp handleLogin={() => setShowLogin(true)} />
                )}
            </div>
        </div>
    );
};

export default Register;
