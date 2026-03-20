import React from "react";
import { Link } from "react-router-dom";
import { theme } from "../styles/theme";

function Navbar() {
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${theme.primaryDark}, ${theme.primary})`,
        color: "#FFFFFF",
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: theme.shadow
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
          MockMate AI
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", opacity: 0.9 }}>
          Smart Interview Assessment Platform
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/dashboard" style={navLink}>
          Dashboard
        </Link>

        <Link to="/resume" style={navLink}>
          Resume
        </Link>

        <Link to="/interview" style={navLink}>
          Interview
        </Link>
      </div>
    </div>
  );
}

const navLink = {
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "15px"
};

export default Navbar;