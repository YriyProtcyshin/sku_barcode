import { useState, useEffect } from "react";

// Хук повертає коди статусів (ключі i18n), а не рядки —
// так компонент сам перекладає через t(loadingStatus)
export function useSkuData() {
  const [skuList, setSkuList] = useState(() => {
    try {
      const saved = localStorage.getItem("sku_data");
      return saved ? JSON.parse(saved) : {};
    } catch {
      localStorage.removeItem("sku_data");
      localStorage.removeItem("sku_etag");
      localStorage.removeItem("sku_lastModified");
      return {};
    }
  });

  const [loadingStatus, setLoadingStatus] = useState(() => {
    const saved = localStorage.getItem("sku_data");
    return saved ? "common.ready" : "common.loading";
  });

  const [lastModified, setLastModified] = useState(() => {
    return localStorage.getItem("sku_lastModified") || "";
  });

  useEffect(() => {
    async function loadSkuData() {
      try {
        setLoadingStatus("common.checking");

        const headRes = await fetch("/sku.json", { method: "HEAD" });
        const etag = headRes.headers.get("etag");
        const modified = headRes.headers.get("last-modified");

        const prevEtag = localStorage.getItem("sku_etag");
        const prevModified = localStorage.getItem("sku_lastModified");
        const savedData = localStorage.getItem("sku_data");

        const modifiedTimestamp = modified ? new Date(modified).getTime() : 0;
        const prevModifiedTimestamp = prevModified
          ? new Date(prevModified).getTime()
          : 0;

        if (
          etag !== prevEtag ||
          modifiedTimestamp !== prevModifiedTimestamp ||
          !savedData
        ) {
          setLoadingStatus("common.updating");

          const jsonRes = await fetch("/sku.json", { cache: "reload" });
          const data = await jsonRes.json();

          setSkuList(data);
          setLastModified(modified);

          localStorage.setItem("sku_data", JSON.stringify(data));
          localStorage.setItem("sku_etag", etag);
          localStorage.setItem("sku_lastModified", modified);

          setLoadingStatus("common.ready");
        } else {
          try {
            setSkuList(JSON.parse(savedData));
          } catch {
            localStorage.removeItem("sku_data");
          }
          setLastModified(prevModified);
          setLoadingStatus("common.readyCache");
        }
      } catch (err) {
        console.error("Помилка завантаження sku.json:", err);

        const savedData = localStorage.getItem("sku_data");
        const savedModified = localStorage.getItem("sku_lastModified") || "";
        if (savedData) {
          try {
            setSkuList(JSON.parse(savedData));
          } catch {
            localStorage.removeItem("sku_data");
          }
          setLastModified(savedModified);
          setLoadingStatus("common.offline");
        } else {
          setLoadingStatus("common.error");
        }
      }
    }

    loadSkuData();
  }, []);

  return { skuList, loadingStatus, lastModified };
}
