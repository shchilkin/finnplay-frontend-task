import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { parseCatalogData } from "./catalog.js";

const dataPath = fileURLToPath(new URL("../../data.json", import.meta.url));

describe("catalog data parsing", () => {
  it("parses valid catalog JSON", () => {
    const catalogData = parseCatalogData(readFileSync(dataPath, "utf8"), dataPath);

    expect(catalogData.games.length).toBeGreaterThan(0);
    expect(catalogData.providers.length).toBeGreaterThan(0);
    expect(catalogData.groups.length).toBeGreaterThan(0);
  });

  it("throws a readable error for invalid JSON", () => {
    expect(() => parseCatalogData("{", "test catalog")).toThrow(
      "Failed to parse catalog data from test catalog",
    );
  });

  it("throws a readable error for data that does not match the catalog schema", () => {
    expect(() => parseCatalogData(JSON.stringify({ games: [] }), "test catalog")).toThrow(
      "Catalog data does not match the expected schema at test catalog",
    );
  });
});
