let recognition;
let finalTranscript = "";
let isRecording = false; // Track if recording should continue

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;  // ✅ Enable real-time transcription
    recognition.lang = 'en-US';

    isRecording = true; // Mark recording as active

    recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";  // ✅ Save final words permanently
            } else {
                interimTranscript += event.results[i][0].transcript;  // ✅ Show interim results in real-time
            }
        }

        // ✅ Update text field immediately with both final and live words
        document.getElementById("storySummaryInput").value = finalTranscript + interimTranscript;
    };

    recognition.onend = () => {
        console.log("⏸️ Speech recognition stopped.");

        if (isRecording) {
            console.log("🔄 Restarting speech recognition...");
            setTimeout(() => recognition.start(), 500); // ✅ Auto-restart after 500ms
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

function submitStorySummary() {
    let storySummary = document.getElementById("storySummaryInput").value.trim();

    if (!storySummary) {
        alert("Please enter or record a story summary before submitting.");
        return;
    }

    console.log("📨 Sending story summary:", storySummary);

    fetch("https://legacy-voices-backend.onrender.com/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storySummary })
    })
    .then(response => response.json())
    .then(data => {
        if (data.questions && data.questions.length === 5) {
            localStorage.setItem("storySummary", storySummary);
            localStorage.setItem("generatedQuestions", JSON.stringify(data.questions));
            console.log("✅ Questions received:", data.questions);
            window.location.href = "recordResponses.html"; // Redirect to question responses
        } else {
            alert("Error: Could not generate questions. Please try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error contacting backend:", error);
        alert("Server error: Unable to generate questions.");
    });
}
