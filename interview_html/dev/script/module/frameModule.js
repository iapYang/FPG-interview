import $ from 'jquery';

let $dom = $('.frame-list');
let $window = $(window);

module.fitScreen = function() {
    $dom.css({
        'min-height': $window.height()
    });
};



export default module;
