// This script deals with attaining userIDs of members
// Every client would presumably have their own URL for this

var data = "";
var options = {hostname: 'christophechong.com', path: '/cloudcubbie/users'};
var req = require('http').request(options, function(res) {
    res.on('data', function(chunk) {
        data += chunk;
    });
    res.on('end', function () {
        var users = JSON.parse(data);
    });
});
req.end();