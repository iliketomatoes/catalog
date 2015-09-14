define([
    'jquery',
    'underscore',
    'backbone',
    'collections/regions',
    'text!templates/regionsmenu/regionsMenuTemplate.html',
    'domready'
], function($, _, Backbone, Regions, newRecipeTemplate, domready) {

    var RegionsMenuView = Backbone.View.extend({
        el: $("#modal-menu-ctr"),

        regions: null,

        initialize: function(){
            this.regions = Regions.models;
        },

        render: function() {

            var data = {
                regions: this.regions,
                data: null,
                _: _
            };

            var compiledTemplate = _.template(newRecipeTemplate)(data);
            this.$el.html(compiledTemplate);

            domready(function() {
                //$(document).foundation('slider', 'reflow');
            });
        }
    });
    return new RegionsMenuView();

});
