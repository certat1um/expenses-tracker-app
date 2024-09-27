# Expenses Tracker Backend

## API techonology stack

- Express.js
- Typescript
- PostgreSQL
- Prisma
- Docker
- Eslint & Prettier

### Fill up .env file and install packages

Copy `.env.example` and rename it to `.env`. Fill up the data and install packages.

```bash
$ npm install
```

### Up docker containers

```bash
$ docker-compose up -d
```

### Prisma Database

Run docker container `postgres` which has been appeared after previous command. Migrate and seed starter data into your database.

```bash
$ npm run prisma:migrate-and-seed
```

### Develop

To launch the application, run the following command:

```bash
$ npm run dev
```
