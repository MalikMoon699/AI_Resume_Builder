import React from "react";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

const Loader = ({
  size = "40",
  className = "loaderWrapper",
  color = "#00af4e",
  speed = "1.75",
  stroke = "5",
  style = {
    height: "100%",
    width: "100%",
  },
}) => {
  return (
    <div className={className} style={style}>
      <Tailspin size={size} speed={speed} stroke={stroke} color={color} />
    </div>
  );
};

export default Loader;
