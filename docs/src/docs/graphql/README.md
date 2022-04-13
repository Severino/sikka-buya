# GraphQL

## Overview

GraphQL is the interface between the frontend and the backend. 
It has a very neat query language, to only receive information that
you need. Being really efficient on the bandwidth side of things.

## Endpoint

By default graphQL is served on port 3000. 
You should configure your Webserver to serve the
endpoint at https://_YOUR_DOMAIN_/graphql 

## GraphiQL

When developing, you should enable the graphiQL tool to have access to an interactive tool to test queries and responses. It's exposed directly on the graphql endpoint: https://_YOUR_DOMAIN_/graphql.

One caveat is that the application uses JWT tokens for authentification. Mutations and some other operations are only allowed for users that are logged in (a.k.a. have a valid JWT token). To solve this issue, you may use the [graphiql-app](https://github.com/skevy/graphiql-app) that wraps the graphiQL interface into a standalone app and allows the user to insert his JWT token as a header:

```json
{
"auth": "your_jwt_token"
}
```