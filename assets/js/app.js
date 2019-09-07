let TriviaGame = {
    score: 0,
    time_per_question: 15,
    time_left: 0,
    timer: null,
    renderSplash: function() {
        $('body').empty();
        $splash = $('<div class="jumbotron splash">')
            .append($('<h1>').text('Click anywhere'));
        $splash.appendTo($('body'));
    },
    renderQuestion: function() {
        $('body').empty();
        if (typeof which === 'undefined') {
            which = Math.floor(Math.random()*Questions.length);
        }
        const Question = Questions.pop();
        $('<div class="jumbotron">').appendTo($('body'));
        $('<h3 class="question">').html(Question.question).appendTo('.jumbotron');
        let $answers = $('<div class="answers">');
        let $_answers = [];
        $_answers.push($('<button class="btn answer correct">').html(Question.correct_answer));
        Question.incorrect_answers.forEach(Answer => {
            $_answers.push($('<button class="btn answer incorrect">').html(Answer));
        });
        let shuff = shuffle($_answers);
        $_answers.forEach( $answer => { $answer.appendTo($answers) });
        $answers.appendTo('.jumbotron');
        $('<div class="timer">').appendTo('.jumbotron');
        this.time_left = this.time_per_question;
        this.timer = setInterval(this.tick, 1000);
    },
    tick: function() {
        TriviaGame.time_left--;
        if (TriviaGame.time_left <= 0) clearInterval(TriviaGame.timer);
        $('.timer').html(TriviaGame.time_left);
    },
    start: function() {
        this.score = 0;
        this.renderSplash();
    },
    load: function() {
        $.getJSON('https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple')
        .done(function(data) {
            Questions = shuffle(data.results);
            TriviaGame.start();
        });
    }
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * Found here: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let Questions = [];

$(document).ready(function() {
    TriviaGame.load();
    $(document).on('click', '.splash', function() {
        TriviaGame.renderQuestion();
    });

    $(document).on('click', 'button.answer.correct', function() {
        clearInterval(TriviaGame.timer);
        TriviaGame.score+=TriviaGame.time_left;
        $(this).addClass('woot');
        $(this).one('animationend', () => { TriviaGame.renderQuestion() })
    });

    $(document).on('click', 'button.answer.incorrect', function() {
        clearInterval(TriviaGame.timer);
        $(this).addClass('nope');
        $('.button.answer.correct').addClass('reveal');
        $(this).one('animationend', () => { TriviaGame.renderQuestion() })
    });
});