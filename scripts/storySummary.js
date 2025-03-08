let recognition;
let isRecording = false;
let finalTranscript = "";

function startRecording() {
    if (isRecording) return; // Prevent duplicate instances

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;  // ✅ Keeps recording even with pauses
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecording = true;
        console.log("🎤 Voice recording started...");
    };

    recognition.onresult = (event) => {
        let interimTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " "; // ✅ Finalized words
            } else {
                interimTranscript += event.results[i][0].transcript; // ✅ Live words
            }
        }

        document.getElementById('storySummary').value = finalTranscript + interimTranscript; // ✅ Show live + finalized text
    };

    recognition.onend = () => {
        console.log("⚠️ Speech recognition ended, restarting...");
        if (isRecording) recognition.start();  // ✅ Auto-restart when paused
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech Recognition Error:", event.error);
        if (event.error === "no-speech" || event.error === "network") {
            recognition.start();  // ✅ Restart in case of temporary errors
        }
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        isRecording = false;
        recognition.stop();
        console.log("⏹️ Voice recording stopped.");
    }
}


function submitStorySummary() {
    let storySummary = document.getElementById("storyInput").value.trim();

    if (!storySummary) {
        alert("Please enter a valid story summary.");
        return;
    }

    // ✅ Store the summary in localStorage
    localStorage.setItem("storySummary", storySummary);
    console.log("✅ DEBUG: Story summary stored:", storySummary);

    // ✅ Redirect to next step
    window.location.href = "recordResponses.html";
}
