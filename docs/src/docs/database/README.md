# Database

## Backup

In backend you may run one of the following commands to save the current state of the database to your user dir:


| Command | Note |
|-|-|
| db:backup | Exports data and schema* |
| db:export:data | Exports data only* |
| db:export:schema | Exports schema only* |
|  | _* Ignores the app_user column_ |


## Restore

To restore you can either use psql with the '<' operator. Or if it's a pg_dump file, then you can use pg_restore like this:

```cmd
pg_restore -c -d database -U user .\filename.ext
```




## **IMPORTANT: Creating Backups Production or Testing**

The `pg_dump` command exports a default header which contains a line that is:

```sql
...
SELECT pg_catalog.set_config('search_path', '', false);
...
```

**This line will break everything (at least inside of tests). And make you pull your hairs out!**
When the search_path is set to nothing, the database behaves at it has to readjust
to that situation leading to a situation, when you e.g. run a test, the test will 
fail but approximately a minute later all the queries will work again, making you
go crazy, while looking for the cause.

Simply delete that line and the search_path will contain the `public` schema
and everything will work smoothly!