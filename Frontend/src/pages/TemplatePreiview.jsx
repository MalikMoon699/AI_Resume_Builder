import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Loader from "../components/Loader.jsx";
import { ResumePreview } from "../services/Constants.jsx";
import {
  EmptyResume,
  ClassicResume,
  ModernResume,
  MinimalistResume,
  CreativeResume,
  ElegantResume,
} from "../components/FormatResponse.jsx";
import { Copy, Download, Share2 } from "lucide-react";

const TemplatePreiview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const resumeRef = useRef();
  const resume = location.state?.resume;

  useEffect(() => {
    if (resume) {
      setTimeout(() => setLoading(false), 300); 
    } else {
      toast.error("No resume data found!");
      navigate("/dashboard");
    }
  }, [resume, navigate]);

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
      <div
        style={{
          "--accent-color": resume.accentColor || "#00af4e",
          cursor: "zoom-in",
        }}
        ref={resumeRef}
        className="resume-preview"
        onClick={() => {
          setIsZoomed(true);
        }}
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
              case "Elegant":
                return <ElegantResume data={resume} />;
              default:
                return <EmptyResume navigate={navigate} />;
            }
          })()}
        </div>
      </div>
      {isZoomed && (
        <div
          style={{
            cursor: "zoom-out",
            "--accent-color": resume.accentColor || "#00af4e",
          }}
          className="modal-overlay"
          onClick={() => setIsZoomed(false)}
        >
          <div className="modal-content">
            {resume?.resumeType ? (
              <ResumePreview
                item={resume}
                width="100%"
                height="100%"
                minWidth="300px"
              />
            ) : (
              <EmptyResume btn={false} navigate={navigate} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatePreiview;
