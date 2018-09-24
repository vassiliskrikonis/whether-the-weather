import axios from 'axios';
import icons from './icon-mapper';
import {DateTime} from 'luxon';

function setInfo(str) {
    document.querySelector('.info').innerHTML = str;
}

try {
  const delay = process.env.NODE_ENV === 'development' ? 2000 : 0;
  navigator.geolocation.getCurrentPosition(delayed(delay, onGeoSuccess), onGeoError);
  setInfo('Getting Location...');
}
catch(err) {
  document.body.innerHTML = '<p style="text-align:center;">Geolocation is not supported</p>';
}

function delayed(ms, fn) {
  return (...args) => setTimeout(() => fn(...args), ms);
}

function onGeoSuccess(pos) {
  const {latitude, longitude} = pos.coords;
  console.log(`Received geolocation: lat: ${latitude}, lon: ${longitude}`);
  setInfo('Getting Weather...');

  const now = DateTime.local().toString();
  console.log(`Time is ${now}`);

  const options = {
    latitude,
    longitude,
    time: now
  }

  axios.post('https://weather-the-weather-proxy.glitch.me/', options)
  .then(response => {
    const [today, yesterday] = response.data;
    const todaysTemp = today.currently.apparentTemperature;
    const icon = today.currently.icon;
    const yesterdaysTemp = yesterday.currently.apparentTemperature;

    console.log(`Received weather data: todays temp is ${todaysTemp}, yesterdays temp is ${yesterdaysTemp}`);

    const infoHtml = `
      <div class="when">Today</div>
      <div>it's <span id="what">${todaysTemp >= yesterdaysTemp ? 'hotter' : 'colder'}</span><sup>1</sup></div>
      <div>than</div>
      <div class="when">yesterday</div>
    `;

    const logo = document.getElementById('logo')
    logo.src = icons[icon];
    logo.onload = () => {
      document.body.classList.remove('loading');
      document.querySelector('.info').innerHTML = infoHtml;
    };
  })
  .catch(console.warn)
}

function onGeoError(err) {
  console.warn(err);
}
