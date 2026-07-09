import { afterEach, describe, expect, it, vi } from "vitest";

import { requestJson } from "./http";

describe("requestJson", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON for successful responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ username: "player1" }))),
    );

    await expect(requestJson("/api/auth/me")).resolves.toEqual({ username: "player1" });
  });

  it("throws API error messages from JSON error responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Invalid username or password" }), {
          status: 401,
          statusText: "Unauthorized",
        }),
      ),
    );

    await expect(requestJson("/api/auth/login")).rejects.toThrow("Invalid username or password");
  });

  it("throws status text for non-JSON error responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html>Error</html>", {
          status: 502,
          statusText: "Bad Gateway",
        }),
      ),
    );

    await expect(requestJson("/api/auth/me")).rejects.toThrow("Bad Gateway");
  });

  it("allows empty successful responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null)));

    await expect(requestJson("/api/empty")).resolves.toBeNull();
  });
});
