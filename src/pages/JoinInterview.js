import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function JoinInterview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session/${id}`)
      .then(res => res.json())
      .then(data => setSession(data));
  }, [id]);

  const joinAsStudent = () => {
    navigate("/jitsi-room", {
      state: {
        sessionId: id,
        userType: "student",
        interviewRole: session.role
      }
    });
  };

  if (!session) return <h2>Loading interview...</h2>;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Join Interview</h1>

      <p><b>Interview Role:</b> {session.role}</p>
      <p><b>Time:</b> {session.time}</p>

      <button
        onClick={joinAsStudent}
        style={{
          padding: "12px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Join as Student
      </button>
    </div>
  );
}

export default JoinInterview;