import React from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";

function JitsiInterviewRoom() {
  const location = useLocation();

  const sessionId = location.state?.sessionId || "default-room";
  const userType = location.state?.userType || "student";
  const interviewRole = location.state?.interviewRole || "";

  const roomName = `mockmate-${sessionId}`;

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Live Interview Room</h1>
        <p><b>You are:</b> {userType}</p>
        <p><b>Interview Role:</b> {interviewRole || "Not specified"}</p>
        <p><b>Session ID:</b> {sessionId}</p>

        <div style={{ marginTop: "20px" }}>
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              prejoinPageEnabled: true
            }}
            interfaceConfigOverwrite={{
              SHOW_JITSI_WATERMARK: false
            }}
            userInfo={{
              displayName: userType === "lecturer" ? "Lecturer" : "Student"
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "700px";
              iframeRef.style.width = "100%";
              iframeRef.style.border = "0";
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default JitsiInterviewRoom;