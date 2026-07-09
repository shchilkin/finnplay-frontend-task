type CatalogEmptyStateProps = {
  actionLabel?: string;
  onAction?: () => void;
  title: string;
};

export function CatalogEmptyState({ actionLabel, onAction, title }: CatalogEmptyStateProps) {
  return (
    <div className="catalog-state">
      <p className="catalog-state-title">{title}</p>
      {actionLabel && onAction ? (
        <button className="catalog-state-action" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
