import type { CatalogData, Game, GameGroup } from "@finnplay-test-task/shared";

export const catalogSortingOptions = ["az", "za", "newest"] as const;
export const catalogColumnOptions = [2, 3, 4] as const;

export type CatalogSorting = (typeof catalogSortingOptions)[number];
export type CatalogColumns = (typeof catalogColumnOptions)[number];

export type CatalogFilters = {
  groupIds: number[];
  providerIds: number[];
  search: string;
  sorting: CatalogSorting;
};

export const defaultCatalogFilters: CatalogFilters = {
  groupIds: [],
  providerIds: [],
  search: "",
  sorting: "az",
};

export const defaultCatalogColumns: CatalogColumns = 4;

export function getGroupedGameIds(groups: GameGroup[]) {
  return new Set(groups.flatMap((group) => group.games));
}

export function filterCatalogGames(catalog: CatalogData, filters: CatalogFilters) {
  const groupedGameIds = getGroupedGameIds(catalog.groups);
  const selectedGroupGameIds = getSelectedGroupGameIds(catalog.groups, filters.groupIds);
  const normalizedSearch = filters.search.trim().toLowerCase();

  return catalog.games.filter((game) => {
    if (!groupedGameIds.has(game.id)) {
      return false;
    }

    if (normalizedSearch && !game.name.toLowerCase().includes(normalizedSearch)) {
      return false;
    }

    if (filters.providerIds.length > 0 && !filters.providerIds.includes(game.provider)) {
      return false;
    }

    if (selectedGroupGameIds && !selectedGroupGameIds.has(game.id)) {
      return false;
    }

    return true;
  });
}

export function sortCatalogGames(games: Game[], sorting: CatalogSorting) {
  return [...games].sort((leftGame, rightGame) => {
    if (sorting === "newest") {
      return new Date(rightGame.date).getTime() - new Date(leftGame.date).getTime();
    }

    return sorting === "az"
      ? leftGame.name.localeCompare(rightGame.name)
      : rightGame.name.localeCompare(leftGame.name);
  });
}

export function getVisibleCatalogGames(catalog: CatalogData, filters: CatalogFilters) {
  return sortCatalogGames(filterCatalogGames(catalog, filters), filters.sorting);
}

export function toggleFilterValue(values: number[], value: number) {
  return values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value];
}

function getSelectedGroupGameIds(groups: GameGroup[], groupIds: number[]) {
  if (groupIds.length === 0) {
    return null;
  }

  return new Set(
    groups.filter((group) => groupIds.includes(group.id)).flatMap((group) => group.games),
  );
}
