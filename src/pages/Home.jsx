import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Accordion from "../Components/Accordion/Accordion";
import FilteredList from "../Components/FilteredList/FilteredList";
import Barcode from "../Components/Barcode/Barcode";
import DateWeekCompact from "../Components/DateAndWeek/DateAndWeek";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSkuData } from "../hooks/useSkuData";

const Home = () => {
  const { t } = useTranslation();
  const { skuList, loadingStatus, lastModified } = useSkuData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [modalData, setModalData] = useState(null);
  const [hideBarcodes, setHideBarcodes] = useState(false);
  const [showSelectedList, setShowSelectedList] = useState(false);

  // 🔹 Переключення вибраних позицій
  const toggleItem = (brand, model, barcode) => {
    const key = `${brand}-${model}`;
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (updated[key]) delete updated[key];
      else updated[key] = { brand, model, barcode };
      return updated;
    });
  };

  // 🔹 Видалення вибраного елемента
  const removeSelectedItem = (key) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // 🔹 Видалення всіх вибраних
  const clearAllSelected = () => setSelectedItems({});

  // 🔹 Відкриття модального вікна
  const openModal = (model, barcode) => {
    setModalData({ model, barcode });
    document.body.classList.add("modal-open");
  };

  // 🔹 Закрити модальне вікно
  const closeModal = () => {
    setModalData(null);
    document.body.classList.remove("modal-open");
  };

  // 🔹 Фільтрація за пошуком (мемоізовано)
  const filteredData = useMemo(() => {
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
  }, [searchTerm, skuList]);

  const selectedList = Object.entries(selectedItems);

  // 🔹 Копіювання вибраних позицій
  const copySelectedToClipboard = async () => {
    const names = selectedList
      .map(([_, { model }]) => `${model}`)
      .join("\n");

    if (!names) {
      toast.warning(t("home.noItemsWarning"), { autoClose: 2000 });
      return;
    }

    try {
      await navigator.clipboard.writeText(names);
      toast.success(t("home.copiedSuccess"), { autoClose: 2000 });
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = names;
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success(t("home.copiedSuccess"), { autoClose: 2000 });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>{t("home.title")}</h1>
        <p className="description">{t("home.description")}</p>
        <DateWeekCompact />
      </div>

      <label className="hide-barcode-toggle">
        <input
          type="checkbox"
          checked={hideBarcodes}
          onChange={(e) => setHideBarcodes(e.target.checked)}
        />
        {t("home.hideBarcode")}
      </label>

      {showSelectedList ? (
        <div className="selected-list">
          <h2>{t("home.selectedTitle")}</h2>

          {selectedList.length === 0 ? (
            <p>{t("home.noSelected")}</p>
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
              {t("home.copySelected")}
            </button>

            <button
              className="show-selected-btn"
              onClick={() => setShowSelectedList(false)}
            >
              {t("home.backToList")}
            </button>
            <button className="clear-selected" onClick={clearAllSelected}>
              {t("home.clearList")}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Пошук */}
          <div className="search-section">
            <input
              type="text"
              placeholder={t("home.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setSearchTerm("")}
              disabled={!searchTerm}
              className="clear-btn"
            >
              {t("home.clearSearch")}
            </button>
          </div>

          {/* Основний список */}
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
          <div className="last-modified">
            {t("common.dataUpdated")} <br /> {lastModified}
          </div>
          <div className="footer">
            <button
              className="show-selected-btn"
              onClick={() => setShowSelectedList(true)}
            >
              {t("home.showSelected")}
            </button>
            <button className="clear-selected" onClick={clearAllSelected}>
              {t("home.clearList")}
            </button>
          </div>
        </>
      )}

      {/* Модальне вікно */}
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

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Home;
