// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'regionmenu',
    'views/topbar/TopBarView',
    'views/recipes/RecipeListView',
    'views/recipes/NewRecipeView',
    'views/regionsmenu/RegionsMenuView',
    'collections/regions',
], function($, _, Backbone, regionmenu, TopBarView, RecipeListView, NewRecipeView, RegionsMenuView, Regions) {

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

        // Fetch data from the collections
        var regions = _.invoke([Regions], 'fetch');

        // When data is collected, let's render the view
        $.when.apply($, regions).done(function() {

            app_router.on('route:showRecipes', function() {
                RecipesListView.populate();
            });

            app_router.on('route:filterByRegion', function(region_id) {
                RecipeListView.populate(region_id);
            });

            app_router.on('route:newRecipe', function() {
                NewRecipeView.render();
            });

            app_router.on('route:defaultAction', function() {
                // We have no matching route, lets display the home page 
                RecipeListView.populate();
            });

            TopBarView.render();

            RegionsMenuView.render()

            Backbone.history.start();
        });

    };

    return {
        initialize: initialize
    };

});
