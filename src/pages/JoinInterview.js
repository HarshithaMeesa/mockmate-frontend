import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JoinInterview() {
  const { id } = useParams();

  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session/${id}`)
      .then(res => res.json())
      .then(data => setSession(data));
  }, [id]);

  const joinAsStudent = () => {
    const roomLink = `https://meet.jit.si/mockmate-${id}`;
    window.open(roomLink, "_blank");
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