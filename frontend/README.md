# SIKKA-BŪYA - Frontend

The frontend is a [Vue.js v2](https://vuejs.org/) application. It contains a [Leaflet](https://leafletjs.com/) based map application to visualize data. A catalog to display the coinage, as known from other scientific documents. And a content-management layer for the editors to create and edit the catalog entries and their corresponding attributes (e.g. mint, material, persons, ...).
## Project setup

### Requirements

+ nodejs
+ yarn (optional)
+ [vscode](https://code.visualstudio.com/) (recommended IDE)
+ sikka-backend


The project is using yarn to manage dependencies (primarily because it is faster). You may use npm, but it may result in errors as the ones stored are from yarn.

Visual Studio Code is recommended, not only because it's awesome features (like multi-line editing) and extendability using plugins

**Setup the [sikka-buya backend](../backend/README.md) first before continuing!**

### Install Dependencies

Install yarn (if not installed yet)

```
npm install -g yarn
```

Install the dependencies with yarn.

```bash
yarn install
# alternatively (not recommended) you may use
# npm install
```

_Note: If you need to add dependencies make sure to use: `yarn add <your_dependency>`_

## Development

Normally, you will always run the frontend together with the backend. Therefore a task was created for vscode 

To run the frontend you must setup the project first and then run the project with the following command.

```
npm run serve
```

_Note: All changes will be live-reloaded. So you can just write your code and see the changes update in real-time._

## Deployment

To deploy the project on a UNIX based server, you can simply use the `deploy.sh` script:

```bash
...\sikka-buya\frontend> . deploy.sh
```



