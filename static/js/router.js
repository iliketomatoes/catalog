// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/topbar/TopBarView',
    'views/recipes/RecipeListView',
    'views/recipes/RecipeView',
    'views/recipes/FormRecipeView',
    'views/regionsmenu/RegionsMenuView',
    'views/recipes/AddPictureView',
    'collections/regions'
], function(
    $,
    _,
    Backbone,
    TopBarView,
    RecipeListView,
    RecipeView,
    FormRecipeView,
    RegionsMenuView,
    AddPictureView,
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

            'edit/:recipe_id': 'editRecipe',

            'picture/:recipe_id': 'editPicture',

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

            var formRecipe = new FormRecipeView({
                regions: regions
            });

            var recipeList = new RecipeListView({
                regions: regions
            });

            var readRecipeView = new RecipeView({
                regions: regions
            });

            app_router.on('route:showRecipes', function() {
                recipeList.populate();
            });

            app_router.on('route:filterByRegion', function(region_id) {
                recipeList.populate(region_id);
            });

            app_router.on('route:newRecipe', function() {
                formRecipe.populate();
            });

            app_router.on('route:editRecipe', function(recipe_id) {
                formRecipe.populate(recipe_id);
            });

            app_router.on('route:editPicture', function(recipe_id) {
                var addPicView = new AddPictureView({recipe_id: recipe_id, old: true});
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
