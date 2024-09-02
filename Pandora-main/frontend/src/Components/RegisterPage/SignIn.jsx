import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../utils/authContext";

const SignIn = ({ handleRegister }) => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            [name]: value,
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:3001/api/auth/signin",
                { ...userDetails }
            );
            localStorage.setItem("jwt-token", data.jwt.token);
            setAuthUser(data.userDetails);
            navigate("/");
        } catch (error) {
            setErrorMsg(error.response.data);
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    };
    return (
        <div
            className="login-container"
            id="login"
        >
            <div className="top">
                <header>Login</header>
            </div>
            <div className="input-box">
                <input
                    type="text"
                    name="email"
                    value={userDetails.email}
                    className="input-field"
                    placeholder="Email"
                    aria-label="Email"
                    onChange={handleChange}
                />
                <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
                <input
                    type="password"
                    name="password"
                    value={userDetails.password}
                    className="input-field"
                    placeholder="Password"
                    aria-label="Password"
                    onChange={handleChange}
                />
                <i className="bx bx-lock-alt"></i>
            </div>
            <div className="input-box">
                <input
                    type="submit"
                    onClick={handleSubmit}
                    className="submit"
                    value="Sign In"
                />
            </div>
            <span>{errorMsg}</span>
            <div className="two-col">
                <div className="one">
                    <span>
                        Don't have an account?{" "}
                        <button
                            className="link-btn"
                            onClick={handleRegister}
                        >
                            Sign Up
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
