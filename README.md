## Prerequisites

**Postgresql user must have SUPERUSER role to apply the add_postgis migration. This role can be removed after applying the migration. Otherwise you can login as a superuser in pgsql and run `CREATE EXTENSION postgis;`, the add_postgis migration will automatically be skipped** ([source](https://stackoverflow.com/questions/16527806/cannot-create-extension-without-superuser-role))

- NodeJS 19 (20 breaks ts-node somehow)
- Setup a user and a database in postgresql ([ubuntu doc](https://doc.ubuntu-fr.org/postgresql))
- Install PostGIS ([guides](https://postgis.net/documentation/getting_started/#installing-postgis))

# Install

- Copy/paste/rename .env.example to .env
- Configure the postgresql url in .env with the appropriate user, password and dbname
- `pnpm i`
- `pnpm db:seed`

Run with `pnpm dev`
