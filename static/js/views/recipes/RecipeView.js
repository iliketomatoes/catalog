define([
    'jquery',
    'underscore',
    'backbone',
    'collections/recipes',
    'models/recipe',
    'text!templates/recipes/recipeTemplate.html'
], function($, _, Backbone, RecipeCollection, RecipeModel, recipeTemplate) {
    var RecipeView = Backbone.View.extend({
        el: $("#container"),

        template: _.template(recipeTemplate),

        initialize: function(options) {

            var self = this;
            this.regions = options.regions;

            self.mapped_regions = [];
            _.map(self.regions.models, function(region) {
                self.mapped_regions[region.get('id')] = region.get('name');
            });

            _.bindAll(this, 'render');

            this.model = new RecipeModel({
                id: options.recipe_id
            });
            this.model.parse = function(response){
                return response.collection[0];
            };
            this.collection = new RecipeCollection([this.model]);

            this.model.bind('change', this.render);

            var queryParams = {
                success: function(recipes, response){
                    if (response.collection.length == 0) {
                        var emptyCategory = '<div class="row"><div class="small-12 columns">';
                        emptyCategory += '<h2 class="text-center m-t-3">There are no recipes corresponding to the given id.</h2>';
                        emptyCategory += '</div></div>';

                        self.$el.html(emptyCategory);
                    }
                }
            };

            this.model.fetch(queryParams);
        },

        render: function(recipe) {

            var data = {
                regions: this.mapped_regions,
                recipe: recipe,
                _: _
            };

            var compiledTemplate = this.template(data);
            this.$el.html(compiledTemplate);
        }
    });
    return RecipeView;
});
