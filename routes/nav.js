module.exports = function(app) {
    app.get('/', function(request,response) {
        
        // console.log(request);

        response.render('home.jade', {
            // layout:false
            // locals: { sites: sites }
        });
    });

    app.get('/ember', function(req, res) {
        res.render('ember.jade', {
            // layout:false
            // locals: { sites: sites }
        });
    });
}