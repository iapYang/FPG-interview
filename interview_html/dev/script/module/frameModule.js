import $ from 'jquery';
import swig from 'swig';
import fetchJsonp from 'fetch-jsonp';

import 'fetch-ie8';
import 'es6-promise';

import FrameGameModule from './frameGameModule.js';
import GameModule from './gameModule.js';

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

module.fitScreen = function() {

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
                    FrameGameModule.initSelectors(frame_index,function() {
                        FrameGameModule.openAnimation(frame_index);
                    });
                } else {
                    loadingAppear(function() {

                        // local version
                        GameModule.getDetailDataByIndex(frame_index, function(detail) {
                            FrameGameModule.bulidGame(frame_index, detail, function() {
                                FrameGameModule.initSelectors(frame_index,function() {
                                    loadingDisappear(function() {
                                        FrameGameModule.openAnimation(frame_index);
                                    });
                                });
                            });
                        });

                        //server version
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

    $frame_game_item.on('click', '.game-choice', function() {
        let $this = $(this);
        let $game_choice = $this.parent().find('li');
        if ($this.hasClass('made-choice')) return;

        let choice = $this.index();
        let $parents = $this.parents('.frame-game-item');
        let gameIndex = $parents.data('game-index');
        let $questionItem = $parents.find('.question-item.show');
        let questionIndex = $questionItem.index();
        $game_choice.removeClass('unmade-choice').addClass('made-choice');
        $game_choice.eq(choice).addClass('selected');

        //return answer to server
        //local version
        GameModule.check({
            gameIndex: gameIndex,
            choice: choice,
            questionIndex: questionIndex
        }, function(data) {
            switchHandler(data);
        });
    });
}

function switchHandler(answer) {
    switch (answer.move) {
        case 'change':
            changeMove(answer);
            break;
        case 'finish':
            finishMove(answer);
            break;
    }
}

function finishMove(answer) {
    console.log(answer);
    let ifCorrect = (answer.rightAnswer === answer.choice);
    console.log(ifCorrect);
    let $game_choice = $frame_game_item.eq(answer.gameIndex).find('.game-choice');

    for (let i = 0; i < $game_choice.length; i++) {
        if (i === answer.rightAnswer) continue;
        $game_choice.eq(i).addClass('wrong');
    }

    $frame_intro_item.eq(answer.gameIndex).addClass('finished').addClass(ifCorrect?'won':'failed');
}

function changeMove(answer) {
    let $frame = $frame_game_item.eq(answer.gameIndex);
    let $frameGameQuestion = $frame.find('.frame-game-question');
    let $questionItems = $frame.find('.question-item');

    // Question fade out
    TweenMax.to($frameGameQuestion, 0.3, {
        scaleY: 0,
        onComplete: function() {
            $questionItems.removeClass('show');
            let $nextQuestion = $questionItems.eq(answer.questionIndex + 1).addClass('show');
            // let ques = $nextQuestion.text().replace('placeholder',numberToString(answer.wrongAnswer))
            $nextQuestion.text($nextQuestion.text().replace('placeholder', numberToString(answer.wrongAnswer)).replace('currentAnswer', numberToString(answer.choice)));

            // Question fade in
            TweenMax.to($frameGameQuestion, 0.3, {
                scaleY: 1,
                onComplete: function() {
                    $frame.find('.game-choice').addClass('unmade-choice').removeClass('made-choice').removeClass('selected').eq(answer.wrongAnswer).addClass('wrong').removeClass('unmade-choice').addClass('made-choice');
                }
            });
        }
    });
}

function frameIntroItemSlideLeft(func) {
    if (typeof(func) !== 'function') func = function() {};
    $frame_intro_item.removeClass('ani');
    for (let i = 0; i < $frame_intro_item.length; i++) {

        TweenMax.to($frame_intro_item.eq(i), time_frame_ani, {
            x: '-150%',
            delay: i * time_frame_delay,
            onComplete: function() {
                // $frame_intro_item.eq(i).removeClass('ani');
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
        ease: 'easeOutSine',
        onComplete: func(),
    });
}

function frameGameListSlideRight(func) {
    if (typeof(func) !== 'function') func = function() {};

    TweenMax.to($frame_game_list, time_frame_ani, {
        autoAlpha: 0,
        x: '0%',
        ease: 'easeOutSine',
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

function numberToString(index) {
    switch (index) {
        case 0:
            return 'A';
            // break;
        case 1:
            return 'B';
            // break;
        case 2:
            return 'C';
            // break;
        default:
            return 'Z';
    }
}

export default module;
