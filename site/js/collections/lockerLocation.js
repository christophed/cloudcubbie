var app = app || {};

app.LockerLocation = Backbone.Collection.extend({
    model: app.Locker,
    url: '/api/locations'     // NEW
});
