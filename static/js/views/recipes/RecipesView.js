define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above,
    //'models/project/ProjectModel',
    //'collections/projects/ProjectsCollection',
    'text!templates/recipes/recipesListTemplate.html'

], function($, _, Backbone, recipesListTemplate) {
    var RecipesListView = Backbone.View.extend({
        el: $("#container"),

        render: function() {

            var data = {
                data: null,
                _: _
            };

            var compiledTemplate = _.template(recipesListTemplate)(data);
            console.log(compiledTemplate)
            this.$el.html(compiledTemplate);
        }
    });
    return RecipesListView;
});
