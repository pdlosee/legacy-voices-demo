console.log("🚀 Running recordResponses.js - Version 3.2");

if (!window.questions) {
    window.questions = [];
}

if (typeof window.currentQuestionIndex === 'undefined') {
    window.currentQuestionIndex = 0;
}

if (typeof window.recognition === 'undefined') {  // ✅ Ensure only one declaration
    window.recognition = null;
}

let finalTranscript = "";

function loadQuestions() {
    const storedQuestions = localStorage.getItem("generatedQuestions");
    console.log("📌 Loaded Questions from Storage:", storedQuestions);
    
    if (storedQuestions) {
        window.questions = JSON.parse(storedQuestions);
        displayCurrentQuestion();
    } else {
        alert("No questions found. Please return to the story summary page and submit your story again.");
    }
}

function displayCurrentQuestion() {
    if (window.currentQuestionIndex < window.questions.length) {
        document.getElementById("currentQuestion").innerText = window.questions[window.currentQuestionIndex];
        document.getElementById("responseBox").value = "";
    } else {
        alert("All questions answered! Generating your story...");
        saveResponses();
        generateFinalStory();
    }
}

function startRecording() {
    if (window.recognition) {
        window.recognition.stop();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    window.recognition = new SpeechRecognition();
    window.recognition.interimResults = true;
    window.recognition.lang = "en-US";

    window.recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            } else {
                interimTranscript += event.results[i][0].transcript + " ";
            }
        }
        document.getElementById("responseBox").value = finalTranscript + interimTranscript;
    };

    window.recognition.onend = () => {
        console.log("🎙️ Speech recognition stopped. Restarting...");
        if (window.currentQuestionIndex < window.questions.length) {
            window.recognition.start();
        }
    };

    window.recognition.start();
}

function stopRecording() {
    if (window.recognition) {
        window.recognition.stop();
    }
}

function nextQuestion() {
    saveCurrentResponse();
    window.currentQuestionIndex++;
    displayCurrentQuestion();
}

function saveCurrentResponse() {
    const responses = JSON.parse(localStorage.getItem("responses") || "[]");
    responses[window.currentQuestionIndex] = document.getElementById("responseBox").value;
    localStorage.setItem("responses", JSON.stringify(responses));
}

function saveResponses() {
    console.log("✅ All responses saved:", localStorage.getItem("responses"));
}

function generateFinalStory() {
    let storySummary = localStorage.getItem("storySummary");
    let responses = JSON.parse(localStorage.getItem("responses") || "[]");

    if (!storySummary) {
        alert("Error: Story summary not found. Please return and submit your story again.");
        return;
    }

    if (!Array.isArray(responses) || responses.length < 5 || responses.some(r => !r.trim())) {
        alert("Error: Some responses are missing or empty. Please answer all questions.");
        return;
    }

    fetch("https://legacy-voices-backend.onrender.com/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storySummary, responses })
    })
    .then(response => response.json())
    .then(data => {
        console.log("📌 Story Generation Response:", data);
        if (data.finalStory) {
            localStorage.setItem("finalStory", data.finalStory);
            window.location.href = "review.html";
        } else {
            alert("Error: Story could not be generated. Please try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error contacting backend:", error);
        alert("Server error: Unable to generate the story.");
    });
}

window.onload = loadQuestions;
