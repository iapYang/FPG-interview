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
import MyUtilsModule from './module/myUtilsModule';
import FrameMoudle from './module/frameModule';
import OpenFrameMoudle from './module/openFrameModule';

// window
let brief_data = [{
    category: 'Game',
    title: 'Three Doors',
    sub_title: 'This one is a simple game which requires luck and intellgency. You\'ll have two tries to catch the right choice, I\'ll give you hints, Can you get it done?',
    star: 4,
}, {
    category: 'Question',
    title: 'xxx',
    sub_title: 'yyyyyy',
    star: 4,
}, {
    category: 'Question',
    title: 'xxx',
    sub_title: 'yyyyyy',
    star: 4,
}];

// vars
let server = 'http://localhost:1337';

// selectors
let $scroll_down_btn = $('.scroll-down-button');
let $frame_list = $('.frame-list');

//time


//flag


function init() {
    loadPicture();
    OpenFrameMoudle.fitScreen();
    registerEvents();
    OpenFrameMoudle.startAni();
}

function loadPicture() {
    new PictureLoader().load({
        end: () => {}
    });
}

function registerEvents() {
    $(window).on('resize', function() {
        // MyUtilsModule.narrowByProportion($content_middle);
        OpenFrameMoudle.fitScreen();
        if ($frame_list.hasClass('intro-added')) {
            FrameMoudle.fitScreen();
        }
    });

    $scroll_down_btn.on('click', function() {
        if (!$frame_list.height()) {
            FrameMoudle.fitScreen();
        }

        TweenMax.to('html,body', 1, {
            scrollTop: $frame_list.offset().top,
            onComplete: function() {
                if ($frame_list.hasClass('intro-added')) return;
                $frame_list.addClass('intro-added');
                FrameMoudle.buildPage(brief_data);
            }
        })
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
