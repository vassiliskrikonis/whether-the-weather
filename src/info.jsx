import React from "react";
import "./info.css";

const Info = ({ today, yesterday }) => {
  return (
    <p className="weather-info">
      <span className="when">Today</span>
      <br />
      it&apos;s <span className="what">{today > yesterday ? "hotter" : "colder"}</span>
      <sup>1</sup>
      <br />
      than
      <br />
      <span className="when">yesterday</span>
    </p>
  );
};

export default Info;
