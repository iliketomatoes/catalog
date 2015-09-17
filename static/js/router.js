// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/topbar/TopBarView',
    'views/recipes/RecipeListView',
    'views/recipes/RecipeView',
    'views/recipes/NewRecipeView',
    'views/regionsmenu/RegionsMenuView',
    'collections/regions'
], function(
    $,
    _,
    Backbone,
    TopBarView,
    RecipeListView,
    RecipeView,
    NewRecipeView,
    RegionsMenuView,
    RegionCollection
) {

    $.ajaxSetup({
        headers: {
            "Accept": "application/json; charset=UTF-8",
            "Content-Type": "application/json; charset=UTF-8"
        }
    });

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

        var app_router = new AppRouter();

        var regions = new RegionCollection();

        // Fetch data from the collections
        var promise = _.invoke([regions], 'fetch');

        // When regions are collected, let's render the view
        $.when.apply($, promise).done(function() {

            app_router.on('route:showRecipes', function() {
                var showRecipes = new RecipeListView({regions: regions});
            });

            app_router.on('route:filterByRegion', function(region_id) {
                var filterRecipes = new RecipeListView({regions: regions, region_id: region_id});
            });

            app_router.on('route:newRecipe', function() {
                var newRecipe = new NewRecipeView({regions: regions});
            });

            app_router.on('route:showOneRecipe', function(recipe_id) {    
                var readRecipeView = new RecipeView({regions: regions, recipe_id: recipe_id});
            });

            TopBarView.render();

            RegionsMenuView.render(regions);

            Backbone.history.start();
        });

    };

    return {
        initialize: initialize
    };

});
