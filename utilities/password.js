var passwordHash = require('password-hash');

module.exports = {
    hash: function(password) {
    return passwordHash.generate(password, {algorithm:'sha1', saltLength:16, iterations:1000});
    }, 

    verify: function(password, hash) {
        return passwordHash.verify(password, hash);
    }
}
