import { randomUUID } from "node:crypto";

import type { Username } from "@finnplay-test-task/shared";

const sessions = new Map<string, Username>();

export function createSession(username: Username): string {
  const sessionId = randomUUID();
  sessions.set(sessionId, username);
  return sessionId;
}

export function getSessionUsername(sessionId: string | undefined): Username | null {
  if (!sessionId) {
    return null;
  }

  return sessions.get(sessionId) ?? null;
}

export function deleteSession(sessionId: string | undefined): void {
  if (!sessionId) {
    return;
  }

  sessions.delete(sessionId);
}
