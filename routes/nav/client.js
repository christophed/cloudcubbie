var model = require('../../models/clientModel');
var verify = require('../../utilities/password').verify;

module.exports = function(app) {

    var userAuth = require(app.get('userAuthModule'));

    app.get('/', userAuth.verifyClientAccess, function(request,response) {

        return response.render('home.jade', {
            user: request.session.user, 
        });

    });

    // Login
    app.post('/', function(request, response) {

        if (request.session.user) {
            return response.render('home.jade', {
                user: request.session.user, 
            });
        }

        var username = request.body.username;
        var password = request.body.password;
        var nextUrl = typeof request.body.next !== 'undefined' ? request.body.nextUrl : '/';

        if (!username || !password) {
            return response.send(401, "Must define username and password");
        }

        model.User.findOne({ username: username}, function(err, user) {
            if (! err && user !== null) {

                if (verify(password, user.password) ) {
                    request.session.user = user;

                    // Homepage
                    return response.render('home.jade', {
                        isStaff: request.session.user.isStaff,
                        user: request.session.user
                    });
                }
            }

            // Else
            console.log(err);
            return response.send(401, "Login error");
        });
    });

    app.get('/about', userAuth.verifyClientAccess, function(request, response) {
        return response.render('about.jade', {
            user: request.session.user
        });
    });

}