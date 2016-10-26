import $ from 'jquery';
import swig from 'swig';
import TweenMax from 'gsap';

let time_animation = 2;
let time_fade = 0.3;

// selectors
let $dom;
let $circle;
let $line_top_bar;
let $line_right_bar;
let $line_bottom_bar;
let $line_left_bar;
let $page_back;
let $divide_line;
let $options;
let $options_li;
let $frame_game_question;

module.bulidGame = function(index, data, func) {
    if (typeof(func) !== 'function') func = function() {};
    insertGameFrame(index, data, func);
};

module.openAnimation = function(index) {
    TweenMax.to($circle, time_animation, {
        scale: 1,
        rotation: '720deg'
    });
    TweenMax.to($line_top_bar, time_animation / 2, {
        width: '100%',
        delay: time_animation * 0.3,
        onComplete: function() {
            TweenMax.to($line_right_bar, time_animation / 3, {
                height: '100%',
            });
        },
    });

    TweenMax.to($line_left_bar, time_animation / 2, {
        height: '100%',
        delay: time_animation * 0.3,
        onComplete: function() {
            TweenMax.to($line_bottom_bar, time_animation / 3, {
                width: '100%',
                onComplete: function() {
                    TweenMax.to($page_back, time_fade, {
                        autoAlpha: 1
                    });

                    TweenMax.to($divide_line, time_fade, {
                        scaleY: 1,
                        onComplete: function() {
                            TweenMax.to($frame_game_question, time_fade, {
                                scaleY: 1,
                                autoAlpha: 1,
                            });
                        }
                    });

                    for (let i = 0; i < $options_li.length; i++) {
                        TweenMax.to($options_li.eq(i), time_fade, {
                            y: 0,
                            autoAlpha: 1,
                            delay: i * time_fade * 0.6,
                        });
                    }
                },
            });
        }
    });
};

module.reset = function(index) {
    TweenMax.set($circle, {
        scale: 0,
        rotation: 0
    });
    TweenMax.set($line_top_bar, {
        width: '0%'
    });
    TweenMax.set($line_right_bar, {
        height: '0%'
    });
    TweenMax.set($line_bottom_bar, {
        width: '0%'
    });
    TweenMax.set($line_left_bar, {
        height: '0%'
    });
    TweenMax.set($page_back, {
        autoAlpha: 0
    });
    TweenMax.set($divide_line, {
        scaleY: 0
    });
    TweenMax.set($options_li, {
        y: 20,
        autoAlpha: 0,
    });
    TweenMax.set($frame_game_question, {
        scaleY: 0,
        autoAlpha: 0,
    });
}

function insertGameFrame(index, data, func) {
    fetch('./template/frameGame.swig')
        .then(function(response) {
            return response.text();
        }).then(function(content) {
            fillGameFrame(content, index, data, func);
        });
}

function fillGameFrame(content, index, data, func) {
    let render = swig.render(content, {
        locals: {
            index: index + 1,
            options: data.options,
            questions: data.questions
        },
    });
    $('.frame-game-item').eq(index).data('game-index', index).addClass('game-loaded').append(render);
    func();
}

module.initSelectors = function(index, func) {
    if (typeof(func) !== 'function') func = function() {};

    $dom = $('.frame-game-item').eq(index);
    $circle = $dom.find('.circle');
    $line_top_bar = $dom.find('.line-top').find('.bar');
    $line_right_bar = $dom.find('.line-right').find('.bar');
    $line_bottom_bar = $dom.find('.line-bottom').find('.bar');
    $line_left_bar = $dom.find('.line-left').find('.bar');
    $page_back = $dom.find('.page-back');
    $divide_line = $dom.find('.divide-line');
    $options = $dom.find('.options');
    $options_li = $dom.find('.options').find('li');
    $frame_game_question = $dom.find('.frame-game-question');
    
    func();
}


export default module;
