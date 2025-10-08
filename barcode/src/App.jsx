// App.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Barcode from "./Barcode";
import OOSMode from "./OOSMode";
import logo from "./logo4.png";

// Вынесено за пределы компонента — чистая функция
const makeKey = (brand, name) => `${brand}:::${name}`;

// Мемоизированный компонент элемента поиска
const SearchResultItem = React.memo(
  ({ brand, name, code, isSelected, onToggle }) => {
    return (
      <div
        style={{
          padding: "14px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          transition: "background 0.2s ease",
        }}
      >
        <label
          style={{
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            style={{
              width: 20,
              height: 20,
              cursor: "pointer",
            }}
          />
          <div>
            <div style={{ fontWeight: 600, color: "#333" }}>{name}</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
              {brand}
            </div>
          </div>
        </label>

        {isSelected && (
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              background: "#fafafa",
              borderRadius: 8,
            }}
          >
            <Barcode value={code} />
          </div>
        )}
      </div>
    );
  }
);

// Мемоизированный компонент строки товара в аккордеоне
const BrandItemRow = React.memo(
  ({ brand, name, code, isSelected, onToggle }) => {
    return (
      <div style={{ margin: "10px 0", fontSize: 16 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            padding: "8px",
            borderRadius: 8,
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8f8f8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            style={{
              width: 18,
              height: 18,
              cursor: "pointer",
            }}
          />
          <span style={{ color: "#333" }}>{name}</span>
        </label>

        {isSelected && (
          <div
            style={{
              marginTop: 10,
              padding: "12px",
              background: "#fafafa",
              borderRadius: 8,
            }}
          >
            <Barcode value={code} />
          </div>
        )}
      </div>
    );
  }
);

// Мемоизированный компонент секции бренда
const BrandSection = React.memo(
  ({ brand, items, isOpen, onToggleBrand, selectedKeys, onItemToggle }) => {
    return (
      <div style={{ marginBottom: 12 }}>
        <div
          onClick={() => onToggleBrand(brand)}
          style={{
            cursor: "pointer",
            padding: "16px 20px",
            background: "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            color: "#333",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 25px rgba(0, 0, 0, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
          }}
        >
          <span>{brand}</span>
          <span style={{ fontSize: 14, color: "#667eea" }}>
            {isOpen ? "▲" : "▼"}
          </span>
        </div>

        {isOpen && (
          <div
            style={{
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "0 0 12px 12px",
              marginTop: -8,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            {Object.keys(items).map((name) => {
              const key = makeKey(brand, name);
              return (
                <BrandItemRow
                  key={key}
                  brand={brand}
                  name={name}
                  code={items[name]}
                  isSelected={selectedKeys.includes(key)}
                  onToggle={() => onItemToggle(brand, name)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

function App() {
  const [skuList, setSkuList] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openBrands, setOpenBrands] = useState([]);
  const [filter, setFilter] = useState("");
  const [showInstruction, setShowInstruction] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [mode, setMode] = useState("barcode");

  useEffect(() => {
    fetch("/sku.json")
      .then((res) => res.json())
      .then((data) => setSkuList(data))
      .catch((err) => console.error("Помилка завантаження sku.json", err));
  }, []);

  // Мемоизированные обработчики
  const toggleBrand = useCallback((brand) => {
    setOpenBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }, []);

  const handleCheckbox = useCallback((brand, name) => {
    const key = makeKey(brand, name);
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  // Мемоизированные вычисления
  const flattened = useMemo(() => {
    return Object.entries(skuList).flatMap(([brand, items]) =>
      Object.keys(items).map((name) => ({ brand, name, code: items[name] }))
    );
  }, [skuList]);

  const isFiltering = filter.trim().length > 0;
  const filteredFlat = useMemo(() => {
    if (!isFiltering) return [];
    const filterLower = filter.trim().toLowerCase();
    return flattened.filter(
      (it) =>
        it.name.toLowerCase().includes(filterLower) ||
        it.brand.toLowerCase().includes(filterLower)
    );
  }, [flattened, filter]);

  const isBrowser =
    typeof window !== "undefined" &&
    !window.matchMedia("(display-mode: standalone)").matches;

  const platforms = [
    {
      id: "iphone",
      title: "📱 iPhone (Safari)",
      steps: [
        { text: "Відкрийте сайт у Safari." },
        { text: "Натисніть Поділитися (іконка ↑).", img: "/1_1.webp" },
        { text: "Оберіть Додати на головний екран.", img: "/1_2.webp" },
      ],
    },
    {
      id: "iphone_chrome",
      title: "📱 iPhone (Chrome)",
      steps: [
        { text: "Відкрийте сайт на iPhone у Chrome." },
        { text: "Натисніть Поділитися.", img: "/2_1.webp" },
        { text: "Оберіть Додати на головний екран.", img: "/2_2.webp" },
      ],
    },
    {
      id: "android",
      title: "🤖 Android (Chrome)",
      steps: [
        { text: "Відкрийте сайт у Chrome." },
        { text: "Натисніть Меню (три крапки ⋮).", img: "/3_1.webp" },
        { text: "Оберіть Додати на головний екран.", img: "/3_2.webp" },
      ],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      {/* Верхнее меню */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 20px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          padding: "16px 20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={logo}
              alt="Логотип"
              style={{
                width: 56,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Генератор штрихкодів
            </h1>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={mode === "barcode"}
              onClick={() => setMode("barcode")}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                cursor: mode === "barcode" ? "default" : "pointer",
                fontSize: 15,
                fontWeight: 600,
                background:
                  mode === "barcode"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "#f0f0f0",
                color: mode === "barcode" ? "#fff" : "#666",
                boxShadow:
                  mode === "barcode"
                    ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                    : "none",
                transition: "all 0.3s ease",
              }}
            >
              Barcode
            </button>
            <button
              disabled={mode === "oos"}
              onClick={() => setMode("oos")}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                cursor: mode === "oos" ? "default" : "pointer",
                fontSize: 15,
                fontWeight: 600,
                background:
                  mode === "oos"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "#f0f0f0",
                color: mode === "oos" ? "#fff" : "#666",
                boxShadow:
                  mode === "oos"
                    ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                    : "none",
                transition: "all 0.3s ease",
              }}
            >
              OOS
            </button>
          </div>
        </div>
      </div>

      {/* Контент режимов */}
      {mode === "oos" ? (
        <OOSMode skuList={skuList} onBack={() => setMode("barcode")} />
      ) : (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              margin: "0 auto 20px",
              maxWidth: "600px",
              display: "flex",
              gap: 10,
            }}
          >
            <input
              type="text"
              placeholder="Почніть вводити для пошуку..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                flex: 1,
                padding: "14px 18px",
                borderRadius: 12,
                border: "none",
                fontSize: 16,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                color: "#1a1a1a",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                outline: "none",
              }}
            />
            <button
              onClick={() => setFilter("")}
              style={{
                padding: "14px 22px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                color: "#ffffff",
                boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)",
                transition: "transform 0.2s ease",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Очистити
            </button>
          </div>

          {/* Список результатов поиска */}
          {isFiltering ? (
            <div
              style={{
                textAlign: "left",
                maxWidth: "700px",
                margin: "0 auto",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: 16,
                padding: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 16,
                  color: "#333",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Результати пошуку ({filteredFlat.length})
              </h3>
              {filteredFlat.length === 0 && (
                <p
                  style={{
                    color: "#999",
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  Нічого не знайдено
                </p>
              )}

              {filteredFlat.map(({ brand, name, code }) => {
                const key = makeKey(brand, name);
                return (
                  <SearchResultItem
                    key={key}
                    brand={brand}
                    name={name}
                    code={code}
                    isSelected={selectedKeys.includes(key)}
                    onToggle={() => handleCheckbox(brand, name)}
                  />
                );
              })}
            </div>
          ) : (
            // Список брендов и товаров (аккордеон)
            <div
              style={{
                textAlign: "left",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {Object.keys(skuList).map((brand) => (
                <BrandSection
                  key={brand}
                  brand={brand}
                  items={skuList[brand]}
                  isOpen={openBrands.includes(brand)}
                  onToggleBrand={toggleBrand}
                  selectedKeys={selectedKeys}
                  onItemToggle={handleCheckbox}
                />
              ))}
            </div>
          )}

          {/* Кнопка инструкции */}
          {isBrowser && (
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => setShowInstruction(true)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow: "0 4px 15px rgba(79, 172, 254, 0.4)",
                  transition: "transform 0.2s ease",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Як встановити застосунок
              </button>
            </div>
          )}

          {/* Модальное окно инструкции */}
          {showInstruction && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                zIndex: 9999,
                overflowY: "auto",
                padding: "20px",
                backdropFilter: "blur(5px)",
              }}
              onClick={() => setShowInstruction(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  maxWidth: "450px",
                  width: "100%",
                  textAlign: "left",
                  padding: "24px",
                  boxSizing: "border-box",
                  marginTop: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: 20,
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#333",
                  }}
                >
                  Як встановити застосунок
                </h3>

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
                          background: isActive
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "#f5f5f5",
                          color: isActive ? "#fff" : "#333",
                          padding: "12px 16px",
                          borderRadius: 10,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {title}
                      </div>
                      {isActive && (
                        <ol
                          style={{
                            padding: "12px 20px",
                            margin: 0,
                          }}
                        >
                          {steps.map((s, i) => (
                            <li
                              key={i}
                              style={{
                                marginBottom: 16,
                                color: "#555",
                                lineHeight: 1.6,
                              }}
                            >
                              {s.text}
                              {s.img && (
                                <>
                                  <br />
                                  <img
                                    src={s.img}
                                    alt={s.text}
                                    style={{
                                      width: "220px",
                                      height: "auto",
                                      marginTop: 10,
                                      borderRadius: 8,
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                    marginTop: 16,
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: "none",
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "#fff",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    fontSize: 15,
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)",
                  }}
                >
                  Закрити
                </button>
              </div>
            </div>
          )}

          <p
            style={{
              fontSize: "11px",
              marginTop: 24,
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 500,
            }}
          >
            Версія 3.6
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
