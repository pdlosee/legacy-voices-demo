let recognition;
let finalTranscript = "";
let isRecording = false; // Track if recording should continue

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    isRecording = true; // Mark recording as active

    recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        document.getElementById("storySummaryInput").value = finalTranscript + interimTranscript;
    };

    recognition.onend = () => {
        console.log("⏸️ Speech recognition stopped.");

        if (isRecording) {
            console.log("🔄 Restarting speech recognition...");
            recognition.start(); // ✅ Auto-restart
        }
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
    };

    recognition.start();
    console.log("🎤 Speech recognition started...");
}

function stopRecording() {
    isRecording = false; // Mark recording as stopped
    if (recognition) {
        recognition.stop();
        console.log("🛑 Speech recognition manually stopped.");
    }
}


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
