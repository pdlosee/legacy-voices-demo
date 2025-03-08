
let questions = [];
let currentQuestionIndex = 0;
let recognition;
let currentTranscript = '';

function loadQuestions() {
    const storedQuestions = localStorage.getItem('generatedQuestions');
    if (storedQuestions) {
        questions = JSON.parse(storedQuestions);
        displayCurrentQuestion();
    } else {
        alert('No questions found. Please return to the story summary page and submit your story again.');
    }
}

function displayCurrentQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById('currentQuestion').innerText = questions[currentQuestionIndex];
        document.getElementById('responseBox').value = '';  // Clear previous response
    } else {
        alert('All questions answered! Returning to main page.');
        saveResponses();
        window.location.href = 'index.html';  // Adjust if your actual return page is different
    }
}

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        currentTranscript = '';  // Reset for fresh capture
        for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
        }
        document.getElementById('responseBox').value = currentTranscript;  // Live update
    };

    recognition.onend = () => {
        console.log('Recording stopped.');
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}

function nextQuestion() {
    saveCurrentResponse();
    currentQuestionIndex++;
    displayCurrentQuestion();
}

function saveCurrentResponse() {
    const responses = JSON.parse(localStorage.getItem('responses') || '[]');
    responses[currentQuestionIndex] = document.getElementById('responseBox').value;
    localStorage.setItem('responses', JSON.stringify(responses));
}

function saveResponses() {
    console.log('All responses saved:', localStorage.getItem('responses'));
}

window.onload = loadQuestions;
