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
  const localStreamRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    const localVideo = localVideoRef.current;
    const remoteVideo = remoteVideoRef.current;
    const screenVideo = screenRef.current;

    const createPeerConnection = () => {
      if (peerRef.current) return peerRef.current;

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" }
        ]
      });

      pc.ontrack = (event) => {
        console.log("Remote stream received");
        if (remoteVideo) {
          remoteVideo.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
          console.log("Sending ICE candidate");
          socketRef.current.send(
            JSON.stringify({
              type: "candidate",
              candidate: event.candidate
            })
          );
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("Peer connection state:", pc.connectionState);
      };

      peerRef.current = pc;
      return pc;
    };

    const startLocalMedia = async () => {
      try {
        console.log("Starting local media...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        localStreamRef.current = stream;

        if (localVideo) {
          localVideo.srcObject = stream;
        }

        const pc = createPeerConnection();

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        console.log("Local media ready");
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
      }
    };

    startLocalMedia();

    socketRef.current = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/ws/${sessionId}`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connected:", sessionId);
      createPeerConnection();
    };

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Signal received:", data.type);

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

          console.log("Answer sent");
        }

        if (data.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          console.log("Answer applied");
        }

        if (data.type === "candidate" && data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          console.log("ICE candidate added");
        }
      } catch (err) {
        console.error("WebRTC signaling error:", err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (peerRef.current) peerRef.current.close();

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
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
    console.log("Start Call clicked");

    if (!peerRef.current) {
      console.log("Peer connection not ready");
      return;
    }

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not ready");
      return;
    }

    try {
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      socketRef.current.send(
        JSON.stringify({
          type: "offer",
          offer
        })
      );

      console.log("Offer sent");
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
                height: "200px",
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