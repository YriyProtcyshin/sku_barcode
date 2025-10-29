import React from "react";
import styles from "./dateAndWeek.module.css";

const DateWeekCompact = () => {
  const date = new Date();

  // Вычисляем номер недели (ISO 8601)
  const getWeekNumber = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  };

  const week = getWeekNumber(date);
  const formatted = date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const iso = `${String(week).padStart(2, "0")}`;

  return (
    <div className={styles.box}>
      Сьогодні: {formatted},  <span className={styles.week}>{iso} тиждень</span>
    </div>
  );
};

export default DateWeekCompact;
