import React from "react";
import icons from "../js/icon-mapper";
import "./icon.css";
import { HideUntilLoaded } from "react-animation";

const Icon = ({ icon }) => {
  const src = icons[icon || "loading"];
  return (
    <HideUntilLoaded imageToLoad={src}>
      <img className="icon" src={src} />
    </HideUntilLoaded>
  );
};

export default Icon;
