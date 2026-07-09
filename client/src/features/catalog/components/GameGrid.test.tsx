import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Game } from "@finnplay-test-task/shared";

import { GameGrid } from "./GameGrid";

const game: Game = {
  cover: "https://example.test/broken.jpg",
  coverLarge: "https://example.test/broken@2x.jpg",
  date: "2026-01-01T00:00:00.000Z",
  id: 1,
  name: "Broken Image Game",
  provider: 1,
};

describe("GameGrid", () => {
  it("falls back from large cover to cover and then to a text placeholder", () => {
    render(<GameGrid games={[game]} columns={4} />);

    const largeCover = screen.getByRole("img", { name: "Broken Image Game" });

    expect(largeCover).toHaveAttribute("src", game.coverLarge);

    fireEvent.error(largeCover);

    const cover = screen.getByRole("img", { name: "Broken Image Game" });

    expect(cover).toHaveAttribute("src", game.cover);

    fireEvent.error(cover);

    expect(screen.getByText("Broken Image Game")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Broken Image Game" })).not.toBeInTheDocument();
  });
});
