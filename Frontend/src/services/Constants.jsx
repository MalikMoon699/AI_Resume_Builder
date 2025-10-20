import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader.jsx";
import {
  ClassicResume,
  ModernResume,
  MinimalistResume,
  CreativeResume,
  ElegantResume,
} from "../components/FormatResponse.jsx";

export const ResumePreview = ({
  item,
  height = "297px",
  width = "210px",
  minHeight = "",
  minWidth = "",
  margin = "",
}) => {
  const previewRef = useRef(null);
  const [img, setImg] = useState(null);
  const [ready, setReady] = useState(false);

  const waitForFonts = async () => {
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch {
        console.warn("Font loading timeout or unsupported browser.");
      }
    }
  };

  useEffect(() => {
    if (!previewRef.current) return;

    const generatePreview = async () => {
      await waitForFonts();

      await new Promise((resolve) => setTimeout(resolve, 800));

      const node = previewRef.current;

      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn("Resume node has no visible size yet!");
        return;
      }

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: node.scrollWidth,
        height: node.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      setImg(imgData);
      setReady(true);
    };

    generatePreview();
  }, [item]);

  return (
    <>
      <div
        ref={previewRef}
        style={{
          position: "absolute",
          top: "-1000vh",
          left: "-1000vw",
          zIndex: -9999,
          opacity: 1,
          pointerEvents: "none",
          height: "800px",
          width: "800px",
        }}
      >
        {(() => {
          switch (item?.resumeType) {
            case "Modern":
              return <ModernResume data={item} />;
            case "Classic":
              return <ClassicResume data={item} />;
            case "Minimalist":
              return <MinimalistResume data={item} />;
            case "Creative":
              return <CreativeResume data={item} />;
            case "Elegant":
              return <ElegantResume data={item} />;
          }
        })()}
      </div>

      {ready && img ? (
        <img
          src={img}
          alt={item?.title}
          style={{
            width: width,
            height: height,
            minHeight: minHeight,
            minWidth: minWidth,
            border: "1px solid #ddd",
            borderRadius: "8px",
            objectFit: "contain",
            margin: margin,
          }}
        />
      ) : (
        <div
          style={{
            width: width,
            height: height,
            minHeight: minHeight,
            minWidth: minWidth,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            border: "1px dashed #ccc",
            color: "#999",
            fontSize: "14px",
            margin: margin,
          }}
        >
          <Loader />
        </div>
      )}
    </>
  );
};


// import html2canvas from "html2canvas";
// import { useEffect, useRef, useState } from "react";
// import Loader from "../components/Loader.jsx";
// import {
//   ClassicResume,
//   ModernResume,
//   MinimalistResume,
//   CreativeResume,
//   ElegantResume,
// } from "../components/FormatResponse.jsx";

// export const ResumePreview = ({
//   item,
//   height = "297px",
//   width = "210px",
//   minHeight = "",
//   minWidth = "",
//   margin = "",
// }) => {
//   const previewRef = useRef(null);
//   const [img, setImg] = useState(null);
//   const [ready, setReady] = useState(false);

//   const waitForFonts = async () => {
//     if (document.fonts) {
//       try {
//         await document.fonts.ready;
//       } catch {
//         console.warn("Font loading timeout or unsupported browser.");
//       }
//     }
//   };

//   useEffect(() => {
//     if (!previewRef.current) return;

//     const generatePreview = async () => {
//       await waitForFonts();
//       await new Promise((resolve) => setTimeout(resolve, 800));

//       const node = previewRef.current;
//       if (!node) {
//         console.warn("Preview ref is not available!");
//         return;
//       }

//       const rect = node.getBoundingClientRect();
//       if (rect.width === 0 || rect.height === 0) {
//         console.warn("Resume node has no visible size yet!");
//         return;
//       }

//       const canvas = await html2canvas(node, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         width: node.scrollWidth,
//         height: node.scrollHeight,
//         windowWidth: node.scrollWidth,
//         windowHeight: node.scrollHeight,
//         x: 0,
//         y: 0,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       setImg(imgData);
//       setReady(true);
//     };

//     generatePreview();
//   }, [item]);

//   return (
//     <>
//       <div
//         ref={previewRef}
//         style={{
//           position: "absolute",
//           top: "-1000vh",
//           left: "-1000vw",
//           zIndex: -9999,
//           opacity: 1,
//           pointerEvents: "none",
//           width: "800px",
//           height: "auto",
//           background: "#fff",
//           padding: 0,
//           margin: 0,
//           overflow: "hidden",
//         }}
//       >
//         {(() => {
//           switch (item?.resumeType) {
//             case "Modern":
//               return <ModernResume data={item} />;
//             case "Classic":
//               return <ClassicResume data={item} />;
//             case "Minimalist":
//               return <MinimalistResume data={item} />;
//             case "Creative":
//               return <CreativeResume data={item} />;
//             case "Elegant":
//               return <ElegantResume data={item} />;
//             default:
//               return null;
//           }
//         })()}
//       </div>

//       {ready && img ? (
//         <img
//           src={img}
//           alt={item?.title}
//           style={{
//             width: width,
//             height: height,
//             minWidth: minWidth,
//             minHeight: minHeight,
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             objectFit: "contain",
//             background: "#fff",
//             margin: margin,
//           }}
//         />
//       ) : (
//         <div
//           style={{
//             width: width,
//             height: height,
//             minWidth: minWidth,
//             minHeight: minHeight,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "#f9f9f9",
//             borderRadius: "8px",
//             border: "1px dashed #ccc",
//             color: "#999",
//             fontSize: "14px",
//             margin: margin,
//           }}
//         >
//           <Loader />
//         </div>
//       )}
//     </>
//   );
// };