
var model = require('../../models/clientModel');

module.exports = function(app) {

    app.post('/api/client', function(request, response) {
        var clientName = request.body.name;
        // No duplicates
        model.Client.findOne({name: clientName}, function(err, client) {
            if (! err) {
                if (client) {
                    console.log("Err: Client name taken.");
                    return response.send(400, "Client name taken.");
                }

                var newClient = new model.Client({
                    name: clientName,
                });
                return newClient.save( function( err ) {
                    if( !err ) {
                        console.log( 'created client:' + newClient.name );
                        return response.send( newClient );
                    } else {
                        console.log( err );
                        return response.send(400, err);
                    }
                });

            }
            else {
                console.log(err);
                return response.send(400, err);    
            }
        });

    });
}