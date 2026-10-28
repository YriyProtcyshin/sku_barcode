import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./dateAndWeek.module.css";

const DateWeekCompact = () => {
  const { i18n } = useTranslation();
  const date = new Date();

  // ISO 8601 номер тижня
  const getWeekNumber = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  };

  const week = getWeekNumber(date);
  const locale = i18n.resolvedLanguage === "uk" ? "uk-UA" : "en-US";

  const formatted = date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const weekLabel = locale === "uk-UA" ? "тиждень" : "week";
  const iso = String(week).padStart(2, "0");

  return (
    <div className={styles.box}>
      {locale === "uk-UA" ? "Сьогодні" : "Today"}: {formatted},{" "}
      <span className={styles.week}>{iso} {weekLabel}</span>
    </div>
  );
};

export default DateWeekCompact;
