import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/api.js";
import { API_URL } from "../services/Helpers.js";
import { toast } from "sonner";
import "../assets/style/AiResumeCreate.css";
import {
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
  Palette,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Loader from "../components/Loader.jsx";

const CreateResumeByAi = ({ id: propId }) => {
  const params = useParams();
  const id = propId || params.id;
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showAccent, setShowAccent] = useState(false);
  const [step, setStep] = useState(1);
  const [newSkill, setNewSkill] = useState("");

  const templateRef = useRef();
  const accentRef = useRef();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/resume/get/${id}`);
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
        showTemplate &&
        templateRef.current &&
        !templateRef.current.contains(e.target)
      ) {
        setShowTemplate(false);
      }
      if (
        showAccent &&
        accentRef.current &&
        !accentRef.current.contains(e.target)
      ) {
        setShowAccent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTemplate, showAccent]);

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

      const prompt = `
You are an expert resume writer AI.
Based on the following resume data, generate:

1. A concise, professional, and ATS-friendly **Professional Summary** (2-4 sentences).
2. For each experience, generate a strong, achievement-focused **jobDescription** (2-3 bullet points) according to company name, job title, and duration.
3. For each project, generate a descriptive **projectDescription** (2-3 lines) explaining what the project was, what technologies were used, and the impact.
4. For each award, generate a short **description** explaining its significance or what it recognizes.
Return the final structured JSON only (no extra text or explanations), in this format:

{
  "summary": "...",
  "experience": [
    { "companyName": "...", "jobTitle": "...", "jobDescription": "..." }
  ],
  "projects": [
    { "projectName": "...", "projectDescription": "..." }
  ],
  "awards": [
    { "title": "...", "description": "..." }
  ]
}

Here is the user's resume data:
${JSON.stringify(resume, null, 2)}
`;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      if (!rawText) throw new Error("Empty AI response");

      let aiJson = {};
      try {
        const cleaned = rawText.replace(/```json|```/g, "").trim();
        aiJson = JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", e);
        toast.error("AI returned invalid format. Please try again.");
        return;
      }

      const updatedResume = {
        ...resume,
        summary: aiJson.summary || resume.summary,
        experience: (resume.experience || []).map((exp, i) => ({
          ...exp,
          jobDescription:
            aiJson.experience?.[i]?.jobDescription || exp.jobDescription,
        })),
        projects: (resume.projects || []).map((p, i) => ({
          ...p,
          projectDescription:
            aiJson.projects?.[i]?.projectDescription || p.projectDescription,
        })),
        awards: (resume.awards || []).map((a, i) => ({
          ...a,
          description: aiJson.awards?.[i]?.description || a.description,
        })),
      };

      await API.post(`/resume/update/${id}`, updatedResume);

      toast.success("AI-enhanced resume created successfully!");
      navigate(`/create-resume/${id}`);
    } catch (error) {
      console.error("Error generating AI resume:", error);
      toast.error("Failed to generate AI-enhanced resume");
    } finally {
      setSaveLoading(false);
    }
  };

  const getProgress = () => `${(step / 7) * 100}%`;

  if (loading) return <Loader size="100" className="page-loader" stroke="6" />;
  if (!resume) return <div className="empty-message">Resume not found.</div>;

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
                      type="month"
                      className="create-resume-input"
                      min="1950-01"
                      max={`${new Date().getFullYear() + 5}-12`}
                      value={exp.startDate || ""}
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
                      type="month"
                      className="create-resume-input"
                      disabled={exp.currentlyWorking}
                      min="1950-01"
                      max={`${new Date().getFullYear() + 5}-12`}
                      value={exp.endDate || ""}
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

      case 3:
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
                      type="month"
                      className="create-resume-input"
                      min="1950-01"
                      max={`${new Date().getFullYear() + 5}-12`}
                      value={edu.startDate || ""}
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
                      type="month"
                      className="create-resume-input"
                      min="1950-01"
                      max={`${new Date().getFullYear() + 5}-12`}
                      value={edu.endDate || ""}
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

      case 4:
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

      case 5:
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

      case 6:
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

      case 7:
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
                  type="month"
                  placeholder="Month & Year"
                  className="create-resume-input"
                  value={award.year || ""}
                  onChange={(e) =>
                    handleArrayChange("awards", i, "year", e.target.value)
                  }
                />
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
    <div className="editor-overlay">
      <div className="editor-content">
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <button
              onClick={() => setShowTemplate(true)}
              className="toolbar-btn"
            >
              <LayoutTemplate size={17} /> Template
              {showTemplate && (
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
                          setShowTemplate(false);
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
            <button onClick={() => setShowAccent(true)} className="toolbar-btn">
              <Palette size={17} /> Accent
              {showAccent && (
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
                          setShowAccent(false);
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
          <div className="toolbar-right">
            {step > 1 && (
              <button
                className="nav-btn back"
                onClick={() => setStep((s) => s - 1)}
              >
                <ChevronLeft size={17} /> Back
              </button>
            )}
            {step < 7 && (
              <button
                className="nav-btn next"
                onClick={() => setStep((s) => s + 1)}
              >
                Next <ChevronRight size={17} />
              </button>
            )}
          </div>
        </div>

        <div className="editor-body">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: getProgress() }}
            ></div>
          </div>

          {renderStep()}

          <div className="footer">
            <button
              className="btn-save"
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
                "Genrate Resume"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResumeByAi;
