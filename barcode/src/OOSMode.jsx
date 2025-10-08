// OOSMode.jsx
import React, { useState, useMemo, useCallback } from "react";
import Barcode from "./Barcode";

const makeKey = (brand, name) => `${brand}:::${name}`;

const OOSItem = React.memo(
  ({
    item,
    isSelected,
    onToggle,
    showBarcodes,
    activeBarcode,
    onBarcodeClick,
  }) => {
    const { brand, name, code, key } = item;

    return (
      <div
        key={key}
        style={{ margin: "10px 0", fontSize: 16 }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap:10,
            cursor: "pointer",
            padding: "10px",
            // borderRadius: "18px",

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
              width: 20,
              height: 20,
              cursor: "pointer",
            }}
          />
          <span style={{ color: "#333", fontWeight: 500 }}>{name}</span>
        </label>

        {showBarcodes && isSelected && (
          <div
            style={{
              marginTop: 10,
              padding: "12px",
              background: "#ffffff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              position: "relative",
              zIndex: activeBarcode === key ? 1001 : "auto",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => onBarcodeClick(key)}
            onMouseEnter={(e) => {
              if (activeBarcode !== key) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeBarcode !== key) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }
            }}
          >
            <Barcode value={code} />
          </div>
        )}
      </div>
    );
  }
);

