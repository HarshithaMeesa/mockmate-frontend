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
      .catch(() => setReport({ error: true }));
  }, [sessionId]);

  const safeReport = useMemo(() => {
    const r = report || {};

    return {
      student_name: r.student_name || "Not available",
      role: r.role || "Not available",
      lecturer_name: r.lecturer_name || "Not available",
      date: r.date || r.time || "Not available",
      overall_score: typeof r.overall_score === "number" ? r.overall_score : null,
      communication_score: typeof r.communication_score === "number" ? r.communication_score : null,
      clarity_score: typeof r.clarity_score === "number" ? r.clarity_score : null,
      confidence_score: typeof r.confidence_score === "number" ? r.confidence_score : null,
      technical_depth_score: typeof r.technical_depth_score === "number" ? r.technical_depth_score : null,
      relevance_score: typeof r.relevance_score === "number" ? r.relevance_score : null,
      transcript_summary: r.transcript_summary || "",
      key_points: Array.isArray(r.key_points) ? r.key_points : [],
      strengths: Array.isArray(r.strengths) ? r.strengths : [],
      weaknesses: Array.isArray(r.weaknesses) ? r.weaknesses : [],
      improvement_tips: Array.isArray(r.improvement_tips) ? r.improvement_tips : [],
      final_recommendation: r.final_recommendation || "",
      answer_breakdown: Array.isArray(r.answer_breakdown) ? r.answer_breakdown : []
    };
  }, [report]);

  const performanceData = [
    { label: "Communication", value: safeReport.communication_score, color: theme.success },
    { label: "Clarity", value: safeReport.clarity_score, color: theme.primary },
    { label: "Confidence", value: safeReport.confidence_score, color: theme.warning },
    { label: "Technical Depth", value: safeReport.technical_depth_score, color: "#8B5CF6" },
    { label: "Relevance", value: safeReport.relevance_score, color: theme.accent }
  ];

  const hasAnyScores = performanceData.some((item) => typeof item.value === "number");
  const scorePercent =
    typeof safeReport.overall_score === "number"
      ? Math.max(0, Math.min(100, safeReport.overall_score))
      : null;

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

  if (report.error) {
    return (
      <div style={{ background: "#F4F7FB", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "1260px", margin: "0 auto", padding: "32px 24px 48px" }}>
          <div style={loadingCard}>
            <h2 style={{ marginTop: 0, color: theme.text }}>Unable to load report</h2>
            <p style={{ marginBottom: 0, color: theme.subtext }}>
              Please try again later.
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
            <MetaRow label="Student" value={safeReport.student_name} />
            <MetaRow label="Role" value={safeReport.role} />
            <MetaRow label="Lecturer" value={safeReport.lecturer_name} />
            <MetaRow label="Date" value={safeReport.date} />
            <MetaRow label="Session ID" value={sessionId} isLast />
          </div>
        </section>

        <section style={gridFour}>
          <StatCard
            title="Overall Score"
            value={formatScore(safeReport.overall_score)}
            chip={getScoreChip(safeReport.overall_score).text}
            chipBg={getScoreChip(safeReport.overall_score).bg}
            chipColor={getScoreChip(safeReport.overall_score).color}
          />
          <StatCard
            title="Communication"
            value={formatScore(safeReport.communication_score)}
            chip="Verbal Delivery"
            chipBg="#DCFCE7"
            chipColor="#166534"
          />
          <StatCard
            title="Technical Depth"
            value={formatScore(safeReport.technical_depth_score)}
            chip="Knowledge Level"
            chipBg="#FFF7ED"
            chipColor="#C2410C"
          />
          <StatCard
            title="Confidence"
            value={formatScore(safeReport.confidence_score)}
            chip="Presentation Style"
            chipBg="#FEE2E2"
            chipColor="#B91C1C"
          />
        </section>

        <section style={layoutTwo}>
          <div style={card}>
            <h2 style={sectionTitle}>Performance Breakdown</h2>
            <p style={sectionSub}>
              Category-wise lecturer evaluation based on answer quality and delivery.
            </p>

            {hasAnyScores ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                {performanceData.map((item, index) => (
                  <div key={index}>
                    <div style={barLabelRow}>
                      <span>{item.label}</span>
                      <span>{typeof item.value === "number" ? item.value : "N/A"}</span>
                    </div>
                    <div style={track}>
                      <div
                        style={{
                          ...fill,
                          width: typeof item.value === "number" ? `${item.value}%` : "0%",
                          background: item.color,
                          opacity: typeof item.value === "number" ? 1 : 0.2
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyBox text="No score data available yet." />
            )}
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Score Distribution</h2>
            <p style={sectionSub}>
              Overall achievement compared to remaining improvement space.
            </p>

            {scorePercent !== null ? (
              <>
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
                  {safeReport.transcript_summary || "No transcript summary available yet."}
                </div>
              </>
            ) : (
              <EmptyBox text="No overall score available yet." />
            )}
          </div>
        </section>

        <section style={gridTwo}>
          <div style={{ ...card, background: "#ECFDF5", border: "1px solid #BBF7D0" }}>
            <h2 style={{ ...sectionTitle, color: "#166534" }}>Key Strengths</h2>
            {safeReport.strengths.length > 0 ? (
              <ul style={cleanList}>
                {safeReport.strengths.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            ) : (
              <EmptyListText text="No strengths available." />
            )}
          </div>

          <div style={{ ...card, background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <h2 style={{ ...sectionTitle, color: "#B91C1C" }}>Areas to Improve</h2>
            {safeReport.weaknesses.length > 0 ? (
              <ul style={cleanList}>
                {safeReport.weaknesses.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            ) : (
              <EmptyListText text="No weaknesses available." />
            )}
          </div>
        </section>

        <section style={gridTwo}>
          <div style={{ ...card, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <h2 style={sectionTitle}>Key Takeaways</h2>
            {safeReport.key_points.length > 0 ? (
              <ul style={cleanList}>
                {safeReport.key_points.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            ) : (
              <EmptyListText text="No key points available." />
            )}
          </div>

          <div style={{ ...card, background: "#FFF7ED", border: "1px solid #FED7AA" }}>
            <h2 style={sectionTitle}>Improvement Tips</h2>
            {safeReport.improvement_tips.length > 0 ? (
              <ul style={cleanList}>
                {safeReport.improvement_tips.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            ) : (
              <EmptyListText text="No improvement tips available." />
            )}
          </div>
        </section>

        <section style={recommendationBox}>
          <h3 style={{ margin: "0 0 10px", color: "#1E3A8A", fontSize: "22px" }}>
            Final Recommendation
          </h3>
          <p style={{ margin: 0, lineHeight: "1.8", color: "#334155" }}>
            {safeReport.final_recommendation || "No final recommendation available."}
          </p>
        </section>

        <section style={{ marginTop: "22px" }}>
          <div style={card}>
            <h2 style={sectionTitle}>Answer Breakdown</h2>
            <p style={sectionSub}>
              Detailed question-by-question lecturer-style feedback.
            </p>

            {safeReport.answer_breakdown.length > 0 ? (
              safeReport.answer_breakdown.map((item, idx) => (
                <div key={idx} style={questionCard}>
                  <div style={questionHead}>
                    <h3 style={{ margin: 0, fontSize: "20px" }}>Question {idx + 1}</h3>
                    <span
                      style={{
                        ...scoreBadge,
                        background:
                          typeof item.score === "number"
                            ? item.score > 80
                              ? "#DCFCE7"
                              : item.score > 70
                              ? "#DBEAFE"
                              : "#FFF7ED"
                            : "#E2E8F0",
                        color:
                          typeof item.score === "number"
                            ? item.score > 80
                              ? "#166534"
                              : item.score > 70
                              ? "#1E3A8A"
                              : "#C2410C"
                            : "#475569"
                      }}
                    >
                      {typeof item.score === "number" ? `Score: ${item.score}/100` : "Score: N/A"}
                    </span>
                  </div>

                  <p style={label}>Question</p>
                  <p style={body}>{item.question || "Not available"}</p>

                  <p style={label}>Answer Summary</p>
                  <p style={body}>{item.answer_summary || "Not available"}</p>

                  <p style={label}>Feedback</p>
                  <p style={{ ...body, marginBottom: 0 }}>{item.feedback || "Not available"}</p>
                </div>
              ))
            ) : (
              <EmptyBox text="No answer breakdown available yet." />
            )}

            <button
              style={{ ...buttonStyles.dark, marginTop: "22px" }}
              onClick={() => window.print()}
            >
              Download / Print Report
            </button>
          </div>
        </section>

        <p style={footerNote}>
          Generated by MockMate AI • Lecturer-Led Mock Interview Assessment
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

function EmptyBox({ text }) {
  return (
    <div
      style={{
        marginTop: "10px",
        padding: "18px",
        borderRadius: "16px",
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        color: "#64748B",
        lineHeight: "1.7"
      }}
    >
      {text}
    </div>
  );
}

function EmptyListText({ text }) {
  return <p style={{ margin: 0, color: "#64748B", lineHeight: "1.8" }}>{text}</p>;
}

function formatScore(value) {
  return typeof value === "number" ? `${value}/100` : "Not available";
}

function getScoreChip(value) {
  if (typeof value !== "number") {
    return { text: "No Score Yet", bg: "#E2E8F0", color: "#475569" };
  }
  if (value >= 85) {
    return { text: "Strong Performance", bg: "#DBEAFE", color: "#1E3A8A" };
  }
  if (value >= 70) {
    return { text: "Good Performance", bg: "#DCFCE7", color: "#166534" };
  }
  return { text: "Needs Improvement", bg: "#FEF3C7", color: "#C2410C" };
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