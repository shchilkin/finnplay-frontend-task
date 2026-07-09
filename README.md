# Finnplay Test Task

Full-stack React and Node.js application for filtering games by name, provider, and group.

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
- Client code is grouped by feature (`auth`, `player`) so API calls, hooks, and UI components stay close to the behavior they support.
- The login and player views use local component composition instead of a UI library, matching the task restriction and keeping the implementation close to the Figma design.
- The catalog defaults to A-Z sorting so the initial game list is deterministic and easy to scan.
- Multiple selected values inside one filter criterion use OR semantics, while different criteria are combined with AND semantics.

### Server

- The server is built with Express because the API surface is small and does not require a heavier framework.
- `tsx` is used for local TypeScript development so the server can run without a separate build step.
- The server validates `data.json` with the shared Zod schema on startup and fails fast if the catalog data is invalid.
- Player sessions are stored in memory and identified by an `httpOnly` session cookie, matching the task requirement without adding a database.
- A lightweight `/health` endpoint is included for future container health checks.

### Quality

- The Oxc toolchain is used for code quality:
  - `oxfmt` formats the codebase.
  - `oxlint` catches common JavaScript and TypeScript issues.
- Vitest is used as the shared test runner across workspaces, with Supertest covering Express routes without starting a real HTTP port.
- React Testing Library, user-event, jest-dom, and jsdom are used for client component tests that exercise UI behavior through accessible DOM queries.
- Browser-mode or end-to-end tests are deferred until the game catalog and filtering UI exist, where real browser layout and responsive behavior matter more.
- Lint rules start with a conservative baseline and can be tightened as the client and server code grow.

## Development

Install dependencies:

```sh
npm install
```

Run the server and client together:

```sh
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:3010`

Run checks:

```sh
npm run check
```

## Design

Figma design: https://www.figma.com/file/totoTYpycpBnizdqV7nEUu/gamelist_2?node-id=0%3A1
