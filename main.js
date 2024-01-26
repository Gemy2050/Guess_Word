window.onload = function () {
  generateInputs();
};

//* Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Developer-X`;

//* Game Options
let tries = 5;
let wordLetters = 6;
let currentTry = 1;
let hintsCount = 3;

//* Manage Hints
document.querySelector(".hint span").innerHTML = hintsCount;
let hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", handleHints);

//* Handle Words
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "School",
  "Mainly",
  "Script",
];
let wordToGuess = words[Math.trunc(Math.random() * words.length)].toLowerCase();

//* Generate Tries and Inputs Then Append To Inputs Container
function generateInputs() {
  inputsContainer = document.querySelector(".inputs");
  for (let i = 1; i <= tries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.className = `try-${i}`;
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i > 1) tryDiv.classList.add("disabled-inputs");

    for (let j = 1; j <= wordLetters; j++) {
      tryDiv.innerHTML += `
        <input type='text' id='guess-${i}-letter-${j}' maxLength='1'/>
      `;
    }

    inputsContainer.appendChild(tryDiv);
  }

  //* Focus On First Input in First Try
  inputsContainer.children[0].children[1].focus();

  //* Disable All Inputs Except First Try Inputs
  DisabledTryInputs = document.querySelectorAll(".disabled-inputs input");
  DisabledTryInputs.forEach((input) => (input.disabled = true));

  //* Handle Inputs Navigation
  let inputs = document.querySelectorAll(".inputs input");
  inputs.forEach((input, index) => {
    input.oninput = function () {
      if (index < inputs.length - 1) inputs[index + 1].focus();
    };
    input.onkeydown = function (event) {
      if (event.key == "ArrowRight" && index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else if (event.key == "ArrowLeft" && index > 0) {
        inputs[index - 1].focus();
      }
    };
  });
}

let guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuess);

function handleGuess() {
  let successGuess = true;
  let message = document.querySelector(".message");
  let inputs = document.querySelectorAll(`.try-${currentTry} input`);

  //* Check Letters of Word
  for (let i = 0; i < wordToGuess.length; i++) {
    if (wordToGuess[i] == inputs[i].value) {
      //* Letter is Correct And in Place
      inputs[i].classList.add("in-place");
    } else if (wordToGuess.includes(inputs[i].value) && inputs[i].value != "") {
      //* Letter is Correct But Not in Place
      inputs[i].classList.add("not-in-place");
      successGuess = false;
    } else {
      //* Letter is Wrong
      inputs[i].classList.add("wrong");
      successGuess = false;
    }
  }

  let previousTryEl = document.querySelector(`.try-${currentTry}`);

  if (successGuess) {
    //* Win Case
    message.innerHTML = `Congrats, The Word is: <span>${wordToGuess}</span>`;
    guessButton.classList.add("disabled");
    hintButton.classList.add("disabled");

    //* Play Animation & Sound
    document.querySelector(".animation").classList.remove("hidden");
    document.querySelector("dotlottie-player").play();
    document.querySelector("video.win").play();
    newGame();
  } else {
    if (++currentTry <= tries) {
      //* Disable Previous Try And Activate Current Try
      previousTryEl.classList.add("disabled-inputs");

      let currentTryEl = document.querySelector(`.try-${currentTry}`);
      currentTryEl.classList.remove("disabled-inputs");
      currentTryEl.querySelectorAll("input").forEach((input, index) => {
        input.removeAttribute("disabled");
        index == 0 ? input.focus() : null;
      });
    } else {
      message.innerHTML = `You Failed, The Word is: <span>${wordToGuess}</span>`;
      guessButton.classList.add("disabled");
      hintButton.classList.add("disabled");
      document.querySelector("audio.fail").play();
      newGame();
    }
  }
  //* Disable All Inputs in Previous Try
  previousTryEl
    .querySelectorAll("input")
    .forEach((input) => input.setAttribute("disabled", true));
}

function handleHints() {
  //* Get Random Letter From Available Letters For Hint
  let enabledInputs = [...document.querySelectorAll("input:not([disabled])")];
  let emptyInputs = enabledInputs.filter((input) => input.value == "");

  //* Check if Tries End
  if (enabledInputs.length == 0) {
    triesFinished = true;
    hintButton.classList.add("disabled");
    return;
  }

  //* Get The Required Letters For Hints
  let availableLetters = wordToGuess
    .split("")
    .filter((letter, i) => {
      if (letter != enabledInputs[i].value) {
        return letter;
      }
    })
    .join("");

  //* Check if There is Not Empty Inputs And Word is Correct
  if (emptyInputs.length == 0 && availableLetters.length == 0) {
    guessButton.click();
    // alert("Word is Correct");
    return;
  } else {
    //* Get The Hint Letter Then Add It To Input
    let randomLetterIndex = Math.trunc(Math.random() * availableLetters.length);
    let randomLetter = availableLetters[randomLetterIndex];

    enabledInputs[wordToGuess.indexOf(randomLetter)].value = randomLetter;
    enabledInputs[wordToGuess.indexOf(randomLetter)].classList.add("hinted");
  }

  //* Check Hint Count Before Decrement
  if (hintsCount > 0) {
    hintsCount--;
    document.querySelector(".hint span").innerHTML = hintsCount;
  }
  if (hintsCount == 0) {
    //* If No Hints Available
    hintButton.classList.add("disabled");
  }
}

document.addEventListener("keydown", handleBackspace);
//* Handle backspace key event
function handleBackspace(event) {
  //* Check if backspace key is pressed
  if (event.key == "Backspace") {
    //* Get all non-disabled input elements
    let inputs = document.querySelectorAll("input:not([disabled])");
    //* Get the index of the currently active input element
    let currentIndex = Array.from(inputs).indexOf(document.activeElement);
    //* Clear the value of the current input element
    inputs[currentIndex].value = "";
  }
}

//* Start New Game
function newGame() {
  setInterval(() => {
    document.querySelector(".new-game-container").classList.remove("hidden");
  }, 3000);
}

document.querySelector(".new-game").onclick = function () {
  location.reload();
};
