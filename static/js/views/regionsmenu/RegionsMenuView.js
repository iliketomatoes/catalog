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

        render: function(RegionCollection) {

            var data = {
                regions: RegionCollection.models,
                data: null,
                _: _
            };

            var compiledTemplate = _.template(newRecipeTemplate)(data);
            this.$el.html(compiledTemplate);
        }
    });
    return new RegionsMenuView();

});
