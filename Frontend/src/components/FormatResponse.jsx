import React from "react";
import { Copy, Link, Mail, MapPin, Phone } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { formatMonthYear } from "../services/Helpers";
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

// ===================== CLASSIC RESUME =====================

export const ClassicResume = ({ data }) => {
  const {
    title,
    summary,
    personalDetails,
    education,
    experience,
    projects,
    skills,
    languages,
    hobbies,
    awards,
  } = data || {};

  return (
    <div className="formates classic-resume">
      <header className="classic-header">
        <h1>{personalDetails?.fullName || "Your Name"}</h1>
        {(personalDetails?.profession || title) && (
          <p className="classic-title">
            {personalDetails?.profession || title}
          </p>
        )}
      </header>

      <div className="classic-body">
        <aside className="classic-sidebar">
          {(personalDetails?.email ||
            personalDetails?.number ||
            personalDetails?.location ||
            personalDetails?.personalWebsite) && (
            <section className="contact">
              <h3>Contact</h3>
              <div className="modern-contact">
                {personalDetails?.email && (
                  <p>
                    <span>
                      <Mail size={12} />
                    </span>{" "}
                    {personalDetails?.email}
                  </p>
                )}
                {personalDetails?.number && (
                  <p>
                    <span>
                      <Phone size={12} />
                    </span>{" "}
                    {personalDetails?.number}
                  </p>
                )}
                {personalDetails?.location && (
                  <p>
                    <span>
                      <MapPin size={12} />
                    </span>{" "}
                    {personalDetails?.location}
                  </p>
                )}
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
            </section>
          )}

          {education?.length > 0 && (
            <section className="education">
              <h3>Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="edu-item">
                  {(edu?.startDate ||
                    edu?.endDate ||
                    edu?.currentlyLearning) && (
                    <p>
                      {formatMonthYear(edu.startDate)}
                      {(edu?.endDate || edu?.currentlyLearning) && (
                        <>
                          {" - "}
                          {edu?.currentlyLearning
                            ? "Present"
                            : formatMonthYear(edu.endDate)}
                        </>
                      )}
                    </p>
                  )}
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
                {skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {languages?.length > 0 && (
            <section className="languages">
              <h3>Languages</h3>
              <ul>
                {languages.map((lang, i) => (
                  <div className="language-item" key={i}>
                    {(lang?.language || lang?.proficiency) && (
                      <li>
                        {lang?.language}
                        {lang?.proficiency && ` — ${lang?.proficiency}%`}
                      </li>
                    )}
                    {lang?.proficiency && (
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${lang.proficiency}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </section>
          )}

          {hobbies?.length > 0 && (
            <section className="hobbies">
              <h3>Hobbies</h3>
              <ul>
                {hobbies.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="classic-main">
          {summary && (
            <section className="profile">
              <h3>Professional Summary</h3>
              <FormatResponse text={summary} />
            </section>
          )}

          {experience?.length > 0 && (
            <section className="experience">
              <h3>Experience</h3>
              {experience.map((exp, i) => (
                <div key={i} className="job">
                  {exp?.companyName && <h4>{exp?.companyName}</h4>}
                  {(exp?.jobTitle ||
                    exp?.startDate ||
                    exp?.endDate ||
                    exp?.currentlyWorking) && (
                    <div className="award-item-header">
                      {exp?.jobTitle && (
                        <p className="company">{exp?.jobTitle}</p>
                      )}
                      {(exp?.startDate ||
                        exp?.endDate ||
                        exp?.currentlyWorking) && (
                        <span>
                          {exp?.startDate &&
                            `| ${formatMonthYear(exp.startDate)}`}
                          {(exp?.endDate || exp?.currentlyWorking) && (
                            <>
                              {" - "}
                              {exp?.currentlyWorking
                                ? "Present"
                                : formatMonthYear(exp.endDate)}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                  {exp?.jobDescription && (
                    <FormatResponse text={exp?.jobDescription} />
                  )}
                </div>
              ))}
            </section>
          )}

          {projects?.length > 0 && (
            <section className="projects">
              <h3>Projects</h3>
              {projects.map((p, i) => (
                <div key={i} className="project">
                  {(p?.projectName || p?.projectType) && (
                    <p>
                      {p?.projectName && <strong>{p?.projectName}</strong>}
                      {p?.projectType && ` – ${p?.projectType}`}
                    </p>
                  )}
                  {p?.projectDescription && (
                    <FormatResponse text={p?.projectDescription} />
                  )}
                  {p?.projectLink && (
                    <a href={p.projectLink} target="_blank" rel="noreferrer">
                      {p.projectLink}
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}

          {awards?.length > 0 && (
            <section className="awards">
              <h3>Awards</h3>
              {awards.map((a, i) => (
                <div key={i}>
                  {(a?.title || a?.organization) && (
                    <p>
                      {a?.title && <strong>{a?.title}</strong>}
                      {a?.organization && ` – ${a?.organization}`}
                    </p>
                  )}
                  {a?.year && (
                    <span className="award-year">{formatMonthYear(a?.year)}</span>
                  )}
                  {a?.description && <FormatResponse text={a?.description} />}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

// ===================== MODERN RESUME =====================

export const ModernResume = ({ data }) => {
  const {
    summary,
    personalDetails,
    education,
    experience,
    projects,
    skills,
    languages,
    hobbies,
    awards,
  } = data || {};

  return (
    <div className="formates modern-resume">
      <aside className="modern-sidebar">
        <div className="modern-header">
          {personalDetails?.fullName && <h1>{personalDetails?.fullName}</h1>}
          {personalDetails?.profession && (
            <p className="modern-title">{personalDetails?.profession}</p>
          )}
          {(personalDetails?.email ||
            personalDetails?.number ||
            personalDetails?.location ||
            personalDetails?.personalWebsite) && (
            <div className="modern-contact">
              {personalDetails?.email && (
                <p>
                  <span>
                    <Mail size={12} />
                  </span>{" "}
                  {personalDetails?.email}
                </p>
              )}
              {personalDetails?.number && (
                <p>
                  <span>
                    <Phone size={12} />
                  </span>{" "}
                  {personalDetails?.number}
                </p>
              )}
              {personalDetails?.location && (
                <p>
                  <span>
                    <MapPin size={12} />
                  </span>{" "}
                  {personalDetails?.location}
                </p>
              )}
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
          )}
        </div>

        {education?.length > 0 && (
          <section className="education">
            <h3>Education</h3>
            {education.map((edu, i) => (
              <div key={i} className="edu-item">
                {(edu?.startDate || edu?.endDate || edu?.currentlyLearning) && (
                  <p>
                    {formatMonthYear(edu.startDate)}
                    {(edu?.endDate || edu?.currentlyLearning) && (
                      <>
                        {" - "}
                        {edu?.currentlyLearning
                          ? "Present"
                          : formatMonthYear(edu.endDate)}
                      </>
                    )}
                  </p>
                )}
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

        {languages?.length > 0 && (
          <section className="languages">
            <h3>Languages</h3>
            <ul>
              {languages.map((lang, i) => (
                <div className="language-item" key={i}>
                  {(lang?.language || lang?.proficiency) && (
                    <li>
                      {lang?.language}
                      {lang?.proficiency && ` — ${lang?.proficiency}%`}
                    </li>
                  )}
                  {lang?.proficiency && (
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${lang.proficiency}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </section>
        )}

        {hobbies?.length > 0 && (
          <section className="hobbies">
            <h3>Hobbies</h3>
            <ul>
              {hobbies.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      <main className="modern-main">
        {summary && (
          <section className="profile-info">
            <h3>Professional Summary</h3>
            <FormatResponse text={summary} />
          </section>
        )}

        {experience?.length > 0 && (
          <section className="experience">
            <h3>Experience</h3>
            {experience.map((exp, i) => (
              <div key={i} className="job">
                {exp?.companyName && <h4>{exp?.companyName}</h4>}
                {(exp?.jobTitle ||
                  exp?.startDate ||
                  exp?.endDate ||
                  exp?.currentlyWorking) && (
                  <div className="award-item-header">
                    {exp?.jobTitle && (
                      <p className="company">{exp?.jobTitle}</p>
                    )}
                    {(exp?.startDate ||
                      exp?.endDate ||
                      exp?.currentlyWorking) && (
                      <span>
                        {exp?.startDate &&
                          `| ${formatMonthYear(exp.startDate)}`}
                        {(exp?.endDate || exp?.currentlyWorking) && (
                          <>
                            {" - "}
                            {exp?.currentlyWorking
                              ? "Present"
                              : formatMonthYear(exp.endDate)}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                )}
                {exp?.jobDescription && (
                  <FormatResponse text={exp?.jobDescription} />
                )}
              </div>
            ))}
          </section>
        )}

        {projects?.length > 0 && (
          <section className="projects">
            <h3>Projects</h3>
            {projects.map((p, i) => (
              <div key={i} className="project">
                {(p?.projectName || p?.projectType) && (
                  <p>
                    {p?.projectName && <strong>{p?.projectName}</strong>}
                    {p?.projectType && ` – ${p?.projectType}`}
                  </p>
                )}
                {p?.projectDescription && (
                  <FormatResponse text={p?.projectDescription} />
                )}
                {p?.projectLink && (
                  <a href={p.projectLink} target="_blank" rel="noreferrer">
                    {p.projectLink}
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {awards?.length > 0 && (
          <section className="awards">
            <h3>Awards</h3>
            {awards.map((a, i) => (
              <div key={i} className="award-item">
                {(a?.title || a?.organization) && (
                  <p>
                    {a?.title && <strong>{a?.title}</strong>}
                    {a?.organization && ` – ${a?.organization}`}
                  </p>
                )}
                {a?.year && (
                  <span className="award-year">{formatMonthYear(a?.year)}</span>
                )}
                {a?.description && <FormatResponse text={a?.description} />}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

// ===================== Minimalist RESUME =====================
export const MinimalistResume = ({ data }) => {
  const {
    personalDetails,
    summary,
    experience,
    education,
    skills,
    projects,
    awards,
    languages,
    hobbies,
  } = data || {};

  return (
    <div className="formates minimalist-resume">
      <header className="minimalist-header">
        {personalDetails?.fullName && <h1>{personalDetails.fullName}</h1>}
        {personalDetails?.profession && <p>{personalDetails.profession}</p>}
      </header>

      {(personalDetails?.email ||
        personalDetails?.number ||
        personalDetails?.location ||
        personalDetails?.personalWebsite) && (
        <section className="minimalist-contact">
          {personalDetails?.email && <p>Email: {personalDetails.email}</p>}
          {personalDetails?.number && <p>Phone: {personalDetails.number}</p>}
          {personalDetails?.location && (
            <p>Location: {personalDetails.location}</p>
          )}
          {personalDetails?.personalWebsite && (
            <p>
              Website:{" "}
              <a href={personalDetails.personalWebsite} target="_blank">
                {personalDetails.personalWebsite}
              </a>
            </p>
          )}
        </section>
      )}

      {summary && (
        <section className="minimalist-summary">
          <h3>Summary</h3>
          <FormatResponse text={summary} />
        </section>
      )}

      {experience?.length > 0 && (
        <section className="minimalist-experience">
          <h3>Experience</h3>
          {experience.map((exp, i) => (
            <div key={i} className="job">
              <div>
                {(exp?.jobTitle || exp?.companyName) && (
                  <p>
                    <strong>{i + 1}. </strong>
                    <strong>{exp?.jobTitle && exp.jobTitle}</strong>
                    {exp?.companyName && `— ${exp.companyName}`}
                  </p>
                )}
                {(exp?.startDate || exp?.endDate || exp?.currentlyWorking) && (
                  <span>
                    {formatMonthYear(exp.startDate)} -{" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : formatMonthYear(exp.endDate)}
                  </span>
                )}
              </div>
              {exp?.jobDescription && (
                <FormatResponse text={exp.jobDescription} />
              )}
            </div>
          ))}
        </section>
      )}

      {education?.length > 0 && (
        <section className="minimalist-education">
          <h3>Education</h3>
          {education.map((edu, i) => (
            <p key={i}>
              {(edu?.degree || edu?.institutionName) && (
                <>
                  <strong>{i + 1}. </strong>
                  <strong>{edu.degree}</strong>— {edu.institutionName} (
                  {formatMonthYear(edu?.startDate)} -{" "}
                  {edu.currentlyLearning
                    ? "Present"
                    : formatMonthYear(edu?.endDate)}
                  )
                </>
              )}
            </p>
          ))}
        </section>
      )}

      {skills?.length > 0 && (
        <section className="minimalist-skills">
          <h3>Skills</h3>
          <p>{skills.join(", ")}</p>
        </section>
      )}
      {languages?.length > 0 && (
        <section className="minimalist-languages">
          <h3>Languages</h3>
          <ul>
            {languages?.map((lang, i) => (
              <li key={i}>
                {lang.language}
                {lang.proficiency && ` — ${lang.proficiency}%`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hobbies?.length > 0 && (
        <section className="minimalist-hobbies">
          <h3>Hobbies</h3>
          <p>{hobbies.join(", ")}</p>
        </section>
      )}

      {projects?.length > 0 && (
        <section className="minimalist-projects">
          <h3>Projects</h3>
          {projects.map(
            (p, i) =>
              (p?.projectName || p?.projectType) && (
                <div key={i}>
                  <p>
                    <strong>{i + 1}. </strong>
                    <strong>{p.projectName}</strong>
                    {p.projectType && <>— {p.projectType}</>}
                  </p>
                  {p.projectLink && <a href={p.projectLink}>{p.projectLink}</a>}
                  {p?.projectDescription && (
                    <FormatResponse text={p.projectDescription} />
                  )}
                </div>
              )
          )}
        </section>
      )}

      {awards?.length > 0 && (
        <section className="minimalist-awards">
          <h3>Awards</h3>
          {awards.map(
            (a, i) =>
              (a?.title || a?.organization || a?.year) && (
                <div key={i}>
                  <p>
                    <strong>{i + 1}. </strong>
                    <strong> {a.title}</strong>— {a.organization} (
                    {formatMonthYear(a.year)})
                  </p>
                  {a?.description && <FormatResponse text={a.description} />}
                </div>
              )
          )}
        </section>
      )}
    </div>
  );
};

// =====================  Creative RESUME =====================
export const CreativeResume = ({ data }) => {
  const {
    personalDetails,
    summary,
    experience,
    education,
    skills,
    projects,
    hobbies,
    awards,
    languages,
    accentColor,
  } = data || {};

  return (
    <div className="formates creative-resume">
      {(personalDetails?.fullName || personalDetails?.profession) && (
        <header
          className="creative-header"
          style={{ backgroundColor: accentColor || "#00af4e" }}
        >
          {personalDetails?.fullName && <h1>{personalDetails.fullName}</h1>}
          {personalDetails?.profession && <p>{personalDetails.profession}</p>}
          <div className="creative-header-tablates">
            {personalDetails?.email && (
              <p>
                <span>
                  <Mail size={16} />
                </span>
                {personalDetails?.email}
              </p>
            )}
            {personalDetails?.number && (
              <p>
                <span>
                  <Phone size={16} />
                </span>
                {personalDetails?.number}
              </p>
            )}
            {personalDetails?.location && (
              <p>
                <span>
                  <MapPin size={16} />
                </span>
                {personalDetails?.location}
              </p>
            )}
          </div>
          {personalDetails?.personalWebsite && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "0px", marginRight: "6px" }}>
                <Link size={16} />
              </span>
              <a
                style={{ color: "white", marginBottom: "2px" }}
                href={personalDetails.personalWebsite}
                target="_blank"
              >
                {personalDetails.personalWebsite}
              </a>
            </p>
          )}
        </header>
      )}

      <main className="creative-main">
        {summary && (
          <section>
            <h3>About Me</h3>
            <FormatResponse text={summary} />
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h3>Work Experience</h3>
            {experience.map(
              (exp, i) =>
                (exp?.jobTitle || exp?.companyName) && (
                  <div key={i} className="creative-job">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "4px",
                      }}
                    >
                      {(exp?.jobTitle || exp?.companyName) && (
                        <p>
                          <strong>{i + 1}. </strong>
                          <strong>{exp?.jobTitle && exp.jobTitle}</strong>
                          {exp?.companyName && `— ${exp.companyName}`}
                        </p>
                      )}
                      {(exp?.startDate ||
                        exp?.endDate ||
                        exp?.currentlyWorking) && (
                        <span>
                          {formatMonthYear(exp.startDate)} -{" "}
                          {exp.currentlyWorking
                            ? "Present"
                            : formatMonthYear(exp.endDate)}
                        </span>
                      )}
                    </div>
                    {exp.jobDescription && (
                      <FormatResponse text={exp.jobDescription} />
                    )}
                  </div>
                )
            )}
          </section>
        )}

        {education?.length > 0 && (
          <section>
            <h3>Education</h3>
            {education.map(
              (edu, i) =>
                (edu?.degree || edu?.institutionName) && (
                  <div key={i}>
                    <strong>{i + 1}. </strong>
                    <strong>{edu.degree}</strong> — {edu.institutionName} (
                    {formatMonthYear(edu.startDate)} -{" "}
                    {edu.currentlyLearning
                      ? "Present"
                      : formatMonthYear(edu.endDate)}
                    )
                  </div>
                )
            )}
          </section>
        )}

        {skills?.length > 0 && (
          <section>
            <h3>Skills</h3>
            <ul className="creative-skills">
              {skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {languages?.length > 0 && (
          <section>
            <h3>Languages</h3>
            <ul>
              {languages.map((lang, i) => (
                <li key={i}>
                  {lang.language} — {lang.proficiency}%
                </li>
              ))}
            </ul>
          </section>
        )}

        {hobbies?.length > 0 && (
          <section>
            <h3>Hobbies</h3>
            <ul>
              {hobbies.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {projects?.length > 0 && (
          <section>
            <h3>Projects</h3>
            {projects.map(
              (p, i) =>
                (p?.projectName || p?.projectType) && (
                  <div key={i}>
                    <p>
                      <strong>{i + 1}. </strong>
                      <strong>{p.projectName}</strong>{" "}
                      {p.projectType && <> — {p.projectType}</>}
                    </p>
                    {p.projectLink && (
                      <p>
                        <a href={p.projectLink}>{p.projectLink}</a>
                      </p>
                    )}
                    {p?.projectDescription && (
                      <FormatResponse text={p?.projectDescription} />
                    )}
                  </div>
                )
            )}
          </section>
        )}

        {awards?.length > 0 && (
          <section>
            <h3>Awards</h3>
            {awards.map(
              (a, i) =>
                (a?.title || a?.organization || a?.year) && (
                  <div key={i}>
                    <p>
                      <strong>{i + 1}. </strong>
                      <strong>{a?.title}</strong> — {a.organization} (
                      {formatMonthYear(a.year)})
                    </p>
                    {a?.description && <FormatResponse text={a?.description} />}
                  </div>
                )
            )}
          </section>
        )}
      </main>
    </div>
  );
};

// =====================  Elegant RESUME =====================

export const ElegantResume = ({ data }) => {
  const {
    title,
    summary,
    personalDetails,
    education,
    experience,
    projects,
    skills,
    languages,
    hobbies,
    awards,
  } = data || {};


  return (
    <div className="formates elegant-resume">
      <header className="elegant-header">
        <h1>{personalDetails?.fullName}</h1>
        {personalDetails?.profession && (
          <p className="elegant-title">{personalDetails?.profession}</p>
        )}
        <div className="elegant-contact">
          {personalDetails?.email && (
            <p className="">
              <span className="elegant-icon">
                <Mail size={14} />
              </span>{" "}
              {personalDetails?.email}
            </p>
          )}
          {personalDetails?.number && (
            <p>
              <span className="elegant-icon">
                <Phone size={13} />
              </span>{" "}
              {personalDetails?.number}
            </p>
          )}
          {personalDetails?.location && (
            <p>
              <span className="elegant-icon">
                <MapPin size={14} />
              </span>{" "}
              {personalDetails?.location}
            </p>
          )}
          {personalDetails?.personalWebsite && (
            <p>
              <span className="elegant-icon">
                <Link size={14} />
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
      </header>

      <div className="elegant-body">
        <aside className="elegant-sidebar">
          {education?.length > 0 && (
            <section className="education">
              <h3>Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="edu-item">
                  {(edu?.startDate ||
                    edu?.endDate ||
                    edu?.currentlyLearning) && (
                    <p>
                      {formatMonthYear(edu.startDate)}
                      {(edu?.endDate || edu?.currentlyLearning) && (
                        <>
                          {" - "}
                          {edu?.currentlyLearning
                            ? "Present"
                            : formatMonthYear(edu.endDate)}
                        </>
                      )}
                    </p>
                  )}
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
                {skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {languages?.length > 0 && (
            <section className="languages">
              <h3>Languages</h3>
              <ul>
                {languages.map((lang, i) => (
                  <div className="language-item" key={i}>
                    {(lang?.language || lang?.proficiency) && (
                      <li>
                        {lang?.language}
                        {lang?.proficiency && ` — ${lang?.proficiency}%`}
                      </li>
                    )}
                    {lang?.proficiency && (
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${lang.proficiency}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </section>
          )}

          {hobbies?.length > 0 && (
            <section className="hobbies">
              <h3>Hobbies</h3>
              <ul>
                {hobbies.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="elegant-main">
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
                  {exp?.companyName && <h4>{exp?.companyName}</h4>}
                  {(exp?.jobTitle ||
                    exp?.startDate ||
                    exp?.endDate ||
                    exp?.currentlyWorking) && (
                    <div className="award-item-header">
                      {exp?.jobTitle && (
                        <p className="company">{exp?.jobTitle}</p>
                      )}
                      {(exp?.startDate ||
                        exp?.endDate ||
                        exp?.currentlyWorking) && (
                        <span className="company-date-container">
                          {exp?.startDate &&
                            `${formatMonthYear(exp.startDate)}`}
                          {(exp?.endDate || exp?.currentlyWorking) && (
                            <>
                              {" - "}
                              {exp?.currentlyWorking
                                ? "Present"
                                : formatMonthYear(exp.endDate)}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                  {exp?.jobDescription && <p>{exp?.jobDescription}</p>}
                </div>
              ))}
            </section>
          )}

          {projects?.length > 0 && (
            <section className="projects">
              <h3>Projects</h3>
              {projects.map((p, i) => (
                <div key={i} className="project">
                  {(p?.projectName || p?.projectType) && (
                    <p>
                      {p?.projectName && <strong>{p?.projectName}</strong>}
                      {p?.projectType && ` – ${p?.projectType}`}
                    </p>
                  )}
                  {p?.projectDescription && <p>{p?.projectDescription}</p>}
                  {p?.projectLink && (
                    <a href={p.projectLink} target="_blank">
                      {p.projectLink}
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}

          {awards?.length > 0 && (
            <section className="awards">
              <h3>Awards</h3>
              {awards.map((a, i) => (
                <div key={i}>
                  {(a?.title || a?.organization) && (
                    <p>
                      {a?.title && <strong>{a?.title}</strong>}
                      {a?.organization && ` – ${a?.organization}`}
                    </p>
                  )}
                  {a?.year && (
                    <span className="award-year">
                      {formatMonthYear(a?.year)}
                    </span>
                  )}
                  {a?.description && <p>{a?.description}</p>}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

// ===================== EMPTY RESUME =====================

export const EmptyResume = ({ navigate, btn = true }) => {
  const onBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="empty-resume">
      <div className="empty-resume-content">
        <h2>No Resume Found</h2>
        <p>
          You haven’t created any resumes yet. Start building one now with our
          smart AI-powered builder.
        </p>
        {btn && (
          <button className="empty-resume-btn" onClick={onBack}>
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};
