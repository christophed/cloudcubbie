var model = require('../../models/lockerModel');

module.exports = function(app) {

    var userAuth = require(app.get('userAuthModule'));

    app.get('/locker', userAuth.verifyClientAccess, function(request,response) {

        model.Site.find(function(err, sites) {
            if (err) {
                return console.log(err);
            }
            else {
                response.render('locker.jade', {
                    layout:false,
                    sites: sites,
                    isStaff: request.session.user.isStaff,
                });
                // console.log('found');
            }
        });
        // sites = [{name: 'Stanford Campus', id:1} ];

        
    });

}