// /locker/location/:id/locker/:id

var model = require('../../models/lockerModel');
var Member = require('../../models/memberModel').Member;

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

    // Verify USER id
    app.get('/api/locker/verifyID', function(request, response) {
        // Check validity of ID
        var memberID = request.query.id;
        var location = request.query.location;
        Member.findOne({client: request.session.user.client, memberID: memberID}, function(err, member) {
            if (! err ) {
                if (member) {
                    model.Locker.findOne({ location: location, memberID: memberID, available: false  }, function(err, locker) {
                        if ( ! err ) {
                            // Already rented
                            if (locker) {
                                return response.send({success: false, text: 'User is renting locker "' + locker.name +'" at this location' });
                            }    
                            else {
                                return response.send({success: true, member:member});
                            }
                        }

                        else {
                            return response.send({success: false, text: "Cannot verify ID"});
                            console.log(err);
                        }
                        
                    });    
                }
                else {
                    return response.send({success: false, text: "User is not in the system"});
                }
            }
            else {
                console.log(err);
                return response.send({success: false, text: "Cannot verify ID"});    
            }
            
        });
        
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

                        combos: []

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

    // UPDATE -- supports locker info update
    app.put( '/api/locker/:id', function( request, response ) {
        console.log( 'Updating locker ' + request.body.name );
        return model.Locker.findById( request.params.id, function( err, locker ) {
            if ( !err) {
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
            }

            else {
                return console.log( err );
            }

        });
    });

    // UPDATE PARTIAL -- supports locker rental
    app.patch( '/api/locker/:id', function( request, response ) {
        
        return model.Locker.findById( request.params.id, function( err, locker ) {
            if ( err ) {
                console.log( err );
                return response.send(400, err);
            }

            // Delete rental
            if (request.body.available === true) {
                locker.available = true;
            }

            // New rental
            else {
                // Not atomic, but works for now
                locker.available = false;
            }

            var params = ['memberID', 'firstName', 'lastName', 'email', 'phone',
                                'photo', 'cost', 'startDate', 'endDate', 'rentalNotes'];

            // Set or clear rental parameters
            for (var i = 0; i < params.length; i++) {
                var param = params[i];

                if (locker.available === true) {
                    locker[param] = null;
                }
                
                else if (typeof request.body[param] !== 'undefined') {
                    locker[param] = request.body[param];
                }
            }

            // TODO -- check for legitimacy of ID and locker taken by ID

            // Save
            return locker.save( function( err ) {
                if ( ! err ) {
                    console.log( 'locker updated:' );
                    console.log(locker);
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