import type { Username } from "@finnplay-test-task/shared";

import { PlayerNavbar } from "./PlayerNavbar";

type PlayerPageProps = {
  error: string | null;
  isLogoutPending: boolean;
  onLogout: () => void;
  username: Username;
};

export function PlayerPage({ error, isLogoutPending, onLogout, username }: PlayerPageProps) {
  return (
    <main className="player-page">
      <div className="player-shell">
        <PlayerNavbar username={username} onLogout={onLogout} isLogoutPending={isLogoutPending} />
        <section className="player-content" aria-label="Game catalog">
          {error ? (
            <p className="player-error" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
