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
    this.userData = new UserData();
  }

  setData(jsonFile)
  {
    try
    {
      this.data = jsonFile;
      console.log("Reading JSON successful")
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
}

class UserData
{
  constructor()
  {
    this.firstName = {};
    this.lastName = {};
    this.lastEmail = {};
  }

  setFirstName(name)
  {
    if(!this.isValidName(name))
    {
      alert('Invalid name, please try again');
    }
    this.firstName = name;
    console.log("Name successful")

  } 

  setLastName(name)
  {
      if(!this.isValidName(name))
      {
        alert('Invalid name, please try again');
      }
      this.lastName = name;
  }

  setEmail()
  {
    
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
}

function nextQuiz()
{
  const nameForm = document.getElementById("nameForm");
  nameForm.classList.add("hide")
  console.log("started ")
}

function prevQuiz()
{
  const nameForm = document.getElementById("nameForm");
  nameForm.classList.remove("hide")
  console.log("Hello there, the game is started ")
}

function submitForm()
{
  const nameForm = document.getElementById("nameForm");
  const quizContainer = document.getElementById("quiz-container")
  nameForm.classList.add("hide")
  quizContainer.classList.remove("hide")
  console.log("Hello there, the game is started ")
}

const theQuiz = new Quiz();
theQuiz.setData(theRawData);
theQuiz.userData.setFirstName("Acs");
console.log(theQuiz)

const startButton = document.getElementById("next-button")
const prevButton = document.getElementById("prev-button")
const submitFormButton = document.getElementById("form-button")

startButton.addEventListener('click',nextQuiz)
prevButton.addEventListener('click',prevQuiz)
submitFormButton.addEventListener('click',function(event)
{
  event.preventDefault();
  submitForm();
  console.log("here")
})