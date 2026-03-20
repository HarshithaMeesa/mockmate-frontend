import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { theme, cardStyle, buttonStyles } from "../styles/theme";

function InterviewSelect() {
  const navigate = useNavigate();

  const startInterview = (role) => {
    navigate("/room", { state: { role: role } });
  };

  const createSession = async (role) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: role,
          time: new Date().toISOString(),
          questions: []
        })
      });

      const data = await response.json();
      localStorage.setItem("lecturer_session_id", data.session_id);
      const studentLink = data.link;
      const roomLink = `https://meet.jit.si/mockmate-${data.session_id}`;

      await navigator.clipboard.writeText(studentLink);

      const openNow = window.confirm(
        `Student link copied:\n\n${studentLink}\n\nLecturer room:\n${roomLink}\n\nPress OK to open lecturer room now.`
      );

      if (openNow) {
        window.location.href = roomLink;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create interview link");
    }
  };

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              color: theme.text,
              fontSize: "34px",
              marginBottom: "10px"
            }}
          >
            Select Interview Type
          </h1>
          <p
            style={{
              color: theme.subtext,
              fontSize: "16px",
              margin: 0
            }}
          >
            Choose a role for self-practice or start a lecturer-led live interview session.
          </p>
        </div>

        <div style={{ ...cardStyle, marginBottom: "30px" }}>
          <h2 style={{ color: theme.text, marginTop: 0 }}>Student Practice Mode</h2>
          <p style={{ color: theme.subtext, marginBottom: "24px" }}>
            Practice interviews independently with AI-generated feedback and performance scoring.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px"
            }}
          >
            <div style={roleCard}>
              <h3 style={roleTitle}>Data Analyst</h3>
              <p style={roleText}>
                Practice analytics, SQL, dashboards, business thinking and insights.
              </p>
              <button
                onClick={() => startInterview("Data Analyst")}
                style={buttonStyles.primary}
              >
                Start Practice
              </button>
            </div>

            <div style={roleCard}>
              <h3 style={roleTitle}>Data Scientist</h3>
              <p style={roleText}>
                Prepare for machine learning, statistics, modeling and project discussions.
              </p>
              <button
                onClick={() => startInterview("Data Scientist")}
                style={buttonStyles.primary}
              >
                Start Practice
              </button>
            </div>

            <div style={roleCard}>
              <h3 style={roleTitle}>Software Engineer</h3>
              <p style={roleText}>
                Train for technical interviews, logic, coding concepts and system thinking.
              </p>
              <button
                onClick={() => startInterview("Software Engineer")}
                style={buttonStyles.primary}
              >
                Start Practice
              </button>
            </div>

            <div style={roleCard}>
              <h3 style={roleTitle}>Custom Interview</h3>
              <p style={roleText}>
                Use a flexible interview flow for your own role or personalized preparation.
              </p>
              <button
                onClick={() => startInterview("Custom Interview")}
                style={buttonStyles.primary}
              >
                Start Practice
              </button>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: theme.text, marginTop: 0 }}>Lecturer-Led Interview Mode</h2>
          <p style={{ color: theme.subtext, marginBottom: "24px" }}>
            Generate a live interview link, share it with the student, and conduct the session with a lecturer.
          </p>

          <div
            style={{
              background: "#EFF6FF",
              border: `1px solid ${theme.accent}`,
              borderRadius: "14px",
              padding: "24px"
            }}
          >
            <h3 style={{ color: theme.primaryDark, marginTop: 0 }}>
              Live Interview Session
            </h3>
            <p style={{ color: theme.subtext, marginBottom: "20px" }}>
              This mode creates a shareable student link and opens the lecturer meeting room for the interview.
            </p>

            <button
              onClick={() => createSession("Software Engineer")}
              style={buttonStyles.success}
            >
              Generate Interview Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const roleCard = {
  border: `1px solid ${theme.border}`,
  borderRadius: "14px",
  padding: "20px",
  background: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "220px"
};

const roleTitle = {
  margin: "0 0 10px 0",
  color: theme.text,
  fontSize: "20px"
};

const roleText = {
  color: theme.subtext,
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "20px"
};

export default InterviewSelect;