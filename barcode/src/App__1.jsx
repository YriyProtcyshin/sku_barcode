import React, { useState, useEffect } from "react";
import Barcode from "./Barcode";
import logo from "./logo4.png"; // ✅ импортируем логотип

function App() {
  const [skuList, setSkuList] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]); // храним ключи вида "brand:::name"
  const [openBrands, setOpenBrands] = useState([]); // какие бренды раскрыты в аккордеоне
  const [filter, setFilter] = useState(""); // строка поиска

  useEffect(() => {
    fetch("/sku.json")
      .then((res) => res.json())
      .then((data) => setSkuList(data))
      .catch((err) => console.error("Ошибка загрузки sku.json", err));
  }, []);

  const makeKey = (brand, name) => `${brand}:::${name}`;

  const toggleBrand = (brand) => {
    setOpenBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCheckbox = (brand, name) => {
    const key = makeKey(brand, name);
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isChecked = (brand, name) =>
    selectedKeys.includes(makeKey(brand, name));
  const getCode = (brand, name) => skuList?.[brand]?.[name];

  // Плоский массив всех позиций для быстрого поиска
  const flattened = Object.entries(skuList).flatMap(([brand, items]) =>
    Object.keys(items).map((name) => ({ brand, name, code: items[name] }))
  );

  const filterLower = filter.trim().toLowerCase();
  const isFiltering = filterLower.length > 0;

  const filteredFlat = isFiltering
    ? flattened.filter(
        (it) =>
          it.name.toLowerCase().includes(filterLower) ||
          it.brand.toLowerCase().includes(filterLower)
      )
    : [];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* ✅ логотип */}
      <img
        src={logo}
        alt="Логотип"
        style={{ width: "120px", marginBottom: "-20px" }}
      />
      <h1 style={{ marginTop: "0", marginBottom: "30px" }}>
        Генератор штрихкодів
      </h1>

      {/* Поле поиска */}
      <div
        style={{
          margin: "16px auto",
          maxWidth: "480px",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          type="text"
          placeholder="Почніть вводити для пошуку..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
          }}
        />
        {/* Очистить поле */}
        <button
          onClick={() => setFilter("")}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: "#0048f0",
            cursor: "pointer",
            fontSize: 14,
            color: "#ffffff",
          }}
        >
          Очистити
        </button>
      </div>

      {/* Если идёт фильтрация — показываем плоский список */}
      {isFiltering ? (
        <div style={{ textAlign: "left", maxWidth: "640px", margin: "0 auto" }}>
          <h3 style={{ marginBottom: 8 }}>
            Результати пошуку ({filteredFlat.length})
          </h3>

          {filteredFlat.length === 0 && (
            <p style={{ color: "#777" }}>Нічого не знайдено</p>
          )}

          {filteredFlat.map(({ brand, name, code }) => {
            const key = makeKey(brand, name);
            return (
              <div
                key={key}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(key)}
                    onChange={() => handleCheckbox(brand, name)}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{name}</div>
                    {/* <div style={{ fontSize: 12, color: "#666" }}>{brand}</div> */}
                  </div>
                </label>

                {selectedKeys.includes(key) && (
                  <div style={{ marginTop: 10 }}>
                    <Barcode value={code} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Иначе — показываем аккордеон по брендам
        <div style={{ textAlign: "left", maxWidth: "480px", margin: "0 auto" }}>
          {Object.keys(skuList).map((brand) => (
            <div key={brand} style={{ marginBottom: 10 }}>
              <div
                onClick={() => toggleBrand(brand)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  background: "#ffffff",
                  border: "1px solid #eeeeee",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{brand}</span>
                <span>{openBrands.includes(brand) ? "▲" : "▼"}</span>
              </div>

              {openBrands.includes(brand) && (
                <div style={{ padding: "10px 20px" }}>
                  {Object.keys(skuList[brand]).map((name) => {
                    const key = makeKey(brand, name);
                    return (
                      <div key={key} style={{ margin: "8px 0", fontSize: 16 }}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedKeys.includes(key)}
                            onChange={() => handleCheckbox(brand, name)}
                          />
                          {name}
                        </label>

                        {selectedKeys.includes(key) && (
                          <div style={{ marginTop: 8 }}>
                            <Barcode value={skuList[brand][name]} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: "10px", marginTop: 18 }}>Версія 3.4.1</p>
      <p style={{ fontSize: "10px" }}>
        Для оновлення даних треба закрити та заново відкрити застосунок!
      </p>
    </div>
  );
}

export default App;
