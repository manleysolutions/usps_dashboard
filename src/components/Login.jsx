import React, { useState } from "react";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.message || "Login failed");
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("account", data.account);
    setToken(data.token, data.role, data.account);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>True911+ Login</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button>Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
