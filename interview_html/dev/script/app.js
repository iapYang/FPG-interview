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
import GameModule from './module/gameModule.js';

// window
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

    });

    $scroll_down_btn.on('click', function() {
        $frame_list.css('display','block');

        TweenMax.to('html,body', 1, {
            scrollTop: $frame_list.offset().top,
            onComplete: function() {
                if ($frame_list.hasClass('intro-added')) return;
                $frame_list.addClass('intro-added');

                //local version
                GameModule.getBriefData(function(data) {
                    FrameMoudle.buildPage(data);
                });
            }
        });
    });
}

window.addEventListener('load', init, false);
