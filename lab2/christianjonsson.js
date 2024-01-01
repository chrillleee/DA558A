const theRawData = 
{
  "questions": [
    {
      "question": "What is the capital city of France?",
      "answers": ["Paris", "London", "Berlin", "Rome"],
      "correctAnswer": 0
    },
    {
      "question": "What is the largest planet in our solar system?",
      "answers": ["Jupiter", "Saturn", "Neptune", "Uranus"],
      "correctAnswer": 0
    },
    {
      "question": "Who is the author of the novel \"Harry Potter\"",
      "answers": ["J.K. Rowling", "Stephen King", "J.R.R. Tolkien", "Agatha Christie"],
      "correctAnswer": 0
    },
    {
      "question": "What is the chemical symbol for oxygen?",
      "answers": ["O", "H", "C", "N"],
      "correctAnswer": 0
    },
    {
      "question": "What is the Pythagorean theorem?",
      "answers": ["a² + b² = c²", "c² = a² - b²", "b² = a² + c²", "a² = b² - c²"],
      "correctAnswer": 0
    }
  ]
}


class Quiz 
{
  constructor()
  {
    this.data = {};
    this.currentQuestion = 0;
    this.questionAnswers = {};
  }

  setData(jsonFile)
  {
    try
    {
      this.data = jsonFile;
    }
    catch(error)
    {
      console.error("Error parsing JSON:",error)
    }
  }

  getData()
  {
    return this.data;
  }

  NextQuestion()
  {
    this.currentQuestion = Math.min(++this.currentQuestion,this.data.questions.length - 1);
  }

  PreviousQuestion()
  {
    this.currentQuestion = Math.max(--this.currentQuestion,0);
  }

  GetQuestion()
  {
    return this.data.questions[this.currentQuestion].question;
  }

  GetAnswers()
  {
    return this.data.questions[this.currentQuestion].answers;
  }

  SetSubmittetAnswers(answer)
  {
    console.log(answer);
    console.log(this.questionAnswers[this.currentQuestion]);
    this.questionAnswers[this.currentQuestion] = {answer};
  }

  GetSubmittetAnswers()
  {
    return this.questionAnswers[this.currentQuestion];
  }


}

class UserData
{
  constructor()
  {
    this.firstName = {};
    this.lastName = {};
    this.lastEmail = {};
    this.currentQuestion = 0;
  }

  setFirstName(name)
  {
    if(!this.isValidName(name))
    {
      alert('Invalid first name, please try again');
    }
    this.firstName = name;
  } 

  setLastName(name)
  {
      if(!this.isValidName(name))
      {
        alert('Invalid last name, please try again');
      }
      this.lastName = name;
  }

  isValidName(name)
  {
    var letters = /^[A-Za-z]+$/;
    if(!name.match(letters) || name.length<3)
    {
      return false;
    }
    return true;
  }

  setEmail(email)
  {
    if(!this.isValidEmail(email))
    {
      alert('Invalid Email, please try again');
    }
    this.email = email;
  } 
  
  isValidEmail(email)
  {
    var letters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email.match(letters))
    {
      return false;
    }
    return true;
  }
}

class PageHandler
{
  constructor()
  {
    this.quiz = new Quiz;
    this.userData = new UserData();
  }

  submitForm()
  {
    const nameForm = document.getElementById("nameForm");
    const quizContainer = document.getElementById("quiz-container");
    
    this.userData.setFirstName(nameForm.elements['fname'].value);
    this.userData.setLastName(nameForm.elements['lname'].value);
    this.userData.setEmail(nameForm.elements['email'].value);

    nameForm.classList.add("hide");
    quizContainer.classList.remove("hide");
    this.paintQuestion(this.quiz);
    this.paintAnswer(this.quiz);

    this.checkboxStates = {};
  }


  nextQuiz()
  {
    const nameForm = document.getElementById("nameForm");
    const quizContainer = document.getElementById("quiz-container");
    
    if(!nameForm.classList.contains("hide"))
    {
      nameForm.classList.add("hide");
      quizContainer.classList.remove("hide");
      this.paintQuestion(this.quiz)
      this.paintAnswer(this.quiz)
      return;
    }

    this.quiz.SetSubmittetAnswers(this.checkboxStates)
    this.quiz.NextQuestion()
    this.paintQuestion(this.quiz)
    this.paintAnswer(this.quiz)
    this.populateCheckboxesHistory();
  }

  prevQuiz()
  {
    const nameForm = document.getElementById("nameForm");
    const quizContainer = document.getElementById("quiz-container");
    
    if(nameForm.classList.contains("hide") && this.quiz.currentQuestion == 0)
    {
      nameForm.classList.remove("hide");
      quizContainer.classList.add("hide");
      return;
    }

    if(this.quiz.currentQuestion == 0)
    {
      return;
    }

    this.quiz.SetSubmittetAnswers(this.checkboxStates)
    this.quiz.PreviousQuestion()
    this.paintQuestion();
    this.paintAnswer();
    this.populateCheckboxesHistory();
  }

  paintQuestion()
  {
    const question = document.getElementById("question");
    const textNode = document.createTextNode(this.quiz.GetQuestion());
    question.innerHTML = "";
    question.appendChild(textNode, question);
  }

  paintAnswer()
  {
    const answer = document.getElementById("answer");
    answer.innerHTML = "";
    const textNode = document.createTextNode(this.quiz.GetAnswers());  
    this.createCheckBoxElement(answer,textNode)
  }

  createCheckBoxElement(container,labelsArray)
  {
    labelsArray.data.split(',').forEach(answerLabel => 
      {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const label = document.createElement("label");
      label.appendChild(document.createTextNode(answerLabel));

      container.appendChild(checkbox)
      container.appendChild(label)
      container.appendChild(document.createElement("br"))
    });
    this.createCheckBoxEventListerners()

  }

  createCheckBoxEventListerners()
  {
    const checkboxElements = document.querySelectorAll('input[type="checkbox"]');
    this.checkboxStates = {};

    checkboxElements.forEach((checkbox, index) => {
      checkbox.addEventListener('change', () => {
        this.checkboxStates[index] = checkbox.checked;
        console.log(this.checkboxStates)
      });
    });

  }

  populateCheckboxesHistory()
  {
    const checkboxStates = this.quiz.GetSubmittetAnswers();
    const checkboxElements = document.querySelectorAll('input[type="checkbox"]');

    if(checkboxStates == null)
    {
      return;
    }

    Object.entries(checkboxStates.answer).forEach(([key, value]) => {
      checkboxElements[key].checked = value;
    });
  }

}




const pageHandler = new PageHandler();
pageHandler.quiz.setData(theRawData);
// theQuiz.userData.setFirstName("Acs");
// console.log(pageHandler.quiz)

const startButton = document.getElementById("next-button")
const prevButton = document.getElementById("prev-button")
const submitFormButton = document.getElementById("form-button")

startButton.addEventListener('click',pageHandler.nextQuiz.bind(pageHandler))
prevButton.addEventListener('click',pageHandler.prevQuiz.bind(pageHandler))
submitFormButton.addEventListener('click',function(event)
{
  event.preventDefault();
  pageHandler.submitForm();
})

// pageHandler.paintQuestion(pageHandler.quiz)
// pageHandler.paintQuestion(pageHandler.quiz)
// pageHandler.paintAnswer(pageHandler.quiz)
// pageHandler.paintAnswer(pageHandler.quiz)