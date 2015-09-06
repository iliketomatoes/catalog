require.config({
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        underscore: '/static/js/libs/underscore/underscore-min',
        backbone: '/static/js/libs/backbone/backbone-min',
        materialize: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/js/materialize.min',
        templates: '/static/templates'
    },
    shim: {
        'materialize': {
            deps: [
                'jquery'
            ],
            exports: "Materialize"
        },
    }

});

require([
    // Load our app module and pass it to our definition function
    'app',

], function(App) {
    App.initialize();
});
