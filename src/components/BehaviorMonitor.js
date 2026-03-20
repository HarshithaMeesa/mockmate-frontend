import React, { useEffect, useRef } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

function BehaviorMonitor() {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let camera = null;

    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.5
    });

    faceDetection.onResults((results) => {
      if (!videoElement) return;

      if (results.detections && results.detections.length > 0) {
        console.log("Face detected");
      } else {
        console.log("No face detected");
      }
    });

    camera = new Camera(videoElement, {
      onFrame: async () => {
        if (!videoElement) return;
        await faceDetection.send({ image: videoElement });
      },
      width: 320,
      height: 240
    });

    camera.start();

    return () => {
      if (camera) {
        camera.stop();
      }

      if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
      }

      console.log("Camera stopped");
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "14px",
        overflow: "hidden",
        background: "#E2E8F0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          display: "block",
          borderRadius: "14px"
        }}
      />
    </div>
  );
}

export default BehaviorMonitor;