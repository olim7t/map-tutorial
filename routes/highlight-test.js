exports.should_find_two_highlights_within_1500_meters_of_trocadero = function (test) {
    test.expect(5/* assertions*/);

    var mock_request = {
        params: {
            longitude: '2.287061',
            latitude: '48.863301',
            radius: '1500'
        }
    };
    var mock_response = {
        send: function (results) {
            console.log('got mock response');
            test.equal(results.length, 2);
            test.equal(results[0].obj.name, 'Tour Eiffel');
            test.equal(Math.floor(results[0].dis), 1000);
            test.equal(results[1].obj.name, 'Arc de Triomphe');
            test.equal(Math.floor(results[1].dis), 1457);
            test.done();

            require('./db.js').get(function(db) {
                db.close();
            });
        }
    }

    console.log('sending mock request');
    require('./highlight').search(mock_request, mock_response);
};