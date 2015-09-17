define(['underscore', 'backbone'], function(_, Backbone) {
    var RecipeModel = Backbone.Model.extend({

        clear: function() {
            this.destroy();
            this.view.remove();
        }

    });
    return RecipeModel;
});
