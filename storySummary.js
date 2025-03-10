console.log("🚀 Running storySummary.js - Version 3.1");

let recognition;
let finalTranscript = "";
let isManuallyStopping = false; 
let isRestarting = false;

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            } else {
                interimTranscript += event.results[i][0].transcript + " ";
            }
        }
        document.getElementById("storyInput").value = finalTranscript + interimTranscript;
    };

    recognition.onend = () => {
        if (!isManuallyStopping) {
            console.log("🎙️ Speech recognition stopped. Restarting...");
            recognition.start();
        }
    };

    recognition.start();
}

function stopRecording() {
    isManuallyStopping = true;
    if (recognition) {
        recognition.stop();
    }
}

function submitStorySummary() {
    let storySummary = document.getElementById("storyInput").value.trim();
    if (!storySummary) {
        alert("Please enter or record your story summary.");
        return;
    }

    localStorage.setItem("storySummary", storySummary);
    console.log("🚀 Sending Story Summary to Backend:", storySummary);

    fetch("https://legacy-voices-backend.onrender.com/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storySummary })
    })
    .then(response => response.json())
    .then(data => {
        console.log("📌 Backend Response:", data);
        if (data.questions) {
            localStorage.setItem("generatedQuestions", JSON.stringify(data.questions));
            window.location.href = "recordResponses.html";
        } else {
            alert("Error: No questions received from backend. Please try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error contacting backend:", error);
        alert("Server error: Unable to generate questions.");
    });
}
