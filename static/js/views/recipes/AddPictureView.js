define([
    'jquery',
    'underscore',
    'backbone',
    'views/flash/FlashView',
    'models/recipe',
    'collections/recipes',
    'text!templates/recipes/addPictureTemplate.html',
    'dropzone'
], function($, _, Backbone, FlashView, RecipeModel, RecipeCollection,addPictureTemplate, Dropzone) {
    var AddPictureView = Backbone.View.extend({
        el: $("#container"),

        initialize: function(options) {

            _.bindAll(this, 'render');

            this.model = new RecipeModel({
                id: options.recipe_id
            });

            this.old = options.old;

            this.model.parse = function(response){
                return response.collection[0];
            };
            this.collection = new RecipeCollection([this.model]);

            this.model.bind('change', this.render);

            this.model.fetch();
        },

        render: function() {

            var self = this;

            var id = this.model.get('id');
            
            var data = {
                id: id,
                name: this.model.get('name'),
                image_url: this.model.get('image_url'),
                recipe: this.model,
                old: this.old,
                _: _
            };

            var compiledTemplate = _.template(addPictureTemplate)(data);
            this.$el.html(compiledTemplate);

            var flash = new FlashView();
            
            $('#upload-picture-form').dropzone({ 
                url: '/uploadpicture/' + id,
                dictDefaultMessage: 'Drop image here to upload',
                acceptedFiles: '.png, .jpg, .jpeg',
                success: function(){
                    var successMsg = '';
                        successMsg += '<b>';
                        successMsg += self.model.get('name');
                        successMsg += '</b>';
                        successMsg += ' updated successfully.';

                        flash.render('success', successMsg);

                        //If we are just updating an existing recipe
                        if(this.old){
                            Backbone.history.history.back();
                        }else{
                            window.location.replace("/#");
                        }
                        
                },
                errorr: function(model, error){
                    var errorMsg = '';
                        errorMsg += '<b>' + error.status + '</b>';
                        errorMsg += ' Something went wrong. --->';
                        for (var i = 0; i < error.responseJSON.error.length; i++) {
                            errorMsg += ' <b>' + error.responseJSON.error[i] + '</b>';
                        }

                        flash.render('error', errorMsg);
                }  });

            $('.go-back-btn').one('click', function(e){
                e.preventDefault();
                Backbone.history.history.back();
            });

        }
    });
    return AddPictureView;
});
