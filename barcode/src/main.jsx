import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// 👇 импорт регистрации SW
import { registerSW } from "virtual:pwa-register";

// 👇 вызываем сразу при запуске
registerSW({
  immediate: true, // автообновление без диалога
  onNeedRefresh() {
    // если хочешь уведомление пользователю:
    // if (confirm("Доступна новая версия, обновить?")) {
    //   updateSW(true)
    // }
  },
  onOfflineReady() {
    console.log("Приложение готово для офлайна 🚀");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
