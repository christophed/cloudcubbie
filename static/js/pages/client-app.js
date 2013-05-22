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
                var optionTemplate = '<option name="client" id="<%= _id %>"><%- name %></option>';
                self.$el.find('#select-client').append(_.template(optionTemplate, client));
            },
            error: function(err) {
                alert(err);
            }
        });
        return false;
    }
});

app.Model = Backbone.Model.extend({
    parse: function(response) {
        response.id = response._id;
        return response;
    }
});

app.ModelList = Backbone.Collection.extend({
    model: app.Model
});

app.ModelListView = Backbone.View.extend({

    events: {
        'click .add-button': 'toggleAddForm',
        'click .cancel-add': 'toggleAddForm',
        'click .submit-add': 'submitAdd'
    },    

    reset: function() {
        this.$el.html('');
    },

    toggleAddForm: function() {
        this.$el.find('.add-form').toggle();
        this.$el.find('.add-button').toggle();
    }
});

// user

app.userListView = app.ModelListView.extend({
    el: '#user-controls',

    submitAdd: function() {
        var attrs = {}; 
        this.$el.find('.add-form input').each(function() {
            attrs[$(this).attr('name')] = $(this).val();
        });
        attrs.client = this.client;
        // TODO user submission checks
        var self = this;
        
        $.ajax({
            url: '/api/user',
            type:'POST',
            data: attrs,
            success: function(user) {
                self.toggleAddForm();
                
                var optionTemplate = '<option id="<%= _id %>"><%- username %></option>';
                self.$el.find('.select-entity').append(_.template(optionTemplate, user));
            },
            error: function(err) {
                console.log(err);
                alert(err);
            }
        });
        return false;
    },

    initialize: function() {
        this.collection = new app.ModelList();

        this.listenTo( this.collection, 'reset', this.render );

        this.collection.rootUrl = '/api/user/';
    },

    renderUserOptions: function(user, context) {
        var optionTemplate = '<option id="<%= id %>"><%- username %></option>';
        context.$el.find('.select-entity').append(_.template(optionTemplate, user.toJSON()));
    },

    render: function() {
        var template = $("#user-controls-template").html();
        this.$el.html( _.template(template, {entityType: 'user'}) );
        this.collection.each(function(user) {
            this.renderUserOptions(user, this);
        }, this);
    }
});

// Location

app.LocationListView = app.ModelListView.extend({
    el: '#location-controls',

    submitAdd: function() {
        var name = this.$el.find('.add-form [name="name"]').val();
        
        var self = this;

        $.ajax({
            url: '/api/location',
            type:'POST',
            data: {name: name, client: this.client, site:this.site},
            success: function(location) {
                self.toggleAddForm();
                
                var optionTemplate = '<option id="<%= _id %>"><%- name %></option>';
                self.$el.find('.select-entity').append(_.template(optionTemplate, location));
            },
            error: function(err) {
                alert(err);
            }
        });
        return false;
    },

    initialize: function() {
        this.collection = new app.ModelList();

        this.listenTo( this.collection, 'reset', this.render );

        this.collection.rootUrl = '/api/location/';
    },

    renderLocationOptions: function(location, context) {
        var optionTemplate = '<option id="<%= id %>"><%- name %></option>';
        context.$el.find('.select-entity').append(_.template(optionTemplate, location.toJSON()));
    },

    render: function() {
        var template = $("#controls-template").html();
        this.$el.html( _.template(template, {entityType: 'location'}) );
        this.collection.each(function(location) {
            this.renderLocationOptions(location, this);
        }, this);
    }
});

// Site
app.SiteListView = app.ModelListView.extend({
    el: '#site-controls',

    submitAdd: function() {
        var name = this.$el.find('.add-form [name="name"]').val();
        
        var self = this;

        $.ajax({
            url: '/api/site',
            type:'POST',
            data: {name: name, client: this.client},
            success: function(site) {
                self.toggleAddForm();
                
                var optionTemplate = '<option name="site" id="<%= _id %>"><%- name %></option>';
                self.$el.find('.select-entity').append(_.template(optionTemplate, site));
            },
            error: function(err) {
                alert(err);
            }
        });
        return false;
    },

    initialize: function() {
        this.collection = new app.ModelList();

        this.listenTo( this.collection, 'reset', this.render );

        this.collection.rootUrl = '/api/site/client/';
    },

    renderSiteOption: function(site, context) {
        var optionTemplate = '<option name="site" id="<%= id %>"><%- name %></option>';
        context.$el.find('.select-entity').append(_.template(optionTemplate, site.toJSON()));
    },

    render: function() {
        var template = $("#controls-template").html();
        this.$el.html( _.template(template, {entityType: 'site'}) );
        this.collection.each(function(site) {
            this.renderSiteOption(site, this);
        }, this);
    }
});


// MAIN
app.BodyView = Backbone.View.extend({
    el: $('#client-app'),

    initialize: function() {
        this.clientListView = new app.ClientsListView();
        this.siteListView = new app.SiteListView();
        this.locationListView = new app.LocationListView();
        this.userListView = new app.userListView();
    },

    events: {
        'change #select-client': 'selectedClient',
        'change #site-controls .select-entity': 'selectedSite',
        'change #location-controls .select-entity': 'selectedLocation',
    },

    selectedClient: function() {
        var clientID = this.$el.find('#select-client :selected').attr('id');
        if (clientID) {
            // Show site
            this.siteListView.client = clientID;
            this.siteListView.collection.url = this.siteListView.collection.rootUrl + clientID;
            this.siteListView.collection.fetch({reset:true});
            this.siteListView.render();

            // Show users
            this.userListView.client = clientID;
            this.userListView.collection.url = "/api/user/client/" + clientID;
            this.userListView.collection.fetch({reset:true});
            this.userListView.render();
        }
        else {
            this.siteListView.reset();
            this.locationListView.reset();
            this.userListView.reset();
        }
    },

    selectedSite: function() {
        var clientID = this.$el.find('#select-client :selected').attr('id');
        var siteID = this.$el.find('#site-controls .select-entity :selected').attr('id');
        if (clientID) {
            this.locationListView.client = clientID;
            this.locationListView.site = siteID;
            this.locationListView.collection.url = this.locationListView.collection.rootUrl + "?site=" + siteID;
            this.locationListView.collection.fetch({reset:true});
            this.locationListView.render();
        }
        else {
            this.locationListView.reset();
        }
    },

    selectedLocation: function() {
        // TODO
    },

    selectedUser: function() {
        // TODO
    },
    
});

$(function() {

    new app.BodyView();

});