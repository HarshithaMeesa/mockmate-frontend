import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { theme, buttonStyles } from "../styles/theme";

function LecturerReport() {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session/${sessionId}/meeting-report`)
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch(() => setReport({}));
  }, [sessionId]);

  const safeReport = useMemo(() => {
    const r = report || {};

    return {
      overall_score: r.overall_score ?? 84,
      communication_score: r.communication_score ?? 88,
      clarity_score: r.clarity_score ?? 86,
      confidence_score: r.confidence_score ?? 81,
      technical_depth_score: r.technical_depth_score ?? 79,
      relevance_score: r.relevance_score ?? 87,
      transcript_summary:
        r.transcript_summary ||
        "The candidate demonstrated strong communication and stable relevance across most responses. Technical understanding was good overall, though some answers would benefit from more specific implementation examples and sharper technical articulation.",
      key_points:
        r.key_points?.length > 0
          ? r.key_points
          : [
              "Strong interview presence with good verbal flow.",
              "Consistent relevance to the interviewer’s questions.",
              "Moderate-to-strong technical understanding.",
              "Shows readiness for further interview rounds with targeted refinement."
            ],
      strengths:
        r.strengths?.length > 0
          ? r.strengths
          : [
              "Maintained strong verbal clarity throughout the interview.",
              "Structured answers in a logical and easy-to-follow manner.",
              "Showed good awareness of role expectations and practical responsibilities.",
              "Responded with relevant examples in behavioral questions."
            ],
      weaknesses:
        r.weaknesses?.length > 0
          ? r.weaknesses
          : [
              "Should include deeper technical justification in implementation-related answers.",
              "Could improve confidence during technical explanation segments.",
              "Some examples were strong conceptually but lacked measurable outcomes.",
              "Needs slightly more precision when discussing tools and workflows."
            ],
      improvement_tips:
        r.improvement_tips?.length > 0
          ? r.improvement_tips
          : [
              "Add one concrete project example in every technical answer.",
              "State decisions in a problem → approach → outcome format.",
              "Practice slightly slower delivery for complex technical concepts.",
              "Include measurable results whenever discussing past work."
            ],
      final_recommendation:
        r.final_recommendation ||
        "The student demonstrated a well-rounded and interview-ready profile with strong communication, clear thought structure, and relevant response quality. With modest improvement in technical depth and precision, the candidate appears suitable for advanced mock rounds and further placement-oriented preparation.",
      answer_breakdown:
        r.answer_breakdown?.length > 0
          ? r.answer_breakdown
          : [
              {
                question:
                  "Tell me about yourself and walk me through your background relevant to this role.",
                answer_summary:
                  "The student gave a well-structured self-introduction covering academic background, interest in software development, and a concise overview of relevant projects.",
                score: 86,
                feedback:
                  "Strong opening answer with clear structure and good relevance. Could be improved further by adding one standout project achievement or measurable impact."
              },
              {
                question:
                  "Can you explain a project where you used problem solving to overcome a technical issue?",
                answer_summary:
                  "The student described debugging and improving a project workflow, explained the obstacle clearly, and communicated the reasoning process behind the solution.",
                score: 82,
                feedback:
                  "Good clarity and problem ownership. Technical explanation was solid, but the answer would be stronger with more detail on the exact tools, logic, or measurable result."
              },
              {
                question:
                  "Why do you want this role, and how do you think you fit into it?",
                answer_summary:
                  "The student connected personal interest, learning goals, and prior experience to the role, showing sincere motivation and a reasonable understanding of expectations.",
                score: 78,
                feedback:
                  "Relevant and positive response. To improve, the student should align the answer more directly with the company or role responsibilities rather than staying at a general level."
              }
            ]
    };
  }, [report]);

  const performanceData = [
    { label: "Communication", value: safeReport.communication_score, color: theme.success },
    { label: "Clarity", value: safeReport.clarity_score, color: theme.primary },
    { label: "Confidence", value: safeReport.confidence_score, color: theme.warning },
    { label: "Technical Depth", value: safeReport.technical_depth_score, color: "#8B5CF6" },
    { label: "Relevance", value: safeReport.relevance_score, color: theme.accent }
  ];

  const scorePercent = Math.max(0, Math.min(100, safeReport.overall_score));

  if (!report) {
    return (
      <div style={{ background: "#F4F7FB", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "1260px", margin: "0 auto", padding: "32px 24px 48px" }}>
          <div style={loadingCard}>
            <h2 style={{ marginTop: 0, color: theme.text }}>Loading lecturer report...</h2>
            <p style={{ marginBottom: 0, color: theme.subtext }}>
              Please wait while the report is being prepared.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(180deg,#eef4ff 0%, #f4f7fb 40%, #f8fafc 100%)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1260px", margin: "0 auto", padding: "32px 24px 48px" }}>
        {/* HERO */}
        <section style={heroSection}>
          <div>
            <div style={pillStyle}>Lecturer-Led Interview Assessment Report</div>
            <h1 style={heroTitle}>MockMate AI Evaluation Summary</h1>
            <p style={heroText}>
              This report presents a structured lecturer-led interview assessment based on
              communication quality, confidence, clarity, technical depth, relevance, and
              overall answer effectiveness during the mock interview session.
            </p>
          </div>

          <div style={topMetaCard}>
            <MetaRow label="Student" value="Harshitha M." />
            <MetaRow label="Role" value="Software Engineer" />
            <MetaRow label="Lecturer" value="Prof. S. Reddy" />
            <MetaRow label="Date" value="20 March 2026" />
            <MetaRow label="Session ID" value={sessionId} isLast />
          </div>
        </section>

        {/* TOP STATS */}
        <section style={gridFour}>
          <StatCard
            title="Overall Score"
            value={`${safeReport.overall_score}/100`}
            chip="Strong Performance"
            chipBg="#DBEAFE"
            chipColor="#1E3A8A"
          />
          <StatCard
            title="Communication"
            value={`${safeReport.communication_score}/100`}
            chip="Clear & Fluent"
            chipBg="#DCFCE7"
            chipColor="#166534"
          />
          <StatCard
            title="Technical Depth"
            value={`${safeReport.technical_depth_score}/100`}
            chip="Moderately Strong"
            chipBg="#FFF7ED"
            chipColor="#C2410C"
          />
          <StatCard
            title="Confidence"
            value={`${safeReport.confidence_score}/100`}
            chip="Needs Slight Polish"
            chipBg="#FEE2E2"
            chipColor="#B91C1C"
          />
        </section>

        {/* PERFORMANCE + DONUT */}
        <section style={layoutTwo}>
          <div style={card}>
            <h2 style={sectionTitle}>Performance Breakdown</h2>
            <p style={sectionSub}>
              Category-wise lecturer evaluation based on answer quality and delivery.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
              {performanceData.map((item, index) => (
                <div key={index}>
                  <div style={barLabelRow}>
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div style={track}>
                    <div
                      style={{
                        ...fill,
                        width: `${item.value}%`,
                        background: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Score Distribution</h2>
            <p style={sectionSub}>
              Overall achievement compared to remaining improvement space.
            </p>

            <div style={donutWrap}>
              <div
                style={{
                  ...donut,
                  background: `conic-gradient(${theme.primary} 0 ${scorePercent}%, #DBE7F7 ${scorePercent}% 100%)`
                }}
              >
                <div style={donutInner} />
                <div style={donutCenter}>
                  <h2 style={{ margin: 0, fontSize: "34px" }}>{scorePercent}%</h2>
                  <p style={{ margin: "4px 0 0", color: theme.subtext, fontSize: "13px", fontWeight: "600" }}>
                    Final Score
                  </p>
                </div>
              </div>
            </div>

            <div style={summaryBox}>
              {safeReport.transcript_summary}
            </div>
          </div>
        </section>

        {/* STRENGTHS / WEAKNESSES */}
        <section style={gridTwo}>
          <div style={{ ...card, background: "#ECFDF5", border: "1px solid #BBF7D0" }}>
            <h2 style={{ ...sectionTitle, color: "#166534" }}>Key Strengths</h2>
            <ul style={cleanList}>
              {safeReport.strengths.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...card, background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <h2 style={{ ...sectionTitle, color: "#B91C1C" }}>Areas to Improve</h2>
            <ul style={cleanList}>
              {safeReport.weaknesses.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* KEY TAKEAWAYS / TIPS */}
        <section style={gridTwo}>
          <div style={{ ...card, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <h2 style={sectionTitle}>Key Takeaways</h2>
            <ul style={cleanList}>
              {safeReport.key_points.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...card, background: "#FFF7ED", border: "1px solid #FED7AA" }}>
            <h2 style={sectionTitle}>Improvement Tips</h2>
            <ul style={cleanList}>
              {safeReport.improvement_tips.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* FINAL RECOMMENDATION */}
        <section style={recommendationBox}>
          <h3 style={{ margin: "0 0 10px", color: "#1E3A8A", fontSize: "22px" }}>
            Final Recommendation
          </h3>
          <p style={{ margin: 0, lineHeight: "1.8", color: "#334155" }}>
            {safeReport.final_recommendation}
          </p>
        </section>

        {/* ANSWER BREAKDOWN */}
        <section style={{ marginTop: "22px" }}>
          <div style={card}>
            <h2 style={sectionTitle}>Answer Breakdown</h2>
            <p style={sectionSub}>
              Detailed question-by-question lecturer-style feedback.
            </p>

            {safeReport.answer_breakdown.map((item, idx) => (
              <div key={idx} style={questionCard}>
                <div style={questionHead}>
                  <h3 style={{ margin: 0, fontSize: "20px" }}>Question {idx + 1}</h3>
                  <span
                    style={{
                      ...scoreBadge,
                      background:
                        item.score > 80 ? "#DCFCE7" : item.score > 70 ? "#DBEAFE" : "#FFF7ED",
                      color:
                        item.score > 80 ? "#166534" : item.score > 70 ? "#1E3A8A" : "#C2410C"
                    }}
                  >
                    Score: {item.score}/100
                  </span>
                </div>

                <p style={label}>Question</p>
                <p style={body}>{item.question}</p>

                <p style={label}>Answer Summary</p>
                <p style={body}>{item.answer_summary}</p>

                <p style={label}>Feedback</p>
                <p style={{ ...body, marginBottom: 0 }}>{item.feedback}</p>
              </div>
            ))}

            <button
              style={{ ...buttonStyles.dark, marginTop: "22px" }}
              onClick={() => window.print()}
            >
              Download / Print Report
            </button>
          </div>
        </section>

        <p style={footerNote}>
          Generated by MockMate AI • Lecturer-Led Mock Interview Assessment • Demo Preview
        </p>
      </div>
    </div>
  );
}

