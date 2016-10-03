import PictureLoader from './component/pictureLoader';
import Platform from './component/platform';
// import Slider from './component/slider';
import Util from './component/util';

import fetchJsonp from 'fetch-jsonp';
import 'fetch-ie8';
import 'es6-promise';
import $ from 'jquery';
import TweenMax from 'gsap';

// module
import MyUtils from './module/myUtilsModule';

// vars
let server = 'http://localhost:1337';
let obi_words = [];
let current_question_index = 0;
let current_word_index = 0;

// selectors
let $talkBubble = $('.talkbubble');
let $words = $('.words');
let $door_item = $('.door-item');
let $door = $('.door');
let $arrow_down = $('.arrow-down');

//time
let timeTalkBubble = 0.3;

//flag
let flagHaveChoice = false;


function track(action, trackingString) {
    console.log(`Action:${action}`, `Track:${trackingString}`);

    if (typeof ga !== 'undefined') ga('send', 'event', 'xxx', action, trackingString);

    return false;
}

function init() {
    loadPicture();
    registerEvents();

    fetch('./data/config.json')
        .then(function(response) {
            return response.json();
        }).then(function(content) {
            obi_words = content.first_question;
            changeTalkBubbles();
        });
}

function loadPicture() {
    new PictureLoader().load({
        end: () => {}
    });
}

function registerEvents() {
    $door.on('mouseenter', function() {
        if (!Platform.isDesktop) return;
        if ($door_item.hasClass('selected')) return;

        let $parent = $(this).parent();
        $parent.addClass('active');
    }).on('mouseleave', function() {
        if (!Platform.isDesktop) return;
        if ($door_item.hasClass('selected')) return;

        let $parent = $(this).parent();
        $parent.removeClass('active');
    }).on('click', function() {
        let index = $door.index($(this));
        let $parent = $(this).parent();
        $.ajax({
            url: server + '/getDoorsNumber',
            type: "GET",
            data: {
                'choice': index
            },
            success: function(result) {
                if ($door_item.hasClass('selected')) return;
                $parent.addClass('selected');
                console.log('Wrong Answer:' + result);
                obi_words[current_word_index] = obi_words[current_word_index].replace(/placeHere/gm, numberToString(result));
                $arrow_down.eq(index).addClass('selected');
                changeTalkBubbles();



            },
        });
    });
}

function changeTalkBubbles() {
    TweenMax.set($words, {
        autoAlpha: 0
    });

    TweenMax.to($talkBubble, timeTalkBubble, {
        scaleX: 0,
        scaleY: 0,
        onComplete: function() {
            TweenMax.killTweensOf($words);
            $words.html(MyUtils.breakSentence(obi_words[current_word_index]));
            current_word_index++;

            TweenMax.to($talkBubble, timeTalkBubble, {
                scaleX: 1,
                scaleY: 1,
                onComplete: function() {
                    // MyUtils.showText($words, obi_words[0], 0, 50);
                    MyUtils.startAnimation($words);
                },
            });
        },
    });
}

function numberToString(index) {
    switch (index) {
        case 0:
            return 'first';
            break;
        case 1:
            return 'second';
            break;
        case 2:
            return 'third';
            break;
        default:
            return 'zero';
    }
}

window.addEventListener('load', init, false);
