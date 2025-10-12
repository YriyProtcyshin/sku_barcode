import { useState, useEffect } from "react";
import Accordion from "./Components/Accordion/Accordion";
import FilteredList from "./Components/FilteredList/FilteredList";
import Barcode from "./Components/Barcode/Barcode";
import "./App.css";

// ✅ Импортируем Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [skuList, setSkuList] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [modalData, setModalData] = useState(null);
  const [hideBarcodes, setHideBarcodes] = useState(false);
  const [showSelectedList, setShowSelectedList] = useState(false);

  // 🔹 Загрузка JSON
  useEffect(() => {
    fetch("/sku.json")
      .then((res) => res.json())
      .then((data) => setSkuList(data))
      .catch((err) => console.error("Ошибка загрузки sku.json:", err));
  }, []);

  // 🔹 Переключение выбранных позиций
  const toggleItem = (brand, model, barcode) => {
    const key = `${brand}-${model}`;
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[key]) delete updated[key];
      else updated[key] = { brand, model, barcode };
      return updated;
    });
  };

  // 🔹 Удаление выбранного элемента
  const removeSelectedItem = (key) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // 🔹 Удаление всех выбранных
  const clearAllSelected = () => setSelectedItems({});

  // 🔹 Открытие модального окна
  const openModal = (model, barcode) => {
    setModalData({ model, barcode });
    document.body.style.overflow = "hidden";
  };

  // 🔹 Закрытие модального окна
  const closeModal = () => {
    setModalData(null);
    document.body.style.overflow = "auto";
  };

  // 🔹 Фильтрация по поиску
  const getFilteredData = () => {
    if (!searchTerm.trim()) return null;
    const filtered = {};
    Object.entries(skuList).forEach(([brand, models]) => {
      const matchedModels = Object.entries(models).filter(([model]) =>
        model.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchedModels.length > 0) {
        filtered[brand] = Object.fromEntries(matchedModels);
      }
    });
    return filtered;
  };

  const filteredData = getFilteredData();
  const selectedList = Object.entries(selectedItems);

  // 🔹 Копирование выбранных позиций
  const copySelectedToClipboard = async () => {
    const names = selectedList
      .map(([_, { brand, model }]) => `${model}`)
      .join("\n");

    if (!names) {
      toast.warning("Нет выбранных позиций ⚠️", { autoClose: 2000 });
      return;
    }

    try {
      await navigator.clipboard.writeText(names);
      toast.success("Список скопійовано!", { autoClose: 2000 });
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = names;
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Список скопійовано!", { autoClose: 2000 });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Check SKU</h1>
        <p className="description">Генератор штрих-кодів та списку SKU</p>
      </div>
      {/* Чекбокс для скрытия штрихкодов */}
      <label className="hide-barcode-toggle">
        <input
          type="checkbox"
          checked={hideBarcodes}
          onChange={(e) => setHideBarcodes(e.target.checked)}
        />
        Не відображати штрихкод
      </label>

      {showSelectedList ? (
        <div className="selected-list">
          <h2>Вибрані позиції</h2>

          {selectedList.length === 0 ? (
            <p>Немає вибраних позицій</p>
          ) : (
            <>
              {selectedList.map(([key, item]) => (
                <div key={key} className="selected-item">
                  <div className="selected-item-text">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => removeSelectedItem(key)}
                      id={`checkbox-${key}`}
                    />
                    <label htmlFor={`checkbox-${key}`}>{item.model}</label>
                  </div>

                  {!hideBarcodes && (
                    <div
                      className="barcode-wrapper"
                      onClick={() => openModal(item.model, item.barcode)}
                    >
                      <Barcode value={item.barcode} />
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          <div className="footer">
            <button className="copy-btn" onClick={copySelectedToClipboard}>
              📋 Копіювати вибрані
            </button>

            <button
              className="show-selected-btn"
              onClick={() => setShowSelectedList(false)}
            >
              Назад до списку
            </button>
            <button className="clear-selected" onClick={clearAllSelected}>
              Очистити список
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Поиск */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Пошук sku ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setSearchTerm("")}
              disabled={!searchTerm}
              className="clear-btn"
            >
              Очистити
            </button>
          </div>

          {/* Основной список */}
          {filteredData ? (
            <FilteredList
              data={filteredData}
              selectedItems={selectedItems}
              toggleItem={toggleItem}
              openModal={openModal}
              hideBarcodes={hideBarcodes}
            />
          ) : (
            <Accordion
              data={skuList || {}}
              selectedItems={selectedItems}
              toggleItem={toggleItem}
              openModal={openModal}
              hideBarcodes={hideBarcodes}
            />
          )}
          <div className="footer">
            <button
              className="show-selected-btn"
              onClick={() => setShowSelectedList(true)}
            >
              Показати вибрані
            </button>
            <button className="clear-selected" onClick={clearAllSelected}>
              Очистити список
            </button>
          </div>
        </>
      )}

      {/* Модальное окно */}
      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✖
            </button>
            <h2>{modalData.model}</h2>
            <Barcode value={modalData.barcode} />
          </div>
        </div>
      )}

      {/* ✅ Контейнер для уведомлений  ToastContainer*/}
      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
