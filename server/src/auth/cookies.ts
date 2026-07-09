import type { Request, Response } from "express";
import { parse, serialize } from "cookie";

const sessionCookieName = "finnplay_test_task_session";

export function getSessionId(request: Request): string | undefined {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  return parse(cookieHeader)[sessionCookieName];
}

export function setSessionCookie(response: Response, sessionId: string): void {
  response.setHeader(
    "Set-Cookie",
    serialize(sessionCookieName, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    }),
  );
}

export function clearSessionCookie(response: Response): void {
  response.setHeader(
    "Set-Cookie",
    serialize(sessionCookieName, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
  );
}
