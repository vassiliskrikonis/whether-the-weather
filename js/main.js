import axios from "axios";
import icons from "./icon-mapper";
import { DateTime } from "luxon";

function setInfo(str) {
  document.querySelector(".info").innerHTML = str;
}

function delayed(ms, fn) {
  return (...args) => setTimeout(() => fn(...args), ms);
}

function getLocation() {
  return new Promise((resolve, reject) => {
    try {
      const delay = process.env.NODE_ENV === "development" ? 2000 : 0;
      navigator.geolocation.getCurrentPosition(delayed(delay, resolve), reject);
    } catch (err) {
      reject(`<p style="text-align:center;">Geolocation is not supported</p>`);
    }
  });
}

function getWeather({ longitude, latitude }) {
  const now = DateTime.local().toString();
  const options = {
    latitude,
    longitude,
    time: now
  };

  const requestPromise = axios
    .post("https://weather-the-weather-proxy.glitch.me/", options)
    .then(response => {
      const [today, yesterday] = response.data;
      const todaysTemp = today.currently.apparentTemperature;
      const icon = today.currently.icon;
      const yesterdaysTemp = yesterday.currently.apparentTemperature;

      return {
        todaysTemp,
        yesterdaysTemp,
        icon
      };
    });

  return requestPromise;
}

function loadIcon(icon) {
  return new Promise(resolve => {
    const logo = document.getElementById("logo");
    logo.src = icons[icon];
    logo.onload = () => {
      document.body.classList.remove("loading");
      resolve();
    };
  });
}

(async function main() {
  setInfo("Getting Location...");
  try {
    const { coords } = await getLocation();

    setInfo("Getting Weather...");
    const weather = await getWeather(coords);

    setInfo("Loading Icon...");
    await loadIcon(weather.icon);

    const temperatureLabel = weather.todaysTemp >= weather.yesterdaysTemp ? "hotter" : "colder";
    const infoHtml = `
    <div class="when">Today</div>
    <div>it's <span id="what">${temperatureLabel}</span><sup>1</sup></div>
    <div>than</div>
    <div class="when">yesterday</div>
    `;
    setInfo(infoHtml);
  } catch (err) {
    setInfo(err);
  }
})();
