// services/Helpers.js
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export const buttonProvider = (location, navigate, currentUser) => {
  if (location === "/signUp") {
    return {
      className: "topbar-login-btn",
      title: "Login",
      action: () => navigate("/login"),
    };
  } else if (location === "/login") {
    return {
      className: "topbar-signUp-btn",
      title: "SignUp",
      action: () => navigate("/signUp"),
    };
  } else if (!currentUser?.email) {
    return {
      className: "topbar-signUp-btn",
      title: "SignUp",
      action: () => navigate("/signUp"),
    };
  } else {
    return {
      className: "topbar-logout-btn",
      title: "Logout",
      action: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    };
  }
};

export const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBDKJ4_M-nZswCgG8JDn3xcE01sPI3S6Og";

const templatescommondata = {
  _id: "66fa1c9d1a23bc456789abcd",
  user: "66fa1c9d1a23bc456789abce",
  summary:
    "Results-driven Full Stack Developer with a passion for building scalable web applications and crafting elegant user experiences. Skilled in React, Node.js, and MongoDB.",

  personalDetails: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    number: "+1 555 123 4567",
    location: "New York, USA",
    profession: "Full Stack Developer",
    personalWebsite: "https://johndoe.dev",
  },

  experience: [
    {
      companyName: "Techverse Solutions",
      jobTitle: "Senior Frontend Developer",
      startDate: "Jan 2023",
      endDate: "Present",
      currentlyWorking: true,
      jobDescription:
        "Leading the frontend team to build high-performance React apps. Implemented modern design systems and optimized state management using Redux Toolkit.",
    },
    {
      companyName: "CodeSmith Inc.",
      jobTitle: "Full Stack Developer",
      startDate: "Mar 2020",
      endDate: "Dec 2022",
      currentlyWorking: false,
      jobDescription:
        "Developed REST APIs with Express and integrated MongoDB for dynamic dashboards. Collaborated with designers to enhance UX and responsiveness.",
    },
  ],

  education: [
    {
      institutionName: "Stanford University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2016",
      endDate: "2020",
      currentlyLearning: false,
    },
  ],

  projects: [
    {
      projectName: "Smart Resume Builder",
      projectType: "Web Application",
      projectDescription:
        "Created a modern resume builder using React, Node.js, and MongoDB that allows users to generate beautiful resumes instantly.",
      projectLink: "https://github.com/johndoe/resume-builder",
    },
    {
      projectName: "Taskify – Team Management Tool",
      projectType: "SaaS Product",
      projectDescription:
        "Developed a collaborative task management system with real-time updates using Socket.IO and MongoDB change streams.",
      projectLink: "https://taskify.io",
    },
  ],

  skills: [
    "JavaScript (ES6+)",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Tailwind CSS",
    "Git & GitHub",
    "REST APIs",
    "Next.js",
    "TypeScript",
  ],

  languages: [
    { language: "English", proficiency: 98 },
    { language: "Spanish", proficiency: 80 },
  ],

  hobbies: ["Coding", "Photography", "Gaming", "Traveling"],

  awards: [
    {
      title: "Employee of the Year",
      organization: "Techverse Solutions",
      year: "2024",
      description:
        "Recognized for outstanding contribution to frontend development and leadership in the UI/UX revamp project.",
    },
    {
      title: "Hackathon Winner",
      organization: "Google Developer Group",
      year: "2022",
      description:
        "Won 1st place for developing an AI-powered productivity assistant in a 48-hour hackathon.",
    },
  ],

  accentColor: "#00af4e",
  createdAt: "2025-10-15T12:00:00.000Z",
  updatedAt: "2025-10-17T08:00:00.000Z",
};

export const resumeTemplateData = [
  {
    ...templatescommondata,
    resumeType: "Modern",
    title: "Modern template",
  },
  {
    ...templatescommondata,
    resumeType: "Classic",
    title: "Classic template",
  },
  {
    ...templatescommondata,
    resumeType: "Minimalist",
    title: "Minimalist template",
  },
  {
    ...templatescommondata,
    resumeType: "Creative",
    title: "Creative template",
  },
];

