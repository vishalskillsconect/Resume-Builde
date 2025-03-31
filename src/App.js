import React, { useState, useEffect, useRef } from "react";
import "./styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import jsonData from "./data.json";
import Form from "./components/Form";
import Resume from "./components/Resume";
import html2pdf from "html2pdf.js";

const App = () => {
  const [data, setData] = useState();
  const componentRef = useRef(null);
  const resumeRef = useRef(null);
  const [preset] = useState([
    { primary: "#009688", background: "#ebf5f4", skills: "#e5f4f3" },
    { primary: "#2196f3", background: "#e8f4fe", skills: "#e2f2ff" },
    { primary: "#263238", background: "#f0f0f0", skills: "#e0e0e0" },
    { primary: "#3f51b5", background: "#ebedf7", skills: "#e1e3f8" },
  ]);

  const [color, setColor] = useState({
    primary: "#009688",
    background: "#e5f4f3",
    skills: "#e5f4f3",
  });

  useEffect(() => {
    setData(jsonData);
  }, []);



  const handleDownload = async () => {
    const element = resumeRef.current;
    // Get user's name from data and format it for filename, with fallback
    const userName = data?.contact?.name
      ? data.contact.name.toLowerCase().replace(/\s+/g, "_")
      : "resume";
    const fileName = `${userName}_resume.pdf`;

    const opt = {
      margin: [0, 0, 0, 0],
      filename: fileName,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        letterRendering: true,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        logging: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector(".print-content");
          if (clonedElement) {
            // Apply styles to ensure content fits properly
            clonedElement.style.width = "210mm";
            clonedElement.style.height = "auto";
            clonedElement.style.minHeight = "297mm";
            clonedElement.style.margin = "0";
            clonedElement.style.padding = "0";
            clonedElement.style.overflow = "visible";
            clonedElement.style.position = "relative";
            clonedElement.style.pageBreakInside = "avoid";
            clonedElement.style.breakInside = "avoid";

            // Apply styles to all child elements
            const applyStyles = (element) => {
              element.style.pageBreakInside = "avoid";
              element.style.breakInside = "avoid";
              element.style.transform = "none";
              element.style.position = "relative";
              element.style.overflow = "visible";
              Array.from(element.children).forEach(applyStyles);
            };
            applyStyles(clonedElement);
          }
        },
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
        precision: 16,
        hotfixes: ["px_scaling"],
      },
    };

    // Add a class to the body during PDF generation
    document.body.classList.add("generating-pdf");

    try {
      const pdf = await html2pdf()
        .set(opt)
        .from(element)
        .toPdf()
        .output("bloburl");
      const link = document.createElement("a");
      link.href = pdf;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdf);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      document.body.classList.remove("generating-pdf");
    }
  };

  if (!data) return null;

  return (
    <div className="mainContent">
      <div className="left">
        <Form
          data={data}
          setData={setData}
          preset={preset}
          setColor={setColor}
        />
      </div>
      <div className="right">
        <div className="print-content" ref={resumeRef}>
          <Resume ref={componentRef} data={data} color={color} />
        </div>
      </div>
      <button className="printBtn" onClick={handleDownload}>
        Download PDF
      </button>
    </div>
  );
};

export default App;
