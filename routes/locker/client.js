var model = require('../../models/lockerModel');

module.exports = function(app) {

    app.get('/locker', function(request,response) {

        model.Site.find(function(err, sites) {
            if (err) {
                return console.log(err);
            }
            else {
                response.render('locker.jade', {
                    layout:false,
                    sites: sites
                });
                // console.log('found');
            }
        });
        // sites = [{name: 'Stanford Campus', id:1} ];

        
    });

}