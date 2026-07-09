import { useState } from "react";
import type { ReactNode } from "react";
import type { Game } from "@finnplay-test-task/shared";

import { CatalogEmptyState } from "./CatalogEmptyState";
import type { CatalogColumns } from "../model";

type GameImageSource = "cover" | "coverLarge" | "placeholder";

type GameGridProps = {
  columns: CatalogColumns;
  emptyState?: ReactNode;
  games: Game[];
};

export function GameGrid({ columns, emptyState, games }: GameGridProps) {
  if (games.length === 0) {
    return emptyState ?? <CatalogEmptyState title="No games available." />;
  }

  return (
    <div className="game-grid" data-columns={columns}>
      {games.map((game) => (
        <GameCard game={game} key={game.id} />
      ))}
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  const [imageSource, setImageSource] = useState<GameImageSource>("coverLarge");
  const imageUrl = imageSource === "coverLarge" ? game.coverLarge : game.cover;

  function handleImageError() {
    if (imageSource === "coverLarge") {
      setImageSource("cover");
      return;
    }

    setImageSource("placeholder");
  }

  return (
    <article className="game-card">
      {imageSource === "placeholder" ? (
        <div className="game-card-fallback">
          <span>{game.name}</span>
        </div>
      ) : (
        <img
          className="game-card-image"
          src={imageUrl}
          alt={game.name}
          loading="lazy"
          onError={handleImageError}
        />
      )}
    </article>
  );
}
