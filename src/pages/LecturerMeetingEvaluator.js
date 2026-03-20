import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, Link } from "react-router-dom";
import { theme, cardStyle, buttonStyles } from "../styles/theme";

function LecturerMeetingEvaluator() {
  const location = useLocation();
  const sessionId = location.state?.sessionId;

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      const recorder = new MediaRecorder(displayStream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "meeting-audio.webm", {
          type: "audio/webm"
        });

        const formData = new FormData();
        formData.append("audio", file);

        setLoading(true);

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/session/${sessionId}/evaluate-meeting-audio`,
          {
            method: "POST",
            body: formData
          }
        );

        const data = await response.json();
        setResult(data);
        setLoading(false);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            ...cardStyle,
            background: `linear-gradient(120deg, ${theme.primaryDark}, ${theme.primary})`,
            color: "#FFFFFF",
            marginBottom: "24px"
          }}
        >
          <h1 style={{ margin: "0 0 10px 0", fontSize: "34px" }}>
            Lecturer Meeting Evaluator
          </h1>
          <p style={{ margin: 0, lineHeight: "1.8", fontSize: "16px", opacity: 0.95 }}>
            Record the live lecturer-led interview session and let AI generate a
            professional evaluation report from the captured meeting audio.
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
            <h2 style={{ color: theme.text, marginTop: 0 }}>Recording Control</h2>
            <p style={{ color: theme.subtext, lineHeight: "1.7", marginBottom: "22px" }}>
              Start recording once the lecturer and student are both inside the
              interview meeting. Stop recording when the interview segment is complete
              to begin AI evaluation.
            </p>

            <div
              style={{
                background: "#F8FAFC",
                border: `1px solid ${theme.border}`,
                borderRadius: "14px",
                padding: "18px",
                marginBottom: "20px"
              }}
            >
              <div style={infoRow}>
                <span style={infoLabel}>Session ID</span>
                <span style={infoValue}>{sessionId || "Not available"}</span>
              </div>

              <div style={infoRow}>
                <span style={infoLabel}>Recording Status</span>
                <span
                  style={{
                    ...statusPill,
                    background: recording ? "#FEE2E2" : "#DCFCE7",
                    color: recording ? theme.danger : theme.success
                  }}
                >
                  {recording ? "Recording" : "Idle"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {!recording ? (
                <button onClick={startRecording} style={buttonStyles.success}>
                  Start AI Recording
                </button>
              ) : (
                <button onClick={stopRecording} style={buttonStyles.danger}>
                  Stop & Evaluate
                </button>
              )}
            </div>

            {loading && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "#FEF3C7",
                  border: "1px solid #FCD34D",
                  color: "#92400E",
                  fontWeight: "600"
                }}
              >
                Gemini is analyzing the meeting audio...
              </div>
            )}

            <div
              style={{
                marginTop: "24px",
                background: "#EFF6FF",
                border: `1px solid ${theme.accent}`,
                borderRadius: "14px",
                padding: "18px"
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: theme.primaryDark }}>
                Best Recording Practice
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: theme.subtext,
                  lineHeight: "1.9"
                }}
              >
                <li>Select the active meeting tab with audio enabled.</li>
                <li>Make sure both voices are clearly audible.</li>
                <li>Record only the important interview section for better evaluation.</li>
              </ul>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ color: theme.text, marginTop: 0 }}>Quick Result Snapshot</h2>
            <p style={{ color: theme.subtext, lineHeight: "1.7", marginBottom: "18px" }}>
              Once the AI finishes evaluation, the top-level summary will appear here.
            </p>

            {result ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    marginBottom: "18px"
                  }}
                >
                  <div style={miniCard}>
                    <p style={miniTitle}>Overall Score</p>
                    <h3 style={miniValue}>{result.overall_score}</h3>
                  </div>

                  <div style={miniCard}>
                    <p style={miniTitle}>Communication</p>
                    <h3 style={miniValue}>{result.communication_score}</h3>
                  </div>

                  <div style={miniCard}>
                    <p style={miniTitle}>Clarity</p>
                    <h3 style={miniValue}>{result.clarity_score}</h3>
                  </div>

                  <div style={miniCard}>
                    <p style={miniTitle}>Confidence</p>
                    <h3 style={miniValue}>{result.confidence_score}</h3>
                  </div>
                </div>

                <div
                  style={{
                    background: "#F8FAFC",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "14px",
                    padding: "18px"
                  }}
                >
                  <h4 style={{ margin: "0 0 10px 0", color: theme.text }}>AI Summary</h4>
                  <p style={{ margin: 0, color: theme.subtext, lineHeight: "1.8" }}>
                    {result.transcript_summary}
                  </p>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <Link
                    to={`/lecturer-report/${sessionId}`}
                    style={{
                      color: theme.primary,
                      fontWeight: "700",
                      textDecoration: "none"
                    }}
                  >
                    Open Full Lecturer Report →
                  </Link>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "22px",
                  borderRadius: "14px",
                  background: "#F8FAFC",
                  border: `1px solid ${theme.border}`,
                  color: theme.subtext,
                  lineHeight: "1.7"
                }}
              >
                No evaluation yet. Start and stop a recording to generate the AI meeting report.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: `1px solid ${theme.border}`,
  gap: "16px"
};

const infoLabel = {
  color: theme.subtext,
  fontWeight: "600",
  fontSize: "14px"
};

const infoValue = {
  color: theme.text,
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "right"
};

const statusPill = {
  padding: "6px 12px",
  borderRadius: "999px",
  fontWeight: "700",
  fontSize: "13px"
};

const miniCard = {
  background: "#F8FAFC",
  border: `1px solid ${theme.border}`,
  borderRadius: "14px",
  padding: "16px"
};

const miniTitle = {
  margin: 0,
  color: theme.subtext,
  fontSize: "13px",
  fontWeight: "600"
};

const miniValue = {
  margin: "10px 0 0 0",
  color: theme.text,
  fontSize: "24px",
  fontWeight: "700"
};

export default LecturerMeetingEvaluator;