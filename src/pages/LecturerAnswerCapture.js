import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, Link } from "react-router-dom";

function LecturerAnswerCapture() {
  const location = useLocation();
  const sessionId = location.state?.sessionId;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const evaluateNow = async () => {
    setLoading(true);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/session/${sessionId}/evaluate-live-answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question,
          answer
        })
      }
    );

    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h1>Lecturer AI Evaluator</h1>
        <p><b>Session ID:</b> {sessionId}</p>

        <div style={{ marginTop: "20px" }}>
          <h3>Question</h3>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>Student Answer</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <button
          onClick={evaluateNow}
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "green",
            color: "white",
            border: "none"
          }}
        >
          Evaluate Answer
        </button>

        <Link
          to={`/lecturer-report/${sessionId}`}
          style={{ marginLeft: "20px" }}
        >
          Open Lecturer Report
        </Link>

        {loading && <p style={{ marginTop: "20px" }}>Gemini is generating pro feedback...</p>}

        {result && (
          <div style={{ marginTop: "30px", background: "#f3f3f3", padding: "20px", borderRadius: "10px" }}>
            <h2>AI Evaluation Result</h2>
            <p><b>Overall Score:</b> {result.overall_score}</p>
            <p><b>Communication:</b> {result.communication_score}</p>
            <p><b>Clarity:</b> {result.clarity_score}</p>
            <p><b>Confidence:</b> {result.confidence_score}</p>
            <p><b>Technical Depth:</b> {result.technical_depth_score}</p>
            <p><b>Relevance:</b> {result.relevance_score}</p>
            <p><b>Summary:</b> {result.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LecturerAnswerCapture;