import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

function LiveInterviewRoom(){
  const location = useLocation();
  const sessionId = location.state?.sessionId;

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const videoRef = useRef(null);
  const screenRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/${sessionId}`);

    socketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.offer && peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);

        socketRef.current.send(JSON.stringify({ answer }));
      }

      if (data.answer && peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      if (data.candidate && peerRef.current) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    startMedia();

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (peerRef.current) peerRef.current.close();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (screenRef.current && screenRef.current.srcObject) {
        screenRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [sessionId]);

  const startMedia = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      videoRef.current.srcObject = media;
      setStream(media);

      peerRef.current = new RTCPeerConnection();

      media.getTracks().forEach(track => {
        peerRef.current.addTrack(track, media);
      });

      peerRef.current.ontrack = (event) => {
        const remoteVideo = document.getElementById("remoteVideo");
        if (remoteVideo) {
          remoteVideo.srcObject = event.streams[0];
        }
      };

      peerRef.current.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.send(JSON.stringify({
            candidate: event.candidate
          }));
        }
      };

    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const startCall = async () => {
    if (!peerRef.current || !socketRef.current) return;

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socketRef.current.send(JSON.stringify({ offer }));
  };

  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      screenRef.current.srcObject = displayStream;
      setScreenStream(displayStream);

    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  return (
    <div>
      <Navbar/>

      <div style={{ padding:"30px" }}>
        <h1>Live Interview Room</h1>

        <div style={{
          display:"flex",
          gap:"20px",
          marginTop:"30px"
        }}>
          <div>
            <h3>You</h3>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                width:"300px",
                borderRadius:"10px",
                background:"black"
              }}
            />
          </div>

          <div>
            <h3>Interviewer</h3>
            <video
              id="remoteVideo"
              autoPlay
              style={{
                width:"300px",
                height:"200px",
                borderRadius:"10px",
                background:"black"
              }}
            />
          </div>
        </div>

        <div style={{ marginTop:"30px" }}>
          <button
            onClick={startCall}
            style={{
              padding:"10px",
              background:"green",
              color:"white",
              border:"none",
              marginRight:"10px"
            }}
          >
            Start Call
          </button>

          <button
            onClick={startScreenShare}
            style={{
              padding:"10px",
              background:"blue",
              color:"white",
              border:"none"
            }}
          >
            Share Screen
          </button>

          <div style={{ marginTop:"20px" }}>
            <video
              ref={screenRef}
              autoPlay
              style={{
                width:"500px",
                borderRadius:"10px"
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default LiveInterviewRoom;