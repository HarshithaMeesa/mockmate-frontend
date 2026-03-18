import React, { useRef, useEffect } from "react";

function CameraView() {

  const videoRef = useRef(null);

  useEffect(() => {

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log("Camera error:", err);
      });

  }, []);

  return (

    <video
      ref={videoRef}
      autoPlay
      style={{
        width: "350px",
        border: "2px solid black",
        borderRadius: "10px"
      }}
    />

  );

}

export default CameraView;