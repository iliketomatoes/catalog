define([
    'jquery',
    'underscore',
    'backbone',
    'collections/users',
    'text!templates/user/userHeaderTemplate.html'
], function($, _, Backbone, UserCollection, userHeaderTemplate) {

    var UserHeaderView = Backbone.View.extend({

        template: _.template(userHeaderTemplate),

        initialize: function(options) {
            _.bindAll(this, 'render');

            this.collection = new UserCollection([this.model]);
            this.model.parse = function(response) {
                return response.collection[0];
            };
            this.model.bind('change', this.render);
            this.model.fetch();

        },

        render: function(user) {
            var data = {
                user: user,
                _: _
            };
            var compiledTemplate = this.template(data);
            $("#recipe-list-header").html(compiledTemplate);

            $('.go-back-btn').one('click', function(e) {
                e.preventDefault();
                Backbone.history.history.back();
            });
        }

    });

    return UserHeaderView;

});
