define([
    'jquery',
    'underscore',
    'backbone',
    'collections/recipes',
    'models/recipe',
    'text!templates/recipes/recipeTemplate.html'
], function($, _, Backbone, Recipes, Recipe, recipeTemplate) {
    var RecipeView = Backbone.View.extend({
        el: $("#container"),

        template: _.template(recipeTemplate),

        initialize: function(options) {

            this.regions = options.regions;

            //_.bindAll(this, 'render');
            //this.collection.bind('add', this.render);

            var self = this;
            self.mapped_regions = [];
            _.map(self.regions.models, function(region) {
                self.mapped_regions[region.get('id')] = region.get('name');
            });
        },

        populate: function(recipe_id) {
            /*this.regions = RegionCollection.models;
            var recipes = new Recipes([model]);
            model.bind("change", _.bind(this.render, this));
            model.fetch();*/
            var recipe = this.collection.get(recipe_id);
            if(typeof recipe === 'undefined'){
                console.log('è undefined!!!!');
                this.collection.fetch({
                    data: {
                        id: recipe_id
                    }
                });
            }else{
                this.render(recipe);  
            }
            
        },

        render: function(recipe) {

            console.log(recipe);

            var data = {
                regions: self.mapped_regions,
                recipe: recipe,
                _: _
            };

            var compiledTemplate = this.template(data);
            this.$el.html(compiledTemplate);
        }
    });
    return RecipeView;
});
