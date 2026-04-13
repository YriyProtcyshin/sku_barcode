import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Home from "./pages/Home";
import Mileage_calculator from "./pages/Mileage_calculator";
import CigaretteConverter from "./pages/CigaretteConverter";
import RecommendedOrderCalculator from "./pages/RecommendedOrderCalculator";
import CigaretteSalesCalculator from "./pages/Sales_Value";
import LanguageSwitcher from "./Components/LanguageSwitcher/LanguageSwitcher";

import { ImBarcode } from "react-icons/im";
import { LuFuel } from "react-icons/lu";
import { FaExchangeAlt, FaChartBar } from "react-icons/fa";
import { LuPackageCheck } from "react-icons/lu";

import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("body-lock");
    } else {
      document.body.classList.remove("body-lock");
    }
  }, [isOpen]);

  return (
    <Router>
      <div className="app-container">
        {/* Кнопка гамбургер */}
        <button
          className="menu-button"
          onClick={() => setIsOpen(true)}
          aria-label={t("nav.openMenu")}
          aria-expanded={isOpen}
        >
          ☰
        </button>

        {/* Затемнення фону при відкритому меню */}
        {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

        {/* Виїжджаюче меню */}
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <button
            className="close-btn"
            onClick={() => setIsOpen(false)}
            aria-label={t("nav.closeMenu")}
          >
            ✖
          </button>
          <nav>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <ImBarcode className="icon" />
              <span>{t("nav.barcodes")}</span>
            </Link>

            <Link to="/Mileage_calculator" onClick={() => setIsOpen(false)}>
              <LuFuel className="icon" />
              <span>{t("nav.fuel")}</span>
            </Link>

            <Link to="/CigaretteConverter" onClick={() => setIsOpen(false)}>
              <FaExchangeAlt className="icon" />
              <span>{t("nav.converter")}</span>
            </Link>

            <Link
              to="/RecommendedOrderCalculator"
              onClick={() => setIsOpen(false)}
            >
              <LuPackageCheck className="icon" />
              <span>{t("nav.order")}</span>
            </Link>

            <Link
              to="/CigaretteSalesCalculator"
              onClick={() => setIsOpen(false)}
            >
              <FaChartBar className="icon" />
              <span>{t("nav.sales")}</span>
            </Link>
          </nav>

          <LanguageSwitcher />
        </div>

        {/* Основний контент */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/Mileage_calculator"
              element={<Mileage_calculator />}
            />
            <Route
              path="/CigaretteConverter"
              element={<CigaretteConverter />}
            />
            <Route
              path="/RecommendedOrderCalculator"
              element={<RecommendedOrderCalculator />}
            />
            <Route
              path="/CigaretteSalesCalculator"
              element={<CigaretteSalesCalculator />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
