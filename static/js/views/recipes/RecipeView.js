define([
    'jquery',
    'underscore',
    'backbone',
    'collections/recipes',
    'models/recipe',
    'text!templates/recipes/recipeTemplate.html'
], function($, _, Backbone, Recipes, Recipe, recipeTemplate) {
    var RecipeView = Backbone.View.extend({
        el: $("#container"),

        regions: null,

        populate: function(RegionCollection, model) {
            this.regions = RegionCollection.models;
            var RecipeCollection = new Recipes([model]);
            model.bind("change", _.bind(this.render, this));
            model.fetch();
        },

        render: function(recipes) {
            
            var mapped_regions = [];

            _.map(this.regions, function(region) {
                mapped_regions[region.get('id')] = region.get('name');
            });


            var data = {
                regions: mapped_regions,
                recipes: recipes,
                _: _
            };

            var compiledTemplate = _.template(recipeTemplate)(data);
            this.$el.html(compiledTemplate);
        }
    });
    return new RecipeView();
});
