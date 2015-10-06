require.config({
    paths: {
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        'underscore': '/static/js/libs/underscore/underscore-min',
        'backbone': '/static/js/libs/backbone/backbone-min',
        'domready': '/static/js/modules/domReady',
        'regionmenu': '/static/js/modules/regionmenu',
        'dropzone': '/static/js/modules/dropzone-amd-module',
        'velocity': '/static/js/modules/velocity.min',
        'blazy': '/static/bower_components/blazy/blazy',
        'imageloader': '/static/js/modules/imageloader',
        'foundation.core': '/static/bower_components/foundation/js/foundation/foundation',
        'foundation.abide': '/static/bower_components/foundation/js/foundation/foundation.abide',
        'foundation.accordion': '/static/bower_components/foundation/js/foundation/foundation.accordion',
        'foundation.alert': '/static/bower_components/foundation/js/foundation/foundation.alert',
        'foundation.clearing': '/static/bower_components/foundation/js/foundation/foundation.clearing',
        'foundation.dropdown': '/static/bower_components/foundation/js/foundation/foundation.dropdown',
        'foundation.equalizer': '/static/bower_components/foundation/js/foundation/foundation.equalizer',
        'foundation.interchange': '/static/bower_components/foundation/js/foundation/foundation.interchange',
        'foundation.joyride': '/static/bower_components/foundation/js/foundation/foundation.joyride',
        'foundation.magellan': '/static/bower_components/foundation/js/foundation/foundation.magellan',
        'foundation.offcanvas': '/static/bower_components/foundation/js/foundation/foundation.offcanvas',
        'foundation.orbit': '/static/bower_components/foundation/js/foundation/foundation.orbit',
        'foundation.reveal': '/static/bower_components/foundation/js/foundation/foundation.reveal',
        'foundation.slider': '/static/bower_components/foundation/js/foundation/foundation.slider',
        'foundation.tab': '/static/bower_components/foundation/js/foundation/foundation.tab',
        'foundation.toolbar': '/static/bower_components/foundation/js/foundation/foundation.toolbar',
        'foundation.topbar': '/static/bower_components/foundation/js/foundation/foundation.topbar',
        'modernizr': '/static/bower_components/foundation/js/vendor/modernizr',
        'templates': '/static/templates'
    },
    shim: {
        'velocity': {
            deps: [
                'jquery'
            ]
        },
        /* Foundation */
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        'foundation.abide': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.accordion': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.alert': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.clearing': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.dropdown': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.equalizer': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.interchange': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.joyride': {
            deps: [
                'foundation.core',
                'jquery.cookie'
            ]
        },
        'foundation.magellan': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.offcanvas': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.orbit': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.reveal': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.tab': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.tooltip': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.topbar': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.slider': {
            deps: [
                'foundation.core'
            ]
        },
    }

});

require([
    // Load our app module and pass it to our definition function
    'app',

], function(App) {
    App.initialize();
});
