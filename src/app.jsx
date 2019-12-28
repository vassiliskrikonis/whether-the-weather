import React, { useMemo } from "react";
import ReactDom from "react-dom";
import "../css/styles.css";
import Footer from "./footer";
import "./app.css";
import { useGeoLocation, useDarkSky } from "./hooks";
import Icon from "./icon";
import Info from "./info";
import { AnimateOnChange } from "react-animation";
import ErrorBoundary from "./error-boundary";

const App = () => {
  const location = useGeoLocation();
  const {
    icon,
    temperatures: { today: todaysTemp, yesterday: yesterdaysTemp }
  } = useDarkSky(location);
  const loaded = [icon, todaysTemp, yesterdaysTemp].every(v => v !== null);

  const renderedIcon = useMemo(() => <Icon key={icon} icon={icon || "loading"} />, [icon]);
  const renderedInfo = useMemo(() => {
    return loaded ? <Info today={todaysTemp} yesterday={yesterdaysTemp} /> : <p>Loading...</p>;
  }, [loaded]);

  return (
    <div className="weather-app">
      <div className="weather-wrapper">
        <AnimateOnChange>{renderedIcon}</AnimateOnChange>
        <AnimateOnChange>{renderedInfo}</AnimateOnChange>
      </div>
      <Footer />
    </div>
  );
};

ReactDom.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById("app")
);
