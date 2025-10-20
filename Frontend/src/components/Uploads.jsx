import { X, CloudUpload } from "lucide-react";
import React, { useState } from "react";
import "../assets/style/Uploads.css";
import { detectResumeFromPDF } from "../services/Helpers.js";
import API from "../utils/api.js";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Uploads = ({ setIsUploadResume }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [creationType, setCreationType] = useState("Ai");
  const [resumeTitle, setResumeTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Minimalist");

  const handleCreate = async (parsedData = {}) => {
    if (!resumeTitle) return toast.error("Resume Title required!!!");
    if (!selectedFile) return toast.error("Resume file required!!!");

    try {
      const res = await API.post("/resume/create", {
        title: resumeTitle,
        creationType: creationType,
        resumeType: selectedTemplate,
        ...parsedData,
      });

      toast.success("Resume created!");
      setIsUploadResume(false);
      navigate(`/create-resume/${res.data._id}`);
    } catch (err) {
      console.error("Error creating resume:", err);
      toast.error("Failed to create resume");
    }
  };

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

      handleCreate(parsedData);
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

        <div className="resumeUpload-container create-resume-modal-content">
          <input
            type="text"
            placeholder="Enter resume title"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
          />
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
