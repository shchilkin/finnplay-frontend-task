import { useState } from "react";
import type { FormEvent } from "react";
import { usernameSchema } from "@finnplay-test-task/shared";
import type { LoginRequest } from "@finnplay-test-task/shared";

import { BrandLogo } from "./BrandLogo";
import { FloatingTextField } from "./FloatingTextField";
import { PasswordField } from "./PasswordField";

type LoginPageProps = {
  error: string | null;
  isSubmitting: boolean;
  onSignIn: (payload: LoginRequest) => void;
};

export function LoginPage({ error, isSubmitting, onSignIn }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const canSubmit = username.trim().length > 0 && password.length > 0;

  function handleUsernameChange(value: string) {
    setUsername(value);
    setFormError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedUsername = usernameSchema.safeParse(username);

    if (!parsedUsername.success) {
      setFormError("Use player1 or player2.");
      return;
    }

    setFormError(null);
    onSignIn({ username: parsedUsername.data, password });
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <BrandLogo />

        <h1 id="login-title" className="visually-hidden">
          Player login
        </h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <FloatingTextField
            label="Login"
            value={username}
            onValueChange={handleUsernameChange}
            disabled={isSubmitting}
            autoComplete="username"
          />

          <PasswordField value={password} onValueChange={setPassword} disabled={isSubmitting} />

          {formError || error ? (
            <p className="form-error" role="alert">
              {formError ?? error}
            </p>
          ) : null}

          <button className="login-button" type="submit" disabled={isSubmitting || !canSubmit}>
            {isSubmitting ? <span className="spinner" aria-label="Signing in" /> : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
