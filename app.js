const API_URL = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';

let questions = [];
let currentIndex = 0;
let score = 0;

function decodeHTML(html) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
}

async function fetchQuestions() {
    // const response = await fetch(API_URL);
    const response = await fetch('questions.json');
    const data = await response.json();

    console.log(data);

    const questions = data.map(function(question){
        return {
            question: decodeHTML(question.question),
            correct_answer: decodeHTML(question.correct_answer),
            incorrect_answers: question.incorrect_answers.map(decodeHTML),
        };
    });

    console.log(questions);
}

fetchQuestions();

