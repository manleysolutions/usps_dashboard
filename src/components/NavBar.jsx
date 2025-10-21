import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar({ role }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const links = [];
  if (role === "SuperAdmin") links.push({ to: "/", label: "Ops" });
  if (["SuperAdmin", "Admin", "Manager", "User"].includes(role))
    links.push({ to: "/customer", label: "Customer" });
  if (["SuperAdmin", "3PL"].includes(role))
    links.push({ to: "/3pl", label: "3PL" });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">True911+ Pilot Portal</h1>
      </div>
      <nav className="navbar-center">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="nav-link">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="navbar-right">
        <span className="user-role">{role}</span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}
