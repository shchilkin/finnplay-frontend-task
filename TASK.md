# Finnplay Test Task for Front-End Developer

## Task

Develop an application that allows users to filter games by multiple criteria.

## Description

The application consists of server and client parts. The server implements an API to communicate with the client: authenticate users, transfer data, and related operations.

A user should log in as a player. After login, they should see an interface with a list of games and a game filter.

## Pages

### Login

Two users are allowed:

- `player1:player1`
- `player2:player2`

### Player View

The page displays the list of games and the game filter. If a filter is configured, only games that match the filter criteria should be displayed. If no filter is configured, all games should be displayed.

Games that do not belong to any group should not be displayed at all, even when the filter is not configured.

#### Possible Actions

1. Set filter
2. Set sorting
3. Set number of columns in the game list. This control is hidden on mobile, where the game list always uses 2 columns.
4. Reset filter

#### Filter Criteria

- game name
- game provider, multiple checkbox
- game groups, multiple checkbox

## Requirements

1. Client-side should be written using React. A starter kit such as Create React App or Vite can be used.
2. CSS or SCSS can be used for styles.
3. Interface should be responsive. Mobile breakpoint is `428px`.
4. Filtration should be implemented on the client.
5. Do not use any React UI libraries except `react-select`.
6. Server-side should be written on Node.js using any framework.
7. User sessions should be stored on the server, in memory.
8. No database is required. Keep all data in memory.
9. Using TypeScript will be considered a plus.
10. Post the code to GitHub or Bitbucket. Add a README explaining how to run the application.

## Initial Data and Design

- Initial data is in `data.json`.
- Figma design: https://www.figma.com/file/totoTYpycpBnizdqV7nEUu/gamelist_2?node-id=0%3A1
