var model = require('../../models/facilityModel');

module.exports = function(app) {

    app.get('/site', function(request,response) {

        model.Site.find(function(err, sites) {
            if (err) {
                return console.log(err);
            }
            else {
                response.render('site.jade', {
                    sites: sites,
                    layout: false
                });
                // console.log('found');
            }
        });
        // sites = [{name: 'Stanford Campus', id:1} ];

        
    });

}