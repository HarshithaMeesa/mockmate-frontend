import React from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import { theme, cardStyle, buttonStyles } from "../styles/theme";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Resume-Based Question Generation",
      text: "Upload your resume and get customized interview questions based on your skills and profile."
    },
    {
      title: "AI Self-Practice Interview",
      text: "Practice independently with AI-generated questions, voice-based answers, and instant scoring."
    },
    {
      title: "Lecturer-Led Live Interview",
      text: "Conduct real-time mock interviews with students using a lecturer-controlled live session flow."
    },
    {
      title: "Smart Evaluation Reports",
      text: "Generate structured performance feedback, strengths, weaknesses, and improvement guidance."
    }
  ];

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <PublicNavbar />

      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "50px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "30px",
            alignItems: "center",
            marginBottom: "40px"
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                background: "#DBEAFE",
                color: theme.primaryDark,
                padding: "8px 14px",
                borderRadius: "999px",
                fontWeight: "700",
                fontSize: "13px",
                marginBottom: "18px"
              }}
            >
              AI-Powered Interview Preparation
            </div>

            <h1
              style={{
                margin: "0 0 16px 0",
                color: theme.text,
                fontSize: "48px",
                lineHeight: "1.2"
              }}
            >
              Prepare Smarter.
              <br />
              Perform Better.
            </h1>

            <p
              style={{
                color: theme.subtext,
                fontSize: "18px",
                lineHeight: "1.9",
                marginBottom: "24px"
              }}
            >
              MockMate AI helps students prepare for interviews with resume-based
              question generation, AI-driven practice sessions, lecturer-led live
              interviews, and premium performance reports.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/signup")}
                style={buttonStyles.primary}
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/login")}
                style={{
                  ...buttonStyles.primary,
                  background: "#FFFFFF",
                  color: theme.primary,
                  border: `1px solid ${theme.primary}`
                }}
              >
                Login
              </button>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`,
              color: "#FFFFFF",
              minHeight: "360px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "30px" }}>What happens inside MockMate?</h2>

            <div style={{ marginTop: "18px", display: "grid", gap: "14px" }}>
              {[
                "Upload resume and detect important skills",
                "Generate role-based interview questions",
                "Practice with AI voice-based interview sessions",
                "Conduct live lecturer-led interview sessions",
                "Get feedback, reports, and improvement insights"
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    lineHeight: "1.7"
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ color: theme.text, fontSize: "30px", marginBottom: "10px" }}>
            Platform Highlights
          </h2>
          <p style={{ color: theme.subtext, margin: 0 }}>
            Everything needed for self-practice and guided interview assessment in one place.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px"
          }}
        >
          {features.map((item, index) => (
            <div key={index} style={cardStyle}>
              <h3 style={{ marginTop: 0, color: theme.text }}>{item.title}</h3>
              <p style={{ color: theme.subtext, lineHeight: "1.8", marginBottom: 0 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;