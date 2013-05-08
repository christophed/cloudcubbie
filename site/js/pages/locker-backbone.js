// locker-backbone.js

var app = app || {};

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
        
        // 
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

    rentPressed: function() {
        // TODO
        var attrs = {};
        var available = this.model.get('available');

        attrs['available'] = !this.model.get('available');

        // Already rented
        if (!available) {
            return this.displayRentalForm(false);
        }

        var self = this;
        this.model.save(attrs, {
            patch: true,
            error: function() {
                // TODO
            },
            success: function() {
                // Callback for fillout out renting info
                self.displayRentalForm(true);
            }
        });
    },

    removeRentalPressed: function() {

    },

    setRentControl: function(newRental) {
        var self = this;

        var removeButtonClass = ".remove-button";
        if (newRental) {
            removeButtonClass = ".cancel-button";
        }

        // Remove
        $('#rental-dialog ' + removeButtonClass).click(function() {
            var attrs = {available:true};
            // Remove
            self.model.save(attrs, {
                patch: true,
                error: function() {
                    // TODO
                },
                success: function() {
                    // Callback for fillout out renting info
                    self.render();
                    $('#rental-dialog').dialog('close');
                }
            });
            return false;
        });

        // Edit button
        $('#rental-dialog .edit-button').click(function() {

        });
    },

    displayRentalForm: function(newRental) {

        if (newRental) {
            $('#rental-dialog label').hide();
            $('#rental-dialog input').show();

            $('#rental-dialog .edit-button').hide();
            $('#rental-dialog .remove-button').hide();

            $('#rental-dialog .submit-button').show();
        }
        else {
            $('#rental-dialog label').show();
            $('#rental-dialog input').hide();

            $('#rental-dialog .edit-button').show();
            $('#rental-dialog .remove-button').show();   

            $('#rental-dialog .submit-button').hide();
        }

        this.setRentControl(newRental);

        $('#rental-dialog').dialog({
            title: "Rental information",
            modal: true,
        });

        this.render();
    },

    createRental: function() {

    },


// DISPLAY

    render: function() { 
        var tmpl = _.template(this.template);

        if (this.model.get('available') == true) {
            this.$el.addClass('available');
            this.$el.removeClass('unavailable');
        }
        else {
            this.$el.removeClass('available');
            this.$el.addClass('unavailable');   
        }
        

        this.$el.html(tmpl( this.model.toJSON() ));
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
        
        this.collection.comparator = 'name';
        
        this.listenTo( this.collection, 'add', this.renderLocker );
        this.listenTo( this.collection, 'reset', this.render );

        this.collection.rootUrl = '/api/locker/location/';
        
    },

    events: {
        'click .show-add-lockers': 'toggleAddLockersForm',
        'click .add-lockers-cancel-button': 'toggleAddLockersForm',
        'click .add-lockers-button': 'addLockers'
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
                    alert(err);
                    console.log(err);
                }
            });
        }
        else {
            alert("Error: Only numbers between 1 and 1000");
            this.$el.find('.add-lockers-input button').removeAttr('disabled');
        }
    },

    reset: function() {
        this.$el.html('<div id="lockers"></div>');
    },

    renderLocker: function(locker) {
        var lockerView = new app.LockerView({
            model: locker
        });
        this.$el.find('#lockers').append( lockerView.render().el );
    },

    render: function() {
        this.reset();

        // Add locker button
        this.$el.html(_.template($('#locker-list-view-setup-template').html()) );

        this.$el.find('.add-lockers-form').toggle();

        this.collection.each(function(locker) {
            this.renderLocker( locker );
        }, this );
    }
});

app.LocationsView = Backbone.View.extend({
    el: $('#location-picker')

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
        'change #layout-form input[type=radio]': 'updateLayout'
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

    $('#rental-dialog [name="startDate"]').datepicker({});
    $('#rental-dialog [name="endDate"]').datepicker({});

    $('#rental-dialog .submit-button').click(function() {
        $('#rental-dialog').dialog('close');
        return false;
    });
       
    $('#rental-dialog .cancel-button').click(function() {
        $('#rental-dialog').dialog('close');
        return false;
    });
}

$(function() {
    new app.BodyView();

    initialize();

});





