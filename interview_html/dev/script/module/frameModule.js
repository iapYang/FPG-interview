import $ from 'jquery';
import swig from 'swig';
import fetchJsonp from 'fetch-jsonp';

import 'fetch-ie8';
import 'es6-promise';

let $dom = $('.frame-list');
let $window = $(window);
let $frame_intro_list = $('.frame-intro-list');

module.fitScreen = function() {
    $dom.css({
        'height': $window.height()
    });
};

module.insertIntro = function(data) {
    fetch('./template/frameIntro.swig')
        .then(function(response) {
            return response.text();
        }).then(function(content) {
            let tpl_article = content;
            console.log(content);
            fillIntro(content,data);
        });
};

function fillIntro(content,data) {
    data.forEach(function(item,i) {
        let render = swig.render(content, {
            locals: {
                category: item.category,
                title: item.title,
                sub_title: item.sub_title
            },
        });
        $frame_intro_list.append($(render));
    });
}



export default module;