function MetaRow({ label, value, isLast = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "14px",
        padding: "10px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.14)",
        fontSize: "14px"
      }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatCard({ title, value, chip, chipBg, chipColor }) {
  return (
    <div style={card}>
      <p style={statTitle}>{title}</p>
      <h2 style={statValue}>{value}</h2>
      <span
        style={{
          display: "inline-block",
          marginTop: "12px",
          padding: "7px 12px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: "700",
          background: chipBg,
          color: chipColor
        }}
      >
        {chip}
      </span>
    </div>
  );
}

const loadingCard = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "20px",
  boxShadow: "0 14px 35px rgba(15,23,42,.08)",
  padding: "40px",
  textAlign: "center"
};

const heroSection = {
  background: `linear-gradient(135deg, ${theme.primaryDark}, ${theme.primary})`,
  color: "#FFFFFF",
  padding: "30px 34px",
  borderRadius: "28px",
  boxShadow: "0 14px 35px rgba(15,23,42,.08)",
  display: "flex",
  justifyContent: "space-between",
  gap: "24px",
  alignItems: "flex-start"
};

const pillStyle = {
  display: "inline-block",
  background: "rgba(255,255,255,.14)",
  border: "1px solid rgba(255,255,255,.2)",
  padding: "9px 14px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "700",
  marginBottom: "14px",
  letterSpacing: ".2px"
};

