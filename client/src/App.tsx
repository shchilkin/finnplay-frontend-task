import "./App.css";
import { LoginPage } from "./features/auth/components/LoginPage";
import { useAuth } from "./features/auth/useAuth";
import { PlayerPage } from "./features/player/components/PlayerPage";

export function App() {
  const auth = useAuth();

  if (auth.status === "checking") {
    return (
      <main className="app-shell">
        <section className="app-panel" aria-labelledby="app-title">
          <p className="app-kicker">Finnplay Test Task</p>
          <h1 id="app-title">Checking session</h1>
          <p className="app-copy">Preparing the player experience.</p>
        </section>
      </main>
    );
  }

  if (auth.status === "authenticated" && auth.username) {
    return (
      <PlayerPage
        username={auth.username}
        onLogout={auth.signOut}
        isLogoutPending={auth.isSubmitting}
        error={auth.error}
      />
    );
  }

  return <LoginPage error={auth.error} isSubmitting={auth.isSubmitting} onSignIn={auth.signIn} />;
}

export default App;
