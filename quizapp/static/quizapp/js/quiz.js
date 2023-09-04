console.log("hi");
const url = window.location.href;
const quizbox = document.getElementById("quiz-box");
const scorebox = document.getElementById("score-box");
const resultbox = document.getElementById("result-box");
const timerbox = document.getElementById("timer-box");
const submitButton = document.getElementById("submit"); // Submit button element
let data;
let formSubmitted = false;
let timerInterval;
let currentIndex = 0;
let selectedAnswers = {}; // Store user's selected answers for each question

let activateTimer = (time) => {
  if (time.toString().length < 2) {
    timerbox.innerHTML = `<b>0${time}:00</b>`;
  } else {
    timerbox.innerHTML = `<b>${time}:00</b>`;
  }

  let minutes = time - 1;
  let seconds = 60;
  let displayseconds;
  let displayminutes;

  timerInterval = setInterval(() => {
    if (formSubmitted) {
      clearInterval(timerInterval);
      return;
    }

    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }

    if (minutes.toString().length < 2) {
      displayminutes = "0" + minutes;
    } else {
      displayminutes = minutes;
    }

    if (seconds.toString().length < 2) {
      displayseconds = "0" + seconds;
    } else {
      displayseconds = seconds;
    }

    if (minutes === 0 && seconds === 0) {
      clearInterval(timerInterval);
      alert("The Time is Over  ...  :( ");
      sendData();
      btnbox.style.display = "none";
    }
    timerbox.innerHTML = `<b>${displayminutes}:${displayseconds}</b>`;
  }, 1000);
};

function displayQuestion(index) {
  quizbox.innerHTML = "";
  const element = data[index];

  for (const [question, answers] of Object.entries(element)) {
    quizbox.innerHTML += `
            
            <div class="mb-2">
                <h3 class ="p-2"  >${question}</h3>
            </div>
        `;
    answers.forEach((answer) => {
      const isChecked = selectedAnswers[question] === answer ? "checked" : "";
      quizbox.innerHTML += `
                <div class="mb-2 p-2" style = "background: rgb(216, 216, 216);" onMouseOver="this.style.background='silver'"
                onMouseOut="this.style.background='rgb(216, 216, 216)'">
                    <input type="radio" style="width:20px; height:20px;" class="ans" id="${question}-${answer}" name="${question}" value="${answer}" ${isChecked}>
                    <label for="${question}" style="font-size:25px;" >${answer}</label>
                </div>
            `;
    });
  }

  // Disable/Enable Previous and Next buttons based on current index
  const previousButton = document.getElementById("previousButton");
  const nextButton = document.getElementById("nextButton");

  if (index === 0) {
    previousButton.disabled = true;
  } else {
    previousButton.disabled = false;
  }

  if (index === data.length - 1) {
    nextButton.disabled = true;
    submitButton.classList.remove("hidden"); // Show Submit button on last question
  } else {
    nextButton.disabled = false;
    submitButton.classList.add("hidden"); // Hide Submit button on other questions
  }
}

$.ajax({
  type: "GET",
  url: `${url}data`,
  success: function (response) {
    data = response.data;
    activateTimer(response.time);
    displayQuestion(currentIndex);
  },
  error: function (error) {
    console.log(error);
  },
});

function saveAnswer() {
  const currentQuestion = Object.keys(data[currentIndex])[0];
  const selectedRadio = document.querySelector(
    `input[name="${currentQuestion}"]:checked`
  );
  if (selectedRadio) {
    selectedAnswers[currentQuestion] = selectedRadio.value;
  } else {
    selectedAnswers[currentQuestion] = null; // Save null if no answer is selected
  }
}

const nextButton = document.getElementById("nextButton");
nextButton.addEventListener("click", function () {
  saveAnswer();
  currentIndex++;
  if (currentIndex >= data.length) {
    currentIndex = data.length - 1; // Ensure not to go beyond the last question
  }
  displayQuestion(currentIndex);
});

const previousButton = document.getElementById("previousButton");
previousButton.addEventListener("click", function () {
  saveAnswer();
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = 0; // Ensure not to go below the first question
  }
  displayQuestion(currentIndex);
});

const quizform = document.getElementById("quiz-form");
const csrf = document.getElementsByName("csrfmiddlewaretoken");

const sendData = () => {
  saveAnswer(); // Save the selected answer before sending data
  const dataToSend = {};
  dataToSend["csrfmiddlewaretoken"] = csrf[0].value;

  // Merge selectedAnswers into dataToSend
  Object.assign(dataToSend, selectedAnswers);

  $.ajax({
    type: "POST",
    url: `${url}save/`,
    data: dataToSend,
    success: function (response) {
      const result = response.results;
      quizform.classList.add("not-visible");

      scorebox.innerHTML = `${
        response.passed ? "Congratulations" : "  Oops... :( "
      } Your result is ${response.score.toFixed(2)}%`;

      result.forEach((res) => {
        const resdiv = document.createElement("div");
        for (const [question, resp] of Object.entries(res)) {
          resdiv.innerHTML += question;
          const cls = ["container", "p-2", "text-light", "h6"];
          resdiv.classList.add(...cls);

          if (resp == "not answered") {
            resdiv.innerHTML += " -- not answered";
            resdiv.classList.add("bg-danger");
          } else {
            const answer = resp["answered"];
            const correct = resp["correct_ans"];
            if (answer == correct) {
              resdiv.classList.add("bg-success");
              resdiv.innerHTML += `answered : ${answer}`;
            } else {
              resdiv.classList.add("bg-danger");
              resdiv.innerHTML += ` | correct answer: ${correct}`;
              resdiv.innerHTML += ` | you answered: ${answer}`;
            }
          }
        }
        resultbox.appendChild(resdiv);
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
};
let btnbox = document.getElementById("btnbox");
quizform.addEventListener("submit", (e) => {
  e.preventDefault();
  formSubmitted = true;
  btnbox.style.display = "none";
  sendData();
});
