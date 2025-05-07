// src/components/CurrentWeather/CurrentWeather.jsx

import React from "react";
import "./CurrentWeather.css";

const CurrentWeather = ({ data, isFahrenheit, isMiles }) => {
  const {
    temperature,
    windSpeed,
    condition,
    icon,
    rainChance,
    humidity,
    precipitation,
  } = data;

  return (
    <div className="current-section__content effect-glass">
      {/* <h2>Current Weather</h2> */}
      <div className="current-section__main">
        <span
          className="current-section__icon material-symbols-rounded"
          title={condition}
        >
          {icon}
        </span>

        <div className="current-section__details">
          <h1 className="current-section__temperature varela-round-regular">
            {temperature}
          </h1>
          <p className="current-section__condition">{condition}</p>
        </div>
      </div>

      <div className="weather-info">
        <div className="weather-info__item weather-info--rain-chance">
          <h3>{rainChance}%</h3>
          <p>Rain Chance</p>
        </div>
        <div className="weather-info__item weather-info--wind">
          <h3> {windSpeed}</h3> <p>Wind Speed</p>
        </div>
        <div className="weather-info__item weather-info--humidity">
          <h3>{humidity}%</h3>
          <p>Humidity</p>
        </div>
        <div className="weather-info__item weather-info--precipitation">
          <h3>{precipitation} mm</h3>
          <p>Precipitation</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
