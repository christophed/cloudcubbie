// routes/location/location.js
var model = require('../../models/lockerModel');

/*
jQuery.get( '/api/locations/', function( data, textStatus, jqXHR ) {
    console.log( 'Get response:' );
    console.dir( data );
    console.log( textStatus );
    console.dir( jqXHR );
});
*/

module.exports = function(app) {

    // Get all locations
    app.get('/api/location', function(request,response) {
        var site = request.query.site;

        if (site !== 'undefined') {
            return model.Location.find( {site: site}, function( err, locations) {
                if (! err) {
                    return response.send( locations );
                }
                else {
                    response.send( 400, err );
                    return console.log( err );
                }
            });
        }
        else {
            return response.send( 400, 'Must specify a valid site.' );
        }
    });

    //Get a single location by id
    app.get( '/api/location/:id', function( request, response ) {
        return model.Location.findById( request.params.id, function( err, location ) {
            if( !err ) {
                return response.send( location );
            } else {
                return console.log( err );
            }
        });
    });

    //Insert a new location
    app.post( '/api/location', function( request, response ) {

        var location = new model.Location({
            name: request.body.name,
            site: request.body.site
        });
        location.save( function( err ) {
            if( !err ) {
                console.log( 'created' );
                response.send(location);
            } 
            else {
                console.log( err );
                response.send( err );
            }
        });
    });

    //Update a location
    app.put( '/api/location/:id', function( request, response ) {
        console.log( 'Updating location ' + request.body.name );
        return model.Location.findById( request.params.id, function( err, location ) {
            if (err) {
                return console.log( err );
            }

            location.name = request.body.name;

            // TODO permission here
            location.site = request.body.site;

            return location.save( function( err ) {
                if( !err ) {
                    console.log( 'location updated' );
                } else {
                    console.log( err );
                }
                return response.send( location );
            });
        });
    });

    //Delete a location
    app.delete( '/api/location/:id', function( request, response ) {
        console.log( 'Deleting location with id: ' + request.params.id );
        return model.Location.findById( request.params.id, function( err, location ) {
            return location.remove( function( err ) {
                if( !err ) {
                    console.log( 'location removed' );
                    return response.send( '' );
                } else {
                    console.log( err );
                }
            });
        });
    });
}