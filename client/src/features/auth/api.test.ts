import { beforeEach, describe, expect, it, vi } from "vitest";

import { requestJson } from "../../shared/api/http";
import * as authApi from "./api";

vi.mock("../../shared/api/http", () => ({
  requestJson: vi.fn<typeof requestJson>(),
}));

const mockedRequestJson = vi.mocked(requestJson);

describe("auth API", () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it("validates the current user response", async () => {
    mockedRequestJson.mockResolvedValue({ username: "player1" });

    await expect(authApi.getCurrentUser()).resolves.toEqual({ username: "player1" });
  });

  it("rejects invalid current user responses", async () => {
    mockedRequestJson.mockResolvedValue({ username: "unknown" });

    await expect(authApi.getCurrentUser()).rejects.toMatchObject({ name: "ZodError" });
  });

  it("validates login responses", async () => {
    mockedRequestJson.mockResolvedValue({ username: "player2" });

    await expect(authApi.login({ username: "player2", password: "player2" })).resolves.toEqual({
      username: "player2",
    });
    expect(mockedRequestJson).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "player2", password: "player2" }),
    });
  });

  it("validates logout responses", async () => {
    mockedRequestJson.mockResolvedValue({ username: null });

    await expect(authApi.logout()).resolves.toEqual({ username: null });
  });
});
