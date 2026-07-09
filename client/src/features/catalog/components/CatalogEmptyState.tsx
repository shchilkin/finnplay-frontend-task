type CatalogEmptyStateProps = {
  title: string;
};

export function CatalogEmptyState({ title }: CatalogEmptyStateProps) {
  return (
    <div className="catalog-state">
      <p className="catalog-state-title">{title}</p>
    </div>
  );
}
