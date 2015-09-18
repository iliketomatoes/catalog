define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/flash/flashTemplate.html',
    'domready',
    'foundation.alert'
], function($, _, Backbone, flashTemplate, domready) {

    var FlashView = Backbone.View.extend({

        el: $("#flash-message-ctr"),

        initialize: function(status, message) {


        },

        render: function(status, message) {

            var data = {
                status: status,
                message: message,
                _: _
            };

            var compiledTemplate = _.template(flashTemplate)(data);

            this.$el.html(compiledTemplate);

            domready(function(){
                $(document).foundation('alert', 'reflow');
            });
            
        }

    });

    return FlashView;

});
