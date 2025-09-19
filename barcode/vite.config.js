import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/", // важно для корректного поиска бандлов
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // автообновление SW
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Barcode App",
        short_name: "Barcode",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"], // кешируем все важные файлы
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/, // картинки внешние
            handler: "CacheFirst",
          },
          // Если есть API-запросы, можно добавить:
          // {
          //   urlPattern: /^https:\/\/api\.example\.com\/.*$/,
          //   handler: "NetworkFirst",
          // },
        ],
      },
    }),
  ],
});
