import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CurrentUserResponse, LoginRequest, LoginResponse } from "@finnplay-test-task/shared";

import * as authApi from "./api";
import { useAuth } from "./useAuth";

type GetCurrentUserMock = () => Promise<CurrentUserResponse>;
type LoginMock = (payload: LoginRequest) => Promise<LoginResponse>;
type LogoutMock = () => Promise<CurrentUserResponse>;

vi.mock("./api", () => ({
  getCurrentUser: vi.fn<GetCurrentUserMock>(),
  login: vi.fn<LoginMock>(),
  logout: vi.fn<LogoutMock>(),
}));

const mockedAuthApi = vi.mocked(authApi);

describe("useAuth", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("hydrates an authenticated session", async () => {
    mockedAuthApi.getCurrentUser.mockResolvedValue({ username: "player1" });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.status).toBe("authenticated"));

    expect(result.current.username).toBe("player1");
    expect(result.current.error).toBeNull();
  });

  it("hydrates an anonymous session", async () => {
    mockedAuthApi.getCurrentUser.mockResolvedValue({ username: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.status).toBe("anonymous"));

    expect(result.current.username).toBeNull();
  });

  it("authenticates after a successful login", async () => {
    mockedAuthApi.getCurrentUser.mockResolvedValue({ username: null });
    mockedAuthApi.login.mockResolvedValue({ username: "player2" });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.status).toBe("anonymous"));

    await act(async () => {
      await result.current.signIn({ username: "player2", password: "player2" });
    });

    expect(result.current.status).toBe("authenticated");
    expect(result.current.username).toBe("player2");
  });

  it("keeps the authenticated state when logout fails", async () => {
    mockedAuthApi.getCurrentUser.mockResolvedValue({ username: "player1" });
    mockedAuthApi.logout.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.status).toBe("authenticated"));

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.status).toBe("authenticated");
    expect(result.current.username).toBe("player1");
    expect(result.current.error).toBe("Network error");
  });
});
