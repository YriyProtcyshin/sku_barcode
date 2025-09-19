import React, { useState, useEffect } from "react";
import Barcode from "./Barcode";

function App() {
  const [skuList, setSkuList] = useState({});
  const [selected, setSelected] = useState([]);
  const [openBrands, setOpenBrands] = useState([]); // несколько открытых брендов

  // Загружаем sku.json
  useEffect(() => {
    fetch("/sku.json")
      .then((res) => res.json())
      .then((data) => setSkuList(data))
      .catch((err) => console.error("Ошибка загрузки sku.json", err));
  }, []);

  const handleCheckbox = (name) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const toggleBrand = (brand) => {
    setOpenBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Генератор штрихкодів</h1>

      {/* аккордеон по брендам */}
      <div style={{ textAlign: "left", maxWidth: "400px", margin: "0 auto" }}>
        {Object.keys(skuList).map((brand) => (
          <div key={brand} style={{ marginBottom: "10px" }}>
            <div
              onClick={() => toggleBrand(brand)}
              style={{
                cursor: "pointer",
                padding: "10px",
                background: "#ffffff",
                border: "1px solid #eeeeee",
                borderRadius: "5px",
                fontWeight: "bold",
                fontSize: "20px",
                boxShadow: "-2px 2px 5px 1px #eeeeee",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // название слева, стрелка справа
              }}
            >
              <span>{brand}</span>
              <span>{openBrands.includes(brand) ? "▲" : "▼"}</span>
            </div>

            {openBrands.includes(brand) && (
              <div style={{ padding: "10px 20px" }}>
                {Object.keys(skuList[brand]).map((name) => (
                  <div key={name} style={{ margin: "5px 0", fontSize: "18px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selected.includes(name)}
                        onChange={() => handleCheckbox(name)}
                      />{" "}
                      {name}
                    </label>

                    {/* Генерация штрихкода сразу при выборе */}
                    {selected.includes(name) && (
                      <div style={{ marginTop: "10px" }}>
                        <Barcode value={skuList[brand][name]} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: "10px" }}>Версія 3.1</p>
      <p style={{ fontSize: "10px" }}>Для оновлення даних треба закрити та заново відкрити застосунок!</p>
    </div>
  );
}

export default App;
