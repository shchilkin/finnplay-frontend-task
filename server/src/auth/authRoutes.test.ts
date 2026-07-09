import { describe, it } from "vitest";
import request from "supertest";

import { createApp } from "../app.js";

describe("auth routes", () => {
  it("returns the current user after a successful login", async () => {
    const agent = request.agent(createApp());

    await agent
      .post("/api/auth/login")
      .send({ username: "player1", password: "player1" })
      .expect(200)
      .expect({ username: "player1" });

    await agent.get("/api/auth/me").expect(200).expect({ username: "player1" });
  });

  it("rejects invalid credentials", async () => {
    await request(createApp())
      .post("/api/auth/login")
      .send({ username: "player1", password: "wrong" })
      .expect(401)
      .expect({ message: "Invalid username or password" });
  });

  it("rejects invalid login request bodies", async () => {
    await request(createApp())
      .post("/api/auth/login")
      .send({ username: "unknown", password: "unknown" })
      .expect(400)
      .expect({ message: "Invalid login request" });
  });

  it("returns anonymous current user without a valid session", async () => {
    await request(createApp()).get("/api/auth/me").expect(200).expect({ username: null });
  });

  it("clears the current session on logout", async () => {
    const agent = request.agent(createApp());

    await agent
      .post("/api/auth/login")
      .send({ username: "player2", password: "player2" })
      .expect(200);

    await agent.post("/api/auth/logout").expect(200).expect({ username: null });
    await agent.get("/api/auth/me").expect(200).expect({ username: null });
  });
});
