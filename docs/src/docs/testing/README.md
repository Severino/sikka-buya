# Testing

There are currently two levels of testing that take place to provide a minimal 
safety net for avoiding data loss when changes are pushed to the production version: api testing and end-to-end tests.

## API Testing

The api is (partially) tested using a mocha/chai setup with a grunt task runner. 
The runner starts a testing-backend, applies the "backend/schema.sql" and adds a bunch of sql files of mockdata ("test/data")
and runs the test ("test/tests"). 

The test can be run from root using the command `npm run test:api`.

These tests are essential to ensure that mutations are blocked from public access and that modifications via the GraphQL api
work as intended, adding or modifying data correctly, without damaging any existing data.

### Updating the 'schema.sql'

Using the backup script, you can either use run  or run the backup script directly with the `--mode=backend-schema` parameter:

```
npm run update-schema
node ./scripts/database_backup.js --mode=backend-schema
```

### Promises

When testing promises, which can be done using 'chai-as-promised'. It's important to 
await the expect statement to get the right result (alternatively you may return it). E.g. the first example will always return true, wheras the second example will run as expected.

```js
    ...
    //This will always be true, no matter if the request fails or not!
    expect(request()).to.be.fulfilled

    //This is the right way to do it and only is true when the request was resolved properly.
    await expect(request()).to.be.fulfilled
    // ... or ...
    return expect(request()).to.be.fulfilled
```

### FAQ

**Suddenly many tests are failing.**

_You may have changed the backend and need to update the "backend/schema.sql" file._

## End-To-End Testing

As data is manipulated mostly solely using the UI, the input mask has to show the accurate data, to prevent overwriting
incorrectly displayed data. The project uses cypress ("test/cypress") to test that the UI, inputs and outcomes does work
as expected from an UI point of view.

The interactive test suite can be run via `test:cypress`. An automated full test can be run using `npm:cypress:run`. 

## Testing Backend

Note that for both tests, a 'testing-backend' will be run, serving the application API and an additional endpoint at `/test-database`.
This endpoint accepts a method argument for specific commands useful when developing/debugging:

| method | effect |
| --- | --- |
| ResetDatabase | Resets the database to the schema specified in "backend/schema.sql" |
| MountMinimalDatabase | Resets the database and applies a minimal testing 'image' located at `test/mockdata/minimal-filled-database.sql` |
| MountMinimalDatabaseWithCreatedType | Same as above, but using `test/mockdata/minimal-filled-database-with-created-type.sql` |
