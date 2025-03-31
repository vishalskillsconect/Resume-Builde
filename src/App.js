import React, { useState, useEffect, useRef } from "react";
import "./styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import jsonData from "./data.json";
import { useReactToPrint } from "react-to-print";
import Form from "./components/Form";
import Resume from "./components/Resume";

const App = () => {
  const [data, setData] = useState();
  const [isPrinting, setIsPrinting] = useState(false);
  const componentRef = useRef(null);
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Resume",
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => setIsPrinting(false),
    removeAfterPrint: true,
  });

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
        <Resume ref={componentRef} data={data} color={color} />
      </div>
      <button className="printBtn" onClick={handlePrint} disabled={isPrinting}>
        {isPrinting ? "Preparing..." : "Download / Print"}
      </button>
    </div>
  );
};

export default App;
