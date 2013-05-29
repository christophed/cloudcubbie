// Notifications model

var mongoose = require( 'mongoose' ); //MongoDB integration

var notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    read: {type: Boolean, default: false},
    message: String
});

module.exports = {
    Notification: mongoose.model('Notification', notificationSchema)
};