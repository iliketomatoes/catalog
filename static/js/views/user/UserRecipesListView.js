define([
    'jquery',
    'underscore',
    'backbone',
    'views/recipes/RecipeListItemView',
    'views/user/UserHeaderView',
    'models/user',
    'collections/recipes',
    'text!templates/user/userRecipesListTemplate.html',
    'domready',
    'foundation.dropdown',
    'foundation.reveal'
], function($, _, Backbone, RecipeListItemView, UserHeaderView, User, RecipeCollection, userRecipesListTemplate, domready) {
    var UserRecipesListView = Backbone.View.extend({
        el: $("#container"),

        events: {
            'click .card-delete-btn': 'deleteItem'
        },

        template: _.template(userRecipesListTemplate),

        initialize: function(options) {

            var self = this;

            this.regions = options.regions;

            self.mapped_regions = [];
            _.each(self.regions.models, function(region) {
                self.mapped_regions[region.get('id')] = region.get('name');
            });

            _.bindAll(this, 'addOne', 'initFoundation', 'deleteItem', 'confirmedDeleteItem', 'abortedDeleteItem');
        },

        populate: function(user_id) {
            var queryParams = {};

            if (!!user_id) queryParams.data = {
                user_id: user_id
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

            this.undelegateEvents();
            this.delegateEvents();

            this.collection = new RecipeCollection();
            this.collection.bind('add', this.addOne);
            //Let's init the foundation plugins when we have done adding recipes to the view
            this.collection.bind('update', this.initFoundation);

            this.render(user_id);
            this.collection.fetch(queryParams);
        },

        render: function(user_id) {

            var data = {
                regions: this.mapped_regions,
                _: _
            };

            var compiledTemplate = this.template(data);
            this.$el.html(compiledTemplate);

            var user = new User({ id: user_id});
            user.parse = function(response) {
                return response.collection[0];
            };
            var userInfo = new UserHeaderView({ model: user});

        },

        addOne: function(recipe) {
            var view = new RecipeListItemView({
                model: recipe,
                mapped_regions: this.mapped_regions
            });
            $('.recipe-list').append(view.render().el);
        },

        initFoundation: function() {

            var self = this;

            domready(function() {
                $(document).foundation();
            });
        },

        deleteItem: function(e) {
            e.preventDefault();
            var self = this;
            var target = e.target ? e.target : e.srcElement;
            var targetID = target.getAttribute('data-id');
            var model = this.collection.get(targetID);
            $('.confirm-deletion-confirm').data('id', targetID);
            $('#confirm-deletion-name').text(model.get('name'));
            $('#confirm-deletion').foundation('reveal', 'open');
            $('.confirm-deletion-confirm').one('click', self.confirmedDeleteItem);
            $('.confirm-deletion-abort').one('click', self.abortedDeleteItem);
        },

        confirmedDeleteItem: function(e) {
            e.preventDefault();
            var targetID = $('.confirm-deletion-confirm').data('id');
            var modelToDelete = this.collection.get(targetID);
            modelToDelete.clear();
            $('#confirm-deletion').foundation('reveal', 'close');
        },

        abortedDeleteItem: function(e) {
            e.preventDefault();
            $('#confirm-deletion').foundation('reveal', 'close');
        }

    });
    return UserRecipesListView;
});
