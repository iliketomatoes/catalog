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

            var newRecipe = new NewRecipeView({regions: regions});

            var recipeList = new RecipeListView({regions: regions});

            var readRecipeView = new RecipeView({regions: regions});

            app_router.on('route:showRecipes', function() {
                recipeList.populate();
            });

            app_router.on('route:filterByRegion', function(region_id) {
                recipeList.populate(region_id);
            });

            app_router.on('route:newRecipe', function() {
                newRecipe.populate();
            });

            app_router.on('route:showOneRecipe', function(recipe_id) {
                readRecipeView.populate(recipe_id);
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
