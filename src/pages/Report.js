import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { theme, buttonStyles, cardStyle } from "../styles/theme";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Report() {
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("");
  const [strength, setStrength] = useState("");
  const [weakness, setWeakness] = useState("");
  const [tips, setTips] = useState([]);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const finalScore = localStorage.getItem("finalScore");

    if (finalScore) {
      const rounded = Math.round(finalScore);
      setScore(rounded);
      generateReport(rounded);
    }
  }, []);

  const generateReport = (value) => {
    let communication = Math.min(100, value + 8);
    let clarity = Math.min(100, value + 4);
    let confidence = Math.max(35, value - 6);
    let technical = Math.max(40, value - 2);
    let consistency = Math.min(100, value + 2);

    setMetrics([
      { name: "Communication", score: communication },
      { name: "Clarity", score: clarity },
      { name: "Confidence", score: confidence },
      { name: "Technical", score: technical },
      { name: "Consistency", score: consistency }
    ]);

    if (value > 80) {
      setLevel("Excellent");
      setMessage("Outstanding performance. Your responses show strong readiness for real interviews.");
      setStrength("Strong communication, structured answers, and good understanding of interview questions.");
      setWeakness("You can still improve by adding more technical depth and sharper real-world examples.");
      setTips([
        "Add one strong project example to each answer.",
        "Keep using confident and concise language.",
        "Practice deeper explanation for technical questions."
      ]);
    } else if (value > 60) {
      setLevel("Good");
      setMessage("Good performance overall. You are on the right track and getting closer to interview readiness.");
      setStrength("Good effort, relevant answers, and a decent level of clarity.");
      setWeakness("Confidence, answer depth, and structured examples need more improvement.");
      setTips([
        "Practice answering with a clear beginning, middle, and end.",
        "Improve confidence by speaking slightly slower and clearer.",
        "Use more specific examples from your projects or studies."
      ]);
    } else {
      setLevel("Needs Improvement");
      setMessage("You need more practice. Focus on clarity, confidence, and delivering better structured answers.");
      setStrength("You are attempting the questions and building familiarity with the interview flow.");
      setWeakness("Answers need better clarity, stronger confidence, and more relevant supporting details.");
      setTips([
        "Practice speaking aloud daily for confidence.",
        "Use short, simple, and structured answers first.",
        "Add at least one example or fact in each response."
      ]);
    }
  };

  const pieData = [
    { name: "Achieved", value: score },
    { name: "Remaining", value: 100 - score }
  ];

  const pieColors = [theme.primary, "#E2E8F0"];

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 10px 0", color: theme.text, fontSize: "34px" }}>
            Interview Performance Report
          </h1>
          <p style={{ margin: 0, color: theme.subtext, fontSize: "16px" }}>
            A complete overview of your mock interview performance with score insights and improvement guidance.
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
          <div style={cardStyle}>
            <p style={miniTitle}>Overall Score</p>
            <h2 style={bigValue}>{score}/100</h2>
          </div>

          <div style={cardStyle}>
            <p style={miniTitle}>Performance Level</p>
            <h2 style={bigValue}>{level}</h2>
          </div>

          <div style={cardStyle}>
            <p style={miniTitle}>Readiness Status</p>
            <h2 style={bigValue}>{score > 80 ? "Interview Ready" : score > 60 ? "Almost Ready" : "Practice Needed"}</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "24px",
            marginBottom: "28px"
          }}
        >
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Performance Breakdown</h2>
            <p style={sectionText}>
              This chart shows your estimated performance across the key interview dimensions.
            </p>

            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer>
                <BarChart data={metrics}>
                  <XAxis dataKey="name" tick={{ fill: theme.subtext, fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: theme.subtext, fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {metrics.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.score > 75
                            ? theme.success
                            : entry.score > 55
                            ? theme.warning
                            : theme.danger
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitle}>Score Distribution</h2>
            <p style={sectionText}>
              Your final result compared to the remaining improvement area.
            </p>

            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={pieColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ textAlign: "center", marginTop: "-40px" }}>
              <h2 style={{ margin: 0, color: theme.text }}>{score}%</h2>
              <p style={{ margin: "4px 0 0 0", color: theme.subtext }}>Final Score</p>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "28px" }}>
          <h2 style={sectionTitle}>AI Summary</h2>
          <p style={{ color: theme.subtext, lineHeight: "1.8", fontSize: "16px" }}>
            {message}
          </p>

          <div style={{ marginTop: "20px" }}>
            <div style={progressBlock}>
              <div style={progressHeader}>
                <span style={progressLabel}>Overall Progress</span>
                <span style={progressScore}>{score}%</span>
              </div>
              <div style={progressTrack}>
                <div
                  style={{
                    ...progressFill,
                    width: `${score}%`,
                    background:
                      score > 70 ? theme.success : score > 40 ? theme.warning : theme.danger
                  }}
                />
              </div>
            </div>
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
          <div
            style={{
              ...cardStyle,
              background: "#ECFDF5",
              border: "1px solid #BBF7D0"
            }}
          >
            <h2 style={{ ...sectionTitle, color: theme.success }}>Strength</h2>
            <p style={{ color: theme.subtext, lineHeight: "1.8" }}>{strength}</p>
          </div>

          <div
            style={{
              ...cardStyle,
              background: "#FEF2F2",
              border: "1px solid #FECACA"
            }}
          >
            <h2 style={{ ...sectionTitle, color: theme.danger }}>Weakness</h2>
            <p style={{ color: theme.subtext, lineHeight: "1.8" }}>{weakness}</p>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitle}>Improvement Tips</h2>
          <ul style={{ color: theme.subtext, lineHeight: "2", paddingLeft: "20px" }}>
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>

          <button
            style={{ ...buttonStyles.dark, marginTop: "16px" }}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Start Again
          </button>
        </div>
      </div>
    </div>
  );
}

const miniTitle = {
  margin: 0,
  color: theme.subtext,
  fontSize: "14px",
  fontWeight: "600"
};

const bigValue = {
  margin: "10px 0 0 0",
  color: theme.text,
  fontSize: "30px",
  fontWeight: "700"
};

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

const progressBlock = {
  width: "100%"
};

const progressHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
};

const progressLabel = {
  color: theme.text,
  fontWeight: "600"
};

const progressScore = {
  color: theme.primaryDark,
  fontWeight: "700"
};

const progressTrack = {
  width: "100%",
  height: "14px",
  background: "#E2E8F0",
  borderRadius: "999px",
  overflow: "hidden"
};

const progressFill = {
  height: "100%",
  borderRadius: "999px"
};

export default Report;