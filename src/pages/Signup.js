import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import { theme, cardStyle, buttonStyles } from "../styles/theme";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    localStorage.setItem("mockmate_logged_in", "true");
    navigate("/dashboard");
  };

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <PublicNavbar />

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0, color: theme.text }}>Create Account</h1>
          <p style={{ color: theme.subtext, marginBottom: "24px" }}>
            Join MockMate AI and start preparing smarter for interviews.
          </p>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <button type="submit" style={{ ...buttonStyles.primary, width: "100%" }}>
              Sign Up
            </button>
          </form>

          <p style={{ marginTop: "20px", color: theme.subtext }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: theme.primary, fontWeight: "700", textDecoration: "none" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: theme.text,
  fontWeight: "600"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: `1px solid ${theme.border}`,
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box"
};

export default Signup;