const geminiPrompt = (resume, make) => {
  return `
You are a professional resume writer. Generate the "${make}" section based on the provided resume data.

If "${make}" is "Experience":
- Focus ONLY on the most recent experience provided.
- Use the company name, job title, and context to write 3–5 **different job descriptions** (3–5 sentences each).
- Each description should sound professional, achievement-focused, and ATS-friendly.
- Avoid generic "Web Developer" summaries — tailor the text to the specific job title and company.
- Use strong action verbs (e.g., "developed", "implemented", "optimized", "collaborated").
- Emphasize quantifiable impact where possible.

Example JSON output:
{
  "Experience": [
    "Developed and maintained responsive front-end interfaces using React.js and Redux for TechVerse Solutions, improving page performance by 25%.",
    "Collaborated with backend developers to integrate REST APIs, ensuring seamless communication between front-end and server components.",
    "Implemented new UI features and optimized existing codebase, enhancing maintainability and reducing load times by 30%."
  ]
}

If "${make}" is "Projects":
- Use the project name, type, and link if available.
- Generate 3–5 engaging, professional descriptions (2–3 sentences each).
- Highlight technologies used, goals achieved, and measurable results.
- Avoid generic "This project was about..." phrasing; make it sound strong and concise.

Example Output:
{
  "Projects": [
    "Developed a full-stack eCommerce platform using React.js, Node.js, and MongoDB, enabling secure transactions and real-time inventory tracking.",
    "Built a responsive portfolio website to showcase design and coding projects, improving user engagement by 40%.",
    "Implemented REST APIs and dynamic routing to enhance project scalability and performance."
  ]
}

If "${make}" is "Awards & Achievements":
- Generate 3–5 professional one-line or short-paragraph descriptions.
- Focus on what the award represents, its relevance, and measurable outcomes.
- Keep tone confident but factual.

Example Output:
{
  "Awards & Achievements": [
    "Received 'Employee of the Year' at TechVerse Solutions for excellence in front-end development and team leadership.",
    "Awarded 'Best Innovation Project' at the National Hackathon 2024 for developing an AI-driven portfolio builder.",
    "Recognized by University of Karachi with the Dean’s Merit Award for outstanding academic performance."
  ]
}

If "${make}" is "Professional Summary":
- Generate 3–5 short professional summaries, 2–4 sentences each, tailored to the resume.

Return only valid JSON with the key "${make}".

Here is the user's resume data:
${JSON.stringify(resume, null, 2)}
`;
};

export const generateResumeSuggestions = async (resume, make) => {
  try {
    const prompt = geminiPrompt(resume, make);

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    if (!rawText) throw new Error("Empty Gemini response");

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const aiJson = JSON.parse(cleaned);

    const summaries = aiJson[make];
    if (!summaries || !Array.isArray(summaries)) throw new Error("Bad output");

    return [...summaries];
  } catch (error) {
    console.error("Error generating with Gemini:", error);
    return [];
  }
};

const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let textContent = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();

      const pageText = text.items.map((item) => item.str).join(" ");
      textContent += `\n${pageText}`;
    }

    return textContent.trim();
  } catch (error) {
    console.error("❌ PDF text extraction failed:", error);
    return "";
  }
};

export const detectResumeFromPDF = async (file) => {
  try {
    const text = await extractTextFromPDF(file);
    if (!text || text.length < 50) {
      throw new Error("Empty or invalid resume text extracted");
    }

    const prompt = `
You are a resume data extraction assistant. 
Analyze the following resume text and return JSON matching this schema:
{
  "summary": string,
  "personalDetails": {
    "fullName": string,
    "email": string,
    "number": string,
    "location": string,
    "profession": string,
    "personalWebsite": string
  },
    "experience": [{
    "companyName": string,
    "jobTitle": string,
    "startDate": string,
    "endDate": string,
    "currentlyWorking": boolean,
    "jobDescription": string
  }],
  "education": [{
    "institutionName": string,
    "degree": string,
    "fieldOfStudy": string,
    "startDate": string,
    "endDate": string,
    "currentlyLearning": boolean
  }],
  "projects": [{
    "projectName": string,
    "projectType": string,
    "projectDescription": string,
    "projectLink": string
  }],
    "skills": string[],
  "languages": [{ "language": string, "proficiency": Number }],
  "hobbies": string[],
  "awards": [{ "title": string, "organization": string, "year": string, "description": string }]
}

Resume Text:
${text}
    `;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    let output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    output = output.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(output);

    return parsed;
  } catch (err) {
    console.error("❌ Error parsing resume:", err.message);
    return null;
  }
};

export const formatMonthYear = (val) => {
  if (!val) return "";

  const date = new Date(`${val}-01`);
  if (isNaN(date)) return val;
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};
