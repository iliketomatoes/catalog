define([
    'underscore',
    'backbone',
    'models/recipe'
], function(_, Backbone, Recipe) {

    var RecipesCollection = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Recipe,

        // Save all of the todo items under the `"todos"` namespace.
        url: '/recipes'

    });

    return new RecipesCollection();
});
