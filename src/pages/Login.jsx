import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.username === "admin" && form.password === "admin") {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("role", "ops");
      navigate("/ops");
    } else if (form.username === "3pl" && form.password === "3pl") {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("role", "3pl");
      navigate("/3pl");
    } else if (form.username === "customer" && form.password === "customer") {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("role", "customer");
      navigate("/customer");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#121212",
        color: "#fff",
      }}
    >
      <div
        style={{
          background: "#1e1e1e",
          padding: "2rem 3rem",
          borderRadius: "10px",
          textAlign: "center",
          width: "300px",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>True911+ Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}
