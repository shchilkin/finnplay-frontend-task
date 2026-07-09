import { describe, expect, it } from "vitest";
import type { CatalogData } from "@finnplay-test-task/shared";

import {
  defaultCatalogFilters,
  filterCatalogGames,
  getVisibleCatalogGames,
  sortCatalogGames,
  toggleFilterValue,
} from "./model";

const catalog: CatalogData = {
  games: [
    {
      id: 1,
      cover: "https://example.com/alpha.jpg",
      coverLarge: "https://example.com/alpha@2x.jpg",
      date: "2024-01-01T00:00:00.000Z",
      name: "Alpha Slot",
      provider: 10,
    },
    {
      id: 2,
      cover: "https://example.com/bravo.jpg",
      coverLarge: "https://example.com/bravo@2x.jpg",
      date: "2025-01-01T00:00:00.000Z",
      name: "Bravo Live",
      provider: 20,
    },
    {
      id: 3,
      cover: "https://example.com/orphan.jpg",
      coverLarge: "https://example.com/orphan@2x.jpg",
      date: "2026-01-01T00:00:00.000Z",
      name: "Orphan Game",
      provider: 10,
    },
    {
      id: 4,
      cover: "https://example.com/charlie.jpg",
      coverLarge: "https://example.com/charlie@2x.jpg",
      date: "2023-01-01T00:00:00.000Z",
      name: "Charlie Jackpot",
      provider: 10,
    },
  ],
  groups: [
    { id: 100, games: [1], name: "Slots" },
    { id: 200, games: [2], name: "Live" },
    { id: 300, games: [4], name: "Jackpot" },
  ],
  providers: [
    { id: 10, logo: "provider-a.png", name: "Provider A" },
    { id: 20, logo: "provider-b.png", name: "Provider B" },
  ],
};

describe("catalog model", () => {
  it("excludes games that do not belong to any group", () => {
    expect(filterCatalogGames(catalog, defaultCatalogFilters).map((game) => game.id)).toEqual([
      1, 2, 4,
    ]);
  });

  it("filters games by search, provider, and selected groups", () => {
    expect(
      filterCatalogGames(catalog, {
        groupIds: [100],
        providerIds: [10],
        search: "alpha",
        sorting: "az",
      }).map((game) => game.id),
    ).toEqual([1]);
  });

  it("uses OR semantics for multiple selected groups", () => {
    expect(
      filterCatalogGames(catalog, {
        groupIds: [100, 300],
        providerIds: [],
        search: "",
        sorting: "az",
      }).map((game) => game.id),
    ).toEqual([1, 4]);
  });

  it("sorts games by name and newest date", () => {
    const games = filterCatalogGames(catalog, defaultCatalogFilters);

    expect(sortCatalogGames(games, "az").map((game) => game.name)).toEqual([
      "Alpha Slot",
      "Bravo Live",
      "Charlie Jackpot",
    ]);
    expect(sortCatalogGames(games, "za").map((game) => game.name)).toEqual([
      "Charlie Jackpot",
      "Bravo Live",
      "Alpha Slot",
    ]);
    expect(sortCatalogGames(games, "newest").map((game) => game.id)).toEqual([2, 1, 4]);
  });

  it("returns filtered and sorted visible games", () => {
    expect(
      getVisibleCatalogGames(catalog, {
        groupIds: [],
        providerIds: [],
        search: "",
        sorting: "newest",
      }).map((game) => game.id),
    ).toEqual([2, 1, 4]);
  });

  it("toggles numeric filter values", () => {
    expect(toggleFilterValue([1, 2], 3)).toEqual([1, 2, 3]);
    expect(toggleFilterValue([1, 2], 2)).toEqual([1]);
  });
});
