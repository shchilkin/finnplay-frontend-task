import type { CurrentUserResponse, LoginRequest, LoginResponse } from "@finnplay-test-task/shared";

import { requestJson } from "../../shared/api/http";

export function getCurrentUser(): Promise<CurrentUserResponse> {
  return requestJson<CurrentUserResponse>("/api/auth/me");
}

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return requestJson<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout(): Promise<CurrentUserResponse> {
  return requestJson<CurrentUserResponse>("/api/auth/logout", {
    method: "POST",
  });
}
