# Buyiden Project - Backend

It's a [nodejs](https://nodejs.org/) based application which uses runs an [expressjs](https://expressjs.com/) webserver. The backend manages the connected [PostgeSQL](https://www.postgresql.org/) database. [GraphQL](https://graphql.org/) serves as the interface between the frontend and the backend.


# Setup

## Requirements

- nodejs (16)
- postgresql (12/13)

## Defining environment variables

We provide a *.env.example* file that may serves as a template for your .env file, otherwise you can delete it. The .env file is responsible for your environment specific setup, like specifying the port, database address and location and their respective credentials. Your .env file should look like the following

```ini
EXPRESS_PORT=4000
DB_USER=user
DB_HOST=localhost
DB_NAME=your_database
DB_PASSWORD=password
DB_PORT=5432
JWT_SECRET=ENTER_YOUR_SECRET
MAX_SEARCH=20
```

## Create .pgpass file

The *.pgpass* file (*pgpass.conf* on windows) contains the database information which you also set in the .env file.
It's highly recommended to use a pgpass file to run the provided scripts!

To simple setup the pgpass for your system you can run the script located at `./scripts/generate_pgpass.js`

```bash
node ./scripts/generate_pgpass.js  
```

## Run Initialization

 This command will install the node modules and it will run a script that creates the database and the database structure. 

 **This script will only work with the pgpass setup correctly.**


```bash
npm run init
#Is equivalent of running:
yarn install
node scripts/setup.js
``` 


## Run the Backend 

The backend can simply be run by invoking the index.js.

```bash
node index.js
# alternatively there is the command:
npm run serve
```

There are various methods to keep a process running in the background when leaving the terminal. Do whatever you feel comfortable with.
This example shows how to keep the server running with the process management tool PM2.

### Install 
```
npm i pm2 -g
```

### Run
```
pm2 start node index.js --log log.txt
```

### Remove All

The fastest and most simple way to shotdown your backend process is:

```
pm2 delete all
```

However, you should be certain that there are no other PM2 processes running.
You can check all running processes with:
```
pm2 ls
```

### Checking the running instance

To reatach the running instance you can run:

```
pm2 monit
```

## Running alongside Apache

To run the backend application in an apache environment, we need to use the apache server as a proxy.

_Note: Check the port that is used. When the error occurs at port 443, make sure to edit the VirtualHost, that serves at 443._

```ini
ProxyPreserveHost On

ProxyPass /graphql http://127.0.0.1:4000/graphql
ProxyPassReverse /graphql http://127.0.0.1:4000/graphql
```

In apache2 the modules get loaded seperately with:
```ini
a2enmod proxy  # To enable the module
a2dismod proxy # To disable the module
```

After changes made to the apache config, make sure to restart the apache service

```ini
 sudo systemctl restart apache2
```
## Endpoints

The endpoint is found at *<your_server>:<port>/graphql


# Database Management

To create a backup of the data inside the database, you can simply run:

```bash
npm run db:backup
```

If you change the schema of the database, then you may want to update your `./backend/schame.sql` file. This file can be exported using:

```bash
npm run db:backup:schema
```
