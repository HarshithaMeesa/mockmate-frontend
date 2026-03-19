import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function LecturerReport() {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session/${sessionId}/pro-report`)
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
        <h1>Pro Lecturer Report</h1>

        <p><b>Interview Role:</b> {report.role}</p>
        <p><b>Time:</b> {report.time}</p>
        <p><b>Average Score:</b> {report.average_score}</p>

        <div style={{ marginTop: "20px", background: "#f3f3f3", padding: "20px", borderRadius: "10px" }}>
          <h3>Summary</h3>
          <p>{report.summary}</p>

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
          <h2>Answer-Level Details</h2>
          {report.details?.map((item, idx) => (
            <div key={idx} style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
              <p><b>Question:</b> {item.question}</p>
              <p><b>Answer:</b> {item.answer}</p>
              <p><b>Overall Score:</b> {item.evaluation?.overall_score}</p>
              <p><b>Summary:</b> {item.evaluation?.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LecturerReport;