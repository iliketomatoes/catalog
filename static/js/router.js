// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/topbar/TopBarView', 
    'views/recipes/RecipesListView',
    'views/recipes/NewRecipeView'
], function($, _, Backbone, TopBarView, RecipesListView, NewRecipeView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            
            'recipes': 'showRecipes',

            'new_recipe': 'newRecipe',

            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function() {

        var app_router = new AppRouter;      

        app_router.on('route:showRecipes', function() {

            var recipesListView = new RecipesListView();
            recipesListView.render();

        });

        app_router.on('route:defaultAction', function(actions) {

            // We have no matching route, lets display the home page 
            var recipesListView = new RecipesListView();
            recipesListView.render();
        });

        app_router.on('route:newRecipe', function() {
            // We have no matching route, lets display the home page 
            var newRecipeView = new NewRecipeView();
        });

        var topBarView = new TopBarView();

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
