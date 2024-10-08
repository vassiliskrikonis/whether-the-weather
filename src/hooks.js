import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import axios from "axios";
import * as yup from "yup";

const weatherResponseSchema = yup.object().shape({
  data: yup
    .array()
    .of(
      yup.object().shape({
        feels_like: yup.number().required(),
        icon: yup.string().required()
      })
    )
    .required()
});

export function useGeoLocation() {
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

    try {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } catch (_) {
      throw new Error("Geolocation not supported");
    }
  }, []);

  return location;
}

export function useDarkSky(location) {
  const [temperatures, setTemperatures] = useState({
    today: null,
    yesterday: null
  });
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (!location) return;

    const API_URL = process.env.API_URL || "/api/weather";
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
        const todaysTemp = today.feels_like;
        const icon = today.icon;
        const yesterdaysTemp = yesterday.feels_like;

        setTemperatures({
          today: todaysTemp,
          yesterday: yesterdaysTemp
        });
        setIcon(icon);
      })
      .catch(error => {
        setTemperatures(() => {
          const msg = error.response && error.response.data && error.response.data.error;
          if (msg) {
            throw new Error(msg);
          } else {
            throw error;
          }
        });
      });
  }, [location]);

  return { temperatures, icon };
}
