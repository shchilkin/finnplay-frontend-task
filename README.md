# Finnplay Test Task

Full-stack React and Node.js application for filtering games by name, provider, and group.

Original assignment: [TASK.md](./TASK.md)

## Prerequisites

- Node.js 24
- npm

Node.js 24 is used in CI. If you use nvm, run:

```sh
nvm use
```

## Quick Start

Install dependencies:

```sh
npm install
```

Run the server and client together:

```sh
npm run dev
```

Open the client:

```txt
http://localhost:5173
```

The API runs on:

```txt
http://localhost:3010
```

## Environment Variables

Local development works without creating an `.env` file. See [.env.example](./.env.example) for supported variables:

| Variable           | Default                               | Description                                              |
| ------------------ | ------------------------------------- | -------------------------------------------------------- |
| `PORT`             | `3010` in local dev, `3000` in Docker | Server port                                              |
| `NODE_ENV`         | unset locally, `production` in Docker | Runtime mode                                             |
| `CATALOG_DELAY_MS` | `0`                                   | Non-production catalog API response delay                |
| `CATALOG_ERROR`    | unset                                 | Set to `1` in non-production to force catalog API errors |

## Login Credentials

Use one of these username and password pairs on the login page:

| Username  | Password  |
| --------- | --------- |
| `player1` | `player1` |
| `player2` | `player2` |

Sessions are stored in memory on the server, so users are logged out after a server restart.

## Local Development

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

## Docker

Docker support is added for production deployment on a VPS. The expected deployment flow is:

1. GitHub Actions builds the Docker image from `Dockerfile`.
2. GitHub Actions publishes the image to GitHub Container Registry.
3. The VPS runs the published image through `coolify.compose.yml`.

The published image name is:

```txt
ghcr.io/shchilkin/finnplay-frontend-task
```

Build the production image:

```sh
docker build -t finnplay-test-task .
```

Run the production container locally:

```sh
docker run --rm -p 3010:3000 finnplay-test-task
```

Open:

```txt
http://localhost:3010
```

You can also use Docker Compose for local production-image verification:

```sh
docker compose -f docker-compose.local.yml up --build
```

The Docker image runs one Express server. It serves:

- the React production build from `client/dist`
- the API under `/api`
- the health check at `/health`

## Docker Image Publishing

Docker images are published by `.github/workflows/docker-publish.yml`.

Tags:

- `development` for pushes to the `development` branch
- `latest` for pushes to the `main` branch
- `sha-<commit>` for every published image

## VPS Deployment with Coolify

Use the Docker Compose build pack in Coolify and point it to `coolify.compose.yml`. The compose file pulls the published GHCR image instead of building on the VPS.

Recommended settings:

- Repository branch: `main`, `development`, or your deployment branch
- Build pack: Docker Compose
- Compose file: `./coolify.compose.yml`
- Domain: `finnplay-frontend-task.shchilkin.dev`
- Service: `app`
- Port: `3000`
- Health check path: `/health`
- Runtime environment variables:
  - `NODE_ENV=production`
  - `PORT=3000`
  - `IMAGE_TAG=development`

DNS should point `finnplay-frontend-task.shchilkin.dev` to the VPS IP address before enabling the domain in Coolify.

Coolify should route the configured domain to the `app` service on container port `3000`. The app uses same-origin API requests, so no CORS configuration is needed when the client and API are served from the same container.

For a direct VPS Docker Compose deployment without Coolify:

```sh
IMAGE_TAG=development docker compose -f coolify.compose.yml up -d
```

## API

The client uses same-origin `/api` requests through the Vite proxy during local development.

Available endpoints:

| Method | Path               | Description               |
| ------ | ------------------ | ------------------------- |
| `GET`  | `/health`          | Health check              |
| `POST` | `/api/auth/login`  | Create a player session   |
| `GET`  | `/api/auth/me`     | Read the current session  |
| `POST` | `/api/auth/logout` | Clear the current session |
| `GET`  | `/api/catalog`     | Read catalog data         |

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

