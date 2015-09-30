define(['jquery', 'underscore', 'backbone', 'views/flash/FlashView', ], function($, _, Backbone, FlashView) {
    var RecipeModel = Backbone.Model.extend({
        clear: function() {
            var self = this;
            var flash = new FlashView();
            this.destroy({
                success: function(model, resp) {

                    var successMsg = 'The recipe ';
                    successMsg += '<b>' + model.get('name') + '</b>';
                    successMsg += ' was deleted succesfully';
                    flash.render('success', successMsg);

                    //Update the counter in the menu
                    var regionId = parseInt(model.get('region_id'));

                    var $counter = $('.region-count').filter(function(index, el) {
                        console.log(parseInt($(el).attr("data-region-count")) === regionId);
                        return parseInt($(el).attr("data-region-count")) === regionId;
                    });

                    var $totalCount = $('#total-count');

                    var actualValue = parseInt($counter.text()) - 1;

                    actualValue = actualValue === 0 ? '' : actualValue;

                    var totalValue = parseInt($totalCount.text()) - 1;

                    totalValue = totalValue === 0 ? '' : totalValue;

                    $counter.text(actualValue.toString());

                    $totalCount.text(totalValue.toString());

                    self.view.remove();

                },
                error: function(model, error) {

                    var errorMsg = '';
                    errorMsg += '<b>' + error.status + '</b>';
                    for (var i = 0; i < error.responseJSON.error.length; i++) {
                        errorMsg += ' <b>' + error.responseJSON.error[i] + '</b>';
                    }
                    flash.render('error', errorMsg);

                }
            });

        }

    });
    return RecipeModel;
});
