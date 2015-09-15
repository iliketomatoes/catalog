define([
    'underscore',
    'backbone',
    'models/recipe'
], function(_, Backbone, Recipe) {

    var RecipesCollection = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Recipe,

        url: '/recipes',

        parse: function(response){
            return response.collection;
        }

    });

    return RecipesCollection;
});
