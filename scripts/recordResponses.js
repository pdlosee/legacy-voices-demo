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
        alert('All questions answered! Generating your story...');
        saveResponses();
        generateFinalStory();  // ✅ New function to send responses to backend
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
        console.log("Speech recognition stopped. Restarting...");
        if (currentQuestionIndex < questions.length) {
            recognition.start();  // ✅ Auto-restart if more questions remain
        }
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

// ✅ NEW FUNCTION: Sends responses to backend and generates the final story
function generateFinalStory() {
    const storySummary = localStorage.getItem("storySummary");
    const responses = JSON.parse(localStorage.getItem("responses") || "[]");

    fetch('https://legacy-voices-backend.onrender.com/generate-story', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storySummary, responses })
    })
    .then(response => response.json())
    .then(data => {
        if (data.finalStory) {
            localStorage.setItem("finalStory", data.finalStory);
            window.location.href = "review.html";  // ✅ Redirects to the final story page
        } else {
            alert("Error: Story could not be generated.");
        }
    })
    .catch(error => console.error("Error contacting backend:", error));
}

window.onload = loadQuestions;
