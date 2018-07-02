import axios from 'axios';

try {
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}
catch(err) {
  document.body.innerHTML = '<p style="text-align:center;">Geolocation is not supported</p>';
}

function onGeoSuccess(pos) {
  const {latitude, longitude} = pos.coords;
  console.log(`Received geolocation: lat: ${latitude}, lon: ${longitude}`);

  const options = {
    latitude,
    longitude,
    time: (new Date()).toISOString()
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

    document.querySelector('.info').innerHTML = infoHtml;
  })
  .catch(console.warn)
}

function onGeoError(err) {
  console.warn(err);
}
