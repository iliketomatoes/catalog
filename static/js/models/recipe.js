define(['underscore', 'backbone', 'views/flash/FlashView', ], function(_, Backbone, FlashView) {
    var RecipeModel = Backbone.Model.extend({
            clear: function() {

                var flash = new FlashView();
                this.destroy({
                    success: function(model, resp) {
                  
                    	var successMsg = 'The recipe ';
                    	successMsg += '<b>' + model.get('name') +'</b>';
                    	successMsg += ' was deleted succesfully';
                        flash.render('success', successMsg);

                    },
                    error: function(model, error) {

                        var errorMsg = '';
                        errorMsg += '<b>' + error.status + '</b>';
                        errorMsg += ' Something went wrong.';
                        flash.render('error', errorMsg);

                    }
                });
            this.view.remove();
        }

    });
return RecipeModel;
});
