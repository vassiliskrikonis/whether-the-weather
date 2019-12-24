import React from "react";
import ReactDom from "react-dom";
import "../css/styles.css";
import Footer from "./footer";
import "./app.css";

const App = () => {
  return (
    <div className="weather-app">
      <div className="weather-wrapper">
        <div className="weather-icon">This should be an icon</div>
        <div className="weather-info">This should be the weather</div>
      </div>
      <Footer />
    </div>
  );
};

ReactDom.render(React.createElement(App), document.getElementById("app"));
