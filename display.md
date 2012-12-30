---
layout: dinky
menu_title: Map display
order: 11
---

# Feature 1: Map display

In this section, you'll write the initialization code to display a map in the right column of
the main page.

## Map viewer

We've chosen [Leaflet](http://leafletjs.com/), developed by [CloudMade](http://cloudmade.com/).

## Map tiles

Leaflet needs a backend to retrieve the map tiles from. CloudMade provide their own tiles
API; their free plan allows up to
[250,000 tiles per month](http://support.cloudmade.com/forums/web-maps-studio/posts/4135/show).

You can also retrieve tiles from other APIs. We'll try two alternatives:

* OpenStreetMap. Note that for a real app you should not use their servers directly
  (see [tiles usage policy](http://wiki.openstreetmap.org/wiki/Tile_usage_policy));
* MapQuest. Their free plan has no preset limits but they reserve the right to block abusers
  (for heavy use, consider a
  [paid plan](http://devblog.mapquest.com/2011/11/17/no-preset-limit-on-free-map-api-transactions/)).

## Code!

Open `main.js`; it defines a JQuery callback that is launched at page load. Locate the
`init_map` function. You can see that the configuration for OpenStreetMap and MapQuest are
already provided.

Initialize the map as explained in the
[Leaflet quick start tutorial](http://leafletjs.com/examples/quick-start.html)
(scroll down to "Setting up the map", the preparation steps have already been taken care of).

In our example we'll be exploring Paris; to get a nice initial view, use
latitude = 48.856583, longitude = 2.347641 and zoom level = 11.

Make sure that `init_map` returns the newly created object, it gets affected to a top-level
variable that will be used later.

Try the different tiles providers and keep the one you prefer.

## [View solution](https://github.com/olim7t/map-tutorial/commit/5f3daa0225103831e80895fe502b454cdb4d7763)

Next: [Feature 2: Manual selection](manual.html)