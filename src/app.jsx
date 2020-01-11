import React, { useMemo } from "react";
import ReactDom from "react-dom";
import Footer from "./footer";
import { useGeoLocation, useDarkSky } from "./hooks";
import Icon from "./icon";
import Info from "./info";
import { AnimateOnChange } from "react-animation";
import ErrorBoundary from "./error-boundary";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

a,
a:visited,
a:focus {
  color: inherit;
}

html {
  font-family: "Libre Baskerville", serif;
  font-size: 4vh;
}
`;

const AppDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 30px;

  .weather-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }
  .weather-wrapper > * {
    margin-top: 1rem;
  }
`;

const App = () => {
  const location = useGeoLocation();
  const {
    icon,
    temperatures: { today: todaysTemp, yesterday: yesterdaysTemp }
  } = useDarkSky(location);
  const loaded = [icon, todaysTemp, yesterdaysTemp].every(v => v !== null);

  const renderedInfo = useMemo(() => {
    return loaded ? <Info today={todaysTemp} yesterday={yesterdaysTemp} /> : <p>Loading...</p>;
  }, [loaded]);

  return (
    <AppDiv>
      <GlobalStyles />
      <div className="weather-wrapper">
        <Icon icon={icon} />
        <AnimateOnChange>{renderedInfo}</AnimateOnChange>
      </div>
      <Footer />
    </AppDiv>
  );
};

ReactDom.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById("app")
);
