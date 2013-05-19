
var model = require('../../models/clientModel');

module.exports = function(app) {

    app.post('/api/client', function(request, response) {
        var client = new model.Client({
            name: request.body.name,
        });

        client.save( function( err ) {
            if( !err ) {
                console.log( 'created client:' + client.name );
                return response.send( client );
            } else {
                console.log( err );
                return response.send(400, err);
            }
        });
    });
}