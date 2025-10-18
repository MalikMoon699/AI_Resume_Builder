import { X, CloudUpload } from "lucide-react";
import React, { useState } from "react";
import "../assets/style/Uploads.css";
import { detectResumeFromPDF } from "../services/Helpers.js";

const Uploads = ({ setIsUploadResume }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setIsUploadResume(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        setSelectedFile(null);
      } else {
        setError("");
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    console.log("📤 Uploading:", selectedFile.name);

    try {
      const parsedData = await detectResumeFromPDF(selectedFile);
      console.log("🎯 Parsed Resume Data:", parsedData);
    } catch (err) {
      console.error("❌ Error:", err);
    }

    setLoading(false);
    onClose();
  };

  return (
    <div onClick={onClose} className="modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="modal-content">
        <div className="modal-header">
          <h3 className="modal-header-title">Upload a Resume</h3>
          <button onClick={onClose} className="close-btn">
            <X />
          </button>
        </div>

        <div className="resumeUpload-container">
          <label htmlFor="resumeUpload" className="upload-area">
            <CloudUpload size={40} />
            <p>Click to upload your resume (PDF only)</p>
            {selectedFile && (
              <p className="selected-file">
                <strong>Selected:</strong> {selectedFile.name}
              </p>
            )}
          </label>

          <input
            id="resumeUpload"
            type="file"
            accept="application/pdf"
            className="file-input"
            onChange={handleFileChange}
          />

          {error && <p className="error-text">{error}</p>}

          <button
            onClick={handleUpload}
            className="resumeUpload-btn"
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Detecting..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Uploads;


