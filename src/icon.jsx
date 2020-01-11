import React from "react";
import icons from "../js/icon-mapper";
import { HideUntilLoaded } from "react-animation";
import styled from "styled-components";

const Icon = ({ icon, className }) => {
  const src = icons[icon || "loading"];
  return (
    <HideUntilLoaded imageToLoad={src}>
      <img className={`icon ${className}`} src={src} />
    </HideUntilLoaded>
  );
};

export default styled(Icon)`
  width: 30vh;
  height: auto;
`;
