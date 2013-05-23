// routes/site/site.js
var model = require('../../models/lockerModel');

module.exports = function(app) {

    // Get site based on client
    app.get('/api/site/client/:id', function(request, response) {

        return model.Site.find({ client: request.params.id }, function(err, sites) {
            if (! err) {
                return response.send(sites);
            }
            else {
                return response.send(400, err);
            }
        });
    });

    // Get all sites
    app.get('/api/site', function(request,response) {
        return model.Site.find( function( err, site) {
            if (! err) {
                // TODO return only sites that belong to this client
                return response.send( site );
            }
            else {
                return console.log( err );
            }
        });
    });

    // READ
    app.get( '/api/site/:id', function( request, response ) {
        return model.Site.findById( request.params.id, function( err, site ) {
            if( !err ) {
                return response.send( site );
            } else {
                return console.log( err );
            }
        });
    });

    // CREATE
    app.post( '/api/site', function( request, response ) {
        var attrs = {};
        attrs["name"] = request.body.name;
        if (typeof request.body.client !== 'undefined') {
            attrs["client"] = request.body.client;
        }
        else {
            return response.send(400, "Need to specify a client!");
        }
        var site = new model.Site(attrs);
        site.save( function( err ) {
            if( !err ) {
                console.log( 'created site' );
                return response.send( site );
            } else {
                return console.log( err );
            }
        });
    });

    // UPDATE
    app.put( '/api/site/:id', function( request, response ) {
        console.log( 'Updating site ' + request.body.name );
        return model.Site.findById( request.params.id, function( err, site ) {
            if (err) {
                return console.log( err );
            }

            site.name = request.body.name;

            return site.save( function( err ) {
                if( !err ) {
                    console.log( 'site updated' );
                    return response.send( site );
                } else {
                    return console.log( err );
                }
                
            });
        });
    });

    // DELETE
    app.delete( '/api/site/:id', function( request, response ) {
        console.log( 'Deleting site with id: ' + request.params.id );
        return model.Site.findById( request.params.id, function( err, site ) {
            return site.remove( function( err ) {
                if( !err ) {
                    console.log( 'site removed' );
                    return response.send( '' );
                } else {
                    console.log( err );
                }
            });
        });
    });
}