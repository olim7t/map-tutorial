---
layout: dinky
menu_title: Autodetection
order: 14
---

# Feature 4: Autodetection

Another way to provide a position is to detect it automagically using HTML5's geolocation
feature ("Detect" tab in the left column).

*If you are not located in Paris, this feature will not work well with the example
highlights; you could add your own in the database (in general, Wikipedia has the GPS
coordinates of interesting places).*

## Code!

[This page][dive] has a nice introduction to geolocation.
You will need Modernizr to test your browser's capabilities; it's already included in the
project.

Reuse `set_my_location` to update the marker (`to_latlng` can work with the coordinates
returned by the HTML5 API).

A lot can go wrong with geolocation; use the provided `show_error` function to display a
message in an alert div.

## For extra credits

Recenter the map if geolocation yields a position outside of the current view.

<a href="#" class="more_help" id="more_help_recenter">More help</a>
<div markdown="1" class="more_help" id="more_help_recenter_contents">
Check the [Map methods][leaflet] in the Leaflet API: `getBounds` gives you an object to check
inclusion, and `setView` a way to recenter.

Add your code in `set_my_location`, so that it's also executed for the last feature.
</div>

## [View solution][solution]

Next: [Feature 5: Address search](addresses.html)

[dive]: http://diveintohtml5.info/geolocation.html
[leaflet]: http://leafletjs.com/reference.html#map-set-methods
[solution]: https://github.com/olim7t/map-tutorial/commit/31e6ac56265deaea0bce6d997054621d18a32ee9