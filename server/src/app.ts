import express from "express";

import { loadCatalogData } from "./catalog.js";

export function createApp() {
  const app = express();
  const catalogData = loadCatalogData();

  app.get("/api/catalog", (_request, response) => {
    response.json(catalogData);
  });

  app.get("/", (_request, response) => {
    response.json({
      name: "Finnplay Test Task API",
      endpoints: {
        catalog: "/api/catalog",
      },
    });
  });

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  return app;
}
