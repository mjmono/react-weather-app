import React from "react";
import "./ForecastCard.css";

const ForecastCard = ({ label, subLabel, temperature, icon, condition }) => {
  return (
    <div className="forecast-card">
      <h3 className="forecast-card__label">{label}</h3>
      {subLabel && <p className="forecast-card__sublabel">{subLabel}</p>}{" "}
      {/* Show only if subLabel exists */}
      <span
        className="forecast-card__icon material-symbols-rounded "
        title={condition}
      >
        {icon}
      </span>
      <p className="forecast-card__temperature">{temperature}</p>
    </div>
  );
};

export default ForecastCard;
