import type { Username } from "@finnplay-test-task/shared";

import finnplayLogoUrl from "../../../assets/finnplay-logo.png";

type PlayerNavbarProps = {
  isLogoutPending: boolean;
  onLogout: () => void;
  username: Username;
};

function getPlayerName(username: Username) {
  return username.replace("player", "Player ");
}

export function PlayerNavbar({ isLogoutPending, onLogout, username }: PlayerNavbarProps) {
  return (
    <header className="player-navbar">
      <img className="player-navbar-logo" src={finnplayLogoUrl} alt="Finnplay" />

      <div className="player-navbar-actions">
        <span className="player-name">{getPlayerName(username)}</span>
        <button
          className="logout-button"
          type="button"
          onClick={onLogout}
          disabled={isLogoutPending}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="5" r="2.25" />
            <path d="M3.25 13.25c.54-2.08 2.34-3.5 4.75-3.5s4.21 1.42 4.75 3.5" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
