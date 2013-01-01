---
layout: dinky
menu_title: Address search
order: 15
---

# Feature 5: Address search

Our last feature lets users specify their position by searching an address ("Search" tab in the left
column). The results are displayed as a list of links; clicking a link updates the marker on the map.

## Code!

In `main.js`, implement `search` to send an AJAX query to the [Nominatim REST API][nom].

*For real-life use, read the [Nominatim usage policy][nom_policy] and consider setting up your own
instance.*

This request is subject to the [same origin policy][sop], so it requires [JSONP][].

<a href="#" class="more_help" id="more_help_query">More help</a>
<div markdown="1" class="more_help" id="more_help_query_contents">
Thankfully, JQuery makes JSONP quite easy.
Use the same syntax as in feature 3, adding the attributes `dataType: 'jsonp'` and
`jsonp: 'json_callback'` (the former is the name of the query parameter where JQuery stores
the name of the callback that must be invoked in the returned script).
</div>

Build the list of results from the JSON response and append them to the DOM.

<a href="#" class="more_help" id="more_help_dom">More help</a>
<div markdown="1" class="more_help" id="more_help_dom_contents">
Using the `ul` tag's predefined JQuery selector:

    locations.append(
      $('&lt;li&gt;&lt;/li&gt;').append(
        $('&lt;a href='#'&gt;&lt;/a&gt;')
          .html(...)
          .click(...));
</div>

To remember the coordinates of each result, you can use JQuery's [data][] mechanism.

<a href="#" class="more_help" id="more_help_data">More help</a>
<div markdown="1" class="more_help" id="more_help_data_contents">
This stores data in the DOM node, which can be retrieved in the click handler:

    $('&lt;a href='#'&gt;test&lt;/a&gt;')
      .data('foo', 'bar')
      .click(function(event) {
        alert($(event.target).data('foo'));
        return false;
      })
</div>

## [View solution][solution]

[nom]: http://wiki.openstreetmap.org/wiki/Nominatim#Search
[nom_policy]: http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy
[sop]: http://en.wikipedia.org/wiki/Same_origin_policy
[jsonp]: http://en.wikipedia.org/wiki/JSONP
[data]: http://api.jquery.com/data/
[solution]: https://github.com/olim7t/map-tutorial/commit/ceeb9c3e624695f731b795b0ba8df4d9c6f0c2d2