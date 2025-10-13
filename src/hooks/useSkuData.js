import { useState, useEffect } from "react";

export function useSkuData() {
  const [skuList, setSkuList] = useState(() => {
    const saved = localStorage.getItem("sku_data");
    return saved ? JSON.parse(saved) : {};
  });

  const [loadingStatus, setLoadingStatus] = useState(() => {
    const saved = localStorage.getItem("sku_data");
    return saved ? "✅ Данные актуальны" : "Загрузка данных...";
  });

  const [lastModified, setLastModified] = useState(() => {
    return localStorage.getItem("sku_lastModified") || "";
  });

  useEffect(() => {
    async function loadSkuData() {
      try {
        setLoadingStatus("Проверка обновлений...");

        // HEAD-запрос для проверки изменений
        const headRes = await fetch("/sku.json", { method: "HEAD" });
        const etag = headRes.headers.get("etag");
        const modified = headRes.headers.get("last-modified");

        const prevEtag = localStorage.getItem("sku_etag");
        const prevModified = localStorage.getItem("sku_lastModified");
        const savedData = localStorage.getItem("sku_data");

        // преобразуем даты в timestamp для корректного сравнения
        const modifiedTimestamp = modified ? new Date(modified).getTime() : 0;
        const prevModifiedTimestamp = prevModified
          ? new Date(prevModified).getTime()
          : 0;

        // если ETag или Last-Modified изменились, либо нет данных — обновляем
        if (
          etag !== prevEtag ||
          modifiedTimestamp !== prevModifiedTimestamp ||
          !savedData
        ) {
          setLoadingStatus("🔄 Обновление данных...");
          const jsonRes = await fetch("/sku.json");
          const data = await jsonRes.json();

          setSkuList(data);
          setLastModified(modified);

          // сохраняем локально
          localStorage.setItem("sku_data", JSON.stringify(data));
          localStorage.setItem("sku_etag", etag);
          localStorage.setItem("sku_lastModified", modified);

          setLoadingStatus("✅ Данные актуальны");
        } else {
          setSkuList(JSON.parse(savedData));
          setLastModified(prevModified);
          setLoadingStatus("✅ Данные актуальны (из localStorage)");
        }
      } catch (err) {
        console.error("Ошибка загрузки sku.json:", err);

        const savedData = localStorage.getItem("sku_data");
        const savedModified = localStorage.getItem("sku_lastModified") || "";
        if (savedData) {
          setSkuList(JSON.parse(savedData));
          setLastModified(savedModified);
          setLoadingStatus("⚠️ Используются локальные данные (оффлайн)");
        } else {
          setLoadingStatus("❌ Ошибка загрузки данных");
        }
      }
    }

    loadSkuData();
  }, []);

  return { skuList, loadingStatus, lastModified };
}
