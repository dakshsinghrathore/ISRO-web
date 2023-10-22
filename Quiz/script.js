const questions = [
    {
        question: "Who is known as the father of Indian Space Program ?",
        answers: [
            {text: "A. P. J. Abdul Kalam", correct: false},
            {text: "Homi Bhabha", correct: false},
            {text: "C V Raman", correct: false},
            {text: "Vikram Sarabhai", correct: true},
        ]
    },
    {
        question: "ISRO comes under which one of the following departments?",
        answers: [
            {text: "Department of Space", correct: true},
            {text: "Department of Atomic Energy", correct: false},
            {text: "Department of Science and Technology", correct: false},
            {text: " None of these", correct: false},
        ]

    },
    {
        question: "In which year Indian Space Research Organisation (ISRO) was founded?",
        answers: [
            {text: "15 August 1969", correct: true},
            {text: "15 August 1958", correct: false},
            {text: "15 August 1965", correct: false},
            {text: "15 August 1967", correct: false},
        ]

    },
    {
        question: "Where is the Satish Dhawan Space Centre (SDSC) located?",
        answers: [
            {text: "Mandya", correct: false},
            {text: "Bengaluru", correct: false},
            {text: "Sriharikota", correct: true},
            {text: "Hyderabad", correct: false},
        ]

    },
    {
        question: "What is the full form of IIRS located in Dehradun?",
        answers: [
            {text: "Indian Institute of Remote Scaling", correct: false},
            {text: "Indian Institute of Remote Sensing", correct: true},
            {text: "Indian Institute of Remote Sensitivity", correct: false},
            {text: "Indian Institute of Regional Sensing", correct: false},
        ]

    },
    {
        question: "Who is the present Chairperson of Indian Space Research Organisation (ISRO)?",
        answers: [
            {text: "S.Somanath", correct: true},
            {text: "K. Sivan", correct: false},
            {text: "A.S.Kiran Kumar", correct: false},
            {text: "Shailesh Nayak", correct: false},
        ]
    },
    {
        question: "Where is the Headquarters of Indian Space Research Organisation (ISRO) located?",
        answers: [
            {text: "New Delhi", correct: false},
            {text: "Hyderabad", correct: false},
            {text: "Sriharikota", correct: false},
            {text: "Bengaluru", correct: true},
        ]
    },
    {
        question: "What is the Full Form of PSLV?",
        answers: [
            {text: "Public Satellite Launch Vehicle", correct: false},
            {text: "Polar Satellite Launch Vehicle", correct: true},
            {text: "Polar Service Launch Vehicle", correct: false},
            {text: "Public Service Launch Vehicle", correct: false},
        ]
    },
    {
        question: "Which one of the following ISRO Military Satellite used by Indian Navy?",
        answers: [
            {text: "Cartosat-2A", correct: false},
            {text: "Cartosat-2", correct: false},
            {text: "GSAT-7", correct: true},
            {text: "Cartosat-3", correct: false},
        ]
    },
    {
        question: "Who is known as the Missile Man of India?",
        answers: [
            {text: "Satyendra Nath Bose", correct: false},
            {text: "Vikram Sarabhai", correct: false},
            {text: "C.V. Raman", correct: false},
            {text: "A. P. J. Abdul Kalam", correct: true},
        ]
    }
];

const questionelement = document.getElementById("question");
const ansbtn = document.getElementById("answer-buttons");
const nextbtn = document.getElementById("next-btn");
const lblquesno = document.getElementById("lblquesno");
const lblscore = document.getElementById("lblscore");


let currentquestionindex = 0;
let score = 0;

function startquiz(){
    currentquestionindex = 0;
    score = 0;
    nextbtn.innerText = "Next";
    showquestion();
}

function showquestion()
{
    resetState();
    let currentQuestion = questions[currentquestionindex];
    let questionNo = currentquestionindex + 1;
    lblquesno.innerHTML = `${questionNo}/${questions.length}`;
    questionelement.innerHTML = currentQuestion.question;
    currentQuestion.answers.forEach(answers => {
        const button = document.createElement("button");
        button.innerHTML = answers.text;
        button.classList.add("btn1");
        ansbtn.appendChild(button);
        if(answers.correct){
            button.dataset.correct = answers.correct;
        }
        button.addEventListener("click", selectans);
    });

}

function resetState()
{
    lblscore.innerHTML=score;
    nextbtn.style.display="none";
    while(ansbtn.firstChild){
        ansbtn.removeChild(ansbtn.firstChild);
    }
}

function selectans(e){
    const selectedbtn = e.target;
    const iscorrect = selectedbtn.dataset.correct == "true";
    if(iscorrect){
        selectedbtn.classList.add("correct");
        score++;
        lblscore.innerHTML = score;

    }
    else{
        selectedbtn.classList.add("incorrect");
    }
    Array.from(ansbtn.children).forEach(button => {
        if(button.dataset.correct == "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextbtn.style.display = "block";

}

function showScore(){
    resetState();
    questionelement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextbtn.innerHTML = "Play Again";
    nextbtn.style.display = "block";
}

function handlenxtbtn(){
    currentquestionindex++;
    if(currentquestionindex < questions.length){
        showquestion();
    }
    else{
        showScore();
        score=0;
    }
}

nextbtn.addEventListener("click", ()=>{
    if(currentquestionindex < questions.length){
        handlenxtbtn();
    }
    else{
        startquiz();
    }
})

startquiz();