define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above,
    'collections/regions',
    'collections/recipes',
    'views/flash/FlashView',
    'text!templates/recipes/newRecipeTemplate.html',
    'domready',
    'foundation.slider'
], function($, _, Backbone, Regions, Recipes, FlashView, newRecipeTemplate, domready) {

    var NewRecipeView = Backbone.View.extend({
        el: $("#container"),

        populate: function() {

            var self = this;

            var onDataHandler = function(collection) {
                self.render(Regions.models);
            };

            Regions.fetch({
                success: onDataHandler,
                dataType: "json"
            });
        },

        events: {
            "submit #new-recipe-form": "addRecipe"
        },

        render: function(regions) {

            var data = {
                regions: regions,
                data: null,
                _: _
            };

            var compiledTemplate = _.template(newRecipeTemplate)(data);
            this.$el.html(compiledTemplate);

            domready(function() {
                $(document).foundation('slider', 'reflow');
            });
        },

        addRecipe: function(e) {
            e.preventDefault();

            $(document).trigger('close.fndtn.alert');

            var recipe = {};

            $('#new-recipe-form').serializeArray().forEach(function(el) {
                var currentObject = {};

                currentObject[el.name] = el.value;

                recipe = $.extend({}, recipe, currentObject);
            });

            Recipes.create(recipe, {
                success: function(model, resp) {

                    var flash = FlashView.render('success', 'Succesfully inserted new recipe');

                },
                error: function(model, error) {
                
                    var errorMsg = '';
                    errorMsg += '<b>' + error.status + '</b>';
                    errorMsg += ' Something went wrong. --->';
                    for (var i = 0; i < error.responseJSON.error.length; i++) {
                        errorMsg += ' <b>' + error.responseJSON.error[i] + '</b>';
                    }
                    var flash = FlashView.render('error', errorMsg);
                }
            });

        }
    });
    return new NewRecipeView();

});
