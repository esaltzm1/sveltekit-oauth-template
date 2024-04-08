## get up and running

install dependencies:

```bash
npm install
```

run dev server:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Setting up local DB

### Install Postgres

We use Postgres for our database. to run things locally, you'll need postgres installed. If you do not have it already installed, you can install it using their website [here](https://www.postgresql.org/download/).

Ensure you install at least version 15.

### Configure Postgres Database

Start your postgres server. If you are using the Postgres GUI, open the GUI and click the start button.

Create a new database named DB_NAME:

```
CREATE DATABASE DB_NAME;
```

If you're using the Postgres GUI, double-click on an existing database to open a new terminal window, then paste and run the command.

After creating the database, update the `DATABASE_URL` variable in the `.env` file with your new database's URL. It typically follows this format:

```
postgresql://[USERNAME]:node_password@localhost:[PORT]/DB_NAME
```

You can find your username with the `whoami` command in your terminal. The port of the server should be displayed in the postgres GUI. if you're having trouble figuring out the `DATABASE_URL` don't worry. check in w a teammate and we'll figure it out.
