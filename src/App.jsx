import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Ops from "./pages/Ops.jsx";
import Customer from "./pages/Customer.jsx";
import Staging from "./pages/Staging.jsx";

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/ops" /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/ops"
          element={
            <ProtectedRoute token={token}>
              <Ops />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <ProtectedRoute token={token}>
              <Customer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staging"
          element={
            <ProtectedRoute token={token}>
              <Staging />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function NotFound() {
  return (
    <div style={{ color: "#fff", padding: "3rem", textAlign: "center" }}>
      <h2>404 — Page Not Found</h2>
      <a href="/" style={{ color: "#00a2ff" }}>
        Go Home
      </a>
    </div>
  );
}
