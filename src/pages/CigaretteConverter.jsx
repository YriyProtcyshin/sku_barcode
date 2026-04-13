import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./cigarette_converter.module.css";

export default function CigaretteConverter() {
  const { t } = useTranslation();
  const [thousands, setThousands] = useState("");
  const [packs, setPacks] = useState("");
  const [blocks, setBlocks] = useState("");
  const [boxes, setBoxes] = useState("");

  const parseNumber = (value) => {
    if (!value) return NaN;
    return parseFloat(value.replace(",", "."));
  };

  const handleThousandsChange = (e) => {
    const raw = e.target.value;
    setThousands(raw);
    const t_ = parseNumber(raw);
    if (isNaN(t_)) return;
    const sticks = t_ * 1000;
    const p = Math.round(sticks / 20);
    const b = Math.round(p / 10);
    const x = b / 50;
    setPacks(String(p));
    setBlocks(String(b));
    setBoxes(x.toFixed(4));
  };

  const handlePacksChange = (e) => {
    const raw = e.target.value;
    setPacks(raw);
    const p = parseInt(raw);
    if (isNaN(p)) return;
    const sticks = p * 20;
    const t_ = sticks / 1000;
    const b = Math.round(p / 10);
    const x = b / 50;
    setThousands(t_.toFixed(3));
    setBlocks(String(b));
    setBoxes(x.toFixed(4));
  };

  const handleBlocksChange = (e) => {
    const raw = e.target.value;
    setBlocks(raw);
    const b = parseInt(raw);
    if (isNaN(b)) return;
    const p = b * 10;
    const sticks = p * 20;
    const t_ = sticks / 1000;
    const x = b / 50;
    setPacks(String(p));
    setThousands(t_.toFixed(3));
    setBoxes(x.toFixed(4));
  };

  const handleBoxesChange = (e) => {
    const raw = e.target.value;
    setBoxes(raw);
    const x = parseNumber(raw);
    if (isNaN(x)) return;
    const b = Math.round(x * 50);
    const p = b * 10;
    const sticks = p * 20;
    const t_ = sticks / 1000;
    setBlocks(String(b));
    setPacks(String(p));
    setThousands(t_.toFixed(3));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>{t("converter.title")}</h1>
        <p className="description">{t("converter.description")}</p>
      </div>

      <div className={`${styles.field} ${styles.first}`}>
        <label>{t("converter.thousands")}</label>
        <input
          type="number"
          value={thousands}
          onChange={handleThousandsChange}
          placeholder={t("converter.thousandsPlaceholder")}
        />
      </div>

      <div className={styles.field}>
        <label>{t("converter.packs")}</label>
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          step="1"
          value={packs}
          onChange={handlePacksChange}
        />
      </div>

      <div className={styles.field}>
        <label>{t("converter.blocks")}</label>
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          step="1"
          value={blocks}
          onChange={handleBlocksChange}
        />
      </div>

      <div className={styles.field}>
        <label>{t("converter.box")}</label>
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
