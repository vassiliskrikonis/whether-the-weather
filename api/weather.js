function getApiUrl(lat, lon, dt) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  return `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${API_KEY}`;
}

function inSeconds(ms) {
  return Math.trunc(ms / 1000);
}

function getYesterdaysTimestamp() {
  const now = new Date();
  return now.setDate(now.getDate() - 1);
}

function pickWeather(resp) {
  const data = resp?.data?.[0];
  return {
    temp: data.temp,
    feels_like: data.feels_like,
    icon: data?.weather?.[0]?.icon,
    raw: data
  };
}

export async function POST(req) {
  const { longitude: lon, latitude: lat, time } = await req.json();
  if ([lon, lat, time].some(v => v === undefined || v === null)) {
    return Response.error();
  }

  const todaysWeather = pickWeather(
    await (await fetch(getApiUrl(lat, lon, inSeconds(Date.now())))).json()
  );
  const yesterdaysTimestamp = getYesterdaysTimestamp();
  const yesterdaysWeather = pickWeather(
    await (await fetch(getApiUrl(lat, lon, inSeconds(yesterdaysTimestamp)))).json()
  );

  return Response.json([todaysWeather, yesterdaysWeather]);
}
