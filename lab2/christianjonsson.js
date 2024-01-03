const theRawData = 
{
  "questions": [
    {
      "question": "What is the capital city of France?",
      "type": "radiobutton",
      "answers": ["Paris", "London", "Berlin", "Rome"],
      "correctAnswer": 0,
      "mandatory": true
      // "mandatory": false
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
      // "mandatory": false
    },
    {
      "question": "What is the largest planet in our solar system?",
      "type": "radiobutton",
      "answers": ["Jupiter", "Saturn", "Neptune", "Uranus"],
      "correctAnswer": 0,
      "mandatory": true
      // "mandatory": false
    },
    {
      "question": "Who wrote the novel '1984'?",
      "type": "openentry",
      // "correctAnswer": "George Orwell",
      "correctAnswer" : "A", 
      "mandatory": true
      // "mandatory": false
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
    this.questionAnswers[this.currentQuestion] = answer;
  }

  GetSubmittetAnswers()
  {
    return this.questionAnswers[this.currentQuestion];
  }

  GetQuestionType()
  {
    return this.data.questions[this.currentQuestion].type;
  }

  IsMandatoryQuestion()
  {
    return this.data.mandatory[this.currentQuestion];
  }

  IsLastQuestion()
  {
    return this.currentQuestion === this.data.questions.length - 1;
  }

  CheckMandetoryQuestions()
  {
    var warning = "";
    var answer = {};
    var question = {};
    console.log(this.questionAnswers)
    for (var it = 0; it<this.data.questions.length; it++) 
    {
      answer = this.questionAnswers[it];
      question = this.data.questions[it];
      if(question.mandatory)
      { 
        if(answer === null || answer === undefined || Object.keys(answer).length === 0)
        {
          warning += " Please answer question " + (it + 1) + "\n";
        }
      }
    }
    
    if(warning==="")
    {
      return true;
    }

    alert(warning);
    return false;
  }

  CheckCorrectAnswers()
  {
    var sumCorrectAnswers = 0;
    var answer = {};
    var correctA = {};
    for (var it = 0; it<this.data.questions.length; it++) 
    {

      answer = this.questionAnswers[it];
      correctA = this.data.questions[it].correctAnswer;
      this.currentQuestion = it;

      if(this.GetQuestionType() === "radiobutton")
      {
        console.log("radiobutton")
        if(Object.keys(answer)[0] == correctA)
        {
          sumCorrectAnswers++;
          continue;
        }
        continue;
      }
      
      if(this.GetQuestionType() === "checkbox")
      {
        console.log("checkbox")
        
        if(Object.keys(answer).length!=correctA.length)
        {
          continue;
        }

        var allCorrect = true;
        var i = 0;
        Object.keys(answer).forEach((ans)=>
        {
          if(ans != correctA[i])
          {
            allCorrect = false;
          } 
          i++;  
        })

        console.log(allCorrect);
        
        if(allCorrect)
        {
          sumCorrectAnswers++;
        }
        continue;
      }
      
      if(this.GetQuestionType() === "openentry"){
        console.log("openentry")
        if(answer == correctA)
        {
          sumCorrectAnswers++;
        }
        continue;
      }
    }
  return sumCorrectAnswers;  
}

}

class UserData
{
  constructor()
  {
    this.firstName = {};
    this.lastName = {};
    this.email = {};
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

  AllEntriesValid()
  {
    return this.isValidEmail(this.email) && this.isValidName(this.firstName) && this.isValidName(this.lastName);
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

    if(!this.userData.AllEntriesValid())
    {
      return;
    }

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

    this.SaveAnswers();

    this.quiz.NextQuestion();

    if(this.quiz.IsLastQuestion())
    {
      const nextButton = document.getElementById("next-button");
      const finishButton = document.getElementById("finish-button");
      nextButton.classList.add("hide");
      finishButton.classList.remove("hide");
    }

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

    this.SaveAnswers();
    
    if(this.quiz.IsLastQuestion())
    {
      const nextButton = document.getElementById("next-button");
      const finishButton = document.getElementById("finish-button");
      nextButton.classList.remove("hide");
      finishButton.classList.add("hide");
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
    const TextEntry = document.createElement("input");
    TextEntry.setAttribute("id", "TextEntryElement");
    TextEntry.type = "text";
    container.appendChild(TextEntry);
  }
  
  extractTextEntry() {
    const TextEntry = document.getElementById("TextEntryElement")
    if(TextEntry !== null)
    {
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
    text = (text === undefined) ? (""):(text);
    TextEntry.value = text;
  }

  paintAndPopulate()
  {
    this.paintQuestion();
    this.paintAnswer();
    this.PaintMandetoryQuestions();

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
  
  PaintMandetoryQuestions()
  {
    const mandetory = document.getElementById("mandetory");
    if(this.quiz.data.questions[this.quiz.currentQuestion].mandatory)
    {
      mandetory.classList.remove("hide");
      return;
    }
    mandetory.classList.add("hide");
  }

  SaveAnswers()
  {
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
  }

  finishQuiz()
  {
    console.log("Finish");
    const prevButton = document.getElementById("prev-button");
    const finishButton = document.getElementById("finish-button");
    const quizContainer = document.getElementById("quiz-container");
    const summaryContainer = document.getElementById("Summary-container");
    const summary = document.getElementById("summary");
    const results = document.getElementById("results");
    

    this.SaveAnswers();
    if(!this.quiz.CheckMandetoryQuestions())
    {
      return;
    }

    prevButton.classList.add("hide");
    finishButton.classList.add("hide");
    quizContainer.classList.add("hide");
    summaryContainer.classList.remove("hide");
    

    const resultsTextNode = document.createTextNode("You had the following result: " + this.quiz.CheckCorrectAnswers() + "/" + this.quiz.data.questions.length);
    results.innerHTML = "";
    results.appendChild(resultsTextNode, question);
    
    // CheckRightAnswers
    // Present sum of all correct answers
    // PResent 
    // Success
  }
}

const pageHandler = new PageHandler();
pageHandler.quiz.setData(theRawData);

const startButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const finishButton = document.getElementById("finish-button");
const submitFormButton = document.getElementById("form-button");

startButton.addEventListener('click',pageHandler.nextQuiz.bind(pageHandler));
prevButton.addEventListener('click',pageHandler.prevQuiz.bind(pageHandler));
finishButton.addEventListener('click',pageHandler.finishQuiz.bind(pageHandler));
submitFormButton.addEventListener('click',function(event)
{
  event.preventDefault();
  pageHandler.submitForm();
})
