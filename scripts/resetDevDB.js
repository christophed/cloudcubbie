var mongoose = require( 'mongoose' ); //MongoDB integration
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );

mongoose.connection.db.dropDatabase(function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Database reset');
    }
});