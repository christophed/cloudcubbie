// Globals for this page

document.App = document.App || {};

var App = document.App;

// App.data = App.data || {};
App.lockers = App.lockers || {};

/* USER EDITS LOCKERS */

function submitLockerEdit(lockerElement) {
    return false;
}

function cancelLockerEdit(lockerElement) {
    console.log(lockerElement);
    lockerElement.find('.locker-display').toggle();
    lockerElement.find('.locker-edit').toggle();
    return false;
}

/* USER ADDS LOCKERS */

function clickToAddLockersPressed() {
    $('#locker-view').append(_.template($('#locker-addition-template').html()));
    $('#addLockersButton').remove();
}

function addLockersPressed() {
    $('locker-addition-form button').attr('disabled', true);

    var numLockers = $('#locker-addition-form input[name="numLockers"]').val();
    var location = getSelectedLocation();
    var site = getSelectedSite();

    // Valdiation here
    $.ajax({
        url: '/api/locker/' + numLockers, 
        type:'POST',
        data: {location: location, site: site}, 
        success: function(data) {

            // Hard reload, bad
            selectedLocation(location);
            // $('locker-addition-form button').removeAttr('disabled');
        },
        error: function(err) {
            console.log(err);
            $('locker-addition-form button').removeAttr('disabled');
        }
    });
}

/* LOCKER VIEW */

function refreshLockerView() {
    var selectedLockers = App.lockers[getSelectedLocation()];
    var layoutStyle = getLayoutStyle(); // TODO

    $('#locker-view').html(''); // clear

    if (selectedLockers) {

        if (selectedLockers.length) {

            $('#locker-view').append($('<h3>'+ selectedLockers.length +' locker' + (selectedLockers.length > 1? 's' : '') +'</h3>'));

            _.each(selectedLockers, function(locker) {     
                locker.id = locker._id;
                $('#locker-view').append(_.template($('#locker-view-template').html(), locker));

                var justAdded = $('#locker-view :last-child');

                justAdded.find('.edit-button').click(function() {
                    justAdded.find('.locker-display').toggle();
                    justAdded.find('.locker-edit').toggle();
                });

                justAdded.find('.save-button').click(function() {
                    submitLockerEdit($(this));
                });
                
                justAdded.find('.cancel-button').click(function() {
                    // cancelLockerEdit($(this));
                    var lockerView = $(this).parent();
                    lockerView.find('.locker-display').toggle();
                    lockerView.find('.locker-edit').toggle();
                });
            });

            $('.locker-edit').toggle();

        }
        else {
            $('#locker-view').append($('<h3>No lockers</h3>'));
        }
        $('#locker-view').append($('<button id="addLockersButton" onclick="clickToAddLockersPressed()">Add lockers</button>'))
    }
    else {
        $('#locker-view').append($('<h3>Select a location</h3>'));
    }
}

/* USER SELECTIONS */

function selectedLocation(locationId) {

    var jqxhr = $.get('/api/locker', {location: locationId}, function (data) {
        
        App.lockers[locationId] = data;
        refreshLockerView();

    })
    .fail(function(err) {
        console.log(err);
    })
}


function selectedSite(siteId) {
    $.get('/api/location', {site: siteId}, function(data, textStatus, jqXHR) {
        
        $('#location-picker').html('<option selected="true">Then choose a location</option>');

        _.each(data, function(item) {
            $('#location-picker').append(_.template($('#location-template').html(), 
                {name: item.name, id:item._id}));
        });

    });
}

/* HELPERS */

function resetSelectedSite() {
    $('#location-picker').html('<option>Then choose a location</option>');
    resetLocationView();
}

function resetLocationView() {
    $('#locker-view').html('');
}

function getSelectedSite() {
    return $('#site-picker option:selected').attr('id');
}

function getSelectedLocation() {
    return $('#location-picker option:selected').attr('id');
}

function getLayoutStyle() {
    return ($('#layout-form input:checked').val());
}

function selectedLayout() {
    refreshLockerView();
}

/* ADD LISTENERS */

// $(function() {
    
//     // React to changing the site
//     $('#site-picker').change(function() {
//         var siteId = getSelectedSite();
        
//         if (typeof siteId !== 'undefined') {
//             selectedSite(siteId);
//         }
//         else {
//             resetSelectedSite();
//         }
//     });

//     $('#location-picker').change(function() {
//         var locationId = getSelectedLocation();
        
//         if (typeof locationId !== 'undefined') {
//             selectedLocation(locationId);
//         }
//     });

//     $('#layout-form input[value="row"]').attr('checked', 'checked');
// });