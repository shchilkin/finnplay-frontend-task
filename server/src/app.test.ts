import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "./app.js";

describe("app routes", () => {
  it("returns API information from the root endpoint", async () => {
    const response = await request(createApp()).get("/").expect(200);

    expect(response.body).toEqual({
      name: "Finnplay Test Task API",
      endpoints: {
        auth: "/api/auth/me",
        catalog: "/api/catalog",
        health: "/health",
      },
    });
  });

  it("returns a health response", async () => {
    await request(createApp()).get("/health").expect(200).expect({ status: "ok" });
  });

  it("returns the validated catalog data", async () => {
    const agent = request.agent(createApp());

    await agent
      .post("/api/auth/login")
      .send({ username: "player1", password: "player1" })
      .expect(200);

    const response = await agent.get("/api/catalog").expect(200);

    expect(response.body.games.length).toBeGreaterThan(0);
    expect(response.body.providers.length).toBeGreaterThan(0);
    expect(response.body.groups.length).toBeGreaterThan(0);
  });

  it("rejects catalog requests without a session", async () => {
    await request(createApp()).get("/api/catalog").expect(401).expect({ message: "Unauthorized" });
  });
});
