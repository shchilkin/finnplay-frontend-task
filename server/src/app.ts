import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

import { createAuthRouter } from "./auth/authRoutes.js";
import { loadCatalogData } from "./catalog.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const clientDistPath = join(currentDir, "../../client/dist");
const clientIndexPath = join(clientDistPath, "index.html");

export function createApp() {
  const app = express();
  const catalogData = loadCatalogData();
  const isProduction = process.env.NODE_ENV === "production";
  const catalogDelayMs = isProduction ? 0 : getCatalogDelayMs(process.env.CATALOG_DELAY_MS);
  const shouldFailCatalog = !isProduction && process.env.CATALOG_ERROR === "1";

  if (isProduction) {
    app.set("trust proxy", 1);
  }

  app.use(express.json());
  app.use("/api/auth", createAuthRouter());

  app.get("/api/catalog", async (_request, response) => {
    await delay(catalogDelayMs);

    if (shouldFailCatalog) {
      response.status(500).json({ message: "Catalog API failure is enabled." });
      return;
    }

    response.json(catalogData);
  });

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  if (isProduction && existsSync(clientIndexPath)) {
    app.use(express.static(clientDistPath));

    app.get(/^\/(?!api\/).*/, (_request, response) => {
      response.sendFile(clientIndexPath);
    });

    return app;
  }

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

  return app;
}

function getCatalogDelayMs(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const delayMs = Number(value);

  return Number.isFinite(delayMs) && delayMs > 0 ? delayMs : 0;
}

function delay(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
