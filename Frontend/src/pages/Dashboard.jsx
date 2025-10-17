import React, { useEffect, useState } from "react";
import API from "../utils/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { CloudUpload, Plus, SquarePen, Trash2, X } from "lucide-react";
import "../assets/style/Dashboard.css";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ResumePreview } from "../services/Constants.jsx";
import { resumeTemplateData } from "../services/Helpers.js";
import { EmptyResume } from "../components/FormatResponse.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [resume, setResume] = useState([]);

  const [resumeTitle, setResumeTitle] = useState("");
  const [updateResumeTitle, setUpdateResumeTitle] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  const [isCreateResume, setIsCreateResume] = useState(false);
  const [isUploadResume, setIsUploadResume] = useState(false);
  const [isUpdateResume, setIsUpdateResume] = useState(false);

  const load = async () => {
    try {
      if (!currentUser?._id) return;
      const res = await API.get(`/resume/user/${currentUser._id}`);
      setResume(res.data);
    } catch (err) {
      console.log("Error to get resume:", err);
    }
  };

  useEffect(() => {
    load();
  }, [currentUser]);

  const handleCreate = async () => {
    if (!resumeTitle) return toast.error("Resume Title required!!!");

    try {
      const res = await API.post("/resume/create", {
        title: resumeTitle,
      });

      toast.success("Resume created!");
      navigate(`/create-resume/${res.data._id}`);
    } catch (err) {
      console.error("Error creating resume:", err);
      toast.error("Failed to create resume");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return toast.error("resume not found.");
    try {
      const res = await API.delete(`/resume/delete/${id}`);
      load();
      toast.success("Resume deleted!");
    } catch (err) {
      console.error("Error creating resume:", err);
      toast.error("Failed to delete resume");
    }
  };

  const handleEdit = async () => {
    if (!updateResumeTitle.trim()) return toast.error("Resume Title required!");
    if (!selectedResumeId) return toast.error("No resume selected!");

    try {
      const res = await API.post(`/resume/update-title/${selectedResumeId}`, {
        title: updateResumeTitle,
      });

      toast.success("Resume updated!");
      setIsUpdateResume(false);
      setUpdateResumeTitle("");
      setSelectedResumeId(null);
      load();
      navigate(`/create-resume/${res.data.resume._id}`);
    } catch (err) {
      console.error("Error updating resume:", err);
      toast.error("Failed to update resume");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Resume</h1>
        <p className="dashboard-subtitle">
          Start creating your Ai resume for next Job role
        </p>
      </div>
      <div className="resume-container">
        <button
          onClick={() => {
            setIsCreateResume(true);
          }}
          className="dashboard-btn create-btn"
        >
          <Plus className="icon" />
          Create Resume
        </button>
        <button
          onClick={() => {
            setIsUploadResume(true);
          }}
          className="dashboard-btn upload-btn"
        >
          <CloudUpload className="icon" />
          Upload Existing
        </button>
        {resume.map((item, index) => (
          <div
            onClick={() => {
              navigate(`/resume/${item._id}`);
            }}
            key={index}
            className="dashboard-resume-card"
          >
            <div
              style={{ "--accent-color": item.accentColor || "#00af4e" }}
              className="resume-preview"
            >
              <ResumePreview item={item} />
            </div>
            <div className="dashboard-resume-card-options">
              <p>{item.title}</p>
              <div className="dashboard-resume-card-options-btns">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item?._id);
                  }}
                >
                  <Trash2 size={20} />
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResumeId(item._id);
                    setUpdateResumeTitle(item?.title);
                    setIsUpdateResume(true);
                  }}
                >
                  <SquarePen size={20} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="resume-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Templates</h1>
          <p className="dashboard-subtitle">
            Start creating your Ai resume for next Job role
          </p>
        </div>
        <div className="resume-container">
          {resumeTemplateData.map((item, index) => (
            <div key={index} className="dashboard-resume-card" style={{cursor:"default"}}>
              <div
                style={{ "--accent-color": item.accentColor || "#00af4e" }}
                className="resume-preview"
              >
                {item?.resumeType ? (
                  <ResumePreview item={item} />
                ) : (
                  <EmptyResume btn={false} navigate={navigate} />
                )}
              </div>
              <div className="dashboard-resume-card-options">
                <p>{item.title}</p>
                <div className="dashboard-resume-card-options-btns">
                  <button className="use-temp-btn">Use template</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isCreateResume && (
        <div
          onClick={() => {
            setIsCreateResume(false);
            setResumeTitle("");
          }}
          className="modal-overlay"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="modal-content"
          >
            <div className="modal-header">
              <h3 className="modal-header-title">Create a Resume</h3>
              <button
                onClick={() => {
                  setIsCreateResume(false);
                  setResumeTitle("");
                }}
              >
                <X />
              </button>
            </div>
            <div className="create-resume-modal-content">
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => {
                  setResumeTitle(e.target.value);
                }}
                placeholder="Enter resume title"
              />
              <button onClick={handleCreate}>Create Resume</button>
            </div>
          </div>
        </div>
      )}
      {isUpdateResume && (
        <div
          onClick={() => {
            setIsUpdateResume(false);
            setUpdateResumeTitle("");
            setSelectedResumeId(null);
          }}
          className="modal-overlay"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="modal-content"
          >
            <div className="modal-header">
              <h3 className="modal-header-title">Update Resume</h3>
              <button
                onClick={() => {
                  setIsUpdateResume(false);
                  setUpdateResumeTitle("");
                  setSelectedResumeId(null);
                }}
              >
                <X />
              </button>
            </div>
            <div className="create-resume-modal-content">
              <input
                type="text"
                value={updateResumeTitle}
                onChange={(e) => {
                  setUpdateResumeTitle(e.target.value);
                }}
                placeholder="Enter resume title"
              />
              <button onClick={handleEdit}>Update Resume</button>
            </div>
          </div>
        </div>
      )}
      {isUploadResume && (
        <div
          onClick={() => {
            setIsUploadResume(false);
          }}
          className="modal-overlay"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="modal-content"
          >
            <div className="modal-header">
              <h3 className="modal-header-title">Upload a Resume</h3>
              <button
                onClick={() => {
                  setIsUploadResume(false);
                }}
              >
                <X />
              </button>
            </div>
            <div className="create-resume-modal-content">
              <div className="resume-select-cards-container">
                {resume.map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(`/create-resume/${item._id}`);
                    }}
                    key={index}
                    className="resume-select-card"
                  >
                    <p className="resume-name">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
