import $ from 'jquery';
import swig from 'swig';
import fetchJsonp from 'fetch-jsonp';

import 'fetch-ie8';
import 'es6-promise';

let time_frame_ani = 0.5;
let time_frame_delay = 0.2;
let frame_index = 0;

let $dom = $('.frame-list');
let $window = $(window);
let $frame_intro_list = $('.frame-intro-list');
let $frame_game_list = $('.frame-game-list');
let $frame_intro_item;
let $frame_game_item;

module.fitScreen = function() {
    $dom.css({
        'height': $window.height()
    });
};

module.buildPage = function(data) {
    insertIntro(data);
}

function insertIntro(data) {
    fetch('./template/frameIntro.swig')
        .then(function(response) {
            return response.text();
        }).then(function(content) {
            fillIntro(content, data);
        });
};

function fillIntro(content, data) {
    data.forEach(function(item, i) {
        let render = swig.render(content, {
            locals: {
                category: item.category,
                title: item.title,
                sub_title: item.sub_title
            },
        });
        $frame_intro_list.append($(render));
        $frame_game_list.append($('<div></div>').addClass('frame-game-item'));
    });
    registerEvents();
}

function registerEvents() {
    $frame_intro_item = $('.frame-intro-item');
    $frame_game_item = $('.frame-game-item');

    $frame_intro_item.on('click', function() {
        frame_index = $frame_intro_item.index(this);

        for (let i = 0; i < $frame_intro_item.length; i++) {

            TweenMax.to($frame_intro_item.eq(i), time_frame_ani, {
                x: '-150%',
                delay: i * time_frame_delay,
                onComplete: function() {
                    if (i !== $frame_intro_item.length - 1) return;

                    TweenMax.to($frame_game_list, time_frame_ani, {
                        autoAlpha: 1,
                        x: '-100%',
                        onComplete: function() {
                            if (i !== $frame_intro_item.length - 1) return;
                            TweenMax.set($frame_game_item.eq(frame_index), {
                                autoAlpha: 1
                            });
                            if ($frame_game_item.eq(frame_index).hasClass('game-added')) return;
                            insertGameFrame();
                        },
                    });
                },
            });
        }
    });

    $frame_game_item.on('click', '.page-back', function() {
        TweenMax.to($frame_game_list, time_frame_ani, {
            autoAlpha: 0,
            x: '0%',
            onComplete: function() {
                TweenMax.set($frame_game_item.eq(frame_index), {
                    autoAlpha: 0,
                });
                
                for (let i = 0; i < $frame_intro_item.length; i++) {
                    TweenMax.to($frame_intro_item.eq(i), time_frame_ani, {
                        x: '0%',
                        delay: i * time_frame_delay,
                    });
                }
            }
        });
    });
}

function insertGameFrame() {
    fetch('./template/frameGame.swig')
        .then(function(response) {
            return response.text();
        }).then(function(content) {
            fillGameFrame(content);
        });
}

function fillGameFrame(content) {
    let render = swig.render(content, {
        locals: {

        },
    });
    $frame_game_item.eq(frame_index).addClass('game-added').append(render);
}

export default module;
