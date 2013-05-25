var mongoose = require( 'mongoose' ); //MongoDB integration
mongoose.connect('mongodb://localhost/cloudcubbie_dev' );

var memberModel = require('../models/memberModel');

var members = [{
        "memberID": '01234567',
        'firstName': 'Tom',
        'lastName': 'Son',
        'email': 'tomson@stanford.edu',
        'phone': '4081234567',
        'client': '519efe39c741ccaca8000002'
    }, {
        "memberID": '02345678',
        'firstName': 'Jane',
        'lastName': 'Jameson',
        'email': 'jameson@stanford.edu',
        'phone': '4082345678',
        'client': '519efe39c741ccaca8000002'
    }
];

for (var i = 0; i < members.length; i++) {
    var member = new memberModel.Member(members[i]);

    member.save( function( err ) {
        if( !err ) {
            console.log( 'Member created: ' + member.memberID );
        } 
        else {
            console.log( err );
        }
    });
}
