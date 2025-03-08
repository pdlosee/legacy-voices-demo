let recognition;
let isRecording = false;
let finalTranscript = "";

function startRecording() {
    if (isRecording) {
        console.log("⚠️ Already recording, ignoring duplicate start request.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("❌ Speech recognition not supported in this browser.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;  // ✅ Keeps listening even with pauses
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
                finalTranscript += event.results[i][0].transcript + " "; // ✅ Save finalized words
            } else {
                interimTranscript += event.results[i][0].transcript; // ✅ Show live words
            }
        }

        document.getElementById('storySummary').value = finalTranscript + interimTranscript; // ✅ Update the text field
    };

    recognition.onend = () => {
        console.log("⚠️ Speech recognition ended.");
        if (isRecording) {
            console.log("🔄 Restarting speech recognition...");
            recognition.start(); // ✅ Auto-restart if recording flag is still true
        }
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech Recognition Error:", event.error);
        if (event.error === "no-speech" || event.error === "network") {
            recognition.start();  // ✅ Restart if minor error
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
