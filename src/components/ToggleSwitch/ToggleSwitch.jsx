import React from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ label, isChecked, onChange }) => {
  return (
    <label className="toggle-switch effect-glass">
      {label && <span className="toggle-switch__label">{label}</span>}
      <div className="toggle-switch__wrapper">
        <input type="checkbox" checked={isChecked} onChange={onChange} />
        <span className="toggle-switch__slider"></span>
      </div>
    </label>
  );
};

export default ToggleSwitch;
