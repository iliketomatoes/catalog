define([
    'jquery',
    'underscore',
    'backbone',
    'collections/recipes',
    'text!templates/recipes/recipeListTemplate.html'
], function($, _, Backbone, Recipes, recipeListTemplate) {
    var RecipeListView = Backbone.View.extend({
        el: $("#container"),

        populate: function(RegionCollection, region_id) {

            var self = this;

            var queryParams = {};

            if (!!region_id) queryParams.data = {
                region_id: region_id
            };

            var RecipesCollection = new Recipes();
            // Fetch data from the collections
            var promise = _.invoke([RecipesCollection], 'fetch', queryParams);

            // When data is collected, let's render the view
            $.when.apply($, promise).done(function() {
                self.render(RegionCollection.models, RecipesCollection.models, region_id);
            });
        },

        render: function(regions, recipes, selected_region) {

            var defaultRegion = {
                id: 0,
                name: 'All the regions'
            };

            var mapped_regions = [];

            _.map(regions, function(region) {
                mapped_regions[region.get('id')] = region.get('name');
            });

            if (selected_region) {
                defaultRegion.id = selected_region;
                defaultRegion.name =  mapped_regions[selected_region];
            }

            var data = {
                regions: mapped_regions,
                recipes: recipes,
                defaultRegion: defaultRegion,
                _: _
            };

            var compiledTemplate = _.template(recipeListTemplate)(data);
            this.$el.html(compiledTemplate);
        }
    });
    return new RecipeListView();
});
