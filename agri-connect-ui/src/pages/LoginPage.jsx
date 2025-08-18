// LoginPage.jsx
import React, { useState } from "react";

const LoginPage = () => {
  const [farmerData, setFarmerData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL; // <-- Render backend

  const handleChange = (e) => {
    setFarmerData({ ...farmerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}farmer-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(farmerData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Assuming backend returns user info or token
      if (data.id || data.token) {
        setMessage("Login successful!");
        // Map or save data as needed
        console.log("Farmer Data:", data);
      } else {
        setMessage("Invalid credentials or farmer not registered.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("An error occurred while logging in.");
    }
  };

  return (
    <div className="login-container">
      <h2>Farmer Login / Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={farmerData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={farmerData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login / Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
