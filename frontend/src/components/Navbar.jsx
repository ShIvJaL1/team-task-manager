import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✓</div>
        <h2>TaskFlow</h2>
      </div>

      <nav className="side-nav">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">My Tasks</Link>
      </nav>

      <div className="sidebar-footer">
        <p className="user-badge">User</p>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <button onClick={logout}>Sign out</button>
      </div>
    </aside>
  );
}