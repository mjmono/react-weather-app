import React, { useRef, useEffect } from "react";
import ForecastCard from "../../components/ForecastCard/ForecastCard.jsx";
import "./ForecastContainer.css";

const ForecastContainer = ({ title, data }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleWheelScroll = (event) => {
      if (scrollRef.current) {
        event.preventDefault();
        scrollRef.current.scrollLeft += event.deltaY * 1.5; // Adjust scroll speed
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("wheel", handleWheelScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);

  return (
    <div className="forecast-container effect-glass">
      <h3 className="forecast-container__title">{title}</h3>
      <div className="forecast-container__list" ref={scrollRef}>
        {data.map((item, index) => (
          <ForecastCard
            key={index}
            label={item.label}
            subLabel={item.subLabel}
            temperature={item.temperature}
            icon={item.icon}
            condition={item.condition}
          />
        ))}
      </div>
    </div>
  );
};

export default ForecastContainer;
