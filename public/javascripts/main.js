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

    var init_map = function () {
        var open_street_map_config = {
            tilesUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subDomains: ['a', 'b', 'c'],
            attribution: 'Data, imagery and map information provided by ' +
                '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>'
        };
        var map_quest_config = {
            tilesUrl: 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
            subDomains: ['otile1', 'otile2', 'otile3', 'otile4'],
            attribution: 'Data, imagery and map information provided by ' +
                '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, ' +
                '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>'
        };

        with (map_quest_config) {
            var result = L.map('map').setView([48.856583, 2.347641], 13);
            L.tileLayer(tilesUrl, {
                maxZoom: 18, attribution: attribution, subdomains: subDomains
            }).addTo(result);
            return result;
        }
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

    // Updates the yellow section under 'My location'
    var display_coordinates = function () {
        var latlng = my_location_marker.getLatLng();
        coordinates.html(latlng.lat + ", " + latlng.lng);
    };

    var set_my_location = function () {
        var latlng = to_latlng.apply(this, arguments);
        if (typeof my_location_marker === 'undefined') {
            my_location_marker = L.marker(latlng).addTo(map);
            my_location_marker.dragging.enable();
            my_location_marker.on('drag', display_coordinates);
        } else my_location_marker.setLatLng(latlng);

        display_coordinates();
    };

    var detect = (function () {
        var show_error = function (text) {
            detect_alert_text.html(text);
            detect_alert.show();
        };

        return function () {
            /*
             * TODO feature 4: autodetection.
             *
             * Perform HTML5 geolocation here.
             */
        };
    })();

    var clear_locations = function () {
        locations.empty();
    };
    clear_locations_button.click(clear_locations);

    var search = (function () {

        return function () {
            var q = locations_field.val().trim();
            if (q.length > 0) {
                /*
                 * TODO feature 5: address search
                 *
                 * Query Nominatim and display the results here.
                 */
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

        return function () {
            /*
             * TODO feature 3: highlights search.
             *
             * Query the backend and display the results here.
             */
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