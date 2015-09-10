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

        initialize: function() {

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

            domready(function(){
                $(document).foundation('slider', 'reflow');
            });
        },

        addRecipe: function(e) {
            e.preventDefault();

            var recipe = {};

            $('#new-recipe-form').serializeArray().forEach(function(el) {
                var currentObject = {};

                currentObject[el.name] = el.value;

                recipe = $.extend({}, recipe, currentObject);
            });

            Recipes.create(recipe, {
                success: function(resp) {
                    console.log('success callback');
                    console.log(resp);
                    var flash = new FlashView('success','Succesfully inserted new recipe');
                },
                error: function(err) {
                    console.log('error callback');
                    console.log(err);
                    var flash = new FlashView('error','Something went wrong, please retry');
                }
            });

            //Unbind submit form to prevent future multi-submits
            $(this.el).undelegate('#new-recipe-form', 'submit');

        }
    });
    return NewRecipeView;

});
