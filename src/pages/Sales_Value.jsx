import React, { useState } from "react";
import styles from "./Sales_Value.module.css";

export default function CigaretteSalesCalculator() {
  const [unit, setUnit] = useState("blocks"); // packs | blocks
  const [daily, setDaily] = useState();
  const [weekly, setWeekly] = useState();
  const [monthly, setMonthly] = useState();

  const toPacks = (value) => (unit === "blocks" ? value * 10 : value);
  const fromPacks = (packs) => (unit === "blocks" ? packs / 10 : packs);

  const handleDailyChange = (value) => {
    const val = Number(value) || 0;
    const dPacks = toPacks(val);
    const wPacks = dPacks * 7;
    const mPacks = dPacks * 30;

    setDaily(val);
    setWeekly(fromPacks(Math.round(wPacks)));
    setMonthly(fromPacks(Math.round(mPacks)));
  };

  const handleWeeklyChange = (value) => {
    const val = Number(value) || 0;
    const wPacks = toPacks(val);
    const dPacks = wPacks / 7;
    const mPacks = dPacks * 30;

    setWeekly(val);
    setDaily(fromPacks(Math.round(dPacks)));
    setMonthly(fromPacks(Math.round(mPacks)));
  };

  const handleMonthlyChange = (value) => {
    const val = Number(value) || 0;
    const mPacks = toPacks(val);
    const dPacks = mPacks / 30;
    const wPacks = dPacks * 7;

    setMonthly(val);
    setDaily(fromPacks(Math.round(dPacks)));
    setWeekly(fromPacks(Math.round(wPacks)));
  };

  const yearlyInPieces = Math.round(toPacks(monthly) * 20 * 12);

  return (
    <div className="container">      
      <div className="header">
        <h1>Об'єм продажу</h1>
        <p className="description">Калькулятор річного об'єму продажу</p>
      </div>

      <div className={styles.switcher}>
        <label className={styles.customRadio}>
          <input
            type="radio"
            checked={unit === "packs"}
            onChange={() => setUnit("packs")}
          />
          <span>Пачки</span>
        </label>
        <label className={styles.customRadio}>
          <input
            type="radio"
            checked={unit === "blocks"}
            onChange={() => setUnit("blocks")}
          />
          <span>Блоки</span>
        </label>
      </div>

      <label className={styles.field}>
        <span>Продажі на день ({unit === "packs" ? "пачок" : "блоків"})</span>
        <input
          type="number"
          inputMode="numeric" // подсказывает браузеру открыть цифровую клавиатуру
          pattern="[0-9]*"
          className={styles.input}
          value={daily}
          onChange={(e) => handleDailyChange(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>
          Продажі на тиждень ({unit === "packs" ? "пачок" : "блоків"})
        </span>
        <input
          type="number"
          inputMode="numeric" // подсказывает браузеру открыть цифровую клавиатуру
          pattern="[0-9]*"
          className={styles.input}
          value={weekly}
          onChange={(e) => handleWeeklyChange(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Продажі на місяць ({unit === "packs" ? "пачок" : "блоків"})</span>
        <input
          type="number"
          inputMode="numeric" // подсказывает браузеру открыть цифровую клавиатуру
          pattern="[0-9]*"
          className={styles.input}
          value={monthly}
          onChange={(e) => handleMonthlyChange(e.target.value)}
        />
      </label>

      <div className={styles.result}>
        Продажі на рік (штук сигарет): {yearlyInPieces}
      </div>
    </div>
  );
}
