import $ from 'jquery';
import TweenMax from 'gsap';

// make words appear letter by letter
module.showText = ($target, message, index, interval) => {
    showTextStep($target, message, index, interval);
};

function showTextStep($target, message, index, interval) {
    if (index < message.length) {
        $target.append(message[index++]);
        setTimeout(function() {
            showTextStep($target, message, index, interval);
        }, interval);
    }
}

module.startAnimation = function($el) {
    TweenMax.set($el, {
        autoAlpha: 0
    });

    TweenMax.staggerFromTo($el.find("span"), 0.4, {
        autoAlpha: 0,
        color: "red"
    }, {
        autoAlpha: 1,
        color: "black"
    }, 0.1, reset($el));
};

function reset($el) {
    TweenMax.to($el, 1, {
        autoAlpha: 1
    });
}

module.breakSentence = function(words) {
    let array = words.split(' ');
    let result = '';

    for (let i = 0; i < array.length; ++i) {
        result += ('<span>' + array[i]+ '&nbsp;</span>');
    }

    return result;
};

module.narrowByProportion = function($dom) {
    let default_proportion = 1885 / 886;
    // let width = $dom.width();
    // let height = $dom.height();

    let $parent = $dom.parent();
    let parent_width = $parent.width();
    let parent_height = $parent.height();

    let current_proportion = parent_width / parent_height;

    if(current_proportion >= default_proportion) {
        $dom.width(parent_height * default_proportion);
        $dom.height(parent_height);
    }else {
        $dom.width(parent_width);
        $dom.height(parent_width / default_proportion);
    }

    $dom.css({
        'top': (parent_height - $dom.height()) / 2,
        'left': (parent_width - $dom.width()) / 2,
    });
};

export default module;
