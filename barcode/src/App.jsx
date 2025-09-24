import React, { useState, useEffect } from "react";
import Barcode from "./Barcode";
import logo from "./logo4.png"; // логотип

function App() {
  const [skuList, setSkuList] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openBrands, setOpenBrands] = useState([]);
  const [filter, setFilter] = useState("");
  const [showInstruction, setShowInstruction] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // для инструкции PWA

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

  // Определяем, видим ли мы браузер (для показа кнопки инструкции)
  const isBrowser =
    typeof window !== "undefined" &&
    !window.matchMedia("(display-mode: standalone)").matches;

  // Массив платформ для инструкции
  const platforms = [
    {
      id: "iphone",
      title: "📱 iPhone (Safari)",
      steps: [
        { text: "Відкрийте сайт у Safari." },
        { text: "Натисніть Поділитися (іконка ↑).", img: "/1_1.webp" },
        { text: "Обиріть Додати на головний екран.", img: "/1_1.webp" },
      ],
    },
    {
      id: "📱 iPhone (Chrome)",
      title: "📱 iPhone (Chrome)",
      steps: [
        { text: "Відкрийте сайт на iPhone у Chrome." },
        { text: "Натисніть Поділитися.", img: "/2_1.webp" },
        { text: "Обиріть Додати на головний екран.", img: "/2_2.webp" },
      ],
    },
    {
      id: "android",
      title: "🤖 Android (Chrome)",
      steps: [
        { text: "Відкрийте сайт у Chrome." },
        { text: "Натисніть Меню (три крапки ⋮).", img: "/3_1.webp" },
        {
          text: "Обиріть Додати на головний екран.",
          img: "/3_2.webp",
        },
      ],
    },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Логотип */}
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

      {/* Список сигарет */}
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

      {/* Кнопка инструкции (видна только в браузере) */}
      {isBrowser && (
        <button
          onClick={() => setShowInstruction(true)}
          style={{
            marginTop: 16,
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: "#00aaff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Як встановити застосунок
        </button>
      )}

      {/* Модальное окно инструкции */}
      {showInstruction && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "flex-start", // меняем центрирование на начало
            justifyContent: "center",
            zIndex: 9999,
            overflowY: "auto", // скролл по вертикали
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              maxWidth: "420px",
              width: "100%",
              textAlign: "left",
              padding: "20px",
              boxSizing: "border-box",
              marginTop: "20px", // небольшой отступ сверху
              marginBottom: "20px", // отступ снизу, чтобы скролл работал
            }}
          >
            <h3 style={{ marginTop: 0 }}>Як встановити застосунок</h3>

            {platforms.map(({ id, title, steps }) => {
              const isActive = activeSection === id;
              return (
                <div key={id} style={{ marginBottom: 12 }}>
                  <div
                    onClick={() => setActiveSection(isActive ? null : id)}
                    style={{
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 600,
                      background: "#f0f0f0",
                      padding: "8px 10px",
                      borderRadius: 6,
                    }}
                  >
                    {title}
                  </div>
                  {isActive && (
                    <ol style={{ padding: "10px 15px" }}>
                      {steps.map((s, i) => (
                        <li key={i} style={{ marginBottom: 12 }}>
                          {s.text}
                          <br />
                          {s.img && (
                            <>
                              <br />
                              <img
                                src={s.img}
                                alt={s.text}
                                style={{
                                  width: "200px",
                                  height: "auto",
                                  marginTop: 6,
                                }}
                              />
                            </>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => setShowInstruction(false)}
              style={{
                marginTop: 12,
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: "#ff4444",
                color: "#fff",
                cursor: "pointer",
                display: "block",
              }}
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      <p style={{ fontSize: "10px", marginTop: 18 }}>Версія 3.5</p>
      <p style={{ fontSize: "10px" }}>
        Для оновлення даних треба закрити та заново відкрити застосунок!
      </p>
    </div>
  );
}

export default App;
