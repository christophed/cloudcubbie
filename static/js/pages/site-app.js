var app = app || {};

// GENERIC handling

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

// Location view
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
                
                var optionTemplate = '<input type="radio" name="location" id="<%= _id %>" hidden /><label for="<%= _id %>" ><%- name %></label><br/>';
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
        var optionTemplate = '<input type="radio" name="location" id="<%= _id %>" hidden /><label for="<%= _id %>" ><%- name %></label><br/>';
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

// Site List
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

                var optionTemplate = '<input type="radio" name="site" id="<%= _id %>" hidden /><label for="<%= _id %>" ><%- name %></label><br/>';
                self.$el.find('.select-entity').append(_.template(optionTemplate, site));
            },
            error: function(err) {
                console.log(err);
                alert(err.responseText);
            }
        });
        return false;
    },

    renderSiteOption: function(site, context) {
        var optionTemplate = '<input type="radio" name="site" id="<%= _id %>" hidden /><label for="<%= _id %>" ><%- name %></label><br/>';
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
    el: $('#site-app'),

    initialize: function() {
        this.siteListView = new app.SiteListView();
        this.siteListView.client = this.siteListView.$el.find('.add-form [name="client"]').val();
        this.locationListView = new app.LocationListView();
        // this.userListView = new app.userListView();
    },

    events: {
        'click #site-controls .select-entity input[name="site"]': 'selectedSite',
        'click #location-controls .select-entity input[name="location"]': 'selectedLocation',
    },

    selectedSite: function() {
        
        var siteID = this.siteListView.$el.find('.select-entity :checked').attr('id');
        
        if (siteID) {
            this.locationListView.client = this.siteListView.client;
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

    // AJAX
    $(document).ajaxStart(function () {
        $('#ajax-dialog').dialog({
            dialogClass: "no-close",
            title: "Loading",
            modal: true,
            
        });
    }).ajaxStop(function () {
        $('#ajax-dialog').dialog('close');
    });


});