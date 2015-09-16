define([
    'jquery',
    'underscore',
    'backbone',
    'views/recipes/RecipeListItemView',
    'collections/recipes',
    'text!templates/recipes/recipeListTemplate.html'
], function($, _, Backbone, RecipeListItemView, RecipeCollection, recipeListTemplate) {
    var RecipeListView = Backbone.View.extend({
        el: $("#container"),

        template: _.template(recipeListTemplate),

        initialize: function(options) {

            var self = this;
            var queryParams = {};

            this.regions = options.regions;

            self.mapped_regions = [];
            _.map(self.regions.models, function(region) {
                self.mapped_regions[region.get('id')] = region.get('name');
            });


            if (!!options.region_id) queryParams.data = {
                region_id: options.region_id
            };

            queryParams.success = function(recipes) {
                //If there are no recipes
                if (recipes.length == 0) {
                    var emptyCategory = '<div class="row"><div class="small-12 columns">';
                    emptyCategory += '<h2 class="text-center">There are no items in this category.</h2>';
                    emptyCategory += '</div></div>';

                    $('.recipe-list-container').html(emptyCategory);
                }
            };

            _.bindAll(this, 'addOne');
            this.collection = new RecipeCollection();
            this.collection.bind('add', this.addOne);

            this.render(options.region_id);
            this.collection.fetch(queryParams);
        },

        render: function(region_id) {

            var defaultRegion = {
                id: 0,
                name: 'All the regions'
            };

            if (region_id) {
                defaultRegion.id = region_id;
                defaultRegion.name = this.mapped_regions[region_id];
            }

            var data = {
                regions: this.mapped_regions,
                defaultRegion: defaultRegion,
                _: _
            };

            var compiledTemplate = this.template(data);
            this.$el.html(compiledTemplate);

        },

        addOne: function(recipe) {
            var view = new RecipeListItemView({
                model: recipe,
                mapped_regions: this.mapped_regions
            });
            $('.recipe-list').append(view.render().el);
        }

    });
    return RecipeListView;
});
