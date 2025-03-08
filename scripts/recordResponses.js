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
        let interimTranscript = '';  

        for (let i = 0; i < event.results.length; i++) {
            interimTranscript += event.results[i][0].transcript;
        }

        // ✅ Preserve previous text instead of resetting it
        document.getElementById('responseBox').value += interimTranscript;
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
    const storySummary = localStorage.getItem("storySummary") || "";
    const responses = JSON.parse(localStorage.getItem("responses") || "[]");

    // ✅ Ensure responses are captured correctly before sending
    if (!storySummary || responses.length < 5) {
        alert("Error: Missing story summary or responses. Please try again.");
        return;
    }

    fetch('https://legacy-voices-backend.onrender.com/generate-story', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storySummary, responses })
    })
    .then(response => response.json())
    .then(data => {
        if (data.finalStory) {
            localStorage.setItem("finalStory", data.finalStory);
            window.location.href = "review.html";  // ✅ Redirects to final story page
        } else {
            alert("Error: Story could not be generated. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error contacting backend:", error);
        alert("Server error: Unable to generate the story.");
    });
}

window.onload = loadQuestions;
