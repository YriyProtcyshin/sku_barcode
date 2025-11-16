import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Mileage_calculator from "./pages/Mileage_calculator";
import CigaretteConverter from "./pages/CigaretteConverter";
import RecommendedOrderCalculator from "./pages/RecommendedOrderCalculator";
import "./App.css"; // добавим стили внизу


function App() {
  const [isOpen, setIsOpen] = useState(false);

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
              ⫼⫼ Check SKU
            </Link>
            <Link to="/Mileage_calculator" onClick={() => setIsOpen(false)}>
              ⛽ Mileage calculator
            </Link>
            <Link to="/CigaretteConverter" onClick={() => setIsOpen(false)}>
              🔃 Sticks Converter
            </Link>
            <Link
              to="/RecommendedOrderCalculator"
              onClick={() => setIsOpen(false)}
            >
              📦 Recommended Order Calculator
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}
//comment

export default App;
