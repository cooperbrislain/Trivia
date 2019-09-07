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
        const Question = Questions[which];
        $('<div class="jumbotron">').appendTo($('body'));
        $('<h3 class="question">').text(Question.question).appendTo('.jumbotron');
        $answers = $('<div class="answers">');
        $('<button class="btn answer correct">')
            .text(Question.correct_answer)
            .appendTo($answers);
        Question.incorrect_answers.forEach(Answer => {
            $('<button class="btn answer incorrect">')
                .text(Answer)
                .appendTo($answers);
        });
        for (let i=0; i<$answers.length; i++) {
            $answers.eq(i).before(Math.floor(Math.random()*$answers.length));
        }
        $answers.appendTo('.jumbotron');
    },
    renderAnswer: function(answerText) {

    },
    answerQuestion: function(which) {

    },
    start: function() {
        this.score = 0;
        this.renderSplash();
    },
    load: function() {
        $.getJSON('https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple')
        .done(function(data) {
            Questions = data.results;
            TriviaGame.start();
        });
    }
}

let Questions = [];

$(document).ready(function() {
    TriviaGame.load();
    $(document).on('click', '.splash', function() {
        TriviaGame.renderQuestion();
    });

    $(document).on('click', '.card.answer.correct', function() {
        $(this).css('background-color', 'green');
    });

    $(document).on('click', '.card.answer.incorrect', function() {
        $(this).css('background-color', 'red');
    });
});