import React, { useState } from "react";
import styles from "./Sales_Value.module.css";

export default function CigaretteSalesCalculator() {
  const [unit, setUnit] = useState("blocks"); // packs | blocks
  const [daily, setDaily] = useState("");
  const [weekly, setWeekly] = useState("");
  const [monthly, setMonthly] = useState("");

  const [unitAll, setUnitAll] = useState(35); // чек боксы для выбора доли компании

  // --- NICOTINE CANS ---
  const [weekly15, setWeekly15] = useState("");
  const [weekly20, setWeekly20] = useState("");
  const [monthly15, setMonthly15] = useState("");
  const [monthly20, setMonthly20] = useState("");

  const toPacks = (value) => (unit === "blocks" ? value * 10 : value);
  const fromPacks = (packs) => (unit === "blocks" ? packs / 10 : packs);

  // --- DAILY ---
  const handleDailyChange = (value) => {
    if (value === "") {
      setDaily("");
      setWeekly("");
      setMonthly("");
      return;
    }
    const val = Number(value);
    const dPacks = toPacks(val);
    const wPacks = dPacks * 7;
    const mPacks = dPacks * 30;

    setDaily(val);
    setWeekly(fromPacks(Math.round(wPacks)));
    setMonthly(fromPacks(Math.round(mPacks)));
  };

  // --- WEEKLY ---
  const handleWeeklyChange = (value) => {
    if (value === "") {
      setDaily("");
      setWeekly("");
      setMonthly("");
      return;
    }
    const val = Number(value);
    const wPacks = toPacks(val);
    const dPacks = wPacks / 7;
    const mPacks = dPacks * 30;

    setWeekly(val);
    setDaily(fromPacks(Math.round(dPacks)));
    setMonthly(fromPacks(Math.round(mPacks)));
  };

  // --- MONTHLY ---
  const handleMonthlyChange = (value) => {
    if (value === "") {
      setDaily("");
      setWeekly("");
      setMonthly("");
      return;
    }
    const val = Number(value);
    const mPacks = toPacks(val);
    const dPacks = mPacks / 30;
    const wPacks = dPacks * 7;

    setMonthly(val);
    setDaily(fromPacks(Math.round(dPacks)));
    setWeekly(fromPacks(Math.round(wPacks)));
  };

  // --- YEAR RESULT ---
  const yearlyInPieces =
    monthly !== "" ? Math.round(toPacks(Number(monthly)) * 20 * 12) : 0;

  // --- NICOTINE WEEKLY / MONTHLY HANDLERS ---
  const handleWeekly15Change = (value) => {
    setWeekly15(value);
    setMonthly15(value !== "" ? Math.round(Number(value) * 4) : "");
  };
  const handleWeekly20Change = (value) => {
    setWeekly20(value);
    setMonthly20(value !== "" ? Math.round(Number(value) * 4) : "");
  };
  const handleMonthly15Change = (value) => {
    setMonthly15(value);
    setWeekly15(value !== "" ? Math.round(Number(value) / 4) : "");
  };
  const handleMonthly20Change = (value) => {
    setMonthly20(value);
    setWeekly20(value !== "" ? Math.round(Number(value) / 4) : "");
  };

  // --- YEARLY NICOTINE ---
  const yearlyNicotinePieces =
    (Number(weekly15 || 0) * 15 + Number(weekly20 || 0) * 20) * 4 * 12;

  return (
    <div className="container">
      <div className="header">
        <h1>Об'єм продажу</h1>
        <p className="description">Калькулятор річного об'єму продажу</p>
      </div>

      {/* --- UNIT SWITCHER --- */}
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

      {/* --- DAILY --- */}
      <label className={styles.field}>
        <span>Продажі на день ({unit === "packs" ? "пачок" : "блоків"})</span>
        <input
          type="number"
          className={styles.input}
          value={daily}
          onChange={(e) => handleDailyChange(e.target.value)}
        />
      </label>

      {/* --- WEEKLY --- */}
      <label className={styles.field}>
        <span>
          Продажі на тиждень ({unit === "packs" ? "пачок" : "блоків"})
        </span>
        <input
          type="number"
          className={styles.input}
          value={weekly}
          onChange={(e) => handleWeeklyChange(e.target.value)}
        />
      </label>

      {/* --- MONTHLY --- */}
      <label className={styles.field}>
        <span>Продажі на місяць ({unit === "packs" ? "пачок" : "блоків"})</span>
        <input
          type="number"
          className={styles.input}
          value={monthly}
          onChange={(e) => handleMonthlyChange(e.target.value)}
        />
      </label>

      {/* --- YEAR RESULT --- */}
      <div className={styles.result}>
        Продажі на рік (штук сигарет): {yearlyInPieces.toLocaleString("ru-RU")}
      </div>

      {/* --- ALL CALCULATION --- */}
      <div className={styles.all_switcher}>
        <div className={styles.all_switcher_title}>Доля (%)</div>
        <div className={styles.all_switcher_block}>
          {[21, 23, 27, 31, 33, 35, 37, 40, 43, 45].map((num) => (
            <label key={num} className={styles.all_switcher_radio}>
              <input
                type="radio"
                checked={unitAll === num}
                onChange={() => setUnitAll(num)}
              />
              <span>{num}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.result}>
        Продажі на рік ALL (штук сигарет):{" "}
        {Math.round((yearlyInPieces * 100) / unitAll).toLocaleString("ru-RU")}
      </div>

      {/* --- NICOTINE CANS --- */}
      <div className={styles.nicotine_section}>
        <h2 className={styles.nicotine_title}>Нікотинові паунчі</h2>

        <label className={styles.field}>
          <span>Продажи в неделю (банок по 15 штук)</span>
          <input
            type="number"
            className={styles.input}
            value={weekly15}
            onChange={(e) => handleWeekly15Change(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Продажи в неделю (банок по 20 штук)</span>
          <input
            type="number"
            className={styles.input}
            value={weekly20}
            onChange={(e) => handleWeekly20Change(e.target.value)}
          />
        </label>
        <hr />
        <label className={styles.field}>
          <span>Продажи в месяц (банок по 15 штук)</span>
          <input
            type="number"
            className={styles.input}
            value={monthly15}
            onChange={(e) => handleMonthly15Change(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Продажи в месяц (банок по 20 штук)</span>
          <input
            type="number"
            className={styles.input}
            value={monthly20}
            onChange={(e) => handleMonthly20Change(e.target.value)}
          />
        </label>

        <div className={styles.result}>
          Продажи в год: {yearlyNicotinePieces.toLocaleString("ru-RU")} штук
        </div>
      </div>
    </div>
  );
}
