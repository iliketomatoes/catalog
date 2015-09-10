define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above,
    //'models/project/ProjectModel',
    'collections/recipes',
    'collections/regions',
    'text!templates/recipes/recipeListTemplate.html',
    'text!templates/recipes/recipeListItemTemplate.html'

], function($, _, Backbone, Recipes, Regions, recipeListTemplate, recipeListItemTemplate) {
    var RecipeListView = Backbone.View.extend({
        el: $("#container"),

        populate: function(){

            var self = this;

            // Fetch data from the collections
            var complete = _.invoke([Regions, Recipes], 'fetch');

            // When data is collected, let's render the view
            $.when.apply($, complete).done(function() {
               self.render(Regions.models, Recipes.models)
            });
        },

        render: function(regions, recipes) {

            var mapped_regions = [];
            
            _.map(regions, function(region){
                mapped_regions[region.get('id')] = region.get('name');
            });

            var data = {
                regions: mapped_regions,
                recipes: recipes,
                _: _
            };

            var compiledTemplate = _.template(recipeListTemplate)(data);
            this.$el.html(compiledTemplate);
        }
    });
    return new RecipeListView();
});
