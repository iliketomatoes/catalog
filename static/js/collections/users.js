define([
    'underscore',
    'backbone',
    'models/user'
], function(_, Backbone, User) {

    var UserCollection = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: User,

        // Save all of the todo items under the `"todos"` namespace.
        url: '/users',

        parse: function(response){
            return response.collection;
        }

    });

    return UserCollection;
});
