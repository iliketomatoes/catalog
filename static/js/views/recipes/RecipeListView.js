define([
    'jquery',
    'underscore',
    'backbone',
    'views/recipes/RecipeListItemView',
    'collections/recipes',
    'text!templates/recipes/recipeListTemplate.html',
    'domready',
    'foundation.dropdown',
    'foundation.reveal'
], function($, _, Backbone, RecipeListItemView, RecipeCollection, recipeListTemplate, domready) {
    var RecipeListView = Backbone.View.extend({
        el: $("#container"),

        events: {
            'click .card-delete-btn': 'deleteItem',
            'click .confirm-deletion-confirm': 'confirmedDeleteItem',
            'click .confirm-deletion-abort': 'abortedDeleteItem',
        },

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

            _.bindAll(this, 'addOne', 'initFoundation', 'deleteItem', 'confirmedDeleteItem', 'abortedDeleteItem');
            this.collection = new RecipeCollection();
            this.collection.bind('add', this.addOne);
            //Let's init the foundation plugins when we have done adding recipes to the view
            this.collection.bind('update', this.initFoundation);

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
        },

        initFoundation: function() {
            domready(function(){
                $(document).foundation();
            });
        },

        deleteItem: function(e){
            e.preventDefault();
            var target = event.target ? event.target : event.srcElement;
            var targetID = target.getAttribute('data-id');
            var model = this.collection.get(targetID);
            $('#confirm-deletion-confirm').data('id', targetID);
            $('#confirm-deletion-name').text(model.get('name'));
            $('#confirm-deletion').foundation('reveal', 'open');
        },

        confirmedDeleteItem: function(e){
            e.preventDefault();
            var target = event.target ? event.target : event.srcElement;
            var targetID = target.getAttribute('data-id');
            this.collection.remove(targetID, {
                success: function(){
                    console.log(arguments);
                },
                error: function(){
                    console.log(arguments);
                },

            });
        },

        abortedDeleteItem: function(e){
            console.log('presssssoooo');
            $('#confirm-deletion').foundation('reveal', 'close');
        }

    });
    return RecipeListView;
});
