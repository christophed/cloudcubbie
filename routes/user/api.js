var model = require('../../models/clientModel');

var passwordModule = require('../../utilities/password');
var model = require('../../models/clientModel');

module.exports = function(app) {
    app.get('/api/user/client/:id', function(request, response) {
        var client = request.params.id;

        model.User.find({client: client}, function(err, users) {
            return response.send(users);
        });

    });

    app.post('/api/user', function(request,response) {

        var username = request.body.username;

        model.User.findOne({username: username}, function(err, user) {
            if (! err && ! user) {
                var params = ['firstName', 'lastName', 'email', 'password', 'client', 'username'];
                var attrs = {};

                for (var i = 0; i < params.length; i++) {
                    var param = params[i];
                    
                    if (typeof request.body[param] !== 'undefined') {

                        if (param === 'password') {
                            attrs.password = passwordModule.hash(request.body.password);
                        }  
                        else {
                            attrs[param] = request.body[param];
                        }
                    }
                }

                var user = new model.User(attrs);

                user.save(function(err) {
                    if (!err) {
                        return response.send(user);
                    }
                    console.log(err);
                    return response.send(400, 'Error saving new user');
                });
            }
            else if (! err && user) {
                return response.send(400, "Error: Username taken");
            }
            else {
                console.log(err);
                return response.send(400, err);
            }
        })

        
    });
}