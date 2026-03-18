import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Report() {

  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {

    const finalScore = localStorage.getItem("finalScore");

    if (finalScore) {
      const rounded = Math.round(finalScore);
      setScore(rounded);
      generateReport(rounded);
    }

  }, []);

  const generateReport = (score) => {

    if (score > 80) {
      setLevel("Excellent");
      setMessage("You performed really well. You're interview ready!");
    } 
    else if (score > 60) {
      setLevel("Good");
      setMessage("Good job! With a bit more practice, you'll be perfect.");
    } 
    else {
      setLevel("Needs Improvement");
      setMessage("Keep practicing. Focus on clarity and confidence.");
    }

  };

  return (

    <div>

      <Navbar />

      <div style={{
        padding: "40px",
        display: "flex",
        justifyContent: "center"
      }}>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center"
        }}>

          <h1>Interview Report</h1>

          {/* 🔥 SCORE */}
          <h2 style={{ marginTop: "20px" }}>
            {score}/100
          </h2>

          {/* 🔥 PROGRESS BAR */}
          <div style={{
            width: "100%",
            height: "12px",
            background: "#ddd",
            borderRadius: "10px",
            marginTop: "15px"
          }}>
            <div style={{
              width: `${score}%`,
              height: "100%",
              background: score > 70 
                ? "green" 
                : score > 40 
                ? "orange" 
                : "red",
              borderRadius: "10px"
            }}></div>
          </div>

          {/* 🔥 LEVEL */}
          <h3 style={{ marginTop: "20px" }}>
            {level}
          </h3>

          {/* 🔥 MESSAGE */}
          <p style={{ marginTop: "10px" }}>
            {message}
          </p>

          {/* 🔥 STRENGTH / WEAKNESS */}
          <div style={{ marginTop: "20px", textAlign: "left" }}>

            <h4>Strength</h4>
            <p>
              {score > 70 
                ? "Good communication and understanding."
                : "You are trying well, keep improving."}
            </p>

            <h4>Weakness</h4>
            <p>
              {score > 70 
                ? "Can improve depth in answers."
                : "Needs better clarity and confidence."}
            </p>

          </div>

          {/* 🔥 RESTART BUTTON */}
          <button
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "black",
              color: "white",
              border: "none"
            }}
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

export default Report;