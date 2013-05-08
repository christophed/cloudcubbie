var app = app || {};

// LOCKER MODEL
app.Rental = Backbone.Model.extend({
    defaults: {
        
    },

    urlRoot: '/api/locker/rental',

    parse: function(response) {
        response.id = response._id;
        return response;
    }
});

// 