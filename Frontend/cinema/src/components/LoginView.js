import React, { useState } from "react";
import "./LoginView.css";
import api from "../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

const LoginView = ({ user, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { seanseID } = useParams();

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    // TODO: Send login request
    try {
      const response = await api
        .post("/users/login", { email: email, password: password })
        .then((response) => {
          console.log(response.data.user);
          if (response.status == 200) {
            if (seanseID) {
              navigate(`/seanse/${seanseID.replace(/[:}]/g, "")}`);
            } else {
              setUser(response.data.user);
              navigate("/");
            }
          } else {
            alert("Login failed");
          }
        });
    } catch (error) {
      alert("Login failed");
      console.log(error);
    }
    // Reset form fields
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">E-mail:</label>
          <input
            type="text"
            id="username"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginView;
