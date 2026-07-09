import type { Username } from "@finnplay-test-task/shared";

import finnplayLogoUrl from "../../../assets/finnplay-logo.png";
import { UserIcon } from "../../../shared/ui/icons";

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
          <UserIcon />
          Logout
        </button>
      </div>
    </header>
  );
}
