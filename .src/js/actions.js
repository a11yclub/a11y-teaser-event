(function () {
    'use strict';
    window.slides_actions = {
        'play-gds' : function ($prev, $next, next) {
            var gds = document.getElementById('gds');
            gds.currentTime = 7;
            gds.play();
            next();
        },
        'stop-gds' : function ($prev, $next, next) {
            document.getElementById('gds').pause();
            next();
        }
    };
}());
