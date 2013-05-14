// TODO

// routes/location/location.js
var model = require('../../models/lockerModel');

module.exports = function(app) {

    // Get all locations
    app.get('/api/rental', function(request,response) {
        return model.Location.find( function( err, locations) {
            if (! err) {
                return response.send( locations );
            }
            else {
                return console.log( err );
            }
        });
    });

    // Return rental corresponding to locker
    app.get('/api/rental/locker/:id', function( request, response ) {
        return model.Location.findById( request.params.id, function( err, location ) {
            if( !err ) {
                return response.send( location );
            } else {
                return console.log( err );
            }
        });
    });

    //Get a single location by id
    app.get( '/api/rental/:id', function( request, response ) {
        return model.Rental.findById( request.params.id, function( err, rental ) {
            if( !err ) {
                return response.send( rental );
            } else {
                console.log( err );
                return response.send(400, err );
            }
        });
    });

    //Insert a new location
    app.post( '/api/rental', function( request, response ) {
        // FInd locker
        var lockerId = request.body.locker;

        if (typeof lockerId !== 'undefined') {
            return model.Locker.findById(lockerId, function( err, locker) {
                if (! err) {
                    // Return error if locker is rented
                    var rental = new model.Rental({
                        locker: request.body.locker,
                        memberID: request.body.memberID,

                        firstName: request.body.firstName,
                        lastName: request.body.lastName,

                        email: request.body.email,
                        phone: request.body.phone,

                        photo: request.body.photo, // TODO file upload
                        cost: request.body.cost,

                        startDate: request.body.startDate,
                        endDate: request.body.endDate,

                        notes: request.body.notes

                    });

                    rental.save( function( err ) {
                        if( !err ) {
                            locker.rental = rental._id;

                            console.log( 'Created rental' );
                            locker.save(function(lockerErr) {
                                if (!err) {
                                    console.log('Locker rented')
                                    return response.send( rental );    
                                }
                                else {
                                    return response.send(400, 'Rental reference dangling');
                                }
                            })
                        } else {
                            console.log( err );
                            return response.send(400, "Error in creating locker: " + err);
                        }
                    });
                }
                else {
                    console.log( err );
                    return response.send(400, err);
                }
            });    
        }
        else {
            return response.send(400, 'Must specify locker.');
        }  

    });

    //Update a location
    app.put( '/api/rental/:id', function( request, response ) {
        console.log( 'Updating rental ' + request.body.id );
        return model.Rental.findById( request.params.id, function( err, location ) {
            if (err) {
                return console.log( err );
            }

            return model.Rental.findById( request.params.id, function( err, rental ) {
                var params = ['memberID', 'firstName', 'lastName', 'email', 'phone',
                                'photo', 'cost', 'startDate', 'endDate', 'notes'];

                // TODO update here
                for (var i = 0; i < params.length; i++) {
                    var param = params[i];
                    if (typeof request.body[param] !== 'undefined') {
                        console.log(param);
                        rental[param] = request.body[param];
                    }
                }

                return rental.save( function( err ) {
                    if( !err ) {
                        console.log( 'rental updated' );
                        return response.send( rental );
                    } else {
                        console.log( err );
                        return response.send( 400, err );
                    }
                });
            });

            
        });
    });

    // delete a rental
    app.delete( '/api/rental/:id', function( request, response ) {
        console.log( 'Deleting rental with id: ' + request.params.id );
        return model.Rental.findById( request.params.id, function( err, rental ) {
            if (err) {
                return (400, err);
            }
            else {
                return model.Locker.findById( rental.locker, function(err, locker) {
                    if (!err) {
                        locker.rental = null;
                        return locker.save(function( err) {
                            if ( !err ) {
                                return response.send(locker);
                            }
                            else {
                                console.log(err);
                                return response.send(400, err);
                            }
                        });
                    }
                    else {
                        return (400, err);
                    }
                } );
                // return rental.remove( function( err ) {
                //     if( !err ) {
                //         console.log( 'rental removed' );
                //         return response.send( '' );
                //     } else {
                //         console.log( err );
                //     }
                // });    
            }
        });
    });
}