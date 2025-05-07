import React, { useState, useEffect, useMemo } from "react";
import {
  fetchCoordinates,
  fetchWeatherData,
  fetchWeatherByUserLocation,
} from "../../utils/api";

import SearchBar from "../../components/SearchBar/SearchBar";
import CurrentWeather from "../CurrentWeather/CurrentWeather";
import ForecastContainer from "../ForecastContainer/ForecastContainer";
import "./WeatherContainer.css";

import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";

const WeatherContainer = () => {
  const [searchValue, setSearchValue] = useState(""); // New state for search bar value
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [hourlyForecastData, setHourlyForecastData] = useState(null); // State for hourly forecast
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isMiles, setIsMiles] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchUserLocationWeather = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherByUserLocation();

        setSearchValue(data.locationName); // ✅ Set the detected location in search bar
        setCurrentWeatherData(data.currentWeather);
        setForecastData(data.forecast);
        setHourlyForecastData(data.hourlyForecast);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLocationWeather();
  }, []);

  const handleSearch = async (location) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch coordinates and full location
      const { latitude, longitude, fullLocation } = await fetchCoordinates(
        location
      );

      // Fetch weather data using the coordinates
      const { currentWeather, forecast, hourlyForecast } =
        await fetchWeatherData(latitude, longitude);

      // Update search bar value with full location
      setSearchValue(fullLocation);

      // Update weather data
      setCurrentWeatherData({ ...currentWeather, fullLocation });
      setForecastData(forecast);
      setHourlyForecastData(hourlyForecast); // Set hourly forecast data
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const formattedCurrentWeather = useMemo(() => {
    if (!currentWeatherData) return null;

    let formattedTemp = isFahrenheit
      ? (currentWeatherData.temperature * 9) / 5 + 32
      : currentWeatherData.temperature;

    let formattedWindSpeed = isMiles
      ? currentWeatherData.windSpeed * 0.621371
      : currentWeatherData.windSpeed;

    return {
      ...currentWeatherData,
      temperature: Math.round(formattedTemp) + (isFahrenheit ? " °F" : " °C"),
      windSpeed: Math.round(formattedWindSpeed) + (isMiles ? " mph" : " km/h"),
    };
  }, [currentWeatherData, isFahrenheit, isMiles]);

  const formattedHourlyForecast = useMemo(() => {
    if (!hourlyForecastData) return null;

    return hourlyForecastData.map((item, index) => {
      let hour, period, formattedHour;

      if (index === 0) {
        formattedHour = "Now";
      } else {
        hour = parseInt(item.label.slice(0, -3), 10);
        period = hour >= 12 ? " pm" : " am";
        formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      }

      let formattedTemp = isFahrenheit
        ? (item.temperature * 9) / 5 + 32
        : item.temperature;

      return {
        ...item,
        label:
          index === 0
            ? "Now"
            : is24Hour
            ? `${hour}:00`
            : `${formattedHour}${period}`,
        temperature: Math.round(formattedTemp) + (isFahrenheit ? " °F" : " °C"),
      };
    });
  }, [hourlyForecastData, is24Hour, isFahrenheit]); // Depend on both toggles

  const formattedForecast = useMemo(() => {
    if (!forecastData) return null;

    return forecastData.map((item, index) => {
      let formattedTemp = isFahrenheit
        ? (item.temperature * 9) / 5 + 32
        : item.temperature;

      return {
        ...item,
        label: index === 0 ? "Today" : item.label,
        temperature: Math.round(formattedTemp) + (isFahrenheit ? " °F" : " °C"), // Update temperature
      };
    });
  }, [forecastData, isFahrenheit]); // Depend on both toggles

  return (
    <div className="weather-container ">
      <div className="weather-container__header">
        <SearchBar
          value={searchValue}
          onSearch={handleSearch}
          onChange={setSearchValue}
          placeholder="Enter Location"
          className="weather-container__search-bar effect-glass"
        />

        <button
          className="settings-btn effect-glass"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          <span className="material-symbols-rounded">settings</span>
        </button>
      </div>

      {!loading && !error && (
        <div className="weather-container__content">
          <div className="weather-container__current-section">
            {showSettings && (
              <div className="weather-container__menu">
                <ToggleSwitch
                  label="Fahrenheit"
                  isChecked={isFahrenheit}
                  onChange={() => setIsFahrenheit((prev) => !prev)}
                />
                <ToggleSwitch
                  label="Miles"
                  isChecked={isMiles}
                  onChange={() => setIsMiles((prev) => !prev)}
                />
                <ToggleSwitch
                  label="24-hour"
                  isChecked={is24Hour}
                  onChange={() => setIs24Hour((prev) => !prev)}
                />
              </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
            {currentWeatherData && (
              <CurrentWeather
                data={formattedCurrentWeather}
                isFahrenheit={isFahrenheit}
                isMiles={isMiles}
              />
            )}
          </div>

          <div className="weather-container__forecast-section">
            {showSettings && (
              <div className="weather-container__menu">
                <ToggleSwitch
                  label="Fahrenheit"
                  isChecked={isFahrenheit}
                  onChange={() => setIsFahrenheit((prev) => !prev)}
                />
                <ToggleSwitch
                  label="Miles"
                  isChecked={isMiles}
                  onChange={() => setIsMiles((prev) => !prev)}
                />
                <ToggleSwitch
                  label="24-hour"
                  isChecked={is24Hour}
                  onChange={() => setIs24Hour((prev) => !prev)}
                />
              </div>
            )}

            {formattedHourlyForecast && (
              <ForecastContainer
                title={"Hourly Forecast"}
                data={formattedHourlyForecast}
              />
            )}
            {formattedForecast && (
              <ForecastContainer
                title={"Daily Forecast"}
                data={formattedForecast}
              />
            )}
          </div>
        </div>
      )}

      {(loading || error) && (
        <div className="loading-container ">
          <div className="loading-card effect-glass text-center">
            {" "}
            <span className="material-symbols-rounded text-4xl mb-2 loading-icon">
              {error ? error.icon : "hourglass_empty"}
            </span>
            <p className="loading-text">
              {error ? error.message || "Something went wrong" : "Loading..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherContainer;
