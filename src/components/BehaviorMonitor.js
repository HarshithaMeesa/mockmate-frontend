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
      width: 640,
      height: 480
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
    <video
      ref={videoRef}
      style={{
        width: "300px",
        borderRadius: "10px",
        marginTop: "20px"
      }}
      autoPlay
      muted
    />
  );
}

export default BehaviorMonitor;