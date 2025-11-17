import React, { useState, useEffect } from "react";
import styles from "./mileage_calculator.module.css";

// Компонент для числового поля с кнопками + и -
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
          inputMode="numeric" // подсказывает браузеру открыть цифровую клавиатуру
          pattern="[0-9]*"
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
  // === ИНИЦИАЛИЗАЦИЯ ПОЛЕЙ ИЗ localStorage (важно!) ===
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

  // === СОХРАНЕНИЕ ДАННЫХ В localStorage ===
  useEffect(() => localStorage.setItem("startOdo", startOdo), [startOdo]);
  useEffect(() => localStorage.setItem("startFuel", startFuel), [startFuel]);
  useEffect(() => localStorage.setItem("endOdo", endOdo), [endOdo]);
  useEffect(() => localStorage.setItem("fuelAdded", fuelAdded), [fuelAdded]);
  useEffect(() => localStorage.setItem("endFuel", endFuel), [endFuel]);

  // === РАСЧЁТ ВИТРАТ ===
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
        <h1>Паливний звіт</h1>
        <p className="description">Калькулятор витрат палива</p>
      </div>

      <div className={styles.inputs}>
        <NumberInput
          label="Показники одометра на початку:"
          value={startOdo}
          setValue={setStartOdo}
        />
        <NumberInput
          label="Залишок пального на початку:"
          value={startFuel}
          setValue={setStartFuel}
        />
        <NumberInput
          label="Заправлено в поточному місяці:"
          value={fuelAdded}
          setValue={setFuelAdded}
        />

        <hr className={styles.decimal_line} />

        <NumberInput
          label="Показники одометра в кінці:"
          value={endOdo}
          setValue={setEndOdo}
        />

        <NumberInput
          label="Залишок у баку в кінці:"
          value={endFuel}
          setValue={setEndFuel}
        />
      </div>

      <div className={styles.result}>
        {consumption !== null
          ? `Витрата пального: ${consumption} л/100 км`
          : "Введіть усі дані для розрахунку"}
      </div>

      <div className={styles.formula}>
        <h3>Формула витрати пального ⛽:</h3>
        <div className={styles["formula-fraction"]}>
          <div className={styles.numerator}>
            Залишок на початку + Заправлено − Залишок у кінці
          </div>
          <div className={styles.denominator}>Пробіг (Початок − Кінець)</div>
          <div className={styles.multiply}>× 100</div>
        </div>
      </div>
    </div>
  );
};

export default Mileage_calculator;
