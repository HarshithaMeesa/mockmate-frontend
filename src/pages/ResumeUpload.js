import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { theme, buttonStyles, cardStyle } from "../styles/theme";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [skills, setSkills] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setSkills([]);
  };

  const uploadResume = async () => {
    if (!file) {
      setMessage("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload_resume`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log(data);

      localStorage.setItem("questions", JSON.stringify(data.questions || []));

      if (response.ok) {
        setMessage("Resume uploaded successfully");
        setSkills(data.skills || []);
      } else {
        setMessage("Upload failed");
      }
    } catch (error) {
      console.log(error);
      setMessage("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: theme.background, minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              margin: "0 0 10px 0",
              color: theme.text,
              fontSize: "34px"
            }}
          >
            Resume Upload
          </h1>
          <p
            style={{
              margin: 0,
              color: theme.subtext,
              fontSize: "16px"
            }}
          >
            Upload your resume to generate interview questions and begin your personalized preparation.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 0.9fr",
            gap: "24px",
            alignItems: "start"
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ color: theme.text, marginTop: 0 }}>Upload Resume File</h2>
            <p style={{ color: theme.subtext, marginBottom: "24px", lineHeight: "1.7" }}>
              Supported resumes can be uploaded here to extract skills and generate
              relevant interview questions automatically.
            </p>

            <div
              style={{
                border: `2px dashed ${theme.accent}`,
                borderRadius: "16px",
                padding: "28px",
                background: "#F8FAFC"
              }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#FFFFFF",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "10px"
                }}
              />

              {file && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "14px",
                    background: "#EFF6FF",
                    border: `1px solid ${theme.accent}`,
                    borderRadius: "12px"
                  }}
                >
                  <p style={{ margin: 0, color: theme.primaryDark, fontWeight: "600" }}>
                    Selected File
                  </p>
                  <p style={{ margin: "6px 0 0 0", color: theme.subtext }}>
                    {file.name}
                  </p>
                </div>
              )}

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={uploadResume}
                  style={buttonStyles.primary}
                >
                  {uploading ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            </div>

            {message && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background:
                    message === "Resume uploaded successfully" ? "#ECFDF5" : "#FEF2F2",
                  border:
                    message === "Resume uploaded successfully"
                      ? "1px solid #BBF7D0"
                      : "1px solid #FECACA",
                  color:
                    message === "Resume uploaded successfully"
                      ? theme.success
                      : theme.danger,
                  fontWeight: "600"
                }}
              >
                {message}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={{ color: theme.text, marginTop: 0 }}>Skill Preview</h2>
            <p style={{ color: theme.subtext, marginBottom: "18px", lineHeight: "1.7" }}>
              Extracted resume skills will appear here after upload.
            </p>

            {skills.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: "#DBEAFE",
                      color: theme.primaryDark,
                      padding: "8px 14px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "24px",
                  borderRadius: "14px",
                  background: "#F8FAFC",
                  border: `1px solid ${theme.border}`,
                  color: theme.subtext,
                  lineHeight: "1.7"
                }}
              >
                No skills extracted yet. Upload a resume to preview the detected skill set.
              </div>
            )}

            <div
              style={{
                marginTop: "20px",
                padding: "18px",
                borderRadius: "14px",
                background: "#EFF6FF",
                border: `1px solid ${theme.accent}`
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: theme.primaryDark }}>
                What happens next?
              </h4>
              <p style={{ margin: 0, color: theme.subtext, lineHeight: "1.7" }}>
                After successful upload, your interview questions are prepared and saved for the practice session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;