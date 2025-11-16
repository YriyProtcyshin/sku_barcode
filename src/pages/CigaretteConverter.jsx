import { useState } from "react";
import styles from "./cigarette_converter.module.css";

export default function CigaretteConverter() {
  const [thousands, setThousands] = useState("");
  const [packs, setPacks] = useState("");
  const [blocks, setBlocks] = useState("");
  const [boxes, setBoxes] = useState(""); // 50 блоков

  const parseNumber = (value) => {
    if (!value) return NaN;
    return parseFloat(value.replace(",", "."));
  };

  // ======== HANDLERS ========

  // Тысячи сигарет
  const handleThousandsChange = (e) => {
    const raw = e.target.value;
    setThousands(raw);

    const t = parseNumber(raw);
    if (isNaN(t)) return;

    const sticks = t * 1000;
    const p = Math.round(sticks / 20); // пачки — целое
    const b = Math.round(p / 10);      // блоки — целое
    const x = b / 50;

    setPacks(String(p));
    setBlocks(String(b));
    setBoxes(x.toFixed(4));
  };

  // Пачки (целое)
  const handlePacksChange = (e) => {
    const raw = e.target.value;
    setPacks(raw);

    const p = parseInt(raw);
    if (isNaN(p)) return;

    const sticks = p * 20;
    const t = sticks / 1000;
    const b = Math.round(p / 10);
    const x = b / 50;

    setThousands(t.toFixed(3));
    setBlocks(String(b));
    setBoxes(x.toFixed(4));
  };

  // Блоки (целое)
  const handleBlocksChange = (e) => {
    const raw = e.target.value;
    setBlocks(raw);

    const b = parseInt(raw);
    if (isNaN(b)) return;

    const p = b * 10;    // всегда целое
    const sticks = p * 20;
    const t = sticks / 1000;
    const x = b / 50;

    setPacks(String(p));
    setThousands(t.toFixed(3));
    setBoxes(x.toFixed(4));
  };

  // Короба (может быть дробь)
  const handleBoxesChange = (e) => {
    const raw = e.target.value;
    setBoxes(raw);

    const x = parseNumber(raw);
    if (isNaN(x)) return;

    const b = Math.round(x * 50); // блоки — целое
    const p = b * 10;             // пачки — целое
    const sticks = p * 20;
    const t = sticks / 1000;

    setBlocks(String(b));
    setPacks(String(p));
    setThousands(t.toFixed(3));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Конвертер </h1>
        <p className="description">
          Конвертер тис. стиків в пачки, блокі і т.д.
        </p>
      </div>

      <div className={`${styles.field} ${styles.first}`}>
        <label>Тисяча штук:</label>
        <input
          type="text"
          value={thousands}
          onChange={handleThousandsChange}
          placeholder="наприклад: 1.2 чи 1,2"
        />
      </div>

      <div className={styles.field}>
        <label>Пачки (20 шт):</label>
        <input
          type="number"
          step="1"
          value={packs}
          onChange={handlePacksChange}
        />
      </div>

      <div className={styles.field}>
        <label>Блоки (10 пачок):</label>
        <input
          type="number"
          step="1"
          value={blocks}
          onChange={handleBlocksChange}
        />
      </div>

      <div className={styles.field}>
        <label>Короб (50 блоків):</label>
        <input
          type="number"
          step="0.01"
          value={boxes}
          onChange={handleBoxesChange}
        />
      </div>
    </div>
  );
}

