// locker-app.js

var app = app || {};

// Rental
app.Rental = Backbone.Model.extend({
    defaults: {
        
    },

    url: function() {
        return this.urlRoot + "/" + this.id;
    },

    urlRoot: '/api/rental',

    parse: function(response) {
        response.id = response._id;
        return response;
    }
});

// LOCKER MODEL
app.Locker = Backbone.Model.extend({
    defaults: {
        
    },

    urlRoot: '/api/locker',

    parse: function(response) {
        response.id = response._id;
        return response;
    }
});

// LOCKER VIEW
app.LockerView = Backbone.View.extend({

    template: $('#locker-view-template').html(),

    editTemplate: $('#locker-edit-view-template').html(),

    className: 'locker',

    events: {
        'click .edit': 'editPressed',
        'click .rent': 'rentPressed',
        'click .cancel': 'cancelEditPressed',
        'click .add-combo': 'addComboPressed',
        'click .save': 'saveEditPressed',

        // Rental
        'click .cancel-button': 'cancelRentPressed',
        'click .edit-button': 'editRentPressed',
        'click .submit-button': 'submitRentPressed',
        'click .remove-rental-button': 'removeRentPressed',
        'blur  input[name="memberID"]': 'checkMemberID',

        'click .destroy': 'destroyPressed',
        'sync': 'render',
        'change select[name="combos"]': 'selectedCombo',
    },

    destroyPressed: function() {

        // modal view
        var self = this;

        $('#message-dialog').text('Are you sure you want to delete this locker?');

        $('#message-dialog').dialog({
            title: "Confirm",
            draggable:false,
            modal: true,
            buttons: [ 
                { text: "Delete", click: function() { $( this ).dialog( "close" ); self.destroy(); } },
                { text: "Cancel", click: function() { $( this ).dialog( "close" ); } }
            ]
        });

    },

    destroy: function() {
        var self = this;

        this.model.destroy({

            success: function() {
                self.remove();
                self.render();
            },

            error: function() {
                // TODO: INSERT ERROR
            }
        });
    },

    addComboPressed: function() {
        this.$el.find('[name="newCombo"]').show();
    },

    selectedCombo: function() {
        var rank = (this.$el.find('select[name="combos"] :selected').attr('rank') );

        if (typeof rank === 'undefined') {
            this.$el.find('input[name="newCombo"]').show();
        }
        else {
            this.$el.find('input[name="newCombo"]').hide();   
        }
    },

    editPressed: function() {
        this.$el.html(_.template(this.editTemplate, this.model.toJSON() ));
        this.$el.addClass('edit-form');
        return this;
    },

    saveEditPressed: function() {
        var attrs = {}

        var name = this.$el.find('input[name="name"]').val();
        attrs['name'] = name;

        var comboObject = this.$el.find('select[name="combos"] option:selected');
        var combos = [];
        
        // Selecting combos
        if (typeof comboObject.attr('rank') === 'undefined') {
            var newCombo = this.$el.find('input[name="newCombo"]').val();
            // TODO validate combo
            if (newCombo.length) {
                combos = this.model.get('combos');
                combos.splice(0,0,newCombo);

                attrs['combos'] = combos;    
            }
        }

        // Rotate order of combos
        else {
            var rank = comboObject.attr('rank');
            var modelCombos = this.model.get('combos');

            combos = modelCombos.slice(rank, modelCombos.length);
            combos = combos.concat(modelCombos.slice(0, rank));

            attrs['combos'] = combos;
        }

        var notes = this.$el.find('textarea[name="notes"]').val();

        attrs['notes'] = notes;

        var self = this;
        this.model.save(attrs, {
            error: function() {
                // TODO SHOW ERRORS
            },
            success: function() {
                self.render();
                self.$el.removeClass('edit-form');
            }

        });
    },

    cancelEditPressed: function() {
        this.$el.removeClass('edit-form');
        this.render();
        return this;
    },

//  RENTAL CONTROL
    checkMemberID: function() {
        // only on edit should fire

        var memberID = this.$el.find('input[name="memberID"]').val();
        var messageEl = this.$el.find('input[name="memberID"] + .input-message');

        if (memberID === '') {
            messageEl.text('Required field');
            messageEl.css('color', 'red');
            messageEl.show();
            return;
        }
        if (memberID === this.model.get('memberID')) {
            messageEl.hide();
            return;
        }

        
        var location = this.model.get('location');
        messageEl.text('Checking user...');
        messageEl.css('color', 'black');
        messageEl.show();

        var lockerView = this;

        $.ajax({
            url: '/api/locker/verifyID',
            type: 'GET',
            data: {id: memberID, location: location},
            error: function(error) {
                messageEl.text('Cannot verify ID');
                messageEl.css('color', 'red');
                console.log(error);
            },
            success: function(message) {
                if (message.success) {
                    messageEl.css('color', 'green');
                    messageEl.text("Verified member");
                    var attrs = ['firstName', 'lastName', 'phone', 'email'];
                    var memberInfo = message.member;
                    for (var i = 0; i < attrs.length; i++) {
                        var param = attrs[i];
                        if (memberInfo[param]) {
                            lockerView.$el.find('.rent-form input[name="' + param + '"]').val(memberInfo[param]);
                        }
                    }
                }
                else {
                    messageEl.css('color', 'red');
                    messageEl.text(message.text);
                }
                
            }
        });

    },

    submitRentPressed: function() {
        var attrs = {};

        this.$el.find('.rent-form .rental-input[name]').each(function() {
            attrs[$(this).attr('name')] = $(this).val();
        });

        var lockerView = this;

        this.model.save(attrs, {
            patch: true,
            error: function() {
                // TODO SHOW ERRORS
            },
            success: function() {
                lockerView.render();
            }
        });

        return false;
    },

    editRentPressed: function() {
        this.$el.find('.rental-label').hide();
        this.$el.find('.input-message').hide();
        this.$el.find('.rental-input').show();
        return false;
    },

    removeRentPressed: function() {
        var lockerView = this;

        $('#message-dialog').text('Are you sure you want to delete this rental?');

        $('#message-dialog').dialog({
            title: "Confirm",
            draggable:false,
            modal: true,
            buttons: [ 
                { text: "Delete", click: function() { $( this ).dialog( "close" ); 
                    lockerView.model.save({available: true, memberID: ''}, {
                    patch: true,
                    error: function(error) {
                        // TODO SHOW ERRORS
                        console.log(err);
                    },
                    success: function() {
                        lockerView.render();
                    }
                });
                } },
                { text: "Cancel", click: function() { $( this ).dialog( "close" ); } }
            ]
        });

        return false;
    },

    rentPressed: function() {
        // TODO  Display rent info, get current rent info, and render

        if (! this.$el.find('.rent-form').is(':visible')) {
            // retrieve from server
            if ( this.model.get('available') ) {
                this.$el.find('.rental-input').show();
                this.$el.find('.rental-label').hide();
            }
            else {
                this.$el.find('.rental-input').hide();
                this.$el.find('.rental-label').show();   
            }
            this.toggleRent();
        }
        else {
            this.toggleRent();
        }
    },

    cancelRentPressed: function() {
        this.toggleRent();
        return false;
    },

    toggleRent: function() {
        this.$el.find('.callout-arrow').toggle({duration:200});
        this.$el.find('.rent-form').toggle({duration:300});
    },

// DISPLAY
    render: function() { 
        var tmpl = _.template(this.template);

        if (this.model.get('available')) {
            this.$el.addClass('available');
            this.$el.removeClass('unavailable');
        }
        else {
            this.$el.removeClass('available');
            this.$el.addClass('unavailable');   
        }

        var startDate = new Date(this.model.get('startDate'));
        var endDate = new Date(this.model.get('endDate'));

        this.model.set('startDateFormatted', startDate.toDateString());
        this.model.set('endDateFormatted', endDate.toDateString());

        this.$el.html(tmpl( this.model.toJSON() ));

        this.$el.find('input[name="startDate"]').datepicker({ dateFormat: 'D M dd yy'});
        this.$el.find('input[name="endDate"]').datepicker({ dateFormat: 'D M dd yy' });

        return this;
    }
});

