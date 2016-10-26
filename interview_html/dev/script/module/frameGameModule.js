import $ from 'jquery';
import swig from 'swig';
import TweenMax from 'gsap';

let time_animation = 2;
let time_fade = 0.3;

module.bulidGame = function(index, data, func) {
    insertGameFrame(index, data, func);
};

module.openAnimation = function(index) {
    let $dom = $('.frame-game-item').eq(index);

    TweenMax.to($dom.find('.circle'), time_animation, {
        scale: 1,
        rotation: '720deg'
    });
    TweenMax.to($dom.find('.line-top').find('.bar'), time_animation / 2, {
        width: '100%',
        delay: time_animation * 0.3,
        onComplete: function() {
            TweenMax.to($dom.find('.line-right').find('.bar'), time_animation / 3, {
                height: '100%',
            });
        },
    });

    TweenMax.to($dom.find('.line-left').find('.bar'), time_animation / 2, {
        height: '100%',
        delay: time_animation * 0.3,
        onComplete: function() {
            TweenMax.to($dom.find('.line-bottom').find('.bar'), time_animation / 3, {
                width: '100%',
                onComplete: function() {
                    TweenMax.to($dom.find('.page-back'), time_fade, {
                        autoAlpha: 1
                    });

                    TweenMax.to($dom.find('.divide-line'), time_fade, {
                        scaleY: 1,
                        onComplete: function() {
                            TweenMax.to($dom.find('.frame-game-question'),time_fade,{
                                scaleY:1,
                                autoAlpha:1,
                            });
                        }
                    });

                    let $options_li = $dom.find('.options').find('li');

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
    let $dom = $('.frame-game-item').eq(index);

    TweenMax.set($dom.find('.circle'), {
        scale: 0,
        rotation: 0
    });
    TweenMax.set($dom.find('.line-top').find('.bar'), {
        width: '0%'
    });
    TweenMax.set($dom.find('.line-right').find('.bar'), {
        height: '0%'
    });
    TweenMax.set($dom.find('.line-bottom').find('.bar'), {
        width: '0%'
    });
    TweenMax.set($dom.find('.line-left').find('.bar'), {
        height: '0%'
    });
    TweenMax.set($dom.find('.page-back'), {
        autoAlpha: 0
    });
    TweenMax.set($dom.find('.divide-line'), {
        scaleY: 0
    });
    TweenMax.set($dom.find('.options').find('li'), {
        y: 20,
        autoAlpha: 0,
    });
    TweenMax.set($dom.find('.frame-game-question'),{
        scaleY:0,
        autoAlpha:0,
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
    $('.frame-game-item').eq(index).data('game-index',index).addClass('game-loaded').append(render);
    func();
}


export default module;
