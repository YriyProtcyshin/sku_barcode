import React, { useState } from "react";
import styles from "./recommendedOrderCalculator.module.css";
import RecommendedOrderExplanation from "../Components/RecommendedOrderExplanation/RecommendedOrderExplanation";

function RecommendedOrderCalculator() {
  const [weeklySales, setWeeklySales] = useState(["", "", "", ""]);
  const [stock, setStock] = useState("");
  const [coverageDays, setCoverageDays] = useState(7); // по умолчанию 7 дней
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

    // Если точка OOS, применяем страховой коэффициент
    if (Number(stock) === 0) {
      targetStock = targetStock * 1.5; // страховой коэффициент 1.5
    }

    const order = Math.max(targetStock - Number(stock), 0);
    setRecommendedOrder(Math.ceil(order));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Рекомендований заказ</h1>
        <p className="description">Розрахунок рекомендованного заказу</p>
      </div>

      {/* Остаток */}
      <div className={styles.stockContainer}>
        <label className={styles.label}>Поточний залишок:</label>
        <input
          className={styles.inputField}
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      {/* Продажи по неделям */}
      <div className={styles.salesContainer}>
        <h4>Недільні продажі:</h4>
        {weeklySales.map((val, i) => (
          <div key={i} className={styles.weekContainer}>
            <label className={styles.label}>Неділя {i + 1}:</label>
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
        <label className={styles.label}>Запас на (днів):</label>
        <select
          className={styles.selectField}
          value={coverageDays}
          onChange={(e) => setCoverageDays(e.target.value)}
        >
          {Array.from({ length: 12 }, (_, i) => i + 3).map((day) => (
            <option key={day} value={day}>
              {day} {day === 1 ? "день" : "днів"}
            </option>
          ))}
        </select>
      </div>

      <button className={styles.button} onClick={calculateOrder}>
        Розрахувати
      </button>

      {recommendedOrder !== null && (
        <div className={styles.result}>
          Рекомендований заказ: {recommendedOrder} шт.
        </div>
      )}

     <RecommendedOrderExplanation/>
    </div>
  );
}

export default RecommendedOrderCalculator;
