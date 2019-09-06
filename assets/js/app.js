const TriviaGame = {
    score: 0,
    renderSplash: function() {
        $('body').empty();
        $splash = $('<div class="jumbotron splash">').text('Click anywhere');
        $splash.appendTo($('body'));
    },
    renderQuestion: function(which) {
        $('body').empty();
        if (typeof which === 'undefined') {
            which = Math.floor(Math.random()*Questions.length);
        }
        $('<div class="jumbotron">').appendTo($('body'))
            .append($('<div class="row">'))
            .append($('<div class="row">'));
        console.log(which);
    },
    answerQuestion: function(which) {

    },
    start: function() {
        this.score = 0;
        this.renderSplash();
    },
    load: function() {
        $.getJSON('./assets/data/questions.json')
        .done(function(data) {
            Questions = data;
        });
    }
}

let Questions = [];

$(document).ready(function() {
    TriviaGame.start();
    $(document).on('click', '.splash', function() {
        TriviaGame.renderQuestion();
    });
});