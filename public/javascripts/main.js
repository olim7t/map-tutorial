$(document).ready(function () {
    var coordinates = $('#coordinates')
        , detect_button = $('#detect_button')
        , detect_alert = $('#detect_alert')
        , detect_alert_text = $('#detect_alert_text')
        , locations_form = $('#locations_form')
        , locations_field = $('#locations_field')
        , locations = $('#locations')
        , clear_locations_button = $('#clear_locations_button')
        , search_highlights_button = $('#search_highlights_button')
        , clear_highlights_button = $('#clear_highlights_button')
        , radius_input = $('#radius')
        , radius_display = $('#radius_display')
        ;

    var map, my_location_marker, highlight_markers = [];

    /*
     * TODO create map on the HTML element with id 'map'.
     * http://leafletjs.com/examples/quick-start.html
     *
     * To get a nice view of Paris, use coordinates [48.856583, 2.347641] with a zoom level of 13.
     *
     * Try OpenStreetMaps and MapQuest tiles, keep the ones you prefer.
     */
    var init_map = function () {
        var result = L.map('map').setView([48.856583, 2.347641], 13);

        var tilesUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
            subDomains = ['otile1', 'otile2', 'otile3', 'otile4'],
            attribution = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';

        L.tileLayer(tilesUrl, {
            maxZoom: 18, attribution: attribution, subdomains: subDomains
        }).addTo(result);

        return result;
    };

    // Generic function to coerce various incoming formats to Leaflet's LatLng type
    var to_latlng = function () {
        var arg0 = arguments[0];
        if (arg0.hasOwnProperty('latlng')) // Leaflet event
            return arguments[0].latlng;
        else if (arg0.hasOwnProperty('latitude')) // HTML5 coords
            return new L.LatLng(arg0.latitude, arg0.longitude);
        else if (arg0 instanceof Array) // MongoDB position received from server side
            return new L.LatLng(arg0[1], arg0[0]);
        else // latitude, longitude
            return new L.LatLng(arg0, arguments[1]);
    };

    var display_coordinates = function () {
        var latlng = my_location_marker.getLatLng();
        coordinates.html(latlng.lat + ", " + latlng.lng);
    };

    /*
     * TODO update marker on map and display coordinates.
     */
    var set_my_location = function () {
        var latlng = to_latlng.apply(this, arguments);
        if (typeof my_location_marker === 'undefined') {
            my_location_marker = L.marker(latlng).addTo(map);
            my_location_marker.dragging.enable();
            my_location_marker.on('drag', display_coordinates);

            search_highlights_button.removeAttr('disabled');
            clear_highlights_button.removeAttr('disabled');
        } else {
            my_location_marker.setLatLng(latlng);
        }
        // Recenter if new location is outside of the current view
        if (!map.getBounds().contains(latlng)) map.setView(latlng, map.getZoom());
        display_coordinates();
    };

    var detect = (function () {
        var show_error = function (text) {
            detect_alert_text.html(text);
            detect_alert.show();
        };

        /*
         * TODO perform geolocation (use Modernizr to check if available)
         * http://diveintohtml5.info/geolocation.html
         *
         * Update location if it succeeds, show error otherwise.
         *
         * Optional: handle case where location is outside of displayed map (in set_my_location).
         * see Map.getBounds().contains(), Map.setView in Leaflet doc
         */
        return function () {
            if (Modernizr.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    set_my_location(position.coords);
                }, function (err) {
                    show_error(err.code + ': ' + err.message);
                });
            } else show_error('Not supported on your browser');
        };
    })();

    var clear_locations = function () {
        locations.empty();
    };
    clear_locations_button.click(clear_locations);

    /*
     * TODO send an AJAX query to Nominatim
     * http://wiki.openstreetmap.org/wiki/Nominatim
     *
     * Display the results in the search_results list
     */
    var search = (function () {
        var on_result_click = function (event) {
            var target = $(event.target)
                , latitude = target.data('latitude')
                , longitude = target.data('longitude');
            set_my_location(latitude, longitude);
            return false;
        };

        var display_one_result = function (place) {
            var box = place.boundingbox
                , latitude = (parseFloat(box[0]) + parseFloat(box[1])) / 2
                , longitude = (parseFloat(box[2]) + parseFloat(box[3])) / 2;
            locations.append(
                $('<li></li>').append(
                    $('<a href="#"></a>')
                        .html(place.display_name)
                        .data('latitude', latitude)
                        .data('longitude', longitude)
                        .click(on_result_click)
                )
            );
        };

        var display_all_results = function (json) {
            clear_locations();
            json.forEach(display_one_result);
        };

        return function () {
            var q = locations_field.val().trim();
            if (q.length > 0) {
                var url = 'http://nominatim.openstreetmap.org/search?q='
                    + encodeURIComponent(q)
                    + '&format=json';
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    jsonp: 'json_callback'
                }).done(display_all_results);
            }
            return false;
        };
    })();

    var clear_highlights = function () {
        var marker;
        while (marker = highlight_markers.shift()) {
            marker.closePopup();
            map.removeLayer(marker);
        }
    };

    var search_highlights = (function () {
        var highlight_icon = L.icon({
            iconUrl: '../img/grey-marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: '../img/marker-shadow.png',
            shadowSize: [41, 41]
        });

        var display_one_highlight = function (highlight) {
            var distance = Math.ceil(highlight.dis)
                , name = highlight.obj.name
                , latlng = to_latlng(highlight.obj.loc);

            var marker = L.marker(latlng, {icon: highlight_icon}).addTo(map);
            marker.dragging.disable();
            marker.bindPopup('<b>' + name + '</b> (' + distance + ' meters)');

            if (highlight_markers.length == 0) marker.openPopup();

            highlight_markers.push(marker);
        };

        var display_all_highlights = function (json) {
            clear_highlights();
            json.forEach(display_one_highlight);
        };

        return function () {
            var radius = radius_input.val()
                , latitude = my_location_marker.getLatLng().lat
                , longitude = my_location_marker.getLatLng().lng
                , url = '/highlights/' + longitude + ';' + latitude + ';' + radius;
            $.ajax({ url: url }).done(display_all_highlights);
        };
    })();

    map = init_map();

    // Wire features:
    // Manual
    map.on('click', set_my_location);
    // Detect
    detect_button.click(detect);
    // Search
    locations_form.submit(search);
    // Highlights
    search_highlights_button.click(search_highlights);
    clear_highlights_button.click(clear_highlights);

    // Sync radius slider with its display field
    radius_input.change(function () {
        radius_display.val(radius_input.val());
    }).change(); // trigger event to update at page load
});