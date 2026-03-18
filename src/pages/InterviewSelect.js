import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function InterviewSelect() {
  const navigate = useNavigate();

  // Student practice mode
  const startInterview = (role) => {
    navigate("/room", { state: { role: role } });
  };

  // Lecturer mode
  const createSession = async (role) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/create-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        role: role,
        time: new Date().toISOString(),
        questions: []
      })
    });

    const data = await response.json();

    const studentLink = data.link;
    const roomLink = `https://meet.jit.si/mockmate-${data.session_id}`;

    await navigator.clipboard.writeText(studentLink);

    const openNow = window.confirm(
      `Student link copied:\n\n${studentLink}\n\nLecturer room:\n${roomLink}\n\nPress OK to open lecturer room now.`
    );

    if (openNow) {
      window.location.href = roomLink;
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to create interview link");
  }
};

  return (
    <div>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <h1>Select Interview Type</h1>
        <p>Choose the role you want to practice for.</p>

        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 250px)",
            gap: "20px"
          }}
        >
          <button
            onClick={() => startInterview("Data Analyst")}
            style={cardStyle}
          >
            Data Analyst
          </button>

          <button
            onClick={() => startInterview("Data Scientist")}
            style={cardStyle}
          >
            Data Scientist
          </button>

          <button
            onClick={() => startInterview("Software Engineer")}
            style={cardStyle}
          >
            Software Engineer
          </button>

          <button
            onClick={() => startInterview("Custom Interview")}
            style={cardStyle}
          >
            Custom Interview
          </button>
        </div>

        <h2 style={{ marginTop: "60px" }}>Conduct Interview (Lecturer)</h2>

        <button
          onClick={() => createSession("Software Engineer")}
          style={linkStyle}
        >
          Generate Interview Link
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "30px",
  background: "#f3f3f3",
  border: "1px solid #ddd",
  cursor: "pointer",
  fontSize: "16px"
};

const linkStyle = {
  padding: "15px",
  background: "green",
  color: "white",
  border: "none",
  cursor: "pointer",
  marginTop: "10px"
};

export default InterviewSelect;