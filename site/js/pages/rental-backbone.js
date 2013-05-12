var app = app || {};

// Rental
app.Rental = Backbone.Model.extend({
    defaults: {
        
    },

    urlRoot: '/api/rental',

    parse: function(response) {
        response.id = response._id;
        return response;
    }
});

// 