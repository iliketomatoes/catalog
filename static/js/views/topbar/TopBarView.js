define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/topbar/topbarTemplate.html',
    'domready',
    'foundation.topbar'
], function($, _, Backbone, topbarTemplate, domready) {

    var TopBarView = Backbone.View.extend({
        el: $("#nav-container"),

        initialize: function() {

            this.render();

        },

        render: function() {

            var data = {
                data: null,
                _: _
            };

            var compiledTemplate = _.template(topbarTemplate)(data);

            this.$el.html(compiledTemplate);

            domready(function(){
                $(document).foundation();
            });
            
        }

    });

    return TopBarView;

});
