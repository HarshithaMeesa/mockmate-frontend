import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { theme, cardStyle, buttonStyles } from "../styles/theme";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

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
      <div style={{ background: theme.background, minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ ...cardStyle, textAlign: "center", padding: "40px" }}>
            <h2 style={{ color: theme.text, marginTop: 0 }}>Loading lecturer report...</h2>
            <p style={{ color: theme.subtext, marginBottom: 0 }}>
              Please wait while the AI evaluation report is being prepared.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scoreCards = [
    { title: "Overall Score", value: report.overall_score || 0, color: theme.primaryDark, bg: "#DBEAFE" },
    { title: "Communication", value: report.communication_score || 0, color: theme.success, bg: "#DCFCE7" },
    { title: "Clarity", value: report.clarity_score || 0, color: theme.warning, bg: "#FEF3C7" },
    { title: "Confidence", value: report.confidence_score || 0, color: theme.danger, bg: "#FEE2E2" }
  ];

  const performanceData = [
    { name: "Communication", score: report.communication_score || 0 },
    { name: "Clarity", score: report.clarity_score || 0 },
    { name: "Confidence", score: report.confidence_score || 0 },
    { name: "Technical", score: report.technical_depth_score || 0 },
    { name: "Relevance", score: report.relevance_score || 0 }
  ];

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 10px 0", color: theme.text, fontSize: "34px" }}>
            Lecturer AI Report
          </h1>
          <p style={{ margin: 0, color: theme.subtext, fontSize: "16px" }}>
            Detailed evaluation of the lecturer-led interview session with AI-generated feedback and performance insights.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "28px"
          }}
        >
          {scoreCards.map((item, index) => (
            <div key={index} style={cardStyle}>
              <p style={{ margin: 0, color: theme.subtext, fontWeight: "600" }}>
                {item.title}
              </p>
              <div
                style={{
                  marginTop: "16px",
                  display: "inline-block",
                  padding: "10px 16px",
                  borderRadius: "999px",
                  background: item.bg,
                  color: item.color,
                  fontSize: "28px",
                  fontWeight: "700"
                }}
              >
                {item.value}/100
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "24px",
            marginBottom: "28px"
          }}
        >
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Performance Breakdown</h2>
            <p style={sectionText}>
              Category-wise performance of the candidate based on the interview recording and AI evaluation.
            </p>

            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer>
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" tick={{ fill: theme.subtext, fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: theme.subtext, fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="score"
                    radius={[8, 8, 0, 0]}
                    fill={theme.primary}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitle}>Skill Profile</h2>
            <p style={sectionText}>
              Radar overview of the student’s overall interview competency.
            </p>

            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer>
                <RadarChart data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" tick={{ fill: theme.subtext, fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke={theme.primary}
                    fill={theme.primary}
                    fillOpacity={0.45}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "28px" }}>
          <h2 style={sectionTitle}>Transcript Summary</h2>
          <p style={{ color: theme.subtext, lineHeight: "1.9", marginBottom: 0 }}>
            {report.transcript_summary || "No transcript summary available."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "28px"
          }}
        >
          <div
            style={{
              ...cardStyle,
              background: "#ECFDF5",
              border: "1px solid #BBF7D0"
            }}
          >
            <h2 style={{ ...sectionTitle, color: theme.success }}>Strengths</h2>
            <ul style={listStyle}>
              {report.strengths?.length > 0
                ? report.strengths.map((item, idx) => <li key={idx}>{item}</li>)
                : <li>No strengths available.</li>}
            </ul>
          </div>

          <div
            style={{
              ...cardStyle,
              background: "#FEF2F2",
              border: "1px solid #FECACA"
            }}
          >
            <h2 style={{ ...sectionTitle, color: theme.danger }}>Weaknesses</h2>
            <ul style={listStyle}>
              {report.weaknesses?.length > 0
                ? report.weaknesses.map((item, idx) => <li key={idx}>{item}</li>)
                : <li>No weaknesses available.</li>}
            </ul>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "28px"
          }}
        >
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Key Points</h2>
            <ul style={listStyle}>
              {report.key_points?.length > 0
                ? report.key_points.map((item, idx) => <li key={idx}>{item}</li>)
                : <li>No key points available.</li>}
            </ul>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitle}>Improvement Tips</h2>
            <ul style={listStyle}>
              {report.improvement_tips?.length > 0
                ? report.improvement_tips.map((item, idx) => <li key={idx}>{item}</li>)
                : <li>No improvement tips available.</li>}
            </ul>
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            marginBottom: "28px",
            background: "#EFF6FF",
            border: `1px solid ${theme.accent}`
          }}
        >
          <h2 style={{ ...sectionTitle, color: theme.primaryDark }}>Final Recommendation</h2>
          <p style={{ color: theme.subtext, lineHeight: "1.9", marginBottom: 0 }}>
            {report.final_recommendation || "No final recommendation available."}
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitle}>Answer Breakdown</h2>
          <p style={sectionText}>
            Detailed breakdown of each identified question-answer pair from the interview recording.
          </p>

          {report.answer_breakdown?.length > 0 ? (
            report.answer_breakdown.map((item, idx) => (
              <div
                key={idx}
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "14px",
                  background: "#FFFFFF"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "14px"
                  }}
                >
                  <h3 style={{ margin: 0, color: theme.text }}>Question {idx + 1}</h3>
                  <span
                    style={{
                      padding: "8px 14px",
                      borderRadius: "999px",
                      background:
                        item.score > 75 ? "#DCFCE7" : item.score > 55 ? "#FEF3C7" : "#FEE2E2",
                      color:
                        item.score > 75 ? theme.success : item.score > 55 ? theme.warning : theme.danger,
                      fontWeight: "700",
                      fontSize: "14px"
                    }}
                  >
                    Score: {item.score}/100
                  </span>
                </div>

                <p style={labelText}>Question</p>
                <p style={bodyText}>{item.question}</p>

                <p style={labelText}>Answer Summary</p>
                <p style={bodyText}>{item.answer_summary}</p>

                <p style={labelText}>Feedback</p>
                <p style={{ ...bodyText, marginBottom: 0 }}>{item.feedback}</p>
              </div>
            ))
          ) : (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "14px",
                background: "#F8FAFC",
                border: `1px solid ${theme.border}`,
                color: theme.subtext
              }}
            >
              No answer breakdown available yet.
            </div>
          )}

          <button
            style={{ ...buttonStyles.dark, marginTop: "24px" }}
            onClick={() => window.print()}
          >
            Download / Print Report
          </button>
        </div>
      </div>
    </div>
  );
}



const sectionTitle = {
  marginTop: 0,
  marginBottom: "8px",
  color: theme.text,
  fontSize: "24px"
};

const sectionText = {
  marginTop: 0,
  color: theme.subtext,
  fontSize: "14px",
  lineHeight: "1.7"
};

const listStyle = {
  margin: 0,
  paddingLeft: "20px",
  color: theme.subtext,
  lineHeight: "2"
};

const labelText = {
  margin: "0 0 6px 0",
  color: theme.text,
  fontWeight: "700",
  fontSize: "14px"
};

const bodyText = {
  margin: "0 0 16px 0",
  color: theme.subtext,
  lineHeight: "1.8"
};

export default LecturerReport;