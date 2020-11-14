# simonyi-konyvtar

## Development

### Prerequisites

- Install nodejs (v12+) and yarn
- Install postgresql
- Register an AWS account for S3
- Fill .env with real values

### Setup

- Create a postgres database and paste the `DATABASE_URL` connection string to `prisma/.env`
- Run migrations with `npx prisma migrate up --experimental`

### Running

Run `yarn dev` for a dev server

## Deploy

You can deploy this app to Heroku or any service that can host a NextJS app
