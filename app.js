const API_URL = 'https://opentdb.com/api.php?amount=10&category=15&type=multiple';

let questions = [];
let currentIndex = 0;
let score = 0;

async function fetchQuestions() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
  
      if (data.response_code !== 0) {
        throw new Error('API error: ' + data.response_code);
      }
  
      questions = data.results.map(function(question) {
        return {
          question: decodeHTML(question.question),
          correct_answer: decodeHTML(question.correct_answer),
          incorrect_answers: question.incorrect_answers.map(decodeHTML)
        };
      });
  
      renderQuestion();
  
    } catch (error) {
      console.error(error);
      document.getElementById('question-text').textContent = 'Loading...';
      setTimeout(fetchQuestions, 3000);
    }
  }


function decodeHTML(html) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
}

function shuffleAnswers(question){
    const answers = [
        question.correct_answer,
        question.incorrect_answers[0],
        question.incorrect_answers[1],
        question.incorrect_answers[2],
    ]

    for (let i = answers.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
    }

    return answers;
}

function renderQuestion() {
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('question-counter').textContent = 'Question ' + (currentIndex + 1) + ' / ' + questions.length;
    document.getElementById('score-tracker').textContent = 'Score: ' + score + ' / ' + questions.length;

    const question = questions[currentIndex];
    const answers = shuffleAnswers(question);

    const questionText = document.getElementById('question-text');
    questionText.textContent = question.question;

    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';

    for (let i = 0; i < answers.length; i++) {
        const button = document.createElement('button');
        button.textContent = answers[i];
        button.addEventListener('click', function(){
            handleAnswers(answers[i], question.correct_answer);
        });
        answersContainer.appendChild(button);
    }
}

function handleAnswers(selected, correct) {
    const buttons = document.querySelectorAll('#answers-container button');
  
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
  
      if (buttons[i].textContent === correct) {
        buttons[i].style.backgroundColor = 'green';
      } else {
        buttons[i].style.backgroundColor = 'red';
      }
    }
  
    if (selected === correct) {
        score = score + 1;
        document.getElementById('score-tracker').textContent = 'Score: ' + score + ' / ' + questions.length;
      }
  
    const feedback = document.getElementById('feedback');
    if (selected === correct) {
      feedback.textContent = 'Correct!';
    } else {
      feedback.textContent = 'Incorrect!';
    }
  
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', function() {
      currentIndex = currentIndex + 1;
      if (currentIndex < questions.length) {
        renderQuestion();
      } else {
        showScore();
      }
    });
  
    document.getElementById('feedback').appendChild(nextButton);
}

function showScore() {
    const app = document.getElementById('app');
    app.innerHTML = '';
  
    const heading = document.createElement('h1');
    heading.textContent = 'Quiz Complete!';
  
    const scoreText = document.createElement('p');
    scoreText.textContent = 'You scored ' + score + ' out of ' + questions.length;
  
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Play Again';
    restartButton.addEventListener('click', function() {
      score = 0;
      currentIndex = 0;
      app.innerHTML = `
        <h1 id="title">🎮 Gaming Quiz</h1>
        <p id="score-tracker">Score: 0 / 10</p>
        <div id="question-container">
            <p id="question-counter"></p>
            <p id="question-text"></p>
            <div id="answers-container"></div>
            <p id="feedback"></p>
        </div>
    `;
      fetchQuestions();
    });
  
    app.appendChild(heading);
    app.appendChild(scoreText);
    app.appendChild(restartButton);
}



fetchQuestions();

