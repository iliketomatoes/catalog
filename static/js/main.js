require.config({
    paths: {
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        'underscore': '/static/js/libs/underscore/underscore-min',
        'backbone': '/static/js/libs/backbone/backbone-min',
        'domready': '/static/js/modules/domReady',
        'hammerjs': '/static/js/modules/hammer.min',
        'hammerjquery': '/static/js/modules/hammer-jquery',
        'velocity': '/static/js/modules/velocity.min',
        'materialize.core': '/static/js/modules/materialize.core',
        'materialize.sideNav': '/static/js/modules/materialize.sideNav',
        'materialize.form': '/static/js/modules/materialize.forms',
        'materialize.dropdown': '/static/js/modules/materialize.dropdown',
        'easing': '/static/js/modules/jquery.easing.1.3',
        'templates': '/static/templates'
    },
    shim: {
        'velocity': {
            deps: [
                'jquery'
            ]
        },
        'easing': {
            deps: [
                'jquery'
            ]
        },
        'materialize.form': {
            deps: [
                'easing'
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
