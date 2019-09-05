const TriviaGame = {
    score: 0,
    start: () => {
        this.score = 0;
        this.renderSplash();
    },
    renderSplash: () => {
        $('body').empty();
        $splash = $('<div class="jumbotron">').text('Click anywhere');
        $splash.appendTo($('body'));
    },
    renderQuestion: (which) => {
        $('body').empty();
    },
    answerQuestion: (which) => {

    }
}

$(document).ready(function() {
    TriviaGame.start();
});