const heroTitle = {
  margin: "0 0 8px",
  fontSize: "34px",
  lineHeight: "1.15"
};

const heroText = {
  margin: 0,
  color: "rgba(255,255,255,.9)",
  lineHeight: "1.7",
  maxWidth: "760px"
};

const topMetaCard = {
  minWidth: "250px",
  background: "rgba(255,255,255,.1)",
  border: "1px solid rgba(255,255,255,.18)",
  borderRadius: "20px",
  padding: "18px"
};

const gridFour = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "18px",
  marginTop: "22px"
};

const gridTwo = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginTop: "22px"
};

const layoutTwo = {
  display: "grid",
  gridTemplateColumns: "1.25fr .95fr",
  gap: "20px",
  marginTop: "22px"
};

const card = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "20px",
  boxShadow: "0 14px 35px rgba(15,23,42,.08)",
  padding: "22px"
};

const statTitle = {
  color: "#64748B",
  fontSize: "13px",
  fontWeight: "700",
  margin: "0 0 12px",
  textTransform: "uppercase",
  letterSpacing: ".4px"
};

const statValue = {
  fontSize: "31px",
  fontWeight: "800",
  margin: 0
};

const sectionTitle = {
  margin: "0 0 8px",
  fontSize: "24px",
  color: theme.text
};

