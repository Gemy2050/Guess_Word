let input = document.querySelector(".typing"),
    inputsContainer = document.querySelector(".inputs"),
    description = document.querySelector(".info .desc"),
    triesCount = document.querySelector(".tries .count"),
    button = document.querySelector(".container button");

  let audio;

// all words
const words = [
  {
    word: "react",
    desc: "JavaScript library",
  },
  {
    word: "vue",
    desc: "JavaScript Framework",
  },
  {
    word: "angular",
    desc: "JavaScript MVW Framework",
  },
  {
    word: "nodejs",
    desc: "JavaScript runtime environment",
  },
  {
    word: "php",
    desc: "general-purpose scripting language",
  },
  {
    word: "ruby",
    desc: "open source programming language",
  },
  {
    word: "python",
    desc: "Programming language used in machine learning",
  },
  {
    word: "tailwind",
    desc: "A utility-first CSS framework",
  },
  {
    word: "bootstrap",
    desc: "world's most famous free CSS framework",
  },
]

// Handle Click Button
button.onclick = () => {
  getWord();
  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  document.querySelector(".winner").classList.add("hidden");
  button.style.display="none"
}

// Handle Typing Event
document.addEventListener("keydown", (e) => {
  if(e.keyCode >= 65 && e.keyCode <= 90) {

    if(e.key == wordObj.word[index]) {
      document.querySelectorAll(".inputs input")[index].value = e.key;
      if(index == wordObj.word.length - 1) {
        document.querySelector("audio.win").play();
        document.querySelector(".winner").classList.remove("hidden")
        button.style.display="block"
      }
      index++;
    } else {
      if(tries > 0) {
        tries--;
        triesCount.innerHTML = tries;
      }
      if(triesCount.innerHTML == 0) {
        document.querySelectorAll(".inputs input").forEach((input) => {
          input.value = input.dataset.char
          document.querySelector("audio.loss").play()
          button.style.display="block"
        });
      }
    }
  }
})


let index, wordObj, tries;
// Get Random Word
function getWord() {
  tries = 10;
  index = 0;
  wordObj = words[Math.trunc(Math.random() * words.length)];
  description.innerHTML = wordObj.desc;
  triesCount.innerHTML = tries;

  wordObj.word.split("").forEach((char) => {
    inputsContainer.innerHTML += `<input type='text' maxlength='1' disabled data-char='${char}'/>`;
})
}
getWord();