## Project Structure

- `client` - React application
- `server` - Node.js API
- `shared` - shared TypeScript types used by the client and server
- `data.json` - initial in-memory catalog data

## Technical Decisions

### Repository

- TypeScript is used across the repository because the task explicitly values typed code and the client and server use the same data shapes.
- npm workspaces are used to keep the client, server, and shared package in one repository with one lockfile and one install command.

### Shared Data

- Zod is used for runtime schema validation. Shared TypeScript types are inferred from Zod schemas so the validated data shape and static types stay aligned.
- `data.json` is treated as source task data and is excluded from automatic formatting to avoid noisy fixture-only changes.

### Client

- The client is built with Vite, React, and TypeScript to keep the frontend setup small and focused.
- The Vite dev server proxies `/api` requests to the Node.js server, so client code can call the API through same-origin paths during local development.
- The generated Vite starter UI is replaced with a minimal app shell before feature work starts.
- Client code is grouped by feature (`auth`, `player`, `catalog`) so API calls, hooks, and UI components stay close to the behavior they support.
- The login and player views use local component composition instead of a UI library, matching the task restriction and keeping the implementation close to the Figma design.
- The catalog defaults to A-Z sorting so the initial game list is deterministic and easy to scan.
- Multiple selected values inside one filter criterion use OR semantics, while different criteria are combined with AND semantics.
- The catalog page renders explicit loading, error, and empty states because API data is loaded asynchronously and filters can legitimately produce no visible games.
- Catalog errors expose a retry action, while empty filtered results stay focused on the message because reset is already available in the filter panel.
- Game cards try the large cover first, fall back to the lower-resolution cover, and finally show a text placeholder if both image URLs fail.
- The player navbar and desktop filter panel are sticky so filtering controls stay reachable while scrolling a long game list. The filter panel is not sticky on mobile to preserve vertical space.
- The mobile breakpoint is `428px`. On mobile, the game list always uses 2 columns and the columns control is hidden.

### Server

- The server is built with Express because the API surface is small and does not require a heavier framework.
- `tsx` is used for local TypeScript development so the server can run without a separate build step.
- The production Docker image runs a compiled server with `node` and serves the compiled React app from the same Express process.
- The server validates `data.json` with the shared Zod schema on startup and fails fast if the catalog data is invalid.
- Player sessions are stored in memory and identified by an `httpOnly` session cookie, matching the task requirement without adding a database.
- A lightweight `/health` endpoint is included for future container health checks.
- The catalog API supports non-production failure and delay modes through environment variables so loading and error states can be checked manually without changing client code.

### Quality

- The Oxc toolchain is used for code quality:
  - `oxfmt` formats the codebase.
  - `oxlint` catches common JavaScript and TypeScript issues.
- Vitest is used as the shared test runner across workspaces, with Supertest covering Express routes without starting a real HTTP port.
- React Testing Library, user-event, jest-dom, and jsdom are used for client component tests that exercise UI behavior through accessible DOM queries.
- Browser-mode or end-to-end tests are deferred until the game catalog and filtering UI exist, where real browser layout and responsive behavior matter more.
- Lint rules start with a conservative baseline and can be tightened as the client and server code grow.

## Known Limitations and Tradeoffs

- Sessions are stored in memory according to the task requirement, so they are cleared when the server restarts.
- No database is used according to the task requirement. Initial data is loaded from `data.json` and kept in memory.
- Tablet-sized layouts are functional, while the main visual tuning follows the supplied desktop and `428px` mobile designs.
- Some high-resolution image URLs from `data.json` are unavailable on the CDN. Game cards try the high-resolution cover first, fall back to the lower-resolution cover, and then show a text placeholder when both image URLs are unavailable.

## Design

Figma design: https://www.figma.com/file/totoTYpycpBnizdqV7nEUu/gamelist_2?node-id=0%3A1
