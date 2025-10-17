// services/Helpers.js
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

export const resumeTemplateData = [
  {
    _id: "66fa1c9d1a23bc456789abcd",
    user: "66fa1c9d1a23bc456789abce",
    title: "Modern template",
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
    resumeType: "Modern",
    createdAt: "2025-10-15T12:00:00.000Z",
    updatedAt: "2025-10-17T08:00:00.000Z",
  },
  {
    _id: "66fa1c9d1a23bc456789abcd",
    user: "66fa1c9d1a23bc456789abce",
    title: "Classic template",
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
    resumeType: "Classic",
    createdAt: "2025-10-15T12:00:00.000Z",
    updatedAt: "2025-10-17T08:00:00.000Z",
  },
];

