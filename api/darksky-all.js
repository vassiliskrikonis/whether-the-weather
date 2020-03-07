const moment = require("moment");
const fetch = require("node-fetch");

export default async (req, res) => {
  const { longitude: lon, latitude: lat, time } = req.body;
  if ([lon, lat, time].some(v => v === undefined || v === null)) {
    return res.status(400).send("Missing parameters");
  }

  const todaysURL =
    "https://api.darksky.net/forecast/" + process.env.DARKSKY_API_KEY + "/" + lat + "," + lon;
  const todaysWeather = await (await fetch(todaysURL)).json();
  const yesterday = moment.parseZone(time).subtract(1, "days");
  const yesterdaysWeather = await (await fetch(todaysURL + "," + yesterday.format())).json();

  return res.status(200).send([todaysWeather, yesterdaysWeather]);
};
