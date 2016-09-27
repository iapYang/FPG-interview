/**
 * MainController
 *
 * @description :: Server-side logic for managing maincontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var data = [];


module.exports = {
    frame1: function(req, res) {
        return res.json('23333333');
    },
    getDoorsNumber: function(req, res) {
		console.log('==============');
        var choices = [0, 1, 2];
        var choice = parseInt(req.param('choice'));
        var rightAnswer = chooseRandomElement(choices);
        req.session.rightAnswer = rightAnswer;

        removeElement(rightAnswer, choices);
        removeElement(choice, choices);

        console.log(choices, choice, rightAnswer);

        return res.json(chooseRandomElement(choices));
    },
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
