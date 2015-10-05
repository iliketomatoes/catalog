define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/recipes/recipeListHeaderTemplate.html'
], function($, _, Backbone, recipeListHeaderTemplate) {

    var RecipeListHeaderView = Backbone.View.extend({

        template: _.template(recipeListHeaderTemplate),

        initialize: function(options) {
            _.bindAll(this, 'render');

            this.defaultRegion = options.defaultRegion;
            this.render();

        },

        render: function() {
            var data = {
                defaultRegion: this.defaultRegion,
                _: _
            };
            var compiledTemplate = this.template(data);
            $("#recipe-list-header").html(compiledTemplate);

        }

    });

    return RecipeListHeaderView;

});
