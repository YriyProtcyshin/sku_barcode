import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./mileage_calculator.module.css";

// Компонент для числового поля з кнопками + і -
const NumberInput = ({ label, value, setValue }) => {
  const handleIncrement = () => {
    const num = parseFloat(value);
    setValue(isNaN(num) ? 1 : num + 1);
  };

  const handleDecrement = () => {
    const num = parseFloat(value);
    setValue(isNaN(num) ? 0 : num - 1);
  };

  return (
    <div className={styles["number-input"]}>
      <label>{label}</label>
      <div className={styles["input-field"]}>
        <button type="button" onClick={handleDecrement}>
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="button" onClick={handleIncrement}>
          +
        </button>
      </div>
    </div>
  );
};

const Mileage_calculator = () => {
  const { t } = useTranslation();

  const [startOdo, setStartOdo] = useState(
    () => localStorage.getItem("startOdo") || ""
  );
  const [startFuel, setStartFuel] = useState(
    () => localStorage.getItem("startFuel") || ""
  );
  const [endOdo, setEndOdo] = useState(
    () => localStorage.getItem("endOdo") || ""
  );
  const [fuelAdded, setFuelAdded] = useState(
    () => localStorage.getItem("fuelAdded") || ""
  );
  const [endFuel, setEndFuel] = useState(
    () => localStorage.getItem("endFuel") || ""
  );
  const [consumption, setConsumption] = useState(null);

  // Збереження даних в localStorage
  useEffect(() => {
    localStorage.setItem("startOdo", startOdo);
    localStorage.setItem("startFuel", startFuel);
    localStorage.setItem("fuelAdded", fuelAdded);
    localStorage.setItem("endOdo", endOdo);
    localStorage.setItem("endFuel", endFuel);
  }, [startOdo, startFuel, fuelAdded, endOdo, endFuel]);

  // Розрахунок витрат
  useEffect(() => {
    if (
      startOdo !== "" &&
      startFuel !== "" &&
      endOdo !== "" &&
      fuelAdded !== "" &&
      endFuel !== ""
    ) {
      const distance = parseFloat(endOdo) - parseFloat(startOdo);
      const fuelUsed =
        parseFloat(startFuel) + parseFloat(fuelAdded) - parseFloat(endFuel);

      if (distance > 0 && fuelUsed >= 0) {
        setConsumption(((fuelUsed / distance) * 100).toFixed(2));
      } else {
        setConsumption(null);
      }
    } else {
      setConsumption(null);
    }
  }, [startOdo, startFuel, endOdo, fuelAdded, endFuel]);

  return (
    <div className="container">
      <div className="header">
        <h1>{t("mileage.title")}</h1>
        <p className="description">{t("mileage.description")}</p>
      </div>

      <div className={styles.inputs}>
        <NumberInput
          label={t("mileage.startOdo")}
          value={startOdo}
          setValue={setStartOdo}
        />
        <NumberInput
          label={t("mileage.startFuel")}
          value={startFuel}
          setValue={setStartFuel}
        />
        <NumberInput
          label={t("mileage.fuelAdded")}
          value={fuelAdded}
          setValue={setFuelAdded}
        />

        <hr className={styles.decimal_line} />

        <NumberInput
          label={t("mileage.endOdo")}
          value={endOdo}
          setValue={setEndOdo}
        />

        <NumberInput
          label={t("mileage.endFuel")}
          value={endFuel}
          setValue={setEndFuel}
        />
      </div>

      <div className={styles.result}>
        {consumption !== null
          ? t("mileage.result", { value: consumption })
          : t("mileage.enterData")}
      </div>

      <div className={styles.formula}>
        <h3>{t("mileage.formulaTitle")}</h3>
        <div className={styles["formula-fraction"]}>
          <div className={styles.numerator}>
            {t("mileage.formulaNumerator")}
          </div>
          <div className={styles.denominator}>
            {t("mileage.formulaDenominator")}
          </div>
          <div className={styles.multiply}>{t("mileage.formulaMultiply")}</div>
        </div>
      </div>
    </div>
  );
};

export default Mileage_calculator;
