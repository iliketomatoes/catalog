// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
    'router', // Request router.js
], function($, _, Backbone, Router) {

    $.ajaxSetup({
        headers: {
            'italian-recipes-token': window.italianRecipesToken
        }
    });

    var initialize = function() {
        // Pass in our Router module and call it's initialize function
        Router.initialize();
    };

    return {
        initialize: initialize
    };
});
