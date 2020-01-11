import React from "react";
import styled from "styled-components";

const StyledP = styled.p`
  font-size: 1.3rem;
  text-align: center;
  margin: 0;

  sup {
    font-size: 0.5em;
  }
  .when {
    font-style: italic;
  }

  .what {
    font-weight: 700;
  }
`;

const Info = ({ today, yesterday }) => {
  return (
    <StyledP>
      <span className="when">Today</span>
      <br />
      it&apos;s <span className="what">{today > yesterday ? "hotter" : "colder"}</span>
      <sup>1</sup>
      <br />
      than
      <br />
      <span className="when">yesterday</span>
    </StyledP>
  );
};

export default Info;
