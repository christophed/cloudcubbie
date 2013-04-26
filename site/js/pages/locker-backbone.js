// locker-backbone.js

var app = app || {};

app.Locker = Backbone.Model.extend({
    defaults: {
        name: 'no name'
    }
});

app.LockerView = Backbone.View.extend({

    template: $('#locker-view-template-backbone').html(),

    render: function() { 
        var tmpl = _.template(this.template);
        this.$el.html(tmpl( this.model.toJSON() ));
        return this;
    }
});

app.LockerList = Backbone.Collection.extend({
    model: app.Locker,
    url: '/api/test'
});

app.LockerListView = Backbone.View.extend({
    el: $('#locker-view'),

    initialize: function() {
        this.collection = new app.LockerList();
        this.collection.fetch({reset:true});

        this.listenTo( this.collection, 'add', this.renderLocker );
        this.listenTo( this.collection, 'reset', this.render );

        this.collectionUrls = new Array('/api/test','/api/test2');
        this.collectionUrlIndex = 0;
        // this.collectionUr('collectionUrls', ['/api/test1','/api/test2']);
        // this.collection.model.set('currentCollection',1);
    },

    events: {
        'click #changeCollection':'toggleCollection'
    },

    toggleCollection: function() {
        this.collectionUrlIndex = (this.collectionUrlIndex + 1) % this.collectionUrls.length;
        var nextUrl = this.collectionUrls[this.collectionUrlIndex];
        
        this.collection.url = nextUrl;
        this.collection.fetch({reset:true});
    },

    renderLocker: function(locker) {
        var lockerView = new app.LockerView({
            model: locker
        });
        this.$el.find('#lockers').append( lockerView.render().el );
    },

    render: function() {
        this.$el.find('#lockers').html('');
        this.collection.each(function(locker) {
            this.renderLocker( locker );
        }, this );
    }
});

$(function() {
    new app.LockerListView();
});