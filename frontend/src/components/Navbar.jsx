import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✓</div>
        <h2>TaskFlow</h2>
      </div>

      <nav className="side-nav">
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/tasks">My Tasks</Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <>
            <p className="user-badge">{user.name}</p>
            <p style={{ color: "#94a3b8", marginLeft: "14px", fontSize: "13px" }}>
              {user.role}
            </p>
            <button onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </aside>
  );
}
