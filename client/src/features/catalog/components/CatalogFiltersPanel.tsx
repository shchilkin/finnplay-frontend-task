import type { ReactNode } from "react";
import type { CatalogData } from "@finnplay-test-task/shared";

import {
  catalogColumnOptions,
  catalogSortingOptions,
  type CatalogColumns,
  type CatalogFilters,
  type CatalogSorting,
  toggleFilterValue,
} from "../model";

type CatalogFiltersPanelProps = {
  catalog: CatalogData;
  columns: CatalogColumns;
  filters: CatalogFilters;
  isExpanded: boolean;
  onColumnsChange: (columns: CatalogColumns) => void;
  onExpandedChange: (isExpanded: boolean) => void;
  onFiltersChange: (filters: CatalogFilters) => void;
  onReset: () => void;
  visibleGamesCount: number;
};

const sortingLabels: Record<CatalogSorting, string> = {
  az: "A-Z",
  newest: "Newest",
  za: "Z-A",
};

export function CatalogFiltersPanel({
  catalog,
  columns,
  filters,
  isExpanded,
  onColumnsChange,
  onExpandedChange,
  onFiltersChange,
  onReset,
  visibleGamesCount,
}: CatalogFiltersPanelProps) {
  function updateFilters(partialFilters: Partial<CatalogFilters>) {
    onFiltersChange({ ...filters, ...partialFilters });
  }

  const filterContentId = "catalog-filter-content";

  return (
    <aside
      className="catalog-filter-panel"
      aria-label="Game filters"
      data-expanded={isExpanded ? "true" : "false"}
    >
      <SearchField
        value={filters.search}
        onChange={(search) => {
          updateFilters({ search });
        }}
      />

      {!isExpanded ? (
        <FilterToggleButton
          filterContentId={filterContentId}
          isExpanded={isExpanded}
          onExpandedChange={onExpandedChange}
        />
      ) : null}

      <div
        className="catalog-filter-content"
        id={filterContentId}
        data-expanded={isExpanded ? "true" : "false"}
      >
        <FilterSection title="Providers" titleId="catalog-providers-title">
          <FilterOptionGrid>
            {catalog.providers.map((provider) => (
              <FilterToggle
                key={provider.id}
                label={provider.name}
                isSelected={filters.providerIds.includes(provider.id)}
                onToggle={() => {
                  updateFilters({
                    providerIds: toggleFilterValue(filters.providerIds, provider.id),
                  });
                }}
              />
            ))}
          </FilterOptionGrid>
        </FilterSection>

        <FilterSection title="Game groups" titleId="catalog-game-groups-title">
          <FilterOptionGrid>
            {catalog.groups.map((group) => (
              <FilterToggle
                key={group.id}
                label={group.name}
                isSelected={filters.groupIds.includes(group.id)}
                onToggle={() => {
                  updateFilters({
                    groupIds: toggleFilterValue(filters.groupIds, group.id),
                  });
                }}
              />
            ))}
          </FilterOptionGrid>
        </FilterSection>

        <FilterSection title="Sorting" titleId="catalog-sorting-title">
          <div className="catalog-filter-inline-options">
            {catalogSortingOptions.map((sorting) => (
              <FilterToggle
                key={sorting}
                label={sortingLabels[sorting]}
                isSelected={filters.sorting === sorting}
                onToggle={() => {
                  updateFilters({ sorting });
                }}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection
          className="catalog-columns-section"
          title="Columns"
          titleId="catalog-columns-title"
        >
          <div
            className="catalog-column-options"
            role="radiogroup"
            aria-label="Columns"
            data-selected-columns={columns}
          >
            {catalogColumnOptions.map((columnOption) => (
              <label
                key={columnOption}
                className="catalog-column-option"
                data-active={columnOption <= columns ? "true" : "false"}
              >
                <input
                  className="visually-hidden"
                  type="radio"
                  name="catalog-columns"
                  checked={columns === columnOption}
                  onChange={() => {
                    onColumnsChange(columnOption);
                  }}
                />
                {columnOption}
              </label>
            ))}
          </div>
        </FilterSection>

        <div className="catalog-filter-footer">
          <span className="catalog-games-count">Games amount: {visibleGamesCount}</span>
          <button className="catalog-reset-button" type="button" onClick={onReset}>
            Reset
          </button>
        </div>

        {isExpanded ? (
          <FilterToggleButton
            filterContentId={filterContentId}
            isExpanded={isExpanded}
            onExpandedChange={onExpandedChange}
          />
        ) : null}
      </div>
    </aside>
  );
}

type FilterToggleButtonProps = {
  filterContentId: string;
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
};

function FilterToggleButton({
  filterContentId,
  isExpanded,
  onExpandedChange,
}: FilterToggleButtonProps) {
  return (
    <button
      className="catalog-filter-toggle"
      type="button"
      aria-controls={filterContentId}
      aria-expanded={isExpanded}
      onClick={() => {
        onExpandedChange(!isExpanded);
      }}
    >
      <MenuIcon />
      {isExpanded ? "Hide filters" : "Show filters"}
    </button>
  );
}

type SearchFieldProps = {
  onChange: (value: string) => void;
  value: string;
};

function SearchField({ onChange, value }: SearchFieldProps) {
  return (
    <label className="catalog-search">
      <span className="visually-hidden">Search games</span>
      <input
        className="catalog-search-input"
        type="search"
        placeholder="Search"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
      <SearchIcon />
    </label>
  );
}

type FilterSectionProps = {
  children: ReactNode;
  className?: string;
  title: string;
  titleId: string;
};

function FilterSection({ children, className = "", title, titleId }: FilterSectionProps) {
  return (
    <section className={`catalog-filter-section ${className}`} aria-labelledby={titleId}>
      <h2 className="catalog-filter-title" id={titleId}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function FilterOptionGrid({ children }: { children: ReactNode }) {
  return <div className="catalog-filter-option-grid">{children}</div>;
}

type FilterToggleProps = {
  isSelected: boolean;
  label: string;
  onToggle: () => void;
};

function FilterToggle({ isSelected, label, onToggle }: FilterToggleProps) {
  return (
    <button
      className="catalog-filter-option"
      type="button"
      aria-pressed={isSelected}
      data-selected={isSelected ? "true" : "false"}
      onClick={onToggle}
    >
      {label}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg className="catalog-search-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.25 15.25 5 5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="catalog-menu-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}
