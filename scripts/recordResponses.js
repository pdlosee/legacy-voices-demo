let questions = [];
let currentQuestionIndex = 0;
let recognition;
let finalTranscript = "";

// ✅ Load the generated questions
function loadQuestions() {
    const storedQuestions = localStorage.getItem('generatedQuestions');
    if (storedQuestions) {
        questions = JSON.parse(storedQuestions);
        displayCurrentQuestion();
    } else {
        alert('No questions found. Please return to the story summary page and submit your story again.');
    }
}

// ✅ Display only the current question & clear response box
function displayCurrentQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById('currentQuestion').innerText = questions[currentQuestionIndex];
        document.getElementById('responseBox').value = '';  // Clear response box for new input
        finalTranscript = "";  // Reset transcript storage
    } else {
        alert('All questions answered! Generating your story...');
        saveResponses();
        generateFinalStory();  // ✅ Send responses to backend
    }
}

// ✅ Start recording (only for the current question)
function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let tempTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                tempTranscript += event.results[i][0].transcript + " ";
            }
        }
        finalTranscript = tempTranscript.trim(); // ✅ Store only the current answer
        document.getElementById('responseBox').value = finalTranscript; // ✅ Update text box with latest input
    };

    recognition.start();
}

// ✅ Stop recording
function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}

// ✅ Store only the current response & move to next question
function nextQuestion() {
    saveCurrentResponse();
    currentQuestionIndex++;
    displayCurrentQuestion();
}

// ✅ Store the response in `localStorage`
function saveCurrentResponse() {
    let responses = JSON.parse(localStorage.getItem('responses') || '[]');
    responses[currentQuestionIndex] = finalTranscript;  // ✅ Store only the new response
    localStorage.setItem('responses', JSON.stringify(responses));
}

// ✅ Send all responses to backend after last question
function generateFinalStory() {
    let storySummary = localStorage.getItem("storySummary");

    if (!storySummary) {
        alert("Error: Story summary not found. Please return and submit your story again.");
        return;
    }

    let responses = JSON.parse(localStorage.getItem("responses") || "[]");

    if (!Array.isArray(responses) || responses.length < 5 || responses.some(r => !r.trim())) {
        alert("Error: Some responses are missing or empty. Please answer all questions.");
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
            window.location.href = "review.html";  // ✅ Redirect to final story review page
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
