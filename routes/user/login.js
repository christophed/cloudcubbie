var model = require('../../models/clientModel');

var verify = require('../../utilities/password').verify;


module.exports = function(app) {    
    
    app.post('/login', function(request, response) {
        if (request.session.user) {
            return response.render('home.jade');
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
                        
                    });
                }
            }

            // Else
            console.log(err);
            return response.send(401, "Login error");
        });
    });

    app.get('/logout', function(request, response) {
        request.session.destroy();
        return response.render('login-redirect', {url:'/'});
    });
}