var mongoose = require( 'mongoose' ); //MongoDB integration

var memberSchema = new mongoose.Schema({
    
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    
    memberID: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    notes: String

});

module.exports = {
    Member: mongoose.model('Member', memberSchema)
};