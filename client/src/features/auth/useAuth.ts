import { useCallback, useEffect, useState } from "react";
import type { LoginRequest, Username } from "@finnplay-test-task/shared";

import * as authApi from "./api";

type AuthStatus = "checking" | "authenticated" | "anonymous";

type AuthState = {
  error: string | null;
  isSubmitting: boolean;
  status: AuthStatus;
  username: Username | null;
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    error: null,
    isSubmitting: false,
    status: "checking",
    username: null,
  });

  useEffect(() => {
    let isActive = true;

    async function checkCurrentUser() {
      try {
        const { username } = await authApi.getCurrentUser();

        if (!isActive) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          error: null,
          status: username ? "authenticated" : "anonymous",
          username,
        }));
      } catch {
        if (!isActive) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          error: "Unable to check the current session.",
          status: "anonymous",
          username: null,
        }));
      }
    }

    void checkCurrentUser();

    return () => {
      isActive = false;
    };
  }, []);

  const signIn = useCallback(async (payload: LoginRequest) => {
    setState((currentState) => ({ ...currentState, error: null, isSubmitting: true }));

    try {
      const { username } = await authApi.login(payload);

      setState({
        error: null,
        isSubmitting: false,
        status: "authenticated",
        username,
      });
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        error: getErrorMessage(error, "Unable to sign in."),
        isSubmitting: false,
        status: "anonymous",
        username: null,
      }));
    }
  }, []);

  const signOut = useCallback(async () => {
    setState((currentState) => ({ ...currentState, error: null, isSubmitting: true }));

    try {
      await authApi.logout();

      setState({
        error: null,
        isSubmitting: false,
        status: "anonymous",
        username: null,
      });
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        error: getErrorMessage(error, "Unable to sign out."),
        isSubmitting: false,
      }));
    }
  }, []);

  return {
    ...state,
    signIn,
    signOut,
  };
}
