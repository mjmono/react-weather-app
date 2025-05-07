import React, { useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({
  value = "",
  onChange = "",
  onSearch,
  placeholder = "Type something...",
  icon = "search",
  className = "",
}) => {
  const inputRef = useRef(null);

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const focusInput = () => {
    inputRef.current.focus();
  };

  const clearInput = () => {
    onChange(""); // Clear value using onChange prop
    inputRef.current.focus();
  };

  return (
    <div className={`search-bar ${className}`}>
      <span
        className="search-bar__icon material-symbols-rounded"
        onClick={focusInput}
      >
        {icon}
      </span>
      <input
        ref={inputRef}
        className="search-bar__input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)} // Controlled input
        onKeyDown={handleKeyDown}
      />
      {value && (
        <span
          className="search-bar__icon search-bar__clear material-symbols-rounded"
          onClick={clearInput}
        >
          close
        </span>
      )}
    </div>
  );
};

export default SearchBar;
