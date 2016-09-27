import swig from 'swig';
import fetchJsonp from 'fetch-jsonp';

import 'fetch-ie8';
import 'es6-promise';

let module = {};

let tplArticle;
let articleFeeds;
let articleDatas = [];


module.load = (arrUrl) => {
    articleFeeds = arrUrl;

    fetch('./template/article.swig')
        .then(function(response) {
            return response.text();
        }).then(function(content) {
            tplArticle = content;
            processArticle();
        });
};

function processArticle(){
    let loadedFeed = 0;
    let totalFeed = articleFeeds.length;

    articleFeeds.forEach((item) => {
        fetchJsonp(item, {
                timeout: 99999,
            })
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                json.full_cards.forEach((data) => {
                    if (data.canonical) articleDatas.push(data);
                });

                ++loadedFeed;

                if(loadedFeed === totalFeed){
                    fillArticle();
                }
            });
    });
}

function fillArticle(){
    Util.sortObjArrByKey(articleDatas, 'published_timestamp');
    articleDatas.reverse();

    let articleWrapper = document.getElementById('article-wrapper');

    articleDatas.forEach((data) => {
        let article = document.createElement('article');

        article.innerHTML = swig.render(tplArticle, {
            locals: {
                link: data.canonical ? data.canonical : null,
                picture: data.main_image ? data.main_image.src : null,
                category: data.categories ? data.categories.display : null,
                title: data.title.replace(/<(?:.|\n)*?>/gm, ''),
                author: data.contributors ? data.contributors[0].name : null,
                timestamp: data.published_formatted ? (data.published_formatted.split(',')[0] + ',' + data.published_formatted.split(',')[1].substr(0, 5)) : null
            }
        });

        articleWrapper.appendChild(article);
    });
}

export default module;
