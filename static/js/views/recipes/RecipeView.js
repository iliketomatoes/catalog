define([
    'jquery',
    'underscore',
    'backbone',
    'collections/recipes',
    'models/recipe',
    'text!templates/recipes/recipeTemplate.html',
    'domready',
    'foundation.dropdown',
    'foundation.reveal'
], function($, _, Backbone, RecipeCollection, RecipeModel, recipeTemplate, domready) {
    var RecipeView = Backbone.View.extend({
        el: $("#container"),

        events: {
            'click .recipe-delete-btn': 'deleteItem'
        },

        template: _.template(recipeTemplate),

        initialize: function(options) {

            var self = this;
            this.regions = options.regions;

            self.mapped_regions = [];
            _.each(self.regions.models, function(region) {
                self.mapped_regions[region.get('id')] = region.get('name');
            });

            _.bindAll(this, 'render', 'deleteItem', 'confirmedDeleteItem', 'abortedDeleteItem');
        },

        populate: function(recipe_id) {

            this.undelegateEvents();
            this.delegateEvents();

            this.model = new RecipeModel({
                id: recipe_id
            });
            this.model.parse = function(response) {
                return response.collection[0];
            };
            this.collection = new RecipeCollection([this.model]);

            this.model.bind('change', this.render);

            var queryParams = {
                success: function(recipes, response) {
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

            $('.go-back-btn').one('click', function(e) {
                e.preventDefault();
                Backbone.history.history.back();
            });

            domready(function() {
                $(document).foundation();
            });
        },

        deleteItem: function(e) {
            e.preventDefault();
            var self = this;
            $('#confirm-deletion-name').text(self.model.get('name'));
            $('#confirm-deletion').foundation('reveal', 'open');
            $('.confirm-deletion-confirm').one('click', self.confirmedDeleteItem);
            $('.confirm-deletion-abort').one('click', self.abortedDeleteItem);
        },

        confirmedDeleteItem: function(e) {
            e.preventDefault();
            this.model.clear();
            $('#confirm-deletion').foundation('reveal', 'close');
            Backbone.history.history.back();
        },

        abortedDeleteItem: function(e) {
            e.preventDefault();
            $('#confirm-deletion').foundation('reveal', 'close');
        }

    });
    return RecipeView;
});
