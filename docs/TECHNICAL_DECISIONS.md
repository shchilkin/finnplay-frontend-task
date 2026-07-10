# Technical Decisions

## Repository

- TypeScript is used across the repository because the task explicitly values typed code and the client and server use the same data shapes.
- npm workspaces keep the client, server, and shared package in one repository with one lockfile and one install command.

## Project Structure

- `client` - React application
- `server` - Node.js API
- `shared` - shared TypeScript types used by the client and server
- `data.json` - initial in-memory catalog data

## Shared Data

- Zod is used for runtime schema validation. Shared TypeScript types are inferred from Zod schemas so the validated data shape and static types stay aligned.
- `data.json` is treated as source task data and is excluded from automatic formatting to avoid noisy fixture-only changes.

## Client

- The client is built with Vite, React, and TypeScript to keep the frontend setup small and focused.
- The Vite dev server proxies `/api` requests to the Node.js server, so client code can call the API through same-origin paths during local development.
- Client code is grouped by feature (`auth`, `player`, `catalog`) so API calls, hooks, and UI components stay close to the behavior they support.
- The login and player views use local component composition instead of a UI library, matching the task restriction and keeping the implementation close to the Figma design.
- The catalog defaults to A-Z sorting so the initial game list is deterministic and easy to scan.
- Multiple selected values inside one filter criterion use OR semantics, while different criteria are combined with AND semantics.
- The catalog page renders explicit loading, error, and empty states because API data is loaded asynchronously and filters can legitimately produce no visible games.
- Catalog errors expose a retry action, while empty filtered results stay focused on the message because reset is already available in the filter panel.
- Game cards try the large cover first, fall back to the lower-resolution cover, and finally show a text placeholder if both image URLs fail.
- The player navbar and desktop filter panel are sticky so filtering controls stay reachable while scrolling a long game list. The filter panel is not sticky on mobile to preserve vertical space.
- The mobile breakpoint is `428px`. On mobile, the game list always uses 2 columns and the columns control is hidden.

## Server

- The server is built with Express because the API surface is small and does not require a heavier framework.
- `tsx` is used for local TypeScript development so the server can run without a separate build step.
- The production Docker image runs a compiled server with `node` and serves the compiled React app from the same Express process.
- The server validates `data.json` with the shared Zod schema on startup and fails fast if the catalog data is invalid.
- Player sessions are stored in memory and identified by an `httpOnly` session cookie, matching the task requirement without adding a database.
- The catalog API checks the session before returning game data, so anonymous requests receive `401`.
- A lightweight `/health` endpoint is included for container health checks.
- The catalog API supports non-production failure and delay modes through environment variables so loading and error states can be checked manually without changing client code.

## Quality

- The Oxc toolchain is used for code quality:
  - `oxfmt` formats the codebase.
  - `oxlint` catches common JavaScript and TypeScript issues.
- Vitest is used as the shared test runner across workspaces, with Supertest covering Express routes without starting a real HTTP port.
- React Testing Library, user-event, jest-dom, and jsdom are used for client component tests that exercise UI behavior through accessible DOM queries.
- Browser-mode or end-to-end tests are deferred because the current test suite already covers the main state and filtering behavior for this test task.
- Lint rules start with a conservative baseline and can be tightened as the client and server code grow.

## Known Limitations and Tradeoffs

- Sessions are stored in memory according to the task requirement, so they are cleared when the server restarts.
- No database is used according to the task requirement. Initial data is loaded from `data.json` and kept in memory.
- Tablet-sized layouts are functional, while the main visual tuning follows the supplied desktop and `428px` mobile designs.
- Some high-resolution image URLs from `data.json` are unavailable on the CDN. Game cards try the high-resolution cover first, fall back to the lower-resolution cover, and then show a text placeholder when both image URLs are unavailable.

## Design

Figma design: https://www.figma.com/file/totoTYpycpBnizdqV7nEUu/gamelist_2?node-id=0%3A1
