const theRawData = 
{
  "questions": [
    {
      "question": "What is the capital city of France?",
      "type": "radiobutton",
      "answers": ["Paris", "London", "Berlin", "Rome"],
      "correctAnswer": 0,
      "mandatory": true
    },
    {
      "question": "Which of these countries are in Europe?",
      "type": "checkbox",
      "answers": ["France", "Japan", "Germany", "Australia"],
      "correctAnswer": [0, 2],
      "mandatory": false
    },
    {
      "question": "What is the capital city of Italy?",
      "type": "openentry",
      "correctAnswer": "Rome",
      "mandatory": true
    },
    {
      "question": "What is the largest planet in our solar system?",
      "type": "radiobutton",
      "answers": ["Jupiter", "Saturn", "Neptune", "Uranus"],
      "correctAnswer": 0,
      "mandatory": true
    },
    {
      "question": "Who wrote the novel '1984'?",
      "type": "openentry",
      "correctAnswer": "George Orwell",
      "mandatory": true
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
    // console.log("------------------")
    // console.log(this.currentQuestion)
    // console.log(answer);
    // console.log(answer.data)
    // console.log(this.questionAnswers[this.currentQuestion]);
    this.questionAnswers[this.currentQuestion] = answer;
    // console.log(this.questionAnswers)
  }

  GetSubmittetAnswers()
  {
    return this.questionAnswers[this.currentQuestion];
  }

  GetQuestionType()
  {
    console.log(this.data.questions[this.currentQuestion].type);
    return this.data.questions[this.currentQuestion].type;
  }

  IsMandatoryQuestion()
  {
    return this.data.mandatory[this.currentQuestion];
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
    this.paintAndPopulate();
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

    if(this.quiz.GetQuestionType() === "radiobutton")
    {
      this.quiz.SetSubmittetAnswers(this.checkboxStates)
    }
    
    if(this.quiz.GetQuestionType() === "checkbox")
    {
      this.quiz.SetSubmittetAnswers(this.checkboxStates)
    }
    
    if(this.quiz.GetQuestionType() === "openentry")
    {
      this.extractTextEntry();
    }

    this.quiz.NextQuestion();
    this.paintAndPopulate();
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

    if(this.quiz.GetQuestionType() === "radiobutton")
    {
      this.quiz.SetSubmittetAnswers(this.checkboxStates);
    }
    
    if(this.quiz.GetQuestionType() === "checkbox")
    {
      this.quiz.SetSubmittetAnswers(this.checkboxStates);
    }
    
    if(this.quiz.GetQuestionType() === "openentry"){
      this.extractTextEntry();
    }
    
    this.quiz.PreviousQuestion()
    this.paintAndPopulate();
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
    
    if(this.quiz.GetQuestionType() === "radiobutton")
    {
      this.createRadioButtonElement(answer,textNode);
      return;
    }
    
    if(this.quiz.GetQuestionType() === "checkbox")
    {
      this.createCheckBoxElement(answer,textNode)
      return;
    }
    
    if(this.quiz.GetQuestionType() === "openentry"){
      this.createTextEntryElement(answer);
      return;
    }
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
      this.checkboxStates = {};
      return;
    }

    this.checkboxStates = checkboxStates;
    
    Object.entries(checkboxStates).forEach(([key, value]) => {
      checkboxElements[key].checked = value;
    });
  }


  createRadioButtonElement(container,labelsArray)
  {
    labelsArray.data.split(',').forEach(answerLabel => 
      {
      const radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = "radioGroup"; 

      const label = document.createElement("label");
      label.appendChild(document.createTextNode(answerLabel));

      container.appendChild(radioButton)
      container.appendChild(label)
      container.appendChild(document.createElement("br"))
    });
    this.createRadioButtonEventListeners()
  }

  createRadioButtonEventListeners() {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    this.checkboxStates = {};
  
    radioButtons.forEach((radioButton, index) => {
      radioButton.addEventListener('change', () => {
        this.checkboxStates = {};
        this.checkboxStates[index] = radioButton.checked;
        console.log(this.checkboxStates);
      });
    });
  }

  populateRadioBoxesHistory()
  {
    const checkboxStates = this.quiz.GetSubmittetAnswers();
    const checkboxElements = document.querySelectorAll('input[type="radio"]');

    if(checkboxStates == null)
    {
      this.checkboxStates = {};
      return;
    }

    this.checkboxStates = checkboxStates;
    
    Object.entries(checkboxStates).forEach(([key, value]) => {
      checkboxElements[key].checked = value;
    });
  }

  createTextEntryElement(container) {
    console.log("DEBUG1");
    const TextEntry = document.createElement("input");
    TextEntry.setAttribute("id", "TextEntryElement");
    TextEntry.type = "text";
    container.appendChild(TextEntry);
  }
  
  extractTextEntry() {
    const TextEntry = document.getElementById("TextEntryElement")
    if(TextEntry !== null)
    {
      console.log(TextEntry.value)
      this.quiz.SetSubmittetAnswers(TextEntry.value);
    }
  }

  populateTextEntryHistory()
  {
    const TextEntry = document.getElementById("TextEntryElement")

    if(TextEntry == null)
    {
      return;
    }

    var text = this.quiz.GetSubmittetAnswers();
    console.log(text);
    console.log(typeof(text));
    text = (text === undefined) ? (""):(text);
    
    TextEntry.value = text;
  }

  paintAndPopulate()
  {
    this.paintQuestion();
    this.paintAnswer();

    if(this.quiz.GetQuestionType() === "radiobutton")
    {
      this.populateRadioBoxesHistory();
      return;
    }
    
    if(this.quiz.GetQuestionType() === "checkbox")
    {
      this.populateCheckboxesHistory();
      return;
    }
    
    if(this.quiz.GetQuestionType() === "openentry"){
      this.populateTextEntryHistory();
      return;
    }

  }
}

const pageHandler = new PageHandler();
pageHandler.quiz.setData(theRawData);

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