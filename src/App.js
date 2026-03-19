import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import InterviewSelect from "./pages/InterviewSelect";
import InterviewRoom from "./pages/InterviewRoom";
import Report from "./pages/Report";
import JoinInterview from "./pages/JoinInterview";
import LiveInterviewRoom from "./pages/LiveInterviewRoom";
import JitsiInterviewRoom from "./pages/JitsiInterviewRoom";

import LecturerAnswerCapture from "./pages/LecturerAnswerCapture";
import LecturerReport from "./pages/LecturerReport";

import LecturerMeetingEvaluator from "./pages/LecturerMeetingEvaluator";
import LecturerReport from "./pages/LecturerReport";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeUpload />} />
        <Route path="/interview" element={<InterviewSelect />} />
        <Route path="/room" element={<InterviewRoom />} />
        <Route path="/report" element={<Report />} />
        <Route path="/join/:id" element={<JoinInterview />} />
        <Route path="/live-room" element={<LiveInterviewRoom />} />
        <Route path="/jitsi-room" element={<JitsiInterviewRoom />} />
        <Route path="/lecturer-capture" element={<LecturerAnswerCapture />} />
        {/* <Route path="/lecturer-report/:sessionId" element={<LecturerReport />} /> */}
        <Route path="/lecturer-evaluator/:sessionId" element={<LecturerMeetingEvaluator />} /><Route path="/lecturer-meeting-evaluator" element={<LecturerMeetingEvaluator />} />
        <Route path="/lecturer-report/:sessionId" element={<LecturerReport />} />
      
      </Routes>
    </Router>
  );
}

export default App;