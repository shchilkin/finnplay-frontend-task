# Deployment

## Docker

Docker support is added for production deployment on a VPS. The expected deployment flow is:

1. GitHub Actions builds the Docker image from [../Dockerfile](../Dockerfile).
2. GitHub Actions publishes the image to GitHub Container Registry.
3. The VPS runs the published image through [../coolify.compose.yml](../coolify.compose.yml).

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

Open `http://localhost:3010`.

You can also use Docker Compose for local production-image verification:

```sh
docker compose -f docker-compose.local.yml up --build
```

The Docker image runs one Express server. It serves:

- the React production build from `client/dist`
- the API under `/api`
- the health check at `/health`

## Docker Image Publishing

Docker images are published by [../.github/workflows/docker-publish.yml](../.github/workflows/docker-publish.yml).

Tags:

- `development` for pushes to the `development` branch
- `latest` for pushes to the `main` branch
- `sha-<commit>` for every published image

## VPS Deployment with Coolify

Use the Docker Compose build pack in Coolify and point it to [../coolify.compose.yml](../coolify.compose.yml). The compose file pulls the published GHCR image instead of building on the VPS.

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
