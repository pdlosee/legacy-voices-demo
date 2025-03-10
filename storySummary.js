let recognition;
let isRecognizing = false;
let accumulatedTranscript = '';

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;  // Chrome ignores true continuous mode, but we will manually restart it
    recognition.interimResults = true;  
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecognizing = true;
        console.log("🎤 Speech recognition started.");
    };

    recognition.onresult = (event) => {
        let liveTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                accumulatedTranscript += event.results[i][0].transcript + " "; // Append final results
            } else {
                liveTranscript = event.results[i][0].transcript; // Show interim words
            }
        }

        // Update text field in real-time
        document.getElementById('storyInput').value = accumulatedTranscript + liveTranscript;
    };

    recognition.onend = () => {
        console.log("⚠️ Speech recognition stopped. Restarting...");
        isRecognizing = false;

        // Restart recognition automatically
        setTimeout(() => {
            if (!isRecognizing) {
                startRecording();
            }
        }, 100);  // 100ms delay to ensure smooth restart
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech Recognition Error:", event.error);
        isRecognizing = false;
    };

    recognition.start();
}

// ✅ Auto-starts recording immediately on page load
window.onload = function () {
    console.log("🔄 Initializing speech recognition...");
    startRecording();
};

function stopRecording() {
    if (recognition) {
        recognition.stop();
        isRecognizing = false;
    }
}

function submitStorySummary() {
    const storySummary = document.getElementById("storyInput").value.trim();

    if (!storySummary) {
        alert("Please enter or record your story summary before submitting.");
        return;
    }

    console.log("Submitting Story Summary:", storySummary);
    localStorage.setItem("storySummary", storySummary);

    fetch("https://legacy-voices-backend.onrender.com/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storySummary })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Backend Response:", data);
        if (data.questions) {
            localStorage.setItem("generatedQuestions", JSON.stringify(data.questions));
            window.location.href = "recordResponses.html";  // Redirects to question-answering page
        } else {
            alert("Error: Failed to generate questions. Please try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error contacting backend:", error);
        alert("Server error: Unable to generate questions.");
    });
}
