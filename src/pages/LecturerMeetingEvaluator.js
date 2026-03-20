import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useParams, Link } from "react-router-dom";
import { theme, cardStyle, buttonStyles } from "../styles/theme";

function LecturerMeetingEvaluator() {
  const location = useLocation();
  const { sessionId: routeSessionId } = useParams();

  const sessionId =
    location.state?.sessionId ||
    routeSessionId ||
    localStorage.getItem("lecturer_session_id");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const startRecording = async () => {
    try {
      setErrorMsg("");
      setResult(null);

      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      streamRef.current = displayStream;

      const recorder = new MediaRecorder(displayStream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const file = new File([blob], "meeting-recording.webm", {
            type: "video/webm"
          });

          const formData = new FormData();
          formData.append("audio", file);

          setLoading(true);
          setErrorMsg("");

          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/session/${sessionId}/evaluate-meeting-audio`,
            {
              method: "POST",
              body: formData
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setErrorMsg(data.error || data.message || "Evaluation failed on server.");
            setLoading(false);
            return;
          }

          setResult(data);
          setLoading(false);
        } catch (err) {
          console.error("Evaluation error:", err);
          setErrorMsg("Failed while sending recording for evaluation.");
          setLoading(false);
        } finally {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }
        }
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      setErrorMsg("Could not start screen/audio recording.");
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
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0, color: theme.text }}>Lecturer Meeting Evaluator</h1>
          <p style={{ color: theme.subtext }}>
            Session ID: <b>{sessionId || "Not available"}</b>
          </p>

          {!recording ? (
            <button onClick={startRecording} style={buttonStyles.success}>
              Start AI Recording
            </button>
          ) : (
            <button onClick={stopRecording} style={buttonStyles.danger}>
              Stop & Evaluate
            </button>
          )}

          {loading && (
            <p style={{ marginTop: "20px", color: theme.warning, fontWeight: "700" }}>
              Gemini is analyzing the meeting audio...
            </p>
          )}

          {errorMsg && (
            <div
              style={{
                marginTop: "20px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: theme.danger,
                fontWeight: "600"
              }}
            >
              {errorMsg}
            </div>
          )}

          {result && (
            <div
              style={{
                marginTop: "30px",
                background: "#F8FAFC",
                padding: "20px",
                borderRadius: "14px",
                border: `1px solid ${theme.border}`
              }}
            >
              <h2 style={{ marginTop: 0 }}>Meeting Evaluation</h2>
              <p><b>Overall Score:</b> {result.overall_score}</p>
              <p><b>Communication:</b> {result.communication_score}</p>
              <p><b>Clarity:</b> {result.clarity_score}</p>
              <p><b>Confidence:</b> {result.confidence_score}</p>
              <p><b>Technical Depth:</b> {result.technical_depth_score}</p>
              <p><b>Relevance:</b> {result.relevance_score}</p>
              <p><b>Summary:</b> {result.transcript_summary}</p>

              <div style={{ marginTop: "20px" }}>
                <Link
                  to={`/lecturer-report/${sessionId}`}
                  style={{ color: theme.primary, fontWeight: "700", textDecoration: "none" }}
                >
                  Open Full Lecturer Report →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LecturerMeetingEvaluator;