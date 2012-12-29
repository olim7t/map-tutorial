/*
 * Wraps the initialization of the MongoDB connection to make sure that no client tries to use it before it's fully
 * opened (this occurs with unit tests otherwise).
 */
var mongo = require('mongodb')
    , assert = require('assert')
    , events = require('events');

var db
    , db_is_ready = false
    , db_emitter = new events.EventEmitter // used to block clients until ready
    , notify_db_ready = function () {
        db_is_ready = true;
        db_emitter.emit('db-ready');
    };

exports.get = function (callback) {
    if (db_is_ready) callback(db);
    else {
        console.log('waiting for DB to open');
        db_emitter.on('db-ready', function () {
            callback(db);
        });
    }
};

var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
db = new mongo.Db('map-tutorial', server, {safe: true});
db.open(function (err, db) {
    assert.ok(!err, err && err.message);
    console.log('connected to DB ' + db.databaseName);

    // Done on-the-fly for simplicity. In a real app we would not do this...
    var populate = function () {
        console.log('populating empty database');

        // Source: Wikipedia
        var highlights = [
            { name: 'Tour Eiffel', loc: [ 2.2945, 48.85825 ] },
            { name: 'Arc de Triomphe', loc: [ 2.295028, 48.873689 ] },
            { name: 'Panthéon', loc: [ 2.34611 , 48.84625 ] },
            { name: 'Notre-Dame de Paris', loc: [ 2.349722 , 48.853056 ] },
            { name: 'Musée du Louvre', loc: [ 2.335784 , 48.861073 ] },
            { name: 'Musée Rodin', loc: [ 2.31583 , 48.85528 ] },
            { name: 'Basilique du Sacré-Cœur', loc: [ 2.34306 , 48.88694 ] },
            { name: 'Cimetière du Père-Lachaise', loc: [ 2.394167 , 48.861944 ] },
            { name: 'Hôtel de Ville', loc: [ 2.352222 , 48.856389 ] },
            { name: 'Place de la Bastille', loc: [ 2.369563 , 48.853092 ] },
            { name: 'Xebia France', loc: [ 2.3110707998275757 , 48.87526512145995 ] }
        ];

        db.collection('highlights', function (err, collection) {
            assert.ok(!err, err && err.message);
            collection.insert(highlights, function (err, result) {
                assert.ok(!err, err && err.message);
                collection.ensureIndex({loc: '2d'}, {}, function (err, indexName) {
                    assert.ok(!err, err && err.message);
                    console.log('created geospatial index ' + indexName);
                    notify_db_ready();
                });
            });
        });
    };

    db.collectionNames('highlights', function (err, items) {
        assert.ok(!err, err && err.message);
        if (items.length === 0) populate();
        else notify_db_ready();
    })
});
