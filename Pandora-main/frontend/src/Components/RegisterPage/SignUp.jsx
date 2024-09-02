import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../utils/authContext";

const SignUp = ({ handleLogin }) => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();
    const [errorMsg, setErrorMsg] = useState("");
    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        password: "",
        gender: "",
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            [name]: value,
        }));
    };
    const handlesubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:3001/api/auth/signup",
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
            className="register-container"
            id="register"
        >
            <div className="top">
                <header>Sign Up</header>
            </div>
            <div className="input-box">
                <input
                    type="text"
                    name="username"
                    value={userDetails.username}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Username"
                    aria-label="Username"
                />
            </div>
            <div className="input-box">
                <input
                    type="text"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Email"
                    aria-label="Email"
                />
            </div>
            <div className="input-box">
                <input
                    type="password"
                    name="password"
                    value={userDetails.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Password"
                    aria-label="Password"
                />
            </div>
            <div className="input-box">
                <select
                    name="gender"
                    value={userDetails.gender}
                    onChange={handleChange}
                    className="input-field"
                    aria-label="Gender"
                >
                    <option
                        value=""
                        disabled
                    >
                        Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div className="input-box">
                <input
                    type="submit"
                    onClick={handlesubmit}
                    className="submit"
                    value="Register"
                />
            </div>
            <span>{errorMsg}</span>
            <div className="two-col">
                <div className="one">
                    <span>
                        Have an account?{" "}
                        <button
                            className="link-btn"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
