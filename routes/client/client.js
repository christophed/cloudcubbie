// user.js
// Script for rendering client's page

var model = require('../../models/clientModel');

module.exports = function(app) {

    var userAuth = require(app.get('userAuthModule'));

    app.get('/client', userAuth.verifyStaffAccess, function(request,response) {

        model.Client.find(function(err, clients) {
            if (err) {
                console.log(err);
                return response.send(400, err);
            }
            else {
                response.render('client.jade', {
                    clients: clients,
                    layout: false
                });
            }
        });        
    });

}