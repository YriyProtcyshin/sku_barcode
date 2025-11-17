import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
// import { useState } from "react";
import Home from "./pages/Home";
import Mileage_calculator from "./pages/Mileage_calculator";
import CigaretteConverter from "./pages/CigaretteConverter";
import RecommendedOrderCalculator from "./pages/RecommendedOrderCalculator";
import CigaretteSalesCalculator from "./pages/Sales_Value";
import { ImBarcode } from "react-icons/im";
import { LuFuel} from "react-icons/lu";
import { FaExchangeAlt, FaChartBar } from "react-icons/fa";
import { LuPackageCheck } from "react-icons/lu";
import "./App.css"; // добавим стили внизу

function App() {
  const [isOpen, setIsOpen] = useState(false);

  // При открытии sidebar добавляю новый класс и отключаю скролл экрана
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
        <button className="menu-button" onClick={() => setIsOpen(true)}>
          ☰
        </button>

        {/* Затемнение фона при открытом меню */}
        {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

        {/* Выезжающее меню */}
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✖
          </button>
          <nav>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <ImBarcode className="icon" />
              <span>Штрих-коди</span>
            </Link>

            <Link to="/Mileage_calculator" onClick={() => setIsOpen(false)}>
              <LuFuel className="icon" />
              <span>Паливо</span>
            </Link>

            <Link to="/CigaretteConverter" onClick={() => setIsOpen(false)}>
              <FaExchangeAlt className="icon" />
              <span>Sticks Converter</span>
            </Link>

            <Link
              to="/RecommendedOrderCalculator"
              onClick={() => setIsOpen(false)}
            >
              <LuPackageCheck className="icon" />
              <span>Рекомендований заказ </span>
            </Link>
            <Link
              to="/CigaretteSalesCalculator"
              onClick={() => setIsOpen(false)}
            >
              <FaChartBar className="icon" />
              <span>Річний об'ем</span>
            </Link>
          </nav>
        </div>

        {/* Основное содержимое */}
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
//comment

export default App;
