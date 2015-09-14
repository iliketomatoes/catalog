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

        regions: null,

        initialize: function(){
            this.regions = Regions.models;
        },

        populate: function(region_id) {

            var self = this;

            var queryParams = {};

            if (!!region_id) queryParams.data = {
                region_id: region_id
            };

            // Fetch data from the collections
            var complete = _.invoke([Recipes], 'fetch', queryParams);

            // When data is collected, let's render the view
            $.when.apply($, complete).done(function() {
                self.render(self.regions, Recipes.models, region_id);
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