export default function OOSMode({ skuList, onBack }) {
  const [openBrands, setOpenBrands] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [showBarcodes, setShowBarcodes] = useState(false);
  const [showSelectedList, setShowSelectedList] = useState(false);
  const [activeBarcode, setActiveBarcode] = useState(null);
  const [filter, setFilter] = useState("");
  const [copyNotification, setCopyNotification] = useState(false);

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

  const handleClearAll = useCallback(() => {
    setSelectedKeys([]);
    setShowBarcodes(false);
    setShowSelectedList(false);
  }, []);

  // Обработчик снятия чекбокса в списке выбранных
  const handleRemoveFromList = useCallback((keyToRemove) => {
    setSelectedKeys((prev) => prev.filter((key) => key !== keyToRemove));
  }, []);

  const handleCopy = useCallback(async () => {
    const list = selectedKeys
      .map((key) => {
        const [brand, name] = key.split(":::");
        return name;
      })
      .sort((a, b) => a.localeCompare(b))
      .join("\n");

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(list);
        showCopyNotification();
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = list;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showCopyNotification();
      }
    } catch (err) {
      console.error("Помилка копіювання:", err);
      alert("Помилка копіювання. Переконайтеся, що сайт відкрито через HTTPS.");
    }
  }, [selectedKeys]);

  const showCopyNotification = useCallback(() => {
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2000);
  }, []);

  const handleBarcodeClick = useCallback((key) => {
    setActiveBarcode((prev) => (prev === key ? null : key));
  }, []);

  const filteredBrands = useMemo(() => {
    return Object.keys(skuList).filter((b) => !b.toUpperCase().includes("OLD"));
  }, [skuList]);

  const flattened = useMemo(() => {
    return filteredBrands.flatMap((brand) =>
      Object.keys(skuList[brand]).map((name) => ({
        brand,
        name,
        code: skuList[brand][name],
        key: makeKey(brand, name),
      }))
    );
  }, [skuList, filteredBrands]);

  const filterLower = filter.trim().toLowerCase();
  const filteredList = useMemo(() => {
    if (!filterLower) return flattened;
    return flattened.filter(
      (it) =>
        it.name.toLowerCase().includes(filterLower) ||
        it.brand.toLowerCase().includes(filterLower)
    );
  }, [flattened, filter]);

  const visibleItems = useMemo(() => {
    return showBarcodes
      ? flattened.filter((it) => selectedKeys.includes(it.key))
      : filteredList;
  }, [flattened, selectedKeys, showBarcodes, filteredList]);

  const visibleBrands = useMemo(() => {
    return [...new Set(visibleItems.map((it) => it.brand))].filter(
      (b) => !b.toUpperCase().includes("OLD")
    );
  }, [visibleItems]);

  // Получаем данные выбранных элементов для отображения в списке
  const selectedItems = useMemo(() => {
    return selectedKeys
      .map((key) => {
        const [brand, name] = key.split(":::");
        return { key, name, brand };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedKeys]);

  return (
    <div style={{ textAlign: "center" }}>
      {/* Режим редактирования списка выбранных */}
      {showSelectedList ? (
        <div
          style={{
            textAlign: "left",
            marginBottom: 16,
            backgroundColor: "#f8f8fd",
            padding: "12px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0, color: "#333" }}>
              Вибрані позиції ({selectedItems.length})
            </h3>
            <button
              onClick={() => setShowSelectedList(false)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #868f96 0%, #596164 100%)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Назад
            </button>
          </div>

          {selectedItems.length > 0 ? (
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                paddingRight: 8,
              }}
            >
              {selectedItems.map(({ key, name }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => handleRemoveFromList(key)}
                    style={{
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ fontSize: 16, color: "#333" }}>{name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#999", fontStyle: "italic" }}>
              Нічого не вибрано
            </p>
          )}
        </div>
      ) : (
        <>
          {!showBarcodes && (
            <div
              style={{
                margin: "0 auto 24px",
                maxWidth: "600px",
                display: "flex",
                gap: 10,
              }}
            >
              <input
                type="text"
                placeholder="Пошук..."
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
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)",
                  transition: "transform 0.2s ease",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Очистити
              </button>
            </div>
          )}

          <div style={{ textAlign: "left" }}>
            {visibleBrands.length > 0 ? (
              visibleBrands.map((brand) => (
                <div key={brand} style={{ marginBottom: 12 }}>
                  {!showBarcodes && (
                    <div
                      onClick={() => toggleBrand(brand)}
                      style={{
                        cursor: "pointer",
                        padding: "16px 20px",
                        background: "rgba(255, 255, 255, 0.95)",
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
                        e.currentTarget.style.boxShadow =
                          "0 6px 25px rgba(0, 0, 0, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(0, 0, 0, 0.08)";
                      }}
                    >
                      <span>{brand}</span>
                      <span style={{ fontSize: 14, color: "#667eea" }}>
                        {openBrands.includes(brand) ? "▲" : "▼"}
                      </span>
                    </div>
                  )}

                  {(showBarcodes || openBrands.includes(brand)) && (
                    <div
                      style={{
                        padding: "12px 20px",
                        background: showBarcodes
                          ? "transparent"
                          : "rgba(255, 255, 255, 0.9)",
                        borderRadius: showBarcodes ? 0 : "0 0 12px 12px",
                        marginTop: showBarcodes ? 0 : -8,
                        boxShadow: showBarcodes
                          ? "none"
                          : "0 4px 20px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      {visibleItems
                        .filter((it) => it.brand === brand)
                        .map((item) => (
                          <OOSItem
                            key={item.key}
                            item={item}
                            isSelected={selectedKeys.includes(item.key)}
                            onToggle={() =>
                              handleCheckbox(item.brand, item.name)
                            }
                            showBarcodes={showBarcodes}
                            activeBarcode={activeBarcode}
                            onBarcodeClick={handleBarcodeClick}
                          />
                        ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p
                style={{
                  color: "#999",
                  textAlign: "center",
                  marginTop: 40,
                  fontSize: 16,
                }}
              >
                Нічого не знайдено
              </p>
            )}
          </div>
        </>
      )}

      {/* Кнопки */}
      <div
        style={{
          marginTop: 28,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {!showSelectedList && (
          <>
            {!showBarcodes ? (
              <button
                onClick={() => setShowBarcodes(true)}
                disabled={selectedKeys.length === 0}
                style={{
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "none",
                  background:
                    selectedKeys.length === 0
                      ? "#e0e0e0"
                      : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                  color: selectedKeys.length === 0 ? "#999" : "#fff",
                  cursor: selectedKeys.length === 0 ? "not-allowed" : "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow:
                    selectedKeys.length === 0
                      ? "none"
                      : "0 4px 15px rgba(56, 239, 125, 0.3)",
                  transition: "all 0.2s ease",
                  opacity: selectedKeys.length === 0 ? 0.6 : 1,
                }}
              >
                Список з штрихкодами
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowBarcodes(false);
                  setFilter("");
                }}
                style={{
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #868f96 0%, #596164 100%)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow: "0 4px 15px rgba(134, 143, 150, 0.3)",
                  transition: "transform 0.2s ease",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Повернутись
              </button>
            )}

            <button
              onClick={() => setShowSelectedList(true)}
              disabled={selectedKeys.length === 0}
              style={{
                padding: "14px 24px",
                borderRadius: 12,
                border: "none",
                background:
                  selectedKeys.length === 0
                    ? "#e0e0e0"
                    : "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
                color: selectedKeys.length === 0 ? "#999" : "#333",
                cursor: selectedKeys.length === 0 ? "not-allowed" : "pointer",
                fontSize: 15,
                fontWeight: 600,
                boxShadow:
                  selectedKeys.length === 0
                    ? "none"
                    : "0 4px 15px rgba(255, 154, 158, 0.3)",
                transition: "all 0.2s ease",
                opacity: selectedKeys.length === 0 ? 0.6 : 1,
              }}
            >
              Список без штрихкодів
            </button>
          </>
        )}

        <button
          onClick={handleCopy}
          disabled={selectedKeys.length === 0}
          style={{
            padding: "14px 24px",
            borderRadius: 12,
            border: "none",
            background:
              selectedKeys.length === 0
                ? "#e0e0e0"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: selectedKeys.length === 0 ? "#999" : "#fff",
            cursor: selectedKeys.length === 0 ? "not-allowed" : "pointer",
            fontSize: 15,
            fontWeight: 600,
            boxShadow:
              selectedKeys.length === 0
                ? "none"
                : "0 4px 15px rgba(102, 126, 234, 0.4)",
            transition: "all 0.2s ease",
            opacity: selectedKeys.length === 0 ? 0.6 : 1,
          }}
        >
          Копіювати список
        </button>

        <button
          onClick={handleClearAll}
          disabled={selectedKeys.length === 0}
          style={{
            padding: "14px 24px",
            borderRadius: 12,
            border: "none",
            background:
              selectedKeys.length === 0
                ? "#e0e0e0"
                : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: selectedKeys.length === 0 ? "#999" : "#fff",
            cursor: selectedKeys.length === 0 ? "not-allowed" : "pointer",
            fontSize: 15,
            fontWeight: 600,
            boxShadow:
              selectedKeys.length === 0
                ? "none"
                : "0 4px 15px rgba(245, 87, 108, 0.3)",
            transition: "all 0.2s ease",
            opacity: selectedKeys.length === 0 ? 0.6 : 1,
          }}
        >
          Очистити список
        </button>
      </div>

      {/* Уведомления */}
      {copyNotification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            color: "#fff",
            padding: "16px 32px",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(56, 239, 125, 0.4)",
            zIndex: 10000,
            fontSize: 16,
            fontWeight: 600,
            animation: "slideDown 0.3s ease",
          }}
        >
          ✓ Скопійовано в буфер обміну!
        </div>
      )}

      {/* Модальное окно с штрихкодом, названием и чекбоксом */}
      {activeBarcode && (
        <>
          {/* Затемнение фона */}
          <div
            onClick={() => setActiveBarcode(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              zIndex: 9998,
              animation: "fadeIn 0.3s ease",
              backdropFilter: "blur(5px)",
            }}
          />
          {/* Модальный контейнер — как увеличенный элемент из списка */}
          <div
            style={{
              position: "fixed",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              background: "#ffffff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              maxWidth: "90%",
              width: "85%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const [brand, name] = activeBarcode.split(":::");
              const code = skuList[brand]?.[name];
              const isSelected = selectedKeys.includes(activeBarcode);
              return (
                <div style={{ fontSize: 16 }}>
                  {/* Чекбокс + название (как в списке) */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      justifyContent: "center",
                      marginBottom: "16px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckbox(brand, name)}
                      style={{
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ color: "#333", fontWeight: 600 }}>
                      {name}
                    </span>
                  </label>

                  {/* Штрихкод */}
                  {code && <Barcode value={code} />}
                </div>
              );
            })()}
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