// LOCKER COLLECTION
app.LockerList = Backbone.Collection.extend({
    model: app.Locker
    // url: '/api/locker/location'
});

// LOCKER COLLECTION VIEW
app.LockerListView = Backbone.View.extend({
    el: $('#locker-view'),

    initialize: function() {
        this.collection = new app.LockerList();
        
        this.collection.comparator = function(model) { return parseInt(model.get('name')); };
        
        this.listenTo( this.collection, 'add', this.renderLocker );
        this.listenTo( this.collection, 'reset', this.render );

        this.collection.rootUrl = '/api/locker/location/';
        
    },

    events: {
        'click .show-add-lockers': 'toggleAddLockersForm',
        'click .add-lockers-cancel-button': 'toggleAddLockersForm',
        'click .add-lockers-button': 'addLockers',

        'change #sort-locker': 'sortLockers',
        'change #filter-locker': 'filterChanged',
        'click button.filter-lockers-control[name="search"]' :'filterLockers',
        'click button.filter-lockers-control[name="reset"]' :'resetFilterLockers'
    },

    toggleAddLockersForm: function() {
        // TODO
        this.$el.find('.add-lockers-form').toggle();
        this.$el.find('.show-add-lockers').toggle();
    },

    addLockers: function() {
        
        // disable button
        this.$el.find('.add-lockers-form button').attr('disabled', 'disabled');

        var numLockers = parseInt(this.$el.find('.add-lockers-input').val());

        var location = this.location;
        var site = this.site;

        if (_.isNumber(numLockers) && numLockers % 1 === 0 && numLockers <= 1000 && numLockers > 0) {
            var self = this;
            $.ajax({
                url: '/api/locker/' + numLockers, 
                type:'POST',
                data: {location: location, site: site},
                success: function() {
                    // need to render data
                    self.$el.find('.add-lockers-input button').removeAttr('disabled');
                    self.toggleAddLockersForm();
                    
                    self.collection.fetch({reset:true});
                },
                error: function(err) {
                    self.$el.find('.add-lockers-input button').removeAttr('disabled');
                    console.log(err);

                }
            });
        }
        else {
            this.$el.find('.add-lockers-input button').removeAttr('disabled');
            alert("Error: Only numbers between 1 and 1000");
        }
    },

    sortLockers: function() {

        var comparator = this.$el.find('#sort-locker :selected').val();

        if (!comparator) {
            return;
        }

        if (comparator === 'number') {
            this.collection.comparator = function(model) { return parseInt(model.get('name')); };
        }
        else {
            this.collection.comparator = comparator;
        }
        this.collection.sort();
        this.renderLockers();
    },

    filterChanged: function() {
        var filterBy = this.$el.find('#filter-locker :selected').val();

        if (! filterBy) {
            this.$el.find('.filter-lockers-control').hide();
            return;
        }
        this.$el.find('.filter-lockers-control').show();

    },

    resetFilterLockers: function() {
        delete this.filterBy;
        delete this.filterText;
        delete this.filterExact;

        this.renderLockers();
    },

    filterLockers: function() {
        this.filterBy = this.$el.find('#filter-locker :selected').val();
        this.filterText = this.$el.find('input.filter-lockers-control[type="text"]').val();
        this.filterExact = this.$el.find('input.filter-lockers-control[type="checkbox"]').prop('checked');

        this.renderLockers();
    },

    reset: function() {
        this.$el.html('<div id="lockers"></div>');

        delete this.filterBy;
        delete this.filterText;
        delete this.filterExact;

    },

    renderLocker: function(locker) {
        var lockerView = new app.LockerView({
            model: locker
        });
        this.$el.find('#lockers').append( lockerView.render().el );
    },

    renderLockers: function() {

        $('#message-dialog').dialog({
            dialogClass: "no-close",
            title: "Rendering lockers",
            modal: true
        });
        
        this.$el.find('#lockers').html('');

        var filterBy = this.filterBy;
        var filterText = this.filterText;
        var filterExact = this.filterExact;

        var filterFunction;
        if (typeof filterBy !== 'undefined' && typeof filterText !== 'undefined' && typeof filterExact !== 'undefined') {
            if (filterExact) {
                filterFunction = function(locker) {
                    return locker.get(filterBy) === filterText;
                }
            }
            else {
                filterFunction = function(locker) {
                    return locker.get(filterBy) && locker.get(filterBy).toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
                }
            }
        }

        this.collection.each(function(locker) {
            if (filterFunction) {
                if (filterFunction(locker)) {
                    this.renderLocker( locker );
                }
            }
            else {
                this.renderLocker( locker );    
            }

        }, this );

        this.$el.find('input[name="startDate"]').datepicker({ dateFormat: 'D M dd yy'});
        this.$el.find('input[name="endDate"]').datepicker({ dateFormat: 'D M dd yy' });

        $('#message-dialog').dialog('close');
    },

    render: function() {
        this.reset();

        // Add locker button
        this.$el.html(_.template($('#locker-list-view-setup-template').html()) );

        this.$el.find('.add-lockers-form').toggle();

        this.renderLockers();
    }
});

