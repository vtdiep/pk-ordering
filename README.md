
# PKO
## Description
Online Ordering application using 
[Nest](https://github.com/nestjs/nest) framework, with React & Postgres.

## Pre-Requisites
- node 14+ (from create-react-app requirement)
- postgres database created
- .env file  populated
- make sure citext extension is installed 
```sql
  -- in psql:
  create extension citext;
```
- create the database tables from prisma schema
```bash
npx prisma db push
```

- seed database
```bash
# run from top level folder
npx knex seed:run --knexfile ./src/knexfile
```

- create views
```bash
# run from top level folder 
npx knex migrate:latest  --knexfile ./src/knexfile.ts
```
## Installation

```bash
npm install
# repeat inside client folder
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Important Notes / Known Issues
- Change the default ports! <br/>
Both nestjs and CRA use port 3000 as the default. Interestingly, both can be run at the same time if CRA is launched before nestjs. It seems as though nestjs(express/node) binds to all/any available interfaces, according to [this](https://github.com/expressjs/express/issues/3952). So what seems to be happening is that CRA binds to localhost and the ipv4 address first, and then nestjs binds to ipv6. It should be noted that CRA complains if nestjs is launched first, followed by CRA.

- SKIP_PREFLIGHT_CHECK=true <br/>
The nestjs cli commands use versions of jest, eslint, etc that are newer than the version that CRA is using; This .env variable should be set in the CRA folder to stop CRA from complaining.<br/>
Issue source: [related issue](https://github.com/facebook/create-react-app/issues/6390) [orig. issue](https://github.com/facebook/create-react-app/issues/1795)

## When schema on database changes
```bash
npx prisma db pull (--force)
npx prisma generate

# run from top level
-npx knex seed:run --knexfile ./src/knexfile
```

## Development Setup
```bash
# set up husky
npm run prepare

# OSX - permissions might beed to be set for husky
# https://github.com/typicode/husky/issues/1177
chmod ug+x .husky/*
```