var db_ref = require('./db');

var earthRadiusInMeters = 6378137,
    distanceMultiplier = earthRadiusInMeters * Math.PI / 180;

// GET /highlights/:longitude;:latitude;:radius
exports.search = function (req, res) {
    var longitude = parseFloat(req.params.longitude)
        , latitude = parseFloat(req.params.latitude)
        , radius = parseInt(req.params.radius);

    db_ref.get(function (db) {
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