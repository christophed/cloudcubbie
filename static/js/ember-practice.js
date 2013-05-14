App = Ember.Application.create();

App.Router.map(function() {
  this.resource('posts');
  this.resource('about');
});
      
App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'DS.FixtureAdapter'
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return App.Post.find();
  }
});

App.Post = DS.Model.extend({
  title: DS.attr('string'),
  author: DS.attr('string'),
  intro: DS.attr('string'),
  extended: DS.attr('string'),
  publishedAt: DS.attr('date'),
});

App.Post.FIXTURES = [{
  id: 1,
  title: "Rails is Omakase",
  author: "d2h",
  publishedAt: new Date('12-27-2012'),
  intro: "There are lots of software...",
  extended: "I want this for my"
}, {
  id: 2,
  title: "Ember rocks",
  author: "d2h",
  publishedAt: new Date('12-31-2012'),
  intro: "Frontend frontend frontend.",
  extended: "Yeah baby"
}];


