import { useState } from "react";
import type { Username } from "@finnplay-test-task/shared";

import { CatalogEmptyState } from "../../catalog/components/CatalogEmptyState";
import { CatalogFiltersPanel } from "../../catalog/components/CatalogFiltersPanel";
import { GameGrid } from "../../catalog/components/GameGrid";
import { GameGridSkeleton } from "../../catalog/components/GameGridSkeleton";
import {
  defaultCatalogColumns,
  defaultCatalogFilters,
  getVisibleCatalogGames,
  type CatalogColumns,
  type CatalogFilters,
} from "../../catalog/model";
import { useCatalog } from "../../catalog/useCatalog";
import { PlayerNavbar } from "./PlayerNavbar";

type PlayerPageProps = {
  error: string | null;
  isLogoutPending: boolean;
  onLogout: () => void;
  username: Username;
};

export function PlayerPage({ error, isLogoutPending, onLogout, username }: PlayerPageProps) {
  const catalogState = useCatalog();
  const [filters, setFilters] = useState<CatalogFilters>(defaultCatalogFilters);
  const [columns, setColumns] = useState<CatalogColumns>(defaultCatalogColumns);
  const [areFiltersExpanded, setAreFiltersExpanded] = useState(false);

  const visibleGames =
    catalogState.status === "loaded" ? getVisibleCatalogGames(catalogState.catalog, filters) : [];
  const hasActiveCatalogFilters =
    filters.search.trim().length > 0 ||
    filters.providerIds.length > 0 ||
    filters.groupIds.length > 0;

  function resetFilters() {
    setFilters(defaultCatalogFilters);
    setColumns(defaultCatalogColumns);
  }

  return (
    <main className="player-page">
      <div className="player-shell">
        <PlayerNavbar username={username} onLogout={onLogout} isLogoutPending={isLogoutPending} />
        <section className="player-content" aria-labelledby="game-catalog-title">
          <h1 className="visually-hidden" id="game-catalog-title">
            Game catalog
          </h1>

          {error ? (
            <p className="player-error" role="alert">
              {error}
            </p>
          ) : null}

          {catalogState.status === "loading" ? (
            <>
              <output className="visually-hidden" aria-live="polite">
                Loading games
              </output>
              <div className="catalog-layout">
                <GameGridSkeleton columns={columns} />
                <div
                  className="catalog-filter-panel catalog-filter-panel-skeleton"
                  aria-hidden="true"
                >
                  <div className="catalog-skeleton-line catalog-skeleton-line--search" />
                  <div className="catalog-skeleton-line" />
                  <div className="catalog-skeleton-line" />
                  <div className="catalog-skeleton-line catalog-skeleton-line--short" />
                </div>
              </div>
            </>
          ) : null}

          {catalogState.status === "error" ? (
            <div className="catalog-state catalog-state--page" role="alert">
              <p className="catalog-state-title">{catalogState.error}</p>
              <button className="catalog-state-action" type="button" onClick={catalogState.reload}>
                Try again
              </button>
            </div>
          ) : null}

          {catalogState.status === "loaded" ? (
            <div className="catalog-layout">
              <GameGrid
                games={visibleGames}
                columns={columns}
                emptyState={
                  hasActiveCatalogFilters ? (
                    <CatalogEmptyState title="No games match the selected filters." />
                  ) : (
                    <CatalogEmptyState title="No games available." />
                  )
                }
              />
              <CatalogFiltersPanel
                catalog={catalogState.catalog}
                columns={columns}
                filters={filters}
                isExpanded={areFiltersExpanded}
                onColumnsChange={setColumns}
                onExpandedChange={setAreFiltersExpanded}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                visibleGamesCount={visibleGames.length}
              />
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
