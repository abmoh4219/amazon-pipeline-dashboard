<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Amazon Pipeline Dashboard — Backend (NestJS)

This folder contains the backend API for the Amazon Pipeline Dashboard. It's a small NestJS application that scrapes product details and stores them in Postgres.

## Quickstart

Prerequisites:
- Node.js >= 18
- Docker & Docker Compose (recommended for local development)

1) Copy environment variables

```bash
cd backend
cp .env.example .env
# then edit .env to set DB credentials and SCRAPINGBEE_API_KEY
```

2) Start with Docker Compose (Postgres + backend)

```bash
docker-compose up --build -d
```

3) Trigger scraping (HTTP endpoint)

```bash
curl -X POST http://localhost:3000/products/scrape-by-asins
```

4) View products

```bash
curl http://localhost:3000/products
```

## Important notes

- The app uses TypeORM with `synchronize: true` for convenience in development. For production use migrations instead.
- The Postgres service uses a named Docker volume (`postgres_data`) so data persists across container restarts. Running `docker-compose down -v` will remove the DB volume and erase data.
- The scraper uses ScrapingBee (set `SCRAPINGBEE_API_KEY` in your `.env`). If pages return empty content or prices are `0.0`, check the backend logs to see the scraped raw HTML or price parsing debug output.

## Local development without Docker

```bash
cd backend
npm install
npm run start:dev
```

Then trigger the scraping endpoint as above.

## Helpful commands

- Rebuild containers: `docker-compose up --build -d`
- Stop and remove containers (keep volumes): `docker-compose down`
- Stop and remove containers + volumes (destroy DB): `docker-compose down -v`
- Inspect Postgres container: `docker-compose exec postgres psql -U "$DB_USER" -d "$DB_NAME"`

## Files of interest
- `src/products/scraper.service.ts` — scraping logic and price parsing.
- `src/products/product.entity.ts` — TypeORM entity for products.
- `docker-compose.yml` — Postgres + backend configuration.

If you want, I can add a sample `.env.example` to this folder or a short troubleshooting section. Let me know what you'd like included.

---
Edited to include project-specific usage and troubleshooting tips.
## License