app.LocationsView = Backbone.View.extend({
    el: $('#location-picker'),

    events: {
        'fetch' : 'initializeFetch'
    },

    fetch: function() {
        this.$el.find('input[name="startDate"]').datepicker({ dateFormat: 'D M dd yy'});
        this.$el.find('input[name="endDate"]').datepicker({ dateFormat: 'D M dd yy' });   
    }
});

app.BodyView = Backbone.View.extend({
    el: $('#locker-app'),

    initialize: function() {
        this.lockerListView = new app.LockerListView();
        this.$el.find('#location-picker').hide();

        // Select grid
        
    },

    events: {
        'click #changeCollection': 'toggleCollection',
        'change #site-picker': 'updateLocations',
        'change #location-picker': 'updateLockers',
        'change #layout-form input[type=radio]': 'updateLayout',
    },

    updateLayout: function() {
        var layoutStyle = $('#layout-form input[name="layout"]:checked').val();

    },

    updateLocations: function() {
        var siteId = this.$el.find('#site-picker option:selected').attr('id');
        
        this.lockerListView.site = siteId;

        $('#location-picker').html('<option selected="true">Then choose a location</option>');

        if (!siteId) {
            this.updateLockers();
            this.$el.find('#location-picker').hide();      
            return;
        }

        this.$el.find('#location-picker').show();

        $('#ajax-dialog').text('Fetching locations');

        $.get('/api/location', {site: siteId}, function(data, textStatus, jqXHR) {

            _.each(data, function(item) {
                $('#location-picker').append(_.template($('#location-template').html(), 
                    {name: item.name, id:item._id}));
            });

        });
    },

    updateLockers: function() {
        var locationId = this.$el.find('#location-picker option:selected').attr('id');
        this.lockerListView.location = locationId;

        this.lockerListView.reset();
        if (!locationId) {
            return;
        }

        $('#ajax-dialog').text('Fetching lockers');

        this.lockerListView.collection.url = this.lockerListView.collection.rootUrl + locationId;
        this.lockerListView.collection.fetch({reset:true});
    },

    toggleCollection: function() {
        this.lockerListView.toggleCollection();

    }

});

initialize = function() {
    
    // AJAX
    $(document).ajaxStart(function () {
        $('#ajax-dialog').dialog({
            dialogClass: "no-close",
            title: "Loading",
            modal: true,
            
        });
    }).ajaxStop(function () {
        $('#ajax-dialog').dialog('close');
    });

    // Setup rental dialog

}

$(function() {

    new app.BodyView();
    initialize();

});



