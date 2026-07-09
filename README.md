# Finnplay Test Task

Full-stack React and Node.js application for filtering games by name, provider, and group.

## Project Structure

- `client` - React application
- `server` - Node.js API
- `shared` - shared TypeScript types used by the client and server
- `data.json` - initial in-memory catalog data

## Technical Decisions

- TypeScript is used across the repository because the task explicitly values typed code and the client and server use the same data shapes.
- Zod is used for runtime schema validation. Shared TypeScript types are inferred from Zod schemas so the validated data shape and static types stay aligned.
- npm workspaces are used to keep the client, server, and shared package in one repository with one lockfile and one install command.
- The Oxc toolchain is used for code quality:
  - `oxfmt` formats the codebase.
  - `oxlint` catches common JavaScript and TypeScript issues.
- Lint rules start with a conservative baseline and can be tightened as the client and server code grow.
- `data.json` is treated as source task data and is excluded from automatic formatting to avoid noisy fixture-only changes.

## Development

Install dependencies:

```sh
npm install
```

Run checks:

```sh
npm run check
```

## Design

Figma design: https://www.figma.com/file/totoTYpycpBnizdqV7nEUu/gamelist_2?node-id=0%3A1
