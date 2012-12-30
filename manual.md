---
layout: dinky
menu_title: Manual selection
order: 12
---

# Feature 2: Manual selection

Our app lets the user provide their position in different ways. The first one is to click on
the map, which will display a marker and update the coordinates display (the yellow section
under "My location". If the user clicks a second time, we'll move the existing marker.

## Code!

The map's click event is bound to the `set_my_location` function. The
[Leaflet quick start tutorial](http://leafletjs.com/examples/quick-start.html)
has a section on markers to get you started.

Use the top-level `my_location_marker` variable to keep track of the marker once it has been
created. Two helper functions are provided:

* `display_coordinates` updates the latitude and longitude in the left column;
* `to_latlng` converts the click event into a `LatLng` object that will be passed to the
  marker. It's important to use it here, because `set_my_location` will be called with other
  types of arguments in the next features.


<a href="#" class="more_help" id="more_help_1">More help</a>
<div markdown="1" class="more_help" id="more_help_1_contents">
`set_my_location` and `to_latlng` are variable-arguments methods: they don't declare
their arguments in their signature, you access them through the `arguments` array.

To pass the variable-argument list from one function to the other, use:

    var latlng = to_latlng.apply(this, arguments);
</div>

## Extra points

Make the marker draggable and update the position in real-time when it moves.

<a href="#" class="more_help" id="more_help_2">More help</a>
<div markdown="1" class="more_help" id="more_help_2_contents">
Look into the [marker API](http://leafletjs.com/reference.html#marker). Bind a callback
to the `drag` event of the marker (using the same syntax as when we bind `set_my_location`
to the map).
</div>


## [View solution](https://github.com/olim7t/map-tutorial/commit/8b75923fbb0717c828c55501209a0c12bee4ca93)

Next: [Feature 3: Highlights search](highlights.html)