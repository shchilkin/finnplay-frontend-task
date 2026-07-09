import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { catalogDataSchema, type CatalogData } from "@finnplay-test-task/shared";

const dataPath = fileURLToPath(new URL("../../data.json", import.meta.url));

export function parseCatalogData(rawData: string, source = "catalog data"): CatalogData {
  let parsedData: unknown;

  try {
    parsedData = JSON.parse(rawData);
  } catch (error) {
    throw new Error(`Failed to parse catalog data from ${source}`, { cause: error });
  }

  const result = catalogDataSchema.safeParse(parsedData);

  if (!result.success) {
    throw new Error(`Catalog data does not match the expected schema at ${source}`, {
      cause: result.error,
    });
  }

  return result.data;
}

export function loadCatalogData(): CatalogData {
  return parseCatalogData(readFileSync(dataPath, "utf8"), dataPath);
}
