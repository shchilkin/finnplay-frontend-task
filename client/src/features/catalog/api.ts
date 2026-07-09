import { catalogResponseSchema } from "@finnplay-test-task/shared";
import type { CatalogResponse } from "@finnplay-test-task/shared";

import { requestJson } from "../../shared/api/http";

export async function getCatalog(): Promise<CatalogResponse> {
  const response = await requestJson<unknown>("/api/catalog");

  return catalogResponseSchema.parse(response);
}
