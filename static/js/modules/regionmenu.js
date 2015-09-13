define([
    'jquery',
    'velocity',
], function($, velocity) {

    var menu = {

        getMenu: function() {
            return $('#regions-menu-container')
        },

        absoluteProperties: {
            'position': 'absolute',
            'top': 0,
            'bottom': 'auto'
        },

        fixedProperties: {
            'position': 'fixed',
            'top': 'auto',
            'bottom': 0
        },

        toggleMenu: function(event) {
            event.preventDefault();
            var $istanceMenu = this.getMenu();

            if ($istanceMenu.data('menu') == 'closed') {

                if ($istanceMenu.height() >= $(window).height()) {
                    $istanceMenu.css(this.absoluteProperties);
                } else {
                    $istanceMenu.css(this.fixedProperties);
                }

                $istanceMenu.data('menu', 'open');

            } else {
                $istanceMenu.data('menu', 'closed');
            }

            $istanceMenu.toggleClass('hide');
        },

        closeMenu: function(){
            var $istanceMenu = this.getMenu();
            $istanceMenu.data('menu', 'closed');
            $istanceMenu.addClass('hide');
        }
    }

    $('body').on('click', '.region-menu, .close-menu', menu.toggleMenu.bind(menu));

    $(window).on('resize', menu.closeMenu.bind(menu));

});
