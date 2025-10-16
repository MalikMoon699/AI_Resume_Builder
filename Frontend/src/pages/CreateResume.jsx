import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/api.js";
import { toast } from "react-toastify";
import "../assets/style/CreateResume.css";
import { ClassicResume, ModernResume } from "../components/FormatResponse.jsx";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Loader from "../components/Loader.jsx";

const CreateResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/resume/get/${id}`);
        setResume(res.data);
      } catch (err) {
        console.error("Error fetching resume:", err);
        toast.error("Failed to load resume data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResume();
  }, [id]);

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    setResume((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), trimmed],
    }));
    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleChange = (section, field, value) => {
    setResume((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...(resume[section] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setResume((prev) => ({ ...prev, [section]: updated }));
  };

  const addArrayItem = (section, newItem) => {
    setResume((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };

  const removeArrayItem = (section, index) => {
    setResume((prev) => {
      const updated = [...(prev[section] || [])];
      updated.splice(index, 1);
      return { ...prev, [section]: updated };
    });
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      await API.post(`/resume/update/${id}`, resume);
      toast.success("Resume saved successfully!");
    } catch (err) {
      console.error("❌ Error saving resume:", err);
      toast.error("Failed to save resume");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading)
    return (
      <Loader
        size="100"
        style={{ height: "" }}
        className="create-resume-loading"
        stroke="6"
      />
    );
  if (!resume)
    return <div className="create-resume-not-found">Resume not found.</div>;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="create-resume-step">
            <h3 className="create-resume-step-title">Personal Details</h3>
            {[
              "fullName",
              "email",
              "number",
              "location",
              "profession",
              "personalWebsite",
            ].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="create-resume-input"
                value={resume.personalDetails?.[field] || ""}
                onChange={(e) =>
                  handleChange("personalDetails", field, e.target.value)
                }
              />
            ))}
          </div>
        );

      case 2:
        return (
          <div className="create-resume-step">
            <h3 className="create-resume-step-title">Professional Summary</h3>
            <textarea
              className="create-resume-textarea"
              rows="6"
              placeholder="Write your summary..."
              value={resume.summary || ""}
              onChange={(e) =>
                setResume((prev) => ({ ...prev, summary: e.target.value }))
              }
            />
          </div>
        );

      case 3:
        return (
          <div className="create-resume-step">
            <h3 className="create-resume-step-title">Experience</h3>
            {(resume.experience || []).map((exp, i) => (
              <div key={i} className="create-resume-card">
                <div className="create-resume-header-bin-collection">
                  <h3 className="create-index-view">Experience #{i + 1}</h3>
                  <button
                    onClick={() => removeArrayItem("experience", i)}
                    className="bin-resume-option"
                  >
                    <Trash2 />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="create-resume-input"
                  value={exp.companyName || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      i,
                      "companyName",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Job Title"
                  className="create-resume-input"
                  value={exp.jobTitle || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      i,
                      "jobTitle",
                      e.target.value
                    )
                  }
                />
                <div className="create-resume-date-group">
                  <div>
                    <label>Start Date</label>
                    <input
                      type="number"
                      className="create-resume-input"
                      placeholder="Enter year"
                      min="1950"
                      max={new Date().getFullYear() + 5}
                      value={exp.jobStartDate?.slice(0, 4) || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          i,
                          "jobStartDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input
                      type="number"
                      className="create-resume-input"
                      placeholder="Enter year"
                      min="1950"
                      disabled={exp.currentlyWorking}
                      max={new Date().getFullYear() + 5}
                      value={exp.jobEndDate?.slice(0, 4) || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          i,
                          "jobEndDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="create-resume-checkbox">
                  <input
                    type="checkbox"
                    id={`work-${i}`}
                    checked={exp.currentlyWorking || false}
                    onChange={(e) =>
                      handleArrayChange(
                        "experience",
                        i,
                        "currentlyWorking",
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor={`work-${i}`}>I currently work here</label>
                </div>
                <textarea
                  placeholder="Job Description"
                  className="create-resume-textarea"
                  value={exp.jobDescription || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      i,
                      "jobDescription",
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
            <button
              className="create-resume-add-btn"
              onClick={() =>
                addArrayItem("experience", {
                  companyName: "",
                  jobTitle: "",
                  jobStartDate: "",
                  jobEndDate: "",
                  currentlyWorking: false,
                  jobDescription: "",
                })
              }
            >
              + Add Experience
            </button>
          </div>
        );

      case 4:
        return (
          <div className="create-resume-step">
            <h3 className="create-resume-step-title">Education</h3>
            {(resume.education || []).map((edu, i) => (
              <div key={i} className="create-resume-card">
                <div className="create-resume-header-bin-collection">
                  <h3 className="create-index-view">Education #{i + 1}</h3>
                  <button
                    onClick={() => removeArrayItem("education", i)}
                    className="bin-resume-option"
                  >
                    <Trash2 />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Institution Name"
                  className="create-resume-input"
                  value={edu.institutionName || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      i,
                      "institutionName",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Degree"
                  className="create-resume-input"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    handleArrayChange("education", i, "degree", e.target.value)
                  }
                />
                <div className="create-resume-date-group">
                  <div>
                    <label>Start Date</label>
                    <input
                      type="number"
                      className="create-resume-input"
                      placeholder="Enter year"
                      min="1950"
                      max={new Date().getFullYear() + 5}
                      value={edu.startDate?.slice(0, 4) || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          i,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input
                      type="number"
                      className="create-resume-input"
                      placeholder="Enter year"
                      min="1950"
                      max={new Date().getFullYear() + 5}
                      value={edu.endDate?.slice(0, 4) || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          i,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              className="create-resume-add-btn"
              onClick={() =>
                addArrayItem("education", { institutionName: "", degree: "" })
              }
            >
              + Add Education
            </button>
          </div>
        );

      case 5:
        return (
          <div className="create-resume-step">
            <h3 className="create-resume-step-title">Projects</h3>
            {(resume.projects || []).map((p, i) => (
              <div key={i} className="create-resume-card">
                <div className="create-resume-header-bin-collection">
                  <h3 className="create-index-view">Projects #{i + 1}</h3>
                  <button
                    onClick={() => removeArrayItem("projects", i)}
                    className="bin-resume-option"
                  >
                    <Trash2 />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Project Name"
                  className="create-resume-input"
                  value={p.projectName || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      i,
                      "projectName",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Project Type"
                  className="create-resume-input"
                  value={p.projectType || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      i,
                      "projectType",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Project Link"
                  className="create-resume-input"
                  value={p.projectLink || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      i,
                      "projectLink",
                      e.target.value
                    )
                  }
                />
                <textarea
                  placeholder="Project Description"
                  className="create-resume-textarea"
                  value={p.projectDescription || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      i,
                      "projectDescription",
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
            <button
              className="create-resume-add-btn"
              onClick={() =>
                addArrayItem("projects", {
                  projectName: "",
                  projectDescription: "",
                })
              }
            >
              + Add Project
            </button>
          </div>
        );

      case 6:
        return (
          <div className="create-resume-step">
            <h3 className="create-resume-step-title">Skills</h3>

            <div className="create-resume-skill-input">
              <input
                type="text"
                placeholder="e.g. React, Node.js"
                className="create-resume-input"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <button onClick={addSkill} className="create-resume-add-btn">
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="create-resume-skill-list">
              {resume?.skills?.map((skill, i) => (
                <span key={i} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    className="skill-remove-btn"
                    onClick={() => removeSkill(skill)}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="create-resume-step">
            <h3 className="create-resume-step-title">Resume Type</h3>
            <select
              className="create-resume-select"
              value={resume.resumeType || "Modern"}
              onChange={(e) =>
                setResume((prev) => ({ ...prev, resumeType: e.target.value }))
              }
            >
              <option value="Modern">Modern</option>
              <option value="Classic">Classic</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="create-resume-action-btns">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="back-to-dashboard"
        >
          <span>
            <ArrowLeft />
          </span>
          Back to Dashboard
        </button>
        <div>
          {step > 1 && (
            <button
              className="create-resume-nav-btn create-resume-back-btn"
              onClick={() => setStep((s) => s - 1)}
            >
              <span>
                <ChevronLeft size={17} />
              </span>
              Back
            </button>
          )}
          {step < 7 && (
            <button
              className="create-resume-nav-btn create-resume-next-btn"
              onClick={() => setStep((s) => s + 1)}
            >
              Next
              <span>
                <ChevronRight size={17} />
              </span>
            </button>
          )}
        </div>
      </div>
      <div className="create-resume-container">
        <div className="create-resume-box">
          {renderStep()}

          <div className="create-resume-navigation">
            <button
              className="create-resume-nav-btn create-resume-save-btn"
              onClick={handleSave}
              disabled={saveLoading}
              style={{ cursor: saveLoading ? "not-allowed" : "" }}
            >
              {saveLoading ? (
                <Loader
                  size="14"
                  color="white"
                  stroke="2"
                  style={{ width: "80px" }}
                />
              ) : (
                "Save Resume"
              )}
            </button>
          </div>
        </div>

        <div className="create-resume-preview">
          {resume?.resumeType === "Modern" ? (
            <ModernResume data={resume} />
          ) : (
            <ClassicResume data={resume} />
          )}
        </div>
      </div>
    </>
  );
};

export default CreateResume;
