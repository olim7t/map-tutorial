var db_ref = require('./db');

/*
 * TODO initialize the constant such that:
 *      <distance in meters> = distanceMultiplier * <angle in radians>
 *
 * http://docs.mongodb.org/manual/core/geospatial-indexes/#distance-calculation
 *
 * Remember that we express longitude and latitude in degrees, not radians, so you'll need an extra coefficient.
 */
var earthRadiusInMeters = 6378137,
    distanceMultiplier = earthRadiusInMeters * Math.PI / 180;

// GET /highlights/:longitude;:latitude;:radius
exports.search = function (req, res) {
    var longitude = parseFloat(req.params.longitude)
        , latitude = parseFloat(req.params.latitude)
        , radius = parseInt(req.params.radius);

    db_ref.get(function (db) {
        /*
         * TODO: perform a proximity query
         * http://docs.mongodb.org/manual/applications/geospatial-indexes/#proximity-queries
         *
         * To enforce the radius, you'll want to specify a maximum distance in your query (don't forget to convert it into
         * radians).
         * http://docs.mongodb.org/manual/applications/geospatial-indexes/#distance-queries
         *
         * Also, provide the distance multiplier so that MongoDB returns distances in meters.
         * http://docs.mongodb.org/manual/applications/geospatial-indexes/#distance-multiplier
         *
         * The response should return the contents of the 'results' subarray.
         *
         * Example query: highlights/2.287061;48.863301;1500 should return Tour Eiffel and Arc de Triomphe.
         */
        db.command({
            geoNear: 'highlights',
            near: [longitude, latitude],
            maxDistance: radius / distanceMultiplier,
            distanceMultiplier: distanceMultiplier
        }, function (err, result) {
            res.send(err || result.results);
        });
    });
};