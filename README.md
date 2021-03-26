# Reddit Clone

## Description

Reddit Clone frontend and backend parts. </br>


**Technologies:** Next.js, NodeJS, PostgreSQL, Express, Typescript </br>
**Libraries:** class-validator, typeorm, typeorm-seeding, morgan </br>

## Installation

1. `npm install`
2. `npm run client:install`
3. Create `.env` file by `cp .env.example .env` command.
4. Go to client directory and create `.env` file by `cp .env.example .env.local` command.
5. Install PostgreSQL if you didn't do that yet.

## Running the app

```bash
# client development mode
$ npm run client

# server development mode
$ npm run server

# production mode
# before start you need to build the app
$ npm run server:prod
$ npm run client:prod

# build
$ npm run server:build
$ npm run client:build

# typeorm cli
$ npm run typeorm

# add mock data to db
$ npm run seed
```
