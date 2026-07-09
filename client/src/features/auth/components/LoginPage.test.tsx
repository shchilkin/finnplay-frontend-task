import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { LoginRequest } from "@finnplay-test-task/shared";

import { LoginPage } from "./LoginPage";

type SignInMock = (payload: LoginRequest) => void;

describe("LoginPage", () => {
  it("keeps submit disabled until a password is entered", () => {
    render(<LoginPage error={null} isSubmitting={false} onSignIn={vi.fn<SignInMock>()} />);

    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();
  });

  it("does not submit invalid usernames", async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn<SignInMock>();

    render(<LoginPage error={null} isSubmitting={false} onSignIn={onSignIn} />);

    await user.clear(screen.getByLabelText("Login"));
    await user.type(screen.getByLabelText("Login"), "unknown");
    await user.type(screen.getByLabelText("Password"), "unknown");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(onSignIn).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Use player1 or player2.");
  });

  it("submits valid credentials", async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn<SignInMock>();

    render(<LoginPage error={null} isSubmitting={false} onSignIn={onSignIn} />);

    await user.type(screen.getByLabelText("Password"), "player1");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(onSignIn).toHaveBeenCalledWith({ username: "player1", password: "player1" });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(<LoginPage error={null} isSubmitting={false} onSignIn={vi.fn<SignInMock>()} />);

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Show password" }));

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toBeEnabled();
  });
});
