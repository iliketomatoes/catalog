// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'regionmenu',
    'views/topbar/TopBarView',
    'views/recipes/RecipeListView',
    'views/recipes/NewRecipeView'
], function($, _, Backbone, regionmenu,TopBarView, RecipeListView, NewRecipeView) {

    var AppRouter = Backbone.Router.extend({
        routes: {

            'recipes': 'showRecipes',

            'new_recipe': 'newRecipe',

            'region/:region_id': 'filterByRegion',

            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function() {

        var app_router = new AppRouter;

        app_router.on('route:showRecipes', function() {
            RecipesListView.populate();
        });

        app_router.on('route:filterByRegion', function(region_id) {
            RecipeListView.populate(region_id);
        });

        app_router.on('route:newRecipe', function() {
            NewRecipeView.populate();
        });

        app_router.on('route:defaultAction', function() {
            // We have no matching route, lets display the home page 
            RecipeListView.populate();
        });

        TopBarView.render();

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
