import React from "react";
import Barcode from "../Barcode/Barcode";
import "./FilteredList.css";

function FilteredList({
  data = {},
  selectedItems,
  toggleItem,
  openModal,
  hideBarcodes,
}) {
  return (
    <div className="filtered-list">
      {Object.entries(data).map(([brand, models]) => (
        <div key={brand} className="brand-section">
          <h3>{brand}</h3>
          {Object.entries(models).map(([model, barcode]) => {
            const key = `${brand}-${model}`;
            const isChecked = !!selectedItems[key];

            return (
              <div key={key} className="model-item">
                <label>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(brand, model, barcode)}
                  />
                  {model}
                </label>

                {isChecked && !hideBarcodes && (
                  <div
                    className="barcode-wrapper"
                    onClick={() => openModal(model, barcode)}
                  >
                    <Barcode value={barcode} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default FilteredList;
