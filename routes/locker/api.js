// /locker/location/:id/locker/:id

// routes/locker/locker.js
var model = require('../../models/lockerModel');

module.exports = function(app) {

    // Get all lockers for a location
    app.get('/api/locker', function(request,response) {
        var locationId = request.query.location;

        if (typeof locationId !== 'undefined') {
            return model.Locker.find({location:locationId}, function( err, lockers) {
                if (! err) {
                    return response.send( lockers );
                }
                else {
                    return console.log( err );
                }
            });    
        }
        else {
            return response.send(400, 'Must specify locker location.');
        }        
    });

    // new api
    app.get('/api/locker/location/:locationId', function(request,response) {
        var locationId = request.params.locationId;

        if (typeof locationId !== 'undefined') {
            return model.Locker.find({location:locationId}, function( err, lockers) {
                if (! err) {
                    return response.send( lockers );
                }
                else {
                    return console.log( err );
                }
            });    
        }
        else {
            return response.send(400, 'Must specify locker location.');
        } 
    });

    // READ
    app.get( '/api/locker/:id', function( request, response ) {
        return model.Locker.findById( request.params.id, function( err, locker ) {
            if( !err ) {
                return response.send( locker );
            } else {
                return response.send(400, 'No object found');
            }
        });
    });


    // CREATE MANY LOCKERS
    app.post( '/api/locker/:numLockers', function( request, response ) {
        // var params = ['location', 'site', 'name', 'combos', 'available', 'notes'];

        var numLockers = parseInt(request.params.numLockers);
        if (numLockers < 0 || numLockers > 1000) {
            return response.send(400, "You must specify a positive number of lockers to add, less than 1000");
        }

        var locationId = request.body.location;
        var siteId = request.body.site;

        return model.Location.findById(locationId, function (err, location) {
            if (err) {
                return response.send(400, err);
            }
            if (location === null) {
                return response.send(400, 'No location found');
            }
            if (location.site != siteId) {
                console.log(location.site + " does not match " + siteId);
                return response.send(400, 'Location does not match site!');
            }

            /* Not thread safe, but this should be working off one thread anyway */
            var numCreated = 0;
            var numFailed = 0;

            // TODO find highest "name" and increment from there

            return model.Locker.count({location: locationId}, function(err, count) {

                if (err) {
                    return response.send(400, err);
                }

                var maxNumberAssigned = count;

                var added = [];
                // Plug in a bunch of lockers
                for (var i = 0; i < numLockers; i++) {
                    var locker = new model.Locker({
                        
                        name: ("" + ++maxNumberAssigned),

                        location: locationId,
                        site: siteId,

                        // name: request.body.name,
                        combos: [],

                        available: true,
                    });


                    locker.save( function( err ) {
                        if( !err ) {
                            console.log( 'created locker' );
                            numCreated++;
                        }
                        else {
                            numFailed++;
                        }

                        added.push(locker);

                        if (numCreated + numFailed ==  numLockers) {

                            return response.send(added);
                        }
                    });
                }
            });

        });

            
            
    });

    // CREATE
    app.post( '/api/locker', function( request, response ) {
        // var params = ['location', 'site', 'name', 'combos', 'available', 'notes'];
        var locker = new model.Locker({
            
            location: request.body.location,
            site: request.body.site,

            name: request.body.name,
            combos: [request.body.combo],

            available: request.body.available,

            notes: request.body.notes

        });


        locker.save( function( err ) {
            if( !err ) {
                console.log( 'created locker' );
                return response.send( locker );
            } else {
                return console.log( err );
            }
        });
    });

    // UPDATE
    app.put( '/api/locker/:id', function( request, response ) {
        console.log( 'Updating locker ' + request.body.name );
        return model.Locker.findById( request.params.id, function( err, locker ) {
            if (err) {
                return console.log( err );
            }

            locker.name = request.body.name;
            locker.combos = request.body.combos;
            locker.notes = request.body.notes;

            return locker.save( function( err ) {
                if( !err ) {
                    console.log( 'locker updated' );
                    return response.send( locker );
                } else {
                    return console.log( err );
                }
                
            });
        });
    });

    // UPDATE PARTIAL -- only supports available now

    app.patch( '/api/locker/:id', function( request, response ) {
        console.log( 'Updating locker ' + request.body.name );
        
        return model.Locker.findById( request.params.id, function( err, locker ) {
            if (err) {
                console.log( err );
                return response.send(400, err);
            }


            locker.available = request.body.available;

            return locker.save( function( err ) {
                if( !err ) {
                    console.log( 'locker updated' );
                    return response.send( locker );
                } else {
                    console.log( err );
                    return response.send(400, err);
                }
                
            });
        });
    });


    // DELETE
    app.delete( '/api/locker/:id', function( request, response ) {
        console.log( 'Deleting locker with id: ' + request.params.id );
        return model.Locker.findById( request.params.id, function( err, locker ) {
            if (err) {
                console.log(err);
                return response.send(400, err);
            }
            else if (locker === null) {
                return response.send(400, 'Locker not found');   
            }
            else {
                return locker.remove( function( err ) {
                if( !err ) {
                        return response.send( '' );
                    } else {
                        console.log( err );
                        return response.send(400, err);
                    }
                });
            }

            
        });
    });
}