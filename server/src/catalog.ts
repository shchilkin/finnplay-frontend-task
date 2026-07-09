import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { catalogDataSchema, type CatalogData } from "@finnplay-test-task/shared";

const dataPath = fileURLToPath(new URL("../../data.json", import.meta.url));

export function loadCatalogData(): CatalogData {
  const rawData = readFileSync(dataPath, "utf8");
  let parsedData: unknown;

  try {
    parsedData = JSON.parse(rawData);
  } catch (error) {
    throw new Error(`Failed to parse catalog data from ${dataPath}`, { cause: error });
  }

  const result = catalogDataSchema.safeParse(parsedData);

  if (!result.success) {
    throw new Error(`Catalog data does not match the expected schema at ${dataPath}`, {
      cause: result.error,
    });
  }

  return result.data;
}
