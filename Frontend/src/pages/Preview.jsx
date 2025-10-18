import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ResumePreview } from "../services/Constants.jsx";
import { EmptyResume } from "../components/FormatResponse.jsx";

const Preview = () => {
  const { id } = useParams();
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

  const handleDownload = async () => {
    const element = resumeRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resume?.name || "resume"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

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
        {item?.resumeType ? (
          <ResumePreview
            item={resume}
            width="100%"
            height="90vh"
            minWidth="300px"
          />
        ) : (
          <EmptyResume btn={false} navigate={navigate} />
        )}
      </div>
    </div>
  );
};

export default Preview;
