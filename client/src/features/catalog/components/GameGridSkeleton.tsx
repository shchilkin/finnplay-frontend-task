import type { CatalogColumns } from "../model";

type GameGridSkeletonProps = {
  columns: CatalogColumns;
};

export function GameGridSkeleton({ columns }: GameGridSkeletonProps) {
  return (
    <div className="game-grid" data-columns={columns} aria-hidden="true">
      {Array.from({ length: columns * 3 }, (_, index) => (
        <div className="game-card game-card-skeleton" key={index} />
      ))}
    </div>
  );
}
