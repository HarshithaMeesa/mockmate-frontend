import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function LecturerReport() {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session/${sessionId}/meeting-report`)
      .then((res) => res.json())
      .then((data) => setReport(data));
  }, [sessionId]);

  if (!report) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "40px" }}>
          <h2>Loading lecturer report...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h1>Lecturer AI Report</h1>

        <p><b>Overall Score:</b> {report.overall_score}</p>
        <p><b>Communication:</b> {report.communication_score}</p>
        <p><b>Clarity:</b> {report.clarity_score}</p>
        <p><b>Confidence:</b> {report.confidence_score}</p>
        <p><b>Technical Depth:</b> {report.technical_depth_score}</p>
        <p><b>Relevance:</b> {report.relevance_score}</p>

        <div style={{ marginTop: "20px", background: "#f3f3f3", padding: "20px", borderRadius: "10px" }}>
          <h3>Transcript Summary</h3>
          <p>{report.transcript_summary}</p>

          <h3>Key Points</h3>
          <ul>{report.key_points?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

          <h3>Strengths</h3>
          <ul>{report.strengths?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

          <h3>Weaknesses</h3>
          <ul>{report.weaknesses?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

          <h3>Improvement Tips</h3>
          <ul>{report.improvement_tips?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

          <h3>Final Recommendation</h3>
          <p>{report.final_recommendation}</p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>Answer Breakdown</h2>
          {report.answer_breakdown?.map((item, idx) => (
            <div key={idx} style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
              <p><b>Question:</b> {item.question}</p>
              <p><b>Answer Summary:</b> {item.answer_summary}</p>
              <p><b>Score:</b> {item.score}</p>
              <p><b>Feedback:</b> {item.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LecturerReport;