var require = {
    baseUrl: '../',
    paths: {
        'ko': 'bower/knockoutjs/dist/knockout.debug',
        'kotest': 'src/js/kotest',
        'jquery': 'bower/jquery/dist/jquery',
        'text': 'bower/requirejs-text/text',
    },

    map: {
        '*': {
            //enable jquery's no conflict mode
            'jquery' : 'test/setup/jqueryPrivate',
        },
        'test/setup/jqueryPrivate': {
            'jquery': 'jquery'
        }
    }
};