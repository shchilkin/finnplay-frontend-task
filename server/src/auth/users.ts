import type { Username } from "@finnplay-test-task/shared";

const users: Record<Username, string> = {
  player1: "player1",
  player2: "player2",
};

export function isValidCredentials(username: Username, password: string): boolean {
  return users[username] === password;
}
