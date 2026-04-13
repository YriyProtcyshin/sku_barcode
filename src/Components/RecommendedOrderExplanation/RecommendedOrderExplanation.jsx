import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./recommendedOrderCalculator.module.css";

const RecommendedOrderExplanation = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.algorithmContainer}>
      <h2>{t("order.algorithmTitle")}</h2>

      <ul className={styles.algorithmList}>
        <li>
          <strong>{t("order.step1Title")}</strong>
          <p>
            {t("order.step1").split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </li>

        <li>
          <strong>{t("order.step2Title")}</strong>
          <p>
            {t("order.step2a").split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <p>
            <em>{t("order.step2formula")}</em>
            <br />
            {t("order.step2formulaText")}
          </p>
        </li>

        <li>
          <strong>{t("order.step3Title")}</strong>
          <p>
            {t("order.step3a").split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <p>
            <em>{t("order.step3formula")}</em>
            <br />
            {t("order.step3formulaText")}
          </p>
          <p className={styles.oosNote}>
            {t("order.step3oos").split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </li>

        <li>
          <strong>{t("order.step4Title")}</strong>
          <p>{t("order.step4a")}</p>
          <p>
            {t("order.step4b").split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </li>

        <li>
          <strong>{t("order.step5Title")}</strong>
          <p>
            {t("order.step5a").split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <p>
            {t("order.step5b")}
          </p>
        </li>
      </ul>

      <h3>{t("order.exampleTitle")}</h3>
      <p>{t("order.example1")}</p>
      <p>{t("order.example2")}</p>
      <p>{t("order.example3")}</p>

      <ul className={styles.exampleSteps}>
        <li>{t("order.exStep1")}</li>
        <li>{t("order.exStep2")}</li>
        <li>{t("order.exStep3")}</li>
        <li>{t("order.exStep4")}</li>
        <li>{t("order.exStep5")}</li>
      </ul>

      <p className={styles.result}>
        {t("order.exResult")}
      </p>
    </div>
  );
};

export default RecommendedOrderExplanation;
