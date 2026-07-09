import express from "express";

import { createAuthRouter } from "./auth/authRoutes.js";
import { loadCatalogData } from "./catalog.js";

export function createApp() {
  const app = express();
  const catalogData = loadCatalogData();

  app.use(express.json());
  app.use("/api/auth", createAuthRouter());

  app.get("/api/catalog", (_request, response) => {
    response.json(catalogData);
  });

  app.get("/", (_request, response) => {
    response.json({
      name: "Finnplay Test Task API",
      endpoints: {
        auth: "/api/auth/me",
        catalog: "/api/catalog",
        health: "/health",
      },
    });
  });

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  return app;
}
