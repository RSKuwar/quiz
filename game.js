const question = document.getElementById("question");

//every choices with class name choice text from game.html save as array
const choices = Array.from(document.getElementsByClassName("choice-text"));

//count questions and score
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");

//progress bar
const progressBarFull = document.getElementById("progressBarFull");

//loader
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currQuestion = {};

//until question loads do not start answering
let acceptingAnswer =false;

let score = 0;
let questionCounter = 0;
let availableQuestion = [];




//question array
let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
.then(res =>{
  return res.json();
})
.then(loadedQuestions =>{
  console.log(loadedQuestions.results);
  questions = loadedQuestions.results.map( loadedQuestion => {
    const formatedQuestion = {
      question:loadedQuestion.question
    };

    const answerChoices = [...loadedQuestion.incorrect_answers];
    formatedQuestion.answer = Math.floor(Math.random()*3)+1;
    answerChoices.splice(formatedQuestion.answer -1,0,loadedQuestion.correct_answer);

    answerChoices.forEach((choice,index) =>{
      formatedQuestion['choice'+(index+1)] =choice;
    })
    return formatedQuestion;
  })
  // questions = loadedQuestions;
  
  startGame();
})
.catch(err =>{
  console.error(err);
})




//   constants
const correct_bonus = 10;
const max_question = 3;

//start the game
startGame = () =>{
    questionCounter = 0;
    score = 0;
    //spread question array put in available question
    availableQuestion = [...questions];

    //call a function to get new random question
    getNewQuestion();
    game.classList.remove("hidden");
  loader.classList.add("hidden");
}

getNewQuestion = () =>{
  //to check if all question are done the go to end html
  if(availableQuestion.length === 0 || questionCounter >= max_question){

    //save latest score in local storage and print in end page
    localStorage.setItem('mostRecentScore',score);

    //go to end page
    return window.location.assign("/end.html");
  }
    //increase counter
    questionCounter++;
    
    //update at question no. at top
    progressText.innerText = `Question ${questionCounter}/${max_question}`;

    progressBarFull.style.width = `${(questionCounter/max_question) * 100}%`;

    //find index = (floor value of random value * question array length) 
    //which will be upto lengtth of questions
    const questionIndex = Math.floor(Math.random()*availableQuestion.length);

    //to find question using index
    currQuestion = availableQuestion[questionIndex]

    //display question
    question.innerText = currQuestion.question;

    //for every options
    choices.forEach(choice =>{
      //from console log dataset find number of option save as data-number in game.html
      const number = choice.dataset["number"];
      
      //display current question option with number
      choice.innerText = currQuestion["choice" + number];
      
      //remove one question index from available
      availableQuestion.splice(questionIndex,1);
      
      //after loading question we can start answering
      acceptingAnswer = true;
    });
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    //if not loaded do not accept answer
    if(!acceptingAnswer) return;
    acceptingAnswer = false;
    
    //to select number of selected answer
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    
    //add class correct/incorrect to div element choice-container
    const classsToApply = selectedAnswer == currQuestion.answer ? "correct" : "incorrect";

    //to check if correct answer then call incscore and pass value of 10
    if(classsToApply === 'correct'){
      incrementScore(correct_bonus);
    }
    
    
    //this class will be added to parent classlist
    selectedChoice.parentElement.classList.add(classsToApply);

    //to show answer for some time
    setTimeout(() =>{
        //this class will be removed from parent classlist for next question
        selectedChoice.parentElement.classList.remove(classsToApply);
        getNewQuestion();
    },1000);
    
  });
});

//to update and increment score
incrementScore = num =>{
  score += num;
  scoreText.innerText = score;
}

