import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { theme, cardStyle, buttonStyles } from "../styles/theme";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: "Practice Sessions", value: "12", color: "#DBEAFE", text: theme.primaryDark },
    { title: "Average Score", value: "78%", color: "#ECFDF5", text: theme.success },
    { title: "Live Interviews", value: "4", color: "#FEF3C7", text: theme.warning }
  ];

  const recentInterviews = [
    { role: "Data Analyst", date: "10 March", score: "75/100", status: "Good" },
    { role: "Software Engineer", date: "14 March", score: "82/100", status: "Excellent" },
    { role: "Data Scientist", date: "18 March", score: "69/100", status: "Improving" }
  ];

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            ...cardStyle,
            background: `linear-gradient(120deg, ${theme.primaryDark}, ${theme.primary})`,
            color: "#FFFFFF",
            marginBottom: "28px"
          }}
        >
          <h1 style={{ margin: "0 0 10px 0", fontSize: "36px" }}>
            Welcome to MockMate
          </h1>
          <p style={{ margin: 0, fontSize: "16px", opacity: 0.95, lineHeight: "1.8" }}>
            Your AI Interview Preparation Platform to practice, assess, and improve
            interview readiness with intelligent feedback and lecturer-led sessions.
          </p>

          <div style={{ marginTop: "24px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/resume")}
              style={buttonStyles.success}
            >
              Upload Resume
            </button>

            <button
              onClick={() => navigate("/interview")}
              style={buttonStyles.primary}
            >
              Start Interview
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "28px"
          }}
        >
          {stats.map((item, index) => (
            <div key={index} style={cardStyle}>
              <p style={{ margin: 0, color: theme.subtext, fontWeight: "600" }}>
                {item.title}
              </p>
              <div
                style={{
                  marginTop: "16px",
                  display: "inline-block",
                  padding: "10px 16px",
                  background: item.color,
                  color: item.text,
                  borderRadius: "999px",
                  fontSize: "28px",
                  fontWeight: "700"
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "24px",
            alignItems: "start"
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: theme.text }}>Recent Interviews</h2>
            <p style={{ color: theme.subtext, marginBottom: "20px" }}>
              View your latest practice and mock interview attempts.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}
              >
                <thead>
                  <tr style={{ background: "#EFF6FF" }}>
                    <th style={tableHead}>Role</th>
                    <th style={tableHead}>Date</th>
                    <th style={tableHead}>Score</th>
                    <th style={tableHead}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentInterviews.map((item, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={tableCell}>{item.role}</td>
                      <td style={tableCell}>{item.date}</td>
                      <td style={tableCell}>{item.score}</td>
                      <td style={tableCell}>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "999px",
                            background:
                              item.status === "Excellent"
                                ? "#DCFCE7"
                                : item.status === "Good"
                                ? "#DBEAFE"
                                : "#FEF3C7",
                            color:
                              item.status === "Excellent"
                                ? theme.success
                                : item.status === "Good"
                                ? theme.primaryDark
                                : theme.warning,
                            fontWeight: "600",
                            fontSize: "13px"
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: theme.text }}>Quick Overview</h2>
            <p style={{ color: theme.subtext, lineHeight: "1.7" }}>
              Stay consistent with resume uploads, self-practice, and live interview sessions to improve performance over time.
            </p>

            <div
              style={{
                marginTop: "20px",
                background: "#F8FAFC",
                border: `1px solid ${theme.border}`,
                borderRadius: "14px",
                padding: "18px"
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: theme.text }}>
                Suggested Next Steps
              </h4>
              <ul style={{ margin: 0, paddingLeft: "18px", color: theme.subtext, lineHeight: "1.9" }}>
                <li>Upload your latest resume for fresh question generation.</li>
                <li>Practice one self-interview session daily.</li>
                <li>Attend a lecturer-led mock interview for realistic assessment.</li>
              </ul>
            </div>

            <div
              style={{
                marginTop: "20px",
                background: "#EFF6FF",
                border: `1px solid ${theme.accent}`,
                borderRadius: "14px",
                padding: "18px"
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: theme.primaryDark }}>
                Pro Tip
              </h4>
              <p style={{ margin: 0, color: theme.subtext, lineHeight: "1.7" }}>
                Strong interview performance comes from both technical preparation and calm, structured communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const tableHead = {
  textAlign: "left",
  padding: "14px 16px",
  color: theme.text,
  fontSize: "14px"
};

const tableCell = {
  padding: "14px 16px",
  color: theme.subtext,
  fontSize: "14px"
};

export default Dashboard;