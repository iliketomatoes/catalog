define([
    'jquery',
    'velocity',
], function($, velocity) {

    var menu = {

        getMenu: function() {
            return $('#regions-menu-container')
        },

        getBackground: function() {
            return $('.regions-menu-bg')
        },

        toggleMenu: function(event) {
            event.preventDefault();
            var $istanceMenu = this.getMenu();
            //Open menu
            if ($istanceMenu.data('menu') == 'closed') {

                var $menuBg = this.getBackground();
                var $openMenuHideEl = $('.open-menu-hide');

                var menuHeight = $istanceMenu.height();

                if (menuHeight >= $(window).height()) {
                    $openMenuHideEl.addClass('hide');
                    $menuBg.removeClass('hide');
                    $istanceMenu.css({
                        'position': 'absolute',
                        'top': '-' + menuHeight + 'px',
                        'bottom': 'auto'
                    });

                    $istanceMenu.velocity({
                        top: 0
                    });

                } else {
                    $menuBg.removeClass('hide');
                    $istanceMenu.css({
                        'position': 'fixed',
                        'top': 'auto',
                        'bottom': '-' + menuHeight + 'px'
                    });

                    $istanceMenu.velocity({
                        bottom: 0
                    });
                }

                $istanceMenu.data('menu', 'open');
                $istanceMenu.removeClass('hide');
                //Close menu    
            } else {

                this.closeMenu(true);
            }


        },

        closeMenu: function(animate) {
            var $istanceMenu = this.getMenu();
            var $menuBg = this.getBackground();
            var $openMenuHideEl = $('.open-menu-hide');
            var menuHeight = $istanceMenu.height();

            $openMenuHideEl.removeClass('hide');

            function getPropertyToChange() {

                if ($istanceMenu.css('position') == 'absolute') {
                    return {
                        'top': '-' + menuHeight + 'px'
                    };
                } else {
                    return {
                        'bottom': '-' + menuHeight + 'px'
                    };
                }

            }

            if (animate) {
                
                $istanceMenu.velocity(getPropertyToChange(), {
                    /* Log all the animated divs. */
                    complete: function(elements) {
                        $menuBg.addClass('hide');
                        $istanceMenu.data('menu', 'closed');
                        $istanceMenu.addClass('hide');
                    }
                });

            } else {
                $menuBg.addClass('hide');
                $istanceMenu.data('menu', 'closed');
                $istanceMenu.addClass('hide');
            }

        }
    }

    $('body').on('click', '.region-menu, .close-menu', menu.toggleMenu.bind(menu));

    $('body').on('click', '.regions-menu-bg', menu.closeMenu.bind(menu, true));

    $(window).on('resize', menu.closeMenu.bind(menu, false));

});
