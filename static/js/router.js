// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'regionmenu',
    'views/topbar/TopBarView',
    'views/recipes/RecipeListView',
    'views/recipes/RecipeView',
    'views/recipes/NewRecipeView',
    'views/regionsmenu/RegionsMenuView',
    'collections/regions',
    'collections/recipes',
    'models/recipe',
], function($, _, Backbone, regionmenu, TopBarView, RecipeListView, RecipeView, NewRecipeView, RegionsMenuView, Regions, Recipes, Recipe) {

    var AppRouter = Backbone.Router.extend({

        routes: {

            'recipes': 'showRecipes',

            'new_recipe': 'newRecipe',

            'region/:region_id': 'filterByRegion',

            'recipe/:recipe_id': 'showOneRecipe',

            // Default
            '*actions': 'showRecipes'
        }
    });

    var initialize = function() {

        var app_router = new AppRouter;

        var RegionCollection = new Regions();

        // Fetch data from the collections
        var promise = _.invoke([RegionCollection], 'fetch');

        // When data is collected, let's render the view
        $.when.apply($, promise).done(function() {

            app_router.on('route:showRecipes', function() {
                RecipeListView.populate(RegionCollection);
            });

            app_router.on('route:filterByRegion', function(region_id) {
                RecipeListView.populate(RegionCollection, region_id);
            });

            app_router.on('route:newRecipe', function() {
                NewRecipeView.render(RegionCollection);
            });

            app_router.on('route:showOneRecipe', function(id) {
                var recipe = new Recipe({id: id});
                RecipeView.populate(RegionCollection, recipe);
            });

            TopBarView.render();

            RegionsMenuView.render(RegionCollection);

            Backbone.history.start();
        });

    };

    return {
        initialize: initialize
    };

});
