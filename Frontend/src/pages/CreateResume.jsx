import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/api.js";
import { toast } from "sonner";
import "../assets/style/CreateResume.css";
import { EmptyResume } from "../components/FormatResponse.jsx";
import {
  ArrowLeft,
  Brain,
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  Palette,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Loader from "../components/Loader.jsx";
import { ResumePreview } from "../services/Constants.jsx";
import { generateResumeSuggestions } from "../services/Helpers.js";

const CreateResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isAccent, setIsAccent] = useState(false);
  const [step, setStep] = useState(1);
  const [newSkill, setNewSkill] = useState("");

  const [aiSuggestions, setAiSuggestions] = useState({});
  const [aiSuggestionsLoading, setAiSuggestionsLoading] = useState({});
  const [aiLoading, setAiLoading] = useState(false);

  const templateRef = useRef();
  const accentRef = useRef();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/resume/get/${id}`);
        // setResume(res.data);
        setResume({
          ...res.data,
          accentColor: res.data.accentColor || "#00af4e",
        });
      } catch (err) {
        console.error("Error fetching resume:", err);
        toast.error("Failed to load resume data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResume();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isTemplate &&
        templateRef.current &&
        !templateRef.current.contains(e.target)
      ) {
        setIsTemplate(false);
      }
      if (
        isAccent &&
        accentRef.current &&
        !accentRef.current.contains(e.target)
      ) {
        setIsAccent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTemplate, isAccent]);

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

  const getProgress = () => {
    const totalSteps = 8;
    const progress = (step / totalSteps) * 100;
    return `${progress}%`;
  };

  const getSuggestions = async (data, section, key) => {
    setAiSuggestionsLoading((prev) => ({ ...prev, [key]: true }));
    setAiLoading(true);
    const suggestions = await generateResumeSuggestions(data, section);
    setAiSuggestions((prev) => ({
      ...prev,
      [key]: suggestions,
    }));
    setAiSuggestionsLoading((prev) => ({ ...prev, [key]: false }));
    setAiLoading(false);
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
            <div className="create-resume-header-bin-collection">
              <h3
                style={{ margin: resume?.creationType === "Ai" ? "0px" : "" }}
                className="create-resume-step-title"
              >
                Professional Summary
              </h3>
              {resume?.creationType === "Ai" && (
                <button
                  disabled={aiSuggestionsLoading["Professional Summary"]}
                  style={{
                    cursor: aiSuggestionsLoading["Professional Summary"]
                      ? "not-allowed"
                      : "",
                  }}
                  onClick={() =>
                    getSuggestions(
                      resume,
                      "Professional Summary",
                      "Professional Summary"
                    )
                  }
                  className="genrate-ai-btn"
                >
                  <span>
                    <Brain size={15} />
                  </span>
                  Generate
                </button>
              )}
            </div>

            <textarea
              className="create-resume-textarea"
              rows="6"
              placeholder="Write your summary..."
              value={resume.summary || ""}
              onChange={(e) =>
                setResume((prev) => ({ ...prev, summary: e.target.value }))
              }
            />

            {aiSuggestionsLoading["Professional Summary"] && <Loader size="30" />}

            {aiSuggestions["Professional Summary"]?.length > 0 && (
              <div className="ai-suggestions-box">
                <h4 className="ai-suggestions-title">AI Suggestions</h4>
                <ul className="ai-suggestions-list">
                  {aiSuggestions["Professional Summary"].map((s, idx) => (
                    <li
                      key={idx}
                      className="ai-suggestion-item"
                      onClick={() => {
                        setResume((prev) => ({ ...prev, summary: s }));
                        setAiSuggestions((prev) => ({
                          ...prev,
                          ["Professional Summary"]: [],
                        }));
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                      value={exp.startDate?.slice(0, 4) || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
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
                      disabled={exp.currentlyWorking}
                      max={new Date().getFullYear() + 5}
                      value={exp.endDate?.slice(0, 4) || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          i,
                          "endDate",
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
                <div>
                  <div className="create-resume-header-bin-collection">
                    <h5
                      style={{
                        fontSize: "18px",
                        margin:
                          resume?.creationType === "Ai"
                            ? "0px 0px 0px 5px"
                            : "15px 0px 0px 5px",
                      }}
                    >
                      Description
                    </h5>
                    {resume?.creationType === "Ai" && (
                      <button
                        disabled={aiSuggestionsLoading[i]}
                        style={{
                          cursor: aiSuggestionsLoading[i] ? "not-allowed" : "",
                        }}
                        onClick={() => {
                          getSuggestions(
                            { ...resume, experience: [resume.experience[i]] },
                            "Experience",
                            i
                          );
                        }}
                        className="genrate-ai-btn"
                      >
                        <span>
                          <Brain size={15} />
                        </span>
                        Genrate
                      </button>
                    )}
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
                {aiSuggestionsLoading[i] && <Loader size="30" />}

                {aiSuggestions[i]?.length > 0 && (
                  <div className="ai-suggestions-box">
                    <h4 className="ai-suggestions-title">AI Suggestions</h4>
                    <ul className="ai-suggestions-list">
                      {aiSuggestions[i].map((s, idx) => (
                        <li
                          key={idx}
                          className="ai-suggestion-item"
                          onClick={() => {
                            handleArrayChange(
                              "experience",
                              i,
                              "jobDescription",
                              s
                            );
                            setAiSuggestions((prev) => ({ ...prev, [i]: [] }));
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <button
              className="create-resume-add-btn"
              onClick={() =>
                addArrayItem("experience", {
                  companyName: "",
                  jobTitle: "",
                  startDate: "",
                  endDate: "",
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
                <div>
                  <div className="create-resume-header-bin-collection">
                    <h5
                      style={{
                        fontSize: "18px",
                        margin:
                          resume?.creationType === "Ai"
                            ? "0px 0px 0px 5px"
                            : "15px 0px 0px 5px",
                      }}
                    >
                      Description
                    </h5>
                    {resume?.creationType === "Ai" && (
                      <button
                        disabled={aiSuggestionsLoading[i]}
                        style={{
                          cursor: aiSuggestionsLoading[i] ? "not-allowed" : "",
                        }}
                        onClick={() => {
                          getSuggestions(
                            { ...resume, projects: [resume.projects[i]] },
                            "Projects",
                            i
                          );
                        }}
                        className="genrate-ai-btn"
                      >
                        <span>
                          <Brain size={15} />
                        </span>
                        Genrate
                      </button>
                    )}
                  </div>
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
                {aiSuggestionsLoading[i] && <Loader size="30" />}

                {aiSuggestions[i]?.length > 0 && (
                  <div className="ai-suggestions-box">
                    <h4 className="ai-suggestions-title">AI Suggestions</h4>
                    <ul className="ai-suggestions-list">
                      {aiSuggestions[i].map((s, idx) => (
                        <li
                          key={idx}
                          className="ai-suggestion-item"
                          onClick={() => {
                            handleArrayChange(
                              "projects",
                              i,
                              "projectDescription",
                              s
                            );
                            setAiSuggestions((prev) => ({ ...prev, [i]: [] }));
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
            <h3 className="create-resume-step-title">Additional Info</h3>
            <div className="create-resume-step">
              <h4 className="create-resume-step-title">Languages</h4>
              {(resume.languages || []).map((lang, i) => (
                <div key={i} className="create-resume-card small-card">
                  <div className="create-resume-header-bin-collection">
                    <h3 className="create-index-view">Language #{i + 1}</h3>
                    <button
                      onClick={() => removeArrayItem("languages", i)}
                      className="bin-resume-option"
                    >
                      <Trash2 />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Language"
                    className="create-resume-input"
                    value={lang.language || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "languages",
                        i,
                        "language",
                        e.target.value
                      )
                    }
                  />
                  <div className="create-resume-percentage-input">
                    <label>Proficiency (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 85"
                      className="create-resume-input"
                      value={lang.proficiency || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "languages",
                          i,
                          "proficiency",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                className="create-resume-add-btn"
                onClick={() =>
                  addArrayItem("languages", { language: "", proficiency: "" })
                }
              >
                + Add Language
              </button>
            </div>
            <div className="create-resume-step">
              <h4 className="create-resume-step-title">Hobbies</h4>
              {(resume.hobbies || []).map((hobby, i) => (
                <div key={i} className="create-resume-card small-card">
                  <div className="create-resume-header-bin-collection">
                    <h3 className="create-index-view">Hobbie #{i + 1}</h3>
                    <button
                      onClick={() => removeArrayItem("hobbies", i)}
                      className="bin-resume-option"
                    >
                      <Trash2 />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Hobby or Interest"
                    className="create-resume-input"
                    value={hobby || ""}
                    onChange={(e) => {
                      const updated = [...(resume.hobbies || [])];
                      updated[i] = e.target.value;
                      setResume((prev) => ({ ...prev, hobbies: updated }));
                    }}
                  />
                </div>
              ))}
              <button
                className="create-resume-add-btn"
                onClick={() => addArrayItem("hobbies", "")}
              >
                + Add Hobby
              </button>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="create-resume-step">
            <h3 className="create-resume-step-title">Awards & Achievements</h3>
            {(resume.awards || []).map((award, i) => (
              <div key={i} className="create-resume-card">
                <div className="create-resume-header-bin-collection">
                  <h3 className="create-index-view">Award #{i + 1}</h3>
                  <button
                    onClick={() => removeArrayItem("awards", i)}
                    className="bin-resume-option"
                  >
                    <Trash2 />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Award Title"
                  className="create-resume-input"
                  value={award.title || ""}
                  onChange={(e) =>
                    handleArrayChange("awards", i, "title", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Organization / Institution"
                  className="create-resume-input"
                  value={award.organization || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "awards",
                      i,
                      "organization",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Year"
                  className="create-resume-input"
                  value={award.year || ""}
                  onChange={(e) =>
                    handleArrayChange("awards", i, "year", e.target.value)
                  }
                />
                <div>
                  <div className="create-resume-header-bin-collection">
                    <h5
                      style={{
                        fontSize: "18px",
                        margin:
                          resume?.creationType === "Ai"
                            ? "0px 0px 0px 5px"
                            : "15px 0px 0px 5px",
                      }}
                    >
                      Description
                    </h5>
                    {resume?.creationType === "Ai" && (
                      <button
                        disabled={aiSuggestionsLoading[i]}
                        style={{
                          cursor: aiSuggestionsLoading[i] ? "not-allowed" : "",
                        }}
                        onClick={() => {
                          getSuggestions(
                            { ...resume, awards: [resume.awards[i]] },
                            "Awards & Achievements",
                            i
                          );
                        }}
                        className="genrate-ai-btn"
                      >
                        <span>
                          <Brain size={15} />
                        </span>
                        Genrate
                      </button>
                    )}
                  </div>
                  <textarea
                    placeholder="Description"
                    className="create-resume-textarea"
                    value={award.description || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "awards",
                        i,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>
                {aiSuggestionsLoading[i] && <Loader size="30" />}

                {aiSuggestions[i]?.length > 0 && (
                  <div className="ai-suggestions-box">
                    <h4 className="ai-suggestions-title">AI Suggestions</h4>
                    <ul className="ai-suggestions-list">
                      {aiSuggestions[i].map((s, idx) => (
                        <li
                          key={idx}
                          className="ai-suggestion-item"
                          onClick={() => {
                            handleArrayChange("awards", i, "description", s);
                            setAiSuggestions((prev) => ({ ...prev, [i]: [] }));
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <button
              className="create-resume-add-btn"
              onClick={() =>
                addArrayItem("awards", {
                  title: "",
                  organization: "",
                  year: "",
                  description: "",
                })
              }
            >
              + Add Award
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <button
        onClick={() => {
          navigate("/dashboard");
        }}
        className="back-to-dashboard"
      >
        <span>
          <ArrowLeft />
        </span>
        Back to Dashboard
      </button>
      <div className="create-resume-action-btns">
        <div className="create-resume-action-btn-first-section">
          <button
            onClick={() => {
              setIsTemplate(true);
            }}
          >
            <span>
              <LayoutTemplate size={17} />
            </span>
            Template
            {isTemplate && (
              <div
                className="template-modal"
                ref={templateRef}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="template-modal-title">Choose a Template</h3>
                <div className="template-options">
                  {["Classic", "Modern"].map((type) => (
                    <div
                      key={type}
                      className={`template-option ${
                        resume.resumeType === type ? "active" : ""
                      }`}
                      onClick={() => {
                        setResume((prev) => ({
                          ...prev,
                          resumeType: type,
                        }));
                        setIsTemplate(false);
                      }}
                    >
                      <h4>{type}</h4>
                      <p>
                        {type === "Classic" &&
                          "A clean, traditional resume format with clear sections and professional typography"}
                        {type === "Modern" &&
                          "Sleek design with strategic use of color and modern font choices"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
          <button
            onClick={() => {
              setIsAccent(true);
            }}
          >
            <span>
              <Palette size={17} />
            </span>
            Accent
            {isAccent && (
              <div
                className="accent-modal"
                ref={accentRef}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="accent-modal-title">Choose Accent Color</h3>
                <div className="accent-options">
                  {[
                    "#3b82f6",
                    "#6366f1",
                    "#8b5cf6",
                    "#00af4e",
                    "#22c55e",
                    "#ef4444",
                    "#f97316",
                    "#14b8a6",
                    "#ec4899",
                    "#9ca3af",
                    "#111827",
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`accent-circle ${
                        resume.accentColor === color ? "active" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setResume((prev) => ({
                          ...prev,
                          accentColor: color,
                        }));
                        setIsAccent(false);
                      }}
                    ></div>
                  ))}
                </div>
                <div className="custom-color-picker">
                  <label
                    style={{
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    Add Custom Color
                  </label>
                  <div
                    className={`accent-circle ${
                      ![
                        "#3b82f6",
                        "#6366f1",
                        "#8b5cf6",
                        "#00af4e",
                        "#22c55e",
                        "#ef4444",
                        "#f97316",
                        "#14b8a6",
                        "#ec4899",
                        "#9ca3af",
                        "#111827",
                      ].includes(resume.accentColor)
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      type="color"
                      onClick={(e) => e.stopPropagation()}
                      value={resume.accentColor || "#3b82f6"}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        setResume((prev) => ({
                          ...prev,
                          accentColor: newColor,
                        }));
                      }}
                      title="Choose custom color"
                    />
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>
        <div>
          {step > 1 && (
            <button
              className="create-resume-nav-btn create-resume-back-btn"
              onClick={() => setStep((s) => s - 1)}
              style={{
                cursor: aiLoading ? "not-allowed" : "pointer",
              }}
              disabled={aiLoading}
            >
              <span>
                <ChevronLeft size={17} />
              </span>
              Back
            </button>
          )}
          {step < 8 && (
            <button
              className="create-resume-nav-btn create-resume-next-btn"
              onClick={() => setStep((s) => s + 1)}
              style={{
                cursor: aiLoading ? "not-allowed" : "pointer",
              }}
              disabled={aiLoading}
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
          <div
            style={{ width: getProgress() }}
            className="topbar-progressbar-line"
          ></div>
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

        <div
          className="create-resume-preview"
          style={{ "--accent-color": resume.accentColor || "#00af4e" }}
        >
          {resume?.resumeType ? (
            <ResumePreview item={resume} width="100%" height="100%" />
          ) : (
            <EmptyResume btn={false} navigate={navigate} />
          )}
        </div>
      </div>
    </>
  );
};

export default CreateResume;
