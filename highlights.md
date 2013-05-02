---
layout: dinky
menu_title: Highlights search
order: 13
---

# Feature 3: Highlights search

Once the user has selected their position, they can search interesting locations within a
given radius. The results are displayed on the map with grey markers.

## Code!

The highlights are stored in MongoDB and exposed via a REST interface by the backend.
The frontend retrieves them with an AJAX request.

### Backend

Your goal is to make `highlight-test.js` pass (launch it with the `run_tests` script in the
root directory.

#### Index creation

First, open `db.js` and add the code to create a [geospatial index][index]
when the database is populated. If you need help with the Javascript API syntax, look
[here][js_api].

Note the call to `notify_db_ready()` when we are done initializing the database. It's
important that this function is called at the very last, so if you create a new callback,
move the call inside of it.

<a href="#" class="more_help" id="more_help_index">More help</a>
<div markdown="1" class="more_help" id="more_help_index_contents">
The default index options will do, so you just need to pass `{loc: '2d'}`.
</div>

#### Distance multiplier

MongoDB performs [distance computations][distance] with angles. Since our app uses meters,
we need a coefficient for the translation:

    <distance in meters> = distanceMultiplier * <angle>

Additionally, MongoDB uses radians, whereas our highlight coordinates are in degrees. We need
an extra factor for that.

This coefficient is defined in `highlight.js`. Initialize it with the appropriate formula.

<a href="#" class="more_help" id="more_help_distance">More help</a>
<div markdown="1" class="more_help" id="more_help_distance_contents">
As explained in the doc, the basic value is the earth radius, in our case in meters:
6&nbsp;378&nbsp;137. The coefficient to convert degrees in radians is π / 180; if we compute
with degrees our angles are too big, so our extra factor must make the multiplier smaller.
Therefore the formula is:

    distanceMultiplier = 6378137 * π / 180
</div>

#### Proximity query

Finally, update `highlight.js` with a [proximity query][proximity] that takes a position and a
radius, and returns the corresponding highlights with their relative distance.
The expected response format is:

    [
      { dis: <distance>,
        obj: { name: <place name>, pos: [<longitude>, <latitude>] }
      },
      ... // other objects
    ]

Note that **MongoDB stores coordinates backwards (longitude first)**. We keep that order in
the response, the conversion will be done on the client side.

The unit test should now pass.

<a href="#" class="more_help" id="more_help_query">More help</a>
<div markdown="1" class="more_help" id="more_help_query_contents">
The `db.collection.find` form won't work, because it doesn't return the distance. Use:

    db.command({
        geoNear: "highlights",
        near: [ x, y ],
        maxDistance: z,
        distanceMultiplier: d
    })

MongoDB does not apply the distance modifier to `maxDistance`, so convert the radius before
passing it in (`radius / distanceModifier`).

To build the response, simply extract the `results` subarray.
</div>

### Frontend

In `main.js`, update `set_my_location` to enable the highlights buttons as soon as we have a
position. Then, in `search_highlights`, clear the existing highlights (a helper function is
already provided), perform an AJAX query to the backend and display the results. All the
necessary JQuery selectors are defined at the top of `main.js`.

You can reuse `to_latlng` to convert the coordinates returned by the backend.

<a href="#" class="more_help" id="more_help_frontend">More help</a>
<div markdown="1" class="more_help" id="more_help_frontend_contents">
Use JQuery:

    $.ajax({ url: ... }).done(function(json) { ... });

In the done handler, create the markers like we did for the current position, and add them
to the top-level `highlights_markers` array.
</div>

## For extra credits

Add a popup displaying the name and distance of each highlight marker. Open the popup of the
closest marker.

<a href="#" class="more_help" id="more_help_markers">More help</a>
<div markdown="1" class="more_help" id="more_help_markers_contents">
The [Leaflet quick start tutorial][ll_tuto] also covers popups.

The closest highlight comes first in the backend response, so you can rely on the size of
`highlights_markers` to know when to open the popup.
</div>

## [View solution][solution]

Next: [Feature 4: Autodetection](autodetection.html)

[index]: http://docs.mongodb.org/manual/core/geospatial-indexes/
[js_api]: http://mongodb.github.com/node-mongodb-native/api-generated/collection.html#ensureindex
[distance]: http://docs.mongodb.org/manual/core/geospatial-indexes/#distance-calculation
[proximity]: http://docs.mongodb.org/manual/applications/geospatial-indexes/#proximity-queries
[ll_tuto]: http://leafletjs.com/examples/quick-start.html
[solution]: https://github.com/olim7t/map-tutorial/commit/f0c2bf131031697d06f2c30f604cc02f4518fbcc
