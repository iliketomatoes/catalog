define([
    'underscore',
    'backbone',
    'models/region'
], function(_, Backbone, Region) {

    var RegionsCollection = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Region,

        // Save all of the todo items under the `"todos"` namespace.
        url: '/regions',

        parse: function(response){
            return response.collection;
        }

    });

    return new RegionsCollection();
});
