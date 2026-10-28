import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./recommendedOrderCalculator.module.css";
import RecommendedOrderExplanation from "../Components/RecommendedOrderExplanation/RecommendedOrderExplanation";

function RecommendedOrderCalculator() {
  const { t } = useTranslation();
  const [weeklySales, setWeeklySales] = useState(["", "", "", ""]);
  const [stock, setStock] = useState("");
  const [coverageDays, setCoverageDays] = useState(7);
  const [recommendedOrder, setRecommendedOrder] = useState(null);

  const handleSalesChange = (index, value) => {
    const newSales = [...weeklySales];
    newSales[index] = value;
    setWeeklySales(newSales);
  };

  const calculateOrder = () => {
    const salesNumbers = weeklySales.map(Number);
    const averageWeeklySales =
      salesNumbers.reduce((sum, val) => sum + val, 0) / salesNumbers.length;

    const averageDailySales = averageWeeklySales / 7;

    let targetStock = averageDailySales * Number(coverageDays);

    if (Number(stock) === 0) {
      targetStock = targetStock * 1.5;
    }

    const order = Math.max(targetStock - Number(stock), 0);
    setRecommendedOrder(Math.ceil(order));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>{t("order.title")}</h1>
        <p className="description">{t("order.description")}</p>
      </div>

      {/* Залишок */}
      <div className={styles.stockContainer}>
        <label className={styles.label}>{t("order.currentStock")}</label>
        <input
          className={styles.inputField}
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      {/* Продажі по тижнях */}
      <div className={styles.salesContainer}>
        <h4>{t("order.weeklySales")}</h4>
        {weeklySales.map((val, i) => (
          <div key={i} className={styles.weekContainer}>
            <label className={styles.label}>{t("order.week", { num: i + 1 })}</label>
            <input
              className={styles.inputField}
              type="number"
              value={val}
              onChange={(e) => handleSalesChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Запас в днях */}
      <div className={styles.weekContainer}>
        <label className={styles.label}>{t("order.coverageDays")}</label>
        <select
          className={styles.selectField}
          value={coverageDays}
          onChange={(e) => setCoverageDays(e.target.value)}
        >
          {Array.from({ length: 12 }, (_, i) => i + 3).map((day) => (
            <option key={day} value={day}>
              {day} {day === 1 ? t("order.day") : t("order.days")}
            </option>
          ))}
        </select>
      </div>

      <button className={styles.button} onClick={calculateOrder}>
        {t("order.calculate")}
      </button>

      {recommendedOrder !== null && (
        <div className={styles.result}>
          {t("order.result", { value: recommendedOrder })}
        </div>
      )}

      <RecommendedOrderExplanation />
    </div>
  );
}

export default RecommendedOrderCalculator;
