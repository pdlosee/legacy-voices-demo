	console.log("🚀 Running storySummary.js - Version 3.0");
let recognition;
let finalTranscript = "";
let isManuallyStopping = false;  // ✅ Track if user wants to stop
let isRestarting = false;        // ✅ Track if auto-restart is happening

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = false;  // ✅ Chrome does not allow true continuous mode
    recognition.lang = 'en-US';

    console.log("🎤 Speech recognition started...");

    recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                console.log("✅ Finalized:", event.results[i][0].transcript);
                finalTranscript += event.results[i][0].transcript + " ";
            } else {
                console.log("✏️ Interim:", event.results[i][0].transcript);
                interimTranscript += event.results[i][0].transcript;
            }
        }

        let combinedTranscript = finalTranscript + interimTranscript;
        console.log("📝 Updating Text Field:", combinedTranscript);

        let textBox = document.getElementById("storySummaryInput");
        if (textBox) {
            textBox.value = combinedTranscript;
        } else {
            console.error("❌ ERROR: Textbox not found!");
        }
    };

    recognition.onend = () => {
        console.log("⏸️ Speech recognition stopped.");

        if (!isManuallyStopping) {
            console.log("🔄 Simulating user restart...");
            setTimeout(() => {
                console.log("🎤 Restarting speech recognition...");
                restartRecognition();  // ✅ Simulate button press
            }, 500);  // ✅ Small delay before restart
        }
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
    };

    recognition.start();
}

function stopRecording() {
    isManuallyStopping = true;  // ✅ Prevent auto-restart
    if (recognition) {
        recognition.stop();
        console.log("🛑 Speech recognition manually stopped.");
    }
}

function restartRecognition() {
    if (!isRestarting) {
        isRestarting = true;
        console.log("🚀 Simulating button press to restart recording...");

        // ✅ Simulate a user pressing the button
        document.getElementById("startRecordingBtn").click();

        setTimeout(() => { isRestarting = false; }, 1000);  // ✅ Prevent loop overload
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
            window.location.href = "recordResponses.html"; // ✅ Redirect to next step
        } else {
            alert("Error: Could not generate questions. Please try again.");
        }
    })
    .catch(error => {
        console.error("❌ Error contacting backend:", error);
        alert("Server error: Unable to generate questions.");
    });
}
