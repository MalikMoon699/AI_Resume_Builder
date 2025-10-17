import React from "react";
import "../assets/style/LandingPage.css";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router";
import { ResumePreview } from "../services/Constants.jsx";
import { resumeTemplateData } from "../services/Helpers.js";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo">
          <div className="logo-icon">AI</div>
          <h1>AI Resume Builder</h1>
        </div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#templates">Templates</a>
          <a href="#contact">Contact</a>
          <button
            onClick={() => navigate("/dashboard")}
            className="landing-btn"
          >
            Get Started
          </button>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="hero-content">
          <h2>
            Build your <span>professional resume</span> in seconds with AI
          </h2>
          <p>
            A clean, modern, and smart resume builder for job seekers, students,
            and professionals. Let AI handle the hard part — you focus on your
            career.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary"
            >
              Start Building <ArrowRight size={18} />
            </button>
            <button
              onClick={() => {
                const section = document.getElementById("templates");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-secondary"
            >
              Explore Templates
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/hero-resume-preview.png"
            alt="AI Resume Preview"
            className="preview-img"
          />
        </div>
      </section>

      <section className="landing-features" id="features">
        <h3>Why Choose AI Resume Builder?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <Sparkles size={28} color="#00af4e" />
            <h4>AI-Powered Suggestions</h4>
            <p>Generate optimized content for your resume instantly.</p>
          </div>
          <div className="feature-card">
            <CheckCircle size={28} color="#00af4e" />
            <h4>Modern Templates</h4>
            <p>Choose from clean, professional templates built to impress.</p>
          </div>
          <div className="feature-card">
            <CheckCircle size={28} color="#00af4e" />
            <h4>Fast & Easy</h4>
            <p>Create your resume in minutes — not hours.</p>
          </div>
        </div>
      </section>

      <section className="landing-template" id="templates">
        <h3>Explore Our AI Resume Templates</h3>

        <div className="landing-template-carousel">
          <div className="landing-carousel-track">
            {[
              ...resumeTemplateData,
              ...resumeTemplateData,
              ...resumeTemplateData,
              ...resumeTemplateData,
              ...resumeTemplateData,
              ...resumeTemplateData,
              ...resumeTemplateData,
              ...resumeTemplateData,
            ].map((item, index) => (
              <div
                key={index}
                className="landing-dashboard-resume-card"
                style={{ cursor: "default" }}
              >
                <div
                  style={{ "--accent-color": item.accentColor || "#00af4e" }}
                  className="landing-resume-preview"
                >
                  <ResumePreview margin="0px 0px -4px 0px" item={item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-contact" id="contact">
        <h3>Contact Us</h3>
        <p>
          We’d love to hear from you! Reach out for questions, support, or
          collaboration.
        </p>

        <div className="contact-grid">
          <div className="contact-card">
            <Mail size={24} color="#00af4e" />
            <h4>Email</h4>
            <p>support@airesumebuilder.com</p>
          </div>
          <div className="contact-card">
            <Phone size={24} color="#00af4e" />
            <h4>Phone</h4>
            <p>+1 (234) 567-890</p>
          </div>
          <div className="contact-card">
            <MapPin size={24} color="#00af4e" />
            <h4>Location</h4>
            <p>123 AI Street, Tech City, USA</p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h3>Ready to build your dream resume?</h3>
        <p>Join thousands of users crafting professional resumes with AI.</p>
      </section>

      <footer className="landing-footer">
        <p>
          © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
