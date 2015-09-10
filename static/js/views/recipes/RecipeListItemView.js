define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above,
    //'models/project/ProjectModel',
    //'collections/projects/ProjectsCollection',
    'text!templates/recipes/recipeListTemplate.html'

], function($, _, Backbone, recipesListTemplate) {
    var RecipeListView = Backbone.View.extend({
        el: $("#container"),

        render: function() {

            var data = {
                data: null,
                _: _
            };

            var compiledTemplate = _.template(recipesListTemplate)(data);
            this.$el.html(compiledTemplate);
        }
    });
    return new RecipeListView();
});
