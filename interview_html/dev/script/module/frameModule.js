import $ from 'jquery';
import swig from 'swig';
import fetchJsonp from 'fetch-jsonp';

import 'fetch-ie8';
import 'es6-promise';

import FrameGameModule from './frameGameModule.js';

let time_frame_ani = 0.5;
let time_frame_delay = 0.2;
let frame_index = 0;

let $dom = $('.frame-list');
let $window = $(window);
let $frame_intro_list = $('.frame-intro-list');
let $frame_game_list = $('.frame-game-list');
let $loading = $('.loading');
let $frame_intro_item;
let $frame_game_item;

let detail = [{
    questions: ['xxxxxxx, dhfkshdgjsj, gkjehridghi'],
    options: [{
        image: './image/door_1204922_easyicon.net.svg',
    }, {
        image: './image/door_1204922_easyicon.net.svg',
    }, {
        image: './image/door_1204922_easyicon.net.svg',
    }],
}, {
    questions: ['xxxxxxx'],
    options: [{
        text: 'zzzzzzzzzz',
    }, {
        text: 'zzzzzzzzzz',
    }, {
        text: 'zzzzzzzzzz',
    }],
}, {
    questions: ['xxxxxxx'],
    options: [{
        text: 'zzzzzzzzzz',
    }, {
        text: 'zzzzzzzzzz',
    }, {
        text: 'zzzzzzzzzz',
    }],
}];

module.fitScreen = function() {
    $dom.css({
        'height': $window.height()
    });
};

module.buildPage = function(data) {
    insertIntro(data);
};

function insertIntro(data) {
    fetch('./template/frameIntro.swig')
        .then(function(response) {
            return response.text();
        }).then(function(content) {
            fillIntro(content, data);
        });
}

function fillIntro(content, data) {
    data.forEach(function(item, i) {
        let render = swig.render(content, {
            locals: {
                category: item.category,
                title: item.title,
                sub_title: item.sub_title,
                star: item.star
            },
        });
        $frame_intro_list.append($(render));
        $frame_game_list.append($('<div></div>').addClass('frame-game-item'));
    });

    loadingDisappear(function() {
        registerEvents();
        frameIntroItemSlideRight();
    });
}

function registerEvents() {
    $frame_intro_item = $('.frame-intro-item');
    $frame_game_item = $('.frame-game-item');

    $frame_intro_item.on('click', function() {
        frame_index = $frame_intro_item.index(this);

        frameIntroItemSlideLeft(function(i) {
            if (i !== $frame_intro_item.length - 1) return;

            frameGameListSlideLeft(function() {
                TweenMax.set($frame_game_item.eq(frame_index), {
                    autoAlpha: 1
                });

                // if this game has loaded, just bring open animation
                if ($frame_game_item.eq(frame_index).hasClass('game-loaded')) {
                    FrameGameModule.openAnimation(frame_index);
                } else {
                    loadingAppear(function() {
                        FrameGameModule.bulidGame(frame_index, detail[frame_index], function() {
                            loadingDisappear(function() {
                                FrameGameModule.openAnimation(frame_index);
                            });
                        });
                    });
                }
            });
        });
    });

    $frame_game_item.on('click', '.page-back', function() {
        frameGameListSlideRight(function() {
            TweenMax.set($frame_game_item, {
                autoAlpha: 0,
            });

            FrameGameModule.reset((frame_index));

            frameIntroItemSlideRight();
        });
    });
}

function frameIntroItemSlideLeft(func) {
    if (typeof(func) !== 'function') func = function() {};
    for (let i = 0; i < $frame_intro_item.length; i++) {

        TweenMax.to($frame_intro_item.eq(i), time_frame_ani, {
            x: '-150%',
            delay: i * time_frame_delay,
            onComplete: function() {
                $frame_intro_item.eq(i).removeClass('ani');
                func(i);
            },
        });
    }
}

function frameIntroItemSlideRight(func) {
    if (typeof(func) !== 'function') func = function() {};
    for (let i = 0; i < $frame_intro_item.length; i++) {
        TweenMax.to($frame_intro_item.eq(i), time_frame_ani, {
            x: '0%',
            delay: i * time_frame_delay,
            onComplete: function() {
                $frame_intro_item.eq(i).addClass('ani');
            },
        });
    }
}

function frameGameListSlideLeft(func) {
    if (typeof(func) !== 'function') func = function() {};

    TweenMax.to($frame_game_list, time_frame_ani, {
        autoAlpha: 1,
        x: '-100%',
        onComplete: func(),
    });
}

function frameGameListSlideRight(func) {
    if (typeof(func) !== 'function') func = function() {};

    TweenMax.to($frame_game_list, time_frame_ani, {
        autoAlpha: 0,
        x: '0%',
        onComplete: func(),
    });
}

function loadingDisappear(func) {
    console.log('disappear');
    if (typeof(func) !== 'function') func = function() {};
    TweenMax.to($loading, time_frame_ani, {
        autoAlpha: 0,
        onComplete: func(),
    });
}

function loadingAppear(func) {
    console.log('appear');
    if (typeof(func) !== 'function') func = function() {};
    TweenMax.to($loading, time_frame_ani, {
        autoAlpha: 1,
        onComplete: func(),
    });
}

export default module;
