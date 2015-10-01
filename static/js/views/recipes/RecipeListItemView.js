define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/recipes/recipeListItemTemplate.html'
], function($, _, Backbone, recipeListItemTemplate) {
    var RecipeListItemView = Backbone.View.extend({
        tagName: 'li',

        className: 'recipe-list-item',

        events: {
            'click .card-header-link': 'pullupPage',
            'click .card-edit-btn': 'pullupPage'
        },

        template: _.template(recipeListItemTemplate),

        initialize: function(options) {
            _.bindAll(this, 'render');
            this.model.view = this;
            this.mapped_regions = options.mapped_regions;
        },

        render: function() {

            var data = {
                regions: this.mapped_regions,
                recipe: this.model,
                _: _
            };

            var compiledTemplate = this.template(data);
            this.$el.append(compiledTemplate);

            return this;
        },

        pullupPage: function() {
            $("html, body").animate({
                scrollTop: 0
            }, 0);
        }
    });
    return RecipeListItemView;
});
