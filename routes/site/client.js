var model = require('../../models/facilityModel');

module.exports = function(app) {

    var userAuth = require(app.get('userAuthModule'));

    app.get('/site', userAuth.verifyClientAccess, function(request,response) {

        model.Site.find(function(err, sites) {
            if (err) {
                console.log(err);
                return response.send(400, 'Site not found');
            }
            else {
                response.render('site.jade', {
                    sites: sites,
                    layout: false,
                    isStaff: request.session.user.isStaff,
                    user: request.session.user,
                });
            }
        });        
    });

}