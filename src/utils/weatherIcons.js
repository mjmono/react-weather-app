// src/utils/weatherIcons.js

export const getWeatherIcon = (code, isNight = false) => {
  switch (code) {
    case 0: // Clear Sky
      return isNight ? "bedtime" : "clear_day";
    case 1: // Mainly Clear
      return isNight ? "bedtime" : "clear_day";
    case 2: // Partly Cloudy
      return isNight ? "partly_cloudy_night" : "partly_cloudy_day";
    case 3: // Overcast
      return "cloud";
    case 45: // Fog
    case 48: // Depositing Rime Fog
      return "foggy";
    case 51: // Light Drizzle
    case 53: // Moderate Drizzle
    case 55: // Dense Drizzle
      return "rainy";
    case 56: // Light Freezing Drizzle
    case 57: // Dense Freezing Drizzle
      return "ac_unit";
    case 61: // Light Rain
    case 63: // Moderate Rain
    case 65: // Heavy Rain
      return "rainy";
    case 66: // Light Freezing Rain
    case 67: // Heavy Freezing Rain
      return "ac_unit";
    case 71: // Slight Snowfall
    case 73: // Moderate Snowfall
    case 75: // Heavy Snowfall
    case 77: // Snow Grains
      return "ac_unit";
    case 80: // Slight Rain Showers
    case 81: // Moderate Rain Showers
    case 82: // Violent Rain Showers
      return "rainy";
    case 85: // Slight Snow Showers
    case 86: // Heavy Snow Showers
      return "ac_unit";
    case 95: // Thunderstorm (Slight or Moderate)
    case 96: // Thunderstorm with Slight Hail
    case 99: // Thunderstorm with Heavy Hail
      return "thunderstorm";
    default:
      return "help"; // Icon for unknown condition
  }
};
