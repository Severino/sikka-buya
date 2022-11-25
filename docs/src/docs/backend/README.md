# Backend

The backend is an express.js server that receives the GraphQL requests and 
returns the appropriate data from a PostgreSQL database. 

## Changing The Database

The project used [db-migrate](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/installation/) for the migration, but due to some significant limitations it was not continued. 

The current system is using a schema file which is used for setup and testing, that is located at:
"backend/schema.sql"

Migrations that need to be made to the production version are stored inside "backend/migrations". Those can be applied to the current system by running `npm run migrate` from the root folder of the project. Or running the migrate script from the backend folder.

Migrations can be run on the test database by calling the migrate script from within the test folder.


## Scripts


