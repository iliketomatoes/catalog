define([
    'jquery',
    'underscore',
    'backbone',
    'regionmenu',
    'text!templates/regionsmenu/regionsMenuTemplate.html',
    'domready'
], function($, _, Backbone, regionmenu, newRecipeTemplate, domready) {

    var RegionsMenuView = Backbone.View.extend({
        el: $("#modal-menu-ctr"),

        render: function(regions) {

            var totalCount = 0;

            _.each(regions.models, function(region){
                totalCount += region.get('count');
            });

            var data = {
                regions: regions.models,
                totalCount: totalCount,
                _: _
            };

            var compiledTemplate = _.template(newRecipeTemplate)(data);
            this.$el.html(compiledTemplate);
        }
    });
    return new RegionsMenuView();

});
