define([
    'jquery',
    'underscore',
    'backbone',
    // Pull in the Collection module from above,
    'collections/regions',
    'text!templates/recipes/newRecipeTemplate.html',
    'materialize.form'
], function($, _, Backbone, Regions, newRecipeTemplate) {

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

        render: function(regions) {

            var data = {
                regions: regions,
                data: null,
                _: _
            };

            console.log(newRecipeTemplate);

            var compiledTemplate = _.template(newRecipeTemplate)(data);
            this.$el.html(compiledTemplate);
            $('select').material_select();
        }
    });
    return NewRecipeView;

});