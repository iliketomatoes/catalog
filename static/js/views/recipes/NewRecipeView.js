define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above,
    'collections/regions',
    'collections/recipes',
    'text!templates/recipes/newRecipeTemplate.html'
], function($, _, Backbone, Regions, Recipes,newRecipeTemplate) {

    var NewRecipeView = Backbone.View.extend({
        el: $("#container"),

        initialize: function(){

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
            "submit": "addRecipe" 
        }, 

        render: function(regions) {

            var data = {
                regions: regions,
                data: null,
                _: _
            };

            var compiledTemplate = _.template(newRecipeTemplate)(data);
            this.$el.html(compiledTemplate);
        },

        addRecipe: function(e){
            e.preventDefault();

            var recipe = {};

            $('#new-recipe-form').serializeArray().forEach(function(el){
                var currentObject = {};
                
                currentObject[el.name] = el.value;
            
                recipe = $.extend({}, recipe, currentObject);
            });

            console.log(recipe);

            Recipes.create(recipe);
            
        }
    });
    return NewRecipeView;

});