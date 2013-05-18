var model = require('../../models/clientModel');

module.exports = {

    verifyClientAccess: function(request, response, next) {
        // TODO verify client access (mostly logins)
        if (! request.session.user) {
            return response.render('login-redirect.jade', {
                url: request.url
            });
        }
        next();
    },

    verifyStaffAccess: function(request, response, next) {
        if (! request.session.user ) {
            return response.render('login-redirect.jade', {
                url: request.url
            });
        }
        if ( request.session.user.isStaff !== true ) {
            return response.send(401, "No access");    
        }
        
        next();
    },

    verifyApiAccess: function(request, response, next) {
        // TODO verify access
        if (! request.session.user) {
            return response.send(400, "No access");
        }
        else {
            next();
        }
    },

    logout: function(request, response, next) {
        request.session = null;
    }
}