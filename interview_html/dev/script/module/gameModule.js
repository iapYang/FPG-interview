import $ from 'jquery';

let data = [{
    category: 'Game',
    title: 'Three Doors',
    sub_title: 'This one is a simple game which requires luck and intellgency. You\'ll have two tries to catch the right choice, I\'ll give you hints, Can you get it done?',
    star: 4,
    questions: ['There\'re three doors on the left, one of them is the correct door. Choose the one that you think is right.', 'Well, the difficult part comes. Your choice is currentAnswer. I\'m gonna tell you the placeholder is a wrong answer, you can choose to whether changing your answer.'],
    options: [{
        image: './image/door_1204922_easyicon.net.svg',
    }, {
        image: './image/door_1204922_easyicon.net.svg',
    }, {
        image: './image/door_1204922_easyicon.net.svg',
    }],
    answer: 0,
}, {
    category: 'Question',
    title: 'xxx',
    sub_title: 'yyyyyy',
    star: 5,
    questions: ['1+1'],
    options: [{
        text: '2',
    }, {
        text: '1',
    }, {
        text: '0',
    }],
    answer: 0,
}, {
    category: 'Question',
    title: 'xxx',
    sub_title: 'yyyyyy',
    star: 4,
    questions: ['3+3'],
    options: [{
        text: '6',
    }, {
        text: '7',
    }, {
        text: '8',
    }],
    answer: 0,
}];

module.getBriefData = function(func) {
    if (typeof(func) !== 'function') func = function() {};
    let briefData = [];

    data.forEach(function(item, i) {
        let tmp = {};
        tmp.category = item.category;
        tmp.title = item.title;
        tmp.sub_title = item.sub_title;
        tmp.star = item.star;
        briefData.push(tmp);
    });

    func(briefData);
}

module.getDetailDataByIndex = function(index, func) {
    if (typeof(func) !== 'function') func = function() {};

    func({
        questions: data[index].questions,
        options: data[index].options
    });
}

module.check = function(obj, func) {
    if (typeof(func) !== 'function') func = function() {};

    //check if more than one step
    let gameIndex = obj.gameIndex;
    let questionIndex = obj.questionIndex;
    let choice = obj.choice;
    if (questionIndex !== data[gameIndex].questions.length - 1) {
        let choices = [0, 1, 2];
        let rightAnswer = chooseRandomElement(choices);
        data[gameIndex].answer = rightAnswer;
        removeElement(rightAnswer, choices);
        removeElement(choice, choices);

        func({
            gameIndex: gameIndex,
            questionIndex: questionIndex,
            choice: choice,
            wrongAnswer: chooseRandomElement(choices),
            move: 'change'
        });
    } else {
        func({
            rightAnswer: data[gameIndex].answer,
            move: 'finish',
            gameIndex: gameIndex,
            choice: choice,
        });
    }
};

function removeElement(el, array) {
    var index = array.indexOf(el);

    if (index > -1) {
        array.splice(index, 1);
    }
}

function chooseRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export default module;
