import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CatalogResponse } from "@finnplay-test-task/shared";

import { useCatalog } from "../../catalog/useCatalog";
import { PlayerPage } from "./PlayerPage";

vi.mock("../../catalog/useCatalog");

const mockUseCatalog = vi.mocked(useCatalog);

afterEach(() => {
  vi.clearAllMocks();
});

function renderPlayerPage() {
  return render(
    <PlayerPage
      error={null}
      isLogoutPending={false}
      onLogout={vi.fn<() => void>()}
      username="player1"
    />,
  );
}

const catalog: CatalogResponse = {
  games: [
    {
      cover: "https://example.test/alpha.jpg",
      coverLarge: "https://example.test/alpha@2x.jpg",
      date: "2024-01-01T00:00:00.000Z",
      id: 1,
      name: "Alpha Slots",
      provider: 10,
    },
    {
      cover: "https://example.test/beta.jpg",
      coverLarge: "https://example.test/beta@2x.jpg",
      date: "2025-01-01T00:00:00.000Z",
      id: 2,
      name: "Beta Live",
      provider: 20,
    },
    {
      cover: "https://example.test/hidden.jpg",
      coverLarge: "https://example.test/hidden@2x.jpg",
      date: "2026-01-01T00:00:00.000Z",
      id: 3,
      name: "Hidden Game",
      provider: 10,
    },
  ],
  groups: [
    { games: [1], id: 100, name: "Slots" },
    { games: [2], id: 200, name: "Live" },
  ],
  providers: [
    { id: 10, logo: "provider-a.png", name: "Provider A" },
    { id: 20, logo: "provider-b.png", name: "Provider B" },
  ],
};

function createReloadMock() {
  return vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
}

function mockLoadedCatalog(loadedCatalog: CatalogResponse = catalog) {
  mockUseCatalog.mockReturnValue({
    catalog: loadedCatalog,
    error: null,
    reload: createReloadMock(),
    status: "loaded",
  });
}

describe("PlayerPage", () => {
  it("renders only grouped games from the loaded catalog", () => {
    mockLoadedCatalog();

    renderPlayerPage();

    expect(screen.getByAltText("Alpha Slots")).toBeInTheDocument();
    expect(screen.getByAltText("Beta Live")).toBeInTheDocument();
    expect(screen.queryByAltText("Hidden Game")).not.toBeInTheDocument();
    expect(screen.getByText("Games amount: 2")).toBeInTheDocument();
  });

  it("filters games by search and resets filters", async () => {
    const user = userEvent.setup();

    mockLoadedCatalog();

    renderPlayerPage();

    await user.type(screen.getByLabelText("Search games"), "beta");

    expect(screen.queryByAltText("Alpha Slots")).not.toBeInTheDocument();
    expect(screen.getByAltText("Beta Live")).toBeInTheDocument();
    expect(screen.getByText("Games amount: 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByAltText("Alpha Slots")).toBeInTheDocument();
    expect(screen.getByAltText("Beta Live")).toBeInTheDocument();
    expect(screen.getByText("Games amount: 2")).toBeInTheDocument();
  });

  it("filters games by provider after opening mobile filters", async () => {
    const user = userEvent.setup();

    mockLoadedCatalog();

    renderPlayerPage();

    await user.click(screen.getByRole("button", { name: "Show filters" }));
    await user.click(screen.getByRole("button", { name: "Provider B" }));

    expect(screen.queryByAltText("Alpha Slots")).not.toBeInTheDocument();
    expect(screen.getByAltText("Beta Live")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide filters" })).toBeInTheDocument();
  });

  it("changes desktop column count", async () => {
    const user = userEvent.setup();

    mockLoadedCatalog();

    renderPlayerPage();

    const columnsGroup = screen.getByRole("radiogroup", { name: "Columns" });

    await user.click(within(columnsGroup).getByLabelText("2"));

    expect(within(columnsGroup).getByLabelText("2")).toBeChecked();
  });

  it("renders loading skeletons while the catalog is loading", () => {
    mockUseCatalog.mockReturnValue({
      catalog: null,
      error: null,
      reload: createReloadMock(),
      status: "loading",
    });

    const { container } = renderPlayerPage();

    expect(screen.getByText("Loading games")).toBeInTheDocument();
    expect(container.querySelectorAll(".game-card-skeleton")).toHaveLength(12);
  });

  it("allows retrying after a catalog load error", async () => {
    const user = userEvent.setup();
    const reload = createReloadMock();

    mockUseCatalog.mockReturnValue({
      catalog: null,
      error: "Unable to load games.",
      reload,
      status: "error",
    });

    renderPlayerPage();

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load games.");

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(reload).toHaveBeenCalledOnce();
  });

  it("shows an empty catalog state when there are no grouped games", () => {
    mockLoadedCatalog({ ...catalog, groups: [] });

    renderPlayerPage();

    expect(screen.getByText("No games available.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reset filters" })).not.toBeInTheDocument();
  });

  it("shows a centered empty state when filters hide all games", async () => {
    const user = userEvent.setup();

    mockLoadedCatalog();

    renderPlayerPage();

    await user.type(screen.getByLabelText("Search games"), "unknown game");

    expect(screen.getByText("No games match the selected filters.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reset filters" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByAltText("Alpha Slots")).toBeInTheDocument();
    expect(screen.getByAltText("Beta Live")).toBeInTheDocument();
  });
});
