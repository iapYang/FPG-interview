import $ from 'jquery';

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
}

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
}

export default module;
