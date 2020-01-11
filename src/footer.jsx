import React from "react";
import styled from "styled-components";

const Footer = ({ className }) => (
  <footer className={className}>
    <sup>1</sup>According to{" "}
    <a href="https://darksky.net/poweredby/" target="_blank" rel="noopener noreferrer">
      Dark Sky
    </a>
  </footer>
);

export default styled(Footer)`
  border-top: 1px solid black;
  padding-top: 0.5rem;
  font-size: 0.5rem;
  width: 100%;
`;
