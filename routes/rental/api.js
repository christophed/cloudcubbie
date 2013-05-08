// TODO

// routes/location/location.js
var model = require('../../models/lockerModel');

module.exports = function(app) {

    // Get all locations
    app.get('/api/locker/rental', function(request,response) {
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
    app.get('/api/locker/rental/locker/:id', function( request, response ) {
        return model.Location.findById( request.params.id, function( err, location ) {
            if( !err ) {
                return response.send( location );
            } else {
                return console.log( err );
            }
        });
    });

    //Get a single location by id
    app.get( '/api/locker/rental/:id', function( request, response ) {
        return model.Location.findById( request.params.id, function( err, location ) {
            if( !err ) {
                return response.send( location );
            } else {
                return console.log( err );
            }
        });
    });

    //Insert a new location
    app.post( '/api/locker/rental', function( request, response ) {

        // Return error if locker is rented
        var rental = new model.Rental({
            locker: request.body.locker,
            memberID: : request.body.memberID,

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
                return console.log( 'created' );
            } else {
                return console.log( err );
            }
        });
        return response.send( rental );
    });

    //Update a location
    app.put( '/api/locker/rental/:id', function( request, response ) {
        console.log( 'Updating location ' + request.body.name );
        return model.Location.findById( request.params.id, function( err, location ) {
            if (err) {
                return console.log( err );
            }

            return model.Rental.findById( request.params.id, function( err, rental ) {
                var params = ['memberID', 'firstName', 'lastName', 'email', 'phone',
                                'photo', 'cost', 'startDate', 'endDate', 'notes'];

                // TODO update here

                for (var param in params) {
                    if (param !== 'undefined') {
                        rental[param] = request.body[param];
                    }
                }

                return rental.save( function( err ) {
                    if( !err ) {
                        console.log( 'rental updated' );
                    } else {
                        console.log( err );
                    }
                    return response.send( rental );
                });
            }

            
        });
    });

    //Delete a location
    app.delete( '/api/locker/rental/:id', function( request, response ) {
        console.log( 'Deleting locker with id: ' + request.params.id );
        return model.Rental.findById( request.params.id, function( err, rental ) {
            return rental.remove( function( err ) {
                if( !err ) {
                    console.log( 'rental removed' );
                    return response.send( '' );
                } else {
                    console.log( err );
                }
            });
        });
    });
}