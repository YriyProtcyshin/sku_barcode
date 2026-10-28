import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Sales_Value.module.css";

export default function CigaretteSalesCalculator() {
  const { t, i18n } = useTranslation();
  const [unit, setUnit] = useState("blocks");
  const [daily, setDaily] = useState("");
  const [weekly, setWeekly] = useState("");
  const [monthly, setMonthly] = useState("");
  const [unitAll, setUnitAll] = useState(35);

  const [weekly15, setWeekly15] = useState("");
  const [weekly20, setWeekly20] = useState("");
  const [monthly15, setMonthly15] = useState("");
  const [monthly20, setMonthly20] = useState("");

  const locale = i18n.resolvedLanguage === "uk" ? "uk-UA" : "en-US";
  const unitLabel = unit === "packs" ? t("sales.packsUnit") : t("sales.blocksUnit");

  const toPacks = (value) => (unit === "blocks" ? value * 10 : value);
  const fromPacks = (packs) => (unit === "blocks" ? packs / 10 : packs);

  const handleDailyChange = (value) => {
    if (value === "") { setDaily(""); setWeekly(""); setMonthly(""); return; }
    const val = Number(value);
    const dPacks = toPacks(val);
    setDaily(val);
    setWeekly(fromPacks(Math.round(dPacks * 7)));
    setMonthly(fromPacks(Math.round(dPacks * 30)));
  };

  const handleWeeklyChange = (value) => {
    if (value === "") { setDaily(""); setWeekly(""); setMonthly(""); return; }
    const val = Number(value);
    const wPacks = toPacks(val);
    const dPacks = wPacks / 7;
    setWeekly(val);
    setDaily(fromPacks(Math.round(dPacks)));
    setMonthly(fromPacks(Math.round(dPacks * 30)));
  };

  const handleMonthlyChange = (value) => {
    if (value === "") { setDaily(""); setWeekly(""); setMonthly(""); return; }
    const val = Number(value);
    const mPacks = toPacks(val);
    const dPacks = mPacks / 30;
    setMonthly(val);
    setDaily(fromPacks(Math.round(dPacks)));
    setWeekly(fromPacks(Math.round(dPacks * 7)));
  };

  const yearlyInPieces =
    monthly !== "" ? Math.round(toPacks(Number(monthly)) * 20 * 12) : 0;

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

  const yearlyNicotinePieces =
    (Number(weekly15 || 0) * 15 + Number(weekly20 || 0) * 20) * 4 * 12;

  return (
    <div className="container">
      <div className="header">
        <h1>{t("sales.title")}</h1>
        <p className="description">{t("sales.description")}</p>
      </div>

      {/* Перемикач пачки/блоки */}
      <div className={styles.switcher}>
        <label className={styles.customRadio}>
          <input type="radio" checked={unit === "packs"} onChange={() => setUnit("packs")} />
          <span>{t("sales.packs")}</span>
        </label>
        <label className={styles.customRadio}>
          <input type="radio" checked={unit === "blocks"} onChange={() => setUnit("blocks")} />
          <span>{t("sales.blocks")}</span>
        </label>
      </div>

      <label className={styles.field}>
        <span>{t("sales.dailySales", { unit: unitLabel })}</span>
        <input type="number" inputMode="numeric" className={styles.input}
          value={daily} onChange={(e) => handleDailyChange(e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>{t("sales.weeklySales", { unit: unitLabel })}</span>
        <input type="number" inputMode="numeric" className={styles.input}
          value={weekly} onChange={(e) => handleWeeklyChange(e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>{t("sales.monthlySales", { unit: unitLabel })}</span>
        <input type="number" inputMode="numeric" className={styles.input}
          value={monthly} onChange={(e) => handleMonthlyChange(e.target.value)} />
      </label>

      <div className={styles.result}>
        {t("sales.yearlyResult", { value: yearlyInPieces.toLocaleString(locale) })}
      </div>

      {/* Доля */}
      <div className={styles.all_switcher}>
        <div className={styles.all_switcher_title}>{t("sales.sharePercent")}</div>
        <div className={styles.all_switcher_block}>
          {[21, 23, 27, 31, 33, 35, 37, 40, 43, 45].map((num) => (
            <label key={num} className={styles.all_switcher_radio}>
              <input type="radio" checked={unitAll === num} onChange={() => setUnitAll(num)} />
              <span>{num}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.result}>
        {t("sales.yearlyAll", {
          value: Math.round((yearlyInPieces * 100) / unitAll).toLocaleString(locale),
        })}
      </div>

      {/* Нікотинові паунчі */}
      <div className={styles.nicotine_section}>
        <h2 className={styles.nicotine_title}>{t("sales.nicotineTitle")}</h2>

        <label className={styles.field}>
          <span>{t("sales.weekly15")}</span>
          <input type="number" inputMode="numeric" className={styles.input}
            value={weekly15} onChange={(e) => handleWeekly15Change(e.target.value)} />
        </label>

        <label className={styles.field}>
          <span>{t("sales.weekly20")}</span>
          <input type="number" inputMode="numeric" className={styles.input}
            value={weekly20} onChange={(e) => handleWeekly20Change(e.target.value)} />
        </label>
        <hr />
        <label className={styles.field}>
          <span>{t("sales.monthly15")}</span>
          <input type="number" className={styles.input}
            value={monthly15} onChange={(e) => handleMonthly15Change(e.target.value)} />
        </label>

        <label className={styles.field}>
          <span>{t("sales.monthly20")}</span>
          <input type="number" className={styles.input}
            value={monthly20} onChange={(e) => handleMonthly20Change(e.target.value)} />
        </label>

        <div className={styles.result}>
          {t("sales.yearlyNicotine", { value: yearlyNicotinePieces.toLocaleString(locale) })}
        </div>
      </div>
    </div>
  );
}
