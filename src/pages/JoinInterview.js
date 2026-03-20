import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { theme, cardStyle, buttonStyles } from "../styles/theme";

function JoinInterview() {
  const { id } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session/${id}`)
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, [id]);

  const joinAsStudent = () => {
    const roomLink = session?.jitsi_link || `https://meet.jit.si/mockmate-${id}`;
    window.open(roomLink, "_blank");
  };

  if (!session) {
    return (
      <div style={{ background: theme.background, minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "60px 24px",
            textAlign: "center"
          }}
        >
          <div style={{ ...cardStyle, padding: "40px" }}>
            <h2 style={{ color: theme.text, marginTop: 0 }}>Loading Interview...</h2>
            <p style={{ color: theme.subtext, marginBottom: 0 }}>
              Please wait while we prepare your live interview session.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            ...cardStyle,
            background: `linear-gradient(120deg, ${theme.primaryDark}, ${theme.primary})`,
            color: "#FFFFFF",
            marginBottom: "24px"
          }}
        >
          <h1 style={{ margin: "0 0 10px 0", fontSize: "34px" }}>
            Join Live Interview
          </h1>
          <p style={{ margin: 0, lineHeight: "1.8", fontSize: "16px", opacity: 0.95 }}>
            You have been invited to join a lecturer-led mock interview session.
            Review the interview details below and enter the meeting when ready.
          </p>
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
            <h2 style={{ color: theme.text, marginTop: 0 }}>Interview Details</h2>
            <p style={{ color: theme.subtext, marginBottom: "24px" }}>
              This session is organized for a live lecturer-led interview experience.
            </p>

            <div style={infoBlock}>
              <span style={labelStyle}>Interview Role</span>
              <span style={valueStyle}>{session.role}</span>
            </div>

            <div style={infoBlock}>
              <span style={labelStyle}>Scheduled Time</span>
              <span style={valueStyle}>{session.time}</span>
            </div>

            <div style={infoBlock}>
              <span style={labelStyle}>Session ID</span>
              <span style={valueStyle}>{id}</span>
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "18px",
                background: "#EFF6FF",
                border: `1px solid ${theme.accent}`,
                borderRadius: "14px"
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: theme.primaryDark }}>
                Before You Join
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: theme.subtext,
                  lineHeight: "1.9"
                }}
              >
                <li>Allow camera and microphone access.</li>
                <li>Join from a quiet place with stable internet.</li>
                <li>Keep your resume or notes ready if needed.</li>
              </ul>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ color: theme.text, marginTop: 0 }}>Ready to Enter?</h2>
            <p style={{ color: theme.subtext, lineHeight: "1.7", marginBottom: "22px" }}>
              Click the button below to open the live interview room in a new tab.
            </p>

            <button onClick={joinAsStudent} style={buttonStyles.success}>
              Join as Student
            </button>

            <div
              style={{
                marginTop: "24px",
                padding: "18px",
                borderRadius: "14px",
                background: "#F8FAFC",
                border: `1px solid ${theme.border}`
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: theme.text }}>
                Session Guidance
              </h4>
              <p style={{ margin: 0, color: theme.subtext, lineHeight: "1.7" }}>
                Speak clearly, listen carefully to the lecturer’s questions, and answer
                confidently using relevant examples.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const infoBlock = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 0",
  borderBottom: `1px solid ${theme.border}`,
  gap: "20px"
};

const labelStyle = {
  color: theme.subtext,
  fontWeight: "600",
  fontSize: "14px"
};

const valueStyle = {
  color: theme.text,
  fontWeight: "600",
  fontSize: "15px",
  textAlign: "right"
};

export default JoinInterview;