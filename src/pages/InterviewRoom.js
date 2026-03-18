import BehaviorMonitor from "../components/BehaviorMonitor";
import React, { useState , useEffect} from "react";
import Navbar from "../components/Navbar";
import CameraView from "../components/CameraView";
import Avatar from "../components/Avatar";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

function InterviewRoom(){
  const location = useLocation();
  const navigate = useNavigate();

 const [recording, setRecording] = useState(false);
const [transcript, setTranscript] = useState("");
const [scores, setScores] = useState([]);
const [currentScore, setCurrentScore] = useState(0);
const [loading, setLoading] = useState(false);


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
  const storedQuestions = JSON.parse(localStorage.getItem("questions"));

const questions = storedQuestions || [
 "Tell me about yourself",
 "What are your strengths",
 "Why do you want this job"
];

  const [index,setIndex] = useState(0);

const nextQuestion = () => {

  if(index < questions.length - 1){

    setTimeout(() => {
      setIndex(index + 1); // triggers next question speech
    }, 2000); // ⏳ wait after feedback

  }
  else{

    const avg =
      scores.reduce((a,b)=>a+b,0) / scores.length;

    localStorage.setItem("finalScore", avg);

    navigate("/report");

  }

};
useEffect(() => {

  if (questions.length > 0) {
    speakQuestion(questions[index], index);
  }

}, [index]); 
  // ✅ ONLY runs when index changes

  const evaluateAnswer = async (question, answer) => {

  setLoading(true); // 🔥 start loader

  const response = await fetch("http://127.0.0.1:8000/evaluate", {
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

  setLoading(false); // 🔥 stop loader

  setScores(prev => [...prev, data.score]);
  setCurrentScore(data.score);

  const responses = generateAIResponse(data.score);
  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  speakOnly(randomResponse);
};

const speakQuestion = (text, index) => {

  window.speechSynthesis.cancel(); // stop any previous speech

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

    // 🔥 pick a stable female voice
    const femaleVoice =
      voices.find(v => v.name.includes("Google") && v.name.includes("Female")) ||
      voices.find(v => v.name.includes("Female")) ||
      voices[0];

    speech.voice = femaleVoice;
    speech.rate = 0.92;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // ✅ Ensure voices are loaded BEFORE speaking
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
  speech.voice = voices.find(v => v.name.includes("Female")) || voices[0];

  speech.rate = 0.95;

  setTimeout(() => {
    window.speechSynthesis.speak(speech);
  }, 300);

};

 return (

  <div>

    <Navbar/>

    <div style={{padding:"40px"}}>

      <h1>AI Interview Session</h1>

      <div style={{
        display:"flex",
        gap:"50px",
        marginTop:"40px"
      }}>

        <Avatar/>

        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.1)"
        }}>

          <h2>Question</h2>

          <p style={{
            background:"#f3f3f3",
            padding:"20px",
            width:"400px"
          }}>
            {questions[index]}
          </p>

          {/* ✅ Camera + Behavior */}
          {/* <CameraView/> */}
          <BehaviorMonitor/>

          <br/>

          {!recording ? (

            <button
              onClick={startRecording}
              style={{
                padding:"10px",
                background:"red",
                color:"white",
                border:"none"
              }}
            >
              Start Recording
            </button>

          ) : (

            <button
              onClick={stopRecording}
              style={{
                padding:"10px",
                background:"black",
                color:"white",
                border:"none"
              }}
            >
              Stop Recording
            </button>

          )}

          {/* ✅ ANSWER SECTION */}
          <div style={{marginTop:"20px"}}>

            <h3>Your Answer</h3>

            <p style={{
              background:"#f3f3f3",
              padding:"15px",
              width:"400px"
            }}>
              {transcript}
            </p>

          </div>

          {/* 🔥 AI ANALYZING */}
          {loading && (
            <p style={{ 
              color: "orange", 
              fontWeight: "bold",
              marginTop: "10px"
            }}>
              🤖 AI is analyzing your answer...
            </p>
          )}

          {/* 🔥 SCORE + CONFIDENCE */}
          {currentScore > 0 && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              background: "#e8f5e9",
              width: "200px",
              borderRadius: "8px"
            }}>
              <h4>Score: {currentScore}/100</h4>

              <div style={{
                width: "100%",
                height: "10px",
                background: "#ddd",
                borderRadius: "10px",
                marginTop: "10px"
              }}>
                <div style={{
                  width: `${currentScore}%`,
                  height: "100%",
                  background: currentScore > 70 
                    ? "green" 
                    : currentScore > 40 
                    ? "orange" 
                    : "red",
                  borderRadius: "10px"
                }}></div>
              </div>
            </div>
          )}

          {/* ✅ NEXT QUESTION BUTTON (moved below score) */}
          <button
            style={{
              padding:"10px",
              background:"green",
              color:"white",
              border:"none",
              marginTop:"15px"
            }}
            onClick={nextQuestion}
          >
            Next Question
          </button>

        </div>

      </div>

    </div>

  </div>

);

}

export default InterviewRoom;