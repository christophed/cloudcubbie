// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ), //MongoDB integration
    fs = require('fs');

//Create server
var app = express();
var logFile = fs.createWriteStream('./logging/prod.log', {flags: 'a'});

// Configure server
app.configure( function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    // Root of folder
    app.set('userAuthModule', path.join(application_root, 'routes/user/user'));

    // Logging
    app.use(express.logger({stream: logFile}));

    //parses request body and populates request.body
    app.use( express.bodyParser() );

    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );

    // Sessions
    app.use(express.cookieParser('41d7862a42f0e2ace915c9d56dff6abb'));
    app.use(express.session());

    //perform route lookup based on url and HTTP method
    app.use( app.router );

    //Where to serve static content
    app.use( express.static( path.join( application_root, 'static') ) );

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('dev', function() {
    app.set('view options', { pretty: true });

    // Some jitter to simulate latency
    // app.get('/api*', function(req,res,next) {
    //     setTimeout(next, Math.random() * 1000 + 300);
    // });
});

// Connect to DB
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );

// Misc. navigation
require('./routes/nav/client')(app);

// User && login
require('./routes/user/login')(app);

// User/client views
require('./routes/client/client')(app);

// Client/User creation (Staff)
require('./routes/client/api')(app);
require('./routes/user/api')(app);

// Client site and locker views
require('./routes/site/api')(app);
require('./routes/site/client')(app);
require('./routes/locker/client')(app);

// Manipulate locker and location objects
require('./routes/locker/api')(app);
require('./routes/location/api')(app);
require('./routes/rental/api')(app);

//Start server
var port = 3000;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});
