import React from "react";
import icons from "../js/icon-mapper";
import "./icon.css";

const Icon = ({ icon }) => <img className="icon" src={icons[icon || "loading"]} />;

export default Icon;
