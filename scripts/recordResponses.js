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
        generateFinalStory();  // ✅ Function to send responses to backend
    }
}

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let finalTranscript = document.getElementById('responseBox').value;  // Keep existing text

        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " "; // ✅ Add finalized words
            }
        }

        document.getElementById('responseBox').value = finalTranscript; // ✅ Update only finalized text
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
    let storySummary = localStorage.getItem("storySummary");
    let responses = JSON.parse(localStorage.getItem("responses") || "[]");

    console.log("Retrieved story summary:", storySummary);
    console.log("Retrieved responses:", responses);

    // ✅ Ensure values are not null before sending
    if (!storySummary) {
        alert("Error: Story summary not found. Please return and submit your story again.");
        return;
    }
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
        console.log("Story Generation Response:", data);
        if (data.finalStory) {
            localStorage.setItem("finalStory", data.finalStory);
            window.location.href = "review.html";  // ✅ Redirect to final story page
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
