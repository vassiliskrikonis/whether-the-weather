const KEY = 'ac85f65c639c545e0acc46a5f678d9fd';

const infoHtml = `
  <div class="when">Today</div>
  <div>it's <span id="what">hotter</span><sup>1</sup></div>
  <div>than</div>
  <div class="when">yesterday</div>
`;

try {
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}
catch(err) {
  document.body.innerHTML = '<p style="text-align:center;">Geolocation is not supported</p>';
}

function onGeoSuccess(pos) {
  const {latitude, longitude} = pos.coords;
}

function onGeoError(err) {
  console.warn(err);
}
