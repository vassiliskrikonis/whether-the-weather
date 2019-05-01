import axios from "axios";
import icons from "./icon-mapper";
import { DateTime } from "luxon";
import * as yup from "yup";

function setInfo(str, extraClass) {
  const infoElem = document.querySelector(".info");
  infoElem.innerHTML = str;
  if (extraClass) {
    infoElem.classList.add(extraClass);
  }
}

function delayed(ms, fn) {
  return (...args) => setTimeout(() => fn(...args), ms);
}

function getLocation() {
  return new Promise((resolve, reject) => {
    try {
      const delay = process.env.NODE_ENV === "development" ? 2000 : 0;
      navigator.geolocation.getCurrentPosition(delayed(delay, resolve), posError => {
        reject(posError.message);
      });
    } catch (err) {
      reject("Geolocation is not supported");
    }
  });
}

const API_URL = "https://weather-the-weather-proxy.glitch.me/";
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

function validateWeatherSchema(response) {
  try {
    return weatherResponseSchema.validateSync(response);
  } catch (err) {
    console.error(err);
    throw new Error("Cannot parse weather data");
  }
}

function getWeather({ longitude, latitude }) {
  const now = DateTime.local().toString();
  const options = {
    latitude,
    longitude,
    time: now
  };

  const requestPromise = axios
    .post(API_URL, options)
    .then(validateWeatherSchema)
    .then(response => {
      // checkIfResponseIsValid(response);
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
    setInfo(err, "error");
  }
})();
