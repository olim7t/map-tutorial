var db_ref = require('./db');

/*
 * TODO feature 3: highlights search.
 *
 * Initialize distanceMultiplier to the correct value.
 */
var earthRadiusInMeters = 6378137,
    distanceMultiplier = 0;

// GET /highlights/:longitude;:latitude;:radius
exports.search = function (req, res) {
    var longitude = parseFloat(req.params.longitude)
        , latitude = parseFloat(req.params.latitude)
        , radius = parseInt(req.params.radius);

    db_ref.get(function (db) {
        /*
         * TODO feature 3: highlights search.
         * Implement the MongoDB query here.
         */
        res.send('TODO');
    });
};