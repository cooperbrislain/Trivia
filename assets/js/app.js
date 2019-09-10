let TriviaGame = {
    score: 0,
    time_per_question: 15,
    time_left: 0,
    timer: null,
    categories: [],
    renderSplash: function() {
        $('body').empty();
        $splash = $('<div class="jumbotron splash">')
            .append($('<h1>').text('SUPER ULTRA MEGA TRIVIA BLAST 2020 PRO EDITION'));
        $form = $('<form>');
        $form.append(
            $('<div class="form-group">')
            .append($('<label for="category">').text('Select a Category'))
            .append('<select name="category" id="category" class="form-control">')
        );
        $form.append($('<button class="btn btn-large btn-primary start">').text('START!'));
        $form.appendTo($splash);
        $splash.appendTo($('body'));
        this.categories.forEach(category => {
            console.log(category);
            $('select#category').append($('<option>').val(category.id).html(category.name));
        });
    },
    renderQuestion: function() {
        if (!Questions.length) {
            return this.renderScore();
        }
        $('body').empty();
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
    renderScore: function() {
        $('body').empty();
        let $scoreboard = $('<div class="jumbotron score">');
        $scoreboard.append($('<h1>').text('Game Over'));
        $scoreboard.append($('<h3>').text('Final Score:'));
        $scoreboard.append($('<h2>').text(this.score));
        $scoreboard.appendTo('body');
    },
    tick: function() {
        TriviaGame.time_left--;
        if (TriviaGame.time_left <= 0) {
            console.log('out of time');
            $('button.answer.correct').addClass('reveal');
            $('button.answer.correct').one('animationend', () => { TriviaGame.renderQuestion() })
            clearInterval(TriviaGame.timer);
        } else {
            $('.timer').html(TriviaGame.time_left);
            $('.timer').addClass('ticking');
            $('.timer').on('animationend', () => { 
                $('.timer').removeClass('ticking'); 
            });
        }
        
    },
    load: function() {
        $.ajax({ 
            url: 'https://opentdb.com/api_category.php', 
            method: 'GET'
        })
        .then(data => {
            TriviaGame.categories = data.trivia_categories;
            TriviaGame.renderSplash();
        });
    },
    startGame: category => {
        this.score = 0;
        $.ajax({
            url: `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`,
            method: 'GET'
        })
        .then(data => { 
            Questions = shuffle(data.results);
            TriviaGame.renderQuestion(); 
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

    $(document).on('click', 'button.answer.correct', function() {
        TriviaGame.score++;
        clearInterval(TriviaGame.timer);
        TriviaGame.score+=TriviaGame.time_left;
        $(this).addClass('woot');
        $(this).one('animationend', () => { TriviaGame.renderQuestion() })
    });

    $(document).on('click', 'button.answer.incorrect', function() {
        clearInterval(TriviaGame.timer);
        $(this).addClass('nope');
        $('button.answer.correct').addClass('reveal');
        $(this).one('animationend', () => { $(this).css('visibility', 'hidden') });
        $('button.answer.correct').one('animationend', () => { TriviaGame.renderQuestion() })
    });

    $(document).on('click', 'button.start' , e => {
        TriviaGame.startGame($('#category').val());
        e.preventDefault();
    });
});

const convert_to_spans = (selector) => {
    $(selector).html($(selector).text.split(' ').reduce( (full_string, word, i) => {
        full_string = full_string + `<span class="span-${i}">${word}</span>`;
    }), '');
}