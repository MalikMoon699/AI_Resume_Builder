import React from "react";
import { Copy, Link, Mail, MapPin, Phone } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";
import "../assets/style/Resumes.css";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied!");
};

export const FormatResponse = ({ text }) => {
  return (
    <div className="format-wrapper">
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <>
                <div className="code-header">
                  <strong>Code</strong>
                  <span onClick={() => handleCopy(String(children))}>
                    <Copy size={15} />
                    Copy
                  </span>
                </div>
                <SyntaxHighlighter
                  style={materialDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </>
            ) : (
              <code {...props}>{children}</code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export const ClassicResume = ({ data }) => {
  const {
    title,
    summary,
    personalDetails,
    education,
    experience,
    projects,
    skills,
  } = data || {};

  return (
    <div className="formates classic-resume">
      <header className="classic-header">
        <h1>{personalDetails?.fullName || "Your Name"}</h1>
        <p className="classic-title">{personalDetails?.profession || title}</p>
      </header>

      <div className="classic-body">
        <aside className="classic-sidebar">
          <section className="contact">
            <h3>Contact</h3>
            <p>{personalDetails?.number}</p>
            <p>{personalDetails?.email}</p>
            <p>{personalDetails?.location}</p>
            {personalDetails?.personalWebsite && (
              <a
                href={personalDetails?.personalWebsite}
                target="_blank"
                rel="noreferrer"
              >
                {personalDetails?.personalWebsite}
              </a>
            )}
          </section>

          {education?.length > 0 && (
            <section className="education">
              <h3>Education</h3>
              {education.map((edu, i) => (
                <div key={i}>
                  <p className="degree">{edu?.degree}</p>
                  <p>{edu?.institutionName}</p>
                  <p className="year">
                    {edu?.startDate} -
                    {edu?.currentlyLearning ? "Present" : edu?.endDate}
                  </p>
                </div>
              ))}
            </section>
          )}

          {skills?.length > 0 && (
            <section className="skills">
              <h3>Skills</h3>
              <ul>
                {skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="classic-main">
          {summary && (
            <section className="profile">
              <h3>Professional Summary</h3>
              <p>{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="experience">
              <h3>Experience</h3>
              {experience.map((exp, i) => (
                <div key={i} className="job">
                  <h4>{exp?.jobTitle}</h4>
                  <p className="company">
                    {exp?.companyName} {exp?.startDate && `| ${exp?.startDate}`}
                    {exp?.currentlyWorking &&
                      ` -
                    ${exp?.currentlyWorking ? "Present" : exp?.endDate}
                   `}
                  </p>
                  <p>{exp?.jobDescription}</p>
                </div>
              ))}
            </section>
          )}

          {projects?.length > 0 && (
            <section className="projects">
              <h3>Projects</h3>
              {projects.map((p, i) => (
                <div key={i} className="project">
                  <h4>{p?.projectName}</h4>
                  <p>{p?.projectDescription}</p>
                  {p?.projectLink && (
                    <a href={p.projectLink} target="_blank" rel="noreferrer">
                      {p.projectLink}
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export const ModernResume = ({ data }) => {
  const { summary, personalDetails, education, experience, projects, skills } =
    data || {};

  return (
    <div className="formates modern-resume">
      <aside className="modern-sidebar">
        <div className="modern-header">
          <h1>{personalDetails?.fullName}</h1>
          <p className="modern-title">{personalDetails?.profession}</p>
          <div className="modern-contact">
            <p className="resume-collection">
              <span className="resume-icon">
                <Mail size={12} />
              </span>{" "}
              {personalDetails?.email}
            </p>
            <p>
              <span>
                <Phone size={12} />
              </span>{" "}
              {personalDetails?.number}
            </p>
            <p>
              <span>
                <MapPin size={12} />
              </span>{" "}
              {personalDetails?.location}
            </p>
            {personalDetails?.personalWebsite && (
              <p>
                <span>
                  <Link size={12} />
                </span>{" "}
                <a
                  href={personalDetails?.personalWebsite}
                  target="_blank"
                  rel="noreferrer"
                >
                  {personalDetails?.personalWebsite}
                </a>
              </p>
            )}
          </div>
        </div>
        {education?.length > 0 && (
          <section className="education">
            <h3>Education</h3>
            {education.map((edu, i) => (
              <div key={i} className="edu-item">
                <p>
                  {edu?.startDate?.slice(0, 4)}
                  {edu?.currentlyLearning ||edu?.endDate && (
                      ` - 
                  ${edu?.currentlyLearning
                    ? "Present"
                    : edu?.endDate?.slice(0, 4)}`)}
                </p>
                {edu?.institutionName && <h4>{edu?.institutionName}</h4>}
                {edu?.degree && <li>{edu?.degree}</li>}
              </div>
            ))}
          </section>
        )}
        {skills?.length > 0 && (
          <section className="skills">
            <h3>Skills</h3>
            <ul>
              {skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>
      <main className="modern-main">
        {summary && (
          <section className="profile-info">
            <h3>Professional Summary</h3>
            <p>{summary}</p>
          </section>
        )}
        {experience?.length > 0 && (
          <section className="experience">
            <h3>Experience</h3>
            {experience.map((exp, i) => (
              <div key={i} className="job">
                <h4>{exp?.companyName}</h4>
                <p className="company">
                  {exp?.jobTitle} {exp?.startDate && `| ${exp?.startDate}`}
                  {exp?.currentlyWorking &&
                    ` -
                    ${exp?.currentlyWorking ? "Present" : exp?.endDate}
                   `}
                </p>
                <p>{exp?.jobDescription}</p>
              </div>
            ))}
          </section>
        )}

        {projects?.length > 0 && (
          <section className="projects">
            <h3>Projects</h3>
            {projects.map((p, i) => (
              <div key={i} className="project">
                <h4>{p?.projectName}</h4>
                <p>{p?.projectDescription}</p>
                {p?.projectLink && (
                  <a href={p.projectLink} target="_blank" rel="noreferrer">
                    {p.projectLink}
                  </a>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export const EmptyResume = ({ onCreate }) => {
  return (
    <div className="empty-resume">
      <div className="empty-resume-content">
        <h2>No Resume Found</h2>
        <p>
          You haven’t created any resumes yet. Start building one now with our
          smart AI-powered builder.
        </p>
        <button className="empty-resume-btn" onClick={onCreate}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