const sectionSub = {
  margin: "0 0 18px",
  color: "#64748B",
  lineHeight: "1.7",
  fontSize: "14px"
};

const barLabelRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "7px",
  fontSize: "14px",
  fontWeight: "600"
};

const track = {
  width: "100%",
  height: "12px",
  background: "#E9EEF5",
  borderRadius: "999px",
  overflow: "hidden"
};

const fill = {
  height: "100%",
  borderRadius: "999px"
};

const donutWrap = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "14px 0 8px"
};

const donut = {
  width: "210px",
  height: "210px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  position: "relative"
};

const donutInner = {
  position: "absolute",
  width: "130px",
  height: "130px",
  borderRadius: "50%",
  background: "#FFFFFF",
  boxShadow: "inset 0 0 0 1px #E2E8F0"
};

const donutCenter = {
  position: "relative",
  zIndex: 1,
  textAlign: "center"
};

const summaryBox = {
  background: "#F8FBFF",
  border: "1px solid #DBEAFE",
  borderRadius: "18px",
  padding: "20px",
  lineHeight: "1.8",
  color: "#334155"
};

const cleanList = {
  margin: 0,
  paddingLeft: "18px",
  color: "#475569",
  lineHeight: "1.95"
};

const recommendationBox = {
  marginTop: "22px",
  background: "linear-gradient(135deg,#eff6ff,#f8fbff)",
  border: "1px solid #BFDBFE",
  borderRadius: "20px",
  padding: "22px"
};

const questionCard = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "18px",
  boxShadow: "0 14px 35px rgba(15,23,42,.08)",
  padding: "22px",
  marginTop: "16px"
};

const questionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  marginBottom: "16px",
  flexWrap: "wrap"
};

const scoreBadge = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "800",
  whiteSpace: "nowrap"
};

const label = {
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: ".35px",
  color: "#64748B",
  fontWeight: "800",
  margin: "0 0 6px"
};

const body = {
  margin: "0 0 16px",
  color: "#334155",
  lineHeight: "1.8"
};

const footerNote = {
  marginTop: "26px",
  textAlign: "center",
  color: "#64748B",
  fontSize: "13px"
};

export default LecturerReport;