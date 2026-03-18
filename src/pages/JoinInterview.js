import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function JoinInterview() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/session/${id}`)
      .then(res => res.json())
      .then(data => setSession(data));
  }, [id]);

  const startInterview = () => {
    navigate("/live-room", {
      state: {
        sessionId: id,
        role: session.role
      }
    });
  };

  if (!session) return <h2>Loading interview...</h2>;

  return (
    <div style={{ padding: "40px", textAlign:"center" }}>

      <h1>Join Interview</h1>

      <p><b>Role:</b> {session.role}</p>
      <p><b>Time:</b> {session.time}</p>

      <button
        onClick={startInterview}
        style={{
          padding: "12px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Join Interview
      </button>

    </div>
  );
}

export default JoinInterview;