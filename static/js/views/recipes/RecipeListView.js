define([
    'jquery',
    'underscore',
    'backbone',
    'collections/recipes',
    'collections/regions',
    'text!templates/recipes/recipeListTemplate.html'

], function($, _, Backbone, Recipes, Regions, recipeListTemplate) {
    var RecipeListView = Backbone.View.extend({
        el: $("#container"),

        populate: function(region_id) {

            var self = this;

            var queryParams = {};

            if (!!region_id) queryParams.data = {
                region_id: region_id
            };

            // Fetch data from the collections
            var complete = _.invoke([Regions, Recipes], 'fetch', queryParams);

            // When data is collected, let's render the view
            $.when.apply($, complete).done(function() {
                self.render(Regions.models, Recipes.models)
            });
        },

        updateRegionLabel: function(region_id){

        },

        render: function(regions, recipes) {

            var region_label = 'All the regions';
            if(regions.length === 1) region_label = regions[0].get('name');

            var mapped_regions = [];

            _.map(regions, function(region) {
                mapped_regions[region.get('id')] = region.get('name');
            });

            var data = {
                regions: mapped_regions,
                recipes: recipes,
                region_label: region_label,
                _: _
            };

            var compiledTemplate = _.template(recipeListTemplate)(data);
            this.$el.html(compiledTemplate);
        }
    });
    return new RecipeListView();
});
