import $ from 'jquery';
import TweenMax from 'gsap';

let time_animate = 0.5;
let time_svg = 2;

let count = 0;

let $dom = $('.open-frame');
let $intro_stuff = $dom.find('.intro-stuff');
let $window = $(window);
let $holder = $dom.find('.holder');
let $path = $holder.find('path');
let $scroll_down = $dom.find('.scroll-down');

module.fitScreen = function() {
    // $dom.width($window.width());
    $dom.height($window.height())
};

module.startAni = function() {
    TweenMax.to($path, time_animate, {
        autoAlpha: 1,
        onComplete: function() {
            for (let i = 0; i < $path.length; i++) {
                let $this = $path.eq(i);
                $this.addClass('active');
                count++;

                TweenMax.delayedCall(time_svg * 0.8, function() {
                    $this.attr({
                        'fill': '#cfcbaf',
                        'stroke-width': 0,
                    });

                    if (count == $path.length) {
                        TweenMax.delayedCall(time_svg * 0.3, introShowByTurn);
                    }
                });
            }
        }
    })
};

function introShowByTurn(index) {
    if (typeof(index) == 'undefined') index = 0;
    TweenMax.to($intro_stuff.eq(index), time_animate, {
        y: '0',
        autoAlpha: 1,
        onComplete: function() {
            index++;
            if (index < $intro_stuff.length) {
                introShowByTurn(index);
            } else {
                TweenMax.to($scroll_down, time_animate, {
                    autoAlpha: 1,
                    onComplete: registerEvents
                });
            }
        }
    });
}

function registerEvents() {
    $holder.on('click', function() {
        window.open('https://github.com/iapYang');
    });
}

export default module;
