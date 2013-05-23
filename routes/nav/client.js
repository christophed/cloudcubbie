module.exports = function(app) {

    var userAuth = require(app.get('userAuthModule'));

    app.get('/', userAuth.verifyClientAccess, function(request,response) {

        response.render('home.jade', {
            isStaff: request.session.user.isStaff,
            user: request.session.user
        });
    });
}