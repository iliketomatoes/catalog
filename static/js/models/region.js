define(['underscore', 'backbone'], function(_, Backbone) {
  var RegionModel = Backbone.Model.extend({

    // Default attributes for the region.
    defaults: {
      name: "empty name"
    },
    // Ensure that each todo created has `content`.
    initialize: function() {
    },

    clear: function() {
      this.destroy();
      this.view.remove();
    }

  });
  return RegionModel;
});
