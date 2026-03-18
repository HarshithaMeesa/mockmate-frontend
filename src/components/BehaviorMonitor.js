import React, { useEffect, useRef } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

function BehaviorMonitor() {

  const videoRef = useRef(null);

  useEffect(() => {

    if (!videoRef.current) return;

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

      if (!videoRef.current) return; // ✅ prevent crash

      if (results.detections.length > 0) {
        console.log("Face detected");
      } else {
        console.log("No face detected");
      }

    });

    camera = new Camera(videoRef.current, {
      onFrame: async () => {

        if (!videoRef.current) return; // ✅ safety check

        await faceDetection.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });

    camera.start();

    // 🔥 CLEANUP (VERY IMPORTANT)
    return () => {

      if (camera) {
        camera.stop();
      }

      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }

      console.log("🛑 Camera stopped");

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