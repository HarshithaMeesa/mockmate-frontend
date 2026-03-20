import BehaviorMonitor from "../components/BehaviorMonitor";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Avatar from "../components/Avatar";
import { useNavigate } from "react-router-dom";
import { theme, buttonStyles, cardStyle } from "../styles/theme";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

function InterviewRoom() {
  const navigate = useNavigate();

  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [scores, setScores] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  const questions = useMemo(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions"));

    return storedQuestions || [
      "Tell me about yourself",
      "What are your strengths",
      "Why do you want this job"
    ];
  }, []);

  const startRecording = () => {
    setRecording(true);

    recognition.start();

    recognition.onresult = (event) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }

      setTranscript(text);
    };
  };

  const stopRecording = () => {
    recognition.stop();
    setRecording(false);
    evaluateAnswer(questions[index], transcript);
  };

  const nextQuestion = () => {
    if (index < questions.length - 1) {
      setTimeout(() => {
        setIndex(index + 1);
        setTranscript("");
        setCurrentScore(0);
      }, 2000);
    } else {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      localStorage.setItem("finalScore", avg);
      navigate("/report");
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      speakQuestion(questions[index], index);
    }
  }, [index, questions]);

  const evaluateAnswer = async (question, answer) => {
    setLoading(true);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: question,
        answer: answer
      })
    });

    const data = await response.json();

    setLoading(false);
    setScores((prev) => [...prev, data.score]);
    setCurrentScore(data.score);

    const responses = generateAIResponse(data.score);
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    speakOnly(randomResponse);
  };

  const speakQuestion = (text, index) => {
    window.speechSynthesis.cancel();

    const intros = [
      "Alright, let's begin.",
      "Okay, here's your next question.",
      "Interesting, now tell me this.",
      "Great, moving on.",
      "Let's continue.",
      "Now I'd like to ask you.",
      "Here's something important."
    ];

    let finalText = "";

    if (index === 0) {
      finalText = `Hi Harshitha, ${text}`;
    } else {
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];
      finalText = `${randomIntro} ${text}`;
    }

    const speak = () => {
      const speech = new SpeechSynthesisUtterance(finalText);
      const voices = window.speechSynthesis.getVoices();

      const femaleVoice =
        voices.find(
          (v) => v.name.includes("Google") && v.name.includes("Female")
        ) ||
        voices.find((v) => v.name.includes("Female")) ||
        voices[0];

      speech.voice = femaleVoice;
      speech.rate = 0.92;
      speech.pitch = 1;

      window.speechSynthesis.speak(speech);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = speak;
    }
  };

  const generateAIResponse = (score) => {
    if (score > 80) {
      return [
        "That's a strong answer.",
        "Great explanation.",
        "Impressive response."
      ];
    }

    if (score > 60) {
      return [
        "That's a decent answer.",
        "Good, but you can improve.",
        "Not bad, keep going."
      ];
    }

    return [
      "You might want to improve that answer.",
      "That could be better.",
      "Try to explain more clearly."
    ];
  };

  const speakOnly = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    speech.voice = voices.find((v) => v.name.includes("Female")) || voices[0];
    speech.rate = 0.95;

    setTimeout(() => {
      window.speechSynthesis.speak(speech);
    }, 300);
  };

  const progressPercent = ((index + 1) / questions.length) * 100;

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              margin: "0 0 10px 0",
              color: theme.text,
              fontSize: "34px"
            }}
          >
            AI Interview Session
          </h1>
          <p
            style={{
              margin: 0,
              color: theme.subtext,
              fontSize: "16px"
            }}
          >
            Practice your interview with live feedback, behavior analysis, and
            performance tracking.
          </p>
        </div>

        <div
          style={{
            ...cardStyle,
            marginBottom: "28px",
            padding: "20px 24px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: theme.text }}>Interview Progress</h3>
              <p style={{ margin: "4px 0 0 0", color: theme.subtext }}>
                Question {index + 1} of {questions.length}
              </p>
            </div>

            <div
              style={{
                background: "#DBEAFE",
                color: theme.primaryDark,
                padding: "8px 14px",
                borderRadius: "999px",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              {Math.round(progressPercent)}% Completed
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#E2E8F0",
              borderRadius: "999px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "28px",
            alignItems: "start"
          }}
        >
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <h2 style={{ color: theme.text, marginTop: 0 }}>AI Interviewer</h2>
            <p style={{ color: theme.subtext, marginTop: "6px" }}>
              Listen carefully and respond clearly.
            </p>

            <div style={{ marginTop: "20px" }}>
              <Avatar />
            </div>

            <div
              style={{
                marginTop: "22px",
                padding: "16px",
                borderRadius: "14px",
                background: "#EFF6FF",
                border: `1px solid ${theme.accent}`
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: theme.primaryDark }}>
                Session Tips
              </h4>
              <p style={{ margin: 0, color: theme.subtext, lineHeight: "1.6" }}>
                Maintain eye contact, answer with examples, and keep your
                explanation structured.
              </p>
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 260px",
                gap: "24px",
                alignItems: "start"
              }}
            >
              <div>
                <h2 style={{ color: theme.text, marginTop: 0 }}>Current Question</h2>

                <div
                  style={{
                    background: "#F8FAFC",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "14px",
                    padding: "20px",
                    minHeight: "96px"
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: theme.text,
                      fontSize: "17px",
                      lineHeight: "1.7",
                      fontWeight: "500"
                    }}
                  >
                    {questions[index]}
                  </p>
                </div>

                <div style={{ marginTop: "24px" }}>
                  <h3 style={{ color: theme.text, marginBottom: "12px" }}>
                    Your Answer
                  </h3>

                  <div
                    style={{
                      background: "#F8FAFC",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "14px",
                      padding: "18px",
                      minHeight: "130px"
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: transcript ? theme.text : theme.subtext,
                        lineHeight: "1.7"
                      }}
                    >
                      {transcript || "Your spoken answer will appear here..."}
                    </p>
                  </div>
                </div>

                {loading && (
                  <div
                    style={{
                      marginTop: "18px",
                      background: "#FEF3C7",
                      color: "#92400E",
                      border: "1px solid #FCD34D",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      fontWeight: "600"
                    }}
                  >
                    🤖 AI is analyzing your answer...
                  </div>
                )}

                {currentScore > 0 && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "18px",
                      background: "#ECFDF5",
                      border: "1px solid #BBF7D0",
                      borderRadius: "14px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px"
                      }}
                    >
                      <h4 style={{ margin: 0, color: theme.text }}>Answer Score</h4>
                      <span
                        style={{
                          color: theme.success,
                          fontWeight: "700",
                          fontSize: "18px"
                        }}
                      >
                        {currentScore}/100
                      </span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "12px",
                        background: "#D1FAE5",
                        borderRadius: "999px",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          width: `${currentScore}%`,
                          height: "100%",
                          background:
                            currentScore > 70
                              ? theme.success
                              : currentScore > 40
                              ? theme.warning
                              : theme.danger
                        }}
                      />
                    </div>
                  </div>
                )}

                <div
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    gap: "14px",
                    flexWrap: "wrap"
                  }}
                >
                  {!recording ? (
                    <button onClick={startRecording} style={buttonStyles.danger}>
                      Start Recording
                    </button>
                  ) : (
                    <button onClick={stopRecording} style={buttonStyles.dark}>
                      Stop Recording
                    </button>
                  )}

                  <button onClick={nextQuestion} style={buttonStyles.success}>
                    Next Question
                  </button>
                </div>
              </div>

              <div>
                <h3 style={{ color: theme.text, marginTop: 0 }}>Behavior Monitor</h3>
                <p
                  style={{
                    color: theme.subtext,
                    fontSize: "14px",
                    marginTop: "6px",
                    marginBottom: "16px"
                  }}
                >
                  Live camera-based observation during the interview.
                </p>

                <div
                  style={{
                    background: "#F8FAFC",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "14px",
                    padding: "14px",
                    textAlign: "center"
                  }}
                >
                  <BehaviorMonitor />
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "#F8FAFC",
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <h4 style={{ margin: "0 0 10px 0", color: theme.text }}>
                    Quick Guidance
                  </h4>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "18px",
                      color: theme.subtext,
                      lineHeight: "1.8"
                    }}
                  >
                    <li>Speak clearly and avoid rushing.</li>
                    <li>Use examples whenever possible.</li>
                    <li>Keep your posture and eye contact steady.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewRoom;