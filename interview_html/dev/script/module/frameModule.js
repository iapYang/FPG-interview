import $ from 'jquery';
import swig from 'swig';
import fetchJsonp from 'fetch-jsonp';
import PictureLoader from '../component/pictureLoader';

import 'fetch-ie8';
import 'es6-promise';

import FrameGameModule from './frameGameModule.js';
import GameModule from './gameModule.js';
import EvaluationFrameModule from './evaluationFrameModule.js';

let time_frame_ani = 0.5;
let time_fade_ani = 0.3;
let time_frame_delay = 0.2;
let time_autoBack = 2.5;
let frame_index = 0;
let finished_count = 0

let $dom = $('.frame-list');
let $window = $(window);
let $frame_intro_list = $('.frame-intro-list');
let $frame_game_list = $('.frame-game-list');
let $loading = $('.loading');
let $frame_intro_item;
let $frame_game_item;
let $evaluationFrame = $('.evaluationFrame');

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
    let preload = [];

    data.forEach(function(item, i) {
        let src = './image/' + item.image;
        preload.push(src);

        let render = swig.render(content, {
            locals: {
                category: item.category,
                title: item.title,
                sub_title: item.sub_title,
                star: item.star,
                image:src
            },
        });
        $frame_intro_list.append($(render));
        $frame_game_list.append($('<div></div>').addClass('frame-game-item'));
    });

    new PictureLoader(preload).load({
        end: () => {
            loadingDisappear(function() {
                registerEvents();
                frameIntroItemSlideRight();
            });
        }
    });
}

function registerEvents() {
    $frame_intro_item = $('.frame-intro-item');
    $frame_game_item = $('.frame-game-item');

    $frame_intro_item.on('click', function() {
        frame_index = $frame_intro_item.index(this);

        frameIntroItemSlideLeft(function() {

            frameGameListSlideLeft(function() {
                TweenMax.set($frame_game_item.eq(frame_index), {
                    autoAlpha: 1
                });

                // if this game has loaded, just bring open animation
                if ($frame_game_item.eq(frame_index).hasClass('game-loaded')) {
                    FrameGameModule.initSelectors(frame_index, function() {
                        FrameGameModule.openAnimation(frame_index);
                    });
                } else {
                    loadingAppear(function() {

                        if(window.server) {
                            //server version
                            $.ajax({
                                url: window.server_url + '/detailData',
                                type: "GET",
                                data: {
                                    index: frame_index
                                },
                                success: function(data) {
                                    console.log(data);
                                    FrameGameModule.bulidGame(frame_index, data, function() {
                                        FrameGameModule.initSelectors(frame_index, function() {
                                            loadingDisappear(function() {
                                                FrameGameModule.openAnimation(frame_index);
                                            });
                                        });
                                    });
                                },
                            });
                        }else {
                            // local version
                            GameModule.getDetailDataByIndex(frame_index, function(detail) {
                                FrameGameModule.bulidGame(frame_index, detail, function() {
                                    FrameGameModule.initSelectors(frame_index, function() {
                                        loadingDisappear(function() {
                                            FrameGameModule.openAnimation(frame_index);
                                        });
                                    });
                                });
                            });
                        }
                    });
                }
            });
        });
    });

    $frame_game_item.on('click', '.page-back', function() {
        TweenMax.killDelayedCallsTo(pageBackTriggerClick);

        frameGameListSlideRight(function() {
            TweenMax.set($frame_game_item, {
                autoAlpha: 0,
            });

            FrameGameModule.reset((frame_index));

            frameIntroItemSlideRight(function() {
                if (finished_count !== $frame_intro_item.length) return;
                if($evaluationFrame.hasClass('loaded')) return;

                if(window.server) {
                    //server version
                    $.ajax({
                        url: window.server_url + '/evaluation',
                        type: "GET",
                        data: {
                            index: frame_index
                        },
                        success: function(data) {
                            console.log(data);
                            $evaluationFrame.addClass('loaded');
                            EvaluationFrameModule.buildPage(data);
                        },
                    });
                }else {
                    // local version
                    GameModule.evaluation(function(data) {
                        $evaluationFrame.addClass('loaded');
                        EvaluationFrameModule.buildPage(data);
                    });
                }
            });
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

        if(window.server) {
            //server version
            $.ajax({
                url: window.server_url + '/check',
                type: "POST",
                data: {
                    gameIndex: gameIndex,
                    choice: choice,
                    questionIndex: questionIndex
                },
                success: function(data) {
                    console.log(data);
                    switchHandler(data);
                },
            });
        }else {
            //local version
            GameModule.check({
                gameIndex: gameIndex,
                choice: choice,
                questionIndex: questionIndex
            }, function(data) {
                switchHandler(data);
            });
        }

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
    let $game_choice = $frame_game_item.eq(answer.gameIndex).find('.game-choice');

    for (let i = 0; i < $game_choice.length; i++) {
        if (i === answer.rightAnswer) continue;
        $game_choice.eq(i).addClass('wrong');
    }

    $frame_intro_item.eq(answer.gameIndex).addClass('finished').addClass(answer.ifCorrect ? 'won' : 'failed');

    finished_count++;

    TweenMax.delayedCall(time_autoBack, pageBackTriggerClick, [answer]);
}

function pageBackTriggerClick(answer) {
    $frame_game_item.eq(answer.gameIndex).find('.page-back').trigger('click');
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
            TweenMax.to($frameGameQuestion, time_fade_ani, {
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

    TweenMax.staggerTo($frame_intro_item, time_frame_ani, {
        x: '-150%',
    }, time_frame_delay, function() {
        func();
    });
}

function frameIntroItemSlideRight(func) {
    if (typeof(func) !== 'function') func = function() {};
    TweenMax.staggerFromTo($frame_intro_item, time_frame_ani, {
        x: '-150%',
        autoAlpha: 1,
    }, {
        x: '0%',
    }, time_frame_delay, function() {
        $frame_intro_item.addClass('ani');
        func();
    });
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
