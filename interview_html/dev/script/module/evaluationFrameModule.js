import $ from 'jquery';
import swig from 'swig';
import TweenMax from 'gsap';

import fetchJsonp from 'fetch-jsonp';
import 'fetch-ie8';
import 'es6-promise';

let time_fade = 0.8;
let time_delay = 0.5;

let $evaluationFrame = $('.evaluationFrame');
let $evaluation_item;
let $frame_list = $('.frame-list');

module.buildPage = function(data, func) {
    if (typeof(func) !== 'function') func = function() {};
    insertGameFrame(data, func);
};

function insertGameFrame(data, func) {
    fetch('./template/evaluationList.swig')
        .then(function(response) {
            return response.text();
        }).then(function(content) {
            fillGameFrame(content, data, func);
        });
}

function fillGameFrame(content, data, func) {
    let render = swig.render(content, {
        locals: {
            evaluation: data.evaluation
        },
    });
    $evaluationFrame.append(render).css('display', 'block');
    registerEvents();
    $evaluation_item = $evaluationFrame.find('.evaluation-item');

    TweenMax.to('html,body', 1, {
        scrollTop: $evaluationFrame.offset().top,
        onComplete: function() {
            TweenMax.staggerTo($evaluationFrame.find('.part'), time_fade, {
                y: 0,
                autoAlpha: 1
            }, time_delay, function() {

            });
            func();
        }
    });
}

function registerEvents() {
    $('.scroll-up').on('click', function() {
        TweenMax.to('html,body', 1, {
            scrollTop: $frame_list.offset().top,
        });
    });
}

function openAnimation(index) {
    if (typeof(index) === 'undefined') index = 0;

    if (index >= $evaluation_item.length) return;

    TweenMax.staggerTo([$evaluation_item.eq(index).find('.part')], time_fade, {
        y: 0,
        autoAlpha: 1
    }, time_delay, function() {
        openAnimation(index + 1);
    });
}


export default module;
