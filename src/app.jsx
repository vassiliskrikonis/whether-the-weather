import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import "../css/styles.css";
import Footer from "./footer";
import "./app.css";
import { DateTime } from "luxon";
import axios from "axios";

// eslint-disable-next-line no-unused-vars
function useGeoLocation() {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const onSuccess = ({ coords: { latitude, longitude } }) => {
      setLocation({ longitude, latitude });
    };
    const onError = error => {
      throw error;
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
}

// eslint-disable-next-line no-unused-vars
function useDarkSky(location) {
  const [todaysTemp, setTodaysTemp] = useState(null);
  const [yesterdaysTemp, setYesterdaysTemp] = useState(null);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (!location) return;

    const API_URL = "https://weather-the-weather-proxy.glitch.me/";
    const now = DateTime.local().toString();
    const { latitude, longitude } = location;

    axios.post(API_URL, { time: now, latitude, longitude }).then(response => {
      const [today, yesterday] = response.data;
      const todaysTemp = today.currently.apparentTemperature;
      const icon = today.currently.icon;
      const yesterdaysTemp = yesterday.currently.apparentTemperature;

      setTodaysTemp(todaysTemp);
      setYesterdaysTemp(yesterdaysTemp);
      setIcon(icon);
    });
  }, [location]);

  return { todaysTemp, yesterdaysTemp, icon };
}

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
