import {
  currentUserResponseSchema,
  loginResponseSchema,
  type CurrentUserResponse,
  type LoginRequest,
  type LoginResponse,
} from "@finnplay-test-task/shared";

import { requestJson } from "../../shared/api/http";

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await requestJson<unknown>("/api/auth/me");

  return currentUserResponseSchema.parse(response);
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await requestJson<unknown>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return loginResponseSchema.parse(response);
}

export async function logout(): Promise<CurrentUserResponse> {
  const response = await requestJson<unknown>("/api/auth/logout", {
    method: "POST",
  });

  return currentUserResponseSchema.parse(response);
}
