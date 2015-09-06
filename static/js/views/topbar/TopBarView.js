define([
    'jquery',
    'underscore',
    'backbone',
    'materialize',
    'text!templates/topbar/topbarTemplate.html'
], function($, _, Backbone, Materialize, topbarTemplate) {

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
            //$(".button-collapse").sideNav();

        }

    });

    return TopBarView;

});
