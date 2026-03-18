import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import InterviewSelect from "./pages/InterviewSelect";
import InterviewRoom from "./pages/InterviewRoom";
import Report from "./pages/Report";
import JoinInterview from "./pages/JoinInterview";
import LiveInterviewRoom from "./pages/LiveInterviewRoom";
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
      </Routes>
    </Router>
  );
}

export default App;