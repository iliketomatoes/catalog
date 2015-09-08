define(['underscore', 'backbone'], function(_, Backbone) {
  var RecipeModel = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      done: false
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
    },

    clear: function() {
      this.destroy();
      this.view.remove();
    }

  });
  return RecipeModel;
});
