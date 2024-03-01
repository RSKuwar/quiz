const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");

//get score form localstorage and h1(finalScore) element to print score
const mostRecentScore = localStorage.getItem("mostRecentScore");
const finalScore = document.getElementById("finalScore");

//show last score in h1 element in end page
finalScore.innerText = mostRecentScore;

//to get high score from local storage convert string  to array
const highScore = JSON.parse(localStorage.getItem("highScore")) || [];

const max_high_score = 5;

//whenever whe type in username input in end form
username.addEventListener('keyup', () =>{
    //check if username is filled if not then disable save button
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = e =>{
    e.preventDefault();
    //store score and username in localstorage using score object
    const score = {
        score:mostRecentScore,
        name:username.value
    };
    
    //store score in highscore
    highScore.push(score);

    //this function takes a and b from highscore then 
    //b score - a score = if b > a put b before a
    highScore.sort((a,b) =>{
        return b.score - a.score;
    });
    //should only have 5 result after sort in desc
    highScore.splice(5);

    //update local storage
    localStorage.setItem("highScore",JSON.stringify(highScore));
    window.location.assign("/");
};


