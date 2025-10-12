import React from "react";
import "./SearchBox.css";

function SearchBox({ value, onChange, onClear }) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Пошук sku..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="clear-btn" onClick={onClear} disabled={!value}>
        Очистити
      </button>
    </div>
  );
}

export default SearchBox;
