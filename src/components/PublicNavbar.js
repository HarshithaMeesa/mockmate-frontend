import React from "react";
import { Link } from "react-router-dom";
import { theme, buttonStyles } from "../styles/theme";

function PublicNavbar() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderBottom: `1px solid ${theme.border}`,
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}
    >
      <div>
        <h2 style={{ margin: 0, color: theme.primaryDark, fontSize: "24px" }}>
          MockMate AI
        </h2>
        <p style={{ margin: "4px 0 0 0", color: theme.subtext, fontSize: "13px" }}>
          Smart Interview Assessment Platform
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button
            style={{
              ...buttonStyles.primary,
              background: "#FFFFFF",
              color: theme.primary,
              border: `1px solid ${theme.primary}`
            }}
          >
            Login
          </button>
        </Link>

        <Link to="/signup" style={{ textDecoration: "none" }}>
          <button style={buttonStyles.primary}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default PublicNavbar;