import React, { useState, useEffect, useMemo } from "react";
import ReactDom from "react-dom";
import "../css/styles.css";
import Footer from "./footer";
import "./app.css";
import { DateTime } from "luxon";
import axios from "axios";
import Icon from "./icon";
import Info from "./info";
import { AnimateOnChange } from "react-animation";
import ErrorBoundary from "./error-boundary";
import * as yup from "yup";

const weatherResponseSchema = yup.object().shape({
  data: yup
    .array()
    .of(
      yup.object().shape({
        currently: yup.object().shape({
          apparentTemperature: yup.number().required(),
          icon: yup.string().required()
        })
      })
    )
    .required()
});

function useGeoLocation() {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const onSuccess = ({ coords: { latitude, longitude } }) => {
      setLocation({ longitude, latitude });
    };
    const onError = error => {
      setLocation(() => {
        throw error;
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
}

function useDarkSky(location) {
  const [temperatures, setTemperatures] = useState({
    today: null,
    yesterday: null
  });
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (!location) return;

    const API_URL = "/api/darksky-all";
    const now = DateTime.local().toString();
    const { latitude, longitude } = location;

    axios
      .post(API_URL, { time: now, latitude, longitude })
      .then(response => {
        if (!weatherResponseSchema.isValidSync(response)) {
          setTemperatures(() => {
            throw new Error("Could not parse weather data");
          });
        }
        const [today, yesterday] = response.data;
        const todaysTemp = today.currently.apparentTemperature;
        const icon = today.currently.icon;
        const yesterdaysTemp = yesterday.currently.apparentTemperature;

        setTemperatures({
          today: todaysTemp,
          yesterday: yesterdaysTemp
        });
        setIcon(icon);
      })
      .catch(error => {
        setTemperatures(() => {
          throw error;
        });
      });
  }, [location]);

  return { temperatures, icon };
}

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
