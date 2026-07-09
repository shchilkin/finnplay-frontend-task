# Finnplay Test Task

Full-stack React and Node.js application for filtering games by name, provider, and group.

Live demo: [https://finnplay-frontend-task.shchilkin.dev](https://finnplay-frontend-task.shchilkin.dev)

Original assignment: [TASK.md](./TASK.md)

## Features

- Login with two predefined players.
- Server-side in-memory sessions with an `httpOnly` cookie.
- Auth-protected catalog API.
- Client-side filtering by search, provider, and game group.
- OR semantics within one filter type and AND semantics across different filter types.
- A-Z, Z-A, and newest sorting.
- Reset action, desktop column control, and a `428px` mobile layout with 2 columns.

## Quick Start

Install dependencies:

```sh
npm install
```

Run the server and client together:

```sh
npm run dev
```

Open:

```txt
http://localhost:5173
```

The API runs on `http://localhost:3010`.

## Login Credentials

Use one of these username and password pairs on the login page:

| Username  | Password  |
| --------- | --------- |
| `player1` | `player1` |
| `player2` | `player2` |

Sessions are stored in memory on the server, so users are logged out after a server restart.

## Checks

Run all checks:

```sh
npm run check
```

Individual commands:

```sh
npm run build
npm run format:check
npm run lint
npm run typecheck
npm run test
```

## Documentation

- [Development](./docs/DEVELOPMENT.md) - local setup, environment variables, API, and manual QA.
- [Deployment](./docs/DEPLOYMENT.md) - Docker, GHCR publishing, and Coolify/VPS deployment.
- [Technical Decisions](./docs/TECHNICAL_DECISIONS.md) - architecture, tradeoffs, validation, filtering, and quality choices.
