# Development

## Prerequisites

- Node.js 24
- npm

Node.js 24 is used in CI. If you use nvm, run:

```sh
nvm use
```

## Environment Variables

Local development works without creating an `.env` file. See [../.env.example](../.env.example) for supported variables:

| Variable           | Default                               | Description                                              |
| ------------------ | ------------------------------------- | -------------------------------------------------------- |
| `PORT`             | `3010` in local dev, `3000` in Docker | Server port                                              |
| `NODE_ENV`         | unset locally, `production` in Docker | Runtime mode                                             |
| `CATALOG_DELAY_MS` | `0`                                   | Non-production catalog API response delay                |
| `CATALOG_ERROR`    | unset                                 | Set to `1` in non-production to force catalog API errors |

## Local Development

Run the server and client together:

```sh
npm run dev
```

Open the client at `http://localhost:5173`. The API runs on `http://localhost:3010`.

Run the app with a delayed catalog response:

```sh
npm run dev:slow-api
```

Run the app with a forced catalog API error:

```sh
npm run dev:error-api
```

If a previous dev server is still running, stop the old processes before using the API delay or error scripts. The client proxy always targets `http://localhost:3010`.

## Checks

Run all checks:

```sh
npm run check
```

This runs:

- formatting check
- lint
- typecheck
- tests

Individual commands:

```sh
npm run build
npm run format:check
npm run lint
npm run typecheck
npm run test
```

`npm run build` builds the shared package, server, and client.

## API

The client uses same-origin `/api` requests through the Vite proxy during local development.

Available endpoints:

| Method | Path               | Description                 |
| ------ | ------------------ | --------------------------- |
| `GET`  | `/health`          | Health check                |
| `POST` | `/api/auth/login`  | Create a player session     |
| `GET`  | `/api/auth/me`     | Read the current session    |
| `POST` | `/api/auth/logout` | Clear the current session   |
| `GET`  | `/api/catalog`     | Read protected catalog data |

## Manual QA

Recommended manual checks:

- Log in with `player1` / `player1`.
- Log in with `player2` / `player2`.
- Verify invalid credentials show an error.
- Filter games by name.
- Select multiple providers.
- Select multiple game groups.
- Verify multiple selected values inside one filter criterion use OR semantics.
- Verify different filter criteria are combined with AND semantics.
- Change sorting between A-Z, Z-A, and Newest.
- Change the number of game columns on desktop.
- Verify the columns control is hidden at the `428px` mobile breakpoint and the game list uses 2 columns.
- Reset filters.
- Log out.
