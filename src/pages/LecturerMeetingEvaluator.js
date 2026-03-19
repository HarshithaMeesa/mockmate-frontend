import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, Link } from "react-router-dom";

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
        const file = new File([blob], "meeting-audio.webm", { type: "audio/webm" });

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
    <div>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h1>Lecturer Meeting Evaluator</h1>
        <p><b>Session ID:</b> {sessionId}</p>

        {!recording ? (
          <button
            onClick={startRecording}
            style={{
              padding: "12px",
              background: "green",
              color: "white",
              border: "none"
            }}
          >
            Start AI Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              padding: "12px",
              background: "red",
              color: "white",
              border: "none"
            }}
          >
            Stop & Evaluate
          </button>
        )}

        {loading && <p style={{ marginTop: "20px" }}>Gemini is analyzing the meeting audio...</p>}

        {result && (
          <div style={{ marginTop: "30px", background: "#f3f3f3", padding: "20px", borderRadius: "10px" }}>
            <h2>Meeting Evaluation</h2>
            <p><b>Overall Score:</b> {result.overall_score}</p>
            <p><b>Communication:</b> {result.communication_score}</p>
            <p><b>Clarity:</b> {result.clarity_score}</p>
            <p><b>Confidence:</b> {result.confidence_score}</p>
            <p><b>Technical Depth:</b> {result.technical_depth_score}</p>
            <p><b>Relevance:</b> {result.relevance_score}</p>
            <p><b>Summary:</b> {result.transcript_summary}</p>

            <div style={{ marginTop: "20px" }}>
              <Link to={`/lecturer-report/${sessionId}`}>Open Full Lecturer Report</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LecturerMeetingEvaluator;