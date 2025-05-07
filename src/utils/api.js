// src/utils/api.js
import { getWeatherIcon } from "./weatherIcons";

const GEOCODING_API_URL = "https://api.opencagedata.com/geocode/v1/json";
const GEOCODING_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

// Function to convert place names to coordinates
export const fetchCoordinates = async (location) => {
  const url = `${GEOCODING_API_URL}?q=${encodeURIComponent(
    location
  )}&key=${GEOCODING_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw { message: "Failed to fetch coordinates", icon: "location_off" };
    }

    const data = await response.json();

    if (data.results.length === 0) {
      throw { message: "Location not found", icon: "search_off" };
    }

    const { lat, lng } = data.results[0].geometry;
    const fullLocation = data.results[0].formatted;

    return { latitude: lat, longitude: lng, fullLocation };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw typeof error === "object"
      ? error
      : { message: error.message, icon: "error" };
  }
};

// Updated Weather Code to Condition Mapping
export const weatherCodeToCondition = (code) => {
  const codes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snowfall",
    73: "Moderate Snowfall",
    75: "Heavy Snowfall",
    77: "Snow Grains",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "Slight Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm (Slight or Moderate)",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Heavy Hail",
  };

  return codes[code] || "Unknown Condition";
};

// Function to fetch weather data
export const fetchWeatherData = async (latitude, longitude) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,relative_humidity_2m_mean,precipitation_probability_max,windspeed_10m_max&hourly=temperature_2m,weathercode&current_weather=true&timezone=auto&forecast_days=10`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw { message: "Failed to fetch weather data", icon: "cloud_off" };
    }

    const data = await response.json();
    const today = new Date();

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };

    const currentWeather = {
      // day: "Today",
      // date: formatDate(today),
      temperature: data.current_weather.temperature,
      precipitation: data.daily.precipitation_sum[0],
      windSpeed: data.current_weather.windspeed,
      humidity: data.daily.relative_humidity_2m_mean[0],
      rainChance: data.daily.precipitation_probability_max[0],
      condition: weatherCodeToCondition(data.current_weather.weathercode),
      icon: getWeatherIcon(data.current_weather.weathercode),
    };

    const forecast = data.daily.temperature_2m_max.map((temp, index) => {
      const forecastDate = new Date();
      forecastDate.setDate(today.getDate() + index);

      return {
        label:
          forecastDate.toDateString() === today.toDateString()
            ? "Today"
            : forecastDate.toLocaleDateString("en-US", { weekday: "short" }),
        subLabel: formatDate(forecastDate),
        temperature: temp,
        // precipitation: data.daily.precipitation_sum[index],
        icon: getWeatherIcon(data.daily.weathercode[index]),
        condition: weatherCodeToCondition(data.daily.weathercode[index]),
      };
    });

    const currentHourIndex = new Date().getHours();

    const hourlyForecast = data.hourly.temperature_2m
      .slice(currentHourIndex, currentHourIndex + 24)
      .map((temp, index) => {
        const hour = (currentHourIndex + index) % 24;
        return {
          label: `${hour}:00`,
          temperature: temp,
          icon: getWeatherIcon(
            data.hourly.weathercode[currentHourIndex + index]
          ),
          condition: weatherCodeToCondition(
            data.hourly.weathercode[currentHourIndex + index]
          ),
        };
      });

    return { currentWeather, forecast, hourlyForecast };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw typeof error === "object"
      ? error
      : { message: error.message, icon: "error" };
  }
};

export const fetchWeatherByUserLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        message: "Geolocation is not supported by your browser",
        icon: "location_disabled",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEOCODING_API_KEY}`;
          const geoResponse = await fetch(geoUrl);
          const geoData = await geoResponse.json();

          if (!geoResponse.ok || geoData.results.length === 0) {
            throw { message: "Could not fetch location name", icon: "map_off" };
          }

          const locationName = geoData.results[0].formatted;
          const weatherData = await fetchWeatherData(latitude, longitude);

          resolve({ ...weatherData, locationName });
        } catch (error) {
          reject(
            typeof error === "object"
              ? error
              : { message: error.message, icon: "error" }
          );
        }
      },
      () => {
        reject({
          message: "Unable to retrieve location",
          icon: "location_off",
        });
      }
    );
  });
};
