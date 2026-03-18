import React, { useState } from "react";
import Navbar from "../components/Navbar";
// import axios from "axios";

function ResumeUpload(){

  const [file,setFile] = useState(null);
  const [message,setMessage] = useState("");

  const handleFileChange = (e)=>{
    setFile(e.target.files[0]);
  };

  const uploadResume = async () => {

  const formData = new FormData();
  formData.append("file", file);

  try {

    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload_resume`, {
      method:"POST",
      body:formData
    });

    const data = await response.json();
    console.log(data);
    localStorage.setItem("questions", JSON.stringify(data.questions));

    if(response.ok){
      setMessage("Resume uploaded successfully");
      console.log("Skills:",data.skills);
    }
    else{
      setMessage("Upload failed");
    }

  }
  catch(error){
    console.log(error);
    setMessage("Upload failed");
  }

};

  return(

    <div>

      <Navbar/>

      <div style={{padding:"40px"}}>

        <h1>Upload Your Resume</h1>

        <p>Upload your resume to generate interview questions.</p>

        <div style={{marginTop:"30px"}}>

          <input
            type="file"
            onChange={handleFileChange}
          />

          <br/><br/>

          <button
            onClick={uploadResume}
            style={{
              padding:"12px",
              background:"blue",
              color:"white",
              border:"none",
              cursor:"pointer"
            }}
          >
            Upload Resume
          </button>

        </div>

        <p style={{marginTop:"20px"}}>{message}</p>

      </div>

    </div>

  )

}

export default ResumeUpload;