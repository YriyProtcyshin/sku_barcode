import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/", // важный параметр для корректного поиска бандлов
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Barcode App",
        short_name: "Barcode",
        start_url: "/",
        display: "standalone",
        background_color: "#989393",
        theme_color: "#000000",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"], // 🔑 кешируем все нужные файлы
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*/, // внешние запросы (можно убрать, если все оффлайн)
            handler: "NetworkFirst",
          },
        ],
      },
    }),
  ],
});
