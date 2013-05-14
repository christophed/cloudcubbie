function selectedSite(siteId) {

    $.get('/api/location', {site: siteId}, function(data, textStatus, jqXHR) {

        $('#locationView').html('');
        
        _.each(data, function(item) {
            $('#locationView').append(_.template($('#location-template').html(), {name: item.name, id:item._id}));
        });
        if (! data.length) {
            $('#locationView').append('<div>No Locations for this site exist.</div>');    
        }
        // Option to add item
        $('#locationView').append($('<div><button id="createLocationToggleButton" onclick="createLocationClicked()">Create new Location</button></div>'));
    });

}

function resetSelectedSite() {
    $('#locationView').html('');
}

function getSelectedSite() {
    return $('#site-picker option:selected').attr('id');
}

function createLocationClicked() {

    $('#createLocationForm').show(); // do this in a better way
    $('#createLocationToggleButton').remove();

    // data

    // $.post('/api/location/', function(data, textStatus, jqXHR) {
    //     // if (textStatus)
    // });
}

// Add location
function addLocationPressed() {
    // error = {};

    var newLocationName = $('#addLocationForm input[name="locationName"]').val();
    var siteName = getSelectedSite();

    // Disabled to prevent multiple calls
    $('#addLocationForm button').attr('disabled', true);

    var callbackFailure = function(){
        // Enable user interaction again
        $('#addLocationForm button').removeAttr('disabled');
    };

    var callbackSuccess = function() {
        // Reload everything
        $('#createLocationForm').hide(); // do this in a better way
        $('#addLocationForm button').removeAttr('disabled');  
        selectedSite(getSelectedSite());
    }

    if (typeof siteName === 'undefined') {
        error = 'You must select a Site for the location to fall under.';
        // Display error
        callbackFailure();
    }
    else {
        addLocation(siteName, newLocationName, callbackFailure, callbackSuccess);
    }


}

function addLocation(site, location, callbackFailure, callbackSuccess) {
    // console.log('Sending post for ' + site + "," + location);
    $.ajax({
        url: '/api/location',
        type: 'POST',
        data:{ site: site, name: location},
        success: function(result) {
            console.log('success!' + result)
            callbackSuccess();
        },
        error: function(error) {
            console.log('failure!' + result.responseText);
            callbackFailure();
        }

    });
}

// Setup to do in the beginning
$(function() {

    $('#createLocationForm').hide();

    $('#site-picker').change(function() {
        var siteId = getSelectedSite();
        console.log(siteId);
        if (typeof siteId !== 'undefined') {
            selectedSite(siteId);
        }
        else {
            $('#createLocationForm').hide(); 
            resetSelectedSite();
        }
    })
});