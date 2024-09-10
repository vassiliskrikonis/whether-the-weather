import moment from "moment";

export async function POST(req) {
  const { longitude: lon, latitude: lat, time } = await req.json();
  if ([lon, lat, time].some(v => v === undefined || v === null)) {
    return Response.error();
  }

  const todaysURL =
    "https://api.darksky.net/forecast/" + process.env.DARKSKY_API_KEY + "/" + lat + "," + lon;
  const todaysWeather = await (await fetch(todaysURL)).json();
  const yesterday = moment.parseZone(time).subtract(1, "days");
  const yesterdaysWeather = await (await fetch(todaysURL + "," + yesterday.format())).json();

  return Response.json([todaysWeather, yesterdaysWeather]);
}
