let recognition;
let isRecognizing = false;
let accumulatedTranscript = ''; // ✅ Stores all transcriptions across restarts

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;  // 🚨 Chrome does not allow true continuous mode
    recognition.interimResults = true;  // ✅ Enables real-time text display
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecognizing = true;
        console.log("🎤 Speech recognition started.");
    };

    recognition.onresult = (event) => {
        let liveTranscript = '';  // ✅ Holds only current session's text

        for (let i = event.resultIndex; i < event.results.length; i++) {
            liveTranscript += event.results[i][0].transcript + " ";
        }

        // ✅ Display live updates while speaking
        document.getElementById('storyInput').value = accumulatedTranscript + liveTranscript;
    };

    recognition.onend = () => {
        isRecognizing = false;
        console.log("⚠️ Speech recognition stopped. Restarting immediately...");

        // ✅ Preserve final text and accumulate it
        accumulatedTranscript = document.getElementById('storyInput').value;

        // ✅ Automatically restart recognition with a short delay
        setTimeout(() => {
            if (!isRecognizing) {
                startRecording();
            }
        }, 100);  // **100ms delay to prevent infinite recursion**
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech Recognition Error:", event.error);
        isRecognizing = false;
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
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
            window.location.href = "recordResponses.html";  // ✅ Redirects to question-answering page
        } else {
            alert("Error: Failed to generate questions. Please try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error contacting backend:", error);
        alert("Server error: Unable to generate questions.");
    });
}
