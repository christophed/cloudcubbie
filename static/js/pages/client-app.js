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
    el: '#site-controls',

    events: {
        'click .add-button': 'toggleAddForm',
        'click .cancel-add': 'toggleAddForm',
        'click .submit-add': 'submitAdd'
    },    

    toggleAddForm: function() {
        this.$el.find('.add-form').toggle();
        this.$el.find('.add-button').toggle();
    },

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
        this.collection = new app.SiteList();

        this.listenTo( this.collection, 'reset', this.render );

        this.collection.rootUrl = '/api/site/client/';
    },

    reset: function() {
        this.$el.html('');
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
    },

    events: {
        'change #select-client': 'selectedClient',
        'change #site-controls .select-entity': 'selectedSite',
    },

    selectedClient: function() {
        var clientID = this.$el.find('#select-client :selected').attr('id');
        if (clientID) {
            this.siteListView.client = clientID;
            this.siteListView.collection.url = this.siteListView.collection.rootUrl + clientID;
            this.siteListView.collection.fetch({reset:true});
            this.siteListView.render();
        }
        else {
            this.siteListView.reset();
        }
    },

    selectedSite: function() {
        // TODO
    }
    
});

$(function() {

    new app.BodyView();

});