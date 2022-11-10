# Frontend

The frontend app is written in Vue2 as it allows for a nice modern, clean and modular approach to design reusable components to create complex web-application, which remain maintainable.

## Primary Sections

The application consists of three primary sections:

1. Editor
1. Catalog
1. Map-App

### Editor

The primary focus was to get the editor quickly up and running for the numismatists to create properties and coin types. The coin types that are created in the process are used as a basis for the catalog and the map-app.

# Maps

## Overlay

Overlay is a baseclass that is intended to streamline the leaflet overlay handling.
To create an overlay, you extend the class and overload all relevant methods. 
The class and it's associated methods are displayed in the next image.

![overlay png](./img/overlay.png)

## Data Persistency

Many options of the application are stored in local storage and also 
can be overwitten by using query parameters (which are also used to make the 'share' link possible). 