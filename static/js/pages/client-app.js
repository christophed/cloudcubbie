// client-app.js

var app = app || {};

// CLIENT

app.Client = Backbone.Model.extend({

    parse: function(response) {
        response.id = response._id;
        return response;
    }
});

app.ClientList = Backbone.Collection.extend({
    model: app.Client
});

app.ClientsListView = Backbone.View.extend({
    el: $('#client-controls'),
    initialize: function() {
        this.collection = new app.ClientList();
    },

    events: {
        'click #add-client': 'toggleAddClientForm',
        'click #cancel-add-client': 'toggleAddClientForm',
        'click #submit-add-client': 'submitAddClient'
    },

    toggleAddClientForm: function() {
        this.$el.find('#add-client-form').toggle();
        this.$el.find('#add-client').toggle();
    },

    submitAddClient: function() {
        var name = this.$el.find('#add-client-form [name="name"]').val();
        
        var self = this;

        $.ajax({
            url: '/api/client',
            type:'POST',
            data: {name: name},
            success: function(client) {
                self.toggleAddClientForm();
                // Set up client info
                var optionTemplate = '<option name="client" id="<%= id %>"><%- name %></option>';                    
                self.$el.find('#select-client').append(_.template(optionTemplate, client));
            },
            error: function(err) {
                alert(err);
            }
        });
        return false;
    }
});

// Site
app.Site = Backbone.Model.extend({
    parse: function(response) {
        response.id = response._id;
        return response;
    }
});

app.SiteList = Backbone.Collection.extend({
    model: app.Site
});

app.SiteListView = Backbone.View.extend({
    
});


// MAIN
app.BodyView = Backbone.View.extend({
    el: $('#client-app'),

    initialize: function() {
        this.clientListView = new app.ClientsListView();
    },

    events: {
        'change #select-client': 'selectedClient',
    },

    selectedClient: function() {
        var clientID = this.$el.find('#select-client :selected').attr('id');
        if (!clientID) {
            return;
        }
        alert(clientID);
    },
    
});

$(function() {

    new app.BodyView();

});