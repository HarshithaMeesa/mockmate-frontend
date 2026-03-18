import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

function LiveInterviewRoom() {
  const location = useLocation();

  const sessionId = location.state?.sessionId;
  const userType = location.state?.userType || "student";
  const interviewRole = location.state?.interviewRole || "";

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    const localVideo = localVideoRef.current;
    const remoteVideo = remoteVideoRef.current;
    const screenVideo = screenRef.current;

    if (!sessionId) return;

    let localStream = null;

    socketRef.current = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/ws/${sessionId}`
    );

    const createPeerConnection = () => {
      if (peerRef.current) return peerRef.current;

      peerRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" }
        ]
      });

      peerRef.current.ontrack = (event) => {
        if (remoteVideo) {
          remoteVideo.srcObject = event.streams[0];
        }
      };

      peerRef.current.onicecandidate = (event) => {
        if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(
            JSON.stringify({
              type: "candidate",
              candidate: event.candidate
            })
          );
        }
      };

      return peerRef.current;
    };

    const startMedia = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (localVideo) {
          localVideo.srcObject = localStream;
        }

        const pc = createPeerConnection();

        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
      }
    };

    socketRef.current.onopen = async () => {
      console.log("WebSocket connected");
      await startMedia();
    };

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const pc = createPeerConnection();

      try {
        if (data.type === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socketRef.current.send(
            JSON.stringify({
              type: "answer",
              answer
            })
          );
        }

        if (data.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }

        if (data.type === "candidate" && data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error("WebRTC signaling error:", err);
      }
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (peerRef.current) peerRef.current.close();

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      if (localVideo && localVideo.srcObject) {
        localVideo.srcObject.getTracks().forEach((track) => track.stop());
      }

      if (screenVideo && screenVideo.srcObject) {
        screenVideo.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [sessionId]);

  const startCall = async () => {
    if (!peerRef.current || !socketRef.current) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) return;

    try {
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      socketRef.current.send(
        JSON.stringify({
          type: "offer",
          offer
        })
      );
    } catch (err) {
      console.error("Start call error:", err);
    }
  };

  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      if (screenRef.current) {
        screenRef.current.srcObject = displayStream;
      }
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>Live Interview Room</h1>

        <p><b>You are:</b> {userType}</p>
        <p><b>Interview Role:</b> {interviewRole || "Not specified"}</p>
        <p><b>Session ID:</b> {sessionId}</p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "30px"
          }}
        >
          <div>
            <h3>{userType === "lecturer" ? "Lecturer" : "Student"} (You)</h3>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "300px",
                borderRadius: "10px",
                background: "black"
              }}
            />
          </div>

          <div>
            <h3>{userType === "lecturer" ? "Student" : "Lecturer"}</h3>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: "300px",
                height: "200px",
                borderRadius: "10px",
                background: "black"
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={startCall}
            style={{
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              marginRight: "10px"
            }}
          >
            {userType === "lecturer"
              ? "Start Call as Lecturer"
              : "Start Call as Student"}
          </button>

          <button
            onClick={startScreenShare}
            style={{
              padding: "10px",
              background: "blue",
              color: "white",
              border: "none"
            }}
          >
            Share Screen
          </button>

          <div style={{ marginTop: "20px" }}>
            <video
              ref={screenRef}
              autoPlay
              playsInline
              style={{
                width: "500px",
                borderRadius: "10px"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveInterviewRoom;