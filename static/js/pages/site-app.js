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
                
                var optionTemplate = '<option name="site" id="<%= _id %>"><%- name %></option>';
                self.$el.find('.select-entity').append(_.template(optionTemplate, site));
            },
            error: function(err) {
                alert(err);
            }
        });
        return false;
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
        this.siteListView = new app.SiteListView();
        // this.siteListView.client = ;
        // this.locationListView = new app.LocationListView();
        // this.userListView = new app.userListView();
    },

    events: {
        'change #site-controls .select-entity': 'selectedSite',
        'change #location-controls .select-entity': 'selectedLocation',
    },

    selectedSite: function() {
        var siteID = this.$el.find('#site-controls .select-entity :selected').attr('id');
        if (siteID) {
            alert(siteID);
            // this.locationListView.client = clientID;
            // this.locationListView.site = siteID;
            // this.locationListView.collection.url = this.locationListView.collection.rootUrl + "?site=" + siteID;
            // this.locationListView.collection.fetch({reset:true});
            // this.locationListView.render();
        }
        else {
            // this.locationListView.reset();
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