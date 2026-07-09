import { Router } from "express";
import { loginRequestSchema } from "@finnplay-test-task/shared";

import { clearSessionCookie, getSessionId, setSessionCookie } from "./cookies.js";
import { createSession, deleteSession, getSessionUsername } from "./sessionStore.js";
import { isValidCredentials } from "./users.js";

export function createAuthRouter() {
  const router = Router();

  router.post("/login", (request, response) => {
    const result = loginRequestSchema.safeParse(request.body);

    if (!result.success) {
      response.status(400).json({ message: "Invalid login request" });
      return;
    }

    const { username, password } = result.data;

    if (!isValidCredentials(username, password)) {
      response.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const sessionId = createSession(username);
    setSessionCookie(response, sessionId);
    response.json({ username });
  });

  router.get("/me", (request, response) => {
    const username = getSessionUsername(getSessionId(request));
    response.json({ username });
  });

  router.post("/logout", (request, response) => {
    deleteSession(getSessionId(request));
    clearSessionCookie(response);
    response.json({ username: null });
  });

  return router;
}
