// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/topbar/TopBarView', 
    'views/recipes/RecipeListView',
    'views/recipes/NewRecipeView'
], function($, _, Backbone, TopBarView, RecipeListView, NewRecipeView) {

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

            RecipesListView.populate();

        });

        app_router.on('route:defaultAction', function(actions) {

            // We have no matching route, lets display the home page 
            RecipeListView.populate();
    
        });

        app_router.on('route:newRecipe', function() {
            // We have no matching route, lets display the home page 
            NewRecipeView.populate();
        });

       TopBarView.render();

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
