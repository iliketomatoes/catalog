// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/topbar/TopBarView', 
    'views/recipes/RecipesListView'
], function($, _, Backbone, TopBarView, RecipesListView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            'recipes': 'showRecipes',

            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function() {

        var app_router = new AppRouter;

        var topBarView = new TopBarView();

        app_router.on('route:showRecipes', function() {

            var recipesListView = new RecipesListView();
            recipesListView.render();

        });

        app_router.on('route:defaultAction', function(actions) {

            // We have no matching route, lets display the home page 
            var recipesListView = new RecipesListView();
            recipesListView.render();
        });


        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
