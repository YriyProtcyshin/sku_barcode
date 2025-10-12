import React, { useState } from "react";
import Barcode from "../Barcode/Barcode";
import "./Accordion.css"

function Accordion({
  data,
  selectedItems,
  toggleItem,
  openModal,
  hideBarcodes,
}) {
  const [openBrands, setOpenBrands] = useState({});

  if (!data || Object.keys(data).length === 0) {
    return <p className="loading">Загрузка данных...</p>;
  }

  const toggleBrand = (brand) => {
    setOpenBrands((prev) => ({
      ...prev,
      [brand]: !prev[brand],
    }));
  };

  // 🔹 Функция для подсчёта выбранных моделей в каждой секции
  const getSelectedCount = (brand, models) => {
    return Object.keys(models).reduce((count, model) => {
      const key = `${brand}-${model}`;
      if (selectedItems[key]) count++;
      return count;
    }, 0);
  };

  return (
    <div className="accordion">
      {Object.entries(data).map(([brand, models]) => {
        const selectedCount = getSelectedCount(brand, models);
        const totalCount = Object.keys(models).length;

        return (
          <div key={brand} className="accordion-item">
            <div
              className={`accordion-header ${
                selectedCount > 0 ? "active" : ""
              }`}
              onClick={() => toggleBrand(brand)}
            >
              <span className="brand-name">{brand}</span>

              <div className="header-right">
                {/* 🔹 Счётчик выделенных элементов */}
                <span className="brand-counter">
                  {selectedCount > 0 && (
                    <span>
                      ({selectedCount}/{totalCount})
                    </span>
                  )}
                </span>

                <span className={`arrow ${openBrands[brand] ? "up" : ""}`}>
                  {openBrands[brand] ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {openBrands[brand] && (
              <div className="accordion-body">
                {Object.entries(models).map(([model, barcode]) => {
                  const key = `${brand}-${model}`;
                  const isChecked = !!selectedItems[key];

                  return (
                    <div key={key} className="accordion-model">
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
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
