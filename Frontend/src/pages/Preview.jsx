import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Loader from "../components/Loader.jsx";
import { ResumePreview } from "../services/Constants.jsx";
import {
  EmptyResume,
  ClassicResume,
  ModernResume,
  MinimalistResume,
  CreativeResume,
} from "../components/FormatResponse.jsx";

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/resume/get/${id}`
        );
        const data = await res.json();
        setResume(data);
      } catch (err) {
        console.error("Error fetching resume:", err);
        toast.error("Failed to load resume data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResume();
  }, [id]);

  const handleShare = async () => {
    const shareUrl = `${import.meta.env.VITE_FRONTEND_URL}/resume/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Resume",
          text: "Check out my resume!",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.info("Share link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const handleCopy = async () => {
    const copyUrl = `${import.meta.env.VITE_FRONTEND_URL}/resume/${id}`;
    try {
      await navigator.clipboard.writeText(copyUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
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

  return (
    <div className="preview-container">
      {resume?.resumeType && (
        <div className="preview-action-container">
          <button onClick={handleDownload} className="preview-action download">
            Download
          </button>
          <button onClick={handleShare} className="preview-action share">
            Share
          </button>
          <button onClick={handleCopy} className="preview-action download">
            Copy Link
          </button>
        </div>
      )}
      <div
        style={{ "--accent-color": resume.accentColor || "#00af4e" }}
        ref={resumeRef}
        className="resume-preview"
      >
        {resume?.resumeType ? (
          <ResumePreview
            item={resume}
            width="100%"
            height="90vh"
            minWidth="300px"
          />
        ) : (
          <EmptyResume btn={false} navigate={navigate} />
        )}

        <div
          ref={resumeRef}
          className="resume-print hidden-print"
          style={{
            background: "#fff",
          }}
        >
          {(() => {
            switch (resume?.resumeType) {
              case "Modern":
                return <ModernResume data={resume} />;
              case "Classic":
                return <ClassicResume data={resume} />;
              case "Minimalist":
                return <MinimalistResume data={resume} />;
              case "Creative":
                return <CreativeResume data={resume} />;
              default:
                return <EmptyResume navigate={navigate} />;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default Preview;
