define([
    'jquery',
    'underscore',
    'backbone',
    'collections/recipes',
    'models/recipe',
    'views/flash/FlashView',
    'views/recipes/AddPictureView',
    'text!templates/recipes/formRecipeTemplate.html',
    'domready',
    'foundation.slider'
], function($, _, Backbone, RecipeCollection, RecipeModel, FlashView, AddPictureView, newRecipeTemplate, domready) {

    var FormRecipeView = Backbone.View.extend({
        el: $("#container"),

        events: {
            "submit #new-recipe-form": "addRecipe"
        },

        initialize: function(options) {

            this.regions = options.regions;
            _.bindAll(this, 'render', 'addRecipe');
        },

        populate: function(recipe_id) {

            this.undelegateEvents();
            this.delegateEvents();
            this.collection = new RecipeCollection();

            // Let's nullify the model first
            this.model = null;

            if (!!recipe_id) {

                this.model = new RecipeModel({
                    id: recipe_id
                });
                this.model.parse = function(response) {
                    return response.collection[0];
                };
                this.collection.add(this.model);

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

            } else {
                this.render();
            }


        },

        render: function(recipe) {

            var data = {
                recipe: recipe,
                regions: this.regions.models,
                _: _
            };

            var compiledTemplate = _.template(newRecipeTemplate)(data);
            this.$el.html(compiledTemplate);

            domready(function() {
                $(document).foundation('slider', 'reflow');
            });

            return this;
        },

        addRecipe: function(e) {
            e.preventDefault();

            var self = this;

            $(document).trigger('close.fndtn.alert');

            var flash = new FlashView();


            /**
             * If it's not a brand new recipe -> PUT
             */
            if (!!this.model) {

                $('#new-recipe-form').serializeArray().forEach(function(el) {

                    self.model.set(el.name, el.value);

                });

                this.model.save(recipe, {
                    success: function(model, resp) {

                        var successMsg = '';
                        successMsg += '<b>';
                        successMsg += self.model.get('name');
                        successMsg += '</b>';
                        successMsg += ' updated successfully.';

                        flash.render('success', successMsg);

                        Backbone.history.history.back();

                    },
                    error: function(model, error) {

                        var errorMsg = '';
                        errorMsg += '<b>' + error.status + '</b>';
                        errorMsg += ' Something went wrong. --->';
                        for (var i = 0; i < error.responseJSON.error.length; i++) {
                            errorMsg += ' <b>' + error.responseJSON.error[i] + '</b>';
                        }

                        flash.render('error', errorMsg);
                    }
                });

            /**
             * If we are creating a new recipe from scratch -> POST
             */
            } else {

                var recipe = {};

                $('#new-recipe-form').serializeArray().forEach(function(el) {
                    var currentObject = {};

                    currentObject[el.name] = el.value;

                    recipe = $.extend({}, recipe, currentObject);
                });

                this.collection.create(recipe, {
                    success: function(model, resp) {
                        // Let's pass the model id and name to the second form
                        // i.e. form for adding a picture
                        var addPicView = new AddPictureView({recipe_id: resp.id, old: false});

                    },
                    error: function(model, error) {

                        var errorMsg = '';
                        errorMsg += '<b>' + error.status + '</b>';
                        errorMsg += ' Something went wrong. --->';
                        for (var i = 0; i < error.responseJSON.error.length; i++) {
                            errorMsg += ' <b>' + error.responseJSON.error[i] + '</b>';
                        }

                        flash.render('error', errorMsg);
                    }
                });

            }

        }
    });
    return FormRecipeView;

});
