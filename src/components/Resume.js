import React from "react";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import "../styles/Resume.scss";

const Resume = React.forwardRef((props, ref) => {
  const { data, color } = props;
  return (
    <div className="resume" ref={ref}>
      <LeftContent data={data} color={color} />
      <RightContent data={data} color={color} />
    </div>
  );
});

Resume.displayName = "Resume";

export default Resume;
